import { test, expect } from "bun:test";
import { languagePercentages } from "../utils";


test("languagePercentages aggregates language sizes correctly", async () => {
    const result = await languagePercentages("neozmmv", process.env.GITHUB_TOKEN ?? "");
    console.log(result);
    expect(result).not.toBeNull();
}, 15000);