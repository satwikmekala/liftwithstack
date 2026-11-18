/**
 * Stack’s Privacy Policy, Terms of Use and Support page: the words, in one place.
 *
 * The app repo keeps the same text as markdown in docs/legal/ (generated from this file), with the
 * evidence for every claim in docs/legal/claims-to-confirm.md. Change a claim there first, then here.
 *
 * Inline marks, rendered by components/legal/LegalDoc.tsx:
 *   **bold**              strong text
 *   [label](/path)        a link (site paths, https:// or mailto:)
 *   [CONFIRM: what]       a fact only wik or a lawyer can supply. Shown highlighted, never as final text.
 *
 * LEGAL_IS_DRAFT shows the "Draft — not yet in effect" notice on all three pages. Flip it to false only
 * once every [CONFIRM: …] is replaced and the documents are approved.
 */

export const LEGAL_IS_DRAFT = true;

/** The last material change to each document (YYYY-MM-DD). Matches constants/legal.ts in the app. */
export const PRIVACY_POLICY_VERSION = "2026-11-18";
export const TERMS_VERSION = "2026-11-18";
export const SUPPORT_UPDATED = "2026-11-18";

/** Set once the mailbox is verified to receive and be read. Until then the pages show a placeholder. */
export const SUPPORT_EMAIL: string | null = null;

export const DRAFT_NOTICE = "Draft — not yet in effect. Highlighted items are still being confirmed.";

export type LegalBlock =
  | string
  | { list: string[] }
  | { steps: string[] }
  | { table: { head: string[]; rows: string[][] } }
  | { note: string };

export type LegalSection = { id: string; title: string; body: LegalBlock[] };

export type LegalDocument = {
  path: "/privacy" | "/terms" | "/support";
  eyebrow: string;
  h1: string;
  /** <title> */
  title: string;
  description: string;
  updated: string;
  lead: string[];
  sections: LegalSection[];
};

const CONTACT = SUPPORT_EMAIL ? `[${SUPPORT_EMAIL}](mailto:${SUPPORT_EMAIL})` : "[CONFIRM: support email]";
const OPERATOR = "[CONFIRM: legal name]";
const ADDRESS = "[CONFIRM: postal address]";

