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
  
  // User requested max 40 NFTs per page in a small grid
  const pageSize = 40;
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

  const handleDownloadManifest = (agent) => {
    if (!agent) return;
    const data = {
      protocol: 'RARE Protocol ($RARE)',
      version: '1.0.0-solana',
      agent_id: agent.id,
      name: agent.name,
      archetype: agent.archetype,
      tier: agent.band,
      mint_price: `${agent.priceSol} SOL`,
      token_bound_pda: agent.pdaVault,
      anchor_cpi_split: {
        agent_pda_vault: '90%',
        protocol_ops: '10%'
      },
      personality: agent.personalityPreview,
      engine: agent.engine,
      rarity: {
        score: agent.rarityScore,
        tier: agent.rarityTier
      },
      txSignature: agent.txHash,
      timestamp: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rare-agent-${String(agent.id).padStart(5, '0')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
    <div className="gamma-page-container">
      <Navbar />

      <main style={{ maxWidth: '1360px', margin: '0 auto', padding: '108px 24px 64px 24px' }}>
        {/* Page Header */}
        <div className="gamma-page-header">
          <div className="gamma-badge" style={{ marginBottom: '12px' }}>
            <span className="gamma-badge-icon">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4 4h16v16H4V4zm2 2v12h12V6H6z" />
              </svg>
            </span>
            <span>SOLANA TOKEN-BOUND ROSTER · 10,078 UNITS</span>
          </div>

          <h1 className="gamma-hero-title" style={{ fontSize: 'clamp(32px, 4vw, 52px)', marginBottom: '12px' }}>
            Autonomous Agent Directory
          </h1>
          <p className="gamma-hero-subtitle" style={{ maxWidth: '680px', margin: '0 auto' }}>
            Explore the complete 10,078 genesis roster. Every agent is an on-chain token-bound entity on Solana with an autonomous PDA execution vault funded by 90% of mint capital.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div style={{
          background: 'rgba(5, 24, 10, 0.88)',
          border: '1px solid rgba(34, 197, 94, 0.35)',
          borderRadius: '4px',
          padding: '12px 18px',
          marginBottom: '28px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '14px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.6)'
        }}>
          {/* Rarity Filter Pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '11px', color: '#4ade80', textTransform: 'uppercase', marginRight: '4px', fontWeight: 800 }}>
              RARITY:
            </span>
            {['all', 'legendary', 'epic', 'rare', 'common'].map((tier) => {
              const isActive = rarityFilter === tier;
              return (
                <button
                  key={tier}
                  type="button"
                  onClick={() => { setRarityFilter(tier); setPage(1); }}
                  className={`rarible-filter-pill ${isActive ? 'active' : ''}`}
                  style={{
                    padding: '6px 14px',
                    fontSize: '11px',
                    textTransform: 'uppercase'
                  }}
                >
                  {tier === 'all' ? 'All Tiers' : tier}
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
            <input
              type="text"
              placeholder="Search by ID (#143) or role..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              style={{
                width: '100%',
                borderRadius: '3px',
                border: '1px solid rgba(34, 197, 94, 0.4)',
                background: 'rgba(0, 0, 0, 0.65)',
                padding: '7px 16px',
                fontSize: '12px',
                color: '#86efac',
                outline: 'none',
                fontFamily: 'var(--font-jetbrains), monospace',
                boxShadow: '0 1px 2px rgba(0,0,0,0.5)'
              }}
            />
          </div>
        </div>

        {/* Small Size 40-NFT Responsive Grid (Grid of small cards) */}
        <div className="gamma-roster-grid" style={{ marginBottom: '40px' }}>
          {agents.map((agent) => (
            <div
              key={agent.id}
              onClick={() => setInspectedAgent(agent)}
              className="gamma-small-card"
              title={`View ${agent.name}`}
            >
              {/* Compact Avatar Frame */}
              <div className="gamma-small-avatar-box">
                <img
                  src={`/nfts/${agent.id}.svg`}
                  alt={agent.name}
                  loading="lazy"
                  style={{
                    width: '85%',
                    height: '85%',
                    maxHeight: '100px',
                    objectFit: 'contain',
                    imageRendering: 'pixelated'
                  }}
                />

                {/* ID Badge */}
                <span style={{
                  position: 'absolute',
                  top: '6px',
                  left: '6px',
                  background: 'rgba(0, 0, 0, 0.85)',
                  color: '#ffffff',
                  fontSize: '8px',
                  fontFamily: 'var(--font-jetbrains), monospace',
                  padding: '2px 5px',
                  borderRadius: '9999px',
                  lineHeight: 1
                }}>
                  #{String(agent.id).padStart(5, '0')}
                </span>

                {/* Rarity Badge */}
                <span style={{
                  position: 'absolute',
                  top: '6px',
                  right: '6px',
                  background: 'rgba(147, 51, 234, 0.25)',
                  color: '#c084fc',
                  fontSize: '8px',
                  fontFamily: 'var(--font-jetbrains), monospace',
                  fontWeight: 700,
                  padding: '2px 5px',
                  borderRadius: '9999px',
                  lineHeight: 1
                }}>
                  {agent.rarityTier}
                </span>
              </div>

              {/* Card Meta Content with Rarible Gold Verified Badge */}
              <div style={{ padding: '2px' }}>
                <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span>{agent.name}</span>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="#facc15" style={{ flexShrink: 0 }}>
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '9.5px', color: '#9ca3af', fontFamily: 'var(--font-jetbrains), monospace', marginTop: '3px' }}>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{agent.role}</span>
                  <span style={{ color: '#ffffff', fontWeight: 700, flexShrink: 0 }}>{agent.priceSol} SOL</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255, 255, 255, 0.08)', marginTop: '8px', paddingTop: '6px', fontSize: '9px', color: '#6b7280', fontFamily: 'var(--font-jetbrains), monospace' }}>
                  <span style={{ color: '#10b981', fontWeight: 600 }}>90% PDA</span>
                  <span style={{ color: '#ffffff', fontWeight: 600 }}>Inspect →</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', fontFamily: 'var(--font-jetbrains), monospace', fontSize: '12px' }}>
          <button
            type="button"
            onClick={() => { setPage((p) => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            disabled={page === 1}
            className="gamma-btn-white"
            style={{ padding: '6px 18px', fontSize: '12.5px', opacity: page === 1 ? 0.4 : 1 }}
          >
            ← Previous
          </button>

          <span style={{ color: '#94a3b8' }}>
            Page <strong style={{ color: '#ffffff' }}>{page}</strong> of <strong style={{ color: '#ffffff' }}>{totalPages}</strong>
          </span>

          <button
            type="button"
            onClick={() => { setPage((p) => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            disabled={page === totalPages}
            className="gamma-btn-white"
            style={{ padding: '6px 18px', fontSize: '12.5px', opacity: page === totalPages ? 0.4 : 1 }}
          >
            Next →
          </button>
        </div>
      </main>

      <Footer />

      {/* Inspected Agent Modal (Gamma Dark Institutional Style) */}
      {inspectedAgent && (
        <div
          className="gamma-modal-backdrop"
          onClick={() => setInspectedAgent(null)}
        >
          <div
            className="gamma-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setInspectedAgent(null)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                borderRadius: '9999px',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                background: 'rgba(255, 255, 255, 0.08)',
                padding: '6px',
                cursor: 'pointer',
                color: '#f8fafc'
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  width: '90px',
                  height: '90px',
                  borderRadius: '16px',
                  background: '#181b2e',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '8px',
                  flexShrink: 0
                }}>
                  <img
                    src={`/nfts/${inspectedAgent.id}.svg`}
                    alt={inspectedAgent.name}
                    style={{ width: '100%', height: '100%', objectFit: 'contain', imageRendering: 'pixelated' }}
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '10.5px', color: '#94a3b8' }}>
                      #{String(inspectedAgent.id).padStart(5, '0')}
                    </span>
                    <span style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '10.5px', color: '#c084fc', fontWeight: 700 }}>
                      {inspectedAgent.band}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff', margin: '2px 0 0 0' }}>
                    {inspectedAgent.name}
                  </h3>
                  <p style={{ fontSize: '12px', color: '#94a3b8', margin: '2px 0 0 0' }}>
                    {inspectedAgent.role} · {inspectedAgent.archetype}
                  </p>
                </div>
              </div>

              {/* Stats Block */}
              <div style={{
                background: '#16192a',
                borderRadius: '14px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                padding: '12px 16px',
                fontFamily: 'var(--font-jetbrains), monospace',
                fontSize: '11px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94a3b8' }}>Mint Price:</span>
                  <span style={{ color: '#ffffff', fontWeight: 700 }}>{inspectedAgent.priceSol} SOL</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94a3b8' }}>90% Vault Deposit:</span>
                  <span style={{ color: '#34d399', fontWeight: 700 }}>{(inspectedAgent.priceSol * 0.9).toFixed(3)} SOL</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94a3b8' }}>PDA Vault:</span>
                  <span style={{ color: '#ffffff', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {inspectedAgent.pdaVault}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94a3b8' }}>Rarity:</span>
                  <span style={{ color: '#c084fc', fontWeight: 700 }}>{inspectedAgent.rarityScore} ({inspectedAgent.rarityTier})</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => handleMintAgent(inspectedAgent)}
                  disabled={isMinting}
                  className="gamma-btn-black"
                  style={{ flex: 1, padding: '10px 20px', fontSize: '13.5px' }}
                >
                  {isMinting ? 'Minting via Anchor...' : `Mint for ${inspectedAgent.priceSol} SOL`}
                </button>
                <button
                  type="button"
                  onClick={() => setInspectedAgent(null)}
                  className="gamma-btn-white"
                  style={{ padding: '10px 20px', fontSize: '13.5px' }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mint Celebration Modal */}
      {mintCelebration && (
        <div
          className="gamma-modal-backdrop"
          onClick={() => setMintCelebration(null)}
        >
          <div
            className="gamma-modal-card"
            style={{ textAlign: 'center' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '9999px',
              background: 'rgba(16, 185, 129, 0.15)',
              color: '#34d399',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 14px auto',
              border: '1px solid rgba(16, 185, 129, 0.3)'
            }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>

            <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#ffffff', margin: '0 0 6px 0' }}>
              Agent Activated
            </h3>
            <p style={{ fontSize: '13.5px', color: '#94a3b8', margin: '0 0 18px 0' }}>
              {mintCelebration.name} is now live on Solana with 90% capital bonded.
            </p>

            <div style={{
              background: '#16192a',
              borderRadius: '14px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              padding: '14px',
              textAlign: 'left',
              fontFamily: 'var(--font-jetbrains), monospace',
              fontSize: '11px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              marginBottom: '20px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Token PDA:</span>
                <span style={{ color: '#34d399', fontWeight: 700 }}>{mintCelebration.pdaVault}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Deposited (90%):</span>
                <span style={{ color: '#ffffff', fontWeight: 700 }}>{mintCelebration.funding}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Tx Signature:</span>
                <span style={{ color: '#64748b', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {mintCelebration.txHash}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                type="button"
                onClick={() => handleDownloadManifest(mintCelebration)}
                className="gamma-btn-white"
                style={{ flex: 1, padding: '10px 16px' }}
              >
                Download Manifest (.json)
              </button>
              <button
                type="button"
                onClick={() => setMintCelebration(null)}
                className="gamma-btn-black"
                style={{ flex: 1, padding: '10px 16px' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
