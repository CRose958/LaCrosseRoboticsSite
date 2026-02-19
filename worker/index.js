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

		// Notes endpoints
		if (url.pathname === '/api/notes' && request.method === 'GET') {
			return handleGetNotes(env, corsHeaders);
		}
		
		if (url.pathname === '/api/notes' && request.method === 'POST') {
			return handleCreateNote(request, env, corsHeaders);
		}
		
		if (url.pathname.match(/^\/api\/notes\/\d+$/) && request.method === 'PUT') {
			return handleUpdateNote(request, env, corsHeaders, url);
		}
		
		if (url.pathname.match(/^\/api\/notes\/\d+$/) && request.method === 'DELETE') {
			return handleDeleteNote(env, corsHeaders, url);
		}

		// Deleted notes endpoints
		if (url.pathname === '/api/deleted-notes' && request.method === 'GET') {
			return handleGetDeletedNotes(env, corsHeaders);
		}
		
		if (url.pathname.match(/^\/api\/deleted-notes\/\d+\/restore$/) && request.method === 'POST') {
			return handleRestoreNote(env, corsHeaders, url);
		}
		
		if (url.pathname.match(/^\/api\/deleted-notes\/\d+$/) && request.method === 'DELETE') {
			return handlePermanentDeleteNote(env, corsHeaders, url);
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

/**
 * GET /api/notes - Fetch all notes
 */
async function handleGetNotes(env, corsHeaders) {
	try {
		const { results } = await env.DB.prepare(
			'SELECT * FROM notes ORDER BY updated_at DESC'
		).all();

		return new Response(JSON.stringify(results), {
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
 * POST /api/notes - Create a new note
 */
async function handleCreateNote(request, env, corsHeaders) {
	try {
		const body = await request.json();
		const { title, content } = body;

		// Validate required fields
		if (!title || !content) {
			return new Response(JSON.stringify({ error: 'title and content are required' }), {
				status: 400,
				headers: {
					...corsHeaders,
					'Content-Type': 'application/json',
				},
			});
		}

		const result = await env.DB.prepare(
			'INSERT INTO notes (title, content) VALUES (?, ?)'
		).bind(title, content).run();

		return new Response(JSON.stringify({ success: true, message: 'Note created', id: result.meta.last_row_id }), {
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
 * PUT /api/notes/:id - Update a note
 */
async function handleUpdateNote(request, env, corsHeaders, url) {
	try {
		const id = url.pathname.split('/').pop();
		const body = await request.json();
		const { title, content } = body;

		// Validate required fields
		if (!title || !content) {
			return new Response(JSON.stringify({ error: 'title and content are required' }), {
				status: 400,
				headers: {
					...corsHeaders,
					'Content-Type': 'application/json',
				},
			});
		}

		await env.DB.prepare(
			'UPDATE notes SET title = ?, content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
		).bind(title, content, id).run();

		return new Response(JSON.stringify({ success: true, message: 'Note updated' }), {
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
 * DELETE /api/notes/:id - Archive a note (move to deleted_notes)
 */
async function handleDeleteNote(env, corsHeaders, url) {
	try {
		const id = url.pathname.split('/').pop();

		// First, get the note to archive
		const note = await env.DB.prepare('SELECT * FROM notes WHERE id = ?').bind(id).first();
		
		if (!note) {
			return new Response(JSON.stringify({ error: 'Note not found' }), {
				status: 404,
				headers: {
					...corsHeaders,
					'Content-Type': 'application/json',
				},
			});
		}

		// Insert into deleted_notes
		await env.DB.prepare(
			'INSERT INTO deleted_notes (original_id, title, content, created_at, updated_at) VALUES (?, ?, ?, ?, ?)'
		).bind(note.id, note.title, note.content, note.created_at, note.updated_at).run();

		// Delete from notes
		await env.DB.prepare('DELETE FROM notes WHERE id = ?').bind(id).run();

		return new Response(JSON.stringify({ success: true, message: 'Note archived' }), {
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
 * GET /api/deleted-notes - Fetch all deleted notes
 */
async function handleGetDeletedNotes(env, corsHeaders) {
	try {
		const { results } = await env.DB.prepare(
			'SELECT * FROM deleted_notes ORDER BY deleted_at DESC'
		).all();

		return new Response(JSON.stringify(results), {
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
 * POST /api/deleted-notes/:id/restore - Restore a deleted note
 */
async function handleRestoreNote(env, corsHeaders, url) {
	try {
		const id = url.pathname.split('/')[3]; // Get ID from path

		// Get the deleted note
		const deletedNote = await env.DB.prepare('SELECT * FROM deleted_notes WHERE id = ?').bind(id).first();
		
		if (!deletedNote) {
			return new Response(JSON.stringify({ error: 'Deleted note not found' }), {
				status: 404,
				headers: {
					...corsHeaders,
					'Content-Type': 'application/json',
				},
			});
		}

		// Restore to notes table
		await env.DB.prepare(
			'INSERT INTO notes (title, content, created_at, updated_at) VALUES (?, ?, ?, ?)'
		).bind(deletedNote.title, deletedNote.content, deletedNote.created_at, deletedNote.updated_at).run();

		// Remove from deleted_notes
		await env.DB.prepare('DELETE FROM deleted_notes WHERE id = ?').bind(id).run();

		return new Response(JSON.stringify({ success: true, message: 'Note restored' }), {
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
 * DELETE /api/deleted-notes/:id - Permanently delete a note
 */
async function handlePermanentDeleteNote(env, corsHeaders, url) {
	try {
		const id = url.pathname.split('/').pop();

		await env.DB.prepare('DELETE FROM deleted_notes WHERE id = ?').bind(id).run();

		return new Response(JSON.stringify({ success: true, message: 'Note permanently deleted' }), {
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
