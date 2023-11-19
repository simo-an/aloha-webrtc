import { basename, dirname, join } from "node:path";
import esbuild, { BuildOptions, OnLoadArgs, OnResolveArgs } from "esbuild";
import {
  WorkerPluginOptions,
  PLUGIN_NAMESPACE_WEBWORKER,
  PLUGIN_NAMESPACE_AUDIO_WORKLET_NODE,
} from "./worker-storage";

function onBuildWebWorkerResolve(args: OnResolveArgs, options: WorkerPluginOptions) {
  return {
    path: options.keepImportName ? args.path : args.path.replace(options.filter, ""),
    namespace: PLUGIN_NAMESPACE_WEBWORKER,
    pluginData: { importer: args.importer },
  };
}

function onBuildAudioWorkletResolve(args: OnResolveArgs, options: WorkerPluginOptions) {
  return {
    path: options.keepImportName
      ? args.path
      : args.path.replace(options.audioWorkletFilter, ""),
    namespace: PLUGIN_NAMESPACE_AUDIO_WORKLET_NODE,
    pluginData: { importer: args.importer },
  };
}

async function onBuildWebWorkerLoad(args: OnLoadArgs, options: WorkerPluginOptions) {
  const data = await onBuildLoad(args, options);

  if (!data) {
    return;
  }

  const contents = options.inline
    ? `
    function createWorker() {
      const blob = new Blob([atob(\`${btoa(data)}\`)], { type: 'text/javascript' });
      setTimeout(() => URL.revokeObjectURL(blob), 0);
      
      return new Worker(URL.createObjectURL(blob));
    }
    export default createWorker;`
    : `
    function createWorker() {
      return new Worker(\`${data.replaceAll("\\", "/")}\`);
    }
    export default createWorker;`;

  return { contents };
}

async function onBuildAudioWorkletLoad(args: OnLoadArgs, options: WorkerPluginOptions) {
  const data = await onBuildLoad(args, options);

  if (!data) {
    return;
  }

  const contents = options.inline
    ? `
    async function createAudioWorkletNode(context, name) {
      const blob = new Blob([atob(\`${btoa(data)}\`)], { type: 'text/javascript' });
      await context.audioWorklet.addModule(URL.createObjectURL(blob));
      
      setTimeout(() => URL.revokeObjectURL(blob), 0);
      
      return new AudioWorkletNode(context, name);
    }
    export default createAudioWorkletNode;`
    : `
    async function createAudioWorkletNode(context, name) {
      const url = \`${data.replaceAll("\\", "/")}\`;
      await context.audioWorklet.addModule(url);

      return new AudioWorkletNode(context, name);
    }
    export default createAudioWorkletNode;`;

  return { contents };
}

async function onBuildLoad(args: OnLoadArgs, options: WorkerPluginOptions) {
  const {
    path: importPath,
    pluginData: { importer },
  } = args;

  const entry = join(dirname(importer), importPath);

  try {
    const buildOptions: BuildOptions = {
      entryPoints: [entry],
      write: !options.inline,
      minify: options.minify,
      bundle: true,
    };

    if (!options.inline) {
      const fileName = basename(entry);
      const outFileName = fileName.replace(/(\.ts)?$/, ".js");

      buildOptions.outfile = join(options.out, outFileName);
    }

    const result = await esbuild.build(buildOptions);

    let data: string | undefined;

    if (!options.inline && buildOptions.outfile) {
      data = buildOptions.outfile;
    }

    if (options.inline && result.outputFiles) {
      data = result.outputFiles[0].text;
    }

    return data;
  } catch (e) {
    console.error("build worker failed:", e);
  }
}

export {
  onBuildWebWorkerResolve,
  onBuildAudioWorkletResolve,
  onBuildAudioWorkletLoad,
  onBuildWebWorkerLoad,
};
