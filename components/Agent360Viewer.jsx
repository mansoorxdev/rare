'use client';

import React, { useEffect, useRef, useState } from 'react';

/**
 * TURNTABLE FRAMES (896 x 1200 master studio 3D renders)
 * 8 discrete viewing angles in 360° space (0°, 45°, 90°, 135°, 180°, 225°, 270°, 315°).
 * Only ONE crisp frame is active at a time — ZERO ghosting, ZERO double exposure.
 */
const FRAME_CONFIGS = [
  { id: 0,   src: '/assets/agent/rare_front.jpg',   flip: false, label: 'FRONT 0°' },
  { id: 45,  src: '/assets/agent/rare_turn_45.jpg', flip: false, label: 'QUARTER 45°' },
  { id: 90,  src: '/assets/agent/rare_profile.jpg', flip: false, label: 'PROFILE 90°' },
  { id: 135, src: '/assets/agent/rare_back.jpg',    flip: false, label: 'REAR-Q 135°' },
  { id: 180, src: '/assets/agent/rare_back.jpg',    flip: false, label: 'REAR 180°' },
  { id: 225, src: '/assets/agent/rare_back.jpg',    flip: true,  label: 'REAR-Q 225°' },
  { id: 270, src: '/assets/agent/rare_profile.jpg', flip: true,  label: 'PROFILE 270°' },
  { id: 315, src: '/assets/agent/rare_turn_45.jpg', flip: true,  label: 'QUARTER 315°' },
];

export default function Agent360Viewer() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

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
    isReady: false,
  });

  const [angleDisplay, setAngleDisplay] = useState(0);
  const [isAutoSpin, setIsAutoSpin] = useState(true);

  // Preload all 4 master angle assets into memory
  useEffect(() => {
    const urls = [
      '/assets/agent/rare_front.jpg',
      '/assets/agent/rare_turn_45.jpg',
      '/assets/agent/rare_profile.jpg',
      '/assets/agent/rare_back.jpg',
    ];

    let loadedCount = 0;
    urls.forEach((url) => {
      const img = new Image();
      img.src = url;
      img.onload = () => {
        stateRef.current.loadedImages[url] = img;
        loadedCount += 1;
        if (loadedCount >= urls.length) {
          stateRef.current.isReady = true;
        }
      };
      img.onerror = () => {
        stateRef.current.loadedImages[url] = stateRef.current.loadedImages['/assets/agent/rare_front.jpg'] || img;
      };
    });
  }, []);

  // 60FPS Ultra-Smooth Canvas Render Loop
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
        // Smooth 26 deg/sec constant rotation
        state.angle = (state.angle + dt * 26) % 360;
        if (state.angle < 0) state.angle += 360;
      } else if (Math.abs(state.velocity) > 0.05) {
        // Inertia coasting
        state.angle = (state.angle + state.velocity) % 360;
        if (state.angle < 0) state.angle += 360;
        state.velocity *= 0.93; // Smooth damping
      } else {
        state.velocity = 0;
      }

      // Throttle degree readout to 10 FPS
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

      // 3. Aspect-Preserving Character Rendering (NEVER SQUASHED OR STRETCHED)
      // Master asset aspect ratio is 896 / 1200 = 0.7466 (portrait)
      const imgAspect = 896 / 1200;
      const canvasAspect = width / height;

      let drawW, drawH;
      if (canvasAspect > imgAspect) {
        // Canvas is wider than image: fit to height
        drawH = height * 0.94;
        drawW = drawH * imgAspect;
      } else {
        // Canvas is narrower than image: fit to width
        drawW = width * 0.94;
        drawH = drawW / imgAspect;
      }

      const drawX = (width - drawW) / 2;
      const drawY = (height - drawH) / 2;

      // 4. Exact Sector Frame Selection (ZERO GHOSTING — ONLY ONE CRISP FRAME)
      // Sector 0: [-22.5, +22.5] -> Frame 0 (Front)
      // Sector 1: [22.5, 67.5]   -> Frame 1 (45° Quarter)
      // Sector 2: [67.5, 112.5]  -> Frame 2 (90° Profile)
      // etc.
      const normAngle = ((state.angle % 360) + 360) % 360;
      const activeIdx = Math.floor(((normAngle + 22.5) % 360) / 45) % 8;
      const frame = FRAME_CONFIGS[activeIdx];
      const img = state.loadedImages[frame.src] || state.loadedImages['/assets/agent/rare_front.jpg'];

      if (img && img.complete && img.naturalWidth > 0) {
        ctx.save();

        if (frame.flip) {
          // Flip horizontally around the center of the drawn character
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
  }, []);

  // Pointer Drag Handlers with Velocity Inertia
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

    // Calculate instantaneous velocity for release momentum
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
      {/* High-Performance Canvas: Character rendered in natural 3:4 aspect ratio with zero ghosting */}
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
  );
}
