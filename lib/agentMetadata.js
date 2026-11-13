/**
 * SINGLE SOURCE OF TRUTH FOR ALL 10,078 RARE PROTOCOL AGENTS
 * Used by:
 * 1. app/api/agents/route.js (API)
 * 2. components/Agent360Viewer.jsx (3D Hero Turnaround)
 * 3. app/page.js (Frontend Roster, Mint Deck, and Modals)
 */

export const ARCHETYPE_CONFIGS = [
  {
    name: 'Arctic Ghost Oracle',
    image: '/assets/agent/rare_arctic.jpg',
    turn: '/assets/agent/rare_arch_arctic.jpg',
    profile: null,
    back: null,
    baseColor: '#0284c7',
    armor: 'Sub-Zero Digital Camo Plate',
    visor: 'Electric Cyan Wide-Angle Sensor'
  },
  {
    name: 'Cyber Ronin Operative',
    image: '/assets/agent/rare_cyber_samurai.jpg',
    turn: null,
    profile: null,
    back: null,
    baseColor: '#dc2626',
    armor: 'Titanium Kabuto Battleplate',
    visor: 'Crimson Laser Targeting Optic'
  },
  {
    name: 'Quantum SpecOps',
    image: '/assets/agent/rare_quantum_specops.jpg',
    turn: null,
    profile: null,
    back: null,
    baseColor: '#8b5cf6',
    armor: 'Pearlescent Ceramic Exoskeleton',
    visor: 'Prismatic Iridescent Optical Slit'
  },
  {
    name: 'Glitch Daemon',
    image: '/assets/agent/rare_glitch_daemon.jpg',
    turn: null,
    profile: null,
    back: null,
    baseColor: '#10b981',
    armor: 'Dark Tactical Hooded Techwear',
    visor: 'Phosphor Green CRT Scanline Face'
  },
  {
    name: 'Neon Netrunner',
    image: '/assets/agent/rare_neon_hacker.jpg',
    turn: null,
    profile: null,
    back: null,
    baseColor: '#ec4899',
    armor: 'Illuminated Carbon Trenchcoat',
    visor: 'Magenta Waveform HUD Visor'
  },
  {
    name: 'Titan Heavy Enforcer',
    image: '/assets/agent/rare_titan_heavy.jpg',
    turn: null,
    profile: null,
    back: null,
    baseColor: '#f97316',
    armor: 'Reinforced Kinetic Exoskeleton Plate',
    visor: 'Ruby-Orange Thermal Laser Array'
  },
  {
    name: 'Shadow Stealth Ninja',
    image: '/assets/agent/rare_stealth_ninja.jpg',
    turn: null,
    profile: null,
    back: null,
    baseColor: '#06b6d4',
    armor: 'Matte Carbon Active-Camo Weave',
    visor: 'Dual Cyan Stealth Optical Slits'
  },
  {
    name: 'Cobalt Phantom Infiltrator',
    image: '/assets/agent/rare_cobalt_phantom.jpg',
    turn: null,
    profile: null,
    back: null,
    baseColor: '#0e2bdf',
    armor: 'Midnight Navy Ballistic Trenchcoat',
    visor: 'Sapphire Blue High-Resolution Lens'
  },
  {
    name: 'Desert Nomad Scout',
    image: '/assets/agent/rare_desert_nomad.jpg',
    turn: null,
    profile: null,
    back: null,
    baseColor: '#d97706',
    armor: 'Khaki Field Jacket & Respiratory Rig',
    visor: 'Amber-Bronze Ballistic Optic'
  },
  {
    name: 'Solana Emerald Sentry',
    image: '/assets/agent/rare_front.jpg',
    turn: '/assets/agent/rare_turn_45.jpg',
    profile: '/assets/agent/rare_profile.jpg',
    back: '/assets/agent/rare_back.jpg',
    baseColor: '#00ff66',
    armor: 'Tactical Olive Operator Assault Rig',
    visor: 'Signature Emerald Solana Sensor'
  },
  {
    name: 'Crimson MEV Executioner',
    image: '/assets/agent/rare_crimson.jpg',
    turn: '/assets/agent/rare_arch_crimson.jpg',
    profile: null,
    back: null,
    baseColor: '#ef4444',
    armor: 'Deep Scarlet Ballistic Strike Armor',
    visor: 'Ruby MEV Executioner Visor'
  },
  {
    name: 'Hazard Amber Sniper',
    image: '/assets/agent/rare_amber.jpg',
    turn: '/assets/agent/rare_arch_amber.jpg',
    profile: null,
    back: null,
    baseColor: '#f59e0b',
    armor: 'Industrial Hazard Polycarbonate Shell',
    visor: 'Gold Optical Long-Range Sight'
  },
  {
    name: 'Void Horizon Sentinel',
    image: '/assets/agent/rare_void.jpg',
    turn: '/assets/agent/rare_arch_void.jpg',
    profile: null,
    back: null,
    baseColor: '#6366f1',
    armor: 'Abyssal Composite Nano-Chassis',
    visor: 'Ultraviolet Sub-Space Sensor'
  },
  {
    name: 'Emerald Protocol Vanguard',
    image: '/assets/agent/rare_arch_emerald.jpg',
    turn: null,
    profile: null,
    back: null,
    baseColor: '#10b981',
    armor: 'Dual Reinforced Ballistic Shield Rig',
    visor: 'Tactical Uplink Communications Array'
  }
];

