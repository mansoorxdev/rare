'use client';

import React, { useEffect, useRef, useState } from 'react';

export default function Rare3DEmblem({ scrollProgress = 0, isLightMode = false }) {
  const containerRef = useRef(null);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let animId;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      targetX = (e.clientX - innerWidth / 2) / (innerWidth / 2);
      targetY = (e.clientY - innerHeight / 2) / (innerHeight / 2);
    };

    const updateParallax = () => {
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;
      setMouseOffset({ x: currentX, y: currentY });
      animId = requestAnimationFrame(updateParallax);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    animId = requestAnimationFrame(updateParallax);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  // Compute 3D rotation and position based on scrollProgress (0 to 1)
  let rotX = 14 - mouseOffset.y * 12;
  let rotY = -12 + mouseOffset.x * 15;
  let rotZ = 0;
  let transX = 0;
  let transY = 0;
  let transZ = 0;
  let scale = 1.15;

  if (scrollProgress <= 0.25) {
    // Stage 0: Hero - Floating majestic upright crystal
    const p = scrollProgress / 0.25;
    rotX = 14 + p * 34 - mouseOffset.y * 10;
    rotY = -12 + p * 20 + mouseOffset.x * 12;
    scale = 1.15 + p * 0.1;
    transY = -20 - p * 30;
  } else if (scrollProgress <= 0.5) {
    // Stage 1: Horizon tilt onto 3D grid with targeting callouts
    const p = (scrollProgress - 0.25) / 0.25;
    rotX = 48 + p * 20 - mouseOffset.y * 8; // reaches ~68deg
    rotY = 8 - p * 26 + mouseOffset.x * 10;
    rotZ = p * 24;
    transX = -p * 140;
    transY = -50 + p * 40;
    transZ = -p * 50;
    scale = 1.25 - p * 0.25;
  } else if (scrollProgress <= 0.75) {
    // Stage 2: Tactical white radar mode with orbiting shards
    const p = (scrollProgress - 0.5) / 0.25;
    rotX = 68 - p * 36 - mouseOffset.y * 10;
    rotY = -18 + p * 34 + mouseOffset.x * 12;
    rotZ = 24 - p * 28;
    transX = -140 + p * 140;
    transY = -10 + p * 10;
    transZ = -50 + p * 40;
    scale = 1.0 + p * 0.15;
  } else {
    // Stage 3: Evidence alignment & comparison
    const p = (scrollProgress - 0.75) / 0.25;
    rotX = 32 + p * 38;
    rotY = 16 - p * 16;
    rotZ = -4 + p * 4;
    scale = 1.15 - p * 0.25;
    transY = p * 40;
  }

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: '46%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '500px',
        height: '500px',
        perspective: '1300px',
        pointerEvents: 'none',
        zIndex: 10
      }}
    >
      {/* 3D Motion Assembly */}
      <div
        style={{
          width: '100%',
          height: '100%',
          transformStyle: 'preserve-3d',
          transform: `translate3d(${transX}px, ${transY}px, ${transZ}px) rotateX(${rotX}deg) rotateY(${rotY}deg) rotateZ(${rotZ}deg) scale(${scale})`,
          transition: 'transform 0.08s ease-out',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative'
        }}
      >
        {/* Soft Volumetric Ground Shadow */}
        <div
          style={{
            position: 'absolute',
            bottom: '10px',
            width: '360px',
            height: '140px',
            borderRadius: '50%',
            background: isLightMode
              ? 'radial-gradient(ellipse at center, rgba(16, 185, 129, 0.3) 0%, rgba(0, 0, 0, 0.2) 40%, transparent 75%)'
              : 'radial-gradient(ellipse at center, rgba(34, 197, 94, 0.5) 0%, rgba(5, 150, 105, 0.25) 45%, transparent 75%)',
            transform: 'rotateX(90deg) translateZ(-200px)',
            filter: 'blur(24px)',
            pointerEvents: 'none'
          }}
        />

        {/* Ambient Hologram Concentric Rings */}
        <div
          style={{
            position: 'absolute',
            width: '460px',
            height: '460px',
            borderRadius: '50%',
            border: isLightMode
              ? '1px dashed rgba(16, 185, 129, 0.4)'
              : '1px dashed rgba(34, 197, 94, 0.35)',
            transform: 'rotateX(75deg) translateZ(-80px)',
            animation: 'trixSpin 32s linear infinite'
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: '340px',
            height: '340px',
            borderRadius: '50%',
            border: isLightMode
              ? '1px solid rgba(16, 185, 129, 0.25)'
              : '1px solid rgba(34, 197, 94, 0.22)',
            transform: 'rotateX(75deg) translateZ(-80px)',
            animation: 'trixSpinReverse 22s linear infinite'
          }}
        />

        {/* Ambient Floating Micro-Data Bits around the Emblem */}
        <div
          style={{
            position: 'absolute',
            top: '40px',
            right: '-60px',
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: '9.5px',
            color: isLightMode ? '#059669' : '#4ade80',
            opacity: 0.7,
            letterSpacing: '0.12em',
            transform: 'translateZ(50px)'
          }}
        >
          101_0110
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: '70px',
            left: '-70px',
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: '9.5px',
            color: isLightMode ? '#059669' : '#4ade80',
            opacity: 0.65,
            letterSpacing: '0.12em',
            transform: 'translateZ(40px)'
          }}
        >
          01010
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: '20px',
            right: '-40px',
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: '9.5px',
            color: isLightMode ? '#059669' : '#4ade80',
            opacity: 0.7,
            letterSpacing: '0.12em',
            transform: 'translateZ(60px)'
          }}
        >
          00100110
        </div>

        {/* ==========================================================
            TRUE 3D VOLUMETRIC EXTRUDED RARE CRYSTAL LOGO
            ========================================================== */}
        {/* Layer -5: Deepest cast shadow */}
        <div
          style={{
            position: 'absolute',
            width: '280px',
            height: '420px',
            transform: 'translateZ(-40px)',
            filter: 'brightness(0.15) blur(10px)',
            opacity: 0.8
          }}
        >
          <img
            src="/rare-logo-icon.png"
            alt="Extrusion Back"
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </div>

        {/* Layer -4: Rear dark rim */}
        <div
          style={{
            position: 'absolute',
            width: '280px',
            height: '420px',
            transform: 'translateZ(-28px)',
            filter: 'brightness(0.35) drop-shadow(0 25px 35px rgba(0, 0, 0, 0.9))',
            opacity: 0.95
          }}
        >
          <img
            src="/rare-logo-icon.png"
            alt="Extrusion Rim"
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </div>

        {/* Layer -3: Dark extruded body side */}
        <div
          style={{
            position: 'absolute',
            width: '280px',
            height: '420px',
            transform: 'translateZ(-18px)',
            filter: 'brightness(0.55)',
            opacity: 0.95
          }}
        >
          <img
            src="/rare-logo-icon.png"
            alt="Extrusion Body"
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </div>

        {/* Layer -2: Internal Emerald Laser Glow Core */}
        <div
          style={{
            position: 'absolute',
            width: '320px',
            height: '420px',
            borderRadius: '45%',
            background: 'radial-gradient(ellipse at center, rgba(34, 197, 94, 0.7) 0%, rgba(16, 185, 129, 0.35) 45%, transparent 70%)',
            transform: 'translateZ(-8px)',
            filter: 'blur(28px)',
            pointerEvents: 'none'
          }}
        />

        {/* Layer -1: Front chamfer bevel */}
        <div
          style={{
            position: 'absolute',
            width: '280px',
            height: '420px',
            transform: 'translateZ(-4px)',
            filter: 'brightness(0.85)',
            opacity: 0.98
          }}
        >
          <img
            src="/rare-logo-icon.png"
            alt="Extrusion Bevel"
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </div>

        {/* Layer 0: PRIMARY GLOSSY CRYSTAL FACE (NO BOX OVERLAYS) */}
        <div
          style={{
            position: 'absolute',
            width: '280px',
            height: '420px',
            transform: 'translateZ(18px)',
            filter: isLightMode
              ? 'drop-shadow(0 16px 30px rgba(0, 0, 0, 0.4)) drop-shadow(0 0 35px rgba(16, 185, 129, 0.6))'
              : 'drop-shadow(0 20px 45px rgba(0, 0, 0, 0.8)) drop-shadow(0 0 45px rgba(34, 197, 94, 0.85))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <img
            src="/rare-logo-icon.png"
            alt="RARE 3D Emblem"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              display: 'block'
            }}
          />
        </div>

        {/* ==========================================================
            STAGE 1 TARGETING HUD BRACKET & LASER CALLOUT
            (Visible between scroll 0.22 and 0.52)
            ========================================================== */}
        {scrollProgress >= 0.2 && scrollProgress <= 0.54 && (
          <div
            style={{
              position: 'absolute',
              right: '-180px',
              top: '80px',
              transform: 'translateZ(80px)',
              pointerEvents: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
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
                boxShadow: '0 0 12px #22c55e'
              }}
            />

            {/* Laser Line */}
            <div
              style={{
                width: '100px',
                height: '2px',
                background: 'linear-gradient(90deg, #22c55e 0%, rgba(34, 197, 94, 0.3) 100%)',
                boxShadow: '0 0 10px #22c55e'
              }}
            />

            {/* Target Label */}
            <div
              style={{
                background: 'rgba(5, 28, 12, 0.92)',
                border: '1px solid rgba(34, 197, 94, 0.5)',
                borderRadius: '6px',
                padding: '6px 12px',
                fontSize: '10.5px',
                fontFamily: 'var(--font-jetbrains), monospace',
                color: '#22c55e',
                letterSpacing: '0.12em',
                fontWeight: 800,
                whiteSpace: 'nowrap',
                boxShadow: '0 6px 18px rgba(0, 0, 0, 0.8)'
              }}
            >
              PDA_VAULT // 90% BONDED
            </div>
          </div>
        )}

        {/* ==========================================================
            STAGE 2 FLOATING 3D TELEMETRY CHIPS / SHARDS
            (Visible during White Radar Stage: scroll 0.46 - 0.86)
            ========================================================== */}
        {scrollProgress >= 0.44 && scrollProgress <= 0.88 && (
          <>
            {/* Shard 1: Top Left */}
            <div
              style={{
                position: 'absolute',
                top: '-100px',
                left: '-160px',
                transform: 'translateZ(50px) rotate(-10deg)',
                background: isLightMode ? 'rgba(255, 255, 255, 0.95)' : 'rgba(10, 24, 16, 0.9)',
                border: '1px solid rgba(16, 185, 129, 0.45)',
                boxShadow: isLightMode ? '0 12px 30px rgba(0, 0, 0, 0.12)' : '0 12px 30px rgba(0, 0, 0, 0.7)',
                borderRadius: '8px',
                padding: '10px 16px',
                fontFamily: 'var(--font-jetbrains), monospace',
                fontSize: '11px',
                color: isLightMode ? '#047857' : '#22c55e',
                whiteSpace: 'nowrap'
              }}
            >
              <div style={{ opacity: 0.65, fontSize: '9px' }}>// ARCHITECTURE LAYER</div>
              <div style={{ fontWeight: 800, marginTop: '2px' }}>ANCHOR CPI 90/10</div>
            </div>

            {/* Shard 2: Bottom Right */}
            <div
              style={{
                position: 'absolute',
                bottom: '-60px',
                right: '-180px',
                transform: 'translateZ(60px) rotate(8deg)',
                background: isLightMode ? 'rgba(255, 255, 255, 0.95)' : 'rgba(10, 24, 16, 0.9)',
                border: '1px solid rgba(16, 185, 129, 0.45)',
                boxShadow: isLightMode ? '0 12px 30px rgba(0, 0, 0, 0.12)' : '0 12px 30px rgba(0, 0, 0, 0.7)',
                borderRadius: '8px',
                padding: '10px 16px',
                fontFamily: 'var(--font-jetbrains), monospace',
                fontSize: '11px',
                color: isLightMode ? '#047857' : '#22c55e',
                whiteSpace: 'nowrap'
              }}
            >
              <div style={{ opacity: 0.65, fontSize: '9px' }}>// ORACLE FEED</div>
              <div style={{ fontWeight: 800, marginTop: '2px' }}>PYTH REAL-TIME CONF</div>
            </div>

            {/* Shard 3: Bottom Left */}
            <div
              style={{
                position: 'absolute',
                bottom: '-80px',
                left: '-150px',
                transform: 'translateZ(40px) rotate(-6deg)',
                background: isLightMode ? 'rgba(255, 255, 255, 0.95)' : 'rgba(10, 24, 16, 0.9)',
                border: '1px solid rgba(16, 185, 129, 0.45)',
                boxShadow: isLightMode ? '0 12px 30px rgba(0, 0, 0, 0.12)' : '0 12px 30px rgba(0, 0, 0, 0.7)',
                borderRadius: '8px',
                padding: '10px 16px',
                fontFamily: 'var(--font-jetbrains), monospace',
                fontSize: '11px',
                color: isLightMode ? '#047857' : '#22c55e',
                whiteSpace: 'nowrap'
              }}
            >
              <div style={{ opacity: 0.65, fontSize: '9px' }}>// SWARM MATRIX</div>
              <div style={{ fontWeight: 800, marginTop: '2px' }}>10,078 AGENTS READY</div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
