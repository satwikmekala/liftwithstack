import assert from "node:assert/strict";
import test from "node:test";

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${path}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the Stack marketing page", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Stack — Every workout stacks up\.<\/title>/);
  assert.match(html, /Every workout[\s\S]*stacks up\./);
  assert.match(html, /Log your training\. See your progress take shape\.[\s\S]*Bring your gym friends along\./);
  assert.match(html, /Don’t overthink it\./);
  assert.match(html, /Every week becomes a layer\./);
  // The story: history, form check, then Your Stack, your circle and Moments.
  assert.match(html, /Chest and Triceps/);
  assert.match(html, /Forgot what you lifted last time\?/);
  assert.match(html, />Check history</);
  assert.match(html, /Not sure about the form\?/);
  assert.match(html, />Check form</);
  assert.doesNotMatch(html, />Just train</);
  assert.match(html, /id="circle"[\s\S]*Stack up together\.[\s\S]*id="moments"[\s\S]*Some workouts are worth remembering\./);
  assert.match(html, /Coming soon|COMING SOON/);
  assert.match(html, /Made for how you actually train\./);
  // Form Check is a hand-picked video, never an analysis of your own lifting; it loads only when asked.
  assert.doesNotMatch(html, /\bAI\b|analy[sz]e your form|real-time feedback/i);
  assert.doesNotMatch(html, /<iframe/);
  // The RC6 refresh: Body Map, the recap, the new Progress tab, Get Stack's Plan.
  assert.match(html, /id="body-map"[\s\S]*See what you’re training, live\.[\s\S]*id="recap"[\s\S]*Every workout gets a proper recap\./);
  assert.match(html, /YOUR STRENGTH[\s\S]*Your chest lifts are improving together\./);
  assert.match(html, /Not sure what to train\?[\s\S]*Upper \/ Lower/);
  assert.match(html, /Cloud Sync/);
  // Photo sharing to a circle is not live yet, so it is never promised as available.
  assert.match(html, /ROLLING OUT/);
  assert.doesNotMatch(html, /the photos they share/);
  assert.match(html, /Progress has substance\./);
  assert.match(html, /Already training\? Bring it with you\./);
  assert.match(html, /From ChatGPT/);
  assert.match(html, /Ready to build your own\?/);
  assert.match(html, /instagram\.com\/liftwithstack/);
  assert.match(html, /for beta access/);
  assert.match(html, /Request beta access/);
  assert.match(html, /<a[^>]*class="download download--large"[^>]*href="https:\/\/www.instagram.com\/liftwithstack"/);
  assert.equal((html.match(/<link[^>]*rel="preload"[^>]*as="font"/g) ?? []).length, 3);
  assert.match(html, /Read routine/);
  assert.match(html, /From Notes/);
  assert.match(html, /My Stack/);
  assert.match(html, /id="how"/);
  // Retired or banned terms from the content style sheet never reach the page.
  for (const banned of [/\bsplits?\b/i, /\bprogram\b/i, /\bsession\b/i, /\bsealed\b/i, /\bvolume\b/i, /\blbs\b/, /NEW BEST|NEW RECORD/, /Oops|Something went wrong/, /!(?=[\s<])/]) {
    assert.doesNotMatch(html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, ""), banned);
  }
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/i);
});

test("server-renders the science of getting stronger", async () => {
  const response = await render("/science");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /<title>Remember when 10 kg felt heavy\?/);
  // Six stops, in order: explanation beside something to move, with a few questions.
  const order = ["Tap the muscle that lifts a dumbbell in a curl", "Lift it yourself", "Bundles inside bundles", "What happens when it shortens?",
    "The lifting is the start", "10 kg doesn’t feel the same anymore", "Why 10 kg stopped feeling heavy", "You might remember what you lifted today"];
  let at = 0;
  for (const heading of order) {
    const next = html.indexOf(heading, at);
    assert.ok(next > at, `${heading} comes in order`);
    at = next;
  }
  // Every explanation is in the HTML, whether or not its question has been answered.
  for (const kept of ["Muscles only pull", "Filaments keep their length and slide", "needs a fresh ATP to let go", "Strength and size are two different changes", "Progressive overload is keeping the set hard"]) {
    assert.match(html, new RegExp(kept));
  }
  // Questions are the exception: the opening tap and three more.
  assert.equal(html.match(/class="ask__prompt"/g)?.length, 2);
  // Real terms, introduced in the lesson itself.
  for (const term of ["Biceps brachii", "Fascicle", "Muscle fiber", "Myofibril", "Sarcomere", "Z-disc", "cross-bridge cycle", "ATP", "mechanical tension", "mTORC1", "motor unit", "relative effort", "progressive overload"]) {
    assert.match(html, new RegExp(term));
  }
  assert.match(html, /Every workout stacks up\./);
  assert.match(html, /id="sources"/);
  assert.match(html, /pubmed\.ncbi\.nlm\.nih\.gov\/41718594/);
  // Credit for the adapted anatomy model, with its licence.
  assert.match(html, /id="credits"[\s\S]*original illustrations[\s\S]*Écorché[\s\S]*CC BY-SA 4\.0/);
  const body = html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, "");
  // Retired copy and the analogy that had to be un-learned stay gone.
  assert.doesNotMatch(body, /Tiny hands|hands pulling|ropes\.|Beat last week|Same gym\. Same days|louder the message|Your muscle is listening|The choice is yours/);
  // The science stays honest: no AI coach, no promises, no soreness-as-progress.
  assert.doesNotMatch(body, /\bAI\b|guarantee|no pain, no gain/i);
  // Illustrations and examples are labelled as such.
  assert.match(body, /not to scale/i);
  assert.match(body, /made-up but typical example/);
  assert.match(body, /Illustrative\./);
  assert.match(body, /isn’t a forecast for you/);
});

test("the home page opens the door to the science", async () => {
  const html = await (await render()).text();
  assert.match(html, /href="\/science"[\s\S]*Remember when 10(&nbsp;|\u00a0| )kg felt heavy\?/);
});
