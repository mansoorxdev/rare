'use client';

import React, { useEffect, useRef, useState } from 'react';

/**
 * 16 UNIQUE MASTER ARCHETYPE ASSETS
 * Every single agent ID (1 to 10,078) maps to its distinct high-res character artwork.
 * When the user selects Rare #174, Rare #52, or clicks any agent in the roster,
 * the hero viewer IMMEDIATELY displays that selected agent's NFT!
 */
const ARCHETYPE_ASSETS = [
  { id: 0,  name: 'Arctic Ghost Oracle',        front: '/assets/agent/rare_arctic.jpg',         turn: '/assets/agent/rare_turn_45.jpg', profile: '/assets/agent/rare_profile.jpg', back: '/assets/agent/rare_back.jpg' },
  { id: 1,  name: 'Solana Emerald Sentry',      front: '/assets/agent/rare_front.jpg',          turn: '/assets/agent/rare_turn_45.jpg', profile: '/assets/agent/rare_profile.jpg', back: '/assets/agent/rare_back.jpg' },
  { id: 2,  name: 'Crimson MEV Executioner',    front: '/assets/agent/rare_crimson.jpg',        turn: '/assets/agent/rare_turn_45.jpg', profile: '/assets/agent/rare_profile.jpg', back: '/assets/agent/rare_back.jpg' },
  { id: 3,  name: 'Hazard Amber Sniper',        front: '/assets/agent/rare_amber.jpg',          turn: '/assets/agent/rare_turn_45.jpg', profile: '/assets/agent/rare_profile.jpg', back: '/assets/agent/rare_back.jpg' },
  { id: 4,  name: 'Void Syndicate Sentinel',    front: '/assets/agent/rare_void.jpg',           turn: '/assets/agent/rare_turn_45.jpg', profile: '/assets/agent/rare_profile.jpg', back: '/assets/agent/rare_back.jpg' },
  { id: 5,  name: 'Cobalt Phantom Infiltrator', front: '/assets/agent/rare_cobalt_phantom.jpg', turn: '/assets/agent/rare_turn_45.jpg', profile: '/assets/agent/rare_profile.jpg', back: '/assets/agent/rare_back.jpg' },
  { id: 6,  name: 'Desert Nomad Scout',         front: '/assets/agent/rare_desert_nomad.jpg',   turn: '/assets/agent/rare_turn_45.jpg', profile: '/assets/agent/rare_profile.jpg', back: '/assets/agent/rare_back.jpg' },
  { id: 7,  name: 'Cyber Ronin Operative',      front: '/assets/agent/rare_cyber_samurai.jpg',  turn: '/assets/agent/char_cyber_ronin.jpg', profile: '/assets/agent/rare_profile.jpg', back: '/assets/agent/rare_back.jpg' },
  { id: 8,  name: 'Neon Netrunner',             front: '/assets/agent/rare_neon_hacker.jpg',    turn: '/assets/agent/char_neon_netrunner.jpg', profile: '/assets/agent/rare_profile.jpg', back: '/assets/agent/rare_back.jpg' },
  { id: 9,  name: 'Glitch Daemon',              front: '/assets/agent/rare_glitch_daemon.jpg',  turn: '/assets/agent/char_crt_daemon.jpg', profile: '/assets/agent/rare_profile.jpg', back: '/assets/agent/rare_back.jpg' },
  { id: 10, name: 'Titan Heavy Enforcer',       front: '/assets/agent/rare_titan_heavy.jpg',    turn: '/assets/agent/char_heavy_enforcer.jpg', profile: '/assets/agent/rare_profile.jpg', back: '/assets/agent/rare_back.jpg' },
  { id: 11, name: 'Shadow Stealth Ninja',       front: '/assets/agent/rare_stealth_ninja.jpg',  turn: '/assets/agent/char_ghost_recon.jpg', profile: '/assets/agent/rare_profile.jpg', back: '/assets/agent/rare_back.jpg' },
  { id: 12, name: 'Quantum SpecOps',            front: '/assets/agent/rare_quantum_specops.jpg',turn: '/assets/agent/rare_turn_45.jpg', profile: '/assets/agent/rare_profile.jpg', back: '/assets/agent/rare_back.jpg' },
  { id: 13, name: 'Autonomous Android Sentry',  front: '/assets/agent/char_android_sentry.jpg', turn: '/assets/agent/rare_turn_45.jpg', profile: '/assets/agent/rare_profile.jpg', back: '/assets/agent/rare_back.jpg' },
  { id: 14, name: 'Heavy Protocol Enforcer',    front: '/assets/agent/char_heavy_enforcer.jpg', turn: '/assets/agent/rare_titan_heavy.jpg', profile: '/assets/agent/rare_profile.jpg', back: '/assets/agent/rare_back.jpg' },
  { id: 15, name: 'Synthetic Netrunner Daemon', front: '/assets/agent/char_neon_netrunner.jpg', turn: '/assets/agent/rare_neon_hacker.jpg', profile: '/assets/agent/rare_profile.jpg', back: '/assets/agent/rare_back.jpg' },
];

