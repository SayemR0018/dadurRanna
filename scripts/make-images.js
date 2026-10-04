const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ASSETS_DIR = path.join(__dirname, '..', 'public', 'assets');

// 1. Cover SVG (1000 x 420) for Dev.to
const coverSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 420" width="1000" height="420">
  <defs>
    <linearGradient id="coverBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#451A03" />
      <stop offset="45%" stop-color="#78350F" />
      <stop offset="100%" stop-color="#9A3412" />
    </linearGradient>
    <radialGradient id="turmericGlow" cx="25%" cy="50%" r="55%">
      <stop offset="0%" stop-color="#F59E0B" stop-opacity="0.35" />
      <stop offset="100%" stop-color="#78350F" stop-opacity="0" />
    </radialGradient>
    <filter id="cardShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#000000" flood-opacity="0.4" />
    </filter>
  </defs>

  <!-- Background -->
  <rect width="1000" height="420" fill="url(#coverBg)" />
  <rect width="1000" height="420" fill="url(#turmericGlow)" />

  <!-- Traditional Alpana Ornamental Border -->
  <g stroke="#FDE68A" stroke-width="2" fill="none" opacity="0.3">
    <rect x="20" y="20" width="960" height="380" rx="12" />
    <rect x="28" y="28" width="944" height="364" rx="8" stroke-dasharray="8 6" />
    <!-- Corner motifs -->
    <circle cx="28" cy="28" r="8" fill="#FDE68A" />
    <circle cx="972" cy="28" r="8" fill="#FDE68A" />
    <circle cx="28" cy="392" r="8" fill="#FDE68A" />
    <circle cx="972" cy="392" r="8" fill="#FDE68A" />
  </g>

  <!-- Left Side: Clay Pot Illustration & Steam -->
  <g transform="translate(60, 45)">
    <!-- Plate / Leaf -->
    <ellipse cx="140" cy="280" rx="100" ry="24" fill="#14532D" opacity="0.6" />
    
    <!-- Earthen Handi -->
    <g filter="url(#cardShadow)">
      <path d="M65 190 C65 270 95 285 140 285 C185 285 215 270 215 190 C215 160 195 145 185 140 L95 140 C85 145 65 160 65 190 Z" fill="#C2410C" stroke="#EA580C" stroke-width="2" />
      <ellipse cx="140" cy="140" rx="55" ry="14" fill="#9A3412" />
      <ellipse cx="140" cy="136" rx="56" ry="12" fill="#F59E0B" stroke="#78350F" stroke-width="2" />
      <ellipse cx="140" cy="136" rx="46" ry="8" fill="#451A03" />
      <!-- Pot Alpana -->
      <path d="M80 195 Q140 220 200 195" fill="none" stroke="#FEF3C7" stroke-width="3" stroke-linecap="round" />
      <circle cx="110" cy="210" r="4" fill="#FEF3C7" />
      <circle cx="140" cy="216" r="4.5" fill="#FEF3C7" />
      <circle cx="170" cy="210" r="4" fill="#FEF3C7" />
    </g>

    <!-- Wooden Spatula -->
    <rect x="133" y="45" width="14" height="120" rx="7" fill="#FBBF24" transform="rotate(22 140 100)" />

    <!-- Aromatic Steam Lines -->
    <g stroke="#FDE68A" stroke-width="3.5" fill="none" stroke-linecap="round" opacity="0.8">
      <path d="M115 120 C105 95 125 75 110 50 C100 35 115 20 120 10" />
      <path d="M145 115 C160 90 140 70 155 45 C165 30 155 15 160 5" stroke-width="4" stroke="#FBBF24" />
      <path d="M175 120 C185 95 165 75 180 50" />
    </g>
  </g>

  <!-- Right Side: Text & Badges -->
  <g transform="translate(360, 75)">
    <!-- Badge -->
    <rect x="0" y="0" width="230" height="32" rx="16" fill="#F59E0B" fill-opacity="0.2" stroke="#F59E0B" stroke-width="1.5" />
    <text x="16" y="21" font-family="'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="bold" fill="#FDE68A" letter-spacing="1">
      HERITAGE COOKBOOK MAKER
    </text>

    <!-- Main Bengali & English Title -->
    <text x="0" y="95" font-family="'Noto Sans Bengali', 'Segoe UI', serif" font-size="56" font-weight="900" fill="#FEF3C7" filter="url(#cardShadow)">
      দাদুর রান্না <tspan font-size="38" fill="#FBBF24" font-weight="400">· Dadur Ranna</tspan>
    </text>

    <!-- Subtitle -->
    <text x="0" y="145" font-family="'Segoe UI', system-ui, sans-serif" font-size="22" font-weight="500" fill="#FED7AA">
      Preserving Grandma's Handwritten Recipes with Open-Weight Gemma
    </text>

    <!-- Feature Pills -->
    <g transform="translate(0, 190)">
      <!-- Pill 1 -->
      <rect x="0" y="0" width="180" height="38" rx="8" fill="#1E293B" fill-opacity="0.6" stroke="#CA8A04" stroke-width="1" />
      <text x="14" y="24" font-family="sans-serif" font-size="13" font-weight="600" fill="#FEF3C7">
        ✓ Photo &amp; Scribble OCR
      </text>

      <!-- Pill 2 -->
      <rect x="195" y="0" width="185" height="38" rx="8" fill="#1E293B" fill-opacity="0.6" stroke="#CA8A04" stroke-width="1" />
      <text x="210" y="24" font-family="sans-serif" font-size="13" font-weight="600" fill="#FEF3C7">
        ✓ Uncertainty Flags
      </text>

      <!-- Pill 3 -->
      <rect x="395" y="0" width="185" height="38" rx="8" fill="#1E293B" fill-opacity="0.6" stroke="#CA8A04" stroke-width="1" />
      <text x="410" y="24" font-family="sans-serif" font-size="13" font-weight="600" fill="#FEF3C7">
        ✓ Print-to-PDF Book
      </text>
    </g>

    <!-- Footer Note -->
    <text x="0" y="275" font-family="sans-serif" font-size="14" fill="#D97706" font-weight="500">
      ⚡ Powered by Gemma 3 27B / Ollama • 100% Private LocalStorage • Bilingual Bangla &amp; English
    </text>
  </g>
