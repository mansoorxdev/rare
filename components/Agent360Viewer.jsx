'use client';

import React, { useEffect, useRef, useState } from 'react';
import { getAgentMetadata } from '../lib/agentMetadata';

export default function Agent360Viewer({ agentId = 1, price = 0.02, onChangeAgent }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  const num = parseInt(agentId, 10) || 1;
  const currentAgent = getAgentMetadata(num);

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
    activeAgent: currentAgent,
  });

  const [isAutoSpin, setIsAutoSpin] = useState(true);

  // When agentId changes, update active agent and reset angle to front 0° so user clearly sees the front of their selected NFT!
  useEffect(() => {
    stateRef.current.activeAgent = currentAgent;
    stateRef.current.angle = 0; // Show front view first
    stateRef.current.velocity = 0;

    // Preload front image for the newly selected agent
    const img = new Image();
    img.src = currentAgent.image;
    img.onload = () => {
      stateRef.current.loadedImages[currentAgent.image] = img;
    };
  }, [agentId, currentAgent.image]);

  // Preload base turn assets into memory
  useEffect(() => {
    const urls = [
      currentAgent.image,
      currentAgent.turnImage,
      currentAgent.profileImage,
      currentAgent.backImage,
    ].filter(Boolean);

    urls.forEach((url) => {
      const img = new Image();
      img.src = url;
      img.onload = () => {
        stateRef.current.loadedImages[url] = img;
      };
    });
  }, [currentAgent]);

  // 60FPS Canvas Render Loop
  useEffect(() => {
    let animId;
    let lastStamp = performance.now();

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

      // 100% Pure White Studio Canvas
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);

      // 3. Aspect-Preserving Character Rendering (Natural 896 / 1200 proportions)
      const imgAspect = 896 / 1200; // 0.7466
      const canvasAspect = width / height;

      let drawW, drawH;
      if (canvasAspect > imgAspect) {
        drawH = height * 0.90;
        drawW = drawH * imgAspect;
      } else {
        drawW = width * 0.90;
        drawH = drawW / imgAspect;
      }

      // 4. Frame Selection matching Selected Agent (Exact 360° rotation for the signature operative)
      const normAngle = ((state.angle % 360) + 360) % 360;
      const agent = state.activeAgent || currentAgent;

      const sector = Math.floor(((normAngle + 22.5) % 360) / 45) % 8;
      let targetSrc = agent.image;
      let flip = false;

      if (sector === 0) {
        targetSrc = agent.image;
        flip = false;
      } else if (sector === 1) {
        targetSrc = agent.turnImage || agent.image;
        flip = false;
      } else if (sector === 2) {
        targetSrc = agent.profileImage || agent.turnImage || agent.image;
        flip = false;
      } else if (sector === 3) {
        targetSrc = agent.backImage || agent.profileImage || agent.image;
        flip = false;
      } else if (sector === 4) {
        targetSrc = agent.backImage || agent.image;
        flip = false;
      } else if (sector === 5) {
        targetSrc = agent.backImage || agent.profileImage || agent.image;
        flip = true;
      } else if (sector === 6) {
        targetSrc = agent.profileImage || agent.turnImage || agent.image;
        flip = true;
      } else if (sector === 7) {
        targetSrc = agent.turnImage || agent.image;
        flip = true;
      }

      const img = state.loadedImages[targetSrc] || state.loadedImages[agent.image] || state.loadedImages['/assets/agent/rare_front.jpg'];

      // Draw subtle ground contact shadow under character feet on pure white
      const centerX = width / 2;
      const centerY = height / 2;
      const groundY = centerY + drawH * 0.44;
      const shadowW = drawW * 0.32;

      ctx.save();
      const shadowGrad = ctx.createRadialGradient(centerX, groundY, 4, centerX, groundY, shadowW);
      shadowGrad.addColorStop(0, 'rgba(0, 0, 0, 0.16)');
      shadowGrad.addColorStop(0.5, 'rgba(0, 0, 0, 0.05)');
      shadowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = shadowGrad;
      ctx.beginPath();
      ctx.ellipse(centerX, groundY, shadowW, 7, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Draw Character with Pure White Cutout Blend (No rectangular photo border!)
      if (img && img.complete && img.naturalWidth > 0) {
        ctx.save();
        ctx.translate(centerX, centerY);

        if (flip) {
          ctx.scale(-1, 1);
        }

        // Multiply composite + slight contrast boost + dynamic colorway hue filter
        ctx.filter = `contrast(106%) brightness(103%) ${agent.visualFilter || ''}`.trim();
        ctx.globalCompositeOperation = 'multiply';

        ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
        ctx.restore();
      }

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [currentAgent]);

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
      {/* Active Selected Agent Badge Bar — EXACT MATCH TO ROSTER */}
      <div className="w-full max-w-[460px] flex items-center justify-between pb-2 mb-2 border-b border-black/20 font-mono text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-[#10b981] inline-block shadow-[1px_1px_0px_#000]" />
          <span className="font-bold font-pixel text-xs text-[#0e2bdf]">
            RARE #{String(num).padStart(5, '0')}
          </span>
        </div>
        <span className="text-[11px] font-bold text-zinc-700 uppercase tracking-wide">
          {currentAgent.role} • {currentAgent.archetype}
        </span>
      </div>

      {/* 3D Turntable Viewport (Click to pause/spin, drag to rotate) */}
      <div
        ref={containerRef}
        onClick={toggleSpin}
        className="relative w-full mx-auto select-none overflow-hidden cursor-grab active:cursor-grabbing touch-none flex items-center justify-center"
        style={{
          maxWidth: '460px',
          height: '520px',
          border: '2px solid var(--hair-dark)',
          boxShadow: '6px 6px 0px 0px var(--script-blue)',
          background: '#ffffff',
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

        {/* Foot of NFT Area: "change" button requested by client */}
        {onChangeAgent && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 pointer-events-auto">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChangeAgent();
              }}
              className="btn-secondary"
              style={{
                padding: '6px 14px',
                fontSize: '11px',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                letterSpacing: '0.06em',
                background: '#ffffff',
                border: '2px solid var(--hair-dark)',
                boxShadow: '2px 2px 0px #000',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
              }}
              title="Click to change character (picks another unsold agent)"
            >
              <span style={{ fontSize: '12px' }}>↻</span>
              <span>change</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