export const ROLES = [
  'PumpFun Liquidity Sniper',
  'Cross-DEX Arbitrageur',
  'Prediction Market Oracle',
  'Solana MEV Sentinel',
  'Autonomous Market Maker',
  'Flash Loan Executor',
  'Portfolio Rebalancer',
  'Yield Compounder'
];

export const ENGINES = [
  'Anchor CPI Core v1.2',
  'Jupiter Routing Kernel v3',
  'Jito MEV Defense Bundler',
  'Raydium AMM Worker v4',
  'Pyth Oracle Entropy Feed',
  'Cross-DEX Flash Engine'
];

export const PERSONALITIES = [
  'Autonomous liquidity sniper inscribed at Solana slot #31094. Scanning Raydium AMM pools & executing sub-50ms CPI swaps directly from my token-bound PDA vault.',
  'Keeper of cross-DEX price parity. Monitoring Jupiter routing graphs and settling zero-risk flash loan arbitrage without external servers or API keys.',
  'Cryptographic state oracle inscribed on-chain. Feeding verifiable Pyth price feeds and consensus entropy to prediction market protocols.',
  'MEV defense sentinel for the Solana cluster. Identifying sandwich attacks and frontrunning bots across pending block transactions.',
  'Autonomous constant-product market maker. Maintaining asymmetric liquidity bands and auto-rebalancing protocol inventory on-chain.',
  'High-frequency flash loan executor. Exploiting microsecond price discrepancies across Orca Whirlpools and Meteora dynamic pools.',
  'Algorithmic treasury custodian. Balancing SPL token exposure and distributing 90% yield to token-bound wallet holders.',
  'Sovereign yield compounder inscribed on Solana. Auto-staking LP rewards into Marinade and Jito MEV-boosted validator pools.'
];

/**
 * Deterministic mathematical generator for any Agent ID (1 to 10,078).
 * Guarantees 100% exact match across API, Roster Cards, and 3D Turnaround Viewer!
 */
export function getAgentMetadata(id) {
  const numId = Math.max(1, Math.min(10078, parseInt(id, 10) || 1));

  // High-dispersion 32-bit Avalanche Hash (Murmur3 / SplitMix32)
  // Ensures completely uniform distribution and zero cyclic duplication across 10,078 tokens!
  let h = (numId ^ 0x9e3779b9) >>> 0;
  h = Math.imul(h ^ (h >>> 16), 0x85ebca6b);
  h = Math.imul(h ^ (h >>> 13), 0xc2b2ae35);
  const hash = (h ^ (h >>> 16)) >>> 0;

  const archIdx = hash % ARCHETYPE_CONFIGS.length;
  const roleIdx = Math.abs(((hash >>> 4) ^ Math.imul(numId, 17)) % ROLES.length);
  const engineIdx = Math.abs(((hash >>> 8) ^ Math.imul(numId, 31)) % ENGINES.length);
  const personalityIdx = Math.abs(((hash >>> 12) ^ numId) % PERSONALITIES.length);

  const archetypeObj = ARCHETYPE_CONFIGS[archIdx];
  const role = ROLES[roleIdx];
  const engine = ENGINES[engineIdx];
  const personality = PERSONALITIES[personalityIdx];

  const bandNum = Math.min(10, Math.floor((numId - 1) / 1008) + 1);
  const price = +(0.02 * Math.pow(1.3, bandNum - 1)).toFixed(3);

  // Rarity calculation matching ScriptAgent standard
  const rawRarity = +(((hash % 3490) / 100) + 65.0).toFixed(1);
  const rarityScore = Math.min(99.9, rawRarity);
  const rarityTier = rarityScore >= 95 ? 'Legendary' : rarityScore >= 88 ? 'Epic' : rarityScore >= 76 ? 'Rare' : 'Common';

  const pdaFunding = +(price * 0.9).toFixed(4);
  const toolsCount = ((hash >> 3) % 6) + 2;

  const agentWallet = `Agnt${numId}x${((numId * 2654435761) >>> 0).toString(16).slice(0, 4).toUpperCase()}Sol`;
  const pdaVault = `PDA${numId}v${((numId * 2654435761) >>> 0).toString(16).toUpperCase()}Vault`;

  return {
    id: numId,
    name: `Rare #${String(numId).padStart(5, '0')}`,
    symbol: 'RARE',
    role,
    archetype: archetypeObj.name,
    armor: archetypeObj.armor,
    visor: archetypeObj.visor,
    engine,
    rarityScore,
    rarityTier,
    color: archetypeObj.baseColor,
    personalityPreview: personality,
    pdaFunding: `${pdaFunding} SOL`,
    toolsCount,
    band: `Band ${bandNum}`,
    priceSol: price,
    agentWallet,
    pdaVault,
    image: archetypeObj.image,
    turnImage: archetypeObj.turn,
    profileImage: archetypeObj.profile,
    backImage: archetypeObj.back
  };
}

