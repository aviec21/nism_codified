/* Progress merge and cross-device sync (sync code, no login) */
(function () {
  var KEY = 'nismxv-sync', AL = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  NX.merge = function (a, b) {
    a = a || {}; b = b || {};
    var o = { ans: {}, fc: {}, read: {}, mocks: [], streak: { d: '', n: 0 }, dr: {} };
    [a.ans || {}, b.ans || {}].forEach(function (src) { Object.keys(src).forEach(function (k) { var x = src[k], y = o.ans[k]; if (!y || (x.c + x.w) > (y.c + y.w)) o.ans[k] = x; }); });
    [a.fc || {}, b.fc || {}].forEach(function (src) { Object.keys(src).forEach(function (k) { var x = src[k], y = o.fc[k]; if (!y || (x.t || 0) > (y.t || 0) || ((x.t || 0) === (y.t || 0) && x.b > y.b)) o.fc[k] = x; }); });
    [a.dr || {}, b.dr || {}].forEach(function (src) { Object.keys(src).forEach(function (k) { var x = src[k], y = o.dr[k]; if (!y || x.n > y.n) o.dr[k] = x; }); });
    [a.read || {}, b.read || {}].forEach(function (src) { Object.keys(src).forEach(function (k) { if (src[k]) o.read[k] = 1; }); });
    var seen = {}; (a.mocks || []).concat(b.mocks || []).forEach(function (m) { if (!seen[m.t]) { seen[m.t] = 1; o.mocks.push(m); } }); o.mocks.sort(function (x, y) { return x.t - y.t; });
    var sa = a.streak || { d: '', n: 0 }, sb = b.streak || { d: '', n: 0 }; o.streak = sa.d > sb.d || (sa.d === sb.d && sa.n >= sb.n) ? sa : sb;
    return o;
  };
  function norm(c) { return String(c || '').toUpperCase().replace(/[^A-Z0-9]/g, '').replace(/[01OI]/g, ''); }
  function pretty(c) { return c.replace(/(.{4})/g, '$1-').replace(/-$/, ''); }
  function get() { try { return localStorage.getItem(KEY) || ''; } catch (e) { return ''; } }
  function set(c) { try { if (c) localStorage.setItem(KEY, c); else localStorage.removeItem(KEY); } catch (e) { } }
  var st = { msg: 'Not synced yet', busy: false, t: null };
  function api(method, code, body) {
    return fetch('/api/progress?code=' + encodeURIComponent(code), { method: method, headers: { 'Content-Type': 'application/json' }, body: body ? JSON.stringify(body) : undefined, cache: 'no-store' }).then(function (r) {
      if (r.status === 404) return null;
      if (!r.ok) throw new Error('Server said ' + r.status);
      return r.json();
    });
  }
  function now(manual) {
    var code = get(); if (!code) return Promise.resolve();
    if (st.busy) return Promise.resolve(); st.busy = true;
    return api('GET', code).then(function (remote) {
      if (remote && remote.data) { NX.S = NX.merge(NX.S, remote.data); try { localStorage.setItem('nismxv1', JSON.stringify(NX.S)); } catch (e) { } }
      return api('PUT', code, { data: NX.S, t: Date.now() });
    }).then(function () { st.msg = 'Last synced ' + new Date().toLocaleTimeString('en-IN'); if (manual) NX.toast('Synced'); }).catch(function (e) { st.msg = 'Sync failed (' + e.message + '). Progress is safe on this device.'; if (manual) NX.toast('Sync failed'); }).then(function () { st.busy = false; });
  }
  NX.sync = {
    code: function () { var c = get(); return c ? pretty(c) : ''; },
    status: function () { return st.msg; },
    now: now,
    off: function () { set(''); st.msg = 'Not synced yet'; },
    create: function () {
      var a = new Uint8Array(12); crypto.getRandomValues(a); var c = ''; for (var i = 0; i < 12; i++) c += AL[a[i] % 32];
      set(c); return now(true).then(function () { if (/failed/.test(st.msg)) { set(''); throw new Error('server unreachable'); } });
    },
    join: function (raw) {
      var c = norm(raw); if (c.length !== 12) return Promise.reject(new Error('That code should have 12 letters and numbers.'));
      return api('GET', c).then(function (r) { if (!r) throw new Error('No progress found for that code. Check for typos or create a new code on your first device.'); set(c); return now(true); });
    }
  };
  var orig = NX.save, timer;
  NX.save = function () { orig(); if (get()) { clearTimeout(timer); timer = setTimeout(now, 4000); } };
  window.addEventListener('visibilitychange', function () { if (document.visibilityState === 'visible') now(); });
  if (get()) now();
})();
