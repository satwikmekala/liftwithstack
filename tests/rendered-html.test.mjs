import assert from "node:assert/strict";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
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
  assert.match(html, /Log every set, or just show up\.[\s\S]*Keep the moments\. Bring your people\./);
  assert.match(html, /Don’t overthink it\./);
  assert.match(html, /Every week becomes a layer\./);
  // The story offers both ways to log, and the chapters that follow it.
  assert.match(html, /role="radio"[^>]*>Log sets</);
  assert.match(html, /role="radio"[^>]*>Just train</);
  assert.match(html, /Keep the moment too\./);
  assert.match(html, /id="moments"[\s\S]*More than numbers\./);
  assert.match(html, /Lock a photo to keep it to yourself\./);
  assert.match(html, /id="circle"[\s\S]*Better with your people\./);
  assert.match(html, /What friends see/);
  assert.match(html, /Friends see this week’s Stack\./);
  assert.match(html, /Nobody can search or browse\./);
  assert.match(html, /id="form-check"[\s\S]*A little more confidence in every rep\./);
  assert.match(html, /They stream from YouTube/);
  // Form Check is a hand-picked video, never an analysis of your own lifting.
  assert.doesNotMatch(html, /\bAI\b|analy[sz]e your form|real-time feedback/i);
  assert.match(html, /Progress has substance\./);
  assert.match(html, /Paste what you already train\. Stack will sort it out\./);
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
