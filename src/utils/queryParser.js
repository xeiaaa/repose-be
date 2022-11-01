const { MongooseQueryParser } = require('mongoose-query-parser');
const pick = require('./pick');

const parser = new MongooseQueryParser({
  blacklist: ['page'],
});
const predefined = {};

const queryParser = (query) => {
  let parsed = parser.parse(query, predefined);
  const other = pick(query, ['page', 'sort']);
  parsed = { ...parsed, ...other };
  const { filter } = parsed;

  const optionKeys = ['select', 'populate', 'sort', 'limit', 'page'];
  const options = {};
  optionKeys.forEach((key) => {
    if (parsed[key]) {
      options[key] = parsed[key];
    }
  });

  if (options.page && parseInt(options.page, 10)) {
    options.page = parseInt(options.page, 10);
  }

  if (options.sort) {
    options.sort = options.sort.replace(/,/g, ' ');
  }

  if (options.populate) {
    options.populate = options.populate.map(({ path }) => path).join(',');
  }

  return {
    filter,
    options,
  };
};

module.exports = queryParser;
