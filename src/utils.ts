import { GithubGraphQLResponse } from "./types/github";

interface LanguageData {
    size: number;
    color: string;
}


export async function getUser(username: string) {
    const res = await fetch(`https://api.github.com/users/${username}`, {
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.5 Safari/537.36"
        }
    })
    return await res.json()
}


export async function getInfo(username: string, token: string): Promise<unknown | null> {
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

export async function getLanguageMap(username: string, token: string): Promise<Map<string, LanguageData> | null> {
    const languageMap = new Map<string, LanguageData>()
    const graphqldata = await getInfo(username, token) as GithubGraphQLResponse
    const repos = graphqldata.data?.user?.repositories?.nodes
    if (!repos) return null

    for (const repo of repos) {
        repo.languages.edges.forEach(edge => {
            const current = languageMap.get(edge.node.name)?.size ?? 0
            languageMap.set(edge.node.name, {
                size: edge.size + current,
                color: edge.node.color ?? "#888888"
            })
        })
    }

    // genius type stuff
    return new Map([...languageMap.entries()].sort((a, b) => b[1].size - a[1].size))
}

export async function loadGoogleFont(fontFamily: string): Promise<ArrayBuffer> {
    const url = new URL("https://fonts.googleapis.com/css2")
    url.searchParams.append("family", fontFamily)

    const css = await fetch(url.toString()).then(res => res.text())

    const match = css.match(/src:\s*url\(([^)]+)\)\s*format\('(opentype|truetype)'\)/)
    const fontUrl = match?.[1]

    if (!fontUrl) {
        throw new Error(`Unable to extract font URL from Google Fonts CSS response`)
    }

    const fontRes = await fetch(fontUrl)
    if (!fontRes.ok) {
        throw new Error(`Failed to fetch font file: ${fontRes.status}`)
    }

    return fontRes.arrayBuffer()
}