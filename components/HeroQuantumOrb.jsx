'use client';

import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

export default function HeroQuantumOrb() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useGSAP(
    () => {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReduced) return;

      const container = containerRef.current;
      if (!container) return;

      const handlePointerMove = (e) => {
        const rect = container.getBoundingClientRect();
        const normX = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
        const normY = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);

        // Smooth GSAP tween of mouse target
        gsap.to(mouseRef.current, {
          targetX: normX * 0.45,
          targetY: -normY * 0.35,
          duration: 0.6,
          ease: 'power2.out'
        });
      };

      const handlePointerLeave = () => {
        gsap.to(mouseRef.current, {
          targetX: 0,
          targetY: 0,
          duration: 1.0,
          ease: 'power3.out'
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

  // 3D Canvas Raytraced Emerald Octahedron + Gyroscope + Particle Field
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId;
    let width = 380;
    let height = 380;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const updateCanvasSize = () => {
      const parent = canvas.parentElement;
      const displayWidth = parent ? Math.min(parent.offsetWidth || 380, 380) : 380;
      width = displayWidth;
      height = displayWidth; // square

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    // Particles for constellation field
    const PARTICLE_COUNT = 30;
    const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      size: Math.random() * 1.8 + 0.8,
      alpha: Math.random() * 0.6 + 0.25,
      color: Math.random() > 0.35 ? '#00E599' : '#fac88f'
    }));

    // 3D Octahedron Geometry Definition
    const V_TOP = [0, -78, 0];
    const V_BOT = [0, 78, 0];
    const V_RIGHT = [54, 0, 0];
    const V_FRONT = [0, 0, 54];
    const V_LEFT = [-54, 0, 0];
    const V_BACK = [0, 0, -54];

    const FACETS = [
      // Top 4 facets
      [V_TOP, V_RIGHT, V_FRONT],
      [V_TOP, V_FRONT, V_LEFT],
      [V_TOP, V_LEFT, V_BACK],
      [V_TOP, V_BACK, V_RIGHT],
      // Bottom 4 facets
      [V_BOT, V_FRONT, V_RIGHT],
      [V_BOT, V_LEFT, V_FRONT],
      [V_BOT, V_BACK, V_LEFT],
      [V_BOT, V_RIGHT, V_BACK]
    ];

    let startTime = performance.now();

    const render = (now) => {
      const elapsed = (now - startTime) * 0.001;

      // Mouse smoothing
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.08;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.08;

      ctx.save();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      // 1. Ambient Background Emerald Radial Nebula
      const auraGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, width * 0.45);
      const pulse = 0.22 + Math.sin(elapsed * 2.2) * 0.06;
      auraGrad.addColorStop(0, `rgba(0, 229, 153, ${pulse})`);
      auraGrad.addColorStop(0.35, 'rgba(0, 229, 153, 0.08)');
      auraGrad.addColorStop(0.7, 'rgba(250, 200, 143, 0.03)');
      auraGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = auraGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Constellation Particles & Connecting Laser Threads
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 65) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0, 229, 153, ${(1 - dist / 65) * 0.16})`;
            ctx.lineWidth = 0.75;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

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
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.globalAlpha = 1.0;
        ctx.shadowBlur = 0;
      });

      // 3. Gyroscope Ring 1 (Outer Telemetry Dial)
      ctx.save();
      ctx.translate(cx, cy);
      const outerAngle = elapsed * 0.18;
      ctx.rotate(outerAngle);

      ctx.beginPath();
      ctx.arc(0, 0, 150, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(246, 239, 226, 0.08)';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(0, 0, 150, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(0, 229, 153, 0.38)';
      ctx.lineWidth = 1.4;
      ctx.setLineDash([4, 16, 24, 16, 8, 20]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Cardinal Coordinate Markers & Ticks
      [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].forEach((ang) => {
        const px = Math.cos(ang) * 150;
        const py = Math.sin(ang) * 150;
        ctx.beginPath();
        ctx.arc(px, py, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#00E599';
        ctx.shadowColor = '#00E599';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      });
      ctx.restore();

      // 4. Gyroscope Ring 2 (Middle Inclined Orbit with Satellites)
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(-0.4); // tilt
      const midAngle = -elapsed * 0.32;

      ctx.beginPath();
      ctx.ellipse(0, 0, 122, 64, 0, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(0, 229, 153, 0.45)';
      ctx.lineWidth = 1.2;
      ctx.setLineDash([8, 12, 28, 12]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Orbiting Satellite Beads
      const sat1X = Math.cos(midAngle) * 122;
      const sat1Y = Math.sin(midAngle) * 64;
      ctx.beginPath();
      ctx.arc(sat1X, sat1Y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#00E599';
      ctx.shadowColor = '#00E599';
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.shadowBlur = 0;

      const sat2X = Math.cos(midAngle + Math.PI) * 122;
      const sat2Y = Math.sin(midAngle + Math.PI) * 64;
      ctx.beginPath();
      ctx.arc(sat2X, sat2Y, 3, 0, Math.PI * 2);
      ctx.fillStyle = '#fac88f';
      ctx.shadowColor = '#fac88f';
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.restore();

      // 5. Gyroscope Ring 3 (Inner Fast Orbit)
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(0.7);
      ctx.beginPath();
      ctx.ellipse(0, 0, 92, 46, 0, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(250, 200, 143, 0.35)';
      ctx.lineWidth = 1;
      ctx.setLineDash([12, 10, 4, 10]);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();

      // 6. 3D Raytraced Faceted Emerald Octahedron Crystal
      const rotY = elapsed * 0.55 + mouseRef.current.x * 1.5;
      const rotX = 0.28 + mouseRef.current.y * 1.2;

      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);

      const project = (pt) => {
        // Rotate around Y
        const x1 = pt[0] * cosY - pt[2] * sinY;
        const z1 = pt[0] * sinY + pt[2] * cosY;
        const y1 = pt[1];

        // Rotate around X
        const y2 = y1 * cosX - z1 * sinX;
        const z2 = y1 * sinX + z1 * cosX;
        const x2 = x1;

        // Perspective projection
        const fov = 340;
        const scale = fov / (fov + z2);
        return {
          x: cx + x2 * scale,
          y: cy + y2 * scale,
          z: z2
        };
      };

      // Project facets and compute depth
      const projectedFacets = FACETS.map((facet) => {
        const p0 = project(facet[0]);
        const p1 = project(facet[1]);
        const p2 = project(facet[2]);
        const avgZ = (p0.z + p1.z + p2.z) / 3;

        // Compute 2D surface normal winding
        const area = (p1.x - p0.x) * (p2.y - p0.y) - (p1.y - p0.y) * (p2.x - p0.x);

        return { p0, p1, p2, avgZ, isFront: area > 0 };
      });

      // Painter's algorithm: draw from back to front
      projectedFacets.sort((a, b) => b.avgZ - a.avgZ);

      projectedFacets.forEach(({ p0, p1, p2, isFront }) => {
        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.lineTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.closePath();

        if (isFront) {
          // Front facing facet - bright glowing mint/emerald
          const grad = ctx.createLinearGradient(p0.x, p0.y, p1.x, p2.y);
          grad.addColorStop(0, 'rgba(128, 255, 208, 0.7)');
          grad.addColorStop(0.5, 'rgba(0, 229, 153, 0.55)');
          grad.addColorStop(1, 'rgba(0, 143, 93, 0.35)');

          ctx.fillStyle = grad;
          ctx.fill();

          ctx.strokeStyle = '#00E599';
          ctx.lineWidth = 1.4;
          ctx.shadowColor = '#00E599';
          ctx.shadowBlur = 8;
          ctx.stroke();
          ctx.shadowBlur = 0;
        } else {
          // Back facing facet - dark translucent emerald
          ctx.fillStyle = 'rgba(0, 75, 48, 0.25)';
          ctx.fill();

          ctx.strokeStyle = 'rgba(0, 229, 153, 0.2)';
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      });

      // 7. Core Specular Flare
      const flare = ctx.createRadialGradient(cx, cy, 0, cx, cy, 18);
      flare.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
      flare.addColorStop(0.35, 'rgba(128, 255, 208, 0.6)');
      flare.addColorStop(1, 'rgba(0, 229, 153, 0)');

      ctx.fillStyle = flare;
      ctx.beginPath();
      ctx.arc(cx, cy, 18, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="hero-quantum-orb-container select-none"
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '440px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {/* 3D Hardware Accelerated Canvas */}
      <canvas
        ref={canvasRef}
        className="block cursor-grab active:cursor-grabbing"
        style={{
          display: 'block',
          maxWidth: '100%',
          filter: 'drop-shadow(0 0 24px rgba(0, 229, 153, 0.35))'
        }}
      />

      {/* Centered Holographic HUD Telemetry Pill */}
      <div
        className="mt-2 flex items-center justify-center gap-2 rounded-full border border-mint/30 bg-surface-1/90 backdrop-blur-md px-4 py-1.5 font-mono text-[11px] text-muted shadow-2xl"
        style={{
          whiteSpace: 'nowrap',
          zIndex: 20
        }}
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-mint opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-mint" />
        </span>
        <span className="text-mint font-semibold">90% PDA BOND</span>
        <span className="text-dim">·</span>
        <span className="text-cream font-medium">SOLANA MAINNET</span>
        <span className="text-dim">·</span>
        <span className="text-peach">10,078 AGENTS</span>
      </div>
    </div>
  );
}
