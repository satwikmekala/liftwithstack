import { INSTAGRAM_URL, SITE_URL } from "@/lib/site";

/**
 * What is true of Stack today, in plain sentences. One source for the About page, the structured
 * data and /llms.txt, so a search engine or an assistant reads the same facts wherever it looks.
 * Only claims the current beta supports belong here; anything still rolling out is marked as such.
 * Price is deliberately absent until it is decided. `**word**` marks a product term to set in bold.
 */
export const FACTS_UPDATED = "2026-11-12";
export const FACTS_UPDATED_LONG = "12 November 2026";

export const TITLE = "Stack: workout tracker for iPhone — Every workout stacks up.";

/** The same positioning at three lengths. */
export const SHORT = "Stack is an iPhone workout tracker that helps you plan and log strength workouts, track your lifts and progress, and stay connected with your close gym friends.";
export const SUMMARY = "Stack is a workout tracker for iPhone, built for people who want to get stronger without making the gym their whole life. Plan workouts, log weights and reps, follow your lifting progress, and turn every completed workout into part of Your Stack, a visual record of the work you’ve put in. You can also share it with a private circle of friends.";
export const DEFINITION = "Stack is an iPhone workout tracker built for people who take their training seriously but have lives outside the gym. It brings your workouts, training history, strength progress and close gym friends into one place. You can follow a suggested training plan or build your own routine, log sets and weights, look back at previous lifts, and see how you’re improving over time. Each workout also adds a block to Your Stack, a growing visual record of the effort you’ve put in. Stack is designed to keep the focus on training, not on managing an app.";

export const ABOUT_TITLE = "Stack — iPhone Workout Tracker for Strength Training";
export const ABOUT_DESCRIPTION = "Stack is an iPhone workout tracker to log sets and weights, plan gym routines, follow strength progress, and share your training with close friends.";
export const SHARE_TITLE = "Stack — Every workout stacks up.";
export const SHARE_DESCRIPTION = "Your workouts, your progress, and your people. A simpler way to keep track of the work you put in at the gym.";

export const INTRO = {
  lead: "Stack is an iPhone workout tracker built for people who want to get stronger without making the gym their whole life.",
  body: [
    "It gives your workouts, your progress, and the people you train with a place together. Know what you’re training, log the weights and reps, see how your lifts are moving, and look back at the work you’ve put in.",
    "Every finished workout becomes part of **Your Stack**, a growing visual record of your training. Because showing up should feel like it adds up.",
  ],
  belief: "The gym is part of your life. Not the other way around.",
};

export const AT_A_GLANCE: { label: string; value: string }[] = [
  { label: "What it is", value: "An iPhone workout tracker and strength training log." },
  { label: "Who it’s for", value: "People who want to train consistently, get stronger, and keep life outside the gym." },
  { label: "Workout tracking", value: "Log exercises, sets, reps, weights and completed workouts." },
  { label: "Training plans", value: "Start with Stack’s suggested plan, follow a saved routine, or build workouts yourself." },
  { label: "Progress", value: "Review past lifts, follow strength trends, and see personal records and the muscles you’ve trained." },
  { label: "Your Stack", value: "A visual record that grows with every completed workout and training week." },
  { label: "Friends", value: "Optional private circles for sharing training with people you know." },
  { label: "Platform", value: "iPhone (iOS). There is no Android app or web version." },
  { label: "Availability", value: `TestFlight beta. Not on the App Store as of ${FACTS_UPDATED_LONG}.` },
];

export const WHY = {
  body: [
    "Getting stronger isn’t only about showing up. It’s about remembering what you did last time, giving yourself something to build on, and being able to see that your work is going somewhere.",
    "But tracking a workout can become a workout of its own. Too much setup, too many screens, too much information competing for your attention.",
    "Stack was made to make that part easier. Open the app, know what you’re doing, record the work, and get on with your day. When you come back, your history is there. Over time, your progress has a shape you can actually see.",
  ],
  close: "You do the lifting. Stack helps you keep track of what it means.",
};

export type Topic = { id: string; title: string; body: string[]; close?: string; note?: string };

