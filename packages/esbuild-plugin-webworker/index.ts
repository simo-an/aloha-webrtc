import { OnLoadArgs, OnResolveArgs, PluginBuild } from "esbuild";
import {
  PLUGIN_NAME,
  PLUGIN_NAMESPACE_AUDIO_WORKLET_NODE,
  PLUGIN_NAMESPACE_WEBWORKER,
  WorkerPluginOptions,
  defaultOptions,
} from "./worker/worker-storage";
import {
  onBuildAudioWorkletLoad,
  onBuildAudioWorkletResolve,
  onBuildWebWorkerLoad,
  onBuildWebWorkerResolve,
} from "./worker/worker-handler";

function webworker(options?: Partial<WorkerPluginOptions>) {
  const fullOptions = {
    ...defaultOptions,
    ...options,
  };

  const { filter, audioWorkletFilter } = fullOptions as WorkerPluginOptions;

  function onSetup(build: PluginBuild) {
    build.onResolve({ filter }, (args: OnResolveArgs) => {
      return onBuildWebWorkerResolve(args, fullOptions);
    });
    build.onResolve({ filter: audioWorkletFilter }, (args: OnResolveArgs) => {
      return onBuildAudioWorkletResolve(args, fullOptions);
    });
    build.onLoad(
      { filter, namespace: PLUGIN_NAMESPACE_WEBWORKER },
      (args: OnLoadArgs) => {
        return onBuildWebWorkerLoad(args, fullOptions);
      }
    );
    build.onLoad(
      {
        filter: audioWorkletFilter,
        namespace: PLUGIN_NAMESPACE_AUDIO_WORKLET_NODE,
      },
      (args: OnLoadArgs) => {
        return onBuildAudioWorkletLoad(args, fullOptions);
      }
    );
  }

  const WebWorkerPlugin = {
    name: PLUGIN_NAME,
    setup: onSetup,
  };

  return WebWorkerPlugin;
}

export default webworker;
