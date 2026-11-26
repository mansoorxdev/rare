'use client';

import React, { useEffect, useRef, useState } from 'react';

export default function HeurixOperatorHead({ onInteract, isHoveringCta }) {
  const containerRef = useRef(null);
  const [headPos, setHeadPos] = useState({ rotX: 0, rotY: 0, eyeX: 0, eyeY: 0 });
  const [isBlinking, setIsBlinking] = useState(false);

  useEffect(() => {
    let animId;
    let currentRotX = 0;
    let currentRotY = 0;
    let currentEyeX = 0;
    let currentEyeY = 0;

    let targetRotX = 0;
    let targetRotY = 0;
    let targetEyeX = 0;
    let targetEyeY = 0;

    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Normalized coordinates from -1 to 1 based on window width/height
      const normX = Math.max(-1, Math.min(1, (e.clientX - centerX) / (window.innerWidth * 0.5)));
      const normY = Math.max(-1, Math.min(1, (e.clientY - centerY) / (window.innerHeight * 0.5)));

      // Rotation range: Y (-24deg to +24deg), X (-18deg to +18deg)
      targetRotY = normX * 24;
      targetRotX = -normY * 18;

      // Eye pupil offset inside the CRT screen (-18px to +18px X, -12px to +12px Y)
      targetEyeX = normX * 18;
      targetEyeY = normY * 12;
    };

    // Auto idle breathing when mouse is still or offscreen
    let idleAngle = 0;
    const updateMotion = () => {
      idleAngle += 0.02;
      const idleOffset = Math.sin(idleAngle) * 2;

      // Spring lerp smoothing (0.08)
      currentRotX += (targetRotX + idleOffset - currentRotX) * 0.08;
      currentRotY += (targetRotY - currentRotY) * 0.08;
      currentEyeX += (targetEyeX - currentEyeX) * 0.12;
      currentEyeY += (targetEyeY + idleOffset * 0.5 - currentEyeY) * 0.12;

      setHeadPos({
        rotX: currentRotX,
        rotY: currentRotY,
        eyeX: currentEyeX,
        eyeY: currentEyeY
      });

      animId = requestAnimationFrame(updateMotion);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    animId = requestAnimationFrame(updateMotion);

    // Occasional blinking animation
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 140);
    }, 4200);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animId);
      clearInterval(blinkInterval);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="heurix-operator-wrapper"
      onClick={onInteract}
      style={{
        perspective: '1200px',
        userSelect: 'none',
        position: 'relative',
        width: '100%',
        maxWidth: '480px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      {/* 3D Rotatable Head & Torso Assembly */}
      <div
        className="heurix-operator-assembly"
        style={{
          transformStyle: 'preserve-3d',
          transform: `rotateY(${headPos.rotY}deg) rotateX(${headPos.rotX}deg)`,
          transition: 'transform 0.04s linear',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative'
        }}
      >
        {/* ========================================================
            1. RETRO CRT COMPUTER MONITOR HEAD
            ======================================================== */}
        <div
          className="heurix-crt-head"
          style={{
            width: '280px',
            height: '250px',
            background: 'linear-gradient(145deg, #e5e0d4 0%, #d8d2c4 45%, #c4bdad 100%)',
            borderRadius: '28px',
            border: '2px solid #b5ae9d',
            boxShadow: `
              ${-headPos.rotY * 0.8}px ${18 + headPos.rotX * 0.5}px 40px rgba(0, 0, 0, 0.65),
              inset 0 2px 4px rgba(255, 255, 255, 0.6),
              inset 0 -4px 8px rgba(0, 0, 0, 0.2)
            `,
            position: 'relative',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '20px 22px 14px 22px',
            transform: 'translateZ(30px)'
          }}
        >
          {/* Top Cooling Louvers/Vents */}
          <div
            style={{
              position: 'absolute',
              top: '8px',
              display: 'flex',
              gap: '6px',
              opacity: 0.35
            }}
          >
            {[...Array(6)].map((_, i) => (
              <span
                key={i}
                style={{
                  width: '18px',
                  height: '2px',
                  background: '#6d6759',
                  borderRadius: '1px'
                }}
              />
            ))}
          </div>

          {/* Curved Inner CRT Screen Frame */}
          <div
            className="heurix-crt-screen-bezel"
            style={{
              width: '100%',
              height: '168px',
              background: '#1a1c1d',
              borderRadius: '20px',
              border: '3px solid #7d7768',
              boxShadow: `
                inset 0 4px 12px rgba(0, 0, 0, 0.9),
                0 1px 2px rgba(255, 255, 255, 0.3)
              `,
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {/* Screen Glass Depth & Curvature Glow */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(ellipse at 50% 45%, #181b1d 0%, #0d0f10 80%, #050607 100%)',
                zIndex: 1
              }}
            />

            {/* CRT Horizontal Phosphor Scanlines */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: 'repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.35) 0px, rgba(0, 0, 0, 0.35) 1.5px, transparent 1.5px, transparent 3px)',
                pointerEvents: 'none',
                zIndex: 4,
                opacity: 0.75
              }}
            />

            {/* Glass Glare Reflection Line */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '45%',
                background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.02) 60%, transparent 100%)',
                borderTopLeftRadius: '16px',
                borderTopRightRadius: '16px',
                pointerEvents: 'none',
                zIndex: 5
              }}
            />

            {/* ========================================================
                ACTIVE EYE PUPILS TRACKING CURSOR
                ======================================================== */}
            <div
              className="heurix-screen-eyes"
              style={{
                position: 'relative',
                zIndex: 3,
                display: 'flex',
                alignItems: 'center',
                gap: '42px',
                transform: `translate(${headPos.eyeX}px, ${headPos.eyeY}px)`,
                transition: 'transform 0.05s ease-out'
              }}
            >
              {/* Left Eye */}
              <div
                style={{
                  width: isBlinking ? '28px' : '28px',
                  height: isBlinking ? '4px' : isHoveringCta ? '20px' : '32px',
                  background: '#f8fafc',
                  borderRadius: isBlinking ? '2px' : isHoveringCta ? '14px 14px 4px 4px' : '50%',
                  boxShadow: '0 0 16px rgba(255, 255, 255, 0.85), 0 0 30px rgba(248, 250, 252, 0.45)',
                  transition: 'height 0.12s ease, border-radius 0.12s ease',
                  position: 'relative'
                }}
              >
                {/* Subtle Eye Sheen */}
                {!isBlinking && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '4px',
                      left: '6px',
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: '#ffffff',
                      opacity: 0.9
                    }}
                  />
                )}
              </div>

              {/* Right Eye */}
              <div
                style={{
                  width: isBlinking ? '28px' : '28px',
                  height: isBlinking ? '4px' : isHoveringCta ? '20px' : '32px',
                  background: '#f8fafc',
                  borderRadius: isBlinking ? '2px' : isHoveringCta ? '14px 14px 4px 4px' : '50%',
                  boxShadow: '0 0 16px rgba(255, 255, 255, 0.85), 0 0 30px rgba(248, 250, 252, 0.45)',
                  transition: 'height 0.12s ease, border-radius 0.12s ease',
                  position: 'relative'
                }}
              >
                {!isBlinking && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '4px',
                      left: '6px',
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: '#ffffff',
                      opacity: 0.9
                    }}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Lower CRT Chin Control Panel */}
          <div
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '12px',
              padding: '0 6px'
            }}
          >
            {/* Floppy Drive Slot */}
            <div
              style={{
                width: '130px',
                height: '7px',
                background: '#454136',
                borderRadius: '3px',
                border: '1px solid #756e5d',
                boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.8)'
              }}
            />

            {/* Vintage RARE Badge */}
            <div
              style={{
                fontSize: '9.5px',
                fontWeight: 800,
                letterSpacing: '0.12em',
                fontFamily: 'var(--font-jetbrains), monospace',
                color: '#6e6757',
                textTransform: 'uppercase'
              }}
            >
              RARE // 90%
            </div>

            {/* Amber Status LED */}
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#f59e0b',
                boxShadow: '0 0 8px #f59e0b, 0 0 16px rgba(245, 158, 11, 0.6)',
                border: '1px solid rgba(0, 0, 0, 0.3)'
              }}
            />
          </div>
        </div>

        {/* Neck Swivel Connector */}
        <div
          style={{
            width: '74px',
            height: '24px',
            background: 'linear-gradient(180deg, #1f2224 0%, #111213 100%)',
            borderLeft: '2px solid #333',
            borderRight: '2px solid #333',
            marginTop: '-6px',
            zIndex: 8,
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.7)'
          }}
        />

        {/* ========================================================
            2. TAILORED SUIT & WHITE COLLAR BODY
            ======================================================== */}
        <div
          className="heurix-suit-body"
          style={{
            width: '320px',
            height: '170px',
            background: 'linear-gradient(180deg, #151719 0%, #0d0e10 100%)',
            borderRadius: '40px 40px 0 0',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8)',
            position: 'relative',
            marginTop: '-6px',
            zIndex: 6,
            display: 'flex',
            justifyContent: 'center',
            overflow: 'hidden'
          }}
        >
          {/* White Dress Shirt V-Neck Collar */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              width: '90px',
              height: '80px',
              background: '#f4f1ea',
              clipPath: 'polygon(50% 100%, 0 0, 100% 0)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              boxShadow: 'inset 0 -2px 6px rgba(0, 0, 0, 0.2)'
            }}
          >
            {/* Dark Tie */}
            <div
              style={{
                width: '18px',
                height: '70px',
                background: '#090a0b',
                clipPath: 'polygon(50% 100%, 0 15%, 20% 0, 80% 0, 100% 15%)',
                marginTop: '4px'
              }}
            />
          </div>

          {/* Left Suit Lapel */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: '42px',
              width: '75px',
              height: '120px',
              background: 'linear-gradient(135deg, #1e2124 0%, #111315 100%)',
              clipPath: 'polygon(0 0, 100% 100%, 0 100%)',
              borderRight: '1px solid rgba(255, 255, 255, 0.08)'
            }}
          />

          {/* Right Suit Lapel */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              right: '42px',
              width: '75px',
              height: '120px',
              background: 'linear-gradient(225deg, #1e2124 0%, #111315 100%)',
              clipPath: 'polygon(100% 0, 0 100%, 100% 100%)',
              borderLeft: '1px solid rgba(255, 255, 255, 0.08)'
            }}
          />
        </div>
      </div>

      {/* Meet the Operator Tag Badge */}
      <div
        style={{
          position: 'absolute',
          bottom: '10px',
          right: '-10px',
          background: 'rgba(18, 19, 21, 0.92)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(12px)',
          borderRadius: '12px',
          padding: '8px 14px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6)',
          zIndex: 20,
          pointerEvents: 'none'
        }}
      >
        <div style={{ fontSize: '10px', fontWeight: 800, color: '#f59e0b', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'var(--font-jetbrains), monospace' }}>
          MEET THE OPERATOR
        </div>
        <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '2px' }}>
          Always on-chain. Funded by 90% PDA capital.
        </div>
      </div>
    </div>
  );
}
