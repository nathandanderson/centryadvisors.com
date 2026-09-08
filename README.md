# Centry Advisors website

Static one-page marketing site for Centry Advisors (Dean Anderson, fractional
CEO/CFO consulting, Salt Lake City). No build step, no dependencies, no framework.

```
wrangler.jsonc      Cloudflare Workers config; points at ./public
public/             Everything that gets published
  index.html        All page content
  404.html          Served for unknown paths
  styles.css        All styling; design tokens live in :root at the top
  script.js         Mobile nav, scroll-spy, scroll reveals, contact form
  _headers          Response headers, including the CSP
  assets/
    centry-advisors-logo.png   Real brand logo (338x68)
    favicon.ico                Real favicon
    hero.jpg                   Hero background (2000x1335, 183KB)
    dean-anderson.jpg          Founder headshot, cropped 4:5 (900x1125, 109KB)
    photos/                    Spare stock photos, currently unused
```

The headshot is a 4:5 crop of the original supplied photo. To re-crop, adjust the
`cx` / `top` / `h` values in the snippet recorded in git history, or just drop in any
4:5 image at `public/assets/dean-anderson.jpg`. The CSS uses `object-fit: cover`.

## Run it locally

```bash
python -m http.server 4321 --directory public
```

Then open <http://localhost:4321>.

## House style

**No em dashes anywhere in site copy.** They read as AI-generated. Use commas, colons,
or a full stop and a second sentence. This applies to `index.html`, `styles.css` and
`script.js`, including visitor-facing strings in the contact-form handler.

## Where this came from

Two earlier attempts existed:

- **`../Centry_Advisors/`** is a Django project from Sep 2023 built on the TemplateMo
  "Leadership Event" theme. Never finished: it still contains lorem ipsum, "Become an
  event speaker?", "120+ People are attending", a malformed `{% static %}` tag in
  `templates/index.html:176`, and references to avatar images that don't exist.
  The logo, favicon and hero photo in `assets/` were salvaged from it.
- **A Webflow draft**, screenshots only. The brand blue, Poppins typeface, the
  "CEO & CFO expertise / for a fraction of the cost" line and the original service
  list came from there.

This rebuild keeps the brand and copy but uses a fresh, more editorial layout.

> Note: despite its filename, `dean_professional.jpg` in the Django project is not a
> usable headshot. It was deliberately not carried over.

## What still needs real content

| Where | What's needed |
|---|---|
| `#industries` | Dean to confirm the four sectors and their one-line descriptions. |
| `assets/og-image.png` | 1200×630 preview image for when the site is shared on LinkedIn. |
| Hero photo | `assets/hero.jpg` is generic stock. A real photo of Dean or Salt Lake City would be stronger. Swap the `--hero-image` token in `styles.css`. |

## The contact form

Submissions POST to Formspree, which emails `dean.anderson@centryadvisors.com` and
keeps a copy in the Formspree dashboard.

- Endpoint: `https://formspree.io/f/meaqpkjy`, set as the `action` on
  `<form id="contactForm">`. It is public by necessity, as any client-side form
  endpoint must be. It is not a credential.
- **Dean's email address appears nowhere in the served files**, deliberately, to
  keep it away from scrapers. Formspree holds the destination address. Do not
  reintroduce it into `public/index.html` or `public/script.js`.
- `_subject` sets the notification subject line.
- `_gotcha` is a honeypot: positioned offscreen and hidden from assistive tech, so
  only bots fill it. Formspree silently discards those submissions.
- Free tier allows 50 submissions/month.

If the `action` is ever emptied, the form shows an error pointing people to LinkedIn.
The old `mailto:` fallback was removed: it exposed the address and failed silently
when no mail client was configured.

The footer year is written by `script.js` from `new Date()`. The markup ships with an
empty `<span id="year">`, so with JS disabled the line reads "(c) Centry Advisors"
rather than a stale year. There is no pure-HTML way to render the current year.

## Deploying

Hosted on **Cloudflare Workers** (static assets), deployed automatically from `main`.

- Deployed as a static-only Worker. Build command must stay **empty**; the
  deploy command is `npx wrangler deploy`, which reads `wrangler.jsonc`.
- Only `public/` is published, so the README and config are never served.
- `public/_headers` sets the response headers, including a strict Content-Security-Policy.
  Cloudflare strips this file from the published output.
- `404.html` is served for unknown paths via `not_found_handling: "404-page"`.

**Why not GitHub Pages:** its terms state it "cannot be used as a free web-hosting
service to run your online business ... or any other website that is primarily
directed at either facilitating commercial transactions". A brochure site probably
falls outside that, but the wording is vague and the judgment is GitHub's to make.
Cloudflare's free tier permits commercial use outright, so the question disappears.

**If Cloudflare Web Analytics is ever enabled**, its script loads from
`static.cloudflareinsights.com` and must be added to `script-src` in `_headers`,
or the CSP will silently block it.

**When you change `styles.css` or `script.js`, bump the `?v=` number** on their tags
in `public/index.html` and `public/404.html`. `_headers` sets `no-cache` on the HTML so markup
updates land immediately, but the versioned asset URLs are what force browsers to
pick up new CSS and JS.

## Design notes

- Colours, spacing and type are CSS custom properties in `:root`. Change `--brand`
  and every button, link and accent updates together. `--brand` is sampled from the
  logo's blue bars.
- Layout verified at 375px, 861px, 900px, 1280px and 1440px with no horizontal
  overflow. The founder photo holds a 4:5 ratio at every one of them.
- Text contrast on dark sections measured at ~7:1 (WCAG AAA for body text).
- All tap targets are at least 32px tall on mobile.
- Scroll reveals and smooth scrolling are disabled under
  `prefers-reduced-motion: reduce`.
