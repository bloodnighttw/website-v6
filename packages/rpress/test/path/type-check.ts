import type { InferPathParams } from "@/libs/utils/path/matcher";

const caseA: InferPathParams<"/users/:id"> = { id: "123" };
const caseB: InferPathParams<"/users/:id:wtf"> = { "id:wtf": "123" };
const caseC: InferPathParams<"/users/:id:wtf/:name"> = {
  "id:wtf": "123",
  name: "John",
};
const caseD: InferPathParams<"/users//:id:wtf/:name:age"> = {
  "id:wtf": "123",
  "name:age": "30",
};
const caseE: InferPathParams<"/users/:id:wtf/"> = { "id:wtf": "123" };
const caseF: InferPathParams<"/users/:id/:name"> = { id: "123", name: "John" };
const caseG: InferPathParams<":id"> = { id: "123" };
const caseH: InferPathParams<":id:wtf/"> = { "id:wtf": "123" };

// New test cases for catch-all parameters
const caseI: InferPathParams<"/files/:...segments"> = {
  segments: ["docs", "guide"],
};
const caseJ: InferPathParams<"/api/:version/files/:...path"> = {
  version: "v1",
  path: ["docs", "guide.pdf"],
};
const caseK: InferPathParams<"/:...catch"> = { catch: ["any", "path", "here"] };
const caseL: InferPathParams<"/users/:id/:...rest"> = {
  id: "123",
  rest: ["profile", "settings"],
};

export {
  caseA,
  caseB,
  caseC,
  caseD,
  caseE,
  caseF,
  caseG,
  caseH,
  caseI,
  caseJ,
  caseK,
  caseL,
};
