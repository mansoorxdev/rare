import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);
    const search = (searchParams.get('search') || '').toLowerCase();

    const manifestPath = path.join(process.cwd(), 'data', 'collection_manifest.json');
    
    if (!fs.existsSync(manifestPath)) {
      return NextResponse.json({ error: 'Manifest not found. Run generate_agents script first.' }, { status: 404 });
    }

    const rawData = fs.readFileSync(manifestPath, 'utf8');
    const allAgents = JSON.parse(rawData);

    let filtered = allAgents;
    if (search) {
      filtered = allAgents.filter(a => 
        a.name.toLowerCase().includes(search) || 
        a.role.toLowerCase().includes(search) ||
        a.agentWallet.toLowerCase().includes(search) ||
        a.pdaVault.toLowerCase().includes(search) ||
        String(a.id) === search
      );
    }

    const paginated = filtered.slice(offset, offset + limit);

    return NextResponse.json({
      success: true,
      totalCount: allAgents.length,
      filteredCount: filtered.length,
      offset,
      limit,
      agents: paginated
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

