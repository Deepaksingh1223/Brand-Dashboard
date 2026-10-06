# Team & Brand Performance Dashboard (ABC Finance)

Setup in VS Code terminal:
  npm install
  npm run dev        -> open http://localhost:3000

Data flow: data/*.js (mock) -> hooks/useDashboard.js (filters + calculations) -> components/*. Font: Inter via next/font.
- Change TLs/targets: data/tlData.js (executives are generated from it in data/executiveData.js)
- Incentive slabs and performance bands: data/dashboardData.js
- Replace mock data with an API later by swapping the exports in data/*.js

Import: header "Import data" -> upload CSV (download the template from the dialog).
Required columns: date, userId, target, collected. Optional: contactedAccounts, connectedAccounts, ptpCount, ptpAmount, ptpKept, paidAccounts.
Dates: YYYY-MM-DD or DD-MM-YYYY. userId must match an executive (EX-2001 ...). Same date+user replaces existing row.
Imported rows are saved in the browser (localStorage) and marked "New data". Use "Data source" filter for Imported only.
Mock data: Aug and Sep 2026 full months, Oct 2026 = 1-6 Oct (TL totals match your 8/6.8, 9/5.9, 8/5.3 Cr).

Teams: each TL leads one team (names in data/tlData.js). Tier rules (Top / Average / Low) use performanceBands in data/dashboardData.js; rankings are recalculated for the selected month/date.
