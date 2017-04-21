import Session from './Session';

export default class Section {
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
}
