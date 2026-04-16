
const COLORS = [
  { name: "rose", hex: "#e8b4b8" },
  { name: "blush", hex: "#f2c5c0" },
  { name: "coral", hex: "#e8856a" },
  { name: "rust", hex: "#c0623a" },
  { name: "amber", hex: "#e8a84a" },
  { name: "gold", hex: "#d4a843" },
  { name: "sage", hex: "#8faa8a" },
  { name: "forest", hex: "#4a7c5a" },
  { name: "sky", hex: "#a8d8ea" },
  { name: "ocean", hex: "#5a8faa" },
  { name: "dusk", hex: "#6a6a9a" },
  { name: "plum", hex: "#8a5a8a" },
  { name: "lilac", hex: "#b4a8d8" },
  { name: "lavender", hex: "#c8b4e8" },
  { name: "peach", hex: "#f9c9a0" },
  { name: "sand", hex: "#d4c4a8" },
  { name: "slate", hex: "#8a9aaa" },
  { name: "midnight", hex: "#3a3a5a" },
  { name: "smoke", hex: "#9a9a9a" },
  { name: "cream", hex: "#e8e0d0" },
];

const SEEDS = [
  { to: "Alex", text: "I still listen to that playlist you made. I don't know why I told you I deleted it.", color: "ocean" },
  { to: "Jordan", text: "You were the first person who made me feel like I was worth something. I hope you know that.", color: "rose" },
  { to: "Sam", text: "I almost texted you when I got the job. Then I remembered you wouldn't care anymore.", color: "dusk" },
  { to: "Maya", text: "I think about you every single time I drive past that parking lot. I'm sorry I let you leave.", color: "sage" },
  { to: "Tyler", text: "I don't regret it. I just wish you'd said goodbye properly.", color: "rust" },
  { to: "Chris", text: "I'm getting married. I wanted you to know that I'm okay. I don't know why that felt important.", color: "plum" },
  { to: "Jamie", text: "You taught me that love isn't supposed to hurt like that. That took a long time to learn.", color: "lavender" },
  { to: "River", text: "It's been four years and I still dream about the way you laughed at nothing.", color: "amber" },
  { to: "Nadia", text: "I should have fought harder. I was twenty-two and I thought there would be more time.", color: "blush" },
  { to: "Eli", text: "I deleted your number three times. I still have it memorized.", color: "midnight" },
  { to: "Sofía", text: "Nobody has ever looked at me the way you did. I didn't deserve it then. Maybe I do now.", color: "gold" },
  { to: "Marcus", text: "I told everyone we just fell out of touch. That felt easier than the truth.", color: "slate" },
  { to: "Priya", text: "I saw someone wearing your coat on the subway. I had to sit down.", color: "sky" },
  { to: "Leo", text: "I forgive you. I'm writing this so I actually have to mean it.", color: "sage" },
  { to: "Zoe", text: "We were just kids. I know that. I still keep the polaroid.", color: "coral" },
  { to: "Dev", text: "You made me feel chosen. I've been chasing that feeling ever since.", color: "rose" },
  { to: "Lily", text: "I hope whoever loves you now knows what they have.", color: "lilac" },
  { to: "Kai", text: "Some days I wonder if we were just bad timing. Most days I know we were something else.", color: "ocean" },
  { to: "Hazel", text: "I still can't read that book. The one you gave me. It just sits there.", color: "forest" },
  { to: "Finn", text: "I never told you I was scared. I was always scared.", color: "peach" },
  { to: "Avery", text: "You were right about me. That's all.", color: "smoke" },
  { to: "Grace", text: "Sometimes I write you messages and don't send them. This is one of those.", color: "blush" },
  { to: "Noah", text: "I'm not angry anymore. I just miss who we were before.", color: "dusk" },
  { to: "Ivy", text: "The way you said my name. Nobody says it like that anymore.", color: "plum" },
  { to: "Cole", text: "I hope you're not as hard on yourself as you used to be.", color: "amber" },
  { to: "Mia", text: "You were my favorite hello and my hardest goodbye.", color: "rose" },
  { to: "Asha", text: "I watched that film you recommended. You were right. You were always right about everything.", color: "sage" },
  { to: "Quinn", text: "I kept the voice note. I listen to it sometimes. I know.", color: "lavender" },
  { to: "Dante", text: "I wanted to be everything you needed. I'm sorry I was only human.", color: "midnight" },
  { to: "Vera", text: "You would've hated my apartment. I decorated it thinking of you anyway.", color: "coral" },
];



