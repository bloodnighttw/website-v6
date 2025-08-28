import { expect, test } from "vitest";
import { path2RegExp } from "../src/utils/path2regexp";

test("test single parameter", () => {
  // Example usage for /:id/a pattern
  const matcher1 = path2RegExp("/:id/a");
  console.log("Pattern 1:", "/:id/a");
  console.log("RegExp:", matcher1.regexp);
  console.log();

  // Test cases for /:id/a
  const testPaths1: string[] = [
    "/123/a", // Should match with id = "123"
    "/user-456/a", // Should match with id = "user-456"
    "/abc/a", // Should match with id = "abc"
    "/123/b", // Should NOT match (wrong ending)
    "/123/a/extra", // Should NOT match (extra path)
    "/123", // Should NOT match (missing /a)
    "123/a", // Should NOT match (missing leading /)
  ];

  const resultArr = [{ id: "123" }, { id: "user-456" }, { id: "abc" }];

  testPaths1.forEach((path: string, index: number) => {
    const result = matcher1.exec(path);
    const exceptResult = resultArr.at(index);
    if (exceptResult) {
      expect(result?.params).toEqual(exceptResult);
    } else {
      expect(result).toBeNull();
    }
  });
});

test("test multiple parameters 1", () => {
  const matcher2 = path2RegExp("/:lang/:id");
  console.log("Pattern 2:", "/:lang/:id");
  console.log("RegExp:", matcher2.regexp);
  console.log();

  console.log();

  // Test cases for /:lang/:id
  const testPaths2: string[] = [
    "/en/123", // Should match with lang = "en", id = "123"
    "/fr/user-456", // Should match with lang = "fr", id = "user-456"
    "/es/abc", // Should match with lang = "es", id = "abc"
    "/zh-cn/product-789", // Should match with lang = "zh-cn", id = "product-789"
    "/en", // Should NOT match (missing id)
    "/en/123/extra", // Should NOT match (extra path)
    "en/123", // Should NOT match (missing leading /)
    "/en/", // Should NOT match (empty id)
  ];

  const resultArr = [
    { lang: "en", id: "123" },
    { lang: "fr", id: "user-456" },
    { lang: "es", id: "abc" },
    { lang: "zh-cn", id: "product-789" },
  ];

  console.log("Test Results for /:lang/:id:");
  testPaths2.forEach((path: string, index: number) => {
    const result = matcher2.exec(path);
    const exceptResult = resultArr.at(index);
    if (exceptResult) {
      expect(result?.params).toEqual(exceptResult);
    } else {
      expect(result).toBeNull();
    }
  });
});

test("test multiple parameters 2", () => {
  const matcher2 = path2RegExp("/a/:lang/:id");
  console.log("Pattern 2:", "/a/:lang/:id");
  console.log("RegExp:", matcher2.regexp);
  console.log();

  console.log();

  // Test cases for /a/:lang/:id
  const testPaths2: string[] = [
    "/a/en/123", // Should match with lang = "en", id = "123"
    "/a/fr/user-456", // Should match with lang = "fr", id = "user-456"
    "/a/es/abc", // Should match with lang = "es", id = "abc"
    "/a/zh-cn/product-789", // Should match with lang = "zh-cn", id = "product-789"
    "/a/en", // Should NOT match (missing id)
    "/a/en/123/extra", // Should NOT match (extra path)
    "/a/en/", // Should NOT match (empty id)
  ];

  const resultArr = [
    { lang: "en", id: "123" },
    { lang: "fr", id: "user-456" },
    { lang: "es", id: "abc" },
    { lang: "zh-cn", id: "product-789" },
  ];

  testPaths2.forEach((path: string, index: number) => {
    const result = matcher2.exec(path);
    const ans = resultArr.at(index);
    if (ans) {
      expect(result?.params).toEqual(ans);
    } else {
      expect(result).toBeNull();
    }
  });
});

test("test no parameters", () => {
  const matcher3 = path2RegExp("/home");
  console.log("Pattern 3:", "/home");
  console.log("RegExp:", matcher3.regexp);
  console.log();

  // Test cases for /home
  const testPaths3= [
    "/home", // Should match
    "/home/", // Should NOT match (trailing slash)
    "/home/extra", // Should NOT match (extra path)
    "home", // Should NOT match (missing leading /)
  ];

  const resultArr = [
    {}
  ];

  console.log("Test Results for /home:");
  testPaths3.forEach((path: string, index: number) => {
    const result = matcher3.exec(path);
    const exceptResult = resultArr.at(index);
    if (exceptResult) {
      expect(result?.params).toEqual(exceptResult);
    } else {
      expect(result).toBeNull();
    }
  });
});

test("test index route", () => {
  const matcher4 = path2RegExp("/");
  console.log("Pattern 4:", "/");
  console.log("RegExp:", matcher4.regexp);
  console.log();

  // Test cases for /
  const testPaths4: string[] = [
    // "", // this also should be match
    "/", // Should match
    "/home", // Should NOT match (extra path)
    "home", // Should NOT match (missing leading /)
  ];

  const resultArr = [
    // {  },
    {  }
  ];

  console.log("Test Results for /:");
  testPaths4.forEach((path: string, index: number) => {
    const result = matcher4.exec(path);
    const exceptResult = resultArr.at(index);
    if (exceptResult) {
      expect(result?.params).toEqual(exceptResult);
    } else {
      expect(result).toBeNull();
    }
  });
})
