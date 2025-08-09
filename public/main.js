const coffeesGrid = document.querySelector('#coffees');
const commentForm = document.querySelector('#comment-form');
const commentList = document.querySelector('#comment-list');

async function fetchJSON(url, options) {
  const res = await fetch(url, options);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

function renderStrength(level) {
  const beans = Array.from({ length: 5 }, (_, i) => i < Number(level) ? '🫘' : '▫️');
  return `<span class="strength" aria-label="strength ${level}/5">${beans.map(b => `<span>${b}</span>`).join('')}</span>`;
}

function createCoffeeCard(coffee) {
  const card = document.createElement('div');
  card.className = 'coffee-card';
  card.innerHTML = `
    <div class="coffee-title"><span class="coffee-emoji">${coffee.emoji}</span> <strong>${coffee.name}</strong></div>
    <div class="coffee-meta">Origin: ${coffee.origin || 'Unknown'} · Strength: ${renderStrength(coffee.strength)}</div>
    <div class="coffee-desc">${coffee.description || ''}</div>
  `;
  return card;
}

async function loadCoffees() {
  try {
    const coffees = await fetchJSON('/api/coffees');
    coffeesGrid.innerHTML = '';
    coffees.forEach(c => coffeesGrid.appendChild(createCoffeeCard(c)));
  } catch (err) {
    coffeesGrid.innerHTML = `<div class="coffee-card">Failed to load menu. Please refresh. (${err.message})</div>`;
  }
}

function renderCommentItem(c) {
  const li = document.createElement('li');
  li.className = 'comment-item';
  const date = new Date(c.created_at.replace(' ', 'T'));
  li.innerHTML = `
    <div class="comment-head">
      <span>👤 ${escapeHTML(c.name || 'Anonymous')}</span>
      <time datetime="${date.toISOString()}">${date.toLocaleString()}</time>
    </div>
    <div class="comment-msg">${linkify(escapeHTML(c.message))}</div>
  `;
  return li;
}

function escapeHTML(text) {
  return String(text)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function linkify(text) {
  const urlRe = /(https?:\/\/[^\s]+)/g;
  return text.replace(urlRe, (m) => `<a href="${m}" target="_blank" rel="noopener noreferrer">${m}</a>`);
}

async function loadComments() {
  try {
    const comments = await fetchJSON('/api/comments');
    commentList.innerHTML = '';
    comments.forEach(c => commentList.appendChild(renderCommentItem(c)));
  } catch (err) {
    commentList.innerHTML = `<li class="comment-item">Could not load comments. (${err.message})</li>`;
  }
}

commentForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(commentForm);
  const payload = {
    name: formData.get('name') || 'Anonymous',
    message: formData.get('message') || ''
  };
  if (!payload.message.trim()) return;

  const btn = commentForm.querySelector('button[type="submit"]');
  btn.disabled = true;
  btn.textContent = 'Posting…';
  try {
    const newComment = await fetchJSON('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    commentForm.reset();
    commentList.insertBefore(renderCommentItem(newComment), commentList.firstChild);
  } catch (err) {
    alert('Failed to post comment. ' + err.message);
  } finally {
    btn.disabled = false;
    btn.textContent = 'Post ✍️';
  }
});

loadCoffees();
loadComments();