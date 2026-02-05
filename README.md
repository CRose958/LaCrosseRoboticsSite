# La Crosse Robotics Website

A static website for the La Crosse Robotics team built with plain HTML, CSS, and JavaScript.

## Overview

This is a simple, fast-loading static site with no build tools or server-side dependencies. All content is served as-is from HTML files.

## Pages

- **index.html** — Main landing page with site navigation
- **photos.html** — Photo Gallery
- **about.html** — Team information
- **calendar.html** — Event Schedule
- **sponsors.html** — Sponsors
- **frc-data.html** — FRC API Data Dashboard (not in navigation)
- **404.html** — 404 error page

## Key Features

- **Image Gallery** — Client-side gallery built from image ID arrays
- **Lightbox** — Modal image viewer with navigation
- **Responsive Mobile Menu** — Toggles on smaller screens
- **Scroll Animations** — Elements fade in as you scroll
- **External CDN** — Images hosted via Cloudflare Image Delivery
- **FRC API Integration** — Real-time data from FIRST Robotics Competition events

## Project Structure

```
├── index.html          # Main page & navigation
├── photos.html         # Gallery & archive
├── about.html          # Team information
├── calendar.html       # Event calendar
├── sponsors.html       # Sponsor information
├── frc-data.html       # FRC API dashboard
├── style.css           # Layout and component styles
├── script.js           # Site JavaScript & gallery logic
├── Images/             # Local images directory
└── scripts/            # Utility scripts
    └── normalize_whitespace.py
```

## Important Files

- **[script.js](script.js)** — Contains `buildGrid()`, image ID arrays (`galleryImageIds`, `archiveImageIds`), lightbox logic, and `ACCOUNT_HASH` for CDN URLs
- **[style.css](style.css)** — Responsive grid, gallery styles, mobile menu, animations, and FRC data page styles
- **[photos.html](photos.html)** — Gallery containers and lightbox modal
- **[frc-data.html](frc-data.html)** — FRC API integration page with full data dashboard

## How to Modify Photos

1. Open [script.js](script.js)
2. Find the `galleryImageIds` or `archiveImageIds` arrays
3. Add or remove image IDs to update the gallery
4. Save and reload [photos.html](photos.html)

## FRC Data Dashboard

The FRC Data page ([frc-data.html](frc-data.html)) provides real-time access to FIRST Robotics Competition data via the official FRC Events API v3.0.

### Features

#### API Configuration
- **Credential Storage**: Username and authorization key stored locally in browser localStorage
- **Pre-configured**: Default credentials set to `crose4054` with the team's API key
- **Security**: Credentials never leave the browser except when making direct API calls

#### Available Data Tabs

1. **Season Info**
   - View season details including event count, game name, and kickoff date
   - Input: Year (e.g., 2024)

2. **Events**
   - Browse all FRC events by year
   - Filter by event type: Regional, District, or Championship
   - Displays: Event name, code, type, location, and dates
   - Inputs: Year, Event Type (optional)

3. **Team Lookup**
   - Search for specific team information
   - Displays: Full name, nickname, rookie year, location, school, and website
   - Pre-configured for Team 4054
   - Inputs: Team Number, Year

4. **Match Results**
   - View all match results for an event
   - Displays: Match number, alliances (Red vs Blue), team stations, and scores
   - Color-coded alliance displays
   - Inputs: Year, Event Code (e.g., WIMI)

5. **Rankings**
   - Event rankings table with sortable data
   - Displays: Rank, team number, W-L-T record, ranking points, matches played
   - Professional table layout with hover effects
   - Inputs: Year, Event Code

6. **Awards**
   - Browse all awards from an event
   - Optional filtering by team number
   - Displays: Award name, team number, recipient name
   - Grid layout with card-based design
   - Inputs: Year, Event Code, Team Number (optional)

7. **Alliances**
   - View playoff alliance selections
   - Displays: Alliance captains, first picks, second picks, third picks, and backup teams
   - Shows complete alliance composition for playoffs
   - Inputs: Year, Event Code

8. **Districts**
   - Two sections in one tab:
     - **District List**: All districts for a season with names and codes
     - **District Rankings**: Team rankings within a specific district
   - Rankings show: Rank, team number, total points, event points breakdown, and DCMP points
   - Inputs: 
     - District List: Year
     - District Rankings: Year, District Code (e.g., FIM)

### API Endpoints Used

The page integrates with the following FRC Events API v3.0 endpoints:

- `GET /{year}` — Season data
- `GET /{year}/events` — Event listings with optional type filter
- `GET /{year}/teams?teamNumber={number}` — Team information
- `GET /{year}/{eventCode}/matches` — Match results
- `GET /{year}/{eventCode}/rankings` — Event rankings
- `GET /{year}/{eventCode}/awards` — Event awards (with optional team filter)
- `GET /{year}/{eventCode}/alliances` — Alliance selections
- `GET /{year}/districts` — District listings
- `GET /{year}/rankings/{districtCode}` — District rankings

