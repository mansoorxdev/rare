'use client';

import React, { useState } from 'react';
import Link from 'next/link';

// Sample curated agent cards to display in the purple showcase container
const SHOWCASE_AGENTS = [
  { id: 143, name: 'Rare #00143', role: 'Arbitrage', price: '0.020 SOL', tier: 'Genesis' },
  { id: 140, name: 'Rare #00140', role: 'Liquidity', price: '0.020 SOL', tier: 'Genesis' },
  { id: 141, name: 'Rare #00141', role: 'Momentum', price: '0.020 SOL', tier: 'Genesis' },
  { id: 142, name: 'Rare #00142', role: 'Sentinel', price: '0.020 SOL', tier: 'Genesis' },
  { id: 144, name: 'Rare #00144', role: 'Rebalancer', price: '0.020 SOL', tier: 'Genesis' },
  { id: 145, name: 'Rare #00145', role: 'Grid Trader', price: '0.020 SOL', tier: 'Genesis' },
];

export default function GammaHeroShowcase({ activeIndex = 0, onSelectAgent }) {
  return (
    <div className="w-full max-w-[580px] rounded-[28px] bg-gradient-to-br from-[#9333ea] via-[#7e22ce] to-[#6366f1] p-5 sm:p-7 shadow-[0_30px_70px_-15px_rgba(126,34,206,0.35)] relative overflow-hidden transition-all duration-300">
      {/* Decorative ambient glass light reflection */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-indigo-500/30 blur-3xl" />

      {/* Grid of stacked cards matching the Gamma Mobbin composition */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4 relative z-10">
        {SHOWCASE_AGENTS.map((agent, idx) => (
          <div
            key={agent.id}
            onClick={() => onSelectAgent && onSelectAgent(agent)}
            className="group/card relative cursor-pointer transition-all duration-200 hover:-translate-y-1.5"
          >
            {/* Card Background Stack Layer (creates the multi-edition stacked paper illusion like Gamma) */}
            <div className="absolute inset-0 translate-y-1 translate-x-1 rounded-2xl bg-black/25 blur-[1px] transition-transform group-hover/card:translate-y-2" />
            <div className="absolute inset-0 translate-y-0.5 rounded-2xl bg-white/40 opacity-70" />

            {/* Main Foreground Card */}
            <div className="relative rounded-2xl bg-white p-2 sm:p-2.5 shadow-md border border-white/60 overflow-hidden">
              {/* NFT Image Frame */}
              <div className="aspect-square w-full rounded-xl bg-gradient-to-b from-neutral-100 to-neutral-200/60 overflow-hidden relative flex items-center justify-center p-2">
                <img
                  src={`/nfts/${agent.id}.svg`}
                  alt={agent.name}
                  className="w-full h-full object-contain drop-shadow-sm transition-transform duration-200 group-hover/card:scale-105"
                  loading="eager"
                />
                <span className="absolute top-1.5 left-1.5 rounded-full bg-black/75 px-1.5 py-0.5 font-mono text-[8.5px] font-medium text-white shadow-sm">
                  #{agent.id}
                </span>
              </div>

              {/* Card Label info */}
              <div className="mt-2 px-0.5">
                <div className="flex items-center justify-between text-[11px] font-semibold text-neutral-900 truncate">
                  <span className="truncate">{agent.name}</span>
                </div>
                <div className="flex items-center justify-between text-[9.5px] text-neutral-500 font-mono mt-0.5">
                  <span>{agent.role}</span>
                  <span className="text-purple-700 font-semibold">{agent.price}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
