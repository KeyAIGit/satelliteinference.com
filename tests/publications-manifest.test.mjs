import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { validatePublicationManifest } from "../lib/publication-manifest.mjs";

const publicRoot = fileURLToPath(new URL("../public", import.meta.url));
const manifestPath = fileURLToPath(new URL("../public/documents/manifest.json", import.meta.url));
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));

const copy = () => structuredClone(manifest);

test("validates the two-purpose public reading set against its exact PDFs", async () => {
  assert.deepEqual(await validatePublicationManifest(manifest, publicRoot), { valid: true, documentCount: 2 });
  assert.deepEqual(manifest.documents.map(({ id }) => id), [
    "public-whitepaper-v0-4",
    "mission-definition-10kw-v0-3",
  ]);
  assert.ok(manifest.documents.every(({ filename }) => !/fundrais|capital|investor/i.test(filename)));
});

test("rejects duplicate publication IDs and unsafe paths", async () => {
  const duplicate = copy();
  duplicate.documents[1].id = duplicate.documents[0].id;
  await assert.rejects(validatePublicationManifest(duplicate, publicRoot), /duplicate/);

  const unsafe = copy();
  unsafe.documents[0].filename = "../private.pdf";
  await assert.rejects(validatePublicationManifest(unsafe, publicRoot), /unsafe/);
});

test("rejects unknown status and absent concept disclaimer", async () => {
  const status = copy();
  status.documents[0].status = "FLIGHT_RELEASE";
  await assert.rejects(validatePublicationManifest(status, publicRoot), /unknown publication status/);

  const disclaimer = copy();
  disclaimer.documents[0].disclaimer = "";
  await assert.rejects(validatePublicationManifest(disclaimer, publicRoot), /disclaimer missing/);
});

test("rejects file size, hash, page count, and missing file mismatches", async () => {
  const size = copy();
  size.documents[0].byteSize += 1;
  await assert.rejects(validatePublicationManifest(size, publicRoot), /size mismatch/);

  const hash = copy();
  hash.documents[0].sha256 = "0".repeat(64);
  await assert.rejects(validatePublicationManifest(hash, publicRoot), /hash mismatch/);

  const pages = copy();
  pages.documents[0].pageCount += 1;
  await assert.rejects(validatePublicationManifest(pages, publicRoot), /page-count mismatch/);

  const missing = copy();
  missing.documents[0].filename = "Missing_Publication.pdf";
  missing.documents[0].url = "/documents/Missing_Publication.pdf";
  await assert.rejects(validatePublicationManifest(missing, publicRoot), /ENOENT/);
});

test("keeps the public layer free of superseded hosted and sub-kilowatt flight documents", async () => {
  const text = JSON.stringify(manifest).toLowerCase();
  for (const stale of ["hosted payload", "hosted-pathfinder", "0.2 kw", "0.5 kw", "1 kw flight"]) {
    assert.ok(!text.includes(stale), `superseded public document remains: ${stale}`);
  }
});
