/* tslint:disable:no-unused-expression */

import { should } from 'chai';
import 'mocha';

import { BadFormatError } from './BadFormatError';
import { InvalidTimeRangeError } from './InvalidTimeRangeError';
import { InvalidTimeValueError } from './InvalidTimeValueError';
import { Time } from './Time';
import { TimeRange } from './TimeRange';

// Extend Object.prototype with 'should'
should();

describe('Time', () => {
  const earlier = new Time(2, 0);
  const slightlyLater = new Time(2, 30);
  const later = new Time(3, 0);

  const earliest = new Time(0, 0);
  const latest = new Time(23, 59);

  describe('new Time()', () => {
    it(`should create an instance with the correct hour and minute`, () => {
      const hourMinuteCombinations = [
        [0, 0],
        [6, 15],
        [12, 35],
        [18, 45],
        [23, 59],
      ];

      for (const [hour, minute] of hourMinuteCombinations) {
        const time = new Time(hour, minute);
        time.hour.should.equal(hour);
        time.minute.should.equal(minute);
      }
    });

    it('should not allow creating times with negative hour values', () => {
      const invalidHours = [
        -Infinity,
        -100,
        -1,
      ];

      for (const hour of invalidHours) {
        (() => new Time(hour, 0)).should.throw(InvalidTimeValueError);
      }
    });

    it('should not allow creating times with too high hour values', () => {
      const invalidHours = [
        24,
        100,
        Infinity,
      ];

      for (const hour of invalidHours) {
        (() => new Time(hour, 0)).should.throw(InvalidTimeValueError);
      }
    });

    it('should not allow creating times with non-integer hour values', () => {
      const invalidHours = [
        0.1,
        12.2,
        23.5,
      ];

      for (const hour of invalidHours) {
        (() => new Time(hour, 0)).should.throw(InvalidTimeValueError);
      }
    });

    it('should not allow creating times with negative minute values', () => {
      const invalidMinutes = [
        -Infinity,
        -100,
        -1,
      ];

      for (const minute of invalidMinutes) {
        (() => new Time(0, minute)).should.throw(InvalidTimeValueError);
      }
    });

    it('should not allow creating times with too high minute values', () => {
      const invalidMinutes = [
        60,
        100,
        Infinity,
      ];

      for (const minute of invalidMinutes) {
        (() => new Time(0, minute)).should.throw(InvalidTimeValueError);
      }
    });

    it('should not allow creating times with non-integer minute values', () => {
      const invalidMinutes = [
        0.1,
        30.2,
        59.5,
      ];

      for (const minute of invalidMinutes) {
        (() => new Time(0, minute)).should.throw(InvalidTimeValueError);
      }
    });
  });

  describe('isBefore()', () => {
    it('should return true when the first time is before the second', () => {
      earlier.isBefore(slightlyLater).should.be.true;
      slightlyLater.isBefore(later).should.be.true;
      earlier.isBefore(later).should.be.true;

      // Midnight case
      earliest.isBefore(latest).should.be.true;
    });

    it('should return false when the first time is after the second', () => {
      slightlyLater.isBefore(earlier).should.be.false;
      later.isBefore(slightlyLater).should.be.false;
      later.isBefore(earlier).should.be.false;

      // Midnight case
      latest.isBefore(earliest).should.be.false;
    });

    it('should return false when the times are equal', () => {
      earlier.isBefore(earlier).should.be.false;
    });
  });

  describe('isAfter()', () => {
    it('should return true when first time is after second', () => {
      slightlyLater.isAfter(earlier).should.be.true;
      later.isAfter(slightlyLater).should.be.true;
      later.isAfter(earlier).should.be.true;

      // Midnight case
      latest.isAfter(earliest).should.be.true;
    });

    it('should return false when the first time is before the second', () => {
      earlier.isAfter(slightlyLater).should.be.false;
      slightlyLater.isAfter(later).should.be.false;
      earlier.isAfter(later).should.be.false;

      // Midnight case
      earliest.isAfter(latest).should.be.false;
    });

    it('should return false when the times are equal', () => {
      earlier.isAfter(earlier).should.be.false;
    });
  });

  describe('isEqualTo()', () => {
    it('should return true when the first time is after the second', () => {
      earlier.isEqualTo(slightlyLater).should.be.false;
      slightlyLater.isEqualTo(later).should.be.false;
      earlier.isEqualTo(later).should.be.false;

      // Midnight case
      earliest.isEqualTo(latest).should.be.false;
    });

    it('should return false when the first time is before the second', () => {
      earlier.isEqualTo(slightlyLater).should.be.false;
      slightlyLater.isEqualTo(later).should.be.false;
      earlier.isEqualTo(later).should.be.false;

      // Midnight case
      earliest.isEqualTo(latest).should.be.false;
    });

    it('should return true when the times are equal', () => {
      earlier.isEqualTo(earlier).should.be.true;
    });
  });

  describe('fromJson()', () => {
    it('should create a corresponding instance when given a valid object', () => {
      const source = {
        hour: 5,
        minute: 30,
      };

      const time = Time.fromJson(source);

      time.hour.should.equal(source.hour);
      time.minute.should.equal(source.minute);

    });

    it('should not throw an error when given an object with extra properties', () => {
      const source = {
        hour: 5,
        minute: 30,
        second: 5,
      };

      const timeInstance = new Time(5, 30);

      (() => Time.fromJson(source)).should.not.throw(BadFormatError);
      (() => Time.fromJson(timeInstance)).should.not.throw(BadFormatError);
    });

    it('should throw an error when given an object with missing properties', () => {
      const sources = [
        {},
        {
          hour: 5,
        },
        {
          minute: 5,
        },
      ];

      for (const source of sources) {
        (() => Time.fromJson(source)).should.throw(BadFormatError);
        (() => Time.fromJson({ second: 5, ...source })).should.throw(BadFormatError);
      }
    });

    it('should throw an error when given an array', () => {
      (() => Time.fromJson([])).should.throw(BadFormatError);
    });

    it('should throw an error when given a number', () => {
      (() => Time.fromJson(2)).should.throw(BadFormatError);
    });

    it('should throw an error when given a boolean', () => {
      (() => Time.fromJson(true)).should.throw(BadFormatError);
    });

    it('should throw an error when given objects with invalid values', () => {
      (() => Time.fromJson({ hour: 24, minute: 0 })).should.throw(InvalidTimeValueError);
      (() => Time.fromJson({ hour: 0, minute: 60 })).should.throw(InvalidTimeValueError);
    });
  });

  describe('toJson()', () => {
    it('should create a valid methodless object representation of itself', () => {
      const time = new Time(17, 30);

      const jsonTime = time.toJson();

      jsonTime.hour.should.equal(time.hour);
      jsonTime.minute.should.equal(time.minute);

      for (const key of Object.keys(jsonTime)) {
        ['hour', 'minute'].includes(key);
      }
    });
  });

  describe('fromMinutes()', () => {
    it('should create a corresponding instance when given a valid value', () => {
      const time = Time.fromMinutes(500);

      time.hour.should.equal(8);
      time.minute.should.equal(20);
    });
    it('should throw an error when given an invalid value', () => {
      (() => Time.fromMinutes(-1)).should.throw(InvalidTimeValueError);
      (() => Time.fromMinutes(60 * 24)).should.throw(InvalidTimeValueError);
      (() => Time.fromMinutes(2.5)).should.throw(InvalidTimeValueError);
    });
  });

  describe('toMinutes()', () => {
    it('should return the corresponding number of minutes since midnight', () => {
      const time = new Time(5, 5).toMinutes();

      time.should.equal(5 * 60 + 5);
    });
  });

  describe('toString()', () => {
    it('should create a properly formatted 24-hour time string', () => {
      const expectedValues = [
        [new Time(0, 0), '00:00'],
        [new Time(11, 11), '11:11'],

        [new Time(11, 0), '11:00'],
        [new Time(1, 0), '01:00'],
        [new Time(10, 0), '10:00'],

        [new Time(0, 11), '00:11'],
        [new Time(0, 1), '00:01'],
        [new Time(0, 10), '00:10'],
      ];

      for (const [time, expected] of expectedValues) {
        time.toString().should.equal(expected);
      }
    });
  });
});

