/* =====================================================
   unsent — main script
   all the logic that makes the site actually work
   ===================================================== */


/* ─────────────────────────────────────────
   DATA — colors, seed messages, mood groups
   ───────────────────────────────────────── */

// every available color for a message
const COLORS = [
  { name: "rose",      hex: "#e8b4b8" },
  { name: "blush",     hex: "#f2c5c0" },
  { name: "coral",     hex: "#e8856a" },
  { name: "rust",      hex: "#c0623a" },
  { name: "amber",     hex: "#e8a84a" },
  { name: "gold",      hex: "#d4a843" },
  { name: "sage",      hex: "#8faa8a" },
  { name: "forest",    hex: "#4a7c5a" },
  { name: "sky",       hex: "#a8d8ea" },
  { name: "ocean",     hex: "#5a8faa" },
  { name: "dusk",      hex: "#6a6a9a" },
  { name: "plum",      hex: "#8a5a8a" },
  { name: "lilac",     hex: "#b4a8d8" },
  { name: "lavender",  hex: "#c8b4e8" },
  { name: "peach",     hex: "#f9c9a0" },
  { name: "sand",      hex: "#d4c4a8" },
  { name: "slate",     hex: "#8a9aaa" },
  { name: "midnight",  hex: "#3a3a5a" },
  { name: "smoke",     hex: "#9a9a9a" },
  { name: "cream",     hex: "#e8e0d0" },
];

// the starter messages shown before anyone submits anything
const SEEDS = [
  { to: "Alex",   text: "I still listen to that playlist you made. I don't know why I told you I deleted it.",                          color: "ocean"    },
  { to: "Jordan", text: "You were the first person who made me feel like I was worth something. I hope you know that.",                  color: "rose"     },
  { to: "Sam",    text: "I almost texted you when I got the job. Then I remembered you wouldn't care anymore.",                          color: "dusk"     },
  { to: "Maya",   text: "I think about you every single time I drive past that parking lot. I'm sorry I let you leave.",                 color: "sage"     },
  { to: "Tyler",  text: "I don't regret it. I just wish you'd said goodbye properly.",                                                   color: "rust"     },
  { to: "Chris",  text: "I'm getting married. I wanted you to know that I'm okay. I don't know why that felt important.",                color: "plum"     },
  { to: "Jamie",  text: "You taught me that love isn't supposed to hurt like that. That took a long time to learn.",                     color: "lavender" },
  { to: "River",  text: "It's been four years and I still dream about the way you laughed at nothing.",                                  color: "amber"    },
  { to: "Nadia",  text: "I should have fought harder. I was twenty-two and I thought there would be more time.",                         color: "blush"    },
  { to: "Eli",    text: "I deleted your number three times. I still have it memorized.",                                                  color: "midnight" },
  { to: "Sofía",  text: "Nobody has ever looked at me the way you did. I didn't deserve it then. Maybe I do now.",                      color: "gold"     },
  { to: "Marcus", text: "I told everyone we just fell out of touch. That felt easier than the truth.",                                   color: "slate"    },
  { to: "Priya",  text: "I saw someone wearing your coat on the subway. I had to sit down.",                                             color: "sky"      },
  { to: "Leo",    text: "I forgive you. I'm writing this so I actually have to mean it.",                                                color: "sage"     },
  { to: "Zoe",    text: "We were just kids. I know that. I still keep the polaroid.",                                                    color: "coral"    },
  { to: "Dev",    text: "You made me feel chosen. I've been chasing that feeling ever since.",                                           color: "rose"     },
  { to: "Lily",   text: "I hope whoever loves you now knows what they have.",                                                             color: "lilac"    },
  { to: "Kai",    text: "Some days I wonder if we were just bad timing. Most days I know we were something else.",                       color: "ocean"    },
  { to: "Hazel",  text: "I still can't read that book. The one you gave me. It just sits there.",                                       color: "forest"   },
  { to: "Finn",   text: "I never told you I was scared. I was always scared.",                                                           color: "peach"    },
  { to: "Avery",  text: "You were right about me. That's all.",                                                                          color: "smoke"    },
  { to: "Grace",  text: "Sometimes I write you messages and don't send them. This is one of those.",                                    color: "blush"    },
  { to: "Noah",   text: "I'm not angry anymore. I just miss who we were before.",                                                        color: "dusk"     },
  { to: "Ivy",    text: "The way you said my name. Nobody says it like that anymore.",                                                   color: "plum"     },
  { to: "Cole",   text: "I hope you're not as hard on yourself as you used to be.",                                                      color: "amber"    },
  { to: "Mia",    text: "You were my favorite hello and my hardest goodbye.",                                                            color: "rose"     },
  { to: "Asha",   text: "I watched that film you recommended. You were right. You were always right about everything.",                  color: "sage"     },
  { to: "Quinn",  text: "I kept the voice note. I listen to it sometimes. I know.",                                                      color: "lavender" },
  { to: "Dante",  text: "I wanted to be everything you needed. I'm sorry I was only human.",                                             color: "midnight" },
  { to: "Vera",   text: "You would've hated my apartment. I decorated it thinking of you anyway.",                                      color: "coral"    },
];


