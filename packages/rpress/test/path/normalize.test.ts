import { expect, test } from "vitest";
import normalize, {
  normalized2html,
  normalized2rsc,
  normalizeExt,
} from "@/libs/utils/path/normalize";

test("empty", () => {
  expect(normalize("")).toBe("/");
});

test("root", () => {
  expect(normalize("/")).toBe("/");
});

test("underscore", () => {
  expect(normalize("/hello_world")).toBe("/hello_world");
  expect(normalize("/hello_world/")).toBe("/hello_world/");
});

test("with :id", () => {
  expect(normalize("/:id:hello")).toBe("/:id:hello");
  expect(normalize("/:id:wtf/")).toBe("/:id:wtf/");
});

test("single segment", () => {
  expect(normalize("/hello")).toBe("/hello");
  expect(normalize("/hello/")).toBe("/hello/");
});

test("placeholder", () => {
  expect(normalize("/:id")).toBe("/:id");
  expect(normalize("/:id/")).toBe("/:id/");
});

test("double slashes", () => {
  expect(normalize("//hello")).toBe("/hello");
  expect(normalize("//hello//world")).toBe("/hello/world");
});

test("triple slashes", () => {
  expect(normalize("///hello")).toBe("/hello");
  expect(normalize("///hello///world")).toBe("/hello/world");
  expect(normalize("///hello///world///")).toBe("/hello/world/");
});

test("multiple segments", () => {
  expect(normalize("/hello/world")).toBe("/hello/world");
  expect(normalize("/hello//world")).toBe("/hello/world");
  expect(normalize("/hello///world")).toBe("/hello/world");
  expect(normalize("/hello////world///")).toBe("/hello/world/");
});

test("placeholder with multiple segments", () => {
  expect(normalize("/:id/world")).toBe("/:id/world");
  expect(normalize("/:id//world")).toBe("/:id/world");
  expect(normalize("/:id///world")).toBe("/:id/world");
  expect(normalize("/:id////world///")).toBe("/:id/world/");
});

test("placeholder with underscores", () => {
  expect(normalize("/:id_world")).toBe("/:id_world");
  expect(normalize("/:id_world/")).toBe("/:id_world/");
});

test("convert to html path", () => {
  expect(normalized2html("/hello/world")).toBe("/hello/world.html");
  expect(normalized2html("/hello/world/")).toBe("/hello/world/index.html");
  expect(normalized2html("/")).toBe("/index.html");
});

test("convert to rsc path", () => {
  expect(normalized2rsc("/hello/world")).toBe("/hello/world.rsc");
  expect(normalized2rsc("/hello/world/")).toBe("/hello/world/index.rsc");
  expect(normalized2rsc("/")).toBe("/index.rsc");
});

test("normalizeExt .html", () => {
  expect(normalizeExt("/hello/world.html")).toBe("/hello/world");
  expect(normalizeExt("/hello/world/index.html")).toBe("/hello/world/");
});

test("normalizeExt .rsc", () => {
  expect(normalizeExt("/hello/world.rsc")).toBe("/hello/world");
  expect(normalizeExt("/hello/world/index.rsc")).toBe("/hello/world/");
});

test("with underscores with extensions", () => {
  expect(normalizeExt("/hello/world_1.html")).toBe("/hello/world_1");
  expect(normalizeExt("/hello/world_1/index.html")).toBe("/hello/world_1/");
  expect(normalizeExt("/hello/world_1/index.rsc")).toBe("/hello/world_1/");
});

test("exception", () => {
  expect(() => normalizeExt("")).toThrow(Error);
  expect(() => normalizeExt("//hello/world.html")).toThrow(Error);
  expect(() => normalizeExt("///index.wtf")).toThrow(Error);
  expect(() => normalizeExt("/.rsc")).toThrow(Error);
  expect(normalizeExt("/index.html")).toBe("/");
  expect(normalizeExt("/hello/world.wtf")).toBeUndefined();
});
