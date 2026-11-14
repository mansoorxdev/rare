import { generatePixelSVG } from '../../../../lib/pixelNftRenderer';

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  try {
    let rawId = params?.id || '1';
    rawId = rawId.replace(/\.svg$/, '');
    const numId = Math.max(1, Math.min(10078, parseInt(rawId, 10) || 1));

    const svg = generatePixelSVG(numId, 480);

    return new Response(svg, {
      status: 200,
      headers: {
        'Content-Type': 'image/svg+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (err) {
    return new Response('<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect fill="red" width="100" height="100"/></svg>', {
      status: 500,
      headers: { 'Content-Type': 'image/svg+xml' }
    });
  }
}
