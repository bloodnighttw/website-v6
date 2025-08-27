import { Counter } from "../counter";

export default async function WTF() {
  return (
    <>
      <h1>A showcase of client component</h1>
      <h1>if we don't hoisted under pnpm-workspace.yaml</h1>
      <h1>console will have error and this client component cannot do anything</h1>
      <Counter />
    </>
  );
}
