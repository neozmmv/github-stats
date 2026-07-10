import { Hono } from "hono";
import UserBanner from "./UserBanner";

const componentRouter = new Hono<{ Bindings: CloudflareBindings }>();

componentRouter.get("/banner", async (c) => {
    const user = c.req.query("username")
    const bgColor = c.req.query("color")
    if(!user) {
        return c.json({error: "Provide ?username parameter"}, 400)
    }
    const svg = await UserBanner({username: user, token: c.env.GITHUB_TOKEN, bgColor: (bgColor as string)})

    return c.body(svg, 200, {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=3600"
    })
})

export default componentRouter;