import { Hono } from "hono";
import Languages from "./Languages";
import Contributions from "./Contributions";

const componentRouter = new Hono<{ Bindings: CloudflareBindings }>();

const SOFT_TTL_MS = 6 * 60 * 60 * 1000       // 6h
const HARD_TTL_SECONDS = 7 * 24 * 60 * 60    // 7d

componentRouter.get("/languages", async (c) => {
    const cache = caches.default
    const cacheKey = new Request(c.req.url, c.req.raw)
    const cached = await cache.match(cacheKey)

    const user = c.req.query("username")
    const bgColor = c.req.query("color")

    async function generateAndCache(): Promise<Response> {
        if (!user) {
            throw new Error("Missing username")
        }

        const svg = await Languages({ username: user, token: c.env.GITHUB_TOKEN, bgColor: bgColor as string })

        const response = new Response(svg, {
            status: 200,
            headers: {
                "Content-Type": "image/svg+xml",
                "Cache-Control": `public, max-age=${HARD_TTL_SECONDS}`,
                "X-Generated-At": Date.now().toString()
            }
        })

        await cache.put(cacheKey, response.clone())
        return response
    }

    if (cached) {
        const generatedAt = Number(cached.headers.get("X-Generated-At") ?? 0)
        const age = Date.now() - generatedAt
        const isStale = age > SOFT_TTL_MS

        if (isStale) {
            // serves current cache and generates new
            c.executionCtx.waitUntil(generateAndCache())
        }

        return cached
    }

    // never generated
    if (!user) {
        return c.json({ error: "Provide ?username parameter" }, 400)
    }

    return generateAndCache()
})

componentRouter.get("/contributions", async (c) => {
    const cache = caches.default
    const cacheKey = new Request(c.req.url, c.req.raw)
    const cached = await cache.match(cacheKey)

    const user = c.req.query("username")
    const bgColor = c.req.query("color")

    async function generateAndCache(): Promise<Response> {
        if (!user) {
            throw new Error("Missing username")
        }

        const svg = await Contributions({ username: user, token: c.env.GITHUB_TOKEN, bgColor: bgColor as string })

        const response = new Response(svg, {
            status: 200,
            headers: {
                "Content-Type": "image/svg+xml",
                "Cache-Control": `public, max-age=${HARD_TTL_SECONDS}`,
                "X-Generated-At": Date.now().toString()
            }
        })

        await cache.put(cacheKey, response.clone())
        return response
    }

    if (cached) {
        const generatedAt = Number(cached.headers.get("X-Generated-At") ?? 0)
        const age = Date.now() - generatedAt
        const isStale = age > SOFT_TTL_MS

        if (isStale) {
            // serves current cache and generates new
            c.executionCtx.waitUntil(generateAndCache())
        }

        return cached
    }

    // never generated
    if (!user) {
        return c.json({ error: "Provide ?username parameter" }, 400)
    }

    return generateAndCache()
})

export default componentRouter;