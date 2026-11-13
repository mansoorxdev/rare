import { NextResponse } from 'next/server';
import { getAgentMetadata } from '../../../../lib/agentMetadata';

export async function GET(request, { params }) {
  try {
    const resolvedParams = params instanceof Promise ? await params : params;
    const id = parseInt(resolvedParams?.id || '1', 10) || 1;
    const agent = getAgentMetadata(id);

    return NextResponse.json({
      success: true,
      agentId: agent.id,
      metadata: {
        name: agent.name,
        symbol: agent.symbol,
        description: `Autonomous Solana Agent #${agent.id} [${agent.role} • ${agent.archetype}]. Bound to on-chain Token-Bound PDA vault (${agent.pdaVault}) with 90% capital split & autonomous execution engine (${agent.engine}).`,
        image: agent.image,
        attributes: [
          { trait_type: 'Archetype', value: agent.archetype },
          { trait_type: 'Role', value: agent.role },
          { trait_type: 'Execution Engine', value: agent.engine },
          { trait_type: 'Armor', value: agent.armor },
          { trait_type: 'Visor Optic', value: agent.visor },
          { trait_type: 'Rarity Tier', value: agent.rarityTier },
          { trait_type: 'Rarity Score', value: `${agent.rarityScore}%` },
          { trait_type: 'Bonding Band', value: agent.band },
          { trait_type: 'Mint Price', value: `${agent.priceSol} SOL` },
          { trait_type: 'PDA Capital', value: agent.pdaFunding },
          { trait_type: 'Token-Bound PDA', value: agent.pdaVault },
          { trait_type: 'Signer Wallet', value: agent.agentWallet },
          { trait_type: 'Tools Count', value: agent.toolsCount },
          { trait_type: 'Status', value: 'Autonomous Active' }
        ],
        properties: {
          category: 'agent',
          files: [
            { uri: agent.image, type: 'image/jpeg' }
          ]
        }
      }
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
