import { assert, test } from "vitest";
import { normalize } from "../src/utils/path";

test("pathNormalize", () => {

    const testCase = [
        "",
        "/hi",
        "/hi/",
        "/hi/there.html",
        "/hi/there/",
        "/hi.rsc",
    ]

    const expected = [
        "/index",
        "/hi",
        "/hi/index",
        "/hi/there",
        "/hi/there/index",
        "/hi",
    ]

    for (let i = 0; i < testCase.length; i++) {
        const result = normalize(testCase[i]);
        assert.equal(result, expected[i]);
    }

})