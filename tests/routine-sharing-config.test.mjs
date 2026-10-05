import assert from 'node:assert/strict';
import { test } from 'node:test';
import fs from 'node:fs';
const config = JSON.parse(fs.readFileSync(new URL('../vercel.json', import.meta.url), 'utf8'));

test('sharing routes proxy internally to the existing Railway backend without claiming the homepage', () => {
  const backend = 'https://motivated-caring-production-04ef.up.railway.app';
  assert.deepEqual(config.rewrites, [
    { source: '/r', destination: `${backend}/r` },
    { source: '/r/:path*', destination: `${backend}/r/:path*` },
  ]);
  assert.equal(config.redirects?.some(r => r.source.startsWith('/r')), undefined);
  const shareHeaders = config.headers.find(rule => rule.source === '/r/:path*').headers;
  assert.ok(shareHeaders.some(header => header.key === 'Cache-Control' && header.value === 'no-store'));
});

test('AASA and preview assets remain available even when the Railway backend is unavailable', () => {
  const aasa = JSON.parse(fs.readFileSync(new URL('../public/.well-known/apple-app-site-association', import.meta.url), 'utf8'));
  assert.deepEqual(aasa, { applinks: { apps: [], details: [{ appID: '4JMBGPRDZG.com.liftwithstack.stack', paths: ['/r/*'] }] } });
  const header = config.headers.find(rule => rule.source === '/.well-known/apple-app-site-association');
  assert.ok(header.headers.some(h => h.key === 'Content-Type' && h.value === 'application/json'));
  const png = fs.readFileSync(new URL('../public/routine-share-assets/stack-routine-v1.png', import.meta.url));
  assert.equal(png.subarray(1, 4).toString(), 'PNG');
  assert.equal(png.readUInt32BE(16), 1200); assert.equal(png.readUInt32BE(20), 630);
  for (const face of ['BricolageGrotesque', 'HankenGrotesk', 'JetBrainsMono']) {
    const font = fs.readFileSync(new URL(`../public/routine-share-assets/${face}-Latin.woff2`, import.meta.url));
    assert.equal(font.subarray(0, 4).toString(), 'wOF2');
  }
});