/* ─────────────────────────────────────────
   APP STATE
   everything that can change while you're using the site
   ───────────────────────────────────────── */

let messages            = [...SEEDS];   // all messages (seeds + user-submitted)
let selectedColorFilter = null;         // which color filter is active in archive
let visibleCount        = 12;           // how many cards are currently shown
let selectedColor       = COLORS[0];    // the color picked in the submit form
let savedMessages       = [];           // bookmarked messages
let myMessages          = [];           // messages submitted this session
let reactions           = {};           // { messageIndex: count }
let userReacted         = {};           // { messageIndex: boolean }
let currentModalIdx     = -1;           // which message is open in the modal
let currentUser         = null;         // logged-in user object, or null
let randomIdx           = -1;           // last shown random message index

// demo user for the login page
const DEMO_USERS = [
  { email: 'demo@unsent.com', password: 'unsent123', name: 'demo' }
];


/* ─────────────────────────────────────────
   UTILS
   tiny helpers used all over the place
   ───────────────────────────────────────── */

// find a color object by name, fall back to the first one
function getColor(name) {
  return COLORS.find(c => c.name === name) || COLORS[0];
}

// make user-typed text safe to inject into HTML
function escapeHtml(s) {
  return s
    .replace(/&/g,  '&amp;')
    .replace(/</g,  '&lt;')
    .replace(/>/g,  '&gt;')
    .replace(/"/g,  '&quot;');
}

// show a little notification at the bottom of the screen
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2400);
}


/* ─────────────────────────────────────────
   HAMBURGER MENU
   ───────────────────────────────────────── */

function toggleMenu() {
  document.getElementById('hamburger').classList.toggle('open');
  document.getElementById('mobile-menu').classList.toggle('open');
}

function closeMenu() {
  document.getElementById('hamburger').classList.remove('open');
  document.getElementById('mobile-menu').classList.remove('open');
}


/* ─────────────────────────────────────────
   AUTH — login / signup / logout
   ───────────────────────────────────────── */

function doLogin() {
  const email = document.getElementById('login-email').value.trim();
  const pass  = document.getElementById('login-password').value;
  const err   = document.getElementById('login-error');

  const user = DEMO_USERS.find(u => u.email === email && u.password === pass);

  if (!user) {
    err.classList.add('show');
    return;
  }

  err.classList.remove('show');
  currentUser = user;
  applyLoggedInUI(user.name);
  showPage('home');
  showToast('welcome back, ' + user.name + ' ✦');
}

