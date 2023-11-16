import { PluginContext, rollup } from "rollup";
import {
  DEFAULT_AUDIO_WORKLET_MARK,
  DEFAULT_AUDIO_WORKLET_REGEXP,
  DEFAULT_WEB_WORKER_MARK,
  DEFAULT_WEB_WORKER_REGEXP,
  WorkerPluginOptions,
} from "./worker-storage";

function onTransformWebWorker(data: string, { inline }: WorkerPluginOptions) {
  return inline
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
}

function onTransformAudioWorklet(data: string, { inline }: WorkerPluginOptions) {
  return inline
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
}

async function onResolveWebWorkerId(
  ctx: PluginContext,
  source: string,
  importer: string | undefined,
  { keepImportName, filter }: WorkerPluginOptions
) {
  const entry = keepImportName ? source : source.replace(filter, "");
  const resolved = await ctx.resolve(entry, importer);

  if (resolved) {
    return `${resolved.id}${DEFAULT_WEB_WORKER_MARK}`;
  }
}

async function onResolveAudioWorkletId(
  ctx: PluginContext,
  source: string,
  importer: string | undefined,
  { keepImportName, audioWorkletFilter }: WorkerPluginOptions
) {
  const entry = keepImportName ? source : source.replace(audioWorkletFilter, "");
  const resolved = await ctx.resolve(entry, importer);

  if (resolved) {
    return `${resolved.id}${DEFAULT_AUDIO_WORKLET_MARK}`;
  }
}

async function onBuildWebWorkerLoad(id: string, options: WorkerPluginOptions) {
  return onBuildLoad(id.replace(DEFAULT_WEB_WORKER_REGEXP, ""), options);
}

async function onBuildAudioWorkletLoad(id: string, options: WorkerPluginOptions) {
  return onBuildLoad(id.replace(DEFAULT_AUDIO_WORKLET_REGEXP, ""), options);
}

async function onBuildLoad(
  input: string,
  { inline, out, plugins }: WorkerPluginOptions
) {
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

    return chunk;
  } finally {
    bundle.close();
  }
}

export {
  onTransformWebWorker,
  onTransformAudioWorklet,
  onResolveWebWorkerId,
  onResolveAudioWorkletId,
  onBuildWebWorkerLoad,
  onBuildAudioWorkletLoad,
};
