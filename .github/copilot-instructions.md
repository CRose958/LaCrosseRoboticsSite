**Purpose**

This repository is a small static website for the La Crosse Robotics team. These instructions give AI coding agents the essential, actionable context to be productive immediately: the overall architecture, key files, project-specific patterns, integration points, and common developer workflows.

**Big picture**
- **Type:** Plain static site (HTML/CSS/JS) — no server-side code. Edits are file-based.
- **Pages:** Root HTML files (e.g. `index.html`, `about.html`, `photos.html`, `calendar.html`, `sponsors.html`, `admin.html`) are the site pages served as-is.
- **Client logic:** `script.js` contains all site JavaScript: image gallery generation, lightbox, menu toggle, animations, and popup logic. See `galleryImageIds`, `archiveImageIds`, and `ACCOUNT_HASH` for how the gallery is populated.
- **Styling:** `style.css` holds layout and component styles. Mobile menu and grid classes are defined there.

**Key files / locations**
- `index.html` — main landing page and site navigation.
- `photos.html` — main gallery page; contains `#gallery-container`, `#archive-container`, and the `#lightbox` modal expected by `script.js`.
- `script.js` — central JS file. Look for `buildGrid(...)`, `galleryImageIds`, `archiveImageIds`, `ACCOUNT_HASH`, and the lightbox logic.
- `style.css` — styles for grid, `.gallery-item`, `.archive-item`, `.nav-list`, `.hidden`, `.show`, `.stats-banner` and responsive rules.
- `Images/` — local images directory (may be unused by the current gallery: the gallery uses an external CDN via `ACCOUNT_HASH`).

**Important patterns & conventions (project-specific)**
- The gallery is built client-side from two ID arrays in `script.js`: update `galleryImageIds` (main) and `archiveImageIds` (archive) to add/remove photos. Each ID is combined with `ACCOUNT_HASH` to form a CDN URL.
- The lightbox selects all images with `.gallery-item img, .archive-item img` after the grid builds — keep those classes present in markup.
- Mobile navigation toggles `.nav-list.active` when `#mobile-menu` is clicked; follow existing markup/classes in `index.html`.
- Animations use `.hidden` on elements and an IntersectionObserver that adds `.show` when visible — reuse this pattern for new animated sections.

**Integration points & external dependencies**
- Image CDN: `https://imagedelivery.net/${ACCOUNT_HASH}/${id}/public` — `ACCOUNT_HASH` is configured in `script.js`. Changing where photos come from requires editing the arrays or replacing the URL construction.
- No package.json or build tool; there is no bundler. Keep JS/CSS as plain files unless you add a build system and update README accordingly.

**Developer workflows**
- Preview locally with a static server (recommended):

  - Python 3: `python -m http.server 8000`
  - Node: `npx http-server -c-1 .` (or install `http-server` globally)

- Open `http://localhost:8000` and use browser devtools to inspect console errors and DOM elements (`#gallery-container`, `.gallery-item`, `#lightbox`).
- To update photos: edit `script.js` arrays (`galleryImageIds`, `archiveImageIds`) or switch to local images by editing `buildGrid()` to use `Images/<filename>` paths.

**Safe edit checklist for agents**
- Prefer minimal, atomic edits. For JS changes: run a quick browser preview to verify no console errors.
- When changing class names referenced in `script.js`, update both HTML and `style.css` to keep behavior consistent.
- If adding external libraries, add a short note in `README.md` documenting why and how to preview.

**Example quick tasks**
- Add a photo: append the image ID to `galleryImageIds` in `script.js` and preview `photos.html`.
- Change lightbox behavior: edit the `openLightbox()` function in `script.js` — ensure `#lightbox-img` exists in `photos.html`.

If any part of the site behavior is unclear, tell me which file or interaction to inspect next and I will expand these instructions with concrete examples.