function doSignup() {
  const name  = document.getElementById('signup-name').value.trim();
  const email = document.getElementById('signup-email').value.trim();
  const pass  = document.getElementById('signup-password').value;
  const err   = document.getElementById('signup-error');

  if (!name || !email || pass.length < 6) {
    err.classList.add('show');
    return;
  }

  err.classList.remove('show');
  currentUser = { name, email };
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

// swap the nav sign-in button for a user badge once logged in
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

  // add "my messages" to the mobile menu if it's not there yet
  if (!document.getElementById('m-nav-my')) {
    const mobileMenu = document.getElementById('mobile-menu');
    const btn = document.createElement('button');
    btn.id          = 'm-nav-my';
    btn.textContent = 'my messages';
    btn.onclick     = () => { showPage('my'); closeMenu(); };
    mobileMenu.insertBefore(btn, mobileMenu.querySelector('.m-submit'));
  }

  // flip the mobile sign-in button to sign-out
  const mLoginBtn = document.getElementById('m-nav-login');
  mLoginBtn.textContent = 'sign out';
  mLoginBtn.onclick = () => { doLogout(); closeMenu(); };
}

function doLogout() {
  currentUser = null;

  // put the sign-in button back in the nav
  document.getElementById('nav-user-area').innerHTML =
    `<button class="nav-login-btn" onclick="showPage('login')" id="nav-login-btn">sign in</button>`;

  // restore mobile menu sign-in button
  const mLoginBtn = document.getElementById('m-nav-login');
  mLoginBtn.textContent = 'sign in';
  mLoginBtn.onclick = () => { showPage('login'); closeMenu(); };

  // remove the "my messages" mobile menu entry
  const mMyBtn = document.getElementById('m-nav-my');
  if (mMyBtn) mMyBtn.remove();

  showToast('signed out');
}

function switchToSignup() {
  document.getElementById('login-form').style.display  = 'none';
  document.getElementById('signup-form').style.display = 'block';
  document.getElementById('login-title').textContent   = 'create account';
  document.getElementById('login-sub').textContent     = 'join the archive. everything stays anonymous.';
}

function switchToLogin() {
  document.getElementById('signup-form').style.display = 'none';
  document.getElementById('login-form').style.display  = 'block';
  document.getElementById('login-title').textContent   = 'sign in';
  document.getElementById('login-sub').textContent     = 'Your unsent messages, saved bookmarks, and reactions — all in one place.';
}


/* ─────────────────────────────────────────
   COLOR PICKER (submit form)
   renders the circle swatches you click to pick a color
   ───────────────────────────────────────── */

function buildColorPicker() {
  const grid = document.getElementById('color-picker');
  grid.innerHTML = '';

  COLORS.forEach(c => {
    const el = document.createElement('div');
    el.className       = 'color-option' + (c.name === selectedColor.name ? ' selected' : '');
    el.style.background = c.hex;
    el.title           = c.name;

    el.onclick = () => {
      selectedColor = c;
      document.querySelectorAll('.color-option').forEach(o => o.classList.remove('selected'));
      el.classList.add('selected');
      updatePreview();
    };

    grid.appendChild(el);
  });
}


/* ─────────────────────────────────────────
   COLOR FILTERS (archive page)
   the row of color dots above the grid
   ───────────────────────────────────────── */

function buildColorFilters() {
  const wrap = document.getElementById('color-filters');
  wrap.innerHTML = '';

  // "all" option — rainbow gradient dot
  const allDot = document.createElement('div');
  allDot.className = 'color-filter all-filter' + (!selectedColorFilter ? ' selected' : '');
  allDot.title     = 'all';
  allDot.onclick   = () => {
    selectedColorFilter = null;
    buildColorFilters();
    renderArchive();
  };
  wrap.appendChild(allDot);

  COLORS.forEach(c => {
    const el = document.createElement('div');
    el.className       = 'color-filter' + (selectedColorFilter === c.name ? ' selected' : '');
    el.style.background = c.hex;
    el.title           = c.name;
    el.onclick         = () => {
      selectedColorFilter = c.name;
      buildColorFilters();
      renderArchive();
    };
    wrap.appendChild(el);
  });
}


/* ─────────────────────────────────────────
   CARD BUILDER
   creates a single message card DOM element
   ───────────────────────────────────────── */

