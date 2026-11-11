import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request, { params }) {
  try {
    const resolvedParams = params instanceof Promise ? await params : params;
    const id = resolvedParams?.id || '1';
    const metadataPath = path.join(process.cwd(), 'data', 'metadata', `${id}.json`);

    if (fs.existsSync(metadataPath)) {
      const content = fs.readFileSync(metadataPath, 'utf8');
      const metadata = JSON.parse(content);
      return NextResponse.json({
        success: true,
        agentId: id,
        metadata
      });
    }

    // Dynamic deterministic metadata for all 10,078 agents (guaranteeing unique traits for every ID)
    const numId = parseInt(id, 10) || 1;
    const roles = [
      'PumpFun Liquidity Sniper',
      'DeFi Arbitrageur',
      'Prediction Market Oracle',
      'Solana MEV Sentinel',
      'Autonomous Market Maker',
      'Flash Loan Arbitrageur',
      'Portfolio Rebalancer',
      'Yield Compounder'
    ];
    const archetypes = [
      'Solana Emerald Sentry',
      'Crimson MEV Executioner',
      'Arctic Ghost Oracle',
      'Hazard Amber Sniper',
      'Void Syndicate Sentinel',
      'Studio Emerald SpecOps',
      'Studio Crimson Vanguard',
      'Studio Quantum Phantom',
      'Studio Hazard Striker',
      'Studio Obsidian Shadow'
    ];
    const casigns = [
      'Matte Obsidian',
      'Arctic Carbon Fiber',
      'Hazard High-Vis Kevlar',
      'Nano-Titanium Alloy',
      'Phantom Monolith Mesh',
      'Vintage Parchment 1984',
      'Transparent Glitch Smoke'
    ];
    const phosphors = [
      'Solana Matrix Emerald',
      'Crimson Overdrive',
      'Solar Gold',
      'Arctic Cyan',
      'Void Purple',
      'Cobalt Blue',
      'Hazard Tangerine',
      'Synth Magenta'
    ];

    const assignedRole = roles[numId % roles.length];
    const assignedArchetype = archetypes[numId % archetypes.length];
    const assignedCasing = casigns[numId % casigns.length];
    const assignedPhosphor = phosphors[numId % phosphors.length];
    const bandNum = Math.min(10, Math.floor((numId - 1) / 1008) + 1);
    const bandPrice = +(0.02 * Math.pow(1.3, bandNum - 1)).toFixed(3);
    const mk = ((numId * 7) % 9) + 1;
    const hue = Math.round((numId * 137.508) % 360);
    const pdaHash = ((numId * 2654435761) >>> 0).toString(16).toUpperCase();

    return NextResponse.json({
      success: true,
      agentId: id,
      metadata: {
        name: `RARE #${String(numId).padStart(5, '0')}`,
        symbol: "RARE",
        description: `Autonomous Solana Agent #${numId} [${assignedRole}]. Bound to an on-chain Token-Bound PDA vault with 90% capital split & autonomous DeFi execution capabilities.`,
        image: `/api/avatar/${numId}`,
        attributes: [
          { trait_type: "Archetype", value: assignedArchetype },
          { trait_type: "Role", value: assignedRole },
          { trait_type: "Model Mark", value: `MK-${mk}` },
          { trait_type: "Visor Phosphor", value: assignedPhosphor },
          { trait_type: "Outfit Hue", value: `${hue}° Spec` },
          { trait_type: "Armor Casing", value: assignedCasing },
          { trait_type: "Bonding Tier", value: `Band ${bandNum}` },
          { trait_type: "Mint Price", value: `${bandPrice} SOL` },
          { trait_type: "Daily Spend Limit", value: "0.50 SOL / Day" },
          { trait_type: "Token-Bound PDA", value: `PDA${numId}v${pdaHash}Vault` },
          { trait_type: "Execution Core", value: "Solana SVM-X Eliza" },
          { trait_type: "Status", value: "Autonomous Active" }
        ],
        properties: {
          category: "agent",
          files: [
            { uri: `/api/avatar/${numId}`, type: "image/jpeg" }
          ]
        }
      }
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
