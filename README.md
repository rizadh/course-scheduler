# Scheduler [![Build Status](https://travis-ci.org/rizadh/scheduler.svg?branch=master)](https://travis-ci.org/rizadh/scheduler)

A simple course auto-scheduler. Feed in an array describing each course (format below) and receive a set of possible
non-conflicting course sections.

*Note: TypeScript-style type annotations and syntax will be used throughout this document*

## Format

```ts
interface RawCourse {
    code: string,
    sections: {
        identifier: string,
        sessions: {
            day: number,
            location: {
                building: string,
                room: string,
            },
            start: {
                hour: number,
                minute: number
            },
            end: {
                hour: number,
                minute: number
            }
        }[]
    }[]
}
```

## Usage

### Import the parser

#### CommonJS

```js
// Using pre-ES2015 property access
const scheduler = require('course-scheduler');
const parseCourses = scheduler.parseCourses;
const Course = scheduler.Course;

// Using ES2015 array destructuring
const { Course, parseCourses } = require('course-scheduler')
```

#### ES Modules

```js
import { parseCourses, Course } from 'course-scheduler';
```

### Parse the array of courses

```ts
const rawCourses: RawCourse[] = /* some array */;

const parsedCourses: Set<Course> = parseCourses(rawCourses);

const sectionCombinations: Set<Map<Course, Section>> = Course.possibleSectionCombinations(parsedCourses);
```

*More details about how to proceed with the return `sectionCombinations` will be added soon*
