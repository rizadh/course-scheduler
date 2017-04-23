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
    return `${this.hour}:${this.minute}`;
  }

  private toMinutes(): number {
    return this.hour * Time.MINUTES_PER_HOUR + this.minute;
  }

  private compare(other: Time): number {
    return this.toMinutes() - other.toMinutes();
  }
}

export class InvalidTimeValueError extends Error {
  constructor(unit: string, providedValue: number) {
    super(`Cannot create a valid time with provided ${unit} value: ${providedValue}`);
  }
}

export enum Day {
  Monday,
  Tuesday,
  Wednesday,
  Thursday,
  Friday,
}
