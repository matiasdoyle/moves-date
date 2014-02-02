# Moves Date

> Makes working with dates from Moves API a bit easier

This module makes working with the Moves API slightly easier. Moves is a great service with a good API, but they return dates in ISO8601 basic format[1] which JavaScript does not like.

``` javascript
var date = new Date('20121212T071430Z');
console.log(isNaN(date); // => true
```

The main reason behind this module is to help with formatting dates returned by the API and creating date strings used for querying the API.

## Usage

``` javascript
var dates = require('moves-date');

dates.day(new Date('2014-01-01'));
// => '2014-01-01'
dates.week(new Date('2014-01-01'));
// => '2014-W01'
dates.month(new Date('2014-01-01'));
// => '2014-01'
dates.range(new Date('2014-01-01'), new Date('2014-01-05'));
// => { from: '2014-01-01', to: '2014-01-05' }

dates.parse(JSONDataFromAPI);
// => Dates in the JSON data initialised as Date instances
dates.parseISODate('20121212T071430Z');
// => Date('2012-12-12 07:14:30Z')
```

[1]: Basically ISO8601 dates without dashes and colons. So 2014-01-01 => 20140101
