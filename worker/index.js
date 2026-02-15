/**
 * Cloudflare Worker API for La Crosse Robotics Events
 */

export default {
	async fetch(request, env) {
		const url = new URL(request.url);
		const adminPassword = env.QUEUE_ADMIN_PASSWORD;
		const queuePin = env.QUEUE_PIN;
		
		// CORS headers
		const corsHeaders = {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
			'Access-Control-Allow-Headers': 'Content-Type, X-Queue-Pin, X-Queue-Admin',
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

		if (url.pathname === '/api/queue' && request.method === 'GET') {
			return handleGetQueue(env, corsHeaders);
		}

		if (url.pathname === '/api/queue' && request.method === 'POST') {
			return handleCreateQueueItem(request, env, corsHeaders, queuePin);
		}

		if (url.pathname === '/api/queue/next' && request.method === 'POST') {
			return handleAdvanceQueue(request, env, corsHeaders, adminPassword);
		}

		if (url.pathname === '/api/queue/clear' && request.method === 'POST') {
			return handleClearQueue(request, env, corsHeaders, adminPassword);
		}

		if (url.pathname.match(/^\/api\/queue\/\d+$/) && request.method === 'DELETE') {
			return handleDeleteQueueItem(request, env, corsHeaders, url, adminPassword);
		}

		if (url.pathname.match(/^\/api\/queue\/\d+\/play$/) && request.method === 'POST') {
			return handlePlayQueueItem(request, env, corsHeaders, url, adminPassword);
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

function isAuthorized(request, expectedSecret) {
	if (!expectedSecret) {
		return true;
	}
	const provided = request.headers.get('X-Queue-Admin');
	return provided && provided === expectedSecret;
}

function isPinAuthorized(request, expectedPin) {
	if (!expectedPin) {
		return true;
	}
	const provided = request.headers.get('X-Queue-Pin');
	return provided && provided === expectedPin;
}

/**
 * GET /api/queue - Fetch queue items
 */
async function handleGetQueue(env, corsHeaders) {
	try {
		const { results } = await env.DB.prepare(
			"SELECT id, provider, track_id, title, requester, url, status, created_at FROM queue WHERE status IN ('queued','playing') ORDER BY CASE status WHEN 'playing' THEN 0 ELSE 1 END, created_at ASC"
		).all();

		return new Response(JSON.stringify({ items: results }), {
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
 * POST /api/queue - Add item to queue
 */
async function handleCreateQueueItem(request, env, corsHeaders, queuePin) {
	try {
		if (!isPinAuthorized(request, queuePin)) {
			return new Response(JSON.stringify({ error: 'Invalid request PIN' }), {
				status: 401,
				headers: {
					...corsHeaders,
					'Content-Type': 'application/json',
				},
			});
		}

		const body = await request.json();
		const provider = String(body.provider || '').toLowerCase();
		const trackId = String(body.trackId || '').trim();
		const title = body.title ? String(body.title).trim() : null;
		const requester = body.requester ? String(body.requester).trim() : null;
		const url = body.url ? String(body.url).trim() : null;

		if (!['spotify', 'youtube'].includes(provider)) {
			return new Response(JSON.stringify({ error: 'provider must be spotify or youtube' }), {
				status: 400,
				headers: {
					...corsHeaders,
					'Content-Type': 'application/json',
				},
			});
		}

		if (!trackId) {
			return new Response(JSON.stringify({ error: 'trackId is required' }), {
				status: 400,
				headers: {
					...corsHeaders,
					'Content-Type': 'application/json',
				},
			});
		}

		const result = await env.DB.prepare(
			'INSERT INTO queue (provider, track_id, title, requester, url, status) VALUES (?, ?, ?, ?, ?, ?)'
		)
			.bind(provider, trackId, title, requester, url, 'queued')
			.run();

		const created = await env.DB.prepare(
			'SELECT id, provider, track_id, title, requester, url, status, created_at FROM queue WHERE id = ?'
		)
			.bind(result.meta.last_row_id)
			.first();

		return new Response(JSON.stringify({ item: created }), {
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
 * POST /api/queue/next - Advance queue to next item
 */
async function handleAdvanceQueue(request, env, corsHeaders, adminPassword) {
	try {
		if (!isAuthorized(request, adminPassword)) {
			return new Response(JSON.stringify({ error: 'Invalid admin password' }), {
				status: 401,
				headers: {
					...corsHeaders,
					'Content-Type': 'application/json',
				},
			});
		}

		await env.DB.prepare("UPDATE queue SET status = 'played' WHERE status = 'playing'").run();

		const next = await env.DB.prepare(
			"SELECT id, provider, track_id, title, requester, url, status, created_at FROM queue WHERE status = 'queued' ORDER BY created_at ASC LIMIT 1"
		).first();

		if (!next) {
			return new Response(JSON.stringify({ item: null }), {
				headers: {
					...corsHeaders,
					'Content-Type': 'application/json',
				},
			});
		}

		await env.DB.prepare("UPDATE queue SET status = 'playing' WHERE id = ?").bind(next.id).run();

		return new Response(JSON.stringify({ item: { ...next, status: 'playing' } }), {
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
 * POST /api/queue/clear - Clear queue
 */
async function handleClearQueue(request, env, corsHeaders, adminPassword) {
	try {
		if (!isAuthorized(request, adminPassword)) {
			return new Response(JSON.stringify({ error: 'Invalid admin password' }), {
				status: 401,
				headers: {
					...corsHeaders,
					'Content-Type': 'application/json',
				},
			});
		}

		await env.DB.prepare("UPDATE queue SET status = 'played' WHERE status IN ('queued','playing')").run();

		return new Response(JSON.stringify({ success: true }), {
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
 * DELETE /api/queue/:id - Remove item
 */
async function handleDeleteQueueItem(request, env, corsHeaders, url, adminPassword) {
	try {
		if (!isAuthorized(request, adminPassword)) {
			return new Response(JSON.stringify({ error: 'Invalid admin password' }), {
				status: 401,
				headers: {
					...corsHeaders,
					'Content-Type': 'application/json',
				},
			});
		}

		const id = url.pathname.split('/')[3];
		await env.DB.prepare('DELETE FROM queue WHERE id = ?').bind(id).run();

		return new Response(JSON.stringify({ success: true }), {
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
 * POST /api/queue/:id/play - Force play specific item
 */
async function handlePlayQueueItem(request, env, corsHeaders, url, adminPassword) {
	try {
		if (!isAuthorized(request, adminPassword)) {
			return new Response(JSON.stringify({ error: 'Invalid admin password' }), {
				status: 401,
				headers: {
					...corsHeaders,
					'Content-Type': 'application/json',
				},
			});
		}

		const id = url.pathname.split('/')[3];
		await env.DB.prepare("UPDATE queue SET status = 'played' WHERE status = 'playing'").run();
		await env.DB.prepare("UPDATE queue SET status = 'playing' WHERE id = ?").bind(id).run();

		const item = await env.DB.prepare(
			'SELECT id, provider, track_id, title, requester, url, status, created_at FROM queue WHERE id = ?'
		)
			.bind(id)
			.first();

		return new Response(JSON.stringify({ item }), {
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
