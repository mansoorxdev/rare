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
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Active Selected Agent Badge Bar */}
      <div
        style={{
          width: '100%',
          maxWidth: '460px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: '8px',
          marginBottom: '14px',
          borderBottom: '1px solid rgba(0,0,0,0.18)',
          fontFamily: 'var(--font-mono)',
          fontSize: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '8px', height: '8px', background: '#10b981', display: 'inline-block', boxShadow: '1px 1px 0px #000' }} />
          <span style={{ fontWeight: 'bold', fontFamily: 'var(--font-pixel)', fontSize: '13px', color: '#0e2bdf' }}>
            RARE #{String(num).padStart(5, '0')}
          </span>
        </div>
        <span style={{ fontSize: '11px', fontWeight: 700, color: '#3f3f46', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {currentAgent.role} • {currentAgent.archetype}
        </span>
      </div>

      {/* Hero NFT Viewport */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '460px',
          height: '460px',
          border: '2px solid var(--hair-dark)',
          boxShadow: '6px 6px 0px 0px var(--script-blue)',
          background: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '28px',
          overflow: 'hidden',
          userSelect: 'none',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        title={`Rare #${String(num).padStart(5, '0')} - 24x24 Vector Pixel NFT`}
      >
        {/* Crisp Vector Pixel Art Image on Pure White Studio Floor */}
        <img
          src={imgSrc}
          alt={currentAgent.name || `Rare #${num}`}
          style={{
            maxWidth: '82%',
            maxHeight: '82%',
            width: 'auto',
            height: 'auto',
            objectFit: 'contain',
            imageRendering: 'pixelated',
            transition: 'transform 0.2s ease',
            transform: isHovered ? 'scale(1.05)' : 'scale(1)',
            filter: 'drop-shadow(0 14px 20px rgba(0, 0, 0, 0.12))',
          }}
        />

        {/* Change character button at bottom */}
        {onChangeAgent && (
          <div style={{ position: 'absolute', bottom: '16px', left: '50%', transform: 'translateX(-50%)', zIndex: 10 }}>
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
