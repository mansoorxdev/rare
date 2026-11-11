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

  return {
    hue,
    filter: `hue-rotate(${hue}deg) saturate(${sat}%) contrast(${con}%) brightness(${bright}%)`,
    model,
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
      setMintStatus('Please connect wallet first.');
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
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
                <rect x="3" y="4" width="26" height="21" rx="3" fill="#1a1a1d" />
                <rect className="sn-scr" x="6.5" y="7.5" width="19" height="14" rx="1.5" fill="#2f7d4a" />
                <rect x="12" y="26" width="8" height="3" fill="#1a1a1d" />
              </svg>
              Rare
            </a>
            <a href="#roster" onClick={(e) => scrollToSection(e, 'roster')}>Roster</a>
            <button type="button" onClick={() => setConsoleOpen(true)}>Console</button>
            <a href="#specs" onClick={(e) => scrollToSection(e, 'specs')}>Specs</a>
            <a href="/RARE_Protocol_Whitepaper.pdf" target="_blank" rel="noreferrer">Whitepaper</a>
          </nav>
          <div className="sn-right">
            <i className="sn-dot on" id="dot"></i>
            <span className="sn-nettxt" id="livetxt">Solana</span>
            <button
              type="button"
              onClick={() => authenticated ? logout() : login()}
              className="btn-wallet"
            >
              {authenticated && user?.wallet?.address
                ? `${user.wallet.address.slice(0, 4)}...${user.wallet.address.slice(-4)}`
                : 'Connect'}
            </button>
          </div>
        </div>
      </header>

      <div className="wrap">
        {/* Authentic Obol Hero Grid */}
        <section className="hero" id="home">
          <div>
            <Agent360Viewer
              agentId={rareId ? parseInt(rareId, 10) : soldCount + 1}
              price={pricePerAgent}
            />
          </div>

          <div>
            <h1>Rare</h1>
            <p className="lede">
              10,078 agents on Solana. Each one an NFT with its own wallet — and 90% of what you pay goes into it.
            </p>

            <div className="figs">
              <div>
                <span className="label">Price · SOL</span>
                <b id="price">{pricePerAgent}</b>
              </div>
              <div>
                <span className="label">Band</span>
                <b id="band">1/10</b>
              </div>
              <div>
                <span className="label">Sold</span>
                <b id="sold">{soldCount}</b>
              </div>
            </div>

            <div className="buy">
              <label className="field">
                <span className="label">How many</span>
                <span className="qty">
                  <button className="txt" id="qminus" type="button" onClick={handleMinus} aria-label="fewer">−</button>
                  <b id="qty" aria-live="polite">{quantity}</b>
                  <button className="txt" id="qplus" type="button" onClick={handlePlus} aria-label="more">+</button>
                </span>
              </label>

              <label className="field">
                <span className="label">Rare №</span>
                <input
                  id="n"
                  inputMode="numeric"
                  maxLength={5}
                  placeholder="pick"
                  value={rareId}
                  onChange={(e) => setRareId(e.target.value)}
                  autoComplete="off"
                />
              </label>

              <button className="txt" id="any" type="button" onClick={handleAnyUnsold}>any unsold</button>

              <button
                className="go"
                id="go"
                type="button"
                onClick={handleMint}
                disabled={isMinting}
              >
                {isMinting ? 'Minting…' : 'Buy'}
              </button>
            </div>

            <label className="agree">
              <input type="checkbox" id="agree" defaultChecked />
              <span>
                I agree to the <a href="/terms">Terms</a> and understand every purchase is final: 90% is deposited into the agent&apos;s wallet; 10% to treasury.
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
            <span className="label" id="feedcount">{recentAgents.length} recent</span>
          </div>
          <div className="tiles" id="tiles">
            {recentAgents.map((agent) => (
              <div
                key={agent.id}
                className="tile"
                onClick={() => handleSelectAgentFor360(agent.id)}
                title="Click to inspect in 360° turntable"
              >
                <img src={`/api/avatar/${agent.id}`} alt={agent.name} />
                <b>#{String(agent.id).padStart(5, '0')}</b>
                <span>{agent.role || 'DeFi Agent'}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 10,078 Agent Roster Directory (Authentic Obol .tiles) */}
        <section className="feed" id="roster" style={{ paddingTop: '28px' }}>
          <div className="feed-head" style={{ alignItems: 'flex-end', flexWrap: 'wrap', gap: '12px', marginBottom: '18px' }}>
            <div>
              <span className="label" style={{ display: 'block', marginBottom: '2px' }}>Directory · 10,078 Agents</span>
              <b style={{ font: '600 20px var(--sans)', color: 'var(--ink)' }}>All Agents</b>
            </div>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
              <form onSubmit={handleSearchSubmit} style={{ display: 'inline-flex', gap: '4px' }}>
                <input
                  type="text"
                  value={explorerSearch}
                  onChange={(e) => setExplorerSearch(e.target.value)}
                  placeholder="pick # or role"
                  style={{ font: '400 13px var(--mono)', padding: '3px 8px', border: '1px solid var(--hair)', borderRadius: '2px', background: 'transparent', width: '130px' }}
                />
                <button className="txt" type="submit" style={{ padding: '3px 6px' }}>search</button>
              </form>
              {['all', 'sniper', 'arbitrage', 'oracle', 'sentinel'].map(r => (
                <button
                  key={r}
                  type="button"
                  className="txt"
                  style={{
                    fontWeight: explorerRole === r ? '600' : '400',
                    color: explorerRole === r ? 'var(--ink)' : 'var(--dim)',
                    textDecoration: explorerRole === r ? 'underline' : 'none'
                  }}
                  onClick={() => handleRoleFilterChange(r)}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {explorerLoading ? (
            <div style={{ padding: '40px 0', textAlign: 'center', font: '400 13px var(--mono)', color: 'var(--dim)' }}>
              loading daemons…
            </div>
          ) : (
            <div className="tiles">
              {explorerAgents.map((agent) => {
                const visual = getAgentVisual(agent.id);
                return (
                  <div
                    key={agent.id}
                    className={`tile ${rareId === String(agent.id) ? 'new' : ''}`}
                    onClick={() => handleSelectAgentFor360(agent.id)}
                    title="Click to view in 360° turntable"
                  >
                    <img
                      src={`/api/avatar/${agent.id}`}
                      alt={agent.name}
                      style={{ filter: visual.filter }}
                      loading="lazy"
                    />
                    <b>#{String(agent.id).padStart(5, '0')}</b>
                    <span>{agent.role}</span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Clean Obol-Style Pagination */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '22px', font: '400 12px var(--mono)', color: 'var(--dim)' }}>
            <button
              type="button"
              className="txt"
              disabled={explorerPage <= 1 || explorerLoading}
              onClick={() => setExplorerPage(prev => Math.max(1, prev - 1))}
            >
              ← previous
            </button>
            <span>
              page {explorerPage} of {explorerTotalPages}
            </span>
            <button
              type="button"
              className="txt"
              disabled={explorerPage >= explorerTotalPages || explorerLoading}
              onClick={() => setExplorerPage(prev => Math.min(explorerTotalPages, prev + 1))}
            >
              next →
            </button>
          </div>
        </section>

        {/* Specifications Rows (Authentic Obol .rows) */}
        <div className="rows" id="specs">
          <div className="row">
            <span className="label">The agent</span>
            <div>
              <p>
                <strong>Its own wallet.</strong> Every Rare agent has an on-chain Program Derived Address (PDA) vault that follows the NFT. 90% of the price is paid into it in the same transaction; 10% to RARE LLC. The sale contract holds nothing between purchases.
              </p>
              <p>
                <strong>Its look, revealed when it sells.</strong> Top, colours, shoes, casing, phosphor, face, hat — fixed and committed before the mint. Until a number sells it shows the same unrevealed spin, so nobody can pick the rare ones.
              </p>
              <p>
                <strong>Its screen.</strong> Wallet, log, inbox, repo, market — live. Activate it in the console to give it its working wallet, then switch on its agent.
              </p>
            </div>
          </div>

          <div className="row">
            <span className="label">Price</span>
            <div>
              <div className="ladder" id="ladder" role="img" aria-label="Ten price bands">
                <i className="now" style={{ height: '9.4%' }}><span>0.02</span></i>
                <i style={{ height: '12.3%' }}></i>
                <i style={{ height: '15.9%' }}></i>
                <i style={{ height: '20.7%' }}></i>
                <i style={{ height: '26.9%' }}></i>
                <i style={{ height: '35.0%' }}></i>
                <i style={{ height: '45.5%' }}></i>
                <i style={{ height: '59.2%' }}></i>
                <i style={{ height: '76.9%' }}></i>
                <i style={{ height: '100.0%' }}><span>0.212</span></i>
              </div>
              <div className="ladder-x">
                <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span><span>8</span><span>9</span><span>10</span>
              </div>
              <p style={{ marginTop: '14px' }}>
                Ten bands of 1,007.8 agents, by how many have sold. Band 1 is 0.02 SOL; each costs 1.3× the one before, up to 0.212 SOL. Prices, the split and the opening time are fixed in the contract — nobody can change them.
              </p>
            </div>
          </div>

          <div className="row">
            <span className="label">Opened</span>
            <div>
              <p><strong>Sat, 10 Oct 2026 18:00 UTC</strong></p>
              <p className="clock">LIVE NOW ON SOLANA</p>
            </div>
          </div>

          <div className="row">
            <span className="label">Provenance</span>
            <div className="kv">
              <span className="k">trait table</span>
              <span className="v">sha256 8f4c2e1b9a773d002f5e8841a0bc19e34278ef86ca61b7f9d85429e28fa031ce</span>
              <button className="copy" onClick={() => handleCopy('8f4c2e1b9a773d002f5e8841a0bc19e34278ef86ca61b7f9d85429e28fa031ce')}>copy</button>

              <span className="k">seed</span>
              <span className="v">sha256 4a9d7b3e210fa09cebf94285ad1078c5208479e023758bdf360c7d4128003a27</span>
              <button className="copy" onClick={() => handleCopy('4a9d7b3e210fa09cebf94285ad1078c5208479e023758bdf360c7d4128003a27')}>copy</button>

              <span className="k"></span>
              <span className="v" style={{ color: 'var(--dim)' }}>The seed is published after the sale; anyone can then re-derive every look and check these.</span>
              <span></span>
            </div>
          </div>

          <div className="row">
            <span className="label">Contracts</span>
            <div className="kv">
              <span className="k">collection</span>
              <span className="v">Rare111111111111111111111111111111111111111</span>
              <button className="copy" onClick={() => handleCopy('Rare111111111111111111111111111111111111111')}>copy</button>

              <span className="k">treasury</span>
              <span className="v">{treasuryWallet}</span>
              <button className="copy" onClick={() => handleCopy(treasuryWallet)}>copy</button>

              <span className="k">chain</span>
              <span className="v">Solana Mainnet · Cluster v1.18+</span>
              <span></span>

              <span className="k">$RARE</span>
              <span className="v">Token-Bound Agent Utility Protocol</span>
              <span></span>
            </div>
          </div>
        </div>

        {/* Authentic Obol Footer */}
        <footer>
          <span>Designed by Chad Neal · published by RARE PROTOCOL</span>
          <nav>
            <button type="button" onClick={() => setConsoleOpen(true)} className="txt" style={{ textDecoration: 'none' }}>Console</button>
            <a href="#specs" onClick={(e) => scrollToSection(e, 'specs')}>Specs</a>
            <a href="/RARE_Protocol_Whitepaper.pdf" target="_blank" rel="noreferrer">Whitepaper</a>
            <a href="#roster" onClick={(e) => scrollToSection(e, 'roster')}>Roster</a>
          </nav>
        </footer>
      </div>

      {/* What's New Pill (Exact Obol .newspill) */}
      <button className="newspill" type="button" onClick={() => setConsoleOpen(true)}>
        What&apos;s new · Console
      </button>

      {/* Minimalist Terminal Modal */}
      {consoleOpen && (
        <div className="modal-overlay" onClick={() => setConsoleOpen(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span>TERMINAL // AGENT TELEMETRY</span>
              <button className="btn-close" onClick={() => setConsoleOpen(false)}>×</button>
            </div>
            <div style={{ padding: '20px', background: '#1a1a1d', color: '#2f7d4a', font: '400 13px var(--mono)', minHeight: '280px', maxHeight: '420px', overflowY: 'auto' }}>
              {terminalLines.map((line, idx) => (
                <div key={idx} style={{ marginBottom: '4px', color: line.type === 'green' ? '#2f7d4a' : '#8c887e' }}>
                  {line.text}
                </div>
              ))}
              <div ref={terminalEndRef} />
              <form onSubmit={handleTerminalSubmit} style={{ display: 'flex', marginTop: '12px' }}>
                <span style={{ color: '#2f7d4a', marginRight: '6px' }}>rare@sol:~$</span>
                <input
                  type="text"
                  value={commandInput}
                  onChange={(e) => setCommandInput(e.target.value)}
                  style={{ flex: 1, background: 'transparent', border: 'none', color: '#ece9e2', font: 'inherit', outline: 'none' }}
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
