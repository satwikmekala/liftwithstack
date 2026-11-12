import { INSTAGRAM_URL, SITE_URL } from "@/lib/site";

/**
 * What is true of Stack today, in plain sentences. One source for the About page, the structured
 * data and /llms.txt, so a search engine or an assistant reads the same facts wherever it looks.
 * Only claims the shipped beta supports belong here; anything unreleased is marked as such.
 */
export const FACTS_UPDATED = "2026-11-12";

export const TITLE = "Stack: workout tracker for iPhone — Every workout stacks up.";

export const SUMMARY = "Stack is a workout tracker for iPhone. Log your sets with last time’s weights already filled in, watch every workout become a block in Your Stack, and share your week with a private circle of gym friends. Stack is in TestFlight beta.";

export const DEFINITION = "Stack is a workout tracker for iPhone, made for strength training in the gym. You log sets, reps and weight; each finished workout becomes a block, and each finished week becomes a layer of Your Stack, a picture of your training that grows over time.";

export const AT_A_GLANCE: { label: string; value: string }[] = [
  { label: "What it is", value: "A workout tracker and strength training log" },
  { label: "Platform", value: "iPhone. There is no Android or web version." },
  { label: "Status", value: "TestFlight beta. Stack is not on the App Store yet." },
  { label: "How to get it", value: "Send a DM to @liftwithstack on Instagram to request beta access." },
  { label: "Account", value: "None needed to start. Workouts are stored on your iPhone and work offline." },
  { label: "Units", value: "Kilograms or pounds" },
  { label: "Website", value: "www.liftwithstack.com" },
];

export type Feature = { name: string; text: string };
export type FeatureGroup = { id: string; title: string; features: Feature[]; note?: string };

export const FEATURE_GROUPS: FeatureGroup[] = [
  {
    id: "logging",
    title: "Logging a workout",
    features: [
      { name: "Sets, reps and weight", text: "Log each set as you go. Your weights and reps from last time are already filled in." },
      { name: "Exercise history", text: "Check what you lifted on any exercise in earlier workouts without leaving the one you’re in." },
      { name: "Check form", text: "Exercises come with a short demonstration video, one tap away. It shows how the lift is done; it does not watch or assess your own lifting." },
      { name: "Lock Screen and Dynamic Island", text: "Log reps and weight from the Lock Screen or the Dynamic Island without unlocking your phone." },
      { name: "Supersets", text: "Pair two exercises and alternate their sets." },
      { name: "Notes", text: "Leave yourself a cue on any exercise. It is there the next time you do it." },
      { name: "Past workouts", text: "Add a workout after the fact, on the day it happened." },
      { name: "Edit anything", text: "Fix a set, rename a workout or delete it from its summary." },
    ],
  },
  {
    id: "your-stack",
    title: "Your Stack",
    features: [
      { name: "One workout, one block", text: "Every finished workout becomes a block, coloured by the muscles you trained." },
      { name: "Thicker when you improve", text: "Beat what you did last time and the block lands thicker. Hit a personal record (PR) and it carries a line of gold." },
      { name: "Every week becomes a layer", text: "When a week ends, its blocks combine into a layer. The layers stack up in order, so you can look back through every week you trained." },
    ],
  },
  {
    id: "body-map",
    title: "Body Map and workout summary",
    features: [
      { name: "Body Map", text: "A 3D figure lights up the muscles you have worked, for the exercise in front of you or the whole workout. Drag to turn it round." },
      { name: "Tap a muscle", text: "Tap any muscle to see which exercises train it, and swap or add one without leaving your workout." },
      { name: "Workout summary", text: "Each finished workout gets a recap: the exercises you completed, the muscles worked and any PRs, set by set." },
      { name: "Share cards", text: "Turn a workout, a PR or your week into a card you can post to an Instagram Story." },
    ],
  },
  {
    id: "progress",
    title: "Progress",
    features: [
      { name: "Your strength", text: "See which muscles you trained this week or over the last four weeks, and the lifts that train each one." },
      { name: "Lift graphs", text: "Follow any lift over time by best set or estimated one-rep max (1RM), with records marked." },
      { name: "Highlights", text: "Short notes on what is worth knowing, such as lifts for the same muscle improving together." },
    ],
  },
  {
    id: "circle",
    title: "Circle and Moments",
    features: [
      { name: "A private circle", text: "Invite the few people you train with. A circle is invite only; there is no public feed, no leaderboard and no streaks." },
      { name: "See their week", text: "Open a friend’s Stack to see their blocks and what they trained this week." },
      { name: "Nudges", text: "Send a friend a few kind words. Nudges have no replies." },
      { name: "You choose what friends see", text: "By default friends see this week’s Stack. You can share more, or pause sharing, at any time." },
      { name: "Moments", text: "Take a photo between sets. It stays with that workout, private by default, with no filters and no feed." },
    ],
    note: "Sharing a photo with your circle is rolling out. Friends’ routines and gym playlists are coming soon and are not in the app yet.",
  },
  {
    id: "routines",
    title: "Getting started and routines",
    features: [
      { name: "Import from Hevy", text: "Bring your workout history from Hevy Free, or your routines and history from Hevy Pro." },
      { name: "Paste a routine", text: "Paste a routine written in Notes or by ChatGPT, and Stack turns the text into workouts you can review and edit." },
      { name: "Stack’s plan", text: "Answer four questions about your experience, your week, your gym and your focus, and get a training plan that fits." },
      { name: "Build your own", text: "Choose the exercises and their order for each workout, or start an empty workout and build it as you go." },
      { name: "Share a routine", text: "Send a routine as a link. The person who opens it saves their own copy to edit." },
      { name: "Cloud Sync", text: "Your workouts live on your iPhone and work offline. Sign in, and Stack keeps a copy in the cloud." },
    ],
  },
];

