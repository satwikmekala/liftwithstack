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
  assert.match(html, /Log your training\.[\s\S]*See your progress take shape\./);
  assert.match(html, /Don’t overthink it\./);
  assert.match(html, /Every week becomes a layer\./);
  assert.match(html, /Progress has substance\./);
  assert.match(html, /Paste what you already train\. Stack will sort it out\./);
  assert.match(html, /Don’t slack\. Just stack\./);
  assert.match(html, /instagram\.com\/liftwithstack/);
  assert.match(html, /for beta access/);
  assert.match(html, /Beta testing now/);
  assert.match(html, /Beta testing on iOS/);
  assert.match(html, /id="how"/);
  // Retired or banned terms from the content style sheet never reach the page.
  for (const banned of [/\bsplits?\b/i, /\bprogram\b/i, /\bsession\b/i, /\bsealed\b/i, /\bvolume\b/i, /\blbs\b/, /NEW BEST|NEW RECORD/, /Oops|Something went wrong/, /!(?=[\s<])/, /\bMy Stack\b/]) {
    assert.doesNotMatch(html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, ""), banned);
  }
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/i);
});
