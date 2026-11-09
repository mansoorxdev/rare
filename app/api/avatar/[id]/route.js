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
    if (angleParam === '45') {
      targetFile = 'rare_turn_45.jpg';
    } else if (angleParam === '90') {
      targetFile = 'rare_profile.jpg';
    } else if (angleParam === '180') {
      targetFile = 'rare_back.jpg';
    } else {
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

    // Redirect to public asset directly as fallback
    return Response.redirect(new URL(`/assets/agent/${targetFile}`, request.url));

  } catch (err) {
    return new Response(`Error: ${err.message}`, { status: 500 });
  }
}
