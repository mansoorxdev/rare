import fs from 'fs';
import path from 'path';

export async function GET(request, { params }) {
  try {
    const resolvedParams = params instanceof Promise ? await params : params;
    const id = resolvedParams?.id || '1';
    const numId = parseInt(id, 10) || 1;
    const { searchParams } = new URL(request.url);
    const angleParam = searchParams.get('angle');

    // Available high-res 3D master artwork renders in public folder
    const assetDir = path.join(process.cwd(), 'public', 'assets', 'agent');
    
    let targetFile = 'rare_front.jpg';

    // If 360 turntable requests a specific rotation angle
    if (angleParam === '45') {
      targetFile = 'rare_turn_45.jpg';
    } else if (angleParam === '90') {
      targetFile = 'rare_profile.jpg';
    } else if (angleParam === '180') {
      targetFile = 'rare_back.jpg';
    } else {
      // 5 distinct front-facing 3D character archetypes with unique helmets, visors, and outfit colors
      const archetypes = [
        'rare_front.jpg',   // Solana Emerald Sentry (Black helmet, green visor, olive techwear)
        'rare_crimson.jpg', // Crimson MEV Executioner (Black helmet, ruby red visor, crimson bomber)
        'rare_arctic.jpg',  // Arctic Ghost Oracle (White helmet, cyan visor, white techwear parka)
        'rare_amber.jpg',   // Hazard Amber Sniper (Graphite helmet, gold visor, orange utility jacket)
        'rare_void.jpg',    // Void Syndicate Sentinel (Obsidian helmet, violet visor, purple anorak)
      ];
      targetFile = archetypes[numId % archetypes.length];
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

    // Redirect to public asset directly as fallback
    return Response.redirect(new URL(`/assets/agent/${targetFile}`, request.url));

  } catch (err) {
    return new Response(`Error: ${err.message}`, { status: 500 });
  }
}
