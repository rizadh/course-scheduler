export class Time {
  private static HOUR_TO_MINUTES: number = 60;
  public constructor(public readonly hour: number, public readonly minute: number) { }

  private toMinutes(): number {
    return this.hour * Time.HOUR_TO_MINUTES + this.minute;
  }

  private compare(other: Time): number {
    return this.toMinutes() - other.toMinutes();
  }

  public isBefore(other: Time): boolean {
    return this.compare(other) < 0;
  }

  public isAfter(other: Time): boolean {
    return this.compare(other) > 0;
  }

  public isEqualTo(other: Time): boolean {
    return this.compare(other) == 0;
  }

  public toString() {
    return `${this.hour}:${this.minute}`;
  }
}

export enum Day {
  Monday,
  Tuesday,
  Wednesday,
  Thursday,
  Friday,
}