let messages = [...SEEDS];
let selectedColorFilter = null;
let visibleCount = 12;
let selectedColor = COLORS[0];
let savedMessages = [];
let myMessages = [];
let reactions = {};
let userReacted = {};
let currentModalIdx = -1;
let currentUser = null;
let randomIdx = -1;

const DEMO_USERS = [
  { email: 'demo@unsent.com', password: 'unsent123', name: 'demo' }
];
// registered users (persists in session)
const registeredUsers = [...DEMO_USERS];

function getColor(name) {
  return COLORS.find(c => c.name === name) || COLORS[0];
}

function escapeHtml(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2400);
}

function toggleMenu() {
  document.getElementById('hamburger').classList.toggle('open');
  document.getElementById('mobile-menu').classList.toggle('open');
}

function closeMenu() {
  document.getElementById('hamburger').classList.remove('open');
  document.getElementById('mobile-menu').classList.remove('open');
}



function setFieldError(inputId, show) {
  const input = document.getElementById(inputId);
  if (input) {
    if (show) input.classList.add('input-error');
    else input.classList.remove('input-error');
  }
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function doLogin() {
  const email = document.getElementById('login-email').value.trim();
  const pass  = document.getElementById('login-password').value;
  const err   = document.getElementById('login-error');

  // clear previous state
  setFieldError('login-email', false);
  setFieldError('login-password', false);
  err.classList.remove('show');

  if (!email) {
    err.textContent = 'email is required.';
    err.classList.add('show');
    setFieldError('login-email', true);
    return;
  }

  if (!isValidEmail(email)) {
    err.textContent = "that doesn\'t look like a valid email.";
    err.classList.add('show');
    setFieldError('login-email', true);
    return;
  }

  if (!pass) {
    err.textContent = 'password is required.';
    err.classList.add('show');
    setFieldError('login-password', true);
    return;
  }

  const user = registeredUsers.find(u => u.email === email && u.password === pass);

  if (!user) {
    err.textContent = 'incorrect email or password.';
    err.classList.add('show');
    setFieldError('login-email', true);
    setFieldError('login-password', true);
    return;
  }

  currentUser = user;
  applyLoggedInUI(user.name);
  showPage('home');
  showToast('welcome back, ' + user.name + ' ✦');
}

function doSignup() {
  const name    = document.getElementById('signup-name').value.trim();
  const email   = document.getElementById('signup-email').value.trim();
  const pass    = document.getElementById('signup-password').value;
  const confirm = document.getElementById('signup-confirm-password').value;
  const err     = document.getElementById('signup-error');

  // clear previous state
  setFieldError('signup-name', false);
  setFieldError('signup-email', false);
  setFieldError('signup-password', false);
  setFieldError('signup-confirm-password', false);
  err.classList.remove('show');

  if (!name) {
    err.textContent = 'display name is required.';
    err.classList.add('show');
    setFieldError('signup-name', true);
    return;
  }

  if (!email) {
    err.textContent = 'email is required.';
    err.classList.add('show');
    setFieldError('signup-email', true);
    return;
  }

  if (!isValidEmail(email)) {
    err.textContent = "that doesn\'t look like a valid email.";
    err.classList.add('show');
    setFieldError('signup-email', true);
    return;
  }

  if (registeredUsers.find(u => u.email === email)) {
    err.textContent = 'an account with that email already exists.';
    err.classList.add('show');
    setFieldError('signup-email', true);
    return;
  }

  if (pass.length < 6) {
    err.textContent = 'password must be at least 6 characters.';
    err.classList.add('show');
    setFieldError('signup-password', true);
    return;
  }

  if (!confirm) {
    err.textContent = 'please confirm your password.';
    err.classList.add('show');
    setFieldError('signup-confirm-password', true);
    return;
  }

  if (pass !== confirm) {
    err.textContent = 'passwords do not match.';
    err.classList.add('show');
    setFieldError('signup-confirm-password', true);
    return;
  }

  const newUser = { name, email, password: pass };
  registeredUsers.push(newUser);
  currentUser = newUser;
  applyLoggedInUI(name);
  showPage('home');
  showToast('welcome, ' + name + ' ✦');
}

function guestLogin() {
  currentUser = { name: 'guest', email: null };
  applyLoggedInUI('guest');
  showPage('home');
  showToast('continuing as guest');
}

function applyLoggedInUI(name) {
  document.getElementById('nav-user-area').innerHTML = `
    <div class="user-badge">
      <div class="user-dot"></div>
      <span style="font-size:.82rem;color:var(--muted);letter-spacing:.03em">${escapeHtml(name)}</span>
      <button
        style="background:none;border:none;cursor:pointer;font-size:.75rem;color:var(--muted);
               letter-spacing:.05em;text-transform:uppercase;font-family:'Inter',sans-serif;margin-left:.35rem"
        onclick="doLogout()">out</button>
    </div>`;

  if (!document.getElementById('m-nav-my')) {
    const mobileMenu = document.getElementById('mobile-menu');
    const btn = document.createElement('button');
    btn.id = 'm-nav-my';
    btn.textContent = 'my messages';
    btn.onclick = () => { showPage('my'); closeMenu(); };
    mobileMenu.insertBefore(btn, mobileMenu.querySelector('.m-submit'));
  }

  const mLoginBtn = document.getElementById('m-nav-login');
  mLoginBtn.textContent = 'sign out';
  mLoginBtn.onclick = () => { doLogout(); closeMenu(); };
}

function doLogout() {
  currentUser = null;

  document.getElementById('nav-user-area').innerHTML =
    `<button class="nav-login-btn" onclick="showPage('login')" id="nav-login-btn">sign in</button>`;

  const mLoginBtn = document.getElementById('m-nav-login');
  mLoginBtn.textContent = 'sign in';
  mLoginBtn.onclick = () => { showPage('login'); closeMenu(); };

  const mMyBtn = document.getElementById('m-nav-my');
  if (mMyBtn) mMyBtn.remove();

  showToast('signed out');
}

function switchToSignup() {
  document.getElementById('login-form').style.display = 'none';
  document.getElementById('signup-form').style.display = 'block';
  document.getElementById('login-title').textContent = 'create account';
  document.getElementById('login-sub').textContent = 'join the archive. everything stays anonymous.';
}

function switchToLogin() {
  document.getElementById('signup-form').style.display = 'none';
  document.getElementById('login-form').style.display = 'block';
  document.getElementById('login-title').textContent = 'sign in';
  document.getElementById('login-sub').textContent = 'Your unsent messages, saved bookmarks, and reactions — all in one place.';
}



function buildColorPicker() {
  const grid = document.getElementById('color-picker');
  grid.innerHTML = '';

  COLORS.forEach(c => {
    const el = document.createElement('div');
    el.className = 'color-option' + (c.name === selectedColor.name ? ' selected' : '');
    el.style.background = c.hex;
    el.title = c.name;

    el.onclick = () => {
      selectedColor = c;
      document.querySelectorAll('.color-option').forEach(o => o.classList.remove('selected'));
      el.classList.add('selected');
      updatePreview();
    };

    grid.appendChild(el);
  });
}



function buildColorFilters() {
  const wrap = document.getElementById('color-filters');
  wrap.innerHTML = '';

  const allDot = document.createElement('div');
  allDot.className = 'color-filter all-filter' + (!selectedColorFilter ? ' selected' : '');
  allDot.title = 'all';
  allDot.onclick = () => {
    selectedColorFilter = null;
    buildColorFilters();
    renderArchive();
  };
  wrap.appendChild(allDot);

  COLORS.forEach(c => {
    const el = document.createElement('div');
    el.className = 'color-filter' + (selectedColorFilter === c.name ? ' selected' : '');
    el.style.background = c.hex;
    el.title = c.name;
    el.onclick = () => {
      selectedColorFilter = c.name;
      buildColorFilters();
      renderArchive();
    };
    wrap.appendChild(el);
  });
}



function buildCard(m, idx, showBookmark) {
  const c = getColor(m.color);
  const card = document.createElement('div');
  const isSaved = savedMessages.includes(m);
  const reacts = reactions[idx] || 0;

  card.className = 'message-card';
  card.style.background = c.hex;

  card.innerHTML = `
    <div class="message-to">to ${escapeHtml(m.to)}</div>
    <div class="message-text">${escapeHtml(m.text)}</div>
    <div class="message-meta">${c.name}${reacts > 0 ? ' · ♡ ' + reacts : ''}</div>
    ${showBookmark
      ? `<button class="bookmark-btn${isSaved ? ' saved' : ''}"
           onclick="toggleSave(event, ${idx})"
           title="${isSaved ? 'unsave' : 'save'}">${isSaved ? '♥' : '♡'}</button>`
      : ''}
  `;

  card.onclick = e => {
    if (!e.target.classList.contains('bookmark-btn')) openModal(idx);
  };

  return card;
}



function renderArchive() {
  const query = document.getElementById('search-input').value.trim().toLowerCase();

  const filtered = messages.filter(m => {
    const matchText = !query || m.to.toLowerCase().includes(query) || m.text.toLowerCase().includes(query);
    const matchColor = !selectedColorFilter || m.color === selectedColorFilter;
    return matchText && matchColor;
  });

  document.getElementById('archive-count').textContent =
    filtered.length + ' message' + (filtered.length !== 1 ? 's' : '');

  const grid = document.getElementById('messages-grid');
  const empty = document.getElementById('empty-state');
  const loadBtn = document.getElementById('load-more-btn');

  if (filtered.length === 0) {
    grid.innerHTML = '';
    empty.style.display = 'block';
    loadBtn.style.display = 'none';
    return;
  }

  empty.style.display = 'none';
  grid.innerHTML = '';

  filtered.slice(0, visibleCount).forEach(m => {
    grid.appendChild(buildCard(m, messages.indexOf(m), true));
  });

  loadBtn.style.display = filtered.length > visibleCount ? 'block' : 'none';
}

function loadMore() {
  visibleCount += 12;
  renderArchive();
}


function openModal(idx) {
  currentModalIdx = idx;
  const m = messages[idx];
  const c = getColor(m.color);

  document.getElementById('modal-bar').style.background = c.hex;
  document.getElementById('modal-to').textContent = 'to ' + m.to;
  document.getElementById('modal-text').textContent = m.text;

  const cnt = reactions[idx] || 0;
  document.getElementById('react-count').textContent = cnt;
  document.getElementById('react-heart').textContent = userReacted[idx] ? '♥' : '♡';
  document.getElementById('modal-react-btn').classList.toggle('reacted', !!userReacted[idx]);

  document.getElementById('modal').classList.add('open');
}

function closeModal(e) {
  if (e.target === document.getElementById('modal')) {
    document.getElementById('modal').classList.remove('open');
  }
}

function toggleReact() {
  if (currentModalIdx < 0) return;

  if (userReacted[currentModalIdx]) {

    reactions[currentModalIdx] = Math.max(0, (reactions[currentModalIdx] || 0) - 1);
    userReacted[currentModalIdx] = false;
  } else {

    reactions[currentModalIdx] = (reactions[currentModalIdx] || 0) + 1;
    userReacted[currentModalIdx] = true;
  }


  openModal(currentModalIdx);
  renderArchive();
}

function shareMessage() {
  const m = messages[currentModalIdx];
  const text = 'to ' + m.to + ' — "' + m.text + '" · unsent';

  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => showToast('copied to clipboard ✦'));
  } else {
    showToast('copied!');
  }
}


