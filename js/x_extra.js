/* Extra views: mistakes and weak-area drills, formula sheet, visual explainers, mock analytics helpers */
(function () {
var $ = NX.$, $$ = NX.$$, esc = NX.esc;
function bar(p, cls) { return '<div class="bar ' + (cls || '') + '"><i style="width:' + Math.round(Math.max(0, Math.min(1, p)) * 100) + '%"></i></div>'; }
function strip(s) { return String(s).replace(/<[^>]+>/g, ''); }
var X = NX.extraViews = {};
NX.extraRoutes = [['mistakes', 'Mistakes'], ['formulas', 'Formulas'], ['visuals', 'Visuals']];

/* Trend chart of mock scores with the pass line */
NX.mockTrend = function () {
  var m = NX.S.mocks.slice(-12); if (m.length < 2) return '';
  return '<h2>Score trend</h2>' + NX.svg.line({ w: 700, h: 220, series: [{ y: m.map(function (x) { return x.s; }), c: 'var(--accent)', w: 2.5 }], xs: m.map(function (_, i) { return i + 1; }), min: Math.min(0, Math.min.apply(null, m.map(function (x) { return x.s; }))), max: 100, hlines: [{ y: 60, c: 'var(--good)', label: 'pass 60' }], label: 'Mock score trend' }) + '<div class="leg"><span>Attempts, oldest to newest. Green line is the pass mark of 60.</span></div>';
};

/* ---- generic quiz runner ---- */
function runSet(box, Q, title, back) {
  var i = 0, ok = 0, miss = [];
  function step() {
    if (i >= Q.length) {
      box.innerHTML = '<div class="card"><h2>' + esc(title) + ': ' + ok + ' of ' + Q.length + ' correct (' + Math.round(100 * ok / Q.length) + '%)</h2>' + bar(ok / Q.length, ok / Q.length >= .75 ? 'g' : ok / Q.length >= .5 ? 'w' : 'b') + (miss.length ? '<p class="sub" style="margin-top:10px">Still wrong: ' + miss.length + '. They stay in your notebook until you get them right.</p>' : '<p class="sub" style="margin-top:10px">All correct. Nice.</p>') + '<div class="row" style="margin-top:10px"><button class="btn pri" id="rb">Back to notebook</button>' + (miss.length ? '<button class="btn" id="rr">Retry the ones I missed</button>' : '') + '</div></div>';
      $('#rb', box).onclick = back; var rr = $('#rr', box); if (rr) rr.onclick = function () { runSet(box, miss, 'Retry', back); }; return;
    }
    var q = Q[i];
    box.innerHTML = '<div class="card"><div class="row" style="margin-bottom:8px"><span class="pill acc">' + esc(title) + ' ' + (i + 1) + ' / ' + Q.length + '</span><span class="pill">Chapter ' + q.ch + '</span><span class="sp"></span><span class="pill good">' + ok + ' correct</span></div>' + bar(i / Q.length) + '<div id="qq" style="margin-top:12px"></div></div>';
    NX.askMCQ($('#qq', box), q, { onAnswer: function (good) { NX.record(q.id, good); if (good) ok++; else miss.push(q); var b = document.createElement('button'); b.className = 'btn pri'; b.style.marginTop = '10px'; b.textContent = i + 1 < Q.length ? 'Next question' : 'Finish'; b.onclick = function () { i++; step(); }; $('#qq', box).appendChild(b); } });
  }
  step();
}

function weakness() {
  return NX.chapters.map(function (c) {
    var s = NX.chStats(c.id), m = NX.MARKS[c.id], acc = s.acc == null ? .5 : s.acc, cov = s.cover;
    var missed = c.q.filter(function (q, i) { var a = NX.S.ans['ch' + c.id + '-' + i]; return a && a.last === 0; }).length;
    return { c: c, s: s, m: m, acc: s.acc, missed: missed, score: m * (1 - acc * Math.min(1, .4 + cov)) };
  }).sort(function (a, b) { return b.score - a.score; });
}
function missedList() { return NX.bank().filter(function (q) { var a = NX.S.ans[q.id]; return a && a.last === 0; }); }
function smartSet(n) {
  var W = weakness().slice(0, 4), bank = NX.bank(), out = [], used = {};
  function take(q) { if (!used[q.id] && out.length < n) { used[q.id] = 1; out.push(q); } }
  W.forEach(function (w) { NX.shuffle(bank.filter(function (q) { var a = NX.S.ans[q.id]; return q.ch === w.c.id && a && a.last === 0; })).slice(0, 4).forEach(take); });
  W.forEach(function (w) { NX.shuffle(bank.filter(function (q) { return q.ch === w.c.id && !NX.S.ans[q.id]; })).slice(0, 4).forEach(take); });
  W.forEach(function (w) { NX.shuffle(bank.filter(function (q) { var a = NX.S.ans[q.id]; return q.ch === w.c.id && a && a.last === 1 && a.w > 0; })).slice(0, 3).forEach(take); });
  NX.shuffle(bank.filter(function (q) { return W.some(function (w) { return w.c.id === q.ch; }); })).forEach(take);
  return NX.shuffle(out);
}

X.mistakes = function (V) {
  var ml = missedList(), ans = NX.S.ans, ids = Object.keys(ans).filter(function (k) { return /^ch/.test(k); });
  var everWrong = ids.filter(function (k) { return ans[k].w > 0; }).length, cleared = ids.filter(function (k) { return ans[k].w > 0 && ans[k].last === 1; }).length;
  var W = weakness();
  var h = '<h1>Mistake notebook</h1><p class="sub">Every question you got wrong lands here and stays until you answer it right. Weak-area drills pick questions from the chapters where your marks are most at risk.</p>';
  h += '<div class="grid g4" style="margin:14px 0"><div class="card"><div class="stat"><b style="color:var(--' + (ml.length ? 'bad' : 'good') + ')">' + ml.length + '</b><span>Open mistakes</span></div></div><div class="card"><div class="stat"><b>' + everWrong + '</b><span>Questions ever missed</span></div></div><div class="card"><div class="stat"><b style="color:var(--good)">' + cleared + '</b><span>Fixed after a miss</span></div></div><div class="card"><div class="stat"><b>' + (everWrong ? Math.round(100 * cleared / everWrong) + '%' : 'n/a') + '</b><span>Recovery rate</span></div></div></div>';
  h += '<div class="row" style="margin-bottom:16px"><button class="btn pri" id="rm"' + (ml.length ? '' : ' disabled') + '>Retry all open mistakes (' + Math.min(ml.length, 20) + ')</button><button class="btn pri" id="sm">Smart weak-area drill (15 questions)</button></div><div id="run"></div><div id="nb">';
  h += '<h2>Where your marks are most at risk</h2><div class="card chl" style="padding:8px 22px">';
  W.forEach(function (w) { var cls = w.acc == null ? '' : w.acc >= .75 ? 'g' : w.acc >= .5 ? 'w' : 'b'; h += '<div style="display:grid;grid-template-columns:minmax(0,1.5fr) 50px minmax(60px,1fr) 56px 64px;gap:10px;align-items:center;padding:8px 0;border-bottom:1px solid var(--line)"><a href="#learn-' + w.c.id + '" style="color:inherit;text-decoration:none">' + w.c.id + '. ' + esc(w.c.title) + '</a><span class="mono sub">' + w.m + ' mk</span>' + bar(w.acc == null ? 0 : w.acc, cls) + '<span class="mono sub" style="text-align:right">' + (w.acc == null ? 'new' : NX.pct(w.acc, 0)) + '</span><button class="btn sm dr" data-c="' + w.c.id + '">Drill</button></div>'; });
  h += '</div>';
  h += '<h2>Open mistakes by chapter</h2>';
  if (!ml.length) h += '<div class="card"><p style="margin:0">Nothing open. Answer questions in Practice or a mock test and the wrong ones will collect here.</p></div>';
  else {
    var by = {}; ml.forEach(function (q) { (by[q.ch] = by[q.ch] || []).push(q); });
    Object.keys(by).sort(function (a, b) { return a - b; }).forEach(function (k) {
      h += '<details class="sec"><summary><span class="pill bad">' + by[k].length + '</span> ' + k + '. ' + esc(NX.chapters[k - 1].title) + '</summary><div class="body">';
      by[k].forEach(function (q) { h += '<div style="padding:10px 0;border-top:1px solid var(--line)"><div class="qtext">' + q.q + '</div><p><b>Correct:</b> ' + q.o[q.a] + '</p><div class="expl">' + (q.e || '') + '</div></div>'; });
      h += '</div></details>';
    });
  }
  h += '</div>'; V.innerHTML = h;
  var run = $('#run', V);
  function launch(Q, title) { if (!Q.length) { NX.toast('Nothing to practise yet'); return; } $('#nb', V).style.display = 'none'; $('#rm', V).parentNode.style.display = 'none'; runSet(run, Q, title, function () { X.mistakes(V); window.scrollTo(0, 0); }); window.scrollTo(0, 0); }
  $('#rm', V).onclick = function () { launch(NX.shuffle(missedList()).slice(0, 20), 'Retry'); };
  $('#sm', V).onclick = function () { launch(smartSet(15), 'Weak-area drill'); };
  $$('.dr', V).forEach(function (b) { b.onclick = function () { var c = +b.dataset.c, bank = NX.bank().filter(function (q) { return q.ch === c; }); var first = NX.shuffle(bank.filter(function (q) { var a = ans[q.id]; return !a || a.last === 0; })), rest = NX.shuffle(bank.filter(function (q) { var a = ans[q.id]; return a && a.last === 1; })); launch(first.concat(rest).slice(0, 12), 'Chapter ' + c); }; });
};

/* ---- formulas ---- */
X.formulas = function (V, arg) {
  var ch = +arg || 0;
  V.innerHTML = '<h1>Formula sheet</h1><p class="sub">Every formula in the syllabus with what each symbol means and a calculator you can change. Search by name or filter by chapter.</p><div class="card"><div class="ctrl"><label class="f">Search<input type="text" id="fq" placeholder="e.g. WACC, beta, RSI"></label><label class="f">Chapter<select id="fc">' + '<option value="0">All chapters</option>' + NX.chapters.map(function (c) { return '<option value="' + c.id + '"' + (c.id === ch ? ' selected' : '') + '>' + c.id + '. ' + esc(c.title) + '</option>'; }).join('') + '</select></label></div></div><div id="fl" class="grid g2" style="margin-top:14px"></div>';
  var fl = $('#fl', V);
  function draw() {
    var q = $('#fq', V).value.toLowerCase().trim(), c = +$('#fc', V).value;
    var list = NX.formulas.filter(function (f) { return (!c || f.ch === c) && (!q || (f.name + ' ' + f.formula + ' ' + f.note).toLowerCase().indexOf(q) >= 0); });
    fl.innerHTML = list.length ? '' : '<div class="card">No formulas match.</div>';
    list.forEach(function (f) {
      var card = document.createElement('div'); card.className = 'card';
      card.innerHTML = '<div class="row" style="margin-bottom:6px"><span class="pill acc">Ch ' + f.ch + '</span><h3 style="margin:0">' + esc(f.name) + '</h3></div><div class="fx">' + esc(f.formula) + '</div><ul style="margin:6px 0;padding-left:1.1em">' + f.vars.map(function (v) { return '<li><b>' + esc(v[0]) + '</b>: ' + esc(v[1]) + '</li>'; }).join('') + '</ul><p class="sub" style="margin:6px 0 10px">' + esc(f.note) + '</p><div class="ctrl">' + f.inputs.map(function (i, k) { return '<label class="f">' + esc(i[0]) + '<input type="number" step="any" value="' + i[1] + '" data-k="' + k + '"></label>'; }).join('') + '</div><div class="out"></div>';
      var ins = $$('input', card), out = $('.out', card);
      function calc() { var v = ins.map(function (x) { return parseFloat(x.value); }); if (v.some(isNaN)) { out.innerHTML = ''; return; } var r; try { r = f.fn(v); } catch (e) { r = []; } out.innerHTML = r.map(function (o) { return '<div class="stat"><b>' + esc(o[1]) + '</b><span>' + esc(o[0]) + '</span></div>'; }).join(''); }
      ins.forEach(function (x) { x.oninput = calc; }); calc(); fl.appendChild(card);
    });
  }
  $('#fq', V).oninput = draw; $('#fc', V).onchange = draw; draw();
};

/* ---- visuals ---- */
X.visuals = function (V, arg) {
  var one = NX.visuals.filter(function (v) { return v.id === arg; })[0];
  if (one) {
    V.innerHTML = '<div class="crumb"><a href="#visuals">Visuals</a> / ' + esc(one.title) + '</div><h1>' + esc(one.title) + '</h1><p class="sub">' + esc(one.desc) + '</p><div class="card" id="vb"></div><div class="row" style="margin-top:14px"><a class="btn" style="text-decoration:none" href="#learn-' + one.ch + '">Read chapter ' + one.ch + '</a><a class="btn" style="text-decoration:none" href="#formulas-' + one.ch + '">Formulas for chapter ' + one.ch + '</a></div>';
    one.render($('#vb', V)); return;
  }
  var ch = +arg || 0, list = NX.visuals.filter(function (v) { return !ch || v.ch === ch; });
  V.innerHTML = '<h1>Visual explainers</h1><p class="sub">Diagrams and interactive charts for the concepts that are hardest to picture. Open one, move the sliders, and read the takeaway underneath.</p><div class="tabs" id="vt"></div><div class="grid g3" id="vg"></div>';
  var tabs = [[0, 'All']].concat(NX.chapters.map(function (c) { return NX.visuals.some(function (v) { return v.ch === c.id; }) ? [c.id, 'Ch ' + c.id] : null; }).filter(Boolean));
  $('#vt', V).innerHTML = tabs.map(function (t) { return '<button data-c="' + t[0] + '"' + (t[0] === ch ? ' class="on"' : '') + '>' + t[1] + '</button>'; }).join('');
  $$('#vt button', V).forEach(function (b) { b.onclick = function () { location.hash = '#visuals' + (+b.dataset.c ? '-' + b.dataset.c : ''); }; });
  $('#vg', V).innerHTML = list.map(function (v) { return '<a class="card link" href="#visuals-' + v.id + '"><div class="row" style="margin-bottom:6px"><span class="pill acc">Ch ' + v.ch + '</span></div><h3>' + esc(v.title) + '</h3><p class="sub" style="margin:0">' + esc(v.desc) + '</p></a>'; }).join('');
};
})();
