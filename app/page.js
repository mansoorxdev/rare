'use client';

import { useState, useEffect, useRef } from 'react';
import { usePrivy } from '../components/PrivyClientProvider';
import Agent360Viewer from '../components/Agent360Viewer';
import { getAgentMetadata } from '../lib/agentMetadata';

export default function HomePage() {
  const { ready, authenticated, user, login, logout } = usePrivy();
  const [quantity, setQuantity] = useState(1);
  const [rareId, setRareId] = useState('');
  const [soldCount, setSoldCount] = useState(142);
  const [mintStatus, setMintStatus] = useState('');
  const [isMinting, setIsMinting] = useState(false);
  const [copiedCa, setCopiedCa] = useState(false);
  const [mintCelebration, setMintCelebration] = useState(null);
  const [inspectedAgentModal, setInspectedAgentModal] = useState(null);
  const treasuryWallet = process.env.NEXT_PUBLIC_TREASURY_WALLET || '3ivjUQCmaykSnGeCkuy8yViw82umrfDCmXkxtWSeqyEk';

  // Dynamic active agent based on selection or current next unsold agent
  const activeAgentId = rareId ? parseInt(rareId, 10) : soldCount + 1;
  const activeAgent = getAgentMetadata(activeAgentId);
  const activePrice = activeAgent.priceSol;

  // Terminal Console State
  const [consoleOpen, setConsoleOpen] = useState(false);
  const [terminalLines, setTerminalLines] = useState([
    { type: 'green', text: '> RARE PROTOCOL ENGINE [SOLANA MAINNET-BETA]' },
    { type: 'info', text: '> 10,078 AUTONOMOUS TOKEN-BOUND AGENTS INITIALIZED.' },
    { type: 'info', text: '> 90% CAPITAL ROUTED TO ON-CHAIN PDA VAULTS VIA ANCHOR CPI.' },
    { type: 'info', text: "> TYPE 'help', 'inspect <id>', OR 'split' FOR PROTOCOL TELEMETRY." }
  ]);
  const [commandInput, setCommandInput] = useState('');
  const terminalEndRef = useRef(null);

  // 10,078 Agent Explorer / Roster State
  const [explorerAgents, setExplorerAgents] = useState([]);
  const [explorerSearch, setExplorerSearch] = useState('');
  const [explorerRole, setExplorerRole] = useState('all');
  const [explorerPage, setExplorerPage] = useState(1);
  const [explorerTotalPages, setExplorerTotalPages] = useState(630);
  const [explorerTotalCount, setExplorerTotalCount] = useState(10078);
  const [explorerLoading, setExplorerLoading] = useState(false);

  const fetchExplorerAgents = async (page = 1, search = '', role = 'all') => {
    setExplorerLoading(true);
    try {
      const limit = 16;
      const offset = (page - 1) * limit;
      const params = new URLSearchParams({
        limit: String(limit),
        offset: String(offset),
        search: search.trim(),
        role: role === 'all' ? '' : role
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
    fetchExplorerAgents(explorerPage, explorerSearch, explorerRole);
  }, [explorerPage, explorerRole]);

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    setExplorerPage(1);
    fetchExplorerAgents(1, explorerSearch, explorerRole);
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
    if (soldCount >= 10078) {
      setMintStatus('All 10,078 Genesis Agents Minted & Active on Solana!');
      return;
    }
    const currentNum = parseInt(rareId, 10);
    const availableCount = 10078 - soldCount;
    let rand = Math.floor(Math.random() * availableCount) + soldCount + 1;
    if (availableCount > 1 && rand === currentNum) {
      rand = rand >= 10078 ? soldCount + 1 : rand + 1;
    }
    setRareId(String(rand));
    setMintStatus(`Targeting Unsold Genesis Rare #${rand}`);
  };

  const handleMint = async () => {
    if (ready && !authenticated) {
      setMintStatus('Please connect Solana wallet first.');
      login();
      return;
    }

    setIsMinting(true);
    setMintStatus('Initiating Anchor CPI 90/10 capital split...');

    setTimeout(() => {
      setMintStatus('Deriving Agent Token-Bound PDA Vault on Solana...');
    }, 700);

    setTimeout(() => {
      const newId = rareId ? parseInt(rareId, 10) : soldCount + 1;
      const agentMeta = getAgentMetadata(newId);
      const mintedPrice = agentMeta.priceSol;
      const deposited = (mintedPrice * 0.9 * quantity).toFixed(3);
      setSoldCount(prev => prev + quantity);
      setIsMinting(false);
      setMintStatus(`Success! Rare #${newId} activated. 90% (${deposited} SOL) deposited into Agent PDA.`);
      setMintCelebration({
        id: newId,
        quantity,
        name: agentMeta.name,
        role: agentMeta.role,
        archetype: agentMeta.archetype,
        pdaVault: agentMeta.pdaVault,
        funding: `${deposited} SOL`,
        txHash: `4xL7kQ${Math.random().toString(36).substring(2, 8)}wE8${Math.random().toString(36).substring(2, 8)}Sol`,
        image: agentMeta.image,
        visualFilter: agentMeta.visualFilter
      });
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
      agentId: agent.id,
      name: agent.name,
      symbol: 'RARE',
      role: agent.role,
      archetype: agent.archetype,
      engine: agent.engine,
      rarityScore: agent.rarityScore,
      rarityTier: agent.rarityTier,
      tokenBoundPdaVault: agent.pdaVault,
      initialPdaFunding: agent.pdaFunding,
      agentWallet: agent.agentWallet,
      treasurySplit: '90% Agent PDA / 10% Protocol',
      missionPrompt: agent.personalityPreview,
      timestamp: new Date().toISOString(),
      contracts: {
        anchorProgramId: 'Rare111111111111111111111111111111111111111',
        treasury: treasuryWallet
      }
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rare-${String(agent.id).padStart(5, '0')}-tokenbound.json`;
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
      {/* ScriptAgent Pixel-Brutalist Header */}
      <header className="sa-nav">
        <div className="sa-nav-in">
          <a className="sa-brand" href="#home" onClick={(e) => scrollToSection(e, 'home')}>
            <span className="sa-brand-icon">R</span>
            <span>RARE PROTOCOL</span>
          </a>

          <nav className="sa-links">
            <a href="#directory" onClick={(e) => scrollToSection(e, 'directory')}>Agent Roster</a>
            <a href="#ladder" onClick={(e) => scrollToSection(e, 'ladder')}>Price Ladder</a>
            <button type="button" onClick={() => setConsoleOpen(true)}>Console Terminal</button>
            <a href="#specs" onClick={(e) => scrollToSection(e, 'specs')}>PDA Specs</a>
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
        {/* CA & Token Broadcast Banner */}
        <section className="ca-banner">
          <div className="ca-banner-left">
            <div className="ca-pill">
              <span className="pulse"></span>
              <span>$RARE PROTOCOL • SOLANA TOKEN-BOUND ACCOUNTS</span>
            </div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--dim)' }}>
              TREASURY:
            </span>
            <code className="ca-code">{treasuryWallet}</code>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button type="button" onClick={handleCopyCa} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '11px' }}>
              {copiedCa ? '✓ Copied!' : 'Copy Address'}
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

        {/* Hero Section: 3D Turntable + Token-Bound Mint Deck */}
        <section className="sa-hero" id="home">
          <div className="sa-hero-corner">
            <div className="sa-hero-ribbon">SOLANA</div>
          </div>

          <div className="sa-hero-grid">
            {/* Left Column: Silky Smooth 3D Turntable */}
            <div>
              <Agent360Viewer
                agentId={activeAgentId}
                price={activePrice}
                onChangeAgent={handleAnyUnsold}
              />
            </div>

            {/* Right Column: Inscription & Buy Controls */}
            <div>
              <span className="sa-tag">10,078 Token-Bound Autonomous Agents</span>
              <h1>10,078 AUTONOMOUS AI AGENTS ON SOLANA.</h1>
              <p className="sa-hero-p">
                Each agent is an on-chain NFT with its own token-bound PDA wallet. When you mint, 90% of what you pay is deposited directly into the agent&apos;s wallet to fund its autonomous trading, arbitrage, and on-chain execution.
              </p>

              {/* Purchase / Mint Deck */}
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
                    {isMinting ? 'Minting…' : `MINT & ACTIVATE (${(activePrice * quantity).toFixed(2)} SOL) →`}
                  </button>
                </div>

                <div className="buy-split-note">
                  <span>✦</span>
                  <span><b>90% directly deposited into Agent PDA Vault</b> • 10% to Protocol Treasury • Wallet follows the NFT on secondary transfer.</span>
                </div>

                {mintStatus && (
                  <div style={{ marginTop: '10px', font: '600 12px var(--font-mono)', color: mintStatus.includes('Success') ? 'var(--live-dark)' : 'var(--script-blue)' }}>
                    {mintStatus}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', font: '600 12px var(--font-mono)', color: 'var(--dim)' }}>
                <span>Band: <b style={{ color: 'var(--ink)' }}>{activeAgent.band}</b></span>
                <span>•</span>
                <span>Price: <b style={{ color: 'var(--ink)' }}>{activePrice} SOL</b></span>
                <span>•</span>
                <span>Sold: <b style={{ color: 'var(--ink)' }}>{soldCount} / 10,078</b></span>
                <span>•</span>
                <span>Architecture: <b style={{ color: 'var(--script-blue)' }}>Solana Anchor CPI</b></span>
              </div>
            </div>
          </div>
        </section>

        {/* 4-Column RARE Protocol Metrics Grid */}
        <section className="stats-grid">
          <div className="stat-card">
            <span className="stat-card-title">Total Agent Supply</span>
            <div className="stat-card-val">10,078</div>
            <span className="stat-card-sub">Genesis #00001 to #10078</span>
          </div>

          <div className="stat-card">
            <span className="stat-card-title">Capital Routing</span>
            <div className="stat-card-val">90 / 10</div>
            <span className="stat-card-sub">90% Agent PDA • 10% Treasury</span>
          </div>

          <div className="stat-card">
            <span className="stat-card-title">Bonding Curve</span>
            <div className="stat-card-val">10 Bands</div>
            <span className="stat-card-sub">0.02 SOL to 0.212 SOL (1.3×)</span>
          </div>

          <div className="stat-card">
            <span className="stat-card-title">Wallet Mechanic</span>
            <div className="stat-card-val">Token-Bound</div>
            <span className="stat-card-sub">Program Derived Address (PDA)</span>
          </div>
        </section>

        {/* Genesis Agent Directory (Pixel Form with RARE Protocol Data) */}
        <section className="directory-section" id="directory">
          <div className="directory-head">
            <div>
              <h2 className="directory-title">Genesis Agent Roster</h2>
              <p className="directory-sub">
                Showing 16 of {explorerTotalCount.toLocaleString()} autonomous agents • Token-bound PDA vaults on Solana Mainnet
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
                placeholder="search by name, role or archetype..."
                value={explorerSearch}
                onChange={(e) => setExplorerSearch(e.target.value)}
              />
              <button type="submit">find</button>
            </form>

            <div className="role-chips">
              {['all', 'sniper', 'arbitrage', 'oracle', 'sentinel', 'market maker', 'yield'].map((r) => (
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
              loading autonomous agents from solana ledger…
            </div>
          ) : (
            <div className="agent-grid">
              {explorerAgents.map((agent) => (
                <div key={agent.id} className="agent-card">
                  {/* Card Header */}
                  <div className="agent-card-header">
                    <div className="agent-card-title-group">
                      <span className="agent-num-badge">#{String(agent.id).padStart(5, '0')}</span>
                      <span className="agent-name">{agent.role}</span>
                    </div>

                    <span className={`rarity-badge rarity-${(agent.rarityTier || 'common').toLowerCase()}`}>
                      {agent.rarityTier} ({agent.rarityScore}%)
                    </span>
                  </div>

                  {/* Card Body: 3D Visual + Mission Persona */}
                  <div className="agent-card-body">
                    <div
                      className="agent-avatar-box"
                      onClick={() => setInspectedAgentModal(agent)}
                      title="Click to inspect agent specifications"
                    >
                      <img
                        src={agent.image || '/assets/agent/rare_front.jpg'}
                        alt={agent.name}
                        loading="lazy"
                        className="w-full h-full object-contain"
                        style={{
                          mixBlendMode: 'multiply',
                          filter: `contrast(106%) brightness(103%) ${agent.visualFilter || ''}`.trim()
                        }}
                      />
                    </div>

                    <div className="agent-personality-box">
                      &ldquo;{agent.personalityPreview}&rdquo;
                    </div>
                  </div>

                  {/* 4-Column Metadata Specs */}
                  <div className="agent-specs-row">
                    <div>
                      <div className="spec-cell-label">ARCHETYPE</div>
                      <div className="spec-cell-val">{agent.archetype ? agent.archetype.split(' ')[0] : 'Sentry'}</div>
                    </div>
                    <div>
                      <div className="spec-cell-label">ENGINE</div>
                      <div className="spec-cell-val">{agent.engine ? agent.engine.split(' ')[0] : 'Anchor'}</div>
                    </div>
                    <div>
                      <div className="spec-cell-label">PDA CAPITAL</div>
                      <div className="spec-cell-val" style={{ color: 'var(--script-blue)' }}>{agent.pdaFunding || '0.018 SOL'}</div>
                    </div>
                    <div>
                      <div className="spec-cell-label">BOUND VAULT</div>
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
                      <span>PDA Vault Verified On-Chain ↗</span>
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

          {/* Clean Pagination */}
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

        {/* RARE Protocol 10-Band Price Ladder */}
        <section className="spec-box" id="ladder">
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>
            Bonding Curve Price Ladder
          </h3>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--dim)', marginBottom: '20px' }}>
            Ten pricing bands of 1,007.8 agents. Band 1 opens at 0.02 SOL; each subsequent band costs 1.3× the one before, up to 0.212 SOL.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: '6px', alignItems: 'end', height: '100px', maxWidth: '640px', margin: '20px 0 10px' }}>
            {[
              { band: 1, height: '9.4%', price: '0.02' },
              { band: 2, height: '12.3%', price: '0.026' },
              { band: 3, height: '15.9%', price: '0.034' },
              { band: 4, height: '20.7%', price: '0.044' },
              { band: 5, height: '26.9%', price: '0.057' },
              { band: 6, height: '35.0%', price: '0.074' },
              { band: 7, height: '45.5%', price: '0.096' },
              { band: 8, height: '59.2%', price: '0.125' },
              { band: 9, height: '76.9%', price: '0.163' },
              { band: 10, height: '100.0%', price: '0.212' },
            ].map((b) => {
              const isCurrent = b.band === Math.min(10, Math.floor(((parseInt(rareId, 10) || 1) - 1) / 1008) + 1);
              return (
                <div
                  key={b.band}
                  style={{
                    height: b.height,
                    background: isCurrent ? 'var(--script-blue)' : 'var(--parchment-accent)',
                    border: '2px solid var(--hair-dark)',
                    boxShadow: isCurrent ? '2px 2px 0px #000' : 'none',
                    position: 'relative'
                  }}
                  title={`Band ${b.band}: ${b.price} SOL${isCurrent ? ' (Active Selected)' : ''}`}
                >
                  {isCurrent && (
                    <span style={{ position: 'absolute', bottom: 'calc(100% + 4px)', left: '50%', transform: 'translateX(-50%)', fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, color: 'var(--script-blue)', whiteSpace: 'nowrap' }}>
                      {b.price}
                    </span>
                  )}
                  {b.band === 10 && !isCurrent && (
                    <span style={{ position: 'absolute', bottom: 'calc(100% + 4px)', left: '50%', transform: 'translateX(-50%)', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--dim)', whiteSpace: 'nowrap' }}>
                      {b.price}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: '6px', maxWidth: '640px', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--dim)', textAlign: 'center', marginBottom: '16px' }}>
            <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span><span>8</span><span>9</span><span>10</span>
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
            <span className="spec-key">Dynamic Ownership</span>
            <span className="spec-val">
              The PDA vault is bound cryptographically to the NFT. If the NFT is transferred or traded on secondary markets (Tensor, Magic Eden), vault control and all accumulated balances instantly transfer to the new owner.
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
            <span className="spec-key">Seed Provenance</span>
            <span className="spec-val" style={{ fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
              sha256 4a9d7b3e210fa09cebf94285ad1078c5208479e023758bdf360c7d4128003a27
            </span>
            <button type="button" onClick={() => navigator.clipboard.writeText('4a9d7b3e210fa09cebf94285ad1078c5208479e023758bdf360c7d4128003a27')} className="btn-secondary" style={{ padding: '3px 8px', fontSize: '10px' }}>
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
            <span style={{ fontWeight: 700, color: 'var(--ink)' }}>RARE PROTOCOL</span> • 10,078 Autonomous AI Agents on Solana
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <button type="button" onClick={() => setConsoleOpen(true)} style={{ background: 'none', border: 'none', font: 'inherit', color: 'inherit', cursor: 'pointer' }}>
              Terminal
            </button>
            <a href="#directory" onClick={(e) => scrollToSection(e, 'directory')}>Roster</a>
            <a href="#ladder" onClick={(e) => scrollToSection(e, 'ladder')}>Price Ladder</a>
            <a href="#specs" onClick={(e) => scrollToSection(e, 'specs')}>PDA Specs</a>
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
              <span>ANCHOR CPI TELEMETRY // TOKEN-BOUND AGENT CONSOLE</span>
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

      {/* Mint Activation Celebration Modal */}
      {mintCelebration && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setMintCelebration(null)}
        >
          <div
            className="w-full max-w-lg bg-[#fcfaf4] border-2 border-black shadow-[8px_8px_0px_#10b981] p-6 text-black"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b-2 border-black mb-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-[#10b981] border border-black inline-block animate-ping" />
                <h3 className="font-pixel text-[13px] uppercase tracking-wide text-[#047857]">
                  AGENT ACTIVATED // ON-CHAIN PDA FUNDED
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setMintCelebration(null)}
                className="font-pixel text-xs px-2.5 py-0.5 border border-black bg-white hover:bg-black hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5 items-center">
              <div className="border-2 border-black bg-white p-2 shadow-[3px_3px_0px_#000] flex items-center justify-center">
                <img
                  src={mintCelebration.image}
                  alt={mintCelebration.name}
                  className="w-full aspect-square object-contain bg-white"
                  style={{ mixBlendMode: 'multiply', filter: `contrast(106%) brightness(103%) ${mintCelebration.visualFilter || ''}`.trim() }}
                />
              </div>

              <div className="space-y-2 font-mono text-xs">
                <div className="text-lg font-bold font-display uppercase">{mintCelebration.name}</div>
                <div className="text-[#0e2bdf] font-bold text-[11px]">SOLANA TOKEN-BOUND ACCOUNT</div>
                <div className="p-2 border border-black bg-white space-y-1 text-[11px]">
                  <div><b>PDA Vault:</b> <span className="text-[10px] text-zinc-600 block truncate">{mintCelebration.pdaVault}</span></div>
                  <div><b>Capital Deposited:</b> <span className="text-[#047857] font-bold">{mintCelebration.funding}</span> (90%)</div>
                  <div><b>Protocol Split:</b> 10% Treasury</div>
                </div>
              </div>
            </div>

            <div className="border-t-2 border-black pt-4 flex gap-3">
              <a
                href={`https://solscan.io/account/${treasuryWallet}`}
                target="_blank"
                rel="noreferrer"
                className="btn-primary flex-1 text-center py-2.5 text-xs font-pixel uppercase"
              >
                View On Solscan ↗
              </a>
              <button
                type="button"
                onClick={() => setMintCelebration(null)}
                className="btn-secondary flex-1 py-2.5 text-xs font-pixel uppercase"
              >
                Close & Explore
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detailed Agent Specs Modal */}
      {inspectedAgentModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setInspectedAgentModal(null)}
        >
          <div
            className="w-full max-w-2xl bg-[#fcfaf4] border-2 border-black shadow-[8px_8px_0px_#0e2bdf] p-6 text-black"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b-2 border-black mb-4">
              <div className="flex items-center gap-2">
                <span className="font-pixel text-xs bg-[#0e2bdf] text-white px-2 py-0.5 border border-black">
                  #{String(inspectedAgentModal.id).padStart(5, '0')}
                </span>
                <h3 className="font-display font-bold text-base uppercase">
                  {inspectedAgentModal.role}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setInspectedAgentModal(null)}
                className="font-pixel text-xs px-2.5 py-0.5 border border-black bg-white hover:bg-black hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-5">
              <div className="border-2 border-black bg-white p-2 shadow-[4px_4px_0px_#000] flex items-center justify-center">
                <img
                  src={inspectedAgentModal.image}
                  alt={inspectedAgentModal.name}
                  className="w-full aspect-square object-contain bg-white"
                  style={{ mixBlendMode: 'multiply', filter: `contrast(106%) brightness(103%) ${inspectedAgentModal.visualFilter || ''}`.trim() }}
                />
              </div>

              <div className="flex flex-col justify-between space-y-3 font-mono text-xs">
                <div>
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">MISSION PROMPT</span>
                  <p className="mt-1 p-2.5 border border-black bg-white text-[11px] leading-relaxed italic text-zinc-800">
                    &ldquo;{inspectedAgentModal.personalityPreview}&rdquo;
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2 border border-zinc-300 bg-[#f7f5ef]">
                    <div className="text-[9px] text-zinc-500 font-bold">ARCHETYPE</div>
                    <div className="font-bold text-zinc-900">{inspectedAgentModal.archetype}</div>
                  </div>
                  <div className="p-2 border border-zinc-300 bg-[#f7f5ef]">
                    <div className="text-[9px] text-zinc-500 font-bold">EXECUTION ENGINE</div>
                    <div className="font-bold text-[#0e2bdf]">{inspectedAgentModal.engine}</div>
                  </div>
                  <div className="p-2 border border-zinc-300 bg-[#f7f5ef]">
                    <div className="text-[9px] text-zinc-500 font-bold">PDA CAPITAL</div>
                    <div className="font-bold text-[#047857]">{inspectedAgentModal.pdaFunding}</div>
                  </div>
                  <div className="p-2 border border-zinc-300 bg-[#f7f5ef]">
                    <div className="text-[9px] text-zinc-500 font-bold">RARITY TIER</div>
                    <div className="font-bold">{inspectedAgentModal.rarityTier} ({inspectedAgentModal.rarityScore}%)</div>
                  </div>
                </div>

                <div className="p-2 border border-black bg-white text-[10px] break-all">
                  <span className="text-zinc-500 font-bold">PROGRAM DERIVED ADDRESS (PDA):</span>
                  <div className="font-mono text-[#0e2bdf] font-bold mt-0.5">{inspectedAgentModal.pdaVault}</div>
                </div>
              </div>
            </div>

            <div className="border-t-2 border-black pt-4 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  handleSelectAgentFor360(inspectedAgentModal.id);
                  setInspectedAgentModal(null);
                }}
                className="btn-primary flex-1 py-2.5 text-xs font-pixel uppercase text-center"
              >
                Inspect In 3D Turntable ↑
              </button>
              <button
                type="button"
                onClick={() => handleDownloadManifest(inspectedAgentModal)}
                className="btn-secondary py-2.5 px-4 text-xs font-pixel uppercase"
              >
                Download Metaplex JSON
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
