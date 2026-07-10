import { Hono } from "hono";
import UserBanner from "./UserBanner";

const componentRouter = new Hono<{ Bindings: CloudflareBindings }>();

componentRouter.get("/languages", async (c) => {
    const cache = caches.default
    const cacheKey = new Request(c.req.url, c.req.raw)

    const cached = await cache.match(cacheKey)
    if (cached) {
        return cached
    }
    const user = c.req.query("username")
    const bgColor = c.req.query("color")
    if(!user) {
        return c.json({error: "Provide ?username parameter"}, 400)
    }
    const svg = await UserBanner({username: user, token: c.env.GITHUB_TOKEN, bgColor: (bgColor as string)})

    const response = new Response(svg, {
        status: 200,
        headers: {
            "Content-Type": "image/svg+xml",
            "Cache-Control": "public, max-age=21600"
        }
    })
    
    c.executionCtx.waitUntil(cache.put(cacheKey, response.clone()))
    return response
})

export default componentRouter;