const fs = require('fs');
const path = require('path');

// 24x24 Pixel Art Canvas Engine
class PixelCanvas {
  constructor(width = 24, height = 24, bgColor = '#0055ff') {
    this.width = width;
    this.height = height;
    this.bgColor = bgColor;
    // 2D grid of hex colors or null (transparent)
    this.grid = Array(height).fill(null).map(() => Array(width).fill(null));
  }

  set(x, y, color) {
    if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
      this.grid[y][x] = color;
    }
  }

  rect(x, y, w, h, color) {
    for (let r = y; r < y + h; r++) {
      for (let c = x; c < x + w; c++) {
        this.set(c, r, color);
      }
    }
  }

  toSVG(renderSize = 480) {
    let rects = [];
    // Background rect
    rects.push(`<rect width="${this.width}" height="${this.height}" fill="${this.bgColor}"/>`);

    // Ground line (bottom horizon line at y=23)
    // Render all colored pixels
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const color = this.grid[y][x];
        if (color) {
          rects.push(`<rect x="${x}" y="${y}" width="1" height="1" fill="${color}"/>`);
        }
      }
    }

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${this.width} ${this.height}" width="${renderSize}" height="${renderSize}" shape-rendering="crispEdges">
  ${rects.join('\n  ')}
</svg>`;
  }
}

// ==========================================
// SAMPLE 1: CYAN ROBOT WITH STRIPED SHIRT (Image 3)
// ==========================================
function buildCyanRobot() {
  const c = new PixelCanvas(24, 24, '#0055ff');
  const BLACK = '#000000';
  const SKIN = '#35c5d0';
  const WHITE = '#ffffff';
  const SHIRT_Y = '#ffd242';
  const SHIRT_B = '#4facfe';

  // Ground line
  c.rect(0, 23, 24, 1, BLACK);

  // Legs (y=20 to 22)
  // Left leg
  c.rect(8, 20, 3, 3, BLACK);
  c.rect(9, 20, 1, 3, SKIN);
  // Right leg
  c.rect(13, 20, 3, 3, BLACK);
  c.rect(14, 20, 1, 3, SKIN);

  // Torso (y=14 to 19)
  // Outer black border for body
  c.rect(5, 14, 14, 6, BLACK);
  // Arms
  c.rect(6, 15, 1, 4, SKIN);
  c.rect(17, 15, 1, 4, SKIN);
  // Torso inside (x=8 to 15, y=14 to 19)
  c.rect(8, 14, 8, 6, SHIRT_Y);
  // Blue stripes on shirt
  c.rect(8, 15, 8, 1, SHIRT_B);
  c.rect(8, 17, 8, 1, SHIRT_B);
  // Black bottom belt
  c.rect(7, 19, 10, 1, BLACK);

  // Neck (y=13)
  c.rect(10, 13, 4, 1, BLACK);
  c.rect(11, 13, 2, 1, SKIN);

  // Ears (x=4..5 and x=18..19, y=8..10)
  c.rect(4, 8, 3, 3, BLACK);
  c.rect(5, 9, 1, 1, SKIN);
  c.rect(17, 8, 3, 3, BLACK);
  c.rect(18, 9, 1, 1, SKIN);

  // Head box (y=5 to 12, x=6 to 17)
  c.rect(6, 5, 12, 8, BLACK);
  c.rect(7, 6, 10, 6, SKIN);

  // Eyes (Looking up-right)
  // Left eye at x=9, y=7
  c.rect(8, 7, 3, 3, WHITE);
  c.set(10, 7, BLACK);
  // Right eye at x=13, y=7
  c.rect(13, 7, 3, 3, WHITE);
  c.set(15, 7, BLACK);

  // Zig-zag mouth (y=10, 11)
  c.set(8, 10, BLACK);
  c.set(10, 10, BLACK);
  c.set(12, 10, BLACK);
  c.set(14, 10, BLACK);
  c.set(9, 11, BLACK);
  c.set(11, 11, BLACK);
  c.set(13, 11, BLACK);

  return c.toSVG();
}

// ==========================================
// SAMPLE 2: PURPLE WARRIOR WITH LASER KATANA (Image 4)
// ==========================================
function buildPurpleWarrior() {
  const c = new PixelCanvas(24, 24, '#0055ff');
  const BLACK = '#000000';
  const SKIN = '#8a7bb5';
  const SWORD_CYAN = '#00f0ff';
  const SWORD_PINK = '#ff00aa';

  // Ground line
  c.rect(0, 23, 24, 1, BLACK);

  // Legs
  c.rect(8, 20, 3, 3, BLACK);
  c.rect(9, 20, 1, 3, '#fca34d');
  c.rect(13, 20, 3, 3, BLACK);
  c.rect(14, 20, 1, 3, '#fca34d');

  // Torso
  c.rect(5, 14, 14, 6, BLACK);
  c.rect(6, 15, 1, 4, SKIN);
  c.rect(17, 15, 1, 4, SKIN);
  c.rect(8, 14, 8, 6, SKIN);
  c.rect(7, 19, 10, 1, BLACK);

  // Neck
  c.rect(10, 13, 4, 1, BLACK);
  c.rect(11, 13, 2, 1, SKIN);

  // Left ear
  c.rect(4, 8, 3, 3, BLACK);
  c.rect(5, 9, 1, 1, SKIN);

  // Head
  c.rect(6, 5, 12, 8, BLACK);
  c.rect(7, 6, 10, 6, SKIN);

  // 2x2 Square Eyes
  c.rect(9, 7, 2, 2, BLACK);
  c.rect(14, 7, 2, 2, BLACK);

  // Mouth (neutral bar)
  c.rect(10, 10, 4, 1, BLACK);
  c.set(9, 11, BLACK); // slight asymmetry

  // Diagonal Katana Sword across body (from bottom left to top right!)
  // Blade points
  const blade = [
    [5, 18], [6, 17], [7, 16], [8, 15], [9, 14], [10, 13], [11, 12],
    [12, 11], [13, 10], [14, 9], [15, 8], [16, 7], [17, 6], [18, 5]
  ];

  // Draw cyan glow border for sword
  blade.forEach(([bx, by]) => {
    c.rect(bx - 1, by - 1, 3, 3, SWORD_CYAN);
  });
  // Draw pink core
  blade.forEach(([bx, by]) => {
    c.set(bx, by, SWORD_PINK);
  });
  // Sword guard & hilt at bottom left
  c.rect(4, 18, 3, 2, SWORD_PINK);
  c.rect(3, 19, 2, 2, BLACK);

  return c.toSVG();
}

// ==========================================
// SAMPLE 3: CUTE ANTENNA GIRL ROBOT (Image 2)
// ==========================================
function buildAntennaGirl() {
  const c = new PixelCanvas(24, 24, '#0055ff');
  const BLACK = '#000000';
  const SKIN = '#fca34d';
  const PIGTAIL = '#00e5c5';
  const PINK_DARK = '#ff007f';
  const PINK_LIGHT = '#ffa6c9';

  // Ground line
  c.rect(0, 23, 24, 1, BLACK);

  // Legs
  c.rect(8, 20, 3, 3, BLACK);
  c.rect(9, 20, 1, 3, SKIN);
  c.rect(13, 20, 3, 3, BLACK);
  c.rect(14, 20, 1, 3, SKIN);

  // Torso with split dress (Left: magenta, Right: light pink)
  c.rect(5, 14, 14, 6, BLACK);
  c.rect(6, 15, 1, 4, PINK_LIGHT);
  c.rect(17, 15, 1, 4, PINK_DARK);
  // Split shirt
  c.rect(8, 14, 4, 6, PINK_DARK);
  c.rect(12, 14, 4, 6, PINK_LIGHT);
  c.rect(7, 19, 10, 1, BLACK);
  c.rect(11, 14, 1, 6, BLACK); // center seam

  // Neck
  c.rect(10, 13, 4, 1, BLACK);
  c.rect(11, 13, 2, 1, SKIN);

  // Side Pigtails
  // Left pigtail
  c.rect(3, 8, 3, 5, BLACK);
  c.rect(4, 9, 2, 4, PIGTAIL);
  c.rect(5, 9, 1, 2, SKIN); // ear connection
  // Right pigtail
  c.rect(18, 8, 3, 5, BLACK);
  c.rect(18, 9, 2, 4, PIGTAIL);
  c.rect(18, 9, 1, 2, SKIN); // ear connection

  // Head Box
  c.rect(6, 6, 12, 7, BLACK);
  c.rect(7, 7, 10, 5, SKIN);

  // Hair bangs (top row of face)
  c.rect(7, 7, 10, 1, SKIN);
  c.rect(7, 7, 2, 1, BLACK);
  c.rect(10, 7, 4, 1, BLACK);
  c.rect(15, 7, 2, 1, BLACK);

  // Dot Eyes
  c.set(9, 9, BLACK);
  c.set(15, 9, BLACK);

  // Red Dot Mouth
  c.set(12, 11, '#ff2222');

  // Top V-Antenna
  c.set(12, 5, BLACK);
  c.set(12, 4, BLACK);
  c.set(11, 3, BLACK);
  c.set(13, 3, BLACK);
  c.set(10, 2, BLACK);
  c.set(14, 2, BLACK);

  return c.toSVG();
}

// Ensure public/samples directory exists
const samplesDir = path.join(__dirname, '..', 'public', 'pixel-samples');
if (!fs.existsSync(samplesDir)) {
  fs.mkdirSync(samplesDir, { recursive: true });
}

fs.writeFileSync(path.join(samplesDir, 'sample-1-cyan-robot.svg'), buildCyanRobot(), 'utf8');
fs.writeFileSync(path.join(samplesDir, 'sample-2-purple-warrior.svg'), buildPurpleWarrior(), 'utf8');
fs.writeFileSync(path.join(samplesDir, 'sample-3-antenna-girl.svg'), buildAntennaGirl(), 'utf8');

console.log('Saved 3 pixel NFT samples to public/pixel-samples/ !');
