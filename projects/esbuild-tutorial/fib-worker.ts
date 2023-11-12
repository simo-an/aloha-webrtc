import { fib } from "./fib";

self.onmessage = (e) => {
  const num = Number(e.data);
  const result = fib(num);

  console.info("result: ", result);

  self.postMessage(result);
};
