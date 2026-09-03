import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const cadSource = path.join(projectRoot, "public/assets/concepts/orbital-node-10kw-concept-v01.png");
const logoSource = path.join(projectRoot, "public/logo-mark.svg");
const output = path.join(projectRoot, "public/og.png");

const grid = Array.from({ length: 14 }, (_, index) => {
  const x = index * 90;
  return `<path d="M ${x} 0 V 630"/>`;
}).join("") + Array.from({ length: 8 }, (_, index) => {
  const y = index * 90;
  return `<path d="M 0 ${y} H 1200"/>`;
}).join("");

const overlay = Buffer.from(`
  <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
    <style>
      .sans { font-family: Arial, Helvetica, sans-serif; }
      .mono { font-family: Menlo, Consolas, monospace; }
    </style>
    <rect width="1200" height="630" fill="#06111f"/>
    <g fill="none" stroke="#4fe5ff" stroke-opacity="0.055" stroke-width="1">${grid}</g>
    <rect x="545" y="46" width="615" height="505" fill="#081725" stroke="#4fe5ff" stroke-opacity="0.18"/>
    <path d="M545 46 h54 M545 46 v54 M1160 551 h-54 M1160 551 v-54" fill="none" stroke="#4fe5ff" stroke-width="2"/>
    <text x="126" y="82" class="sans" fill="#f3fbff" font-size="27" font-weight="700">SATELLITE INFERENCE</text>
    <text x="62" y="148" class="mono" fill="#4fe5ff" font-size="12" font-weight="700" letter-spacing="2">ORBITAL COMPUTING INFRASTRUCTURE</text>
    <text x="61" y="254" class="sans" fill="#f3fbff" font-size="58" font-weight="500">10 kW continuous</text>
    <text x="61" y="326" class="sans" fill="#f3fbff" font-size="58" font-weight="500">compute in LEO.</text>
    <text x="63" y="397" class="sans" fill="#9db2c0" font-size="22">Planned 1 kW ground tile: first validation step.</text>
    <text x="63" y="565" class="mono" fill="#ffbd4a" font-size="12" font-weight="700" letter-spacing="1">10 KW ORBITAL NODE / REV C CONCEPT</text>
    <text x="63" y="590" class="mono" fill="#6f899a" font-size="11" letter-spacing="1">SATELLITEINFERENCE.COM</text>
  </svg>
`);

const cad = await sharp(cadSource)
  .resize(570, 420, { fit: "contain", background: "#081725" })
  .png()
  .toBuffer();

const logo = await sharp(await readFile(logoSource)).resize(48, 48).png().toBuffer();

await sharp(overlay)
  .composite([
    { input: cad, left: 568, top: 88 },
    { input: logo, left: 62, top: 48 },
  ])
  .png({ compressionLevel: 9, palette: true, quality: 92 })
  .toFile(output);

const metadata = await sharp(output).metadata();
console.log(`${output}: ${metadata.width}x${metadata.height}, ${metadata.size ?? "unknown"} bytes`);