function buildMosaic() {
  const mosaic = document.getElementById('home-mosaic');
  mosaic.innerHTML = '';

  [...messages]
    .sort(() => Math.random() - 0.5)
    .slice(0, 42)
    .forEach(m => {
      const c = getColor(m.color);
      const tile = document.createElement('div');
      tile.className = 'mosaic-tile';
      tile.style.background = c.hex;

      const inner = document.createElement('div');
      inner.className = 'mosaic-tile-inner';
      inner.textContent = m.to;
      tile.appendChild(inner);

      const idx = messages.indexOf(m);
      tile.onclick = () => { showPage('archive'); openModal(idx); };

      mosaic.appendChild(tile);
    });
}



function updatePreview() {
  const to = document.getElementById('input-to').value.trim();
  const msg = document.getElementById('input-message').value.trim();
  const preview = document.getElementById('preview');

  document.getElementById('char-remaining').textContent =
    500 - document.getElementById('input-message').value.length;

  if (!to && !msg) {
    preview.classList.remove('visible');
    return;
  }

  preview.classList.add('visible');
  preview.style.background = selectedColor.hex;
  preview.innerHTML = `
    <div class="preview-to">to ${escapeHtml(to) || '…'}</div>
    <div class="preview-text">${escapeHtml(msg) || '…'}</div>
  `;
}

