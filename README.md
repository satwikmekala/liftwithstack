# Stack marketing site

Responsive marketing site for Stack, built with the Next.js App Router,
TypeScript, Tailwind CSS, Framer Motion, Lenis, and vinext.

## Run locally

Use Node.js 22.13 or newer:

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Quality checks

```bash
npm run lint
npx tsc --noEmit
npm test
```

`npm test` creates a production build before running the rendered-markup smoke
test.

## Project structure

- `app/` — App Router entry points, global styling, and metadata
- `components/sections/` — page sections in render order
- `components/ui/` — shared phone, accordion, reveal, and logo primitives
- `lib/training-data.ts` — typed training rotations and section data
- `lib/smooth-scroll.tsx` — reduced-motion-aware Lenis integration
- `public/og.png` — generated social preview artwork

## Content handoff

The footer is intentionally a minimal placeholder until final footer content is
supplied. App Store and Google Play badges are disabled until real listing URLs
are available.
