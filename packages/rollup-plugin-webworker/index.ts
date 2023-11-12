import { rollup, Plugin, PluginContext } from "rollup";
import commonjs from "@rollup/plugin-commonjs";
import terser from "@rollup/plugin-terser";

const PLUGIN_NAME = "web-worker";

interface WebWorkerPluginOptions {
  inline: boolean;
  out: string;
  minify: boolean;
  filter: RegExp;
  keepImportName: boolean;
  plugins: Plugin[];
}

const defaultOptions: WebWorkerPluginOptions = {
  inline: true,
  out: "dist",
  minify: true,
  filter: /\?worker$/,
  keepImportName: false,
  plugins: [],
};

function webworker(options?: Partial<WebWorkerPluginOptions>) {
  const { inline, out, minify, filter, keepImportName, plugins } = {
    ...defaultOptions,
    ...options,
  };

  plugins.push(commonjs());

  if (minify) {
    plugins.push(terser());
  }

  async function onResolveId(
    this: PluginContext,
    source: string,
    importer: string | undefined
  ) {
    if (!filter.test(source)) {
      return;
    }

    const entry = keepImportName ? source : source.replace(filter, "");
    const resolved = await this.resolve(entry, importer);

    if (!resolved) {
      throw new Error(`Cannot find ${entry}`);
    }

    return `${resolved.id}?worker`;
  }

  async function onLoad(this: PluginContext, id: string) {
    if (!defaultOptions.filter.test(id)) {
      return;
    }

    const input = id.replace(defaultOptions.filter, "");
    const bundle = await rollup({ input, plugins });

    try {
      const {
        output: [chunk],
      } = await bundle.generate({ format: "esm" });

      if (!inline) {
        await bundle.write({
          file: `${out}/${chunk.fileName}`,
          format: "esm",
        });

        chunk.code = `${out}/${chunk.fileName}`;
      }

      console.warn("onLoad", chunk);

      return chunk;
    } finally {
      bundle.close();
    }
  }

  function createContents(data: string) {
    return inline
      ? `
        function createWorker() {
          const blob = new Blob([\`${data}\`], { type: 'text/javascript' });
          setTimeout(() => URL.revokeObjectURL(blob), 0);
          
          return new Worker(URL.createObjectURL(blob));
        }
        export default createWorker;`
      : `
        function createWorker() {
          return new Worker(\`${data.replaceAll("\\", "/")}\`);
        }
        export default createWorker;`;
  }

  function onTransform(this: PluginContext, code: string, id: string) {
    if (!defaultOptions.filter.test(id)) {
      return;
    }

    return createContents(code);
  }

  return {
    name: PLUGIN_NAME,
    resolveId: onResolveId,
    load: onLoad,
    transform: onTransform,
  } as Plugin;
}

export default webworker;