export const PRIVACY: LegalDocument = {
  path: "/privacy",
  eyebrow: "PRIVACY POLICY",
  h1: "Privacy Policy",
  title: "Privacy Policy — Stack (liftwithstack.com)",
  description: "What Stack collects, why, where it is processed, how long it is kept, and how to delete it.",
  updated: PRIVACY_POLICY_VERSION,
  lead: [
    `Stack (liftwithstack.com) is an iPhone app for strength training. This policy explains what information Stack handles, why, who helps us process it, how long we keep it and the choices you have. “Stack”, “we” and “us” mean ${OPERATOR}, the operator of the app and of liftwithstack.com.`,
    "Stack is built to work on your iPhone first. You can log workouts without an account, and most of your training never leaves your iPhone unless you turn on a feature that needs it. Each section below says which features send data and when.",
  ],
  sections: [
    {
      id: "summary",
      title: "The short version",
      body: [{ list: [
        "Workouts, routines, notes, records and photos are stored on your iPhone. No account is needed to use Stack.",
        "If you sign in (with Apple or Google), Stack keeps a small account record. Cloud Sync, Moments backup and Circle send data to Stack’s servers only when you turn them on.",
        "AI features send the text or summaries they need to an AI provider, only after you allow it in the app. You can withdraw that at any time.",
        "Usage analytics are not linked to your account, name or email, and you can turn them off.",
        "Stack shows no ads, contains no advertising or tracking code, and does not sell your personal information.",
        "You can delete your account in the app. We delete what we hold for it within 7 days.",
      ] }],
    },
    {
      id: "who",
      title: "Who is responsible",
      body: [
        `${OPERATOR}, ${ADDRESS}, is responsible for the personal information described here. Contact: ${CONTACT}.`,
        "[CONFIRM: whether an EU/UK representative or data protection officer is required, and their details]",
      ],
    },
    {
      id: "on-iphone",
      title: "What stays on your iPhone",
      body: [
        "Stack stores your training in a database on your iPhone: workouts, sets (weight, reps, time), exercises (including ones you create), routines, exercise notes, personal records, your name (as you typed it, used to greet you), weekly goal, training days, reminder time and app preferences. Photos you take in Stack (Moments) are kept in the app’s own storage on your iPhone.",
        "Stack does not read your Photos library or your Health data. It has no location access.",
        "This information stays on your iPhone unless you use one of the features below. iOS protects app data on the device; Stack does not add its own encryption to it. When you export a workout history file (CSV) or a backup file, it goes only where you send it from the share sheet.",
        "To remove it, use Settings → Manage data → Delete all data, or delete the app.",
      ],
    },
    {
      id: "account",
      title: "Your Stack account",
      body: [
        "An account is optional. You need one for Cloud Sync, Moments backup and Circle. You sign in with Apple or Google; Stack has no passwords.",
        "**What we receive:** a sign-in token from Apple or Google that contains a stable ID for you at that provider and an email address. With Sign in with Apple you can choose to hide your email, in which case Apple gives us a private relay address. Google’s token can also include your name and profile picture address.",
        "**What we keep:** our sign-in service (Supabase Auth) stores the email address and provider details from the token, sign-in times and a security log of sign-in events, which includes IP addresses. Stack’s own account records hold a random account ID, the provider name and provider ID, a random ID for each iPhone you sign in on, and records of sign-ins and account events. Stack’s own account records do not hold your email or name. [CONFIRM: exact fields Supabase Auth stores for Apple and Google sign-ins]",
        "**Why:** to create your account, sign you in, keep your account secure, and stop the same sign-in being used twice. Stack never merges two accounts because their emails match.",
        "When you delete your account and you signed in with Apple, we ask Apple to revoke Stack’s access to your Apple ID. To do that, Stack’s server exchanges a one-time code from the sign-in that confirms the deletion, and keeps the resulting Apple token only until the revocation goes through (it retries for about two days).",
      ],
    },
    {
      id: "cloud-sync",
      title: "Cloud Sync",
      body: [
        "Cloud Sync keeps a copy of your workout history with your Stack account so you can restore it on another iPhone. It is off until you turn it on. Signing in from the Cloud Sync screen, or during setup, turns it on for that iPhone.",
        "**What is copied:** workouts and their exercises and sets, routines, exercise notes, custom exercises, data you imported from Hevy, and your profile (including your name, weekly goal, training days and preferences). Stack also keeps checkpoints: complete copies of your history that are checked after upload, used to restore.",
        "**Why:** to back up your history and keep it the same across your iPhones.",
        "Choosing “Stop backing up” stops new uploads but does not delete what is already in the cloud. To delete your cloud copy, delete your account (see below) or contact us.",
        "[CONFIRM: there are currently no provider-side backups of Stack’s database; update this section when backups are set up, including how long backup copies are kept]",
      ],
    },
    {
      id: "moments",
      title: "Moments (photos)",
      body: [
        "Moments are photos you take with Stack’s own camera during a workout. Stack asks for camera access to take them and to scan Circle invitation codes. It asks for permission to add to your Photos only when you tap Save, and never reads your library. Photos are saved without location or other camera metadata.",
        "**Backup (optional):** if you turn on Back up Moments, your photos are copied to Stack’s cloud storage after each workout. They are private to you.",
        "**Sharing (optional):** you can share a single photo with your Circle. Only your friends in Circle can see it, through links that expire after a few minutes. Unsharing or removing a friend stops new links at once.",
        "**Removing:** “Remove your Moments from Stack Cloud” stops sharing at once and deletes the photos from our storage after 7 days. Photos on your iPhone are not touched.",
      ],
    },
    {
      id: "circle",
      title: "Circle",
      body: [
        "Circle is an invite-only group of friends. It needs an account and your agreement to the Circle rules.",
        "**What friends see:** your display name and handle always. Your Stack and your current week are on by default, and you can turn them off. Your past weeks, workouts (dates, names, exercises), weights and reps, photos, routines and a gym playlist link are off until you turn them on in Sharing settings. Notes and unfinished workouts are never shared. When you turn a category off, what was shared for it is deleted.",
        "**What we store:** your handle and display name; your sharing settings; invitations (we store a scrambled form of the invite code, never the code itself; invites expire after 7 days); friend requests, friendships and blocks; what you chose to share; nudges (you can only send fixed phrases, not free text) and bolts (reactions); and the date and time of each.",
        "**Why:** to run Circle and show your friends what you chose to share.",
        "A previous handle is held for 30 days after you change it, so nobody else can take it straight away.",
      ],
    },
    {
      id: "reports",
      title: "Reports, blocking and moderation",
      body: [
        "You can report a person, a photo, a workout or a Circle page, and block anyone. A report stores who reported whom, what kind of thing was reported, the reason you picked, an optional note of up to 300 characters, and a small record of what was reported (the handle, display name and a reference to the photo or workout) so we can review it.",
        "We review reports to keep Circle safe and to enforce the Terms of Use. We may hide content and restrict an account’s access to Circle. The person you report is not told who reported them. Stack may send its team an alert that a new report arrived; the alert contains no names or content.",
        "To keep reporting possible after someone leaves your circle, we note who has seen whom in Circle (an ended friendship, an opened invite, a handle you looked up) for 180 days. We also keep the date you agreed to the Circle rules and which version you agreed to, a record of content we removed so it can’t be shared again, and any restriction on an account. Handles, display names, workout names and page names are checked against a short list of words Circle doesn’t allow.",
        "Resolved reports are deleted 180 days after they are resolved. If you delete your account, reports you made are kept without the link to you, and reports about you are closed and their record of the content is cleared.",
        "[CONFIRM: who at Stack reviews reports, and that report review and the 180-day deletion are live in production]",
      ],
    },
    {
      id: "ai",
      title: "AI features",
      body: [
        "Two features use an AI model. Neither sends anything until you allow AI features in the app; one choice covers both. You can withdraw it at any time in Settings → Manage data → AI features. Turning it off stops all later requests at once and deletes AI-written Highlights from your iPhone. Your choice is stored on your iPhone.",
        "**Paste my routine:** the text you paste, exactly as you wrote it, and nothing else from your account or workouts. Stack’s routine server sends it to OpenRouter, an AI service, which passes it to the model provider (currently Google’s Gemini model), to turn it into workouts you review before anything is saved.",
        "**Highlights:** short summaries Stack writes on your iPhone about your recent lifts and records (exercise and workout names, weights, reps and dates) and your weight unit, with a random code for your iPhone that limits how often it asks. Not your full history, your name, your notes, your photos or your account. Stack’s server sends them to OpenRouter, which passes them to the model provider (currently a DeepSeek model, run by a hosting provider OpenRouter chooses). Stack checks every sentence against your workouts before showing it.",
        "Stack does not use this to identify you. Stack’s server does not store the text or summaries; its logs keep sizes, timings, token counts and error codes, a scrambled form of the Highlights code, and sometimes an exercise name when a highlight is rejected. We ask OpenRouter to use only model providers that do not keep or train on what you send. OpenRouter keeps request metadata (such as time, model and size). [CONFIRM: OpenRouter account logging setting, each model provider’s retention terms, which host serves the DeepSeek model, and that the data-collection setting is on in production]",
        "Models can change; this policy names the current ones. AI output can be wrong; check it before you use it.",
      ],
    },
    {
      id: "analytics",
      title: "Usage analytics",
      body: [
        "Stack uses PostHog, hosted in the EU, to understand how the app is used. Analytics are on by default in App Store and TestFlight builds; you can turn them off in Settings → Manage data → Share anonymous usage data.",
        "**What is sent:** screens opened (by screen type, never by what is on them), app opened and closed, and counts such as workouts started, finished or discarded, number of sets, a duration range, photos taken, routines created, shares and invites, Cloud Sync turned on, and app reliability problems. The PostHog code also sends device and app details such as iPhone model, iOS version, app version, language and time zone.",
        "**What is not sent:** your name, email, account ID, exercise names, weights, notes, photos or friends. Events carry a random ID created on your iPhone and are not linked to your Stack account. PostHog does not create a profile for you, and screen recording is off. [CONFIRM: PostHog is set to discard IP addresses]",
        "PostHog keeps events for up to [CONFIRM: analytics retention, e.g. 1 year]. Because they are not linked to you, we cannot find or delete a particular person’s events.",
      ],
    },
    {
      id: "crashes",
      title: "Crash reports",
      body: [
        "Stack has no crash-reporting service of its own. If you share analytics with app developers in iOS Settings, Apple may send us crash reports and diagnostics; Apple decides what they contain. When Stack closes unexpectedly, it notes this on your iPhone and may send a reliability event that carries no personal details (see Usage analytics).",
      ],
    },
    {
      id: "notifications",
      title: "Reminders, Live Activities and widgets",
      body: [
        "Workout reminders are scheduled on your iPhone; Stack does not use push notifications and has no push token for your device. Live Activities and widgets are drawn on your iPhone from data already there.",
      ],
    },
    {
      id: "imports",
      title: "Importing from Hevy",
      body: [
        "If you import with a Hevy API key, your iPhone connects to Hevy directly with the key you paste. The key is used only for that import, is not saved, and is never sent to Stack’s servers. If you import a Hevy export file, it is read on your iPhone. Imported workouts are then stored like any other workout.",
      ],
    },
    {
      id: "share-links",
      title: "Shared routine links",
      body: [
        "When you share a routine as a link, Stack uploads the routine’s name, workout names, exercise names and any custom exercises to Stack’s routine server, which creates a link at liftwithstack.com/r/…. The link does not include your name or account. **Anyone who has the link can see the routine.** Links do not expire and are not connected to your account, so deleting your account does not remove them.",
        `If you want a link taken down, contact us at ${CONTACT} with the link.`,
        "[CONFIRM: a takedown process for routine links exists]",
      ],
    },
    {
      id: "videos",
      title: "Exercise form videos",
      body: [
        "Some exercises have a short demonstration video from YouTube. When you open an exercise that has one, Stack loads the video’s preview image and YouTube’s player in the background so it starts quickly; the video plays when you tap Check form. YouTube (Google) receives your IP address and device details when this happens, under Google’s privacy policy. Stack uses YouTube’s privacy-enhanced mode.",
      ],
    },
    {
      id: "website",
      title: "Our website",
      body: [
        "liftwithstack.com uses no cookies, analytics or forms. Our hosting provider keeps standard server logs (such as IP address, time and page requested) to run and protect the site. [CONFIRM: website host — Vercel or Cloudflare — and its log retention]",
        "The demonstration video on the home page loads from YouTube only when you press play.",
      ],
    },
    {
      id: "providers",
      title: "Service providers and where data is processed",
      body: [
        "We use these providers to run Stack. They process data on our behalf, for the purposes in this policy. [CONFIRM: data processing agreements are in place with each]",
        { table: {
          head: ["Provider", "What for", "Where"],
          rows: [
            ["Supabase", "Sign-in, account database, Cloud Sync, Circle, Moments storage", "India (Mumbai)"],
            ["Railway", "Stack’s API servers", "Singapore"],
            ["Railway", "Routine import, Highlights, shared routine links", "United States (West)"],
            ["OpenRouter and the AI model provider (currently Google and DeepSeek models)", "AI features, after you allow them", "United States; the model provider’s location varies [CONFIRM: model host locations]"],
            ["PostHog", "Usage analytics", "European Union (Germany)"],
            ["Apple", "Sign in with Apple, app distribution, crash reports you allow", "Apple’s locations"],
            ["Google", "Google sign-in; YouTube form videos", "Google’s locations"],
            ["[CONFIRM: website host]", "Hosting liftwithstack.com", "[CONFIRM: hosting region]"],
          ],
        } },
        "Hevy and Spotify receive data only when you use them directly: Hevy when you import with your own key, Spotify when you open a playlist link.",
      ],
    },
    {
      id: "transfers",
      title: "International transfers",
      body: [
        "Your data may be processed in countries other than yours, including India, Singapore, the United States and the EU. [CONFIRM: transfer safeguards (for example standard contractual clauses) relied on for each provider]",
      ],
    },
    {
      id: "retention",
      title: "How long we keep data",
      body: [{ table: {
        head: ["Data", "Kept"],
        rows: [
          ["On your iPhone", "Until you delete it, use Delete all data, or delete the app"],
          ["Account, sign-in records, Cloud Sync copies and checkpoints, Circle", "Until you delete your account, then deleted within 7 days"],
          ["Moments in the cloud", "Until you remove them (then 7 days) or delete your account"],
          ["What you share in Circle", "Until you turn that category off, unshare, or delete your account"],
          ["Old handle", "30 days after you change it"],
          ["Circle invites", "Expire after 7 days; deleted 30 days after that"],
          ["Reports", "180 days after they are resolved"],
          ["Who has seen whom in Circle (for reporting only)", "180 days"],
          ["Apple token during account deletion", "Until revoked, about two days at most"],
          ["Record that an account was deleted", "Account ID and dates only, kept so a deleted account stays deleted if we restore our systems [CONFIRM: retention period]"],
          ["Shared routine links", "Indefinitely, unless taken down on request"],
          ["Usage analytics", "[CONFIRM: analytics retention]"],
          ["Server logs", "[CONFIRM: Railway and website log retention]"],
        ],
      } }],
    },
    {
      id: "delete",
      title: "Deleting your account and data",
      body: [
        "**Delete your account:** in Stack, go to Settings → Account → Delete account. You’ll be asked to sign in again first. Deletion is permanent.",
        "Your account stops working at once. Within 7 days (usually within an hour) we delete your account and sign-in records, Cloud Sync copies and checkpoints, your Circle profile, friends, requests, nudges, bolts and what you shared, and photos you backed up. If you signed in with Apple, we also revoke Stack’s access to your Apple ID. We keep only a record of the account ID and dates, with no name, email or content, so the account stays deleted if we ever restore our systems.",
        "Not covered by account deletion: usage analytics (not linked to you), shared routine links (not linked to your account), and AI request metadata held by OpenRouter.",
        "Workouts and photos on your iPhone are not deleted with your account. Remove them with Settings → Manage data → Delete all data.",
        `You can also ask us to delete your data by contacting ${CONTACT}.`,
      ],
    },
    {
      id: "security",
      title: "Security",
      body: [
        "Data between the app, Stack’s servers and our providers travels over encrypted connections (HTTPS/TLS). Supabase states that it encrypts stored data. Stack’s database is closed to direct access from the app, every request is checked against your account, and shared photos are reached only through links that expire within minutes. No system is perfectly secure; if a breach affects you, we will tell you as the law requires.",
      ],
    },
    {
      id: "rights",
      title: "Your choices and rights",
      body: [
        "In the app you can: use Stack without an account; turn Cloud Sync, Moments backup and each Circle sharing category on or off; withdraw AI consent; turn off analytics; export your history; and delete your account and your data.",
        `Depending on where you live, you may have the right to access, correct, delete or receive a copy of your personal information, to object to or restrict some processing, and to withdraw consent. To make a request, contact ${CONTACT}. We may need to confirm the request comes from you, for example by asking you to send it while signed in. You can also complain to your local data protection authority.`,
        "[CONFIRM: legal bases relied on for each purpose (for example contract for the account and Cloud Sync, consent for AI features, legitimate interests for analytics and security), and any state-specific (US) or country-specific wording required]",
        "We do not sell your personal information or share it for cross-context behavioural advertising, and Stack does not track you across other companies’ apps or websites.",
      ],
    },
    {
      id: "children",
      title: "Children",
      body: [
        "Stack is not meant for children under [CONFIRM: minimum age], and we do not knowingly collect their personal information. If you believe a child has given us information, contact us and we will delete it.",
      ],
    },
    {
      id: "changes",
      title: "Changes to this policy",
      body: [
        "We will update this page when Stack changes how it handles data, and change the date at the top. If a change is significant, we will tell you in the app before it takes effect.",
      ],
    },
    {
      id: "contact",
      title: "Contact",
      body: [
        `${OPERATOR}, ${ADDRESS}. Email: ${CONTACT}. For help with the app, see [Support](/support).`,
      ],
    },
  ],
};

