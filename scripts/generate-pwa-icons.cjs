const fs = require('fs');
const sharp = require('sharp');
const { execSync } = require('child_process');

const standardSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" fill="none">
  <!-- Main Rounded Square Base in Faktelio Vert Principal -->
  <rect x="8" y="8" width="104" height="104" rx="26" fill="#176B4D" />
  <rect x="12" y="12" width="96" height="96" rx="22" stroke="#E8F3ED" stroke-width="2" stroke-opacity="0.45" />
  
  <!-- Stylized Invoice Document / F Monogram -->
  <path d="M36 32C36 28.6863 38.6863 26 42 26H78C81.3137 26 84 28.6863 84 32V38C84 40.2091 82.2091 42 80 42H50V54H72C74.2091 54 76 55.7909 76 58V64C76 66.2091 74.2091 68 72 68H50V88C50 91.3137 47.3137 94 44 94H42C38.6863 94 36 91.3137 36 88V32Z" fill="#FFFFFF" />
  
  <!-- Vert d'accent Checkmark Badge -->
  <circle cx="80" cy="80" r="20" fill="#2E8B57" stroke="#E8F3ED" stroke-width="2.5" />
  <path d="M72 80.5L77.5 86L89 74.5" stroke="#FFFFFF" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round" />
</svg>`;

const maskableSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="none">
  <!-- Solid brand background filling 100% of maskable canvas -->
  <rect width="512" height="512" fill="#176B4D" />
  
  <!-- Subtle inner card in Vert Foncé inside safe-zone -->
  <rect x="64" y="64" width="384" height="384" rx="96" fill="#104B38" stroke="#E8F3ED" stroke-width="6" stroke-opacity="0.35" />
  
  <!-- Centered Faktelio Mark -->
  <g transform="translate(80, 80) scale(2.9333)">
    <path d="M36 32C36 28.6863 38.6863 26 42 26H78C81.3137 26 84 28.6863 84 32V38C84 40.2091 82.2091 42 80 42H50V54H72C74.2091 54 76 55.7909 76 58V64C76 66.2091 74.2091 68 72 68H50V88C50 91.3137 47.3137 94 44 94H42C38.6863 94 36 91.3137 36 88V32Z" fill="#FFFFFF" />
    <circle cx="80" cy="80" r="20" fill="#2E8B57" stroke="#E8F3ED" stroke-width="2.5" />
    <path d="M72 80.5L77.5 86L89 74.5" stroke="#FFFFFF" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round" />
  </g>
</svg>`;

const appleSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180" fill="none">
  <!-- Solid background for iOS in Vert Principal -->
  <rect width="180" height="180" fill="#176B4D" />
  <rect x="10" y="10" width="160" height="160" rx="36" fill="#104B38" stroke="#E8F3ED" stroke-width="2.5" stroke-opacity="0.4" />
  
  <g transform="translate(16, 16) scale(1.2333)">
    <path d="M36 32C36 28.6863 38.6863 26 42 26H78C81.3137 26 84 28.6863 84 32V38C84 40.2091 82.2091 42 80 42H50V54H72C74.2091 54 76 55.7909 76 58V64C76 66.2091 74.2091 68 72 68H50V88C50 91.3137 47.3137 94 44 94H42C38.6863 94 36 91.3137 36 88V32Z" fill="#FFFFFF" />
    <circle cx="80" cy="80" r="20" fill="#2E8B57" stroke="#E8F3ED" stroke-width="2.5" />
    <path d="M72 80.5L77.5 86L89 74.5" stroke="#FFFFFF" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round" />
  </g>
</svg>`;

async function generate() {
  fs.writeFileSync('public/icon.svg', standardSvg);
  fs.writeFileSync('public/favicon.svg', standardSvg);

  await sharp(Buffer.from(standardSvg)).resize(192, 192).png().toFile('public/pwa-192x192.png');
  await sharp(Buffer.from(standardSvg)).resize(512, 512).png().toFile('public/pwa-512x512.png');
  await sharp(Buffer.from(maskableSvg)).resize(512, 512).png().toFile('public/pwa-maskable-512x512.png');
  await sharp(Buffer.from(appleSvg)).resize(180, 180).png().toFile('public/apple-touch-icon.png');
  await sharp(Buffer.from(appleSvg)).resize(180, 180).png().toFile('public/apple-touch-icon-180x180.png');

  // Multi-resolution ICO: 16, 32, 48, 64
  await sharp(Buffer.from(standardSvg)).resize(64, 64).png().toFile('public/favicon-64.png');
  await sharp(Buffer.from(standardSvg)).resize(48, 48).png().toFile('public/favicon-48.png');
  await sharp(Buffer.from(standardSvg)).resize(32, 32).png().toFile('public/favicon-32.png');
  await sharp(Buffer.from(standardSvg)).resize(16, 16).png().toFile('public/favicon-16.png');

  execSync('convert public/favicon-16.png public/favicon-32.png public/favicon-48.png public/favicon-64.png public/favicon.ico');
  
  fs.unlinkSync('public/favicon-64.png');
  fs.unlinkSync('public/favicon-48.png');
  fs.unlinkSync('public/favicon-32.png');
  fs.unlinkSync('public/favicon-16.png');

  console.log('All Faktelio PWA green icons generated successfully.');
}

generate().catch(console.error);
