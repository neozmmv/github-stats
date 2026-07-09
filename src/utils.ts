import { Hono } from "hono";

export async function getInfo(username: string, token: string): Promise<unknown> {
    const res = await fetch("https://api.github.com/graphql", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "User-Agent": "github-stats-api",
            "Authorization": `Bearer ${token}` // wrangler secret put
        },
        body: JSON.stringify({
            query: `
                query($username: String!) {
                  user(login: $username) {
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
            variables: { username }
        })
    });

    if(!res.ok) {
        return null
    }

    const data = await res.json()

    return data
}