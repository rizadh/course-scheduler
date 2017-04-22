# Scheduler

A simple course auto-scheduler. Feed in an array describing each course (format below) and receive a set of possible
non-conflicting course sections.

_Documentation is in progress... More detailed usage and feature descriptions are upcoming._

## Format (TypeScript-style)

```ts
interface Course {
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
