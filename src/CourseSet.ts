import { Course } from './Course';
import { CourseCombination } from './CourseCombination';

export class CourseSet {
    public maxCourses = Infinity;
    public minCourses = 0;

    public findCombinations(courses: Iterable<Course>): Iterable<CourseCombination> {
        let courseCombinations = [new CourseCombination()];
        const minimumCombinations: CourseCombination[] = [];

        for (const course of courses) {
            courseCombinations = courseCombinations
                .reduce<CourseCombination[]>((prev, curr) => {
                    if (curr.combination.size >= this.maxCourses) {
                        return [...prev, curr];
                    } else {
                        if (curr.combination.size >= this.minCourses) {
                            minimumCombinations.push(curr);
                        }
                        return [...prev, ...curr.addCourse(course)];
                    }
                }, []);
        }

        courseCombinations = courseCombinations.filter(({ combination }) => combination.size >= this.minCourses);

        return [...courseCombinations, ...minimumCombinations];
    }
}
