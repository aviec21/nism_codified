const { put, head } = require('@vercel/blob');
const crypto = require('crypto');

function keyFor(code) {
  const c = String(code || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (!/^[A-Z2-9]{12}$/.test(c)) return null;
  return 'progress/' + crypto.createHash('sha256').update('nismxv:' + c).digest('hex') + '.json';
}

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  const key = keyFor(req.query.code);
  if (!key) return res.status(400).json({ error: 'bad code' });
  try {
    if (req.method === 'GET') {
      let meta;
      try { meta = await head(key); } catch (e) { return res.status(404).json({ error: 'not found' }); }
      const r = await fetch(meta.url + '?t=' + Date.now(), { cache: 'no-store' });
      if (!r.ok) return res.status(404).json({ error: 'not found' });
      return res.status(200).json(await r.json());
    }
    if (req.method === 'PUT') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      if (!body || typeof body.data !== 'object') return res.status(400).json({ error: 'bad body' });
      const text = JSON.stringify({ data: body.data, t: body.t || Date.now() });
      if (text.length > 400000) return res.status(413).json({ error: 'too large' });
      await put(key, text, { access: 'public', addRandomSuffix: false, allowOverwrite: true, contentType: 'application/json', cacheControlMaxAge: 60 });
      return res.status(200).json({ ok: true });
    }
    res.setHeader('Allow', 'GET, PUT');
    return res.status(405).json({ error: 'method' });
  } catch (e) {
    return res.status(500).json({ error: 'server' });
  }
};
