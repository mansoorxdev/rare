import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const metadataPath = path.join(process.cwd(), 'data', 'metadata', `${id}.json`);

    if (!fs.existsSync(metadataPath)) {
      return NextResponse.json({ success: false, error: `Agent #${id} not found.` }, { status: 404 });
    }

    const content = fs.readFileSync(metadataPath, 'utf8');
    const metadata = JSON.parse(content);

    return NextResponse.json({
      success: true,
      agentId: id,
      metadata
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

