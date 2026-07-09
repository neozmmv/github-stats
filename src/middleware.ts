import { createMiddleware } from "hono/factory";

export const rateLimiter = createMiddleware<{Bindings: CloudflareBindings}>(async (c, next) => {
    const ip = await c.req.header("cf-connecting-ip") ?? ""
    const {success} = await c.env.FREE_USER_RATE_LIMITER.limit({key: ip})
    if (!success) {
        return c.json({error: "Rate Limit exceeded."}, 429)
    }
    await next()
})