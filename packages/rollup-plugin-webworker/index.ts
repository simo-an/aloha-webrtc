import { rollup, Plugin, PluginContext } from "rollup";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import nodeResolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
import {
  DEFAULT_AUDIO_WORKLET_REGEXP,
  DEFAULT_WEB_WORKER_REGEXP,
  PLUGIN_NAME,
  WorkerPluginOptions,
  defaultOptions,
} from "./worker/worker-storage";
import {
  onBuildAudioWorkletLoad,
  onBuildWebWorkerLoad,
  onResolveAudioWorkletId,
  onResolveWebWorkerId,
  onTransformAudioWorklet,
  onTransformWebWorker,
} from "./worker/worker-handler";

function webworker(options?: Partial<WorkerPluginOptions>): Plugin {
  const fullOptions = {
    ...defaultOptions,
    ...options,
  } as WorkerPluginOptions;

  const {
    filter,
    audioWorkletFilter,
    plugins,
    useJson,
    useNodeResolve,
    useTerser,
    useTs,
    commonjsPlugin,
    jsonPlugin,
    nodeResolvePlugin,
    tsPlugin,
    terserPlugin,
  } = fullOptions;

  plugins.unshift(commonjsPlugin || commonjs());

  if (useJson) {
    plugins.unshift(jsonPlugin || json());
  }
  if (useNodeResolve) {
    plugins.unshift(nodeResolvePlugin || nodeResolve());
  }
  if (useTs) {
    plugins.push(tsPlugin || typescript());
  }
  if (useTerser) {
    plugins.push(terserPlugin || terser());
  }

  async function onResolveId(
    this: PluginContext,
    source: string,
    importer: string | undefined
  ) {
    if (filter.test(source)) {
      return onResolveWebWorkerId(this, source, importer, fullOptions);
    }
    if (audioWorkletFilter.test(source)) {
      return onResolveAudioWorkletId(this, source, importer, fullOptions);
    }
  }

  async function onLoad(this: PluginContext, id: string) {
    if (DEFAULT_WEB_WORKER_REGEXP.test(id)) {
      return onBuildWebWorkerLoad(id, fullOptions);
    }
    if (DEFAULT_AUDIO_WORKLET_REGEXP.test(id)) {
      return onBuildAudioWorkletLoad(id, fullOptions);
    }
  }

  function onTransform(code: string, id: string) {
    if (DEFAULT_WEB_WORKER_REGEXP.test(id)) {
      return onTransformWebWorker(code, fullOptions);
    }
    if (DEFAULT_AUDIO_WORKLET_REGEXP.test(id)) {
      return onTransformAudioWorklet(code, fullOptions);
    }
  }

  return {
    name: PLUGIN_NAME,
    resolveId: onResolveId,
    load: onLoad,
    transform: onTransform,
  } as Plugin;
}

export default webworker;
