(function () {
'use strict';

/* ---------- helpers ---------- */
const $ = (s, el) => (el || document).querySelector(s);
const $$ = (s, el) => Array.from((el || document).querySelectorAll(s));
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const plug = n => { try { return (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins[n]) || null; } catch (e) { return null; } };
const DAY = 864e5;

/* ---------- palettes (dark + white variant of each) ---------- */
const PAL = {
  pure: { name: 'Pure Black',
    dark: { bg: '#000000', card: '#0C0C0C', card2: '#1A1A1A', text: '#FFFFFF', text2: '#8C8C8C', line: 'rgba(255,255,255,.10)', ac: '#FFFFFF', ac2: '#8C8C8C', on: '#000000', ai: '#FFFFFF' },
    light: { bg: '#FFFFFF', card: '#F5F5F5', card2: '#EAEAEA', text: '#0A0A0A', text2: '#707070', line: 'rgba(0,0,0,.09)', ac: '#000000', ac2: '#B5B5B5', on: '#FFFFFF', ai: '#000000' } },
  indigo: { name: 'Midnight Indigo',
    dark: { bg: '#161B2E', card: '#212842', card2: '#2C3558', text: '#F0E7D5', text2: '#A7ABC0', line: 'rgba(240,231,213,.10)', ac: '#F0E7D5', ac2: '#7F89B5', on: '#212842', ai: '#F0E7D5' },
    light: { bg: '#F7F2E7', card: '#FFFDF8', card2: '#EDE5D2', text: '#212842', text2: '#636A85', line: 'rgba(33,40,66,.10)', ac: '#212842', ac2: '#B9BFD8', on: '#F0E7D5', ai: '#212842' } },
  charcoal: { name: 'Charcoal Pearl',
    dark: { bg: '#171C24', card: '#202833', card2: '#2B3544', text: '#EAE0C8', text2: '#A5A99F', line: 'rgba(234,224,200,.10)', ac: '#EAE0C8', ac2: '#6F7F99', on: '#202833', ai: '#EAE0C8' },
    light: { bg: '#F4EEDD', card: '#FBF8EF', card2: '#EAE0C8', text: '#202833', text2: '#667080', line: 'rgba(32,40,51,.10)', ac: '#202833', ac2: '#CFC4A8', on: '#EAE0C8', ai: '#202833' } },
  yale: { name: 'Yale Chiffon',
    dark: { bg: '#082B4B', card: '#0D3B66', card2: '#15497A', text: '#FAF0CA', text2: '#A9B9C6', line: 'rgba(250,240,202,.12)', ac: '#FAF0CA', ac2: '#4F86B8', on: '#0D3B66', ai: '#FAF0CA' },
    light: { bg: '#FDF8E1', card: '#FFFDF2', card2: '#F5EAB9', text: '#0D3B66', text2: '#5B7088', line: 'rgba(13,59,102,.12)', ac: '#0D3B66', ac2: '#E8D98E', on: '#FAF0CA', ai: '#0D3B66' } },
  ocean: { name: 'Ocean Ivory',
    dark: { bg: '#0A1D33', card: '#102B4A', card2: '#173A62', text: '#FFFEF9', text2: '#9FB3C9', line: 'rgba(255,254,249,.10)', ac: '#4F92DA', ac2: '#0B5497', on: '#06182B', ai: '#7DB4EE' },
    light: { bg: '#FFFEF9', card: '#F4F2EA', card2: '#E7EBF2', text: '#0A2A4A', text2: '#5D7089', line: 'rgba(10,42,74,.10)', ac: '#0B5497', ac2: '#9DBFE3', on: '#FFFEF9', ai: '#0B5497' } },
  berry: { name: 'Blackberry Moon',
    dark: { bg: '#2C0E1D', card: '#48182F', card2: '#5A233F', text: '#EDE5E0', text2: '#B7A3AC', line: 'rgba(212,203,196,.12)', ac: '#D4CBC4', ac2: '#9B5B7C', on: '#48182F', ai: '#D4CBC4' },
    light: { bg: '#E9E2DD', card: '#F6F2EF', card2: '#D4CBC4', text: '#3A1226', text2: '#7C6571', line: 'rgba(72,24,47,.10)', ac: '#48182F', ac2: '#B890A4', on: '#F6F2EF', ai: '#48182F' } },
  lavender: { name: 'Lavender Mist',
    dark: { bg: '#232739', card: '#2F344B', card2: '#3B4160', text: '#FFFDF6', text2: '#A6AAC2', line: 'rgba(255,253,246,.10)', ac: '#A9AFCB', ac2: '#7C7E9D', on: '#1E2233', ai: '#B7BCD6' },
    light: { bg: '#FFFDF6', card: '#F6F0F4', card2: '#E2D4E0', text: '#363B55', text2: '#7A7F99', line: 'rgba(76,83,114,.12)', ac: '#4C5372', ac2: '#949AB1', on: '#FFFDF6', ai: '#4C5372' } },
  sage: { name: 'Sage Sunrise',
    dark: { bg: '#1B221E', card: '#263029', card2: '#323E36', text: '#DAEBE3', text2: '#9BAAA2', line: 'rgba(218,235,227,.10)', ac: '#99CDD8', ac2: '#F3C3B2', on: '#14201F', ai: '#99CDD8' },
    light: { bg: '#FFF3E6', card: '#FFFAF4', card2: '#F7D9CB', text: '#3C463F', text2: '#7A857C', line: 'rgba(101,113,102,.16)', ac: '#657166', ac2: '#99CDD8', on: '#FFFAF4', ai: '#4F5B51' } },
  dream: { name: 'Pastel Dream',
    dark: { bg: '#1D1730', card: '#2A2142', card2: '#372C58', text: '#F4E7FB', text2: '#B4A6CC', line: 'rgba(244,231,251,.10)', ac: '#C8A8E9', ac2: '#F6BCBA', on: '#241A3B', ai: '#D5B9F0' },
    light: { bg: '#FBF4FD', card: '#FFFBFC', card2: '#F6E4EA', text: '#3B2B55', text2: '#8173A0', line: 'rgba(124,79,184,.12)', ac: '#C8A8E9', ac2: '#F6BCBA', on: '#2E1F4A', ai: '#7C4FB8' } }
};
const COLORS = { red: '#E5645A', orange: '#E8A04A', yellow: '#E6CF5A', green: '#5FBF7F', blue: '#5AA9E6', purple: '#A98BE8' };

/* ---------- icons ---------- */
const IC = {
  notes: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h4"/>',
  pin: '<path d="M12 16v5"/><path d="M9 3h6l-1 6.5 3 3.5v2H7v-2l3-3.5z"/>',
  pinf: '<path d="M12 16v5"/><path fill="currentColor" d="M9 3h6l-1 6.5 3 3.5v2H7v-2l3-3.5z"/>',
  lock: '<rect x="5" y="11" width="14" height="9" rx="2.5"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
  unlock: '<rect x="5" y="11" width="14" height="9" rx="2.5"/><path d="M8 11V8a4 4 0 0 1 7.5-2"/>',
  settings: '<path d="M4 7h9M17 7h3M4 17h3M11 17h9"/><circle cx="15" cy="7" r="2"/><circle cx="9" cy="17" r="2"/>',
  search: '<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4 4"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  back: '<path d="M15 5l-7 7 7 7"/>',
  more: '<circle cx="12" cy="5" r="1.7" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.7" fill="currentColor" stroke="none"/><circle cx="12" cy="19" r="1.7" fill="currentColor" stroke="none"/>',
  trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  x: '<path d="M6 6l12 12M18 6L6 18"/>',
  bold: '<path d="M7 5h6a3.5 3.5 0 0 1 0 7H7zM7 12h7a3.5 3.5 0 0 1 0 7H7z"/>',
  italic: '<path d="M10 5h8M6 19h8M14 5l-4 14"/>',
  underline: '<path d="M7 4v7a5 5 0 0 0 10 0V4M5 20h14"/>',
  ul: '<path d="M10 6h10M10 12h10M10 18h10"/><circle cx="5" cy="6" r="1" fill="currentColor"/><circle cx="5" cy="12" r="1" fill="currentColor"/><circle cx="5" cy="18" r="1" fill="currentColor"/>',
  ol: '<path d="M11 6h9M11 12h9M11 18h9M4 5l1.6-1v5M4 14.5h3l-3 3.5h3"/>',
  todo: '<path d="M3.5 6l1.8 1.8L8.5 4.5M3.5 14l1.8 1.8 3.2-3.3M12 7h8M12 15h8"/>',
  hl: '<path d="M9 14l7-7 3 3-7 7H9z"/><path d="M5 20h14"/>',
  undo: '<path d="M7 6L3 10l4 4"/><path d="M3 10h11a5 5 0 0 1 0 10h-4"/>',
  redo: '<path d="M17 6l4 4-4 4"/><path d="M21 10H10a5 5 0 0 0 0 10h4"/>',
  moon: '<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6L7 7M17 17l1.4 1.4M5.6 18.4L7 17M17 7l1.4-1.4"/>',
  phone: '<rect x="7" y="3" width="10" height="18" rx="2.5"/><path d="M11 18h2"/>',
  chev: '<path d="M9 5l7 7-7 7"/>',
  restore: '<path d="M4 12a8 8 0 1 0 2.6-5.9M4 4v4h4"/>',
  tag: '<path d="M3 12V4h8l10 10-8 8z"/><circle cx="7.5" cy="8.5" r="1" fill="currentColor"/>',
  shield: '<path d="M12 3l8 3v6c0 4.5-3.2 7.6-8 9-4.8-1.4-8-4.5-8-9V6z"/><path d="M9 12l2.2 2.2L15.5 10"/>',
  edit: '<path d="M4 20h4L19 9l-4-4L4 16z"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M4 7l8 6 8-6"/>',
  call: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A15 15 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
  bell: '<path d="M6 16v-5a6 6 0 0 1 12 0v5l1.5 2h-15z"/><path d="M10 21h4"/>',
  drop: '<path d="M12 3s6 6.2 6 10.5a6 6 0 0 1-12 0C6 9.2 12 3 12 3z"/>',
  bio: '<path d="M6 11a6 6 0 0 1 12 0v2M9 20c.6-2 1-4 1-7a2 2 0 0 1 4 0c0 3 .4 5 1 7M12 10v3c0 2.5-.4 4.6-1.2 6.5M6 14c0 2.5-.3 4.4-.8 5.8M18 14c0 2-.2 3.6-.6 5"/>',
  down: '<path d="M12 4v11M7.5 10.5L12 15l4.5-4.5M5 20h14"/>'
};
const ic = (n, s) => `<svg class="i" viewBox="0 0 24 24" width="${s || 22}" height="${s || 22}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IC[n] || ''}</svg>`;
const logo = s => `<svg viewBox="0 0 64 64" width="${s || 28}" height="${s || 28}" aria-hidden="true"><rect x="4" y="4" width="56" height="56" rx="16" fill="var(--ac)"/><rect x="18" y="13" width="28" height="38" rx="6" fill="var(--on)"/><path d="M24 27h16M24 34h16M24 41h9" stroke="var(--ac)" stroke-width="3" stroke-linecap="round"/><path d="M37 13h7v14l-3.5-2.6L37 27z" fill="var(--ac2)"/></svg>`;

/* ---------- html / text helpers ---------- */
const OK_TAGS = new Set(['B', 'STRONG', 'I', 'EM', 'U', 'UL', 'OL', 'LI', 'DIV', 'P', 'BR', 'SPAN', 'MARK', 'H1', 'H2', 'H3', 'BLOCKQUOTE']);
const DROP = new Set(['SCRIPT', 'STYLE', 'IFRAME', 'OBJECT', 'EMBED', 'LINK', 'META', 'SVG', 'MATH', 'IMG', 'VIDEO', 'AUDIO', 'FORM', 'INPUT', 'TEXTAREA', 'BUTTON', 'SELECT']);
function sanitize(html) {
  const doc = new DOMParser().parseFromString('<body>' + html + '</body>', 'text/html');
  (function walk(n) {
    Array.from(n.childNodes).forEach(c => {
      if (c.nodeType === 3) return;
      if (c.nodeType !== 1) { c.remove(); return; }
      if (DROP.has(c.tagName.toUpperCase())) { c.remove(); return; }
      if (!OK_TAGS.has(c.tagName)) { walk(c); c.replaceWith(...Array.from(c.childNodes)); return; }
      Array.from(c.attributes).forEach(a => {
        const nm = a.name.toLowerCase();
        if (nm === 'class') {
          const k = a.value.split(/\s+/).filter(x => x === 'todo' || x === 'done').join(' ');
          if (k) c.setAttribute('class', k); else c.removeAttribute('class');
        } else if (nm === 'style' && /^[\w\s:;#(),.%-]*$/.test(a.value) && !/url|expression|import/i.test(a.value)) { /* keep */ }
        else c.removeAttribute(a.name);
      });
      walk(c);
    });
  })(doc.body);
  return doc.body.innerHTML;
}
function toPlain(html) {
  if (!html) return '';
  const doc = new DOMParser().parseFromString('<body>' + html.replace(/<\/(div|p|li|h[1-3]|blockquote)>|<br\s*\/?>/gi, '$&\n') + '</body>', 'text/html');
  return (doc.body.textContent || '').replace(/ /g, ' ').trim();
}
function todoOf(html) {
  if (!html || html.indexOf('todo') < 0) return null;
  const d = new DOMParser().parseFromString('<body>' + html + '</body>', 'text/html');
  const all = d.body.querySelectorAll('ul.todo > li').length;
  return all ? [d.body.querySelectorAll('ul.todo > li.done').length, all] : null;
}
const textToHtml = t => String(t || '').split(/\r?\n/).map(l => '<div>' + (esc(l) || '<br>') + '</div>').join('');
const countWords = t => ((t || '').trim().match(/\S+/g) || []).length;
function hl(t, q) {
  t = String(t);
  if (!q || !q.trim()) return esc(t);
  const ws = q.trim().split(/\s+/).filter(Boolean).map(w => w.replace(/^#/, '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).filter(Boolean);
  if (!ws.length) return esc(t);
  const re = new RegExp('(' + ws.join('|') + ')', 'gi');
  return t.split(re).map((p, i) => (i % 2 ? `<mark>${esc(p)}</mark>` : esc(p))).join('');
}
function fmtDate(t) {
  const d = new Date(t), n = new Date();
  if (d.toDateString() === n.toDateString()) return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  const o = { month: 'short', day: 'numeric' };
  if (d.getFullYear() !== n.getFullYear()) o.year = 'numeric';
  return d.toLocaleDateString([], o);
}
function fmtRemind(t) {
  const d = new Date(t), n = new Date();
  const tm = d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  if (d.toDateString() === n.toDateString()) return tm;
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ', ' + tm;
}
function ago(t) {
  const s = (Date.now() - t) / 1000;
  if (s < 45) return 'just now';
  if (s < 3600) return Math.round(s / 60) + ' min ago';
  if (s < 86400) return Math.round(s / 3600) + ' h ago';
  if (s < 7 * 86400) return Math.round(s / 86400) + ' d ago';
  return fmtDate(t);
}
const localInput = ts => { const d = new Date(ts - new Date(ts).getTimezoneOffset() * 60000); return d.toISOString().slice(0, 16); };
let toastT;
function toast(m, label, fn) {
  const t = $('#toast');
  t.innerHTML = `<span>${esc(m)}</span>${label ? `<button>${esc(label)}</button>` : ''}`;
  t.classList.toggle('act', !!label);
  t.classList.add('show');
  clearTimeout(toastT);
  if (label) t.querySelector('button').onclick = () => { t.classList.remove('show'); if (fn) fn(); };
  toastT = setTimeout(() => t.classList.remove('show'), label ? 5200 : 2200);
}

/* ---------- state ---------- */
const KEY = 'notebook.v1';
function defaults() {
  return { settings: { theme: 'dark', palette: 'pure', sort: 'modified', preview: 2, autolock: 60, appLock: false, onboarded: false, autosave: true, haptics: true, startNew: false, bio: false, backupRemind: true, lastBackup: 0 }, notes: [], sec: null };
}
function normalize(raw) {
  const d = defaults();
  const r = raw && typeof raw === 'object' ? raw : {};
  const S = { settings: Object.assign(d.settings, r.settings || {}), notes: [], sec: r.sec && r.sec.salt && r.sec.ver ? r.sec : null };
  const now = Date.now();
  (Array.isArray(r.notes) ? r.notes : []).forEach(n => {
    if (!n || typeof n !== 'object') return;
    const trashed = +n.trashed || 0;
    if (trashed && now - trashed > 30 * DAY) return; /* auto-empty Trash after 30 days */
    const locked = !!n.locked && !!n.enc;
    const body = locked ? '' : sanitize(String(n.body || ''));
    const tags = Array.isArray(n.tags) ? n.tags.map(String) : [];
    if (n.folder && !tags.some(t => t.toLowerCase() === String(n.folder).toLowerCase())) tags.push(String(n.folder)); /* folders became tags */
    const remind = +n.remind > now ? +n.remind : 0;
    S.notes.push({ id: String(n.id || uid()), title: String(n.title || ''), body, plain: locked ? '' : toPlain(body), created: +n.created || now, modified: +n.modified || now,
      tags, fav: !!n.fav, locked, enc: locked ? n.enc : null, trashed, color: COLORS[n.color] ? n.color : '', remind, todo: locked ? null : todoOf(body) });
  });
  if (!PAL[S.settings.palette]) S.settings.palette = 'pure';
  return S;
}
function load() { try { return normalize(JSON.parse(localStorage.getItem(KEY))); } catch (e) { return normalize(null); } }
let S;
function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { toast('Storage is full'); } }

const view = { tab: 'notes', screen: 'home', filter: 'all', tag: '', search: false, q: '', anim: 'fade' };
const ORDER = ['notes', 'search', 'settings'];
const navKey = () => (view.screen === 'settings' || view.tab === 'settings') ? 'settings' : (view.search ? 'search' : 'notes');
let ob = 0, appLocked = false, hiddenAt = 0, ed = null, sessionKey = null, keyExpiry = 0, closer = null, fails = 0, lockoutUntil = 0, suppress = false, openedAt = 0, lastPass = null, bioTried = false, pendingShare = null, startNewPending = false, backupAsked = false;

/* ---------- theme ---------- */
const mq = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
function curMode() { const t = S.settings.theme; return t === 'system' ? (mq && mq.matches ? 'dark' : 'light') : t; }
function applyTheme(animate) {
  const mode = curMode(), c = (PAL[S.settings.palette] || PAL.pure)[mode];
  const root = document.documentElement;
  if (animate) { root.classList.add('theming'); setTimeout(() => root.classList.remove('theming'), 380); }
  Object.keys(c).forEach(k => root.style.setProperty('--' + k, c[k]));
  root.dataset.mode = mode; root.dataset.pal = S.settings.palette;
  const m = $('meta[name="color-scheme"]'); if (m) m.content = mode;
  const sb = plug('StatusBar');
  if (sb) { try { sb.setBackgroundColor({ color: c.bg }); sb.setStyle({ style: mode === 'dark' ? 'DARK' : 'LIGHT' }); } catch (e) { } }
}
if (mq && mq.addEventListener) mq.addEventListener('change', () => { if (S.settings.theme === 'system') applyTheme(true); });

/* ---------- haptics + circular theme reveal ---------- */
function buzz(k) {
  if (!S || S.settings.haptics === false) return;
  try {
    const H = plug('Haptics');
    if (H && H.impact) { H.impact({ style: k === 'med' ? 'MEDIUM' : k === 'heavy' ? 'HEAVY' : 'LIGHT' }); return; }
    if (navigator.vibrate) navigator.vibrate(k === 'med' ? 18 : 9);
  } catch (e) { }
}
const modeOf = v => v === 'system' ? (mq && mq.matches ? 'dark' : 'light') : v;
let curVT = null;
function swapTheme(e, mutate, nextMode) {
  buzz('light');
  const run = () => { mutate(); save(); applyTheme(false); render(); };
  if (!document.startViewTransition) { applyTheme(true); run(); return; }
  const x = e && e.clientX != null ? e.clientX : innerWidth / 2, y = e && e.clientY != null ? e.clientY : innerHeight / 2;
  const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  const shrink = nextMode === 'dark' && curMode() !== 'dark';
  const rt = document.documentElement;
  try { if (curVT) curVT.skipTransition(); } catch (er) { }
  rt.classList.toggle('shrink', shrink);
  const t = document.startViewTransition(run); curVT = t;
  t.ready.then(() => {
    const cp = ['circle(0px at ' + x + 'px ' + y + 'px)', 'circle(' + r + 'px at ' + x + 'px ' + y + 'px)'];
    rt.animate({ clipPath: shrink ? cp.slice().reverse() : cp }, { duration: 360, easing: 'cubic-bezier(.4,0,.2,1)', pseudoElement: shrink ? '::view-transition-old(root)' : '::view-transition-new(root)' });
  }).catch(() => { });
  t.finished.finally(() => { rt.classList.remove('shrink'); if (curVT === t) curVT = null; });
}

/* ---------- crypto ---------- */
const TE = new TextEncoder(), TD = new TextDecoder();
const b64 = buf => { const a = new Uint8Array(buf); let s = ''; for (let i = 0; i < a.length; i++) s += String.fromCharCode(a[i]); return btoa(s); };
const unb64 = s => Uint8Array.from(atob(s), c => c.charCodeAt(0));
async function deriveKey(pass, salt) {
  const km = await crypto.subtle.importKey('raw', TE.encode(pass), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey({ name: 'PBKDF2', salt, iterations: 150000, hash: 'SHA-256' }, km, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
}
async function encStr(key, str) { const iv = crypto.getRandomValues(new Uint8Array(12)); const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, TE.encode(str)); return { iv: b64(iv), d: b64(ct) }; }
async function decStr(key, o) { return TD.decode(await crypto.subtle.decrypt({ name: 'AES-GCM', iv: unb64(o.iv) }, key, unb64(o.d))); }
async function makePasscode(p) { const salt = crypto.getRandomValues(new Uint8Array(16)); const key = await deriveKey(p, salt); S.sec = { salt: b64(salt), ver: await encStr(key, 'nb-ok') }; save(); return key; }
async function checkPasscode(p) {
  if (!S.sec) return null;
  try { const key = await deriveKey(p, unb64(S.sec.salt)); return (await decStr(key, S.sec.ver)) === 'nb-ok' ? key : null; } catch (e) { return null; }
}
const keyValid = () => !!sessionKey && Date.now() < keyExpiry;
function keepKey() { keyExpiry = Infinity; }
function releaseKey() {
  const a = +S.settings.autolock;
  if (a === 0) { sessionKey = null; keyExpiry = 0; } else if (a < 0) keyExpiry = Infinity; else keyExpiry = Date.now() + a * 1000;
}
setInterval(() => { if (sessionKey && Date.now() >= keyExpiry) sessionKey = null; }, 3000);

/* ---------- native bridge: biometrics + share (MainActivity.java) ---------- */
const NB = () => window.NBNative || null;
function bioAvail() { try { return !!(NB() && NB().bioAvailable()); } catch (e) { return false; } }
const bioReq = {};
window.__nbBio = (id, ok, secret) => { const f = bioReq[id]; delete bioReq[id]; if (f) f(ok && secret ? secret : null); };
function bioAuth(title) {
  return new Promise(res => {
    const id = uid(); bioReq[id] = res;
    try { NB().bioAuth(title, id); } catch (e) { delete bioReq[id]; res(null); }
  });
}
async function bioUnlock(title) {
  const sec = await bioAuth(title); if (!sec) return null;
  const k = await checkPasscode(sec);
  if (k) lastPass = sec; else { S.settings.bio = false; save(); toast('Biometrics reset. Use your passcode.'); }
  return k;
}
async function bioEnable() {
  if (!bioAvail()) { toast('Set up a fingerprint or face on your phone first'); return false; }
  lastPass = null;
  const key = S.sec ? await passPrompt('Turn on biometrics', 'Enter your passcode to continue.') : await createPasscode();
  if (!key || !lastPass) return false;
  const pass = lastPass; lastPass = null;
  let ok = false; try { ok = NB().bioSave(pass); } catch (e) { }
  if (!ok) { toast('Could not store it securely'); return false; }
  const test = await bioAuth('Confirm biometrics');
  if (!test) { try { NB().bioClear(); } catch (e) { } toast('Biometrics not confirmed'); return false; }
  S.settings.bio = true; save(); return true;
}
function takeShare() { try { const n = NB(); if (!n || !n.takeShare) return null; const j = n.takeShare(); return j ? JSON.parse(j) : null; } catch (e) { return null; } }
async function checkShare() {
  const s = takeShare(); if (s) pendingShare = s;
  if (!pendingShare || appLocked || !S.settings.onboarded) return;
  const sh = pendingShare; pendingShare = null;
  if (ed) await leaveEditor();
  const n = blankNote(); n.title = String(sh.s || '').trim().slice(0, 120);
  view.screen = 'home'; startEditor(n, textToHtml(sh.t || ''), true); markDirty();
  toast('Captured from share');
}

/* ---------- overlays ---------- */
function showOverlay(onClose) { $('#overlay').classList.add('open'); openedAt = Date.now(); closer = onClose; }
function closeOverlay() { const ov = $('#overlay'); ov.classList.remove('open'); ov.innerHTML = ''; closer = null; }
function menu(items, title) {
  const ov = $('#overlay');
  ov.innerHTML = `<div class="scrim"></div><div class="sheet">${title ? `<div class="sh">${esc(title)}</div>` : ''}${items.map((it, i) => `<button class="mi ${it.d ? 'd' : ''}" data-i="${i}">${it.ic ? ic(it.ic, 20) : ''}<span class="ml">${esc(it.l)}${it.s ? `<small>${esc(it.s)}</small>` : ''}</span>${it.c ? `<i class="mchk">${ic('check', 18)}</i>` : ''}</button>`).join('')}</div>`;
  showOverlay(closeOverlay);
  $$('.mi', ov).forEach(b => b.onclick = () => { const it = items[+b.dataset.i]; closeOverlay(); if (it.f) setTimeout(it.f, 0); });
  $('.scrim', ov).onclick = () => { if (Date.now() - openedAt > 350) closeOverlay(); };
}
function ask(o) {
  return new Promise(res => {
    let done = false;
    const fin = v => { if (done) return; done = true; closeOverlay(); res(v); };
    const ov = $('#overlay');
    ov.innerHTML = `<div class="scrim"></div><div class="dlg" role="dialog"><h3>${esc(o.title)}</h3>${o.text ? `<p>${esc(o.text)}</p>` : ''}${(o.fields || []).map(f => `<label class="inp">${ic(f.ic || (f.type === 'password' ? 'shield' : f.id === 't' ? 'tag' : f.type === 'datetime-local' ? 'bell' : 'edit'), 22)}<input class="field" id="f_${f.id}" type="${f.type || 'text'}" placeholder="${esc(f.ph || '')}" value="${esc(f.value || '')}" autocomplete="off" autocapitalize="off" spellcheck="false"></label>`).join('')}${o.alt ? `<button class="altbtn" id="dalt">${ic('bio', 20)}<span>${esc(o.alt.label)}</span></button>` : ''}<div class="err" id="derr"></div><div class="dact">${o.cancel === false ? '' : `<button class="btn ghost" id="dno">${esc(o.cancel || 'Cancel')}</button>`}<button class="btn ${o.danger ? 'danger' : 'primary'}" id="dok">${esc(o.ok || 'OK')}</button></div></div>`;
    showOverlay(() => fin(null));
    const vals = () => { const v = {}; (o.fields || []).forEach(f => v[f.id] = $('#f_' + f.id).value); return v; };
    const submit = async () => {
      const v = vals();
      if (o.validate) {
        $('#dok').disabled = true;
        const e = await o.validate(v);
        const ok = $('#dok'); if (ok) ok.disabled = false;
        if (e) { const er = $('#derr'); if (er) { er.textContent = e; er.classList.remove('shake'); void er.offsetWidth; er.classList.add('shake'); } return; }
      }
      fin(v);
    };
    $('#dok').onclick = submit;
    const no = $('#dno'); if (no) no.onclick = () => fin(null);
    const alt = $('#dalt');
    if (alt) { const run = async () => { const v = await o.alt.run(); if (v) fin(v); }; alt.onclick = run; if (o.alt.auto) setTimeout(run, 350); }
    const fs = $$('.field', ov);
    fs.forEach((f, i) => f.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); if (i < fs.length - 1) fs[i + 1].focus(); else submit(); } }));
    if (fs[0] && !(o.alt && o.alt.auto)) setTimeout(() => fs[0].focus(), 120);
  });
}

/* ---------- passcode flows ---------- */
async function passPrompt(title, text) {
  let key = null;
  const bio = S.settings.bio && bioAvail();
  const r = await ask({ title, text, fields: [{ id: 'p', type: 'password', ph: 'PIN or password' }], ok: 'Unlock',
    alt: bio ? { label: 'Use biometrics', auto: true, run: async () => { const k = await bioUnlock(title); if (k) { key = k; return { bio: true }; } return null; } } : null,
    validate: async v => {
      if (Date.now() < lockoutUntil) return 'Too many attempts. Wait a moment.';
      key = await checkPasscode(v.p);
      if (!key) { fails++; if (fails >= 5) { lockoutUntil = Date.now() + 30000; fails = 0; } return 'Wrong passcode.'; }
      fails = 0; lastPass = v.p; return null;
    } });
  return r ? key : null;
}
async function createPasscode() {
  let key = null;
  const r = await ask({ title: 'Create a passcode', text: 'It protects locked notes and App Lock. If you forget it, locked notes cannot be recovered.',
    fields: [{ id: 'a', type: 'password', ph: 'New PIN or password' }, { id: 'b', type: 'password', ph: 'Repeat it' }], ok: 'Save',
    validate: async v => {
      if (v.a.length < 4) return 'Use at least 4 characters.';
      if (v.a !== v.b) return 'They do not match.';
      key = await makePasscode(v.a); lastPass = v.a; return null;
    } });
  if (!r) return null;
  sessionKey = key; keepKey(); return key;
}
async function getKey(title, text) {
  if (keyValid()) return sessionKey;
  const k = await passPrompt(title, text);
  if (k) { sessionKey = k; keepKey(); }
  return k;
}
async function changePasscode() {
  const oldKey = await passPrompt('Change passcode', 'Enter your current passcode.');
  if (!oldKey) return;
  let newPass = null;
  const r = await ask({ title: 'New passcode', fields: [{ id: 'a', type: 'password', ph: 'New PIN or password' }, { id: 'b', type: 'password', ph: 'Repeat it' }], ok: 'Change',
    validate: async v => { if (v.a.length < 4) return 'Use at least 4 characters.'; if (v.a !== v.b) return 'They do not match.'; newPass = v.a; return null; } });
  if (!r) return;
  try {
    const plain = [];
    for (const n of S.notes.filter(n => n.locked)) plain.push([n, await decStr(oldKey, n.enc)]);
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const nk = await deriveKey(newPass, salt);
    const encd = [];
    for (const [n, p] of plain) encd.push([n, await encStr(nk, p)]);
    const ver = await encStr(nk, 'nb-ok');
    encd.forEach(([n, e]) => n.enc = e);
    S.sec = { salt: b64(salt), ver };
    if (S.settings.bio) { let ok = false; try { ok = NB().bioSave(newPass); } catch (e) { } if (!ok) S.settings.bio = false; }
    save(); sessionKey = null; keyExpiry = 0;
    toast('Passcode changed');
  } catch (e) { toast('Could not change passcode'); }
}

/* ---------- note data ---------- */
const findNote = id => S.notes.find(n => n.id === id);
function allTags() { const m = {}, disp = {}; S.notes.forEach(n => { if (n.trashed) return; n.tags.forEach(t => { const k = t.toLowerCase(); m[k] = (m[k] || 0) + 1; if (!disp[k]) disp[k] = t; }); }); return Object.keys(m).sort().map(k => [disp[k], m[k]]); }
function blankNote() { return { id: uid(), title: '', body: '', plain: '', created: Date.now(), modified: Date.now(), tags: view.tag ? [view.tag] : [], fav: false, locked: false, enc: null, trashed: 0, color: '', remind: 0, todo: null }; }
function visibleNotes() {
  let a = S.notes.filter(n => !n.trashed);
  const searching = view.search && view.q.trim();
  if (!searching) {
    if (view.filter === 'locked') a = a.filter(n => n.locked);
    if (view.tag) { const tg = view.tag.toLowerCase(); a = a.filter(n => n.tags.some(t => t.toLowerCase() === tg)); }
  } else {
    const ws = view.q.toLowerCase().split(/\s+/).map(w => w.replace(/^#/, '')).filter(Boolean);
    a = a.filter(n => { const hay = (n.title + ' ' + (n.locked ? '' : n.plain) + ' ' + n.tags.join(' ')).toLowerCase(); return ws.every(w => hay.includes(w)); });
  }
  const s = S.settings.sort;
  a.sort((x, y) => (y.fav - x.fav) || (s === 'title' ? (x.title || 'Untitled').localeCompare(y.title || 'Untitled') : s === 'created' ? y.created - x.created : y.modified - x.modified));
  return a;
}
function cardHtml(n, i, q, anim) {
  const t = n.title || 'Untitled';
  let pv = '';
  if (n.locked) pv = '<div class="np"><span class="lk">Locked note</span></div>';
  else if (S.settings.preview > 0) {
    const p = n.plain.replace(/\s+/g, ' ').trim().slice(0, 320);
    pv = p ? `<div class="np" style="-webkit-line-clamp:${+S.settings.preview}">${hl(p, q)}</div>` : '<div class="np"><span class="mut">No additional text</span></div>';
  }
  const col = n.color && COLORS[n.color] ? `<i class="cdot" style="background:${COLORS[n.color]}"></i>` : '';
  const tags = n.tags.slice(0, 3).map(t2 => `<span class="tg" data-act="tagChip" data-v="${esc(t2)}">#${hl(t2, q)}</span>`).join('');
  const td = !n.locked && n.todo && n.todo[1] ? `<span class="td ${n.todo[0] === n.todo[1] ? 'full' : ''}"><i style="--p:${Math.round(n.todo[0] / n.todo[1] * 100)}%"></i>${n.todo[0]}/${n.todo[1]}</span>` : '';
  const bell = n.remind ? `<span class="bl">${ic('bell', 13)}${esc(fmtRemind(n.remind))}</span>` : '';
  return `<div class="note ${anim ? '' : 'noanim'}" style="--i:${Math.min(i, 14)}" data-act="open" data-v="${esc(n.id)}"><div class="nt">${col}${n.locked ? ic('lock', 17) : ''}<span class="tt">${hl(t, q)}</span>${n.fav ? `<span class="pn">${ic('pinf', 15)}</span>` : ''}</div>${pv}<div class="nm"><span class="dt">${fmtDate(n.modified)}</span>${td}${bell}${tags}</div></div>`;
}
function emptyMsg() {
  if (view.search && view.q.trim()) return 'No notes found.';
  if (view.filter === 'locked') return 'No locked notes.<small>Open a note’s menu and choose Lock Note.</small>';
  if (view.tag) return 'No notes tagged #' + esc(view.tag) + '.';
  return 'No notes yet.<small>Tap + to write your first note.</small>';
}
function renderList(anim) {
  const list = $('#list'); if (!list) return;
  const a = visibleNotes(), q = view.search ? view.q : '';
  if (!a.length) { list.innerHTML = `<div class="empty">${emptyMsg()}</div>`; return; }
  const sections = !view.search && a.some(n => n.fav) && a.some(n => !n.fav);
  let h = '', seenUn = false;
  a.forEach((n, i) => {
    if (sections && i === 0) h += '<div class="sec">Pinned</div>';
    if (sections && !n.fav && !seenUn) { seenUn = true; h += '<div class="sec">Notes</div>'; }
    h += cardHtml(n, i, q, anim);
  });
  list.innerHTML = h;
}

/* ---------- render ---------- */
const root = () => $('#app');
let lastKey = '';
function render() {
  const key = view.screen + ':' + view.tab + ':' + (view.search ? 1 : 0);
  const sc0 = $('#app .scroll'), top = sc0 ? sc0.scrollTop : 0, chipX = $$('#app .chips').map(c => c.scrollLeft);
  renderScreen();
  const sc = $('#app .screen');
  if (sc && view.anim) sc.classList.add('a-' + view.anim);
  if (key === lastKey && !view.anim) { const s2 = $('#app .scroll'); if (s2) s2.scrollTop = top; $$('#app .chips').forEach((c, i) => { if (chipX[i] != null) c.scrollLeft = chipX[i]; }); }
  lastKey = key; view.anim = ''; renderNav();
}
function refreshHome() {
  $$('#app .chip').forEach(c => {
    const a = c.dataset.act, v = c.dataset.v;
    if (a === 'filter') c.classList.toggle('on', v === 'locked' ? view.filter === 'locked' : (view.filter === 'all' && !view.tag));
    else if (a === 'tagChip') c.classList.toggle('on', !!view.tag && view.tag.toLowerCase() === v.toLowerCase());
  });
  renderList(true);
}
function renderScreen() {
  if (!S.settings.onboarded) return renderOnboard();
  if (appLocked) return renderLock();
  switch (view.screen) {
    case 'editor': return renderEditor();
    case 'settings': return renderSettings();
    case 'tags': return renderTags();
    case 'trash': return renderTrash();
    default: return renderHome();
  }
}
function renderNav() {
  const w = $('#navwrap'); if (!w) return;
  const show = S.settings.onboarded && !appLocked && (view.screen === 'home' || view.screen === 'settings');
  if (!w.firstChild) {
    const it = [['notes', 'notes', 'Notes'], ['search', 'search', 'Search'], ['settings', 'settings', 'Settings']];
    w.innerHTML = `<nav class="nav">${it.map(([k, i, l]) => `<button data-act="tab" data-v="${k}" aria-label="${l}">${ic(i, 22)}<span>${l}</span></button>`).join('')}</nav>`;
  }
  w.classList.toggle('hide', !show);
  const cur = navKey();
  $$('button', w).forEach(b => b.classList.toggle('on', show && b.dataset.v === cur));
}
function renderHome() {
  const tl = allTags();
  const eyebrow = new Date().toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' });
  const chips = view.search ? '' : `<div class="chips"><button class="chip ${!view.tag && view.filter === 'all' ? 'on' : ''}" data-act="filter" data-v="all">All</button><button class="chip ${view.filter === 'locked' ? 'on' : ''}" data-act="filter" data-v="locked">${ic('lock', 14)}Locked</button>${tl.map(([t]) => `<button class="chip ${view.tag && view.tag.toLowerCase() === t.toLowerCase() ? 'on' : ''}" data-act="tagChip" data-v="${esc(t)}">#${esc(t)}</button>`).join('')}</div>`;
  root().innerHTML = `<div class="screen"><header class="top">${view.search
    ? `<div class="sbar">${ic('search', 22)}<input id="q" type="text" placeholder="Search titles, text, #tags" value="${esc(view.q)}" autocomplete="off"><button class="ib" data-act="tab" data-v="notes" aria-label="Close search">${ic('x', 20)}</button></div>`
    : `<div class="brand">${logo(26)}<span class="eyebrow">${esc(eyebrow)}</span></div>`}</header>
  <div class="scroll"><h1 class="h1 big">${view.search ? 'Search' : 'Notes'}</h1>${chips}<div id="list"></div></div>${view.search ? '' : `<button class="fab" data-act="new" aria-label="New note">${ic('plus', 28)}</button>`}</div>`;
  renderList(true);
  const q = $('#q');
  if (q) { q.addEventListener('input', () => { view.q = q.value; renderList(false); }); }
}
function renderOnboard() {
  const dots = `<div class="dots">${[0, 1, 2].map(i => `<b class="${i === ob ? 'on' : ''}"></b>`).join('')}</div>`;
  let h;
  if (ob === 0) h = `<div class="obc"><div class="biglogo">${logo(104)}</div><h1 class="wm big">Notebook</h1><p>Your notes. Simple.</p></div><div class="obf">${dots}<button class="btn primary wide" data-act="obNext">Get Started</button></div>`;
  else if (ob === 1) {
    const o = (m, i, l) => `<button class="opt ${S.settings.theme === m ? 'on' : ''}" data-act="obTheme" data-v="${m}">${ic(i, 26)}<span>${l}</span>${S.settings.theme === m ? `<i class="chk">${ic('check', 14)}</i>` : ''}</button>`;
    h = `<div class="obc"><h2>How would you like your Notebook to look?</h2><div class="obopts">${o('dark', 'moon', 'Dark')}${o('light', 'sun', 'White')}${o('system', 'phone', 'Follow System')}</div></div><div class="obf">${dots}<button class="btn primary wide" data-act="obNext">Continue</button></div>`;
  } else h = `<div class="obc"><div class="lockic">${ic('lock', 44)}</div><h2>Protect your private notes.</h2><p>Set a passcode for App Lock and locked notes.</p></div><div class="obf">${dots}<button class="btn primary wide" data-act="obLock">Set up App Lock</button><button class="btn ghost wide" data-act="obDone">Skip for now</button></div>`;
  root().innerHTML = `<div class="screen ob">${h}</div>`;
}
function renderLock() {
  const bio = S.settings.bio && bioAvail();
  root().innerHTML = `<div class="screen ob"><div class="obc"><div class="lockic">${ic('lock', 44)}</div><h2>Notebook is locked</h2><p>Enter your passcode to continue.</p><label class="inp">${ic('shield', 22)}<input class="field" id="lp" type="password" placeholder="PIN or password" autocomplete="off"></label><div class="err" id="lerr"></div></div><div class="obf">${bio ? `<button class="btn ghost wide" data-act="bioApp">${ic('bio', 20)}&nbsp;Use biometrics</button>` : ''}<button class="btn primary wide" data-act="unlockApp">Unlock</button></div></div>`;
  const lp = $('#lp'); lp.addEventListener('keydown', e => { if (e.key === 'Enter') ACT.unlockApp(); });
  if (bio && !bioTried) { bioTried = true; setTimeout(() => ACT.bioApp(), 350); } else setTimeout(() => lp.focus(), 200);
}

function row(act, label, val, v, sub) { return `<button class="row" data-act="${act}" ${v != null ? `data-v="${esc(v)}"` : ''}><span class="rl">${label}${sub ? `<small>${sub}</small>` : ''}</span>${val != null && val !== '' ? `<span class="rv">${val}</span>` : ''}<span class="ch">${ic('chev', 18)}</span></button>`; }
function swRow(act, label, on, sub) { return `<button class="row" data-act="${act}"><span class="rl">${label}${sub ? `<small>${sub}</small>` : ''}</span><i class="sw ${on ? 'on' : ''}"></i></button>`; }
const ALN = { '0': 'Immediately', '30': 'After 30 seconds', '60': 'After 1 minute', '300': 'After 5 minutes', '-1': 'When the app closes' };
const SORTN = { modified: 'Last modified', created: 'Date created', title: 'Title (A–Z)' };
function renderSettings() {
  const st = S.settings, mode = curMode();
  const opt = (m, i, l) => `<button class="opt ${st.theme === m ? 'on' : ''}" data-act="theme" data-v="${m}">${ic(i, 24)}<span>${l}</span>${st.theme === m ? `<i class="chk">${ic('check', 14)}</i>` : ''}</button>`;
  const pals = Object.keys(PAL).map(k => { const c = PAL[k][mode]; return `<button class="pal ${st.palette === k ? 'on' : ''}" data-act="palette" data-v="${k}"><span class="sws"><b style="background:${c.bg}"></b><b style="background:${c.card2}"></b><b style="background:${c.ac}"></b><b style="background:${c.ac2}"></b></span>${PAL[k].name}</button>`; }).join('');
  const trashN = S.notes.filter(n => n.trashed).length;
  root().innerHTML = `<div class="screen"><header class="top"><h1 class="h1 s">Settings</h1></header><div class="scroll"><div class="pad">
  <div class="gt">Appearance</div><div class="opts">${opt('dark', 'moon', 'Dark')}${opt('light', 'sun', 'White')}${opt('system', 'phone', 'System')}</div>
  <div class="gs2">Accent color</div><div class="pals">${pals}</div>
  <div class="gt">Notes</div><div class="rows">${swRow('startNew', 'Open a new note on launch', st.startNew, 'Start writing the moment the app opens')}${row('sort', 'Default sorting', SORTN[st.sort])}${swRow('autosave', 'Auto-save', st.autosave)}${row('preview', 'Note preview length', st.preview ? st.preview + (st.preview > 1 ? ' lines' : ' line') : 'Off')}${swRow('haptics', 'Haptic feedback', st.haptics)}</div>
  <div class="gt">Security</div><div class="rows">${swRow('appLockToggle', 'App Lock', st.appLock, 'Ask for the passcode when opening Notebook')}${bioAvail() ? swRow('bioToggle', 'Biometric unlock', st.bio, 'Fingerprint or face for App Lock and locked notes') : ''}${S.sec ? row('changePass', 'Change passcode') : ''}${row('autolock', 'Locked-note auto-lock', ALN[st.autolock])}</div>
  <div class="gt">Organization</div><div class="rows">${row('tags', 'Manage tags')}${row('trash', 'Trash', trashN || '', null, 'Deleted automatically after 30 days')}</div>
  <div class="gt">Storage</div><div class="rows">${row('backup', 'Backup now', 'JSON file')}${swRow('backupRemind', 'Weekly backup reminder', st.backupRemind, 'So you never lose notes when you change phones')}${row('restore', 'Restore')}${row('exportTxt', 'Export notes', 'Text file')}${row('importTxt', 'Import notes', '.txt / .md')}</div>
  <div class="gt">About</div><div class="rows">${row('about', 'App version', '1.1.0')}${row('privacy', 'Privacy')}${row('terms', 'Terms')}${row('dev', 'About the developer', 'Dagim Bireda')}</div><div class="foot" data-act="dev">Developed by Dagim Bireda</div>
  </div></div></div>`;
}
function subTop(title, right) { return `<header class="subtop"><button class="ib" data-act="subBack" aria-label="Back">${ic('back')}</button><h1 class="h1">${title}</h1>${right || ''}</header>`; }
function renderTags() {
  const t = allTags();
  root().innerHTML = `<div class="screen">${subTop('Tags')}<div class="scroll"><div class="pad">${t.length ? `<div class="rows">${t.map(([k, c]) => `<div class="li2"><button class="lt" data-act="tagGo" data-v="${esc(k)}"><b>#${esc(k)}</b><small>${c} ${c === 1 ? 'note' : 'notes'}</small></button><button class="ib" data-act="renTag" data-v="${esc(k)}" aria-label="Rename">${ic('edit', 19)}</button><button class="ib" data-act="delTag" data-v="${esc(k)}" aria-label="Delete">${ic('trash', 19)}</button></div>`).join('')}</div>` : '<div class="empty">No tags yet.<small>Add tags from a note.</small></div>'}</div></div></div>`;
}
function renderTrash() {
  const a = S.notes.filter(n => n.trashed).sort((x, y) => y.trashed - x.trashed);
  root().innerHTML = `<div class="screen">${subTop('Trash', a.length ? `<button class="txtbtn" data-act="emptyTrash">Empty</button>` : '')}<div class="scroll"><div class="pad">${a.length ? `<div class="rows">${a.map(n => { const left = Math.max(0, 30 - Math.floor((Date.now() - n.trashed) / DAY)); return `<div class="li2"><span class="lt"><b>${n.locked ? '🔒 ' : ''}${esc(n.title || 'Untitled')}</b><small>${left} ${left === 1 ? 'day' : 'days'} left</small></span><button class="ib" data-act="restoreNote" data-v="${esc(n.id)}" aria-label="Restore">${ic('restore', 19)}</button><button class="ib" data-act="purge" data-v="${esc(n.id)}" aria-label="Delete forever">${ic('trash', 19)}</button></div>`; }).join('')}</div><div class="hint">Notes are deleted for good after 30 days.</div>` : '<div class="empty">Trash is empty.</div>'}</div></div></div>`;
}

/* ---------- editor ---------- */
const FMT = [['bold', 'bold'], ['italic', 'italic'], ['underline', 'underline'], ['hl', 'hl'], '|', ['ul', 'ul'], ['ol', 'ol'], ['todo', 'todo'], '|', ['undo', 'undo'], ['redo', 'redo']];
function metaHtml(n, words) { return `<span>${S.notes.includes(n) ? 'Edited ' + esc(ago(n.modified)) : 'New note'}</span><span class="dot">·</span><span id="wc">${words} ${words === 1 ? 'word' : 'words'}</span>${n.locked ? `<span class="dot">·</span><span class="lkm">${ic('lock', 13)} Locked</span>` : ''}`; }
function tagsHtml(n) { return n.tags.map(t => `<button class="tg etg" data-act="edTags">#${esc(t)}</button>`).join('') + `<button class="tg add" data-act="edTags">${ic('plus', 13)} Tag</button>` + (n.remind ? `<button class="tg bl" data-act="edRemind">${ic('bell', 13)}${esc(fmtRemind(n.remind))}</button>` : ''); }
function refreshMeta() { const n = ed && ed.note; if (!n) return; const m = $('#meta'), t = $('#etags'); const b = $('#body'); if (m) m.innerHTML = metaHtml(n, countWords(b ? b.innerText : '')); if (t) t.innerHTML = tagsHtml(n); const c = $('#cdot'); if (c) { c.style.background = n.color ? COLORS[n.color] : 'transparent'; c.classList.toggle('on', !!n.color); } }
function renderEditor() {
  const n = ed.note;
  root().innerHTML = `<div class="screen"><header class="eh"><button class="ib" data-act="edBack" aria-label="Back">${ic('back')}</button><span class="sp"></span><span class="status" id="st"></span>${S.settings.autosave ? '' : `<button class="ib ac" data-act="saveNow" aria-label="Save">${ic('check')}</button>`}<button class="ib ${n.fav ? 'ac' : ''}" data-act="edPin" id="pinb" aria-label="Pin">${ic(n.fav ? 'pinf' : 'pin')}</button><button class="ib" data-act="edMore" aria-label="More">${ic('more')}</button></header>
  <div class="escroll"><input id="title" class="etitle" type="text" placeholder="Title" autocomplete="off" value="${esc(n.title)}"><div class="emeta"><i class="cdot big ${n.color ? 'on' : ''}" id="cdot" style="background:${n.color ? COLORS[n.color] : 'transparent'}"></i><span id="meta" class="mline"></span></div><div class="etags" id="etags"></div><div id="body" class="ebody" contenteditable="true" data-ph="Start writing…" spellcheck="true"></div></div>
  <div class="fmt" id="fmt">${FMT.map(f => f === '|' ? '<i class="div"></i>' : `<button tabindex="-1" data-c="${f[0]}" aria-label="${f[0]}">${ic(f[1], 21)}</button>`).join('')}</div></div>`;
  const body = $('#body'), title = $('#title'), fmt = $('#fmt');
  body.innerHTML = sanitize(ed.body || '');
  refreshMeta();
  title.addEventListener('input', markDirty);
  title.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); body.focus(); } });
  body.addEventListener('input', () => { const h = body.innerHTML; if (h === '<br>' || h === '<div><br></div>') body.innerHTML = ''; markDirty(); });
  body.addEventListener('paste', e => { e.preventDefault(); const t = (e.clipboardData || window.clipboardData).getData('text/plain'); document.execCommand('insertText', false, t); });
  body.addEventListener('click', e => { const li = e.target; if (li && li.tagName === 'LI' && li.parentElement.classList.contains('todo') && e.offsetX < 34) { li.classList.toggle('done'); markDirty(); } });
  body.addEventListener('keydown', e => { if (e.key === 'Enter') setTimeout(() => { const li = closestIn(window.getSelection().anchorNode, 'li'); if (li && li.classList.contains('done') && li.textContent === '') li.classList.remove('done'); }, 0); });
  body.addEventListener('focus', () => fmt.classList.add('show'));
  body.addEventListener('blur', () => setTimeout(() => { if (document.activeElement !== body) fmt.classList.remove('show'); }, 120));
  fmt.addEventListener('mousedown', e => e.preventDefault());
  fmt.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; runCmd(b.dataset.c); fmtState(); markDirty(); });
  if (ed.isNew && !n.title && !ed.body) setTimeout(() => { if (document.activeElement !== body && document.activeElement !== title) title.focus(); }, 120);
}
function closestIn(node, sel) {
  const b = $('#body'); if (!node || !b) return null;
  const el = node.nodeType === 3 ? node.parentElement : node;
  const r = el && el.closest ? el.closest(sel) : null;
  return r && b.contains(r) ? r : null;
}
function runCmd(c) {
  $('#body').focus();
  const ex = document.execCommand.bind(document);
  const anchor = window.getSelection().anchorNode;
  if (c === 'bold' || c === 'italic' || c === 'underline' || c === 'undo' || c === 'redo') ex(c);
  else if (c === 'ul' || c === 'ol') {
    const ul = closestIn(anchor, 'ul');
    if (c === 'ul' && ul && ul.classList.contains('todo')) { ul.classList.remove('todo'); return; }
    ex(c === 'ul' ? 'insertUnorderedList' : 'insertOrderedList');
  } else if (c === 'todo') {
    let ul = closestIn(anchor, 'ul');
    if (ul && ul.classList.contains('todo')) { ex('insertUnorderedList'); return; }
    if (!ul) { ex('insertUnorderedList'); ul = closestIn(window.getSelection().anchorNode, 'ul'); }
    if (ul) ul.classList.add('todo');
  } else if (c === 'hl') {
    const sel = window.getSelection(); if (!sel || sel.isCollapsed) { toast('Select text to highlight'); return; }
    ex('styleWithCSS', false, true);
    const cur = document.queryCommandValue('hiliteColor');
    const has = cur && cur !== 'transparent' && !/rgba\(0, 0, 0, 0\)/.test(cur);
    ex('hiliteColor', false, has ? 'transparent' : 'rgba(250, 204, 21, 0.38)');
    ex('styleWithCSS', false, false);
  }
}
function fmtState() {
  const f = $('#fmt'); if (!f) return;
  const map = { bold: 'bold', italic: 'italic', underline: 'underline', ol: 'insertOrderedList' };
  const ul = closestIn(window.getSelection().anchorNode, 'ul');
  $$('button', f).forEach(b => {
    const c = b.dataset.c; let on = false;
    if (c === 'todo') on = !!(ul && ul.classList.contains('todo'));
    else if (c === 'ul') on = !!(ul && !ul.classList.contains('todo'));
    else if (map[c]) { try { on = document.queryCommandState(map[c]); } catch (e) { } }
    b.classList.toggle('on', on);
  });
}
document.addEventListener('selectionchange', () => { if (ed) fmtState(); });
function setStatus(txt, icon) { const s = $('#st'); if (!s) return; s.innerHTML = (icon ? ic('check', 14) : '') + esc(txt); s.classList.add('on'); clearTimeout(s._t); if (icon) s._t = setTimeout(() => s.classList.remove('on'), 1600); }
let wcT;
function markDirty() {
  if (!ed) return;
  ed.dirty = true; clearTimeout(ed.timer);
  clearTimeout(wcT); wcT = setTimeout(() => { const w = $('#wc'), b = $('#body'); if (w && b) { const c = countWords(b.innerText); w.textContent = c + (c === 1 ? ' word' : ' words'); } }, 220);
  if (S.settings.autosave) { setStatus('Saving…'); ed.timer = setTimeout(persist, 650); } else setStatus('Unsaved');
}
async function persist() {
  if (!ed) return;
  clearTimeout(ed.timer);
  const n = ed.note, tEl = $('#title'), bEl = $('#body');
  if (!tEl || !bEl) return;
  const title = tEl.value.trim(), html = bEl.innerHTML === '<br>' ? '' : bEl.innerHTML, plain = toPlain(html);
  if (!S.notes.includes(n) && !title && !plain) { ed.dirty = false; return; }
  n.title = title;
  if (n.locked) {
    if (!sessionKey) return;
    n.enc = await encStr(sessionKey, JSON.stringify({ b: html })); n.body = ''; n.plain = ''; n.todo = null;
  } else { n.body = html; n.plain = plain; n.todo = todoOf(html); }
  n.modified = Date.now();
  if (!S.notes.includes(n)) S.notes.unshift(n);
  ed.dirty = false; ed.body = html;
  save(); setStatus('Saved', true);
  const m = $('#meta'), b = $('#body'); if (m && b) m.innerHTML = metaHtml(n, countWords(b.innerText));
}
async function flushSave() { if (ed && (ed.dirty || ed.isNew)) await persist(); }
function newNote() { startEditor(blankNote(), '', true); }
function startEditor(n, body, isNew) { ed = { note: n, isNew, dirty: false, timer: null, body }; view.screen = 'editor'; view.anim = 'up'; render(); }
async function openNote(id) {
  const n = findNote(id); if (!n) return;
  let body = n.body;
  if (n.locked) {
    const k = await getKey('Unlock note', '“' + (n.title || 'Untitled') + '” is locked.');
    if (!k) return;
    try { body = JSON.parse(await decStr(k, n.enc)).b; } catch (e) { toast('Could not unlock this note'); releaseKey(); return; }
    keepKey();
  }
  startEditor(n, body, false);
}
async function leaveEditor() {
  if (!ed) return;
  if (ed.dirty && !S.settings.autosave) {
    const r = await ask({ title: 'Save changes?', ok: 'Save', cancel: 'Discard' });
    if (r) await persist();
  } else await flushSave();
  const n = ed.note; ed = null;
  if (n.locked) releaseKey();
  view.screen = 'home'; view.anim = 'fade'; render();
}
const persistedOnly = () => { if (ed && S.notes.includes(ed.note)) save(); };

