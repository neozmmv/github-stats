import { Hono } from "hono";
import { rateLimiter } from "./middleware";
import UserBanner from "./components/UserBanner";
import componentRouter from "./components/router";
import { getInfo } from "./utils";

const app = new Hono<{ Bindings: CloudflareBindings }>();

app.route("/", componentRouter) // components for banners and stats

app.get("/api/v1/stats/:username", rateLimiter, async (c) => {
    try {
        const username = c.req.param('username')
        if (!username) {
            return c.json({error: "You must provide a GitHub profile username"}, 400)
        }
        const res = await fetch(`https://api.github.com/users/${username}`, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.5 Safari/537.36"
            }
        })
        const data = await res.json()
        return c.json({data})
    } catch (error: any) {
        return c.json({error: error.message})
    }
})

app.get("/graphql", rateLimiter, async (c) => {
    const user = c.req.query("user");
    if (!user) {
        return c.json({ error: "Missing 'user' query param" }, 400);
    }
    const data = await getInfo(user, c.env.GITHUB_TOKEN)
    return c.json(data);
})

export default app;
