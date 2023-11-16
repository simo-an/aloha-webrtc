import { Plugin, PluginContext } from "rollup";
import { resolve } from "node:path";
import { readFileSync } from "node:fs";

const PLUGIN_NAME = "Raw";

interface RawPluginOptions {
  filter: RegExp;
}

function raw(options: RawPluginOptions): Plugin {
  async function onResolveId(
    this: PluginContext,
    source: string,
    importer: string | undefined
  ) {
    if (!importer || !options.filter.test(source)) {
      return;
    }

    return resolve(importer, "..", source.replace(/^\.\.?\//, ""));
  }

  function createContents(data: string) {
    const json = JSON.stringify(data)
      .replace(/\u2028/g, "\\u2028")
      .replace(/\u2029/g, "\\u2029");

    return `export default ${json};`;
  }

  function onTransform(this: PluginContext, code: string, id: string) {
    if (!options.filter.test(id)) {
      return;
    }

    const filePath = resolve(process.cwd(), id);
    const fileContent = readFileSync(filePath, "utf-8");

    return createContents(fileContent);
  }

  return {
    name: PLUGIN_NAME,
    resolveId: onResolveId,
    transform: onTransform,
  } as Plugin;
}

export default raw;
