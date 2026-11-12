import { NextResponse } from 'next/server';

let cachedManifest = null;

const ARCHETYPE_CONFIGS = [
  {
    name: 'Arctic Ghost Oracle',
    image: '/assets/agent/rare_arctic.jpg',
    color: '#0284c7',
    description: 'Sub-zero white digital camo tactical operative with electric cyan sensor visor.'
  },
  {
    name: 'Cyber Ronin Operative',
    image: '/assets/agent/rare_cyber_samurai.jpg',
    color: '#dc2626',
    description: 'Titanium Kabuto helmet, reinforced cyber-armor plating, crimson tactical visor.'
  },
  {
    name: 'Quantum SpecOps',
    image: '/assets/agent/rare_quantum_specops.jpg',
    color: '#8b5cf6',
    description: 'Pearlescent ceramic blast armor with prismatic iridescent optical sensor array.'
  },
  {
    name: 'Glitch Daemon',
    image: '/assets/agent/rare_glitch_daemon.jpg',
    color: '#10b981',
    description: 'Dark tactical hooded techwear with glowing phosphor CRT head and scanlines.'
  },
  {
    name: 'Neon Netrunner',
    image: '/assets/agent/rare_neon_hacker.jpg',
    color: '#ec4899',
    description: 'Magenta waveform visor, tactical street techwear, illuminated cyber runes.'
  },
  {
    name: 'Titan Heavy Enforcer',
    image: '/assets/agent/rare_titan_heavy.jpg',
    color: '#f97316',
    description: 'Reinforced exoskeleton blast plate, ruby-orange targeting oculars, heavy kinetic rig.'
  },
  {
    name: 'Shadow Stealth Ninja',
    image: '/assets/agent/rare_stealth_ninja.jpg',
    color: '#06b6d4',
    description: 'Matte carbon tactical helmet, dual cyan optical slits, active optical camo.'
  },
  {
    name: 'Cobalt Phantom Infiltrator',
    image: '/assets/agent/rare_cobalt_phantom.jpg',
    color: '#0e2bdf',
    description: 'Midnight navy tactical trenchcoat, sapphire blue visor, silent stealth infiltrator.'
  },
  {
    name: 'Desert Nomad Scout',
    image: '/assets/agent/rare_desert_nomad.jpg',
    color: '#d97706',
    description: 'Khaki field jacket, respiratory ballistic filter mask, amber-bronze optics.'
  },
  {
    name: 'Solana Emerald Sentry',
    image: '/assets/agent/rare_front.jpg',
    color: '#00ff66',
    description: 'Tactical olive assault jacket, matte black operator helmet, emerald green visor.'
  },
  {
    name: 'Crimson MEV Executioner',
    image: '/assets/agent/rare_crimson.jpg',
    color: '#ef4444',
    description: 'Deep scarlet ballistic rig, ruby executioner visor, ultra-fast MEV bundle sniper.'
  },
  {
    name: 'Hazard Amber Sniper',
    image: '/assets/agent/rare_amber.jpg',
    color: '#f59e0b',
    description: 'Industrial gold optics, hazard assault jacket, long-range cross-DEX parity sniper.'
  },
  {
    name: 'Autonomous Android Sentry',
    image: '/assets/agent/char_android_sentry.jpg',
    color: '#10b981',
    description: 'Full titanium cybernetic chassis, integrated multi-spectrum targeting oculars.'
  },
  {
    name: 'Heavy Protocol Enforcer',
    image: '/assets/agent/char_heavy_enforcer.jpg',
    color: '#6366f1',
    description: 'Dual reinforced ballistic shield armor, high-altitude tactical communications rig.'
  },
  {
    name: 'Synthetic Netrunner Daemon',
    image: '/assets/agent/char_neon_netrunner.jpg',
    color: '#a855f7',
    description: 'Electric violet techwear suit with low-light night-vision oculars and data harness.'
  },
  {
    name: 'Cyber Ronin Vanguard',
    image: '/assets/agent/char_cyber_ronin.jpg',
    color: '#ef4444',
    description: 'Heavy cyber-samurai battleplate with battle-hardened reinforced shoulder armor.'
  }
];

const engines = [
  'Anchor CPI Core v1.2',
  'Jupiter Routing Kernel v3',
  'Jito MEV Defense Bundler',
  'Raydium AMM Worker v4',
  'Pyth Oracle Entropy Feed',
  'Cross-DEX Flash Engine'
];

