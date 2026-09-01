import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${pathname}`, { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the ChingLam landing page", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /菁林體育會/);
  assert.match(html, /ChingLam Sport Club/);
  assert.match(html, /立即報名/);
  assert.match(html, /家長報名表/);
  assert.match(html, /不會用於診斷 SEN 或 ADHD/);
  assert.doesNotMatch(html, /Your site is taking shape|Building your site|codex-preview/i);
});

test("includes the protected admin surface and registration persistence", async () => {
  const [adminPage, route, schema, hosting] = await Promise.all([
    render("/admin"),
    readFile(new URL("../app/api/registrations/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../db/schema.ts", import.meta.url), "utf8"),
    readFile(new URL("../.openai/hosting.json", import.meta.url), "utf8"),
  ]);

  assert.equal(adminPage.status, 200);
  assert.match(await adminPage.text(), /報名資料/);
  assert.match(route, /export async function POST/);
  assert.match(route, /export async function PATCH/);
  assert.match(route, /x-admin-key/);
  assert.match(schema, /sqliteTable\(\s*"registrations"/);
  assert.match(hosting, /"d1"\s*:\s*"DB"/);
});

