export class InvalidTimeValueError extends Error {
  constructor(unit: string, providedValue: number) {
    super(`Cannot create a valid time with provided ${unit} value: ${providedValue}`);
  }
}
