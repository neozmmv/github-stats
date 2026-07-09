import { GithubGraphQLResponse } from "./types/github";

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

export async function getLanguageMap(username: string, token: string): Promise<Map<string, number> | null> {
    const languageMap = new Map<string, number>()
    const graphqldata = await getInfo(username, token) as GithubGraphQLResponse
    const repos = graphqldata.data?.user?.repositories?.nodes
    if (!repos) return null
    for(let repo of repos) {
        repo.languages.edges.forEach(r => {
            const current = languageMap.get(r.node.name) ?? 0
            languageMap.set(r.node.name, r.size + current)
        })
    }
    // genius type stuff
    return new Map([...languageMap.entries()].sort((a,b) => b[1] - a[1]))
}