import { test, expect } from "bun:test";
import { getLanguageMap } from "../utils";


test("getLanguageMap aggregates language sizes correctly", async () => {
    const result = await getLanguageMap("neozmmv", process.env.GITHUB_TOKEN ?? "");
    console.log(result);
    expect(result).not.toBeNull();
}, 15000);