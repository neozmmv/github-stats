# GitHub Stats

There are a lot of options for customizing your README.md to make your profile look good. I used one API for a long time, but suddenly it just wouldn't load my stats at all, it would just show that broken image logo on my profile, so I went and made my own.

It's a small project, very simple, send a GET request to `https://github-stats.neozmmv.workers.dev/routes` to see available routes and parameters.

For listing your top 5 languages, send a GET request like:
```
https://github-stats.neozmmv.workers.dev/languages?username=yourname&color=ababab
```
Default `color` parameter is Tailwind's `bg-gray-900`.

Images are cached on Cloudflare for 6h.

## Stack
This project was made using Cloudflare's Wrangler and Bun.

## License
MIT