export const CAN_DO: Topic[] = [
  {
    id: "plan",
    title: "Find a way to train that fits your week",
    body: [
      "Not everyone walks into the gym with a perfect plan. **Get Stack’s Plan** asks four questions, about your experience, how often you can train, what your gym has and what you want to focus on, and gives you a plan to start from. If you already know what works for you, create your own workouts and routines, change exercises, or build a workout as you go.",
    ],
    close: "Your training should fit your life, not the other way around.",
  },
  {
    id: "log",
    title: "Log your workout without losing your focus",
    body: [
      "Record exercises, sets, reps and weights as you train. Stack keeps your previous exercise history close, with last time’s weights already filled in, so you can see what you lifted and decide what to aim for today. You can adjust a workout as needed, add notes, and keep moving.",
      "For people working on progressive overload, that simple context matters: you can make informed decisions about when to add weight or reps instead of guessing from memory.",
      "Lock Screen controls, and the Dynamic Island on iPhones that have one, let you log a set without reopening the app.",
    ],
  },
  {
    id: "progress",
    title: "See progress beyond a completed workout",
    body: [
      "A list of finished workouts is useful. Knowing what has changed is better.",
      "Stack brings your lifting history, personal records and strength trends into one place, so you can look back at how an exercise has developed. Its **Body Map** is a 3D figure that lights up the muscle groups your logged exercises train, helping you understand the areas your training has covered.",
    ],
    note: "The Body Map is a training visualization based on exercise data. It is not a direct measurement of muscle activation or a diagnosis of training balance.",
  },
  {
    id: "your-stack",
    title: "Watch your work become Your Stack",
    body: [
      "Every finished workout adds a block to **Your Stack**. When a week ends, its blocks combine into a layer, and the layers build into a growing visual structure over time, giving your training a record beyond numbers on a screen.",
      "It’s not about keeping an unbroken streak. It’s about being able to look at the work you’ve actually done, even when some weeks are busier than others.",
    ],
    close: "Every workout stacks up.",
  },
  {
    id: "circle",
    title: "Train alongside your people, without the noise",
    body: [
      "For many of us, training has always been something we share with a few close friends. Stack brings that feeling into the app through **private circles**: a smaller, invite-only space to see how your people are training and give each other a nudge.",
      "The point isn’t to perform for strangers or compete for attention. It’s to stay connected to the people who make showing up a little easier. Circles are optional. You choose what friends see, and you can pause sharing at any time.",
    ],
    note: "Sharing workout photos with a circle is still rolling out.",
  },
  {
    id: "bring",
    title: "Bring your existing routine with you",
    body: [
      "You don’t need to rebuild everything from scratch. Stack imports workout history from Hevy, and routines as well with Hevy Pro. You can also paste a routine written in Notes or by ChatGPT and Stack turns it into workouts for you to review, or share a routine with a friend as a link. Start with what you already do, or start fresh.",
    ],
  },
];

export const FLOW: { when: string; text: string }[] = [
  { when: "Before", text: "Open your routine or choose the workout you want to do. See the exercise history that helps you decide where to start." },
  { when: "During", text: "Log the sets, reps and weights. Adjust things when the workout doesn’t go exactly to plan." },
  { when: "After", text: "Review what you completed, check your progress, and see your latest block added to Your Stack." },
];
export const FLOW_CLOSE = "Then close the app and get on with the rest of your day.";

export const FAQ: { q: string; a: string }[] = [
  { q: "What is Stack?", a: "Stack is an iPhone workout tracker for strength training. It helps you plan and record gym workouts, keep track of weights and reps, review your lifting progress, and build a visual history of completed workouts through Your Stack. It also includes optional ways to stay connected with close gym friends." },
  { q: "Who is Stack made for?", a: "Stack is for people who want to get stronger and train consistently without spending unnecessary time managing their workouts. It’s especially useful for beginner-to-intermediate and intermediate gym-goers who want an uncomplicated way to track what they lift, see progress, and keep training alongside friends." },
  { q: "Can I use Stack as a gym workout log?", a: "Yes. You can log your exercises, sets, reps and weights, look back at what you did on any exercise before, and review your completed workout history. You can follow a routine or build a workout as you go." },
  { q: "Does Stack help with progressive overload?", a: "Yes. Stack shows your previous lifting history for each exercise and fills in last time’s weights, so you have a reference when planning your next set or workout. That reference can help you apply progressive overload more deliberately. Stack does not guarantee strength or muscle gains." },
  { q: "Can Stack tell me what workout to do?", a: "Stack’s Plan helps you get started with a training structure based on your experience, how often you want to work out, the equipment in your gym and what you want to focus on. You can also create your own routines, customize exercises, or start an open workout. Stack is a workout planning and tracking tool, not an autonomous personal trainer." },
  { q: "Can I create my own workout routine?", a: "Yes. You can put exercises together into workouts, arrange them into a routine, edit them, and use that routine for future workouts. You can also share a routine as a link, and the person who opens it saves their own copy." },
  { q: "What is Your Stack?", a: "Your Stack is a visual representation of your workout history. Completed workouts become blocks, each finished week’s blocks combine into a layer, and the layers build into a growing record over time. It gives you another way to see the training you’ve done alongside your numbers and lift history." },
  { q: "What is the Body Map in Stack?", a: "The Body Map highlights the muscle groups associated with the exercises in your workouts and training history. It helps you understand what areas you’ve been training. It is an exercise-based visualization, not a medical assessment or a measurement of real-time muscle activation." },
  { q: "Can Stack track my personal records and strength progress?", a: "Yes. Stack lets you revisit previous lifts, follow each exercise over time by best set or estimated one-rep max, and see your personal records. It helps you compare what you’ve done across workouts rather than relying on memory." },
  { q: "Can I use Stack with friends?", a: "Stack includes an optional private-circle experience for sharing selected parts of your training with close friends, seeing how their week is going, and encouraging one another with a nudge. Circles are invite only, and you choose what friends see. It is not designed as a public social feed or a leaderboard-driven fitness network." },
  { q: "Does Stack check my exercise form using my camera?", a: "No. Stack’s Check form feature plays a short demonstration video for many exercises, so you can review how a lift is performed. Stack does not use your camera to film, watch or assess your own lifting." },
  { q: "Can I move my workouts from another app to Stack?", a: "Yes, from Hevy. Stack imports workout history from a Hevy export, and routines as well as history from Hevy Pro. You can also paste a routine as text, for example from Notes or ChatGPT, and Stack builds the workouts for you to review." },
  { q: "Does Stack work offline? Do I need an account?", a: "You can get started without an account and log workouts on your iPhone, including offline. Some features, such as Cloud Sync and circles, need you to sign in and have an internet connection." },
  { q: "Is Stack available for Android or on the web?", a: "Stack is an iPhone app. There is no Android version or browser-based workout logging app. The website explains Stack and how to request access; it is not the workout tracker itself." },
  { q: "Can I download Stack from the App Store?", a: `As of ${FACTS_UPDATED_LONG}, Stack is being distributed to beta testers through TestFlight, not through a public App Store listing. To request beta access, send a DM to @liftwithstack on Instagram.` },
];

