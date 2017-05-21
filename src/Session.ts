import { BadFormatError } from './BadFormatError';
import { DeepPartial } from './DeepPartial';
import { InvalidTimeValueError } from './InvalidTimeValueError';
import { ITime, Time } from './Time';
import { TimeRange } from './TimeRange';

export interface ILocation {
  building: string;
  room: number;
}

export interface ISession {
  day: number;
  location: ILocation;
  start: ITime;
  end: ITime;
}

export const enum Day {
  Sunday,
  Monday,
  Tuesday,
  Wednesday,
  Thursday,
  Friday,
  Saturday,
}

export class Session {
  public static fromJson(source: DeepPartial<ISession>): Session {
    if (source.start === undefined) {
      throw new BadFormatError(`'start' field does not exist`);
    }

    if (source.end === undefined) {
      throw new BadFormatError(`'end' field does not exist`);
    }

    if (source.location === undefined) {
      throw new BadFormatError(`'location' field does not exist`);
    }

    if (typeof source.day !== 'number') {
      throw new BadFormatError(`'day' field is not a number or does not exist`);
    }

    return new Session(
      Session.parseDay(source.day), Session.parseLocation(source.location),
      new TimeRange(
        Time.fromJson(source.start),
        Time.fromJson(source.end),
      ),
    );
  }

  private static parseDay(day: number): Day {
    switch (day) {
      case 1:
        return Day.Monday;
      case 2:
        return Day.Tuesday;
      case 3:
        return Day.Wednesday;
      case 4:
        return Day.Thursday;
      case 5:
        return Day.Friday;
      default:
        throw new BadFormatError('Day does not represent a day of the week (1 = Monday, 5 = Friday)');
    }
  }

  private static parseLocation(location: DeepPartial<ILocation>): ILocation {
    if (location.building === undefined) {
      throw new BadFormatError(`'building' field does not exist`);
    }

    if (location.room === undefined) {
      throw new BadFormatError(`'room' field does not exist`);
    }

    return location as ILocation;
  }

  public constructor(
    public readonly day: Day, public readonly location: ILocation,
    public readonly time: TimeRange) {
    if (![Day.Monday, Day.Tuesday, Day.Wednesday, Day.Thursday, Day.Friday]
      .includes(day)) {
      throw new InvalidTimeValueError('day', day);
    }
  }

  public overlaps(other: Session): boolean {
    return this.day === other.day && this.time.overlaps(other.time);
  }

  public toJson(): ISession {
    return {
      day: this.day,
      location: this.location,
      start: this.time.start.toJson(),
      /* tslint:disable:object-literal-sort-keys */
      end: this.time.end.toJson(),
    };
  }
}
