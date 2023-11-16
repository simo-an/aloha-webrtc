[npm]: https://img.shields.io/npm/v/esbuild-plugin-raw2
[npm-url]: https://www.npmjs.com/package/esbuild-plugin-raw2

[![npm][npm]][npm-url]

# esbuild-plugin-raw2

🍣 A ESBuild plugin to handler raw file.

## Requirements

This plugin requires an [LTS](https://github.com/nodejs/Release) Node version (v14.0.0+) and ESbuild v0.18.0+.

## Install

Using pnpm:

```console
pnpm add esbuild-plugin-raw2 -D
```

## Usage

### ESbuild Config

```js
import { defineConfig } from "esbuild";
import raw from "esbuild-plugin-raw2";

export default defineConfig({
  /* ... */
  plugins: [
    raw({
      filter: /\.(txt|glsl|fs)$/i,
    }),
  ],
});
```

### `test.txt` Content

```txt
hello world
```

will transform to

```ts
export default "hello world";
```

### JS Code

```ts
import txt from "./test.txt";

console.log(txt);
```

## Options

### `filter`

Type: `RegExp` <br>
Required

The RegExp to match raw file.
