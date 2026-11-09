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

    // Dynamic fallback metadata for Vercel edge deployment where local json files are gitignored
    const numId = parseInt(id, 10) || 1;
    const roles = ['Sniper', 'Arbitrageur', 'Oracle', 'Market Maker', 'Liquidator', 'Sentinel'];
    const assignedRole = roles[numId % roles.length];
    
    return NextResponse.json({
      success: true,
      agentId: id,
      metadata: {
        name: `RARE #${String(numId).padStart(5, '0')}`,
        symbol: "RARE",
        description: `Autonomous Solana Agent #${numId} [${assignedRole}]. Token-bound PDA execution vault with 90/10 capital split.`,
        image: `/api/avatar/${numId}`,
        attributes: [
          { trait_type: "Role", value: assignedRole },
          { trait_type: "Band", value: "Band 1" },
          { trait_type: "Security Protocol", value: "Anchor PDA v1.4" },
          { trait_type: "Status", value: "Autonomous Active" }
        ]
      }
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
