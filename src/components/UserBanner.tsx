import { getInfo, getLanguageMap, getUser } from "../utils"

/* 
{
  login: 'username',
  id: xxxxxxxx,
  node_id: 'xxxxxxxxxx',
  avatar_url: 'https://avatars.githubusercontent.com/u/xxxxxxx?v=4',
  gravatar_id: '',
  url: 'https://api.github.com/users/xxxxxxx',
  html_url: 'https://github.com/xxxxxx',
  followers_url: 'https://api.github.com/users/xxxxxx/followers',
  following_url: 'https://api.github.com/users/xxxxxx/following{/other_user}',
  gists_url: 'https://api.github.com/users/xxxxxxxx/gists{/gist_id}',
  starred_url: 'https://api.github.com/users/xxxxxxx/starred{/owner}{/repo}',
  subscriptions_url: 'https://api.github.com/users/xxxxxxx/subscriptions',
  organizations_url: 'https://api.github.com/users/xxxxxxx/orgs',
  repos_url: 'https://api.github.com/users/xxxxxxx/repos',
  events_url: 'https://api.github.com/users/xxxxxx/events{/privacy}',
  received_events_url: 'https://api.github.com/users/xxxxxxx/received_events',
  type: 'User',
  user_view_type: 'public',
  site_admin: false,
  name: 'xxxxxxxxxxxx',
  company: null,
  blog: 'https://xxxxxxx.xxx/',
  location: 'xxxxxxxx',
  email: null,
  hireable: true,
  bio: 'xxxxxxxxxxxxxxx',
  twitter_username: null,
  public_repos: 0,
  public_gists: 0,
  followers: 0,
  following: 0,
  created_at: '2021-05-01T02:49:22Z',
  updated_at: '2026-07-05T14:05:12Z'
}
*/

export default async function UserBanner(props: {username: string, token: string}) {
    const data = await getUser(props.username) as any
    const langMap = await getLanguageMap(props.username, props.token)
    if (!langMap) throw new Error("UserBanner.tsx - something went wrong with the langMap.")
    const top5langs = [...langMap?.entries()].slice(0,5)
    return (
        <html>
            <head>
                <link rel="stylesheet" href="/output.css" />
            </head>
            <body>
                <div class="w-96 h-48 bg-gray-900 rounded-md">
                    <p class="text-center pt-4">Most used languages</p>
                    {top5langs.map(([name, size]) => (
                        <p>{name}: {size}</p>
                    ))}
                </div>
            </body>
        </html>
    )
}