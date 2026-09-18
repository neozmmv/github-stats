# GitHub Stats

<img src="Logos/GHLogos//PNG/GitHub_Lockup_White_Clearspace.png" height="72"/>

There are a lot of options for customizing your README.md to make your profile look good. I used one API for a long time, but suddenly it just wouldn't load my stats at all, it would just show that broken image logo on my profile, so I went and made my own.

It's a small project, very simple, send a GET request to `https://github-stats.neozmmv.workers.dev/` to see available routes and parameters.

For listing your top 5 languages, send a GET request like:
```
https://github-stats.neozmmv.workers.dev/languages?username=yourname&color=ababab
```
The `color` parameter sets the card background. It must be a 6 digit hex code **without** the `#` (`ababab`, not `#ababab`). If it's missing or invalid, it falls back to the default, which is Tailwind's `bg-gray-900` (`111827`).

For your contributions card (stars, contributions and pull requests), use `/contributions` with the same parameters:
```
https://github-stats.neozmmv.workers.dev/contributions?username=yourname
```

Both routes also accept an optional `width` in pixels, from 250 to 900 (default is 400).

Images are cached on Cloudflare for 6h. If you need a fresh one before that, add `force=true`:
```
https://github-stats.neozmmv.workers.dev/languages?username=yourname&force=true
```
That regenerates the image and replaces what's cached. It's limited to 2 requests per minute per IP and username, and when you go over it just serves the cached image instead of failing, so it never breaks the image on your profile.

Just access the route in a tab and keep the url in your profile without `force=true`

## Side by side

To put both cards on the same line and fill the whole width of your profile README, use this:

```html
<div align="center">
  <img width="49%" src="https://github-stats.neozmmv.workers.dev/languages?username=yourname&width=410"/>
  <img width="49%" src="https://github-stats.neozmmv.workers.dev/contributions?username=yourname&width=410"/>
</div>
```

The two widths do different things. `width=410` in the URL is the size the card is drawn at, so the layout stretches to fit but the text keeps its size. `width="49%"` on the `<img>` is the size it's displayed at: the GitHub README container is around 830px wide, so 49% is about 407px. I used 49% instead of 50% because the whitespace between the two tags would push the second image to the next line.

Keeping both numbers close (410 drawn, about 407 displayed) means the text is not scaled up or down. If you show a single card at full width, raise `width` to match, for example `width=830`.

Both cards have the same height, so they always line up. If you use a custom `color`, repeat the same value in both URLs so the backgrounds match.

## Stack
This project was made using Cloudflare's Wrangler and Bun.

## License
MIT