</svg>
`;

// 2. OpenGraph SVG (1200 x 630)
const ogSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <defs>
    <linearGradient id="ogBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#451A03" />
      <stop offset="50%" stop-color="#78350F" />
      <stop offset="100%" stop-color="#9A3412" />
    </linearGradient>
    <radialGradient id="ogGlow" cx="50%" cy="30%" r="60%">
      <stop offset="0%" stop-color="#F59E0B" stop-opacity="0.25" />
      <stop offset="100%" stop-color="#451A03" stop-opacity="0" />
    </radialGradient>
    <filter id="ogShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="10" stdDeviation="15" flood-color="#000000" flood-opacity="0.5" />
    </filter>
  </defs>

  <rect width="1200" height="630" fill="url(#ogBg)" />
  <rect width="1200" height="630" fill="url(#ogGlow)" />

  <!-- Alpana Frame -->
  <rect x="30" y="30" width="1140" height="570" rx="16" fill="none" stroke="#FDE68A" stroke-width="2.5" opacity="0.35" />
  <rect x="42" y="42" width="1116" height="546" rx="12" fill="none" stroke="#FDE68A" stroke-width="1.5" stroke-dasharray="10 8" opacity="0.25" />

  <!-- Center Content -->
  <g transform="translate(100, 90)">
    <!-- Badge -->
    <rect x="0" y="0" width="290" height="40" rx="20" fill="#F59E0B" fill-opacity="0.25" stroke="#F59E0B" stroke-width="2" />
    <text x="24" y="26" font-family="'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="bold" fill="#FDE68A" letter-spacing="1.5">
      FAMILY COOKBOOK ARCHIVE
    </text>

    <!-- Main Title -->
    <text x="0" y="125" font-family="'Noto Sans Bengali', 'Segoe UI', serif" font-size="78" font-weight="900" fill="#FFFDF8" filter="url(#ogShadow)">
      দাদুর রান্না <tspan font-size="52" fill="#FBBF24" font-weight="400">· Dadur Ranna</tspan>
    </text>

    <text x="0" y="195" font-family="'Segoe UI', system-ui, sans-serif" font-size="30" font-weight="600" fill="#FED7AA">
      Turn Handwritten Notebooks &amp; Rambling Notes into a Treasured Heirloom
    </text>

    <text x="0" y="250" font-family="'Segoe UI', system-ui, sans-serif" font-size="20" fill="#E2E8F0" opacity="0.9">
      Powered by Google Gemma open-weight models. Transcribe mixed Bangla/English, verify faded
    </text>
    <text x="0" y="280" font-family="'Segoe UI', system-ui, sans-serif" font-size="20" fill="#E2E8F0" opacity="0.9">
      handwriting with human-in-the-loop uncertainty flags, scale servings, and print beautiful keepsake books.
    </text>

    <!-- 4 Key Highlights -->
    <g transform="translate(0, 330)">
      <rect x="0" y="0" width="220" height="50" rx="10" fill="#1E293B" fill-opacity="0.8" stroke="#CA8A04" stroke-width="1.5" />
      <text x="18" y="32" font-family="sans-serif" font-size="16" font-weight="600" fill="#FEF3C7">📸 Photo &amp; Text OCR</text>

      <rect x="240" y="0" width="240" height="50" rx="10" fill="#1E293B" fill-opacity="0.8" stroke="#CA8A04" stroke-width="1.5" />
      <text x="258" y="32" font-family="sans-serif" font-size="16" font-weight="600" fill="#FEF3C7">⚠️ Uncertainty Badges</text>

      <rect x="500" y="0" width="220" height="50" rx="10" fill="#1E293B" fill-opacity="0.8" stroke="#CA8A04" stroke-width="1.5" />
      <text x="518" y="32" font-family="sans-serif" font-size="16" font-weight="600" fill="#FEF3C7">⚖️ Fraction Scaler</text>

      <rect x="740" y="0" width="250" height="50" rx="10" fill="#1E293B" fill-opacity="0.8" stroke="#CA8A04" stroke-width="1.5" />
      <text x="758" y="32" font-family="sans-serif" font-size="16" font-weight="600" fill="#FEF3C7">📖 Print-to-PDF Keepsake</text>
    </g>

    <text x="0" y="440" font-family="sans-serif" font-size="16" fill="#F59E0B" font-weight="bold">
      🔒 100% Client-side LocalStorage Privacy • Zero Database • Run Offline with Ollama
    </text>
  </g>
</svg>
`;

