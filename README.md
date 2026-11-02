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
program, session, sealed, volume, lbs, exclamation marks…) reaches the page.

## How the page is built

| Section | What it shows | Source of truth in the app |
| --- | --- | --- |
| Hero | Your Stack in 3D; this week's three blocks drop in | `features/build/model.ts`, `geometry.ts` |
| Thesis | Easier to start, keep going, look back on | — |
| Story (sticky phone) | Train with Slide to start → logger → Lock Screen Live Activity → workout complete | `app/(tabs)/index.tsx`, `components/home/SlideToStart.tsx`, `app/workout.tsx`, `components/ActiveSetCard.tsx`, `components/live-activity/WorkoutLiveActivityLayout.tsx`, `features/build/CastingScreen.tsx`, `castingCopy.ts` |
| Your Stack | Last week presses into a layer (`fusionFrame`), then the camera pulls back; pick any week | `features/build/fusion.ts`, `Monolith.tsx`, `monolithModel.ts` |
| Story, history and form | Check history opens Exercise history; Check form opens the info sheet and plays the Bench Press clip (YouTube, loaded only on tap) | `components/ExerciseHistory.tsx`, `components/ExerciseInfo.tsx`, `components/ExerciseFormVideo.tsx`, `constants/exerciseVideos.ts` |
| Private Circle | Friends' this-week Stacks on one floor; one friend's Stack (week or full), recent training and photos; nudges | `features/circle/CircleScreen.tsx`, `FriendStack.tsx`, `MiniStack.tsx`, `nudges.ts` |
| Moments | This week's photo pile, opening into the grid by workout, with locks | `features/moments/WeekMoments.tsx`, `MomentsCluster.tsx`, `MomentLock.tsx` |
| Little things | Supersets, notes, past workouts, editing | `components/SupersetSheet.tsx`, `ExerciseNotes.tsx`, `app/log-workout.tsx`, `app/edit-workout.tsx` |
| Progress | This week, lift progress, records and history | `app/(tabs)/profile.tsx`, `components/LiftProgressCard.tsx` |
| Routines | Paste a routine and see the workouts Stack builds; four ways to get a routine | `app/paste-routine.tsx`, `features/routineImport/exerciseAliases.ts` |

- The page carries one Push workout from the story to Your Stack, Moments and the Circle (`DemoJourney`): the mode, sets, photos and locks the visitor chooses.
- `public/exercises/` holds the app's exercise art resized to 640 px. Moments prints are that art in a lit room with the app's label: illustration, not photography. Circle people (Ben, Maya, Sam) and their weeks are examples.
- Log sets off (Just train) and the in-story camera chapter are built (`GuidedScreen`, `SummaryScreen`, `lib/guided.ts`) but not shown yet; the Train switch is drawn on, as in the app.
- Circle's routines and gym playlist are "Coming later" in the app, so the site labels them Coming soon.
- Private Circle and photo sharing are behind build flags in the app (`EXPO_PUBLIC_CIRCLE`, `EXPO_PUBLIC_MOMENTS_CLOUD`); check they ship to beta testers before promoting them more widely.
- `lib/tokens.ts` mirrors `constants/theme.ts`. Phone screens are drawn at 402 × 874 pt with the app's own point metrics and scaled as a whole (`components/phone/Phone.tsx`).
- `lib/stack/` is a port of the app's block geometry, layout, drop physics and week-close motion, rendered with three.js. Example history is deterministic and illustration only.
- Copy follows the Stack content style sheet (5 Oct 2026). Verify any new claim against the app before adding it.

## Launch handoff

- **Download:** set `APP_STORE_URL` in `lib/site.ts` to the verified production listing. Until then the main controls read “Request beta access” and open the existing Instagram destination. When it's live, swap in Apple's official App Store badge artwork.
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

## Finishing pass (6 Oct 2026)

The routine demo offers Push / Pull, Full body and From Notes. Select a sample,
then Read routine to see an editable-draft example. These are curated local
examples, not a live parser. They show workout and exercise structure only:
`features/routineImport/importDraft.ts` does not carry set targets or notes into
the current app editor. On mobile, reading brings the result into view.

The app tab is My Stack; the object remains Your Stack. The site follows the
content style sheet except for that current native-tab label. Hevy Free imports
history; Hevy Pro imports history and routines. The builder copy promises exercise
selection and ordering, not editable targets. Privacy copy avoids claiming that
all workout content always stays on-device: paste parsing and routine sharing
use the app backend.

WebGL loads on approach, and off-screen stages are deferred. The same typefaces
use 3 local Latin assets rather than 13 preloaded subset assets. The existing tower,
55svh mobile chapters, 280svh mobile finale and first-block journey are preserved.
Number-wheel snapping respects reduced motion. Small-screen ruler labels are
hidden because the week panel already supplies their meaning and the duplicate
label overlapped the metrics at 320 × 568.

