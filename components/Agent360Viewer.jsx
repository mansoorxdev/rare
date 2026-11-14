'use client';

import React, { useState } from 'react';
import { getAgentMetadata } from '../lib/agentMetadata';

export default function Agent360Viewer({ agentId = 1, price = 0.02, onChangeAgent }) {
  const num = parseInt(agentId, 10) || 1;
  const currentAgent = getAgentMetadata(num);
  const [isHovered, setIsHovered] = useState(false);

  // Fallback to /nfts/1.svg if image not set
  const imgSrc = currentAgent.image || `/nfts/${num}.svg`;

  return (
    <div className="w-full flex flex-col items-center">
      {/* Active Selected Agent Badge Bar */}
      <div className="w-full max-w-[460px] flex items-center justify-between pb-2 mb-2 border-b border-black/20 font-mono text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-[#10b981] inline-block shadow-[1px_1px_0px_#000]" />
          <span className="font-bold font-pixel text-xs text-[#0e2bdf]">
            RARE #{String(num).padStart(5, '0')}
          </span>
        </div>
        <span className="text-[11px] font-bold text-zinc-700 uppercase tracking-wide">
          {currentAgent.role} • {currentAgent.archetype}
        </span>
      </div>

      {/* Hero NFT Viewport */}
      <div
        className="relative w-full mx-auto select-none overflow-hidden flex items-center justify-center p-6 transition-all duration-300"
        style={{
          maxWidth: '460px',
          height: '520px',
          border: '2px solid var(--hair-dark)',
          boxShadow: '6px 6px 0px 0px var(--script-blue)',
          background: '#0a0e17',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        title={`Rare #${String(num).padStart(5, '0')} - 24x24 Vector Pixel NFT`}
      >
        {/* Crisp Vector Pixel Art Image */}
        <img
          src={imgSrc}
          alt={currentAgent.name || `Rare #${num}`}
          className="w-full h-full object-contain transition-transform duration-300"
          style={{
            imageRendering: 'pixelated',
            transform: isHovered ? 'scale(1.05)' : 'scale(1)',
            filter: 'drop-shadow(0 12px 28px rgba(0, 240, 255, 0.35))'
          }}
        />

        {/* Change character button at bottom */}
        {onChangeAgent && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 pointer-events-auto">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChangeAgent();
              }}
              className="btn-secondary"
              style={{
                padding: '6px 14px',
                fontSize: '11px',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                letterSpacing: '0.06em',
                background: '#ffffff',
                border: '2px solid var(--hair-dark)',
                boxShadow: '2px 2px 0px #000',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
              }}
              title="Click to pick another unsold agent"
            >
              <span style={{ fontSize: '12px' }}>↻</span>
              <span>change</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
