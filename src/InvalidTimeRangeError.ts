import { Time } from './Time';

export class InvalidTimeRangeError extends Error {
    constructor(start: Time, end: Time) {
        super(`Provided time range is invalid. Start time (${start}) must be before end time (${end}).`);
    }
}