export const TERMS: LegalDocument = {
  path: "/terms",
  eyebrow: "TERMS OF USE",
  h1: "Terms of Use",
  title: "Terms of Use — Stack (liftwithstack.com)",
  description: "The terms for using Stack, including Circle’s rules, AI features, and how accounts are ended.",
  updated: TERMS_VERSION,
  lead: [
    `These terms are an agreement between you and ${OPERATOR} (“Stack”, “we”, “us”) for the Stack (liftwithstack.com) iPhone app, its online features and liftwithstack.com. By using Stack you agree to them. If you don’t agree, don’t use Stack.`,
    "Our [Privacy Policy](/privacy) explains how we handle your information.",
  ],
  sections: [
    {
      id: "eligibility",
      title: "Who can use Stack",
      body: [
        "You must be at least [CONFIRM: minimum age] years old to use Stack, and old enough to agree to these terms where you live. If you use Stack on behalf of someone else, you confirm you’re allowed to.",
      ],
    },
    {
      id: "account",
      title: "Your account",
      body: [
        "You can use Stack without an account. Cloud Sync, Moments backup and Circle need one, created with Sign in with Apple or Google. Keep access to that sign-in secure; you’re responsible for what happens in your account. Tell us if you think someone else is using it.",
      ],
    },
    {
      id: "use",
      title: "Acceptable use",
      body: [
        "You agree not to:",
        { list: [
          "break the law, or use Stack to harm, deceive or exploit anyone",
          "post or share content you don’t have the right to share, or that infringes someone else’s rights",
          "try to access accounts, data or systems that aren’t yours, or get around limits, security or moderation",
          "interfere with Stack, overload it, or use bots, scraping or automated access",
          "copy, reverse engineer or resell Stack, except where the law allows it",
          "use Stack’s AI features to produce content that breaks these terms",
        ] },
      ],
    },
    {
      id: "circle",
      title: "Circle rules",
      body: [
        "Circle is for friends who train together. To use it, you agree to these rules:",
        { list: [
          "Add only people you know.",
          "Be respectful.",
          "No harassment, bullying, threats or hate.",
          "No sexual, violent or otherwise objectionable content.",
          "No spam, and no pretending to be someone else.",
          "Share photos only of yourself, or of people who agreed to it.",
        ] },
        "**Stack has zero tolerance for objectionable content and abusive users.** We remove content that breaks these rules and suspend or end the accounts that post it. You can report or block anyone, at any time.",
      ],
    },
    {
      id: "reporting",
      title: "Reporting and moderation",
      body: [
        "You can report a person, photo, workout or Circle page from the “…” menu where it appears, and block anyone. See [Support](/support#report) for the steps. We aim to review reports within [CONFIRM: report review time, e.g. 24 hours].",
        "We may review reported content, hide or remove content, restrict an account’s access to Circle, or suspend or end an account, with or without notice, when we reasonably believe it breaks these terms or the law, or puts someone at risk. We may keep records of reports as described in the Privacy Policy. If you think we made a mistake, contact us.",
      ],
    },
    {
      id: "content",
      title: "Your content",
      body: [
        "Your workouts, notes, photos, routines, names and anything else you add to Stack stay yours.",
        "You give Stack a limited licence to store, copy, process and display your content only as needed to run Stack for you: for example to sync it, back it up, show it to the friends you choose, create a shared routine link you ask for, or send text to an AI feature you use. The licence is worldwide and free of charge, and ends when you delete the content or your account, except for copies you shared with others (such as a routine link) and copies we must keep by law.",
        "You confirm you have the rights to what you share, and that sharing it doesn’t break these terms.",
      ],
    },
    {
      id: "ai",
      title: "AI features",
      body: [
        "Paste my routine and Highlights use AI models run by other companies, and only after you allow it. AI output can be incomplete or wrong. Check imported routines and highlights before you rely on them, and especially before you lift. You can turn AI features off in Settings → Manage data → AI features.",
      ],
    },
    {
      id: "health",
      title: "Training and health",
      body: [
        "Stack is a training log and planning tool. It is not medical advice and does not replace a doctor, physiotherapist or qualified coach. Plans, suggested weights, videos and highlights are general information. Check with a professional before starting a new training plan, especially if you have an injury or health condition. Stop if something hurts. You train at your own risk.",
      ],
    },
    {
      id: "ip",
      title: "Stack’s rights",
      body: [
        "Stack, its design, code, Your Stack visuals, exercise illustrations and name belong to us or our licensors. We give you a personal, non-transferable licence to use the app on Apple devices you own or control, under these terms and Apple’s Usage Rules. Exercise videos belong to their creators and are shown through YouTube.",
      ],
    },
    {
      id: "third-party",
      title: "Other services",
      body: [
        "Stack works with services run by others: Apple and Google for sign-in, YouTube for videos, Hevy for imports, Spotify for playlist links, and the providers named in the Privacy Policy. Their own terms apply to your use of them, and we are not responsible for them.",
      ],
    },
    {
      id: "apple",
      title: "Apple",
      body: [
        "These terms are between you and Stack, not Apple. Apple is not responsible for Stack or its content, has no obligation to provide maintenance or support, and is not responsible for any claims relating to Stack (including product liability, legal or regulatory claims, or intellectual property claims). If Stack fails to conform to any applicable warranty, you may notify Apple, and Apple may refund the purchase price, if any; to the extent permitted by law, Apple has no other warranty obligation. You confirm you are not in a country subject to a US Government embargo or listed on a US Government list of prohibited or restricted parties. Apple and its subsidiaries are third-party beneficiaries of these terms and may enforce them against you.",
      ],
    },
    {
      id: "paid",
      title: "Paid features",
      body: [
        "Stack has no paid features today. If we add any, their terms will be shown before you buy, and purchases will be handled by Apple.",
      ],
    },
    {
      id: "ending",
      title: "Ending your use, and deleting your account",
      body: [
        "You can stop using Stack at any time. You can delete your account in Settings → Account → Delete account; the [Privacy Policy](/privacy#delete) explains what is deleted and when. Data on your iPhone stays until you remove it.",
        "We may suspend or end your access to online features if you break these terms, if the law requires it, or if we stop offering a feature. Where reasonable, we will tell you first and give you a chance to export your data.",
      ],
    },
    {
      id: "changes-to-stack",
      title: "Changes to Stack",
      body: [
        "Stack is being developed and some features are in beta. We may add, change or remove features. We try to keep your data safe through changes, but please keep your own exports or backups of anything important.",
      ],
    },
    {
      id: "disclaimers",
      title: "Disclaimers",
      body: [
        "To the extent the law allows, Stack is provided “as is” and “as available”, without warranties of any kind, including that it will be error-free, uninterrupted, or that data will never be lost. Nothing in these terms limits rights you have under consumer law that cannot be limited.",
      ],
    },
    {
      id: "liability",
      title: "Limitation of liability",
      body: [
        "To the extent the law allows, Stack is not liable for indirect or consequential losses, lost data or lost profits, or for injury from training. Our total liability for any claim relating to Stack is limited to the greater of the amount you paid us in the 12 months before the claim and [CONFIRM: liability cap amount]. Nothing limits liability for death or personal injury caused by our negligence, for fraud, or anything else that cannot be limited by law. [CONFIRM: lawyer review of this section for the governing law]",
      ],
    },
    {
      id: "law",
      title: "Governing law and disputes",
      body: [
        "These terms are governed by the laws of [CONFIRM: governing law], and disputes will be handled by the courts of [CONFIRM: courts / venue], unless the law where you live gives you the right to bring a claim in your local courts.",
      ],
    },
    {
      id: "changes",
      title: "Changes to these terms",
      body: [
        "We may update these terms. We will change the date at the top and, for significant changes, tell you in the app before they take effect. If you keep using Stack after that, the new terms apply.",
      ],
    },
    {
      id: "contact",
      title: "Contact",
      body: [
        `${OPERATOR}, ${ADDRESS}. Email: ${CONTACT}. Help with the app: [Support](/support).`,
      ],
    },
  ],
};

