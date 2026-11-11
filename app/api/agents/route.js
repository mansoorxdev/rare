import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Cached manifest in memory to avoid reading disk on every request
let cachedManifest = null;

function getManifest() {
  if (cachedManifest) return cachedManifest;

  const archetypes = [
    'Arctic Ghost Oracle',
    'Solana Emerald Sentry',
    'Crimson MEV Executioner',
    'Hazard Amber Sniper',
    'Void Syndicate Sentinel',
    'Cobalt Phantom Infiltrator',
    'Desert Nomad Scout',
    'Cyber Ronin Operative',
    'Neon Netrunner',
    'Glitch Daemon',
    'Titan Heavy Enforcer',
    'Shadow Stealth Ninja',
    'Quantum SpecOps',
    'Studio Emerald Vanguard',
    'Studio Crimson Assassin',
    'Studio Sub-Zero Spectre'
  ];

  try {
    const manifestPath = path.join(process.cwd(), 'data', 'collection_manifest.json');
    if (fs.existsSync(manifestPath)) {
      const raw = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
      cachedManifest = raw.map((item, idx) => {
        const id = item.id || idx + 1;
        const bandNum = Math.min(10, Math.floor((id - 1) / 1008) + 1);
        const price = +(0.02 * Math.pow(1.3, bandNum - 1)).toFixed(3);
        const hue = Math.round((id * 137.508) % 360);
        let colorName = 'SOLANA MATRIX';
        let visorColor = '#00e65b';
        if (hue >= 15 && hue < 45) { visorColor = '#ff6b00'; colorName = 'HAZARD TANGERINE'; }
        else if (hue >= 45 && hue < 80) { visorColor = '#ffd000'; colorName = 'SOLAR GOLD'; }
        else if (hue >= 80 && hue < 140) { visorColor = '#00e65b'; colorName = 'SOLANA MATRIX'; }
        else if (hue >= 140 && hue < 190) { visorColor = '#00f0ff'; colorName = 'ARCTIC CYAN'; }
        else if (hue >= 190 && hue < 250) { visorColor = '#3b82f6'; colorName = 'COBALT BLUE'; }
        else if (hue >= 250 && hue < 290) { visorColor = '#a855f7'; colorName = 'VOID PURPLE'; }
        else if (hue >= 290 && hue < 330) { visorColor = '#ec4899'; colorName = 'SYNTH MAGENTA'; }
        else { visorColor = '#ff2a5f'; colorName = 'CRIMSON OVERDRIVE'; }

        return {
          id,
          name: item.name || `Rare #${String(id).padStart(5, '0')}`,
          symbol: 'RARE',
          role: item.role || 'DeFi Arbitrageur',
          archetype: archetypes[id % archetypes.length],
          band: `Band ${bandNum}`,
          priceSol: price,
          mk: ((id * 7) % 9) + 1,
          hue,
          visorColor,
          colorName,
          agentWallet: item.agentWallet || `Agnt${id}x${((id * 2654435761) >>> 0).toString(16).slice(0, 4).toUpperCase()}Sol`,
          pdaVault: item.pdaVault || `PDA${id}v${((id * 2654435761) >>> 0).toString(16).toUpperCase()}Vault`,
          image: `/api/avatar/${id}`
        };
      });
      return cachedManifest;
    }
  } catch (e) {
    console.error('Manifest read error, generating fallback:', e);
  }

  // Fallback generator for all 10,078 agents if file is missing in cloud
  const roles = [
    'PumpFun Liquidity Sniper',
    'Cross-DEX Arbitrageur',
    'Prediction Market Oracle',
    'Solana MEV Sentinel',
    'Autonomous Market Maker',
    'Flash Loan Executor',
    'Portfolio Rebalancer',
    'Yield Compounder',
    'Raydium Route Optimizer',
    'Jupiter Swap Arb',
    'Whale Tracker Node',
    'Governance Voting Agent',
    'Liquidity Vault Keeper',
    'Perp DEX Hedger',
    'Orderbook Market Maker',
    'Synthetic Asset Oracle'
  ];

  cachedManifest = Array.from({ length: 10078 }, (_, i) => {
    const id = i + 1;
    const role = roles[i % roles.length];
    const bandNum = Math.min(10, Math.floor(i / 1008) + 1);
    const price = +(0.02 * Math.pow(1.3, bandNum - 1)).toFixed(3);
    const hue = Math.round((id * 137.508) % 360);
    let colorName = 'SOLANA MATRIX';
    let visorColor = '#00e65b';
    if (hue >= 15 && hue < 45) { visorColor = '#ff6b00'; colorName = 'HAZARD TANGERINE'; }
    else if (hue >= 45 && hue < 80) { visorColor = '#ffd000'; colorName = 'SOLAR GOLD'; }
    else if (hue >= 80 && hue < 140) { visorColor = '#00e65b'; colorName = 'SOLANA MATRIX'; }
    else if (hue >= 140 && hue < 190) { visorColor = '#00f0ff'; colorName = 'ARCTIC CYAN'; }
    else if (hue >= 190 && hue < 250) { visorColor = '#3b82f6'; colorName = 'COBALT BLUE'; }
    else if (hue >= 250 && hue < 290) { visorColor = '#a855f7'; colorName = 'VOID PURPLE'; }
    else if (hue >= 290 && hue < 330) { visorColor = '#ec4899'; colorName = 'SYNTH MAGENTA'; }
    else { visorColor = '#ff2a5f'; colorName = 'CRIMSON OVERDRIVE'; }

    return {
      id,
      name: `Rare #${String(id).padStart(5, '0')}`,
      symbol: 'RARE',
      role,
      archetype: archetypes[id % archetypes.length],
      band: `Band ${bandNum}`,
      priceSol: price,
      mk: ((id * 7) % 9) + 1,
      hue,
      visorColor,
      colorName,
      agentWallet: `Agnt${id}x${((id * 2654435761) >>> 0).toString(16).slice(0, 4).toUpperCase()}Sol`,
      pdaVault: `PDA${id}v${((id * 2654435761) >>> 0).toString(16).toUpperCase()}Vault`,
      image: `/api/avatar/${id}`
    };
  });

  return cachedManifest;
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(100, parseInt(searchParams.get('limit') || '24', 10));
    const offset = parseInt(searchParams.get('offset') || '0', 10);
    const search = (searchParams.get('search') || '').trim().toLowerCase();
    const roleFilter = (searchParams.get('role') || '').trim().toLowerCase();
    const bandFilter = (searchParams.get('band') || '').trim();

    const allAgents = getManifest();
    let filtered = allAgents;

    if (search) {
      filtered = filtered.filter(a =>
        String(a.id) === search ||
        a.name.toLowerCase().includes(search) ||
        (a.role && a.role.toLowerCase().includes(search)) ||
        (a.agentWallet && a.agentWallet.toLowerCase().includes(search)) ||
        (a.pdaVault && a.pdaVault.toLowerCase().includes(search))
      );
    }

    if (roleFilter && roleFilter !== 'all') {
      filtered = filtered.filter(a => a.role && a.role.toLowerCase().includes(roleFilter));
    }

    if (bandFilter && bandFilter !== 'all') {
      filtered = filtered.filter(a => String(a.band).includes(bandFilter));
    }

    const totalCount = allAgents.length;
    const filteredCount = filtered.length;
    const paginated = filtered.slice(offset, offset + limit);

    return NextResponse.json({
      success: true,
      totalCount,
      filteredCount,
      offset,
      limit,
      page: Math.floor(offset / limit) + 1,
      totalPages: Math.ceil(filteredCount / limit),
      agents: paginated
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
