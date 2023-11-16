import {
  OnLoadArgs,
  OnLoadResult,
  OnResolveArgs,
  OnResolveResult,
  PluginBuild,
} from "esbuild";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const PLUGIN_NAME = "name:raw2";
const PLUGIN_NAMESPACE = "namespace:Raw2";

interface RawPluginOptions {
  filter: RegExp;
}

function raw(options: RawPluginOptions) {
  const { filter } = options;

  function onSetup(build: PluginBuild) {
    build.onResolve({ filter }, onBuildResolve);
    build.onLoad({ filter: /.*/, namespace: PLUGIN_NAMESPACE }, onBuildLoad);
  }

  function onBuildResolve(args: OnResolveArgs): OnResolveResult {
    return {
      path: args.path,
      namespace: PLUGIN_NAMESPACE,
      pluginData: {
        importer: args.importer,
        resolveDir: args.resolveDir,
      },
    };
  }

  function createContents(data: string) {
    const rawText = JSON.stringify(data)
      .replace(/\u2028/g, "\\u2028")
      .replace(/\u2029/g, "\\u2029");

    return `export default ${rawText};`;
  }

  async function onBuildLoad(
    args: OnLoadArgs
  ): Promise<OnLoadResult | undefined> {
    const {
      path: importPath,
      pluginData: { resolveDir },
    } = args;

    const entry = join(resolveDir, importPath);

    try {
      const data: string = readFileSync(entry, "utf-8");

      return {
        contents: createContents(data),
      };
    } catch (e) {
      console.error("Handler raw file failed:", e);
    }
  }

  const RawWorkerPlugin = {
    name: PLUGIN_NAME,
    setup: onSetup,
  };

  return RawWorkerPlugin;
}

export default raw;
