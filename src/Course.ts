import { BadFormatError } from './BadFormatError';
import { DeepPartial } from './DeepPartial';
import { ISection, Section } from './Section';

export interface ICourse {
  code: string;
  sections: ISection[];
}

export class Course {
  public static fromJson(source: DeepPartial<ICourse>): Course {
    if (typeof source.code !== 'string') {
      throw new BadFormatError(
        `'code' field is not a string or does not exist`);
    }

    if (!Array.isArray(source.sections)) {
      throw new BadFormatError(
        `'sections' field is not an array or does not exist`);
    }

    const sections: Set<Section> = new Set();

    for (const section of source.sections) {
      sections.add(Section.fromJson(section));
    }

    return new Course(source.code, sections);
  }

  public constructor(
    public readonly code: string, public readonly sections: Set<Section>) { }

  public toJson(): ICourse {
    return {
      code: this.code,
      sections: [...this.sections.values()].map((section) => section.toJson()),
    };
  }
}