QA evidence and the browser runner are in ignored `outputs/` and `work/`.
The checks below record the tested scope and remaining limits.

Short landscape and zoomed views place the phone beside the chapter copy so the
fixed navigation does not cover the logger. Unavailable WebGL falls back to text
and usable week controls.

### QA scope and results

- Production build, TypeScript, lint and all 4 existing smoke/continuity tests pass.
- Chromium and WebKit: 1440 × 1000 desktop, 390 × 664 iPhone 13 emulation,
  320 × 568 narrow phone, 768 × 1024 tablet and reduced-motion phone.
- All 3 import samples, radio keyboard navigation, touch conversion and mobile
  result navigation; no horizontal page overflow or browser exceptions.
- Log 80 kg × 9, finish and explore: the same 1-set / 720 kg orange block remains
  in the tower in both engines, including reduced-motion visits.
- Lenis enables on desktop fine pointers, disables on mobile/reduced motion and
  switches correctly when resized or the motion preference changes. Focused
  number-wheel scrolling changes reps while the page stays still. Slider drag
  and keyboard start both work.
- 720 × 450 viewport (200% desktop zoom equivalent): logger and chapter controls
  remain visible; short landscape has a phone-and-copy layout.
- Axe WCAG A/AA/2.1 AA scans: no violations in settled tested views. Transitions
  are frozen for the scan so partially revealed off-screen copy is not misread.
  WebGL-disabled visits show text and retain working week navigation.
- Local production load, cold cache, 4× CPU slowdown, 150 ms latency and 1.6 Mbps
  download: LCP about 1.7 s, CLS 0. This is a local lab observation, not field data.
  Fonts request 3 files / 88,404 bytes instead of 13 / 169,488 bytes. Routine demo
  adds about 1.7 KB gzipped. The renderer is a separate chunk; only the hero stage
  initializes on arrival, with the completion and finale stages deferred.

### Remaining limits

Physical iPhone Safari, real pinch zoom, VoiceOver and sustained low-end-device
GPU/battery behavior were not tested. WebKit emulation is not a physical-device
sign-off. The retained renderer is about 129 KB gzipped and still triggers the
build's large-chunk warning; replacing it or simplifying the tower is outside this
finishing pass. The App Store destination remains unset; beta access uses the
existing Instagram path. Routine targets and notes remain an app limitation, made
explicit in the demo. The infinite/fixed-height hero interaction remains deferred.

Same-page anchors now use one scroll handler; the Chromium native/Lenis double
jump is removed, and the opening chapter lands below navigation.

## Mobile mockup follow-up

The mobile phone now fills the space remaining after the chapter navigation and
caption, instead of being capped at 53svh / 44svh. The pinned view follows `dvh`
so collapsing Safari chrome exposes more useful space. Caption controls sit near
the bottom, and the small-height landscape arrangement remains intact. Very short
portrait screens use a keyboard-focusable scrolling caption so the phone remains
usable; changing chapters resets that caption to its beginning.

Checked all four chapters in Chromium and WebKit at 393 × 852, 393 × 740,
390 × 664, 375 × 812, 320 × 568, 768 × 1024 and 720 × 450. No horizontal overflow
or browser errors. The existing logged-set/first-block flow and reduced-motion
checks still pass. Physical iPhone Safari remains unverified.

## /science: Remember when 10 kg felt heavy?

One article in seven chapters answering a single question: why does a weight that once felt heavy become
easier? The manuscript and storyboard live in `docs/the-weight-story.md`; change the words there first.

- `components/science/Descent.tsx`: the opening and chapters 1 and 2. The article scrolls normally beside one
  sticky figure that plays pre-rendered frames: a curl, the biceps on its own, then one continuous zoom down
  to actin and myosin (`frames.ts` loads and paints them; the phone gets the 640 px set).
- `Pull.tsx` (sliding filaments, cross-bridge cycle), `Adapt.tsx` (nervous system and fiber lanes),
  `SameWeight.tsx` (the same set in week 1 and week 6), `TwoPaths.tsx` (two aligned logs and the 2026 trial),
  `YourLog.tsx` (the live logger on Dumbbell Curl).
- Every made-up number is in `lib/science/story.ts` and is labelled on the page as an example. Citations
  are in `lib/science/sources.ts`, numbered in the order they are first cited.
- Frames are rendered offline by `tools/science-frames/`. The arm is adapted from Écorché and is
  CC BY-SA 4.0: keep the Credits section on the page and `public/science/arm/LICENSE.txt` with the files.

Science rules: keep growth and strength separate, never present an illustration as a forecast, keep the
nuance that repeating a workout still trains you, and keep more reps and extra sets as real ways to progress.
