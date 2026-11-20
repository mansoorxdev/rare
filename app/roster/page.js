'use client';

import React, { useState, useMemo } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { usePrivy } from '../../components/PrivyClientProvider';
import { getAgentMetadata } from '../../lib/agentMetadata';

export default function RosterPage() {
  const { ready, authenticated, login } = usePrivy();
  const [search, setSearch] = useState('');
  const [rarityFilter, setRarityFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [inspectedAgent, setInspectedAgent] = useState(null);
  const [isMinting, setIsMinting] = useState(false);
  const [mintCelebration, setMintCelebration] = useState(null);
  const pageSize = 16;
  const totalAgents = 10078;

  const handleMintAgent = (agent) => {
    if (!agent) return;
    if (ready && !authenticated) {
      login();
      return;
    }

    setIsMinting(true);

    setTimeout(() => {
      const mintedPrice = agent.priceSol || 0.02;
      const deposited = (mintedPrice * 0.9).toFixed(3);
      setIsMinting(false);
      setInspectedAgent(null);
      setMintCelebration({
        ...agent,
        quantity: 1,
        funding: `${deposited} SOL`,
        txHash: `4xL7kQ${Math.random().toString(36).substring(2, 8)}wE8${Math.random().toString(36).substring(2, 8)}Sol`
      });
    }, 1800);
  };

  // Generate paginated agent list on the fly based on search/filter
  const { agents, totalPages } = useMemo(() => {
    let result = [];
    const searchTrim = search.trim().toLowerCase();

    // If direct number search
    const directId = parseInt(searchTrim.replace('#', ''), 10);
    if (!isNaN(directId) && directId >= 1 && directId <= totalAgents && searchTrim === String(directId)) {
      const single = getAgentMetadata(directId);
      return {
        agents: [single],
        totalPages: 1
      };
    }

    for (let i = 0; i < pageSize; i++) {
      let agentId = ((page - 1) * pageSize + i) % totalAgents + 1;
      const meta = getAgentMetadata(agentId);

      if (rarityFilter !== 'all' && meta.rarityTier.toLowerCase() !== rarityFilter.toLowerCase()) {
        continue;
      }

      if (searchTrim) {
        const matchesName = meta.name.toLowerCase().includes(searchTrim);
        const matchesRole = meta.role.toLowerCase().includes(searchTrim);
        const matchesArchetype = meta.archetype.toLowerCase().includes(searchTrim);
        if (!matchesName && !matchesRole && !matchesArchetype) continue;
      }

      result.push(meta);
    }

    if (result.length === 0) {
      for (let i = 1; i <= pageSize; i++) {
        result.push(getAgentMetadata(i));
      }
    }

    return {
      agents: result,
      totalPages: Math.ceil(totalAgents / pageSize)
    };
  }, [search, rarityFilter, page]);

  return (
    <div className="min-h-screen bg-black text-cream selection:bg-cream selection:text-black font-sans antialiased">
      <Navbar />

      <main className="page-container">
        {/* Page Header */}
        <div className="mx-auto max-w-[800px] text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-line bg-surface-1 px-3 py-1 font-mono text-[11px] text-dim mb-4">
            <span className="h-1.5 w-1.5 rounded-full bg-mint animate-pulse" />
            <span>SOLANA TOKEN-BOUND ROSTER // 10,078 TOTAL UNITS</span>
          </div>

          <h1 className="font-serif text-[40px] leading-[1.05] text-cream md:text-[56px] font-medium">
            Autonomous Agent Directory
          </h1>
          <p className="mt-4 text-[15px] leading-relaxed text-muted">
            Explore the complete 10,078 genesis roster. Every agent is an on-chain token-bound entity on Solana, possessing its own autonomous PDA execution vault funded by 90% of mint capital.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="rounded-xl border border-line bg-surface-1 p-4 mb-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-[11px] text-dim mr-2 uppercase">Rarity:</span>
            {['all', 'legendary', 'epic', 'rare', 'common'].map((tier) => {
              const isActive = rarityFilter === tier;
              return (
                <button
                  key={tier}
                  type="button"
                  onClick={() => { setRarityFilter(tier); setPage(1); }}
                  className={`rounded-full px-3.5 py-1 text-[12px] font-mono capitalize transition-colors cursor-pointer ${isActive
                      ? 'bg-cream text-black font-medium'
                      : 'border border-line bg-surface-2 text-dim hover:text-cream hover:border-line-strong'
                    }`}
                >
                  {tier}
                </button>
              );
            })}
          </div>

          <div className="w-full md:w-auto">
            <input
              type="text"
              placeholder="Search by ID (#143) or role..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full md:w-[260px] rounded-lg border border-line bg-surface-2 px-3.5 py-1.5 font-mono text-[12px] text-cream placeholder:text-dim focus:border-cream focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Compact, Haute-Couture Agent Grid */}
        <div className="roster-grid mb-14">
          {agents.map((agent) => (
            <div
              key={agent.id}
              onClick={() => setInspectedAgent(agent)}
              className="group cursor-pointer overflow-hidden rounded-lg border border-line bg-surface-1 transition-[transform,background-color,border-color] duration-150 hover:-translate-y-1 hover:border-line-strong hover:bg-surface-2"
            >
              {/* Avatar Box (Square framed token preview) */}
              <div className="roster-card-box">
                <div
                  className="absolute inset-0 opacity-20 group-hover:opacity-35 transition-opacity"
                  style={{
                    background: `radial-gradient(circle at 50% 50%, ${agent.color || '#00E599'} 0%, transparent 70%)`
                  }}
                />

                <div className="roster-card-frame">
                  <img
                    src={`/nfts/${agent.id}.svg`}
                    alt={agent.name}
                    className="pixel-avatar"
                    loading="lazy"
                  />
                </div>

                {/* Badges */}
                <span className="absolute top-2 left-2 z-20 rounded bg-black/75 px-1.5 py-0.5 font-mono text-[9px] text-dim border border-line">
                  #{String(agent.id).padStart(5, '0')}
                </span>
                <span className="absolute top-2 right-2 z-20 rounded bg-black/75 px-1.5 py-0.5 font-mono text-[9px] text-mint border border-line">
                  {agent.rarityTier}
                </span>
              </div>

              {/* Card Meta */}
              <div className="p-3.5">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-serif text-[15px] text-cream font-medium truncate group-hover:text-mint transition-colors">
                    {agent.role}
                  </span>
                  <span className="font-mono text-[11px] text-mint font-medium shrink-0">
                    {agent.priceSol} SOL
                  </span>
                </div>

                <p className="mt-0.5 text-[11px] text-muted truncate">
                  {agent.archetype}
                </p>

                <div className="mt-2.5 flex items-center justify-between border-t border-line/60 pt-2 font-mono text-[10px] text-dim">
                  <span>90% PDA: {agent.pdaFunding}</span>
                  <span className="text-cream/80 group-hover:text-mint transition-colors">Inspect →</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Bar */}
        <div className="flex items-center justify-center gap-4 font-mono text-[12px]">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="rounded-full border border-line bg-surface-1 px-4 py-1.5 text-muted hover:text-cream hover:border-line-strong transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          >
            ← Previous
          </button>

          <span className="text-dim">
            Page <span className="text-cream font-medium">{page}</span> of <span className="text-cream">{totalPages}</span>
          </span>

          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="rounded-full border border-line bg-surface-1 px-4 py-1.5 text-muted hover:text-cream hover:border-line-strong transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          >
            Next →
          </button>
        </div>
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Inspected Agent Modal (Zero emojis, haute-couture) */}
      {inspectedAgent && (
        <div
          className="agent-modal-backdrop"
          onClick={() => setInspectedAgent(null)}
        >
          <div
            className="agent-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setInspectedAgent(null)}
              className="absolute top-4 right-4 rounded-md border border-line bg-surface-2 p-1.5 text-dim hover:text-cream transition-colors cursor-pointer"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <div className="agent-modal-layout">
              <div className="agent-modal-avatar-box">
                <img
                  src={`/nfts/${inspectedAgent.id}.svg`}
                  alt={inspectedAgent.name}
                  className="pixel-avatar"
                />
              </div>

              <div className="agent-modal-info">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] text-dim border border-line px-1.5 rounded">
                    #{String(inspectedAgent.id).padStart(5, '0')}
                  </span>
                  <span className="font-mono text-[11px] text-mint">{inspectedAgent.band}</span>
                </div>

                <h3 className="font-serif text-[24px] text-cream mt-1 font-medium">{inspectedAgent.name}</h3>
                <p className="text-[13px] text-muted">{inspectedAgent.role}</p>

                <div className="mt-4 space-y-1.5 font-mono text-[11px] border-t border-line pt-3">
                  <div className="flex justify-between">
                    <span className="text-dim">Mint Price:</span>
                    <span className="text-cream font-medium">{inspectedAgent.priceSol} SOL</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-dim">90% Vault Deposit:</span>
                    <span className="text-mint font-medium">{(inspectedAgent.priceSol * 0.9).toFixed(3)} SOL</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-dim">PDA Vault:</span>
                    <span className="text-cream truncate max-w-[180px]">{inspectedAgent.pdaVault}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-dim">Rarity Score:</span>
                    <span className="text-cream">{inspectedAgent.rarityScore} ({inspectedAgent.rarityTier})</span>
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => handleMintAgent(inspectedAgent)}
                    disabled={isMinting}
                    className="flex-1 inline-flex h-9 items-center justify-center rounded-full bg-cream text-[13px] font-medium text-black hover:bg-cream/90 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {isMinting ? 'Minting via Anchor...' : `Mint for ${inspectedAgent.priceSol} SOL`}
                  </button>
                  <button
                    type="button"
                    onClick={() => setInspectedAgent(null)}
                    className="inline-flex h-9 items-center justify-center rounded-full border border-line bg-surface-2 px-4 text-[12px] font-medium text-cream hover:bg-surface-3 transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mint Celebration Modal */}
      {mintCelebration && (
        <div
          className="agent-modal-backdrop"
          onClick={() => setMintCelebration(null)}
        >
          <div
            className="agent-celebration-card"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-serif text-[28px] text-cream font-medium">Agent Activated</h3>
            <p className="mt-1 text-[14px] text-muted">{mintCelebration.name} is now live on Solana.</p>

            <div className="my-6 rounded-lg border border-line bg-black/60 p-4 text-left font-mono text-[12px] space-y-2">
              <div className="flex justify-between">
                <span className="text-dim">Token PDA:</span>
                <span className="text-mint font-medium">{mintCelebration.pdaVault}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dim">Deposited (90%):</span>
                <span className="text-cream">{mintCelebration.funding}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dim">Signature:</span>
                <span className="text-dim truncate max-w-[180px]">{mintCelebration.txHash}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setMintCelebration(null)}
              className="w-full inline-flex h-9 items-center justify-center rounded-full bg-cream text-[13px] font-medium text-black hover:bg-cream/90 transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
