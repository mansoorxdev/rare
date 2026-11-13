import { NextResponse } from 'next/server';
import { getAgentMetadata } from '../../../lib/agentMetadata';

export async function POST(request) {
  try {
    const body = await request.json();
    const command = (body.command || '').trim().toLowerCase();

    if (!command) {
      return NextResponse.json({ success: false, output: 'Empty command.' });
    }

    if (command === 'help') {
      return NextResponse.json({
        success: true,
        output: [
          'AVAILABLE RARE PROTOCOL COMMANDS:',
          '  status        - Check Solana cluster health and agent supply',
          '  inspect <id>  - Inspect agent metadata, role, engine and bound PDA vault',
          '  split         - Display on-chain 90/10 capital routing parameters',
          '  supply        - Total supply metrics and bonding band status',
          '  clear         - Clear terminal buffer'
        ]
      });
    }

    if (command === 'status') {
      return NextResponse.json({
        success: true,
        output: [
          'CLUSTER: Solana Mainnet-Beta (Cluster v1.18.26)',
          'SMART CONTRACT: Anchor Program [Rare111111111111111111111111111111111111111]',
          'TOTAL AGENTS: 10,078 Autonomous AI Entities',
          'ACTIVE PDA VAULTS: 142 Bound & Operational',
          'AVG TRANSACTION FEE: 0.000005 SOL'
        ]
      });
    }

    if (command.startsWith('inspect')) {
      const parts = command.split(' ');
      const rawId = parseInt(parts[1] || '1', 10);
      if (isNaN(rawId) || rawId < 1 || rawId > 10078) {
        return NextResponse.json({
          success: false,
          output: ['Invalid Agent ID. Please specify a number between 1 and 10,078 (e.g., inspect 2).']
        });
      }

      const agent = getAgentMetadata(rawId);

      return NextResponse.json({
        success: true,
        output: [
          `AGENT IDENTIFIER: ${agent.name}`,
          `ARCHETYPE: ${agent.archetype}`,
          `ROLE: ${agent.role}`,
          `ENGINE: ${agent.engine}`,
          `TOKEN-BOUND PDA VAULT: ${agent.pdaVault}`,
          `ACTIVE SIGNER WALLET: ${agent.agentWallet}`,
          `PDA CAPITAL ALLOCATION: ${agent.pdaFunding}`,
          `RARITY TIER: ${agent.rarityTier} (${agent.rarityScore}%)`,
          `BONDING BAND: ${agent.band} (${agent.priceSol} SOL)`,
          `STATUS: READY FOR CPI TRADING INSTRUCTIONS`
        ]
      });
    }

    if (command === 'split') {
      const treasury = process.env.NEXT_PUBLIC_TREASURY_WALLET || '3ivjUQCmaykSnGeCkuy8yViw82umrfDCmXkxtWSeqyEk';
      return NextResponse.json({
        success: true,
        output: [
          'ON-CHAIN CAPITAL SPLIT ATOMIC RULE:',
          '  - 90% (9,000 BPS) -> Transferred directly to Agent PDA Vault',
          '  - 10% (1,000 BPS) -> Transferred directly to Protocol Treasury',
          `  - Treasury Destination: ${treasury}`,
          '  - Zero intermediate custody by mint contract.'
        ]
      });
    }

    if (command === 'supply') {
      const sold = 143;
      const band = Math.min(10, Math.floor(sold / 1008) + 1);
      const remainingInBand = 1008 - (sold % 1008);
      const bandPrice = +(0.02 * Math.pow(1.3, band - 1)).toFixed(3);
      return NextResponse.json({
        success: true,
        output: [
          'TOTAL SUPPLY: 10,078',
          `CURRENT BONDING BAND: ${band} / 10`,
          `BAND BASE PRICE: ${bandPrice} SOL`,
          `CURRENT SOLD: ${sold} / 10,078`,
          `REMAINING IN BAND ${band}: ${remainingInBand} AGENTS`
        ]
      });
    }

    return NextResponse.json({
      success: false,
      output: [`Command '${command}' not recognized. Type 'help' for available commands.`]
    });

  } catch (err) {
    return NextResponse.json({ success: false, output: [`Error: ${err.message}`] }, { status: 500 });
  }
}