export const SUPPORT: LegalDocument = {
  path: "/support",
  eyebrow: "SUPPORT",
  h1: "Support",
  title: "Support — Stack (liftwithstack.com)",
  description: "Get help with Stack: reporting someone in Circle, deleting your account, AI features and data requests.",
  updated: SUPPORT_UPDATED,
  lead: [
    "Help with Stack (liftwithstack.com): how to report someone in Circle, delete your account or data, manage AI features and analytics, and contact us.",
  ],
  sections: [
    {
      id: "contact",
      title: "Get help",
      body: [
        `Email ${CONTACT}. Tell us what happened and which iPhone and iOS version you use. Please don’t send passwords, API keys or photos of other people.`,
        "[CONFIRM: support response time]",
      ],
    },
    {
      id: "report",
      title: "Report someone in Circle",
      body: [
        "You can report a person, a photo, a workout or a Circle page. The person isn’t told who reported them.",
        { steps: [
          "A person: in Circle, tap your friend, then “…” at the top right → Report. Or Circle → Sharing settings → Your circle → tap the friend → Report.",
          "A photo: open it, then “…” → Report photo. In a photo grid, touch and hold the photo → Report Photo.",
          "A workout: on the This Week card, “…” → Report workout, or open the workout → “…” → Report workout.",
          "A friend request or invite: the request’s “…” → Report, or Report on the invite screen.",
          "Pick a reason, add a note if you like (up to 300 characters), and send. You can block the person at the same time.",
        ] },
        "A photo you report disappears from your view straight away. We aim to review reports within [CONFIRM: report review time, e.g. 24 hours] and remove content and suspend accounts that break the [Circle rules](/terms#circle).",
      ],
    },
    {
      id: "safety",
      title: "Community and safety",
      body: [
        "Circle is for friends who train together, and Stack has zero tolerance for harassment, hate, sexual or violent content, spam and impersonation. Read the [Circle rules](/terms#circle) any time in the app: Circle → Sharing settings → Safety → Circle rules.",
        "**Block someone:** tap the friend → “…” → Block, or Circle → Sharing settings → Your circle → tap the friend → Block. Blocking removes them from your circle, cancels requests between you and deletes their nudges; they can’t find you, send you a request or use your invite. Unblock in Circle → Sharing settings → Blocked.",
        "**Leave someone’s circle:** tap the friend → “…” → Remove from circle.",
        "If your Circle access was restricted after a report and you think it’s a mistake, contact us.",
        "If someone is in danger, contact your local emergency services first.",
      ],
    },
    {
      id: "delete-account",
      title: "Delete your account",
      body: [
        { steps: [
          "Open Stack and go to Settings → Account.",
          "Tap Delete account and confirm.",
          "Sign in again when asked. This confirms it’s you.",
        ] },
        "Your account stops working at once, and we delete what we hold for it within 7 days, usually within an hour. Workouts and photos on your iPhone stay until you delete them. See the [Privacy Policy](/privacy#delete) for the details.",
        `Can’t open the app? Email ${CONTACT} from the email linked to your sign-in, and we’ll help.`,
      ],
    },
    {
      id: "delete-device",
      title: "Delete data on your iPhone",
      body: [
        "Settings → Manage data → Delete all data removes Stack’s data from this iPhone and returns to setup. Export a backup first if you want to keep anything. Deleting the app also removes it.",
      ],
    },
    {
      id: "ai",
      title: "AI features",
      body: [
        "Paste my routine and Highlights use an AI model. Stack asks before sending anything, and explains what is sent and to whom.",
        "**Withdraw consent:** Settings → Manage data → AI features, then turn off Allow AI features. Nothing more is sent, requests in progress are cancelled, and AI-written Highlights are deleted from your iPhone. Everything else in Stack works the same.",
        "AI can be wrong. Check imported routines and highlights before you use them.",
      ],
    },
    {
      id: "analytics",
      title: "Usage data",
      body: [
        "To stop sending usage data, turn off Settings → Manage data → Share anonymous usage data.",
      ],
    },
    {
      id: "requests",
      title: "Data requests",
      body: [
        `To ask for a copy of your data, a correction, or deletion, email ${CONTACT}. You can export your workout history any time in Settings → Manage data → Export workout history.`,
        "To take down a shared routine link, send us the link.",
      ],
    },
    {
      id: "legal",
      title: "Legal",
      body: [
        "[Privacy Policy](/privacy) · [Terms of Use](/terms)",
      ],
    },
  ],
};

export const LEGAL_DOCUMENTS = [PRIVACY, TERMS, SUPPORT] as const;

/** "18 November 2026" */
export function longDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}
