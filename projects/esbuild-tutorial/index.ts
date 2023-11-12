import createWorker from "./fib.ts?worker";

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
  if (n === 0) {
    return 0;
  }
  if (n === 1 || n === 2) {
    return 1;
  }

  return fibonacci(n - 1) + fibonacci(n - 2);
}

export { fibonacciInWorker, fibonacci };
