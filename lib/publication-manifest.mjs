import { createHash } from "node:crypto";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";

const ALLOWED_STATUSES = new Set(["CONCEPT_DOCUMENT"]);
const SAFE_FILENAME = /^[A-Za-z0-9][A-Za-z0-9._-]*\.pdf$/;

function countPdfPages(bytes) {
  const text = bytes.toString("latin1");
  return [...text.matchAll(/\/Type\s*\/Page(?!s)\b/g)].length;
}

export async function validatePublicationManifest(manifest, publicRoot) {
  if (!manifest || manifest.schemaVersion !== "1.0.0" || !Array.isArray(manifest.documents)) {
    throw new Error("invalid publication manifest envelope");
  }

  const ids = new Set();
  for (const document of manifest.documents) {
    if (!document.id || ids.has(document.id)) throw new Error(`duplicate or missing document id: ${document.id}`);
    ids.add(document.id);
    if (!SAFE_FILENAME.test(document.filename)) throw new Error(`unsafe publication filename: ${document.filename}`);
    if (document.url !== `/documents/${document.filename}`) throw new Error(`unsafe or inconsistent publication URL: ${document.url}`);
    if (!ALLOWED_STATUSES.has(document.status)) throw new Error(`unknown publication status: ${document.status}`);
    if (typeof document.disclaimer !== "string" || !/concept document/i.test(document.disclaimer)) {
      throw new Error(`concept-document disclaimer missing: ${document.id}`);
    }

    const filePath = path.join(publicRoot, "documents", document.filename);
    const fileStat = await stat(filePath);
    if (fileStat.size !== document.byteSize) throw new Error(`publication size mismatch: ${document.id}`);
    const bytes = await readFile(filePath);
    const digest = createHash("sha256").update(bytes).digest("hex");
    if (digest !== document.sha256) throw new Error(`publication hash mismatch: ${document.id}`);
    if (countPdfPages(bytes) !== document.pageCount) throw new Error(`publication page-count mismatch: ${document.id}`);
  }

  return { valid: true, documentCount: manifest.documents.length };
}
