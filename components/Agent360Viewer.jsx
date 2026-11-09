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

  return (
    <div className="agent-360-container" ref={containerRef}>
      {/* Top Telemetry Header */}
      <div className="agent-360-header">
        <div className="header-status-left">
          <span className="telemetry-led">●</span>
          <span className="telemetry-title">RARE_AGENT // #{String(agentId).padStart(5, '0')}</span>
        </div>
        <div className="header-status-right">
          <span className="badge-heading">{currentRender.label}</span>
          <span className="badge-360">360° TURNTABLE</span>
        </div>
      </div>

      {/* Main Interactive 360 Viewport */}
      <div 
        className={`agent-image-viewport ${visionMode !== 'standard' ? `vision-${visionMode}` : ''}`}
        onMouseDown={handlePointerDown}
        onMouseMove={handlePointerMove}
        onMouseUp={handlePointerUp}
        onMouseLeave={handlePointerUp}
        onTouchStart={handlePointerDown}
        onTouchMove={handlePointerMove}
        onTouchEnd={handlePointerUp}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        title="Click & Drag horizontally to rotate agent 360°"
      >
        {/* Rendered 3D Character Turnaround Image */}
        <div className="agent-render-wrapper">
          <img
            src={currentRender.src}
            alt="Rare 3D Autonomous Agent"
            className="agent-render-img"
            style={{
              transform: currentRender.flip ? 'scaleX(-1)' : 'none',
              filter: visionMode === 'nightvision' ? 'hue-rotate(60deg) contrast(1.15) brightness(1.05)' : visionMode === 'cyber' ? 'invert(0.9) hue-rotate(180deg)' : 'none'
            }}
            draggable={false}
          />
        </div>

        {/* Scanlines Overlay */}
        <div className="viewport-scanlines" />

        {/* HUD Top Left Drag Hint */}
        <div className="drag-hint">
          <span>⇄ DRAG TO ROTATE 360°</span>
        </div>

        {/* HUD Compass Readout */}
        <div className="hud-azimuth">
          <span>AZIMUTH: {Math.round(angle)}°</span>
        </div>

        {/* HUD Ground Turntable Dial */}
        <div className="turntable-ground-dial">
          <svg viewBox="0 0 300 60" className="dial-svg">
            <ellipse cx="150" cy="30" rx="130" ry="24" fill="none" stroke="#00e65b" strokeWidth="1" strokeDasharray="4 6" opacity="0.4" />
            <circle cx={150 + Math.cos((angle * Math.PI) / 180) * 130} cy={30 + Math.sin((angle * Math.PI) / 180) * 24} r="3" fill="#00e65b" />
          </svg>
        </div>
      </div>

      {/* Interactive Controls Bar */}
      <div className="turntable-controls">
        <div className="controls-row">
          <button 
            type="button"
            className={`btn-control ${isAutoSpin ? 'active' : ''}`}
            onClick={() => setIsAutoSpin(!isAutoSpin)}
          >
            {isAutoSpin ? '⏸ PAUSE' : '▶ AUTO-SPIN'}
          </button>

          {/* Preset Angle Buttons */}
          <div className="preset-angles">
            <button type="button" className={`btn-angle ${Math.round(angle) === 0 ? 'active' : ''}`} onClick={() => { setIsAutoSpin(false); setAngle(0); }}>
              0°
            </button>
            <button type="button" className={`btn-angle ${Math.round(angle) === 45 ? 'active' : ''}`} onClick={() => { setIsAutoSpin(false); setAngle(45); }}>
              45°
            </button>
            <button type="button" className={`btn-angle ${Math.round(angle) === 90 ? 'active' : ''}`} onClick={() => { setIsAutoSpin(false); setAngle(90); }}>
              90°
            </button>
            <button type="button" className={`btn-angle ${Math.round(angle) === 180 ? 'active' : ''}`} onClick={() => { setIsAutoSpin(false); setAngle(180); }}>
              180°
            </button>
            <button type="button" className={`btn-angle ${Math.round(angle) === 270 ? 'active' : ''}`} onClick={() => { setIsAutoSpin(false); setAngle(270); }}>
              270°
            </button>
          </div>
        </div>

        {/* Angle Scrubber Slider */}
        <div className="slider-wrap">
          <span className="slider-label">ROTATION:</span>
          <input 
            type="range" 
            min="0" 
            max="359" 
            value={Math.round(angle)}
            onChange={(e) => {
              setIsAutoSpin(false);
              setAngle(parseFloat(e.target.value));
            }}
            className="angle-slider"
          />
          <span className="slider-val">{Math.round(angle)}°</span>
        </div>

        {/* Vision Mode Filter Toggles */}
        <div className="tint-selector">
          <span className="tint-label">OPTIC SENSORS:</span>
          <div className="vision-buttons">
            <button 
              type="button" 
              className={`btn-vision ${visionMode === 'standard' ? 'active' : ''}`}
              onClick={() => setVisionMode('standard')}
            >
              STUDIO
            </button>
            <button 
              type="button" 
              className={`btn-vision ${visionMode === 'nightvision' ? 'active' : ''}`}
              onClick={() => setVisionMode('nightvision')}
            >
              NIGHT OPS
            </button>
            <button 
              type="button" 
              className={`btn-vision ${visionMode === 'cyber' ? 'active' : ''}`}
              onClick={() => setVisionMode('cyber')}
            >
              BLUEPRINT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
