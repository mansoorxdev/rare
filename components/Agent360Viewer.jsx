'use client';

import React, { useState, useEffect, useRef } from 'react';

/**
 * TURNTABLE_FRAMES — 8 discrete pre-rendered viewing angles in 360° space.
 * All frames are pre-mounted in the DOM so src is NEVER switched dynamically.
 * This guarantees zero flickering, zero image unload/disappearance, and silky smooth 60fps rotation.
 */
const TURNTABLE_FRAMES = [
  { id: 'f0',   src: '/assets/agent/rare_front.jpg',   flip: false, centerDeg: 0 },
  { id: 'f45',  src: '/assets/agent/rare_turn_45.jpg', flip: false, centerDeg: 45 },
  { id: 'f90',  src: '/assets/agent/rare_profile.jpg', flip: false, centerDeg: 90 },
  { id: 'f135', src: '/assets/agent/rare_back.jpg',    flip: false, centerDeg: 135 },
  { id: 'f180', src: '/assets/agent/rare_back.jpg',    flip: false, centerDeg: 180 },
  { id: 'f225', src: '/assets/agent/rare_back.jpg',    flip: true,  centerDeg: 225 },
  { id: 'f270', src: '/assets/agent/rare_profile.jpg', flip: true,  centerDeg: 270 },
  { id: 'f315', src: '/assets/agent/rare_turn_45.jpg', flip: true,  centerDeg: 315 },
];

export default function Agent360Viewer({ agentId = 143, price = 0.02 }) {
  const [angle, setAngle] = useState(0); // 0 to 360 degrees
  const [isAutoSpin, setIsAutoSpin] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startAngle, setStartAngle] = useState(0);

  const containerRef = useRef(null);
  const animRef = useRef(null);

  // Preload all angle assets into memory on mount to prevent any decode lag
  useEffect(() => {
    const uniqueUrls = [
      '/assets/agent/rare_front.jpg',
      '/assets/agent/rare_turn_45.jpg',
      '/assets/agent/rare_profile.jpg',
      '/assets/agent/rare_back.jpg'
    ];
    uniqueUrls.forEach((url) => {
      const img = new Image();
      img.src = url;
    });
  }, []);

  // 60FPS continuous auto-spin animation loop
  useEffect(() => {
    if (!isAutoSpin || isDragging) return;

    let lastTime = performance.now();
    const spinLoop = (now) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;
      // Smooth 22 degrees per second rotation
      setAngle((prev) => (prev + dt * 24) % 360);
      animRef.current = requestAnimationFrame(spinLoop);
    };

    animRef.current = requestAnimationFrame(spinLoop);
    return () => cancelAnimationFrame(animRef.current);
  }, [isAutoSpin, isDragging]);

  // Pointer drag handling with pointer capture for buttery smooth interaction
  const handlePointerDown = (e) => {
    setIsDragging(true);
    setIsAutoSpin(false);
    const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    setStartX(clientX);
    setStartAngle(angle);

    if (e.target && e.target.setPointerCapture && e.pointerId !== undefined) {
      try {
        e.target.setPointerCapture(e.pointerId);
      } catch (err) {}
    }
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const deltaX = clientX - startX;
    // 0.65 deg per pixel sensitivity
    let newAngle = (startAngle - deltaX * 0.65) % 360;
    if (newAngle < 0) newAngle += 360;
    setAngle(newAngle);
  };

  const handlePointerUp = (e) => {
    setIsDragging(false);
    if (e.target && e.target.releasePointerCapture && e.pointerId !== undefined) {
      try {
        e.target.releasePointerCapture(e.pointerId);
      } catch (err) {}
    }
  };

  // Compute active frame index (0..7) based on continuous angle
  const normalizedAngle = ((angle % 360) + 360) % 360;
  // Sector 0 is [-22.5, +22.5], Sector 1 is [22.5, 67.5], etc.
  const activeFrameIndex = Math.floor(((normalizedAngle + 22.5) % 360) / 45);

  // Subtle continuous 3D yaw (-6deg to +6deg) between frame centers for silky continuous motion
  const centerOfSector = activeFrameIndex * 45;
  let angleDiff = normalizedAngle - centerOfSector;
  if (angleDiff > 180) angleDiff -= 360;
  if (angleDiff < -180) angleDiff += 360;
  const microYaw = (angleDiff / 22.5) * 6;

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '520px',
        aspectRatio: '1',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        justifySelf: 'center',
        userSelect: 'none',
        touchAction: 'none',
        cursor: isDragging ? 'grabbing' : 'grab',
        perspective: '1000px'
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {/* 
        Pre-mounted frame stack: ALL 8 angle frames exist permanently in the DOM.
        We only toggle visibility & opacity, so images NEVER unload or disappear!
      */}
      {TURNTABLE_FRAMES.map((frame, idx) => {
        const isActive = activeFrameIndex === idx;
        const flipTransform = frame.flip ? 'scaleX(-1)' : '';
        const yawTransform = `rotateY(${microYaw}deg)`;
        const combinedTransform = [flipTransform, yawTransform].filter(Boolean).join(' ') || 'none';

        return (
          <img
            key={frame.id}
            src={frame.src}
            alt="Rare agent 3D view"
            className="spin"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              pointerEvents: 'none',
              transform: combinedTransform,
              opacity: isActive ? 1 : 0,
              visibility: isActive ? 'visible' : 'hidden',
              transition: 'opacity 0.08s ease-out, transform 0.04s linear',
              willChange: 'transform, opacity'
            }}
            draggable={false}
          />
        );
      })}

      {/* Minimalist Obol-style Angle & Spin Control */}
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
          background: 'rgba(236,233,226,0.9)',
          backdropFilter: 'blur(4px)',
          padding: '3px 8px',
          borderRadius: '3px',
          zIndex: 10
        }}
      >
        <span style={{ fontVariantNumeric: 'tabular-nums' }}>{Math.round(normalizedAngle)}°</span>
        <button
          type="button"
          className="txt"
          onClick={(e) => {
            e.stopPropagation();
            setIsAutoSpin(!isAutoSpin);
          }}
          style={{ padding: 0, fontSize: '11px', cursor: 'pointer' }}
        >
          {isAutoSpin ? 'pause' : 'spin'}
        </button>
      </div>
    </div>
  );
}
