const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const INPUT_DIR = path.join(__dirname, "public/images/input");
const OUTPUT_DIR = path.join(__dirname, "public/images");

// Create output dir if missing
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Config (tweak once, reuse everywhere)
const MAX_WIDTH = 1200;        // good for hero + OG
const QUALITY = 80;            // sweet spot for web
const EFFORT = 4;              // 0–6 (higher = smaller, slower)

(async function processImages() {
  const files = fs.readdirSync(INPUT_DIR);

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    const name = path.basename(file, ext);

    if (![".jpg", ".jpeg", ".png"].includes(ext)) {
      console.log(`Skipping unsupported file: ${file}`);
      continue;
    }

    const inputPath = path.join(INPUT_DIR, file);
    const outputPath = path.join(OUTPUT_DIR, `${name}.webp`);
	if(fs.existsSync(outputPath)){
		console.log("skipping existing files");
		continue;
	}

    try {
      const image = sharp(inputPath);
      const metadata = await image.metadata();

      // Resize only if wider than max width
      const resize =
        metadata.width && metadata.width > MAX_WIDTH
          ? { width: MAX_WIDTH }
          : null;

      await image
        .resize(resize)
        .webp({
          quality: QUALITY,
          effort: EFFORT
        })
        .toFile(outputPath);

      console.log(`✔ Optimized: ${file} → ${name}.webp`);
    } catch (err) {
      console.error(`✖ Failed: ${file}`, err.message);
    }
  }

  console.log("✅ Image optimization complete");
})();
