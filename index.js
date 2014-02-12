var DAY_M = 86400000;
var MIN_M = 60000;

//
// Module exports
//

exports.day = day;
exports.week = week;
exports.month = month;
exports.range = range;
exports.parse = parse;
exports.parseISODate = parseISODate;
exports.dateKeys = ['date', 'startTime', 'endTime', 'time', 'firstDate', 'lastUpdate'];

/**
 * Format date to YYYY-MM-DD format
 *
 * Used to get single days for Moves
 * 
 * @param  {Date} date
 * @return {String} `date` formatted as YYYY-MM-DD string
 */
function day(date) {
  return format(date, true);
}

/**
 * Format a date to ISO8601 Week
 *
 * Original code taken from http://stackoverflow.com/a/6117889
 * 
 * @param  {Date} date Date to format to
 * @return {String} `date` formatted to YYYY-Www string
 */
function week(date) {
  var d = new Date(+date);
  var year, week;

  d.setHours(0, 0, 0);
  d.setDate(d.getDate() + 4 - (d.getDay()||7));

  year = new Date(d.getFullYear(), 0, 1);
  week = Math.ceil((((d - year) / DAY_M) + 1) / 7);
  return d.getFullYear() + '-W' + zeroFill(week);
}

/**
 * Format date to YYYY-MM string
 * 
 * @param  {Date} date The date which to extract the month
 * @return {String} `date` formatted as YYYY-MM string
 */
function month(date) {
  return format(date, false);
}

/**
 * Create a from/to range which can be used with querystring/as
 * parameters.
 * 
 * @param {Date} from
 * @param {Date} to
 * @return {Object}
 */
function range(from, to) {
  return {
    from: format(from, true),
    to: format(to, true)
  };
}

/**
 * Parse the result returned from the API.
 *
 * The API returns dates in the ISO8601 basic format which JavaScript
 * is not very happy about. This function walks the returned object
 * and initilises the date stings to valid JavaScript Date objects.
 * *
 * @param data {Object} JSON data returned from the API.
 * @return {Object} The data passed in the param, but with the dates as
 *                  JavaScript Date instances.
 */
function parse(data) {
  if (Array.isArray(data)) {
    for (var i=0; i<data.length; i++) {
      data[i] = parse(data[i]);
    }
  } else {
    for (var key in data) {
      if (Array.isArray(data[key]) || typeof data[key] == 'object')
        data[key] = parse(data[key]);

      if (exports.dateKeys.indexOf(key) > -1)
        data[key] = parseISODate(data[key]);
    }
  }

  return data;
};

/**
 * Parse YYYYMMDDTHHMMSSZ strings
 *
 * Takes strings formatted in YYYYMMDDTHHMMSSZ (ISO8601 basic) and creates
 * valid Date instances.
 * 
 * @param {String} str Date to be converted
 * @return {Date} Date instance
 */
function parseISODate(str) {
  var date = '';

  if (str instanceof Date) return str;

  date += str.substr(0, 4) + '-';
  date += str.substr(4, 2) + '-';
  date += str.substr(6, 2);

  if (str.indexOf('T') > -1) {
    date += 'T' + str.substr(9, 2) + ':';
    date += str.substr(11, 2) + ':';
    date += str.substr(13, 2);
    date += str.substr(15);
  }

  return new Date(date);
}

//
// Internal functions
//

function format(date, withMonth) {
  return date.getFullYear() + '-' +
         zeroFill(date.getMonth() + 1) +
         (withMonth ? + ('-' + zeroFill(date.getDate())) : '');
}

function zeroFill(n) {
  return ('0' + n).substr(-2);
}
