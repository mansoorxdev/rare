'use client';

import React, { useState, useEffect, useRef } from 'react';

/**
 * Agent360Viewer — Minimalist Obol-style 3D Turnaround Viewer
 * Seamlessly integrates into the hero section with zero border clutter.
 */
export default function Agent360Viewer({ agentId = 143, price = 0.02 }) {
  const [angle, setAngle] = useState(0); // 0 to 360 degrees
  const [isAutoSpin, setIsAutoSpin] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startAngle, setStartAngle] = useState(0);

  const animRef = useRef(null);

  // Auto-spin animation loop
  useEffect(() => {
    if (!isAutoSpin || isDragging) return;

    let lastTime = performance.now();
    const spinLoop = (now) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;
      setAngle((prev) => (prev + dt * 28) % 360);
      animRef.current = requestAnimationFrame(spinLoop);
    };

    animRef.current = requestAnimationFrame(spinLoop);
    return () => cancelAnimationFrame(animRef.current);
  }, [isAutoSpin, isDragging]);

  // Pointer drag handling
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
    let newAngle = (startAngle - deltaX * 0.7) % 360;
    if (newAngle < 0) newAngle += 360;
    setAngle(newAngle);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  // Determine angle render asset
  const getRenderState = () => {
    const a = (angle % 360 + 360) % 360;
    if (a >= 337.5 || a < 22.5) {
      return { src: '/assets/agent/rare_front.jpg', flip: false, label: '0°' };
    }
    if (a >= 22.5 && a < 67.5) {
      return { src: '/assets/agent/rare_turn_45.jpg', flip: false, label: '45°' };
    }
    if (a >= 67.5 && a < 112.5) {
      return { src: '/assets/agent/rare_profile.jpg', flip: false, label: '90°' };
    }
    if (a >= 112.5 && a < 157.5) {
      return { src: '/assets/agent/rare_back.jpg', flip: false, label: '135°' };
    }
    if (a >= 157.5 && a < 202.5) {
      return { src: '/assets/agent/rare_back.jpg', flip: false, label: '180°' };
    }
    if (a >= 202.5 && a < 247.5) {
      return { src: '/assets/agent/rare_back.jpg', flip: true, label: '225°' };
    }
    if (a >= 247.5 && a < 292.5) {
      return { src: '/assets/agent/rare_profile.jpg', flip: true, label: '270°' };
    }
    return { src: '/assets/agent/rare_turn_45.jpg', flip: true, label: '315°' };
  };

  const currentRender = getRenderState();

  const num = parseInt(agentId, 10) || 1;
  const hue = Math.round((num * 137.508) % 360);
  const sat = 110 + (num % 5) * 12;
  const con = 102 + (num % 4) * 5;
  const bright = 96 + (num % 3) * 6;
  const dynamicFilter = `hue-rotate(${hue}deg) saturate(${sat}%) contrast(${con}%) brightness(${bright}%)`;

  return (
    <div 
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '520px',
        aspectRatio: '1',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        justifySelf: 'center',
        userSelect: 'none'
      }}
    >
      <img
        src={currentRender.src}
        alt="Rare agent turning"
        className="spin"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          cursor: isDragging ? 'grabbing' : 'grab',
          transform: currentRender.flip ? 'scaleX(-1)' : 'none',
          filter: dynamicFilter
        }}
        onMouseDown={handlePointerDown}
        onMouseMove={handlePointerMove}
        onMouseUp={handlePointerUp}
        onMouseLeave={handlePointerUp}
        onTouchStart={handlePointerDown}
        onTouchMove={handlePointerMove}
        onTouchEnd={handlePointerUp}
        draggable={false}
      />
      <div 
        style={{
          position: 'absolute',
          bottom: '8px',
          right: '8px',
          display: 'flex',
          gap: '12px',
          alignItems: 'center',
          font: '400 11px var(--mono)',
          color: 'var(--dim)',
          background: 'rgba(236,233,226,0.85)',
          padding: '3px 8px',
          borderRadius: '3px'
        }}
      >
        <span style={{ fontVariantNumeric: 'tabular-nums' }}>{Math.round(angle)}°</span>
        <button
          type="button"
          className="txt"
          onClick={() => setIsAutoSpin(!isAutoSpin)}
          style={{ padding: 0, fontSize: '11px' }}
        >
          {isAutoSpin ? 'pause' : 'spin'}
        </button>
      </div>
    </div>
  );
}
