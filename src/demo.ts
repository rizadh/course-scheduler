/* tslint:disable:no-console */
import { CourseSet, generateCourse } from './index';

for (let i = 0; i < 100; i++) {
    const sample = new Set(new Array(5).fill(undefined).map(() => generateCourse()));

    const courseSet = new CourseSet();
    courseSet.minCourses = 5;
    const possibleCombinations = courseSet.findCombinations(sample);

    let combinationFound = false;
    let numFound = 0;

    for (const combination of possibleCombinations) {
        if (!combinationFound) {
            console.log(JSON.stringify([...sample].map((course) => course.toJson())));
        }
        combinationFound = true;
        combination.combination.forEach((section, course) => {
            console.log(`${course.code} -> ${section.identifier}: ${section.sessions}`);
        });

        console.log();
        numFound++;
    }

    if (combinationFound) {
        console.log(`Iteration ${i}`);
        console.log(`Found ${numFound}`);
        process.exit(0);
    }
}

process.exit(1);
