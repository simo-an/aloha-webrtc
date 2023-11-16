[npm]: https://img.shields.io/npm/v/rollup-plugin-raw
[npm-url]: https://www.npmjs.com/package/rollup-plugin-raw

[![npm][npm]][npm-url]

# rollup-plugin-raw

🍣 A Rollup plugin to handler raw file.

## Requirements

This plugin requires an [LTS](https://github.com/nodejs/Release) Node version (v14.0.0+) and Rollup v3.0.0+.

## Install

Using pnpm:

```console
pnpm add rollup-plugin-raw -D
```

## Usage

### Rollup Config

```js
import { defineConfig } from "rollup";
import raw from "rollup-plugin-raw";

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
