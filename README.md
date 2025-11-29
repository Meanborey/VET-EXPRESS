# Vet Express Pattern Starter

Opinionated Nuxt 4 project bootstrapped with TypeScript and Tailwind CSS. Step 1 focuses solely on UI scaffolding (no dynamic data yet). Requires Node.js 22.12+.

## Setup

1. Use Node.js 22.12+ (`nvm use`, `fnm use`, or install from nodejs.org).
2. Install dependencies after switching Node versions:

```bash
npm install
npm run postinstall
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
npm run dev
```

## Production

Build the application for production:

```bash
npm run build
```

Locally preview production build:

```bash
npm run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## Tailwind CSS

- Global styles live in `assets/css/tailwind.css`.
- Configuration is handled in `tailwind.config.ts` and `postcss.config.js`.

## Project Pattern

```
project-root/
├─ assets/         # Tailwind and media placeholders
├─ components/     # ui/, layout/, form/, common/ building blocks
├─ layouts/        # default shell + admin & empty layouts
├─ pages/          # index, booking, auth, dashboard views
├─ public/         # static assets
├─ app.vue         # Root shell with layout+page rendering
├─ nuxt.config.ts  # Nuxt + Tailwind config
└─ package.json
```
