import Course from './Course';
import Section from './Section';
import Session, { ILocation } from './Session';
import Time, { Day } from './Time';
import TimeRange from './TimeRange';

class BadFormatError extends Error { }

interface IRawTime {
    hour: number;
    minute: number;
}

interface IRawSession {
    day: number;
    end: IRawTime;
    location: ILocation;
    start: IRawTime;
}

interface IRawSection {
    identifier: string;
    sessions: IRawSession[];
}

interface IRawCourse {
    code: string;
    sections: IRawSection[];
}

function parseTime(time: IRawTime): Time {
    if (typeof time.hour !== 'number') {
        throw new BadFormatError(`'hour' field is not a number or does not exist`);
    }

    if (typeof time.minute !== 'number') {
        throw new BadFormatError(`'minute' field is not a number or does not exist`);
    }

    return new Time(time.hour, time.minute);
}

function parseDay(day: number): Day {
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

function parseLocation(location: ILocation): ILocation {
    if (location.building === undefined) {
        throw new BadFormatError(`'building' field does not exist`);
    }

    if (location.room === undefined) {
        throw new BadFormatError(`'room' field does not exist`);
    }

    return location;
}

function parseSession(session: IRawSession): Session {
    if (session.start === undefined) {
        throw new BadFormatError(`'start' field does not exist`);
    }

    if (session.end === undefined) {
        throw new BadFormatError(`'end' field does not exist`);
    }

    if (session.location === undefined) {
        throw new BadFormatError(`'location' field does not exist`);
    }

    if (typeof session.day !== 'number') {
        throw new BadFormatError(`'day' field is not a number or does not exist`);
    }

    return new Session(
        parseDay(session.day),
        parseLocation(session.location),
        new TimeRange(
            parseTime(session.start),
            parseTime(session.end),
        ),
    );
}

function parseSection(section: IRawSection): Section {
    if (typeof section.identifier !== 'string') {
        throw new BadFormatError(`'identifier' field is not a string or does not exist`);
    }

    if (!Array.isArray(section.sessions)) {
        throw new BadFormatError(`'sessions' field is not an array or does not exist`);
    }

    const sessions: Set<Session> = new Set();

    for (const session of section.sessions) {
        sessions.add(parseSession(session));
    }

    return new Section(section.identifier, sessions);
}

function parseCourse(course: IRawCourse): Course {
    if (typeof course.code !== 'string') {
        throw new BadFormatError(`'code' field is not a string or does not exist`);
    }

    if (!Array.isArray(course.sections)) {
        throw new BadFormatError(`'sections' field is not an array or does not exist`);
    }

    const sections: Set<Section> = new Set();

    for (const section of course.sections) {
        sections.add(parseSection(section));
    }

    return new Course(course.code, sections);
}

export function parseCourses(courses: {}): Set<Course> {
    const parsedCourses: Set<Course> = new Set();
    if (!Array.isArray(courses)) {
        throw new BadFormatError(`Input is not an array or does not exist`);
    }

    for (const course of courses) {
        parsedCourses.add(parseCourse(course));
    }

    return parsedCourses;
}
