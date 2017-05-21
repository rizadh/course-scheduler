import { InvalidTimeRangeError } from './InvalidTimeRangeError';
import { Time } from './Time';

export class TimeRange {
    public constructor(public readonly start: Time, public readonly end: Time) {
        if (!start.isBefore(end)) {
            throw new InvalidTimeRangeError(start, end);
        }
    }

    public overlaps(other: TimeRange): boolean {
        if (this.start.isBefore(other.end) === this.end.isAfter(other.start)) {
            return true;
        }

        return false;
    }
}
