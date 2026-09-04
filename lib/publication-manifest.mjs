import { createHash } from "node:crypto";
import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";

const ALLOWED_STATUSES = new Set(["CONCEPT_DOCUMENT"]);
const SAFE_FILENAME = /^[A-Za-z0-9][A-Za-z0-9._-]*\.pdf$/;

function countPdfPages(bytes) {
  const text = bytes.toString("latin1");
  return [...text.matchAll(/\/Type\s*\/Page(?!s)\b/g)].length;
}

export async function validatePublicationManifest(manifest, publicRoot) {
  if (!manifest || manifest.schemaVersion !== "1.1.0" || !Array.isArray(manifest.documents) || !Array.isArray(manifest.archivedDocuments)) {
    throw new Error("invalid publication manifest envelope");
  }

  const ids = new Set();
  const filenames = new Set();
  const currentIds = new Set(manifest.documents.map(({ id }) => id));
  for (const document of [...manifest.documents, ...manifest.archivedDocuments]) {
    if (!document.id || ids.has(document.id)) throw new Error(`duplicate or missing document id: ${document.id}`);
    ids.add(document.id);
    if (!SAFE_FILENAME.test(document.filename)) throw new Error(`unsafe publication filename: ${document.filename}`);
    if (filenames.has(document.filename)) throw new Error(`duplicate publication filename: ${document.filename}`);
    filenames.add(document.filename);
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

  for (const document of manifest.archivedDocuments) {
    if (document.archiveStatus !== "SUPERSEDED_ARCHIVE" || !currentIds.has(document.supersededBy)) {
      throw new Error(`invalid archive status or current replacement: ${document.id}`);
    }
  }

  const entries = await readdir(path.join(publicRoot, "documents"), { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isFile() || (entry.name !== "manifest.json" && !filenames.has(entry.name))) {
      throw new Error(`unlisted or non-file publication asset: ${entry.name}`);
    }
  }

  return { valid: true, documentCount: manifest.documents.length, archiveCount: manifest.archivedDocuments.length };
}
