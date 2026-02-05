/**
 * Cloudflare Worker API for La Crosse Robotics Events
 */

export default {
	async fetch(request, env) {
		const url = new URL(request.url);
		
		// CORS headers
		const corsHeaders = {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
			'Access-Control-Allow-Headers': 'Content-Type',
		};

		// Handle CORS preflight
		if (request.method === 'OPTIONS') {
			return new Response(null, { headers: corsHeaders });
		}

		// Router
		if (url.pathname === '/api/events' && request.method === 'GET') {
			return handleGetEvents(env, corsHeaders);
		}
		
		if (url.pathname === '/api/events' && request.method === 'POST') {
			return handleCreateEvent(request, env, corsHeaders);
		}
		
		if (url.pathname.match(/^\/api\/events\/\d+$/) && request.method === 'PUT') {
			return handleUpdateEvent(request, env, corsHeaders, url);
		}
		
		if (url.pathname.match(/^\/api\/events\/\d+$/) && request.method === 'DELETE') {
			return handleDeleteEvent(env, corsHeaders, url);
		}

		return new Response('Not Found', { status: 404, headers: corsHeaders });
	},
};

/**
 * GET /api/events - Fetch all events
 */
async function handleGetEvents(env, corsHeaders) {
	try {
		const { results } = await env.DB.prepare(
			'SELECT * FROM events ORDER BY event_date ASC'
		).all();

		// Transform to match frontend format
		const events = {};
		results.forEach(row => {
			events[row.event_date] = {
				category: row.category,
				title: row.title,
				time: row.time,
				location: row.location
			};
		});

		return new Response(JSON.stringify(events), {
			headers: {
				...corsHeaders,
				'Content-Type': 'application/json',
			},
		});
	} catch (error) {
		return new Response(JSON.stringify({ error: error.message }), {
			status: 500,
			headers: {
				...corsHeaders,
				'Content-Type': 'application/json',
			},
		});
	}
}

/**
 * POST /api/events - Create a new event
 */
async function handleCreateEvent(request, env, corsHeaders) {
	try {
		const body = await request.json();
		const { event_date, category, title, time, location } = body;

		// Validate required fields
		if (!event_date || !category) {
			return new Response(JSON.stringify({ error: 'event_date and category are required' }), {
				status: 400,
				headers: {
					...corsHeaders,
					'Content-Type': 'application/json',
				},
			});
		}

		await env.DB.prepare(
			'INSERT INTO events (event_date, category, title, time, location) VALUES (?, ?, ?, ?, ?)'
		).bind(event_date, category, title || null, time || null, location || null).run();

		return new Response(JSON.stringify({ success: true, message: 'Event created' }), {
			status: 201,
			headers: {
				...corsHeaders,
				'Content-Type': 'application/json',
			},
		});
	} catch (error) {
		return new Response(JSON.stringify({ error: error.message }), {
			status: 500,
			headers: {
				...corsHeaders,
				'Content-Type': 'application/json',
			},
		});
	}
}

/**
 * PUT /api/events/:id - Update an event
 */
async function handleUpdateEvent(request, env, corsHeaders, url) {
	try {
		const id = url.pathname.split('/').pop();
		const body = await request.json();
		const { event_date, category, title, time, location } = body;

		await env.DB.prepare(
			'UPDATE events SET event_date = ?, category = ?, title = ?, time = ?, location = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
		).bind(event_date, category, title || null, time || null, location || null, id).run();

		return new Response(JSON.stringify({ success: true, message: 'Event updated' }), {
			headers: {
				...corsHeaders,
				'Content-Type': 'application/json',
			},
		});
	} catch (error) {
		return new Response(JSON.stringify({ error: error.message }), {
			status: 500,
			headers: {
				...corsHeaders,
				'Content-Type': 'application/json',
			},
		});
	}
}

/**
 * DELETE /api/events/:id - Delete an event
 */
async function handleDeleteEvent(env, corsHeaders, url) {
	try {
		const id = url.pathname.split('/').pop();

		await env.DB.prepare('DELETE FROM events WHERE id = ?').bind(id).run();

		return new Response(JSON.stringify({ success: true, message: 'Event deleted' }), {
			headers: {
				...corsHeaders,
				'Content-Type': 'application/json',
			},
		});
	} catch (error) {
		return new Response(JSON.stringify({ error: error.message }), {
			status: 500,
			headers: {
				...corsHeaders,
				'Content-Type': 'application/json',
			},
		});
	}
}
