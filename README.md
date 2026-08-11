# HOLLERBOSS

An Appalachian songbook — artist encyclopedia, podcast, and goods.
Built with Next.js (App Router) + TypeScript.

> **House rule:** the brand name is **HOLLERBOSS**. One word, no space, never wrapped
> across two lines. It's set that way everywhere in the code — keep it that way.

---

## Run it locally (Windows)

1. Install [Node.js LTS](https://nodejs.org) if you don't have it. Check it worked:

   ```
   node -v
   ```

2. Put this folder at `C:\hollerboss`, then open a terminal there:

   ```
   cd C:\hollerboss
   npm install
   npm run dev
   ```

3. Open http://localhost:3000

If the first build stalls on fonts, it's just downloading Anton, Lora, and Special Elite
from Google Fonts — that happens once at build time, not on every page load. It needs
internet access the first time.

`npm run dev` hot-reloads — save a file, the browser updates.

---

## Push it to GitHub

Create an empty repo named **hollerboss** on GitHub first (no README, no .gitignore —
this project already has both). Then:

```
cd C:\hollerboss
git init
git add .
git commit -m "Initial HOLLERBOSS site"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/hollerboss.git
git push -u origin main
```

To deploy: import the repo at [vercel.com](https://vercel.com) — it detects Next.js,
builds it, and gives you a live URL. Point `hollerboss.com` at it from your registrar
when you're ready.

---

## Where things live

```
app/
  layout.tsx            fonts, metadata, <html> shell
  page.tsx              the landing page — section order lives here
  globals.css           design tokens + shared primitives (.btn, .wrap, .eyebrow)
  icon.svg              favicon
  api/subscribe/route.ts  email capture endpoint (stub — see below)
components/
  Nav / Hero / Encyclopedia / ArtistCard / Shop / JoinList / Footer
  TornDivider           the ragged edge between sections
  GrainOverlay          fixed paper-grain texture
  Wordmark              the small nav/footer lockup
  *.module.css          styling scoped to each component
data/
  artists.ts            the encyclopedia roster
lib/
  site.ts               brand copy, nav, socials, product details
public/images/          static images
```

### The two files you'll edit most

- **`data/artists.ts`** — add an artist by copying a block and filling it in. The grid
  picks it up automatically. `slug` is already there for when we build individual artist
  pages at `/artists/tyler-childers`.
- **`lib/site.ts`** — social URLs, hat price, tagline, disclaimer. Change once, changes
  everywhere.

---

## Before launch

- [ ] **Replace the hat photo.** `public/images/hat.png` is a labeled placeholder. Drop
      your real product shot in at the same path and filename — square, ideally 1200×1200
      or larger. Nothing else needs to change.
- [ ] **Real social URLs** in `lib/site.ts` — they're currently guesses at the handles.
- [ ] **Wire up the email list.** `app/api/subscribe/route.ts` validates the address and
      logs it to the terminal; it doesn't store anything yet. Pick a provider (Resend,
      ConvertKit, Mailchimp, Buttondown), drop the key in `.env.local`, replace the TODO.
- [ ] **Artist artwork.** The cards are type-only on purpose — press and label photos
      aren't ours to use. Commissioned illustration or properly licensed images only.
- [ ] **Trademark clearance** on HOLLERBOSS for apparel and media classes before the
      embroidery order goes in.
- [ ] **Open Graph image** — add `app/opengraph-image.png` (1200×630) so links preview
      properly when shared.

## Design notes

Palette is kraft paper, ink, rust, gold, pine. Type is Anton for display, Lora for body,
Special Elite for labels and buttons. The signature elements are the torn-paper section
dividers, the taped field-note artist cards, and the woodcut ridgeline in the hero —
Foxfire anthology by way of a screen-printed gig poster. Fonts load through
`next/font/google`, so there are no external font requests at runtime.
