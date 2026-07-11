import { test, expect } from "bun:test";
import { getInfo, getLanguageMap, getContributions } from "../utils";
import { Contributions } from "../types/interfaces";


test("getLanguageMap aggregates language sizes correctly", async () => {
    const result = await getLanguageMap("neozmmv", process.env.GITHUB_TOKEN ?? "");
    console.log(result);
    expect(result).not.toBeNull();
}, 15000);

test("getInfo results", async () => {
    const result = await getInfo("neozmmv", process.env.GITHUB_TOKEN ?? "")
    console.log(result)
    expect(result).not.toBeNull()
}, 10000)

test("contribution results", async () => {
    const contributions: Contributions = await getContributions("neozmmv", process.env.GITHUB_TOKEN)
    console.log(contributions)
    expect(contributions).not.toBeNull()
}, 10000)