function submitMessage() {
  const to = document.getElementById('input-to').value.trim();
  const text = document.getElementById('input-message').value.trim();

  if (!to || !text) {
    showToast('please fill in both fields');
    return;
  }

  const newMsg = { to, text, color: selectedColor.name };
  messages.unshift(newMsg);
  myMessages.unshift(newMsg);
  document.getElementById('submit-form-wrap').style.display = 'none';
  document.getElementById('success-msg').classList.add('visible');

  buildMosaic();
}

function resetForm() {
  document.getElementById('input-to').value = '';
  document.getElementById('input-message').value = '';
  document.getElementById('char-remaining').textContent = '500';

  document.getElementById('preview').classList.remove('visible');
  document.getElementById('submit-form-wrap').style.display = 'block';
  document.getElementById('success-msg').classList.remove('visible');

  selectedColor = COLORS[0];
  buildColorPicker();
  updatePreview();
}


function nextRandom() {
  let idx;
  do {
    idx = Math.floor(Math.random() * messages.length);
  } while (idx === randomIdx && messages.length > 1);

  randomIdx = idx;
  const m = messages[idx];
  const c = getColor(m.color);
  const card = document.getElementById('random-card');

  card.style.background = c.hex;

  card.style.animation = 'none';
  card.offsetHeight;
  card.style.animation = '';

  document.getElementById('random-to').textContent = 'to ' + m.to;
  document.getElementById('random-text').textContent = m.text;
}

