import { expect, test } from "vitest";
import { Matcher } from "@/libs/utils/path/matcher";

test("Matcher class should match paths correctly", () => {
  const matcher = new Matcher("/users/:id");

  // Test matching a valid path
  const result = matcher.match("/users/123.html");
  expect(result).toEqual({ id: "123" });

  // Test matching an invalid path
  const result2 = matcher.match("/users/");
  expect(result2).toBe(false);

  const result3 = matcher.match("/users/123.rsc");
  expect(result3).toEqual({ id: "123" });
});

test("Matcher class should handle index paths", () => {
  const matcher = new Matcher("/users/:id");

  // Test matching a valid index path
  const result = matcher.match("/users/123.html");
  expect(result).toEqual({ id: "123" });

  const result2 = matcher.match("/users/123");
  expect(result2).toEqual({ id: "123" });

  const result3 = matcher.match("/users/123.rsc");
  expect(result3).toEqual({ id: "123" });
});

test("Matcher should handle between index/params path", () => {
  const matcher = new Matcher("/users/:id/");

  // Test matching a valid index path
  const result = matcher.match("/users/123.html");
  expect(result).toEqual(false);

  const result2 = matcher.match("/users/123");
  expect(result2).toEqual(false);

  const result3 = matcher.match("/users/123.rsc");
  expect(result3).toEqual(false);

  const result4 = matcher.match("/users/123/");
  expect(result4).toEqual({ id: "123" });

  const results5 = matcher.match("/users/123/index.html");
  expect(results5).toEqual({ id: "123" });

  const results6 = matcher.match("/users/123/index.WTF");
  expect(results6).toEqual(false);

  const results7 = matcher.match("/users/123/index.rsc");
  expect(results7).toEqual({ id: "123" });
});

test("Matcher should handle :", () => {
  const matcher = new Matcher("/users/:id:wtf/");

  // Test matching a valid index path
  const result = matcher.match("/users/123.html");
  expect(result).toEqual(false);

  const result2 = matcher.match("/users/123");
  expect(result2).toEqual(false);

  const result3 = matcher.match("/users/123.rsc");
  expect(result3).toEqual(false);

  const result4 = matcher.match("/users/123/");
  expect(result4).toEqual({ "id:wtf": "123" });

  const results5 = matcher.match("/users/123/index.html");
  expect(results5).toEqual({ "id:wtf": "123" });

  const results6 = matcher.match("/users/123/index.WTF");
  expect(results6).toEqual(false);

  const results7 = matcher.match("/users/123/index.rsc");
  expect(results7).toEqual({ "id:wtf": "123" });
});

test("Matcher should handle catch-all parameters", () => {
  const matcher = new Matcher("/files/:...segments");

  // Test matching empty catch-all
  const result1 = matcher.match("/files/");
  expect(result1).toEqual({ segments: [] });

  // Test matching single segment
  const result2 = matcher.match("/files/docs");
  expect(result2).toEqual({ segments: ["docs"] });

  // Test matching multiple segments
  const result3 = matcher.match("/files/docs/guides/setup");
  expect(result3).toEqual({ segments: ["docs", "guides", "setup"] });

  // Test with extensions
  const result4 = matcher.match("/files/docs/guides/setup.html");
  expect(result4).toEqual({ segments: ["docs", "guides", "setup"] });

  const result5 = matcher.match("/files/docs/guides/setup.rsc");
  expect(result5).toEqual({ segments: ["docs", "guides", "setup"] });
});

test("Matcher should handle mixed parameters", () => {
  const matcher = new Matcher("/api/:version/files/:...path");

  // Test matching with both regular and catch-all params
  const result1 = matcher.match("/api/v1/files/docs/guide.pdf");
  expect(result1).toEqual({
    version: "v1",
    path: ["docs", "guide.pdf"],
  });

  const result2 = matcher.match("/api/v2/files/");
  expect(result2).toEqual({
    version: "v2",
    path: [],
  });

  const result3 = matcher.match("/api/v1/files/single-file");
  expect(result3).toEqual({
    version: "v1",
    path: ["single-file"],
  });
});

test("Matcher toString should work with arrays", () => {
  const matcher = new Matcher("/files/:...segments");

  // Test empty array
  const path1 = matcher.toString({ segments: [] });
  expect(path1).toBe("/files/");

  // Test single segment
  const path2 = matcher.toString({ segments: ["docs"] });
  expect(path2).toBe("/files/docs");

  // Test multiple segments
  const path3 = matcher.toString({ segments: ["docs", "guides", "setup"] });
  expect(path3).toBe("/files/docs/guides/setup");
});

test("Matcher toString should work with mixed parameters", () => {
  const matcher = new Matcher("/api/:version/files/:...path");

  const path1 = matcher.toString({
    version: "v1",
    path: ["docs", "guide.pdf"],
  });
  expect(path1).toBe("/api/v1/files/docs/guide.pdf");

  const path2 = matcher.toString({
    version: "v2",
    path: [],
  });
  expect(path2).toBe("/api/v2/files/");
});

test("Matcher should handle catch-all with trailing literal segments", () => {
  const matcher = new Matcher("/ouo/:...other/aa");

  // Test matching with empty catch-all
  const result1 = matcher.match("/ouo/aa");
  expect(result1).toEqual({ other: [] });

  // Test matching with single segment in catch-all
  const result2 = matcher.match("/ouo/path/aa");
  expect(result2).toEqual({ other: ["path"] });

  // Test matching with multiple segments in catch-all
  const result3 = matcher.match("/ouo/path/to/resource/aa");
  expect(result3).toEqual({ other: ["path", "to", "resource"] });

  // Test non-matching paths
  const result4 = matcher.match("/ouo/path/bb");
  expect(result4).toBe(false);

  const result5 = matcher.match("/ouo/");
  expect(result5).toBe(false);

  // Test with extensions
  const result6 = matcher.match("/ouo/aa.html");
  expect(result6).toEqual({ other: [] });

  const result7 = matcher.match("/ouo/path/to/resource/aa.rsc");
  expect(result7).toEqual({ other: ["path", "to", "resource"] });
});

test("Matcher toString should work with catch-all and trailing segments", () => {
  const matcher = new Matcher("/ouo/:...other/aa");

  // Test empty array
  const path1 = matcher.toString({ other: [] });
  expect(path1).toBe("/ouo/aa");

  // Test single segment
  const path2 = matcher.toString({ other: ["path"] });
  expect(path2).toBe("/ouo/path/aa");

  // Test multiple segments
  const path3 = matcher.toString({ other: ["path", "to", "resource"] });
  expect(path3).toBe("/ouo/path/to/resource/aa");
});
