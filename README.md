# Lumora

Lumora is a decoration-booking platform for events and living spaces in Dhaka. People come to browse decoration packages, book a slot that fits their date, and get matched with decorators who handle the actual setup. Think of it as a marketplace where the "product" is a finished room rather than a physical item you cart home.

This repository is the **front end**. It talks to a separate backend API (bookings, payments, admin settings) that is deployed on its own.

## What you can do with it

- Browse decoration packages by category (home, wedding, birthday, corporate) with real photos, pricing, and a coverage map so you know if a decorator serves your area.
- Book a package, pick a date, and track the booking as it moves from requested to confirmed to done.
- Sign in with email/password or Google. Routes that need an account are protected.
- Pay through Stripe at checkout.
- Three dashboards, depending on who you are:
  - **Client** — your bookings, upcoming events, spending, and profile.
  - **Decorator** — assigned projects, earnings, and schedule.
  - **Admin** — analytics across the whole platform, plus management of bookings, decorators, services, promotions, and site theme.

The admin can also change the site's colors and logo from the dashboard, and those changes apply live without a redeploy.

## Tech

React 19, Vite 7, React Router 7, Tailwind CSS 4 with DaisyUI, Framer Motion, GSAP, Firebase Auth, React Leaflet, Axios, Stripe, and Recharts. The design leans on a soft sky-and-cream palette and icon-based navigation rather than emoji.

## Run it locally

```bash
npm install
npm run dev      # opens on http://localhost:5173
npm run build    # production build into dist/
npm run preview  # serve the built files locally
```

You will need two things that are not in the repo: a Firebase project (auth settings live in `src/utilits/firebase.config.js`) and a backend API. API keys and the backend URL go in a `.env` file. The backend itself is a separate deployment, so front end and back end are versioned and hosted independently.

## Project layout

```
src/
  components/        shared UI (Navbar, Footer, Logo, PromoModal)
  contexts/         auth and site-settings providers
  layouts/          DashboardLayout (the shell every dashboard shares)
  pages/            route pages, grouped by public / auth / dashboard
  routes/           router definition and route guards
  utilits/          firebase config and small helpers
```

## Notes on deployment

The app is a single-page app. `vercel.json` rewrites unknown paths back to `index.html` so deep links like `/dashboard/admin` work on a hard refresh. Front end and backend deploy separately, so a change to one does not require redeploying the other.

## License

Lumora is proprietary. All rights reserved. You may not copy, modify, or redistribute this code without written permission. Brand assets and service names shown here belong to their owners and are included for demonstration.
