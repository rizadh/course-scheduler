import { Section } from './Section';

type SectionCombination = Map<Course, Section>;

export class Course {
  public static possibleSectionCombinations(courses: Set<Course>): Set<Map<Course, Section>> {
    const combinations: Set<SectionCombination> = Course.sectionCombinations(courses);
    const possibleCombinations: Set<SectionCombination> = new Set();

    for (const combination of combinations) {
      if (Course.combinationIsPossible(combination)) {
        possibleCombinations.add(combination);
      }
    }

    return possibleCombinations;
  }

  private static combinationIsPossible(combination: SectionCombination): boolean {
    const sections = [...combination.values()];

    for (let i = 0; i < sections.length; i++) {
      for (let j = i + 1; j < sections.length; j++) {
        if (sections[i].overlaps(sections[j])) {
          return false;
        }
      }
    }

    return true;
  }

  private static sectionCombinations(courses: Set<Course>): Set<SectionCombination> {
    let combinations: Set<SectionCombination> = new Set();

    for (const course of courses) {
      combinations = course.addTo(combinations);
    }

    return combinations;
  }

  public constructor(public readonly code: string, public readonly sections: Set<Section>) { }

  private addTo(combinations: Set<SectionCombination>): Set<SectionCombination> {
    if (combinations.size === 0) {
      for (const section of this.sections) {
        combinations.add(new Map([[this, section]]));
      }

      return combinations;
    }

    const newCombinations: Set<SectionCombination> = new Set();

    for (const combination of combinations) {
      for (const section of this.sections) {
        newCombinations.add(new Map(combination.entries()).set(this, section));
      }
    }

    return newCombinations;
  }
}