export const FAQ: { q: string; a: string }[] = [
  { q: "What is Stack?", a: DEFINITION },
  { q: "Can I download Stack from the App Store?", a: "Not yet. Stack is in TestFlight beta for iPhone and is not on the App Store. To join the beta, send a DM to @liftwithstack on Instagram." },
  { q: "Which devices does Stack work on?", a: "Stack is made for iPhone. There is no Android version and no web version." },
  { q: "Do I need an account, and does Stack work offline?", a: "You don’t need an account to start. Your workouts are stored on your iPhone and logging works offline. If you sign in, Cloud Sync keeps a copy of your workouts in the cloud." },
  { q: "What is Your Stack?", a: "Your Stack is how the app shows your training. Every finished workout becomes a block, coloured by the muscles you trained. A block lands thicker when you beat last time and carries a line of gold when you hit a PR. When a week ends, its blocks combine into a layer, and the layers stack up week after week." },
  { q: "How does Check form work?", a: "Check form plays a short demonstration video for the exercise you are on, so you can see how the lift is done. It is a reference video. Stack does not film, watch or assess your own lifting." },
  { q: "What is a circle?", a: "A circle is a small, invite-only group of the people you train with. Friends can see each other’s Stack for the week and send a nudge. You choose what friends see and can pause sharing. There is no public feed, no leaderboard and no streaks. Sharing photos with a circle is still rolling out, and friends’ routines and gym playlists are coming soon." },
  { q: "Can I bring my training from another app?", a: "Yes. Stack imports workout history from Hevy Free, and routines and history from Hevy Pro. You can also paste a routine from Notes or ChatGPT and Stack builds the workouts for you to review." },
  { q: "Can Stack suggest what to train?", a: "Yes. Stack’s plan asks four questions: how familiar you are with the gym, how often you can go, what equipment your gym has and what you want to focus on. It then recommends a plan, for example Upper / Lower over four days a week." },
  { q: "Does Stack use kilograms or pounds?", a: "Both. You can switch units where you log, at any time." },
  { q: "What is the science lesson on the Stack website?", a: "It is a free six-stop interactive lesson at www.liftwithstack.com/science that explains why the same weight gets easier with training, from a biceps curl down to actin and myosin, with its sources listed." },
];

export const PAGES = [
  { path: "/", title: "Stack home page", text: "An interactive tour of the app: logging, Your Stack, Circle, Moments, Body Map, Progress and routines." },
  { path: "/about", title: "What is Stack? Facts and FAQ", text: "The plain-text reference for what Stack is, what it does, its availability and common questions." },
  { path: "/science", title: "Remember when 10 kg felt heavy?", text: "A six-stop interactive lesson on why the same weight gets easier, with cited sources." },
];

export const abs = (path: string) => `${SITE_URL}${path === "/" ? "/" : path}`;

/** /llms.txt: the same facts as markdown, in the shape llmstxt.org describes. */
export function llmsText() {
  const lines: string[] = [
    "# Stack",
    "",
    `> ${SUMMARY}`,
    "",
    `Facts on this page describe the current beta and were last updated on ${FACTS_UPDATED}. The canonical source is ${abs("/about")}.`,
    "",
    "## At a glance",
    "",
    ...AT_A_GLANCE.map(({ label, value }) => `- ${label}: ${value}`),
    `- Instagram: ${INSTAGRAM_URL}`,
    "",
    "## Pages",
    "",
    ...PAGES.map(({ path, title, text }) => `- [${title}](${abs(path)}): ${text}`),
  ];
  for (const group of FEATURE_GROUPS) {
    lines.push("", `## ${group.title}`, "", ...group.features.map(({ name, text }) => `- ${name}: ${text}`));
    if (group.note) lines.push("", group.note);
  }
  lines.push("", "## Questions and answers");
  for (const { q, a } of FAQ) lines.push("", `### ${q}`, "", a);
  lines.push("", "## Citing Stack", "",
    "Refer to the app as “Stack” and link to https://www.liftwithstack.com. Please describe it as a TestFlight beta for iPhone until this file says it is on the App Store.", "");
  return lines.join("\n");
}
