import { test, expect } from "bun:test";
import { getInfo, getLanguageMap, getTotalContributions, getTotalStarCount } from "../utils";


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

test("stargazerCount results", async () => {
    const stars = await getTotalStarCount("neozmmv", process.env.GITHUB_TOKEN)
    console.log(`TOTAL STAR COUNT: ${stars}`)
    expect(stars).not.toBe(0)
}, 10000)

test("allContributions results", async () => {
    const allContribs = await getTotalContributions("neozmmv", process.env.GITHUB_TOKEN)
    console.log(`ALL CONTRIBS: ${allContribs}`)
    expect(allContribs).not.toBe(0)
}, 10000)