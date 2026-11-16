'use client';

import React, { useState, useMemo } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { getAgentMetadata } from '../../lib/agentMetadata';

export default function RosterPage() {
  const [search, setSearch] = useState('');
  const [rarityFilter, setRarityFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [inspectedAgent, setInspectedAgent] = useState(null);
  const pageSize = 16;
  const totalAgents = 10078;

  // Generate paginated agent list on the fly based on search/filter
  const { agents, totalPages, totalMatches } = useMemo(() => {
    let result = [];
    const searchTrim = search.trim().toLowerCase();

    // If direct number search
    const directId = parseInt(searchTrim.replace('#', ''), 10);
    if (!isNaN(directId) && directId >= 1 && directId <= totalAgents && searchTrim === String(directId)) {
      const single = getAgentMetadata(directId);
      return {
        agents: [single],
        totalPages: 1,
        totalMatches: 1
      };
    }

    // Windowed sampling across the collection based on active page
    const sampleWindow = 200;
    const startNum = ((page - 1) * pageSize) % (totalAgents - sampleWindow) + 1;

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

    // Fallback fill if filters filtered out some
    if (result.length === 0) {
      for (let i = 1; i <= pageSize; i++) {
        const fallback = getAgentMetadata(i);
        result.push(fallback);
      }
    }

    const calcTotalPages = Math.ceil(totalAgents / pageSize);
    return {
      agents: result,
      totalPages: calcTotalPages,
      totalMatches: totalAgents
    };
  }, [search, rarityFilter, page]);

  return (
    <>
      <Navbar />

      <main className="wrap" style={{ paddingTop: '28px', paddingBottom: '60px' }}>
        {/* Page Header */}
        <div style={{ marginBottom: '32px' }}>
          <div className="ca-pill" style={{ marginBottom: '12px' }}>
            <span className="pulse" />
            <span>SOLANA TOKEN-BOUND ROSTER // 10,078 TOTAL SUPPLY</span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '-0.02em', marginBottom: '8px' }}>
            Autonomous Agent Directory
          </h1>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--dim)', maxWidth: '780px' }}>
            Explore the complete 10,078 genesis roster. Every agent is an on-chain token-bound entity on Solana, possessing its own autonomous PDA execution vault funded by 90% of mint capital.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div style={{ background: 'var(--parchment-accent)', border: '2px solid var(--hair-dark)', boxShadow: '4px 4px 0px #000', padding: '16px 20px', marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, color: 'var(--dim)', marginRight: '6px' }}>
              RARITY:
            </span>
            {['all', 'legendary', 'epic', 'rare', 'common'].map((tier) => (
              <button
                key={tier}
                type="button"
                onClick={() => { setRarityFilter(tier); setPage(1); }}
                className={`role-chip ${rarityFilter === tier ? 'active' : ''}`}
                style={{ textTransform: 'uppercase' }}
              >
                {tier}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Search by ID (#143) or role..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                padding: '8px 12px',
                border: '2px solid var(--hair-dark)',
                background: '#fff',
                color: 'var(--ink)',
                width: '240px',
                outline: 'none',
                boxShadow: '2px 2px 0px #000'
              }}
            />
          </div>
        </div>

        {/* 16-Agent Responsive Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '20px', marginBottom: '40px' }}>
          {agents.map((agent) => (
            <div
              key={agent.id}
              className="agent-card"
              style={{
                background: '#fcfaf5',
                border: '2px solid var(--hair-dark)',
                padding: '16px',
                boxShadow: '4px 4px 0px rgba(0,0,0,0.85)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '12px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--hair)', paddingBottom: '8px' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, background: 'var(--script-green)', color: '#fff', padding: '2px 6px', border: '1px solid #000' }}>
                  #{String(agent.id).padStart(5, '0')}
                </span>
                <span className={`rarity-badge rarity-${agent.rarityTier.toLowerCase()}`}>
                  {agent.rarityTier}
                </span>
              </div>

              {/* Agent SVG Avatar Box */}
              <div
                onClick={() => setInspectedAgent(agent)}
                style={{
                  width: '100%',
                  aspectRatio: '1',
                  background: '#fff',
                  border: '2px solid var(--hair-dark)',
                  boxShadow: '2px 2px 0px #000',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <img
                  src={`/nfts/${agent.id}.svg`}
                  alt={agent.name}
                  style={{ width: '100%', height: '100%', objectFit: 'contain', imageRendering: 'pixelated' }}
                />
              </div>

              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>
                  {agent.role}
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--dim)' }}>
                  Archetype: <b>{agent.archetype}</b>
                </div>
              </div>

              <div style={{ background: 'var(--parchment-accent)', border: '1px solid var(--hair)', padding: '8px', fontSize: '10px', fontFamily: 'var(--font-mono)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                  <span style={{ color: 'var(--dim)' }}>PDA Capital:</span>
                  <span style={{ fontWeight: 700, color: 'var(--script-green-dark)' }}>{agent.pdaFunding}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--dim)' }}>Engine:</span>
                  <span style={{ fontWeight: 700, color: 'var(--ink)' }}>{agent.engine}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setInspectedAgent(agent)}
                className="btn-card-inspect"
                style={{ width: '100%', textAlign: 'center', padding: '7px 0', fontSize: '11px', background: 'var(--script-green)' }}
              >
                Inspect Agent Specs ↗
              </button>
            </div>
          ))}
        </div>

        {/* Pagination Bar */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '14px', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="btn-secondary"
            style={{ padding: '8px 16px', opacity: page === 1 ? 0.5 : 1, cursor: page === 1 ? 'not-allowed' : 'pointer' }}
          >
            ◀ Previous
          </button>

          <span>
            Page <b>{page}</b> of <b>{totalPages}</b>
          </span>

          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="btn-secondary"
            style={{ padding: '8px 16px', opacity: page === totalPages ? 0.5 : 1, cursor: page === totalPages ? 'not-allowed' : 'pointer' }}
          >
            Next ▶
          </button>
        </div>
      </main>

      {/* Inspected Agent Modal */}
      {inspectedAgent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setInspectedAgent(null)}
        >
          <div
            className="w-full max-w-2xl bg-[#fcfaf4] border-2 border-black shadow-[8px_8px_0px_#00aa44] p-6 text-black"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b-2 border-black mb-4">
              <div className="flex items-center gap-2">
                <span className="font-pixel text-xs bg-[#00aa44] text-white px-2 py-0.5 border border-black">
                  #{String(inspectedAgent.id).padStart(5, '0')}
                </span>
                <h3 className="font-display font-bold text-base uppercase">
                  {inspectedAgent.role}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setInspectedAgent(null)}
                className="font-pixel text-xs px-2.5 py-0.5 border border-black bg-white hover:bg-black hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-5">
              <div className="border-2 border-black bg-white p-2 shadow-[4px_4px_0px_#000] flex items-center justify-center">
                <img
                  src={`/nfts/${inspectedAgent.id}.svg`}
                  alt={inspectedAgent.name}
                  className="w-full aspect-square object-contain"
                  style={{ imageRendering: 'pixelated' }}
                />
              </div>

              <div className="flex flex-col justify-between space-y-3 font-mono text-xs">
                <div>
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">MISSION PROMPT</span>
                  <p className="mt-1 p-2.5 border border-black bg-white text-[11px] leading-relaxed italic text-zinc-800">
                    &ldquo;{inspectedAgent.personalityPreview}&rdquo;
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2 border border-zinc-300 bg-[#f7f5ef]">
                    <div className="text-[9px] text-zinc-500 font-bold">ARCHETYPE</div>
                    <div className="font-bold text-zinc-900">{inspectedAgent.archetype}</div>
                  </div>
                  <div className="p-2 border border-zinc-300 bg-[#f7f5ef]">
                    <div className="text-[9px] text-zinc-500 font-bold">EXECUTION ENGINE</div>
                    <div className="font-bold text-[#00aa44]">{inspectedAgent.engine}</div>
                  </div>
                  <div className="p-2 border border-zinc-300 bg-[#f7f5ef]">
                    <div className="text-[9px] text-zinc-500 font-bold">PDA CAPITAL</div>
                    <div className="font-bold text-[#047857]">{inspectedAgent.pdaFunding}</div>
                  </div>
                  <div className="p-2 border border-zinc-300 bg-[#f7f5ef]">
                    <div className="text-[9px] text-zinc-500 font-bold">RARITY TIER</div>
                    <div className="font-bold">{inspectedAgent.rarityTier} ({inspectedAgent.rarityScore}%)</div>
                  </div>
                </div>

                <div className="p-2 border border-black bg-white text-[10px] break-all">
                  <span className="text-zinc-500 font-bold">PROGRAM DERIVED ADDRESS (PDA):</span>
                  <div className="font-mono text-[#00aa44] font-bold mt-0.5">{inspectedAgent.pdaVault}</div>
                </div>
              </div>
            </div>

            <div className="border-t-2 border-black pt-4 flex gap-3">
              <a
                href={`https://solscan.io/account/${inspectedAgent.pdaVault}`}
                target="_blank"
                rel="noreferrer"
                className="btn-primary flex-1 text-center py-2.5 text-xs font-pixel uppercase"
                style={{ background: 'var(--script-green)' }}
              >
                Inspect On Solscan ↗
              </a>
              <button
                type="button"
                onClick={() => setInspectedAgent(null)}
                className="btn-secondary py-2.5 px-4 text-xs font-pixel uppercase"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
