self.onmessage = (e) => {
  const userNum = Number(e.data);
  const result = fib(userNum);

  self.postMessage(result);
};

function fib(n: number): number {
  if (n === 0) {
    return 0;
  }
  if (n === 1 || n === 2) {
    return 1;
  }

  return fib(n - 1) + fib(n - 2);
}
