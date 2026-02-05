# La Crosse Robotics Website - AI Agent Guide

This document provides essential context for AI coding agents working on the La Crosse Robotics website (Team 4054 - The Aeronauts).

---

## Project Overview

This is a **static website** for La Crosse Robotics, a high school FIRST Robotics Competition (FRC) team. The site is built with plain HTML, CSS, and vanilla JavaScript—no build tools, frameworks, or server-side dependencies.

**Key Characteristics:**
- **Type**: Static site (HTML/CSS/JS)
- **Hosting**: Designed for static hosting (GitHub Pages compatible)
- **No Build Step**: Files are served as-is; edit HTML/CSS/JS directly
- **No Package Manager**: No npm, yarn, or similar; CDN links for external libraries

---

## Project Structure

```
├── index.html              # Main landing page
├── about.html              # Team information with interactive map
├── calendar.html           # Event calendar with month view
├── sponsors.html           # Sponsor showcase + contact form
├── photos.html             # Image gallery with lightbox
├── frc-data.html           # FRC API dashboard (not in main nav)
├── 404.html                # Error page
├── 101.html                # Easter egg page (restricted area)
├── thank-you.html          # Form submission confirmation
├── react-bits-demo.html    # Component demo page
├── style.css               # All styles (~1900 lines)
├── script.js               # Site JavaScript (~780 lines)
├── README.md               # Human-readable documentation
├── AGENTS.md               # This file
├── Images/
│   └── favicon.png         # Site favicon
└── scripts/
    ├── normalize_whitespace.py   # Code formatting utility
    └── check_brackets.py         # JS syntax checker
```

---

## Key Configuration Files

### Core Files
| File | Purpose | Key Sections |
|------|---------|--------------|
| `style.css` | All styling, responsive design, animations | CSS variables, navigation, gallery, calendar, FRC data styles |
| `script.js` | All JavaScript functionality | Gallery builder, calendar, animations, lightbox |
| `index.html` | Home page | Hero section, stats banner, feature cards |

### No Build Configuration
- **No `package.json`** - No npm dependencies
- **No `vite.config.js`/`webpack.config.js`** - No bundler
- **No `tailwind.config.js`** - No CSS framework

---

## Technology Stack

### Core Technologies
- **HTML5** - Semantic markup
- **CSS3** - Custom properties, flexbox, grid, animations
- **JavaScript (ES6+)** - Modern JS features (async/await, arrow functions, template literals)

### External Dependencies (CDN)
| Library | Used In | Purpose |
|---------|---------|---------|
| Google Fonts (Roboto) | All pages | Typography |
| Font Awesome 6.4.0 | calendar.html | Icons |
| Leaflet 1.9.4 | about.html | Interactive map |
| Google Analytics (gtag.js) | All pages | Analytics tracking |
| Google AdSense | Most pages | Advertising |

### Third-Party Services
| Service | Integration Point | Purpose |
|---------|-------------------|---------|
| Cloudflare Image Delivery | script.js (`ACCOUNT_HASH`) | Image CDN for gallery/photos |
| FRC Events API v3.0 | frc-data.html | Real-time robotics competition data |
| Formspree | sponsors.html | Contact form handling |

---

## Code Organization

### CSS Architecture (style.css)
The CSS is organized by feature:

1. **CSS Variables** (lines ~85-92): Color scheme, theming
   ```css
   :root {
       --primary-color: #8f2b40;  /* Maroon/Cranberry */
       --dark-color: #1c1c1c;     /* Dark Gray/Black */
       --white-color: #ffffff;
       --gold-color: #d4af37;     /* Gold for FIRST */
   }
   ```

2. **Navigation** (lines ~130-240): Header, logo, gooey nav effect
3. **Hero Sections** (lines ~241-297): Landing page hero, buttons
4. **Gallery Styles** (search for `.gallery-grid`, `.archive-grid`): Photo layouts
5. **Calendar Styles** (search for `.calendar-page`): Calendar component
6. **FRC Data Styles** (search for `.frc-data-section`): API dashboard
7. **Responsive Design** (end of file): Mobile breakpoints

### JavaScript Architecture (script.js)

The script is wrapped in a `DOMContentLoaded` event listener and organized into sections:

1. **Calendar Data & Logic** (lines ~1-413):
   - `window.sampleEvents` - Hardcoded event data
   - `renderCalendar()` - Month grid generation
   - `renderCalendarEventList()` - Event list sidebar
   - `buildCardNavEvents()` - Card-based event navigation

2. **Image Gallery Configuration** (lines ~414-472):
   ```javascript
   const ACCOUNT_HASH = "CaN6tPHwuX-NOcXEjJG0lg";
   const galleryImageIds = [/* current year photos */];
   const archiveImageIds = [/* past years */];
   ```

3. **Gooey Navigation Animation** (lines ~474-579):
   - Blob effect following active/hovered nav items
   - Uses CSS custom properties for positioning

4. **Mobile Menu Toggle** (lines ~582-588):
   - Toggles `.active` class on `.nav-list`

5. **Scroll Animations** (lines ~590-607):
   - IntersectionObserver for `.hidden` → `.show` transitions

6. **Stats Counter** (lines ~610-643):
   - Animated number counting for stats banner

