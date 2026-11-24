(function () {
var Q = NX.Q;
NX.deep(12, [
{ t: 'Deep dive: ROI, holding period, annualised return and CAGR', h:
'<p>Investors want return <i>and</i> return of capital; safety of capital matters as much as return. Judge the <b>level, volatility and nature</b> (periodic vs capital appreciation) of return. Money return alone says nothing without capital invested. Single-period <b>ROI = Net profit / Investment x 100</b>; use caution for equity and mutual funds because returns are estimated from past data and assumptions.</p>' +
'<p>Returns can be periodic (interest, dividend, rent; none for gold and commodities) and/or price appreciation (counted in RoI whether realised or not; gains add, losses subtract). <b>RoI = (Total returns - Total cost) / Total cost x 100.</b></p>' +
'<div class="kp"><b>Worked example (ABC):</b> 150 shares at Rs 25 + Rs 20 commission: cost = 3,750 + 20 = <b>Rs 3,770</b>. Dividend Re 1 x 150 = Rs 150. Sale at Rs 30: 4,500 - 20 = <b>Rs 4,480</b>. Holding period return = (4,480 + 150) / 3,770 - 1 = <b>23%</b> (ignores time).</div>' +
'<div class="tw"><table><tr><th>Measure</th><th>Formula</th><th>Example</th></tr><tr><td>Holding period return</td><td>(Total returns / cost) - 1</td><td>23%</td></tr><tr><td>Simple annualised</td><td>HPR / months x 12 (or /days x 365)</td><td>23% over 15 months = 23/15 x 12 = <b>18.4%</b>; ignores compounding and time value of money</td></tr><tr><td><b>CAGR</b></td><td>(End / Begin)^(1/n) - 1; assumes reinvestment</td><td>3,770 to 4,630 in 5 years: 1.23^0.2 - 1 = <b>4.2%</b></td></tr></table></div>' +
'<ul><li>CAGR is a <b>smoothed</b> rate; actual yearly returns vary (that variability is risk). Standard measure except for periods under one year.</li><li>The dividend timing was ignored in the example; knowing it would add some basis points.</li><li><b>Multiple cash flows</b> cannot use the direct formula; use <b>XIRR</b> in Excel with dates and matching flows. Example: buy at Rs 150 on 31-Jul-2011; dividends Rs 5, 6, 4 on 31 Oct 2011, 2012, 2013; sell Rs 165 on 15-Jan-2014 gives <b>8.06%</b>.</li></ul>' },

{ t: 'Deep dive: inflation risk and interest rate risk', h:
'<p><b>Risk</b> = volatility and uncertainty of returns, and in the extreme, loss of capital; also actual return differing from expected. Different investors fear different risks (a retiree may accept income insufficiency but not capital loss).</p>' +
'<h4>Inflation (purchasing power) risk</h4><ul><li>Asha\'s FD gives Rs 5,000 a month; 10% inflation means she needs Rs 5,500.</li><li>Highest in <b>fixed-return instruments</b> (bonds, FDs, debentures). <b>Real return</b>: 8% coupon with 7% inflation = 1%; at 9% inflation it turns negative even with no default.</li><li>Lower for equity: businesses can raise prices, nominal profit and stock prices rise. <b>Venezuela:</b> inflation peaked at 65,370% in 2018 (prices up about 654x); bonds became nearly worthless while the Caracas stock index rose over 1,000x.</li></ul>' +
'<h4>Interest rate risk</h4><ul><li>Bond prices and rates move <b>inversely</b>. An 8% 5-year bond: if market rates fall to 7.5%, the old bond\'s price rises until its IRR is about 7.5%; if new bonds pay 9%, the old bond\'s price falls until its IRR matches 9%. Extends to <b>debt funds</b>.</li><li><b>Equity:</b> theoretically higher cost of capital lowers present value; in practice higher rates cut borrowing, capex, revenue and profits and raise interest costs, so cash flows to equity fall and prices drop.</li></ul>' },

{ t: 'Deep dive: business, market, credit, liquidity, call and reinvestment risks', h:
'<div class="tw"><table><tr><th>Risk</th><th>Meaning and key points</th></tr>' +
'<tr><td><b>Business risk</b></td><td>Inherent in operations; measured as <b>standard deviation of EBIT or EBITDA</b>. Sub-risks: commodity, operations (attrition, retraining), competition, supply chain, currency. Diversifying across businesses reduces it.</td></tr>' +
'<tr><td><b>Market risk</b></td><td>Loss from adverse price moves in assets with an active secondary market (equity, bonds, gold, real estate). Deposits and small savings schemes have none, but also no market appreciation.</td></tr>' +
'<tr><td><b>Credit (default) risk</b></td><td>Issuer fails to pay interest or principal. A sovereign has <b>no default risk on local-currency borrowing</b> (taxation, printing money). Measured by ratings: AAA and A1 highest, D = default; SEBI standardised the symbols. Lower rating means higher yield demanded. Diversify across bonds.</td></tr>' +
'<tr><td><b>Liquidity risk</b></td><td>Cannot sell when desired, or only below intrinsic value or at high cost. Three meanings: <b>company liquidity</b> (meeting short-term obligations), <b>asset liquidity</b> (shares and bonds easy; gold and real estate less), <b>market liquidity</b> (ready buyers and sellers at a price). Corporate bond markets in India are illiquid for retail; property and art; lock-ins. SGB (Dec 2025) on 17-Jul-2020: bid-ask gap over Rs 80 (about 2%) with thin quantity.</td></tr>' +
'<tr><td><b>Call risk</b></td><td>Bond may be redeemed before maturity; most likely when rates fall (issuers replace high-coupon bonds). Goes with reinvestment risk.</td></tr>' +
'<tr><td><b>Reinvestment risk</b></td><td>Intermediate cash flows reinvested at lower rates. <b>Rates rise: reinvestment risk falls; rates fall: it rises.</b> Cumulative (growth) options protect, but in a marketable bond raise price volatility.</td></tr>' +
'<tr><td><b>Political risk</b></td><td>Nationalisation, tax changes, licensing; nearly all businesses exposed.</td></tr>' +
'<tr><td><b>Country risk</b></td><td>Socio-economic-political-cultural factors; country default affects all securities issued there.</td></tr></table></div>' +
'<h4>Systematic vs unsystematic</h4><div class="tw"><table><tr><th>Systematic (undiversifiable)</th><th>Unsystematic (diversifiable)</th></tr><tr><td>Market, inflation, exchange rate, interest rate, reinvestment</td><td>Credit, business, liquidity</td></tr></table></div>' +
'<p>Ajay (infrastructure shares): a change in government infrastructure push is sector-specific (unsystematic; diversify by sector); rate hikes and recession are market-wide (systematic). Ashima (bonds): credit risk is reduced by holding more highly-rated bonds; interest rate risk hits all her bonds.</p>' +
'<p><b>Defining risk:</b> variability of outcomes (positive and negative, though we usually mean downside). <b>Risk is known uncertainty</b>; before the tsunami or Covid we faced uncertainty, afterwards we could name "tsunami risk" or "Covid risk".</p>' }
]);
NX.deepQ(12, [
 Q('150 shares bought at Rs 25 with Rs 20 commission cost', ['Rs 3,750', 'Rs 3,770', 'Rs 3,790', 'Rs 3,730'], 1, '150 x 25 + 20.'),
 Q('Holding period return (sale Rs 4,480 net, dividend Rs 150, cost Rs 3,770) is', ['23%', '19%', '27%', '4.2%'], 0, '(4,480 + 150) / 3,770 - 1 = 0.23.'),
 Q('A 23% return over 15 months, simple annualised, is', ['23%', '18.4%', '28.75%', '15.3%'], 1, '23 / 15 x 12 = 18.4%.'),
 Q('CAGR formula', ['(End / Begin)^(1/n) - 1', 'HPR / n', '(End - Begin) / n', 'End / Begin'], 0, 'n is years held.'),
 Q('Rs 3,770 growing to Rs 4,630 over 5 years gives CAGR about', ['4.2%', '23%', '8%', '5.5%'], 0, '1.23^(1/5) - 1 = 4.2%.'),
 Q('For irregular dividends and a sale, the return should be computed using', ['Simple CAGR formula', 'XIRR', 'ROI', 'EBITDA'], 1, 'The multiple dated cash flows example gave 8.06%.'),
 Q('Inflation risk is highest in', ['Equity shares', 'Fixed-return instruments such as bonds and FDs', 'Real estate', 'Gold'], 1, 'Both interest and principal are fixed in absolute terms.'),
 Q('An 8% coupon bond with 9% inflation gives a real return of about', ['+1%', '-1%', '8%', '0%'], 1, 'Real return = nominal minus inflation.'),
 Q('Interest rate risk: if rates rise, existing bond prices', ['Rise', 'Fall', 'Stay', 'Double'], 1, 'Price and yield move inversely.'),
 Q('An old 8% bond when new bonds offer 7.5% will', ['Fall until its IRR is 7.5%', 'Rise until its IRR is about 7.5%', 'Stay at par', 'Be called'], 1, 'Investors rush to buy the higher-coupon bond.'),
 Q('Business risk is typically measured by', ['Beta', 'Standard deviation of EBIT or EBITDA', 'PE', 'Debt/Equity'], 1, 'Any factor creating volatility of operating income.'),
 Q('Which has NO default risk on local-currency borrowing?', ['Corporates', 'A sovereign government', 'NBFCs', 'Banks'], 1, 'It can tax or print money.'),
 Q('Which of these is a systematic risk?', ['Credit risk', 'Business risk', 'Liquidity risk', 'Interest rate risk'], 3, 'Market, inflation, exchange rate, interest rate and reinvestment are systematic.'),
 Q('Which is unsystematic?', ['Inflation risk', 'Reinvestment risk', 'Credit risk', 'Market risk'], 2, 'Credit, business and liquidity risks can be diversified.'),
 Q('Call risk is highest when', ['Rates rise', 'Rates fall', 'Inflation rises', 'Rates are stable'], 1, 'Issuers redeem high-coupon bonds and replace them with cheaper ones.'),
 Q('When interest rates rise, reinvestment risk', ['Rises', 'Falls or disappears', 'Doubles', 'Stays'], 1, 'Coupons can be reinvested at higher rates.'),
 Q('Rating symbol indicating default', ['AAA', 'A1', 'D', 'BBB'], 2, 'AAA and A1 indicate the highest credit worthiness.'),
 Q('Risk, as defined, is', ['Only downside', 'Variability of outcomes, known uncertainty', 'Same as loss', 'Same as inflation'], 1, 'Usually we refer to downside risk, but risk is variability in both directions.'),
 Q('Venezuela 2018 hyperinflation illustrated that', ['Bonds beat equities', 'Equities protected better than fixed-income when inflation spiked', 'Gold fell', 'Rates are irrelevant'], 1, 'Bond investors suffered while the stock index rose over 1000x.')
]);
})();
