'use client';

import React from 'react';

// Curated showcase agents matching Rarible Web's featured marketplace spotlight
const SHOWCASE_AGENTS = [
  { id: 143, name: 'Rare #00143', role: 'Arbitrage', price: '0.020 SOL', tier: 'Legendary' },
  { id: 140, name: 'Rare #00140', role: 'Sentinel', price: '0.020 SOL', tier: 'Epic' },
  { id: 141, name: 'Rare #00141', role: 'Execution', price: '0.020 SOL', tier: 'Rare' },
  { id: 142, name: 'Rare #00142', role: 'Rebalance', price: '0.020 SOL', tier: 'Common' },
  { id: 144, name: 'Rare #00144', role: 'Momentum', price: '0.020 SOL', tier: 'Rare' },
  { id: 145, name: 'Rare #00145', role: 'Liquidity', price: '0.020 SOL', tier: 'Epic' },
];

export default function GammaHeroShowcase({ onSelectAgent }) {
  return (
    <div className="gamma-showcase-box">
      {/* Decorative ambient glass light reflection */}
      <div
        className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-purple-500/15 blur-3xl"
        style={{ zIndex: 0 }}
      />
      <div
        className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl"
        style={{ zIndex: 0 }}
      />

      {/* Grid of stacked cards matching the Rarible Web composition */}
      <div className="gamma-showcase-grid">
        {SHOWCASE_AGENTS.map((agent) => (
          <div
            key={agent.id}
            onClick={() => onSelectAgent && onSelectAgent(agent)}
            className="gamma-agent-card"
            title={`View ${agent.name}`}
          >
            <div className="gamma-agent-card-inner">
              {/* NFT Image Frame with high visibility and sharp pixel rendering */}
              <div className="gamma-card-img-wrap">
                <img
                  src={`/nfts/${agent.id}.svg`}
                  alt={agent.name}
                  loading="eager"
                  style={{
                    width: '88%',
                    height: '88%',
                    maxHeight: '115px',
                    objectFit: 'contain',
                    imageRendering: 'pixelated'
                  }}
                />
                <span className="gamma-card-badge">
                  #{agent.id}
                </span>
              </div>

              {/* Card Label info with Rarible Verified Yellow Check Badge */}
              <div className="gamma-card-info">
                <div className="gamma-card-title" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span>{agent.name}</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="#facc15" style={{ flexShrink: 0 }}>
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                </div>
                <div className="gamma-card-meta">
                  <span>{agent.role}</span>
                  <span className="gamma-card-price">{agent.price}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
