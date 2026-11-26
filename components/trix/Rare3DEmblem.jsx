'use client';

import React, { useEffect, useRef, useState } from 'react';

export default function Rare3DEmblem({ scrollProgress = 0, isLightMode = false }) {
  const containerRef = useRef(null);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX - innerWidth / 2) / (innerWidth / 2);
      const y = (e.clientY - innerHeight / 2) / (innerHeight / 2);
      setMouseOffset({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Compute 3D rotation and position based on scrollProgress (0 to 1)
  // Stage 0 (0 - 0.25): Hero upright floating emblem
  // Stage 1 (0.25 - 0.50): Horizon tilt onto 3D grid with targeting callouts
  // Stage 2 (0.50 - 0.75): Elevated hover in tactical white radar mode with floating shards
  // Stage 3 (0.75 - 1.0): Flat radar disc alignment
  let rotX = 12 - mouseOffset.y * 14;
  let rotY = -10 + mouseOffset.x * 16;
  let rotZ = 0;
  let transX = 0;
  let transY = 0;
  let transZ = 0;
  let scale = 1;

  if (scrollProgress <= 0.25) {
    // Stage 0: Hero
    const p = scrollProgress / 0.25;
    rotX = 12 + p * 30 - mouseOffset.y * 12;
    rotY = -8 + p * 15 + mouseOffset.x * 14;
    scale = 1 + p * 0.1;
  } else if (scrollProgress <= 0.5) {
    // Stage 1: Tilting onto grid horizon
    const p = (scrollProgress - 0.25) / 0.25;
    rotX = 42 + p * 24 - mouseOffset.y * 8; // reaches ~66deg
    rotY = 7 - p * 20 + mouseOffset.x * 10;
    rotZ = p * 22;
    transX = -p * 120;
    transY = p * 40;
    transZ = -p * 60;
    scale = 1.1 - p * 0.15;
  } else if (scrollProgress <= 0.75) {
    // Stage 2: Shard burst & White transition
    const p = (scrollProgress - 0.5) / 0.25;
    rotX = 66 - p * 35 - mouseOffset.y * 10;
    rotY = -13 + p * 28 + mouseOffset.x * 12;
    rotZ = 22 - p * 30;
    transX = -120 + p * 120;
    transY = 40 - p * 20;
    transZ = -60 + p * 50;
    scale = 0.95 + p * 0.15;
  } else {
    // Stage 3: Evidence alignment
    const p = (scrollProgress - 0.75) / 0.25;
    rotX = 31 + p * 38;
    rotY = 15 - p * 15;
    rotZ = -8 + p * 8;
    scale = 1.1 - p * 0.2;
    transY = 20 + p * 40;
  }

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '460px',
        height: '460px',
        perspective: '1200px',
        pointerEvents: 'none',
        zIndex: 10,
        transition: 'filter 0.5s ease'
      }}
    >
      {/* Dynamic 3D Rig Assembly */}
      <div
        style={{
          width: '100%',
          height: '100%',
          transformStyle: 'preserve-3d',
          transform: `translate3d(${transX}px, ${transY}px, ${transZ}px) rotateX(${rotX}deg) rotateY(${rotY}deg) rotateZ(${rotZ}deg) scale(${scale})`,
          transition: 'transform 0.12s cubic-bezier(0.16, 1, 0.3, 1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative'
        }}
      >
        {/* Ground Projection Shadow */}
        <div
          style={{
            position: 'absolute',
            bottom: '20px',
            width: '320px',
            height: '120px',
            borderRadius: '50%',
            background: isLightMode
              ? 'radial-gradient(ellipse at center, rgba(16, 185, 129, 0.25) 0%, rgba(0, 0, 0, 0.15) 50%, transparent 75%)'
              : 'radial-gradient(ellipse at center, rgba(34, 197, 94, 0.45) 0%, rgba(5, 150, 105, 0.2) 45%, transparent 75%)',
            transform: 'rotateX(90deg) translateZ(-160px)',
            filter: 'blur(16px)',
            pointerEvents: 'none'
          }}
        />

        {/* Ambient Hologram Concentric Rings */}
        <div
          style={{
            position: 'absolute',
            width: '420px',
            height: '420px',
            borderRadius: '50%',
            border: isLightMode
              ? '1px dashed rgba(16, 185, 129, 0.35)'
              : '1px dashed rgba(34, 197, 94, 0.28)',
            transform: 'rotateX(75deg) translateZ(-60px)',
            animation: 'trixSpin 28s linear infinite'
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: '320px',
            height: '320px',
            borderRadius: '50%',
            border: isLightMode
              ? '1px solid rgba(16, 185, 129, 0.2)'
              : '1px solid rgba(34, 197, 94, 0.2)',
            transform: 'rotateX(75deg) translateZ(-60px)',
            animation: 'trixSpinReverse 20s linear infinite'
          }}
        />

        {/* ==========================================================
            3D MULTI-LAYER EXTRUDED RARE LOGO EMBLEM
            ========================================================== */}
        {/* Layer -4 (Back Extrusion Shadow) */}
        <div
          style={{
            position: 'absolute',
            width: '240px',
            height: '240px',
            transform: 'translateZ(-28px)',
            filter: 'brightness(0.3) drop-shadow(0 20px 30px rgba(0, 0, 0, 0.8))',
            opacity: 0.85
          }}
        >
          <img
            src="/rare-logo-icon.png"
            alt="RARE Extrusion Back"
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </div>

        {/* Layer -3 (Mid-deep extrusion) */}
        <div
          style={{
            position: 'absolute',
            width: '240px',
            height: '240px',
            transform: 'translateZ(-18px)',
            filter: 'brightness(0.55)',
            opacity: 0.9
          }}
        >
          <img
            src="/rare-logo-icon.png"
            alt="RARE Extrusion Mid"
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </div>

        {/* Layer -2 (Glow Core) */}
        <div
          style={{
            position: 'absolute',
            width: '260px',
            height: '260px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(34, 197, 94, 0.5) 0%, rgba(16, 185, 129, 0.2) 50%, transparent 70%)',
            transform: 'translateZ(-8px)',
            filter: 'blur(20px)',
            pointerEvents: 'none'
          }}
        />

        {/* Layer -1 (Inner bevel extrusion) */}
        <div
          style={{
            position: 'absolute',
            width: '240px',
            height: '240px',
            transform: 'translateZ(-6px)',
            filter: 'brightness(0.8)',
            opacity: 0.95
          }}
        >
          <img
            src="/rare-logo-icon.png"
            alt="RARE Extrusion Face Bevel"
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </div>

        {/* Layer 0 (FRONT PRIMARY GLOSSY FACE) */}
        <div
          style={{
            position: 'absolute',
            width: '240px',
            height: '240px',
            transform: 'translateZ(14px)',
            filter: isLightMode
              ? 'drop-shadow(0 12px 24px rgba(0, 0, 0, 0.35)) drop-shadow(0 0 30px rgba(16, 185, 129, 0.5))'
              : 'drop-shadow(0 18px 36px rgba(0, 0, 0, 0.7)) drop-shadow(0 0 35px rgba(34, 197, 94, 0.75))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <img
            src="/rare-logo-icon.png"
            alt="RARE 3D Emblem"
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />

          {/* Gloss Specular Sheen Sweep */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, transparent 40%, rgba(255, 255, 255, 0.15) 70%, transparent 100%)',
              mixBlendMode: 'overlay',
              pointerEvents: 'none',
              borderRadius: '24px'
            }}
          />
        </div>

        {/* ==========================================================
            STAGE 1 TARGETING HUD BRACKET & LASER CALLOUT
            (Visible between scroll 0.25 and 0.52)
            ========================================================== */}
        {scrollProgress >= 0.2 && scrollProgress <= 0.54 && (
          <div
            style={{
              position: 'absolute',
              right: '-160px',
              top: '40px',
              transform: 'translateZ(60px)',
              pointerEvents: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              opacity: Math.min(1, Math.max(0, (scrollProgress - 0.2) * 5)),
              transition: 'opacity 0.2s ease'
            }}
          >
            {/* Reticle Diamond */}
            <div
              style={{
                width: '14px',
                height: '14px',
                border: '2px solid #22c55e',
                transform: 'rotate(45deg)',
                boxShadow: '0 0 10px #22c55e'
              }}
            />

            {/* Laser Line */}
            <div
              style={{
                width: '80px',
                height: '1.5px',
                background: 'linear-gradient(90deg, #22c55e 0%, rgba(34, 197, 94, 0.4) 100%)',
                boxShadow: '0 0 8px #22c55e'
              }}
            />

            {/* Target Label */}
            <div
              style={{
                background: 'rgba(5, 28, 12, 0.85)',
                border: '1px solid rgba(34, 197, 94, 0.4)',
                borderRadius: '6px',
                padding: '4px 10px',
                fontSize: '10px',
                fontFamily: 'var(--font-jetbrains), monospace',
                color: '#22c55e',
                letterSpacing: '0.1em',
                whiteSpace: 'nowrap',
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.6)'
              }}
            >
              PDA_VAULT // 90% BONDED
            </div>
          </div>
        )}

        {/* ==========================================================
            STAGE 2 FLOATING 3D TELEMETRY CHIPS / SHARDS
            (Visible during White Radar Stage: scroll 0.48 - 0.85)
            ========================================================== */}
        {scrollProgress >= 0.45 && scrollProgress <= 0.88 && (
          <>
            {/* Shard 1: Top Left */}
            <div
              style={{
                position: 'absolute',
                top: '-90px',
                left: '-140px',
                transform: 'translateZ(40px) rotate(-12deg)',
                background: isLightMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(10, 20, 15, 0.8)',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                boxShadow: isLightMode ? '0 8px 24px rgba(0, 0, 0, 0.12)' : '0 8px 24px rgba(0, 0, 0, 0.6)',
                borderRadius: '8px',
                padding: '8px 14px',
                fontFamily: 'var(--font-jetbrains), monospace',
                fontSize: '10.5px',
                color: isLightMode ? '#047857' : '#22c55e',
                whiteSpace: 'nowrap'
              }}
            >
              <div style={{ opacity: 0.6, fontSize: '9px' }}>// ARCHITECTURE LAYER</div>
              <div style={{ fontWeight: 700, marginTop: '2px' }}>ANCHOR CPI 90/10</div>
            </div>

            {/* Shard 2: Bottom Right */}
            <div
              style={{
                position: 'absolute',
                bottom: '-60px',
                right: '-160px',
                transform: 'translateZ(50px) rotate(8deg)',
                background: isLightMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(10, 20, 15, 0.8)',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                boxShadow: isLightMode ? '0 8px 24px rgba(0, 0, 0, 0.12)' : '0 8px 24px rgba(0, 0, 0, 0.6)',
                borderRadius: '8px',
                padding: '8px 14px',
                fontFamily: 'var(--font-jetbrains), monospace',
                fontSize: '10.5px',
                color: isLightMode ? '#047857' : '#22c55e',
                whiteSpace: 'nowrap'
              }}
            >
              <div style={{ opacity: 0.6, fontSize: '9px' }}>// ORACLE FEED</div>
              <div style={{ fontWeight: 700, marginTop: '2px' }}>PYTH REAL-TIME CONF</div>
            </div>

            {/* Shard 3: Bottom Left */}
            <div
              style={{
                position: 'absolute',
                bottom: '-50px',
                left: '-130px',
                transform: 'translateZ(30px) rotate(-6deg)',
                background: isLightMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(10, 20, 15, 0.8)',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                boxShadow: isLightMode ? '0 8px 24px rgba(0, 0, 0, 0.12)' : '0 8px 24px rgba(0, 0, 0, 0.6)',
                borderRadius: '8px',
                padding: '8px 14px',
                fontFamily: 'var(--font-jetbrains), monospace',
                fontSize: '10.5px',
                color: isLightMode ? '#047857' : '#22c55e',
                whiteSpace: 'nowrap'
              }}
            >
              <div style={{ opacity: 0.6, fontSize: '9px' }}>// SWARM MATRIX</div>
              <div style={{ fontWeight: 700, marginTop: '2px' }}>10,078 AGENTS READY</div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
