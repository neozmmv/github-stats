import { Hono } from "hono";
import type { Context } from "hono";
import Languages from "./Languages";
import Contributions from "./Contributions";
import { rateLimiter } from "../middleware";

const componentRouter = new Hono<{ Bindings: CloudflareBindings }>();

const SOFT_TTL_MS = 6 * 60 * 60 * 1000       // 6h
const HARD_TTL_SECONDS = 7 * 24 * 60 * 60    // 7d

// Bounds for the optional ?width= param
const MIN_WIDTH = 250
const MAX_WIDTH = 900
const WIDTH_STEP = 10

type SvgRenderer = (props: {
    username: string,
    token: string,
    bgColor: string,
    // undefined means "use the component's own default width"
    width?: number
}) => Promise<string>

// Returns undefined when the param is missing or invalid, so components keep their default.
// Valid values are clamped and snapped to WIDTH_STEP, so ?width=413 and ?width=410 share
// one cache entry and nobody can flood the cache (and burn GitHub API quota) with
// one-off widths.
function parseWidth(raw: string | undefined | null): number | undefined {
    if (!raw) return undefined
    const n = Number(raw)
    if (!Number.isFinite(n) || n <= 0) return undefined
    const clamped = Math.min(Math.max(n, MIN_WIDTH), MAX_WIDTH)
    return Math.round(clamped / WIDTH_STEP) * WIDTH_STEP
}

// "force" must not be part of the cache key, otherwise a forced request would just
// create a second entry under the ...&force=true url and leave the stale one that
// normal traffic reads untouched.
// "width" is kept in the key, but normalized (see parseWidth) so equivalent
// requests hit the same entry.
function cacheKeyFor(c: Context): Request {
    const url = new URL(c.req.url)
    url.searchParams.delete("force")

    const width = parseWidth(url.searchParams.get("width"))
    if (width === undefined) {
        url.searchParams.delete("width")
    } else {
        url.searchParams.set("width", String(width))
    }

    return new Request(url.toString(), c.req.raw)
}

function createSvgRoute(render: SvgRenderer) {
    return async (c: Context<{ Bindings: CloudflareBindings }>) => {
        const cache = caches.default
        const cacheKey = cacheKeyFor(c)
        const cached = await cache.match(cacheKey)

        const user = c.req.query("username")
        const bgColor = c.req.query("color")
        const width = parseWidth(c.req.query("width"))
        const force = c.req.query("force") === "true"

        async function generateAndCache(): Promise<Response> {
            if (!user) {
                throw new Error("Missing username")
            }

            const svg = await render({
                username: user,
                token: c.env.GITHUB_TOKEN,
                bgColor: bgColor as string,
                width
            })

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

        if (!user) {
            return c.json({ error: "Provide ?username parameter" }, 400)
        }

        if (force) {
            const ip = c.req.header("cf-connecting-ip") ?? ""
            const { success } = await c.env.FORCE_RATE_LIMITER.limit({ key: `${ip}:${user}` })

            if (success) {
                try {
                    const fresh = await generateAndCache()
                    fresh.headers.set("X-Cache", "forced")
                    return fresh
                } catch (error) {
                    // a forced regen is the only path that throws away a working cached
                    // response, so don't let a github failure turn it into a 500
                    if (!cached) throw error
                    return cached
                }
            } else if (cached) {
                // these urls live in <img> tags, so a 429 would render as a broken image.
                // serve the cache instead and signal the throttling in a header.
                const throttled = new Response(cached.body, cached)
                throttled.headers.set("X-Cache", "forced-throttled")
                return throttled
            }
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
        return generateAndCache()
    }
}


componentRouter.get("/languages", rateLimiter, createSvgRoute(Languages))
componentRouter.get("/contributions", rateLimiter, createSvgRoute(Contributions))

export default componentRouter;