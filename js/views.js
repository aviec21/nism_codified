/* Router and views */
(function () {
  var $ = NX.$, $$ = NX.$$, esc = NX.esc, V = $('#view');
  var ROUTES = [['home', 'Home'], ['learn', 'Learn'], ['labs', 'Labs'], ['practice', 'Practice'], ['cards', 'Cards'], ['cases', 'Cases'], ['mock', 'Mock test'], ['mistakes', 'Mistakes'], ['formulas', 'Formulas'], ['visuals', 'Visuals'], ['sync', 'Sync']];
  NX.pref = {};
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function btn(txt, cls, fn) { var b = el('button', 'btn ' + (cls || ''), txt); b.onclick = fn; return b; }
  function bar(p, cls) { return '<div class="bar ' + (cls || '') + '"><i style="width:' + Math.round(Math.max(0, Math.min(1, p)) * 100) + '%"></i></div>'; }
  function today() { return Math.floor(Date.now() / 864e5); }
  function chOpts(sel, all) { return (all ? '<option value="0">All chapters</option>' : '') + NX.chapters.map(function (c) { return '<option value="' + c.id + '"' + (+sel === c.id ? ' selected' : '') + '>' + c.id + '. ' + esc(c.title) + '</option>'; }).join(''); }
  function clearTimers() { if (NX._int) { clearInterval(NX._int); NX._int = null; } }

  /* ---------- nav and router ---------- */
  function renderNav(cur) { $('#nav').innerHTML = ROUTES.map(function (r) { return '<a href="#' + r[0] + '"' + (r[0] === cur ? ' class="on" aria-current="page"' : '') + '>' + r[1] + '</a>'; }).join(''); }
  function route() {
    clearTimers();
    var h = (location.hash || '#home').slice(1), p = h.split('-'), name = p[0], arg = p.slice(1).join('-');
    if (!VIEWS[name]) name = 'home';
    renderNav(name); V.innerHTML = '';
    try { VIEWS[name](arg); } catch (e) { V.innerHTML = '<div class="trap">Something went wrong in this view: ' + esc(e.message) + '</div>'; if (window.console) console.error(e); }
    window.scrollTo(0, 0);
  }
  var VIEWS = {};
  window.addEventListener('hashchange', route);

  /* ---------- Home ---------- */
  VIEWS.home = function () {
    var r = NX.readiness(), ans = NX.S.ans, ids = Object.keys(ans), tc = 0, tw = 0;
    ids.forEach(function (k) { tc += ans[k].c; tw += ans[k].w; });
    var bank = NX.bank().length, seen = ids.filter(function (k) { return /^ch/.test(k); }).length;
    var rows = NX.chapters.map(function (c) { var s = NX.chStats(c.id), m = NX.MARKS[c.id]; return { c: c, s: s, m: m, gap: m * (1 - (s.acc == null ? 0 : s.acc * Math.min(1, 0.4 + s.cover))) }; });
    var next = rows.slice().sort(function (a, b) { return b.gap - a.gap; })[0];
    var lastMock = NX.S.mocks.length ? NX.S.mocks[NX.S.mocks.length - 1] : null;
    var h = '<h1>NISM Series XV Research Analyst: Study Lab</h1><p class="sub">Learn each chapter, experiment in the labs, drill the numbers, then sit a timed mock. Progress saves on this device and can sync across devices (see Sync).</p>';
    h += '<div class="grid g4" style="margin:14px 0"><div class="card"><div class="stat"><b>' + Math.round(r * 100) + '%</b><span>Exam readiness (weighted by marks)</span></div></div>' +
      '<div class="card"><div class="stat"><b>' + seen + '/' + bank + '</b><span>Bank questions attempted</span></div></div>' +
      '<div class="card"><div class="stat"><b>' + (tc + tw ? Math.round(100 * tc / (tc + tw)) + '%' : 'n/a') + '</b><span>Lifetime accuracy (' + (tc + tw) + ' answers)</span></div></div>' +
      '<div class="card"><div class="stat"><b>' + (NX.S.streak.n || 0) + '</b><span>Day streak</span></div></div></div>';
    h += '<div class="card" style="margin-bottom:14px"><h2>Do this next</h2><p>Biggest marks gap right now: <b>Chapter ' + next.c.id + ', ' + esc(next.c.title) + '</b> (' + next.m + ' marks, ' + (next.s.acc == null ? 'not started' : 'accuracy ' + NX.pct(next.s.acc, 0)) + ').</p><div class="row"><a class="btn pri" href="#learn-' + next.c.id + '" style="text-decoration:none">Open chapter</a><a class="btn" href="#practice" id="hp" style="text-decoration:none">Practise it</a><a class="btn" href="#mock" style="text-decoration:none">Take a mock' + (lastMock ? ' (last ' + Math.round(lastMock.s) + '/' + lastMock.max + ')' : '') + '</a></div></div>';
    var order = (NX.S.homeSort === 'syl') ? 'syl' : 'pri';
    h += '<div class="row" style="align-items:end;margin-top:6px"><div><h2 style="margin:0">Where your marks are</h2><p class="sub" style="margin:2px 0 0">Each block below is one chapter, sized by exam marks. Faded means not yet secured. Tiles are ranked by marks you could still win.</p></div><span class="sp"></span><div class="seg" id="hs"><button data-o="pri" class="' + (order === 'pri' ? 'on' : '') + '">Priority</button><button data-o="syl" class="' + (order === 'syl' ? 'on' : '') + '">Syllabus order</button></div></div>';
    h += '<div class="exmap">' + rows.map(function (x) { var sec = x.s.acc == null ? 0 : x.s.acc * Math.min(1, 0.4 + x.s.cover); return '<a href="#learn-' + x.c.id + '" title="Ch ' + x.c.id + ' ' + esc(x.c.title) + ': ' + x.m + ' marks" style="flex:' + x.m + ';--cc:' + NX.chColor(x.c.id) + '"><i style="height:' + Math.round(sec * 100) + '%"></i><b>' + x.c.id + '</b></a>'; }).join('') + '</div><div class="exlegend"><span>Block width = marks (total ' + rows.reduce(function (a, x) { return a + x.m; }, 0) + ')</span><span>Filled height = how much you have secured</span></div>';
    var list = rows.slice(); if (order === 'pri') list.sort(function (a, b) { return b.gap - a.gap; });
    h += '<div class="grid g3 chtiles" style="margin-top:12px">';
    list.forEach(function (x, i) {
      var st = x.s.acc == null ? ['Not started', ''] : x.s.acc >= .75 ? ['Strong', 'good'] : x.s.acc >= .5 ? ['Improving', 'warn'] : ['Weak', 'bad'];
      var sec = x.m - x.gap, rd = x.s.secs ? x.s.read / x.s.secs : 0;
      h += '<a class="card ct" href="#learn-' + x.c.id + '" style="--cc:' + NX.chColor(x.c.id) + '"><div class="row"><span class="cn">' + x.c.id + '</span><span class="pill ' + st[1] + '">' + st[0] + '</span><span class="sp"></span>' + (order === 'pri' && i < 3 ? '<span class="pill acc">Start here</span>' : '') + '</div><h3>' + esc(x.c.title) + '</h3>' +
        '<div class="mk"><b>' + x.m + '</b> marks <span class="sub">(' + x.m + '% of exam)</span></div>' +
        '<div class="sub" style="font-size:.82rem;margin:2px 0 8px">Secured about <b>' + sec.toFixed(1) + '</b>, still to win <b>' + x.gap.toFixed(1) + '</b></div>' +
        '<div class="mm"><span>Read</span><i><u style="width:' + Math.round(rd * 100) + '%"></u></i><em>' + x.s.read + '/' + x.s.secs + '</em></div>' +
        '<div class="mm"><span>Seen</span><i><u style="width:' + Math.round(100 * x.s.seen / Math.max(1, x.s.total)) + '%"></u></i><em>' + x.s.seen + '/' + x.s.total + '</em></div>' +
        '<div class="mm"><span>Accuracy</span><i><u style="width:' + (x.s.acc == null ? 0 : Math.round(x.s.acc * 100)) + '%"></u></i><em>' + (x.s.acc == null ? 'new' : NX.pct(x.s.acc, 0)) + '</em></div></a>';
    });
    h += '</div>';
    var w = [[1, 5], [6, 10], [11, 15]];
    h += '<h2 style="margin-top:20px">Four week plan</h2><div class="grid g2">';
    var plan = [
      ['Week 1: Foundations', 'Chapters 1 to 5. Read each lesson, run the Returns and Ratios labs, clear the flashcards daily.'],
      ['Week 2: Analysis tools', 'Chapters 6 to 10. Spend time in the DCF, Industry and Macro labs. Do numerical drills for EV, P/E, WACC.'],
      ['Week 3: Heavy chapters', 'Chapters 11 to 15 carry the most marks (Chapters 14 and 15 are 25 of 100). Technical lab, Regulation lab, then case sets.'],
      ['Week 4: Test and repair', 'Two full mocks, review every wrong answer, redo weak chapters, last pass on flashcards and formulas.']
    ];
    plan.forEach(function (p) { h += '<div class="card"><h3>' + p[0] + '</h3><p class="sub" style="margin:0">' + p[1] + '</p></div>'; });
    h += '</div><h2 style="margin-top:20px">Exam at a glance</h2><div class="card"><ul style="margin:0;padding-left:1.1em"><li>100 marks: 80 MCQs plus 5 case studies of 4 questions (20 marks)</li><li>120 minutes, 25% negative marking, 60% to pass</li><li>Recertification every 3 years</li></ul><p class="sub" style="margin:.6em 0 0">Verify the latest pattern at nism.ac.in before you book.</p></div>';
    V.innerHTML = h;
    Array.prototype.forEach.call(document.querySelectorAll('#hs button'), function (b) { b.onclick = function () { NX.S.homeSort = b.getAttribute('data-o'); NX.save(); VIEWS.home(); }; });
  };

  /* ---------- Learn ---------- */
  VIEWS.learn = function (arg) {
    var id = parseInt(arg, 10);
    if (!id) {
      var h = '<h1>Learn</h1><p class="sub">Fifteen chapters, in workbook order. Marks show exam weightage.</p><div class="grid g3">';
      NX.chapters.forEach(function (c) { var s = NX.chStats(c.id); h += '<a class="card link" href="#learn-' + c.id + '"><div class="row"><span class="pill acc">Ch ' + c.id + '</span><span class="pill">' + NX.MARKS[c.id] + ' marks</span></div><h3 style="margin:8px 0 6px">' + esc(c.title) + '</h3>' + bar(s.secs ? s.read / s.secs : 0) + '<div class="sub" style="font-size:.8rem;margin-top:4px">' + s.read + '/' + s.secs + ' lessons read, ' + s.seen + '/' + s.total + ' questions seen</div></a>'; });
      V.innerHTML = h + '</div>'; return;
    }
    var c = NX.chapters[id - 1]; if (!c) { location.hash = '#learn'; return; }
    var labs = NX.labs.filter(function (l) { return l.ch === id; }), drills = NX.drills.filter(function (d) { return d.ch === id; });
    var h2 = '<div class="crumb"><a href="#learn">Learn</a> / Chapter ' + id + '</div><h1>' + esc(c.title) + '</h1><div class="row" style="margin-bottom:10px"><span class="pill acc">' + NX.MARKS[id] + ' marks</span><span class="pill">' + c.q.length + ' questions</span><span class="pill">' + c.fc.length + ' flashcards</span>' + (NX.visuals.some(function (v) { return v.ch === id; }) ? '<a class="pill acc" style="text-decoration:none" href="#visuals-' + id + '">Visuals</a>' : '') + (NX.formulas.some(function (f) { return f.ch === id; }) ? '<a class="pill acc" style="text-decoration:none" href="#formulas-' + id + '">Formulas</a>' : '') + '</div>';
    h2 += '<div class="card" style="margin-bottom:12px"><h3>You should be able to</h3><ul style="margin:0;padding-left:1.1em">' + c.obj.map(function (o) { return '<li>' + esc(o) + '</li>'; }).join('') + '</ul></div><div id="secs"></div>';
    h2 += '<div class="card"><h3>Now apply it</h3><div class="row"><button class="btn pri" id="pq">Practise this chapter</button><button class="btn" id="fc">Flashcards</button>' + labs.map(function (l) { return '<a class="btn" style="text-decoration:none" href="#labs-' + l.id + '">Lab: ' + esc(l.title) + '</a>'; }).join('') + (drills.length ? '<button class="btn" id="dr">Numerical drills</button>' : '') + '</div></div><div class="row" style="margin-top:14px">' + (id > 1 ? '<a class="btn" style="text-decoration:none" href="#learn-' + (id - 1) + '">Previous chapter</a>' : '') + '<span class="sp"></span>' + (id < 15 ? '<a class="btn" style="text-decoration:none" href="#learn-' + (id + 1) + '">Next chapter</a>' : '') + '</div>';
    V.innerHTML = h2;
    var box = $('#secs');
    c.sections.forEach(function (s, i) {
      var key = 's' + id + '-' + i, d = el('details', 'sec');
      function sum() { d.querySelector('summary').innerHTML = (s.deep ? '<span class="pill acc">Deep dive</span> ' : '<span class="pill">Quick review</span> ') + esc(s.t.replace(/^Deep dive: /, '').replace(/^./, function (c) { return c.toUpperCase(); })) + (NX.S.read[key] ? ' <span class="pill good" style="margin-left:auto">read</span>' : ''); }
      d.innerHTML = '<summary></summary><div class="body">' + s.h + '</div>'; sum();
      var b = btn(NX.S.read[key] ? 'Mark as unread' : 'Mark as read', 'sm', function () { NX.S.read[key] = NX.S.read[key] ? 0 : 1; if (!NX.S.read[key]) delete NX.S.read[key]; NX.save(); b.textContent = NX.S.read[key] ? 'Mark as unread' : 'Mark as read'; sum(); });
      d.querySelector('.body').appendChild(b); box.appendChild(d);
    });
    var first = box.querySelector('details'); if (first) first.open = true;
    $('#pq').onclick = function () { NX.pref = { ch: id }; location.hash = '#practice'; };
    $('#fc').onclick = function () { NX.pref = { ch: id }; location.hash = '#cards'; };
    var dr = $('#dr'); if (dr) dr.onclick = function () { NX.pref = { tab: 'drills' }; location.hash = '#practice'; };
  };

  /* ---------- Labs ---------- */
  VIEWS.labs = function (arg) {
    var lab = NX.labs.filter(function (l) { return l.id === arg; })[0];
    if (!lab) {
      var h = '<h1>Labs</h1><p class="sub">Change the inputs, watch the outputs move. These are the fastest way to build intuition for the numerical chapters.</p><div class="grid g3">';
      NX.labs.forEach(function (l) { h += '<a class="card link" href="#labs-' + l.id + '"><span class="pill acc">Chapter ' + l.ch + '</span><h3 style="margin:8px 0 4px">' + esc(l.title) + '</h3><p class="sub" style="margin:0">' + esc(l.blurb) + '</p></a>'; });
      V.innerHTML = h + '</div>'; return;
    }
    V.innerHTML = '<div class="crumb"><a href="#labs">Labs</a> / ' + esc(lab.title) + '</div><h1>' + esc(lab.title) + '</h1><p class="sub">' + esc(lab.blurb) + ' <a href="#learn-' + lab.ch + '">Read chapter ' + lab.ch + '</a>.</p><div class="card" id="labbox"></div>';
    lab.render($('#labbox'));
  };

  /* ---------- Practice ---------- */
  VIEWS.practice = function () {
    var tab = NX.pref.tab || 'bank', pre = NX.pref.ch || 0; NX.pref = {};
    V.innerHTML = '<h1>Practice</h1><div class="tabs"><button data-t="bank">Question bank</button><button data-t="drills">Numerical drills</button></div><div id="pbox"></div>';
    var tb = $$('.tabs button', V);
    function sel(t) { tb.forEach(function (b) { b.classList.toggle('on', b.dataset.t === t); }); (t === 'bank' ? bankTab : drillTab)($('#pbox')); }
    tb.forEach(function (b) { b.onclick = function () { clearTimers(); sel(b.dataset.t); }; });
    function bankTab(box) {
      box.innerHTML = '<div class="card"><div class="ctrl"><label class="f">Chapter<select id="pc">' + chOpts(pre, true) + '</select></label><label class="f">Which questions<select id="pf"><option value="all">All</option><option value="new">Not yet attempted</option><option value="miss">Missed last time</option></select></label><label class="f">How many<select id="pn"><option>10</option><option>20</option><option>40</option><option value="999">All matching</option></select></label></div><button class="btn pri" id="go">Start</button><p class="sub" id="pm" style="margin:8px 0 0"></p></div><div id="run" style="margin-top:12px"></div>';
      $('#go').onclick = function () {
        var ch = +$('#pc').value, f = $('#pf').value, n = +$('#pn').value;
        var pool = NX.bank().filter(function (q) { var a = NX.S.ans[q.id]; return (!ch || q.ch === ch) && (f === 'all' || (f === 'new' && !a) || (f === 'miss' && a && !a.last)); });
        if (!pool.length) { $('#pm').textContent = 'No questions match that filter. Try another.'; return; }
        $('#pm').textContent = ''; var Q = NX.shuffle(pool).slice(0, n), i = 0, ok = 0, run = $('#run');
        function step() {
          if (i >= Q.length) { run.innerHTML = '<div class="card"><h2>Done: ' + ok + ' of ' + Q.length + ' correct (' + Math.round(100 * ok / Q.length) + '%)</h2><p class="sub">Missed questions come back under "Missed last time".</p></div>'; return; }
          var q = Q[i]; run.innerHTML = '<div class="card"><div class="row" style="margin-bottom:8px"><span class="pill acc">Q ' + (i + 1) + ' / ' + Q.length + '</span><span class="pill">Chapter ' + q.ch + '</span><span class="sp"></span><span class="pill good">' + ok + ' correct</span></div>' + bar(i / Q.length) + '<div id="qq" style="margin-top:12px"></div></div>';
          NX.askMCQ($('#qq'), q, { onAnswer: function (good) { NX.record(q.id, good); if (good) ok++; $('#qq').appendChild(btn(i + 1 < Q.length ? 'Next question' : 'Finish', 'pri', function () { i++; step(); })).style.marginTop = '10px'; } });
        }
        step();
      };
    }
    function drillTab(box) {
      var h = '<p class="sub">Randomised calculation problems, so you cannot memorise answers. Enter a number; small rounding differences are accepted.</p><div class="grid g3">';
      NX.drills.forEach(function (d) { var s = (NX.S.dr || {})[d.id] || { c: 0, n: 0 }; h += '<button class="card link" data-d="' + d.id + '" style="text-align:left;font:inherit;color:inherit"><span class="pill acc">Chapter ' + d.ch + '</span><h3 style="margin:8px 0 4px">' + esc(d.title) + '</h3><span class="sub" style="font-size:.82rem">' + (s.n ? s.c + ' of ' + s.n + ' correct' : 'not tried') + '</span></button>'; });
      box.innerHTML = h + '</div><div id="drun" style="margin-top:14px"></div>';
      $$('[data-d]', box).forEach(function (b) { b.onclick = function () { runDrill(NX.drills.filter(function (d) { return d.id === b.dataset.d; })[0]); $('#drun').scrollIntoView({ behavior: 'smooth' }); }; });
    }
    function runDrill(d) {
      var run = $('#drun');
      function next() {
        var g = d.gen(); run.innerHTML = '<div class="card"><div class="row"><span class="pill acc">' + esc(d.title) + '</span></div><div class="qtext" style="margin-top:8px">' + g.q + '</div><div class="row"><input type="number" step="any" id="da" placeholder="Your answer" style="max-width:200px" aria-label="Your answer"><button class="btn pri" id="dc">Check</button><button class="btn" id="dk">Show answer</button></div><div id="dres"></div></div>';
        var done = false, inp = $('#da'); inp.focus();
        function fin(good, shown) {
          if (done) return; done = true; var st = NX.S.dr = NX.S.dr || {}; var s = st[d.id] = st[d.id] || { c: 0, n: 0 }; s.n++; if (good) s.c++; NX.touchStreak(); NX.save();
          var steps = Array.isArray(g.steps) ? g.steps.join('<br>') : g.steps;
          $('#dres').innerHTML = '<div class="expl"><b>' + (good ? 'Correct.' : shown ? 'Answer:' : 'Not quite.') + '</b> ' + NX.fmt(g.ans, g.dp || 0) + (g.unit ? ' ' + esc(g.unit) : '') + '<div class="fx">' + steps + '</div></div>';
          $('#dres').appendChild(btn('Another problem', 'pri', next)).style.marginTop = '10px';
        }
        $('#dc').onclick = function () { var v = parseFloat(inp.value); if (!isFinite(v)) { NX.toast('Enter a number'); return; } var tol = g.tol != null ? g.tol : Math.pow(10, -(g.dp || 0)) * 0.6; fin(Math.abs(v - g.ans) <= tol + 1e-9); };
        $('#dk').onclick = function () { fin(false, true); };
        inp.onkeydown = function (e) { if (e.key === 'Enter') $('#dc').click(); };
      }
      next();
    }
    sel(tab);
  };

  /* ---------- Flashcards (Leitner) ---------- */
  VIEWS.cards = function () {
    var pre = NX.pref.ch || 0; NX.pref = {};
    var INT = [0, 0, 1, 3, 7, 16, 35];
    function all(ch) { var out = []; NX.chapters.forEach(function (c) { if (!ch || c.id === ch) c.fc.forEach(function (f, i) { out.push({ id: 'f' + c.id + '-' + i, ch: c.id, f: f[0], b: f[1] }); }); }); return out; }
    function due(x) { var s = NX.S.fc[x.id]; return !s || s.due <= today(); }
    V.innerHTML = '<h1>Flashcards</h1><p class="sub">Spaced repetition: a card you know moves up a box and returns later; a card you miss goes back to box 1 and returns this session.</p><div class="card"><div class="ctrl"><label class="f">Chapter<select id="fch">' + chOpts(pre, true) + '</select></label></div><div id="fst" class="sub"></div><div class="row" style="margin-top:8px"><button class="btn pri" id="fgo">Study due cards</button><button class="btn" id="fall">Study all cards</button></div></div><div id="frun" style="margin-top:14px"></div>';
    function stat() { var ch = +$('#fch').value, a = all(ch), d = a.filter(due).length, boxes = [0, 0, 0, 0, 0, 0, 0]; a.forEach(function (x) { var s = NX.S.fc[x.id]; boxes[s ? s.b : 0]++; }); $('#fst').innerHTML = '<b>' + d + '</b> due of ' + a.length + ' cards. Mastered (box 5 and up): ' + (boxes[5] + boxes[6]) + '.'; }
    $('#fch').onchange = stat; stat();
    function start(onlyDue) {
      var ch = +$('#fch').value, q = NX.shuffle(all(ch).filter(function (x) { return !onlyDue || due(x); })), run = $('#frun'), n0 = q.length, got = 0;
      if (!q.length) { run.innerHTML = '<div class="card">Nothing due here. Come back later or study all cards.</div>'; return; }
      function show() {
        if (!q.length) { run.innerHTML = '<div class="card"><h2>Session complete</h2><p>' + n0 + ' cards, ' + got + ' answered correctly first time.</p></div>'; stat(); return; }
        var c = q[0], flipped = false;
        run.innerHTML = '<div class="row" style="margin-bottom:6px"><span class="pill acc">' + q.length + ' left</span><span class="pill">Chapter ' + c.ch + '</span></div><div class="card flash" id="fl" role="button" tabindex="0" aria-label="Flip card">' + c.f + '</div><div class="row" id="fb" style="margin-top:10px;justify-content:center"><span class="sub">Tap the card to reveal the answer</span></div>';
        var card = $('#fl');
        function flip() { if (flipped) return; flipped = true; card.innerHTML = '<div><div class="sub" style="font-size:.85rem;margin-bottom:8px">' + c.f + '</div>' + c.b + '</div>'; var fb = $('#fb'); fb.innerHTML = ''; fb.appendChild(btn('Missed it', '', function () { var s = NX.S.fc[c.id] = { b: 1, due: today(), t: Date.now() }; NX.touchStreak(); NX.save(); q.push(q.shift()); show(); })); fb.appendChild(btn('Knew it', 'pri', function () { var s = NX.S.fc[c.id] || { b: 0 }, b = Math.min(6, s.b + 1); if (!NX.S.fc[c.id]) got++; NX.S.fc[c.id] = { b: b, due: today() + INT[b], t: Date.now() }; NX.touchStreak(); NX.save(); q.shift(); show(); })); }
        card.onclick = flip; card.onkeydown = function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); flip(); } };
      }
      show();
    }
    $('#fgo').onclick = function () { start(true); }; $('#fall').onclick = function () { start(false); };
  };

  /* ---------- Cases ---------- */
  VIEWS.cases = function (arg) {
    var n = parseInt(arg, 10), cs = NX.cases[n - 1];
    if (!cs) {
      var h = '<h1>Case studies</h1><p class="sub">The exam has five cases with four questions each, 20 marks in all. Work through the stem, calculate on paper, then answer.</p><div class="grid g3">';
      NX.cases.forEach(function (c, i) { var done = 0, ok = 0; c.qs.forEach(function (q, j) { var a = NX.S.ans['case' + (i + 1) + '-' + j]; if (a) { done++; if (a.last) ok++; } }); h += '<a class="card link" href="#cases-' + (i + 1) + '"><h3>' + esc(c.title) + '</h3><span class="sub">' + (done ? ok + ' of ' + c.qs.length + ' right last time' : 'not attempted') + '</span></a>'; });
      V.innerHTML = h + '</div>'; return;
    }
    V.innerHTML = '<div class="crumb"><a href="#cases">Cases</a> / ' + esc(cs.title) + '</div><h1>' + esc(cs.title) + '</h1><div class="card">' + cs.stem + '</div><div id="cq"></div><div id="cs"></div>';
    var ok = 0, ans = 0;
    cs.qs.forEach(function (q, j) {
      var c = el('div', 'card'); c.style.marginTop = '12px'; $('#cq').appendChild(c);
      var d = el('div'); c.appendChild(d); c.insertBefore(el('span', 'pill acc', 'Question ' + (j + 1)), d); c.firstChild.style.marginBottom = '8px'; c.firstChild.style.display = 'inline-block';
      NX.askMCQ(d, q, { onAnswer: function (good) { NX.record('case' + n + '-' + j, good); ans++; if (good) ok++; if (ans === cs.qs.length) { $('#cs').innerHTML = '<div class="card" style="margin-top:12px"><h2>Case score: ' + ok + ' of ' + cs.qs.length + '</h2><div class="row"><a class="btn" href="#cases" style="text-decoration:none">All cases</a>' + (n < NX.cases.length ? '<a class="btn pri" href="#cases-' + (n + 1) + '" style="text-decoration:none">Next case</a>' : '') + '</div></div>'; } } });
    });
  };

  /* ---------- Mock test ---------- */
  var MOCK_MIN = 120, NEG = 0.25;
  function buildMock() {
    var by = {}; NX.bank().forEach(function (q) { (by[q.ch] = by[q.ch] || []).push(q); });
    var n = {}, sum = 0; for (var i = 1; i <= 15; i++) { n[i] = Math.min(by[i].length, Math.round(80 * NX.MARKS[i] / 100)); sum += n[i]; }
    var g = 0; while (sum > 80 && g++ < 200) { var m = 1; for (i = 2; i <= 15; i++) if (n[i] > n[m]) m = i; n[m]--; sum--; }
    g = 0; while (sum < 80 && g++ < 200) { var b = 0, sp = -1; for (i = 1; i <= 15; i++) { var s = by[i].length - n[i]; if (s > sp) { sp = s; b = i; } } if (sp <= 0) break; n[b]++; sum++; }
    var items = []; for (i = 1; i <= 15; i++) NX.shuffle(by[i]).slice(0, n[i]).forEach(function (q) { items.push({ id: q.id, ch: q.ch, q: q.q, o: q.o, a: q.a, e: q.e }); });
    items = NX.shuffle(items);
    var cs = NX.shuffle(NX.cases.map(function (_, i) { return i; })).slice(0, 5);
    cs.forEach(function (ci) { NX.cases[ci].qs.forEach(function (q, j) { items.push({ id: 'case' + (ci + 1) + '-' + j, ch: 0, cs: ci, q: q.q, o: q.o, a: q.a, e: q.e }); }); });
    items.forEach(function (it) { var ord = NX.shuffle(it.o.map(function (_, i) { return i; })); it.ord = ord; });
    return { items: items, picks: items.map(function () { return -1; }), flags: items.map(function () { return 0; }), cur: 0, end: Date.now() + MOCK_MIN * 60000, done: false, times: items.map(function () { return 0; }), t0: null, last: 0, start: Date.now() };
  }
  VIEWS.mock = function () {
    var M = NX.mock;
    if (!M || M.done) {
      var hist = NX.S.mocks.slice(-5).reverse();
      V.innerHTML = '<h1>Mock test</h1><div class="card"><ul style="margin:0 0 12px;padding-left:1.1em"><li>' + '100 questions: 80 MCQs weighted by chapter marks plus 5 cases (20 questions)</li><li>120 minutes, wrong answers cost 0.25 mark, pass mark 60</li><li>Do not refresh during a test: the attempt is kept only in this tab</li></ul><button class="btn pri" id="st">Start the test</button></div>' + (hist.length ? '<h2 style="margin-top:18px">Recent attempts</h2><div class="tw"><table><tr><th>Date</th><th class="n">Score</th><th class="n">Right</th><th class="n">Wrong</th><th>Result</th></tr>' + hist.map(function (m) { return '<tr><td>' + new Date(m.t).toLocaleDateString('en-IN') + '</td><td class="n">' + m.s.toFixed(2) + '/' + m.max + '</td><td class="n">' + m.c + '</td><td class="n">' + m.w + '</td><td>' + (m.s >= 60 ? '<span class="pill good">Pass</span>' : '<span class="pill bad">Below 60</span>') + '</td></tr>'; }).join('') + '</table></div>' + NX.mockTrend() : '');
      $('#st').onclick = function () { NX.mock = buildMock(); VIEWS.mock(); };
      return;
    }
    function render() {
      var now = Date.now(); if (M.t0 != null) M.times[M.last] += now - M.t0; M.last = M.cur; M.t0 = now;
      var it = M.items[M.cur], i = M.cur, ans = M.picks.filter(function (p) { return p >= 0; }).length;
      var h = '<div class="row" style="margin-bottom:8px"><span class="pill acc">Question ' + (i + 1) + ' / ' + M.items.length + '</span>' + (it.cs != null ? '<span class="pill warn">Case ' + (it.cs + 1) + '</span>' : '') + '<span class="sp"></span><span class="pill">' + ans + ' answered</span><span class="timer" id="tm" aria-label="Time left"></span></div>';
      h += '<div class="card">' + (it.cs != null ? '<details class="sec" open><summary>' + esc(NX.cases[it.cs].title) + ' (read the facts)</summary><div class="body">' + NX.cases[it.cs].stem + '</div></details>' : '') + '<div class="qtext">' + it.q + '</div><div id="mo"></div></div>';
      h += '<div class="row" style="margin:10px 0"><button class="btn" id="mp"' + (i === 0 ? ' disabled' : '') + '>Previous</button><button class="btn" id="mf">' + (M.flags[i] ? 'Unflag' : 'Flag for review') + '</button><button class="btn" id="mc">Clear answer</button><button class="btn pri" id="mn"' + (i === M.items.length - 1 ? ' disabled' : '') + '>Next</button><span class="sp"></span><button class="btn" id="ms" style="border-color:var(--bad);color:var(--bad)">Submit test</button></div><div class="qnav" id="qn"></div>';
      V.innerHTML = h;
      var mo = $('#mo'); it.ord.forEach(function (oi, k) { var b = el('button', 'opt' + (M.picks[i] === oi ? ' sel' : ''), String.fromCharCode(97 + k) + '. ' + it.o[oi]); b.onclick = function () { M.picks[i] = oi; render(); }; mo.appendChild(b); });
      var qn = $('#qn'); M.items.forEach(function (x, j) { var b = el('button', (M.picks[j] >= 0 ? 'done ' : '') + (j === i ? 'cur ' : '') + (M.flags[j] ? 'fl' : ''), j + 1); b.onclick = function () { M.cur = j; render(); }; qn.appendChild(b); });
      $('#mp').onclick = function () { M.cur--; render(); }; $('#mn').onclick = function () { M.cur++; render(); };
      $('#mf').onclick = function () { M.flags[i] = M.flags[i] ? 0 : 1; render(); };
      $('#mc').onclick = function () { M.picks[i] = -1; render(); };
      $('#ms').onclick = function () { var un = M.picks.length - ans; if (confirm('Submit now? ' + un + ' question(s) unanswered.')) finish(); };
      tick();
    }
    function tick() { var t = $('#tm'); if (!t) return; var s = Math.max(0, Math.round((M.end - Date.now()) / 1000)); t.textContent = Math.floor(s / 60) + ':' + ('0' + (s % 60)).slice(-2); t.style.color = s < 600 ? 'var(--bad)' : ''; if (s <= 0) finish(); }
    function finish() {
      clearTimers(); if (M.t0 != null) { M.times[M.last] += Date.now() - M.t0; M.t0 = null; } M.done = true; var c = 0, w = 0, u = 0, by = {}, cs = { n: 0, c: 0 };
      M.items.forEach(function (it, i) { var p = M.picks[i]; if (p < 0) { u++; return; } var ok = p === it.a; if (ok) c++; else w++; NX.record(it.id, ok); var k = it.ch || 0; if (!by[k]) by[k] = { n: 0, c: 0, w: 0 }; by[k].n++; if (ok) by[k].c++; else by[k].w++; });
      var score = c - NEG * w; NX.S.mocks.push({ t: Date.now(), s: score, max: M.items.length, c: c, w: w, u: u, used: Math.round(M.times.reduce(function (x, y) { return x + y; }, 0) / 60000) }); NX.save();
      var h = '<h1>Result</h1><div class="grid g4"><div class="card"><div class="stat"><b style="color:var(--' + (score >= 60 ? 'good' : 'bad') + ')">' + score.toFixed(2) + '</b><span>Score out of ' + M.items.length + (score >= 60 ? ' (pass)' : ' (below pass mark 60)') + '</span></div></div><div class="card"><div class="stat"><b>' + c + '</b><span>Correct</span></div></div><div class="card"><div class="stat"><b>' + w + '</b><span>Wrong (-' + (w * NEG).toFixed(2) + ')</span></div></div><div class="card"><div class="stat"><b>' + u + '</b><span>Unanswered</span></div></div></div>';
      var tt = M.times.reduce(function (x, y) { return x + y; }, 0) / 1000, tans = M.items.filter(function (_, i) { return M.picks[i] >= 0; }).length, avg = tans ? tt / tans : 0;
      var ord = M.items.map(function (it, i) { return { i: i, t: M.times[i] / 1000, ok: M.picks[i] === it.a, sk: M.picks[i] < 0 }; });
      var slow = ord.filter(function (x) { return !x.sk; }).sort(function (a, b) { return b.t - a.t; }).slice(0, 5);
      var fastWrong = ord.filter(function (x) { return !x.sk && !x.ok && x.t < 20; }).length;
      var okT = ord.filter(function (x) { return x.ok; }), woT = ord.filter(function (x) { return !x.sk && !x.ok; });
      var mean = function (a) { return a.length ? a.reduce(function (x, y) { return x + y.t; }, 0) / a.length : 0; };
      h += '<h2 style="margin-top:18px">Time analysis</h2><div class="grid g4"><div class="card"><div class="stat"><b>' + Math.round(tt / 60) + ' min</b><span>Time spent of ' + MOCK_MIN + '</span></div></div><div class="card"><div class="stat"><b>' + Math.round(avg) + ' s</b><span>Average per answered question (budget ' + Math.round(MOCK_MIN * 60 / M.items.length) + ' s)</span></div></div><div class="card"><div class="stat"><b>' + Math.round(mean(okT)) + ' s / ' + Math.round(mean(woT)) + ' s</b><span>Avg on right / wrong answers</span></div></div><div class="card"><div class="stat"><b>' + fastWrong + '</b><span>Wrong in under 20 s (rushed)</span></div></div></div>';
      h += '<p class="sub" style="margin-top:8px">Slowest questions: ' + slow.map(function (x) { return '#' + (x.i + 1) + ' (' + Math.round(x.t) + ' s, ' + (x.ok ? 'right' : 'wrong') + ')'; }).join(', ') + '.</p>' + NX.mockTrend();
      h += '<h2 style="margin-top:18px">By chapter</h2><div class="tw"><table><tr><th>Chapter</th><th class="n">Marks</th><th class="n">Right / attempted</th><th>Accuracy</th></tr>';
      Object.keys(by).sort(function (a, b) { return a - b; }).forEach(function (k) { var x = by[k], acc = x.c / x.n; h += '<tr><td>' + (+k ? '<a href="#learn-' + k + '">' + k + '. ' + esc(NX.chapters[k - 1].title) + '</a>' : 'Case studies') + '</td><td class="n">' + (+k ? NX.MARKS[k] : 20) + '</td><td class="n">' + x.c + ' / ' + x.n + '</td><td style="min-width:120px">' + bar(acc, acc >= .75 ? 'g' : acc >= .5 ? 'w' : 'b') + '</td></tr>'; });
      h += '</table></div><h2 style="margin-top:18px">Review wrong and skipped answers</h2>';
      M.items.forEach(function (it, i) { var p = M.picks[i]; if (p === it.a) return; h += '<details class="sec"><summary>' + (i + 1) + '. ' + (p < 0 ? '<span class="pill warn">skipped</span> ' : '<span class="pill bad">wrong</span> ') + '<span style="font-weight:500">' + it.q.replace(/<[^>]+>/g, '').slice(0, 90) + '</span></summary><div class="body"><div class="qtext">' + it.q + '</div><p><b>Correct:</b> ' + it.o[it.a] + '</p>' + (p >= 0 ? '<p><b>You chose:</b> ' + it.o[p] + '</p>' : '') + '<div class="expl">' + (it.e || '') + '</div></div></details>'; });
      h += '<div class="row" style="margin-top:14px"><button class="btn pri" id="again">Take another test</button></div>';
      V.innerHTML = h; $('#again').onclick = function () { NX.mock = null; VIEWS.mock(); };
    }
    render(); NX._int = setInterval(tick, 1000);
  };

  /* ---------- Sync ---------- */
  VIEWS.sync = function () {
    var S = NX.sync;
    V.innerHTML = '<h1>Sync across devices</h1><p class="sub">No login. Your progress is tied to a private sync code. Enter the same code on your phone and laptop and both stay in step. Anyone with the code can read and change this progress, so treat it like a password.</p><div class="card" id="sy"></div><div class="card" style="margin-top:12px"><h3>Backup file</h3><p class="sub">Works without the server. Export saves your progress to a file; import merges a file back in.</p><div class="row"><button class="btn" id="ex">Export</button><label class="btn" style="cursor:pointer">Import<input type="file" id="im" accept="application/json" hidden></label><button class="btn" id="rs" style="margin-left:auto;color:var(--bad);border-color:var(--bad)">Reset this device</button></div></div>';
    function draw() {
      var code = S && S.code(), box = $('#sy');
      if (!S) { box.innerHTML = '<p>Sync module not loaded.</p>'; return; }
      if (code) { box.innerHTML = '<h3>Sync is on</h3><p>Your code: <code style="font-size:1.1rem;letter-spacing:.08em" id="cd">' + esc(code) + '</code></p><p class="sub" id="ss">' + esc(S.status()) + '</p><div class="row"><button class="btn pri" id="sn">Sync now</button><button class="btn" id="cp">Copy code</button><button class="btn" id="of">Turn off on this device</button></div>'; $('#sn').onclick = function () { S.now(true).then(function () { $('#ss').textContent = S.status(); }); }; $('#cp').onclick = function () { try { navigator.clipboard.writeText(code); NX.toast('Code copied'); } catch (e) { NX.toast('Select and copy the code'); } }; $('#of').onclick = function () { S.off(); draw(); }; }
      else { box.innerHTML = '<h3>Turn on sync</h3><div class="grid g2"><div><p>First device: create a new code.</p><button class="btn pri" id="nw">Create sync code</button></div><div><p>Another device: enter your code.</p><div class="row"><input type="text" id="ec" placeholder="XXXX-XXXX-XXXX" style="max-width:220px" autocapitalize="characters" aria-label="Sync code"><button class="btn" id="jn">Connect</button></div></div></div><p class="sub" id="ss"></p>'; $('#nw').onclick = function () { S.create().then(draw, function (e) { $('#ss').textContent = 'Could not reach the server: ' + e.message; }); }; $('#jn').onclick = function () { S.join($('#ec').value).then(draw, function (e) { $('#ss').textContent = e.message; }); }; }
    }
    draw();
    $('#ex').onclick = function () { var a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([JSON.stringify(NX.S)], { type: 'application/json' })); a.download = 'nism-xv-progress.json'; a.click(); };
    $('#im').onchange = function (e) { var f = e.target.files[0]; if (!f) return; var r = new FileReader(); r.onload = function () { try { NX.S = NX.merge(NX.S, JSON.parse(r.result)); NX.save(); NX.toast('Imported and merged'); } catch (x) { NX.toast('That file did not load'); } }; r.readAsText(f); };
    $('#rs').onclick = function () { if (confirm('Erase all progress on this device? Synced copies on the server are not touched until you sync again.')) { NX.S = { ans: {}, fc: {}, read: {}, mocks: [], streak: { d: '', n: 0 } }; NX.save(); NX.toast('Reset'); } };
  };

  Object.keys(NX.extraViews || {}).forEach(function (k) { VIEWS[k] = function (a) { NX.extraViews[k](V, a); }; });
  route();
})();
