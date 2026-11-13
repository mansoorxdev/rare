const fs = require('fs');
const path = require('path');

function generateRobotSVG({
  primaryColor = '#00ff66',
  glowColor = '#22ff88',
  bodyDark = '#081c12',
  bodyMid = '#0f2f20',
  bodyLight = '#174730',
  casingColor = '#3a4a3f',
  casingDark = '#253229',
  screenBg = '#031008',
  eyeColor = '#33ff77'
} = {}) {
  // Pixel eye matrix dots (circular cluster of square pixels like in the video screenshot)
  const leftEyeDots = [
    // Top row
    {x: 257, y: 220}, {x: 265, y: 220}, {x: 273, y: 220},
    // Second row
    {x: 249, y: 228}, {x: 257, y: 228}, {x: 265, y: 228}, {x: 273, y: 228}, {x: 281, y: 228},
    // Third row (center)
    {x: 249, y: 236}, {x: 257, y: 236}, {x: 265, y: 236}, {x: 273, y: 236}, {x: 281, y: 236},
    // Fourth row
    {x: 249, y: 244}, {x: 257, y: 244}, {x: 265, y: 244}, {x: 273, y: 244}, {x: 281, y: 244},
    // Bottom row
    {x: 257, y: 252}, {x: 265, y: 252}, {x: 273, y: 252},
  ];

  const rightEyeDots = [
    // Top row
    {x: 327, y: 220}, {x: 335, y: 220}, {x: 343, y: 220},
    // Second row
    {x: 319, y: 228}, {x: 327, y: 228}, {x: 335, y: 228}, {x: 343, y: 228}, {x: 351, y: 228},
    // Third row (center)
    {x: 319, y: 236}, {x: 327, y: 236}, {x: 335, y: 236}, {x: 343, y: 236}, {x: 351, y: 236},
    // Fourth row
    {x: 319, y: 244}, {x: 327, y: 244}, {x: 335, y: 244}, {x: 343, y: 244}, {x: 351, y: 244},
    // Bottom row
    {x: 327, y: 252}, {x: 335, y: 252}, {x: 343, y: 252},
  ];

  const mouthDots = [
    {x: 294, y: 270}, {x: 300, y: 270}, {x: 306, y: 270}
  ];

  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" width="100%" height="100%" style="background: transparent;">
  <defs>
    <!-- Neon Glow Filter -->
    <filter id="neon-glow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="3" result="blur1" />
      <feGaussianBlur stdDeviation="6" result="blur2" />
      <feMerge>
        <feMergeNode in="blur2" />
        <feMergeNode in="blur1" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>

    <filter id="eye-glow" x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur stdDeviation="2" result="b1" />
      <feGaussianBlur stdDeviation="5" result="b2" />
      <feMerge>
        <feMergeNode in="b2" />
        <feMergeNode in="b1" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>

    <!-- CRT Scanlines Pattern -->
    <pattern id="scanlines" width="100" height="4" patternUnits="userSpaceOnUse">
      <line x1="0" y1="0" x2="100" y2="0" stroke="rgba(0,0,0,0.4)" stroke-width="1.5" />
    </pattern>

    <!-- Gradients -->
    <radialGradient id="screen-grad" cx="50%" cy="50%" r="55%">
      <stop offset="0%" stop-color="#0a2a16" />
      <stop offset="70%" stop-color="${screenBg}" />
      <stop offset="100%" stop-color="#020804" />
    </radialGradient>

    <linearGradient id="casing-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#4e5f54" />
      <stop offset="50%" stop-color="${casingColor}" />
      <stop offset="100%" stop-color="${casingDark}" />
    </linearGradient>

    <linearGradient id="casing-top" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#607467" />
      <stop offset="100%" stop-color="${casingColor}" />
    </linearGradient>

    <radialGradient id="ground-shadow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="rgba(0,0,0,0.5)" />
      <stop offset="60%" stop-color="rgba(0,0,0,0.15)" />
      <stop offset="100%" stop-color="rgba(0,0,0,0)" />
    </radialGradient>
  </defs>

  <style>
    .wf-line {
      stroke: ${primaryColor};
      stroke-width: 2.2;
      stroke-linecap: round;
      stroke-linejoin: round;
      filter: url(#neon-glow);
    }
    .wf-line-subtle {
      stroke: ${primaryColor};
      stroke-width: 1.4;
      stroke-linecap: round;
      stroke-linejoin: round;
      opacity: 0.85;
    }
    .poly-facet {
      transition: all 0.3s ease;
    }
    .poly-facet:hover {
      filter: brightness(1.2);
    }
  </style>

  <!-- 1. Ground Contact Shadow -->
  <ellipse cx="300" cy="745" rx="170" ry="22" fill="url(#ground-shadow)" />

  <!-- 2. ROBOT LEGS -->
  <g id="robot-legs">
    <!-- Left Leg (Thigh / Knee / Calf) -->
    <!-- Thigh Facets -->
    <polygon points="250,565 220,625 255,630 275,568" fill="${bodyDark}" stroke="${primaryColor}" stroke-width="2" class="poly-facet" filter="url(#neon-glow)" />
    <polygon points="255,630 220,625 240,660 270,660" fill="${bodyMid}" stroke="${primaryColor}" stroke-width="2" class="poly-facet" filter="url(#neon-glow)" />
    <!-- Knee Armor Joint -->
    <polygon points="235,655 255,645 275,655 255,670" fill="${bodyLight}" stroke="${primaryColor}" stroke-width="2.2" class="poly-facet" filter="url(#neon-glow)" />
    <!-- Shin / Calf -->
    <polygon points="242,670 268,670 265,715 240,715" fill="${bodyDark}" stroke="${primaryColor}" stroke-width="2" class="poly-facet" filter="url(#neon-glow)" />
    <!-- Left Foot / Boot -->
    <polygon points="232,715 272,715 275,735 225,735" fill="${bodyMid}" stroke="${primaryColor}" stroke-width="2.2" class="poly-facet" filter="url(#neon-glow)" />
    <line x1="225" y1="735" x2="275" y2="735" stroke="${primaryColor}" stroke-width="3" filter="url(#neon-glow)" />
    <rect x="238" y="722" width="20" height="8" fill="#11291b" stroke="${primaryColor}" stroke-width="1.2" />

    <!-- Right Leg (Thigh / Knee / Calf) -->
    <!-- Thigh Facets -->
    <polygon points="350,565 325,568 345,630 380,625" fill="${bodyDark}" stroke="${primaryColor}" stroke-width="2" class="poly-facet" filter="url(#neon-glow)" />
    <polygon points="345,630 380,625 360,660 330,660" fill="${bodyMid}" stroke="${primaryColor}" stroke-width="2" class="poly-facet" filter="url(#neon-glow)" />
    <!-- Knee Armor Joint -->
    <polygon points="325,655 345,645 365,655 345,670" fill="${bodyLight}" stroke="${primaryColor}" stroke-width="2.2" class="poly-facet" filter="url(#neon-glow)" />
    <!-- Shin / Calf -->
    <polygon points="332,670 358,670 360,715 335,715" fill="${bodyDark}" stroke="${primaryColor}" stroke-width="2" class="poly-facet" filter="url(#neon-glow)" />
    <!-- Right Foot / Boot -->
    <polygon points="328,715 368,715 375,735 325,735" fill="${bodyMid}" stroke="${primaryColor}" stroke-width="2.2" class="poly-facet" filter="url(#neon-glow)" />
    <line x1="325" y1="735" x2="375" y2="735" stroke="${primaryColor}" stroke-width="3" filter="url(#neon-glow)" />
    <rect x="342" y="722" width="20" height="8" fill="#11291b" stroke="${primaryColor}" stroke-width="1.2" />
  </g>

  <!-- 3. PELVIS / LOWER TORSO -->
  <g id="pelvis">
    <polygon points="270,550 330,550 300,580" fill="${bodyMid}" stroke="${primaryColor}" stroke-width="2.2" class="poly-facet" filter="url(#neon-glow)" />
    <polygon points="250,535 270,550 300,580 250,565" fill="${bodyDark}" stroke="${primaryColor}" stroke-width="2" class="poly-facet" filter="url(#neon-glow)" />
    <polygon points="350,535 330,550 300,580 350,565" fill="${bodyDark}" stroke="${primaryColor}" stroke-width="2" class="poly-facet" filter="url(#neon-glow)" />
  </g>

  <!-- 4. ROBOT ARMS & SHOULDERS (Back Layer) -->
  <g id="robot-arms-back">
    <!-- Left Shoulder Pad (Chamfered Poly) -->
    <polygon points="180,380 230,370 240,410 185,425" fill="${bodyMid}" stroke="${primaryColor}" stroke-width="2.2" class="poly-facet" filter="url(#neon-glow)" />
    <polygon points="180,380 165,410 185,425" fill="${bodyDark}" stroke="${primaryColor}" stroke-width="1.8" class="poly-facet" filter="url(#neon-glow)" />
    <!-- Left Upper Arm -->
    <polygon points="185,425 215,420 205,480 175,475" fill="${bodyDark}" stroke="${primaryColor}" stroke-width="2" class="poly-facet" filter="url(#neon-glow)" />
    <!-- Left Forearm -->
    <polygon points="175,475 205,480 235,510 205,530" fill="${bodyMid}" stroke="${primaryColor}" stroke-width="2" class="poly-facet" filter="url(#neon-glow)" />

    <!-- Right Shoulder Pad (Chamfered Poly) -->
    <polygon points="420,380 370,370 360,410 415,425" fill="${bodyMid}" stroke="${primaryColor}" stroke-width="2.2" class="poly-facet" filter="url(#neon-glow)" />
    <polygon points="420,380 435,410 415,425" fill="${bodyDark}" stroke="${primaryColor}" stroke-width="1.8" class="poly-facet" filter="url(#neon-glow)" />
    <!-- Right Upper Arm -->
    <polygon points="415,425 385,420 395,480 425,475" fill="${bodyDark}" stroke="${primaryColor}" stroke-width="2" class="poly-facet" filter="url(#neon-glow)" />
    <!-- Right Forearm -->
    <polygon points="425,475 395,480 365,510 395,530" fill="${bodyMid}" stroke="${primaryColor}" stroke-width="2" class="poly-facet" filter="url(#neon-glow)" />
  </g>

  <!-- 5. MAIN TORSO -->
  <g id="main-torso">
    <!-- Upper Chest Plate -->
    <polygon points="230,370 300,385 370,370 350,430 300,435 250,430" fill="${bodyLight}" stroke="${primaryColor}" stroke-width="2.2" class="poly-facet" filter="url(#neon-glow)" />
    <!-- ID / Serial Plate on Upper Right Chest -->
    <rect x="315" y="395" width="28" height="9" rx="1.5" fill="#143622" stroke="${primaryColor}" stroke-width="1.2" />
    <line x1="318" y1="400" x2="340" y2="400" stroke="${primaryColor}" stroke-width="1" opacity="0.8" />

    <!-- Mid Torso Plates behind chest box -->
    <polygon points="250,430 300,435 300,530 250,535" fill="${bodyDark}" stroke="${primaryColor}" stroke-width="1.8" class="poly-facet" filter="url(#neon-glow)" />
    <polygon points="350,430 300,435 300,530 350,535" fill="${bodyMid}" stroke="${primaryColor}" stroke-width="1.8" class="poly-facet" filter="url(#neon-glow)" />
  </g>

  <!-- 6. THE CHEST VAULT / BOX (Held in Front) -->
  <g id="chest-vault">
    <!-- Box Top Facet -->
    <polygon points="240,450 300,435 360,450 300,465" fill="${bodyLight}" stroke="${primaryColor}" stroke-width="2.4" class="poly-facet" filter="url(#neon-glow)" />
    
    <!-- Box Front Left Facet -->
    <polygon points="240,450 300,465 300,525 240,505" fill="${bodyMid}" stroke="${primaryColor}" stroke-width="2.4" class="poly-facet" filter="url(#neon-glow)" />
    <!-- Internal wireframe facet triangles -->
    <line x1="240" y1="450" x2="300" y2="525" class="wf-line-subtle" />
    <line x1="240" y1="505" x2="300" y2="465" class="wf-line-subtle" />

    <!-- Box Front Right Facet -->
    <polygon points="300,465 360,450 360,505 300,525" fill="${bodyDark}" stroke="${primaryColor}" stroke-width="2.4" class="poly-facet" filter="url(#neon-glow)" />
    <line x1="300" y1="465" x2="360" y2="505" class="wf-line-subtle" />
    <line x1="300" y1="525" x2="360" y2="450" class="wf-line-subtle" />

    <!-- Center Vault Lock / Latch Mechanism -->
    <rect x="291" y="475" width="18" height="24" rx="2" fill="#2d4233" stroke="${primaryColor}" stroke-width="2" filter="url(#neon-glow)" />
    <circle cx="300" cy="483" r="3" fill="${primaryColor}" filter="url(#neon-glow)" />
    <line x1="300" y1="486" x2="300" y2="493" stroke="${primaryColor}" stroke-width="2" />
  </g>

  <!-- 7. ROBOT HANDS (Gripping Vault Box Sides) -->
  <g id="robot-hands">
    <!-- Left Hand Digits -->
    <polygon points="230,490 248,485 252,502 232,508" fill="${bodyLight}" stroke="${primaryColor}" stroke-width="2" class="poly-facet" filter="url(#neon-glow)" />
    <line x1="240" y1="487" x2="242" y2="505" stroke="${primaryColor}" stroke-width="1.5" />
    <line x1="246" y1="486" x2="248" y2="503" stroke="${primaryColor}" stroke-width="1.5" />

    <!-- Right Hand Digits -->
    <polygon points="370,490 352,485 348,502 368,508" fill="${bodyLight}" stroke="${primaryColor}" stroke-width="2" class="poly-facet" filter="url(#neon-glow)" />
    <line x1="360" y1="487" x2="358" y2="505" stroke="${primaryColor}" stroke-width="1.5" />
    <line x1="354" y1="486" x2="352" y2="503" stroke="${primaryColor}" stroke-width="1.5" />
  </g>

  <!-- 8. MECHANICAL NECK JOINT -->
  <g id="neck">
    <rect x="275" y="338" width="50" height="25" fill="#1b2e22" stroke="${primaryColor}" stroke-width="2" filter="url(#neon-glow)" />
    <line x1="285" y1="338" x2="285" y2="363" stroke="${primaryColor}" stroke-width="1.5" />
    <line x1="300" y1="338" x2="300" y2="363" stroke="${primaryColor}" stroke-width="1.5" />
    <line x1="315" y1="338" x2="315" y2="363" stroke="${primaryColor}" stroke-width="1.5" />
  </g>

  <!-- 9. CRT MONITOR HEAD -->
  <g id="crt-head">
    <!-- Outer Monitor Bevel & Perspective Casing -->
    <!-- Top Chamfer of Monitor -->
    <polygon points="210,135 390,135 415,165 185,165" fill="url(#casing-top)" stroke="${casingDark}" stroke-width="1.5" />
    <!-- Side Left Chamfer -->
    <polygon points="210,135 185,165 185,325 200,345" fill="#2d3a31" stroke="${casingDark}" stroke-width="1.5" />
    <!-- Side Right Chamfer -->
    <polygon points="390,135 415,165 415,325 400,345" fill="#1e2721" stroke="${casingDark}" stroke-width="1.5" />
    <!-- Bottom Chamfer -->
    <polygon points="185,325 200,345 400,345 415,325" fill="#18211a" stroke="${casingDark}" stroke-width="1.5" />

    <!-- Monitor Front Face Bezel -->
    <rect x="195" y="155" width="210" height="180" rx="14" fill="url(#casing-grad)" stroke="#1a241c" stroke-width="3" />
    <rect x="198" y="158" width="204" height="174" rx="12" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="1" />

    <!-- Inset Screen Frame -->
    <rect x="210" y="170" width="180" height="135" rx="8" fill="#08140c" stroke="#112217" stroke-width="2.5" />

    <!-- CRT Phosphor Screen Surface -->
    <rect x="214" y="174" width="172" height="127" rx="6" fill="url(#screen-grad)" />
    <!-- CRT Curved Glass Glare Reflex -->
    <path d="M 216 176 L 382 176 C 360 215, 238 215, 216 176 Z" fill="rgba(255, 255, 255, 0.08)" />

    <!-- Scanline Layer -->
    <rect x="214" y="174" width="172" height="127" rx="6" fill="url(#scanlines)" opacity="0.65" pointer-events="none" />

    <!-- GLOWING PIXEL MATRIX EYES -->
    <g id="screen-eyes" filter="url(#eye-glow)">
      <!-- Left Eye Pixel Dots -->
      ${leftEyeDots.map(d => `<rect x="${d.x}" y="${d.y}" width="6" height="6" rx="1.2" fill="${eyeColor}" />`).join('\n      ')}

      <!-- Right Eye Pixel Dots -->
      ${rightEyeDots.map(d => `<rect x="${d.x}" y="${d.y}" width="6" height="6" rx="1.2" fill="${eyeColor}" />`).join('\n      ')}

      <!-- Pixel Nose / Mouth Dots -->
      ${mouthDots.map(d => `<rect x="${d.x}" y="${d.y}" width="4" height="4" rx="0.8" fill="${eyeColor}" opacity="0.85" />`).join('\n      ')}
    </g>

    <!-- Monitor Chin Controls / Badges -->
    <rect x="220" y="318" width="30" height="4" rx="2" fill="#1b2920" />
    <line x1="222" y1="320" x2="248" y2="320" stroke="${primaryColor}" stroke-width="1" opacity="0.7" />
    <!-- Power / Rotary Knobs -->
    <circle cx="370" cy="322" r="5" fill="#202c24" stroke="#111813" stroke-width="1.5" />
    <circle cx="370" cy="322" r="2" fill="${primaryColor}" opacity="0.7" />
    <circle cx="388" cy="322" r="4" fill="#202c24" stroke="#111813" stroke-width="1.5" />
  </g>
</svg>
`;
}

// Generate default matrix green
const svg = generateRobotSVG();
const outDir = path.join(__dirname, '..', 'public');
fs.writeFileSync(path.join(outDir, 'rare-crt-robot.svg'), svg, 'utf8');
console.log('Saved rare-crt-robot.svg successfully to public directory!');

