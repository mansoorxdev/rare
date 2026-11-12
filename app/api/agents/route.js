import { NextResponse } from 'next/server';
import { getAgentMetadata } from '../../../lib/agentMetadata';

let cachedManifest = null;

function getManifest() {
  if (cachedManifest) return cachedManifest;

  cachedManifest = Array.from({ length: 10078 }, (_, i) => {
    return getAgentMetadata(i + 1);
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
