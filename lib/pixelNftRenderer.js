/**
 * DETERMINISTIC 24x24 PIXEL NFT GENERATOR
 * Pure JavaScript - 0 external dependencies, runs on Vercel Edge & Node.js
 */

export const BACKGROUNDS = [
  { name: 'Pure White Studio', color: '#ffffff' },
  { name: 'Solana Pearl White', color: '#ffffff' },
  { name: 'Minimalist White', color: '#ffffff' },
  { name: 'Clean Room White', color: '#ffffff' },
  { name: 'Glacial White', color: '#ffffff' },
  { name: 'Cybernetic White', color: '#ffffff' }
];

export const SKINS = [
  { name: 'Cyan Robot', color: '#35c5d0', legColor: '#35c5d0' },
  { name: 'Lilac Purple', color: '#8a7bb5', legColor: '#fca34d' },
  { name: 'Peach Humanoid', color: '#fca34d', legColor: '#fca34d' },
  { name: 'Bubblegum Pink', color: '#fbb1bd', legColor: '#fbb1bd' },
  { name: 'Anime Ivory', color: '#ffccd5', legColor: '#ffccd5' },
  { name: 'Golden Android', color: '#f5cb5c', legColor: '#f5cb5c' },
  { name: 'Steel Chrome', color: '#e0e1dd', legColor: '#e0e1dd' },
  { name: 'Shadow Obsidian', color: '#4a4e69', legColor: '#4a4e69' },
  { name: 'Acid Phosphor', color: '#a7c957', legColor: '#a7c957' },
  { name: 'Ruby Core', color: '#d90429', legColor: '#d90429' }
];

export const HEADWEAR = [
  'Clean / None',
  'Robot Side Ear Bolts',
  'Top V-Antenna',
  'Cyber Pigtails',
  'Headband with Checked Visor',
  'Black Baseball Cap',
  'Cyber Punk Mohawk',
  'Single Bulb Antenna',
  'VR Headset Goggles',
  'Golden Halo',
  'Ninja Headband',
  'Double Horn Bolts',
  'Cat Ear Bolts',
  'Crown of Sol',
  'Cyber Beanie'
];

export const EYES = [
  'Looking Up-Right',
  '2x2 Warrior Square Eyes',
  'Cute Dot Eyes',
  'Happy Curved Eyes',
  'Sunglasses Goggles',
  'Looking Left',
  'Laser Red Beam Eyes',
  'Wink Smile',
  'Sleepy Flat Bars',
  'Anime Glint Eyes',
  'Cyber Scanline Visor',
  'X Target Eyes'
];

export const MOUTHS = [
  'Zig-Zag Robot Teeth',
  'Neutral Bar Line',
  'Cute Red Dot',
  'Black Dot Mouth',
  'Open Smile Box',
  'Asymmetric Smirk',
  'Cigar Puff',
  'Tongue Out',
  'Vampire Fangs',
  'Gasmask Vents'
];

export const CLOTHING = [
  'Yellow Blue Striped Tee',
  'Pink Magenta Split Dress',
  'Orange Football Jersey 10',
  'Lilac Warrior Tunic',
  'White Collar Shirt with Tie',
  'Black Leather Jacket',
  'Cyan Cyber Hoodie',
  'Red Hawaiian Floral',
  'Camo Military Vest',
  'Golden Imperial Robe',
  'Sailor Navy Stripes',
  'Neon Purple Grid Armor',
  'Lab Scientist Coat',
  'Skeleton Bones Shirt',
  'Solana Gradient Tee',
  'Pure Armor Chassis'
];

export const ACCESSORIES = [
  'None / Natural Stance',
  'Neon Laser Katana',
  'Flying-V Electric Guitar',
  'Solana Coin Shield',
  'Golden Champion Trophy',
  'Cyber Hover Skateboard',
  'Plasma Raygun Blaster',
  'Cyber Coffee Mug',
  'Magic Star Wand',
  'Diamond Hands Token',
  'Retro Boombox',
  'Dual Energy Daggers'
];

