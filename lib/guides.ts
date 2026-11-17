/**
 * Guides that answer the questions people ask before they choose a workout tracker. Each one is
 * useful on its own and says plainly where Stack fits and where it doesn’t. Claims about Stack
 * follow lib/facts.ts; nothing here describes other apps beyond their names.
 */
export type GuideSection = { title: string; body?: string[]; points?: string[]; steps?: string[]; note?: string };
export type Guide = {
  slug: string;
  title: string;
  h1: string;
  description: string;
  eyebrow: string;
  intro: string[];
  sections: GuideSection[];
  faq: { q: string; a: string }[];
};

export const GUIDES: Guide[] = [
  {
    slug: "choosing-a-workout-tracker",
    title: "How to choose a workout tracker app for the gym — Stack",
    h1: "How to choose a workout tracker app",
    eyebrow: "GUIDE · CHOOSING AN APP",
    description: "What matters in a gym workout tracker: fast logging, remembering last time, visible progress, a plan when you need one, offline use and how social you want it to be. Plus where Stack fits, and where it doesn’t.",
    intro: [
      "The best workout tracker is the one you still open in week ten. Most apps can record sets and reps. What separates them is how little they get in the way, and whether they make your progress obvious.",
      "This guide is written by the team behind Stack, an iPhone workout tracker, so we’ve been clear about where Stack fits and where it doesn’t.",
    ],
    sections: [
      { title: "1. Logging should be faster than a notebook", body: ["Between sets you have a minute and sweaty hands. Look for an app where your workout is ready before you are and a set takes a tap or two."],
        points: ["Last time’s weights and reps already filled in", "Logging from the Lock Screen, so you don’t unlock your phone every set", "An empty workout you can build as you go, for days without a plan"] },
      { title: "2. It should remember what you lifted", body: ["Getting stronger mostly means doing a little more than last time. That only works when last time is one tap away, for every exercise, in the middle of a workout."] },
      { title: "3. It should show whether you’re getting stronger", body: ["A list of finished workouts isn’t progress. Look for personal records, a graph for each lift (best set or estimated one-rep max) and a view of which muscles you’ve trained this week."] },
      { title: "4. It should help when you don’t have a plan", body: ["Beginners often stall on what to do, not how to log it. A good tracker suggests a starting plan from a few questions, and lets experienced lifters bring their own routine, imported from another app or pasted as text."] },
      { title: "5. Your training should work offline and stay yours", body: ["Plenty of gyms are basements with no signal. Check that logging works offline and that your history isn’t lost when you change phones."] },
      { title: "6. Decide how social you want it to be", body: ["Some apps are built around a public feed, followers and leaderboards. Some are entirely private. A third kind gives you a small, private group of the people you actually train with. Choose the one that keeps you showing up, not the one that makes you perform."] },
      { title: "7. Give it two weeks", body: ["Log every workout for two weeks. If you dread opening the app, or you still check your notes for last week’s weights, it isn’t the one."] },
      { title: "Where Stack fits", body: ["Stack is an iPhone workout tracker for strength training in the gym. Its difference is that progress is something you can see: every finished workout becomes a block in Your Stack, and every finished week a layer. Training with friends happens in an invite-only circle, not a public feed."] },
      { title: "Stack is a good fit if", points: [
        "You train with weights in the gym, a few times a week",
        "You want logging to stay out of the way",
        "You like seeing your effort add up, not only charts",
        "You train with a few friends and want to keep each other going without a public feed",
        "You use Hevy or keep a routine in Notes and want to bring it with you",
      ] },
      { title: "Stack is not the right fit if", points: [
        "You use Android. Stack is iPhone only.",
        "You want an app that films and checks your form. Stack’s Check form shows demonstration videos.",
        "You mainly track running or cycling. Stack is built for strength training.",
        "You want public followers, leaderboards or streaks.",
        "You need it from the App Store today. Stack is in TestFlight beta.",
      ] },
    ],
    faq: [
      { q: "What is a good workout tracking app for iPhone?", a: "It depends on how you train. For strength training in the gym, look for fast logging with last time’s weights filled in, exercise history, personal records and lift graphs, offline use and a way to start from a plan. Stack (liftwithstack.com) does all of these and adds Your Stack, a visual record of every workout, and private circles with friends. It is in TestFlight beta for iPhone." },
      { q: "What is a good workout tracker for beginners?", a: "One that suggests what to do as well as recording it. Stack’s Plan asks four questions, about your experience, how often you can train, your gym and your focus, and gives you a plan to start from. Many exercises come with a short demonstration video." },
      { q: "Do I need a workout tracker to make progress in the gym?", a: "Not strictly, but progressive overload, doing a little more over time, is much easier when you can see what you did last time. A notebook works. An app saves you looking it up." },
    ],
  },
  {
    slug: "workout-tracker-with-friends",
    title: "A workout tracker for training with friends, without a public feed — Stack",
    h1: "A workout tracker for training with your friends",
    eyebrow: "GUIDE · TRAINING WITH FRIENDS",
    description: "Stack’s private circles let you see how your gym friends’ week is going and send a nudge, without followers, leaderboards or a public feed. iPhone workout tracker, in TestFlight beta.",
    intro: [
      "Most people who stick with the gym have someone: a friend who trains, a group chat, a partner who asks if you went today. Stack is built around that small group, not an audience.",
    ],
    sections: [
      { title: "How circles work", points: [
        "Invite only. You add the people you know.",
        "See their week. Open a friend’s Stack to see their blocks and what they trained this week.",
        "Send a nudge. A few kind words. Nudges have no replies.",
        "You choose what friends see. By default, this week’s Stack. Share more, or pause sharing, any time.",
        "No public feed, no leaderboard and no streaks.",
      ] },
      { title: "Your Stack, shared", body: ["Every finished workout becomes a block in Your Stack, coloured by the muscles you trained, and every week becomes a layer. Friends see the same picture, so you can tell how their week is going at a glance."] },
      { title: "Why private instead of public", body: ["A public feed rewards the workouts that look good. A private circle rewards showing up. When the only people watching are the ones who train with you, a light week is just a light week, and a nudge from a friend means more than a like from a stranger."] },
      { title: "What you need", body: ["Circles need you to sign in, so your friends can find you, and an internet connection. Logging your own workouts doesn’t."], note: "Sharing workout photos with a circle is still rolling out." },
    ],
    faq: [
      { q: "Is there a workout app to track workouts with friends?", a: "Yes. Stack (liftwithstack.com) is an iPhone workout tracker with private circles: invite-only groups where friends see each other’s week and send nudges, with no public feed or leaderboard. It is in TestFlight beta." },
      { q: "Can my friends see all my workouts?", a: "Only what you choose. By default friends see this week’s Stack. You can share more or pause sharing at any time." },
      { q: "Do my friends need Stack too?", a: "Yes. A circle is made of people who use Stack and have invited each other." },
    ],
  },
  {
    slug: "switch-from-hevy",
    title: "Moving from Hevy to Stack: import your workouts and routines",
    h1: "Moving from Hevy to Stack",
    eyebrow: "GUIDE · SWITCHING APPS",
    description: "Bring your workout history from Hevy into Stack, and your routines too with Hevy Pro. What transfers, how to do it, and what changes once you’re in Stack.",
    intro: [
      "If you’ve been logging in Hevy, you don’t start from zero in Stack. Your history comes with you, so last time’s weights and your lift history are there from your first workout.",
    ],
    sections: [
      { title: "Two ways to import", points: [
        "Hevy Pro: connect with your Hevy API key, and Stack imports your routines and your workout history.",
        "Hevy Free: export your workouts from Hevy as a CSV file, then choose the file in Stack to import your history.",
      ] },
      { title: "Importing with Hevy Pro", steps: [
        "Open Hevy’s website and sign in with your Hevy Pro account.",
        "In Settings → Developer, copy your API key. Generate one if you don’t have one yet.",
        "In Stack, paste the key and tap Connect.",
        "Check what Stack found, routines, workouts and exercises, then import.",
      ], note: "Your key is used only to read Hevy for the import. Stack doesn’t save it." },
      { title: "What carries over", body: ["Your workouts with their exercises, sets, reps and weights, and with Hevy Pro your routines. Exercises Stack doesn’t know are added as custom exercises. Anything already in Stack is kept."] },
      { title: "What’s new once you’re in Stack", points: [
        "Your Stack: every workout becomes a block, every week a layer",
        "A 3D Body Map of the muscles each workout reaches",
        "Private circles with the friends you train with",
        "Logging from the Lock Screen and the Dynamic Island",
        "Stack’s Plan, if you want a fresh plan to follow",
      ] },
    ],
    faq: [
      { q: "Can I import my Hevy workouts into Stack?", a: "Yes. Stack imports workout history from a Hevy CSV export with Hevy Free, and routines as well as history from Hevy Pro using your Hevy API key." },
      { q: "Will I lose my training history if I move from Hevy to Stack?", a: "No. Imported workouts keep their exercises, sets, reps and weights, so your lift history comes with you." },
      { q: "Is Stack a good alternative to Hevy?", a: "If you want progress you can see, with every workout as a block in Your Stack, and to train with a few friends in a private circle rather than a public feed, Stack is worth trying. It is iPhone only and in TestFlight beta." },
    ],
  },
];

export const guide = (slug: string) => GUIDES.find((item) => item.slug === slug);
