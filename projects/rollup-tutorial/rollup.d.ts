declare module "*!worker" {
  const code: () => Worker;
  export default code;
}

declare module "*.txt" {
  const value: string;
  export default value;
}
