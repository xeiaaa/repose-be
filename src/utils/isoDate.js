const moment = require('moment');

const isoDate = (dateString) => moment(dateString, 'MM-DD-YYYY').toDate().toISOString();

module.exports = isoDate;
