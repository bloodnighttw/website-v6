import { Counter } from "../counter";

export default async function WTF({message}: {message: string}) {
  return (
    <>
      <h1>A showcase of client component</h1>
      <p>if we don't hoisted under pnpm-workspace.yaml</p>
      <div>{message}</div>
      <p>console will have error and this client component cannot do anything</p>
      <div style={{
        display: "flex",
        gap: 20,
        marginBottom: 20,
      }}>
        <a href="/ouo">go to /ouo</a>
        <a href="/">go to /</a>
        <a href="/test">go to /test</a>
      </div>
      <Counter />
    </>
  );
}
