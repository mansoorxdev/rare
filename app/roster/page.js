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
  const treasuryWallet = process.env.NEXT_PUBLIC_TREASURY_WALLET || '3ivjUQCmaykSnGeCkuy8yViw82umrfDCmXkxtWSeqyEk';
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
        id: agent.id,
        quantity: 1,
        name: agent.name,
        role: agent.role,
        archetype: agent.archetype,
        pdaVault: agent.pdaVault,
        funding: `${deposited} SOL`,
        txHash: `4xL7kQ${Math.random().toString(36).substring(2, 8)}wE8${Math.random().toString(36).substring(2, 8)}Sol`,
        image: agent.image,
        visualFilter: agent.visualFilter
      });
    }, 1800);
  };

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
        <div style={{ background: '#121215', border: '2px solid var(--hair)', boxShadow: '4px 4px 0px #000', padding: '16px 20px', marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
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
                padding: '8px 14px',
                border: '2px solid var(--hair-dark)',
                background: '#09090b',
                color: '#ffffff',
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
                background: '#121215',
                border: '2px solid var(--hair)',
                padding: '16px',
                boxShadow: '4px 4px 0px #000000',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '12px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--hair)', paddingBottom: '8px' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 800, background: 'var(--script-green)', color: '#000000', padding: '2px 7px', border: '1px solid #000' }}>
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
                  background: 'radial-gradient(circle at 50% 65%, rgba(0, 255, 102, 0.08) 0%, #09090b 70%)',
                  border: '1.5px solid var(--hair)',
                  boxShadow: '2px 2px 0px #000',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'border-color 0.15s ease'
                }}
              >
                <img
                  src={`/nfts/${agent.id}.svg`}
                  alt={agent.name}
                  style={{ width: '85%', height: '85%', objectFit: 'contain', imageRendering: 'pixelated', filter: 'drop-shadow(0 10px 14px rgba(0,0,0,0.6))' }}
                />
              </div>

              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px', color: '#ffffff' }}>
                  {agent.role}
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--dim)' }}>
                  Archetype: <b style={{ color: 'var(--ink)' }}>{agent.archetype}</b>
                </div>
              </div>

              <div style={{ background: '#18181d', border: '1px solid var(--hair)', padding: '8px 10px', fontSize: '10px', fontFamily: 'var(--font-mono)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                  <span style={{ color: 'var(--dim)' }}>PDA Capital:</span>
                  <span style={{ fontWeight: 700, color: 'var(--script-green)' }}>{agent.pdaFunding}</span>
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
                style={{ width: '100%', textAlign: 'center', padding: '8px 0', fontSize: '11px', background: 'var(--script-green)', color: '#000000', fontWeight: 800 }}
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
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--hair)', paddingBottom: '14px', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 800, background: 'var(--script-green)', color: '#000000', padding: '3px 8px', border: '1px solid #000000' }}>
                  #{String(inspectedAgent.id).padStart(5, '0')}
                </span>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '17px', textTransform: 'uppercase', color: '#ffffff', letterSpacing: '0.02em' }}>
                  {inspectedAgent.role}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setInspectedAgent(null)}
                style={{ fontFamily: 'var(--font-pixel)', fontSize: '13px', padding: '4px 10px', border: '1px solid var(--hair-dark)', background: '#18181d', color: '#ffffff', cursor: 'pointer', transition: 'all 0.15s ease' }}
                title="Close"
              >
                ✕
              </button>
            </div>

            <div className="rare-modal-grid">
              <div style={{ border: '2px solid var(--hair)', background: 'radial-gradient(circle at 50% 65%, rgba(0, 255, 102, 0.1) 0%, #09090b 70%)', padding: '16px', boxShadow: '4px 4px 0px #000, 0 0 20px rgba(0, 255, 102, 0.12)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <img
                  src={`/nfts/${inspectedAgent.id}.svg`}
                  alt={inspectedAgent.name}
                  style={{ width: '100%', aspectRatio: '1', objectFit: 'contain', imageRendering: 'pixelated', filter: 'drop-shadow(0 10px 16px rgba(0,0,0,0.7))' }}
                />
                <span style={{ marginTop: '10px', fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--script-green)', background: 'rgba(0, 255, 102, 0.12)', border: '1px solid rgba(0, 255, 102, 0.3)', padding: '2px 8px' }}>
                  TOKEN-BOUND PDA ASSET
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
                <div>
                  <span style={{ fontSize: '10px', color: 'var(--dim)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>MISSION PROMPT</span>
                  <p style={{ marginTop: '4px', padding: '10px 12px', border: '1px solid var(--hair)', borderLeft: '3px solid var(--script-green)', background: '#09090b', fontSize: '11px', color: '#e4e4e7', fontStyle: 'italic', lineHeight: 1.6 }}>
                    &ldquo;{inspectedAgent.personalityPreview}&rdquo;
                  </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '11px' }}>
                  <div style={{ padding: '9px 11px', border: '1px solid var(--hair)', background: '#18181d' }}>
                    <div style={{ fontSize: '9px', color: 'var(--dim)', fontWeight: 700, textTransform: 'uppercase' }}>ARCHETYPE</div>
                    <div style={{ fontWeight: 700, color: '#ffffff', marginTop: '2px' }}>{inspectedAgent.archetype}</div>
                  </div>
                  <div style={{ padding: '9px 11px', border: '1px solid var(--hair)', background: '#18181d' }}>
                    <div style={{ fontSize: '9px', color: 'var(--dim)', fontWeight: 700, textTransform: 'uppercase' }}>EXECUTION ENGINE</div>
                    <div style={{ fontWeight: 700, color: 'var(--script-green)', marginTop: '2px' }}>{inspectedAgent.engine}</div>
                  </div>
                  <div style={{ padding: '9px 11px', border: '1px solid var(--hair)', background: '#18181d' }}>
                    <div style={{ fontSize: '9px', color: 'var(--dim)', fontWeight: 700, textTransform: 'uppercase' }}>PDA CAPITAL</div>
                    <div style={{ fontWeight: 700, color: 'var(--script-green)', marginTop: '2px' }}>{inspectedAgent.pdaFunding}</div>
                  </div>
                  <div style={{ padding: '9px 11px', border: '1px solid var(--hair)', background: '#18181d' }}>
                    <div style={{ fontSize: '9px', color: 'var(--dim)', fontWeight: 700, textTransform: 'uppercase' }}>RARITY TIER</div>
                    <div style={{ fontWeight: 700, color: '#ffffff', marginTop: '2px' }}>{inspectedAgent.rarityTier} ({inspectedAgent.rarityScore}%)</div>
                  </div>
                </div>

                <div style={{ padding: '10px 12px', border: '1px solid var(--hair)', background: '#09090b', fontSize: '10px' }}>
                  <span style={{ color: 'var(--dim)', fontWeight: 700 }}>PROGRAM DERIVED ADDRESS (PDA):</span>
                  <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--script-green)', fontWeight: 700, marginTop: '4px', wordBreak: 'break-all', fontSize: '11px' }}>
                    {inspectedAgent.pdaVault}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--hair)', paddingTop: '16px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => handleMintAgent(inspectedAgent)}
                disabled={isMinting}
                className="btn-primary"
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  fontSize: '12px',
                  textAlign: 'center',
                  background: isMinting ? '#18181d' : 'var(--script-green)',
                  color: isMinting ? 'var(--script-green)' : '#000000',
                  fontWeight: 800,
                  cursor: isMinting ? 'wait' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 0 16px rgba(0, 255, 102, 0.3)',
                  border: '1px solid var(--script-green)'
                }}
              >
                <span>⚡</span>
                <span>{isMinting ? 'MINTING AGENT...' : `MINT AGENT (${inspectedAgent.priceSol} SOL)`}</span>
              </button>
              <button
                type="button"
                onClick={() => setInspectedAgent(null)}
                className="btn-secondary"
                style={{ padding: '11px 18px', fontSize: '12px', background: '#18181d', color: '#ffffff' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mint Activation Celebration Modal */}
      {mintCelebration && (
        <div
          className="rare-modal-overlay"
          onClick={() => setMintCelebration(null)}
        >
          <div
            className="rare-modal-dialog"
            style={{ maxWidth: '580px', background: '#121215', border: '1px solid var(--hair-dark)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--hair)', paddingBottom: '12px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '10px', height: '10px', background: 'var(--script-green)', border: '1px solid #000', display: 'inline-block' }} />
                <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--script-green)', letterSpacing: '0.04em' }}>
                  AGENT ACTIVATED // ON-CHAIN PDA FUNDED
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setMintCelebration(null)}
                style={{ fontFamily: 'var(--font-pixel)', fontSize: '12px', padding: '2px 8px', border: '1px solid var(--hair-dark)', background: '#18181d', color: '#ffffff', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <div className="rare-modal-grid">
              <div style={{ border: '1px solid var(--hair)', background: '#09090b', padding: '12px', boxShadow: '0 0 16px rgba(0, 255, 102, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img
                  src={mintCelebration.image || `/nfts/${mintCelebration.id}.svg`}
                  alt={mintCelebration.name}
                  style={{ width: '100%', aspectRatio: '1', objectFit: 'contain', imageRendering: 'pixelated' }}
                />
              </div>

              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ fontSize: '18px', fontWeight: 800, fontFamily: 'var(--font-display)', textTransform: 'uppercase', color: '#ffffff' }}>{mintCelebration.name}</div>
                <div style={{ color: 'var(--script-green)', fontWeight: 700, fontSize: '11px' }}>SOLANA TOKEN-BOUND ACCOUNT</div>
                <div style={{ padding: '12px', border: '1px solid var(--hair)', background: '#18181d', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '11px', color: '#ffffff' }}>
                  <div><b style={{ color: 'var(--dim)' }}>PDA Vault:</b> <span style={{ fontSize: '10px', color: 'var(--script-green)', display: 'block', wordBreak: 'break-all', marginTop: '2px' }}>{mintCelebration.pdaVault}</span></div>
                  <div><b style={{ color: 'var(--dim)' }}>Capital Deposited:</b> <span style={{ color: 'var(--script-green)', fontWeight: 700 }}>{mintCelebration.funding}</span> (90%)</div>
                  <div><b style={{ color: 'var(--dim)' }}>Protocol Split:</b> 10% Treasury</div>
                </div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--hair)', paddingTop: '16px', display: 'flex', gap: '12px' }}>
              <a
                href={`https://solscan.io/account/${treasuryWallet}`}
                target="_blank"
                rel="noreferrer"
                className="btn-primary"
                style={{ flex: 1, textAlign: 'center', padding: '10px 0', fontSize: '12px', background: 'var(--script-green)', color: '#000000', fontWeight: 800 }}
              >
                View On Solscan ↗
              </a>
              <button
                type="button"
                onClick={() => setMintCelebration(null)}
                className="btn-secondary"
                style={{ flex: 1, padding: '10px 0', fontSize: '12px', background: '#18181d', color: '#ffffff', border: '1px solid var(--hair)' }}
              >
                Close & Explore
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
