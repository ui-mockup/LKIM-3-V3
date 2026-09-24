# LKIM Portal — Live Mockup

A static, dependency-free HTML/CSS/JS mockup of the LKIM (Lembaga Kemajuan Ikan Malaysia) homepage, redesigned with a custom navy / orange / teal maritime identity and an illustrated (non-photographic) hero and content graphics.

## Files

```
index.html        — the page
css/style.css      — all styles (design tokens at the top)
js/main.js         — mobile nav + mega-menu interactions
images/bg-pattern.png — the wave pattern used on the footer & CTA banner
```

## Run locally

No build step needed — it's plain HTML/CSS/JS.

```bash
cd lkim-mockup
python3 -m http.server 8000
# open http://localhost:8000
```

Or just double-click `index.html`.

## Deploy to GitHub Pages

1. Create a new GitHub repo (e.g. `lkim-mockup`) and push these files to the `main` branch, keeping the same folder structure (`css/`, `js/`, `images/` alongside `index.html`).
2. In the repo, go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to `Deploy from a branch`, branch `main`, folder `/ (root)`.
4. Save — GitHub will publish at `https://<your-username>.github.io/<repo-name>/`.

## Notes

- **Mega menu**: the dropdown panels under Korporat / Program / Perkhidmatan / Pembangunan / Media / Hubungi use background `#001322` as requested, with the link structure adapted from the reference site.
- **Footer & CTA banner**: both use `images/bg-pattern.png` tiled at `background-size: 40px auto`, layered at low opacity behind the content so text stays legible.
- **Imagery**: photography was replaced with custom SVG illustrations (waves, nets, boats, fish) in the brand palette so the page has no broken image links and no licensing concerns once deployed. Swap in real photography by replacing the relevant `<svg>` blocks or `.qcard` / `.news-thumb` / `.g-item` backgrounds with `<img>` tags.
- **Agency logos**: shown as neutral text badges (MARDI, MyGOV, etc.) rather than reproducing real trademarked logos — drop in the official logo files when you have licensed assets.
