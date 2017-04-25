import { BadFormatError } from './BadFormatError';
import { DeepPartial } from './DeepPartial';
import { ISection, Section } from './Section';

type SectionCombination = Map<Course, Section>;

export interface ICourse {
  code: string;
  sections: ISection[];
}

export class Course {
  public static fromJson(source: DeepPartial<ICourse>): Course {
    if (typeof source.code !== 'string') {
      throw new BadFormatError(`'code' field is not a string or does not exist`);
    }

    if (!Array.isArray(source.sections)) {
      throw new BadFormatError(`'sections' field is not an array or does not exist`);
    }

    const sections: Set<Section> = new Set();

    for (const section of source.sections) {
      sections.add(Section.fromJson(section));
    }

    return new Course(source.code, sections);
  }

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

  public toJson(): ICourse {
    return {
      code: this.code,
      sections: [...this.sections.values()].map((section) => section.toJson()),
    };
  }

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
