(function () {
var Q = NX.Q;
NX.deep(12, [
{ t: 'Deep dive: measuring risk (SD, beta, duration, delta, VaR) and the critique of beta', h:
'<div class="tw"><table><tr><th>Lens</th><th>Measure</th><th>Detail</th></tr>' +
'<tr><td>Statistical</td><td><b>Standard deviation</b></td><td>Variability of returns around the mean; sample SD = sqrt(sum (X - mean)^2 / (n - 1)).</td></tr>' +
'<tr><td>Sensitivity (elasticity: % change in outcome per % change in risk factor)</td><td><b>Beta</b></td><td>Sensitivity of stock return to index return; proxy for <b>systematic/market</b> risk.</td></tr>' +
'<tr><td></td><td><b>Modified duration</b></td><td>Sensitivity of bond price to small changes in rates; <b>interest rate risk</b>.</td></tr>' +
'<tr><td></td><td><b>Delta</b></td><td>Sensitivity of option price to small change in the underlying; market risk.</td></tr>' +
'<tr><td>Loss</td><td><b>Value at Risk (VaR)</b></td><td>Maximum loss over a period at a confidence level. VaR(1%) = 12% means 99% confidence loss will not exceed 12%; a 1% chance it will. <b>Confidence level = 1 - significance level.</b></td></tr></table></div>' +
'<h4>Beta</h4><ul><li>Beta 1: moves with the market (10% market return, 10% stock). Below 1: less volatile. Above 1: more volatile. Beta 1.2 with market +15% gives <b>+18%</b>. Used in CAPM.</li><li><b>Klarman\'s critique:</b> one number from past price swings cannot describe risk; ignores fundamentals and price level (IBM at $50 is safer than at $100); ignores investor influence (proxy contests, control); assumes symmetric up and down; past volatility does not reliably predict future.</li></ul>' },

{ t: 'Deep dive: sensitivity analysis, margin of safety, equity vs bond returns', h:
'<ul><li><b>Sensitivity analysis:</b> change one critical input at a time, holding others constant, and tabulate the effect. In DCF, run multiple discount rates. <b>Scenario analysis</b> adds best, worst and most likely cases. Output is only as good as inputs.</li><li><b>Margin of safety</b> (Graham, Buffett): gap between intrinsic value and (lower) price; wider is safer. It cushions against error in a subjective valuation but <b>does not guarantee</b> success. No universal width; each investor decides.</li></ul>' +
'<div class="tw"><table><tr><th>Bonds</th><th>Equity</th></tr><tr><td>Returns mainly coupon, plus price gains when rates fall; lower risk because payout is pre-defined and may be secured; main risk is default (higher credit risk, higher interest)</td><td>Returns mainly appreciation; dividend is a small, uncertain component; price depends on company performance and external economy</td></tr></table></div>' +
'<p><b>Buffett:</b> compare expected stock return with bond return when deploying capital: buy whichever is higher. In distress, rates fall sharply and equities can be very cheap even on dividend yield.</p>' },

{ t: 'Deep dive: risk-adjusted returns (Jensen, Sharpe, Treynor)', h:
'<p>High-risk strategies tend to earn more but are more volatile, so compare <b>risk-adjusted</b> returns.</p>' +
'<div class="tw"><table><tr><th>Measure</th><th>Formula</th><th>Risk used</th><th>Suits</th></tr>' +
'<tr><td><b>Jensen\'s alpha</b></td><td>Rp - [Rf + beta x (Rm - Rf)]</td><td>Systematic (beta) via CAPM</td><td>Excess return over CAPM expectation; higher is better</td></tr>' +
'<tr><td><b>Sharpe</b></td><td>(Rp - Rf) / standard deviation</td><td><b>Total</b> risk</td><td>Investors with a large share of wealth in one investment, not well diversified</td></tr>' +
'<tr><td><b>Treynor</b></td><td>(Rp - Rf) / beta</td><td><b>Systematic</b> risk</td><td>Well-diversified investors</td></tr></table></div>' +
'<p><b>Worked:</b> Rp 15%, Rf 6%, Rm 12%, beta 1.2, SD 18%. Jensen = 15 - (6 + 1.2 x 6) = <b>1.8%</b>. Sharpe = 9/18 = <b>0.5</b>. Treynor = 9/1.2 = <b>7.5</b>.</p>' },

{ t: 'Deep dive: behavioural biases, market cycles, investor wisdom, stock liquidity', h:
'<p>Standard theory assumes rational wealth-maximisers; reality includes emotion. Graham: markets are more psychological than logical. Awareness of bias builds defences.</p>' +
'<div class="tw"><table><tr><th>Bias</th><th>Meaning and manifestation</th></tr>' +
'<tr><td><b>Loss aversion</b></td><td>Strongly prefer avoiding losses to gaining; pain of loss is about <b>twice</b> the pleasure of an equal gain; inaction, holding losers, frequent portfolio checks</td></tr>' +
'<tr><td><b>Confirmation</b> ("my side")</td><td>Seek and favour information that confirms beliefs; inventing a new reason when the original thesis fails</td></tr>' +
'<tr><td><b>Ownership</b> (endowment)</td><td>Overvalue what you own; hold what you would not buy now</td></tr>' +
'<tr><td><b>Gambler\'s fallacy</b></td><td>Expect random sequences to "balance out" or see trends where none exist</td></tr>' +
'<tr><td><b>Winner\'s curse</b></td><td>Win a competitive bid by overpaying: behavioural win, financial loss</td></tr>' +
'<tr><td><b>Herd mentality</b></td><td>Follow others under uncertainty; bubbles and crashes; small investors enter when overheated. Keynes: better for reputations to fail conventionally than succeed unconventionally.</td></tr>' +
'<tr><td><b>Anchoring</b></td><td>Over-rely on first information (past price, "right price" to sell); decide on today\'s price-value gap, not past prices. <b>Can prevent benefiting from market corrections</b> (exam item).</td></tr>' +
'<tr><td><b>Projection</b></td><td>Project the recent past into the distant future, ignoring the distant past</td></tr></table></div>' +
'<h4>Market cycles and the wisdom</h4><ul><li><b>Bull:</b> expansion, optimism, excess liquidity; prices overshoot intrinsic value; firms over-borrow; input and interest costs rise at the peak; correction follows. <b>Bear:</b> demand falls, costs rise, capital scarce; sellers quit in despair; prices fall below intrinsic value; buyers return; central banks cut rates, starting the next bull.</li><li><b>Mr. Market</b> (Graham): a moody partner quoting daily prices; do not let his emotions drive yours; exploit his mispricing.</li><li>Graham: short run a voting machine, long run a weighing machine. Munger: good investing makes better managers. Dreman: psychology matters most. Templeton: invest at maximum pessimism. Lynch: pick a business any idiot can run. Schloss: if no value, hold cash. Buffett: Rule 1 never lose money; Rule 2 never forget Rule 1.</li></ul>' +
'<h4>Measuring liquidity of a share</h4><ul><li><b>Stock turnover ratio</b> = shares traded in a period (usually a year) / free-float shares. Free float = shares held by <b>non-promoter</b> shareholders.</li><li><b>Traded value turnover ratio</b> = traded value / market capitalisation.</li></ul>' }
]);
NX.deepQ(12, [
 Q('VaR(1%) of 12% means', ['12% loss is certain', '99% confidence that loss will not exceed 12%', '1% confidence of 12% gain', '12% is the average loss'], 1, 'Confidence level = 1 - significance level.'),
 Q('Modified duration measures', ['Equity market risk', 'Bond price sensitivity to rates', 'Option sensitivity', 'Credit risk'], 1, 'Beta is for equities; delta is for options.'),
 Q('Beta 1.2 with market up 15% suggests stock return of about', ['12%', '15%', '18%', '1.2%'], 2, '1.2 x 15% = 18%.'),
 Q('Which is a criticism of beta by value investors?', ['It is too complex', 'It uses past price volatility and ignores fundamentals and price level', 'It assumes losses only', 'It excludes the market'], 1, 'Klarman: one number from past fluctuations cannot describe risk.'),
 Q('Sensitivity analysis changes', ['All inputs together', 'One critical variable at a time, holding others constant', 'Only the output', 'Only the discount rate permanently'], 1, 'Scenario analysis adds best, worst and most likely cases.'),
 Q('Margin of safety', ['Guarantees success', 'Is the gap between intrinsic value and lower price, cushioning valuation error', 'Is fixed at 30%', 'Is the same as beta'], 1, 'No universal width; each investor picks one.'),
 Q('Sharpe ratio uses', ['Beta', 'Standard deviation (total risk)', 'Duration', 'EBITDA'], 1, '(Rp - Rf) / SD; suits investors who are not diversified.'),
 Q('Treynor ratio suits', ['Concentrated investors', 'Well-diversified investors', 'Traders only', 'Bond investors only'], 1, '(Rp - Rf) / beta.'),
 Q('Jensen\'s alpha = ', ['Rp - Rf', 'Rp - [Rf + beta x (Rm - Rf)]', '(Rp - Rf) / beta', 'Rm - Rf'], 1, 'Excess return over CAPM expected return.'),
 Q('Rp 15%, Rf 6%, Rm 12%, beta 1.2. Jensen\'s alpha is', ['1.8%', '3%', '9%', '0%'], 0, '15 - (6 + 1.2 x 6) = 1.8%.'),
 Q('Rp 15%, Rf 6%, SD 18%. Sharpe is', ['0.5', '0.83', '2', '1.5'], 0, '9 / 18 = 0.5.'),
 Q('Holding losers and avoiding action due to fear of loss is', ['Herd behaviour', 'Loss aversion', 'Projection', 'Winner\'s curse'], 1, 'Pain of loss is about twice the pleasure of gain.'),
 Q('Inventing a new reason to keep a stock after the first fails is', ['Anchoring', 'Confirmation bias', 'Gambler\'s fallacy', 'Herd mentality'], 1, 'Seeking information to justify a position.'),
 Q('Waiting for the old "right price" to sell despite new information is', ['Anchoring', 'Ownership bias', 'Loss aversion', 'Projection'], 0, 'It can stop investors benefiting from market corrections.'),
 Q('Winning a competitive bid by overpaying is', ['Herd mentality', 'Winner\'s curse', 'Ownership bias', 'Anchoring'], 1, 'A behavioural win but a financial loss.'),
 Q('Mr. Market parable teaches investors to', ['Follow Mr. Market', 'Exploit his emotional mispricing without adopting his emotions', 'Avoid equities', 'Ignore value'], 1, 'Graham\'s allegory.'),
 Q('Stock turnover ratio = shares traded /', ['Total shares', 'Free-float shares (non-promoter)', 'Promoter shares', 'Market cap'], 1, 'Usually measured over one year.'),
 Q('Traded value turnover ratio = traded value /', ['Free float', 'Market capitalisation', 'Book value', 'Revenue'], 1, 'Similar to stock turnover but in value terms.')
]);
})();
