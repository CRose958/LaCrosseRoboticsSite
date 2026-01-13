# La Crosse Robotics Website

A static website for the La Crosse Robotics team built with plain HTML, CSS, and JavaScript.

## Overview

This is a simple, fast-loading static site with no build tools or server-side dependencies. All content is served as-is from HTML files.

## Pages

- **index.html** — Main landing page with site navigation
- **photos.html** — Photo gallery with lightbox viewer
- **about.html** — Team information
- **calendar.html** — Event schedule
- **sponsors.html** — Sponsor listings
- **admin.html** — Administrative resources
- **404.html** — Custom 404 error page
- **101.html** — Team intro/guide

## Key Features

- **Image Gallery** — Client-side gallery built from image ID arrays
- **Lightbox** — Modal image viewer with navigation
- **Responsive Mobile Menu** — Toggles on smaller screens
- **Scroll Animations** — Elements fade in as you scroll
- **External CDN** — Images hosted via Cloudflare Image Delivery

## Project Structure

```
├── index.html          # Main page & navigation
├── photos.html         # Gallery & archive
├── style.css           # Layout and component styles
├── script.js           # Site JavaScript & gallery logic
├── Images/             # Local images directory
└── scripts/            # Utility scripts
    └── normalize_whitespace.py
```

## Important Files

- **[script.js](script.js)** — Contains `buildGrid()`, image ID arrays (`galleryImageIds`, `archiveImageIds`), lightbox logic, and `ACCOUNT_HASH` for CDN URLs
- **[style.css](style.css)** — Responsive grid, gallery styles, mobile menu, animations
- **[photos.html](photos.html)** — Gallery containers and lightbox modal

## How to Modify Photos

1. Open [script.js](script.js)
2. Find the `galleryImageIds` or `archiveImageIds` arrays
3. Add or remove image IDs to update the gallery
4. Save and reload [photos.html](photos.html)

## Local Preview

No build step needed. Use a local server to avoid CORS issues:

**Python 3:**
```bash
python -m http.server 8000
```

**Node.js:**
```bash
npx http-server -c-1 .
```

Then visit `http://localhost:8000`

## Configuration

- **Image CDN**: `https://imagedelivery.net/${ACCOUNT_HASH}/${id}/public`
- **Account Hash**: Set in [script.js](script.js) as `ACCOUNT_HASH`

To switch to local images, edit the URL construction in `buildGrid()` to use the `Images/` directory.