# Centry Advisors website

Static one-page marketing site for Centry Advisors (Dean Anderson, fractional
CEO/CFO consulting, Salt Lake City). No build step, no dependencies, no framework.

```
index.html          All page content
styles.css          All styling; design tokens live in :root at the top
script.js           Mobile nav, scroll-spy, scroll reveals, contact form
assets/
  centry-advisors-logo.png   Real brand logo (338×68)
  favicon.ico                Real favicon
  hero.jpg                   Hero background (2000×1335, 183KB)
  dean-anderson.jpg          Founder headshot, cropped 4:5 (900×1125, 109KB)
  photos/                    Spare stock photos, currently unused
```

The headshot is a 4:5 crop of the original supplied photo. To re-crop, adjust the
`cx` / `top` / `h` values in the snippet recorded in git history, or just drop in any
4:5 image at `assets/dean-anderson.jpg`. The CSS uses `object-fit: cover`.

## Run it locally

```bash
python -m http.server 4321
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
- `_subject` sets the notification subject line.
- `_gotcha` is a honeypot: positioned offscreen and hidden from assistive tech, so
  only bots fill it. Formspree silently discards those submissions.
- Free tier allows 50 submissions/month.

If the `action` is ever emptied, `script.js` falls back to opening the visitor's mail
client with a pre-filled draft. That fallback is a safety net, not a substitute: it
fails silently when no mail client is configured.

## Deploying

Any static host, all with free tiers:

- **Netlify**: drag this folder onto <https://app.netlify.com/drop>. Easiest.
- **Cloudflare Pages** or **Vercel**: connect a Git repo, no build command.
- **GitHub Pages**: push, then enable Pages on `main`.

For a custom domain, point its DNS at whichever host you pick.

**When you deploy a change to `styles.css` or `script.js`, bump the `?v=` number on
their tags in `index.html`.** Browsers cache both aggressively, and a stale stylesheet
is not a harmless glitch here: the founder photo depends on a CSS `height: auto` rule
to override its `height` attribute, so old CSS renders it stretched.

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
