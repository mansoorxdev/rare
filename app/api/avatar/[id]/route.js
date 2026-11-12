import { NextResponse } from 'next/server';

const ARCHETYPE_IMAGES = [
  'rare_arctic.jpg',
  'rare_cyber_samurai.jpg',
  'rare_quantum_specops.jpg',
  'rare_glitch_daemon.jpg',
  'rare_neon_hacker.jpg',
  'rare_titan_heavy.jpg',
  'rare_stealth_ninja.jpg',
  'rare_cobalt_phantom.jpg',
  'rare_desert_nomad.jpg',
  'rare_front.jpg',
  'rare_crimson.jpg',
  'rare_amber.jpg',
  'char_android_sentry.jpg',
  'char_heavy_enforcer.jpg',
  'char_neon_netrunner.jpg',
  'char_cyber_ronin.jpg'
];

export async function GET(request, { params }) {
  try {
    const resolvedParams = params instanceof Promise ? await params : params;
    const id = parseInt(resolvedParams?.id || '1', 10) || 1;
    const targetFile = ARCHETYPE_IMAGES[id % ARCHETYPE_IMAGES.length];

    // Clean permanent redirect directly to the public static asset
    return NextResponse.redirect(new URL(`/assets/agent/${targetFile}`, request.url), 307);
  } catch (err) {
    return NextResponse.redirect(new URL('/assets/agent/rare_front.jpg', request.url), 307);
  }
}
