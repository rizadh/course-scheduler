import { BadFormatError } from './BadFormatError';
import { DeepPartial } from './DeepPartial';
import { ISession, Session } from './Session';

export interface ISection {
  identifier: string;
  sessions: ISession[];
}

export class Section {
  public static fromJson(source: DeepPartial<ISection>): Section {
    if (typeof source.identifier !== 'string') {
      throw new BadFormatError(`'identifier' field is not a string or does not exist`);
    }

    if (!Array.isArray(source.sessions)) {
      throw new BadFormatError(`'sessions' field is not an array or does not exist`);
    }

    const sessions: Set<Session> = new Set();

    for (const session of source.sessions) {
      sessions.add(Session.fromJson(session));
    }

    return new Section(source.identifier, sessions);
  }

  public constructor(public readonly identifier: string, public readonly sessions: Set<Session>) { }

  public overlaps(other: Section): boolean {
    for (const session of this.sessions) {
      for (const otherSession of other.sessions) {
        if (session.overlaps(otherSession)) {
          return true;
        }
      }
    }

    return false;
  }

  public toJson(): ISection {
    return {
      identifier: this.identifier,
      sessions: [...this.sessions.values()].map((session) => session.toJson()),
    };
  }
}
