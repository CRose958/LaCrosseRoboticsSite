# Cloudflare D1 Setup Instructions

## Prerequisites
- Node.js installed
- Cloudflare account
- Wrangler CLI installed (`npm install -g wrangler`)

## Setup Steps

### 1. Install Wrangler (if not already installed)
```bash
npm install -g wrangler
```

### 2. Login to Cloudflare
```bash
wrangler login
```

### 3. Create the D1 Database
```bash
wrangler d1 create lacrosse-robotics-events
```

This will output a database ID. Copy it and paste it into `wrangler.toml` in the `database_id` field.

### 4. Initialize the Database with Schema
```bash
wrangler d1 execute lacrosse-robotics-events --file=schema.sql
```

### 5. Deploy the Worker
```bash
wrangler deploy
```

After deployment, you'll get a URL like: `https://lacrosse-robotics-api.your-subdomain.workers.dev`

### 6. Update Frontend API URL
In `script.js`, add at the top of the DOMContentLoaded block:

```javascript
const API_URL = 'https://lacrosse-robotics-api.your-subdomain.workers.dev';

// Fetch events from API instead of using hardcoded data
async function loadEvents() {
    try {
        const response = await fetch(`${API_URL}/api/events`);
        const events = await response.json();
        window.sampleEvents = events;
        
        // Trigger calendar re-render if on calendar page
        if (typeof renderCalendar === 'function') {
            renderCalendar();
        }
    } catch (error) {
        console.error('Failed to load events:', error);
        // Fallback to existing hardcoded events
    }
}

// Load events immediately
loadEvents();
```

## API Endpoints

### GET /api/events
Fetch all events
```bash
curl https://your-worker.workers.dev/api/events
```

### POST /api/events
Create a new event
```bash
curl -X POST https://your-worker.workers.dev/api/events \
  -H "Content-Type: application/json" \
  -d '{
    "event_date": "2026-4-2",
    "category": "FIRST",
    "title": "Seven Rivers Event",
    "time": "All Day",
    "location": "La Crosse Center"
  }'
```

### PUT /api/events/:id
Update an event
```bash
curl -X PUT https://your-worker.workers.dev/api/events/1 \
  -H "Content-Type: application/json" \
  -d '{
    "event_date": "2026-4-2",
    "category": "FIRST",
    "title": "Updated Event",
    "time": "9:00 AM",
    "location": "New Location"
  }'
```

### DELETE /api/events/:id
Delete an event
```bash
curl -X DELETE https://your-worker.workers.dev/api/events/1
```

## Local Development

### Run worker locally
```bash
wrangler dev
```

### Query database locally
```bash
wrangler d1 execute lacrosse-robotics-events --local --command="SELECT * FROM events"
```

## Troubleshooting

### Check database contents
```bash
wrangler d1 execute lacrosse-robotics-events --command="SELECT * FROM events LIMIT 10"
```

### View worker logs
```bash
wrangler tail
```

## Security Note
The current API allows unrestricted access. For production, you should:
1. Add authentication (API keys, JWT tokens)
2. Restrict CORS origins in `wrangler.toml`
3. Add rate limiting
4. Validate all inputs
