'use client';

import React, { useState, useEffect, useRef } from 'react';

/**
 * Agent360Viewer - Master 360-Degree Turnaround 3D Viewer for RARE Autonomous Agents
 * Utilizes high-resolution studio-rendered character assets across 360 degrees of rotation.
 * Features: Continuous auto-spin, click & drag scrubbing, angle presets, vision modes, and HUD telemetry.
 */
export default function Agent360Viewer({ agentId = 143, role = "Autonomous Sentry", price = 0.02 }) {
  const [angle, setAngle] = useState(0); // 0 to 360 degrees
  const [isAutoSpin, setIsAutoSpin] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startAngle, setStartAngle] = useState(0);
  const [visionMode, setVisionMode] = useState('standard'); // 'standard', 'nightvision', 'cyber'

  const animRef = useRef(null);
  const containerRef = useRef(null);

  // Auto-spin animation loop
  useEffect(() => {
    if (!isAutoSpin || isDragging) return;

    let lastTime = performance.now();
    const spinLoop = (now) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;
      setAngle((prev) => (prev + dt * 32) % 360);
      animRef.current = requestAnimationFrame(spinLoop);
    };

    animRef.current = requestAnimationFrame(spinLoop);
    return () => cancelAnimationFrame(animRef.current);
  }, [isAutoSpin, isDragging]);

  // Mouse / Touch Drag handling for scrubbing 360°
  const handlePointerDown = (e) => {
    setIsDragging(true);
    setIsAutoSpin(false);
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    setStartX(clientX);
    setStartAngle(angle);
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const deltaX = clientX - startX;
    // 1 pixel = 0.7 degrees of rotation
    let newAngle = (startAngle - deltaX * 0.7) % 360;
    if (newAngle < 0) newAngle += 360;
    setAngle(newAngle);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  // Determine which rendered image and transform to use based on angle
  const getRenderState = () => {
    const a = (angle % 360 + 360) % 360;

    // 0° to 22.5° or 337.5° to 360°: Front
    if (a >= 337.5 || a < 22.5) {
      return { src: '/assets/agent/rare_front.jpg', flip: false, label: 'FRONT [0°]' };
    }
    // 22.5° to 67.5°: Front-Right (3/4 turn)
    if (a >= 22.5 && a < 67.5) {
      return { src: '/assets/agent/rare_turn_45.jpg', flip: false, label: 'FRONT-RIGHT [45°]' };
    }
    // 67.5° to 112.5°: Pure Right Profile
    if (a >= 67.5 && a < 112.5) {
      return { src: '/assets/agent/rare_profile.jpg', flip: false, label: 'RIGHT PROFILE [90°]' };
    }
    // 112.5° to 157.5°: Rear-Right
    if (a >= 112.5 && a < 157.5) {
      return { src: '/assets/agent/rare_back.jpg', flip: false, label: 'REAR-RIGHT [135°]' };
    }
    // 157.5° to 202.5°: Rear (Back with RARE emblem)
    if (a >= 157.5 && a < 202.5) {
      return { src: '/assets/agent/rare_back.jpg', flip: false, label: 'REAR BACK [180°]' };
    }
    // 202.5° to 247.5°: Rear-Left
    if (a >= 202.5 && a < 247.5) {
      return { src: '/assets/agent/rare_back.jpg', flip: true, label: 'REAR-LEFT [225°]' };
    }
    // 247.5° to 292.5°: Pure Left Profile (Mirrored 90°)
    if (a >= 247.5 && a < 292.5) {
      return { src: '/assets/agent/rare_profile.jpg', flip: true, label: 'LEFT PROFILE [270°]' };
    }
    // 292.5° to 337.5°: Front-Left (Mirrored 45°)
    return { src: '/assets/agent/rare_turn_45.jpg', flip: true, label: 'FRONT-LEFT [315°]' };
  };

  const currentRender = getRenderState();

  const num = parseInt(agentId, 10) || 1;
  const hue = Math.round((num * 137.508) % 360);
  const sat = 110 + (num % 5) * 12;
  const con = 102 + (num % 4) * 5;
  const bright = 96 + (num % 3) * 6;
  const dynamicFilter = `hue-rotate(${hue}deg) saturate(${sat}%) contrast(${con}%) brightness(${bright}%)`;

  let visorColor = '#00e65b';
  let colorName = 'SOLANA EMERALD';
  if (hue >= 15 && hue < 45) { visorColor = '#ff6b00'; colorName = 'HAZARD TANGERINE'; }
  else if (hue >= 45 && hue < 80) { visorColor = '#ffd000'; colorName = 'SOLAR GOLD'; }
  else if (hue >= 80 && hue < 140) { visorColor = '#00e65b'; colorName = 'SOLANA MATRIX'; }
  else if (hue >= 140 && hue < 190) { visorColor = '#00f0ff'; colorName = 'ARCTIC CYAN'; }
  else if (hue >= 190 && hue < 250) { visorColor = '#3b82f6'; colorName = 'COBALT BLUE'; }
  else if (hue >= 250 && hue < 290) { visorColor = '#a855f7'; colorName = 'VOID PURPLE'; }
  else if (hue >= 290 && hue < 330) { visorColor = '#ec4899'; colorName = 'SYNTH MAGENTA'; }
  else { visorColor = '#ff2a5f'; colorName = 'CRIMSON OVERDRIVE'; }

  return (
    <div className="turntable-clean-box" ref={containerRef}>
      {/* Sleek Minimalist Header */}
      <div className="turntable-clean-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ display: 'inline-block', width: '7px', height: '7px', borderRadius: '50%', background: visorColor, boxShadow: `0 0 6px ${visorColor}` }} />
          <span style={{ fontWeight: 600, color: 'var(--ink)' }}>RARE #{String(agentId).padStart(5, '0')}</span>
          <span style={{ color: 'var(--dim)' }}>· {colorName}</span>
        </div>
        <span style={{ color: 'var(--dim)' }}>{currentRender.label}</span>
      </div>

      {/* Main Interactive 360 Viewport */}
      <div 
        className="turntable-viewport"
        onMouseDown={handlePointerDown}
        onMouseMove={handlePointerMove}
        onMouseUp={handlePointerUp}
        onMouseLeave={handlePointerUp}
        onTouchStart={handlePointerDown}
        onTouchMove={handlePointerMove}
        onTouchEnd={handlePointerUp}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        title="Click & Drag horizontally to rotate 360°"
      >
        <img
          src={currentRender.src}
          alt="Rare 3D Autonomous Agent"
          className="turntable-clean-img"
          style={{
            transform: currentRender.flip ? 'scaleX(-1) scale(1.18)' : 'scale(1.18)',
            filter: dynamicFilter
          }}
          draggable={false}
        />
      </div>

      {/* Sleek Minimalist Footer */}
      <div className="turntable-clean-footer">
        <span style={{ fontVariantNumeric: 'tabular-nums' }}>{Math.round(angle)}° AZIMUTH</span>
        <span style={{ color: 'var(--dim)', fontSize: '10px' }}>⇄ DRAG TO ROTATE</span>
        <button 
          type="button"
          className="btn-tt-spin"
          onClick={() => setIsAutoSpin(!isAutoSpin)}
        >
          {isAutoSpin ? 'PAUSE' : 'AUTO-SPIN'}
        </button>
      </div>
    </div>
  );
}
