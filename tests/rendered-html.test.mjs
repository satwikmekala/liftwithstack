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
  assert.match(html, /<title>You’re showing up\. So why aren’t you changing\?/);
  assert.match(html, /The answer is inside your muscle, on every rep\./);
  assert.match(html, /This is you, curling 10 kg\./);
  assert.match(html, /Tiny hands, pulling on ropes\./);
  assert.match(html, /The building happens when you leave\./);
  assert.match(html, /Then 10 kg stops being hard\./);
  assert.match(html, /Same gym\. Same days\. Different result\./);
  assert.match(html, /Beat last week\./);
  assert.match(html, /One more rep/);
  assert.match(html, /It’s slower than you think\./);
  assert.match(html, /You can’t beat a number you can’t remember\./);
  assert.match(html, /Make the effort count\./);
  assert.match(html, /id="sources"/);
  assert.match(html, /pubmed\.ncbi\.nlm\.nih\.gov\/30335577/);
  // Plain words on the page; the jargon lives in the sources.
  const body = html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, "");
  const story = body.slice(0, body.indexOf('id="sources"'));
  assert.doesNotMatch(story, /mTORC1|sarcomere|hypertrophy|actin/i);
  // The science stays honest: no AI coach, no promises, no soreness-as-progress.
  assert.doesNotMatch(html, /\bAI\b|guarantee|no pain, no gain/i);
  // Illustrations are labelled.
  assert.match(html, /not a forecast/);
});

test("the home page opens the door to the science", async () => {
  const html = await (await render()).text();
  assert.match(html, /href="\/science"[\s\S]*You’re showing up\. So why aren’t you changing\?/);
});
