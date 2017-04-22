import Course from './Course';
import { generateCourses } from './CourseGenerator';
import { parseCourses } from './CourseParser';

for (let i = 0; i < 100; i++) {
    const sample = [...generateCourses(5)];

    const parsedCourses = parseCourses(sample);

    const possibleCombinations = Course.possibleSectionCombinations(parsedCourses);

    if (possibleCombinations.size > 0) {
        console.log(JSON.stringify(sample));
        possibleCombinations.forEach((combination) => {
            combination.forEach((section, course) => {
                console.log(`${course.code} -> ${section.identifier}`);
            });
        });

        console.log(`Iteration ${i}`);
        break;
    }
}