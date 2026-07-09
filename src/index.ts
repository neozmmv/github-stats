import { Hono } from "hono";

const app = new Hono<{ Bindings: CloudflareBindings }>();

app.get("/message", (c) => {
    return c.text("Hello Hono!");
});

app.get("/api/v1/stats/:username", async (c) => {
    try {
        const username = c.req.param('username')
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

export default app;
