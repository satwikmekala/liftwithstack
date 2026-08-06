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
  assert.match(html, /Stack — Strength Training for Busy People/);
  assert.match(html, /Open it\.[\s\S]*Lift\.[\s\S]*Keep moving\./);
  assert.match(html, /Fitness should demand effort from your body/);
  assert.match(html, /Show up\. Stack will have the workout ready\./);
  assert.match(html, /id="why-stack-exists"/);
  assert.match(html, /id="download"/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/i);
});
