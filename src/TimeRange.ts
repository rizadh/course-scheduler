import {Time} from './Time';

export class TimeRange {
    public constructor(public readonly start: Time, public readonly end: Time) {
        if (!start.isBefore(end)) {
            throw Error(`Provided time range is invalid. Start time (${start}) must be before end time (${end}).`)
        }
    }

    public overlaps(other: TimeRange): boolean {
        if (this.start.isBefore(other.end) === this.end.isAfter(other.start)) {
            return false;
        }

        return true;
    }
}
