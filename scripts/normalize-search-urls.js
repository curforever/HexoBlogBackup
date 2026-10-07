'use strict';
// Custom permalinks can acquire a doubled leading slash in the search generator.
// Normalize only entries whose corresponding generated page exists on this site.
hexo.extend.filter.register('after_generate', async function () {
  const stream = hexo.route.get('search.xml');
  if (!stream) return;
  const chunks = [];
  for await (const chunk of stream) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  const original = Buffer.concat(chunks).toString('utf8');
  const routes = new Set(hexo.route.list());
  const normalized = original.replace(/<url>(\/\/[^<]+)<\/url>/g, (full, url) => {
    const relative = url.replace(/^\/+/, '/');
    const page = relative.slice(1) + (relative.endsWith('/') ? 'index.html' : '');
    return routes.has(page) ? '<url>' + relative + '</url>' : full;
  });
  if (normalized !== original) hexo.route.set('search.xml', normalized);
});