function saveRandomToBookmarks() {
  if (randomIdx < 0) return;
  const m = messages[randomIdx];
  if (!savedMessages.includes(m)) {
    savedMessages.unshift(m);
    showToast('saved ♥');
  } else {
    showToast('already saved');
  }
}


function toggleSave(e, idx) {
  e.stopPropagation();
  const m = messages[idx];

  if (savedMessages.includes(m)) {
    savedMessages = savedMessages.filter(s => s !== m);
    showToast('removed from saved');
  } else {
    savedMessages.unshift(m);
    showToast('saved ♥');
  }

  renderArchive();
  renderSaved();
}

function renderSaved() {
  const grid = document.getElementById('saved-grid');
  const empty = document.getElementById('saved-empty');

  if (savedMessages.length === 0) {
    grid.innerHTML = '';
    empty.style.display = 'block';
    return;
  }

  empty.style.display = 'none';
  grid.innerHTML = '';
  savedMessages.forEach(m => grid.appendChild(buildCard(m, messages.indexOf(m), true)));
}

const COLOR_MEANINGS = {
  rose: { mood: "longing", meaning: "quiet love that never quite let go" },
  blush: { mood: "longing", meaning: "tenderness — the soft ache of remembering" },
  coral: { mood: "longing", meaning: "warmth mixed with distance — nostalgia in color" },
  rust: { mood: "grief", meaning: "love that burned and left a mark behind" },
  amber: { mood: "nostalgia", meaning: "golden memories you keep replaying" },
  gold: { mood: "nostalgia", meaning: "something that felt rare and irreplaceable" },
  sage: { mood: "acceptance", meaning: "peace with how things had to end" },
  forest: { mood: "acceptance", meaning: "stillness — grown around the loss" },
  sky: { mood: "hope", meaning: "the part of you that still looks forward" },
  ocean: { mood: "grief", meaning: "deep and endless — grief that hides itself" },
  dusk: { mood: "melancholy", meaning: "in-between feelings — the hour of quiet regret" },
  plum: { mood: "melancholy", meaning: "desire and sorrow folded into each other" },
  lilac: { mood: "hope", meaning: "soft hope — the kind that survives winters" },
  lavender: { mood: "hope", meaning: "something gentle you are still holding onto" },
  peach: { mood: "longing", meaning: "innocent longing — first love, first loss" },
  sand: { mood: "acceptance", meaning: "things worn smooth by time and distance" },
  slate: { mood: "melancholy", meaning: "the grey area — feelings you cannot name" },
  midnight: { mood: "grief", meaning: "3am honesty — what you would say in the dark" },
  smoke: { mood: "acceptance", meaning: "what remains after everything has burned" },
  cream: { mood: "nostalgia", meaning: "warmth, safety — what you wish you could return to" },
};

