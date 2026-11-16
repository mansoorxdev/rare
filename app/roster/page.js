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
          className="rare-modal-overlay"
          onClick={() => setInspectedAgent(null)}
        >
          <div
            className="rare-modal-dialog"
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid #000', paddingBottom: '12px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '11px', background: 'var(--script-green)', color: '#fff', padding: '2px 8px', border: '1px solid #000' }}>
                  #{String(inspectedAgent.id).padStart(5, '0')}
                </span>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '16px', textTransform: 'uppercase' }}>
                  {inspectedAgent.role}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setInspectedAgent(null)}
                style={{ fontFamily: 'var(--font-pixel)', fontSize: '12px', padding: '2px 8px', border: '2px solid #000', background: '#fff', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <div className="rare-modal-grid">
              <div style={{ border: '2px solid #000', background: '#fff', padding: '8px', boxShadow: '4px 4px 0px #000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img
                  src={`/nfts/${inspectedAgent.id}.svg`}
                  alt={inspectedAgent.name}
                  style={{ width: '100%', aspectRatio: '1', objectFit: 'contain', imageRendering: 'pixelated' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
                <div>
                  <span style={{ fontSize: '10px', color: '#71717a', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>MISSION PROMPT</span>
                  <p style={{ marginTop: '4px', padding: '8px 10px', border: '1px solid #000', background: '#fff', fontSize: '11px', fontStyle: 'italic', lineHeight: 1.5 }}>
                    &ldquo;{inspectedAgent.personalityPreview}&rdquo;
                  </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '11px' }}>
                  <div style={{ padding: '8px', border: '1px solid #d4d4d8', background: '#f7f5ef' }}>
                    <div style={{ fontSize: '9px', color: '#71717a', fontWeight: 700 }}>ARCHETYPE</div>
                    <div style={{ fontWeight: 700 }}>{inspectedAgent.archetype}</div>
                  </div>
                  <div style={{ padding: '8px', border: '1px solid #d4d4d8', background: '#f7f5ef' }}>
                    <div style={{ fontSize: '9px', color: '#71717a', fontWeight: 700 }}>EXECUTION ENGINE</div>
                    <div style={{ fontWeight: 700, color: 'var(--script-green)' }}>{inspectedAgent.engine}</div>
                  </div>
                  <div style={{ padding: '8px', border: '1px solid #d4d4d8', background: '#f7f5ef' }}>
                    <div style={{ fontSize: '9px', color: '#71717a', fontWeight: 700 }}>PDA CAPITAL</div>
                    <div style={{ fontWeight: 700, color: 'var(--script-green-dark)' }}>{inspectedAgent.pdaFunding}</div>
                  </div>
                  <div style={{ padding: '8px', border: '1px solid #d4d4d8', background: '#f7f5ef' }}>
                    <div style={{ fontSize: '9px', color: '#71717a', fontWeight: 700 }}>RARITY TIER</div>
                    <div style={{ fontWeight: 700 }}>{inspectedAgent.rarityTier} ({inspectedAgent.rarityScore}%)</div>
                  </div>
                </div>

                <div style={{ padding: '8px', border: '1px solid #000', background: '#fff', fontSize: '10px' }}>
                  <span style={{ color: '#71717a', fontWeight: 700 }}>PROGRAM DERIVED ADDRESS (PDA):</span>
                  <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--script-green-dark)', fontWeight: 700, marginTop: '2px', wordBreak: 'break-all' }}>
                    {inspectedAgent.pdaVault}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ borderTop: '2px solid #000', paddingTop: '16px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <a
                href={`https://solscan.io/account/${inspectedAgent.pdaVault}`}
                target="_blank"
                rel="noreferrer"
                className="btn-primary"
                style={{ flex: 1, padding: '10px 0', fontSize: '12px', textAlign: 'center', background: 'var(--script-green)' }}
              >
                Inspect On Solscan ↗
              </a>
              <button
                type="button"
                onClick={() => setInspectedAgent(null)}
                className="btn-secondary"
                style={{ padding: '10px 16px', fontSize: '12px' }}
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
