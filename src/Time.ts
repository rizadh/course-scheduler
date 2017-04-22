export class Time {
  private static MINUTES_PER_HOUR = 60;

  public constructor(public readonly hour: number, public readonly minute: number) { }

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

export enum Day {
  Monday,
  Tuesday,
  Wednesday,
  Thursday,
  Friday,
}
