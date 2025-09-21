export type PathSegment = string | number;

class ValidationError extends Error {
  issues: string[];

  constructor(issue: string, issues: string[] = [issue]) {
    super('Validation failed');
    this.name = 'ValidationError';
    this.issues = issues;
  }
}

const formatPath = (path: PathSegment[]) =>
  path.length === 0
    ? 'value'
    : path
        .map((segment) =>
          typeof segment === 'number' ? `[${segment}]` : `.${segment}`
        )
        .join('')
        .replace(/^[.]/, '');

const makeIssue = (path: PathSegment[], message: string) =>
  `${formatPath(path)}: ${message}`;

export type SafeParseSuccess<T> = { success: true; data: T };
export type SafeParseError = { success: false; errors: string[] };

export interface Schema<T> {
  parse(data: unknown): T;
  safeParse(data: unknown): SafeParseSuccess<T> | SafeParseError;
  optional(): Schema<T | undefined>;
  nullable(): Schema<T | null>;
  _parse(data: unknown, path: PathSegment[]): T;
}

const createSchema = <T>(
  parser: (data: unknown, path: PathSegment[]) => T
): Schema<T> => {
  const schema: Schema<T> = {
    parse(data) {
      return parser(data, []);
    },
    safeParse(data) {
      try {
        const parsed = parser(data, []);
        return { success: true, data: parsed };
      } catch (error) {
        if (error instanceof ValidationError) {
          return { success: false, errors: error.issues };
        }
        throw error;
      }
    },
    optional() {
      return createSchema<T | undefined>((data, path) => {
        if (data === undefined) {
          return undefined;
        }
        return parser(data, path);
      });
    },
    nullable() {
      return createSchema<T | null>((data, path) => {
        if (data === null) {
          return null;
        }
        return parser(data, path);
      });
    },
    _parse(data, path) {
      return parser(data, path);
    },
  };

  return schema;
};

export type Infer<TSchema extends Schema<unknown>> = TSchema extends Schema<infer TValue>
  ? TValue
  : never;

const getType = (data: unknown) => {
  if (Array.isArray(data)) {
    return 'array';
  }

  if (data === null) {
    return 'null';
  }

  return typeof data;
};

const string = () =>
  createSchema<string>((data, path) => {
    if (typeof data !== 'string') {
      throw new ValidationError(
        makeIssue(path, `Expected string, received ${getType(data)}`)
      );
    }
    return data;
  });

const number = () =>
  createSchema<number>((data, path) => {
    if (typeof data !== 'number' || Number.isNaN(data)) {
      throw new ValidationError(
        makeIssue(path, `Expected number, received ${getType(data)}`)
      );
    }
    return data;
  });

const boolean = () =>
  createSchema<boolean>((data, path) => {
    if (typeof data !== 'boolean') {
      throw new ValidationError(
        makeIssue(path, `Expected boolean, received ${getType(data)}`)
      );
    }
    return data;
  });

const any = () => createSchema<unknown>((data) => data);

const unknown = () => any();

const array = <TSchema extends Schema<unknown>>(schema: TSchema) =>
  createSchema<Infer<TSchema>[]>((data, path) => {
    if (!Array.isArray(data)) {
      throw new ValidationError(
        makeIssue(path, `Expected array, received ${getType(data)}`)
      );
    }

    return data.map((item, index) => schema._parse(item, [...path, index]));
  });

type SchemaShape = Record<string, Schema<unknown>>;

type ShapeToType<TShape extends SchemaShape> = {
  [TKey in keyof TShape]: Infer<TShape[TKey]>;
};

const object = <TShape extends SchemaShape>(shape: TShape) =>
  createSchema<ShapeToType<TShape> & Record<string, unknown>>((data, path) => {
    if (typeof data !== 'object' || data === null || Array.isArray(data)) {
      throw new ValidationError(
        makeIssue(path, `Expected object, received ${getType(data)}`)
      );
    }

    const source = data as Record<string, unknown>;
    const result: Record<string, unknown> = { ...source };

    Object.entries(shape).forEach(([key, schema]) => {
      const value = schema._parse(source[key], [...path, key]);
      result[key] = value;
    });

    return result as ShapeToType<TShape> & Record<string, unknown>;
  });

const literal = <TValue extends string | number | boolean | null | undefined>(
  expected: TValue
) =>
  createSchema<TValue>((data, path) => {
    if (data !== expected) {
      throw new ValidationError(
        makeIssue(
          path,
          `Expected literal ${JSON.stringify(expected)}, received ${JSON.stringify(data)}`
        )
      );
    }
    return expected;
  });

const union = <TSchemas extends [Schema<unknown>, ...Schema<unknown>[]]>(
  schemas: TSchemas
) =>
  createSchema<Infer<TSchemas[number]>>((data, path) => {
    const issues: string[] = [];

    for (const schema of schemas) {
      try {
        return schema._parse(data, path);
      } catch (error) {
        if (error instanceof ValidationError) {
          issues.push(...error.issues);
        } else {
          throw error;
        }
      }
    }

    throw new ValidationError(
      makeIssue(path, 'Value did not match any of the provided schemas'),
      issues
    );
  });

export const z = {
  string,
  number,
  boolean,
  object,
  array,
  any,
  unknown,
  literal,
  union,
};

export type { ValidationError };
