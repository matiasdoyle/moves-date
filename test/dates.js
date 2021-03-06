var assert = require('assert');
var dates = require('..');

var storyline = require('./fixtures/storyline');

describe('Dates', function() {
  describe('#day', function() {
    it('should return a string with the date formatted YYYYMMDD', function() {
      var str = dates.day(new Date('2013-08-23'));
      assert.equal(str, '20130823');
    });
  });

  describe('#week', function() {
    it('should return a string with the date formatted YYYY-Www', function() {
      var str = dates.week(new Date('2013-08-23'));
      assert.equal(str, '2013-W34');
    });

    it('should handle dates close to year end', function() {
      var week = dates.week(new Date('Sat Dec 28 2013 20:18:00 GMT+0000 (GMT)'));
      assert.equal(week, '2013-W52');
    });

    it('should handle dates in W01 week previous year', function() {
      var week = dates.week(new Date('2013-12-30'));
      assert.equal(week, '2014-W01');
    });
  });

  describe('#month', function() {
    it('should return a string with the date formatted YYYYMM', function() {
      var str = dates.month(new Date('2013-08-23'));
      assert.equal(str, '201308');
    });
  });

  describe('#range', function() {
    it('should return an object with the `from`, `to` formatted YYYYMMDD', function() {
      var from = new Date('2013-08-20');
      var to = new Date('2013-08-23');
      var range = dates.range(from, to);
    
      assert.equal(range.from, '20130820');
      assert.equal(range.to, '20130823');
    });
  });

  describe('#timestamp', function() {
    it('should return a string with the date formatted YYYYMMDDTHHMMSSZ', function() {
      var str = dates.timestamp(new Date('2013-08-23 10:10:10'));
      assert.equal(str, '20130823T101010Z');
    })
  });

  describe('#parse', function() {
    it('should support parsing larger objects', function() {
      var res = dates.parse(storyline);
      var day = res[0];

      assert(day.date instanceof Date);
      assert(day.segments[0].startTime instanceof Date);
      assert(day.segments[0].endTime instanceof Date);
      assert(day.lastUpdate instanceof Date);
    });

    it('should support nested objects', function() {
      var data = {
        userId: 1,
        profile: {
          firstDate: '20130801',
          currentTimeZone: { id: 'Europe/Oslo', offset: 3600 },
          caloriesAvailable: true,
          platform: 'ios'
        }
      };

      var res = dates.parse(data);
      assert(res.profile.firstDate instanceof Date);
    });

    it('should handle changes to dateKeys array', function() {
      var data = { foo: '20130801' };
      var keys = dates.dateKeys;

      dates.dateKeys = ['foo'];

      var res = dates.parse(data);

      assert(res.foo instanceof Date, 'res.foo instance of Date');

      // Restore dateKeys
      dates.dateKeys = keys;
    });
  });

  describe('#parseISODate', function() {
    it('should parse YYYYMMDD dates', function() {
      var expectedDate = new Date('2013-08-23');
      var parsed = dates.parseISODate('20130823');

      assert.equal(expectedDate.getTime(), parsed.getTime());
    });

    it('should parse YYYYMMDDTHHMMSSZ dates', function() {
      var expectedDate = new Date('2013-08-23T15:00:00Z');
      var parsed = dates.parseISODate('20130823T150000Z');

      assert.equal(expectedDate.getTime(), parsed.getTime());
    });

    it('should parse dates with time zone designator', function() {
      var expectedUTCString = 'Wed, 12 Dec 2012 05:46:17 GMT';
      var parsed = dates.parseISODate('20121212T074617+0200');

      assert.equal(parsed.toUTCString(), expectedUTCString);
    });
  });
});