export default function Agent360Viewer({ agentId = 1, price = 0.02 }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  const num = parseInt(agentId, 10) || 1;
  const currentArchetype = ARCHETYPE_ASSETS[num % ARCHETYPE_ASSETS.length];

  // Physics & Animation state kept in refs (ZERO React re-renders during 60FPS animation)
  const stateRef = useRef({
    angle: 0,             // 0 to 360 continuous
    velocity: 0,          // Drag momentum
    isDragging: false,
    startX: 0,
    lastX: 0,
    lastTime: 0,
    isAutoSpin: true,
    loadedImages: {},
    activeArchetype: currentArchetype,
  });

  const [angleDisplay, setAngleDisplay] = useState(0);
  const [isAutoSpin, setIsAutoSpin] = useState(true);

  // Update active archetype whenever agentId prop changes
  useEffect(() => {
    stateRef.current.activeArchetype = currentArchetype;
    // Preload front image for the newly selected agent
    const img = new Image();
    img.src = currentArchetype.front;
    img.onload = () => {
      stateRef.current.loadedImages[currentArchetype.front] = img;
    };
  }, [currentArchetype]);

  // Preload base turn assets into memory
  useEffect(() => {
    const urls = [
      currentArchetype.front,
      currentArchetype.turn,
      currentArchetype.profile,
      currentArchetype.back,
      '/assets/agent/rare_front.jpg',
      '/assets/agent/rare_turn_45.jpg',
      '/assets/agent/rare_profile.jpg',
      '/assets/agent/rare_back.jpg',
    ];

    urls.forEach((url) => {
      if (!url) return;
      const img = new Image();
      img.src = url;
      img.onload = () => {
        stateRef.current.loadedImages[url] = img;
      };
    });
  }, [currentArchetype]);

  // 60FPS Canvas Render Loop
  useEffect(() => {
    let animId;
    let lastStamp = performance.now();
    let displayThrottle = 0;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });

    const render = (stamp) => {
      const dt = Math.min((stamp - lastStamp) / 1000, 0.1);
      lastStamp = stamp;
      const state = stateRef.current;

      // 1. Motion & Physics
      if (state.isDragging) {
        // Dragged directly in pointer move
      } else if (state.isAutoSpin) {
        state.angle = (state.angle + dt * 26) % 360;
        if (state.angle < 0) state.angle += 360;
      } else if (Math.abs(state.velocity) > 0.05) {
        state.angle = (state.angle + state.velocity) % 360;
        if (state.angle < 0) state.angle += 360;
        state.velocity *= 0.93; // Smooth damping
      } else {
        state.velocity = 0;
      }

      // Throttle degree readout
      displayThrottle += dt;
      if (displayThrottle > 0.1) {
        displayThrottle = 0;
        setAngleDisplay(Math.round(state.angle));
      }

      // 2. High-DPI Canvas Sizing
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);

      // Clean Parchment Studio Canvas
      ctx.fillStyle = '#fcfaf4';
      ctx.fillRect(0, 0, width, height);

      // 3. Aspect-Preserving Character Rendering (PERFECT HEAD-TO-TOE FIT)
      const imgAspect = 896 / 1200; // 0.7466
      const canvasAspect = width / height;

      let drawW, drawH;
      if (canvasAspect > imgAspect) {
        // Fit to 90% of height so head and feet have comfortable breathing room
        drawH = height * 0.90;
        drawW = drawH * imgAspect;
      } else {
        drawW = width * 0.90;
        drawH = drawW / imgAspect;
      }

      const drawX = (width - drawW) / 2;
      const drawY = (height - drawH) / 2;

      // 4. Determine Active Viewing Angle for Current Selected Agent
      const normAngle = ((state.angle % 360) + 360) % 360;
      const sector = Math.floor(((normAngle + 22.5) % 360) / 45) % 8;
      
      const arch = state.activeArchetype || currentArchetype;
      let targetSrc = arch.front;
      let flip = false;

      if (sector === 0) {
        // Front (0°)
        targetSrc = arch.front;
        flip = false;
      } else if (sector === 1) {
        // Quarter Right (45°)
        targetSrc = arch.turn || arch.front;
        flip = false;
      } else if (sector === 2) {
        // Profile Right (90°)
        targetSrc = arch.profile || arch.turn || arch.front;
        flip = false;
      } else if (sector === 3) {
        // Rear-Quarter Right (135°)
        targetSrc = arch.back || arch.profile;
        flip = false;
      } else if (sector === 4) {
        // Back (180°)
        targetSrc = arch.back || arch.front;
        flip = false;
      } else if (sector === 5) {
        // Rear-Quarter Left (225°)
        targetSrc = arch.back || arch.profile;
        flip = true;
      } else if (sector === 6) {
        // Profile Left (270°)
        targetSrc = arch.profile || arch.turn || arch.front;
        flip = true;
      } else if (sector === 7) {
        // Quarter Left (315°)
        targetSrc = arch.turn || arch.front;
        flip = true;
      }

      const img = state.loadedImages[targetSrc] || state.loadedImages[arch.front] || state.loadedImages['/assets/agent/rare_front.jpg'];

      // Procedural colorway filter so each agent ID has a unique distinct visor/armor tint
      const hue = Math.round((num * 137.508) % 360);
      const sat = 100 + ((num * 7) % 25);
      const contrast = 100 + ((num * 3) % 15);
      const dynamicFilter = `hue-rotate(${hue}deg) saturate(${sat}%) contrast(${contrast}%)`;

      if (img && img.complete && img.naturalWidth > 0) {
        ctx.save();
        ctx.filter = dynamicFilter;

        if (flip) {
          const centerX = drawX + drawW / 2;
          ctx.translate(centerX, 0);
          ctx.scale(-1, 1);
          ctx.translate(-centerX, 0);
        }

        ctx.drawImage(img, drawX, drawY, drawW, drawH);
        ctx.restore();
      }

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [currentArchetype]);

  // Pointer Drag Handlers
  const handlePointerDown = (e) => {
    const state = stateRef.current;
    state.isDragging = true;
    state.isAutoSpin = false;
    setIsAutoSpin(false);
    state.velocity = 0;

    const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    state.startX = clientX;
    state.lastX = clientX;
    state.lastTime = performance.now();

    if (e.currentTarget.setPointerCapture && e.pointerId !== undefined) {
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch (err) {}
    }
  };

  const handlePointerMove = (e) => {
    const state = stateRef.current;
    if (!state.isDragging) return;

    const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const now = performance.now();
    const deltaX = clientX - state.lastX;
    const dt = Math.max(1, now - state.lastTime);

    // 0.65 deg per pixel sensitivity
    state.angle = (state.angle - deltaX * 0.65) % 360;
    if (state.angle < 0) state.angle += 360;

    // Inertia release momentum
    state.velocity = -(deltaX / dt) * 9.0;
    state.velocity = Math.max(-14, Math.min(14, state.velocity));

    state.lastX = clientX;
    state.lastTime = now;
  };

  const handlePointerUp = (e) => {
    const state = stateRef.current;
    state.isDragging = false;
    if (e.currentTarget.releasePointerCapture && e.pointerId !== undefined) {
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch (err) {}
    }
  };

  const toggleSpin = (e) => {
    e.stopPropagation();
    const state = stateRef.current;
    state.isAutoSpin = !state.isAutoSpin;
    state.velocity = 0;
    setIsAutoSpin(state.isAutoSpin);
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Active Selected Agent Badge Bar */}
      <div className="w-full max-w-[460px] flex items-center justify-between pb-2 mb-2 border-b border-black/20 font-mono text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-[#10b981] inline-block shadow-[1px_1px_0px_#000]" />
          <span className="font-bold font-pixel text-xs text-[#0e2bdf]">
            RARE #{String(num).padStart(5, '0')}
          </span>
        </div>
        <span className="text-[11px] font-bold text-zinc-700 uppercase tracking-wide">
          {currentArchetype.name}
        </span>
      </div>

      {/* 3D Turntable Viewport */}
      <div
        ref={containerRef}
        className="relative w-full mx-auto select-none overflow-hidden cursor-grab active:cursor-grabbing touch-none flex items-center justify-center"
        style={{
          maxWidth: '460px',
          height: '520px',
          border: '2px solid var(--hair-dark)',
          boxShadow: '6px 6px 0px 0px var(--script-blue)',
          background: '#fcfaf4',
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        title="Drag to rotate 360° • Click to pause/spin"
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full block"
          style={{ width: '100%', height: '100%' }}
        />

        {/* Minimalist Obol-style Angle & Pause Control in bottom corner */}
        <div
          onClick={toggleSpin}
          className="absolute bottom-3 right-3 flex items-center gap-2 px-2.5 py-1 bg-white/90 border border-black text-[11px] font-mono cursor-pointer shadow-[2px_2px_0px_#000] hover:bg-[#0e2bdf] hover:text-white transition-colors"
        >
          <span className="font-bold tabular-nums">{angleDisplay}°</span>
          <span className="text-[10px] uppercase font-bold tracking-wider">{isAutoSpin ? 'pause' : 'spin'}</span>
        </div>
      </div>
    </div>
  );
}
