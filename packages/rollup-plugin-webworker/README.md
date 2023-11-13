[npm]: https://img.shields.io/npm/v/rollup-plugin-webworker
[npm-url]: https://www.npmjs.com/package/rollup-plugin-webworker

[![npm][npm]][npm-url]

# rollup-plugin-webworker

🍣 A Rollup plugin to handler webworker.

## Requirements

This plugin requires an [LTS](https://github.com/nodejs/Release) Node version (v14.0.0+) and Rollup v3.0.0+.

## Install

Using pnpm:

```console
pnpm add rollup-plugin-webworker -D
```

## Usage

### Rollup Config

```js
import { defineConfig } from "rollup";
import webworker from "rollup-plugin-webworker";
// change ts plugin
import typescript from "rollup-plugin-typescript2";

export default defineConfig({
  /* ... */
  plugins: [
    worker({
      useTerser: true,
      useTs: true,
      tsPlugin: typescript(),
    }),
  ],
});
```

### Worker Code

```ts
// fib-worker.ts
self.onmessage = (e) => {
  const num = Number(e.data);
  const result = fib(num);

  self.postMessage(result);
};

function fib(n: number): number {
  if (n === 0) {
    return 0;
  }
  if (n === 1 || n === 2) {
    return 1;
  }

  return fib(n - 1) + fib(n - 2);
}
```

### Main Code

```ts
// main.ts
import createWorker from "./fib-worker?worker";

const worker = createWorker();

function fibonacciInWorker(n: number): Promise<number> {
  const promise = new Promise<number>((resolve) => {
    worker.onmessage = (event) => {
      resolve(event.data);
    };
  });

  worker.postMessage(n);

  return promise;
}

export { fibonacciInWorker };
```

## Options

### `inline`

Type: `boolean` <br>
Default: `true`

If `false`, will output worker file, default at `dist`.

### `out`

Type: `string` <br>
Default: `dist`

Output path of worker file.

Take effect when `inline` is `false`.

### `filter`

Type: `RegExp` <br>
Default: `/\?worker$/`

The RegExp to match worker file.

### `useTerser`

Type: `boolean` <br>
Default: `true`

Whether to use `@rollup/plugin-terser` to minify code.

### `useTs`

Type: `boolean` <br>
Default: `true`

Whether to use `@rollup/plugin-typescript`.

### `useNodeResolve`

Type: `boolean` <br>
Default: `false`

Whether to use `@rollup/plugin-node-resolve`.

### `useJson`

Type: `boolean` <br>
Default: `false`

Whether to use `@rollup/plugin-json`.

### `keepImportName`

Type: `boolean` <br>
Default: `false`

Whether to remove the mark of web worker file.

### `plugins`

Type: `Array<Plugin>` <br>
Default: `[]`

Add plugins to handler worker code.

`@rollup/plugin-commonjs` is built in. <br>
`@rollup/plugin-terser` will be used when `useTerser` is `true`. <br>
`@rollup/plugin-typescript` will be used when `useTs` is `true`. <br>
`@rollup/plugin-node-resolve` will be used when `useNodeResolve` is `true`. <br>
`@rollup/plugin-json` will be used when `useJson` is `true`. <br>

In most cases you don't need to use this option.

### `commonjsPlugin`

Type: `Plugin` <br>
Default: `@rollup/plugin-commonjs`

You can use `commonjsPlugin` to change default commonjs plugin.

### `terserPlugin`

Type: `Plugin` <br>
Default: `@rollup/plugin-terser`

Take effect when `useTerser` is `true`.

You can use `terserPlugin` to change default terser plugin.

### `tsPlugin`

Type: `Plugin` <br>
Default: `@rollup/plugin-typescript`

Take effect when `useTs` is `true`.

You can use `tsPlugin` to change default typescript plugin.

### `nodeResolvePlugin`

Type: `Plugin` <br>
Default: `@rollup/plugin-node-resolve`

Take effect when `useNodeResolve` is `true`.

You can use `nodeResolvePlugin` to change default node-resolve plugin.

### `jsonPlugin`

Type: `Plugin` <br>
Default: `@rollup/plugin-json`

Take effect when `useJson` is `true`.

You can use `jsonPlugin` to change default json plugin.