const MOOD_GROUPS = [
  { key: 'longing', label: 'longing', desc: 'Still reaching across the distance.' },
  { key: 'grief', label: 'grief', desc: 'What loss looks like, written down.' },
  { key: 'nostalgia', label: 'nostalgia', desc: 'Living in a memory.' },
  { key: 'melancholy', label: 'melancholy', desc: 'The feeling without a name.' },
  { key: 'hope', label: 'hope', desc: 'Grief with a window open.' },
  { key: 'acceptance', label: 'acceptance', desc: 'The quiet on the other side.' },
];

const MOOD_COLORS = {
  longing: '#e8856a',
  grief: '#3a3a5a',
  nostalgia: '#d4a843',
  melancholy: '#8a5a8a',
  hope: '#a8d8ea',
  acceptance: '#8faa8a',
};

function renderPalette() {
  const counts = {};
  messages.forEach(m => { counts[m.color] = (counts[m.color] || 0) + 1; });

  const total = messages.length;
  const used = COLORS.filter(c => counts[c.name]);
  const sorted = [...used].sort((a, b) => (counts[b.name] || 0) - (counts[a.name] || 0));
  const dominant = sorted[0] ? sorted[0].name : '—';

  document.getElementById('stat-total').textContent = total;
  document.getElementById('stat-colors').textContent = used.length;
  document.getElementById('stat-dominant').textContent = dominant;

  const moodCounts = {};
  MOOD_GROUPS.forEach(g => { moodCounts[g.key] = 0; });
  messages.forEach(m => {
    const cm = COLOR_MEANINGS[m.color];
    if (cm) moodCounts[cm.mood] = (moodCounts[cm.mood] || 0) + 1;
  });

  buildDonut(moodCounts, total);

  const groupsEl = document.getElementById('palette-groups');
  groupsEl.innerHTML = '';
  const max = sorted.length ? (counts[sorted[0].name] || 0) : 1;

  MOOD_GROUPS.forEach(group => {
    const groupColors = sorted.filter(c => {
      const cm = COLOR_MEANINGS[c.name];
      return cm && cm.mood === group.key;
    });
    if (!groupColors.length) return;

    const sectionTitle = document.createElement('div');
    sectionTitle.className = 'palette-section-title';
    sectionTitle.textContent = group.label + ' — ' + group.desc;
    groupsEl.appendChild(sectionTitle);
    const barsDiv = document.createElement('div');
    barsDiv.className = 'palette-bars';

    groupColors.forEach(c => {
      const cnt = counts[c.name] || 0;
      const cm = COLOR_MEANINGS[c.name] || { meaning: '' };
      const row = document.createElement('div');
      row.className = 'palette-row';
      row.innerHTML = `
        <div class="palette-swatch" style="background:${c.hex}"></div>
        <div class="palette-name-col">
          <div class="palette-name">${c.name}</div>
          <div class="palette-meaning">${cm.meaning}</div>
        </div>
        <div class="palette-bar-wrap">
          <div class="palette-bar" style="background:${c.hex}" data-w="${Math.round((cnt / max) * 100)}%"></div>
        </div>
        <div class="palette-count">${cnt}</div>
      `;
      row.onclick = () => openPaletteDetail(c, cm, counts[c.name] || 0);
      barsDiv.appendChild(row);
    });

    groupsEl.appendChild(barsDiv);
  });

  document.getElementById('palette-total').textContent =
    total + ' total messages · ' + used.length + ' colors in use';

  requestAnimationFrame(() => {
    document.querySelectorAll('.palette-bar').forEach(b => {
      b.style.width = b.dataset.w;
    });
  });
}