function buildCard(m, idx, showBookmark) {
  const c        = getColor(m.color);
  const card     = document.createElement('div');
  const isSaved  = savedMessages.includes(m);
  const reacts   = reactions[idx] || 0;

  card.className       = 'message-card';
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

  // clicking the card opens the modal (but not if you hit the bookmark button)
  card.onclick = e => {
    if (!e.target.classList.contains('bookmark-btn')) openModal(idx);
  };

  return card;
}


/* ─────────────────────────────────────────
   ARCHIVE — search + filter + pagination
   ───────────────────────────────────────── */

function renderArchive() {
  const query = document.getElementById('search-input').value.trim().toLowerCase();

  const filtered = messages.filter(m => {
    const matchText  = !query || m.to.toLowerCase().includes(query) || m.text.toLowerCase().includes(query);
    const matchColor = !selectedColorFilter || m.color === selectedColorFilter;
    return matchText && matchColor;
  });

  document.getElementById('archive-count').textContent =
    filtered.length + ' message' + (filtered.length !== 1 ? 's' : '');

  const grid    = document.getElementById('messages-grid');
  const empty   = document.getElementById('empty-state');
  const loadBtn = document.getElementById('load-more-btn');

  if (filtered.length === 0) {
    grid.innerHTML         = '';
    empty.style.display    = 'block';
    loadBtn.style.display  = 'none';
    return;
  }

  empty.style.display = 'none';
  grid.innerHTML      = '';

  filtered.slice(0, visibleCount).forEach(m => {
    grid.appendChild(buildCard(m, messages.indexOf(m), true));
  });

  loadBtn.style.display = filtered.length > visibleCount ? 'block' : 'none';
}

function loadMore() {
  visibleCount += 12;
  renderArchive();
}


/* ─────────────────────────────────────────
   MODAL — full message view with reactions
   ───────────────────────────────────────── */

function openModal(idx) {
  currentModalIdx = idx;
  const m = messages[idx];
  const c = getColor(m.color);

  document.getElementById('modal-bar').style.background  = c.hex;
  document.getElementById('modal-to').textContent        = 'to ' + m.to;
  document.getElementById('modal-text').textContent      = m.text;

  const cnt = reactions[idx] || 0;
  document.getElementById('react-count').textContent = cnt;
  document.getElementById('react-heart').textContent = userReacted[idx] ? '♥' : '♡';
  document.getElementById('modal-react-btn').classList.toggle('reacted', !!userReacted[idx]);

  document.getElementById('modal').classList.add('open');
}

// clicking outside the modal card closes it
function closeModal(e) {
  if (e.target === document.getElementById('modal')) {
    document.getElementById('modal').classList.remove('open');
  }
}

function toggleReact() {
  if (currentModalIdx < 0) return;

  if (userReacted[currentModalIdx]) {
    // un-react
    reactions[currentModalIdx]   = Math.max(0, (reactions[currentModalIdx] || 0) - 1);
    userReacted[currentModalIdx] = false;
  } else {
    // react
    reactions[currentModalIdx]   = (reactions[currentModalIdx] || 0) + 1;
    userReacted[currentModalIdx] = true;
  }

  // refresh modal and grid so the heart + count update everywhere
  openModal(currentModalIdx);
  renderArchive();
}

function shareMessage() {
  const m    = messages[currentModalIdx];
  const text = 'to ' + m.to + ' — "' + m.text + '" · unsent';

  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => showToast('copied to clipboard ✦'));
  } else {
    showToast('copied!');
  }
}


/* ─────────────────────────────────────────
   MOSAIC (home page)
   the colorful tile grid — shuffled each time
   ───────────────────────────────────────── */

