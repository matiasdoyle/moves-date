# moves-date [![Build Status](https://travis-ci.org/matiasdoyle/moves-date.png?branch=master)](https://travis-ci.org/matiasdoyle/moves-date)

[Moves](http://moves-app.com/) is a great service and has a powerful API, but they return and require dates formatted in [ISO8601 basic format](https://en.wikipedia.org/wiki/ISO_8601). Which JavaScript does not like:

``` javascript
var date = new Date('20121212T071430Z');
console.log(isNaN(date)); // => true
```

This module makes working with the Moves API a bit easier. It has functions for creating ISO8601 basic format strings and parsing them. See below for usage.

## Installation

	npm install moves-date

## Usage

``` javascript
var dates = require('moves-date');

dates.day(new Date('2014-01-01'));
// => '20140101'

dates.week(new Date('2014-01-01'));
// => '2014-W01'

dates.month(new Date('2014-01-01'));
// => '201401'

dates.range(new Date('2014-01-01'), new Date('2014-01-05'));
// => { from: '20140101', to: '20140105' }

dates.timestamp(new Date('2014-01-01 12:34:56'));
// => '20140101T123456Z'

dates.parse(dataFromAPI);
// => Returns object with the dates initialised as Date instances.

dates.parseISODate('20121212T071430Z');
// => Date('2012-12-12 07:14:30Z')
```

## License

See [LICENSE.md](https://github.com/matiasdoyle/moves-date/blob/master/LICENSE.md).