7. **Lightbox** (lines ~645-733):
   - Modal image viewer with prev/next navigation
   - Keyboard support (arrow keys, escape)

8. **Click Spark Effect** (lines ~736-782):
   - Visual feedback on click

---

## Important Patterns & Conventions

### Image Gallery Management
Images are loaded from Cloudflare Image Delivery CDN:

```javascript
// In script.js - To add/remove photos:
const galleryImageIds = [
    "bbee9c6b-d0e7-41cb-fb05-bf5ca781e500",
    // ... add new IDs here
];
```

**To update photos:**
1. Upload images to Cloudflare Image Delivery
2. Copy the image IDs
3. Add to `galleryImageIds` (current) or `archiveImageIds` (past)

### Navigation Active State
The navigation uses a "gooey" blob effect:
- Active page detected via URL matching
- Blob position calculated via `getBoundingClientRect()`
- CSS custom properties (`--blob-left`, `--blob-width`) animate the effect

### CSS Class Patterns
| Class | Purpose |
|-------|---------|
| `.fade-in` | Scroll-triggered fade animation |
| `.hidden` / `.show` | IntersectionObserver animation states |
| `.gallery-item` / `.archive-item` | Gallery image containers |
| `.card` | Reusable card component |
| `.btn` | Primary button style |
| `.hero` / `.hero.small` | Page header sections |

---

## Development Workflow

### Local Preview
No build step required. Use a local server to avoid CORS issues:

**Python 3:**
```bash
python -m http.server 8000
```

**Node.js:**
```bash
npx http-server -c-1 .
```

Then open `http://localhost:8000`

### Code Quality Utilities

**Normalize Whitespace** (`scripts/normalize_whitespace.py`):
```bash
python scripts/normalize_whitespace.py
```
- Removes trailing whitespace
- Ensures newline-at-EOF
- Processes: `.html`, `.css`, `.js`, `.md`, `.txt`, `.json`

**Check Brackets** (`scripts/check_brackets.py`):
```bash
python scripts/check_brackets.py
```
- Validates bracket matching in script.js
- Reports mismatched/missing brackets with line numbers

---

## Page-Specific Details

### index.html (Home)
- Hero with background image from CDN
- Stats banner with animated counters
- Feature cards (Engineering, CS, Graphic Design)
- Regional hub section

### photos.html (Gallery)
- Two galleries: main (`#gallery-container`) and archive (`#archive-container`)
- Lightbox modal (`#lightbox`) for full-size viewing
- Images populated by `buildGrid()` in script.js

### calendar.html (Events)
- Month view calendar with event dots
- Event list sidebar with filters
- Modal popup for day details
- Data source: `window.sampleEvents` in script.js

### about.html (About)
- Team description
- Three-school alliance cards
- Leaflet.js map showing meeting location
- Map scroll zoom disabled for better UX

### sponsors.html (Sponsors)
- Infinite scrolling logo carousel
- Contact form via Formspree
- Form action: `https://formspree.io/f/mvzzolnj`

### frc-data.html (FRC API Dashboard)
- **Not in main navigation** (accessible via direct URL)
- Tabbed interface for different API endpoints
- Credentials stored in browser localStorage
- Pre-configured with team credentials

---

## Security Considerations

### API Credentials
- FRC API credentials in `frc-data.html` are for demonstration
- Real credentials should be obtained from [FRC Events API](https://frc-events.firstinspires.org/services/API)
- Credentials are stored in browser localStorage only
- **Never commit real credentials to public repositories**

### External Resources
- All external scripts use integrity hashes where available
- Google tags use `crossorigin="anonymous"`

---

## Browser Compatibility

- **Modern browsers**: Chrome, Firefox, Safari, Edge (latest)
- **Required features**:
  - ES6+ JavaScript support
  - CSS Grid and Flexbox
  - IntersectionObserver API
  - LocalStorage (for FRC Data page)
  - Fetch API (for FRC Data page)

---

## Common Tasks for Agents

### Add a Photo to Gallery
1. Obtain image ID from Cloudflare Image Delivery
2. Open `script.js`
3. Add ID to `galleryImageIds` array
4. Test on `photos.html`

### Update Calendar Events
1. Open `script.js`
2. Find `window.sampleEvents` object
3. Add/modify event entries:
   ```javascript
   '2026-3-20': { category: 'FIRST', title: 'Regional', time: '9:00 AM' },
   ```

### Add a New Page
1. Copy structure from existing page (e.g., `about.html`)
2. Update `<title>` and content
3. Add to navigation in all HTML files
4. Add active state logic in `script.js` if needed

### Modify Styles
1. Check existing classes in `style.css` first
2. Follow CSS variable usage for colors
3. Test responsive behavior at mobile breakpoints

---

## File Size Reference

| File | Lines | Notes |
|------|-------|-------|
| style.css | ~1913 | Main stylesheet |
| script.js | ~782 | Main JavaScript |
| frc-data.html | ~800 | Largest HTML (API integration) |

---

## Contact & Support

- **Team**: La Crosse Robotics - Team 4054 The Aeronauts
- **School District**: School District of La Crosse
- **Meeting Location**: Logan High School, Room 196

For issues with:
- **Website**: Contact team webmaster
- **FRC API**: [FRC API Documentation](https://frc-api-docs.firstinspires.org/)