function buildMosaic() {
  const mosaic = document.getElementById('home-mosaic');
  mosaic.innerHTML = '';

  // pick 42 random messages and make a tile for each
  [...messages]
    .sort(() => Math.random() - 0.5)
    .slice(0, 42)
    .forEach(m => {
      const c    = getColor(m.color);
      const tile = document.createElement('div');
      tile.className       = 'mosaic-tile';
      tile.style.background = c.hex;

      const inner       = document.createElement('div');
      inner.className   = 'mosaic-tile-inner';
      inner.textContent = m.to;
      tile.appendChild(inner);

      const idx = messages.indexOf(m);
      tile.onclick = () => { showPage('archive'); openModal(idx); };

      mosaic.appendChild(tile);
    });
}


/* ─────────────────────────────────────────
   SUBMIT FORM
   live preview + submit handler
   ───────────────────────────────────────── */

function updatePreview() {
  const to      = document.getElementById('input-to').value.trim();
  const msg     = document.getElementById('input-message').value.trim();
  const preview = document.getElementById('preview');

  // update char counter
  document.getElementById('char-remaining').textContent =
    500 - document.getElementById('input-message').value.length;

  // hide preview if both fields are empty
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
  const to   = document.getElementById('input-to').value.trim();
  const text = document.getElementById('input-message').value.trim();

  if (!to || !text) {
    showToast('please fill in both fields');
    return;
  }

  const newMsg = { to, text, color: selectedColor.name };
  messages.unshift(newMsg);
  myMessages.unshift(newMsg);

  // hide the form, show the success state
  document.getElementById('submit-form-wrap').style.display = 'none';
  document.getElementById('success-msg').classList.add('visible');

  buildMosaic(); // refresh so the new message shows up
}

function resetForm() {
  document.getElementById('input-to').value      = '';
  document.getElementById('input-message').value = '';
  document.getElementById('char-remaining').textContent = '500';

  document.getElementById('preview').classList.remove('visible');
  document.getElementById('submit-form-wrap').style.display = 'block';
  document.getElementById('success-msg').classList.remove('visible');

  selectedColor = COLORS[0];
  buildColorPicker();
  updatePreview();
}


/* ─────────────────────────────────────────
   RANDOM PAGE
   shows one message at a time, reshuffled on click
   ───────────────────────────────────────── */

