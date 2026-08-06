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

Stack is not yet publicly available and has no TestFlight, waitlist, or launch
updates route configured. The marketing CTA is intentionally disabled until a
real conversion path is supplied.
