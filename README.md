# Centry Advisors website

Static one-page marketing site for Centry Advisors (Dean Anderson, CPA, fractional
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
  "CEO & CFO expertise / for a fraction of the cost" line and the five services
  came from there.

This rebuild keeps the brand and copy but uses a fresh, more editorial layout.

> Note: `dean_professional.jpg` in the Django project is **not** a headshot. It's a
> joke photo of two people, one in a Scooby-Doo costume. It was deliberately not
> carried over.

## What still needs real content

| Where | What's needed |
|---|---|
| `#work` in `index.html` | Three real engagements. Everything in `[ square brackets ]` is a placeholder. Nothing was invented. |
| `#contact` | Real email and phone. Currently `dean@centryadvisors.com` and a fake `(801) 555-0100`. Both appear in `index.html` **and** in the mailto fallback in `script.js`. |
| `assets/og-image.png` | 1200×630 preview image for when the site is shared on LinkedIn. |
| Hero photo | `assets/hero.jpg` is generic stock. A real photo of Dean or Salt Lake City would be stronger. Swap the `--hero-image` token in `styles.css`. |

## Wiring up the contact form

The form's `action` is empty, so submitting currently opens the visitor's email client
as a fallback. That's never a dead end, but it isn't ideal.

To have submissions arrive as email:

1. Create a free form at <https://formspree.io> and copy the endpoint URL.
2. Paste it into the `action` attribute of `<form id="contactForm">` in `index.html`.

`script.js` already POSTs there and renders success and error states.

On Netlify you can instead add `netlify` and `name="contact"` to the `<form>` tag and
skip Formspree entirely.

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
