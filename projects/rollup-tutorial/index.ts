import createWorker from "./fib-worker.ts!worker";
import { fib } from "./fib";
import rawText from "./raw.txt";

const worker = createWorker();

function fibonacciInWorker(n: number): Promise<number> {
  const promise = new Promise<number>((resolve) => {
    worker.onmessage = (event) => {
      resolve(event.data);
    };
  });

  worker.postMessage(n);

  return promise;
}

function fibonacci(n: number): number {
  return fib(n);
}

export { fibonacciInWorker, fibonacci, rawText };
