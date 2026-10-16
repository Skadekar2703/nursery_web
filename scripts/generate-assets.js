// scripts/generate-assets.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const baseDir = path.resolve(__dirname, '../src/assets');
const catDir = path.join(baseDir, 'categories');
const prodDir = path.join(baseDir, 'products');
const illustDir = path.join(baseDir, 'illustrations');

[catDir, prodDir, illustDir].forEach(d => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

function writeSvg(filePath, svgContent) {
  fs.writeFileSync(filePath, svgContent.trim());
}

// -------------------------------------------------------------
// 1. CATEGORIES (6)
// -------------------------------------------------------------
writeSvg(path.join(catDir, 'indoor-plants.svg'), `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450" fill="none">
  <defs>
    <linearGradient id="bgIndoor" x1="0" y1="0" x2="600" y2="450" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#E5EFE3" />
      <stop offset="100%" stop-color="#D2E3CF" />
    </linearGradient>
    <linearGradient id="leafGrad1" x1="200" y1="350" x2="160" y2="100" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#185C3A" />
      <stop offset="100%" stop-color="#3E9B57" />
    </linearGradient>
    <linearGradient id="leafGrad2" x1="320" y1="360" x2="420" y2="120" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#103D29" />
      <stop offset="100%" stop-color="#25834A" />
    </linearGradient>
    <linearGradient id="potGrad" x1="200" y1="280" x2="400" y2="420" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="100%" stop-color="#EBECE6" />
    </linearGradient>
    <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="16" stdDeviation="18" flood-color="#103D29" flood-opacity="0.12" />
    </filter>
  </defs>
  <rect width="600" height="450" rx="24" fill="url(#bgIndoor)" />
  <circle cx="300" cy="225" r="160" fill="#FAF8F0" opacity="0.65" />
  
  <rect x="230" y="340" width="14" height="70" rx="4" fill="#8D5B36" />
  <rect x="356" y="340" width="14" height="70" rx="4" fill="#8D5B36" />
  <rect x="210" y="360" width="180" height="12" rx="4" fill="#6E4426" />
  
  <g filter="url(#softShadow)">
    <path d="M220 280 L240 370 Q300 380 360 370 L380 280 Z" fill="url(#potGrad)" />
    <ellipse cx="300" cy="280" rx="80" ry="16" fill="#FFFFFF" />
    <ellipse cx="300" cy="280" rx="72" ry="12" fill="#3D291A" />
  </g>
  
  <path d="M300 280 C270 230 180 200 150 130 C190 120 250 170 300 280" fill="url(#leafGrad1)" />
  <path d="M210 160 C230 190 270 240 300 280" stroke="#E5EFE3" stroke-width="2" />
  <path d="M185 140 C170 148 160 165 175 168 C190 170 215 155 185 140" fill="url(#bgIndoor)" />
  
  <path d="M300 280 C340 220 420 180 440 100 C390 110 330 180 300 280" fill="url(#leafGrad2)" />
  <path d="M380 140 C350 190 320 230 300 280" stroke="#E5EFE3" stroke-width="2" />
  <path d="M410 120 C425 128 435 145 420 148 C405 150 380 135 410 120" fill="url(#bgIndoor)" />
  
  <path d="M300 280 C290 180 280 120 300 60 C320 120 310 180 300 280" fill="#25834A" />
  <path d="M300 280 L300 70" stroke="#E5EFE3" stroke-width="2.5" />
</svg>
`);

writeSvg(path.join(catDir, 'outdoor-plants.svg'), `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450" fill="none">
  <defs>
    <linearGradient id="bgOutdoor" x1="0" y1="0" x2="600" y2="450" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#F3EAD8" />
      <stop offset="100%" stop-color="#E5D9C3" />
    </linearGradient>
    <linearGradient id="palmGrad" x1="300" y1="340" x2="300" y2="80" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#185C3A" />
      <stop offset="100%" stop-color="#3E9B57" />
    </linearGradient>
    <filter id="shadowOut" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="14" stdDeviation="16" flood-color="#302010" flood-opacity="0.15" />
    </filter>
  </defs>
  <rect width="600" height="450" rx="24" fill="url(#bgOutdoor)" />
  <circle cx="300" cy="225" r="150" fill="#FAF8F0" opacity="0.6" />
  
  <g filter="url(#shadowOut)">
    <path d="M210 290 L235 390 Q300 405 365 390 L390 290 Z" fill="#C86A45" />
    <ellipse cx="300" cy="290" rx="90" ry="18" fill="#DA7851" />
    <ellipse cx="300" cy="290" rx="80" ry="12" fill="#4A2616" />
    <path d="M205 285 Q300 300 395 285 L395 295 Q300 310 205 295 Z" fill="#B45935" />
  </g>
  
  <path d="M300 290 Q290 200 220 100 Q260 140 300 290" fill="url(#palmGrad)" />
  <path d="M300 290 Q310 180 380 90 Q340 140 300 290" fill="#25834A" />
  <path d="M300 290 Q300 150 300 70 Q315 130 300 290" fill="#185C3A" />
  <path d="M300 290 Q240 230 140 160 Q210 190 300 290" fill="#3E9B57" />
  <path d="M300 290 Q360 230 460 170 Q390 200 300 290" fill="#103D29" />
</svg>
`);

writeSvg(path.join(catDir, 'flowering-plants.svg'), `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450" fill="none">
  <defs>
    <linearGradient id="bgFlower" x1="0" y1="0" x2="600" y2="450" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FCECEE" />
      <stop offset="100%" stop-color="#F6D5DC" />
    </linearGradient>
    <linearGradient id="petalGrad1" x1="280" y1="120" x2="320" y2="180" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#E24B6A" />
      <stop offset="100%" stop-color="#C22548" />
    </linearGradient>
    <filter id="shadowFl" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="14" stdDeviation="16" flood-color="#401520" flood-opacity="0.12" />
    </filter>
  </defs>
  <rect width="600" height="450" rx="24" fill="url(#bgFlower)" />
  <circle cx="300" cy="225" r="150" fill="#FAF8F0" opacity="0.7" />
  
  <g filter="url(#shadowFl)">
    <path d="M225 290 L245 385 Q300 398 355 385 L375 290 Z" fill="#FFFFFF" />
    <ellipse cx="300" cy="290" rx="75" ry="16" fill="#F3F4F0" />
    <ellipse cx="300" cy="290" rx="66" ry="11" fill="#3D291A" />
    <path d="M230 320 Q300 332 370 320" stroke="#D19C4C" stroke-width="3" stroke-linecap="round" />
  </g>
  
  <path d="M300 290 Q270 210 240 180" stroke="#185C3A" stroke-width="4.5" stroke-linecap="round" />
  <path d="M300 290 Q300 200 300 150" stroke="#185C3A" stroke-width="5" stroke-linecap="round" />
  <path d="M300 290 Q330 220 370 170" stroke="#185C3A" stroke-width="4.5" stroke-linecap="round" />
  
  <path d="M255 230 C220 220 200 240 210 260 C230 260 250 250 255 230" fill="#25834A" />
  <path d="M335 240 C370 230 380 255 365 270 C345 270 335 255 335 240" fill="#185C3A" />
  
  <g transform="translate(300, 140)">
    <circle cx="0" cy="-22" r="22" fill="url(#petalGrad1)" />
    <circle cx="21" cy="-7" r="22" fill="url(#petalGrad1)" />
    <circle cx="13" cy="18" r="22" fill="url(#petalGrad1)" />
    <circle cx="-13" cy="18" r="22" fill="url(#petalGrad1)" />
    <circle cx="-21" cy="-7" r="22" fill="url(#petalGrad1)" />
    <circle cx="0" cy="0" r="14" fill="#F8B838" />
  </g>
</svg>
`);

writeSvg(path.join(catDir, 'succulents.svg'), `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450" fill="none">
  <defs>
    <linearGradient id="bgSucc" x1="0" y1="0" x2="600" y2="450" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#EBF4EE" />
      <stop offset="100%" stop-color="#D7EADF" />
    </linearGradient>
    <linearGradient id="succLeaf" x1="0" y1="0" x2="0" y2="60" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#E2728C" />
      <stop offset="35%" stop-color="#5EBA84" />
      <stop offset="100%" stop-color="#2D7B50" />
    </linearGradient>
    <filter id="shadowSc" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="12" stdDeviation="15" flood-color="#185C3A" flood-opacity="0.12" />
    </filter>
  </defs>
  <rect width="600" height="450" rx="24" fill="url(#bgSucc)" />
  <circle cx="300" cy="225" r="150" fill="#FAF8F0" opacity="0.75" />
  
  <g filter="url(#shadowSc)">
    <path d="M190 280 C200 370 400 370 410 280 Z" fill="#FAF8F0" />
    <ellipse cx="300" cy="280" rx="110" ry="25" fill="#FFFFFF" />
    <ellipse cx="300" cy="280" rx="100" ry="20" fill="#4B3A2F" />
  </g>
  
  <g transform="translate(300, 245)">
    <path d="M0 -70 C-20 -40 -15 -10 0 0 C15 -10 20 -40 0 -70" fill="url(#succLeaf)" />
    <path d="M50 -50 C30 -20 15 0 0 0 C15 0 45 -20 50 -50" fill="url(#succLeaf)" />
    <path d="M70 0 C40 0 20 0 0 0 C20 0 55 15 70 0" fill="url(#succLeaf)" />
    <path d="M50 45 C35 25 15 10 0 0 C15 10 40 40 50 45" fill="url(#succLeaf)" />
    <path d="M0 65 C-15 40 -10 15 0 0 C10 15 15 40 0 65" fill="url(#succLeaf)" />
    <path d="M-50 45 C-35 25 -15 10 0 0 C-15 10 -40 40 -50 45" fill="url(#succLeaf)" />
    <path d="M-70 0 C-40 0 -20 0 0 0 C-20 0 -55 15 -70 0" fill="url(#succLeaf)" />
    <path d="M-50 -50 C-30 -20 -15 0 0 0 C-15 0 -45 -20 -50 -50" fill="url(#succLeaf)" />
    
    <circle cx="0" cy="0" r="14" fill="#E2728C" />
  </g>
</svg>
`);

writeSvg(path.join(catDir, 'pots-planters.svg'), `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450" fill="none">
  <defs>
    <linearGradient id="bgPot" x1="0" y1="0" x2="600" y2="450" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FDF6EB" />
      <stop offset="100%" stop-color="#F2E6D0" />
    </linearGradient>
    <filter id="shadowPt" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="16" stdDeviation="18" flood-color="#3A281A" flood-opacity="0.14" />
    </filter>
  </defs>
  <rect width="600" height="450" rx="24" fill="url(#bgPot)" />
  <circle cx="300" cy="225" r="155" fill="#FFFFFF" opacity="0.7" />
  
  <g filter="url(#shadowPt)">
    <path d="M220 200 L245 360 Q300 375 355 360 L380 200 Z" fill="#FAF8F0" />
    <ellipse cx="300" cy="200" rx="80" ry="18" fill="#FFFFFF" />
    <ellipse cx="300" cy="200" rx="70" ry="13" fill="#E2DDD5" />
    <line x1="260" y1="215" x2="270" y2="355" stroke="#E4DCD0" stroke-width="4" stroke-linecap="round" />
    <line x1="280" y1="217" x2="288" y2="363" stroke="#E4DCD0" stroke-width="4" stroke-linecap="round" />
    <line x1="300" y1="218" x2="300" y2="366" stroke="#E4DCD0" stroke-width="4" stroke-linecap="round" />
    <line x1="320" y1="217" x2="312" y2="363" stroke="#E4DCD0" stroke-width="4" stroke-linecap="round" />
    <line x1="340" y1="215" x2="330" y2="355" stroke="#E4DCD0" stroke-width="4" stroke-linecap="round" />
  </g>
</svg>
`);

writeSvg(path.join(catDir, 'gardening-essentials.svg'), `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450" fill="none">
  <defs>
    <linearGradient id="bgTool" x1="0" y1="0" x2="600" y2="450" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#E7EFEA" />
      <stop offset="100%" stop-color="#D5E4DB" />
    </linearGradient>
    <filter id="shadowTl" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="14" stdDeviation="16" flood-color="#185C3A" flood-opacity="0.14" />
    </filter>
  </defs>
  <rect width="600" height="450" rx="24" fill="url(#bgTool)" />
  <circle cx="300" cy="225" r="150" fill="#FAF8F0" opacity="0.7" />
  
  <g filter="url(#shadowTl)">
    <path d="M210 240 L230 360 Q290 375 350 360 L370 240 Z" fill="#185C3A" />
    <ellipse cx="290" cy="240" rx="80" ry="20" fill="#25834A" />
    <ellipse cx="290" cy="240" rx="70" ry="14" fill="#103D29" />
    <path d="M350 300 L440 190 L455 200 L360 325 Z" fill="#185C3A" />
    <ellipse cx="452" cy="192" rx="12" ry="20" transform="rotate(-35 452 192)" fill="#D4AF37" />
    <path d="M225 245 C150 200 150 340 235 345" stroke="#C28751" stroke-width="14" stroke-linecap="round" fill="none" />
  </g>
</svg>
`);

// -------------------------------------------------------------
// 2. PRODUCTS (24)
// Helper to generate bespoke botanical SVGs
// -------------------------------------------------------------
function makeProductSvg(title, category, primaryColor, accentColor, potStyle, foliageRenderer) {
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" fill="none">
  <defs>
    <linearGradient id="bgGrad" x1="0" y1="0" x2="500" y2="500" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FAF8F0" />
      <stop offset="100%" stop-color="#EFF4EC" />
    </linearGradient>
    <filter id="pShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="16" stdDeviation="16" flood-color="#103D29" flood-opacity="0.1" />
    </filter>
  </defs>
  <rect width="500" height="500" rx="28" fill="url(#bgGrad)" />
  <circle cx="250" cy="230" r="160" fill="#E5EFE3" opacity="0.45" />
  
  <!-- Foliage Layer -->
  <g id="foliage">
    ${foliageRenderer(primaryColor, accentColor)}
  </g>
  
  <!-- Pot / Container Layer -->
  <g id="pot" filter="url(#pShadow)">
    ${potStyle}
  </g>
</svg>
`;
}

// Pot styles
const POT_WHITE_CERAMIC = `
  <path d="M180 320 L195 425 Q250 435 305 425 L320 320 Z" fill="#FFFFFF" />
  <ellipse cx="250" cy="320" rx="70" ry="14" fill="#FAF8F0" />
  <ellipse cx="250" cy="320" rx="63" ry="10" fill="#3D291A" />
  <path d="M190 355 Q250 365 310 355" stroke="#E5EFE3" stroke-width="2.5" />
`;

const POT_TERRACOTTA = `
  <path d="M175 320 L192 430 Q250 440 308 430 L325 320 Z" fill="#C86A45" />
  <ellipse cx="250" cy="320" rx="75" ry="15" fill="#DA7851" />
  <ellipse cx="250" cy="320" rx="66" ry="10" fill="#4A2616" />
  <rect x="170" y="315" width="160" height="12" rx="3" fill="#B45935" />
`;

const POT_STAND = `
  <rect x="190" y="380" width="10" height="60" rx="3" fill="#8D5B36" />
  <rect x="300" y="380" width="10" height="60" rx="3" fill="#8D5B36" />
  <rect x="180" y="400" width="140" height="10" rx="2" fill="#6E4426" />
  <path d="M185 310 L200 405 Q250 415 300 405 L315 310 Z" fill="#FAF8F0" />
  <ellipse cx="250" cy="310" rx="65" ry="13" fill="#FFFFFF" />
  <ellipse cx="250" cy="310" rx="58" ry="9" fill="#3D291A" />
`;

const POT_LOW_BOWL = `
  <path d="M160 320 C170 410 330 410 340 320 Z" fill="#FFFFFF" />
  <ellipse cx="250" cy="320" rx="90" ry="20" fill="#FAF8F0" />
  <ellipse cx="250" cy="320" rx="80" ry="15" fill="#4B3A2F" />
  <ellipse cx="195" cy="322" rx="10" ry="5" fill="#E8ECE9" />
  <ellipse cx="305" cy="323" rx="12" ry="6" fill="#E8ECE9" />
`;

const POT_FOREST_GREEN = `
  <path d="M180 320 L195 425 Q250 435 305 425 L320 320 Z" fill="#185C3A" />
  <ellipse cx="250" cy="320" rx="70" ry="14" fill="#25834A" />
  <ellipse cx="250" cy="320" rx="62" ry="10" fill="#103D29" />
  <circle cx="250" cy="370" r="18" fill="#103D29" opacity="0.4" />
`;

const products = [
  // 1. Monstera Deliciosa
  {
    slug: 'monstera-deliciosa',
    title: 'Monstera Deliciosa',
    cat: 'Indoor Plants',
    pCol: '#185C3A',
    aCol: '#3E9B57',
    pot: POT_STAND,
    foliage: (p, a) => `
      <path d="M250 310 C210 240 140 220 120 140 C170 130 220 180 250 310" fill="${p}" />
      <path d="M150 150 C140 160 135 175 145 180 C155 180 170 170 150 150" fill="#FAF8F0" />
      <path d="M175 180 C165 190 160 205 170 210 C180 210 195 200 175 180" fill="#FAF8F0" />
      <path d="M250 310 C290 230 360 200 380 120 C330 130 280 190 250 310" fill="${a}" />
      <path d="M350 140 C360 150 365 165 355 170 C345 170 330 160 350 140" fill="#FAF8F0" />
      <path d="M325 170 C335 180 340 195 330 200 C320 200 305 190 325 170" fill="#FAF8F0" />
      <path d="M250 310 C240 200 230 140 250 70 C270 140 260 200 250 310" fill="#25834A" />
      <path d="M250 310 L250 85" stroke="#FAF8F0" stroke-width="2.5" />
    `
  },
  // 2. Snake Plant
  {
    slug: 'snake-plant',
    title: 'Snake Plant',
    cat: 'Indoor Plants',
    pCol: '#185C3A',
    aCol: '#E2B842',
    pot: POT_WHITE_CERAMIC,
    foliage: (p, a) => `
      <!-- Center tall blade -->
      <path d="M250 320 C240 220 235 140 250 60 C265 140 260 220 250 320" fill="${p}" stroke="${a}" stroke-width="5" />
      <path d="M250 320 L250 70" stroke="#3E9B57" stroke-width="3" />
      <!-- Left blade -->
      <path d="M250 320 C220 240 195 170 210 100 C235 160 245 230 250 320" fill="#103D29" stroke="${a}" stroke-width="4.5" />
      <!-- Right blade -->
      <path d="M250 320 C280 240 305 180 290 110 C265 170 255 240 250 320" fill="#25834A" stroke="${a}" stroke-width="4.5" />
      <!-- Short blades -->
      <path d="M250 320 C210 270 180 220 190 170 C210 220 230 270 250 320" fill="${p}" stroke="${a}" stroke-width="3" />
      <path d="M250 320 C290 270 320 230 310 175 C290 220 270 270 250 320" fill="#3E9B57" stroke="${a}" stroke-width="3" />
    `
  },
  // 3. Peace Lily
  {
    slug: 'peace-lily',
    title: 'Peace Lily',
    cat: 'Indoor Plants',
    pCol: '#103D29',
    aCol: '#FFFFFF',
    pot: POT_WHITE_CERAMIC,
    foliage: (p, a) => `
      <!-- Lush green leaves -->
      <path d="M250 320 C200 280 150 250 140 180 C180 180 220 240 250 320" fill="${p}" />
      <path d="M250 320 C300 280 350 250 360 180 C320 180 280 240 250 320" fill="#185C3A" />
      <path d="M250 320 C220 230 210 170 240 130 C250 170 250 230 250 320" fill="#25834A" />
      <path d="M250 320 C270 250 310 220 320 150 C290 170 270 230 250 320" fill="#3E9B57" />
      <!-- Peace Lily Flower Stem -->
      <path d="M250 320 Q240 190 245 90" stroke="#25834A" stroke-width="4" stroke-linecap="round" />
      <!-- Pure White Spathe -->
      <path d="M245 90 C220 70 220 30 245 20 C270 30 270 70 245 90" fill="#FFFFFF" stroke="#E5EFE3" stroke-width="2" />
      <!-- Spadix -->
      <rect x="242" y="38" width="6" height="30" rx="3" fill="#F8E7A1" />
    `
  },
  // 4. Money Plant
  {
    slug: 'money-plant',
    title: 'Money Plant',
    cat: 'Indoor Plants',
    pCol: '#25834A',
    aCol: '#A7DF68',
    pot: POT_TERRACOTTA,
    foliage: (p, a) => `
      <!-- Moss pole -->
      <rect x="244" y="100" width="12" height="220" rx="4" fill="#6A533E" />
      <!-- Trailing vines and heart leaves -->
      <path d="M250 320 Q200 240 230 160 Q270 100 250 80" stroke="#185C3A" stroke-width="4" fill="none" />
      <!-- Leaves -->
      <path d="M230 160 C210 140 190 150 195 175 C205 190 230 190 230 160" fill="${p}" stroke="${a}" stroke-width="2.5" />
      <path d="M260 140 C280 120 300 130 295 155 C285 170 260 170 260 140" fill="${a}" stroke="#185C3A" stroke-width="2.5" />
      <path d="M240 210 C210 200 200 220 215 240 C230 250 245 235 240 210" fill="${p}" />
      <path d="M265 240 C295 230 305 250 290 270 C275 280 260 265 265 240" fill="#3E9B57" />
      <!-- Trailing left -->
      <path d="M190 320 C150 340 130 390 125 430" stroke="#185C3A" stroke-width="3" fill="none" />
      <path d="M130 390 C110 380 110 405 125 415 C135 420 145 405 130 390" fill="${p}" stroke="${a}" stroke-width="2" />
    `
  },
  // 5. ZZ Plant
  {
    slug: 'zz-plant',
    title: 'ZZ Plant',
    cat: 'Indoor Plants',
    pCol: '#103D29',
    aCol: '#185C3A',
    pot: POT_WHITE_CERAMIC,
    foliage: (p, a) => `
      <!-- 3 Stems with zigzag shiny oval leaflets -->
      <path d="M250 320 Q250 200 250 70" stroke="#25834A" stroke-width="5" stroke-linecap="round" />
      <path d="M250 320 Q215 220 190 110" stroke="#25834A" stroke-width="4" stroke-linecap="round" />
      <path d="M250 320 Q285 220 310 110" stroke="#25834A" stroke-width="4" stroke-linecap="round" />
      <!-- Leaflets Center -->
      ${[90, 130, 170, 210, 250].map((y, i) => `
        <ellipse cx="230" cy="${y}" rx="18" ry="10" transform="rotate(-20 230 ${y})" fill="${p}" />
        <ellipse cx="270" cy="${y - 10}" rx="18" ry="10" transform="rotate(20 270 ${y - 10})" fill="${a}" />
      `).join('')}
    `
  },
  // 6. Areca Palm
  {
    slug: 'areca-palm',
    title: 'Areca Palm',
    cat: 'Outdoor Plants',
    pCol: '#185C3A',
    aCol: '#3E9B57',
    pot: POT_TERRACOTTA,
    foliage: (p, a) => `
      <path d="M250 320 Q230 180 150 90" stroke="#25834A" stroke-width="4" fill="none" />
      <path d="M250 320 Q270 180 350 90" stroke="#25834A" stroke-width="4" fill="none" />
      <path d="M250 320 Q250 160 250 50" stroke="#185C3A" stroke-width="4.5" fill="none" />
      <!-- Frond needles -->
      <path d="M150 90 L130 80 M170 110 L145 95 M190 130 L165 115 M210 160 L180 145" stroke="${p}" stroke-width="3.5" stroke-linecap="round" />
      <path d="M350 90 L370 80 M330 110 L355 95 M310 130 L335 115 M290 160 L320 145" stroke="${a}" stroke-width="3.5" stroke-linecap="round" />
      <path d="M250 50 L235 40 M250 70 L230 55 M250 90 L230 75 M250 50 L265 40 M250 70 L270 55 M250 90 L270 75" stroke="#25834A" stroke-width="3.5" stroke-linecap="round" />
    `
  },
  // 7. Spider Plant
  {
    slug: 'spider-plant',
    title: 'Spider Plant',
    cat: 'Indoor Plants',
    pCol: '#25834A',
    aCol: '#FFFFFF',
    pot: POT_LOW_BOWL,
    foliage: (p, a) => `
      <!-- Cascading variegated arching blades -->
      <path d="M250 320 Q180 260 120 320" stroke="${p}" stroke-width="6" fill="none" />
      <path d="M250 320 Q180 260 120 320" stroke="${a}" stroke-width="2" fill="none" />
      <path d="M250 320 Q320 260 380 320" stroke="${p}" stroke-width="6" fill="none" />
      <path d="M250 320 Q320 260 380 320" stroke="${a}" stroke-width="2" fill="none" />
      <path d="M250 320 Q200 200 170 140" stroke="${p}" stroke-width="6" fill="none" />
      <path d="M250 320 Q200 200 170 140" stroke="${a}" stroke-width="2" fill="none" />
      <path d="M250 320 Q300 200 330 140" stroke="${p}" stroke-width="6" fill="none" />
      <path d="M250 320 Q300 200 330 140" stroke="${a}" stroke-width="2" fill="none" />
      <path d="M250 320 Q250 180 250 100" stroke="${p}" stroke-width="6" fill="none" />
      <path d="M250 320 Q250 180 250 100" stroke="${a}" stroke-width="2" fill="none" />
      <!-- Baby spiderette offshoot -->
      <path d="M250 320 Q120 300 90 380" stroke="#3E9B57" stroke-width="2" fill="none" />
      <circle cx="90" cy="380" r="12" fill="${p}" />
      <circle cx="90" cy="380" r="5" fill="#FAF8F0" />
    `
  },
  // 8. Rubber Plant
  {
    slug: 'rubber-plant',
    title: 'Rubber Plant',
    cat: 'Indoor Plants',
    pCol: '#162E20',
    aCol: '#A72D3D',
    pot: POT_STAND,
    foliage: (p, a) => `
      <path d="M250 310 L250 90" stroke="#103D29" stroke-width="7" stroke-linecap="round" />
      <!-- Thick glossy leaves -->
      <ellipse cx="200" cy="240" rx="45" ry="24" transform="rotate(-25 200 240)" fill="${p}" />
      <ellipse cx="300" cy="220" rx="45" ry="24" transform="rotate(25 300 220)" fill="${p}" />
      <ellipse cx="210" cy="170" rx="42" ry="22" transform="rotate(-20 210 170)" fill="${p}" />
      <ellipse cx="290" cy="150" rx="42" ry="22" transform="rotate(20 290 150)" fill="${p}" />
      <ellipse cx="250" cy="110" rx="36" ry="18" transform="rotate(-10 250 110)" fill="${p}" />
      <!-- Red sheath top sprout -->
      <path d="M250 95 Q250 60 252 50 Q254 60 250 95" fill="${a}" stroke="#7B1A27" stroke-width="1.5" />
    `
  },
  // 9. Aloe Vera
  {
    slug: 'aloe-vera',
    title: 'Aloe Vera',
    cat: 'Succulents',
    pCol: '#25834A',
    aCol: '#E5EFE3',
    pot: POT_TERRACOTTA,
    foliage: (p, a) => `
      <!-- Succulent pointed fleshy leaves with serrated dots -->
      <path d="M250 320 C240 220 230 140 250 70 C270 140 260 220 250 320" fill="${p}" />
      <path d="M250 320 C210 250 160 210 140 170 C190 190 220 250 250 320" fill="#185C3A" />
      <path d="M250 320 C290 250 340 210 360 170 C310 190 280 250 250 320" fill="#3E9B57" />
      <path d="M250 320 C220 270 180 260 170 230 C205 245 230 280 250 320" fill="#25834A" />
      <path d="M250 320 C280 270 320 260 330 230 C295 245 270 280 250 320" fill="#185C3A" />
      <!-- White fleshy teeth -->
      <circle cx="245" cy="120" r="2.5" fill="${a}" />
      <circle cx="247" cy="150" r="2.5" fill="${a}" />
      <circle cx="246" cy="180" r="2.5" fill="${a}" />
      <circle cx="170" cy="190" r="2" fill="${a}" />
      <circle cx="330" cy="190" r="2" fill="${a}" />
    `
  },
  // 10. Jade Plant
  {
    slug: 'jade-plant',
    title: 'Jade Plant',
    cat: 'Succulents',
    pCol: '#25834A',
    aCol: '#D3455B',
    pot: POT_LOW_BOWL,
    foliage: (p, a) => `
      <!-- Bonsai-like thick succulent trunk -->
      <path d="M250 320 Q240 240 220 200 M245 230 Q270 180 290 150 M220 200 L200 160 M220 200 L240 150" stroke="#78553E" stroke-width="8" stroke-linecap="round" />
      <!-- Plump oval jade leaves with red rims -->
      ${[
        [200, 160], [240, 150], [290, 150], [180, 145], [225, 125], [270, 130], [310, 140]
      ].map(([x, y]) => `
        <ellipse cx="${x}" cy="${y}" rx="16" ry="11" fill="${p}" stroke="${a}" stroke-width="1.8" />
      `).join('')}
    `
  },
  // 11. Echeveria
  {
    slug: 'echeveria',
    title: 'Echeveria',
    cat: 'Succulents',
    pCol: '#4BAA78',
    aCol: '#E86687',
    pot: POT_WHITE_CERAMIC,
    foliage: (p, a) => `
      <g transform="translate(250, 260)">
        <path d="M0 -60 C-15 -35 -10 -10 0 0 C10 -10 15 -35 0 -60" fill="${p}" stroke="${a}" stroke-width="2" />
        <path d="M45 -45 C25 -20 10 0 0 0 C10 0 35 -20 45 -45" fill="${p}" stroke="${a}" stroke-width="2" />
        <path d="M60 0 C35 0 15 0 0 0 C15 0 45 15 60 0" fill="${p}" stroke="${a}" stroke-width="2" />
        <path d="M45 40 C30 20 10 10 0 0 C10 10 35 35 45 40" fill="${p}" stroke="${a}" stroke-width="2" />
        <path d="M0 55 C-10 35 -5 10 0 0 C5 10 10 35 0 55" fill="${p}" stroke="${a}" stroke-width="2" />
        <path d="M-45 40 C-30 20 -10 10 0 0 C-10 10 -35 35 -45 40" fill="${p}" stroke="${a}" stroke-width="2" />
        <path d="M-60 0 C-35 0 -15 0 0 0 C-15 0 -45 15 -60 0" fill="${p}" stroke="${a}" stroke-width="2" />
        <path d="M-45 -45 C-25 -20 -10 0 0 0 C-10 0 -35 -20 -45 -45" fill="${p}" stroke="${a}" stroke-width="2" />
        <circle cx="0" cy="0" r="12" fill="${a}" />
      </g>
    `
  },
  // 12. Hibiscus
  {
    slug: 'hibiscus',
    title: 'Hibiscus',
    cat: 'Flowering Plants',
    pCol: '#E2264D',
    aCol: '#F4BA36',
    pot: POT_TERRACOTTA,
    foliage: (p, a) => `
      <path d="M250 320 Q240 210 250 170" stroke="#185C3A" stroke-width="6" stroke-linecap="round" />
      <path d="M220 250 C180 240 190 270 230 270 Z" fill="#25834A" />
      <path d="M280 230 C320 220 310 250 270 255 Z" fill="#185C3A" />
      <!-- Hibiscus 5 big petals -->
      <g transform="translate(250, 160)">
        <circle cx="0" cy="-28" r="28" fill="${p}" />
        <circle cx="26" cy="-9" r="28" fill="${p}" />
        <circle cx="16" cy="23" r="28" fill="${p}" />
        <circle cx="-16" cy="23" r="28" fill="${p}" />
        <circle cx="-26" cy="-9" r="28" fill="${p}" />
        <circle cx="0" cy="0" r="14" fill="#98102C" />
        <!-- Long staminal column -->
        <line x1="0" y1="0" x2="30" y2="-35" stroke="${a}" stroke-width="4" stroke-linecap="round" />
        <circle cx="30" cy="-35" r="5" fill="${a}" />
        <circle cx="25" cy="-28" r="3" fill="${a}" />
      </g>
    `
  },
  // 13. Rose Plant
  {
    slug: 'rose-plant',
    title: 'Rose Plant',
    cat: 'Flowering Plants',
    pCol: '#C9203C',
    aCol: '#185C3A',
    pot: POT_WHITE_CERAMIC,
    foliage: (p, a) => `
      <path d="M250 320 Q260 210 240 150" stroke="${a}" stroke-width="5" stroke-linecap="round" />
      <!-- Thorns -->
      <path d="M253 260 L262 256 L253 252 Z" fill="${a}" />
      <path d="M246 220 L237 216 L246 212 Z" fill="${a}" />
      <!-- Rose leaves with serrations -->
      <ellipse cx="205" cy="230" rx="20" ry="12" transform="rotate(-30 205 230)" fill="#25834A" />
      <ellipse cx="285" cy="200" rx="20" ry="12" transform="rotate(30 285 200)" fill="#185C3A" />
      <!-- Crimson layered Rose bloom -->
      <g transform="translate(240, 140)">
        <circle cx="0" cy="0" r="34" fill="${p}" />
        <circle cx="-6" cy="-4" r="24" fill="#A8152F" />
        <circle cx="4" cy="2" r="16" fill="#870B21" />
        <circle cx="0" cy="0" r="8" fill="#5F0515" />
      </g>
    `
  },
  // 14. Bougainvillea
  {
    slug: 'bougainvillea',
    title: 'Bougainvillea',
    cat: 'Flowering Plants',
    pCol: '#D81E73',
    aCol: '#F48FB1',
    pot: POT_TERRACOTTA,
    foliage: (p, a) => `
      <path d="M250 320 Q210 240 200 170 Q250 110 270 80" stroke="#5E4028" stroke-width="5" fill="none" />
      <!-- Cascading magenta clusters -->
      ${[
        [200, 170], [230, 140], [260, 110], [170, 200], [280, 150]
      ].map(([x, y]) => `
        <g transform="translate(${x}, ${y})">
          <ellipse cx="-10" cy="-6" rx="14" ry="10" fill="${p}" transform="rotate(-15)" />
          <ellipse cx="10" cy="-6" rx="14" ry="10" fill="${p}" transform="rotate(15)" />
          <ellipse cx="0" cy="10" rx="14" ry="10" fill="${a}" />
          <circle cx="0" cy="0" r="3" fill="#FFFFFF" />
        </g>
      `).join('')}
    `
  },
  // 15. Jasmine
  {
    slug: 'jasmine',
    title: 'Jasmine',
    cat: 'Flowering Plants',
    pCol: '#FFFFFF',
    aCol: '#FCE789',
    pot: POT_WHITE_CERAMIC,
    foliage: (p, a) => `
      <path d="M250 320 Q230 200 250 140" stroke="#185C3A" stroke-width="4.5" />
      <circle cx="250" cy="190" r="75" fill="#185C3A" opacity="0.3" />
      <!-- Starry white petals -->
      ${[
        [220, 160], [270, 150], [240, 110], [195, 190], [290, 195], [250, 170]
      ].map(([x, y]) => `
        <g transform="translate(${x}, ${y})">
          <polygon points="0,-14 4,-4 14,0 4,4 0,14 -4,4 -14,0 -4,-4" fill="${p}" />
          <circle cx="0" cy="0" r="3" fill="${a}" />
        </g>
      `).join('')}
    `
  },
  // 16. Ceramic Planter
  {
    slug: 'ceramic-planter',
    title: 'Ceramic Planter',
    cat: 'Pots & Planters',
    pCol: '#FFFFFF',
    aCol: '#8D5B36',
    pot: `
      <!-- Solid Wooden Stand -->
      <rect x="175" y="320" width="12" height="110" rx="4" fill="#8D5B36" />
      <rect x="313" y="320" width="12" height="110" rx="4" fill="#8D5B36" />
      <rect x="160" y="355" width="180" height="12" rx="4" fill="#6E4426" />
      <!-- Fluted Ceramic Pot -->
      <path d="M185 190 L200 370 Q250 385 300 370 L315 190 Z" fill="#FAF8F0" />
      <ellipse cx="250" cy="190" rx="65" ry="16" fill="#FFFFFF" />
      <ellipse cx="250" cy="190" rx="56" ry="11" fill="#E5E4DE" />
      <!-- Elegant vertical fluting lines -->
      <line x1="220" y1="205" x2="228" y2="365" stroke="#E2DDD5" stroke-width="3" stroke-linecap="round" />
      <line x1="240" y1="207" x2="244" y2="373" stroke="#E2DDD5" stroke-width="3" stroke-linecap="round" />
      <line x1="260" y1="207" x2="256" y2="373" stroke="#E2DDD5" stroke-width="3" stroke-linecap="round" />
      <line x1="280" y1="205" x2="272" y2="365" stroke="#E2DDD5" stroke-width="3" stroke-linecap="round" />
    `,
    foliage: (p, a) => `<!-- Clean Planter Showcase -->`
  },
  // 17. Terracotta Pot
  {
    slug: 'terracotta-pot',
    title: 'Terracotta Pot',
    cat: 'Pots & Planters',
    pCol: '#C86A45',
    aCol: '#E27D58',
    pot: `
      <!-- Handmade Traditional Terracotta Planter -->
      <path d="M165 210 L190 390 Q250 405 310 390 L335 210 Z" fill="#C86A45" />
      <ellipse cx="250" cy="210" rx="85" ry="18" fill="#DA7851" />
      <ellipse cx="250" cy="210" rx="74" ry="12" fill="#8C4223" />
      <!-- Thick Upper Rolled Rim -->
      <path d="M158 202 Q250 218 342 202 L342 216 Q250 232 158 216 Z" fill="#B45935" />
      <!-- Matching Saucer Plate -->
      <path d="M170 395 Q250 415 330 395 L335 410 Q250 430 165 410 Z" fill="#DA7851" />
    `,
    foliage: (p, a) => `<!-- Clean Artisan Pot -->`
  },
  // 18. Hanging Planter
  {
    slug: 'hanging-planter',
    title: 'Hanging Planter',
    cat: 'Pots & Planters',
    pCol: '#185C3A',
    aCol: '#D4AF37',
    pot: `
      <!-- Golden Macrame / Brass Hanging Cords -->
      <line x1="250" y1="30" x2="190" y2="280" stroke="#C59B27" stroke-width="3" />
      <line x1="250" y1="30" x2="310" y2="280" stroke="#C59B27" stroke-width="3" />
      <line x1="250" y1="30" x2="250" y2="280" stroke="#E5C158" stroke-width="2.5" />
      <circle cx="250" cy="30" r="8" fill="#D4AF37" />
      <!-- Suspended Half Sphere Bowl -->
      <path d="M180 270 C185 365 315 365 320 270 Z" fill="#185C3A" />
      <ellipse cx="250" cy="270" rx="70" ry="16" fill="#25834A" />
      <ellipse cx="250" cy="270" rx="60" ry="11" fill="#103D29" />
      <!-- Little trailing ivy leaves -->
      <path d="M210 280 Q190 330 170 370" stroke="#3E9B57" stroke-width="3" fill="none" />
      <path d="M290 280 Q310 330 325 380" stroke="#3E9B57" stroke-width="3" fill="none" />
    `,
    foliage: (p, a) => ``
  },
  // 19. Garden Soil Mix
  {
    slug: 'garden-soil-mix',
    title: 'Garden Soil Mix',
    cat: 'Gardening Essentials',
    pCol: '#4B382A',
    aCol: '#185C3A',
    pot: `
      <!-- Kraft Bag of Premium Potting Mix -->
      <path d="M170 170 L180 400 Q250 415 320 400 L330 170 Q250 185 170 170 Z" fill="#D8BE9B" />
      <!-- Folded Bag Top -->
      <path d="M165 170 Q250 182 335 170 L335 155 Q250 167 165 155 Z" fill="#BFA37E" />
      <!-- Nursury Soil Label -->
      <rect x="195" y="220" width="110" height="130" rx="10" fill="#FAF8F0" />
      <circle cx="250" cy="260" r="22" fill="#185C3A" />
      <path d="M250 272 C250 258 240 248 235 244 C248 244 258 252 250 272" fill="#FAF8F0" />
      <rect x="210" y="295" width="80" height="8" rx="4" fill="#185C3A" />
      <rect x="220" y="310" width="60" height="6" rx="3" fill="#737B73" />
      <rect x="225" y="322" width="50" height="5" rx="2.5" fill="#3E9B57" />
    `,
    foliage: (p, a) => ``
  },
  // 20. Organic Compost
  {
    slug: 'organic-compost',
    title: 'Organic Compost',
    cat: 'Gardening Essentials',
    pCol: '#382515',
    aCol: '#25834A',
    pot: `
      <!-- Bio Compost Pouch -->
      <path d="M175 180 L185 400 Q250 412 315 400 L325 180 Z" fill="#2D4739" />
      <path d="M170 180 Q250 190 330 180 L330 168 Q250 178 170 168 Z" fill="#1B3025" />
      <!-- Organic Badge -->
      <rect x="200" y="225" width="100" height="120" rx="12" fill="#FAF8F0" />
      <circle cx="250" cy="265" r="24" fill="#25834A" />
      <!-- Leaf icon in circle -->
      <path d="M250 278 C250 262 238 252 232 248 C248 248 260 256 250 278" fill="#FFFFFF" />
      <rect x="215" y="302" width="70" height="7" rx="3" fill="#185C3A" />
      <rect x="222" y="316" width="56" height="5" rx="2" fill="#3E9B57" />
    `,
    foliage: (p, a) => ``
  },
  // 21. Watering Can
  {
    slug: 'watering-can',
    title: 'Watering Can',
    cat: 'Gardening Essentials',
    pCol: '#185C3A',
    aCol: '#D4AF37',
    pot: `
      <!-- Metal Hunter Green Can -->
      <path d="M185 240 L200 380 Q250 395 300 380 L315 240 Z" fill="#185C3A" />
      <ellipse cx="250" cy="240" rx="65" ry="16" fill="#25834A" />
      <ellipse cx="250" cy="240" rx="56" ry="11" fill="#103D29" />
      <!-- Long Spout -->
      <path d="M300 310 L395 185 L408 195 L310 340 Z" fill="#185C3A" />
      <ellipse cx="403" cy="188" rx="10" ry="16" transform="rotate(-35 403 188)" fill="#D4AF37" />
      <!-- Elegant Arched Handle -->
      <path d="M195 245 C130 200 130 350 205 365" stroke="#C28751" stroke-width="12" stroke-linecap="round" fill="none" />
    `,
    foliage: (p, a) => ``
  },
  // 22. Gardening Tool Set
  {
    slug: 'gardening-tool-set',
    title: 'Gardening Tool Set',
    cat: 'Gardening Essentials',
    pCol: '#667085',
    aCol: '#8D5B36',
    pot: `
      <!-- Trowel 1 (Left) -->
      <g transform="translate(190, 200) rotate(-20)">
        <path d="M0 0 C15 -45 35 -45 50 0 L40 50 L10 50 Z" fill="#D0D5DD" />
        <rect x="20" y="50" width="10" height="25" fill="#667085" />
        <rect x="17" y="75" width="16" height="55" rx="6" fill="#8D5B36" />
      </g>
      <!-- Cultivator / Rake (Right) -->
      <g transform="translate(290, 180) rotate(20)">
        <path d="M0 0 L-15 40 M15 0 L15 40 M30 0 L45 40" stroke="#D0D5DD" stroke-width="6" stroke-linecap="round" />
        <rect x="8" y="40" width="14" height="25" fill="#667085" />
        <rect x="7" y="65" width="16" height="55" rx="6" fill="#8D5B36" />
      </g>
    `,
    foliage: (p, a) => ``
  },
  // 23. Cocopeat
  {
    slug: 'cocopeat',
    title: 'Cocopeat',
    cat: 'Gardening Essentials',
    pCol: '#694328',
    aCol: '#FAF8F0',
    pot: `
      <!-- Compressed Organic Coco Coir Brick -->
      <path d="M160 260 L250 210 L340 260 L250 310 Z" fill="#8B5E3C" />
      <path d="M160 260 L250 310 L250 380 L160 330 Z" fill="#654024" />
      <path d="M340 260 L250 310 L250 380 L340 330 Z" fill="#4E311B" />
      <!-- Eco Wrap Paper Ribbon -->
      <path d="M220 227 L280 227 L280 365 L220 365 Z" fill="#E5EFE3" opacity="0.9" />
      <circle cx="250" cy="295" r="16" fill="#185C3A" />
      <path d="M250 305 C250 295 242 288 238 285 C248 285 256 290 250 305" fill="#FAF8F0" />
    `,
    foliage: (p, a) => ``
  },
  // 24. Plant Fertilizer
  {
    slug: 'plant-fertilizer',
    title: 'Plant Fertilizer',
    cat: 'Gardening Essentials',
    pCol: '#185C3A',
    aCol: '#D4AF37',
    pot: `
      <!-- Botanical Liquid Elixir Glass Dropper Bottle -->
      <rect x="200" y="210" width="100" height="170" rx="16" fill="#185C3A" />
      <rect x="235" y="165" width="30" height="45" fill="#D4AF37" />
      <!-- Black Rubber Dropper Bulb -->
      <path d="M232 165 C232 140 268 140 268 165 Z" fill="#1D2B22" />
      <!-- Modern Label -->
      <rect x="210" y="240" width="80" height="110" rx="8" fill="#FAF8F0" />
      <circle cx="250" cy="280" r="18" fill="#185C3A" />
      <path d="M250 292 C250 280 242 272 238 270 C248 270 256 274 250 292" fill="#FAF8F0" />
      <rect x="220" y="310" width="60" height="5" rx="2.5" fill="#103D29" />
      <rect x="225" y="322" width="50" height="4" rx="2" fill="#3E9B57" />
    `,
    foliage: (p, a) => ``
  }
];

// Generate all 24 product SVGs
products.forEach(p => {
  const content = makeProductSvg(p.title, p.cat, p.pCol, p.aCol, p.pot, p.foliage);
  writeSvg(path.join(prodDir, `${p.slug}.svg`), content);
});

// -------------------------------------------------------------
// 3. ILLUSTRATIONS (Empty States & Confirmation)
// -------------------------------------------------------------

// Empty Cart
writeSvg(path.join(illustDir, 'empty-cart.svg'), `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 320" fill="none">
  <circle cx="200" cy="160" r="120" fill="#FAF8F0" />
  <circle cx="200" cy="160" r="95" fill="#E5EFE3" opacity="0.6" />
  <!-- Shopping basket -->
  <path d="M130 160 L145 230 Q200 240 255 230 L270 160 Z" fill="#FFFFFF" stroke="#185C3A" stroke-width="4" stroke-linejoin="round" />
  <!-- Handle -->
  <path d="M155 160 C155 100 245 100 245 160" stroke="#185C3A" stroke-width="4.5" fill="none" stroke-linecap="round" />
  <!-- Grid weave -->
  <line x1="160" y1="180" x2="240" y2="180" stroke="#E5EFE3" stroke-width="3" />
  <line x1="155" y1="205" x2="245" y2="205" stroke="#E5EFE3" stroke-width="3" />
  <!-- Small sprout growing inside -->
  <path d="M200 170 Q200 135 185 125 C200 125 210 135 200 170" fill="#3E9B57" />
  <path d="M200 170 Q200 140 215 130 C205 130 195 140 200 170" fill="#185C3A" />
  <!-- Floating leaves -->
  <circle cx="120" cy="120" r="5" fill="#3E9B57" opacity="0.6" />
  <circle cx="280" cy="130" r="4" fill="#185C3A" opacity="0.5" />
</svg>
`);

// Empty Wishlist
writeSvg(path.join(illustDir, 'empty-wishlist.svg'), `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 320" fill="none">
  <circle cx="200" cy="160" r="120" fill="#FAF8F0" />
  <circle cx="200" cy="160" r="95" fill="#FCECEE" opacity="0.7" />
  <!-- Botanical heart outline -->
  <path d="M200 230 C150 190 120 150 120 120 C120 90 145 70 175 70 C190 70 200 80 200 90 C200 80 210 70 225 70 C255 70 280 90 280 120 C280 150 250 190 200 230 Z" fill="#FFFFFF" stroke="#E24B6A" stroke-width="4" stroke-linejoin="round" />
  <!-- Sprout inside heart -->
  <path d="M200 170 C200 140 185 130 180 125 C195 125 205 135 200 170" fill="#3E9B57" />
  <path d="M200 170 C200 145 215 135 220 130 C205 130 195 140 200 170" fill="#185C3A" />
</svg>
`);

// Empty Orders
writeSvg(path.join(illustDir, 'empty-orders.svg'), `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 320" fill="none">
  <circle cx="200" cy="160" r="120" fill="#FAF8F0" />
  <circle cx="200" cy="160" r="95" fill="#E5EFE3" opacity="0.6" />
  <!-- Eco delivery package -->
  <rect x="140" y="130" width="120" height="90" rx="8" fill="#FFFFFF" stroke="#185C3A" stroke-width="4" />
  <!-- Package tape & botanical ribbon -->
  <line x1="200" y1="130" x2="200" y2="220" stroke="#C86A45" stroke-width="6" />
  <line x1="140" y1="175" x2="260" y2="175" stroke="#C86A45" stroke-width="4" />
  <!-- Leaf tag -->
  <circle cx="200" cy="130" r="16" fill="#3E9B57" />
  <path d="M200 138 C200 128 193 122 190 120 C197 120 204 124 200 138" fill="#FFFFFF" />
</svg>
`);

// Order Success
writeSvg(path.join(illustDir, 'order-success.svg'), `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 320" fill="none">
  <circle cx="200" cy="160" r="110" fill="#E5EFE3" />
  <circle cx="200" cy="160" r="85" fill="#185C3A" />
  <!-- Radiant white checkmark -->
  <path d="M165 160 L190 185 L235 135" stroke="#FFFFFF" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" />
  <!-- Flourishing botanical wreath -->
  <path d="M130 180 C120 150 130 120 150 100" stroke="#3E9B57" stroke-width="3.5" stroke-linecap="round" fill="none" />
  <circle cx="140" cy="105" r="4" fill="#3E9B57" />
  <circle cx="125" cy="140" r="4" fill="#3E9B57" />
  
  <path d="M270 180 C280 150 270 120 250 100" stroke="#3E9B57" stroke-width="3.5" stroke-linecap="round" fill="none" />
  <circle cx="260" cy="105" r="4" fill="#3E9B57" />
  <circle cx="275" cy="140" r="4" fill="#3E9B57" />
</svg>
`);

console.log('All 6 categories, 24 products, and 4 illustrations generated successfully!');
