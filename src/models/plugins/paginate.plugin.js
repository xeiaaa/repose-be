/* eslint-disable no-param-reassign */

const DEFAULT_PAGINATION_LIMIT = 10;
const DEFAULT_PAGINATION_PAGE = 1;
const DEFAULT_PAGINATION_SORT = 'createdAt';

const paginate = (schema) => {
  /**
   * @typedef {Object} QueryResult
   * @property {Document[]} results - Results found
   * @property {number} page - Current page
   * @property {number} limit - Maximum number of results per page
   * @property {number} totalPages - Total number of pages
   * @property {number} totalResults - Total number of documents
   */
  /**
   * Query for documents with pagination
   * @param {Object} [filter] - Mongo filter
   * @param {Object} [options] - Query options
   * @param {string} [options.sort] - Mongo Sort
   * @param {string} [options.populate] - Populate data fields. Hierarchy of fields should be separated by (.). Multiple populating criteria should be separated by commas (,)
   * @param {number} [options.limit] - Maximum number of results per page (default = 10)
   * @param {number} [options.page] - Current page (default = 1)
   * @param {string} [options.select] - Select fields to be returned
   * @returns {Promise<QueryResult>}
   */
  schema.statics.paginate = async function (filter, options) {
    const sort = options.sort || DEFAULT_PAGINATION_SORT;

    const limit = options.limit && parseInt(options.limit, 10) > 0 ? parseInt(options.limit, 10) : DEFAULT_PAGINATION_LIMIT;
    const page = options.page && parseInt(options.page, 10) > 0 ? parseInt(options.page, 10) : DEFAULT_PAGINATION_PAGE;
    const skip = (page - 1) * limit;

    const countPromise = this.countDocuments(filter).exec();
    let docsPromise = this.find(filter).sort(sort).skip(skip).limit(limit).select(options.select);

    // TODO: Match options.populate to use Mongoose Query Parser
    if (options.populate) {
      options.populate.split(',').forEach((populateOption) => {
        docsPromise = docsPromise.populate(
          populateOption
            .split('.')
            .reverse()
            .reduce((a, b) => ({ path: b, populate: a }))
        );
      });
    }

    docsPromise = docsPromise.exec();

    return Promise.all([countPromise, docsPromise]).then((values) => {
      const [totalResults, results] = values;
      const totalPages = Math.ceil(totalResults / limit);
      const result = {
        results,
        page,
        limit,
        totalPages,
        totalResults,
      };
      return Promise.resolve(result);
    });
  };
};

module.exports = paginate;
module.exports.DEFAULT_PAGINATION_LIMIT = DEFAULT_PAGINATION_LIMIT;
module.exports.DEFAULT_PAGINATION_SORT = DEFAULT_PAGINATION_SORT;
module.exports.DEFAULT_PAGINATION_PAGE = DEFAULT_PAGINATION_PAGE;