async function main() {
  console.log('Generating rasterized images with sharp...');

  // Ensure output directory
  if (!fs.existsSync(ASSETS_DIR)) {
    fs.mkdirSync(ASSETS_DIR, { recursive: true });
  }

  // 1. Cover PNG (1000x420)
  await sharp(Buffer.from(coverSvg))
    .resize(1000, 420)
    .png({ quality: 90 })
    .toFile(path.join(ASSETS_DIR, 'cover.png'));
  console.log('✓ Created cover.png (1000x420)');

  // 2. OpenGraph PNG (1200x630)
  await sharp(Buffer.from(ogSvg))
    .resize(1200, 630)
    .png({ quality: 90 })
    .toFile(path.join(ASSETS_DIR, 'og-image.png'));
  console.log('✓ Created og-image.png (1200x630)');

  // 3. Favicon PNG (32x32)
  const faviconSvg = fs.readFileSync(path.join(ASSETS_DIR, 'favicon.svg'));
  await sharp(faviconSvg)
    .resize(32, 32)
    .png()
    .toFile(path.join(ASSETS_DIR, 'favicon.png'));
  console.log('✓ Created favicon.png (32x32)');

  // 4. Apple Touch Icon PNG (180x180)
  await sharp(faviconSvg)
    .resize(180, 180)
    .png()
    .toFile(path.join(ASSETS_DIR, 'apple-touch-icon.png'));
  console.log('✓ Created apple-touch-icon.png (180x180)');

  console.log('All image assets successfully built and verified!');
}

main().catch(err => {
  console.error('Image generation error:', err);
  process.exit(1);
});
