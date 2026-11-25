'use client';

import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

export default function HeroQuantumOrb() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const coreRef = useRef(null);
  const outerRingRef = useRef(null);
  const midRingRef = useRef(null);
  const innerRingRef = useRef(null);
  const card1Ref = useRef(null);
  const card2Ref = useRef(null);
  const card3Ref = useRef(null);
  const card4Ref = useRef(null);
  const glowRef = useRef(null);

  useGSAP(
    () => {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReduced) return;

      // 1. Continuous Rotation Timelines for Orbital Rings
      gsap.to(outerRingRef.current, {
        rotation: 360,
        duration: 45,
        repeat: -1,
        ease: 'none',
        transformOrigin: '50% 50%'
      });

      gsap.to(midRingRef.current, {
        rotation: -360,
        duration: 28,
        repeat: -1,
        ease: 'none',
        transformOrigin: '50% 50%'
      });

      gsap.to(innerRingRef.current, {
        rotation: 360,
        duration: 18,
        repeat: -1,
        ease: 'none',
        transformOrigin: '50% 50%'
      });

      // 2. Breathing Emerald Core Ambient Motion
      gsap.to(coreRef.current, {
        scale: 1.08,
        y: -8,
        duration: 3.2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });

      gsap.to(glowRef.current, {
        scale: 1.25,
        opacity: 0.65,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });

      // 3. Floating Telemetry HUD Chips with Sinusoidal Delays
      const floatConfigs = [
        { el: card1Ref.current, y: -6, delay: 0 },
        { el: card2Ref.current, y: 7, delay: 0.6 },
        { el: card3Ref.current, y: -7, delay: 1.2 },
        { el: card4Ref.current, y: 6, delay: 1.8 }
      ];

      floatConfigs.forEach(({ el, y, delay }) => {
        if (!el) return;
        gsap.to(el, {
          y,
          duration: 2.8,
          delay,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        });
      });

      // 4. Interactive 3D Perspective Tilt with Mouse
      const container = containerRef.current;
      if (!container) return;

      const handlePointerMove = (e) => {
        const rect = container.getBoundingClientRect();
        const normX = (e.clientX - rect.left) / rect.width - 0.5;
        const normY = (e.clientY - rect.top) / rect.height - 0.5;

        gsap.to(container, {
          rotationY: normX * 22,
          rotationX: -normY * 22,
          transformPerspective: 1200,
          ease: 'power2.out',
          duration: 0.5
        });
      };

      const handlePointerLeave = () => {
        gsap.to(container, {
          rotationY: 0,
          rotationX: 0,
          ease: 'power3.out',
          duration: 0.9
        });
      };

      window.addEventListener('pointermove', handlePointerMove, { passive: true });
      container.addEventListener('pointerleave', handlePointerLeave);

      return () => {
        window.removeEventListener('pointermove', handlePointerMove);
        container.removeEventListener('pointerleave', handlePointerLeave);
      };
    },
    { scope: containerRef }
  );

  // 5. GSAP Ticker Driven Particle Field
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    // Generate Particles
    const PARTICLE_COUNT = 40;
    const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      size: Math.random() * 2 + 0.8,
      alpha: Math.random() * 0.6 + 0.2,
      color: Math.random() > 0.35 ? '#00E599' : '#f6efe2'
    }));

    const updateParticles = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw constellation links when close
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 75) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0, 229, 153, ${(1 - dist / 75) * 0.15})`;
            ctx.lineWidth = 0.75;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Update and draw each particle
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.globalAlpha = 1.0;
        ctx.shadowBlur = 0;
      });
    };

    gsap.ticker.add(updateParticles);

    return () => {
      gsap.ticker.remove(updateParticles);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="relative w-full max-w-[520px] aspect-square mx-auto flex items-center justify-center select-none">
      {/* Background Radial Glow */}
      <div
        ref={glowRef}
        aria-hidden="true"
        className="pointer-events-none absolute h-[380px] w-[380px] rounded-full blur-[100px] opacity-40"
        style={{
          background: 'radial-gradient(circle, rgba(0, 229, 153, 0.45) 0%, rgba(250, 200, 143, 0.18) 45%, transparent 70%)',
          zIndex: 0
        }}
      />

      {/* Particle Canvas */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full z-1"
      />

      {/* 3D Perspective Container */}
      <div
        ref={containerRef}
        className="relative z-10 w-full h-full flex items-center justify-center"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* SVG Orbital Mechanics Core */}
        <svg
          viewBox="0 0 500 500"
          className="w-full h-full max-w-[480px] max-h-[480px] pointer-events-none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Emerald Core Radial Gradient */}
            <radialGradient id="emeraldRadial" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#80FFD0" stopOpacity="0.95" />
              <stop offset="35%" stopColor="#00E599" stopOpacity="0.8" />
              <stop offset="70%" stopColor="#008f5d" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </radialGradient>

            {/* Linear Crystal Highlights */}
            <linearGradient id="facetHighlight" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
              <stop offset="40%" stopColor="#80ffd0" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#00E599" stopOpacity="0.1" />
            </linearGradient>

            <filter id="emeraldGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* 1. Outer Telemetry Dial Ring */}
          <g ref={outerRingRef}>
            <circle
              cx="250"
              cy="250"
              r="220"
              stroke="#f6efe2"
              strokeOpacity="0.08"
              strokeWidth="1"
            />
            <circle
              cx="250"
              cy="250"
              r="220"
              stroke="#00E599"
              strokeOpacity="0.35"
              strokeWidth="1.5"
              strokeDasharray="4 16 12 16 32 20 8 20"
            />
            {/* Cardinal Coordinate Markers */}
            <circle cx="250" cy="30" r="3" fill="#00E599" />
            <circle cx="470" cy="250" r="3" fill="#00E599" />
            <circle cx="250" cy="470" r="3" fill="#00E599" />
            <circle cx="30" cy="250" r="3" fill="#00E599" />
            {/* Angle Tick Bars */}
            <line x1="250" y1="20" x2="250" y2="28" stroke="#00E599" strokeWidth="1.5" />
            <line x1="472" y1="250" x2="480" y2="250" stroke="#00E599" strokeWidth="1.5" />
            <line x1="250" y1="472" x2="250" y2="480" stroke="#00E599" strokeWidth="1.5" />
            <line x1="20" y1="250" x2="28" y2="250" stroke="#00E599" strokeWidth="1.5" />
          </g>

          {/* 2. Middle Gyroscopic Orbit Ring (Tilted 3D look) */}
          <g ref={midRingRef}>
            <ellipse
              cx="250"
              cy="250"
              rx="180"
              ry="110"
              stroke="#00E599"
              strokeOpacity="0.45"
              strokeWidth="1.2"
              strokeDasharray="8 8 32 12"
              transform="rotate(-25 250 250)"
            />
            {/* Orbiting Satellite Node 1 */}
            <circle cx="95" cy="205" r="4.5" fill="#00E599" filter="url(#emeraldGlow)" />
            <circle cx="405" cy="295" r="3.5" fill="#fac88f" filter="url(#emeraldGlow)" />
          </g>

          {/* 3. Inner Counter-Rotating Ring */}
          <g ref={innerRingRef}>
            <ellipse
              cx="250"
              cy="250"
              rx="135"
              ry="75"
              stroke="#fac88f"
              strokeOpacity="0.4"
              strokeWidth="1"
              strokeDasharray="16 10 4 10"
              transform="rotate(45 250 250)"
            />
            <circle cx="250" cy="175" r="3" fill="#ffffff" />
            <circle cx="250" cy="325" r="3" fill="#ffffff" />
          </g>

          {/* 4. Center Emerald Faceted Crystal Core */}
          <g ref={coreRef} filter="url(#emeraldGlow)">
            {/* Core Radial Glow Aura */}
            <circle cx="250" cy="250" r="85" fill="url(#emeraldRadial)" />

            {/* Geometric Octahedron / Hexagonal Crystal Facets */}
            {/* Top Pyramid Facets */}
            <polygon points="250,175 295,230 250,250" fill="url(#facetHighlight)" fillOpacity="0.75" stroke="#00E599" strokeWidth="1" />
            <polygon points="250,175 205,230 250,250" fill="url(#facetHighlight)" fillOpacity="0.55" stroke="#00E599" strokeWidth="1" />
            <polygon points="250,175 250,250 295,230" fill="#00E599" fillOpacity="0.3" stroke="#80ffd0" strokeWidth="0.8" />
            <polygon points="205,230 250,175 250,250" fill="#00b377" fillOpacity="0.35" stroke="#80ffd0" strokeWidth="0.8" />

            {/* Bottom Inverted Pyramid Facets */}
            <polygon points="250,325 295,270 250,250" fill="url(#facetHighlight)" fillOpacity="0.85" stroke="#00E599" strokeWidth="1" />
            <polygon points="250,325 205,270 250,250" fill="url(#facetHighlight)" fillOpacity="0.65" stroke="#00E599" strokeWidth="1" />
            <polygon points="250,325 250,250 295,270" fill="#008f5d" fillOpacity="0.4" stroke="#80ffd0" strokeWidth="0.8" />
            <polygon points="205,270 250,325 250,250" fill="#006642" fillOpacity="0.45" stroke="#80ffd0" strokeWidth="0.8" />

            {/* Central Diamond Equator Belt */}
            <polygon points="205,230 250,250 205,270" fill="#80ffd0" fillOpacity="0.35" stroke="#00E599" strokeWidth="0.8" />
            <polygon points="295,230 250,250 295,270" fill="#80ffd0" fillOpacity="0.45" stroke="#00E599" strokeWidth="0.8" />

            {/* Brilliant Specular Light Center */}
            <circle cx="250" cy="250" r="12" fill="#ffffff" filter="url(#emeraldGlow)" opacity="0.9" />
            <circle cx="250" cy="250" r="4" fill="#ffffff" />
          </g>
        </svg>

        {/* 4 Floating Holographic Telemetry Cards */}
        {/* Top-Left Card */}
        <div
          ref={card1Ref}
          className="absolute -top-1 left-2 sm:left-4 z-20 flex items-center gap-2 rounded-lg border border-mint/30 bg-surface-1/90 backdrop-blur-md px-3 py-1.5 shadow-xl font-mono text-[11px]"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-mint opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-mint" />
          </span>
          <span className="text-dim">PDA BOND:</span>
          <span className="text-mint font-semibold">90% SECURED</span>
        </div>

        {/* Top-Right Card */}
        <div
          ref={card2Ref}
          className="absolute top-10 right-0 sm:right-2 z-20 flex items-center gap-2 rounded-lg border border-line bg-surface-1/90 backdrop-blur-md px-3 py-1.5 shadow-xl font-mono text-[11px]"
        >
          <span className="text-dim">SLOT:</span>
          <span className="text-cream font-medium">#31,094,892</span>
          <span className="text-mint text-[9px] border border-mint/30 bg-mint/10 rounded px-1">MAINNET</span>
        </div>

        {/* Bottom-Left Card */}
        <div
          ref={card3Ref}
          className="absolute bottom-12 left-0 sm:left-2 z-20 flex items-center gap-2 rounded-lg border border-line bg-surface-1/90 backdrop-blur-md px-3 py-1.5 shadow-xl font-mono text-[11px]"
        >
          <span className="text-dim">ORACLE:</span>
          <span className="text-peach font-medium">PYTH V2 HIGH-RES</span>
          <span className="text-dim">· 42ms</span>
        </div>

        {/* Bottom-Right Card */}
        <div
          ref={card4Ref}
          className="absolute -bottom-2 right-4 sm:right-6 z-20 flex items-center gap-2 rounded-lg border border-mint/40 bg-surface-1/90 backdrop-blur-md px-3 py-1.5 shadow-xl font-mono text-[11px]"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-mint" />
          <span className="text-cream font-medium">10,078 AGENTS</span>
          <span className="text-mint">GENESIS</span>
        </div>
      </div>
    </div>
  );
}
