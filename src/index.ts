import { Hono } from "hono";
import { rateLimiter } from "./middleware";

const app = new Hono<{ Bindings: CloudflareBindings }>();

app.get("/message", (c) => {
    return c.text("Hello Hono!");
});

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
    const login = c.req.query("user");
    if (!login) {
        return c.json({ error: "Missing 'user' query param" }, 400);
    }

    const res = await fetch("https://api.github.com/graphql", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "User-Agent": "github-stats-api",
            "Authorization": `Bearer ${c.env.GITHUB_TOKEN}` // wrangler secret put
        },
        body: JSON.stringify({
            query: `
                query($login: String!) {
                  user(login: $login) {
                    login
                    name
                    avatarUrl
                    bio
                    repositories(
                      first: 100
                      ownerAffiliations: OWNER
                      orderBy: { field: UPDATED_AT, direction: DESC }
                      isFork: false
                    ) {
                      totalCount
                      nodes {
                        name
                        description
                        url
                        stargazerCount
                        forkCount
                        isPrivate
                        primaryLanguage {
                          name
                          color
                        }
                        languages(first: 10, orderBy: { field: SIZE, direction: DESC }) {
                          edges {
                            size
                            node {
                              name
                              color
                            }
                          }
                        }
                        defaultBranchRef {
                          target {
                            ... on Commit {
                              history(first: 1) {
                                totalCount
                                nodes {
                                  message
                                  committedDate
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                    contributionsCollection {
                      totalCommitContributions
                      totalRepositoriesWithContributedCommits
                      contributionCalendar {
                        totalContributions
                      }
                    }
                  }
                }
            `,
            variables: { login }
        })
    });

    if (!res.ok) {
        return c.json({ error: "GitHub API request failed", status: res.status }, 502);
    }

    const data = await res.json();
    return c.json(data);
})

export default app;
