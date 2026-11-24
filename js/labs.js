/* Experimentation labs */
(function () {
  var f = NX.fin, $ = NX.$, fmt = NX.fmt;
  function ctrls(fields) {
    return '<div class="ctrl">' + fields.map(function (x) {
      if (x.sel) return '<label class="f">' + x.l + '<select data-k="' + x.k + '">' + x.sel.map(function (o, i) { return '<option value="' + i + '"' + (i === (x.v || 0) ? ' selected' : '') + '>' + o + '</option>'; }).join('') + '</select></label>';
      if (x.text) return '<label class="f">' + x.l + '<input type="text" data-k="' + x.k + '" value="' + x.v + '"></label>';
      return '<label class="f">' + x.l + (x.r ? ' <b class="mono" data-v="' + x.k + '" style="color:var(--ink)">' + x.v + '</b>' : '') + '<input type="' + (x.r ? 'range' : 'number') + '" data-k="' + x.k + '" value="' + x.v + '" step="' + (x.step || 1) + '"' + (x.min != null ? ' min="' + x.min + '"' : '') + (x.max != null ? ' max="' + x.max + '"' : '') + '></label>';
    }).join('') + '</div>';
  }
  function bind(el, fields, calc) {
    var out = el.querySelector('.labout');
    function run(e) {
      var v = {}; NX.$$('[data-k]', el).forEach(function (i) { v[i.dataset.k] = (i.tagName === 'SELECT' || i.type === 'text') ? (i.tagName === 'SELECT' ? +i.value : i.value) : parseFloat(i.value); });
      NX.$$('[data-v]', el).forEach(function (b) { b.textContent = v[b.dataset.v]; });
      out.innerHTML = calc(v);
    }
    el.addEventListener('input', run); el.addEventListener('change', run); run();
  }
  function lab(id, title, ch, blurb, build) { NX.labs.push({ id: id, title: title, ch: ch, blurb: blurb, render: build }); }
  function stat(l, v) { return '<div class="stat"><b>' + v + '</b><span>' + l + '</span></div>'; }
  function out(arr) { return '<div class="out">' + arr.join('') + '</div>'; }
  function tryit(t) { return '<div class="kp"><b>Try this:</b> ' + t + '</div>'; }

  /* 1 DCF */
  lab('dcf', 'DCF and sensitivity grid', 10, 'Value a firm with FCFF, WACC and terminal growth. See how fragile the answer is.', function (el) {
    var F = [{ k: 'fcf', l: 'FCFF this year (Rs cr)', v: 100 }, { k: 'g1', l: 'High growth rate % (stage 1)', v: 15, r: 1, min: 0, max: 30 }, { k: 'n', l: 'Stage 1 years', v: 5, r: 1, min: 1, max: 10 }, { k: 'tg', l: 'Terminal growth %', v: 5, r: 1, min: 0, max: 8, step: 0.5 }, { k: 'w', l: 'WACC %', v: 11, r: 1, min: 6, max: 18, step: 0.5 }, { k: 'nd', l: 'Net debt (Rs cr)', v: 300 }, { k: 'sh', l: 'Shares (cr)', v: 20 }, { k: 'px', l: 'Market price (Rs)', v: 120 }];
    el.innerHTML = ctrls(F) + '<div class="labout"></div>' + tryit('Push terminal growth towards WACC and watch value explode. That is why growth must stay below the discount rate and be capped near long-run GDP growth.');
    function val(v, w, tg) { var pv = 0, c = v.fcf, arr = []; for (var t = 1; t <= v.n; t++) { c *= 1 + v.g1 / 100; var p = c / Math.pow(1 + w / 100, t); pv += p; arr.push(p); } var tv = c * (1 + tg / 100) / (w / 100 - tg / 100), ptv = tv / Math.pow(1 + w / 100, v.n); return { ev: pv + ptv, pv: pv, ptv: ptv, tv: tv, arr: arr }; }
    bind(el, F, function (v) {
      if (v.w <= v.tg) return '<div class="trap">WACC must exceed terminal growth.</div>';
      var r = val(v, v.w, v.tg), eq = r.ev - v.nd, ps = eq / v.sh, up = ps / v.px - 1;
      var labels = r.arr.map(function (_, i) { return 'Y' + (i + 1); }).concat(['TV']);
      var h = out([stat('Enterprise value (Rs cr)', fmt(r.ev, 0)), stat('Equity value (Rs cr)', fmt(eq, 0)), stat('Value per share (Rs)', fmt(ps, 1)), stat('vs market price', (up >= 0 ? '+' : '') + NX.pct(up, 1)), stat('Terminal value share of EV', NX.pct(r.ptv / r.ev, 0))]);
      h += NX.svg.bars({ x: labels, v: r.arr.concat([r.ptv]), vfmt: function (x) { return fmt(x, 0); }, yfmt: function (x) { return fmt(x, 0); }, label: 'Present value by year and terminal value', colors: labels.map(function (_, i) { return i === labels.length - 1 ? 'var(--warn)' : 'var(--accent)'; }) });
      var ws = [-2, -1, 0, 1, 2].map(function (d) { return v.w + d; }), gs = [-1, -0.5, 0, 0.5, 1].map(function (d) { return v.tg + d; });
      h += '<h3 style="margin-top:14px">Value per share: WACC (rows) vs terminal growth (columns)</h3><table class="heat"><tr><td></td>' + gs.map(function (g) { return '<td><b>' + g.toFixed(1) + '%</b></td>'; }).join('') + '</tr>';
      ws.forEach(function (w) { h += '<tr><td><b>' + w.toFixed(1) + '%</b></td>' + gs.map(function (g) { if (w <= g) return '<td>n/a</td>'; var p = (val(v, w, g).ev - v.nd) / v.sh, d = p / ps - 1, a = Math.min(Math.abs(d) * 1.2, 0.8); var bg = d >= 0 ? 'rgba(27,127,75,' + a + ')' : 'rgba(179,54,43,' + a + ')'; return '<td style="background:' + bg + ';color:var(--ink)">' + fmt(p, 0) + '</td>'; }).join('') + '</tr>'; });
      return h + '</table><p class="sub">Terminal value accounts for the biggest slice of EV. Small changes in WACC or g move value a lot: this is the sensitivity analysis the workbook asks for.</p>';
    });
  });

  /* 2 Bond */
  lab('bond', 'Bond price, yield and duration', 3, 'Watch price fall as yields rise. Compare long and short bonds.', function (el) {
    var F = [{ k: 'fv', l: 'Face value', v: 100 }, { k: 'c', l: 'Coupon %', v: 8, r: 1, min: 0, max: 14, step: 0.5 }, { k: 'y', l: 'Market yield %', v: 9, r: 1, min: 1, max: 16, step: 0.25 }, { k: 'n', l: 'Years to maturity', v: 10, r: 1, min: 1, max: 30 }, { k: 'fq', l: 'Coupons per year', sel: ['1', '2'], v: 0 }];
    el.innerHTML = ctrls(F) + '<div class="labout"></div>' + tryit('Set yield equal to coupon (price equals face value). Then lift yield by 1% for maturities of 3 and 20 years and compare the price drop.');
    bind(el, F, function (v) {
      var fq = v.fq + 1, p = f.bondPrice(v.fv, v.c / 100, v.y / 100, v.n, fq), mac = f.macaulay(v.fv, v.c / 100, v.y / 100, v.n, fq), md = mac / (1 + v.y / 100 / fq);
      var p1 = f.bondPrice(v.fv, v.c / 100, (v.y + 1) / 100, v.n, fq), p0 = f.bondPrice(v.fv, v.c / 100, (v.y - 1) / 100, v.n, fq);
      var xs = [], ys = []; for (var y = 1; y <= 16; y += 0.5) { xs.push(y); ys.push(f.bondPrice(v.fv, v.c / 100, y / 100, v.n, fq)); }
      var status = v.c > v.y ? 'Premium' : v.c < v.y ? 'Discount' : 'Par';
      return out([stat('Price', fmt(p, 2)), stat('Status', status), stat('Current yield', NX.pct(v.fv * v.c / 100 / p, 2)), stat('Macaulay duration (yrs)', fmt(mac, 2)), stat('Modified duration', fmt(md, 2)), stat('Price if yield +1%', fmt(p1, 2) + ' (' + NX.pct(p1 / p - 1, 1) + ')'), stat('Price if yield -1%', fmt(p0, 2) + ' (+' + NX.pct(p0 / p - 1, 1) + ')')]) +
        NX.svg.line({ xs: xs, series: [{ y: ys, c: 'var(--accent)', w: 2.4 }], xfmt: function (x) { return x + '%'; }, yfmt: function (x) { return x.toFixed(0); }, marker: xs.indexOf(Math.round(v.y * 2) / 2), label: 'Price against yield' }) + '<p class="sub">The curve is convex: price gains from a yield fall exceed losses from an equal yield rise. Modified duration is the first-order estimate of the percentage price change per 1% change in yield.</p>';
    });
  });

  /* 3 Returns */
  lab('returns', 'Returns: simple, annualised, CAGR, XIRR', 12, 'Same investment, four ways to describe return. Plus dated cash flows.', function (el) {
    var F = [{ k: 'sh', l: 'Shares', v: 150 }, { k: 'bp', l: 'Buy price', v: 25 }, { k: 'sp', l: 'Sell price', v: 30 }, { k: 'dv', l: 'Dividend per share (total)', v: 1 }, { k: 'cm', l: 'Commission each way', v: 20 }, { k: 'mo', l: 'Months held', v: 15, r: 1, min: 1, max: 120 }];
    el.innerHTML = ctrls(F) + '<div class="labout"></div><h3 style="margin-top:14px">XIRR for dated cash flows</h3><label class="f">One per line: YYYY-MM-DD, amount (negative = outflow)<textarea id="xi" rows="6" style="font:13px var(--mono);width:100%;padding:8px;border:1px solid var(--line);border-radius:7px;background:var(--surface);color:var(--ink)">2011-07-31, -150\n2011-10-31, 5\n2012-10-31, 6\n2013-10-31, 4\n2014-01-15, 165</textarea></label><div id="xo" class="out"></div>' + tryit('The default XIRR lines are the workbook example and should return about 8.06%. Then change months held to 60 to see CAGR match the workbook 4.2%.');
    bind(el, F, function (v) {
      var cost = v.sh * v.bp + v.cm, ret = v.sh * v.sp - v.cm + v.sh * v.dv, hpr = ret / cost - 1, yrs = v.mo / 12;
      var simple = hpr / v.mo * 12, cagr = Math.pow(1 + hpr, 1 / yrs) - 1;
      var xs = [], ys = []; for (var t = 0; t <= v.mo; t += Math.max(1, Math.round(v.mo / 24))) { xs.push(t); ys.push(Math.pow(1 + cagr, t / 12) * cost); }
      return out([stat('Total cost', fmt(cost, 0)), stat('Total returns', fmt(ret, 0)), stat('Holding period return', NX.pct(hpr, 2)), stat('Simple annualised', NX.pct(simple, 2)), stat('CAGR', NX.pct(cagr, 2))]) +
        NX.svg.line({ xs: xs, series: [{ y: ys, c: 'var(--accent)', w: 2.4 }], xfmt: function (x) { return x + 'm'; }, yfmt: function (x) { return fmt(x, 0); }, label: 'Smoothed growth at CAGR' }) + '<p class="sub">Simple annualisation ignores compounding. CAGR assumes returns are reinvested and is the accepted standard beyond one year.</p>';
    });
    function xi() { var rows = $('#xi', el).value.trim().split('\n').map(function (l) { var p = l.split(','); return [Date.parse(p[0].trim()), parseFloat(p[1])]; }).filter(function (r) { return isFinite(r[0]) && isFinite(r[1]); }); if (rows.length < 2) { $('#xo', el).innerHTML = stat('XIRR', 'n/a'); return; } var r = f.xirr(rows.map(function (x) { return x[1]; }), rows.map(function (x) { return x[0]; })); $('#xo', el).innerHTML = stat('XIRR (annual)', NX.pct(r, 2)); }
    $('#xi', el).addEventListener('input', xi); xi();
  });

  /* 4 Ratios */
  lab('ratios', 'Financial ratio and DuPont workbench', 8, 'Enter a company\'s numbers, read every ratio family, and see what drives ROE.', function (el) {
    var F = [{ k: 'rev', l: 'Net sales', v: 12000 }, { k: 'ebitda', l: 'EBITDA', v: 2400 }, { k: 'da', l: 'Depreciation and amortisation', v: 600 }, { k: 'int', l: 'Interest expense', v: 300 }, { k: 'tax', l: 'Tax rate %', v: 25 }, { k: 'ta', l: 'Total assets', v: 10000 }, { k: 'eq', l: 'Net worth', v: 5000 }, { k: 'debt', l: 'Total debt', v: 3000 }, { k: 'ca', l: 'Current assets', v: 4000 }, { k: 'inv', l: 'Inventories', v: 1200 }, { k: 'cl', l: 'Current liabilities', v: 2500 }, { k: 'rec', l: 'Receivables', v: 1500 }, { k: 'pay', l: 'Payables', v: 1100 }, { k: 'sh', l: 'Shares (lakh)', v: 100 }, { k: 'px', l: 'Price (Rs)', v: 450 }, { k: 'cash', l: 'Cash and non-operating inv.', v: 500 }];
    el.innerHTML = ctrls(F) + '<div class="labout"></div>' + tryit('Raise Total debt and cut Net worth by the same amount (keep assets constant). ROE jumps through the equity multiplier while margin and turnover stay put. That is the DuPont warning.');
    bind(el, F, function (v) {
      var ebit = v.ebitda - v.da, pbt = ebit - v.int, pat = pbt * (1 - v.tax / 100), mc = v.px * v.sh / 100, ev = mc + v.debt - v.cash, eps = pat * 100 / v.sh, ce = v.eq + v.debt;
      var nm = pat / v.rev, at = v.rev / v.ta, em = v.ta / v.eq, bv = v.eq * 100 / v.sh;
      function row(a, b, c) { return '<tr><td>' + a + '</td><td class="n">' + b + '</td><td>' + c + '</td></tr>'; }
      var t = '<div class="tw"><table><tr><th>Ratio</th><th class="n">Value</th><th>Reading</th></tr>' +
        row('EBITDA margin', NX.pct(v.ebitda / v.rev), 'Operating profitability before D&A') + row('EBIT margin', NX.pct(ebit / v.rev), 'Operating margin') + row('PAT margin', NX.pct(nm), 'Residual to shareholders') +
        row('ROE', NX.pct(pat / v.eq), 'PAT / net worth (use averages in practice)') + row('ROCE', NX.pct(ebit / ce), 'EBIT / (equity + debt)') +
        row('Debt / Equity', fmt(v.debt / v.eq, 2) + 'x', v.debt / v.eq > 1 ? 'Above the conservative benchmark of 1' : 'Within the conservative benchmark') + row('Interest coverage', fmt(ebit / v.int, 2) + 'x', ebit / v.int < 2 ? 'Thin cover' : 'Comfortable') +
        row('Current ratio', fmt(v.ca / v.cl, 2), v.ca / v.cl < 1 ? 'Below 1: check why' : 'Above 1') + row('Quick ratio', fmt((v.ca - v.inv) / v.cl, 2), 'Excludes inventories') + row('Core working capital', fmt(v.inv + v.rec - v.pay, 0), 'Inventory + receivables - payables') +
        row('Asset turnover', fmt(at, 2) + 'x', 'Sales per rupee of assets') + row('Receivable days', fmt(365 * v.rec / v.rev, 0), 'Collection period') + row('Inventory turnover', fmt(v.rev / v.inv, 2) + 'x', 'Sales / inventory') +
        row('EPS (Rs)', fmt(eps, 2), 'PAT / shares') + row('P/E', fmt(v.px / eps, 1) + 'x', '') + row('P/BV', fmt(v.px / bv, 2) + 'x', 'BVPS Rs ' + fmt(bv, 1)) + row('EV (market cap + debt - cash)', fmt(ev, 0), 'Market cap ' + fmt(mc, 0)) + row('EV / EBITDA', fmt(ev / v.ebitda, 1) + 'x', '') + '</table></div>';
      var d = out([stat('Net margin', NX.pct(nm, 2)), stat('x Asset turnover', fmt(at, 2) + 'x'), stat('x Equity multiplier', fmt(em, 2) + 'x'), stat('= ROE', NX.pct(nm * at * em, 2))]);
      return '<h3>DuPont</h3>' + d + t + '<p class="sub">Check: DuPont ROE equals PAT / net worth only when assets and equity are the same balance sheet figures, as here.</p>';
    });
  });

  /* 5 Risk */
  lab('risk', 'Risk lab: beta, CAPM and risk adjusted returns', 12, 'Rank portfolios three ways and see when the rankings disagree.', function (el) {
    var F = [{ k: 'rf', l: 'Risk free %', v: 6, step: 0.5 }, { k: 'rm', l: 'Market return %', v: 12, step: 0.5 }, { k: 'ra', l: 'A return %', v: 15 }, { k: 'sa', l: 'A std dev %', v: 20 }, { k: 'ba', l: 'A beta', v: 1.2, step: 0.1 }, { k: 'rb', l: 'B return %', v: 13 }, { k: 'sb', l: 'B std dev %', v: 12 }, { k: 'bb', l: 'B beta', v: 0.8, step: 0.1 }, { k: 'rc', l: 'C return %', v: 17 }, { k: 'sc', l: 'C std dev %', v: 28 }, { k: 'bc', l: 'C beta', v: 1.5, step: 0.1 }];
    el.innerHTML = ctrls(F) + '<div class="labout"></div><h3 style="margin-top:14px">Beta explorer</h3><div class="ctrl"><label class="f">Market move % <b class="mono" id="mmv" style="color:var(--ink)">10</b><input id="mm" type="range" min="-20" max="20" value="10"></label><label class="f">Stock beta<input id="bt" type="number" step="0.1" value="1.2"></label></div><div id="bo" class="out"></div><h3 style="margin-top:14px">Standard deviation from a return series</h3><label class="f">Returns % (comma separated)<input id="rs" type="text" value="12, -5, 20, 8, -2, 15"></label><div id="so" class="out"></div>' + tryit('Portfolio C has the highest raw return but is it the best per unit of risk? Compare Sharpe (total risk), Treynor (market risk) and Jensen (excess over CAPM).');
    bind(el, F, function (v) {
      var P = [['A', v.ra, v.sa, v.ba], ['B', v.rb, v.sb, v.bb], ['C', v.rc, v.sc, v.bc]].map(function (p) { return { n: p[0], r: p[1], s: p[2], b: p[3], sh: (p[1] - v.rf) / p[2], tr: (p[1] - v.rf) / p[3], ja: p[1] - (v.rf + p[3] * (v.rm - v.rf)) }; });
      var rank = function (k) { return P.slice().sort(function (a, b) { return b[k] - a[k]; }).map(function (p) { return p.n; }).join(' > '); };
      var t = '<div class="tw"><table><tr><th>Portfolio</th><th class="n">Return</th><th class="n">Sharpe</th><th class="n">Treynor</th><th class="n">Jensen alpha</th><th class="n">CAPM expected</th></tr>' + P.map(function (p) { return '<tr><td>' + p.n + '</td><td class="n">' + p.r.toFixed(1) + '%</td><td class="n">' + p.sh.toFixed(2) + '</td><td class="n">' + p.tr.toFixed(2) + '</td><td class="n" style="color:var(--' + (p.ja >= 0 ? 'good' : 'bad') + ')">' + p.ja.toFixed(2) + '%</td><td class="n">' + (v.rf + p.b * (v.rm - v.rf)).toFixed(1) + '%</td></tr>'; }).join('') + '</table></div>';
      var xs = [0, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
      var chart = NX.svg.line({ xs: xs, series: [{ y: xs.map(function (b) { return v.rf + b * (v.rm - v.rf); }), c: 'var(--accent)', w: 2.4 }].concat(P.map(function (p, i) { return { y: xs.map(function (b) { return Math.abs(b - p.b) < 0.13 ? p.r : NaN; }), c: ['var(--bad)', 'var(--good)', 'var(--warn)'][i], w: 6 }; })), xfmt: function (x) { return 'b ' + x; }, yfmt: function (x) { return x.toFixed(0) + '%'; }, label: 'Security market line and portfolios (dots above the line have positive alpha)' });
      return t + '<p><b>Ranking by Sharpe:</b> ' + rank('sh') + ' &nbsp; <b>Treynor:</b> ' + rank('tr') + ' &nbsp; <b>Jensen:</b> ' + rank('ja') + '</p><div class="leg"><span><i style="background:var(--bad)"></i>A</span><span><i style="background:var(--good)"></i>B</span><span><i style="background:var(--warn)"></i>C</span><span><i style="background:var(--accent)"></i>SML</span></div>' + chart;
    });
    function b() { var m = parseFloat($('#mm', el).value), bt = parseFloat($('#bt', el).value); $('#mmv', el).textContent = m; $('#bo', el).innerHTML = stat('Expected stock move', (m * bt).toFixed(1) + '%') + stat('Reading', bt > 1 ? 'More volatile than market' : bt < 1 ? 'Less volatile than market' : 'Moves with market'); }
    $('#mm', el).addEventListener('input', b); $('#bt', el).addEventListener('input', b); b();
    function s() { var a = $('#rs', el).value.split(',').map(parseFloat).filter(isFinite); $('#so', el).innerHTML = a.length > 1 ? stat('Mean', f.mean(a).toFixed(2) + '%') + stat('Sample SD (n-1)', f.stdev(a).toFixed(2) + '%') + stat('Observations', a.length) : stat('Need', 'two or more values'); }
    $('#rs', el).addEventListener('input', s); s();
  });

  /* 6 Corporate actions */
  lab('corp', 'Corporate actions simulator', 9, 'Bonus, split, consolidation, rights and buyback: what changes and what does not.', function (el) {
    var F = [{ k: 't', l: 'Action', sel: ['Bonus', 'Split', 'Consolidation', 'Rights issue', 'Buyback (tender)'], v: 0 }, { k: 'px', l: 'Price now (Rs)', v: 1000 }, { k: 'held', l: 'Your shares', v: 100 }, { k: 'fv', l: 'Face value (Rs)', v: 10 }, { k: 'a', l: 'Ratio part A (bonus: new per old / split: new per 1 / consol: old per 1 / rights: shares held)', v: 1 }, { k: 'b', l: 'Ratio part B (rights: new shares offered; buyback: % of shares bought back)', v: 1 }, { k: 'rp', l: 'Rights price or buyback price (Rs)', v: 800 }, { k: 'np', l: 'Company net profit (Rs cr)', v: 500 }, { k: 'tsh', l: 'Total shares (cr)', v: 10 }];
    el.innerHTML = ctrls(F) + '<div class="labout"></div>' + tryit('Choose Bonus with A=1: price halves, shares double, your holding value is unchanged. Then pick Rights with A=2, B=1, price Rs 70 on a Rs 100 stock to see ex-rights price Rs 90.');
    bind(el, F, function (v) {
      var h = '', before = v.px * v.held, eps0 = v.np / v.tsh, rows = [];
      if (v.t === 0) { var n = v.a, nh = v.held * (1 + n), np = v.px / (1 + n), ts = v.tsh * (1 + n); rows = [['Shares held', v.held, nh], ['Price', v.px, np], ['Face value', v.fv, v.fv], ['Holding value', before, nh * np], ['EPS', eps0, v.np / ts], ['Total shares (cr)', v.tsh, ts]]; h = '<p class="sub">Bonus capitalises free reserves. No economic gain. Ratio as new shares per share held.</p>'; }
      else if (v.t === 1) { var k = v.a, nh2 = v.held * k; rows = [['Shares held', v.held, nh2], ['Price', v.px, v.px / k], ['Face value', v.fv, v.fv / k], ['Holding value', before, nh2 * v.px / k], ['EPS', eps0, v.np / (v.tsh * k)], ['Total shares (cr)', v.tsh, v.tsh * k]]; h = '<p class="sub">Split cuts face value and raises share count. Share capital unchanged. Liquidity improves.</p>'; }
      else if (v.t === 2) { var k2 = v.a; rows = [['Shares held', v.held, v.held / k2], ['Price', v.px, v.px * k2], ['Face value', v.fv, v.fv * k2], ['Holding value', before, v.held / k2 * v.px * k2], ['EPS', eps0, v.np / (v.tsh / k2)], ['Total shares (cr)', v.tsh, v.tsh / k2]]; h = '<p class="sub">Consolidation is the reverse of a split. Per share figures rise.</p>'; }
      else if (v.t === 3) { var N = v.a, nn = v.b, terp = (N * v.px + nn * v.rp) / (N + nn), ent = Math.floor(v.held / N) * nn, cost = ent * v.rp, rv = v.px - terp; rows = [['Ex-rights price', v.px, terp], ['Entitled new shares', 0, ent], ['Cost to subscribe (Rs)', 0, cost], ['Value of right per existing share (Rs)', 0, rv], ['Holding value if you subscribe', before, (v.held + ent) * terp], ['Net of cash paid', before, (v.held + ent) * terp - cost], ['Holding value if you do nothing', before, v.held * terp]]; h = '<p class="sub">Fully subscribing keeps proportional ownership. Doing nothing loses the value of the right (cum price minus ex-rights price per share). Renouncing sells that value.</p>'; }
      else { var pc = v.b / 100, bought = v.tsh * pc, ts2 = v.tsh - bought, cost2 = bought * v.rp; rows = [['Shares bought back (cr)', 0, bought], ['Shares after (cr)', v.tsh, ts2], ['EPS (Rs)', eps0, v.np / ts2], ['Cash used (Rs cr)', 0, cost2], ['P/E at current price', v.px / eps0, v.px / (v.np / ts2)]]; h = '<p class="sub">Buyback shrinks share count so EPS and BVPS rise even though profit is unchanged. It needs free reserves and a special resolution. Cash used would otherwise earn interest; the table ignores that.</p>'; }
      return '<div class="tw"><table><tr><th>Item</th><th class="n">Before</th><th class="n">After</th></tr>' + rows.map(function (r) { return '<tr><td>' + r[0] + '</td><td class="n">' + fmt(r[1], 2) + '</td><td class="n">' + fmt(r[2], 2) + '</td></tr>'; }).join('') + '</table></div>' + h;
    });
  });

  /* 7 Technical */
  var PAT = [
    { n: 'Hammer', ctx: 'down', c: [[99.5, 100.5, 94, 100]], note: 'Small body at the top, long lower shadow, after a decline: bullish reversal.' },
    { n: 'Hanging man', ctx: 'up', c: [[101, 101.5, 95, 100.5]], note: 'Same shape as a hammer but after a rise: bearish warning.' },
    { n: 'Bullish engulfing', ctx: 'down', c: [[100, 100.5, 97, 97.5], [96.5, 102, 96, 101.5]], note: 'A large green body engulfs the prior red body after a fall.' },
    { n: 'Bearish engulfing', ctx: 'up', c: [[97, 100.5, 96.5, 100], [101, 101.5, 95, 96]], note: 'A large red body engulfs the prior green body after a rise.' },
    { n: 'Morning star', ctx: 'down', c: [[100, 100.5, 94, 94.5], [93, 94, 92, 93.5], [94, 100, 93.5, 99.5]], note: 'Red, small star, green: bullish three candle reversal.' },
    { n: 'Evening star', ctx: 'up', c: [[94, 100, 93.5, 99.5], [101, 102, 100.5, 101.5], [100, 100.5, 94, 94.5]], note: 'Green, small star, red: bearish three candle reversal.' },
    { n: 'Dark cloud cover', ctx: 'up', c: [[95, 100.5, 94.5, 100], [101.5, 102, 96.5, 97]], note: 'Opens above the prior high and closes below the midpoint of the prior green body.' },
    { n: 'Piercing pattern', ctx: 'down', c: [[100, 100.5, 95, 95.5], [94, 98.5, 93.5, 98.5]], note: 'Opens below the prior low and closes above the midpoint of the prior red body.' }
  ];
  function candleSvg(p) {
    var ctx = p.ctx === 'down' ? [[108, 109, 105, 106], [106, 107, 102, 103], [103, 104, 99.5, 100]] : [[88, 90, 87, 89], [89, 93, 88, 92], [92, 96, 91, 94]];
    if (p.ctx === 'up' && (p.n === 'Hanging man')) ctx = [[92, 95, 91, 94], [94, 98, 93, 97], [97, 101, 96, 100]];
    if (p.ctx === 'up' && p.n !== 'Hanging man') ctx = [[84, 87, 83, 86], [86, 90, 85, 89], [89, 93, 88, 92]];
    if (p.ctx === 'down' && p.n !== 'Hammer') ctx = [[110, 111, 106, 107], [107, 108, 103, 104]];
    var all = ctx.concat(p.c), lo = Math.min.apply(null, all.map(function (c) { return c[2]; })) - 1, hi = Math.max.apply(null, all.map(function (c) { return c[1]; })) + 1;
    var W = 300, H = 170, bw = 26, gap = (W - 20) / all.length;
    function Y(v) { return 10 + (H - 20) * (1 - (v - lo) / (hi - lo)); }
    return '<svg class="chart" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Candlestick sequence">' + all.map(function (c, i) { var x = 10 + gap * i + gap / 2, up = c[3] >= c[0], col = up ? 'var(--good)' : 'var(--bad)'; return '<line x1="' + x + '" x2="' + x + '" y1="' + Y(c[1]) + '" y2="' + Y(c[2]) + '" stroke="' + col + '" stroke-width="2"/><rect x="' + (x - bw / 2) + '" y="' + Y(Math.max(c[0], c[3])) + '" width="' + bw + '" height="' + Math.max(2, Math.abs(Y(c[0]) - Y(c[3]))) + '" fill="' + col + '"/>'; }).join('') + '</svg>';
  }
  lab('tech', 'Technical analysis lab', 15, 'Generate a market, switch on indicators, and train your eye on candlestick patterns.', function (el) {
    var F = [{ k: 'seed', l: 'Market seed', v: 7, r: 1, min: 1, max: 40 }, { k: 'dr', l: 'Trend per day %', v: 0.15, r: 1, min: -0.4, max: 0.4, step: 0.05 }, { k: 'vol', l: 'Volatility % per day', v: 1.4, r: 1, min: 0.4, max: 3.5, step: 0.1 }, { k: 'ma', l: 'Overlay', sel: ['EMA 13, 21, 34', 'SMA 20 and 50', 'None'], v: 0 }, { k: 'ct', l: 'Price style', sel: ['Line', 'Candles (last 70)'], v: 0 }];
    el.innerHTML = '<div class="tabs"><button class="on" data-m="m">Market and indicators</button><button data-m="p">Pattern trainer</button></div><div id="mk">' + ctrls(F) + '<div class="labout"></div></div><div id="pt" hidden></div>';
    var tb = NX.$$('.tabs button', el);
    tb.forEach(function (b) { b.onclick = function () { tb.forEach(function (x) { x.classList.toggle('on', x === b); }); $('#mk', el).hidden = b.dataset.m !== 'm'; $('#pt', el).hidden = b.dataset.m !== 'p'; }; });
    function gen(seed, dr, vol) {
      var r = NX.rng(seed * 7919), z = function () { return Math.sqrt(-2 * Math.log(1 - r())) * Math.cos(2 * Math.PI * r()); }, P = [], p = 100, N = 180;
      for (var i = 0; i < N; i++) { var rt = dr / 100 + vol / 100 * z(), o = p, c = p * (1 + rt), hi = Math.max(o, c) * (1 + Math.abs(z()) * vol / 200), lo = Math.min(o, c) * (1 - Math.abs(z()) * vol / 200), v = 1e5 * (1 + Math.abs(rt) * 40) * (0.7 + 0.6 * r()); P.push({ o: o, h: hi, l: lo, c: c, v: v }); p = c; }
      return P;
    }
    function panel(w, h, series, opts) { return NX.svg.line(Object.assign({ w: w, h: h, series: series, pad: { l: 54, r: 12, t: 8, b: 8 } }, opts || {})); }
    bind($('#mk', el), F, function (v) {
      var P = gen(v.seed, v.dr, v.vol), cl = P.map(function (x) { return x.c; }), n = P.length, S = 70, st = n - S;
      var cut = function (a) { return a.slice(st); };
      var rsi = f.rsi(cl, 14), e12 = f.ema(cl, 12), e26 = f.ema(cl, 26), macd = e26.map(function (x, i) { return e12[i] - x; });
      var sig = f.ema(macd.map(function (x) { return isFinite(x) ? x : 0; }), 9).map(function (x, i) { return i < 34 ? NaN : x; });
      var obv = [0]; for (var i = 1; i < n; i++) obv.push(obv[i - 1] + (cl[i] > cl[i - 1] ? P[i].v : cl[i] < cl[i - 1] ? -P[i].v : 0));
      var ov = v.ma === 0 ? [[f.ema(cl, 13), 'var(--accent)', '13 EMA'], [f.ema(cl, 21), 'var(--warn)', '21 EMA'], [f.ema(cl, 34), 'var(--bad)', '34 EMA']] : v.ma === 1 ? [[f.sma(cl, 20), 'var(--accent)', 'SMA 20'], [f.sma(cl, 50), 'var(--bad)', 'SMA 50']] : [];
      var series = [], W = 640, H = 270;
      var lo = Math.min.apply(null, cut(cl)) * 0.98, hi = Math.max.apply(null, cut(P.map(function (x) { return x.h; }))) * 1.02;
      var main;
      if (v.ct === 1) {
        var padL = 54, bw = (W - padL - 12) / S, Y = function (x) { return 12 + (H - 38) * (1 - (x - lo) / (hi - lo)); };
        main = '<svg class="chart" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Candlestick chart">';
        for (var g = 0; g <= 4; g++) { var yv = lo + (hi - lo) * g / 4; main += '<line x1="' + padL + '" x2="' + (W - 12) + '" y1="' + Y(yv) + '" y2="' + Y(yv) + '" stroke="var(--line)"/><text x="' + (padL - 6) + '" y="' + (Y(yv) + 4) + '" text-anchor="end">' + yv.toFixed(0) + '</text>'; }
        P.slice(st).forEach(function (c, i) { var x = padL + bw * i + bw / 2, up = c.c >= c.o, col = up ? 'var(--good)' : 'var(--bad)'; main += '<line x1="' + x + '" x2="' + x + '" y1="' + Y(c.h) + '" y2="' + Y(c.l) + '" stroke="' + col + '"/><rect x="' + (x - bw * 0.35) + '" y="' + Y(Math.max(c.o, c.c)) + '" width="' + bw * 0.7 + '" height="' + Math.max(1, Math.abs(Y(c.o) - Y(c.c))) + '" fill="' + col + '"/>'; });
        ov.forEach(function (o) { var d = ''; cut(o[0]).forEach(function (val, i) { if (isFinite(val)) d += (d ? 'L' : 'M') + (padL + bw * i + bw / 2).toFixed(1) + ' ' + Y(val).toFixed(1); }); main += '<path d="' + d + '" fill="none" stroke="' + o[1] + '" stroke-width="1.6"/>'; });
        main += '</svg>';
      } else {
        main = NX.svg.line({ w: W, h: H, min: lo, max: hi, series: [{ y: cut(cl), c: 'var(--ink)', w: 1.8 }].concat(ov.map(function (o) { return { y: cut(o[0]), c: o[1], w: 1.5 }; })), yfmt: function (x) { return x.toFixed(0); }, label: 'Price with overlays' });
      }
      var rr = NX.svg.line({ w: W, h: 130, min: 0, max: 100, series: [{ y: cut(rsi), c: 'var(--accent)', w: 1.8 }], hlines: [{ y: 70, c: 'var(--bad)', t: '70' }, { y: 30, c: 'var(--good)', t: '30' }], yfmt: function (x) { return x.toFixed(0); }, label: 'RSI 14' });
      var mm = NX.svg.line({ w: W, h: 130, series: [{ y: cut(macd), c: 'var(--accent)', w: 1.8 }, { y: cut(sig), c: 'var(--warn)', w: 1.5 }], hlines: [{ y: 0, c: 'var(--muted)', t: '0' }], yfmt: function (x) { return x.toFixed(1); }, label: 'MACD 12 26 9' });
      var ob = NX.svg.line({ w: W, h: 120, series: [{ y: cut(obv), c: 'var(--accent)', w: 1.8 }, { y: cut(f.sma(obv, 20)), c: 'var(--warn)', w: 1.5 }], yfmt: function (x) { return (x / 1e6).toFixed(1) + 'M'; }, label: 'OBV with 20 period average' });
      var last = n - 1, r = rsi[last], trendTxt = cl[last] > e12[last] && e12[last] > f.ema(cl, 21)[last] && f.ema(cl, 21)[last] > f.ema(cl, 34)[last] ? 'Price > 13 > 21 > 34 EMA: uptrend alignment' : cl[last] < e12[last] && e12[last] < f.ema(cl, 21)[last] && f.ema(cl, 21)[last] < f.ema(cl, 34)[last] ? 'Price < 13 < 21 < 34 EMA: downtrend alignment' : 'Mixed EMA order: no clean trend';
      return out([stat('Last close', cl[last].toFixed(1)), stat('RSI', r.toFixed(0) + (r > 70 ? ' overbought' : r < 30 ? ' oversold' : '')), stat('MACD vs signal', macd[last] > sig[last] ? 'Above (bullish)' : 'Below (bearish)'), stat('EMA order', trendTxt)]) + '<h3>Price</h3>' + (ov.length ? '<div class="leg">' + ov.map(function (o) { return '<span><i style="background:' + o[1] + '"></i>' + o[2] + '</span>'; }).join('') + '</div>' : '') + main + '<h3 style="margin-top:12px">RSI</h3>' + rr + '<h3 style="margin-top:12px">MACD (blue) and signal (amber)</h3>' + mm + '<h3 style="margin-top:12px">OBV</h3>' + ob + '<p class="sub">Experiment: set trend to 0 and volatility high for a range market where RSI works best. Set a strong trend and note RSI staying above 70 for long, and EMAs fanning out.</p>';
    });
    // pattern trainer
    var ps = { i: 0, score: 0, n: 0 }, order = NX.shuffle(PAT.map(function (_, i) { return i; }));
    function pr() {
      var p = PAT[order[ps.i % order.length]], opts = NX.shuffle([p.n].concat(NX.shuffle(PAT.filter(function (x) { return x.n !== p.n; }).map(function (x) { return x.n; })).slice(0, 3)));
      $('#pt', el).innerHTML = '<div class="row"><span class="pill acc">Score ' + ps.score + ' / ' + ps.n + '</span></div><div class="grid g2" style="margin-top:10px"><div>' + candleSvg(p) + '</div><div id="pq"></div></div>';
      NX.askMCQ($('#pq', el), { q: 'Which pattern ends this sequence?', o: opts, a: opts.indexOf(p.n), e: p.note }, { noShuffle: true, onAnswer: function (ok) { ps.n++; if (ok) ps.score++; var b = document.createElement('button'); b.className = 'btn pri'; b.textContent = 'Next pattern'; b.style.marginTop = '10px'; b.onclick = function () { ps.i++; pr(); }; $('#pq', el).appendChild(b); } });
    }
    pr();
  });

  /* 8 Industry */
  lab('porter', 'Industry lab: five forces and market sizing', 6, 'Score an industry on Porter\'s forces and size a market from the organised segment.', function (el) {
    var F = [{ k: 'ri', l: 'Rivalry intensity (1 low to 5 high)', v: 4, r: 1, min: 1, max: 5 }, { k: 'su', l: 'Threat of substitutes', v: 2, r: 1, min: 1, max: 5 }, { k: 'bb', l: 'Buyer power', v: 3, r: 1, min: 1, max: 5 }, { k: 'sp', l: 'Supplier power', v: 3, r: 1, min: 1, max: 5 }, { k: 'ne', l: 'Threat of new entrants (low barriers = high)', v: 2, r: 1, min: 1, max: 5 }];
    el.innerHTML = ctrls(F) + '<div class="labout"></div><h3 style="margin-top:14px">Market sizing</h3><div class="ctrl"><label class="f">Organised players revenue (Rs cr, total)<input id="or" type="number" value="24000"></label><label class="f">Unorganised share of total %<input id="us" type="number" value="20"></label></div><div id="mo" class="out"></div>' + tryit('Set rivalry to 5 and watch the attractiveness score fall: high rivalry means lower pricing power and lower incomes. For sizing, the workbook tyre case gives Rs 30,000 crore.');
    bind(el, F, function (v) {
      var vals = [['Rivalry', v.ri], ['Substitutes', v.su], ['Buyers', v.bb], ['Suppliers', v.sp], ['Entrants', v.ne]], avg = vals.reduce(function (a, x) { return a + x[1]; }, 0) / 5, score = Math.round((5 - avg) / 4 * 100);
      var cx = 150, cy = 120, R = 90, pts = vals.map(function (x, i) { var a = -Math.PI / 2 + i * 2 * Math.PI / 5, r = R * x[1] / 5; return [cx + r * Math.cos(a), cy + r * Math.sin(a)]; });
      var ring = [1, 2, 3, 4, 5].map(function (k) { return '<polygon points="' + vals.map(function (_, i) { var a = -Math.PI / 2 + i * 2 * Math.PI / 5; return (cx + R * k / 5 * Math.cos(a)) + ',' + (cy + R * k / 5 * Math.sin(a)); }).join(' ') + '" fill="none" stroke="var(--line)"/>'; }).join('');
      var lab_ = vals.map(function (x, i) { var a = -Math.PI / 2 + i * 2 * Math.PI / 5; return '<text x="' + (cx + (R + 24) * Math.cos(a)) + '" y="' + (cy + (R + 14) * Math.sin(a) + 4) + '" text-anchor="middle">' + x[0] + '</text>'; }).join('');
      var svg = '<svg class="chart" viewBox="0 0 300 250" role="img" aria-label="Five forces radar" style="max-width:360px">' + ring + '<polygon points="' + pts.map(function (p) { return p.join(','); }).join(' ') + '" fill="var(--accent)" fill-opacity=".25" stroke="var(--accent)" stroke-width="2"/>' + lab_ + '</svg>';
      return out([stat('Industry attractiveness (0 to 100)', score), stat('Pricing power', avg >= 3.6 ? 'Weak' : avg >= 2.6 ? 'Moderate' : 'Strong'), stat('Profit outlook', avg >= 3.6 ? 'Competed away' : avg >= 2.6 ? 'Average' : 'Above average')]) + svg;
    });
    function ms() { var o = parseFloat($('#or', el).value), u = parseFloat($('#us', el).value) / 100; $('#mo', el).innerHTML = u < 1 ? stat('Estimated total market (Rs cr)', fmt(o / (1 - u), 0)) + stat('Unorganised (Rs cr)', fmt(o / (1 - u) * u, 0)) : stat('Total', 'n/a'); }
    $('#or', el).addEventListener('input', ms); $('#us', el).addEventListener('input', ms); ms();
  });

  /* 9 Regulation */
  var SCN = [
    ['A research analyst buys shares of a company she covers 20 days before her report is published.', false, 'Not allowed within 30 days before and 5 days after publication.'],
    ['An analyst sells a covered stock 10 days after publication, when her report recommended buying it.', false, 'The 5 day post window has passed, but trading contrary to her own recommendation is prohibited.'],
    ['An analyst discloses that her relative owns 1.2% of the subject company at the end of the preceding month.', true, 'Ownership of 1% or more by the analyst, entity, associates or relatives must be disclosed.'],
    ['Investment banking staff attend the analyst\'s call with a prospective client about a deal.', false, 'Analysts must not communicate with clients in presence of banking personnel about a banking transaction.'],
    ['The research entity publishes on an IPO issuer 30 days after pricing, having been a co-manager, without any approval.', false, 'The bar is 40 days for an IPO unless compliance gives prior written approval.'],
    ['An analyst keeps recommendation rationale, signed reports and client communications for 5 years.', true, 'Minimum retention is 5 years.'],
    ['A report is shared with the sales desk and a favoured client before general release.', false, 'Reports cannot be made available selectively in advance.'],
    ['An RA uses AI tools in research and tells clients the extent of use.', true, 'Disclosure of the extent of AI use is required and the RA stays responsible.'],
    ['An analyst promises a favourable review to a company in return for a business relationship.', false, 'Prohibited under regulation 18.'],
    ['A person outside India issues reports on listed Indian securities through an agreement with a registered RA.', true, 'Regulation 4 requires exactly such an agreement.']
  ];
  lab('reg', 'Regulation lab: windows and scenario checker', 14, 'Compute blackout dates and test yourself on allowed or prohibited conduct.', function (el) {
    var today = new Date().toISOString().slice(0, 10);
    el.innerHTML = '<div class="ctrl"><label class="f">Report publication date<input id="pd" type="text" value="' + today + '"></label><label class="f">IPO or FPO pricing date<input id="ipo" type="text" value="' + today + '"></label></div><div id="ro"></div><h3 style="margin-top:14px">Allowed or prohibited?</h3><div id="sq" class="card"></div>';
    function add(d, n) { var x = new Date(d); x.setDate(x.getDate() + n); return x.toISOString().slice(0, 10); }
    function ro() { var p = $('#pd', el).value, i = $('#ipo', el).value; if (isNaN(Date.parse(p)) || isNaN(Date.parse(i))) { $('#ro', el).innerHTML = '<div class="trap">Use YYYY-MM-DD.</div>'; return; } $('#ro', el).innerHTML = '<h3>Personal trading blackout</h3>' + out([stat('Blackout starts (30 days before)', add(p, -30)), stat('Blackout ends (5 days after)', add(p, 5))]) + '<h3>Research quiet period for an issue you managed</h3>' + out([stat('IPO manager (40 days)', 'until ' + add(i, 40)), stat('FPO manager (10 days)', 'until ' + add(i, 10)), stat('IPO underwriter (25 days)', 'until ' + add(i, 25))]); }
    $('#pd', el).addEventListener('input', ro); $('#ipo', el).addEventListener('input', ro); ro();
    var k = 0, order = NX.shuffle(SCN.map(function (_, i) { return i; })), sc = 0, tot = 0;
    function nxt() {
      var s = SCN[order[k % order.length]];
      var q = { q: s[0], o: ['Allowed or required', 'Prohibited'], a: s[1] ? 0 : 1, e: s[2] };
      var box = $('#sq', el); box.innerHTML = '<span class="pill acc">Score ' + sc + ' / ' + tot + '</span><div id="sqq" style="margin-top:8px"></div>';
      NX.askMCQ($('#sqq', el), q, { noShuffle: true, onAnswer: function (ok) { tot++; if (ok) sc++; var b = document.createElement('button'); b.className = 'btn pri'; b.textContent = 'Next scenario'; b.style.marginTop = '10px'; b.onclick = function () { k++; nxt(); }; $('#sqq', el).appendChild(b); } });
    }
    nxt();
  });

  /* 10 Macro */
  lab('macro', 'Macro shock simulator', 5, 'Pick a shock and see the usual direction of impact on bonds, equities and sectors.', function (el) {
    var M = [
      ['RBI raises repo rate', { 'Bond prices': 'Fall', 'Equity valuations': 'Pressure (higher discount rate)', 'Banks': 'Mixed: margin up, bond book loses', 'Real estate and autos': 'Negative (loan costs up)', 'Inflation': 'Tends to ease', 'Rupee': 'Supportive'}],
      ['RBI cuts repo rate', { 'Bond prices': 'Rise', 'Equity valuations': 'Supportive', 'Banks': 'Treasury gains, margins squeezed', 'Real estate and autos': 'Positive', 'Inflation': 'Risk of rising', 'Rupee': 'Can weaken'}],
      ['Rupee depreciates 5%', { 'Bond prices': 'Pressure if inflation rises', 'Equity valuations': 'Mixed', 'IT and pharma exporters': 'Positive', 'Oil marketers, electronics importers': 'Negative', 'Inflation': 'Imported inflation rises', 'Trade deficit': 'Import bill rises'}],
      ['Crude oil spikes', { 'Bond prices': 'Fall (inflation and deficit fears)', 'Equity valuations': 'Negative', 'Airlines, paints, tyres': 'Negative (input costs)', 'Upstream oil producers': 'Positive', 'Inflation': 'Rises', 'Rupee': 'Weakens'}],
      ['Fiscal deficit widens with more borrowing', { 'Bond prices': 'Fall (more supply, higher yields)', 'Equity valuations': 'Mixed', 'Private credit': 'Crowding out risk', 'Infrastructure and capex plays': 'Positive if spending rises', 'Inflation': 'Risk if demand overheats', 'Rupee': 'Can weaken'}],
      ['Strong monsoon', { 'FMCG, tractors, fertiliser': 'Positive (rural demand)', 'Food inflation': 'Eases', 'Bond prices': 'Rise (lower inflation)', 'Equity valuations': 'Supportive', 'GDP growth': 'Upward', 'Rupee': 'Neutral to positive' }],
      ['FPI outflows surge', { 'Equity valuations': 'Pressure', 'Rupee': 'Weakens', 'Bond prices': 'Pressure', 'Domestic flows': 'May cushion falls', 'Banks': 'Large caps hit', 'Volatility': 'Rises' }]
    ];
    el.innerHTML = '<div class="tabs">' + M.map(function (m, i) { return '<button data-i="' + i + '"' + (i === 0 ? ' class="on"' : '') + '>' + m[0] + '</button>'; }).join('') + '</div><div id="mo2"></div><h3 style="margin-top:14px">Real return calculator</h3><div class="ctrl"><label class="f">Nominal return %<input id="nr" type="number" value="8" step="0.5"></label><label class="f">Inflation %<input id="inf" type="number" value="7" step="0.5"></label></div><div id="rr" class="out"></div>';
    function show(i) { NX.$$('.tabs button', el).forEach(function (b) { b.classList.toggle('on', +b.dataset.i === i); }); var o = M[i][1]; $('#mo2', el).innerHTML = '<div class="tw"><table><tr><th>Variable</th><th>Usual direction</th></tr>' + Object.keys(o).map(function (k) { return '<tr><td>' + k + '</td><td>' + o[k] + '</td></tr>'; }).join('') + '</table></div><p class="sub">Directions are typical, not guaranteed. Magnitude depends on what was already priced in.</p>'; }
    NX.$$('.tabs button', el).forEach(function (b) { b.onclick = function () { show(+b.dataset.i); }; }); show(0);
    function rr() { var n = parseFloat($('#nr', el).value) / 100, i = parseFloat($('#inf', el).value) / 100; $('#rr', el).innerHTML = stat('Approx real return (nominal - inflation)', ((n - i) * 100).toFixed(2) + '%') + stat('Exact real return', (((1 + n) / (1 + i) - 1) * 100).toFixed(2) + '%'); }
    $('#nr', el).addEventListener('input', rr); $('#inf', el).addEventListener('input', rr); rr();
  });

  /* 11 Hedge */
  lab('hedge', 'Commodity hedging lab', 11, 'See how a futures hedge fixes your price and where basis risk leaks in.', function (el) {
    var F = [{ k: 'who', l: 'You are a', sel: ['Producer (fears price falls)', 'Consumer (fears price rises)'], v: 0 }, { k: 'spot', l: 'Spot today (Rs)', v: 70000 }, { k: 'fut', l: 'Futures entry (Rs)', v: 70500 }, { k: 'qty', l: 'Quantity (units)', v: 1 }, { k: 'chg', l: 'Spot change at expiry %', v: -8, r: 1, min: -25, max: 25 }, { k: 'basis', l: 'Basis at expiry (futures minus spot, Rs)', v: 400, step: 50 }];
    el.innerHTML = ctrls(F) + '<div class="labout"></div>' + tryit('Producer: sell futures and drag spot down: hedge gain offsets lower sale price. Then change the closing basis away from the entry basis to see basis risk.');
    bind(el, F, function (v) {
      var s1 = v.spot * (1 + v.chg / 100), f1 = s1 + v.basis, sign = v.who === 0 ? 1 : -1, gain = sign * (v.fut - f1) * v.qty, unh = s1 * v.qty, hed = v.who === 0 ? unh + gain : unh - gain;
      var xs = [], un = [], hd = [];
      for (var c = -25; c <= 25; c += 5) { var ss = v.spot * (1 + c / 100), ff = ss + v.basis, g = sign * (v.fut - ff) * v.qty; xs.push(c); un.push(ss * v.qty); hd.push(v.who === 0 ? ss * v.qty + g : ss * v.qty - g); }
      return out([stat('Spot at expiry', fmt(s1, 0)), stat('Futures gain / loss', fmt(gain, 0)), stat(v.who === 0 ? 'Effective sale value (hedged)' : 'Effective purchase cost (hedged)', fmt(hed, 0)), stat('Unhedged', fmt(unh, 0)), stat('Entry basis', fmt(v.fut - v.spot, 0))]) + '<div class="leg"><span><i style="background:var(--muted)"></i>Unhedged</span><span><i style="background:var(--accent)"></i>Hedged</span></div>' + NX.svg.line({ xs: xs, series: [{ y: un, c: 'var(--muted)', dash: '4 3' }, { y: hd, c: 'var(--accent)', w: 2.4 }], xfmt: function (x) { return x + '%'; }, yfmt: function (x) { return fmt(x, 0); }, label: 'Outcome against spot change' }) + '<p class="sub">When closing basis equals entry basis the hedged line is flat. Any difference is basis risk.</p>';
    });
  });
})();
