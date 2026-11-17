# Talvo — Kettlewick Brewing Co. Cash Flow Dashboard

[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-blue?style=for-the-badge&logo=github)](https://mrchandrayee.github.io/talvo-cashflow-dashboard/)
[![HTML](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org) [![CSS](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org) [![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](./LICENSE)

Runnable responsive HTML/CSS/JavaScript reconstruction of the uploaded **7.5-second** screen recording (720 × 1280, 30 fps).

## Run locally
1. Extract `talvo-cashflow-dashboard.zip`.
2. Open `index.html` in Chrome, Firefox, Safari or Edge.
3. Explore **Overview** and **Cash flow** from the left navigation.
4. On Cash flow, drag coloured chart markers to reschedule an invoice or bill; use Chart/List and 30/60/90-day controls.
5. Try Add bill, Move money, Company cards and the other demo controls.

No npm install, build tools, API keys or backend are required.

Optional local server:
```bash
python3 -m http.server 8000
```
Open `http://localhost:8000`.

## What the video shows

The product is branded **Talvo**, workspace **Kettlewick Brewing Co.** The screen is a dark green/charcoal finance operations dashboard with vivid chartreuse action buttons and subtle green chart accents.

### Overview screen (first half)
- Greeting: **Good morning, Priya**
- Notice: 7 payments need attention; $115,090 is owed; cash dips under the buffer around Nov 1.
- **Cash on hand** card: `$352,147`, with Operating, Tax reserve and Treasury balances.
- **Next 30 days** cash forecast with expected-in, going-out and lowest-balance summary.
- **In & out, by week** bar chart.
- **Company cards** overlapping card stack with cardholder details.
- **Cost cover** semicircle gauge reading `2.8 months covered`.

### Cash flow screen (second half)
- Breadcrumb: Kettlewick Brewing Co. › Cash flow › Forecast
- Heading: **Cash flow**
- Tabs: Forecast, Income, Spending.
- Main card: **Cash Horizon** — “Drag a bill or an invoice to another day. Payroll, rent and loans are fixed.”
- Chart/List toggle.
- Date-range controls: 30 days, 60 days, 90 days.
- Cash balance curve, $60.0k buffer line, event dots and date labels.
- Right panel: **What moves the line**, including operating today, expected in, going out, Jan 17 balance, lowest point and days under buffer.
- Insight card: **Stay above your buffer** with Ballast Can Co. bill details.
- The recording demonstrates dragging markers across the forecast; the line and marker position are updated interactively.

## Readable source snippet transcribed from `src/horizon.ts`

The code panel is readable in the uploaded video. Line breaks and indentation are normalized; the visible identifiers and easing values are retained.

```ts
addEventListener('pointermove', (ev) => {
  const dx = ev.clientX - drag.x0;
  const day = Math.round(drag.day0 + dx / geo.dayW);
  gsap.set(m, { x: X(drag.day0) + dx });
  if (over.get(e.id) !== day) {
    over.set(e.id, day);
    // all 90 days re-project under the hand
    const live = evs.map((x) => ({ ...x, day: evDay(x) }));
    proj = project(geo.days, live);
    morphTo(proj.end, true);
  }
});

// the drop: snap to the day, squash, settle
gsap.to(m, { x: X(day), duration: 0.35, ease: 'back.out(2)' });
gsap.fromTo(m.firstElementChild, { scaleX: 1.35, scaleY: 0.72 },
  { scaleX: 1, scaleY: 1, ease: 'elastic.out(1.1, 0.45)' });
```

The visible code demonstrates pointer tracking, horizontal drag-to-day mapping, live re-projection of the 90-day forecast, and a squash/settle animation on drop. The original `src/horizon.ts` source file is not included in the recording, so only the readable displayed snippet can be transcribed.

## Included interactions
- Overview / Cash flow page navigation.
- Forecast, Income and Spending tab states.
- 30 / 60 / 90-day chart ranges.
- Chart and List views.
- Pointer drag of cash-flow event markers to reschedule bills/invoices.
- Live marker position and forecast redraw on drag.
- Add Bill modal and insertion into forecast event list.
- Move Money modal with amount validation and demo confirmation.
- Company-card stack interaction and card summary.
- New, Ask Talvo, Notifications and Search UI.
- Responsive sidebar/navigation and mobile layout.

## Files
- `index.html` — Talvo dashboard markup, navigation, panels and chart SVG.
- `styles.css` — dark green design system, cards, charts, responsive layout and animations.
- `app.js` — sample finance data, SVG charts, drag scheduling, navigation, modals and demo interactions.
- `README.md` — source observations, readable snippet and run instructions.

## Important limitations
This is a frontend-only reconstruction. The financial balances, cash-flow values, company/card details, dates and payees are sample/demo data based on what is visible in the recording. There is no bank feed, payment rail, accounting integration, authentication, database, real invoice system or live cash projection engine. Moving a marker updates its displayed date in the local demo; it does not reschedule an actual payment. The video shows GSAP-based source fragments; this runnable version implements equivalent drag and settle behavior with native pointer events and CSS/DOM updates, without depending on GSAP.

## 👨‍💻 Author

**mrchandrayee** · [GitHub](https://github.com/mrchandrayee)

## 📄 License

[MIT License](./LICENSE)
