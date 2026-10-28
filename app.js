(function () {
'use strict';

/* ---------- helpers ---------- */
const $ = (s, el) => (el || document).querySelector(s);
const $$ = (s, el) => Array.from((el || document).querySelectorAll(s));
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const plug = n => { try { return (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins[n]) || null; } catch (e) { return null; } };
const sleep = ms => new Promise(r => setTimeout(r, ms));

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

/* ---------- icons ---------- */
const IC = {
  notes: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h4"/>',
  star: '<path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.8l-5.2 2.8 1-5.8-4.3-4.1 5.9-.9z"/>',
  starf: '<path fill="currentColor" d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.8l-5.2 2.8 1-5.8-4.3-4.1 5.9-.9z"/>',
  lock: '<rect x="5" y="11" width="14" height="9" rx="2.5"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
  unlock: '<rect x="5" y="11" width="14" height="9" rx="2.5"/><path d="M8 11V8a4 4 0 0 1 7.5-2"/>',
  settings: '<path d="M4 7h9M17 7h3M4 17h3M11 17h9"/><circle cx="15" cy="7" r="2"/><circle cx="9" cy="17" r="2"/>',
  search: '<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4 4"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  back: '<path d="M15 5l-7 7 7 7"/>',
  more: '<circle cx="12" cy="5" r="1.7" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.7" fill="currentColor" stroke="none"/><circle cx="12" cy="19" r="1.7" fill="currentColor" stroke="none"/>',
  trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  folder: '<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
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
  call: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A15 15 0 0 1 3 6a2 2 0 0 1 2-2z"/>'
};
const ic = (n, s) => `<svg class="i" viewBox="0 0 24 24" width="${s || 22}" height="${s || 22}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IC[n] || ''}</svg>`;
const logo = s => `<svg viewBox="0 0 64 64" width="${s || 28}" height="${s || 28}" aria-hidden="true"><rect x="4" y="4" width="56" height="56" rx="16" fill="var(--ac)"/><rect x="18" y="13" width="28" height="38" rx="6" fill="var(--on)"/><path d="M24 27h16M24 34h16M24 41h9" stroke="var(--ac)" stroke-width="3" stroke-linecap="round"/><path d="M37 13h7v14l-3.5-2.6L37 27z" fill="var(--ac2)"/></svg>`;

/* ---------- state ---------- */
const KEY = 'notebook.v1';
function defaults() {
  return { settings: { theme: 'dark', palette: 'pure', sort: 'modified', preview: 2, autolock: 60, appLock: false, onboarded: false, defaultFolder: '', autosave: true, haptics: true },
    notes: [], folders: ['Personal', 'School', 'Projects', 'Work', 'Ideas'], sec: null };
}
function normalize(raw) {
  const d = defaults();
  const r = raw && typeof raw === 'object' ? raw : {};
  const S = { settings: Object.assign(d.settings, r.settings || {}), notes: [], folders: Array.isArray(r.folders) ? r.folders.map(String) : d.folders, sec: r.sec && r.sec.salt && r.sec.ver ? r.sec : null };
  (Array.isArray(r.notes) ? r.notes : []).forEach(n => {
    if (!n || typeof n !== 'object') return;
    const locked = !!n.locked && !!n.enc;
    const body = locked ? '' : sanitize(String(n.body || ''));
    S.notes.push({ id: String(n.id || uid()), title: String(n.title || ''), body, plain: locked ? '' : toPlain(body), created: +n.created || Date.now(), modified: +n.modified || Date.now(),
      folder: String(n.folder || ''), tags: Array.isArray(n.tags) ? n.tags.map(String) : [], fav: !!n.fav, locked, enc: locked ? n.enc : null, trashed: +n.trashed || 0 });
  });
  if (!PAL[S.settings.palette]) S.settings.palette = 'pure';
  return S;
}
function load() { try { return normalize(JSON.parse(localStorage.getItem(KEY))); } catch (e) { return normalize(null); } }
let S;
function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { toast('Storage is full'); } }

const view = { tab: 'notes', screen: 'home', folder: 'all', search: false, q: '', tag: '', anim: 'fade' };
const TABS = ['notes', 'fav', 'locked', 'settings'];
let ob = 0, appLocked = false, hiddenAt = 0, ed = null, sessionKey = null, keyExpiry = 0, closer = null, fails = 0, lockoutUntil = 0, suppress = false, openedAt = 0;

/* ---------- html helpers ---------- */
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
function hl(t, q) {
  t = String(t);
  if (!q || !q.trim()) return esc(t);
  const ws = q.trim().split(/\s+/).filter(Boolean).map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
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
let toastT;
function toast(m) { const t = $('#toast'); t.textContent = m; t.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 2200); }

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
    ov.innerHTML = `<div class="scrim"></div><div class="dlg" role="dialog"><h3>${esc(o.title)}</h3>${o.text ? `<p>${esc(o.text)}</p>` : ''}${(o.fields || []).map(f => `<input class="field" id="f_${f.id}" type="${f.type || 'text'}" placeholder="${esc(f.ph || '')}" value="${esc(f.value || '')}" autocomplete="off" autocapitalize="off" spellcheck="false">`).join('')}<div class="err" id="derr"></div><div class="dact">${o.cancel === false ? '' : `<button class="btn ghost" id="dno">${esc(o.cancel || 'Cancel')}</button>`}<button class="btn ${o.danger ? 'danger' : 'primary'}" id="dok">${esc(o.ok || 'OK')}</button></div></div>`;
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
    const fs = $$('.field', ov);
    fs.forEach((f, i) => f.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); if (i < fs.length - 1) fs[i + 1].focus(); else submit(); } }));
    if (fs[0]) setTimeout(() => fs[0].focus(), 120);
  });
}

