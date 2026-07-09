import { Hono } from "hono";
import UserBanner from "./UserBanner";

const componentRouter = new Hono<{ Bindings: CloudflareBindings }>();

componentRouter.get("/banner", async (c) => {
    const user = c.req.query("username")
    if(!user) {
        return c.json({error: "Provide ?username parameter"}, 400)
    }
    return c.html(<UserBanner username={user} token={c.env.GITHUB_TOKEN}/>)
})

export default componentRouter;