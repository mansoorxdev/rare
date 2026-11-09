import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

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
          '  inspect <id>  - Inspect agent metadata, role, and bound PDA vault',
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
      const id = parts[1] || '1';
      const metadataPath = path.join(process.cwd(), 'data', 'metadata', `${id}.json`);

      if (fs.existsSync(metadataPath)) {
        const data = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
        const role = data.attributes.find(a => a.trait_type === 'Role')?.value || 'Autonomous Bot';
        const wallet = data.attributes.find(a => a.trait_type === 'Agent Wallet')?.value || 'N/A';
        const pda = data.attributes.find(a => a.trait_type === 'Token-Bound PDA')?.value || 'N/A';
        const limit = data.attributes.find(a => a.trait_type === 'Daily Spend Limit')?.value || '0.50 SOL';

        return NextResponse.json({
          success: true,
          output: [
            `AGENT IDENTIFIER: ${data.name}`,
            `ROLE: ${role}`,
            `TOKEN-BOUND PDA VAULT: ${pda}`,
            `ACTIVE SIGNER WALLET: ${wallet}`,
            `DAILY SPEND BOUNDARY: ${limit}`,
            `STATUS: READY FOR CPI TRADING INSTRUCTIONS`
          ]
        });
      } else {
        return NextResponse.json({
          success: true,
          output: [`Agent #${id} not found in collection directory.`]
        });
      }
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
      return NextResponse.json({
        success: true,
        output: [
          'TOTAL SUPPLY: 10,078',
          'CURRENT BONDING BAND: 1 / 10',
          'BAND BASE PRICE: 0.020 SOL',
          'REMAINING IN BAND 1: 865 AGENTS'
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

