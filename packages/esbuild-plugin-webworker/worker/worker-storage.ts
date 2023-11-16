const PLUGIN_NAME = "name:worker";
const PLUGIN_NAMESPACE_WEBWORKER = "namespace:WebWorker";
const PLUGIN_NAMESPACE_AUDIO_WORKLET_NODE = "namespace:AudioWorkletNode";

interface WorkerPluginOptions {
  inline: boolean;
  out: string;
  minify: boolean;
  filter: RegExp;
  audioWorkletFilter: RegExp;
  keepImportName: boolean;
}

const defaultOptions: WorkerPluginOptions = {
  inline: true,
  out: "dist",
  minify: true,
  filter: /\?worker$/i,
  audioWorkletFilter: /\?audio-worklet$/i,
  keepImportName: false,
};

export type { WorkerPluginOptions };
export {
  PLUGIN_NAME,
  PLUGIN_NAMESPACE_WEBWORKER,
  PLUGIN_NAMESPACE_AUDIO_WORKLET_NODE,
  defaultOptions,
};
