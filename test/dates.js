var assert = require('assert');
var dates = require('..');

var storyline = require('./fixtures/storyline');

describe('Dates', function() {
  describe('#day', function() {
    it('should return a string with the date formatted YYYY-MM-DD', function() {
      var str = dates.day(new Date('2013-08-23'));
      assert.equal(str, '2013-08-23');
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
    it('should return a string with the date formatted YYYY-MM', function() {
      var str = dates.month(new Date('2013-08-23'));
      assert.equal(str, '2013-08');
    });
  });

  describe('#range', function() {
    it('should return an object with the `from`, `to` formatted YYYY-MM-DD', function() {
      var from = new Date('2013-08-20');
      var to = new Date('2013-08-23');
      var range = dates.range(from, to);
    
      assert.equal(range.from, '2013-08-20');
      assert.equal(range.to, '2013-08-23');
    });
  });

  describe('#parse', function() {
    it('should support parsing larger objects', function() {
      var res = dates.parse(storyline);
      var day = res[0];

      assert(day.date instanceof Date);
      assert(day.segments[0].startTime instanceof Date);
      assert(day.segments[0].endTime instanceof Date);
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
  });
});
