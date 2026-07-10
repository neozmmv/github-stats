import { Hono } from "hono";
import { rateLimiter } from "./middleware";
import UserBanner from "./components/UserBanner";
import componentRouter from "./components/router";
import { getInfo, getUser } from "./utils";

const app = new Hono<{ Bindings: CloudflareBindings }>();

app.route("/", componentRouter) // components for banners and stats

app.get("/routes", async (c) => {
  return c.json({routes: [
    {
      url: "/languages",
      info: "Get a SVG for showing your top languages!",
      params: ["username", "color"]
    },
    {
      url: "/api/v1/stats/:username",
      info: "Get simple info from your GitHub profile"
    },
    {
      url: "/graphql",
      info: "Get advanced info from your GitHub profile"
    }
  ]})
})

app.get("/api/v1/stats/:username", rateLimiter, async (c) => {
    try {
        const username = c.req.param('username')
        if (!username) {
            return c.json({error: "You must provide a GitHub profile username"}, 400)
        }
        const data = await getUser(username)
        return c.json({data})
    } catch (error: any) {
        return c.json({error: error.message})
    }
})

app.get("/graphql", rateLimiter, async (c) => {
    const user = c.req.query("username");
    if (!user) {
        return c.json({ error: "Missing 'user' query param" }, 400);
    }
    const data = await getInfo(user, c.env.GITHUB_TOKEN)
    return c.json(data);
})

export default app;