function nextRandom() {
  let idx;
  // make sure we don't show the same one twice in a row
  do {
    idx = Math.floor(Math.random() * messages.length);
  } while (idx === randomIdx && messages.length > 1);

  randomIdx = idx;
  const m    = messages[idx];
  const c    = getColor(m.color);
  const card = document.getElementById('random-card');

  card.style.background = c.hex;

  // restart the CSS animation
  card.style.animation = 'none';
  card.offsetHeight;           // force reflow
  card.style.animation = '';

  document.getElementById('random-to').textContent   = 'to ' + m.to;
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


/* ─────────────────────────────────────────
   BOOKMARKS
   ───────────────────────────────────────── */

function toggleSave(e, idx) {
  e.stopPropagation(); // don't open the modal when hitting the bookmark
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
  const grid  = document.getElementById('saved-grid');
  const empty = document.getElementById('saved-empty');

  if (savedMessages.length === 0) {
    grid.innerHTML      = '';
    empty.style.display = 'block';
    return;
  }

  empty.style.display = 'none';
  grid.innerHTML      = '';
  savedMessages.forEach(m => grid.appendChild(buildCard(m, messages.indexOf(m), true)));
}


/* ─────────────────────────────────────────
   PALETTE PAGE
   color meanings, stats, donut chart
   ───────────────────────────────────────── */

// what each color means emotionally
const COLOR_MEANINGS = {
  rose:      { mood: "longing",     meaning: "quiet love that never quite let go" },
  blush:     { mood: "longing",     meaning: "tenderness — the soft ache of remembering" },
  coral:     { mood: "longing",     meaning: "warmth mixed with distance — nostalgia in color" },
  rust:      { mood: "grief",       meaning: "love that burned and left a mark behind" },
  amber:     { mood: "nostalgia",   meaning: "golden memories you keep replaying" },
  gold:      { mood: "nostalgia",   meaning: "something that felt rare and irreplaceable" },
  sage:      { mood: "acceptance",  meaning: "peace with how things had to end" },
  forest:    { mood: "acceptance",  meaning: "stillness — grown around the loss" },
  sky:       { mood: "hope",        meaning: "the part of you that still looks forward" },
  ocean:     { mood: "grief",       meaning: "deep and endless — grief that hides itself" },
  dusk:      { mood: "melancholy",  meaning: "in-between feelings — the hour of quiet regret" },
  plum:      { mood: "melancholy",  meaning: "desire and sorrow folded into each other" },
  lilac:     { mood: "hope",        meaning: "soft hope — the kind that survives winters" },
  lavender:  { mood: "hope",        meaning: "something gentle you are still holding onto" },
  peach:     { mood: "longing",     meaning: "innocent longing — first love, first loss" },
  sand:      { mood: "acceptance",  meaning: "things worn smooth by time and distance" },
  slate:     { mood: "melancholy",  meaning: "the grey area — feelings you cannot name" },
  midnight:  { mood: "grief",       meaning: "3am honesty — what you would say in the dark" },
  smoke:     { mood: "acceptance",  meaning: "what remains after everything has burned" },
  cream:     { mood: "nostalgia",   meaning: "warmth, safety — what you wish you could return to" },
};

// the six mood buckets that group the colors
const MOOD_GROUPS = [
  { key: 'longing',     label: 'longing',     desc: 'Still reaching across the distance.' },
  { key: 'grief',       label: 'grief',       desc: 'What loss looks like, written down.' },
  { key: 'nostalgia',   label: 'nostalgia',   desc: 'Living in a memory.' },
  { key: 'melancholy',  label: 'melancholy',  desc: 'The feeling without a name.' },
  { key: 'hope',        label: 'hope',        desc: 'Grief with a window open.' },
  { key: 'acceptance',  label: 'acceptance',  desc: 'The quiet on the other side.' },
];

// one distinct color per mood for the donut chart
const MOOD_COLORS = {
  longing:    '#e8856a',
  grief:      '#3a3a5a',
  nostalgia:  '#d4a843',
  melancholy: '#8a5a8a',
  hope:       '#a8d8ea',
  acceptance: '#8faa8a',
};

function renderPalette() {
  // tally how many messages use each color
  const counts = {};
  messages.forEach(m => { counts[m.color] = (counts[m.color] || 0) + 1; });

  const total    = messages.length;
  const used     = COLORS.filter(c => counts[c.name]);
  const sorted   = [...used].sort((a, b) => (counts[b.name] || 0) - (counts[a.name] || 0));
  const dominant = sorted[0] ? sorted[0].name : '—';

  // update the three stat cards
  document.getElementById('stat-total').textContent    = total;
  document.getElementById('stat-colors').textContent   = used.length;
  document.getElementById('stat-dominant').textContent = dominant;

  // aggregate by mood for the donut
  const moodCounts = {};
  MOOD_GROUPS.forEach(g => { moodCounts[g.key] = 0; });
  messages.forEach(m => {
    const cm = COLOR_MEANINGS[m.color];
    if (cm) moodCounts[cm.mood] = (moodCounts[cm.mood] || 0) + 1;
  });

  buildDonut(moodCounts, total);

  // build the grouped color rows
  const groupsEl = document.getElementById('palette-groups');
  groupsEl.innerHTML = '';
  const max = sorted.length ? (counts[sorted[0].name] || 0) : 1;

  MOOD_GROUPS.forEach(group => {
    // get colors that belong to this mood, in sorted order
    const groupColors = sorted.filter(c => {
      const cm = COLOR_MEANINGS[c.name];
      return cm && cm.mood === group.key;
    });
    if (!groupColors.length) return;

    // section heading
    const sectionTitle = document.createElement('div');
    sectionTitle.className   = 'palette-section-title';
    sectionTitle.textContent = group.label + ' — ' + group.desc;
    groupsEl.appendChild(sectionTitle);

    // bar rows for each color
    const barsDiv = document.createElement('div');
    barsDiv.className = 'palette-bars';

    groupColors.forEach(c => {
      const cnt = counts[c.name] || 0;
      const cm  = COLOR_MEANINGS[c.name] || { meaning: '' };
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

  // animate bars in after the DOM has settled
  requestAnimationFrame(() => {
    document.querySelectorAll('.palette-bar').forEach(b => {
      b.style.width = b.dataset.w;
    });
  });
}

function buildDonut(moodCounts, total) {
  const svg    = document.getElementById('donut-svg');
  const legend = document.getElementById('donut-legend');
  svg.innerHTML = '';
  legend.innerHTML = '';

  const cx = 65, cy = 65, r = 52, strokeW = 18;
  const circumference = 2 * Math.PI * r;
  let offset = 0;

  // faint background ring
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
    const pct  = moodCounts[g.key] / (total || 1);
    const dash = pct * circumference;
    const gap  = circumference - dash;

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

    // skip legend entries that are too small to see
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

// clicking a palette row expands a detail panel below
function openPaletteDetail(c, cm, cnt) {
  const panel  = document.getElementById('palette-detail');
  const isSame = document.getElementById('detail-name').textContent === c.name
                 && panel.classList.contains('open');

  // clicking the same color again collapses the panel
  if (isSame) {
    panel.classList.remove('open');
    return;
  }

  document.getElementById('detail-dot').style.background = c.hex;
  document.getElementById('detail-name').textContent     = c.name;
  document.getElementById('detail-meaning').textContent  = cm.meaning;

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
      div.className              = 'palette-detail-msg';
      div.style.borderLeftColor  = c.hex;
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


/* ─────────────────────────────────────────
   MY MESSAGES PAGE
   shows only the messages submitted this session
   ───────────────────────────────────────── */

function renderMyMessages() {
  const grid  = document.getElementById('my-grid');
  const empty = document.getElementById('my-empty');

  if (myMessages.length === 0) {
    grid.innerHTML      = '';
    empty.style.display = 'block';
    return;
  }

  empty.style.display = 'none';
  grid.innerHTML      = '';
  myMessages.forEach(m => grid.appendChild(buildCard(m, messages.indexOf(m), false)));
}


/* ─────────────────────────────────────────
   PAGE ROUTER
   handles all navigation between pages
   ───────────────────────────────────────── */

function showPage(name) {
  // hide all pages
  document.querySelectorAll('.page').forEach(p => {
    p.classList.remove('active');
    if (p.id === 'page-random' || p.id === 'page-login') p.style.display = 'none';
  });

  // redirect to login if trying to access "my messages" while logged out
  if (name === 'my' && !currentUser) {
    showPage('login');
    showToast('sign in to view your messages');
    return;
  }

  const page = document.getElementById('page-' + name);
  if (!page) return;

  // random and login use flex display, everyone else uses block
  if (name === 'random' || name === 'login') {
    page.style.display = 'flex';
    page.classList.add('active');
  } else {
    page.classList.add('active');
  }

  // update active nav button
  document.querySelectorAll('.nav-links button, .mobile-menu button')
    .forEach(b => b.classList.remove('active'));

  const navBtn    = document.getElementById('nav-' + name);
  const mobileBtn = document.getElementById('m-nav-' + name);
  if (navBtn)    navBtn.classList.add('active');
  if (mobileBtn) mobileBtn.classList.add('active');

  // run page-specific init logic
  if (name === 'archive') { visibleCount = 12; buildColorFilters(); renderArchive(); }
  if (name === 'home')    buildMosaic();
  if (name === 'random')  nextRandom();
  if (name === 'saved')   renderSaved();
  if (name === 'palette') renderPalette();
  if (name === 'my')      renderMyMessages();

  window.scrollTo(0, 0);
}


/* ─────────────────────────────────────────
   INIT
   run on page load
   ───────────────────────────────────────── */

buildColorPicker();
buildMosaic();
