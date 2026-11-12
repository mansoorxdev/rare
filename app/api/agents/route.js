import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

let cachedManifest = null;

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

const models = [
  'SmolLM2-135M-Instruct',
  'GPT-4o-Mini-Distill',
  'Qwen-2.5-0.5B-Coder',
  'Claude-3.5-Haiku-Edge',
  'DeepSeek-R1-Distill-1.5B',
  'Llama-3.2-1B-Quantized'
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
    
    const baseModel = models[id % models.length];
    const personality = personalities[id % personalities.length];
    const totalChunks = ((id * 23) % 280) + 110;
    const toolsCount = ((id * 3) % 6) + 2;

    const agentWallet = `Agnt${id}x${((id * 2654435761) >>> 0).toString(16).slice(0, 4).toUpperCase()}Sol`;
    const pdaVault = `PDA${id}v${((id * 2654435761) >>> 0).toString(16).toUpperCase()}Vault`;

    return {
      id,
      name: `Rare #${String(id).padStart(5, '0')}`,
      symbol: 'RARE',
      role,
      archetype: archetypes[id % archetypes.length],
      baseModel,
      rarityScore,
      rarityTier,
      personalityPreview: personality,
      totalChunks,
      toolsCount,
      band: `Band ${bandNum}`,
      priceSol: price,
      agentWallet,
      pdaVault,
      image: `/api/avatar/${id}`
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
    const model = (searchParams.get('model') || '').toLowerCase().trim();

    const allAgents = getManifest();
    let filtered = allAgents;

    if (search) {
      filtered = filtered.filter(a =>
        a.id.toString() === search ||
        a.name.toLowerCase().includes(search) ||
        a.role.toLowerCase().includes(search) ||
        a.archetype.toLowerCase().includes(search) ||
        a.baseModel.toLowerCase().includes(search)
      );
    }

    if (role && role !== 'all') {
      filtered = filtered.filter(a => a.role.toLowerCase().includes(role));
    }

    if (band && band !== 'all') {
      filtered = filtered.filter(a => a.band.toLowerCase().includes(band));
    }

    if (model && model !== 'all') {
      filtered = filtered.filter(a => a.baseModel.toLowerCase().includes(model));
    }

    const totalCount = allAgents.length;
    const filteredCount = filtered.length;
    const paged = filtered.slice(offset, offset + limit);

    return NextResponse.json({
      success: true,
      totalCount,
      filteredCount,
      offset,
      limit,
      page: Math.floor(offset / limit) + 1,
      totalPages: Math.ceil(filteredCount / limit),
      agents: paged
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
