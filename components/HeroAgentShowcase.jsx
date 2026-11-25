'use client';

import React, { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { getAgentMetadata } from '../lib/agentMetadata';

export default function HeroAgentShowcase({ agentId = 143, onMintClick, isMinting }) {
  const containerRef = useRef(null);
  const cardRef = useRef(null);
  const glowRef = useRef(null);
  const [currentId, setCurrentId] = useState(agentId);
  const agent = getAgentMetadata(currentId);

  // Showcase cycle list
  const showcaseIds = [143, 42, 128, 1420, 3391];

  const handleNextAgent = () => {
    const nextIdx = (showcaseIds.indexOf(currentId) + 1) % showcaseIds.length;
    const nextId = showcaseIds[nextIdx];

    // GSAP flip/fade transition
    if (cardRef.current) {
      gsap.to(cardRef.current, {
        scale: 0.94,
        opacity: 0.5,
        duration: 0.18,
        ease: 'power2.in',
        onComplete: () => {
          setCurrentId(nextId);
          gsap.to(cardRef.current, {
            scale: 1,
            opacity: 1,
            duration: 0.35,
            ease: 'back.out(1.5)'
          });
        }
      });
    } else {
      setCurrentId(nextId);
    }
  };

  useGSAP(
    () => {
      // Ambient floating motion
      gsap.to(cardRef.current, {
        y: -10,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });

      // Subtle breathing ambient glow
      if (glowRef.current) {
        gsap.to(glowRef.current, {
          scale: 1.2,
          opacity: 0.45,
          duration: 3.5,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        });
      }
    },
    { scope: containerRef }
  );

  // 3D Pointer Tilt Effect (from animaxxing pointer-effects recipe)
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    gsap.to(cardRef.current, {
      rotationY: x * 16,
      rotationX: -y * 16,
      transformPerspective: 1000,
      ease: 'power2.out',
      duration: 0.4
    });
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    gsap.to(cardRef.current, {
      rotationY: 0,
      rotationX: 0,
      ease: 'power3.out',
      duration: 0.8
    });
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-[460px] mx-auto flex items-center justify-center p-4 select-none"
    >
      {/* Ambient Breathing Radial Aura behind card */}
      <div
        ref={glowRef}
        aria-hidden="true"
        className="pointer-events-none absolute h-[320px] w-[320px] rounded-full blur-[80px]"
        style={{
          background: 'radial-gradient(circle, rgba(0, 229, 153, 0.28) 0%, rgba(250, 200, 143, 0.12) 45%, transparent 70%)',
          zIndex: 0
        }}
      />

      {/* 3D Glassmorphic Agent Showcase Card */}
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative z-10 w-full rounded-2xl border border-line bg-surface-1/90 backdrop-blur-xl p-6 shadow-2xl transition-[border-color] duration-300 hover:border-mint/40"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Card Header: Agent Title & Live Badge */}
        <div className="flex items-center justify-between border-b border-line pb-3.5">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-mint opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-mint" />
            </span>
            <span className="font-serif text-[18px] text-cream font-medium tracking-wide">
              {agent.name}
            </span>
          </div>
          <span className="rounded-full border border-mint/30 bg-mint/10 px-2.5 py-0.5 font-mono text-[10.5px] font-medium text-mint uppercase tracking-wider">
            {agent.rarityTier}
          </span>
        </div>

        {/* Character Visual Box */}
        <div className="relative my-5 flex aspect-square w-full items-center justify-center rounded-xl border border-line bg-black/60 p-6 overflow-hidden">
          {/* Subtle grid pattern background */}
          <div
            className="pointer-events-none absolute inset-0 opacity-15"
            style={{
              backgroundImage: 'radial-gradient(rgba(246, 239, 226, 0.25) 1px, transparent 1px)',
              backgroundSize: '16px 16px'
            }}
          />

          {/* Character Vector SVG */}
          <img
            src={`/nfts/${currentId}.svg`}
            alt={agent.name}
            className="relative z-10 max-h-[82%] max-w-[82%] object-contain drop-shadow-[0_16px_32px_rgba(0,0,0,0.85)] filter"
          />

          {/* Bottom Badge inside frame */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between rounded-lg border border-line bg-surface-1/80 backdrop-blur-md px-3 py-1.5 font-mono text-[11px] text-dim">
            <span className="truncate max-w-[180px]">{agent.archetype}</span>
            <span className="text-mint font-medium">{agent.rarityScore}% SCORE</span>
          </div>
        </div>

        {/* On-Chain PDA Telemetry Specs */}
        <div className="space-y-2 border-t border-line pt-4 font-mono text-[11.5px]">
          <div className="flex items-center justify-between text-muted">
            <span className="text-dim">Token-Bound PDA:</span>
            <span className="text-cream font-medium truncate max-w-[200px]" title={agent.pdaVault}>
              {agent.pdaVault}
            </span>
          </div>
          <div className="flex items-center justify-between text-muted">
            <span className="text-dim">Capital Split:</span>
            <span className="text-mint font-medium">90% Bonded to Vault</span>
          </div>
          <div className="flex items-center justify-between text-muted">
            <span className="text-dim">Execution Engine:</span>
            <span className="text-cream">{agent.engine}</span>
          </div>
        </div>

        {/* Card Actions: Quick Mint & Cycle Agent */}
        <div className="mt-5 flex items-center gap-3">
          <button
            type="button"
            onClick={() => onMintClick?.(agent)}
            disabled={isMinting}
            className="flex-1 inline-flex h-10 items-center justify-center rounded-full bg-cream px-4 font-sans text-[13px] font-semibold text-black transition-all hover:bg-cream/90 hover:shadow-[0_0_20px_rgba(246,239,226,0.3)] cursor-pointer disabled:opacity-50"
          >
            {isMinting ? 'Minting via CPI...' : `Mint Agent #${currentId} (${agent.priceSol.toFixed(3)} SOL)`}
          </button>

          <button
            type="button"
            onClick={handleNextAgent}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface-2 text-muted hover:border-line-strong hover:text-cream hover:bg-surface-3 transition-colors cursor-pointer"
            title="Preview next showcase agent"
          >
            <span className="text-mint text-[15px]">↻</span>
          </button>
        </div>
      </div>
    </div>
  );
}
