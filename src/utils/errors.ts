export class MissingPropertyError extends Error {
  constructor(prop: string) {
    super(`Missing propery "${prop}"`);
  }
}

export class EmptyValueError extends Error {
  constructor(prop: string) {
    super(`Propery "${prop}" cannot be empty`);
  }
}

export class WrongTypeError extends Error {
  constructor(prop: string, type: string) {
    super(`Propery "${prop}" should be of type "${type}"`);
  }
}