/* ---------- note actions ---------- */
const afterEdit = () => { if (ed) refreshMeta(); else render(); };
function tagSheet(n, after) {
  const sel = new Set(n.tags);
  const all = allTags().map(([t]) => t);
  n.tags.forEach(t => { if (!all.some(x => x.toLowerCase() === t.toLowerCase())) all.push(t); });
  const ov = $('#overlay');
  const chip = t => `<button class="chip sm ${sel.has(t) ? 'on' : ''}" data-t="${esc(t)}">#${esc(t)}</button>`;
  ov.innerHTML = `<div class="scrim"></div><div class="sheet"><div class="sh">Tags</div><div class="tagbox" id="tagbox">${all.map(chip).join('') || '<span class="mut">No tags yet. Add one below.</span>'}</div><label class="inp">${ic('tag', 20)}<input class="field" id="newtag" placeholder="New tag, press Enter" autocomplete="off" autocapitalize="off"></label><div class="dact"><button class="btn primary" id="tdone">Done</button></div></div>`;
  let done = false;
  const commit = () => {
    if (done) return; done = true;
    const inp = $('#newtag'); const v = inp ? inp.value.trim().replace(/^#+/, '') : '';
    if (v) sel.add(all.find(x => x.toLowerCase() === v.toLowerCase()) || v);
    const seen = new Set(); n.tags = [...sel].filter(t => !seen.has(t.toLowerCase()) && seen.add(t.toLowerCase())).slice(0, 12);
    if (S.notes.includes(n)) save();
    closeOverlay(); if (after) after();
  };
  showOverlay(commit);
  const box = $('#tagbox', ov);
  box.addEventListener('click', e => { const b = e.target.closest('.chip'); if (!b) return; const t = b.dataset.t; if (sel.has(t)) sel.delete(t); else sel.add(t); b.classList.toggle('on', sel.has(t)); buzz('light'); });
  const inp = $('#newtag', ov);
  inp.addEventListener('keydown', e => {
    if (e.key !== 'Enter') return; e.preventDefault();
    const v = inp.value.trim().replace(/^#+/, ''); if (!v) return;
    let t = all.find(x => x.toLowerCase() === v.toLowerCase());
    if (!t) { t = v; all.push(t); box.insertAdjacentHTML('beforeend', chip(t)); const mt = $('.mut', box); if (mt) mt.remove(); }
    sel.add(t); $$('.chip', box).forEach(b => b.classList.toggle('on', sel.has(b.dataset.t))); inp.value = '';
  });
  $('#tdone', ov).onclick = commit;
  $('.scrim', ov).onclick = () => { if (Date.now() - openedAt > 350) commit(); };
}
function colorSheet(n, after) {
  const ov = $('#overlay');
  ov.innerHTML = `<div class="scrim"></div><div class="sheet"><div class="sh">Note colour</div><div class="cols"><button data-c="" class="${!n.color ? 'on' : ''} none" aria-label="No colour"></button>${Object.keys(COLORS).map(k => `<button data-c="${k}" class="${n.color === k ? 'on' : ''}" style="background:${COLORS[k]}" aria-label="${k}"></button>`).join('')}</div></div>`;
  showOverlay(closeOverlay);
  $$('.cols button', ov).forEach(b => b.onclick = () => { n.color = b.dataset.c; if (S.notes.includes(n)) save(); buzz('light'); closeOverlay(); if (after) after(); });
  $('.scrim', ov).onclick = () => { if (Date.now() - openedAt > 350) closeOverlay(); };
}
const nid = id => { let h = 7; for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0; return Math.abs(h) % 2147483000 + 1; };
async function cancelRemind(n) { const LN = plug('LocalNotifications'); if (LN) { try { await LN.cancel({ notifications: [{ id: nid(n.id) }] }); } catch (e) { } } }
async function setRemind(n, ts, after) {
  const LN = plug('LocalNotifications');
  if (!ts) { await cancelRemind(n); n.remind = 0; if (S.notes.includes(n)) save(); toast('Reminder removed'); if (after) after(); return; }
  if (LN) {
    try {
      let p = await LN.checkPermissions(); if (p.display !== 'granted') p = await LN.requestPermissions();
      if (p.display !== 'granted') { toast('Allow notifications to get reminders'); return; }
      await cancelRemind(n);
      await LN.schedule({ notifications: [{ id: nid(n.id), title: n.title || 'Reminder', body: n.locked ? 'Locked note' : (n.plain || 'Open your note').replace(/\s+/g, ' ').slice(0, 90), schedule: { at: new Date(ts), allowWhileIdle: true } }] });
    } catch (e) { toast('Could not set the reminder'); return; }
  } else toast('Saved. Notifications work in the installed app.');
  n.remind = ts; if (S.notes.includes(n)) save();
  if (LN) toast('Reminder set for ' + fmtRemind(ts));
  if (after) after();
}
function remindMenu(n, after) {
  const d = new Date(), at = (h, plus) => { const x = new Date(); x.setDate(x.getDate() + plus); x.setHours(h, 0, 0, 0); return x.getTime(); };
  const items = [{ l: 'In 1 hour', ic: 'bell', f: () => setRemind(n, Date.now() + 3600e3, after) }];
  if (d.getHours() < 18) items.push({ l: 'This evening', s: '6:00 PM', ic: 'bell', f: () => setRemind(n, at(18, 0), after) });
  items.push({ l: 'Tomorrow morning', s: '9:00 AM', ic: 'bell', f: () => setRemind(n, at(9, 1), after) });
  items.push({ l: 'Pick date and time…', ic: 'edit', f: async () => {
    const r = await ask({ title: 'Remind me', fields: [{ id: 'd', type: 'datetime-local', value: localInput(Date.now() + 3600e3) }], ok: 'Set',
      validate: async v => { const t = new Date(v.d).getTime(); return t > Date.now() + 30000 ? null : 'Pick a time in the future.'; } });
    if (r) setRemind(n, new Date(r.d).getTime(), after);
  } });
  if (n.remind) items.push({ l: 'Remove reminder', ic: 'x', d: true, f: () => setRemind(n, 0, after) });
  menu(items, n.remind ? 'Reminder · ' + fmtRemind(n.remind) : 'Remind me');
}
async function lockNote(n, bodyHtml) {
  let key = keyValid() ? sessionKey : null;
  if (!S.sec) key = await createPasscode();
  else if (!key) key = await passPrompt('Lock note', 'Enter your passcode to lock this note.');
  if (!key) return false;
  sessionKey = key;
  n.enc = await encStr(key, JSON.stringify({ b: bodyHtml })); n.body = ''; n.plain = ''; n.todo = null; n.locked = true;
  return true;
}
async function removeLock(n) {
  const key = await getKey('Remove lock', 'Enter your passcode to unlock this note for good.');
  if (!key) return false;
  try { const b = sanitize(JSON.parse(await decStr(key, n.enc)).b || ''); n.body = b; n.plain = toPlain(b); n.todo = todoOf(b); n.enc = null; n.locked = false; return true; } catch (e) { toast('Could not unlock this note'); return false; }
}
function trashNote(n) {
  cancelRemind(n); n.remind = 0; n.trashed = Date.now();
  if (!S.notes.includes(n)) S.notes.unshift(n);
  save(); buzz('med');
  toast('Moved to Trash', 'Undo', () => { n.trashed = 0; save(); render(); });
}
function lockItem(n, getHtml, after) {
  return n.locked
    ? { l: 'Remove lock', ic: 'unlock', f: async () => { if (ed) await persist(); const ok = await removeLock(n); if (ok) { if (ed) keepKey(); else releaseKey(); n.modified = Date.now(); save(); toast('Lock removed'); } else if (!ed) releaseKey(); after(); } }
    : { l: 'Lock Note', ic: 'lock', f: async () => { if (ed) await persist(); const ok = await lockNote(n, getHtml()); if (ok) { if (ed) keepKey(); else releaseKey(); if (!S.notes.includes(n) && (n.title || toPlain(getHtml()))) S.notes.unshift(n); save(); toast('Note locked'); } else if (!ed) releaseKey(); after(); } };
}
function editorMenu() {
  const n = ed.note;
  menu([
    { l: n.fav ? 'Unpin' : 'Pin to top', ic: 'pin', f: ACT.edPin },
    { l: 'Tags', ic: 'tag', s: n.tags.length ? n.tags.map(t => '#' + t).join(' ') : 'None', f: () => tagSheet(n, afterEdit) },
    { l: 'Colour', ic: 'drop', s: n.color || 'None', f: () => colorSheet(n, afterEdit) },
    { l: 'Reminder', ic: 'bell', s: n.remind ? fmtRemind(n.remind) : 'None', f: () => remindMenu(n, afterEdit) },
    lockItem(n, () => $('#body').innerHTML, afterEdit),
    { l: 'Move to Trash', ic: 'trash', d: true, f: async () => { await flushSave(); trashNote(n); ed = null; if (n.locked) releaseKey(); view.screen = 'home'; view.anim = 'fade'; render(); } }
  ]);
}
function noteMenu(id) {
  const n = findNote(id); if (!n) return;
  menu([
    { l: 'Open', ic: 'notes', f: () => openNote(id) },
    { l: n.fav ? 'Unpin' : 'Pin to top', ic: 'pin', f: () => { n.fav = !n.fav; save(); render(); } },
    { l: 'Tags', ic: 'tag', f: () => tagSheet(n, render) },
    { l: 'Colour', ic: 'drop', f: () => colorSheet(n, render) },
    { l: 'Reminder', ic: 'bell', s: n.remind ? fmtRemind(n.remind) : '', f: () => remindMenu(n, render) },
    lockItem(n, () => n.body, render),
    { l: 'Move to Trash', ic: 'trash', d: true, f: () => { const card = document.querySelector('.note[data-v="' + id + '"]'); if (card) card.classList.add('out'); setTimeout(() => { trashNote(n); render(); }, 200); } }
  ], n.title || 'Untitled');
}

/* ---------- import / export ---------- */
async function shareText(name, text, mime) {
  const FS = plug('Filesystem'), SH = plug('Share');
  if (FS && SH) {
    try {
      const r = await FS.writeFile({ path: name, data: text, directory: 'CACHE', encoding: 'utf8' });
      await SH.share({ title: name, url: r.uri, dialogTitle: 'Save or share' });
      return true;
    } catch (e) { if (e && /cancel/i.test(String(e.message || e))) return false; }
  }
  try { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([text], { type: mime })); a.download = name; document.body.appendChild(a); a.click(); a.remove(); return true; }
  catch (e) { toast('Could not export'); return false; }
}
function pickFile(accept, multiple) {
  return new Promise(res => {
    const i = document.createElement('input'); i.type = 'file'; i.accept = accept; i.multiple = !!multiple; i.style.display = 'none';
    i.onchange = () => { res(Array.from(i.files || [])); i.remove(); };
    document.body.appendChild(i); i.click();
  });
}
const stamp = () => new Date().toISOString().slice(0, 10);
async function doBackup() { const ok = await shareText('notebook-backup-' + stamp() + '.json', JSON.stringify({ app: 'notebook', v: 2, exported: Date.now(), data: S }), 'application/json'); if (ok) { S.settings.lastBackup = Date.now(); save(); } }
async function doRestore() {
  const fs = await pickFile('.json,application/json'); if (!fs.length) return;
  let data; try { const j = JSON.parse(await fs[0].text()); data = j && j.data && j.app === 'notebook' ? j.data : null; } catch (e) { }
  if (!data || !Array.isArray(data.notes)) { toast('That is not a Notebook backup'); return; }
  const r = await ask({ title: 'Restore backup?', text: 'This replaces all notes and settings on this device with the backup (' + data.notes.length + ' notes).', ok: 'Restore', danger: true });
  if (!r) return;
  S = normalize(data); S.settings.onboarded = true; S.settings.bio = false; S.settings.lastBackup = Date.now(); sessionKey = null; keyExpiry = 0; save(); applyTheme(true); view.tab = 'settings'; view.screen = 'settings'; render(); toast('Backup restored');
}
async function doExportTxt() {
  const a = S.notes.filter(n => !n.trashed && !n.locked);
  if (!a.length) { toast('No unlocked notes to export'); return; }
  const txt = a.map(n => '# ' + (n.title || 'Untitled') + '\n' + [n.tags.map(t => '#' + t).join(' '), new Date(n.modified).toLocaleString()].filter(Boolean).join(' · ') + '\n\n' + n.plain + '\n').join('\n---\n\n');
  await shareText('notebook-export-' + stamp() + '.txt', txt, 'text/plain');
}
async function doImportTxt() {
  const fs = await pickFile('.txt,.md,text/plain,text/markdown', true); if (!fs.length) return;
  let c = 0;
  for (const f of fs) {
    if (/\.json$/i.test(f.name)) { toast('Use Restore for .json backups'); continue; }
    const t = await f.text();
    S.notes.unshift({ id: uid(), title: f.name.replace(/\.[^.]+$/, ''), body: textToHtml(t), plain: t.trim(), created: Date.now(), modified: Date.now(), tags: [], fav: false, locked: false, enc: null, trashed: 0, color: '', remind: 0, todo: null }); c++;
  }
  if (c) { save(); toast(c + (c > 1 ? ' notes imported' : ' note imported')); render(); }
}
function maybeBackupPrompt() {
  if (backupAsked || !S.settings.onboarded || appLocked || ed || closer || !S.settings.backupRemind || !S.notes.length) return;
  const last = S.settings.lastBackup || 0;
  if (!last) { S.settings.lastBackup = Date.now(); save(); return; }
  if (Date.now() - last < 7 * DAY) return;
  backupAsked = true;
  menu([
    { l: 'Back up now', ic: 'down', f: doBackup },
    { l: 'Remind me tomorrow', ic: 'bell', f: () => { S.settings.lastBackup = Date.now() - 6 * DAY; save(); } },
    { l: 'Turn off reminders', ic: 'x', d: true, f: () => { S.settings.backupRemind = false; save(); if (view.screen === 'settings') render(); } }
  ], 'Time for your weekly backup');
}

/* ---------- actions ---------- */
const ACT = {
  obNext() { ob++; render(); },
  obTheme(v, el, e) { swapTheme(e, () => { S.settings.theme = v; }, modeOf(v)); },
  async obLock() { const k = await createPasscode(); if (k) { S.settings.appLock = true; releaseKey(); ACT.obDone(); } },
  obDone() { S.settings.onboarded = true; if (!S.settings.lastBackup) S.settings.lastBackup = Date.now(); save(); render(); },
  tab(v) {
    const cur = navKey();
    if (cur === v && (v !== 'notes' || (view.screen === 'home' && view.filter === 'all' && !view.tag))) return;
    const d = ORDER.indexOf(v) - ORDER.indexOf(cur);
    buzz('light');
    view.screen = v === 'settings' ? 'settings' : 'home'; view.tab = v === 'settings' ? 'settings' : 'notes';
    view.search = v === 'search'; view.q = ''; view.tag = ''; view.filter = 'all'; view.anim = d >= 0 ? 'r' : 'l'; render();
  },
  filter(v) {
    view.filter = v; view.tag = '';
    if (view.screen === 'home' && !view.search) refreshHome(); else { view.search = false; view.q = ''; view.screen = 'home'; view.tab = 'notes'; render(); }
  },
  tagChip(v) {
    const same = view.screen === 'home' && !view.search;
    view.filter = 'all';
    if (same) { view.tag = view.tag && view.tag.toLowerCase() === v.toLowerCase() ? '' : v; refreshHome(); return; }
    view.tab = 'notes'; view.screen = 'home'; view.search = false; view.q = ''; view.tag = v; view.anim = 'fade'; render();
    const sc = $('#app .scroll'); if (sc) sc.scrollTop = 0;
  },
  tagGo(v) { view.tab = 'notes'; view.screen = 'home'; view.search = false; view.q = ''; view.filter = 'all'; view.tag = v; view.anim = 'l'; render(); },
  new: newNote,
  open(v) { if (suppress) return; openNote(v); },
  async edBack() { await leaveEditor(); },
  async saveNow() { await persist(); },
  edPin() { const n = ed.note; n.fav = !n.fav; persistedOnly(); const b = $('#pinb'); if (b) { b.innerHTML = ic(n.fav ? 'pinf' : 'pin'); b.classList.toggle('ac', n.fav); } toast(n.fav ? 'Pinned to top' : 'Unpinned'); },
  edMore: () => editorMenu(),
  edTags() { tagSheet(ed.note, afterEdit); },
  edRemind() { remindMenu(ed.note, afterEdit); },
  theme(v, el, e) { swapTheme(e, () => { S.settings.theme = v; }, modeOf(v)); },
  palette(v, el, e) { swapTheme(e, () => { S.settings.palette = v; }, curMode()); },
  sort() { menu(Object.keys(SORTN).map(k => ({ l: SORTN[k], c: S.settings.sort === k, f: () => { S.settings.sort = k; save(); render(); } })), 'Sort notes by'); },
  autosave() { S.settings.autosave = !S.settings.autosave; save(); render(); },
  startNew() { S.settings.startNew = !S.settings.startNew; save(); render(); },
  preview() { menu([0, 1, 2, 3].map(k => ({ l: k ? k + (k > 1 ? ' lines' : ' line') : 'Off', c: S.settings.preview === k, f: () => { S.settings.preview = k; save(); render(); } })), 'Preview length'); },
  haptics() { S.settings.haptics = !S.settings.haptics; save(); buzz('light'); render(); },
  backupRemind() { S.settings.backupRemind = !S.settings.backupRemind; save(); render(); },
  async appLockToggle() {
    if (S.settings.appLock) { const k = await passPrompt('Turn off App Lock', 'Enter your passcode to confirm.'); if (k) { S.settings.appLock = false; save(); render(); } return; }
    if (!S.sec) { const k = await createPasscode(); if (!k) return; releaseKey(); }
    S.settings.appLock = true; save(); render(); toast('App Lock is on');
  },
  async bioToggle() {
    if (S.settings.bio) { try { NB().bioClear(); } catch (e) { } S.settings.bio = false; save(); render(); return; }
    if (await bioEnable()) { releaseKey(); render(); toast('Biometric unlock is on'); } else releaseKey();
  },
  changePass() { changePasscode(); },
  autolock() { menu(Object.keys(ALN).map(k => ({ l: ALN[k], c: String(S.settings.autolock) === k, f: () => { S.settings.autolock = +k; save(); render(); } })), 'Lock notes again'); },
  tags() { view.screen = 'tags'; view.anim = 'r'; render(); },
  trash() { view.screen = 'trash'; view.anim = 'r'; render(); },
  subBack() { view.screen = 'settings'; view.tab = 'settings'; view.anim = 'l'; render(); },
  async renTag(t) { const r = await ask({ title: 'Rename tag', fields: [{ id: 'n', value: t, ic: 'tag' }], ok: 'Rename' }); const nm = r && r.n.trim().replace(/^#+/, ''); if (nm && nm !== t) { S.notes.forEach(n => { n.tags = Array.from(new Set(n.tags.map(x => x.toLowerCase() === t.toLowerCase() ? nm : x))); }); save(); render(); } },
  async delTag(t) { const r = await ask({ title: 'Delete tag #' + t + '?', text: 'It is removed from every note.', ok: 'Delete', danger: true }); if (r) { S.notes.forEach(n => { n.tags = n.tags.filter(x => x.toLowerCase() !== t.toLowerCase()); }); save(); render(); } },
  restoreNote(v) { const n = findNote(v); if (n) { n.trashed = 0; save(); render(); toast('Restored'); } },
  async purge(v) { const r = await ask({ title: 'Delete permanently?', text: 'This cannot be undone.', ok: 'Delete', danger: true }); if (r) { S.notes = S.notes.filter(n => n.id !== v); save(); render(); } },
  async emptyTrash() { const r = await ask({ title: 'Empty Trash?', text: 'All notes in Trash will be deleted permanently.', ok: 'Empty Trash', danger: true }); if (r) { S.notes = S.notes.filter(n => !n.trashed); save(); render(); } },
  backup: doBackup, restore: doRestore, exportTxt: doExportTxt, importTxt: doImportTxt,
  about() { ask({ title: 'Notebook 1.1.0', text: 'Simple. Fast. Private. Focused.\n\nDeveloped by Dagim Bireda', ok: 'Close', cancel: false }); },
  privacy() { ask({ title: 'Privacy', text: 'Your notes never leave this device unless you export them. There are no accounts, no ads and no tracking.\n\nLocked notes are encrypted with AES-256 using a key derived from your passcode. Titles stay visible; the content does not. If you forget the passcode, locked notes cannot be recovered.', ok: 'Close', cancel: false }); },
  terms() { ask({ title: 'Terms', text: 'Notebook is provided as is, without warranty. Keep your own backups (Settings → Storage → Backup now) of anything important.', ok: 'Close', cancel: false }); },
  dev() { devSheet(); },
  async unlockApp() {
    const lp = $('#lp'), er = $('#lerr'); if (!lp) return;
    if (Date.now() < lockoutUntil) { er.textContent = 'Too many attempts. Wait a moment.'; return; }
    const k = await checkPasscode(lp.value);
    if (k) { fails = 0; appLocked = false; render(); afterUnlock(); }
    else { fails++; if (fails >= 5) { lockoutUntil = Date.now() + 30000; fails = 0; } er.textContent = 'Wrong passcode.'; er.classList.remove('shake'); void er.offsetWidth; er.classList.add('shake'); lp.value = ''; }
  },
  async bioApp() { const k = await bioUnlock('Unlock Notebook'); if (k) { fails = 0; appLocked = false; render(); afterUnlock(); } else { const lp = $('#lp'); if (lp) lp.focus(); } }
};
const BUZZ = new Set(['filter', 'tagChip', 'tagGo', 'new', 'autosave', 'startNew', 'appLockToggle', 'bioToggle', 'backupRemind', 'edPin']);
document.addEventListener('click', e => {
  const el = e.target.closest('[data-act]');
  if (!el || !el.closest('#app,#navwrap')) return;
  const a = el.dataset.act;
  if (BUZZ.has(a)) buzz('light');
  const f = ACT[a]; if (f) f(el.dataset.v, el, e);
});

function devSheet() {
  const ov = $('#overlay');
  ov.innerHTML = `<div class="scrim"></div><div class="sheet dev"><div class="av">DB</div><div class="dn">Dagim Bireda</div><div class="ds">Developer</div><a class="mi" href="mailto:dagim22bireda@gmail.com">${ic('mail', 20)}<span class="ml">dagim22bireda@gmail.com<small>Email</small></span></a><a class="mi" href="tel:0929040636">${ic('call', 20)}<span class="ml">0929040636<small>Phone</small></span></a><div class="ds" style="margin:14px 0 2px">Notebook 1.1.0</div></div>`;
  showOverlay(closeOverlay);
  $('.scrim', ov).onclick = () => { if (Date.now() - openedAt > 350) closeOverlay(); };
}

/* swipe sideways to change pages; swipe from the left edge to go back */
let sw = null;
document.addEventListener('touchstart', e => {
  if (closer || e.touches.length !== 1 || !S.settings.onboarded || appLocked) { sw = null; return; }
  const t = e.touches[0];
  sw = { x: t.clientX, y: t.clientY, t: Date.now(), edge: t.clientX < 28, ok: !e.target.closest('.chips,.fmt,input,.sbar,.ebody,.etitle') };
}, { passive: true });
document.addEventListener('touchend', e => {
  const s = sw; sw = null; if (!s) return;
  const t = e.changedTouches[0], dx = t.clientX - s.x, dy = t.clientY - s.y;
  if (Math.abs(dx) < 64 || Math.abs(dx) < Math.abs(dy) * 1.7 || Date.now() - s.t > 650) return;
  if (view.screen === 'home' || view.screen === 'settings') {
    if (!s.ok) return;
    const i = ORDER.indexOf(navKey()) + (dx < 0 ? 1 : -1);
    if (i >= 0 && i < ORDER.length) ACT.tab(ORDER[i]);
  } else if (s.edge && dx > 0) handleBack();
}, { passive: true });

/* long-press on a note opens its menu */
let lp = null;
function lpClear() { if (lp) { clearTimeout(lp.t); lp = null; } }
document.addEventListener('pointerdown', e => {
  suppress = false;
  const c = e.target.closest && e.target.closest('.note'); if (!c) return;
  lpClear();
  lp = { x: e.clientX, y: e.clientY, t: setTimeout(() => { suppress = true; const id = c.dataset.v; lp = null; buzz('med'); noteMenu(id); }, 480) };
});
document.addEventListener('pointermove', e => { if (lp && Math.hypot(e.clientX - lp.x, e.clientY - lp.y) > 10) lpClear(); });
['pointerup', 'pointercancel', 'scroll'].forEach(t => document.addEventListener(t, lpClear, true));

/* ---------- app lifecycle ---------- */
function afterUnlock() {
  checkShare();
  if (startNewPending) { startNewPending = false; if (!ed && !pendingShare) newNote(); }
  setTimeout(maybeBackupPrompt, 1500);
}
async function engageAppLock() {
  if (ed) { await flushSave(); const n = ed.note; ed = null; if (n.locked) sessionKey = null; view.screen = 'home'; }
  sessionKey = null; keyExpiry = 0; closeOverlay(); bioTried = false; appLocked = true; render();
}
document.addEventListener('visibilitychange', async () => {
  if (document.hidden) {
    hiddenAt = Date.now();
    if (ed) { clearTimeout(ed.timer); await flushSave().catch(() => { }); }
    if (+S.settings.autolock === -1) {
      sessionKey = null; keyExpiry = 0;
      if (ed && ed.note.locked) { ed = null; view.screen = 'home'; closeOverlay(); render(); }
    }
  } else {
    if (S.settings.onboarded && S.settings.appLock && S.sec && !appLocked && Date.now() - hiddenAt > 10000) engageAppLock();
    else { checkShare(); setTimeout(maybeBackupPrompt, 1200); }
  }
});
async function handleBack() {
  if (closer) { closer(); return; }
  if (!S.settings.onboarded) { if (ob > 0) { ob--; render(); } return; }
  if (appLocked) { exitApp(); return; }
  if (view.screen === 'editor') { await leaveEditor(); return; }
  if (['tags', 'trash'].includes(view.screen)) { ACT.subBack(); return; }
  if (view.search) { ACT.tab('notes'); return; }
  if (view.tag || view.filter !== 'all') { view.tag = ''; view.filter = 'all'; render(); return; }
  if (view.screen === 'settings') { ACT.tab('notes'); return; }
  exitApp();
}
function exitApp() { const A = plug('App'); if (A && A.exitApp) A.exitApp(); }

/* ---------- boot ---------- */
S = load();
save();
applyTheme(false);
appLocked = !!(S.settings.onboarded && S.settings.appLock && S.sec);
const AppP = plug('App');
if (AppP && AppP.addListener) { try { AppP.addListener('backButton', () => { handleBack(); }); } catch (e) { } }
window.addEventListener('beforeunload', () => { if (ed && ed.dirty) { try { persist(); } catch (e) { } } });
render();
if (S.settings.onboarded) {
  if (appLocked) { startNewPending = !!S.settings.startNew; const s0 = takeShare(); if (s0) pendingShare = s0; }
  else { checkShare().then(() => { if (!ed && S.settings.startNew && !pendingShare) newNote(); }); setTimeout(maybeBackupPrompt, 1800); }
}
})();
