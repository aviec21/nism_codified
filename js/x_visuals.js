/* Visual explainers: interactive diagrams tied to chapters */
(function () {
var V = NX.visuals = [], esc = NX.esc;
function add(id, ch, title, desc, render) { V.push({ id: id, ch: ch, title: title, desc: desc, render: render }); }
function ctrls(box, specs, draw) {
  var h = '<div class="ctrl">' + specs.map(function (s, i) { return '<label class="f">' + s.l + ': <b class="mono" id="vv' + i + '"></b><input type="range" min="' + s.min + '" max="' + s.max + '" step="' + (s.step || 1) + '" value="' + s.v + '" data-i="' + i + '"></label>'; }).join('') + '</div><div class="vout"></div>';
  box.innerHTML = h; var out = box.querySelector('.vout'), ins = box.querySelectorAll('input');
  function go() { var v = []; ins.forEach(function (x, i) { v.push(+x.value); box.querySelector('#vv' + i).textContent = x.value + (specs[i].u || ''); }); out.innerHTML = draw(v); }
  ins.forEach(function (x) { x.oninput = go; }); go();
}
function T(x, y, s, o) { o = o || {}; return '<text x="' + x + '" y="' + y + '" text-anchor="' + (o.a || 'middle') + '"' + (o.b ? ' font-weight="600"' : '') + (o.c ? ' fill="' + o.c + '"' : '') + '>' + s + '</text>'; }
function R(x, y, w, h, fill, o) { o = o || {}; return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + (o.r == null ? 6 : o.r) + '" fill="' + fill + '"' + (o.s ? ' stroke="' + o.s + '"' : '') + '/>'; }
function SVG(w, h, body, label) { return '<svg class="chart dg" viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="' + esc(label) + '">' + body + '</svg>'; }

/* 1 Income statement waterfall */
add('waterfall', 8, 'Income statement waterfall', 'See how revenue shrinks into profit after tax. Move the sliders to see which cost line matters most.', function (box) {
  ctrls(box, [{ l: 'Revenue', min: 5000, max: 15000, step: 100, v: 9582 }, { l: 'Cost of goods %', min: 30, max: 80, v: 58 }, { l: 'Other opex %', min: 2, max: 30, v: 10 }, { l: 'D&A', min: 100, max: 1500, step: 50, v: 600 }, { l: 'Interest', min: 0, max: 1000, step: 20, v: 380 }, { l: 'Tax %', min: 0, max: 40, v: 25 }], function (v) {
    var rev = v[0], cogs = rev * v[1] / 100, gp = rev - cogs, opx = rev * v[2] / 100, ebitda = gp - opx, ebit = ebitda - v[3], pbt = ebit - v[4], tax = Math.max(0, pbt) * v[5] / 100, pat = pbt - tax;
    var steps = [['Revenue', rev, 'tot'], ['COGS', -cogs], ['Gross profit', gp, 'tot'], ['Opex', -opx], ['EBITDA', ebitda, 'tot'], ['D&A', -v[3]], ['EBIT', ebit, 'tot'], ['Interest', -v[4]], ['PBT', pbt, 'tot'], ['Tax', -tax], ['PAT', pat, 'tot']];
    var W = 760, H = 300, pl = 10, bw = (W - 20) / steps.length, mx = rev * 1.05, s = '', run = 0;
    function Y(x) { return 20 + (H - 70) * (1 - Math.max(0, x) / mx); }
    steps.forEach(function (st, i) {
      var x = pl + i * bw + 6, w = bw - 12, y1, y2, col;
      if (st[2] === 'tot') { run = st[1]; y1 = Y(run); y2 = Y(0); col = 'var(--accent)'; } else { y1 = Y(run); run += st[1]; y2 = Y(run); col = 'var(--bad)'; }
      s += R(x, Math.min(y1, y2), w, Math.max(2, Math.abs(y2 - y1)), col, { r: 3 }) + T(x + w / 2, Math.min(y1, y2) - 5, Math.round(st[1]).toLocaleString('en-IN')) + T(x + w / 2, H - 28, st[0]);
    });
    return SVG(W, H, s, 'Income statement waterfall') + '<div class="out"><div class="stat"><b>' + NX.pct(ebitda / rev) + '</b><span>EBITDA margin</span></div><div class="stat"><b>' + NX.pct(ebit / rev) + '</b><span>EBIT margin</span></div><div class="stat"><b>' + NX.pct(pat / rev) + '</b><span>Net margin</span></div><div class="stat"><b>' + (v[4] ? NX.fmt(ebit / v[4], 1) + 'x' : 'n/a') + '</b><span>Interest cover</span></div></div>';
  });
});

/* 2 DuPont */
add('dupont', 8, 'DuPont tree', 'ROE is the product of three drivers. Change one and see which route lifts returns.', function (box) {
  ctrls(box, [{ l: 'Net margin', min: 2, max: 25, step: .5, v: 14, u: '%' }, { l: 'Asset turnover', min: .3, max: 3, step: .05, v: 1.17, u: 'x' }, { l: 'Equity multiplier', min: 1, max: 5, step: .05, v: 1.9, u: 'x' }], function (v) {
    var roe = v[0] / 100 * v[1] * v[2], roa = v[0] / 100 * v[1];
    var s = R(280, 10, 200, 46, 'var(--accent)', {}) + T(380, 38, 'ROE ' + NX.pct(roe), { c: 'var(--accent-ink)', b: 1 });
    s += '<path d="M380 56 V76 M130 76 H640 M130 76 V96 M380 76 V96 M640 76 V96" stroke="var(--line)" fill="none" stroke-width="2"/>';
    [[30, 'Net margin', 'PAT / Revenue', NX.pct(v[0] / 100), 'profitability'], [280, 'Asset turnover', 'Revenue / Assets', v[1].toFixed(2) + 'x', 'efficiency'], [540, 'Equity multiplier', 'Assets / Equity', v[2].toFixed(2) + 'x', 'leverage']].forEach(function (b) {
      s += R(b[0], 96, 200, 78, 'var(--surface2)', { s: 'var(--line)' }) + T(b[0] + 100, 120, b[1], { b: 1 }) + T(b[0] + 100, 138, b[2]) + T(b[0] + 100, 158, b[3] + ' (' + b[4] + ')', { c: 'var(--accent)', b: 1 });
    });
    s += T(380, 208, 'ROA = margin x turnover = ' + NX.pct(roa) + '; ROE = ROA x equity multiplier', { c: 'var(--muted)' });
    return SVG(760, 224, s, 'DuPont tree') + '<p class="sub">Same ROE can come from a thin margin with fast turnover (retail) or fat margin with slow turnover (software). A high multiplier lifts ROE but adds risk.</p>';
  });
});

/* 3 Cash flow buckets */
add('cashflow', 8, 'Cash flow statement buckets', 'Where each item lands: operating, investing or financing. The classic exam trap.', function (box) {
  var cols = [['Operating', 'var(--good)', ['Profit before tax adjusted for non cash items', 'Depreciation added back', 'Change in receivables, inventory, payables', 'Tax paid']], ['Investing', 'var(--warn)', ['Purchase or sale of fixed assets (capex)', 'Purchase or sale of investments', 'Interest and dividends received (Ind AS option)']], ['Financing', 'var(--accent)', ['Borrowings raised or repaid', 'Equity issued or bought back', 'Dividends paid', 'Interest paid (Ind AS option)']]];
  var s = ''; cols.forEach(function (c, i) { var x = 10 + i * 250; s += R(x, 10, 236, 40, c[1], {}) + T(x + 118, 36, c[0], { c: '#fff', b: 1 }); c[2].forEach(function (t, j) { s += R(x, 58 + j * 52, 236, 44, 'var(--surface2)', { s: 'var(--line)' }); var w = t.match(/.{1,34}(\s|$)/g) || [t]; w.slice(0, 2).forEach(function (ln, k) { s += T(x + 118, 76 + j * 52 + k * 15, ln.trim()); }); }); });
  box.innerHTML = SVG(760, 280, s, 'Cash flow buckets') + '<div class="kp">Net change in cash = operating + investing + financing. Funds borrowed during the year appear in financing; a change in finished goods inventory is a working capital adjustment, not a financing item.</div>';
});

/* 4 Porter */
add('porter', 6, 'Porter\'s five forces', 'Tap a force to read what drives it. Strong forces squeeze industry profitability.', function (box) {
  var F = { rivals: ['Rivalry among existing competitors', 'Intense when many similar sized firms, slow growth, high fixed costs, low switching costs and high exit barriers.'], new: ['Threat of new entrants', 'Falls with economies of scale, brand loyalty, capital needs, regulation and access to distribution.'], sub: ['Threat of substitutes', 'Rises when alternatives offer similar value at lower price or switching is easy.'], sup: ['Bargaining power of suppliers', 'High when few suppliers, unique inputs, or high switching costs for the buyer.'], buy: ['Bargaining power of buyers', 'High when buyers are few and large, products are standard, and switching is cheap.'] };
  var pos = { new: [260, 10], sup: [10, 110], rivals: [260, 110], buy: [510, 110], sub: [260, 210] };
  var s = '<path d="M380 60 V110 M380 160 V210 M240 135 H260 M500 135 H510" stroke="var(--line)" stroke-width="2"/>';
  Object.keys(pos).forEach(function (k) { s += '<g class="pf" data-k="' + k + '" style="cursor:pointer">' + R(pos[k][0], pos[k][1], 240, 50, k === 'rivals' ? 'var(--accent)' : 'var(--surface2)', { s: 'var(--line)' }) + T(pos[k][0] + 120, pos[k][1] + 30, F[k][0].replace(' of ', '<tspan> of </tspan>'), { c: k === 'rivals' ? 'var(--accent-ink)' : '', b: 1 }) + '</g>'; });
  box.innerHTML = SVG(760, 270, s, 'Five forces') + '<div class="kp" id="pfx">Select a force.</div>';
  box.querySelectorAll('.pf').forEach(function (g) { g.onclick = function () { var f = F[g.dataset.k]; box.querySelector('#pfx').innerHTML = '<b>' + f[0] + '.</b> ' + f[1]; }; });
});

/* 5 Industry life cycle */
add('lifecycle', 6, 'Industry life cycle', 'Growth, margins and valuation behave differently in each stage.', function (box) {
  var pts = []; for (var i = 0; i <= 100; i++) { var x = i / 100, y = 1 / (1 + Math.exp(-10 * (x - .4))); if (x > .75) y -= (x - .75) * .9; pts.push([40 + x * 680, 200 - y * 170]); }
  var d = 'M' + pts.map(function (p) { return p[0].toFixed(1) + ' ' + p[1].toFixed(1); }).join('L');
  var st = [['Introduction', 40, 190, 'Losses, high risk, small base'], ['Growth', 220, 330, 'Fast sales, rising margins, capex heavy'], ['Maturity', 330, 560, 'Slower growth, cash generation, consolidation'], ['Decline', 560, 720, 'Falling demand, exits, harvesting']];
  var s = ''; st.forEach(function (a, i) { s += R(a[1], 8, a[2] - a[1], 224, ['var(--surface2)', 'var(--accent-soft)', 'var(--good-soft)', 'var(--bad-soft)'][i], { r: 0 }) + T((a[1] + a[2]) / 2, 26, a[0], { b: 1 }); });
  s += '<path d="' + d + '" fill="none" stroke="var(--accent)" stroke-width="3"/>' + T(380, 252, 'Time', { c: 'var(--muted)' });
  box.innerHTML = SVG(760, 262, s, 'Industry life cycle') + '<div class="tw"><table><tr>' + st.map(function (a) { return '<th>' + a[0] + '</th>'; }).join('') + '</tr><tr>' + st.map(function (a) { return '<td>' + a[3] + '</td>'; }).join('') + '</tr></table></div>';
});

/* 6 Business cycle */
add('bizcycle', 5, 'Business cycle and sector leadership', 'Expansion, peak, contraction, trough, with typical policy and sector behaviour.', function (box) {
  var pts = []; for (var i = 0; i <= 120; i++) { var x = i / 120; pts.push([30 + x * 700, 120 - 70 * Math.sin(x * Math.PI * 2 - .6) - 20 * x]); }
  var s = '<line x1="30" x2="730" y1="110" y2="110" stroke="var(--line)" stroke-dasharray="4 4"/><path d="M' + pts.map(function (p) { return p[0].toFixed(1) + ' ' + p[1].toFixed(1); }).join('L') + '" fill="none" stroke="var(--accent)" stroke-width="3"/>';
  [['Expansion', 150, 190, 'Credit grows, cyclicals lead'], ['Peak', 330, 30, 'Inflation up, rates rising'], ['Contraction', 520, 190, 'Defensives outperform'], ['Trough', 690, 230, 'Rate cuts, early cyclicals recover']].forEach(function (a) { s += T(a[1], a[2], a[0], { b: 1 }) + T(a[1], a[2] + 15, a[3], { c: 'var(--muted)' }); });
  box.innerHTML = SVG(760, 260, s, 'Business cycle') + '<div class="kp">Monetary policy usually tightens near the peak to fight inflation and eases in contraction. Leading indicators turn before GDP; lagging indicators such as unemployment turn after.</div>';
});

/* 7 Bond price vs yield */
add('bond', 10, 'Bond price versus yield', 'The curve bends: price rises more for a yield fall than it drops for a rise (convexity). Longer maturity and lower coupon mean higher duration.', function (box) {
  ctrls(box, [{ l: 'Coupon', min: 0, max: 14, step: .5, v: 8, u: '%' }, { l: 'Years to maturity', min: 1, max: 30, v: 10 }, { l: 'Yield', min: 2, max: 16, step: .25, v: 8, u: '%' }], function (v) {
    var cp = v[0] / 100, n = v[1], y0 = v[2] / 100, pts = [], mn = 1e9, mx = 0;
    for (var y = 0.02; y <= 0.16001; y += 0.005) { var p = NX.fin.bondPrice(100, cp, y, n, 1); pts.push([y, p]); mn = Math.min(mn, p); mx = Math.max(mx, p); }
    var W = 760, H = 270, pl = 54, X = function (y) { return pl + (W - pl - 14) * (y - .02) / .14; }, Y = function (p) { return 14 + (H - 44) * (1 - (p - mn) / (mx - mn)); };
    var s = '', k; for (k = 0; k <= 4; k++) { var pv = mn + (mx - mn) * k / 4; s += '<line x1="' + pl + '" x2="' + (W - 14) + '" y1="' + Y(pv) + '" y2="' + Y(pv) + '" stroke="var(--line)"/>' + T(pl - 6, Y(pv) + 4, pv.toFixed(0), { a: 'end' }); }
    for (k = 2; k <= 16; k += 2) s += T(X(k / 100), H - 10, k + '%');
    s += '<path d="M' + pts.map(function (p) { return X(p[0]).toFixed(1) + ' ' + Y(p[1]).toFixed(1); }).join('L') + '" fill="none" stroke="var(--accent)" stroke-width="3"/>';
    var P = NX.fin.bondPrice(100, cp, y0, n, 1), mac = NX.fin.macaulay(100, cp, y0, n, 1), md = mac / (1 + y0);
    var sl = function (y) { return P * (1 - md * (y - y0)); };
    s += '<line x1="' + X(.02) + '" y1="' + Y(sl(.02)) + '" x2="' + X(.16) + '" y2="' + Y(sl(.16)) + '" stroke="var(--warn)" stroke-dasharray="5 4" stroke-width="2"/><circle cx="' + X(y0) + '" cy="' + Y(P) + '" r="6" fill="var(--bad)"/>';
    var up = NX.fin.bondPrice(100, cp, y0 + .01, n, 1), dn = NX.fin.bondPrice(100, cp, y0 - .01, n, 1);
    return SVG(W, H, s, 'Bond price versus yield') + '<div class="leg"><span><i style="background:var(--accent)"></i>actual price</span><span><i style="background:var(--warn)"></i>duration line (linear estimate)</span></div><div class="out"><div class="stat"><b>' + P.toFixed(2) + '</b><span>Price (face 100)</span></div><div class="stat"><b>' + mac.toFixed(2) + '</b><span>Macaulay duration (yrs)</span></div><div class="stat"><b>' + md.toFixed(2) + '</b><span>Modified duration</span></div><div class="stat"><b>+' + ((dn / P - 1) * 100).toFixed(2) + '% / ' + ((up / P - 1) * 100).toFixed(2) + '%</b><span>Price move for -1% / +1% yield</span></div></div>';
  });
});

/* 8 Risk return, two assets */
add('frontier', 12, 'Diversification and the two asset frontier', 'Lower correlation bends the curve to the left: same return, less risk.', function (box) {
  ctrls(box, [{ l: 'Correlation', min: -1, max: 1, step: .05, v: .3 }, { l: 'Asset A stdev', min: 5, max: 40, v: 22, u: '%' }, { l: 'Asset B stdev', min: 3, max: 30, v: 10, u: '%' }], function (v) {
    var rA = 14, rB = 7, sA = v[1], sB = v[2], rho = v[0], pts = [], minv = { s: 1e9 };
    for (var w = 0; w <= 1.0001; w += .02) { var s = Math.sqrt(w * w * sA * sA + (1 - w) * (1 - w) * sB * sB + 2 * w * (1 - w) * rho * sA * sB), r = w * rA + (1 - w) * rB; pts.push([s, r, w]); if (s < minv.s) minv = { s: s, r: r, w: w }; }
    var W = 760, H = 270, pl = 50, mxs = Math.max(sA, sB) * 1.1, X = function (s) { return pl + (W - pl - 20) * s / mxs; }, Y = function (r) { return 14 + (H - 44) * (1 - (r - 5) / 11); };
    var g = '', k; for (k = 0; k <= 4; k++) { var rv = 5 + 11 * k / 4; g += '<line x1="' + pl + '" x2="' + (W - 20) + '" y1="' + Y(rv) + '" y2="' + Y(rv) + '" stroke="var(--line)"/>' + T(pl - 6, Y(rv) + 4, rv.toFixed(0) + '%', { a: 'end' }); }
    g += '<line x1="' + X(sB) + '" y1="' + Y(rB) + '" x2="' + X(sA) + '" y2="' + Y(rA) + '" stroke="var(--muted)" stroke-dasharray="4 4"/>';
    g += '<path d="M' + pts.map(function (p) { return X(p[0]).toFixed(1) + ' ' + Y(p[1]).toFixed(1); }).join('L') + '" fill="none" stroke="var(--accent)" stroke-width="3"/>';
    g += '<circle cx="' + X(sA) + '" cy="' + Y(rA) + '" r="6" fill="var(--bad)"/>' + T(X(sA) - 10, Y(rA) - 10, 'A', { a: 'end' }) + '<circle cx="' + X(sB) + '" cy="' + Y(rB) + '" r="6" fill="var(--good)"/>' + T(X(sB) + 10, Y(rB) + 16, 'B', { a: 'start' }) + '<circle cx="' + X(minv.s) + '" cy="' + Y(minv.r) + '" r="6" fill="var(--warn)"/>' + T(X(minv.s) + 10, Y(minv.r) + 4, 'minimum variance', { a: 'start' }) + T(W / 2, H - 6, 'Risk (standard deviation %)');
    return SVG(W, H, g, 'Two asset frontier') + '<div class="leg"><span>Dashed line: what you would get at correlation +1 (no diversification benefit)</span></div><p class="sub">Minimum variance mix: ' + Math.round(minv.w * 100) + '% in A, risk ' + minv.s.toFixed(1) + '%, return ' + minv.r.toFixed(1) + '%. At correlation -1 risk can fall to zero.</p>';
  });
});

/* 9 Normal bands */
add('normal', 12, 'Normal distribution and standard deviation bands', 'About 68% of outcomes within one sigma, 95% within two. Real returns have fatter tails.', function (box) {
  ctrls(box, [{ l: 'Mean return', min: -5, max: 25, v: 12, u: '%' }, { l: 'Standard deviation', min: 3, max: 40, v: 18, u: '%' }], function (v) {
    var W = 760, H = 250, mu = v[0], sg = v[1], lo = -4 * 40 + mu, hi = 4 * 40 + mu, X = function (x) { return 20 + (W - 40) * (x - (mu - 4 * sg)) / (8 * sg); }, y0 = 210, hgt = 170;
    var pdf = function (z) { return Math.exp(-z * z / 2); }, s = '';
    [[2, 'var(--accent-soft)'], [1, 'var(--accent)']].forEach(function (b) { var d = 'M' + X(mu - b[0] * sg) + ' ' + y0; for (var z = -b[0]; z <= b[0] + .001; z += .1) d += 'L' + X(mu + z * sg).toFixed(1) + ' ' + (y0 - hgt * pdf(z)).toFixed(1); s += '<path d="' + d + 'L' + X(mu + b[0] * sg) + ' ' + y0 + 'Z" fill="' + b[1] + '" opacity="' + (b[0] === 1 ? .55 : 1) + '"/>'; });
    var d2 = 'M'; for (var z = -4; z <= 4.001; z += .1) d2 += X(mu + z * sg).toFixed(1) + ' ' + (y0 - hgt * pdf(z)).toFixed(1) + 'L'; s += '<path d="' + d2.slice(0, -1) + '" fill="none" stroke="var(--ink)" stroke-width="2"/>';
    [-2, -1, 0, 1, 2].forEach(function (z) { s += '<line x1="' + X(mu + z * sg) + '" x2="' + X(mu + z * sg) + '" y1="' + y0 + '" y2="' + (y0 + 5) + '" stroke="var(--muted)"/>' + T(X(mu + z * sg), y0 + 20, (mu + z * sg).toFixed(0) + '%'); });
    return SVG(W, H, s, 'Normal distribution') + '<div class="out"><div class="stat"><b>' + (mu - sg).toFixed(0) + '% to ' + (mu + sg).toFixed(0) + '%</b><span>about 68% of outcomes</span></div><div class="stat"><b>' + (mu - 1.96 * sg).toFixed(0) + '% to ' + (mu + 1.96 * sg).toFixed(0) + '%</b><span>about 95% of outcomes</span></div><div class="stat"><b>' + (mu - 1.65 * sg).toFixed(0) + '%</b><span>5% worst case (one tailed)</span></div></div>';
  });
});

/* 10 Regulator map */
add('regmap', 14, 'Indian securities market regulatory map', 'Tap a box for its role. SEBI sits at the centre for capital markets.', function (box) {
  var N = { mof: ['Ministry of Finance', 'Government policy and legislation; the Department of Economic Affairs and Revenue sit here.'], sebi: ['SEBI', 'Regulates securities markets under the SEBI Act 1992: protects investors, develops and regulates the market. Registers intermediaries including research analysts.'], rbi: ['RBI', 'Central bank. Monetary policy, banks, government securities, forex.'], irdai: ['IRDAI', 'Regulates insurance.'], pfrda: ['PFRDA', 'Regulates pension funds and the NPS; promotes old age income security.'], mii: ['Exchanges, depositories, clearing corporations', 'Market infrastructure institutions. Their bye-laws differ across exchanges and need SEBI approval.'], mid: ['Intermediaries', 'Brokers, merchant bankers, mutual funds, advisers, research analysts and others registered with SEBI.'], ra: ['Research analysts', 'Registered under the SEBI (Research Analysts) Regulations 2014; supervised by the recognised body (RAASB).'], sat: ['SAT', 'Securities Appellate Tribunal hears appeals against SEBI orders.'] };
  var P = { mof: [270, 8, 220], sebi: [270, 74, 220], rbi: [10, 74, 160], irdai: [10, 140, 160], pfrda: [10, 206, 160], mii: [60, 140, 0], sat: [590, 74, 150], mid: [270, 150, 220], ra: [270, 216, 220] };
  delete P.mii; P.mii = [530, 150, 220];
  var s = '<path d="M380 54 V74 M380 120 V150 M380 196 V216 M490 97 H590" stroke="var(--line)" stroke-width="2"/><path d="M490 173 H530" stroke="var(--line)" stroke-width="2"/>';
  Object.keys(P).forEach(function (k) { var p = P[k]; s += '<g class="rg" data-k="' + k + '" style="cursor:pointer">' + R(p[0], p[1], p[2] || 220, 46, k === 'sebi' ? 'var(--accent)' : 'var(--surface2)', { s: 'var(--line)' }) + T(p[0] + (p[2] || 220) / 2, p[1] + 28, N[k][0], { c: k === 'sebi' ? 'var(--accent-ink)' : '', b: 1 }) + '</g>'; });
  box.innerHTML = SVG(760, 270, s, 'Regulatory map') + '<div class="kp" id="rgx">Select a box.</div>';
  box.querySelectorAll('.rg').forEach(function (g) { g.onclick = function () { var n = N[g.dataset.k]; box.querySelector('#rgx').innerHTML = '<b>' + n[0] + '.</b> ' + n[1]; }; });
});

/* 11 Dow theory */
add('dow', 15, 'Dow Theory: three trends and three phases', 'A primary bull trend with secondary corrections and tertiary noise, split into accumulation, participation and distribution.', function (box) {
  var pts = [], rnd = NX.rng(7); for (var i = 0; i <= 150; i++) { var x = i / 150, base = 200 - 150 * x, sec = 22 * Math.sin(x * 28) * 0.6, ter = 5 * Math.sin(x * 160) + (rnd() - .5) * 4; pts.push([30 + x * 700, base + sec + ter]); }
  var d = 'M' + pts.map(function (p) { return p[0].toFixed(1) + ' ' + p[1].toFixed(1); }).join('L');
  var s = R(30, 10, 233, 230, 'var(--surface2)', { r: 0 }) + R(263, 10, 234, 230, 'var(--accent-soft)', { r: 0 }) + R(497, 10, 233, 230, 'var(--warn-soft)', { r: 0 }) + T(146, 28, 'Accumulation', { b: 1 }) + T(380, 28, 'Public participation', { b: 1 }) + T(613, 28, 'Distribution', { b: 1 });
  s += '<path d="' + d + '" fill="none" stroke="var(--accent)" stroke-width="2"/><line x1="30" y1="215" x2="730" y2="62" stroke="var(--ink)" stroke-dasharray="6 5" stroke-width="2"/>' + T(150, 230, 'smart money buys quietly', { c: 'var(--muted)' }) + T(380, 230, 'momentum, news, broad buying', { c: 'var(--muted)' }) + T(613, 230, 'smart money sells, retail buys late', { c: 'var(--muted)' });
  box.innerHTML = SVG(760, 252, s, 'Dow theory') + '<div class="tw"><table><tr><th>Trend</th><th>Duration</th><th>In the picture</th></tr><tr><td>Primary</td><td>A year or more</td><td>The dashed line</td></tr><tr><td>Secondary</td><td>Weeks to months, retraces one third to two thirds</td><td>The big swings</td></tr><tr><td>Tertiary</td><td>Days to weeks</td><td>The small wiggles</td></tr></table></div>';
});

/* 12 Candlesticks */
add('candles', 15, 'Candlestick anatomy and reversal patterns', 'Green means close above open. Look at the body, the shadows and where in a trend the pattern appears.', function (box) {
  function C(x, o, h, l, c, sc) { var up = c <= o, col = up ? 'var(--good)' : 'var(--bad)', t = Math.min(o, c), b = Math.max(o, c); return '<line x1="' + x + '" x2="' + x + '" y1="' + h + '" y2="' + l + '" stroke="' + col + '" stroke-width="2"/><rect x="' + (x - 7) + '" y="' + t + '" width="14" height="' + Math.max(2, b - t) + '" fill="' + col + '"/>'; }
  var pats = [['Hammer', 'after a fall, long lower shadow, small body', [[60, 84, 70, 116, 72]]], ['Hanging man', 'after a rise, same shape, needs a lower close next', [[60, 72, 70, 116, 84]]], ['Bullish engulfing', 'green body swallows the red body', [[50, 60, 52, 90, 86], [80, 94, 40, 98, 40]]], ['Bearish engulfing', 'red body swallows the green body', [[50, 84, 40, 90, 46], [80, 38, 38, 98, 96]]], ['Piercing', 'green closes above midpoint of red', [[50, 40, 36, 96, 90], [82, 104, 58, 108, 60]]], ['Dark cloud cover', 'red closes below midpoint of green', [[50, 90, 36, 96, 40], [82, 30, 24, 96, 88]]], ['Morning star', 'red, small body, green', [[40, 40, 34, 92, 86], [70, 100, 90, 106, 96], [100, 94, 40, 98, 44]]], ['Evening star', 'green, small body, red', [[40, 90, 34, 96, 40], [70, 30, 24, 40, 32], [100, 34, 30, 98, 92]]]];
  var cols = 4, s = '';
  pats.forEach(function (p, i) { var ox = (i % cols) * 190, oy = Math.floor(i / cols) * 210; s += '<g transform="translate(' + ox + ',' + oy + ')">' + R(4, 4, 180, 200, 'var(--surface)', { s: 'var(--line)' }) + T(94, 24, p[0], { b: 1 }); p[2].forEach(function (c, j) { var x = c[0] + 4, sh = 6; s += C(x + 20, c[1] + sh + 10, c[2] + sh + 10, c[3] + sh + 10, c[4] + sh + 10); }); var w = p[1].match(/.{1,26}(\s|$)/g) || [p[1]]; w.forEach(function (ln, k) { s += T(94, 168 + k * 14, ln.trim(), { c: 'var(--muted)' }); }); s += '</g>'; });
  box.innerHTML = SVG(760, 424, s, 'Candlestick patterns') + '<div class="kp">Hammer and hanging man look identical; the prior trend decides which one it is. Both need a confirming candle before you act.</div>';
});

/* 13 Triangle breakout */
add('triangle', 15, 'Triangle breakout and profit target', 'Target equals the triangle\'s thickest height added to the breakout price.', function (box) {
  ctrls(box, [{ l: 'Triangle height (Rs)', min: 10, max: 80, v: 40 }, { l: 'Breakout price (Rs)', min: 300, max: 700, step: 5, v: 520 }], function (v) {
    var s = '<line x1="40" y1="70" x2="440" y2="70" stroke="var(--bad)" stroke-width="2"/><line x1="40" y1="190" x2="440" y2="80" stroke="var(--good)" stroke-width="2"/>';
    var pts = [[40, 190], [80, 74], [120, 160], [160, 72], [200, 140], [240, 71], [280, 118], [330, 72], [380, 90], [440, 68], [500, 44], [560, 30]];
    s += '<path d="M' + pts.map(function (p) { return p.join(' '); }).join('L') + '" fill="none" stroke="var(--ink)" stroke-width="2"/>';
    s += '<line x1="40" x2="40" y1="70" y2="190" stroke="var(--warn)" stroke-width="2"/>' + T(52, 135, 'height ' + v[0], { a: 'start', c: 'var(--warn)' }) + T(240, 55, 'flat resistance (ascending triangle)') + T(250, 205, 'rising support') + '<line x1="440" x2="640" y1="68" y2="68" stroke="var(--muted)" stroke-dasharray="4 4"/><line x1="440" x2="640" y1="28" y2="28" stroke="var(--accent)" stroke-dasharray="4 4"/>' + T(640, 62, 'breakout ' + v[1], { a: 'end' }) + T(640, 22, 'target ' + (v[1] + v[0]), { a: 'end', c: 'var(--accent)', b: 1 });
    return SVG(700, 225, s, 'Triangle breakout') + '<p class="sub">Ascending triangle: higher lows against flat resistance, a bullish continuation. A downside break would give a target of ' + (v[1] - v[0]) + '. Volume should rise on the breakout.</p>';
  });
});
})();
