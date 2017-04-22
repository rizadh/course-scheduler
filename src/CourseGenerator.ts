// Settable
const MINUTE_PER_INTERVAL = 30;
const SECTIONS_PER_COURSE = 3;
const SESSIONS_PER_SECTION = 5;
const RANDOM_STRING_LENGTH = 5;

// Time conversions
const HOURS_PER_DAY = 24;
const MINUTES_PER_HOUR = 60;

// Calculated constants
const NUM_INTERVALS = (HOURS_PER_DAY * MINUTES_PER_HOUR) / MINUTE_PER_INTERVAL;
const INTERVALS_PER_HOUR = MINUTES_PER_HOUR / MINUTE_PER_INTERVAL;

function randomString(length: number) {
    const characters = 'ABCDEFGHIJKLMONPQRSTUVWXYZ';

    let str = '';
    for (let i = 0; i < length; i++) {
        str += characters.charAt(Math.floor(Math.random() * 26));
    }

    return str;
}

function randomDay() {
    const days = [1, 2, 3, 4, 5];

    return days[Math.floor(Math.random() * days.length)];
}

function generateSession() {
    const start = Math.floor(Math.random() * NUM_INTERVALS - 1);
    const end = start + Math.ceil(Math.random() * (NUM_INTERVALS - start - 1));

    return {
        day: randomDay(),
        location: {
            building: randomString(RANDOM_STRING_LENGTH),
            room: randomString(RANDOM_STRING_LENGTH),
        },
        start: {
            hour: Math.floor(start / INTERVALS_PER_HOUR),
            minute: MINUTE_PER_INTERVAL * (start % 2),
        },
        // tslint:disable:object-literal-sort-keys
        end: {
            hour: Math.floor(end / 2),
            minute: MINUTE_PER_INTERVAL * (end % 2),
        },
    };
}

function generateSection() {
    return {
        identifier: randomString(RANDOM_STRING_LENGTH),
        sessions: new Array(SESSIONS_PER_SECTION).fill(undefined).map(() => generateSession()),
    };
}

function generateCourse() {
    return {
        code: randomString(RANDOM_STRING_LENGTH),
        sections: new Array(SECTIONS_PER_COURSE).fill(undefined).map(() => generateSection()),
    };
}

export function* generateCourses(num: number) {
    for (let i = 0; i < num; i++) {
        yield generateCourse();
    }
}