describe('TimeRange', () => {
  const timeA = new Time(6, 15);
  const timeB = new Time(18, 45);

  describe('new TimeRange()', () => {
    it('should create an instance with the correct start and end', () => {
      const timeRange = new TimeRange(timeA, timeB);

      timeRange.start.should.equal(timeA);
      timeRange.end.should.equal(timeB);
    });

    it('should allow creating a valid time range', () => {
      (() => new TimeRange(new Time(1, 0), new Time(2, 0))).should.not.throw(InvalidTimeRangeError);
      (() => new TimeRange(new Time(0, 1), new Time(0, 2))).should.not.throw(InvalidTimeRangeError);
    });

    it('should not allow creating an impossible time range', () => {
      (() => new TimeRange(new Time(2, 0), new Time(1, 0))).should.throw(InvalidTimeRangeError);
      (() => new TimeRange(new Time(0, 2), new Time(0, 1))).should.throw(InvalidTimeRangeError);
    });

    it('should not allow creating a zero-length time range', () => {
      (() => new TimeRange(timeA, timeA)).should.throw(InvalidTimeRangeError);
      (() => new TimeRange(timeB, timeB)).should.throw(InvalidTimeRangeError);
    });
  });

  describe('overlaps()', () => {
    const midnightToMorning = new TimeRange(new Time(0, 0), new Time(6, 0));
    const midnightToNoon = new TimeRange(new Time(0, 0), new Time(12, 0));
    const midnightToEvening = new TimeRange(new Time(0, 0), new Time(18, 0));
    const morningToNoon = new TimeRange(new Time(6, 0), new Time(12, 0));
    const morningToEvening = new TimeRange(new Time(6, 0), new Time(18, 0));
    const noonToEvening = new TimeRange(new Time(12, 0), new Time(18, 0));

    it('should return true when the ranges overlap', () => {
      midnightToNoon.overlaps(morningToEvening).should.be.true;
      morningToEvening.overlaps(midnightToNoon).should.be.true;
    });

    it('should return true when one range is within the other', () => {
      const outer = midnightToEvening;
      const inner = morningToNoon;
      const leading = midnightToMorning;
      const trailing = noonToEvening;

      outer.overlaps(inner).should.be.true;
      outer.overlaps(leading).should.be.true;
      outer.overlaps(trailing).should.be.true;

      inner.overlaps(outer).should.be.true;
      leading.overlaps(outer).should.be.true;
      trailing.overlaps(outer).should.be.true;
    });

    it('should return true when the ranges are the same', () => {
      const timeRanges = [
        midnightToMorning,
        midnightToNoon,
        midnightToEvening,
        morningToNoon,
        morningToEvening,
        noonToEvening,
      ];

      for (const timeRange of timeRanges) {
        timeRange.overlaps(timeRange).should.be.true;
      }
    });

    it('should return false when the ranges are adjacent', () => {
      midnightToMorning.overlaps(morningToNoon).should.be.false;
      morningToNoon.overlaps(noonToEvening).should.be.false;
    });

    it('should return false when the ranges are separated by some time interval', () => {
      midnightToMorning.overlaps(noonToEvening).should.be.false;
    });
  });
});
