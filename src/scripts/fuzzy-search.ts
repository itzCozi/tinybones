// @ts-nocheck
import Fuse from 'fuse.js';

function debounce(fn, wait = 150) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}

function esc(str = '') {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  return String(str).replace(/[&<>"']/g, (ch) => map[ch] || ch);
}

function renderHighlightsWithRanges(text = '', ranges = []) {
  if (!text) return '';
  if (!ranges.length) return esc(text);
  const parts = [];
  let lastIndex = 0;
  const merged = [...ranges].sort((a, b) => a[0] - b[0]);
  for (const [start, end] of merged) {
    const s = Math.max(0, start);
    const e = Math.min(text.length - 1, end);
    if (s > lastIndex) parts.push(esc(text.slice(lastIndex, s)));
    parts.push(`<mark class="bg-yellow-200 dark:bg-yellow-600 px-0.5 rounded-xs">${esc(text.slice(s, e + 1))}</mark>`);
    lastIndex = e + 1;
  }
  if (lastIndex < text.length) parts.push(esc(text.slice(lastIndex)));
  return parts.join('');
}

function excerptAround(text = '', ranges = [], radius = 80) {
  if (!text) return { snippet: '', offset: 0, prefix: '', suffix: '' };
  if (!ranges.length) {
    const s = 0;
    const e = Math.min(text.length, 160);
    return { snippet: text.slice(s, e), offset: s, prefix: '', suffix: text.length > e ? '…' : '' };
  }
  const [start, end] = ranges[0];
  const s = Math.max(0, start - radius);
  const e = Math.min(text.length, end + radius + 1);
  const prefix = s > 0 ? '…' : '';
  const suffix = e < text.length ? '…' : '';
  return { snippet: text.slice(s, e), offset: s, prefix, suffix };
}

async function initFuzzySearch() {
  const resultsEl = document.getElementById('results');
  const input = document.getElementById('q');
  if (!resultsEl || !input) return;

  let indexData = [];
  try {
    const res = await fetch('/search-index.json', { headers: { 'cache-control': 'no-cache' } });
    indexData = await res.json();
  } catch (e) {
    resultsEl.innerHTML = '<div class="text-sm text-red-600">Failed to load search index.</div>';
    return;
  }

  const fuse = new Fuse(indexData, {
    includeMatches: true,
    threshold: 0.35,
    ignoreLocation: true,
    minMatchCharLength: 2,
    keys: [
      { name: 'title', weight: 0.4 },
      { name: 'description', weight: 0.2 },
      { name: 'content', weight: 0.25 },
      { name: 'tags', weight: 0.1 },
      { name: 'author', weight: 0.05 },
    ],
  });

  function renderHighlightsByQuery(text = '', query = '') {
    if (!text || !query) return esc(text || '');
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(escaped, 'gi');
    return esc(text).replace(re, (m) => `<mark class="bg-yellow-200 dark:bg-yellow-600 px-0.5 rounded-xs">${esc(m)}</mark>`);
  }

  const doSearch = debounce((q) => {
    const query = (q || '').trim();
    if (!query) {
      resultsEl.innerHTML = '';
      return;
    }
    if (query.length < 2) {
      resultsEl.innerHTML = '<div class="text-sm text-neutral-600 dark:text-neutral-300">Type at least 2 characters.</div>';
      return;
    }

    const results = fuse.search(query);
    if (!results.length) {
      resultsEl.innerHTML = `<div class="text-sm text-neutral-600 dark:text-neutral-300">No results for "${esc(query)}"</div>`;
      return;
    }

    const html = results.map(({ item, matches }) => {
      const titleRanges = (matches || [])
        .filter((m) => m.key === 'title')
        .flatMap((m) => m.indices || []);
      const titleHtml = renderHighlightsWithRanges(item.title || '', titleRanges);
      
      const contentRangesAbs = (matches || [])
        .filter((m) => m.key === 'content')
        .flatMap((m) => m.indices || []);
      const descRangesAbs = (matches || [])
        .filter((m) => m.key === 'description')
        .flatMap((m) => m.indices || []);
      const authorRanges = (matches || [])
        .filter((m) => m.key === 'author')
        .flatMap((m) => m.indices || []);
      const tagMatches = (matches || [])
        .filter((m) => m.key === 'tags');

      let snippetHtml = '';
      if (contentRangesAbs.length > 0) {
        const ex = excerptAround(item.content || '', contentRangesAbs, 80);
        const adjRanges = contentRangesAbs
          .map(([s, e]) => [s - ex.offset, e - ex.offset])
          .filter(([s, e]) => e >= 0 && s < (ex.snippet?.length || 0));
        snippetHtml = (ex.prefix || '') +
          renderHighlightsWithRanges(ex.snippet || '', adjRanges) +
          (ex.suffix || '');
      } else if (descRangesAbs.length > 0) {
        const ex = excerptAround(item.description || '', descRangesAbs, 80);
        const adjRanges = descRangesAbs
          .map(([s, e]) => [s - ex.offset, e - ex.offset])
          .filter(([s, e]) => e >= 0 && s < (ex.snippet?.length || 0));
        snippetHtml = (ex.prefix || '') +
          renderHighlightsWithRanges(ex.snippet || '', adjRanges) +
          (ex.suffix || '');
      } else if (titleRanges.length > 0) {
        snippetHtml = `Match in title: ${renderHighlightsWithRanges(item.title || '', titleRanges)}`;
      } else if (tagMatches.length > 0 && (item.tags && item.tags.length)) {
        const joined = Array.isArray(item.tags) ? item.tags.join(', ') : String(item.tags || '');
        snippetHtml = `Match in tags: ${renderHighlightsByQuery(joined, query)}`;
      } else if (authorRanges.length > 0 || (item.author && (item.author + '').length)) {
        snippetHtml = `Match in author: ${renderHighlightsByQuery(String(item.author || ''), query)}`;
      } else {
        const text = item.description || item.content || '';
        const short = text.slice(0, 160) + (text.length > 160 ? '…' : '');
        snippetHtml = renderHighlightsByQuery(short, query);
      }
      const dateStr = item.pubDate ? new Date(item.pubDate).toLocaleDateString?.() || '' : '';

      const href = `${item.url}?search=${encodeURIComponent(query)}`;

      return `
        <a class="block rounded-md border border-neutral-300 p-3 hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-900" href="${href}">
          <div class="font-medium text-neutral-900 dark:text-white">${titleHtml}</div>
          <div class="text-xs text-neutral-500 dark:text-neutral-400">${esc(dateStr)}</div>
          <div class="mt-1 text-sm text-neutral-700 dark:text-neutral-300">${snippetHtml}</div>
        </a>
      `;
    }).join('');

    resultsEl.innerHTML = html;
  }, 200);

  const params = new URLSearchParams(window.location.search);
  const initial = (params.get('q') || '').trim();
  if ('value' in input) input.value = initial;
  doSearch(initial);

  input.addEventListener('input', (e) => doSearch(e.target.value));
  const form = input.closest('form');
  if (form) form.addEventListener('submit', (ev) => { ev.preventDefault(); doSearch(input.value); });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initFuzzySearch);
} else {
  initFuzzySearch();
}
