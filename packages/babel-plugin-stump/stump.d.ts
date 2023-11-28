declare module "@istanbuljs/load-nyc-config" {
  export function loadNycConfig(opts: {
    cwd: string;
    nycrcPath?: string;
  }): Promise<any>;
}

declare module "@babel/helper-plugin-utils" {
  declare function declare(fn: Function): Function;
}

declare module "istanbul-lib-instrument" {
  export function programVisitor(
    types: object,
    sourceFilePath: string,
    opts: object
  ): Function;
}

declare module "test-exclude" {
  export default function TestExclude(opts: any): Function;
}

declare module "@istanbuljs/schema" {
  export const defaults: any;
}