function buildDonut(moodCounts, total) {
  const svg = document.getElementById('donut-svg');
  const legend = document.getElementById('donut-legend');
  svg.innerHTML = '';
  legend.innerHTML = '';

  const cx = 65, cy = 65, r = 52, strokeW = 18;
  const circumference = 2 * Math.PI * r;
  let offset = 0;

  const bg = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  bg.setAttribute('cx', cx);
  bg.setAttribute('cy', cy);
  bg.setAttribute('r', r);
  bg.setAttribute('fill', 'none');
  bg.setAttribute('stroke', 'rgba(0,0,0,0.07)');
  bg.setAttribute('stroke-width', strokeW);
  svg.appendChild(bg);

  const moodsWithData = MOOD_GROUPS
    .filter(g => moodCounts[g.key] > 0)
    .sort((a, b) => moodCounts[b.key] - moodCounts[a.key]);

  moodsWithData.forEach(g => {
    const pct = moodCounts[g.key] / (total || 1);
    const dash = pct * circumference;
    const gap = circumference - dash;

    const arc = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    arc.setAttribute('cx', cx);
    arc.setAttribute('cy', cy);
    arc.setAttribute('r', r);
    arc.setAttribute('fill', 'none');
    arc.setAttribute('stroke', MOOD_COLORS[g.key]);
    arc.setAttribute('stroke-width', strokeW);
    arc.setAttribute('stroke-dasharray', `${dash} ${gap}`);
    arc.setAttribute('stroke-dashoffset', -offset);
    arc.setAttribute('transform', `rotate(-90 ${cx} ${cy})`);
    arc.style.transition = 'stroke-dasharray 1s ease';
    svg.appendChild(arc);

    offset += dash;

    const pctLabel = Math.round(pct * 100);
    if (pctLabel < 3) return;

    const row = document.createElement('div');
    row.className = 'palette-legend-row';
    row.innerHTML = `
      <div class="palette-legend-dot" style="background:${MOOD_COLORS[g.key]}"></div>
      <span class="palette-legend-label">${g.label}</span>
      <span class="palette-legend-pct">${pctLabel}%</span>
    `;
    legend.appendChild(row);
  });
}

function openPaletteDetail(c, cm, cnt) {
  const panel = document.getElementById('palette-detail');
  const isSame = document.getElementById('detail-name').textContent === c.name
    && panel.classList.contains('open');

  if (isSame) {
    panel.classList.remove('open');
    return;
  }

  document.getElementById('detail-dot').style.background = c.hex;
  document.getElementById('detail-name').textContent = c.name;
  document.getElementById('detail-meaning').textContent = cm.meaning;

  const msgsEl = document.getElementById('detail-messages');
  msgsEl.innerHTML = '';

  // show up to 4 sample messages for that color
  const sample = messages.filter(m => m.color === c.name).slice(0, 4);

  if (!sample.length) {
    msgsEl.innerHTML = `<p style="font-family:'Lora',serif;font-style:italic;color:var(--muted);font-size:.88rem;">
      no messages in this color yet.</p>`;
  } else {
    sample.forEach(m => {
      const idx = messages.indexOf(m);
      const div = document.createElement('div');
      div.className = 'palette-detail-msg';
      div.style.borderLeftColor = c.hex;
      div.innerHTML = `
        <div class="palette-detail-msg-to">to ${escapeHtml(m.to)}</div>
        ${escapeHtml(m.text)}
      `;
      div.onclick = () => openModal(idx);
      msgsEl.appendChild(div);
    });
  }

  panel.classList.add('open');
  panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}


function renderMyMessages() {
  const grid = document.getElementById('my-grid');
  const empty = document.getElementById('my-empty');

  if (myMessages.length === 0) {
    grid.innerHTML = '';
    empty.style.display = 'block';
    return;
  }

  empty.style.display = 'none';
  grid.innerHTML = '';
  myMessages.forEach(m => grid.appendChild(buildCard(m, messages.indexOf(m), false)));
}


function showPage(name) {
  document.querySelectorAll('.page').forEach(p => {
    p.classList.remove('active');
    if (p.id === 'page-random' || p.id === 'page-login') p.style.display = 'none';
  });

  if (name === 'my' && !currentUser) {
    showPage('login');
    showToast('sign in to view your messages');
    return;
  }

  const page = document.getElementById('page-' + name);
  if (!page) return;

  if (name === 'random' || name === 'login') {
    page.style.display = 'flex';
    page.classList.add('active');
  } else {
    page.classList.add('active');
  }

  document.querySelectorAll('.nav-links button, .mobile-menu button')
    .forEach(b => b.classList.remove('active'));

  const navBtn = document.getElementById('nav-' + name);
  const mobileBtn = document.getElementById('m-nav-' + name);
  if (navBtn) navBtn.classList.add('active');
  if (mobileBtn) mobileBtn.classList.add('active');

  if (name === 'archive') { visibleCount = 12; buildColorFilters(); renderArchive(); }
  if (name === 'home') buildMosaic();
  if (name === 'random') nextRandom();
  if (name === 'saved') renderSaved();
  if (name === 'palette') renderPalette();
  if (name === 'my') renderMyMessages();

  window.scrollTo(0, 0);
}

