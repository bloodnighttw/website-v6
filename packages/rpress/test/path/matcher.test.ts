import { expect, test } from "vitest";
import { Matcher } from "../../src/utils/path/matcher";

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
  expect(result4).toEqual({id: "123"});

  const results5 = matcher.match("/users/123/index.html");
  expect(results5).toEqual({id: "123"});

  const results6 = matcher.match("/users/123/index.WTF");
  expect(results6).toEqual(false);

  const results7 = matcher.match("/users/123/index.rsc");
  expect(results7).toEqual({id: "123"});

});