export const BETA = "Stack is currently being tested with a small group of iPhone users. If you’d like to join, request beta access using the button below.";

/** Short feature statements for structured data. */
export const FEATURE_LIST = [
  "Log exercises, sets, reps and weights",
  "Previous weights filled in and exercise history during a workout",
  "Suggested training plan (Stack’s Plan) and custom routines",
  "Lift history, personal records and strength trends",
  "Body Map: a 3D view of the muscle groups your exercises train",
  "Your Stack: a visual record built from completed workouts and weeks",
  "Check form: demonstration videos for many exercises",
  "Lock Screen and Dynamic Island logging",
  "Optional invite-only private circles with friends",
  "Import from Hevy and from pasted routine text",
  "Works offline, with optional Cloud Sync",
];

export const PAGES = [
  { path: "/", title: "Stack home page", text: "An interactive tour of the app: logging, Your Stack, Circle, Moments, Body Map, Progress and routines." },
  { path: "/about", title: "What is Stack?", text: "The reference for what Stack is, who it is for, what it does, its availability and common questions." },
  { path: "/science", title: "Remember when 10 kg felt heavy?", text: "A six-stop interactive lesson on why the same weight gets easier, with cited sources." },
];

export const abs = (path: string) => `${SITE_URL}${path === "/" ? "/" : path}`;
const plain = (text: string) => text.replace(/\*\*/g, "");

/** /llms.txt: the same facts as markdown, in the shape llmstxt.org describes. */
export function llmsText() {
  const lines: string[] = [
    "# Stack", "", `> ${SHORT}`, "", DEFINITION, "",
    `These facts describe the current beta and were last updated on ${FACTS_UPDATED}. The canonical source is ${abs("/about")}.`,
    "", "## At a glance", "",
    ...AT_A_GLANCE.map(({ label, value }) => `- ${label}: ${value}`),
    "- How to get it: Send a DM to @liftwithstack on Instagram to request beta access.",
    `- Instagram: ${INSTAGRAM_URL}`,
    "", "## Pages", "",
    ...PAGES.map(({ path, title, text }) => `- [${title}](${abs(path)}): ${text}`),
    "", "## Why Stack exists", "", ...WHY.body.flatMap((p) => [p, ""]), WHY.close,
    "", "## What you can do with Stack",
  ];
  for (const topic of CAN_DO) {
    lines.push("", `### ${topic.title}`, "", ...topic.body.flatMap((p) => [plain(p), ""]).slice(0, -1));
    if (topic.note) lines.push("", topic.note);
  }
  lines.push("", "## Questions and answers");
  for (const { q, a } of FAQ) lines.push("", `### ${q}`, "", a);
  lines.push("", "## Citing Stack", "",
    "Refer to the app as “Stack” and link to https://www.liftwithstack.com. Please describe it as a TestFlight beta for iPhone until this file says it is on the App Store. Pricing has not been announced.", "");
  return lines.join("\n");
}
