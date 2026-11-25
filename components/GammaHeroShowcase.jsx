'use client';

import React from 'react';

// Curated 6 agents matching the 3x2 grid of prints in the Mobbin Gamma showcase
const SHOWCASE_AGENTS = [
  { id: 143, name: 'Rare #00143', role: 'Arbitrage', price: '0.020 SOL' },
  { id: 140, name: 'Rare #00140', role: 'Liquidity', price: '0.020 SOL' },
  { id: 141, name: 'Rare #00141', role: 'Momentum', price: '0.020 SOL' },
  { id: 142, name: 'Rare #00142', role: 'Sentinel', price: '0.020 SOL' },
  { id: 144, name: 'Rare #00144', role: 'Rebalance', price: '0.020 SOL' },
  { id: 145, name: 'Rare #00145', role: 'Execution', price: '0.020 SOL' },
];

export default function GammaHeroShowcase({ onSelectAgent }) {
  return (
    <div className="gamma-showcase-box">
      {/* Decorative ambient glass light reflection */}
      <div
        className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/25 blur-3xl"
        style={{ zIndex: 0 }}
      />
      <div
        className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-indigo-400/30 blur-3xl"
        style={{ zIndex: 0 }}
      />

      {/* Grid of stacked cards matching the Gamma Mobbin composition */}
      <div className="gamma-showcase-grid">
        {SHOWCASE_AGENTS.map((agent) => (
          <div
            key={agent.id}
            onClick={() => onSelectAgent && onSelectAgent(agent)}
            className="gamma-agent-card"
            title={`View ${agent.name}`}
          >
            <div className="gamma-agent-card-inner">
              {/* NFT Image Frame with fixed max-height and aspect ratio */}
              <div className="gamma-card-img-wrap">
                <img
                  src={`/nfts/${agent.id}.svg`}
                  alt={agent.name}
                  loading="eager"
                />
                <span className="gamma-card-badge">
                  #{agent.id}
                </span>
              </div>

              {/* Card Label info */}
              <div className="gamma-card-info">
                <div className="gamma-card-title">
                  {agent.name}
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