buildColorPicker();
buildMosaic();

// ============================================================
// CUSTOM CURSOR
// ============================================================
(function () {
  // Create the two cursor elements
  const dot  = document.createElement('div');
  const ring = document.createElement('div');
  dot.id  = 'cursor-dot';
  ring.id = 'cursor-ring';
  dot.classList.add('hidden');
  ring.classList.add('hidden');
  document.body.appendChild(dot);
  document.body.appendChild(ring);

  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;
  let rafId;

  // Smoothly lag the ring behind the dot (lerp)
  function lerp(a, b, t) { return a + (b - a) * t; }

  function animateRing() {
    ringX = lerp(ringX, mouseX, 0.14);
    ringY = lerp(ringY, mouseY, 0.14);
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    rafId = requestAnimationFrame(animateRing);
  }
  animateRing();

  // Move dot immediately, ring follows via lerp
  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';
    dot.classList.remove('hidden');
    ring.classList.remove('hidden');
  });

  // Hide when leaving the window
  document.addEventListener('mouseleave', () => {
    dot.classList.add('hidden');
    ring.classList.add('hidden');
  });
  document.addEventListener('mouseenter', () => {
    dot.classList.remove('hidden');
    ring.classList.remove('hidden');
  });

  // Expand ring on hoverable elements
  const hoverSelectors = 'a, button, input, textarea, [onclick], .message-card, .mosaic-tile, .color-filter, .color-swatch, .palette-row';

  document.addEventListener('mouseover', e => {
    const el = e.target.closest(hoverSelectors);
    if (el) {
      document.body.classList.add('cursor-hover');

      // If hovering a message card, tint cursor to card's accent color
      const card = e.target.closest('.message-card');
      if (card) {
        const accent = card.style.getPropertyValue('--accent') ||
                       card.querySelector('.message-color-dot')?.style.background ||
                       null;
        if (accent) {
          document.documentElement.style.setProperty('--cursor-accent', accent);
          document.body.classList.add('cursor-colored');
        }
      }
    }
  });

  document.addEventListener('mouseout', e => {
    const el = e.target.closest(hoverSelectors);
    if (el && !e.relatedTarget?.closest(hoverSelectors)) {
      document.body.classList.remove('cursor-hover');
      document.body.classList.remove('cursor-colored');
    }
  });

  // Click pulse
  document.addEventListener('mousedown', () => {
    document.body.classList.add('cursor-click');
  });
  document.addEventListener('mouseup', () => {
    document.body.classList.remove('cursor-click');
  });
})();

// ============================================================
// RANDOM CARD — trigger CSS animation on each new card
// ============================================================
const _origNextRandom = typeof nextRandom === 'function' ? nextRandom : null;
// Patch: after nextRandom updates the DOM, replay the animation
const _randomCard = document.getElementById('random-card');
if (_randomCard) {
  const observer = new MutationObserver(() => {
    _randomCard.classList.remove('anim');
    void _randomCard.offsetWidth; // force reflow
    _randomCard.classList.add('anim');
  });
  observer.observe(_randomCard, { childList: true, subtree: true, characterData: true });
  // trigger once on load
  _randomCard.classList.add('anim');
}

// ============================================================
// SUCCESS MSG — add .visible class when shown
// ============================================================
const _successMsg = document.getElementById('success-msg');
if (_successMsg) {
  const _successObserver = new MutationObserver(() => {
    if (_successMsg.style.display !== 'none' && _successMsg.style.display !== '') {
      _successMsg.classList.add('visible');
    } else {
      _successMsg.classList.remove('visible');
    }
  });
  _successObserver.observe(_successMsg, { attributes: true, attributeFilter: ['style'] });
}
