import { Plugin } from "rollup";

const PLUGIN_NAME = "name:worker";

const DEFAULT_WEB_WORKER_REGEXP = /\?worker$/i;
const DEFAULT_WEB_WORKER_MARK = "?worker";
const DEFAULT_AUDIO_WORKLET_REGEXP = /\?audio-worklet$/i;
const DEFAULT_AUDIO_WORKLET_MARK = "?audio-worklet";

interface WorkerPluginOptions {
  inline: boolean;
  out: string;
  useTerser: boolean;
  useTs: boolean;
  useNodeResolve: boolean;
  useJson: boolean;
  filter: RegExp;
  audioWorkletFilter: RegExp;
  keepImportName: boolean;
  plugins: Plugin[];

  commonjsPlugin?: Plugin;
  terserPlugin?: Plugin;
  tsPlugin?: Plugin;
  nodeResolvePlugin?: Plugin;
  jsonPlugin?: Plugin;
}

const defaultOptions: WorkerPluginOptions = {
  inline: true,
  out: "dist",
  useTerser: true,
  useTs: true,
  useNodeResolve: false,
  useJson: false,
  filter: DEFAULT_WEB_WORKER_REGEXP,
  audioWorkletFilter: DEFAULT_AUDIO_WORKLET_REGEXP,
  keepImportName: false,
  plugins: [],
};

export {
  PLUGIN_NAME,
  defaultOptions,
  DEFAULT_AUDIO_WORKLET_MARK,
  DEFAULT_WEB_WORKER_MARK,
  DEFAULT_WEB_WORKER_REGEXP,
  DEFAULT_AUDIO_WORKLET_REGEXP,
};
export type { WorkerPluginOptions };
