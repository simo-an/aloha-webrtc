declare module "*worker" {
  const createWorker: () => Worker;
  export default createWorker;
}
declare module "*audio-worklet" {
  const createAudioWorkletNode: () => AudioWorkletNode;
  export default createAudioWorkletNode;
}
