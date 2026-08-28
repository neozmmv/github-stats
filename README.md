# GitHub Stats

There are a lot of options for customizing your README.md to make your profile look good. I used one API for a long time, but suddenly it just wouldn't load my stats at all, it would just show that broken image logo on my profile, so I went and made my own.

It's a small project, very simple, send a GET request to `https://github-stats.neozmmv.workers.dev/` to see available routes and parameters.

For listing your top 5 languages, send a GET request like:
```
https://github-stats.neozmmv.workers.dev/languages?username=yourname&color=ababab
```
Default `color` parameter is Tailwind's `bg-gray-900`.

Images are cached on Cloudflare for 6h. If you need a fresh one before that, add `force=true`:
```
https://github-stats.neozmmv.workers.dev/languages?username=yourname&force=true
```
That regenerates the image and replaces what's cached. It's limited to 2 requests per minute per IP and username, and when you go over it just serves the cached image instead of failing, so it never breaks the image on your profile.

Just access the route in a tab and keep the url in your profile without `force=true`

## Stack
This project was made using Cloudflare's Wrangler and Bun.

## License
MIT