### Authentication

The FRC API requires HTTP Basic Authentication:

1. **Format**: `Authorization: Basic <base64(username:authKey)>`
2. **Token Generation**: Automatically created by base64 encoding `username:authKey`
3. **Headers**: All requests include `Authorization` and `Accept: application/json`
4. **Error Handling**: Invalid credentials return HTTP 401 with descriptive error messages

### API Credentials

To obtain your own FRC API credentials:

1. Visit [FRC Events API Registration](https://frc-events.firstinspires.org/services/API)
2. Request a token with your username
3. Activate your account within 72 hours
4. Enter credentials in the API Configuration section on the page

**Important Notes**:
- Accounts are disabled if inactive for 12 months
- Do NOT publicly distribute your credentials
- Credentials are stored only in browser localStorage
- Never commit real credentials to public repositories

### API Response Handling

The page handles all standard HTTP response codes:

- **200 OK**: Successful request with data
- **304 Not Modified**: No new data since last request (cached)
- **400 Bad Request**: Invalid parameters or malformed request
- **401 Unauthorized**: Invalid or missing credentials
- **404 Not Found**: Event or resource not found
- **500 Internal Server Error**: Server-side error
- **503 Service Unavailable**: Temporary server overload

### Data Display Features

- **Loading States**: Shows "Loading..." while fetching data
- **Error Messages**: Red error cards with descriptive messages
- **Info Messages**: Blue info cards for "no new data" or "not found" scenarios
- **Empty States**: Graceful handling when no data is available
- **Responsive Tables**: Horizontal scroll on mobile for wide tables
- **Color Coding**: Red vs Blue alliances in match results
- **Hover Effects**: Interactive cards and table rows
- **Grid Layouts**: Responsive grids that adapt to screen size

### CSS Classes (FRC Data)

All FRC Data page styles are in [style.css](style.css) under the "FRC Data Page Styles" section:

**Layout Classes**:
- `.frc-data-section` — Main page container with dark background
- `.frc-config-card` — API configuration card
- `.frc-tabs` — Tab navigation container
- `.frc-tab` — Individual tab button (`.active` for selected)
- `.frc-tab-content` — Tab content container (`.active` to show)
- `.frc-card` — Content card within tabs

**Form Classes**:
- `.config-group` — Form group with label and input
- `.input-group` — Horizontal input group with button
- `.config-info` — Information box in config section
- `.warning` — Orange warning text

**Display Classes**:
- `.results-container` — Container for API results
- `.loading` — Loading spinner text
- `.error-message` — Red error display
- `.info-message` — Blue info display
- `.data-display` — Main data display wrapper
- `.data-grid` — Responsive grid for data items
- `.data-item` — Individual data item card

**Event-Specific Classes**:
- `.events-list` — Grid of event cards
- `.event-card` — Individual event card with hover effect

**Match-Specific Classes**:
- `.matches-list` — Vertical list of match cards
- `.match-card` — Individual match container
- `.match-alliances` — Grid container for red/blue alliances
- `.alliance` — Alliance container
- `.red-alliance` — Red alliance styling
- `.blue-alliance` — Blue alliance styling
- `.match-score` — Score display box

**Rankings Classes**:
- `.rankings-table-wrapper` — Scrollable table container
- `.rankings-table` — Rankings table with full styling
- `.rankings-table thead` — Table header with primary color
- `.rankings-table tbody tr:hover` — Row hover effect

**Awards Classes**:
- `.awards-list` — Grid of award cards
- `.award-card` — Individual award card with left border

**Alliances Classes**:
- `.alliances-grid` — Grid for alliance cards
- `.alliance-card` — Alliance selection card with top border

**Districts Classes**:
- `.districts-grid` — Grid of district cards
- `.district-card` — Individual district card

### JavaScript Functions (FRC Data)

All FRC API functionality is embedded in [frc-data.html](frc-data.html):

**Credential Management**:
- `loadCredentials()` — Loads username and auth key from localStorage on page load
- `saveCredentials()` — Saves credentials to localStorage before API calls
- `getAuthHeader()` — Generates Base64-encoded authorization header

**API Functions**:
- `fetchFRCData(endpoint, resultsElementId)` — Generic fetch wrapper for all API calls
  - Handles authentication headers
  - Manages loading states
  - Error handling for all HTTP status codes
  - Returns parsed JSON data or null on error

**Data Fetching Functions**:
- `fetchSeasonData()` — Get season information (event count, game name, kickoff)
- `fetchEvents()` — Get event listings with optional type filter
- `fetchTeamData()` — Get team information by number
- `fetchMatches()` — Get match results for an event
- `fetchRankings()` — Get event rankings table
- `fetchAwards()` — Get event awards with optional team filter
- `fetchAlliances()` — Get playoff alliance selections
- `fetchDistricts()` — Get list of districts for a season
- `fetchDistrictRankings()` — Get district-wide team rankings

**UI Functions**:
- Tab switching event listeners — Handle navigation between data tabs
- DOMContentLoaded listener — Auto-loads credentials on page load

### Responsive Design

The FRC Data page is fully responsive:

**Desktop (>768px)**:
- Multi-column grids for events, awards, alliances, and districts
- Full-width tables with all columns visible
- Horizontal input groups
- Side-by-side alliance displays in matches

**Mobile (≤768px)**:
- Single-column layouts for all grids
- Vertical stacking of input fields
- Horizontally scrollable tables with smaller text
- Stacked alliance displays in matches
- Full-width buttons

### Development Notes

**Adding New API Endpoints**:

1. Add a new tab button to `.frc-tabs` with unique `data-tab` attribute
2. Create corresponding tab content div with matching `id="{data-tab}-tab"`
3. Add input fields with unique IDs
4. Create a fetch function following the pattern of existing functions
5. Style results using existing CSS classes or add new ones
6. Update this README with the new feature

**API Version**:
- Current: v3.0
- Base URL: `https://frc-api.firstinspires.org/v3.0`
- Documentation: [FRC API Docs](https://frc-api-docs.firstinspires.org/)

**Caching**:
- API uses Last-Modified headers for caching
- If-Modified-Since headers can be implemented for efficiency
- Current implementation does not use caching headers

**Rate Limiting**:
- No explicit rate limits documented
- Excessive traffic may result in account suspension
- Be respectful with API usage

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

To test the FRC Data page: `http://localhost:8000/frc-data.html`

## Configuration

### Image CDN
- **CDN URL**: `https://imagedelivery.net/${ACCOUNT_HASH}/${id}/public`
- **Account Hash**: Set in [script.js](script.js) as `ACCOUNT_HASH`

To switch to local images, edit the URL construction in `buildGrid()` to use the `Images/` directory.

### FRC API
- **API Base**: `https://frc-api.firstinspires.org/v3.0`
- **Username**: `crose4054` (pre-configured)
- **Auth Key**: Pre-configured in [frc-data.html](frc-data.html)
- **Storage**: localStorage in browser
- **Registration**: [FRC Events API](https://frc-events.firstinspires.org/services/API)

## Browser Compatibility

- **Modern Browsers**: Chrome, Firefox, Safari, Edge (latest versions)
- **JavaScript**: ES6+ features used (async/await, arrow functions, template literals)
- **LocalStorage**: Required for FRC API credential storage
- **Fetch API**: Required for API calls (no polyfill included)

## Security Considerations

1. **API Credentials**: 
   - Never commit real credentials to public repositories
   - Credentials in code are for demonstration/testing only
   - Users should obtain their own credentials
   - Consider using environment variables or secure config for production

2. **CORS**:
   - FRC API supports CORS for browser requests
   - Local development requires a web server (not file:// protocol)

3. **Data Validation**:
   - User inputs are validated before API calls
   - API responses are checked before rendering
   - Error messages displayed for invalid data

## Performance

- **Static Assets**: All HTML, CSS, JS served as static files
- **No Build Process**: Instant updates, no compilation
- **External Dependencies**: None (vanilla JavaScript only)
- **Image CDN**: Offloads image delivery to Cloudflare
- **Lazy Loading**: Images load as needed in gallery
- **Client-Side Rendering**: All data processing happens in browser

## Future Enhancements

Potential improvements for the FRC Data page:

1. **Caching**: Implement If-Modified-Since headers to reduce API calls
2. **Real-time Updates**: WebSocket integration for live match updates
3. **Data Export**: CSV/JSON export functionality for rankings and awards
4. **Team Comparison**: Side-by-side team statistics comparison
5. **Match Predictions**: Historical data analysis for match predictions
6. **Offline Mode**: Service worker for offline data access
7. **Data Visualization**: Charts and graphs for rankings and statistics
8. **Favorites**: Save favorite teams and events
9. **Notifications**: Alert system for upcoming matches
10. **Match Schedule**: Calendar integration for team schedule

## Git Workflow

All changes are automatically committed and pushed to the `Dev` branch:

```bash
git add <files>
git commit -m "Description of changes"
git push
```

**Recent Updates**:
- Added FRC Data page with comprehensive API integration
- Removed FRC Data from main navigation (accessible via direct URL)
- Added all major FRC API endpoints (season, events, teams, matches, rankings, awards, alliances, districts)
- Responsive design for all data displays
- Professional styling with color-coded elements

## Support

For issues related to:
- **Website**: Contact La Crosse Robotics Team 4054
- **FRC API**: Visit [FRC API Documentation](https://frc-api-docs.firstinspires.org/) or [FIRST Support](https://www.firstinspires.org/robotics/frc)

---

**Team**: La Crosse Robotics - Team 4054 The Aeronauts
**Season**: Taking Robotics Sky High Since 2012
