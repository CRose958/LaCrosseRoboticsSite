(() => {
  const API_BASE = window.MUSIC_QUEUE_API_BASE || '';
  const REFRESH_MS = 5000;

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => Array.from(document.querySelectorAll(selector));

  const requestForm = $('#song-request-form');
  const requestStatus = $('#request-status');
  const queueList = $('#queue-list');
  const nowPlaying = $('#now-playing');
  const playerFrame = $('#player-frame');
  const adminControls = $('#admin-controls');
  const adminGate = $('#admin-gate');
  const adminPasswordInput = $('#admin-password');
  const adminUnlockButton = $('#admin-unlock');

  const getAdminToken = () => sessionStorage.getItem('queueAdminToken') || '';
  const getPinToken = () => $('#request-pin')?.value?.trim() || '';

  const apiFetch = async (path, options = {}) => {
    const response = await fetch(`${API_BASE}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || `Request failed: ${response.status}`);
    }

    return response.json();
  };

  const parseTrackInput = (input) => {
    const value = input.trim();
    if (!value) return null;

    const spotifyMatch = value.match(/open\.spotify\.com\/track\/([a-zA-Z0-9]+)/);
    if (spotifyMatch) {
      return { provider: 'spotify', trackId: spotifyMatch[1], url: value };
    }

    const spotifyUri = value.match(/spotify:track:([a-zA-Z0-9]+)/);
    if (spotifyUri) {
      return { provider: 'spotify', trackId: spotifyUri[1], url: `https://open.spotify.com/track/${spotifyUri[1]}` };
    }

    const youtubeMatch = value.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|music\.youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{6,})/);
    if (youtubeMatch) {
      return { provider: 'youtube', trackId: youtubeMatch[1], url: value };
    }

    return null;
  };

  const buildEmbedUrl = (provider, trackId) => {
    if (provider === 'spotify') {
      return `https://open.spotify.com/embed/track/${trackId}`;
    }

    return `https://www.youtube.com/embed/${trackId}?autoplay=1&rel=0`;
  };

  const formatLabel = (item) => {
    const providerLabel = item.provider === 'spotify' ? 'Spotify' : 'YouTube Music';
    const title = item.title || 'Untitled track';
    const requester = item.requester ? ` — requested by ${item.requester}` : '';
    return `${title} (${providerLabel})${requester}`;
  };

  const renderQueue = (items, isAdmin) => {
    if (!queueList) return;

    if (!items.length) {
      queueList.innerHTML = '<li class="queue-empty">No songs in the queue yet.</li>';
      return;
    }

    queueList.innerHTML = items.map(item => {
      const statusBadge = item.status === 'playing' ? '<span class="queue-tag playing">Playing</span>' : '<span class="queue-tag">Queued</span>';
      const adminButtons = isAdmin
        ? `<div class="queue-actions">
            <button class="btn btn-small" data-action="play" data-id="${item.id}">Play now</button>
            <button class="btn btn-small btn-outline" data-action="remove" data-id="${item.id}">Remove</button>
          </div>`
        : '';

      return `
        <li class="queue-item">
          <div class="queue-meta">
            <div class="queue-title">${formatLabel(item)}</div>
            ${statusBadge}
          </div>
          ${adminButtons}
        </li>
      `;
    }).join('');
  };

  const updateNowPlaying = (items) => {
    if (!nowPlaying || !playerFrame) return;

    const playing = items.find(item => item.status === 'playing') || items[0];

    if (!playing) {
      nowPlaying.textContent = 'Nothing playing right now.';
      playerFrame.src = '';
      playerFrame.classList.add('hidden-player');
      return;
    }

    nowPlaying.textContent = formatLabel(playing);
    playerFrame.src = buildEmbedUrl(playing.provider, playing.track_id);
    playerFrame.classList.remove('hidden-player');
  };

  const refreshQueue = async (isAdmin = false) => {
    try {
      const { items } = await apiFetch('/api/queue');
      renderQueue(items, isAdmin);
      updateNowPlaying(items);
    } catch (error) {
      if (requestStatus) {
        requestStatus.textContent = error.message;
        requestStatus.classList.add('error');
      }
    }
  };

  if (requestForm) {
    requestForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const requester = $('#requester-name')?.value || '';
      const trackInput = $('#track-input')?.value || '';
      const titleInput = $('#track-title')?.value || '';

      const parsed = parseTrackInput(trackInput);
      const pinToken = getPinToken();

      if (!pinToken) {
        requestStatus.textContent = 'Enter the request PIN.';
        requestStatus.classList.add('error');
        return;
      }
      if (!parsed) {
        requestStatus.textContent = 'Paste a Spotify track link/URI or a YouTube Music link.';
        requestStatus.classList.add('error');
        return;
      }

      try {
        requestStatus.textContent = 'Adding to queue...';
        requestStatus.classList.remove('error');

        await apiFetch('/api/queue', {
          method: 'POST',
          body: JSON.stringify({
            provider: parsed.provider,
            trackId: parsed.trackId,
            url: parsed.url,
            title: titleInput,
            requester,
          }),
          headers: {
            'X-Queue-Pin': pinToken,
          },
        });

        requestStatus.textContent = 'Added! Thank you for the request.';
        requestForm.reset();
        await refreshQueue(false);
      } catch (error) {
        requestStatus.textContent = error.message;
        requestStatus.classList.add('error');
      }
    });

    refreshQueue(false);
    setInterval(() => refreshQueue(false), REFRESH_MS);
  }

  if (adminControls) {
    const playNextButton = $('#queue-next');
    const startButton = $('#queue-start');
    const clearButton = $('#queue-clear');

    const requireAdmin = () => {
      const token = getAdminToken();
      if (!token) {
        if (requestStatus) {
          requestStatus.textContent = 'Admin password required.';
          requestStatus.classList.add('error');
        }
        return null;
      }
      return token;
    };

    const runAdminAction = async (action, id) => {
      const token = requireAdmin();
      if (!token) return;

      if (action === 'play') {
        await apiFetch(`/api/queue/${id}/play`, {
          method: 'POST',
          headers: { 'X-Queue-Admin': token },
        });
      } else if (action === 'remove') {
        await apiFetch(`/api/queue/${id}`, {
          method: 'DELETE',
          headers: { 'X-Queue-Admin': token },
        });
      } else if (action === 'next') {
        await apiFetch('/api/queue/next', {
          method: 'POST',
          headers: { 'X-Queue-Admin': token },
        });
      } else if (action === 'clear') {
        await apiFetch('/api/queue/clear', {
          method: 'POST',
          headers: { 'X-Queue-Admin': token },
        });
      }
    };

    queueList?.addEventListener('click', async (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      const action = target.dataset.action;
      const id = target.dataset.id;
      if (!action || !id) return;

      try {
        await runAdminAction(action, id);
        await refreshQueue(true);
      } catch (error) {
        if (requestStatus) {
          requestStatus.textContent = error.message;
          requestStatus.classList.add('error');
        }
      }
    });

    playNextButton?.addEventListener('click', async () => {
      await runAdminAction('next');
      await refreshQueue(true);
    });

    startButton?.addEventListener('click', async () => {
      await runAdminAction('next');
      await refreshQueue(true);
    });

    clearButton?.addEventListener('click', async () => {
      await runAdminAction('clear');
      await refreshQueue(true);
    });

    refreshQueue(true);
    setInterval(() => refreshQueue(true), REFRESH_MS);
  }

  if (adminGate && adminPasswordInput && adminUnlockButton) {
    const unlock = () => {
      const token = adminPasswordInput.value.trim();
      if (!token) return;
      sessionStorage.setItem('queueAdminToken', token);
      document.body.classList.add('queue-unlocked');
      adminGate.classList.add('hidden-gate');
      refreshQueue(true);
    };

    adminUnlockButton.addEventListener('click', (event) => {
      event.preventDefault();
      unlock();
    });

    adminPasswordInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        unlock();
      }
    });

    if (getAdminToken()) {
      document.body.classList.add('queue-unlocked');
      adminGate.classList.add('hidden-gate');
    }
  }
})();
