/* tslint:disable:no-unused-expression */

import { should } from 'chai';
import 'mocha';

import { BadFormatError } from './BadFormatError';
import { InvalidTimeRangeError } from './InvalidTimeRangeError';
import { InvalidTimeValueError } from './InvalidTimeValueError';
import { Day, Session } from './Session';
import { Time } from './Time';
import { TimeRange } from './TimeRange';

// Extend Object.prototype with 'should'
should();

describe('Time', () => {
  const base = new Time(6, 30);
  const earlierHour = new Time(0, 30);
  const earlierMinute = new Time(6, 15);
  const laterHour = new Time(12, 30);
  const laterMinute = new Time(6, 45);

  describe('new Time()', () => {
    context('valid values', () => {
      it(`should create an instance with the correct hour and minute`, () => {
        base.hour.should.equal(6);
        base.minute.should.equal(30);
      });
    });

    context('invalid hour value', () => {
      it('should not allow creating times with negative hour values', () => {
        (() => new Time(-1, 0)).should.throw(InvalidTimeValueError);
      });

      it('should not allow creating times with too high hour values', () => {
        (() => new Time(24, 0)).should.throw(InvalidTimeValueError);
      });

      it('should not allow creating times with non-integer hour values', () => {
        (() => new Time(11.5, 0)).should.throw(InvalidTimeValueError);
      });
    });

    context('invalid minute value', () => {
      it('should not allow creating times with negative minute values', () => {
        (() => new Time(0, -1)).should.throw(InvalidTimeValueError);
      });

      it('should not allow creating times with too high minute values', () => {
        (() => new Time(0, 60)).should.throw(InvalidTimeValueError);
      });

      it('should not allow creating times with non-integer minute values', () => {
        (() => new Time(0, 29.5)).should.throw(InvalidTimeValueError);
      });
    });
  });

  describe('isBefore()', () => {
    it('should return true when the given time occurs earlier', () => {
      base.isBefore(laterHour).should.be.true;
      base.isBefore(laterMinute).should.be.true;
    });

    it('should return false when the given time occurs later', () => {
      base.isBefore(earlierHour).should.be.false;
      base.isBefore(earlierMinute).should.be.false;
    });

    it('should return false when the given time is equal', () => {
      base.isBefore(base).should.be.false;
    });
  });

  describe('isAfter()', () => {
    it('should return true when the given time occurs earlier', () => {
      base.isAfter(earlierHour).should.be.true;
      base.isAfter(earlierMinute).should.be.true;
    });

    it('should return false when the given time occurs later', () => {
      base.isAfter(laterHour).should.be.false;
      base.isAfter(laterMinute).should.be.false;
    });

    it('should return false when the given time is equal', () => {
      base.isBefore(base).should.be.false;
    });
  });

  describe('isEqualTo()', () => {
    it('should return false when the given time occurs earlier', () => {
      base.isEqualTo(earlierHour).should.be.false;
      base.isEqualTo(earlierMinute).should.be.false;
    });

    it('should return false when the given time occurs later', () => {
      base.isEqualTo(laterHour).should.be.false;
      base.isEqualTo(laterMinute).should.be.false;
    });

    it('should return true when the given time is equal', () => {
      base.isEqualTo(base).should.be.true;
    });
  });

  describe('fromJson()', () => {
    it('should create a corresponding instance when given a valid object', () => {
      const time = Time.fromJson({
        hour: 5,
        minute: 30,
      });

      time.hour.should.equal(5);
      time.minute.should.equal(30);

    });

    it('should throw an error when given an object with missing properties', () => {
      (() => Time.fromJson({})).should.throw(BadFormatError);
      (() => Time.fromJson({ hour: 5 })).should.throw(BadFormatError);
      (() => Time.fromJson({ minute: 5 })).should.throw(BadFormatError);
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

describe('Session', () => {

  describe('new Session()', () => {
    it('should allow creating a valid session', () => {
      (() =>
        new Session(Day.Monday, { building: 'SAMPLE', room: 100 }, new TimeRange(new Time(0, 0), new Time(1, 1))))
        .should.not.throw(Error);
    });

    it('should create a session with the appropriate values', () => {
      const session = new Session(Day.Monday, { building: 'SAMPLE', room: 100 },
        new TimeRange(new Time(0, 0), new Time(1, 1)));

      session.location.building.should.equal('SAMPLE');
      session.location.room.should.equal(100);
      session.day.should.equal(Day.Monday);
      session.time.start.hour.should.equal(0);
      session.time.start.minute.should.equal(0);
      session.time.end.hour.should.equal(1);
      session.time.end.minute.should.equal(1);
    });

    it('should not allow creating a session with an invalid day', () => {
      const invalidSessions = [
        () => new Session(-1, { building: 'SAMPLE', room: 100 }, new TimeRange(new Time(0, 0), new Time(1, 1))),
        () => new Session(6, { building: 'SAMPLE', room: 100 }, new TimeRange(new Time(0, 0), new Time(1, 1))),
        () => new Session(2.5, { building: 'SAMPLE', room: 100 }, new TimeRange(new Time(0, 0), new Time(1, 1))),
      ];

      for (const session of invalidSessions) {
        session.should.throw(InvalidTimeValueError);
      }
    });
  });

  describe('fromJson()', () => {
    it('should create a session with the correct values');
    it('should not allow creating a session when day is missing');
    it('should not allow creating a session when day is invalid');
    it('should not allow creating a session when location is missing');
    it('should not allow creating a session when location is invalid');
  });

  describe('toJson()', () => {
    it('should return a session with appropriate values');
  });

  describe('overlaps()', () => {
    const session = new Session(Day.Monday, { building: 'SAMPLE', room: 100 },
      new TimeRange(new Time(0, 0), new Time(1, 1)));
    const differentDaySameTime = new Session(Day.Tuesday, { building: 'SAMPLE', room: 100 },
      new TimeRange(new Time(0, 0), new Time(1, 1)));
    const sameDayOverlappingTime = new Session(Day.Monday, { building: 'SAMPLE', room: 100 },
      new TimeRange(new Time(0, 30), new Time(1, 30)));
    const sameDayNonOverlappingTime = new Session(Day.Monday, { building: 'SAMPLE', room: 100 },
      new TimeRange(new Time(2, 0), new Time(3, 0)));

    context('when sessions are on the same day', () => {
      it('should return true when times overlap', () => {
        session.overlaps(sameDayOverlappingTime).should.be.true;
      });

      it('should return false when times do not overlap', () => {
        session.overlaps(sameDayNonOverlappingTime).should.be.false;
      });
    });

    context('when sessions are on different days', () => {
      it('should return false', () => {
        session.overlaps(differentDaySameTime).should.be.false;
      });
    });
  });
});

describe('Section', () => {
  describe('new Section()', () => {
    it('should create an instance with the given values');
    it('should not allow creating a section with overlapping sessions');
  });

  describe('fromJson()', () => {
    it('should create an instance with given values');
    it('should allow creating an instance from a valid object');
    it('should allow creating an instance from a superset of require object properties');
    it('should now allow creating an instance from an object with missing require properties');
  });

  describe('toJson()', () => {
    it('should create a simple object representing the section');
  });

  describe('new Section()', () => {
    it('should create a section with the appropriate values');
    it('should not allow creating a section with overlapping sessions');
  });
});

describe('Course', () => {
  describe('new Course()', () => {
    it('should create an instance with the given values');
    it('should not allow creating a course with duplicate section identifiers');
  });

  describe('fromJson()', () => {
    it('should create an instance with given values');
    it('should allow creating an instance from a valid object');
    it('should allow creating an instance from a superset of require object properties');
    it('should now allow creating an instance from an object with missing require properties');
  });

  describe('toJson()', () => {
    it('should create a simple object representing the course');
  });

  describe('new Section()', () => {
    it('should create a section with the appropriate values');
    it('should not allow creating a section with overlapping sessions');
  });
});
