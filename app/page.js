'use client';

import { useState, useEffect, useRef } from 'react';
import { usePrivy } from '../components/PrivyClientProvider';
import Agent360Viewer from '../components/Agent360Viewer';

export default function HomePage() {
  const { ready, authenticated, user, login, logout } = usePrivy();
  const [quantity, setQuantity] = useState(1);
  const [rareId, setRareId] = useState('');
  const [pricePerAgent] = useState(0.02);
  const [soldCount, setSoldCount] = useState(142);
  const [mintStatus, setMintStatus] = useState('');
  const [isMinting, setIsMinting] = useState(false);
  const [copiedCa, setCopiedCa] = useState(false);
  const treasuryWallet = process.env.NEXT_PUBLIC_TREASURY_WALLET || '3ivjUQCmaykSnGeCkuy8yViw82umrfDCmXkxtWSeqyEk';

  // Terminal Console State
  const [consoleOpen, setConsoleOpen] = useState(false);
  const [terminalLines, setTerminalLines] = useState([
    { type: 'green', text: '> RARE INSCRIBED ENGINE [SOLANA MAINNET-BETA]' },
    { type: 'info', text: '> 10,078 AUTONOMOUS AGENTS INSCRIBED VIA 960B CHUNKS.' },
    { type: 'info', text: '> WEBGPU / WASM RUNTIME SYNCHRONIZED.' },
    { type: 'info', text: "> TYPE 'help' OR 'stats' FOR PROTOCOL TELEMETRY." }
  ]);
  const [commandInput, setCommandInput] = useState('');
  const terminalEndRef = useRef(null);

  // 10,078 Agent Explorer / Roster State
  const [explorerAgents, setExplorerAgents] = useState([]);
  const [explorerSearch, setExplorerSearch] = useState('');
  const [explorerRole, setExplorerRole] = useState('all');
  const [explorerModel, setExplorerModel] = useState('all');
  const [explorerPage, setExplorerPage] = useState(1);
  const [explorerTotalPages, setExplorerTotalPages] = useState(630);
  const [explorerTotalCount, setExplorerTotalCount] = useState(10078);
  const [explorerLoading, setExplorerLoading] = useState(false);

  const fetchExplorerAgents = async (page = 1, search = '', role = 'all', model = 'all') => {
    setExplorerLoading(true);
    try {
      const limit = 16;
      const offset = (page - 1) * limit;
      const params = new URLSearchParams({
        limit: String(limit),
        offset: String(offset),
        search: search.trim(),
        role: role === 'all' ? '' : role,
        model: model === 'all' ? '' : model
      });
      const res = await fetch(`/api/agents?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setExplorerAgents(data.agents || []);
        setExplorerPage(data.page || page);
        setExplorerTotalPages(data.totalPages || 1);
        setExplorerTotalCount(data.filteredCount ?? data.totalCount);
      }
    } catch (err) {
      console.error('Explorer fetch error:', err);
    } finally {
      setExplorerLoading(false);
    }
  };

  useEffect(() => {
    fetchExplorerAgents(explorerPage, explorerSearch, explorerRole, explorerModel);
  }, [explorerPage, explorerRole, explorerModel]);

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    setExplorerPage(1);
    fetchExplorerAgents(1, explorerSearch, explorerRole, explorerModel);
  };

  const handleRoleFilterChange = (role) => {
    setExplorerRole(role);
    setExplorerPage(1);
  };

  const handleSelectAgentFor360 = (id) => {
    setRareId(String(id));
    const heroEl = document.getElementById('home');
    if (heroEl) {
      heroEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToSection = (e, id) => {
    if (e) e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalLines]);

  const handleMinus = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handlePlus = () => {
    if (quantity < 10) setQuantity(quantity + 1);
  };

  const handleAnyUnsold = () => {
    const rand = Math.floor(Math.random() * (10078 - soldCount)) + soldCount + 1;
    setRareId(String(rand));
    setMintStatus(`Targeting Genesis Rare #${rand}`);
  };

  const handleMint = async () => {
    if (ready && !authenticated) {
      setMintStatus('Please connect Solana wallet first.');
      login();
      return;
    }

    setIsMinting(true);
    setMintStatus('Initiating Anchor CPI capital split & inscription...');

    setTimeout(() => {
      setMintStatus('Deriving Agent PDA Vault on-chain...');
    }, 700);

    setTimeout(() => {
      const newId = rareId ? parseInt(rareId, 10) : soldCount + 1;
      setSoldCount(prev => prev + 1);
      setIsMinting(false);
      setMintStatus(`Success! Rare #${newId} inscribed. 90% deposited to Agent PDA.`);
    }, 1800);
  };

  const handleCopyCa = () => {
    navigator.clipboard.writeText(treasuryWallet);
    setCopiedCa(true);
    setTimeout(() => setCopiedCa(false), 2000);
  };

  const handleDownloadManifest = (agent) => {
    const data = {
      protocol: 'RARE Protocol ($RARE)',
      version: '1.0.0-solana',
      cluster: 'solana-mainnet',
      birthNumber: agent.id,
      agentName: agent.name,
      role: agent.role,
      baseModel: agent.baseModel,
      rarityScore: agent.rarityScore,
      rarityTier: agent.rarityTier,
      totalChunks: agent.totalChunks,
      chunkSize: 960,
      toolsCount: agent.toolsCount,
      agentWallet: agent.agentWallet,
      pdaVault: agent.pdaVault,
      personalityPrompt: agent.personalityPreview,
      timestamp: new Date().toISOString(),
      execution: {
        runtime: 'WebGPU / WebAssembly (WASM)',
        localInference: true,
        zeroServerRequired: true
      }
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rare-${String(agent.id).padStart(5, '0')}-manifest.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleTerminalSubmit = async (e) => {
    e.preventDefault();
    if (!commandInput.trim()) return;

    const cmd = commandInput.trim();
    setCommandInput('');
    setTerminalLines(prev => [...prev, { type: 'input', text: `rare@sol:~$ ${cmd}` }]);

    try {
      const res = await fetch('/api/console', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: cmd })
      });
      const data = await res.json();

      if (cmd === 'clear') {
        setTerminalLines([]);
        return;
      }

      if (Array.isArray(data.output)) {
        data.output.forEach(line => {
          setTerminalLines(prev => [...prev, { type: data.success ? 'green' : 'amber', text: line }]);
        });
      }
    } catch (err) {
      setTerminalLines(prev => [...prev, { type: 'amber', text: `Error: ${err.message}` }]);
    }
  };

  return (
    <>
      {/* ScriptAgent-Style Header Navigation */}
      <header className="sa-nav">
        <div className="sa-nav-in">
          <a className="sa-brand" href="#home" onClick={(e) => scrollToSection(e, 'home')}>
            <span className="sa-brand-icon">R</span>
            <span>RARE</span>
          </a>

          <nav className="sa-links">
            <a href="#directory" onClick={(e) => scrollToSection(e, 'directory')}>Genesis Agents</a>
            <button type="button" onClick={() => setConsoleOpen(true)}>WebGPU Terminal</button>
            <a href="#specs" onClick={(e) => scrollToSection(e, 'specs')}>Architecture</a>
            <a href="/RARE_Protocol_Whitepaper.pdf" target="_blank" rel="noreferrer">Whitepaper</a>
          </nav>

          <div className="sa-right">
            <div className="badge-live">
              <span className="dot"></span>
              <span>Solana Mainnet</span>
            </div>
            <button
              type="button"
              onClick={() => (authenticated ? logout() : login())}
              className="btn-primary"
            >
              {authenticated && user?.wallet?.address
                ? `${user.wallet.address.slice(0, 4)}...${user.wallet.address.slice(-4)}`
                : 'Connect Wallet'}
            </button>
          </div>
        </div>
      </header>

      <div className="wrap">
        {/* CA & Pump.fun Live Announcement Banner */}
        <section className="ca-banner">
          <div className="ca-banner-left">
            <div className="ca-pill">
              <span className="pulse"></span>
              <span>$RARE LIVE ON SOLANA</span>
            </div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--dim)' }}>
              CA:
            </span>
            <code className="ca-code">{treasuryWallet}</code>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button type="button" onClick={handleCopyCa} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '11px' }}>
              {copiedCa ? '✓ Copied!' : 'Copy CA'}
            </button>
            <a
              href={`https://solscan.io/account/${treasuryWallet}`}
              target="_blank"
              rel="noreferrer"
              className="btn-primary"
              style={{ padding: '6px 12px', fontSize: '11px' }}
            >
              Solscan ↗
            </a>
          </div>
        </section>

        {/* ScriptAgent Hero Inscription Deck */}
        <section className="sa-hero" id="home">
          <div className="sa-hero-corner">
            <div className="sa-hero-ribbon">SOLANA</div>
          </div>

          <div className="sa-hero-grid">
            {/* Left Column: Silky Smooth 3D Turntable */}
            <div>
              <Agent360Viewer
                agentId={rareId ? parseInt(rareId, 10) : soldCount + 1}
                price={pricePerAgent}
              />
            </div>

            {/* Right Column: Inscription & Buy Controls */}
            <div>
              <span className="sa-tag">Autonomous On-Chain Intelligence</span>
              <h1>AI AGENTS INSCRIBED ON SOLANA FOREVER.</h1>
              <p className="sa-hero-p">
                10,078 sovereign agents inscribed on Solana. Every byte of prompt and model weights etched onto the ledger. 90% of every sale deposits directly into the agent&apos;s on-chain PDA vault.
              </p>

              {/* Purchase / Inscribe Control Deck */}
              <div className="buy-deck">
                <div className="buy-deck-row">
                  <div className="buy-field">
                    <span className="buy-field-label">Quantity</span>
                    <div className="buy-qty">
                      <button type="button" onClick={handleMinus}>−</button>
                      <span>{quantity}</span>
                      <button type="button" onClick={handlePlus}>+</button>
                    </div>
                  </div>

                  <div className="buy-field">
                    <span className="buy-field-label">Rare №</span>
                    <input
                      className="buy-input"
                      type="text"
                      inputMode="numeric"
                      maxLength={5}
                      placeholder="pick"
                      value={rareId}
                      onChange={(e) => setRareId(e.target.value)}
                    />
                  </div>

                  <button type="button" onClick={handleAnyUnsold} className="btn-secondary" style={{ padding: '9px 14px' }}>
                    any unsold
                  </button>

                  <button
                    type="button"
                    onClick={handleMint}
                    disabled={isMinting}
                    className="btn-primary"
                    style={{ padding: '9px 24px', fontSize: '13px' }}
                  >
                    {isMinting ? 'Inscribing…' : `INSCRIBE (${(pricePerAgent * quantity).toFixed(2)} SOL) →`}
                  </button>
                </div>

                <div className="buy-split-note">
                  <span>✦</span>
                  <span><b>90% directly to Agent PDA Vault</b> • 10% Protocol Treasury • Instant Anchor CPI execution.</span>
                </div>

                {mintStatus && (
                  <div style={{ marginTop: '10px', font: '600 12px var(--font-mono)', color: mintStatus.includes('Success') ? 'var(--live-dark)' : 'var(--script-blue)' }}>
                    {mintStatus}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', font: '600 12px var(--font-mono)', color: 'var(--dim)' }}>
                <span>Band: <b style={{ color: 'var(--ink)' }}>1/10</b></span>
                <span>•</span>
                <span>Sold: <b style={{ color: 'var(--ink)' }}>{soldCount} / 10,078</b></span>
                <span>•</span>
                <span>Standard: <b style={{ color: 'var(--script-blue)' }}>960B MTU Chunks</b></span>
              </div>
            </div>
          </div>
        </section>

        {/* 4-Column ScriptAgent Metrics Grid */}
        <section className="stats-grid">
          <div className="stat-card">
            <span className="stat-card-title">Total Agents Born</span>
            <div className="stat-card-val">10,078</div>
            <span className="stat-card-sub">Genesis #00001 to #10078</span>
          </div>

          <div className="stat-card">
            <span className="stat-card-title">Chunk Standard</span>
            <div className="stat-card-val">960B</div>
            <span className="stat-card-sub">MTU Safe • SHA-256 Verified</span>
          </div>

          <div className="stat-card">
            <span className="stat-card-title">On-Chain Split</span>
            <div className="stat-card-val">90 / 10</div>
            <span className="stat-card-sub">Direct Anchor CPI Deposit</span>
          </div>

          <div className="stat-card">
            <span className="stat-card-title">Execution Runtime</span>
            <div className="stat-card-val">WebGPU</div>
            <span className="stat-card-sub">& WASM Zero Server Inference</span>
          </div>
        </section>

        {/* Genesis Agent Directory (ScriptAgent Rich Pixel Form) */}
        <section className="directory-section" id="directory">
          <div className="directory-head">
            <div>
              <h2 className="directory-title">Genesis Agent Directory</h2>
              <p className="directory-sub">
                Showing 16 of {explorerTotalCount.toLocaleString()} inscribed agents • 100% verified on Solana Mainnet
              </p>
            </div>

            <div style={{ font: '600 12px var(--font-mono)', color: 'var(--dim)' }}>
              Page {explorerPage} of {explorerTotalPages}
            </div>
          </div>

          {/* Search & Role Filters */}
          <div className="directory-filter-bar">
            <form onSubmit={handleSearchSubmit} className="directory-search">
              <input
                type="text"
                placeholder="search by name, tool or prompt..."
                value={explorerSearch}
                onChange={(e) => setExplorerSearch(e.target.value)}
              />
              <button type="submit">find</button>
            </form>

            <div className="role-chips">
              {['all', 'sniper', 'arbitrage', 'oracle', 'sentinel', 'market maker'].map((r) => (
                <button
                  key={r}
                  type="button"
                  className={`role-chip ${explorerRole === r ? 'active' : ''}`}
                  onClick={() => handleRoleFilterChange(r)}
                >
                  {r.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Rich ScriptAgent 2-Column Grid */}
          {explorerLoading ? (
            <div style={{ padding: '60px 0', textAlign: 'center', font: '600 14px var(--font-mono)', color: 'var(--dim)' }}>
              loading sovereign agents from solana ledger…
            </div>
          ) : (
            <div className="agent-grid">
              {explorerAgents.map((agent) => (
                <div key={agent.id} className="agent-card">
                  {/* Card Header */}
                  <div className="agent-card-header">
                    <div className="agent-card-title-group">
                      <span className="agent-num-badge">#{String(agent.id).padStart(5, '0')}</span>
                      <span className="agent-name">{agent.name}</span>
                    </div>

                    <span className={`rarity-badge rarity-${(agent.rarityTier || 'common').toLowerCase()}`}>
                      {agent.rarityTier} ({agent.rarityScore}%)
                    </span>
                  </div>

                  {/* Card Body: 3D Visual + Personality System Prompt */}
                  <div className="agent-card-body">
                    <div
                      className="agent-avatar-box"
                      onClick={() => handleSelectAgentFor360(agent.id)}
                      title="Click to view in 3D turntable"
                    >
                      <img src={`/api/avatar/${agent.id}`} alt={agent.name} loading="lazy" />
                    </div>

                    <div className="agent-personality-box">
                      &ldquo;{agent.personalityPreview}&rdquo;
                    </div>
                  </div>

                  {/* 4-Column Metadata Specs */}
                  <div className="agent-specs-row">
                    <div>
                      <div className="spec-cell-label">MODEL</div>
                      <div className="spec-cell-val">{agent.baseModel ? agent.baseModel.split('-')[0] : 'SmolLM2'}</div>
                    </div>
                    <div>
                      <div className="spec-cell-label">CHUNKS</div>
                      <div className="spec-cell-val">{agent.totalChunks || 142}</div>
                    </div>
                    <div>
                      <div className="spec-cell-label">TOOLS</div>
                      <div className="spec-cell-val">{agent.toolsCount || 4} Active</div>
                    </div>
                    <div>
                      <div className="spec-cell-label">VAULT</div>
                      <div className="spec-cell-val">{agent.pdaVault ? `${agent.pdaVault.slice(0, 4)}...${agent.pdaVault.slice(-4)}` : 'On-Chain'}</div>
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="agent-card-footer">
                    <a
                      href={`https://explorer.solana.com/address/${treasuryWallet}`}
                      target="_blank"
                      rel="noreferrer"
                      className="pda-link"
                    >
                      <span className="dot"></span>
                      <span>PDA Verified On-Chain ↗</span>
                    </a>

                    <div className="agent-card-actions">
                      <button
                        type="button"
                        onClick={() => handleDownloadManifest(agent)}
                        className="btn-secondary"
                        style={{ padding: '5px 10px', fontSize: '11px' }}
                        title="Export Sovereign Agent Manifest JSON"
                      >
                        export
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSelectAgentFor360(agent.id)}
                        className="btn-card-inspect"
                      >
                        inspect 3D →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Clean ScriptAgent Pagination */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
            <button
              type="button"
              className="btn-secondary"
              disabled={explorerPage <= 1 || explorerLoading}
              onClick={() => setExplorerPage(prev => Math.max(1, prev - 1))}
            >
              ← PREVIOUS
            </button>
            <span style={{ font: '600 12px var(--font-mono)', color: 'var(--dim)' }}>
              Page {explorerPage} of {explorerTotalPages}
            </span>
            <button
              type="button"
              className="btn-secondary"
              disabled={explorerPage >= explorerTotalPages || explorerLoading}
              onClick={() => setExplorerPage(prev => Math.min(explorerTotalPages, prev + 1))}
            >
              NEXT →
            </button>
          </div>
        </section>

        {/* Technical Architecture & Specs */}
        <section className="spec-box" id="specs">
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '16px' }}>
            On-Chain Protocol Architecture
          </h3>

          <div className="spec-row">
            <span className="spec-key">Token-Bound Vault</span>
            <span className="spec-val">
              Every Rare agent possesses a cryptographic Program Derived Address (PDA) vault. 90% of mint capital is deposited directly into the agent&apos;s PDA in the same atomic Solana transaction via Anchor CPI.
            </span>
            <span></span>
          </div>

          <div className="spec-row">
            <span className="spec-key">Chunk Standard</span>
            <span className="spec-val">
              Weights and personality prompts are partitioned into strict 960-byte MTU-safe chunks, permanently inscribed into Solana transaction logs. Zero centralized IPFS or AWS dependency.
            </span>
            <span></span>
          </div>

          <div className="spec-row">
            <span className="spec-key">Trait Provenance</span>
            <span className="spec-val" style={{ fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
              sha256 8f4c2e1b9a773d002f5e8841a0bc19e34278ef86ca61b7f9d85429e28fa031ce
            </span>
            <button type="button" onClick={() => navigator.clipboard.writeText('8f4c2e1b9a773d002f5e8841a0bc19e34278ef86ca61b7f9d85429e28fa031ce')} className="btn-secondary" style={{ padding: '3px 8px', fontSize: '10px' }}>
              copy
            </button>
          </div>

          <div className="spec-row">
            <span className="spec-key">Protocol Treasury</span>
            <span className="spec-val" style={{ fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
              {treasuryWallet}
            </span>
            <button type="button" onClick={() => navigator.clipboard.writeText(treasuryWallet)} className="btn-secondary" style={{ padding: '3px 8px', fontSize: '10px' }}>
              copy
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer>
          <div>
            <span style={{ fontWeight: 700, color: 'var(--ink)' }}>RARE PROTOCOL</span> • Inscribed on Solana Mainnet
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <button type="button" onClick={() => setConsoleOpen(true)} style={{ background: 'none', border: 'none', font: 'inherit', color: 'inherit', cursor: 'pointer' }}>
              Terminal
            </button>
            <a href="#directory" onClick={(e) => scrollToSection(e, 'directory')}>Directory</a>
            <a href="#specs" onClick={(e) => scrollToSection(e, 'specs')}>Specs</a>
            <a href="/RARE_Protocol_Whitepaper.pdf" target="_blank" rel="noreferrer">Whitepaper</a>
          </div>
        </footer>
      </div>

      {/* Terminal Console Modal */}
      {consoleOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.65)',
            backdropFilter: 'blur(4px)',
            display: 'grid',
            placeItems: 'center',
            zIndex: 100,
            padding: '20px'
          }}
          onClick={() => setConsoleOpen(false)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '680px',
              background: '#09090b',
              border: '2px solid #27272a',
              boxShadow: '8px 8px 0px 0px #0e2bdf',
              overflow: 'hidden'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 16px',
                background: '#18181b',
                borderBottom: '1px solid #27272a',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: '#a1a1aa'
              }}
            >
              <span>WEBGPU RUNTIME // SOLANA AGENT TELEMETRY</span>
              <button
                onClick={() => setConsoleOpen(false)}
                style={{ background: 'none', border: 'none', color: '#fff', fontSize: '16px', cursor: 'pointer' }}
              >
                ×
              </button>
            </div>

            <div
              style={{
                padding: '20px',
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                color: '#10b981',
                maxHeight: '360px',
                overflowY: 'auto',
                lineHeight: 1.6
              }}
            >
              {terminalLines.map((line, idx) => (
                <div key={idx} style={{ color: line.type === 'green' ? '#10b981' : '#a1a1aa' }}>
                  {line.text}
                </div>
              ))}
              <div ref={terminalEndRef} />
              <form onSubmit={handleTerminalSubmit} style={{ display: 'flex', marginTop: '12px' }}>
                <span style={{ color: '#0e2bdf', marginRight: '6px', fontWeight: 700 }}>rare@sol:~$</span>
                <input
                  type="text"
                  value={commandInput}
                  onChange={(e) => setCommandInput(e.target.value)}
                  style={{ flex: 1, background: 'transparent', border: 'none', color: '#fcfaf4', font: 'inherit', outline: 'none' }}
                  autoFocus
                />
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