const personalities = [
  'Autonomous liquidity sniper inscribed at Solana slot #31094. Scanning Raydium AMM pools & executing sub-50ms CPI swaps directly from my token-bound PDA vault.',
  'Keeper of cross-DEX price parity. Monitoring Jupiter routing graphs and settling zero-risk flash loan arbitrage without external servers or API keys.',
  'Cryptographic state oracle inscribed on-chain. Feeding verifiable Pyth price feeds and consensus entropy to prediction market protocols.',
  'MEV defense sentinel for the Solana cluster. Identifying sandwich attacks and frontrunning bots across pending block transactions.',
  'Autonomous constant-product market maker. Maintaining asymmetric liquidity bands and auto-rebalancing protocol inventory on-chain.',
  'High-frequency flash loan executor. Exploiting microsecond price discrepancies across Orca Whirlpools and Meteora dynamic pools.',
  'Algorithmic treasury custodian. Balancing SPL token exposure and distributing 90% yield to token-bound wallet holders.',
  'Sovereign yield compounder inscribed on Solana. Auto-staking LP rewards into Marinade and Jito MEV-boosted validator pools.'
];

function getManifest() {
  if (cachedManifest) return cachedManifest;

  const roles = [
    'PumpFun Liquidity Sniper',
    'Cross-DEX Arbitrageur',
    'Prediction Market Oracle',
    'Solana MEV Sentinel',
    'Autonomous Market Maker',
    'Flash Loan Executor',
    'Portfolio Rebalancer',
    'Yield Compounder'
  ];

  cachedManifest = Array.from({ length: 10078 }, (_, i) => {
    const id = i + 1;
    const role = roles[i % roles.length];
    const bandNum = Math.min(10, Math.floor(i / 1008) + 1);
    const price = +(0.02 * Math.pow(1.3, bandNum - 1)).toFixed(3);
    
    // Rarity calculation matching ScriptAgent standard
    const rawRarity = +(((id * 73 + 17) % 350) / 10 + 65).toFixed(1);
    const rarityScore = Math.min(99.9, rawRarity);
    const rarityTier = rarityScore >= 95 ? 'Legendary' : rarityScore >= 88 ? 'Epic' : rarityScore >= 76 ? 'Rare' : 'Common';
    
    const archetypeObj = ARCHETYPE_CONFIGS[id % ARCHETYPE_CONFIGS.length];
    const engine = engines[id % engines.length];
    const personality = personalities[id % personalities.length];
    const pdaFunding = +(price * 0.9).toFixed(4);
    const toolsCount = ((id * 3) % 6) + 2;

    const agentWallet = `Agnt${id}x${((id * 2654435761) >>> 0).toString(16).slice(0, 4).toUpperCase()}Sol`;
    const pdaVault = `PDA${id}v${((id * 2654435761) >>> 0).toString(16).toUpperCase()}Vault`;

    return {
      id,
      name: `Rare #${String(id).padStart(5, '0')}`,
      symbol: 'RARE',
      role,
      archetype: archetypeObj.name,
      engine,
      rarityScore,
      rarityTier,
      color: archetypeObj.color,
      personalityPreview: personality,
      pdaFunding: `${pdaFunding} SOL`,
      toolsCount,
      band: `Band ${bandNum}`,
      priceSol: price,
      agentWallet,
      pdaVault,
      image: archetypeObj.image // Direct static image for instant sub-millisecond serving!
    };
  });

  return cachedManifest;
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '16', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);
    const search = (searchParams.get('search') || '').toLowerCase().trim();
    const role = (searchParams.get('role') || '').toLowerCase().trim();
    const band = (searchParams.get('band') || '').toLowerCase().trim();
    const tier = (searchParams.get('tier') || '').toLowerCase().trim();

    const allAgents = getManifest();
    let filtered = allAgents;

    if (search) {
      filtered = filtered.filter(a =>
        a.id.toString() === search ||
        a.name.toLowerCase().includes(search) ||
        a.role.toLowerCase().includes(search) ||
        a.archetype.toLowerCase().includes(search) ||
        a.rarityTier.toLowerCase().includes(search)
      );
    }

    if (role && role !== 'all') {
      filtered = filtered.filter(a => a.role.toLowerCase().includes(role));
    }

    if (tier && tier !== 'all') {
      filtered = filtered.filter(a => a.rarityTier.toLowerCase() === tier);
    }

    if (band && band !== 'all') {
      filtered = filtered.filter(a => a.band.toLowerCase() === band);
    }

    const totalCount = allAgents.length;
    const filteredCount = filtered.length;
    const paginated = filtered.slice(offset, offset + limit);

    return NextResponse.json({
      success: true,
      totalCount,
      filteredCount,
      limit,
      offset,
      page: Math.floor(offset / limit) + 1,
      totalPages: Math.ceil(filteredCount / limit),
      agents: paginated
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
      }
    });

  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
