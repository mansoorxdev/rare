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
      // 16 distinct AAA studio full-body 3D cybernetic operative archetypes on solid #ece9e2 parchment canvas
      const archetypes = [
        'rare_arctic.jpg',         // 0: Arctic Ghost Oracle (Sub-Zero White Camo Gear, Cyan Visor)
        'rare_front.jpg',          // 1: Solana Emerald Sentry (Black Helmet, Emerald Visor, Olive Gear)
        'rare_crimson.jpg',        // 2: Crimson MEV Executioner (Dark Tactical Assault Jacket, Ruby Visor)
        'rare_amber.jpg',          // 3: Hazard Amber Sniper (Industrial Gold Optics, Hazard Jacket)
        'rare_void.jpg',           // 4: Void Syndicate Sentinel (Dark Matter Ultraviolet Visor, Obsidian Anorak)
        'rare_cobalt_phantom.jpg', // 5: Cobalt Phantom Infiltrator (Navy Trenchcoat, Sapphire Blue Visor)
        'rare_desert_nomad.jpg',   // 6: Desert Nomad Scout (Khaki Field Jacket, Amber-Bronze Visor)
        'rare_cyber_samurai.jpg',  // 7: Cyber Ronin Operative (Titanium Kabuto, Crimson Visor, Katana)
        'rare_neon_hacker.jpg',    // 8: Neon Netrunner (Magenta Waveform Visor, Illuminated Runes)
        'rare_glitch_daemon.jpg',  // 9: Glitch Daemon (Hooded Cyber Operative with Green Phosphor CRT Head)
        'rare_titan_heavy.jpg',    // 10: Titan Heavy Enforcer (Reinforced Blast Armor, Ruby-Orange Laser)
        'rare_stealth_ninja.jpg',  // 11: Shadow Stealth Ninja (Matte Carbon Helmet, Dual Cyan Slits)
        'rare_quantum_specops.jpg',// 12: Quantum SpecOps (Pearlescent Ceramic Armor, Prismatic Visor)
        'rare_arch_emerald.jpg',   // 13: Studio Emerald Vanguard (High-contrast emerald optic)
        'rare_arch_crimson.jpg',   // 14: Studio Crimson Assassin (Deep scarlet assault rig)
        'rare_arch_arctic.jpg',    // 15: Studio Sub-Zero Spectre (Frost white tactical plate)
      ];
      targetFile = archetypes[numId % archetypes.length];
    }

    const filePath = path.join(assetDir, targetFile);
    if (fs.existsSync(filePath)) {
      const buffer = fs.readFileSync(filePath);
      return new Response(buffer, {
        headers: {
          'Content-Type': 'image/jpeg',
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
      });
    }

    // Redirect to public asset directly as fallback
    return Response.redirect(new URL(`/assets/agent/${targetFile}`, request.url));

  } catch (err) {
    return new Response(`Error: ${err.message}`, { status: 500 });
  }
}
