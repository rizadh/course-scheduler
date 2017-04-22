# Scheduler

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
const scheduler = require('course-scheduler');
const parseCourses = scheduler.parseCourses;
const Course = scheduler.Course;
```

#### ES2015+ Module

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
