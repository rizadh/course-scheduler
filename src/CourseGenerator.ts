import { Course } from './Course';
import { Section } from './Section';
import { Session } from './Session';
import { Day, Time } from './Time';
import { TimeRange } from './TimeRange';

// Settable - Course layout
const SECTIONS_PER_COURSE = 3;
const SESSIONS_PER_SECTION = 3;
const RANDOM_STRING_LENGTH = 5;
const EARLIEST_SESSION = new Time(6, 0);
const LATEST_SESSION = new Time(20, 0);
const INTERVAL_LENGTH = 30;
const MAX_SESSION_DURATION = 180;
const MIN_SESSION_DURATION = 60;

// Calculated constants
const MIN_INTERVAL_PER_SESSION = MIN_SESSION_DURATION / INTERVAL_LENGTH;
const MAX_INTERVAL_PER_SESSION = MAX_SESSION_DURATION / INTERVAL_LENGTH;
const EARLIEST_INTERVAL = EARLIEST_SESSION.toMinutes() / INTERVAL_LENGTH;
const LATEST_INTERVAL = LATEST_SESSION.toMinutes() / INTERVAL_LENGTH;
const INTERVAL_RANGE = LATEST_INTERVAL - EARLIEST_INTERVAL;
const SESSION_RANGE = MAX_INTERVAL_PER_SESSION - MIN_INTERVAL_PER_SESSION;

function randomString(length: number, characters = 'ABCDEFGHIJKLMONPQRSTUVWXYZ') {
    return new Array(length)
        .fill(undefined)
        .map(() => characters.charAt(
            Math.floor(
                Math.random() * characters.length)))
        .join('');
}

function randomDay(): Day {
    switch (Math.ceil(Math.random() * 5)) {
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
            throw Error('Bad random day generated');
    }
}

function generateSession(): Session {
    const start = EARLIEST_INTERVAL + Math.floor(Math.random() * INTERVAL_RANGE);
    const end = start + MIN_INTERVAL_PER_SESSION + Math.round(Math.random() * SESSION_RANGE);

    const day = randomDay();
    const location = {
        building: randomString(RANDOM_STRING_LENGTH),
        room: 100 + Math.floor(2900 * Math.random()),
    };
    const startTime = Time.fromMinutes(start * INTERVAL_LENGTH);
    const endTime = Time.fromMinutes(end * INTERVAL_LENGTH);
    const time = new TimeRange(startTime, endTime);

    return new Session(day, location, time);
}

function generateSection(): Section {
    const MAX_ITERATIONS = 100;
    const sessions: Session[] = [];

    let sessionsAdded = 0;
    let i = 0;

    while (sessionsAdded < SESSIONS_PER_SECTION && i < MAX_ITERATIONS) {
        const newSession = generateSession();

        if (!sessions.some((session) => session.overlaps(newSession))) {
            sessions.push(newSession);
            sessionsAdded++;
        }

        i++;
    }

    return new Section(randomString(RANDOM_STRING_LENGTH), new Set(sessions));
}

export function generateCourse(): Course {
    return new Course(
        randomString(RANDOM_STRING_LENGTH),
        new Set(new Array(SECTIONS_PER_COURSE).fill(undefined).map(() => generateSection())),
    );
}
