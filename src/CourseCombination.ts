import { Course } from './Course';
import { Section } from './Section';

export class CourseCombination {
    public combination = new Map<Course, Section>();

    public * addCourse(newCourse: Course): Iterable<CourseCombination> {
        for (const newSection of newCourse.sections) {
            const courseCombination = new CourseCombination();

            for (const [existingCourse, existingSection] of this.combination) {
                courseCombination.addCombination(existingCourse, existingSection);
            }

            courseCombination.addCombination(newCourse, newSection);

            if (courseCombination.isPossible()) {
                yield courseCombination;
            }
        }
    }

    private isPossible(): boolean {
        for (const a of this.combination.values()) {
            for (const b of this.combination.values()) {
                if (a !== b && a.overlaps(b)) {
                    return false;
                }
            }
        }

        return true;
    }

    private addCombination(course: Course, section: Section): void {
        if (!course.sections.has(section)) {
            throw Error('Course does not contain section.');
        }

        if (new Set(this.combination.keys()).has(course)) {
            throw Error('Course has already been added.');
        }

        if (new Set(this.combination.values()).has(section)) {
            throw Error('Section has already been added.');
        }

        this.combination.set(course, section);
    }
}
