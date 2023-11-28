[npm]: https://img.shields.io/npm/v/babel-plugin-stump
[npm-url]: https://www.npmjs.com/package/babel-plugin-stump

[![npm][npm]][npm-url]

# babel-plugin-stump

🍣 A Babel plugin to build coverage.

## Requirements

This plugin requires an [LTS](https://github.com/nodejs/Release) Node version (v14.0.0+) and Babel v7.0.0+.

## Install

Using pnpm:

```console
pnpm add esbuild-plugin-stump -D
```

## Usage

### Babel Config

```json
{
  "presets": [["@babel/preset-env"]],
  "plugins": [
    [
      "@babel/plugin-transform-runtime",
      {
        "corejs": 3
      }
    ]
  ],
  "env": {
    "cover": {
      "plugins": ["stump"]
    }
  }
}
```
