import { Day } from './Time';
import TimeRange from './TimeRange';

export interface ILocation {
  building: string;
  room: string;
}

export default class Session {
  public constructor(public readonly day: Day, public readonly location: ILocation, public readonly time: TimeRange) { }

  public overlaps(other: Session): boolean {
    return this.day === other.day && this.time.overlaps(other.time);
  }
}
