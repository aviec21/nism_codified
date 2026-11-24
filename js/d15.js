(function () {
var Q = NX.Q;
NX.deep(15, [
{ t: 'Deep dive: philosophy of technical analysis, and chart types', h:
'<h4>Five assumptions</h4><ol><li><b>Price discounts everything</b>: economic, political and psychological information is already in the price; the analyst studies price and volume only.</li><li><b>Price moves in trends</b> (up, down, sideways); an established trend is more likely to continue than reverse.</li><li><b>History repeats</b>: behaviour is cyclical and driven by psychology, so patterns recur.</li><li><b>Market action is predictable to a degree</b>: probabilistic, about managing risk, not guaranteeing outcomes.</li><li><b>Volume confirms price</b>: high volume on breakouts and reversals adds credibility.</li></ol>' +
'<div class="tw"><table><tr><th></th><th>Technical analysis</th><th>Fundamental analysis</th></tr>' +
'<tr><td>Focus</td><td>Price action and market behaviour</td><td>Intrinsic value</td></tr>' +
'<tr><td>Data</td><td>Historic price and volume</td><td>Financial statements, economic reports, industry publications</td></tr>' +
'<tr><td>Horizon</td><td>Short to medium term trading</td><td>Long term investing</td></tr>' +
'<tr><td>Tools</td><td>Chart patterns, RSI, MAs, MACD, OBV</td><td>Cash flow, DCF, SWOT, ratios</td></tr>' +
'<tr><td>Assumption</td><td>Market price captures all information; trend likely to continue</td><td>Prices may deviate from intrinsic value</td></tr>' +
'<tr><td>Used by</td><td>Traders, chartists, speculators</td><td>Fund managers, value and long term investors</td></tr></table></div>' +
'<h4>Chart types</h4><div class="tw"><table><tr><th>Chart</th><th>Shows</th><th>Best for</th></tr>' +
'<tr><td>Line</td><td><b>Closing prices</b> only, as a continuous line</td><td>Quick trend view, long term; misses open, high, low</td></tr>' +
'<tr><td>Bar (OHLC)</td><td>Open, high, low, close per period</td><td>Detailed price action, volatility, range, directional bias</td></tr>' +
'<tr><td>Candlestick</td><td>OHLC with colour coded real bodies and shadows</td><td>Patterns (Doji, Hammer, Engulfing) and market psychology</td></tr>' +
'<tr><td>Point and Figure</td><td>Price moves only; <b>ignores time and volume</b></td><td>Breakout levels, support and resistance, filters noise, long term trends</td></tr>' +
'<tr><td>Renko</td><td>Fixed size <b>bricks</b>, not time</td><td>Trend clarity, momentum, trailing stops; smooths minor moves</td></tr>' +
'<tr><td>Heikin-Ashi</td><td>Candles built from <b>averaged</b> price data</td><td>Trend following, staying in trades, filtering whipsaws</td></tr></table></div>' +
'<div class="trap"><b>Exam trap:</b> point and figure ignores time and volume; renko ignores time; line charts use closes only.</div>' },

{ t: 'Deep dive: Dow Theory and the three trends in depth', h:
'<p>Developed by <b>Charles Dow</b> in editorials between 1900 and 1902; formalised by <b>William Hamilton and Robert Rhea</b>.</p>' +
'<h4>Six tenets</h4><ol><li><b>Market discounts everything</b> (consistent with EMH).</li><li><b>Three trends</b>: primary, secondary, tertiary.</li><li><b>Primary trends have three phases</b>: accumulation (smart money enters quietly), public participation (momentum builds, broad market joins), distribution (smart money exits while retail enters late). Mirrors Wyckoff.</li><li><b>Indices must confirm each other</b> (for example Nifty and Sensex moving together).</li><li><b>Volume confirms the trend</b>: it should expand in the direction of the primary trend.</li><li><b>Trends persist until a clear reversal.</b></li></ol>' +
'<div class="tw"><table><tr><th></th><th>Primary</th><th>Secondary</th><th>Tertiary</th></tr>' +
'<tr><td>Duration</td><td><b>One year or more</b></td><td>Weeks to months (about 3 weeks to 3 months, sometimes more)</td><td>Days to weeks (under 3 weeks, some say up to 6)</td></tr>' +
'<tr><td>Nature</td><td>Bull, bear or sideways</td><td>Counter move within primary: <b>correction</b> in a bull market (often 10 to 20%), <b>rally</b> in a bear market</td><td>Short term noise, moves with or against primary or secondary</td></tr>' +
'<tr><td>Drivers</td><td>Economic cycles, monetary and fiscal policy, geopolitics, psychology</td><td>Data releases, central bank shifts, geopolitics, earnings surprises, technical exhaustion</td><td>News, earnings, technical triggers</td></tr>' +
'<tr><td>Volume</td><td>Rises with the trend</td><td>Typically <b>lower</b>, signalling lack of conviction</td><td>Spikes on breakouts, less reliable</td></tr>' +
'<tr><td>Tools</td><td>50 or 100 DMA, trendlines, MACD, higher highs and higher lows</td><td>Fibonacci retracement (38.2, 50, 61.8%), trendlines and channels, 50 DMA, volume, RSI and Stochastic</td><td>5, 10, 20 day EMAs, RSI, candlesticks, pivots</td></tr></table></div>' +
'<ul><li>Secondary retracement is typically <b>one third to two thirds</b> of the prior primary move (Dow Theory).</li><li>Primary sentiment: bull = confidence and expansion; bear = fear and contraction; sideways = neutral or uncertain. Bull markets favour breakout buying and growth stocks; bears favour defensives, hedging, short selling.</li><li>Secondary trends digest gains or losses, shake out weak hands and reset overbought or oversold readings.</li><li>Tertiary risks: noise, whipsaws and overtrading (transaction costs). Long term investors usually ignore them.</li><li>Example in the text: Nifty 50 in 2020 to 2021, primary bullish recovery post COVID with a roughly 7% correction in Sep to Oct 2020 before new highs.</li></ul>' +
'<div class="kp"><b>Remember:</b> a secondary move becomes a reversal only if it turns into a structural change.</div>' },

{ t: 'Deep dive: candlestick reversal patterns', h:
'<div class="tw"><table><tr><th>Pattern</th><th>Where</th><th>Anatomy</th><th>Confirmation</th></tr>' +
'<tr><td><b>Hanging Man</b> (bearish)</td><td>After an up move</td><td>Small real body, lower shadow at least <b>2x the body</b>, little or no upper shadow; close may be above or below open</td><td>Next candle must <b>close lower</b>; exit longs or enter shorts after confirmation</td></tr>' +
'<tr><td><b>Hammer</b> (bullish)</td><td>After a decline</td><td>Same shape; sellers absorbed and buyers push price back near the open</td><td>Price must start rising after it; trade after confirmation</td></tr>' +
'<tr><td><b>Bullish Engulfing</b></td><td>After a downtrend; stronger after <b>four or more red candles</b></td><td>Small red candle followed by a large green whose body <b>engulfs</b> the red body</td><td>Read with preceding candles</td></tr>' +
'<tr><td><b>Bearish Engulfing</b></td><td>Anywhere, more significant after an advance</td><td>Red body engulfs the prior green body; both ideally long relative to neighbours</td><td>Ignore in choppy markets; real bodies matter, not shadows</td></tr>' +
'<tr><td><b>Dark Cloud Cover</b></td><td>Near top of a congestion area, in an uptrend</td><td>Bullish candle, then a <b>gap up</b> that turns bearish and closes <b>below the midpoint</b> of the first</td><td></td></tr>' +
'<tr><td><b>Piercing</b></td><td>Near bottom of a congestion area</td><td>Red candle, then green opening with a significant gap down; green body covers <b>at least half</b> of the red</td><td></td></tr>' +
'<tr><td><b>Morning Star</b> (bullish)</td><td>After a downtrend</td><td>Three candles: tall red, small body with long wicks (indecision), tall green</td><td>Third candle confirms</td></tr>' +
'<tr><td><b>Evening Star</b> (bearish)</td><td>Within an uptrend</td><td>Large green, small body (red or green) closing above it, then large red opening below the middle candle and closing near the centre of the first body</td><td></td></tr></table></div>' +
'<ul><li>Hammer and Hanging Man look identical; <b>context</b> (prior trend) decides which is which.</li><li>A <b>congestion area</b> is a price range traded repeatedly for weeks before a breakout or breakdown.</li><li>Dark Cloud Cover and Piercing are <b>two-candle</b> patterns; Morning and Evening Star are <b>three-candle</b>.</li></ul>' },

{ t: 'Deep dive: consolidation and continuation patterns', h:
'<div class="tw"><table><tr><th>Pattern</th><th>Formation</th><th>Reading</th></tr>' +
'<tr><td><b>Symmetrical triangle</b> (also called a wedge)</td><td>Converging trendlines; consolidation before a forced move</td><td>Break of upper line starts a bullish trend; break of lower line starts a bearish one</td></tr>' +
'<tr><td><b>Ascending triangle</b></td><td>Series of <b>higher lows</b> against flat resistance</td><td>Bullish continuation in an uptrend; buying pressure strengthening</td></tr>' +
'<tr><td><b>Descending triangle</b></td><td><b>Lower highs</b> against flat support</td><td>Bearish continuation in a downtrend; bears press toward the support line</td></tr>' +
'<tr><td><b>Flag</b> (rectangle) and <b>Pennant</b> (small triangle)</td><td>Sideways or slightly lower drift after a sharp rally; the rally is the <b>flagpole</b></td><td>Breakout above the upper line signals continuation; traded alike</td></tr></table></div>' +
'<ul><li>Triangle trendlines need at least <b>two swing highs and two swing lows</b>.</li><li>Long if price breaks above the top; short if it breaks below the lower line.</li><li><b>Profit target</b> = height of the triangle at its thickest point added to or subtracted from the breakout point.</li></ul>' +
'<div class="fx"><b>Worked example.</b> Triangle thickest height Rs 40, upside breakout at Rs 520: target = 520 + 40 = Rs 560. A downside break at Rs 480 gives 480 - 40 = Rs 440.</div>' +
'<div class="trap"><b>Exam trap:</b> ascending and descending triangles are <b>continuation</b> patterns here; the symmetrical triangle can break either way.</div>' }
]);
NX.deepQ(15, [
 Q('Which chart ignores both time and volume?', ['Line', 'Candlestick', 'Point and Figure', 'Bar'], 2, 'It tracks price moves only.'),
 Q('A line chart plots', ['OHLC', 'Closing prices', 'Highs only', 'Averaged candles'], 1, 'It cannot show intraday range.'),
 Q('Heikin-Ashi charts are built from', ['Fixed bricks', 'Averaged price data', 'Closing prices only', 'Volume'], 1, 'They reduce noise and whipsaws.'),
 Q('Which is NOT a Dow Theory tenet?', ['Market discounts everything', 'Indices must confirm each other', 'Volume is irrelevant', 'Trends persist until a clear reversal'], 2, 'Volume must confirm the trend.'),
 Q('Primary trend duration is typically', ['Days', 'Weeks', 'A year or more', 'Hours'], 2, 'Secondary lasts weeks to months.'),
 Q('Dow Theory secondary retracement is typically', ['5 to 10%', 'One third to two thirds of the prior move', 'Fully 100%', 'Always 50%'], 1, 'Fibonacci levels 38.2, 50 and 61.8% are common tools.'),
 Q('Distribution phase is when', ['Smart money buys', 'Smart money exits as retail enters late', 'Volume dries up', 'Indices diverge'], 1, 'Third phase of a primary trend.'),
 Q('Volume in a secondary trend is typically', ['Higher than the primary', 'Lower, showing lack of conviction', 'Zero', 'Unrelated'], 1, 'Declining volume suggests the correction is temporary.'),
 Q('Hanging Man is valid only if', ['It appears after a decline', 'The next candle closes lower', 'It has a long upper shadow', 'Volume falls'], 1, 'Else it is just a warning.'),
 Q('Bullish engulfing is stronger when preceded by', ['Two green candles', 'Four or more red candles', 'A gap', 'No trend'], 1, 'Context matters.'),
 Q('Dark Cloud Cover closes', ['Above the previous high', 'Below the midpoint of the previous bullish candle', 'At the open', 'Above the midpoint'], 1, 'After a gap up near the top of congestion.'),
 Q('Piercing pattern green body must cover', ['The entire red body', 'At least half of the red body', 'A quarter', 'Nothing'], 1, 'Near the bottom of a congestion area.'),
 Q('Triangle profit target is', ['Triangle width', 'Triangle height at its thickest point from the breakout', 'Half the height', 'Previous high'], 1, 'Added or subtracted depending on direction.'),
 Q('An ascending triangle is formed by', ['Lower highs and flat support', 'Higher lows against flat resistance', 'Parallel lines', 'Equal highs and lows'], 1, 'Bullish continuation.'),
 Q('The sharp move before a flag is the', ['Flagpole', 'Wedge', 'Base', 'Neckline'], 0, 'Flags and pennants are traded alike.'),
 Q('Technical analysis differs from fundamental in assuming', ['Price is unrelated to information', 'Price already reflects all relevant information', 'Volume is noise', 'Value never matters'], 1, 'First assumption: price discounts everything.')
]);
})();
