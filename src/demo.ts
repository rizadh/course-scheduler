/* tslint:disable:no-console */
import { Course, generateCourse } from './index';

for (let i = 0; i < 100; i++) {
    const sample = new Set(new Array(5).fill(undefined).map(() => generateCourse()));

    const possibleCombinations = Course.possibleSectionCombinations(sample);

    if (possibleCombinations.size > 0) {
        console.log(JSON.stringify([...sample].map((course) => course.toJson())));
        possibleCombinations.forEach((combination) => {
            combination.forEach((section, course) => {
                console.log(`${course.code} -> ${section.identifier}`);
            });
        });

        console.log(`Iteration ${i}`);
        break;
    }
}
