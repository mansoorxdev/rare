import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Cached manifest in memory to avoid reading disk on every request
let cachedManifest = null;

function getManifest() {
  if (cachedManifest) return cachedManifest;

  try {
    const manifestPath = path.join(process.cwd(), 'data', 'collection_manifest.json');
    if (fs.existsSync(manifestPath)) {
      const raw = fs.readFileSync(manifestPath, 'utf8');
      cachedManifest = JSON.parse(raw);
      return cachedManifest;
    }
  } catch (e) {
    console.error('Manifest read error, generating fallback:', e);
  }

  // Fallback generator for all 10,078 agents if file is missing in cloud
  const roles = [
    'PumpFun Liquidity Sniper',
    'DeFi Arbitrageur',
    'Prediction Market Oracle',
    'Memecoin Momentum Tracker',
    'Jupiter Routing Optimizer',
    'Autonomous Sentry',
    'Flash Loan Arbitrageur',
    'Solana MEV Sentinel'
  ];

  cachedManifest = Array.from({ length: 10078 }, (_, i) => {
    const id = i + 1;
    const role = roles[i % roles.length];
    const band = Math.min(10, Math.floor(i / 1008) + 1);
    return {
      id,
      name: `Rare #${String(id).padStart(5, '0')}`,
      symbol: 'RARE',
      role,
      band: `Band ${band}`,
      priceSol: +(0.02 * Math.pow(1.3, band - 1)).toFixed(3),
      agentWallet: `Agnt${id}x${Math.random().toString(36).substring(2, 6).toUpperCase()}Sol`,
      pdaVault: `PDA${id}v${Math.random().toString(36).substring(2, 6).toUpperCase()}Vault`,
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
