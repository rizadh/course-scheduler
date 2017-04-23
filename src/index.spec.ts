/* tslint:disable:no-unused-expression */

import { should } from 'chai';
import 'mocha';

import { Time, InvalidTimeValueError } from './Time';

// Extend Object.prototype with 'should'
should();

describe('Time', () => {
  const earlier = new Time(2, 0);
  const slightlyLater = new Time(2, 30);
  const later = new Time(3, 0);

  const earliest = new Time(0, 0);
  const latest = new Time(23, 59);

  describe('new Time()', () => {
    it(`should create an instance with valid hour and minute values`, () => {
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

    it('should not allow creating times with invalid hour values', () => {
      const invalidHours = [
        -Infinity,
        -100,
        -1,
        24,
        100,
        Infinity,
      ];

      for (const hour of invalidHours) {
        (() => new Time(hour, 0)).should.throw(InvalidTimeValueError);
      }
    });

    it('should not allow creating times with invalid minute values', () => {
      const invalidMinutes = [
        -Infinity,
        -100,
        -1,
        60,
        100,
        Infinity,
      ];

      for (const minute of invalidMinutes) {
        (() => new Time(0, minute)).should.throw(InvalidTimeValueError);
      }
    });
  });

  describe('isBefore()', () => {
    it('should return true when time is before', () => {
      earlier.isBefore(slightlyLater).should.be.true;
      slightlyLater.isBefore(later).should.be.true;
      earlier.isBefore(later).should.be.true;

      // Midnight case
      earliest.isBefore(latest).should.be.true;
    });

    it('should return false when time is after', () => {
      slightlyLater.isBefore(earlier).should.be.false;
      later.isBefore(slightlyLater).should.be.false;
      later.isBefore(earlier).should.be.false;

      // Midnight case
      latest.isBefore(earliest).should.be.false;
    });

    it('should return false when time is equal', () => {
      earlier.isBefore(earlier).should.be.false;
    });
  });

  describe('isAfter()', () => {
    it('should return true when time is after', () => {
      slightlyLater.isAfter(earlier).should.be.true;
      later.isAfter(slightlyLater).should.be.true;
      later.isAfter(earlier).should.be.true;

      // Midnight case
      latest.isAfter(earliest).should.be.true;
    });

    it('should return false when time is before', () => {
      earlier.isAfter(slightlyLater).should.be.false;
      slightlyLater.isAfter(later).should.be.false;
      earlier.isAfter(later).should.be.false;

      // Midnight case
      earliest.isAfter(latest).should.be.false;
    });

    it('should return false when time is equal', () => {
      earlier.isAfter(earlier).should.be.false;
    });
  });

  describe('isEqualTo()', () => {
    it('should return true when time is after', () => {
      earlier.isEqualTo(slightlyLater).should.be.false;
      slightlyLater.isEqualTo(later).should.be.false;
      earlier.isEqualTo(later).should.be.false;

      // Midnight case
      earliest.isEqualTo(latest).should.be.false;
    });

    it('should return false when time is before', () => {
      earlier.isEqualTo(slightlyLater).should.be.false;
      slightlyLater.isEqualTo(later).should.be.false;
      earlier.isEqualTo(later).should.be.false;

      // Midnight case
      earliest.isEqualTo(latest).should.be.false;
    });

    it('should return true when time is equal', () => {
      earlier.isEqualTo(earlier).should.be.true;
    });
  });
});
