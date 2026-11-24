/* Case-based question sets (exam: 5 cases x 4 questions) */
var Q = NX.Q;
NX.cases = [
{ title: 'Case 1: Valuing Sunrise Foods', stem: '<p>Sunrise Foods Ltd (FMCG, mature). Net profit Rs 120 crore. Shares outstanding 10 crore. Market price Rs 180. Dividend per share Rs 3.60. Net worth Rs 600 crore. Debt Rs 300 crore. Cash Rs 100 crore. EBITDA Rs 260 crore. Expected EPS growth 12% a year.</p>',
 qs: [
 Q('Sunrise\'s P/E is', ['10x', '15x', '18x', '22.5x'], 1, 'EPS = 120/10 = Rs 12. P/E = 180/12 = 15x.'),
 Q('Using the same data, the enterprise value (market cap + debt - cash) is', ['Rs 1,800 cr', 'Rs 2,000 cr', 'Rs 1,900 cr', 'Rs 2,200 cr'], 2, 'Market cap = 180 x 10 cr = 1,800. EV = 1,800 + 300 - 100 = 2,000 cr.'),
 Q('Dividend yield and payout ratio are', ['2%; 30%', '3%; 20%', '2%; 20%', '3.6%; 30%'], 0, 'Yield = 3.6/180 = 2%. Payout = 3.6/12 = 30%.'),
 Q('PEG ratio is', ['1.25', '0.8', '15', '1.8'], 0, 'P/E 15 divided by growth 12 = 1.25. Above 1 so not clearly undervalued.')
 ] },
{ title: 'Case 2: Rights issue at Orbit Motors', stem: '<p>Orbit Motors trades at Rs 400. It announces a 1-for-4 rights issue at Rs 300 per share. Radha owns 400 shares. Existing share count is 4 crore. Promoters hold 60%.</p>',
 qs: [
 Q('Number of rights shares Radha is entitled to', ['50', '100', '400', '25'], 1, '1 for every 4 held: 400/4 = 100.'),
 Q('Theoretical ex-rights price', ['Rs 400', 'Rs 380', 'Rs 360', 'Rs 340'], 1, '(4 x 400 + 1 x 300)/5 = 1,900/5 = Rs 380.'),
 Q('Funds the company raises if fully subscribed', ['Rs 300 crore', 'Rs 400 crore', 'Rs 120 crore', 'Rs 100 crore'], 0, 'New shares = 1 crore at Rs 300 = Rs 300 crore.'),
 Q('If Radha does not subscribe nor renounce her entitlement, her shareholding is', ['Unchanged in percentage', 'Diluted', 'Increased', 'Converted to bonus'], 1, 'Share count rises; her percentage falls.')
 ] },
{ title: 'Case 3: Meridian Steel, DuPont and leverage', stem: '<p>Meridian Steel (capital intensive). Year 1: Sales 10,000, PAT 600, Total assets 8,000, Equity 4,000. Year 2: Sales 11,000, PAT 770, Total assets 8,800, Equity 3,520 (after a debt funded buyback). EBIT Year 2: 1,500; interest Year 2: 500.</p>',
 qs: [
 Q('ROE in Year 1', ['6%', '7.5%', '15%', '12%'], 2, '600/4,000 = 15%.'),
 Q('ROE in Year 2', ['7%', '17.5%', '21.9%', '25%'], 2, '770/3,520 = 21.9%.'),
 Q('Main driver of the ROE jump (net margin 6.0% to 7.0%, turnover 1.25 to 1.25)', ['Higher asset turnover', 'Higher leverage together with a margin gain', 'Lower tax', 'Higher interest cover'], 1, 'Equity multiplier rose from 2.0 to 2.5 and margin from 6% to 7%. Turnover is unchanged at 1.25.'),
 Q('Interest coverage Year 2', ['3.0x', '1.5x', '0.33x', '5x'], 0, '1,500/500 = 3x.')
 ] },
{ title: 'Case 4: Compliance at Crestline Research', stem: '<p>Crestline Research is a registered research entity with an investment banking arm. Analyst Neha plans to publish a report on Zenith Pharma on 15 June. Crestline was co-manager of Zenith\'s IPO priced on 1 May. Neha\'s husband holds 1.5% of Zenith at the end of May. Crestline received compensation from Zenith for banking services in the past 12 months.</p>',
 qs: [
 Q('The cooling off after the IPO pricing for publishing research is', ['10 days', '25 days', '40 days', '90 days'], 2, 'IPO manager or co-manager: 40 days, unless compliance gives prior written approval. 1 May + 40 days is 10 June, so 15 June is outside it.'),
 Q('Neha\'s husband\'s holding must be', ['Ignored, not hers', 'Disclosed because relatives\' ownership of 1% or more counts', 'Sold immediately', 'Disclosed only to SEBI'], 1, 'Disclosure covers analyst, associates and relatives with 1% or more as at the end of the preceding month.'),
 Q('Neha may buy Zenith shares for herself', ['At any time', 'Not within 30 days before and 5 days after publication', 'Only after 5 days before', 'Only if above Rs 1 lakh'], 1, 'Trading restriction window under Regulation 16.'),
 Q('The report must also disclose', ['Nothing about banking compensation', 'Compensation and public offering management by Crestline in the past 12 months', 'Only the price target', 'Fees of other clients'], 1, 'Regulation 19.')
 ] },
{ title: 'Case 5: Technical read of Vega Ltd', stem: '<p>Vega Ltd has been in an uptrend. Today: price 520, 13 EMA 505, 21 EMA 492, 34 EMA 470. RSI 74. ADX 31 and rising, +DMI above -DMI. Price made a new high but RSI made a lower high than its previous peak. OBV is flat.</p>',
 qs: [
 Q('The EMA alignment suggests', ['Downtrend', 'Strong uptrend', 'Sideways market', 'No information'], 1, 'Price above 13 above 21 above 34 EMA.'),
 Q('RSI of 74 is', ['Oversold', 'Overbought', 'Neutral', 'Invalid'], 1, 'Above 70, though it can stay overbought in strong trends.'),
 Q('ADX 31 and rising with +DMI above -DMI indicates', ['Weak trend', 'Strong trend with buy bias', 'Sell signal', 'Range market'], 1, 'Above 25 and rising confirms trend strength.'),
 Q('New price high with lower RSI high and flat OBV suggests', ['Confirmation of strength', 'Bearish divergence, momentum fading', 'Bullish divergence', 'Breakout confirmed'], 1, 'Momentum and volume are not confirming the price.')
 ] },
{ title: 'Case 6: Hedging by Kavya Jewellers', stem: '<p>Kavya Jewellers will buy 1 kg of gold in three months. Spot today is Rs 7,00,000 per 100 g... use per kg Rs 70,00,000. Gold futures expiring in three months trade at Rs 70,50,000 per kg. In three months spot is Rs 74,00,000 and futures Rs 74,40,000.</p>',
 qs: [
 Q('Kavya should hedge by', ['Selling futures', 'Buying futures', 'Selling spot', 'Doing nothing is a hedge'], 1, 'A buyer fears price rises, so buys futures.'),
 Q('Futures gain per kg when closed at Rs 74,40,000 after buying at Rs 70,50,000', ['Rs 3,90,000', 'Rs 4,00,000', 'Rs 3,50,000', 'Rs 3,40,000'], 0, '74,40,000 - 70,50,000 = Rs 3,90,000.'),
 Q('Effective purchase cost per kg (spot at 74,00,000 minus futures gain)', ['Rs 70,10,000', 'Rs 74,00,000', 'Rs 70,00,000', 'Rs 74,40,000'], 0, '74,00,000 - 3,90,000 = Rs 70,10,000.'),
 Q('Why is it not exactly Rs 70,50,000 (the futures entry price)?', ['Tax', 'Basis risk: spot and futures moved differently', 'Contango error', 'Margin interest only'], 1, 'Basis moved from 50,000 to 40,000 contrary to the entry basis.')
 ] }
];
NX.cases[5].stem = '<p>Kavya Jewellers will buy 1 kg of gold in three months. Spot today is Rs 70,00,000 per kg. Gold futures expiring in three months trade at Rs 70,50,000 per kg. In three months spot is Rs 74,00,000 and futures close at Rs 74,40,000.</p>';