/* ---------- passcode flows ---------- */
async function passPrompt(title, text) {
  let key = null;
  const r = await ask({ title, text, fields: [{ id: 'p', type: 'password', ph: 'PIN or password' }], ok: 'Unlock',
    validate: async v => {
      if (Date.now() < lockoutUntil) return 'Too many attempts. Wait a moment.';
      key = await checkPasscode(v.p);
      if (!key) { fails++; if (fails >= 5) { lockoutUntil = Date.now() + 30000; fails = 0; } return 'Wrong passcode.'; }
      fails = 0; return null;
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
      key = await makePasscode(v.a); return null;
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
    S.sec = { salt: b64(salt), ver }; save();
    sessionKey = null; keyExpiry = 0;
    toast('Passcode changed');
  } catch (e) { toast('Could not change passcode'); }
}

/* ---------- note data ---------- */
const findNote = id => S.notes.find(n => n.id === id);
function visibleNotes() {
  let a = S.notes.filter(n => !n.trashed);
  const searching = view.search && view.q.trim();
  if (view.tab === 'fav') a = a.filter(n => n.fav);
  if (view.tab === 'locked') a = a.filter(n => n.locked);
  if (view.tab === 'notes' && view.tag) { const tg = view.tag.toLowerCase(); a = a.filter(n => n.tags.some(t => t.toLowerCase() === tg)); }
  if (view.tab === 'notes' && view.folder !== 'all' && !searching) a = a.filter(n => n.folder === view.folder);
  if (searching) {
    const ws = view.q.toLowerCase().split(/\s+/).filter(Boolean);
    a = a.filter(n => { const hay = (n.title + ' ' + (n.locked ? '' : n.plain) + ' ' + n.folder + ' ' + n.tags.join(' ')).toLowerCase(); return ws.every(w => hay.includes(w)); });
  }
  const s = S.settings.sort;
  a.sort((x, y) => s === 'title' ? (x.title || 'Untitled').localeCompare(y.title || 'Untitled') : s === 'created' ? y.created - x.created : y.modified - x.modified);
  return a;
}
function cardHtml(n, i, q, anim) {
  const t = n.title || 'Untitled';
  let pv = '';
  if (n.locked) pv = '<span class="lk">Locked note</span>';
  else if (S.settings.preview > 0) {
    const p = n.plain.replace(/\s+/g, ' ').trim().slice(0, 320);
    pv = `<div class="np" style="-webkit-line-clamp:${+S.settings.preview}">${p ? hl(p, q) : '<span class="mut">No additional text</span>'}</div>`;
  }
  const tags = n.tags.slice(0, 3).map(t2 => `<span class="tg" data-act="tagChip" data-v="${esc(t2)}">#${hl(t2, q)}</span>`).join('');
  return `<div class="card note ${anim ? '' : 'noanim'}" style="--i:${Math.min(i, 14)}" data-act="open" data-v="${esc(n.id)}"><div class="nt">${n.locked ? ic('lock', 18) : ''}<span class="tt">${hl(t, q)}</span>${n.fav ? `<span class="stf">${ic('starf', 17)}</span>` : ''}</div>${pv}<div class="nm">${n.folder ? `<span class="pill" data-act="folderGo" data-v="${esc(n.folder)}">${hl(n.folder, q)}</span>` : ''}${tags}<span class="dt">${fmtDate(n.modified)}</span></div></div>`;
}
function emptyMsg() {
  if (view.search && view.q.trim()) return 'No notes found.';
  if (view.tab === 'fav') return 'No favorites yet.<small>Tap the star inside a note.</small>';
  if (view.tab === 'locked') return 'No locked notes.<small>Open a note’s menu and choose Lock Note.</small>';
  if (view.tag) return 'No notes tagged #' + esc(view.tag) + '.';
  if (view.folder !== 'all') return 'This folder is empty.';
  return 'No notes yet.<small>Tap + to write your first note.</small>';
}
function renderList(anim) {
  const list = $('#list'); if (!list) return;
  const a = visibleNotes(), q = view.search ? view.q : '';
  list.innerHTML = a.length ? a.map((n, i) => cardHtml(n, i, q, anim)).join('') : `<div class="empty">${emptyMsg()}</div>`;
}

/* ---------- screens ---------- */
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
  $$('#app .chip').forEach(c => { const a = c.dataset.act, v = c.dataset.v; if (a === 'chip') c.classList.toggle('on', view.folder === v); else if (a === 'tagChip') c.classList.toggle('on', !!view.tag && view.tag.toLowerCase() === v.toLowerCase()); });
  renderList(true);
}
function renderScreen() {
  if (!S.settings.onboarded) return renderOnboard();
  if (appLocked) return renderLock();
  switch (view.screen) {
    case 'editor': return renderEditor();
    case 'settings': return renderSettings();
    case 'folders': return renderFolders();
    case 'tags': return renderTags();
    case 'trash': return renderTrash();
    default: return renderHome();
  }
}
function renderNav() {
  const w = $('#navwrap'); if (!w) return;
  const show = S.settings.onboarded && !appLocked && (view.screen === 'home' || view.screen === 'settings');
  if (!w.firstChild) {
    const it = [['notes', 'notes', 'Notes'], ['fav', 'star', 'Favorites'], ['locked', 'lock', 'Locked'], ['settings', 'settings', 'Settings']];
    w.innerHTML = `<nav class="nav">${it.map(([k, i, l]) => `<button data-act="tab" data-v="${k}" aria-label="${l}">${ic(i, 22)}<span>${l}</span></button>`).join('')}</nav>`;
  }
  w.classList.toggle('hide', !show);
  $$('button', w).forEach(b => b.classList.toggle('on', show && b.dataset.v === view.tab));
}
function renderHome() {
  const titles = { notes: 'My Notes', fav: 'Favorites', locked: 'Locked' };
  const chips = view.tab === 'notes' && !view.search
    ? `<div class="chips">${['all'].concat(S.folders).map(f => `<button class="chip ${view.folder === f ? 'on' : ''}" data-act="chip" data-v="${esc(f)}">${f === 'all' ? 'All' : esc(f)}</button>`).join('')}<button class="chip" data-act="trash">${ic('trash', 15)}Trash</button></div>` : '';
  const tl = allTags();
  const tagRow = view.tab === 'notes' && !view.search && tl.length ? `<div class="chips tgs">${tl.map(([t]) => `<button class="chip sm ${view.tag && view.tag.toLowerCase() === t.toLowerCase() ? 'on' : ''}" data-act="tagChip" data-v="${esc(t)}">#${esc(t)}</button>`).join('')}</div>` : '';
  root().innerHTML = `<div class="screen"><header class="top">${view.search
    ? `<div class="sbar">${ic('search', 20)}<input id="q" type="text" placeholder="Search notes" value="${esc(view.q)}" autocomplete="off"><button class="ib" data-act="closeSearch" aria-label="Close search">${ic('x', 20)}</button></div>`
    : `<div class="brand">${logo(30)}<span class="wm">Notebook</span></div><div class="hact"><button class="ib" data-act="search" aria-label="Search">${ic('search')}</button><button class="ib" data-act="tab" data-v="settings" aria-label="Settings">${ic('settings')}</button></div>`}</header>
  <div class="scroll"><h1 class="h1">${view.search ? 'Search' : titles[view.tab]}</h1>${chips}${tagRow}<div id="list"></div></div>${view.tab === 'notes' && !view.search ? `<button class="fab" data-act="new" aria-label="New note">${ic('plus', 28)}</button>` : ''}</div>`;
  renderList(true);
  const q = $('#q');
  if (q) { q.addEventListener('input', () => { view.q = q.value; renderList(false); }); if (!q.value) setTimeout(() => q.focus(), 60); }
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
  root().innerHTML = `<div class="screen ob"><div class="obc"><div class="lockic">${ic('lock', 44)}</div><h2>Notebook is locked</h2><p>Enter your passcode to continue.</p><input class="field" id="lp" type="password" placeholder="PIN or password" autocomplete="off"><div class="err" id="lerr"></div></div><div class="obf"><button class="btn primary wide" data-act="unlockApp">Unlock</button></div></div>`;
  const lp = $('#lp'); lp.addEventListener('keydown', e => { if (e.key === 'Enter') ACT.unlockApp(); });
  setTimeout(() => lp.focus(), 200);
}

function row(act, label, val, v, sub) { return `<button class="row" data-act="${act}" ${v != null ? `data-v="${esc(v)}"` : ''}><span class="rl">${label}${sub ? `<small>${sub}</small>` : ''}</span>${val != null ? `<span class="rv">${val}</span>` : ''}<span class="ch">${ic('chev', 18)}</span></button>`; }
function swRow(act, label, on, sub) { return `<button class="row" data-act="${act}"><span class="rl">${label}${sub ? `<small>${sub}</small>` : ''}</span><i class="sw ${on ? 'on' : ''}"></i></button>`; }
const ALN = { '0': 'Immediately', '30': 'After 30 seconds', '60': 'After 1 minute', '300': 'After 5 minutes', '-1': 'When the app closes' };
const SORTN = { modified: 'Last modified', created: 'Date created', title: 'Title (A–Z)' };
function renderSettings() {
  const st = S.settings, mode = curMode();
  const opt = (m, i, l) => `<button class="opt ${st.theme === m ? 'on' : ''}" data-act="theme" data-v="${m}">${ic(i, 24)}<span>${l}</span>${st.theme === m ? `<i class="chk">${ic('check', 14)}</i>` : ''}</button>`;
  const pals = Object.keys(PAL).map(k => { const c = PAL[k][mode]; return `<button class="pal ${st.palette === k ? 'on' : ''}" data-act="palette" data-v="${k}"><span class="sws"><b style="background:${c.bg}"></b><b style="background:${c.card2}"></b><b style="background:${c.ac}"></b><b style="background:${c.ac2}"></b></span>${PAL[k].name}</button>`; }).join('');
  root().innerHTML = `<div class="screen"><header class="top"><h1 class="h1 s">Settings</h1></header><div class="scroll"><div class="pad">
  <div class="gt">Appearance</div><div class="opts">${opt('dark', 'moon', 'Dark')}${opt('light', 'sun', 'White')}${opt('system', 'phone', 'System')}</div>
  <div class="gs2">Accent color</div><div class="pals">${pals}</div>
  <div class="gt">Notes</div><div class="rows">${row('defFolder', 'Default folder', esc(st.defaultFolder || 'None'))}${row('sort', 'Default sorting', SORTN[st.sort])}${swRow('autosave', 'Auto-save', st.autosave)}${row('preview', 'Note preview length', st.preview ? st.preview + (st.preview > 1 ? ' lines' : ' line') : 'Off')}${swRow('haptics', 'Haptic feedback', st.haptics)}</div>
  <div class="gt">Security</div><div class="rows">${swRow('appLockToggle', 'App Lock', st.appLock, 'Ask for the passcode when opening Notebook')}${S.sec ? row('changePass', 'Change passcode') : ''}${row('autolock', 'Locked-note auto-lock', ALN[st.autolock])}</div>
  <div class="gt">Organization</div><div class="rows">${row('folders', 'Manage folders')}${row('tags', 'Manage tags')}${row('favs', 'Favorites')}${row('trash', 'Trash', S.notes.filter(n => n.trashed).length || '')}</div>
  <div class="gt">Storage</div><div class="rows">${row('backup', 'Backup', 'JSON file')}${row('restore', 'Restore')}${row('exportTxt', 'Export notes', 'Text file')}${row('importTxt', 'Import notes', '.txt / .md')}</div>
  <div class="gt">About</div><div class="rows">${row('about', 'App version', '1.0.0')}${row('privacy', 'Privacy')}${row('terms', 'Terms')}${row('dev', 'About the developer', 'Dagim Bireda')}</div><div class="foot" data-act="dev">Developed by Dagim Bireda</div>
  </div></div></div>`;
}
function subTop(title, right) { return `<header class="subtop"><button class="ib" data-act="subBack" aria-label="Back">${ic('back')}</button><h1 class="h1">${title}</h1>${right || ''}</header>`; }
function renderFolders() {
  root().innerHTML = `<div class="screen">${subTop('Folders', `<button class="txtbtn" data-act="addFolder">New</button>`)}<div class="scroll"><div class="pad">${S.folders.length ? `<div class="rows">${S.folders.map(f => `<div class="li2"><span class="lt"><b>${esc(f)}</b><small>${S.notes.filter(n => n.folder === f && !n.trashed).length} notes</small></span><button class="ib" data-act="renFolder" data-v="${esc(f)}" aria-label="Rename">${ic('edit', 19)}</button><button class="ib" data-act="delFolder" data-v="${esc(f)}" aria-label="Delete">${ic('trash', 19)}</button></div>`).join('')}</div>` : '<div class="empty">No folders.</div>'}</div></div></div>`;
}
function allTags() { const m = {}; S.notes.forEach(n => n.tags.forEach(t => m[t] = (m[t] || 0) + 1)); return Object.keys(m).sort().map(t => [t, m[t]]); }
function renderTags() {
  const t = allTags();
  root().innerHTML = `<div class="screen">${subTop('Tags')}<div class="scroll"><div class="pad">${t.length ? `<div class="rows">${t.map(([k, c]) => `<div class="li2"><button class="lt" data-act="tagGo" data-v="${esc(k)}"><b>#${esc(k)}</b><small>${c} notes</small></button><button class="ib" data-act="renTag" data-v="${esc(k)}" aria-label="Rename">${ic('edit', 19)}</button><button class="ib" data-act="delTag" data-v="${esc(k)}" aria-label="Delete">${ic('trash', 19)}</button></div>`).join('')}</div>` : '<div class="empty">No tags yet.<small>Add tags from a note’s menu.</small></div>'}</div></div></div>`;
}
function renderTrash() {
  const a = S.notes.filter(n => n.trashed).sort((x, y) => y.trashed - x.trashed);
  root().innerHTML = `<div class="screen">${subTop('Trash', a.length ? `<button class="txtbtn" data-act="emptyTrash">Empty</button>` : '')}<div class="scroll"><div class="pad">${a.length ? `<div class="rows">${a.map(n => `<div class="li2"><span class="lt"><b>${n.locked ? '🔒 ' : ''}${esc(n.title || 'Untitled')}</b><small>Deleted ${fmtDate(n.trashed)}</small></span><button class="ib" data-act="restoreNote" data-v="${esc(n.id)}" aria-label="Restore">${ic('restore', 19)}</button><button class="ib" data-act="purge" data-v="${esc(n.id)}" aria-label="Delete forever">${ic('trash', 19)}</button></div>`).join('')}</div><div class="hint">Notes stay here until you delete them permanently.</div>` : '<div class="empty">Trash is empty.</div>'}</div></div></div>`;
}

/* ---------- editor ---------- */
const FMT = [['bold', 'bold'], ['italic', 'italic'], ['underline', 'underline'], ['hl', 'hl'], '|', ['ul', 'ul'], ['ol', 'ol'], ['todo', 'todo'], '|', ['undo', 'undo'], ['redo', 'redo']];
function metaText(n) { return `<span>${fmtDate(n.modified)}</span>${n.folder ? `<span class="pill">${esc(n.folder)}</span>` : ''}${n.tags.map(t => `<span>#${esc(t)}</span>`).join('')}${n.locked ? `<span class="pill">${ic('lock', 12)}</span>` : ''}`; }
function renderEditor() {
  const n = ed.note;
  root().innerHTML = `<div class="screen"><header class="eh"><button class="ib" data-act="edBack" aria-label="Back">${ic('back')}</button><span class="sp"></span><span class="status" id="st"></span>${S.settings.autosave ? '' : `<button class="ib ac" data-act="saveNow" aria-label="Save">${ic('check')}</button>`}<button class="ib ${n.fav ? 'ac' : ''}" data-act="edFav" id="favb" aria-label="Favorite">${ic(n.fav ? 'starf' : 'star')}</button><button class="ib" data-act="edMore" aria-label="More">${ic('more')}</button></header>
  <div class="escroll"><input id="title" class="etitle" type="text" placeholder="Title" autocomplete="off" value="${esc(n.title)}"><div class="emeta" id="meta">${metaText(n)}</div><div id="body" class="ebody" contenteditable="true" data-ph="Start writing…" spellcheck="true"></div></div>
  <div class="fmt" id="fmt">${FMT.map(f => f === '|' ? '<i class="div"></i>' : `<button tabindex="-1" data-c="${f[0]}" aria-label="${f[0]}">${ic(f[1], 21)}</button>`).join('')}</div></div>`;
  const body = $('#body'), title = $('#title'), fmt = $('#fmt');
  body.innerHTML = sanitize(ed.body || '');
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
  if (ed.isNew && !n.title) setTimeout(() => { if (document.activeElement !== body && document.activeElement !== title) title.focus(); }, 120);
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
  const map = { bold: 'bold', italic: 'italic', underline: 'underline', ul: 'insertUnorderedList', ol: 'insertOrderedList' };
  $$('button', f).forEach(b => { const c = map[b.dataset.c]; let on = false; try { on = c ? document.queryCommandState(c) : false; } catch (e) { } if (b.dataset.c === 'todo') { const ul = closestIn(window.getSelection().anchorNode, 'ul'); on = !!(ul && ul.classList.contains('todo')); } if (b.dataset.c === 'ul') { const ul = closestIn(window.getSelection().anchorNode, 'ul'); on = !!(ul && !ul.classList.contains('todo')); } b.classList.toggle('on', on); });
}
document.addEventListener('selectionchange', () => { if (ed) fmtState(); });
function setStatus(txt, icon) { const s = $('#st'); if (!s) return; s.innerHTML = (icon ? ic('check', 14) : '') + esc(txt); s.classList.add('on'); clearTimeout(s._t); if (icon) s._t = setTimeout(() => s.classList.remove('on'), 1600); }
function markDirty() {
  if (!ed) return;
  ed.dirty = true; clearTimeout(ed.timer);
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
    n.enc = await encStr(sessionKey, JSON.stringify({ b: html })); n.body = ''; n.plain = '';
  } else { n.body = html; n.plain = plain; }
  n.modified = Date.now();
  if (!S.notes.includes(n)) S.notes.unshift(n);
  ed.dirty = false; ed.body = html;
  save(); setStatus('Saved', true);
  const m = $('#meta'); if (m) m.innerHTML = metaText(n);
}
async function flushSave() { if (ed && (ed.dirty || ed.isNew)) await persist(); }
function newNote() {
  const n = { id: uid(), title: '', body: '', plain: '', created: Date.now(), modified: Date.now(), folder: view.tab === 'notes' && view.folder !== 'all' ? view.folder : (S.settings.defaultFolder || ''), tags: [], fav: false, locked: false, enc: null, trashed: 0 };
  startEditor(n, '', true);
}
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
async function leaveEditor(skipSave) {
  if (!ed) return;
  if (!skipSave) {
    if (ed.dirty && !S.settings.autosave) {
      const r = await ask({ title: 'Save changes?', ok: 'Save', cancel: 'Discard' });
      if (r) await persist();
    } else await flushSave();
  }
  const n = ed.note; ed = null;
  if (n.locked) releaseKey();
  view.screen = 'home'; view.anim = 'fade'; render();
}
function persistedOnly() { if (ed && S.notes.includes(ed.note)) save(); }

/* ---------- note actions ---------- */
function pickFolder(n, after) {
  const items = [{ l: 'No folder', ic: 'folder', c: !n.folder, f: () => setFolder(n, '', after) }]
    .concat(S.folders.map(f => ({ l: f, ic: 'folder', c: n.folder === f, f: () => setFolder(n, f, after) })))
    .concat([{ l: 'New folder…', ic: 'plus', f: async () => { const r = await ask({ title: 'New folder', fields: [{ id: 'n', ph: 'Folder name' }], ok: 'Create' }); const nm = r && r.n.trim(); if (nm) { if (!S.folders.includes(nm)) S.folders.push(nm); setFolder(n, nm, after); } } }]);
  menu(items, 'Move to folder');
}
function setFolder(n, f, after) { n.folder = f; if (S.notes.includes(n)) save(); if (after) after(); toast(f ? 'Moved to ' + f : 'Removed from folder'); }
async function editTags(n, after) {
  const r = await ask({ title: 'Tags', text: 'Separate tags with commas.', fields: [{ id: 't', ph: 'work, ideas, urgent', value: n.tags.join(', ') }], ok: 'Save' });
  if (!r) return;
  const seen = new Set(); n.tags = r.t.split(',').map(t => t.trim().replace(/^#+/, '')).filter(t => t && !seen.has(t.toLowerCase()) && seen.add(t.toLowerCase())).slice(0, 10);
  if (S.notes.includes(n)) save(); if (after) after();
}
async function lockNote(n, bodyHtml) {
  let key = keyValid() ? sessionKey : null;
  if (!S.sec) key = await createPasscode();
  else if (!key) key = await passPrompt('Lock note', 'Enter your passcode to lock this note.');
  if (!key) return false;
  sessionKey = key;
  n.enc = await encStr(key, JSON.stringify({ b: bodyHtml })); n.body = ''; n.plain = ''; n.locked = true;
  return true;
}
async function removeLock(n) {
  const key = await getKey('Remove lock', 'Enter your passcode to unlock this note for good.');
  if (!key) return false;
  try { const b = sanitize(JSON.parse(await decStr(key, n.enc)).b || ''); n.body = b; n.plain = toPlain(b); n.enc = null; n.locked = false; return true; } catch (e) { toast('Could not unlock this note'); return false; }
}
async function trashNote(n) {
  const r = await ask({ title: 'Move this note to Trash?', text: 'You can restore it later from Trash.', ok: 'Move to Trash' });
  if (!r) return false;
  n.trashed = Date.now(); if (!S.notes.includes(n)) S.notes.unshift(n); save(); return true;
}
function editorMenu() {
  const n = ed.note;
  menu([
    { l: n.fav ? 'Remove from favorites' : 'Add to favorites', ic: 'star', f: ACT.edFav },
    { l: 'Move to folder', ic: 'folder', s: n.folder || 'None', f: () => pickFolder(n, () => { const m = $('#meta'); if (m) m.innerHTML = metaText(n); }) },
    { l: 'Tags', ic: 'tag', s: n.tags.length ? n.tags.map(t => '#' + t).join(' ') : 'None', f: () => editTags(n, () => { const m = $('#meta'); if (m) m.innerHTML = metaText(n); }) },
    n.locked ? { l: 'Remove lock', ic: 'unlock', f: async () => { await persist(); if (await removeLock(n)) { keepKey(); n.modified = Date.now(); save(); const m = $('#meta'); if (m) m.innerHTML = metaText(n); toast('Lock removed'); } } }
      : { l: 'Lock Note', ic: 'lock', f: async () => { await persist(); const html = $('#body').innerHTML; if (await lockNote(n, html)) { keepKey(); if (!S.notes.includes(n) && (n.title || toPlain(html))) S.notes.unshift(n); save(); const m = $('#meta'); if (m) m.innerHTML = metaText(n); toast('Note locked'); } } },
    { l: 'Move to Trash', ic: 'trash', d: true, f: async () => { await flushSave(); if (await trashNote(n)) { ed = null; if (n.locked) releaseKey(); view.screen = 'home'; render(); toast('Moved to Trash'); } } }
  ]);
}
function noteMenu(id) {
  const n = findNote(id); if (!n) return;
  menu([
    { l: 'Open', ic: 'notes', f: () => openNote(id) },
    { l: n.fav ? 'Remove from favorites' : 'Add to favorites', ic: 'star', f: () => { n.fav = !n.fav; save(); render(); } },
    { l: 'Move to folder', ic: 'folder', f: () => pickFolder(n, render) },
    { l: 'Tags', ic: 'tag', f: () => editTags(n, render) },
    n.locked ? { l: 'Remove lock', ic: 'unlock', f: async () => { if (await removeLock(n)) { save(); toast('Lock removed'); } releaseKey(); render(); } }
      : { l: 'Lock Note', ic: 'lock', f: async () => { if (await lockNote(n, n.body)) { save(); toast('Note locked'); } releaseKey(); render(); } },
    { l: 'Move to Trash', ic: 'trash', d: true, f: async () => { const card = document.querySelector('.note[data-v="' + id + '"]'); if (await trashNote(n)) { if (card) card.classList.add('out'); setTimeout(render, 200); toast('Moved to Trash'); } } }
  ], n.title || 'Untitled');
}

/* ---------- import / export ---------- */
async function shareText(name, text, mime) {
  const FS = plug('Filesystem'), SH = plug('Share');
  if (FS && SH) {
    try {
      const r = await FS.writeFile({ path: name, data: text, directory: 'CACHE', encoding: 'utf8' });
      await SH.share({ title: name, url: r.uri, dialogTitle: 'Save or share' });
      return;
    } catch (e) { if (e && /cancel/i.test(String(e.message || e))) return; }
  }
  try { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([text], { type: mime })); a.download = name; document.body.appendChild(a); a.click(); a.remove(); }
  catch (e) { toast('Could not export'); }
}
function pickFile(accept, multiple) {
  return new Promise(res => {
    const i = document.createElement('input'); i.type = 'file'; i.accept = accept; i.multiple = !!multiple; i.style.display = 'none';
    i.onchange = () => { res(Array.from(i.files || [])); i.remove(); };
    document.body.appendChild(i); i.click();
  });
}
const stamp = () => new Date().toISOString().slice(0, 10);
async function doBackup() { await shareText('notebook-backup-' + stamp() + '.json', JSON.stringify({ app: 'notebook', v: 1, exported: Date.now(), data: S }), 'application/json'); }
async function doRestore() {
  const fs = await pickFile('.json,application/json'); if (!fs.length) return;
  let data; try { const j = JSON.parse(await fs[0].text()); data = j && j.data && j.app === 'notebook' ? j.data : null; } catch (e) { }
  if (!data || !Array.isArray(data.notes)) { toast('That is not a Notebook backup'); return; }
  const r = await ask({ title: 'Restore backup?', text: 'This replaces all notes and settings on this device with the backup (' + data.notes.length + ' notes).', ok: 'Restore', danger: true });
  if (!r) return;
  S = normalize(data); S.settings.onboarded = true; sessionKey = null; keyExpiry = 0; save(); applyTheme(true); view.tab = 'settings'; view.screen = 'settings'; render(); toast('Backup restored');
}
async function doExportTxt() {
  const a = S.notes.filter(n => !n.trashed && !n.locked);
  if (!a.length) { toast('No unlocked notes to export'); return; }
  const txt = a.map(n => '# ' + (n.title || 'Untitled') + '\n' + [n.folder, n.tags.map(t => '#' + t).join(' '), new Date(n.modified).toLocaleString()].filter(Boolean).join(' · ') + '\n\n' + n.plain + '\n').join('\n---\n\n');
  await shareText('notebook-export-' + stamp() + '.txt', txt, 'text/plain');
}
async function doImportTxt() {
  const fs = await pickFile('.txt,.md,text/plain,text/markdown', true); if (!fs.length) return;
  let c = 0;
  for (const f of fs) {
    if (/\.json$/i.test(f.name)) { toast('Use Restore for .json backups'); continue; }
    const t = await f.text();
    const html = t.split(/\r?\n/).map(l => '<div>' + (esc(l) || '<br>') + '</div>').join('');
    const n = { id: uid(), title: f.name.replace(/\.[^.]+$/, ''), body: html, plain: t.trim(), created: Date.now(), modified: Date.now(), folder: S.settings.defaultFolder || '', tags: [], fav: false, locked: false, enc: null, trashed: 0 };
    S.notes.unshift(n); c++;
  }
  if (c) { save(); toast(c + (c > 1 ? ' notes imported' : ' note imported')); render(); }
}

/* ---------- actions ---------- */
const ACT = {
  obNext() { ob++; render(); },
  obTheme(v, el, e) { swapTheme(e, () => { S.settings.theme = v; }, modeOf(v)); },
  async obLock() { const k = await createPasscode(); if (k) { S.settings.appLock = true; releaseKey(); ACT.obDone(); } },
  obDone() { S.settings.onboarded = true; save(); render(); },
  tab(v) {
    if (view.tab === v && (view.screen === 'home' || view.screen === 'settings')) return;
    const d = TABS.indexOf(v) - TABS.indexOf(view.tab);
    buzz('light');
    view.tab = v; view.screen = v === 'settings' ? 'settings' : 'home'; view.search = false; view.q = ''; view.tag = ''; view.anim = d >= 0 ? 'r' : 'l'; render();
  },
  chip(v) { view.folder = v; if (view.screen === 'home' && view.tab === 'notes' && !view.search) refreshHome(); else render(); },
  tagChip(v) {
    const same = view.screen === 'home' && view.tab === 'notes' && !view.search;
    if (same) { view.tag = view.tag && view.tag.toLowerCase() === v.toLowerCase() ? '' : v; refreshHome(); return; }
    view.tab = 'notes'; view.screen = 'home'; view.search = false; view.q = ''; view.folder = 'all'; view.tag = v; view.anim = 'fade'; render();
    const sc = $('#app .scroll'); if (sc) sc.scrollTop = 0;
  },
  tagGo(v) { view.tab = 'notes'; view.screen = 'home'; view.search = false; view.q = ''; view.folder = 'all'; view.tag = v; view.anim = 'l'; render(); },
  folderGo(v) { view.tab = 'notes'; view.screen = 'home'; view.search = false; view.q = ''; view.tag = ''; view.folder = v; view.anim = 'fade'; render(); },
  haptics() { S.settings.haptics = !S.settings.haptics; save(); buzz('light'); render(); },
  search() { view.search = true; view.q = ''; render(); },
  closeSearch() { view.search = false; view.q = ''; render(); },
  new: newNote,
  open(v) { if (suppress) return; openNote(v); },
  async edBack() { await leaveEditor(); },
  async saveNow() { await persist(); },
  edFav() { const n = ed.note; n.fav = !n.fav; persistedOnly(); const b = $('#favb'); if (b) { b.innerHTML = ic(n.fav ? 'starf' : 'star'); b.classList.toggle('ac', n.fav); } },
  edMore: () => editorMenu(),
  theme(v, el, e) { swapTheme(e, () => { S.settings.theme = v; }, modeOf(v)); },
  palette(v, el, e) { swapTheme(e, () => { S.settings.palette = v; }, curMode()); },
  defFolder() { menu([{ l: 'None', c: !S.settings.defaultFolder, f: () => { S.settings.defaultFolder = ''; save(); render(); } }].concat(S.folders.map(f => ({ l: f, c: S.settings.defaultFolder === f, f: () => { S.settings.defaultFolder = f; save(); render(); } }))), 'Default folder'); },
  sort() { menu(Object.keys(SORTN).map(k => ({ l: SORTN[k], c: S.settings.sort === k, f: () => { S.settings.sort = k; save(); render(); } })), 'Sort notes by'); },
  autosave() { S.settings.autosave = !S.settings.autosave; save(); render(); },
  preview() { menu([0, 1, 2, 3].map(k => ({ l: k ? k + (k > 1 ? ' lines' : ' line') : 'Off', c: S.settings.preview === k, f: () => { S.settings.preview = k; save(); render(); } })), 'Preview length'); },
  async appLockToggle() {
    if (S.settings.appLock) { const k = await passPrompt('Turn off App Lock', 'Enter your passcode to confirm.'); if (k) { S.settings.appLock = false; save(); render(); } return; }
    if (!S.sec) { const k = await createPasscode(); if (!k) return; releaseKey(); }
    S.settings.appLock = true; save(); render(); toast('App Lock is on');
  },
  changePass() { changePasscode(); },
  autolock() { menu(Object.keys(ALN).map(k => ({ l: ALN[k], c: String(S.settings.autolock) === k, f: () => { S.settings.autolock = +k; save(); render(); } })), 'Lock notes again'); },
  folders() { view.screen = 'folders'; view.anim = 'r'; render(); },
  tags() { view.screen = 'tags'; view.anim = 'r'; render(); },
  trash() { view.screen = 'trash'; view.anim = 'r'; render(); },
  favs() { ACT.tab('fav'); },
  subBack() { view.screen = 'settings'; view.tab = 'settings'; view.anim = 'l'; render(); },
  async addFolder() { const r = await ask({ title: 'New folder', fields: [{ id: 'n', ph: 'Folder name' }], ok: 'Create' }); const nm = r && r.n.trim(); if (nm && !S.folders.includes(nm)) { S.folders.push(nm); save(); render(); } },
  async renFolder(f) { const r = await ask({ title: 'Rename folder', fields: [{ id: 'n', value: f }], ok: 'Rename' }); const nm = r && r.n.trim(); if (nm && nm !== f && !S.folders.includes(nm)) { S.folders[S.folders.indexOf(f)] = nm; S.notes.forEach(n => { if (n.folder === f) n.folder = nm; }); if (S.settings.defaultFolder === f) S.settings.defaultFolder = nm; save(); render(); } },
  async delFolder(f) { const r = await ask({ title: 'Delete folder “' + f + '”?', text: 'Notes inside are kept and become unfiled.', ok: 'Delete', danger: true }); if (r) { S.folders = S.folders.filter(x => x !== f); S.notes.forEach(n => { if (n.folder === f) n.folder = ''; }); if (S.settings.defaultFolder === f) S.settings.defaultFolder = ''; if (view.folder === f) view.folder = 'all'; save(); render(); } },
  async renTag(t) { const r = await ask({ title: 'Rename tag', fields: [{ id: 'n', value: t }], ok: 'Rename' }); const nm = r && r.n.trim().replace(/^#+/, ''); if (nm && nm !== t) { S.notes.forEach(n => { n.tags = Array.from(new Set(n.tags.map(x => x === t ? nm : x))); }); save(); render(); } },
  async delTag(t) { const r = await ask({ title: 'Delete tag #' + t + '?', text: 'It is removed from every note.', ok: 'Delete', danger: true }); if (r) { S.notes.forEach(n => { n.tags = n.tags.filter(x => x !== t); }); save(); render(); } },
  restoreNote(v) { const n = findNote(v); if (n) { n.trashed = 0; save(); render(); toast('Restored'); } },
  async purge(v) { const r = await ask({ title: 'Delete permanently?', text: 'This cannot be undone.', ok: 'Delete', danger: true }); if (r) { S.notes = S.notes.filter(n => n.id !== v); save(); render(); } },
  async emptyTrash() { const r = await ask({ title: 'Empty Trash?', text: 'All notes in Trash will be deleted permanently.', ok: 'Empty Trash', danger: true }); if (r) { S.notes = S.notes.filter(n => !n.trashed); save(); render(); } },
  backup: doBackup, restore: doRestore, exportTxt: doExportTxt, importTxt: doImportTxt,
  about() { ask({ title: 'Notebook 1.0.0', text: 'Simple. Fast. Private. Focused.\n\nDeveloped by Dagim Bireda', ok: 'Close', cancel: false }); },
  privacy() { ask({ title: 'Privacy', text: 'Your notes never leave this device unless you export them. There are no accounts, no ads and no tracking.\n\nLocked notes are encrypted with AES-256 using a key derived from your passcode. Titles stay visible; the content does not. If you forget the passcode, locked notes cannot be recovered.', ok: 'Close', cancel: false }); },
  terms() { ask({ title: 'Terms', text: 'Notebook is provided as is, without warranty. Keep your own backups (Settings → Storage → Backup) of anything important.', ok: 'Close', cancel: false }); },
  dev() { devSheet(); },
  async unlockApp() {
    const lp = $('#lp'), er = $('#lerr'); if (!lp) return;
    if (Date.now() < lockoutUntil) { er.textContent = 'Too many attempts. Wait a moment.'; return; }
    const k = await checkPasscode(lp.value);
    if (k) { fails = 0; appLocked = false; render(); }
    else { fails++; if (fails >= 5) { lockoutUntil = Date.now() + 30000; fails = 0; } er.textContent = 'Wrong passcode.'; er.classList.remove('shake'); void er.offsetWidth; er.classList.add('shake'); lp.value = ''; }
  }
};
const BUZZ = new Set(['chip', 'tagChip', 'folderGo', 'tagGo', 'new', 'autosave', 'appLockToggle', 'edFav', 'search', 'closeSearch']);
document.addEventListener('click', e => {
  const el = e.target.closest('[data-act]');
  if (!el || !el.closest('#app,#navwrap')) return;
  const a = el.dataset.act;
  if (BUZZ.has(a)) buzz('light');
  const f = ACT[a]; if (f) f(el.dataset.v, el, e);
});

function devSheet() {
  const ov = $('#overlay');
  ov.innerHTML = `<div class="scrim"></div><div class="sheet dev"><div class="av">DB</div><div class="dn">Dagim Bireda</div><div class="ds">Developer</div><a class="mi" href="mailto:dagim22bireda@gmail.com">${ic('mail', 20)}<span class="ml">dagim22bireda@gmail.com<small>Email</small></span></a><a class="mi" href="tel:0929040636">${ic('call', 20)}<span class="ml">0929040636<small>Phone</small></span></a><div class="ds" style="margin:14px 0 2px">Notebook 1.0.0</div></div>`;
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
    if (!s.ok || view.search) return;
    const i = TABS.indexOf(view.tab) + (dx < 0 ? 1 : -1);
    if (i >= 0 && i < TABS.length) ACT.tab(TABS[i]);
  } else if (s.edge && dx > 0) handleBack();
}, { passive: true });

/* long-press on a note card opens its menu */
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
async function engageAppLock() {
  if (ed) { await flushSave(); const n = ed.note; ed = null; if (n.locked) sessionKey = null; view.screen = 'home'; }
  sessionKey = null; keyExpiry = 0; closeOverlay(); appLocked = true; render();
}
document.addEventListener('visibilitychange', async () => {
  if (document.hidden) {
    hiddenAt = Date.now();
    if (ed) { clearTimeout(ed.timer); await flushSave().catch(() => { }); }
    if (+S.settings.autolock === -1) {
      sessionKey = null; keyExpiry = 0;
      if (ed && ed.note.locked) { ed = null; view.screen = 'home'; closeOverlay(); render(); }
    }
  } else if (S.settings.onboarded && S.settings.appLock && S.sec && !appLocked && Date.now() - hiddenAt > 10000) engageAppLock();
});
async function handleBack() {
  if (closer) { closer(); return; }
  if (!S.settings.onboarded) { if (ob > 0) { ob--; render(); } return; }
  if (appLocked) { exitApp(); return; }
  if (view.screen === 'editor') { await leaveEditor(); return; }
  if (['folders', 'tags', 'trash'].includes(view.screen)) { ACT.subBack(); return; }
  if (view.search) { ACT.closeSearch(); return; }
  if (view.tag) { view.tag = ''; render(); return; }
  if (view.tab !== 'notes') { ACT.tab('notes'); return; }
  if (view.folder !== 'all') { view.folder = 'all'; render(); return; }
  exitApp();
}
function exitApp() { const A = plug('App'); if (A && A.exitApp) A.exitApp(); }

/* ---------- boot ---------- */
S = load();
applyTheme(false);
appLocked = !!(S.settings.onboarded && S.settings.appLock && S.sec);
const AppP = plug('App');
if (AppP && AppP.addListener) { try { AppP.addListener('backButton', () => { handleBack(); }); } catch (e) { } }
window.addEventListener('beforeunload', () => { if (ed && ed.dirty) { try { persist(); } catch (e) { } } });
render();
})();