export function getPixelTraits(id) {
  const numId = Math.max(1, Math.min(10078, parseInt(id, 10) || 1));
  let h = (numId ^ 0x9e3779b9) >>> 0;
  h = Math.imul(h ^ (h >>> 16), 0x85ebca6b);
  h = Math.imul(h ^ (h >>> 13), 0xc2b2ae35);
  const seed = (h ^ (h >>> 16)) >>> 0;

  const bgIdx = seed % BACKGROUNDS.length;
  const skinIdx = (seed >>> 4) % SKINS.length;
  const headIdx = (seed >>> 8) % HEADWEAR.length;
  const eyeIdx = (seed >>> 12) % EYES.length;
  const mouthIdx = (seed >>> 16) % MOUTHS.length;
  const clothesIdx = (seed >>> 20) % CLOTHING.length;
  const accIdx = (seed >>> 24) % ACCESSORIES.length;

  return {
    bg: BACKGROUNDS[bgIdx],
    skin: SKINS[skinIdx],
    headwear: HEADWEAR[headIdx],
    eyes: EYES[eyeIdx],
    mouth: MOUTHS[mouthIdx],
    clothes: CLOTHING[clothesIdx],
    accessory: ACCESSORIES[accIdx]
  };
}

export function generatePixelSVG(id, renderSize = 480) {
  const traits = getPixelTraits(id);
  const { bg, skin, headwear, eyes, mouth, clothes, accessory } = traits;

  const width = 24;
  const height = 24;
  const grid = Array(height).fill(null).map(() => Array(width).fill(null));

  const set = (x, y, color) => {
    if (x >= 0 && x < width && y >= 0 && y < height) grid[y][x] = color;
  };
  const rect = (x, y, w, h, color) => {
    for (let r = y; r < y + h; r++) {
      for (let c = x; c < x + w; c++) set(c, r, color);
    }
  };

  const BLACK = '#000000';
  const WHITE = '#ffffff';

  // Ground contact shadow under character feet on pure white
  rect(7, 23, 10, 1, '#cbd5e1');
  rect(8, 22, 8, 1, '#e2e8f0');

  // Legs
  rect(8, 20, 3, 3, BLACK);
  rect(9, 20, 1, 3, skin.legColor);
  rect(13, 20, 3, 3, BLACK);
  rect(14, 20, 1, 3, skin.legColor);

  // Torso base
  rect(5, 14, 14, 6, BLACK);
  rect(6, 15, 1, 4, skin.color);
  rect(17, 15, 1, 4, skin.color);

  // Clothes
  if (clothes === 'Yellow Blue Striped Tee') {
    rect(8, 14, 8, 6, '#ffd242');
    rect(8, 15, 8, 1, '#4facfe');
    rect(8, 17, 8, 1, '#4facfe');
  } else if (clothes === 'Pink Magenta Split Dress') {
    rect(6, 15, 1, 4, '#ffa6c9');
    rect(17, 15, 1, 4, '#ff007f');
    rect(8, 14, 4, 6, '#ff007f');
    rect(12, 14, 4, 6, '#ffa6c9');
    rect(11, 14, 1, 6, BLACK);
  } else if (clothes === 'Orange Football Jersey 10') {
    rect(8, 14, 8, 6, '#f97316');
    rect(11, 15, 2, 4, WHITE);
    rect(10, 15, 4, 1, WHITE);
    rect(10, 17, 4, 1, WHITE);
  } else if (clothes === 'Lilac Warrior Tunic') {
    rect(8, 14, 8, 6, '#8a7bb5');
    rect(11, 14, 2, 6, '#6d5999');
  } else if (clothes === 'White Collar Shirt with Tie') {
    rect(8, 14, 8, 6, '#e2e8f0');
    rect(11, 14, 2, 6, '#ef4444');
  } else if (clothes === 'Black Leather Jacket') {
    rect(8, 14, 8, 6, '#18181b');
    rect(11, 14, 2, 6, '#ffffff');
  } else if (clothes === 'Cyan Cyber Hoodie') {
    rect(8, 14, 8, 6, '#06b6d4');
    rect(10, 17, 4, 2, '#0891b2');
  } else if (clothes === 'Red Hawaiian Floral') {
    rect(8, 14, 8, 6, '#ef4444');
    set(9, 15, '#fef08a');
    set(13, 16, '#fef08a');
    set(10, 18, '#fef08a');
    set(14, 18, '#fef08a');
  } else if (clothes === 'Golden Imperial Robe') {
    rect(8, 14, 8, 6, '#eab308');
    rect(8, 14, 8, 1, '#ca8a04');
    rect(11, 14, 2, 6, '#991b1b');
  } else if (clothes === 'Solana Gradient Tee') {
    rect(8, 14, 8, 2, '#9945ff');
    rect(8, 16, 8, 2, '#14f195');
    rect(8, 18, 8, 2, '#00c2ff');
  } else {
    rect(8, 14, 8, 6, skin.color);
    rect(10, 16, 4, 2, '#1e293b');
  }
  rect(7, 19, 10, 1, BLACK);

  // Neck
  rect(10, 13, 4, 1, BLACK);
  rect(11, 13, 2, 1, skin.color);

  // Ears
  if (headwear === 'Robot Side Ear Bolts' || headwear === 'Double Horn Bolts' || headwear === 'Clean / None') {
    rect(4, 8, 3, 3, BLACK);
    rect(5, 9, 1, 1, skin.color);
    rect(17, 8, 3, 3, BLACK);
    rect(18, 9, 1, 1, skin.color);
  } else if (headwear === 'Cyber Pigtails') {
    rect(3, 8, 3, 5, BLACK);
    rect(4, 9, 2, 4, '#00e5c5');
    rect(5, 9, 1, 2, skin.color);
    rect(18, 8, 3, 5, BLACK);
    rect(18, 9, 2, 4, '#00e5c5');
    rect(18, 9, 1, 2, skin.color);
  } else if (headwear === 'Cat Ear Bolts') {
    rect(4, 7, 3, 4, BLACK);
    rect(5, 8, 1, 2, '#ec4899');
    rect(17, 7, 3, 4, BLACK);
    rect(18, 8, 1, 2, '#ec4899');
  }

  // Head box
  rect(6, 5, 12, 8, BLACK);
  rect(7, 6, 10, 6, skin.color);

  // Headwear
  if (headwear === 'Top V-Antenna') {
    set(12, 5, BLACK); set(12, 4, BLACK);
    set(11, 3, BLACK); set(13, 3, BLACK);
    set(10, 2, BLACK); set(14, 2, BLACK);
  } else if (headwear === 'Single Bulb Antenna') {
    set(12, 4, BLACK); set(12, 3, BLACK); set(12, 2, '#ff0055');
  } else if (headwear === 'Headband with Checked Visor') {
    rect(6, 4, 12, 3, BLACK);
    rect(7, 5, 10, 1, '#ef4444');
    rect(7, 6, 10, 1, '#38bdf8');
    set(8, 6, WHITE); set(10, 6, WHITE); set(12, 6, WHITE); set(14, 6, WHITE);
  } else if (headwear === 'Black Baseball Cap') {
    rect(5, 4, 13, 2, BLACK);
    rect(6, 5, 12, 2, BLACK);
  } else if (headwear === 'Cyber Punk Mohawk') {
    rect(11, 2, 2, 4, '#10b981');
    rect(11, 3, 2, 3, '#059669');
  } else if (headwear === 'Golden Halo') {
    rect(8, 2, 8, 2, '#facc15');
    rect(9, 3, 6, 1, bg.color);
  } else if (headwear === 'Crown of Sol') {
    rect(7, 3, 10, 3, '#eab308');
    set(8, 2, '#eab308'); set(11, 1, '#eab308'); set(12, 1, '#eab308'); set(15, 2, '#eab308');
    set(9, 3, '#ef4444'); set(14, 3, '#06b6d4');
  } else if (headwear === 'Ninja Headband') {
    rect(6, 5, 12, 2, '#18181b');
    rect(10, 5, 4, 2, '#e2e8f0');
  }

  // Eyes
  if (eyes === 'Looking Up-Right') {
    rect(8, 7, 3, 3, WHITE); set(10, 7, BLACK);
    rect(13, 7, 3, 3, WHITE); set(15, 7, BLACK);
  } else if (eyes === '2x2 Warrior Square Eyes') {
    rect(9, 7, 2, 2, BLACK);
    rect(13, 7, 2, 2, BLACK);
  } else if (eyes === 'Cute Dot Eyes') {
    set(9, 9, BLACK); set(14, 9, BLACK);
  } else if (eyes === 'Happy Curved Eyes') {
    set(9, 8, BLACK); set(8, 9, BLACK); set(10, 9, BLACK);
    set(14, 8, BLACK); set(13, 9, BLACK); set(15, 9, BLACK);
  } else if (eyes === 'Sunglasses Goggles') {
    rect(7, 7, 10, 3, BLACK);
    rect(8, 8, 3, 2, '#38bdf8');
    rect(13, 8, 3, 2, '#38bdf8');
    set(9, 8, WHITE); set(14, 8, WHITE);
  } else if (eyes === 'Laser Red Beam Eyes') {
    rect(8, 8, 3, 2, '#ef4444');
    rect(13, 8, 3, 2, '#ef4444');
    set(9, 8, WHITE); set(14, 8, WHITE);
  } else if (eyes === 'Wink Smile') {
    rect(8, 8, 3, 1, BLACK); set(14, 8, BLACK);
  } else if (eyes === 'Sleepy Flat Bars') {
    rect(8, 8, 3, 1, BLACK); rect(13, 8, 3, 1, BLACK);
  } else if (eyes === 'Cyber Scanline Visor') {
    rect(7, 8, 10, 2, '#22c55e');
    set(9, 8, WHITE); set(14, 8, WHITE);
  } else {
    set(9, 8, BLACK); set(14, 8, BLACK);
  }

  // Mouth
  if (mouth === 'Zig-Zag Robot Teeth') {
    set(8, 10, BLACK); set(10, 10, BLACK); set(12, 10, BLACK); set(14, 10, BLACK);
    set(9, 11, BLACK); set(11, 11, BLACK); set(13, 11, BLACK);
  } else if (mouth === 'Neutral Bar Line') {
    rect(10, 10, 4, 1, BLACK);
  } else if (mouth === 'Cute Red Dot') {
    set(12, 11, '#ef4444');
  } else if (mouth === 'Black Dot Mouth') {
    set(12, 11, BLACK);
  } else if (mouth === 'Open Smile Box') {
    rect(10, 10, 4, 2, BLACK);
    rect(11, 10, 2, 1, WHITE);
  } else if (mouth === 'Asymmetric Smirk') {
    rect(10, 11, 4, 1, BLACK); set(13, 10, BLACK);
  } else if (mouth === 'Cigar Puff') {
    rect(10, 11, 5, 1, '#78350f');
    set(14, 11, '#f97316');
    set(15, 10, '#94a3b8');
  } else {
    rect(10, 11, 4, 1, BLACK);
  }

  // Held Item
  if (accessory === 'Neon Laser Katana') {
    const blade = [
      [5, 18], [6, 17], [7, 16], [8, 15], [9, 14], [10, 13], [11, 12],
      [12, 11], [13, 10], [14, 9], [15, 8], [16, 7], [17, 6], [18, 5]
    ];
    blade.forEach(([bx, by]) => rect(bx - 1, by - 1, 3, 3, '#00f0ff'));
    blade.forEach(([bx, by]) => set(bx, by, '#ff00aa'));
    rect(4, 18, 3, 2, '#ff00aa');
    rect(3, 19, 2, 2, BLACK);
  } else if (accessory === 'Flying-V Electric Guitar') {
    rect(1, 14, 4, 7, '#ef4444');
    rect(4, 16, 5, 4, '#ef4444');
    rect(3, 16, 6, 2, '#f59e0b');
    rect(7, 17, 13, 1, '#d97706');
    rect(19, 16, 3, 3, '#ef4444');
    set(20, 16, BLACK);
    set(21, 18, BLACK);
  } else if (accessory === 'Solana Coin Shield') {
    rect(15, 14, 6, 6, '#14f195');
    rect(16, 15, 4, 4, '#9945ff');
    set(17, 16, '#00c2ff'); set(18, 17, '#00c2ff');
  } else if (accessory === 'Golden Champion Trophy') {
    rect(16, 14, 5, 4, '#eab308');
    rect(17, 18, 3, 2, '#ca8a04');
    set(15, 15, '#eab308'); set(21, 15, '#eab308');
  } else if (accessory === 'Cyber Hover Skateboard') {
    rect(2, 22, 20, 1, '#06b6d4');
    set(5, 23, '#ec4899'); set(18, 23, '#ec4899');
  } else if (accessory === 'Plasma Raygun Blaster') {
    rect(16, 15, 5, 2, '#475569');
    rect(18, 14, 3, 1, '#00f5d4');
    set(21, 15, '#f43f5e');
  }

  // Render SVG
  const rects = [`<rect width="${width}" height="${height}" fill="${bg.color}"/>`];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (grid[y][x]) {
        rects.push(`<rect x="${x}" y="${y}" width="1" height="1" fill="${grid[y][x]}"/>`);
      }
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${renderSize}" height="${renderSize}" shape-rendering="crispEdges">
  ${rects.join('\n  ')}
</svg>`;
}
