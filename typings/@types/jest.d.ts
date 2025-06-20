declare namespace Jest {
  interface Matchers<T> {
    toBe(value: any): boolean;
    toEqual(expected: any): boolean;
    toBeTruthy(): boolean;
    toBeFalsy(): boolean;
    toBeNull(): boolean;
    toBeUndefined(): boolean;
    toBeDefined(): boolean;
    toMatch(regex: RegExp | string): boolean;
    toContain(expected: any): boolean;
    toHaveLength(length: number): boolean;
    toHaveProperty(keyPath: string | number | symbol): boolean;
  }

  interface Global {
    describe: (description: string, callback: () => void) => void;
    it: (description: string, callback: () => void) => void;
    test: (description: string, callback: () => void) => void;
    expect: (value: any) => Matchers<any>;
    jest: {
      fn: () => jest.Mock;
      mock: (moduleName: string) => jest.Mock;
      spyOn: (obj: any, method: string) => jest.Spy;
    };
  }

  const global: Global;
}

declare global {
  const describe: Jest.Global['describe'];
  const it: Jest.Global['it'];
  const test: Jest.Global['test'];
  const expect: Jest.Global['expect'];
  const jest: Jest.Global['jest'];
}