import fs from 'fs';
import path from 'path';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const numId = parseInt(id, 10) || 1;
    const { searchParams } = new URL(request.url);
    const angleParam = searchParams.get('angle');

    // Available high-res 3D master artwork renders
    const assetDir = path.join(process.cwd(), 'public', 'assets', 'agent');
    
    let targetFile = 'rare_front.jpg';
    if (angleParam === '45') {
      targetFile = 'rare_turn_45.jpg';
    } else if (angleParam === '90') {
      targetFile = 'rare_profile.jpg';
    } else if (angleParam === '180') {
      targetFile = 'rare_back.jpg';
    } else {
      // Deterministic angle based on agent ID so each agent has a unique showcase angle
      const variants = ['rare_front.jpg', 'rare_turn_45.jpg', 'rare_profile.jpg', 'rare_front.jpg'];
      targetFile = variants[numId % variants.length];
    }

    const filePath = path.join(assetDir, targetFile);
    if (fs.existsSync(filePath)) {
      const buffer = fs.readFileSync(filePath);
      return new Response(buffer, {
        headers: {
          'Content-Type': 'image/jpeg',
          'Cache-Control': 'public, max-age=31536000, immutable'
        }
      });
    }

    // Fallback if file not found
    return new Response('Asset not found', { status: 404 });

  } catch (err) {
    return new Response(`Error: ${err.message}`, { status: 500 });
  }
}
