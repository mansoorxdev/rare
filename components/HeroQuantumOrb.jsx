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
  const glowRef = useRef(null);

  useGSAP(
    () => {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReduced) return;

      // 1. Continuous Rotation Timelines for Orbital Rings
      gsap.to(outerRingRef.current, {
        rotation: 360,
        duration: 40,
        repeat: -1,
        ease: 'none',
        transformOrigin: '50% 50%'
      });

      gsap.to(midRingRef.current, {
        rotation: -360,
        duration: 25,
        repeat: -1,
        ease: 'none',
        transformOrigin: '50% 50%'
      });

      gsap.to(innerRingRef.current, {
        rotation: 360,
        duration: 16,
        repeat: -1,
        ease: 'none',
        transformOrigin: '50% 50%'
      });

      // 2. Breathing Emerald Core Ambient Motion
      gsap.to(coreRef.current, {
        scale: 1.06,
        y: -6,
        duration: 2.8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        transformOrigin: '50% 50%'
      });

      gsap.to(glowRef.current, {
        scale: 1.2,
        opacity: 0.55,
        duration: 2.8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });

      // 3. Interactive 3D Perspective Tilt on Pointer Move
      const container = containerRef.current;
      if (!container) return;

      const handlePointerMove = (e) => {
        const rect = container.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;
        const normX = (e.clientX - rect.left) / rect.width - 0.5;
        const normY = (e.clientY - rect.top) / rect.height - 0.5;

        gsap.to(container, {
          rotationY: normX * 24,
          rotationX: -normY * 24,
          transformPerspective: 1000,
          ease: 'power2.out',
          duration: 0.4
        });
      };

      const handlePointerLeave = () => {
        gsap.to(container, {
          rotationY: 0,
          rotationX: 0,
          ease: 'power3.out',
          duration: 0.8
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

  // 4. GSAP Ticker Constellation Particle Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.offsetWidth || 480);
    let height = (canvas.height = canvas.parentElement?.offsetHeight || 480);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.offsetWidth || 480;
      height = canvas.height = canvas.parentElement.offsetHeight || 480;
    };
    window.addEventListener('resize', handleResize);

    const PARTICLE_COUNT = 36;
    const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      size: Math.random() * 2 + 0.8,
      alpha: Math.random() * 0.6 + 0.25,
      color: Math.random() > 0.4 ? '#00E599' : '#f6efe2'
    }));

    const updateParticles = () => {
      ctx.clearRect(0, 0, width, height);

      // Connect nearby particles with subtle mint laser threads
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 70) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0, 229, 153, ${(1 - dist / 70) * 0.18})`;
            ctx.lineWidth = 0.8;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Move & draw particles
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
        ctx.shadowBlur = 6;
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
    <div
      className="hero-quantum-orb-container select-none"
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '480px',
        height: '480px',
        minHeight: '480px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {/* Background Radial Glow */}
      <div
        ref={glowRef}
        aria-hidden="true"
        className="pointer-events-none absolute h-[340px] w-[340px] rounded-full blur-[90px] opacity-40"
        style={{
          background: 'radial-gradient(circle, rgba(0, 229, 153, 0.5) 0%, rgba(250, 200, 143, 0.18) 45%, transparent 70%)',
          zIndex: 0
        }}
      />

      {/* Constellation Particle Canvas */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full"
        style={{ zIndex: 1 }}
      />

      {/* 3D Perspective Gyroscope Core */}
      <div
        ref={containerRef}
        className="relative z-10 flex items-center justify-center w-full h-full"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <svg
          viewBox="0 0 500 500"
          className="w-full h-full max-w-[460px] max-h-[460px] pointer-events-none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ overflow: 'visible' }}
        >
          <defs>
            {/* Core Glow Gradient */}
            <radialGradient id="emeraldRadial" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#80FFD0" stopOpacity="0.95" />
              <stop offset="35%" stopColor="#00E599" stopOpacity="0.8" />
              <stop offset="70%" stopColor="#008f5d" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </radialGradient>

            {/* Facet Highlights */}
            <linearGradient id="facetHighlight" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
              <stop offset="40%" stopColor="#80ffd0" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#00E599" stopOpacity="0.1" />
            </linearGradient>

            <filter id="emeraldGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* 1. Outer Dial Ring */}
          <g ref={outerRingRef}>
            <circle
              cx="250"
              cy="250"
              r="215"
              stroke="#f6efe2"
              strokeOpacity="0.08"
              strokeWidth="1"
            />
            <circle
              cx="250"
              cy="250"
              r="215"
              stroke="#00E599"
              strokeOpacity="0.38"
              strokeWidth="1.5"
              strokeDasharray="4 16 12 16 32 20 8 20"
            />
            {/* Cardinal Coordinate Markers */}
            <circle cx="250" cy="35" r="3.5" fill="#00E599" />
            <circle cx="465" cy="250" r="3.5" fill="#00E599" />
            <circle cx="250" cy="465" r="3.5" fill="#00E599" />
            <circle cx="35" cy="250" r="3.5" fill="#00E599" />
            {/* Ticks */}
            <line x1="250" y1="26" x2="250" y2="34" stroke="#00E599" strokeWidth="1.5" />
            <line x1="466" y1="250" x2="474" y2="250" stroke="#00E599" strokeWidth="1.5" />
            <line x1="250" y1="466" x2="250" y2="474" stroke="#00E599" strokeWidth="1.5" />
            <line x1="26" y1="250" x2="34" y2="250" stroke="#00E599" strokeWidth="1.5" />
          </g>

          {/* 2. Middle Gyroscopic Ring */}
          <g ref={midRingRef}>
            <ellipse
              cx="250"
              cy="250"
              rx="175"
              ry="105"
              stroke="#00E599"
              strokeOpacity="0.5"
              strokeWidth="1.4"
              strokeDasharray="8 8 32 12"
              transform="rotate(-25 250 250)"
            />
            {/* Satellites */}
            <circle cx="95" cy="205" r="4.5" fill="#00E599" filter="url(#emeraldGlow)" />
            <circle cx="405" cy="295" r="4" fill="#fac88f" filter="url(#emeraldGlow)" />
          </g>

          {/* 3. Inner Orbit Ring */}
          <g ref={innerRingRef}>
            <ellipse
              cx="250"
              cy="250"
              rx="130"
              ry="70"
              stroke="#fac88f"
              strokeOpacity="0.45"
              strokeWidth="1.2"
              strokeDasharray="16 10 4 10"
              transform="rotate(45 250 250)"
            />
            <circle cx="250" cy="180" r="3" fill="#ffffff" />
            <circle cx="250" cy="320" r="3" fill="#ffffff" />
          </g>

          {/* 4. Center Emerald Faceted Crystal Core */}
          <g ref={coreRef} filter="url(#emeraldGlow)">
            {/* Core Radial Glow Aura */}
            <circle cx="250" cy="250" r="80" fill="url(#emeraldRadial)" />

            {/* Geometric Crystal Facets */}
            <polygon points="250,175 295,230 250,250" fill="url(#facetHighlight)" fillOpacity="0.75" stroke="#00E599" strokeWidth="1" />
            <polygon points="250,175 205,230 250,250" fill="url(#facetHighlight)" fillOpacity="0.55" stroke="#00E599" strokeWidth="1" />
            <polygon points="250,175 250,250 295,230" fill="#00E599" fillOpacity="0.3" stroke="#80ffd0" strokeWidth="0.8" />
            <polygon points="205,230 250,175 250,250" fill="#00b377" fillOpacity="0.35" stroke="#80ffd0" strokeWidth="0.8" />

            <polygon points="250,325 295,270 250,250" fill="url(#facetHighlight)" fillOpacity="0.85" stroke="#00E599" strokeWidth="1" />
            <polygon points="250,325 205,270 250,250" fill="url(#facetHighlight)" fillOpacity="0.65" stroke="#00E599" strokeWidth="1" />
            <polygon points="250,325 250,250 295,270" fill="#008f5d" fillOpacity="0.4" stroke="#80ffd0" strokeWidth="0.8" />
            <polygon points="205,270 250,325 250,250" fill="#006642" fillOpacity="0.45" stroke="#80ffd0" strokeWidth="0.8" />

            <polygon points="205,230 250,250 205,270" fill="#80ffd0" fillOpacity="0.35" stroke="#00E599" strokeWidth="0.8" />
            <polygon points="295,230 250,250 295,270" fill="#80ffd0" fillOpacity="0.45" stroke="#00E599" strokeWidth="0.8" />

            {/* Specular Center */}
            <circle cx="250" cy="250" r="12" fill="#ffffff" filter="url(#emeraldGlow)" opacity="0.9" />
            <circle cx="250" cy="250" r="4" fill="#ffffff" />
          </g>
        </svg>

        {/* Centered Holographic HUD Telemetry Pill (Never overflows or clips) */}
        <div
          className="absolute bottom-2 flex items-center gap-2 rounded-full border border-mint/30 bg-black/85 backdrop-blur-md px-4 py-1.5 font-mono text-[11px] text-muted shadow-2xl"
          style={{
            zIndex: 30,
            whiteSpace: 'nowrap'
          }}
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-mint opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-mint" />
          </span>
          <span className="text-mint font-semibold">90% PDA BOND</span>
          <span className="text-dim">·</span>
          <span className="text-cream">SOLANA MAINNET</span>
          <span className="text-dim">·</span>
          <span className="text-peach">10,078 AGENTS</span>
        </div>
      </div>
    </div>
  );
}
