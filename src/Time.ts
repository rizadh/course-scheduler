import { InvalidTimeValueError } from './InvalidTimeValueError';

export class Time {
  private static MINUTES_PER_HOUR = 60;

  public constructor(public readonly hour: number, public readonly minute: number) {
    if (this.hour < 0 || this.hour >= 24 || this.hour % 1 !== 0) {
      throw new InvalidTimeValueError('hour', this.hour);
    }

    if (this.minute < 0 || this.minute >= 60 || this.minute % 1 !== 0) {
      throw new InvalidTimeValueError('minute', this.minute);
    }
  }

  public isBefore(other: Time): boolean {
    return this.compare(other) < 0;
  }

  public isAfter(other: Time): boolean {
    return this.compare(other) > 0;
  }

  public isEqualTo(other: Time): boolean {
    return this.compare(other) === 0;
  }

  public toString() {
    const hourString = this.hour < 10 ? `0${this.hour}` : this.hour;
    const minuteString = this.minute < 10 ? `0${this.minute}` : this.minute;
    return `${hourString}:${minuteString}`;
  }

  private toMinutes(): number {
    return this.hour * Time.MINUTES_PER_HOUR + this.minute;
  }

  private compare(other: Time): number {
    return this.toMinutes() - other.toMinutes();
  }
}

export enum Day {
  Monday,
  Tuesday,
  Wednesday,
  Thursday,
  Friday,
}
