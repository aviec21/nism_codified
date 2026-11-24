/* Core helpers and state */
var NX = window.NX = { chapters: [], cases: [], drills: [], labs: [] };
NX.MARKS = {1:1,2:2,3:2,4:5,5:5,6:8,7:6,8:12,9:5,10:12,11:5,12:7,13:5,14:10,15:15};
NX.addCh = function (c) { NX.chapters[c.id - 1] = c; };
NX.$ = function (s, r) { return (r || document).querySelector(s); };
NX.$$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
NX.esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]; }); };
NX.fmt = function (x, d) { if (!isFinite(x)) return 'n/a'; d = d == null ? 2 : d; return x.toLocaleString('en-IN', { minimumFractionDigits: d, maximumFractionDigits: d }); };
NX.pct = function (x, d) { return isFinite(x) ? (x * 100).toFixed(d == null ? 1 : d) + '%' : 'n/a'; };
NX.toast = function (m) { var t = NX.$('#toast'); t.textContent = m; t.classList.add('on'); clearTimeout(NX._tt); NX._tt = setTimeout(function () { t.classList.remove('on'); }, 1800); };
NX.shuffle = function (a, rnd) { a = a.slice(); rnd = rnd || Math.random; for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(rnd() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; };
NX.rng = function (seed) { var s = seed >>> 0 || 1; return function () { s = (s + 0x6D2B79F5) >>> 0; var t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; };
NX.ri = function (a, b, step) { step = step || 1; return a + step * Math.floor(Math.random() * ((b - a) / step + 1)); };

/* Persistent state (per viewer, best effort) */
NX.S = { ans: {}, fc: {}, read: {}, mocks: [], streak: { d: '', n: 0 } };
(function () { try { var r = localStorage.getItem('nismxv1'); if (r) { var o = JSON.parse(r); for (var k in o) NX.S[k] = o[k]; } } catch (e) { } })();
NX.save = function () { try { localStorage.setItem('nismxv1', JSON.stringify(NX.S)); } catch (e) { } };
NX.touchStreak = function () {
  var d = new Date().toISOString().slice(0, 10), s = NX.S.streak;
  if (s.d === d) return;
  var y = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
  s.n = s.d === y ? s.n + 1 : 1; s.d = d; NX.save();
};
NX.record = function (id, ok) {
  var a = NX.S.ans[id] || { c: 0, w: 0, last: null };
  if (ok) a.c++; else a.w++; a.last = ok ? 1 : 0; NX.S.ans[id] = a; NX.touchStreak(); NX.save();
};

/* Question helpers: ids are ch{n}-{i} for bank, case{n}-{j} for cases */
NX.bank = function () {
  var out = [];
  NX.chapters.forEach(function (c) { if (c) c.q.forEach(function (q, i) { out.push(Object.assign({ id: 'ch' + c.id + '-' + i, ch: c.id }, q)); }); });
  return out;
};
NX.chStats = function (id) {
  var c = NX.chapters[id - 1], t = 0, ok = 0, seen = 0;
  c.q.forEach(function (q, i) { var a = NX.S.ans[('ch' + id + '-' + i)]; t++; if (a) { seen++; if (a.last) ok++; } });
  var secs = c.sections.length, rd = c.sections.filter(function (s, i) { return NX.S.read['s' + id + '-' + i]; }).length;
  return { total: t, seen: seen, ok: ok, acc: seen ? ok / seen : null, cover: t ? seen / t : 0, secs: secs, read: rd };
};
NX.readiness = function () {
  var tot = 0, w = 0;
  for (var i = 1; i <= 15; i++) { var s = NX.chStats(i), m = NX.MARKS[i]; tot += m; w += m * (s.acc == null ? 0 : s.acc * Math.min(1, 0.4 + s.cover)); }
  return w / tot;
};

/* Question runner: renders one MCQ with shuffled options, calls cb(correct) */
NX.askMCQ = function (el, q, opts) {
  opts = opts || {};
  var order = opts.noShuffle ? q.o.map(function (_, i) { return i; }) : NX.shuffle(q.o.map(function (_, i) { return i; }));
  var done = false, picked = opts.picked != null ? order.indexOf(opts.picked) : -1;
  function draw() {
    var h = '<div class="qtext">' + q.q + '</div>';
    order.forEach(function (oi, k) {
      var cls = 'opt';
      if (done) { if (oi === q.a) cls += ' ok'; else if (k === picked) cls += ' no'; }
      else if (k === picked) cls += ' sel';
      h += '<button class="' + cls + '" data-k="' + k + '"' + (done ? ' disabled' : '') + '>' + String.fromCharCode(97 + k) + '. ' + q.o[oi] + '</button>';
    });
    if (done && opts.explain !== false) h += '<div class="expl"><b>' + (order[picked] === q.a ? 'Correct.' : 'Not quite.') + '</b> ' + (q.e || '') + '</div>';
    el.innerHTML = h;
    NX.$$('.opt', el).forEach(function (b) {
      b.onclick = function () {
        if (done) return; picked = +b.dataset.k;
        if (opts.deferred) { draw(); opts.onPick && opts.onPick(order[picked]); return; }
        done = true; draw(); opts.onAnswer && opts.onAnswer(order[picked] === q.a, order[picked]);
      };
    });
  }
  draw();
  return { reveal: function () { done = true; draw(); } };
};

/* SVG helpers */
NX.svg = {
  line: function (o) {
    // o: {w,h,series:[{y:[],c,dash}], xs:[], ytitle, pad}
    var W = o.w || 640, H = o.h || 260, p = o.pad || { l: 54, r: 12, t: 12, b: 26 };
    var all = []; o.series.forEach(function (s) { s.y.forEach(function (v) { if (isFinite(v)) all.push(v); }); });
    var mn = o.min != null ? o.min : Math.min.apply(null, all), mx = o.max != null ? o.max : Math.max.apply(null, all);
    if (mn === mx) { mn -= 1; mx += 1; }
    var n = o.xs ? o.xs.length : o.series[0].y.length;
    function X(i) { return p.l + (W - p.l - p.r) * (n === 1 ? 0 : i / (n - 1)); }
    function Y(v) { return p.t + (H - p.t - p.b) * (1 - (v - mn) / (mx - mn)); }
    var s = '<svg class="chart" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + NX.esc(o.label || 'chart') + '">';
    for (var g = 0; g <= 4; g++) { var v = mn + (mx - mn) * g / 4, y = Y(v); s += '<line x1="' + p.l + '" x2="' + (W - p.r) + '" y1="' + y + '" y2="' + y + '" stroke="var(--line)" stroke-width="1"/><text x="' + (p.l - 6) + '" y="' + (y + 4) + '" text-anchor="end">' + (o.yfmt ? o.yfmt(v) : v.toFixed(1)) + '</text>'; }
    if (o.xs) { var step = Math.max(1, Math.ceil(n / 8)); for (var i = 0; i < n; i += step) s += '<text x="' + X(i) + '" y="' + (H - 8) + '" text-anchor="middle">' + (o.xfmt ? o.xfmt(o.xs[i]) : o.xs[i]) + '</text>'; }
    (o.hlines || []).forEach(function (hl) { if (hl.y >= mn && hl.y <= mx) s += '<line x1="' + p.l + '" x2="' + (W - p.r) + '" y1="' + Y(hl.y) + '" y2="' + Y(hl.y) + '" stroke="' + hl.c + '" stroke-dasharray="4 3"/><text x="' + (W - p.r - 2) + '" y="' + (Y(hl.y) - 3) + '" text-anchor="end">' + hl.t + '</text>'; });
    o.series.forEach(function (se) {
      var d = ''; se.y.forEach(function (v, i) { if (isFinite(v)) d += (d && isFinite(se.y[i - 1]) ? 'L' : 'M') + X(i).toFixed(1) + ' ' + Y(v).toFixed(1); });
      s += '<path d="' + d + '" fill="none" stroke="' + se.c + '" stroke-width="' + (se.w || 1.8) + '"' + (se.dash ? ' stroke-dasharray="' + se.dash + '"' : '') + '/>';
    });
    if (o.marker != null) { var mi = o.marker; s += '<line x1="' + X(mi) + '" x2="' + X(mi) + '" y1="' + p.t + '" y2="' + (H - p.b) + '" stroke="var(--accent)" stroke-dasharray="3 3"/>'; }
    return s + '</svg>';
  },
  bars: function (o) {
    var W = o.w || 640, H = o.h || 240, p = { l: 54, r: 12, t: 12, b: 34 };
    var mx = Math.max.apply(null, o.v.concat([0.0001])), mn = Math.min.apply(null, o.v.concat([0]));
    var n = o.v.length, bw = (W - p.l - p.r) / n;
    function Y(v) { return p.t + (H - p.t - p.b) * (1 - (v - mn) / (mx - mn)); }
    var s = '<svg class="chart" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + NX.esc(o.label || 'bar chart') + '">';
    for (var g = 0; g <= 4; g++) { var v = mn + (mx - mn) * g / 4; s += '<line x1="' + p.l + '" x2="' + (W - p.r) + '" y1="' + Y(v) + '" y2="' + Y(v) + '" stroke="var(--line)"/><text x="' + (p.l - 6) + '" y="' + (Y(v) + 4) + '" text-anchor="end">' + (o.yfmt ? o.yfmt(v) : v.toFixed(0)) + '</text>'; }
    o.v.forEach(function (v, i) { var x = p.l + i * bw + bw * 0.15, y0 = Y(0), y1 = Y(v); s += '<rect x="' + x + '" y="' + Math.min(y0, y1) + '" width="' + bw * 0.7 + '" height="' + Math.abs(y0 - y1) + '" fill="' + ((o.colors && o.colors[i]) || 'var(--accent)') + '" rx="3"/><text x="' + (x + bw * 0.35) + '" y="' + (H - 16) + '" text-anchor="middle">' + o.x[i] + '</text><text x="' + (x + bw * 0.35) + '" y="' + (Math.min(y0, y1) - 4) + '" text-anchor="middle">' + (o.vfmt ? o.vfmt(v) : v.toFixed(1)) + '</text>'; });
    return s + '</svg>';
  }
};

/* Finance math shared by labs and drills */
NX.fin = {
  bondPrice: function (fv, cpn, y, n, freq) { freq = freq || 1; var c = fv * cpn / freq, r = y / freq, N = n * freq, p = 0; for (var t = 1; t <= N; t++) p += c / Math.pow(1 + r, t); return p + fv / Math.pow(1 + r, N); },
  macaulay: function (fv, cpn, y, n, freq) { freq = freq || 1; var c = fv * cpn / freq, r = y / freq, N = n * freq, p = 0, w = 0; for (var t = 1; t <= N; t++) { var pv = c / Math.pow(1 + r, t); p += pv; w += t * pv; } var pv2 = fv / Math.pow(1 + r, N); p += pv2; w += N * pv2; return w / p / freq; },
  irr: function (cfs, guess) { var lo = -0.99, hi = 10; function f(r) { return cfs.reduce(function (a, c, i) { return a + c / Math.pow(1 + r, i); }, 0); } for (var k = 0; k < 200; k++) { var m = (lo + hi) / 2; if (f(lo) * f(m) <= 0) hi = m; else lo = m; } return (lo + hi) / 2; },
  xirr: function (cfs, dates) { var t0 = dates[0]; function f(r) { return cfs.reduce(function (a, c, i) { return a + c / Math.pow(1 + r, (dates[i] - t0) / 31536e6); }, 0); } var lo = -0.99, hi = 10; for (var k = 0; k < 300; k++) { var m = (lo + hi) / 2; if (f(lo) * f(m) <= 0) hi = m; else lo = m; } return (lo + hi) / 2; },
  stdev: function (a) { var m = a.reduce(function (x, y) { return x + y; }, 0) / a.length; return Math.sqrt(a.reduce(function (x, y) { return x + (y - m) * (y - m); }, 0) / (a.length - 1)); },
  mean: function (a) { return a.reduce(function (x, y) { return x + y; }, 0) / a.length; },
  sma: function (a, n) { return a.map(function (_, i) { if (i < n - 1) return NaN; var s = 0; for (var k = i - n + 1; k <= i; k++) s += a[k]; return s / n; }); },
  ema: function (a, n) { var k = 2 / (n + 1), out = [], e = null; a.forEach(function (v, i) { e = e == null ? v : v * k + e * (1 - k); out.push(i < n - 1 ? NaN : e); }); return out; },
  rsi: function (a, n) { n = n || 14; var out = a.map(function () { return NaN; }), g = 0, l = 0; for (var i = 1; i < a.length; i++) { var d = a[i] - a[i - 1], up = Math.max(d, 0), dn = Math.max(-d, 0); if (i <= n) { g += up; l += dn; if (i === n) { g /= n; l /= n; out[i] = l === 0 ? 100 : 100 - 100 / (1 + g / l); } } else { g = (g * (n - 1) + up) / n; l = (l * (n - 1) + dn) / n; out[i] = l === 0 ? 100 : 100 - 100 / (1 + g / l); } } return out; }
};
