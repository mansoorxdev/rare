'use client';

import React, { useState } from 'react';
import { getAgentMetadata } from '../lib/agentMetadata';

export default function Agent360Viewer({ agentId = 1, onChangeAgent }) {
  const num = parseInt(agentId, 10) || 1;
  const currentAgent = getAgentMetadata(num);
  const [isHovered, setIsHovered] = useState(false);

  const imgSrc = currentAgent.image || `/nfts/${num}.svg`;

  return (
    <div className="w-full flex flex-col items-center">
      {/* Active Selected Agent Badge Bar */}
      <div className="w-full max-w-[460px] flex items-center justify-between pb-2 mb-3 border-b border-line font-mono text-[12px]">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-mint animate-pulse" />
          <span className="font-medium text-cream">
            RARE #{String(num).padStart(5, '0')}
          </span>
        </div>
        <span className="text-[11px] text-dim uppercase tracking-wider truncate max-w-[240px]">
          {currentAgent.role} · {currentAgent.archetype}
        </span>
      </div>

      {/* Hero NFT Viewport */}
      <div
        className="relative w-full max-w-[460px] aspect-square rounded-xl border border-line bg-surface-1 flex items-center justify-center p-8 overflow-hidden select-none shadow-2xl transition-[border-color] duration-200 hover:border-line-strong"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        title={`Rare #${String(num).padStart(5, '0')} - 24x24 Vector Pixel NFT`}
      >
        {/* Subtle Ambient Glow */}
        <div
          className="absolute inset-0 opacity-20 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${currentAgent.color || '#00E599'} 0%, transparent 70%)`,
            opacity: isHovered ? 0.35 : 0.2
          }}
        />

        {/* Vector Pixel Art Image */}
        <img
          src={imgSrc}
          alt={currentAgent.name || `Rare #${num}`}
          className="relative z-10 max-w-[80%] max-h-[80%] w-auto h-auto object-contain filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.7)] transition-transform duration-200"
          style={{
            transform: isHovered ? 'scale(1.05)' : 'scale(1)'
          }}
        />

        {/* Change character button at bottom */}
        {onChangeAgent && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChangeAgent();
              }}
              className="rounded-full border border-line bg-surface-2/90 backdrop-blur-md px-4 py-1.5 font-mono text-[11px] text-muted hover:text-cream hover:border-line-strong hover:bg-surface-3 transition-colors flex items-center gap-1.5 cursor-pointer shadow-lg"
              title="Click to cycle agent"
            >
              <span className="text-mint text-[12px]">↻</span>
              <span>Change Agent</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
