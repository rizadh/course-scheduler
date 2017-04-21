function randomString(length: number) {
    const characters = 'ABCDEFGHIJKLMONPQRSTUVWXYZ';

    let str = '';
    for (let i = 0; i < length; i++) {
        str += characters.charAt(Math.floor(Math.random() * 26));
    }

    return str;
}

function generateSession() {
    const start = Math.floor(Math.random() * 47);
    const end = start + Math.ceil(Math.random() * (47 - start))

    return {
        day: Math.ceil(Math.random() * 5),
        location: {
            building: randomString(5),
            room: randomString(5),
        },
        start: {
            hour: Math.floor(start / 2),
            minute: 30 * (start % 2),
        },
        end: {
            hour: Math.floor(end / 2),
            minute: 30 * (end % 2),
        }
    }
}

function generateSection() {
    return {
        identifier: randomString(5),
        sessions: new Array(5).fill(undefined).map(() => generateSession()),
    }
}

function generateCourse() {
    return {
        code: randomString(5),
        sections: new Array(3).fill(undefined).map(() => generateSection()),
    }
}

export function* generateCourses(num: number) {
    for (let i = 0; i < num; i++) {
        yield generateCourse();
    }
}