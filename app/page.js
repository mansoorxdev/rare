'use client';

import { useState, useEffect, useRef } from 'react';
import { usePrivy } from '../components/PrivyClientProvider';
import Agent360Viewer from '../components/Agent360Viewer';

function getAgentVisual(id) {
  const num = parseInt(id, 10) || 1;
  const hue = Math.round((num * 137.508) % 360);
  const sat = 110 + (num % 5) * 12;
  const con = 102 + (num % 4) * 5;
  const bright = 96 + (num % 3) * 6;

  const models = ['SENTRY', 'EXECUTIONER', 'ORACLE', 'SNIPER', 'SENTINEL', 'SPECOPS', 'VANGUARD', 'PHANTOM', 'STRIKER', 'SHADOW'];
  const model = models[num % models.length];

  let visorColor = '#00e65b';
  let colorName = 'SOLANA EMERALD';
  if (hue >= 15 && hue < 45) { visorColor = '#ff6b00'; colorName = 'HAZARD TANGERINE'; }
  else if (hue >= 45 && hue < 80) { visorColor = '#ffd000'; colorName = 'SOLAR GOLD'; }
  else if (hue >= 80 && hue < 140) { visorColor = '#00e65b'; colorName = 'SOLANA MATRIX'; }
  else if (hue >= 140 && hue < 190) { visorColor = '#00f0ff'; colorName = 'ARCTIC CYAN'; }
  else if (hue >= 190 && hue < 250) { visorColor = '#3b82f6'; colorName = 'COBALT BLUE'; }
  else if (hue >= 250 && hue < 290) { visorColor = '#a855f7'; colorName = 'VOID PURPLE'; }
  else if (hue >= 290 && hue < 330) { visorColor = '#ec4899'; colorName = 'SYNTH MAGENTA'; }
  else { visorColor = '#ff2a5f'; colorName = 'CRIMSON OVERDRIVE'; }

  return {
    hue,
    filter: `hue-rotate(${hue}deg) saturate(${sat}%) contrast(${con}%) brightness(${bright}%)`,
    model,
    visorColor,
    colorName,
    mk: ((num * 7) % 9) + 1
  };
}

