var DAY_M = 86400000;
var MIN_M = 60000;

//
// Module exports
//

exports.day = day;
exports.week = week;
exports.month = month;
exports.range = range;
exports.timestamp = timestamp;
exports.parse = parse;
exports.parseISODate = parseISODate;
exports.dateKeys = ['date', 'startTime', 'endTime', 'time', 'firstDate', 'lastUpdate'];

// ## Format date to YYYYMMDD
//
// Used to get single days for Moves.
//
// The `date` parameter expects a Date instance. Will return a string with
// the date formatted `YYYYMMDD`.
//
// Usage:
//
//     > dates.day(new Date('2014-01-01'));
//     '20140101'

function day(date) {
  return format(date, true);
}


// ## Format a date to ISO8601 Week
//
// Original code found [here](http://stackoverflow.com/a/6117889). The
// `date` parameter expects a Date instance and will return a string
// in the format `YYYY-Www`.
//
// Usage:
//
//     > dates.week(new Date('2014-01-01'));
//     '2014-W01'

function week(date) {
  var d = new Date(+date);
  var y, w;

  d.setHours(0, 0, 0);
  d.setDate(d.getDate() + 4 - (d.getDay()||7));

  y = new Date(d.getFullYear(), 0, 1);
  w = Math.ceil((((d - y) / DAY_M) + 1) / 7);
  return d.getFullYear() + '-W' + zeroFill(w);
}

// ## Format date to YYYYMM
//
// Takes a `Date` instance and 'extracts' the month giving a
// string in the format `YYYYMM`.
//
// Usage:
//
//     > dates.month(new Date('2014-01-01'));
//     '201401'

function month(date) {
  return format(date, false);
}


// ## Create from/to range
//
// Creates a from/to range which can be used with `querystring`.
//
// Both `from` and `to` should be Date instances. Returns an object with
// string properties `from`/`to` in the format `YYYYMMDD`.
//
// Usage:
//
//     > dates.range(new Date('2014-01-01'), new Date('2014-01-05'));
//     { from: '20140101', to: '20140105' }

function range(from, to) {
  return {
    from: format(from, true),
    to: format(to, true)
  };
}


// ## Format date to a timestamp string
//
// Returns a string in the format `YYYYMMDDTHHMMSSZ`
//
// Usage:
//
//     > dates.timestamp(new Date('2014-01-01T10:00:00Z'));
//     '20140101T100000Z'

function timestamp(date) {
  return format(date, true, true);
}


// ## Parse results returned from the API
//
// The API returns dates in the ISO8601 basic format which JavaScript
// is not very happy about. This function walks the returned object
// and initilises the date stings to valid JavaScript Date objects.

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
}

// ## Parse YYYYMMDDTHHMMSSZ strings
//
// Takes strings formatted in `YYYYMMDDTHHMMSSZ` (ISO8601 basic) and creates
// valid Date instances.
//
// Usage:
//
//     > dates.parseISODate('20140101T100000Z');
//     Date('2014-01-01T10:00:00Z')

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

function format(date, month, time) {
  return date.getFullYear() +
         zeroFill(date.getMonth() + 1) +
         (month ? zeroFill(date.getDate()) : '') +
         (time ?  'T' + zeroFill(date.getHours()) + zeroFill(date.getMinutes()) +
            zeroFill(date.getSeconds()) + 'Z' : '');
}

function zeroFill(n) {
  return ('0' + n).substr(-2);
}
