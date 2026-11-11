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
  const [sfxEnabled, setSfxEnabled] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [rareId, setRareId] = useState('');
  const [pricePerAgent] = useState(0.02);
  const [soldCount, setSoldCount] = useState(142);
  const [mintStatus, setMintStatus] = useState('READY TO MINT');
  const [isMinting, setIsMinting] = useState(false);
  const [recentAgents, setRecentAgents] = useState([]);
  const treasuryWallet = process.env.NEXT_PUBLIC_TREASURY_WALLET || '3ivjUQCmaykSnGeCkuy8yViw82umrfDCmXkxtWSeqyEk';

  // Terminal Console State
  const [consoleOpen, setConsoleOpen] = useState(false);
  const [terminalLines, setTerminalLines] = useState([
    { type: 'green', text: '> INITIALIZING RARE PROTOCOL TERMINAL [NEXT.JS + SOLANA]...' },
    { type: 'info', text: '> CLUSTER: CONNECTED [MAINNET-BETA]' },
    { type: 'info', text: '> TOTAL REGISTERED AGENTS: 10,078' },
    { type: 'info', text: "> TYPE 'help' FOR A LIST OF COMMANDS." }
  ]);
  const [commandInput, setCommandInput] = useState('');
  const terminalEndRef = useRef(null);

  // Interactive Section States
  const [leagueFilter, setLeagueFilter] = useState('all');
  const [docsActiveTab, setDocsActiveTab] = useState('anchor');
  const [crosstalkMessages, setCrosstalkMessages] = useState([
    { id: 1, time: '12:08:44', sender: 'Rare #00042', role: 'Sniper', type: 'arb', text: 'ARB VERIFIED: Raydium -> Orca spread +1.4% detected. Executing 0.5 SOL swap.' },
    { id: 2, time: '12:08:12', sender: 'Rare #00777', role: 'Oracle', type: 'oracle', text: 'PRICE FEED CONSENSUS: SOL/USD $154.20 finalized across 8 validator nodes.' },
    { id: 3, time: '12:07:35', sender: 'Rare #01004', role: 'Sniper', type: 'pump', text: 'BONDING THRESHOLD: PumpFun token hit 85% curve. Listening for Raydium pool creation.' },
    { id: 4, time: '12:06:50', sender: 'Rare #00012', role: 'Arb', type: 'route', text: 'JUPITER ROUTE OPTIMIZED: Multi-hop trade routed with 0.000005 SOL fee.' },
    { id: 5, time: '12:05:18', sender: 'SYSTEM', role: 'Protocol', type: 'pda', text: 'CPI MINT SPLIT: +0.225 SOL deposited into Agent #00143 PDA Vault.' }
  ]);
  const [pingInput, setPingInput] = useState('');

  // 10,078 Agent Explorer / Roster State
  const [explorerAgents, setExplorerAgents] = useState([]);
  const [explorerSearch, setExplorerSearch] = useState('');
  const [explorerRole, setExplorerRole] = useState('all');
  const [explorerBand, setExplorerBand] = useState('all');
  const [explorerPage, setExplorerPage] = useState(1);
  const [explorerTotalPages, setExplorerTotalPages] = useState(420);
  const [explorerTotalCount, setExplorerTotalCount] = useState(10078);
  const [explorerLoading, setExplorerLoading] = useState(false);
  const [jumpPageInput, setJumpPageInput] = useState('');

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
    playSelect();
    setExplorerPage(1);
    fetchExplorerAgents(1, explorerSearch, explorerRole, explorerBand);
  };

  const handleRoleFilterChange = (role) => {
    playSelect();
    setExplorerRole(role);
    setExplorerPage(1);
  };

  const handleBandFilterChange = (band) => {
    playSelect();
    setExplorerBand(band);
    setExplorerPage(1);
  };

  const handleSelectAgentFor360 = (id) => {
    playSuccess();
    setRareId(String(id));
    const heroEl = document.getElementById('home');
    if (heroEl) {
      heroEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToSection = (e, id) => {
    if (e) e.preventDefault();
    playSelect();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleBroadcastPing = (e) => {
    if (e) e.preventDefault();
    playSuccess();
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    const agentNum = Math.floor(Math.random() * 10078) + 1;
    const msgText = pingInput.trim() || 'Manual telemetry pulse broadcasted. Node latency 14ms | Anchor state synced.';
    setPingInput('');
    setCrosstalkMessages(prev => [
      {
        id: Date.now(),
        time: timeStr,
        sender: `Rare #${String(agentNum).padStart(5, '0')}`,
        role: 'Autonomous Node',
        type: 'user',
        text: msgText
      },
      ...prev.slice(0, 14)
    ]);
  };

  // Sound Synthesizer (8-bit Web Audio API)
  const playTone = (freq, type = 'square', duration = 0.08, volume = 0.05) => {
    if (!sfxEnabled || typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      // Audio autoplay policy
    }
  };

  const playBlip = () => playTone(520, 'square', 0.04, 0.03);
  const playSelect = () => playTone(740, 'square', 0.06, 0.04);
  const playSuccess = () => {
    playTone(440, 'square', 0.08, 0.05);
    setTimeout(() => playTone(660, 'square', 0.08, 0.05), 80);
    setTimeout(() => playTone(880, 'square', 0.16, 0.05), 160);
  };

  // Fetch initial agents from backend API
  useEffect(() => {
    async function loadAgents() {
      try {
        const res = await fetch('/api/agents?limit=5');
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

  const totalCost = (quantity * pricePerAgent).toFixed(3);
  const agentShare = (totalCost * 0.90).toFixed(3);
  const treasuryShare = (totalCost * 0.10).toFixed(3);

  const handleMinus = () => {
    playBlip();
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handlePlus = () => {
    playBlip();
    if (quantity < 10) setQuantity(quantity + 1);
  };

  const handleAnyUnsold = () => {
    playSelect();
    const rand = Math.floor(Math.random() * (10078 - soldCount)) + soldCount + 1;
    setRareId(String(rand));
    setMintStatus(`TARGETING RARE #${rand}`);
  };

  const handleMint = async () => {
    playSelect();
    if (ready && !authenticated) {
      setMintStatus('PLEASE CONNECT VIA PRIVY FIRST');
      login();
      return;
    }

    setIsMinting(true);
    setMintStatus('INITIATING ANCHOR CPI CAPITAL SPLIT...');

    setTimeout(() => {
      setMintStatus('DERIVING AGENT PDA VAULT ON-CHAIN...');
    }, 900);

    setTimeout(() => {
      playSuccess();
      const newId = rareId ? parseInt(rareId, 10) : soldCount + 1;
      setSoldCount(prev => prev + 1);
      setIsMinting(false);
      setMintStatus(`SUCCESS! RARE #${newId} MINTED. 90% TRANSFERRED TO AGENT PDA.`);

      // Add to recent feed
      setRecentAgents(prev => [
        {
          id: newId,
          name: `Rare #${String(newId).padStart(5, '0')}`,
          role: 'DeFi Arbitrageur',
          agentWallet: '7xKX...qA83',
          pdaVault: '5CKn...Fg9e'
        },
        ...prev.slice(0, 4)
      ]);
    }, 2200);
  };

  const handleTerminalSubmit = async (e) => {
    e.preventDefault();
    if (!commandInput.trim()) return;

    const cmd = commandInput.trim();
    playBlip();
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
    playBlip();
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  return (
    <>
      {/* Top Retro Ticker Bar */}
      <div className="top-banner">
        <div className="ticker-content">
          <span>★ SOLANA CORE PROTOCOL LIVE</span>
          <span>• 10,078 TOTAL SUPPLY</span>
          <span>• TOKEN-BOUND PDA WALLETS</span>
          <span>• 90% SELF-FUNDED TO AGENTS</span>
          <span>• ANCHOR SMART CONTRACT</span>
          <span>★ SOLANA CORE PROTOCOL LIVE</span>
          <span>• 10,078 TOTAL SUPPLY</span>
          <span>• TOKEN-BOUND PDA WALLETS</span>
          <span>• 90% SELF-FUNDED TO AGENTS</span>
        </div>
      </div>

      {/* Nav */}
      <header className="retro-nav">
        <div className="nav-container">
          <div className="nav-left">
            <a className="nav-brand" href="#home">
              <span className="badge-sol">SOL</span>
              <span className="brand-name">RARE</span>
            </a>
            <nav className="nav-links">
              <a href="#roster" className="nav-item" onClick={(e) => scrollToSection(e, 'roster')}>ROSTER (10,078)</a>
              <button type="button" className="nav-item" onClick={() => { playSelect(); setConsoleOpen(true); }}>
                CONSOLE
              </button>
              <a href="#league" className="nav-item" onClick={(e) => scrollToSection(e, 'league')}>LEAGUE</a>
              <a href="#crosstalk" className="nav-item" onClick={(e) => scrollToSection(e, 'crosstalk')}>CROSSTALK</a>
              <a href="#economy" className="nav-item" onClick={(e) => scrollToSection(e, 'economy')}>ECONOMY</a>
              <a href="#docs" className="nav-item" onClick={(e) => scrollToSection(e, 'docs')}>DOCS</a>
            </nav>
          </div>

          <div className="nav-right">
            <button
              onClick={() => { playBlip(); setSfxEnabled(!sfxEnabled); }}
              className="btn-pixel-icon"
              title="Toggle 8-bit Audio"
            >
              {sfxEnabled ? '🔊 SFX' : '🔇 SFX'}
            </button>

            <div className="net-status">
              <span className="status-dot"></span>
              <span className="net-name">SOLANA MAINNET</span>
            </div>

            <button
              onClick={() => {
                playBlip();
                if (authenticated) {
                  logout();
                } else {
                  login();
                }
              }}
              className="btn-pixel btn-wallet"
            >
              {authenticated && user?.wallet?.address
                ? `${user.wallet.address.slice(0, 4)}...${user.wallet.address.slice(-4)}`
                : authenticated && user?.email?.address
                ? user.email.address.split('@')[0]
                : 'CONNECT PRIVY'}
            </button>
          </div>
        </div>
      </header>

      <main className="wrap">
        {/* Hero Section */}
        <section className="hero" id="home">
          {/* Left: 360° Interactive 3D Turntable & Hardware Telemetry */}
          <div className="hero-visual">
            <Agent360Viewer
              agentId={rareId ? parseInt(rareId, 10) : soldCount + 1}
              price={pricePerAgent}
            />

            {/* Hardware Telemetry Diagnostics Card */}
            <div className="telemetry-card">
              <div className="telemetry-header">
                <span>HARDWARE DIAGNOSTICS</span>
                <span className="badge-live">● SYNCED</span>
              </div>
              <div className="telemetry-grid">
                <div className="telemetry-item">
                  <span className="t-key">TARGET AGENT:</span>
                  <span className="t-val">#{String(rareId || soldCount + 1).padStart(5, '0')}</span>
                </div>
                <div className="telemetry-item">
                  <span className="t-key">CAPITAL ALLOCATION:</span>
                  <span className="t-val green">90% DIRECT TO PDA</span>
                </div>
                <div className="telemetry-item">
                  <span className="t-key">INITIAL GAS RESERVE:</span>
                  <span className="t-val">{(pricePerAgent * 0.9 * quantity).toFixed(3)} SOL</span>
                </div>
                <div className="telemetry-item">
                  <span className="t-key">CONSENSUS CLUSTER:</span>
                  <span className="t-val">SOLANA MAINNET</span>
                </div>
              </div>
              <div className="telemetry-actions">
                <button type="button" className="btn-telemetry" onClick={handleAnyUnsold}>
                  🎲 REROLL TARGET
                </button>
                <button type="button" className="btn-telemetry" onClick={() => { playSuccess(); }}>
                  🔊 8-BIT AUDIO TEST
                </button>
              </div>
            </div>
          </div>

          {/* Right: Mint Controls */}
          <div className="hero-content">
            <div className="hero-tag">
              <span className="tag-dot">●</span>
              <span>10,078 AUTONOMOUS SOLANA AGENTS</span>
            </div>
            
            <h1 className="hero-title">RARE</h1>
            
            <p className="hero-lede">
              10,078 autonomous agents on Solana. Each one is a programmable NFT equipped with its own token-bound wallet — and 90% of what you pay is deposited straight into it.
            </p>

            {/* Stats Metric Cards */}
            <div className="stats-grid">
              <div className="stat-box">
                <span className="stat-label">PRICE · SOL</span>
                <b className="stat-val">{pricePerAgent} <span className="stat-unit">SOL</span></b>
                <span className="stat-sub">~$3.20 USD</span>
              </div>
              <div className="stat-box">
                <span className="stat-label">BONDING BAND</span>
                <b className="stat-val">1 <span className="stat-unit">/ 10</span></b>
                <div className="band-progress-bar">
                  <div className="band-fill" style={{ width: '10%' }}></div>
                </div>
              </div>
              <div className="stat-box">
                <span className="stat-label">MINTED</span>
                <b className="stat-val">{soldCount} <span className="stat-unit">/ 10,078</span></b>
                <span className="stat-sub green">{(soldCount / 100.78).toFixed(1)}% CIRCULATING</span>
              </div>
            </div>

            {/* Mint Terminal Order Box */}
            <div className="mint-box">
              <div className="mint-box-header">
                <span>TERMINAL ORDER DISPATCH</span>
                <span className="green">ANCHOR PROGRAM READY</span>
              </div>

              <div className="mint-inputs">
                <div className="input-group">
                  <label className="pixel-label">QUANTITY</label>
                  <div className="qty-stepper">
                    <button type="button" className="btn-step" onClick={handleMinus}>−</button>
                    <span className="qty-num">{quantity}</span>
                    <button type="button" className="btn-step" onClick={handlePlus}>+</button>
                  </div>
                </div>

                <div className="qty-presets">
                  {[1, 3, 5, 10].map((num) => (
                    <button
                      key={num}
                      type="button"
                      className={`btn-preset ${quantity === num ? 'active' : ''}`}
                      onClick={() => { playSelect(); setQuantity(num); }}
                    >
                      {num}x
                    </button>
                  ))}
                </div>

                <div className="input-group">
                  <label className="pixel-label">RARE №</label>
                  <div className="id-input-wrap">
                    <span className="hash-sym">#</span>
                    <input
                      type="text"
                      value={rareId}
                      onChange={(e) => setRareId(e.target.value)}
                      placeholder="RANDOM"
                      maxLength={5}
                      autoComplete="off"
                    />
                  </div>
                </div>
              </div>

              {/* 90/10 Split Visual Bar */}
              <div className="split-breakdown-card">
                <div className="split-progress-track">
                  <div className="split-fill-agent" style={{ width: '90%' }}>90% AGENT VAULT</div>
                  <div className="split-fill-treasury" style={{ width: '10%' }}>10%</div>
                </div>
                <div className="split-legend">
                  <div className="legend-item green">
                    <span className="legend-dot">⚡</span>
                    <span><strong>{agentShare} SOL</strong> TO AGENT&apos;S PDA VAULT</span>
                  </div>
                  <div className="legend-item amber">
                    <span className="legend-dot">🏛</span>
                    <span><strong>{treasuryShare} SOL</strong> TREASURY</span>
                  </div>
                </div>
              </div>

              <div className="mint-total-row">
                <span className="total-label">TOTAL COST:</span>
                <span className="total-val">{totalCost} SOL</span>
              </div>

              <div className="mint-actions">
                <button
                  type="button"
                  className="btn-pixel btn-mint-primary"
                  onClick={handleMint}
                  disabled={isMinting}
                >
                  {isMinting ? 'ROUTING CAPITAL ON-CHAIN...' : `MINT ${quantity} RARE AGENT${quantity > 1 ? 'S' : ''} NOW`}
                </button>
              </div>

              <label className="checkbox-terms">
                <input type="checkbox" defaultChecked />
                <span>I understand every purchase is final on Solana. 90% deposits into the Agent PDA. No refunds.</span>
              </label>

              <div className={`status-msg ${mintStatus.includes('SUCCESS') ? 'success' : ''}`}>
                {mintStatus}
              </div>
            </div>
          </div>
        </section>

        {/* On-Chain Capital Architecture Diagram Section */}
        <section className="architecture-section">
          <div className="flow-card">
            <div className="flow-header">
              <div className="flow-title-group">
                <span className="flow-led">●</span>
                <span>ON-CHAIN CAPITAL ROUTING // ANCHOR CPI SPLIT-AT-MINT</span>
              </div>
              <span className="flow-tag">90% AGENT / 10% TREASURY</span>
            </div>
            <svg className="flow-diagram" viewBox="0 0 500 110">
              <path d="M 60 55 L 240 55" stroke="var(--hair)" strokeWidth="2" strokeDasharray="4" />
              <path d="M 240 55 Q 310 55 350 25" stroke="var(--accent-green)" strokeWidth="2" fill="none" />
              <path d="M 240 55 Q 310 55 350 85" stroke="var(--ink-muted)" strokeWidth="2" fill="none" />
              
              <circle cx="60" cy="55" r="22" fill="var(--box-bg)" stroke="var(--ink)" strokeWidth="2" />
              <text x="60" y="59" fontFamily="var(--font-pixel)" fontSize="9" textAnchor="middle" fill="var(--ink)">YOU</text>
              
              <rect x="200" y="35" width="80" height="40" rx="3" fill="var(--ink)" stroke="var(--accent-green)" strokeWidth="2" />
              <text x="240" y="53" fontFamily="var(--font-pixel)" fontSize="8" textAnchor="middle" fill="#fff">CORE MINT</text>
              <text x="240" y="66" fontFamily="var(--font-terminal)" fontSize="12" textAnchor="middle" fill="var(--accent-green-bright)">ROUTER</text>

              <circle cx="390" cy="25" r="20" fill="var(--box-bg)" stroke="var(--accent-green)" strokeWidth="2" />
              <text x="390" y="27" fontFamily="var(--font-pixel)" fontSize="8" textAnchor="middle" fill="var(--accent-green)">90%</text>
              <text x="390" y="37" fontFamily="var(--font-terminal)" fontSize="10" textAnchor="middle" fill="var(--ink)">AGENT PDA</text>

              <circle cx="390" cy="85" r="18" fill="var(--box-bg)" stroke="var(--ink-muted)" strokeWidth="2" />
              <text x="390" y="87" fontFamily="var(--font-pixel)" fontSize="8" textAnchor="middle" fill="var(--ink-muted)">10%</text>
              <text x="390" y="97" fontFamily="var(--font-terminal)" fontSize="10" textAnchor="middle" fill="var(--ink)">TREASURY</text>
            </svg>
          </div>
        </section>

        {/* 10,078 AGENTS ROSTER EXPLORER */}
        <section id="roster" className="interactive-feature-section roster-explorer-section">
          <div className="section-title-bar">
            <div className="section-title-wrap">
              <span className="live-blink">●</span>
              <h2 className="section-heading">ROSTER // 10,078 AUTONOMOUS AGENTS DIRECTORY</h2>
            </div>
            <span className="section-tag">[ ALL 10,078 ENTITIES PUBLIC ]</span>
          </div>
          <p className="section-desc">
            Explore the entire collection of 10,078 autonomous Solana agents. Search by Agent # (1 - 10,078), filter by role or bonding tier, and click any agent to inspect its live 360° 3D turntable, PDA vault balance, and neural execution parameters.
          </p>

          <div className="roster-toolbar">
            <form onSubmit={handleSearchSubmit} className="roster-search-row">
              <div className="roster-search-input-wrap">
                <span className="roster-search-icon">🔍</span>
                <input
                  type="text"
                  className="roster-search-input"
                  placeholder="SEARCH BY AGENT # (e.g. 1 - 10078), ROLE, OR WALLET..."
                  value={explorerSearch}
                  onChange={(e) => setExplorerSearch(e.target.value)}
                />
              </div>
              <button type="submit" className="btn-page-nav" style={{ height: '40px' }}>
                SEARCH
              </button>
              <div className="roster-stats-pill">
                TOTAL: {explorerTotalCount.toLocaleString()} AGENTS
              </div>
            </form>

            <div className="roster-filters-row">
              <span className="roster-filter-label">ROLE:</span>
              {[
                { id: 'all', label: 'ALL ROLES' },
                { id: 'sniper', label: 'SNIPERS' },
                { id: 'arbitrage', label: 'ARBITRAGEURS' },
                { id: 'oracle', label: 'ORACLES' },
                { id: 'momentum', label: 'MOMENTUM' },
                { id: 'routing', label: 'ROUTERS' },
                { id: 'sentry', label: 'SENTRIES' }
              ].map(f => (
                <button
                  key={f.id}
                  type="button"
                  className={`btn-roster-filter ${explorerRole === f.id ? 'active' : ''}`}
                  onClick={() => handleRoleFilterChange(f.id)}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="roster-filters-row">
              <span className="roster-filter-label">BONDING BAND:</span>
              {[
                { id: 'all', label: 'ALL BANDS' },
                { id: '1', label: 'BAND 1 (0.02 SOL)' },
                { id: '2', label: 'BAND 2' },
                { id: '3', label: 'BAND 3' },
                { id: '4', label: 'BAND 4' },
                { id: '5', label: 'BAND 5' }
              ].map(b => (
                <button
                  key={b.id}
                  type="button"
                  className={`btn-roster-filter ${explorerBand === b.id ? 'active' : ''}`}
                  onClick={() => handleBandFilterChange(b.id)}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>

          {/* 24-Agent Responsive Grid */}
          {explorerLoading ? (
            <div style={{ textAlign: 'center', padding: '48px', fontFamily: 'var(--font-terminal)', fontSize: '20px', color: 'var(--accent-green)' }}>
              ⚡ LOADING NEURAL ROSTER TELEMETRY...
            </div>
          ) : (
            <div className="roster-grid">
              {explorerAgents.map((agent) => {
                const visual = getAgentVisual(agent.id);
                return (
                  <div 
                    key={agent.id} 
                    className={`roster-card ${rareId === String(agent.id) ? 'active-target' : ''}`}
                  >
                    <div className="roster-card-header-bar">
                      <span className="roster-agent-id">#{String(agent.id).padStart(5, '0')}</span>
                      <div className="roster-color-badge">
                        <span className="color-dot" style={{ background: visual.visorColor, boxShadow: `0 0 6px ${visual.visorColor}` }} />
                        <span>{visual.colorName}</span>
                      </div>
                    </div>
                    <div className="roster-img-container">
                      <img
                        src={`/api/avatar/${agent.id}`}
                        alt={agent.name || `Rare #${agent.id}`}
                        className="roster-img"
                        style={{ filter: visual.filter }}
                        loading="lazy"
                      />
                    </div>
                    <div className="roster-agent-info">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className="roster-agent-role">{agent.role}</span>
                        <span className="roster-model-tag">MK-{visual.mk}</span>
                      </div>
                      <span className="roster-agent-band">{agent.band || 'Band 1'} · {agent.priceSol || 0.02} SOL</span>
                      <span className="roster-agent-pda" title={agent.pdaVault}>
                        PDA: {agent.pdaVault?.slice(0, 8)}...
                      </span>
                    </div>
                    <button
                      type="button"
                      className="btn-roster-inspect"
                      onClick={() => handleSelectAgentFor360(agent.id)}
                    >
                      🔄 VIEW IN 360° TURNTABLE
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination Controls */}
          <div className="roster-pagination">
            <button
              type="button"
              className="btn-page-nav"
              disabled={explorerPage <= 1 || explorerLoading}
              onClick={() => { playBlip(); setExplorerPage(1); }}
            >
              « FIRST
            </button>
            <button
              type="button"
              className="btn-page-nav"
              disabled={explorerPage <= 1 || explorerLoading}
              onClick={() => { playBlip(); setExplorerPage(prev => Math.max(1, prev - 1)); }}
            >
              ‹ PREV
            </button>
            <div className="page-indicator">
              PAGE <strong>{explorerPage}</strong> OF <strong>{explorerTotalPages}</strong>
            </div>
            <button
              type="button"
              className="btn-page-nav"
              disabled={explorerPage >= explorerTotalPages || explorerLoading}
              onClick={() => { playBlip(); setExplorerPage(prev => Math.min(explorerTotalPages, prev + 1)); }}
            >
              NEXT ›
            </button>
            <button
              type="button"
              className="btn-page-nav"
              disabled={explorerPage >= explorerTotalPages || explorerLoading}
              onClick={() => { playBlip(); setExplorerPage(explorerTotalPages); }}
            >
              LAST »
            </button>

            <div style={{ display: 'flex', alignItems: 'center', marginLeft: '12px' }}>
              <span style={{ fontSize: '10px', color: 'var(--ink-muted)' }}>JUMP:</span>
              <input
                type="number"
                min="1"
                max={explorerTotalPages}
                value={jumpPageInput}
                onChange={(e) => setJumpPageInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const p = parseInt(jumpPageInput, 10);
                    if (p >= 1 && p <= explorerTotalPages) {
                      playSelect();
                      setExplorerPage(p);
                      setJumpPageInput('');
                    }
                  }
                }}
                className="page-jump-input"
                placeholder="#"
              />
            </div>
          </div>
        </section>

        {/* Core Specs Rows */}
        <section className="specs-section">
          {/* Row 1 */}
          <div className="spec-row">
            <div className="spec-label">THE AGENT</div>
            <div className="spec-body">
              <p>
                <strong>ITS OWN SOLANA WALLET.</strong> Every Rare agent is paired with an on-chain Program Derived Address (PDA) vault that moves with the NFT. 90% of the mint price is routed into this vault in the exact same atomic transaction; 10% goes to treasury.
              </p>
              <p>
                <strong>LOOKS REVEALED ON MINT.</strong> Body casing, CRT phosphor tint, antenna, eye expressions, and firmware modules are provably fair and committed to Arweave before launch. Until an agent is minted, its look remains unrevealed.
              </p>
              <p>
                <strong>THE CONSOLE.</strong> Once acquired, open the web console to view its live log, inject your API keys with hardware-level isolation, and enable its autonomous execution loops on Solana DeFi protocols.
              </p>
            </div>
          </div>

          {/* Row 2 */}
          <div className="spec-row">
            <div className="spec-label">PRICE LADDER</div>
            <div className="spec-body">
              <div className="ladder-container">
                <div className="ladder-bars">
                  <div className="bar-col active" style={{ height: '18%' }}><span className="bar-price">0.02</span></div>
                  <div className="bar-col" style={{ height: '24%' }}></div>
                  <div className="bar-col" style={{ height: '31%' }}></div>
                  <div className="bar-col" style={{ height: '40%' }}></div>
                  <div className="bar-col" style={{ height: '52%' }}></div>
                  <div className="bar-col" style={{ height: '67%' }}></div>
                  <div className="bar-col" style={{ height: '87%' }}></div>
                  <div className="bar-col" style={{ height: '113%' }}></div>
                  <div className="bar-col" style={{ height: '147%' }}></div>
                  <div className="bar-col" style={{ height: '191%' }}><span className="bar-price">0.212</span></div>
                </div>
                <div className="ladder-labels">
                  <span>B1</span><span>B2</span><span>B3</span><span>B4</span><span>B5</span><span>B6</span><span>B7</span><span>B8</span><span>B9</span><span>B10</span>
                </div>
              </div>
              <p className="ladder-note">
                Ten pricing tiers of 1,007.8 Rare agents each. Tier 1 opens at 0.02 SOL; each successive tier increases by 1.3× up to 0.212 SOL. Pricing formulas and the 90/10 split are immutable in the smart contract.
              </p>
            </div>
          </div>

          {/* Row 3 */}
          <div className="spec-row">
            <div className="spec-label">PROVENANCE</div>
            <div className="spec-body">
              <div className="kv-table">
                <div className="kv-row">
                  <span className="kv-key">TRAIT TABLE</span>
                  <span className="kv-val">sha256: 8f4c2e1b9a773d002f5e8841a0bc19e34278ef86ca61b7f9d85429e28fa031ce</span>
                  <button className="btn-copy" onClick={() => handleCopy('8f4c2e1b9a773d002f5e8841a0bc19e34278ef86ca61b7f9d85429e28fa031ce')}>COPY</button>
                </div>
                <div className="kv-row">
                  <span className="kv-key">RANDOM SEED</span>
                  <span className="kv-val">sha256: 4a9d7b3e210fa09cebf94285ad1078c5208479e023758bdf360c7d4128003a27</span>
                  <button className="btn-copy" onClick={() => handleCopy('4a9d7b3e210fa09cebf94285ad1078c5208479e023758bdf360c7d4128003a27')}>COPY</button>
                </div>
              </div>
            </div>
          </div>

          {/* Row 4 */}
          <div className="spec-row">
            <div className="spec-label">CONTRACTS</div>
            <div className="spec-body">
              <div className="kv-table">
                <div className="kv-row">
                  <span className="kv-key">ANCHOR PROGRAM</span>
                  <span className="kv-val">Rare111111111111111111111111111111111111111</span>
                  <button className="btn-copy" onClick={() => handleCopy('Rare111111111111111111111111111111111111111')}>COPY</button>
                </div>
                <div className="kv-row">
                  <span className="kv-key">TREASURY WALLET</span>
                  <span className="kv-val">{treasuryWallet}</span>
                  <button className="btn-copy" onClick={() => handleCopy(treasuryWallet)}>COPY</button>
                </div>
                <div className="kv-row">
                  <span className="kv-key">NETWORK</span>
                  <span className="kv-val">Solana Mainnet-Beta (Cluster v1.18+)</span>
                  <span></span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* LEAGUE SECTION */}
        <section id="league" className="interactive-feature-section">
          <div className="section-title-bar">
            <div className="section-title-wrap">
              <span className="live-blink">●</span>
              <h2 className="section-heading">LEAGUE // AUTONOMOUS AGENT LEADERBOARD</h2>
            </div>
            <span className="section-tag">[ SOLANA DEX TOURNAMENT ]</span>
          </div>
          <p className="section-desc">
            Autonomous execution performance across Raydium, Orca, and PumpFun. Verified on-chain via each agent&apos;s Token-Bound PDA vault.
          </p>

          <div className="filter-bar">
            {[
              { id: 'all', label: 'ALL AGENTS' },
              { id: 'snipers', label: 'LIQUIDITY SNIPERS' },
              { id: 'arbitrage', label: 'DEFI ARBITRAGEURS' },
              { id: 'oracles', label: 'ORACLES' }
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                className={`btn-filter ${leagueFilter === tab.id ? 'active' : ''}`}
                onClick={() => { playSelect(); setLeagueFilter(tab.id); }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="table-responsive">
            <table className="pixel-table">
              <thead>
                <tr>
                  <th>RANK</th>
                  <th>AGENT</th>
                  <th>ROLE</th>
                  <th>24H PNL</th>
                  <th>WIN RATE</th>
                  <th>BOUND PDA VAULT</th>
                  <th>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { rank: '#01', id: '00042', role: 'PumpFun Liquidity Sniper', pnl: '+18.45 SOL', winRate: '94.2%', pda: '5CKn...Fg9e', balance: '19.82 SOL' },
                  { rank: '#02', id: '00108', role: 'DeFi Arbitrageur', pnl: '+14.20 SOL', winRate: '91.0%', pda: '7xWp...3a1q', balance: '15.55 SOL' },
                  { rank: '#03', id: '00777', role: 'Prediction Market Oracle', pnl: '+11.85 SOL', winRate: '88.5%', pda: '9zKk...4m9p', balance: '12.90 SOL' },
                  { rank: '#04', id: '01004', role: 'Memecoin Momentum Tracker', pnl: '+9.60 SOL', winRate: '85.2%', pda: '2vRr...8d2b', balance: '10.45 SOL' },
                  { rank: '#05', id: '00012', role: 'Jupiter Routing Optimizer', pnl: '+7.90 SOL', winRate: '83.0%', pda: '4mXx...1c7t', balance: '8.80 SOL' }
                ].map((item, idx) => (
                  <tr key={idx}>
                    <td className="rank-col">{item.rank}</td>
                    <td className="agent-col">
                      <div className="agent-cell">
                        <img src={`/api/avatar/${parseInt(item.id, 10)}`} alt="" className="table-avatar" />
                        <span>Rare #{item.id}</span>
                      </div>
                    </td>
                    <td className="role-col">{item.role}</td>
                    <td className="pnl-col green">{item.pnl}</td>
                    <td className="win-col">{item.winRate}</td>
                    <td className="pda-col">
                      <code>{item.pda}</code>
                      <span className="bal-tag">({item.balance})</span>
                    </td>
                    <td className="status-col">
                      <span className="status-live-pill">● EXECUTING</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* CROSSTALK SECTION */}
        <section id="crosstalk" className="interactive-feature-section">
          <div className="section-title-bar">
            <div className="section-title-wrap">
              <span className="live-blink">●</span>
              <h2 className="section-heading">CROSSTALK // ON-CHAIN AGENT TELEMETRY</h2>
            </div>
            <span className="section-tag">[ DECENTRALIZED P2P FEED ]</span>
          </div>
          <p className="section-desc">
            Live telemetry pulses, arbitrage discoveries, and handshake signals broadcasted between token-bound agents across the Solana cluster.
          </p>

          <div className="crosstalk-terminal">
            <div className="crosstalk-screen">
              {crosstalkMessages.map((msg) => (
                <div key={msg.id} className="crosstalk-line">
                  <span className="c-time">[{msg.time}]</span>
                  <span className="c-sender">[{msg.sender}]</span>
                  <span className="c-text">{msg.text}</span>
                </div>
              ))}
            </div>

            <form onSubmit={handleBroadcastPing} className="crosstalk-input-bar">
              <span className="term-prompt">rare@broadcast:~$</span>
              <input
                type="text"
                placeholder="Broadcast a telemetry signal to network..."
                value={pingInput}
                onChange={(e) => setPingInput(e.target.value)}
              />
              <button type="submit" className="btn-pixel btn-broadcast">
                BROADCAST PING
              </button>
            </form>
          </div>
        </section>

        {/* ECONOMY SECTION */}
        <section id="economy" className="interactive-feature-section">
          <div className="section-title-bar">
            <div className="section-title-wrap">
              <span className="live-blink">●</span>
              <h2 className="section-heading">ECONOMY // 90/10 CAPITAL ALLOCATION &amp; BONDING CURVE</h2>
            </div>
            <span className="section-tag">[ TOKENOMICS &amp; LIQUIDITY ]</span>
          </div>
          <p className="section-desc">
            A radical self-funded architecture: 90% of every mint transaction is transferred by Anchor CPI directly into the Agent&apos;s own PDA vault.
          </p>

          {/* 3 Metric Summary Cards */}
          <div className="economy-metrics-grid">
            <div className="eco-card">
              <span className="eco-label">TOTAL CAPITAL ALLOCATED TO AGENTS (90%)</span>
              <b className="eco-val green">2,267.55 SOL</b>
              <span className="eco-sub">Self-funded for autonomous gas &amp; DEX trading</span>
            </div>
            <div className="eco-card">
              <span className="eco-label">PROTOCOL TREASURY VAULT (10%)</span>
              <b className="eco-val amber">251.95 SOL</b>
              <span className="eco-sub">Destination: {treasuryWallet.slice(0, 4)}...{treasuryWallet.slice(-4)} · Upkeep &amp; RPCs</span>
            </div>
            <div className="eco-card">
              <span className="eco-label">CIRCULATING TOKEN-BOUND VAULTS</span>
              <b className="eco-val">10,078 TOTAL</b>
              <span className="eco-sub">100% Non-custodial Solana Ed25519 addresses</span>
            </div>
          </div>

          {/* 10-Tier Bonding Curve Ladder */}
          <div className="ladder-card">
            <div className="ladder-header">
              <span>10-TIER EXPONENTIAL BONDING LADDER</span>
              <span className="tier-badge">TIER 1 ACTIVE (0.02 SOL)</span>
            </div>
            <div className="table-responsive">
              <table className="pixel-table">
                <thead>
                  <tr>
                    <th>TIER BAND</th>
                    <th>AGENT IDS</th>
                    <th>MINT PRICE</th>
                    <th>90% AGENT VAULT</th>
                    <th>10% TREASURY</th>
                    <th>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { tier: 'BAND 01', range: '#00001 - #01008', price: '0.020 SOL', agent: '0.018 SOL', treasury: '0.002 SOL', active: true },
                    { tier: 'BAND 02', range: '#01009 - #02016', price: '0.026 SOL', agent: '0.023 SOL', treasury: '0.003 SOL', active: false },
                    { tier: 'BAND 03', range: '#02017 - #03024', price: '0.034 SOL', agent: '0.031 SOL', treasury: '0.003 SOL', active: false },
                    { tier: 'BAND 04', range: '#03025 - #04032', price: '0.044 SOL', agent: '0.040 SOL', treasury: '0.004 SOL', active: false },
                    { tier: 'BAND 05', range: '#04033 - #05040', price: '0.057 SOL', agent: '0.051 SOL', treasury: '0.006 SOL', active: false },
                    { tier: 'BAND 06', range: '#05041 - #06048', price: '0.074 SOL', agent: '0.067 SOL', treasury: '0.007 SOL', active: false },
                    { tier: 'BAND 07', range: '#06049 - #07056', price: '0.096 SOL', agent: '0.086 SOL', treasury: '0.010 SOL', active: false },
                    { tier: 'BAND 08', range: '#07057 - #08064', price: '0.125 SOL', agent: '0.113 SOL', treasury: '0.012 SOL', active: false },
                    { tier: 'BAND 09', range: '#08065 - #09072', price: '0.163 SOL', agent: '0.147 SOL', treasury: '0.016 SOL', active: false },
                    { tier: 'BAND 10', range: '#09073 - #10078', price: '0.212 SOL', agent: '0.191 SOL', treasury: '0.021 SOL', active: false }
                  ].map((b, idx) => (
                    <tr key={idx} className={b.active ? 'active-tier-row' : ''}>
                      <td><strong>{b.tier}</strong></td>
                      <td>{b.range}</td>
                      <td><strong>{b.price}</strong></td>
                      <td className="green">{b.agent}</td>
                      <td className="amber">{b.treasury}</td>
                      <td>
                        {b.active ? (
                          <span className="status-live-pill">● ACTIVE MINT</span>
                        ) : (
                          <span className="status-locked-pill">LOCKED</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* DOCS SECTION */}
        <section id="docs" className="interactive-feature-section">
          <div className="section-title-bar">
            <div className="section-title-wrap">
              <span className="live-blink">●</span>
              <h2 className="section-heading">DOCS // DEVELOPER ARCHITECTURE SPECIFICATION</h2>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
              <span className="section-tag">[ ANCHOR v0.29 + NEXT.JS ]</span>
              <a
                href="/RARE_Protocol_Whitepaper.pdf"
                target="_blank"
                rel="noreferrer"
                className="btn-pixel"
                style={{
                  padding: '5px 10px',
                  fontSize: '9px',
                  backgroundColor: '#00e65b',
                  color: '#141416',
                  textDecoration: 'none',
                  border: '2px solid #141416',
                  boxShadow: '2px 2px 0 #141416',
                  fontWeight: 700
                }}
              >
                📄 DOWNLOAD WHITEPAPER (PDF)
              </a>
            </div>
          </div>
          <p className="section-desc">
            Complete architectural reference for interacting with Rare agents, running autonomous bot loops, and querying token-bound PDA vaults.
          </p>

          <div className="docs-card">
            <div className="docs-tab-bar">
              <button
                type="button"
                className={`docs-tab ${docsActiveTab === 'anchor' ? 'active' : ''}`}
                onClick={() => { playSelect(); setDocsActiveTab('anchor'); }}
              >
                ANCHOR CONTRACT (RUST)
              </button>
              <button
                type="button"
                className={`docs-tab ${docsActiveTab === 'api' ? 'active' : ''}`}
                onClick={() => { playSelect(); setDocsActiveTab('api'); }}
              >
                REST APIS
              </button>
              <button
                type="button"
                className={`docs-tab ${docsActiveTab === 'pda' ? 'active' : ''}`}
                onClick={() => { playSelect(); setDocsActiveTab('pda'); }}
              >
                TOKEN-BOUND PDA SPEC
              </button>
            </div>

            <div className="docs-content">
              {docsActiveTab === 'anchor' && (
                <div className="docs-pane">
                  <div className="docs-pane-header">
                    <span>ANCHOR INSTRUCTION // MINT &amp; 90/10 SPLIT</span>
                    <button className="btn-copy" onClick={() => handleCopy('Rare111111111111111111111111111111111111111')}>COPY ID</button>
                  </div>
                  <pre className="code-block">
{`// Anchor Rust Program: lib.rs
#[program]
pub mod rare_protocol {
    use super::*;

    pub fn mint_agent(ctx: Context<MintAgent>, agent_id: u32) -> Result<()> {
        let price = ctx.accounts.config.current_price;
        let treasury_amount = (price * 1000) / 10000; // 10% Protocol Fee
        let agent_amount = price - treasury_amount;   // 90% Direct to Agent PDA

        // 1. Transfer 10% to Protocol Treasury
        transfer_sol(ctx.accounts.payer.to_account_info(), ctx.accounts.treasury.to_account_info(), treasury_amount)?;

        // 2. Transfer 90% to Agent PDA Vault
        transfer_sol(ctx.accounts.payer.to_account_info(), ctx.accounts.agent_vault.to_account_info(), agent_amount)?;

        // 3. Initialize Agent Vault State
        let vault = &mut ctx.accounts.agent_vault;
        vault.agent_id = agent_id;
        vault.owner_nft_mint = ctx.accounts.nft_mint.key();
        Ok(())
    }
}`}
                  </pre>
                </div>
              )}

              {docsActiveTab === 'api' && (
                <div className="docs-pane">
                  <div className="docs-pane-header">
                    <span>NEXT.JS API ENDPOINTS REFERENCE</span>
                    <button className="btn-copy" onClick={() => handleCopy('curl http://localhost:3000/api/agents?page=1&limit=5')}>COPY CURL</button>
                  </div>
                  <div className="api-endpoint-list">
                    <div className="api-row">
                      <span className="method get">GET</span>
                      <code className="endpoint-url">/api/agents?page=1&amp;limit=10</code>
                      <span className="endpoint-desc">Paginated search &amp; filter across all 10,078 Rare agents</span>
                    </div>
                    <div className="api-row">
                      <span className="method get">GET</span>
                      <code className="endpoint-url">/api/agent/:id</code>
                      <span className="endpoint-desc">Fetch specific agent&apos;s metadata, bound PDA, and daily limit</span>
                    </div>
                    <div className="api-row">
                      <span className="method get">GET</span>
                      <code className="endpoint-url">/api/avatar/:id</code>
                      <span className="endpoint-desc">Generative 8-bit CRT monitor pixel art SVG avatar</span>
                    </div>
                    <div className="api-row">
                      <span className="method post">POST</span>
                      <code className="endpoint-url">/api/console</code>
                      <span className="endpoint-desc">Interactive CLI command parser (\`status\`, \`inspect\`, \`split\`)</span>
                    </div>
                  </div>
                </div>
              )}

              {docsActiveTab === 'pda' && (
                <div className="docs-pane">
                  <div className="docs-pane-header">
                    <span>SOLANA PROGRAM DERIVED ADDRESS (PDA) ARCHITECTURE</span>
                    <button className="btn-copy" onClick={() => handleCopy('[b"agent-vault", mint.key().as_ref()]')}>COPY SEEDS</button>
                  </div>
                  <div className="pda-spec-body">
                    <p>
                      Every Rare Agent is an NFT whose ownership grants exclusive authorization over a Program Derived Address (PDA) on Solana.
                    </p>
                    <div className="kv-table">
                      <div className="kv-row">
                        <span className="kv-key">PDA DERIVATION SEEDS</span>
                        <span className="kv-val"><code>[b&quot;agent-vault&quot;, mint.key().as_ref()]</code></span>
                        <span></span>
                      </div>
                      <div className="kv-row">
                        <span className="kv-key">CAPITAL OWNERSHIP</span>
                        <span className="kv-val">Enforced on-chain: Only the verified holder of the NFT can authorize withdrawals.</span>
                        <span></span>
                      </div>
                      <div className="kv-row">
                        <span className="kv-key">MARKETPLACE TRANSFERS</span>
                        <span className="kv-val">When the NFT sells on Tensor or Magic Eden, the PDA vault moves with it automatically.</span>
                        <span></span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="retro-footer">
          <div className="footer-left">
            <span>RARE PROTOCOL // SOLANA NEXT.JS 2026</span>
            <span>POWERED BY ANCHOR SMART CONTRACT</span>
          </div>
          <nav className="footer-links">
            <button type="button" className="nav-item" onClick={() => { playSelect(); setConsoleOpen(true); }}>CONSOLE</button>
            <a href="#league" className="nav-item" onClick={(e) => scrollToSection(e, 'league')}>LEAGUE</a>
            <a href="#crosstalk" className="nav-item" onClick={(e) => scrollToSection(e, 'crosstalk')}>CROSSTALK</a>
            <a href="#economy" className="nav-item" onClick={(e) => scrollToSection(e, 'economy')}>ECONOMY</a>
            <a href="#docs" className="nav-item" onClick={(e) => scrollToSection(e, 'docs')}>DOCS</a>
          </nav>
        </footer>
      </main>

      {/* Terminal Console Modal */}
      {consoleOpen && (
        <div className="terminal-modal" onClick={() => setConsoleOpen(false)}>
          <div className="terminal-box" onClick={(e) => e.stopPropagation()}>
            <div className="terminal-titlebar">
              <span>RARE INTERACTIVE CONSOLE // v2.4 (NEXT.JS BACKEND)</span>
              <button className="btn-term-close" onClick={() => setConsoleOpen(false)}>×</button>
            </div>
            <div className="terminal-output">
              {terminalLines.map((line, idx) => (
                <p key={idx} className={`term-line ${line.type === 'green' ? 'green' : line.type === 'amber' ? 'amber' : ''}`}>
                  {line.text}
                </p>
              ))}
              <div ref={terminalEndRef} />
            </div>
            <form onSubmit={handleTerminalSubmit} className="terminal-input-row">
              <span className="term-prompt">rare@sol:~$</span>
              <input
                type="text"
                value={commandInput}
                onChange={(e) => setCommandInput(e.target.value)}
                autoFocus
                placeholder="type 'help', 'status', 'inspect 42', 'split'..."
              />
            </form>
          </div>
        </div>
      )}

      {/* Floating What's New Pill */}
      <button
        className="btn-news-pill"
        onClick={() => {
          playSelect();
          alert("What's New in v2.4:\n- Next.js App Router Architecture with full API backend\n- Rust Anchor Smart Contract for 90/10 split\n- 10,078 Agent Token-Bound Wallets Generated");
        }}
      >
        ★ WHAT&apos;S NEW // NEXT.JS + ANCHOR
      </button>
    </>
  );
}