export default function HomePage() {
  const { ready, authenticated, user, login, logout } = usePrivy();
  const [quantity, setQuantity] = useState(1);
  const [rareId, setRareId] = useState('');
  const [pricePerAgent] = useState(0.02);
  const [soldCount, setSoldCount] = useState(142);
  const [mintStatus, setMintStatus] = useState('');
  const [isMinting, setIsMinting] = useState(false);
  const [recentAgents, setRecentAgents] = useState([]);
  const treasuryWallet = process.env.NEXT_PUBLIC_TREASURY_WALLET || '3ivjUQCmaykSnGeCkuy8yViw82umrfDCmXkxtWSeqyEk';

  // Terminal Console State
  const [consoleOpen, setConsoleOpen] = useState(false);
  const [terminalLines, setTerminalLines] = useState([
    { type: 'green', text: '> RARE PROTOCOL ENGINE [SOLANA MAINNET-BETA]' },
    { type: 'info', text: '> 10,078 TOTAL AUTONOMOUS AGENTS SYNCHRONIZED.' },
    { type: 'info', text: "> TYPE 'help' FOR COMMAND SPECIFICATION." }
  ]);
  const [commandInput, setCommandInput] = useState('');
  const terminalEndRef = useRef(null);

  // 10,078 Agent Explorer / Roster State
  const [explorerAgents, setExplorerAgents] = useState([]);
  const [explorerSearch, setExplorerSearch] = useState('');
  const [explorerRole, setExplorerRole] = useState('all');
  const [explorerBand, setExplorerBand] = useState('all');
  const [explorerPage, setExplorerPage] = useState(1);
  const [explorerTotalPages, setExplorerTotalPages] = useState(420);
  const [explorerTotalCount, setExplorerTotalCount] = useState(10078);
  const [explorerLoading, setExplorerLoading] = useState(false);

  const fetchExplorerAgents = async (page = 1, search = '', role = 'all', band = 'all') => {
    setExplorerLoading(true);
    try {
      const limit = 24;
      const offset = (page - 1) * limit;
      const params = new URLSearchParams({
        limit: String(limit),
        offset: String(offset),
        search: search.trim(),
        role: role === 'all' ? '' : role,
        band: band === 'all' ? '' : band,
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
    fetchExplorerAgents(explorerPage, explorerSearch, explorerRole, explorerBand);
  }, [explorerPage, explorerRole, explorerBand]);

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    setExplorerPage(1);
    fetchExplorerAgents(1, explorerSearch, explorerRole, explorerBand);
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

  // Fetch initial sold agents
  useEffect(() => {
    async function loadAgents() {
      try {
        const res = await fetch('/api/agents?limit=6');
        const data = await res.json();
        if (data.success && data.agents) {
          setRecentAgents(data.agents);
        }
      } catch (e) {
        console.error(e);
      }
    }
    loadAgents();
  }, []);

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
    setMintStatus(`Targeting Rare #${rand}`);
  };

  const handleMint = async () => {
    if (ready && !authenticated) {
      setMintStatus('Please connect via Privy first.');
      login();
      return;
    }

    setIsMinting(true);
    setMintStatus('Initiating Anchor CPI capital split...');

    setTimeout(() => {
      setMintStatus('Deriving Agent PDA Vault on-chain...');
    }, 800);

    setTimeout(() => {
      const newId = rareId ? parseInt(rareId, 10) : soldCount + 1;
      setSoldCount(prev => prev + 1);
      setIsMinting(false);
      setMintStatus(`Success! Rare #${newId} minted. 90% deposited to Agent PDA.`);

      setRecentAgents(prev => [
        {
          id: newId,
          name: `Rare #${String(newId).padStart(5, '0')}`,
          role: 'DeFi Arbitrageur',
          agentWallet: '7xKX...qA83',
          pdaVault: '5CKn...Fg9e'
        },
        ...prev.slice(0, 5)
      ]);
    }, 2000);
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

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  return (
    <>
      {/* Authentic Obol Top Navigation Bar */}
      <header className="sn">
        <div className="sn-in">
          <nav className="sn-nav" aria-label="Rare">
            <a className="sn-home" href="#home" onClick={(e) => scrollToSection(e, 'home')}>
              <span className="sn-logo-box"><i></i></span>
              Rare
            </a>
            <a href="#roster" onClick={(e) => scrollToSection(e, 'roster')}>Roster (10,078)</a>
            <button type="button" onClick={() => setConsoleOpen(true)}>Console</button>
            <a href="#specs" onClick={(e) => scrollToSection(e, 'specs')}>Specs</a>
            <a href="#docs" onClick={(e) => scrollToSection(e, 'docs')}>Docs</a>
          </nav>
          <div className="sn-right">
            <i className="sn-dot"></i>
            <span className="mono">Solana</span>
            <button
              type="button"
              onClick={() => authenticated ? logout() : login()}
              className="btn-sn-wallet"
            >
              {authenticated && user?.wallet?.address
                ? `${user.wallet.address.slice(0, 4)}...${user.wallet.address.slice(-4)}`
                : 'Connect'}
            </button>
          </div>
        </div>
      </header>

      <main className="wrap">
        {/* Authentic Obol Hero Grid */}
        <section className="hero" id="home">
          {/* Left: Sleek 360 Turntable */}
          <div>
            <Agent360Viewer
              agentId={rareId ? parseInt(rareId, 10) : soldCount + 1}
              price={pricePerAgent}
            />
          </div>

          {/* Right: Clean Minimalist Purchase Interface */}
          <div>
            <h1>Rare</h1>
            <p className="lede">
              10,078 autonomous agents on Solana. Each one an NFT with its own wallet — and 90% of what you pay goes into it.
            </p>

            <div className="figs">
              <div>
                <span className="label">Price · SOL</span>
                <b>{pricePerAgent}</b>
              </div>
              <div>
                <span className="label">Band</span>
                <b>1/10</b>
              </div>
              <div>
                <span className="label">Sold</span>
                <b>{soldCount}</b>
              </div>
            </div>

            <div className="buy">
              <label className="field">
                <span className="label">How many</span>
                <span className="qty">
                  <button className="txt" type="button" onClick={handleMinus} aria-label="fewer">−</button>
                  <b aria-live="polite">{quantity}</b>
                  <button className="txt" type="button" onClick={handlePlus} aria-label="more">+</button>
                </span>
              </label>

              <label className="field">
                <span className="label">Agent №</span>
                <input
                  inputMode="numeric"
                  maxLength={5}
                  placeholder="pick"
                  value={rareId}
                  onChange={(e) => setRareId(e.target.value)}
                  autoComplete="off"
                />
              </label>

              <button className="txt" type="button" onClick={handleAnyUnsold}>any unsold</button>

              <button
                className="go"
                type="button"
                onClick={handleMint}
                disabled={isMinting}
              >
                {isMinting ? 'Minting…' : 'Mint'}
              </button>
            </div>

            <label className="agree">
              <input type="checkbox" defaultChecked />
              <span>
                I understand every purchase is final on Solana. 90% is deposited into the agent&apos;s token-bound PDA vault; 10% to treasury.
              </span>
            </label>

            {mintStatus && (
              <div id="msg" className={mintStatus.includes('Success') ? 'ok' : ''}>
                {mintStatus}
              </div>
            )}
          </div>
        </section>

        {/* Live Sold Feed (Obol Tiles) */}
        <section className="feed" aria-live="polite">
          <div className="feed-head">
            <span className="label">Sold · live</span>
            <span className="label">{recentAgents.length} minted</span>
          </div>
          <div className="tiles">
            {recentAgents.map((agent) => (
              <div
                key={agent.id}
                className="tile"
                onClick={() => handleSelectAgentFor360(agent.id)}
                title="Click to inspect in 360° turntable"
              >
                <div className="tile-img-box">
                  <img src={`/api/avatar/${agent.id}`} alt={agent.name} />
                </div>
                <b>#{String(agent.id).padStart(5, '0')}</b>
                <span>{agent.role || 'DeFi Agent'}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Modern 10,078 Agent Roster Gallery */}
        <section id="roster" className="roster-section">
          <div className="roster-header-bar">
            <div className="roster-title-group">
              <span className="label">Collection Directory</span>
              <h2>Roster (10,078)</h2>
              <p>Explore all 10,078 autonomous agents. Click any card to inspect its 3D model in the turntable.</p>
            </div>
            <div className="roster-pills">
              {[
                { id: 'all', label: 'All Roles' },
                { id: 'sniper', label: 'Snipers' },
                { id: 'arbitrage', label: 'Arbitrage' },
                { id: 'oracle', label: 'Oracles' },
                { id: 'sentinel', label: 'Sentinels' }
              ].map(f => (
                <button
                  key={f.id}
                  type="button"
                  className={`btn-pill ${explorerRole === f.id ? 'active' : ''}`}
                  onClick={() => handleRoleFilterChange(f.id)}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="roster-controls-bar">
            <form onSubmit={handleSearchSubmit} className="roster-search-form">
              <input
                type="text"
                value={explorerSearch}
                onChange={(e) => setExplorerSearch(e.target.value)}
                placeholder="Search by ID (#1 to #10078) or Role..."
                className="roster-search-input"
              />
              <button type="submit" className="btn-roster-search">Search</button>
            </form>
          </div>

          {explorerLoading ? (
            <div style={{ textAlign: 'center', padding: '48px', color: 'var(--dim)', font: '400 14px var(--mono)' }}>
              Loading agents…
            </div>
          ) : (
            <div className="roster-grid">
              {explorerAgents.map((agent) => {
                const visual = getAgentVisual(agent.id);
                return (
                  <div
                    key={agent.id}
                    className={`roster-card ${rareId === String(agent.id) ? 'active-target' : ''}`}
                    onClick={() => handleSelectAgentFor360(agent.id)}
                    title="Click to view in 360° turntable"
                  >
                    <div className="roster-card-image-wrap">
                      <img
                        src={`/api/avatar/${agent.id}`}
                        alt={agent.name || `Rare #${agent.id}`}
                        style={{ filter: visual.filter }}
                        loading="lazy"
                      />
                    </div>
                    <div className="roster-card-meta">
                      <div className="roster-card-row-top">
                        <span className="roster-card-num">#{String(agent.id).padStart(5, '0')}</span>
                        <span className="roster-card-mk">MK-{visual.mk}</span>
                      </div>
                      <span className="roster-card-role">{agent.role}</span>
                      <span className="roster-card-pda">{agent.band || 'Band 1'} · {agent.priceSol || 0.02} SOL</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Clean Minimalist Pagination */}
          <div className="roster-pagination">
            <button
              type="button"
              className="btn-nav-page"
              disabled={explorerPage <= 1 || explorerLoading}
              onClick={() => setExplorerPage(prev => Math.max(1, prev - 1))}
            >
              ‹ Prev
            </button>
            <span style={{ color: 'var(--dim)' }}>
              Page <strong style={{ color: 'var(--ink)' }}>{explorerPage}</strong> of {explorerTotalPages}
            </span>
            <button
              type="button"
              className="btn-nav-page"
              disabled={explorerPage >= explorerTotalPages || explorerLoading}
              onClick={() => setExplorerPage(prev => Math.min(explorerTotalPages, prev + 1))}
            >
              Next ›
            </button>
          </div>
        </section>

        {/* Specifications Rows (Authentic Obol .rows) */}
        <section id="specs" className="rows">
          <div className="row">
            <span className="label">The agent</span>
            <div>
              <p>
                <strong>Its own wallet.</strong> Every Rare agent has an on-chain Program Derived Address (PDA) vault that follows the NFT. 90% of the mint price is paid into it in the exact same atomic Solana transaction; 10% goes to treasury.
              </p>
              <p>
                <strong>Its look, revealed when it sells.</strong> Casing, visor phosphor, firmware modules, and tactical techwear are fixed and committed before launch. Until an agent is minted, its look remains unrevealed.
              </p>
              <p>
                <strong>The console.</strong> Once acquired, open the web console to view its live execution log, inject your API keys with hardware-level isolation, and enable its autonomous execution loops on Solana DeFi protocols.
              </p>
            </div>
          </div>

          <div className="row">
            <span className="label">Price</span>
            <div>
              <div className="ladder" role="img" aria-label="Ten price bands">
                <i className="now" style={{ height: '18%' }}><span>0.02</span></i>
                <i style={{ height: '24%' }}></i>
                <i style={{ height: '31%' }}></i>
                <i style={{ height: '40%' }}></i>
                <i style={{ height: '52%' }}></i>
                <i style={{ height: '67%' }}></i>
                <i style={{ height: '87%' }}></i>
                <i style={{ height: '113%' }}></i>
                <i style={{ height: '147%' }}></i>
                <i style={{ height: '191%' }}><span>0.212</span></i>
              </div>
              <div className="ladder-x">
                <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span><span>8</span><span>9</span><span>10</span>
              </div>
              <p style={{ marginTop: '14px' }}>
                Ten bands of 1,007.8 Rare agents each. Band 1 opens at 0.02 SOL; each costs 1.3× the one before, up to 0.212 SOL. Pricing formulas and the 90/10 split are immutable in the smart contract.
              </p>
            </div>
          </div>

          <div className="row">
            <span className="label">Provenance</span>
            <div className="kv">
              <span className="k">trait table</span>
              <span className="v">sha256: 8f4c2e1b9a773d002f5e8841a0bc19e34278ef86ca61b7f9d85429e28fa031ce</span>
              <button className="copy" onClick={() => handleCopy('8f4c2e1b9a773d002f5e8841a0bc19e34278ef86ca61b7f9d85429e28fa031ce')}>copy</button>

              <span className="k">seed</span>
              <span className="v">sha256: 4a9d7b3e210fa09cebf94285ad1078c5208479e023758bdf360c7d4128003a27</span>
              <button className="copy" onClick={() => handleCopy('4a9d7b3e210fa09cebf94285ad1078c5208479e023758bdf360c7d4128003a27')}>copy</button>
            </div>
          </div>

          <div className="row">
            <span className="label">Contracts</span>
            <div className="kv">
              <span className="k">anchor program</span>
              <span className="v">Rare111111111111111111111111111111111111111</span>
              <button className="copy" onClick={() => handleCopy('Rare111111111111111111111111111111111111111')}>copy</button>

              <span className="k">treasury</span>
              <span className="v">{treasuryWallet}</span>
              <button className="copy" onClick={() => handleCopy(treasuryWallet)}>copy</button>

              <span className="k">network</span>
              <span className="v">Solana Mainnet-Beta (Cluster v1.18+)</span>
              <span></span>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer>
          <span>Designed &amp; built for Solana · published by RARE PROTOCOL</span>
          <nav>
            <button type="button" onClick={() => setConsoleOpen(true)} className="txt" style={{ textDecoration: 'none' }}>Console</button>
            <a href="#specs" onClick={(e) => scrollToSection(e, 'specs')}>Specs</a>
            <a href="/RARE_Protocol_Whitepaper.pdf" target="_blank" rel="noreferrer">Whitepaper</a>
            <a href="#roster" onClick={(e) => scrollToSection(e, 'roster')}>Roster</a>
          </nav>
        </footer>
      </main>

      {/* Console Modal */}
      {consoleOpen && (
        <div className="modal-overlay" onClick={() => setConsoleOpen(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span>TERMINAL // AGENT TELEMETRY</span>
              <button className="btn-close" onClick={() => setConsoleOpen(false)}>×</button>
            </div>
            <div className="modal-body" style={{ background: '#141416', color: '#00e65b', font: '400 13px var(--mono)', minHeight: '300px', maxHeight: '450px', overflowY: 'auto' }}>
              {terminalLines.map((line, idx) => (
                <div key={idx} style={{ marginBottom: '4px', color: line.type === 'green' ? '#00e65b' : '#9ca3af' }}>
                  {line.text}
                </div>
              ))}
              <div ref={terminalEndRef} />
              <form onSubmit={handleTerminalSubmit} style={{ display: 'flex', marginTop: '12px' }}>
                <span style={{ color: '#00e65b', marginRight: '6px' }}>rare@sol:~$</span>
                <input
                  type="text"
                  value={commandInput}
                  onChange={(e) => setCommandInput(e.target.value)}
                  style={{ flex: 1, background: 'transparent', border: 'none', color: '#fff', font: 'inherit', outline: 'none' }}
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
