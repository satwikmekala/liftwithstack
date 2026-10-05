# liftwithstack.com

Stack's marketing site: one page, built with the Next.js App Router on vinext and
deployed as a Cloudflare Worker (unchanged hosting setup).

## Run locally

Node.js 22.13 or newer:

```bash
npm install
npm run dev
```

## Checks

```bash
npm run lint
npx tsc --noEmit
npm test        # production build, then a rendered-HTML smoke test
```

The smoke test also fails if a banned term from the content style sheet (split,
program, session, sealed, volume, lbs, My Stack, exclamation marks…) reaches the page.

## How the page is built

| Section | What it shows | Source of truth in the app |
| --- | --- | --- |
| Hero | Your Stack in 3D; this week's three blocks drop in | `features/build/model.ts`, `geometry.ts` |
| Thesis | Easier to start, keep going, look back on | — |
| Story (sticky phone) | Train with Slide to start → logger → Lock Screen Live Activity → workout complete | `app/(tabs)/index.tsx`, `components/home/SlideToStart.tsx`, `app/workout.tsx`, `components/ActiveSetCard.tsx`, `components/live-activity/WorkoutLiveActivityLayout.tsx`, `features/build/CastingScreen.tsx`, `castingCopy.ts` |
| Your Stack | Last week presses into a layer (`fusionFrame`), then the camera pulls back; pick any week | `features/build/fusion.ts`, `Monolith.tsx`, `monolithModel.ts` |
| Progress | This week, lift progress, records and history | `app/(tabs)/profile.tsx`, `components/LiftProgressCard.tsx` |
| Routines | Paste a routine and see the workouts Stack builds; four ways to get a routine | `app/paste-routine.tsx`, `features/routineImport/exerciseAliases.ts` |

- `lib/tokens.ts` mirrors `constants/theme.ts`. Phone screens are drawn at 402 × 874 pt with the app's own point metrics and scaled as a whole (`components/phone/Phone.tsx`).
- `lib/stack/` is a port of the app's block geometry, layout, drop physics and week-close motion, rendered with three.js. Example history is deterministic and illustration only.
- Copy follows the Stack content style sheet (5 Oct 2026). Verify any new claim against the app before adding it.

## Launch handoff

- **Download:** set `APP_STORE_URL` in `lib/site.ts` to the verified production listing. Until then the download controls read “Now in beta on iPhone” (and “Beta testing now” in the closing section). When it's live, swap in Apple's official App Store badge artwork.
- **Shared routines:** `/r/*`, `/routine-share-assets/*` and `/.well-known/apple-app-site-association` belong to the routine-sharing server (see `server/deploy/routine-sharing.nginx.conf` in the app repo). This site must not claim those paths.
- **Instagram:** `INSTAGRAM_URL` in `lib/site.ts` powers the closing section’s follow, updates and beta request links.
- `public/og.png` is rendered from the real block geometry and fonts by a script, not drawn by hand.

## Demo journey and scrolling

Desktop fine-pointer visits use light Lenis smoothing; mobile touch scrolling and
reduced-motion visits stay native. `lib/scroll.ts` keeps chapter jumps on the same
scroll controller. The weight/reps wheels and block details scroll independently.

The story and finale share `DemoJourney`. Only sets the visitor logs count toward
"Your first block"; the prefilled example set is excluded. Finish demo, enter the
Stack chapter, or choose Explore the stack to carry those sets into the finale.
The orange slab, thickness, and workout details all use the same snapshot. Visitors
who do not log a set continue to see the example sequence. State resets on reload.

Mobile story chapters use 55svh per transition and the finale uses 280svh. The
four labeled chapter buttons and Explore the stack link provide direct navigation.

The later hero Add a workout interaction is intentionally deferred: its eventual
infinite stack should stay inside a fixed-height view, fading older blocks at the
bottom. No QR flow is planned.
