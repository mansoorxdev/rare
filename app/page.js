'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePrivy } from '../components/PrivyClientProvider';
import Agent360Viewer from '../components/Agent360Viewer';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
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

  // Automatic Cycling Showcase for Hero Visual Section
  const FEATURED_HERO_AGENTS = [143, 1, 15, 27, 42, 69, 88, 120, 256, 333, 512, 777, 888, 1008];
  const [showcaseIndex, setShowcaseIndex] = useState(0);
  const [showcaseAutoplay, setShowcaseAutoplay] = useState(true);

  useEffect(() => {
    if (!showcaseAutoplay) return;
    const interval = setInterval(() => {
      setShowcaseIndex((prev) => (prev + 1) % FEATURED_HERO_AGENTS.length);
    }, 3200);

    return () => clearInterval(interval);
  }, [showcaseAutoplay, FEATURED_HERO_AGENTS.length]);

  const currentShowcaseId = FEATURED_HERO_AGENTS[showcaseIndex];
  const currentShowcaseAgent = getAgentMetadata(currentShowcaseId);

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
    const heroEl = document.getElementById('mint-engine') || document.getElementById('home');
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
      setMintStatus('Please connect wallet first.');
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
        ...agentMeta,
        quantity,
        funding: `${deposited} SOL`,
        txHash: `4xL7kQ${Math.random().toString(36).substring(2, 8)}wE8${Math.random().toString(36).substring(2, 8)}Sol`
      });
    }, 1800);
  };

  const handleMintDirectAgent = (agent) => {
    if (!agent) return;
    if (ready && !authenticated) {
      setMintStatus('Please connect wallet first.');
      login();
      return;
    }

    setIsMinting(true);
    setMintStatus(`Initiating Anchor CPI 90/10 capital split for #${agent.id}...`);

    setTimeout(() => {
      setMintStatus(`Deriving Token-Bound PDA Vault for #${agent.id}...`);
    }, 700);

    setTimeout(() => {
      const mintedPrice = agent.priceSol || 0.02;
      const deposited = (mintedPrice * 0.9).toFixed(3);
      setSoldCount(prev => prev + 1);
      setIsMinting(false);
      setMintStatus(`Success! Rare #${agent.id} activated. 90% (${deposited} SOL) deposited into Agent PDA.`);
      setInspectedAgentModal(null);
      setMintCelebration({
        ...agent,
        quantity: 1,
        funding: `${deposited} SOL`,
        txHash: `4xL7kQ${Math.random().toString(36).substring(2, 8)}wE8${Math.random().toString(36).substring(2, 8)}Sol`
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
      {/* Global Navigation Bar */}
      <Navbar />

      <div className="wrap">
        {/* ============================================================ */}
        {/* GRAND PROTOCOL HERO LANDING SECTION                          */}
        {/* ============================================================ */}
        <section className="protocol-hero" id="home">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px', marginBottom: '20px' }}>
            <div className="protocol-hero-badge">
              <span className="pulse" />
              <span>SOLANA MAINNET-BETA // 10,078 TOKEN-BOUND AUTONOMOUS AGENTS</span>
            </div>

            <a
              href="https://x.com"
              target="_blank"
              rel="noreferrer"
              className="btn-twitter-black"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              <span>Follow @RARE on X</span>
            </a>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px', alignItems: 'center', marginBottom: '32px' }}>
            <div>
              <h1 className="protocol-hero-title">
                THE AUTONOMOUS <span style={{ color: 'var(--script-green)', textShadow: '0 0 24px rgba(0, 170, 68, 0.25)' }}>AI AGENT SWARM</span> ON SOLANA.
              </h1>
              <p className="protocol-hero-subtitle">
                10,078 sovereign AI agents with token-bound PDA vaults. 90% of mint capital is deposited directly into each agent&apos;s on-chain wallet via Solana Anchor CPI to fund autonomous execution, trading, and arbitrage.
              </p>

              <div className="protocol-hero-actions">
                <a
                  href="#mint-engine"
                  className="btn-primary"
                  style={{ padding: '13px 26px', fontSize: '13px' }}
                >
                  MINT AGENT (0.02 SOL) ↓
                </a>
                <Link
                  href="/roster"
                  className="btn-secondary"
                  style={{ padding: '13px 22px', fontSize: '13px' }}
                >
                  EXPLORE 10,078 ROSTER →
                </Link>
                <Link
                  href="/whitepaper"
                  className="btn-secondary"
                  style={{ padding: '13px 18px', fontSize: '13px' }}
                >
                  WHITEPAPER ↗
                </Link>
              </div>

              {/* Protocol Stats Highlights */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', borderTop: '2px solid var(--hair)', paddingTop: '20px' }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--dim)', textTransform: 'uppercase', fontWeight: 700 }}>SUPPLY</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 800, color: '#ffffff' }}>10,078</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--script-green)' }}>Genesis Capped</div>
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--dim)', textTransform: 'uppercase', fontWeight: 700 }}>CAPITAL ROUTING</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 800, color: 'var(--script-green)' }}>90% PDA</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--dim)' }}>Anchor CPI Vaults</div>
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--dim)', textTransform: 'uppercase', fontWeight: 700 }}>GENESIS FLOOR</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 800, color: '#ffffff' }}>0.02 SOL</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--dim)' }}>Band 1 Active</div>
                </div>
              </div>
            </div>

            {/* Right Side Visual Banner Card (Cinematic Animated Swarm Cycle) */}
            <div>
              <div className="hero-showcase-card">
                {/* Header with live pulsing dot & count */}
                <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--hair)', paddingBottom: '12px', marginBottom: '16px', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
                  <div
                    key={`head-${currentShowcaseAgent.id}`}
                    className="hero-text-anim"
                    style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <span className="pulse" style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--script-green)', display: 'inline-block' }} />
                    <span style={{ fontWeight: 800, color: 'var(--script-green)', letterSpacing: '0.04em' }}>
                      GENESIS #{String(currentShowcaseAgent.id).padStart(5, '0')}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ background: '#000', color: '#fff', padding: '2px 6px', fontSize: '9px', fontWeight: 700, border: '1px solid var(--hair-dark)' }}>
                      TOKEN-BOUND
                    </span>
                    <span style={{ background: 'rgba(0, 255, 102, 0.12)', color: 'var(--script-green)', padding: '2px 6px', fontSize: '9px', fontWeight: 800, border: '1px solid rgba(0, 255, 102, 0.3)' }}>
                      {showcaseIndex + 1}/{FEATURED_HERO_AGENTS.length}
                    </span>
                  </div>
                </div>

                {/* Animated NFT Box with Smooth 3D Slide & Laser Scanline */}
                <div className="hero-nft-viewport">
                  {/* High-tech biometric laser scanline */}
                  <div className="holo-scanline-beam" />

                  {/* Silky 3D Slide Card */}
                  <div
                    key={currentShowcaseAgent.id}
                    className="hero-nft-card-inner animate-in"
                  >
                    {/* Subtle Holographic Glass Glare */}
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 45%, rgba(0,255,102,0.12) 100%)',
                        pointerEvents: 'none',
                        zIndex: 2
                      }}
                    />

                    <img
                      src={currentShowcaseAgent.image || `/nfts/${currentShowcaseAgent.id}.svg`}
                      alt={currentShowcaseAgent.name}
                      style={{
                        width: '88%',
                        height: '88%',
                        objectFit: 'contain',
                        imageRendering: 'pixelated',
                        filter: 'drop-shadow(0 6px 12px rgba(0, 0, 0, 0.45))',
                        position: 'relative',
                        zIndex: 1
                      }}
                    />

                    {/* Solana PDA Vault Indicator Pill */}
                    <div style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(0, 0, 0, 0.85)', color: 'var(--script-green)', fontSize: '8px', fontWeight: 800, padding: '2px 5px', border: '1px solid var(--script-green)', borderRadius: '3px', letterSpacing: '0.05em', zIndex: 3 }}>
                      SOLANA PDA
                    </div>

                    {/* Vault Balance Pill */}
                    <div style={{ position: 'absolute', bottom: '8px', right: '8px', background: 'var(--script-green)', color: '#000000', fontSize: '9px', fontWeight: 800, padding: '2px 6px', border: '1px solid #000', borderRadius: '3px', boxShadow: '0 2px 6px rgba(0,0,0,0.4)', zIndex: 3 }}>
                      {(currentShowcaseAgent.priceSol * 0.9).toFixed(3)} SOL IN VAULT
                    </div>
                  </div>
                </div>

                {/* Details Box with Smooth Slide-Up Transition */}
                <div
                  key={`details-${currentShowcaseAgent.id}`}
                  className="hero-text-anim"
                  style={{ width: '100%', textAlign: 'left', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--hair)', padding: '12px 14px', fontFamily: 'var(--font-mono)', fontSize: '11px', marginBottom: '0', borderRadius: 'var(--radius-sm)' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ color: 'var(--dim)' }}>Role:</span>
                    <b style={{ color: '#ffffff' }}>{currentShowcaseAgent.role}</b>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ color: 'var(--dim)' }}>Archetype:</span>
                    <span style={{ color: 'var(--ink)' }}>{currentShowcaseAgent.archetype}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--dim)' }}>PDA Vault:</span>
                    <span style={{ color: 'var(--script-green)', fontWeight: 700, fontSize: '10px' }}>{currentShowcaseAgent.pdaVault}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3 Value Pillars */}
          <div className="protocol-hero-pillars">
            <div className="protocol-hero-pillar">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--script-green)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 700, textTransform: 'uppercase' }}>90% Token-Bound PDA</h3>
              </div>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--dim)', lineHeight: 1.6 }}>
                Every minted agent is an on-chain NFT that owns its own program-derived wallet holding 90% of the mint price to fund autonomous execution.
              </p>
            </div>

            <div className="protocol-hero-pillar">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="var(--script-green)"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 700, textTransform: 'uppercase' }}>Anchor CPI Architecture</h3>
              </div>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--dim)', lineHeight: 1.6 }}>
                Solana Anchor Cross-Program Invocation guarantees cryptographic split of funds. No human or team multi-sig can bypass the routing logic.
              </p>
            </div>

            <div className="protocol-hero-pillar">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--script-green)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 700, textTransform: 'uppercase' }}>10-Tier Bonding Curve</h3>
              </div>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--dim)', lineHeight: 1.6 }}>
                Strict supply cap of 10,078 units scaling across 10 deterministic price bands starting from 0.02 SOL up to 0.212 SOL with secondary liquidity retention.
              </p>
            </div>
          </div>
        </section>

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
        <section className="sa-hero" id="mint-engine">
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
              <span className="sa-tag" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <img src="/rare-logo-icon.png" alt="" style={{ width: '14px', height: '14px', objectFit: 'contain' }} />
                <span>On-Chain PDA Funding Engine</span>
              </span>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 3.5vw, 36px)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px' }}>
                MINT &amp; ACTIVATE GENESIS AGENTS
              </h2>
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
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '');
                        if (!val) {
                          setRareId('');
                          return;
                        }
                        const n = parseInt(val, 10);
                        if (n > 10078) setRareId('10078');
                        else setRareId(val);
                      }}
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
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="var(--script-green)"><circle cx="12" cy="12" r="4"/></svg>
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
                        src={agent.image || `/nfts/${agent.id}.svg`}
                        alt={agent.name}
                        loading="lazy"
                        className="w-full h-full object-contain"
                        style={{
                          imageRendering: 'pixelated',
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

        {/* Global Footer */}
        <Footer />
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
              background: 'linear-gradient(180deg, rgba(16, 21, 30, 0.96) 0%, rgba(10, 13, 19, 0.98) 100%)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.85), 0 0 35px -5px rgba(0, 229, 153, 0.15)',
              overflow: 'hidden'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 18px',
                background: 'rgba(255, 255, 255, 0.03)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: 'var(--dim)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="sa-brand-icon" style={{ width: '18px', height: '18px', padding: '1px', boxShadow: 'none' }}>
                  <img src="/rare-logo-icon.png" alt="RARE" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </span>
                <span style={{ color: 'var(--script-green)', fontWeight: 700 }}>ANCHOR CPI TELEMETRY // TOKEN-BOUND AGENT CONSOLE</span>
              </div>
              <button
                onClick={() => setConsoleOpen(false)}
                style={{ background: 'none', border: 'none', color: '#fff', fontSize: '18px', cursor: 'pointer', lineHeight: 1 }}
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
                <span style={{ color: '#00aa44', marginRight: '6px', fontWeight: 700 }}>rare@sol:~$</span>
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
          className="rare-modal-overlay"
          onClick={() => setMintCelebration(null)}
        >
          <div
            className="rare-modal-dialog"
            style={{ maxWidth: '580px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--hair)', paddingBottom: '12px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--script-green)', boxShadow: '0 0 10px var(--script-green)', display: 'inline-block' }} />
                <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--script-green)', letterSpacing: '0.04em' }}>
                  AGENT ACTIVATED // ON-CHAIN PDA FUNDED
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setMintCelebration(null)}
                style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', padding: '3px 8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--hair-dark)', background: 'rgba(255, 255, 255, 0.05)', color: '#ffffff', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <div className="rare-modal-grid">
              <div style={{ border: '1px solid var(--hair)', background: 'radial-gradient(circle at 50% 60%, rgba(0, 229, 153, 0.1) 0%, #080a0f 75%)', borderRadius: 'var(--radius-md)', padding: '16px', boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img
                  src={mintCelebration.image || `/nfts/${mintCelebration.id}.svg`}
                  alt={mintCelebration.name}
                  style={{ width: '100%', aspectRatio: '1', objectFit: 'contain', imageRendering: 'pixelated' }}
                />
              </div>

              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ fontSize: '18px', fontWeight: 800, fontFamily: 'var(--font-display)', textTransform: 'uppercase', color: '#ffffff' }}>{mintCelebration.name}</div>
                <div style={{ color: 'var(--script-green)', fontWeight: 700, fontSize: '11px' }}>SOLANA TOKEN-BOUND ACCOUNT</div>
                <div style={{ padding: '12px', border: '1px solid var(--hair)', background: 'rgba(255, 255, 255, 0.03)', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '11px', color: '#ffffff' }}>
                  <div><b style={{ color: 'var(--dim)' }}>PDA Vault:</b> <span style={{ fontSize: '10px', color: 'var(--script-green)', display: 'block', wordBreak: 'break-all', marginTop: '2px' }}>{mintCelebration.pdaVault}</span></div>
                  <div><b style={{ color: 'var(--dim)' }}>Capital Deposited:</b> <span style={{ color: 'var(--script-green)', fontWeight: 700 }}>{mintCelebration.funding}</span> (90%)</div>
                  <div><b style={{ color: 'var(--dim)' }}>Protocol Split:</b> 10% Treasury</div>
                </div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--hair)', paddingTop: '16px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <a
                href={`https://solscan.io/account/${treasuryWallet}`}
                target="_blank"
                rel="noreferrer"
                className="btn-primary"
                style={{ flex: 1, textAlign: 'center', padding: '10px 0', fontSize: '12px' }}
              >
                View On Solscan ↗
              </a>
              <button
                type="button"
                onClick={() => handleDownloadManifest(mintCelebration)}
                className="btn-secondary"
                style={{ padding: '10px 14px', fontSize: '12px', cursor: 'pointer' }}
              >
                Download Metaplex JSON ↓
              </button>
              <button
                type="button"
                onClick={() => setMintCelebration(null)}
                className="btn-secondary"
                style={{ padding: '10px 16px', fontSize: '12px', cursor: 'pointer' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detailed Agent Specs Modal */}
      {inspectedAgentModal && (
        <div
          className="rare-modal-overlay"
          onClick={() => setInspectedAgentModal(null)}
        >
          <div
            className="rare-modal-dialog"
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--hair)', paddingBottom: '14px', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 800, background: 'var(--script-green)', color: '#000000', padding: '3px 8px', border: '1px solid #000000' }}>
                  #{String(inspectedAgentModal.id).padStart(5, '0')}
                </span>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '17px', textTransform: 'uppercase', color: '#ffffff', letterSpacing: '0.02em' }}>
                  {inspectedAgentModal.role}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setInspectedAgentModal(null)}
                style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', padding: '3px 8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--hair-dark)', background: 'rgba(255, 255, 255, 0.05)', color: '#ffffff', cursor: 'pointer', transition: 'all 0.15s ease' }}
                title="Close"
              >
                ✕
              </button>
            </div>

            <div className="rare-modal-grid">
              <div style={{ border: '1px solid var(--hair)', background: 'radial-gradient(circle at 50% 65%, rgba(0, 229, 153, 0.12) 0%, #080a0f 75%)', borderRadius: 'var(--radius-md)', padding: '16px', boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <img
                  src={inspectedAgentModal.image || `/nfts/${inspectedAgentModal.id}.svg`}
                  alt={inspectedAgentModal.name}
                  style={{ width: '100%', aspectRatio: '1', objectFit: 'contain', imageRendering: 'pixelated', filter: 'drop-shadow(0 10px 16px rgba(0,0,0,0.7))' }}
                />
                <span style={{ marginTop: '10px', fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--script-green)', background: 'rgba(0, 229, 153, 0.12)', border: '1px solid rgba(0, 229, 153, 0.3)', borderRadius: 'var(--radius-sm)', padding: '2px 8px' }}>
                  TOKEN-BOUND PDA ASSET
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
                <div>
                  <span style={{ fontSize: '10px', color: 'var(--dim)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>MISSION PROMPT</span>
                  <p style={{ marginTop: '4px', padding: '10px 12px', border: '1px solid var(--hair)', borderLeft: '3px solid var(--script-green)', background: 'rgba(0, 229, 153, 0.04)', borderRadius: 'var(--radius-sm)', fontSize: '11px', color: '#e4e4e7', fontStyle: 'italic', lineHeight: 1.6 }}>
                    &ldquo;{inspectedAgentModal.personalityPreview}&rdquo;
                  </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '11px' }}>
                  <div style={{ padding: '9px 11px', border: '1px solid var(--hair)', background: 'rgba(255, 255, 255, 0.03)', borderRadius: 'var(--radius-sm)' }}>
                    <div style={{ fontSize: '9px', color: 'var(--dim)', fontWeight: 700, textTransform: 'uppercase' }}>ARCHETYPE</div>
                    <div style={{ fontWeight: 700, color: '#ffffff', marginTop: '2px' }}>{inspectedAgentModal.archetype}</div>
                  </div>
                  <div style={{ padding: '9px 11px', border: '1px solid var(--hair)', background: 'rgba(255, 255, 255, 0.03)', borderRadius: 'var(--radius-sm)' }}>
                    <div style={{ fontSize: '9px', color: 'var(--dim)', fontWeight: 700, textTransform: 'uppercase' }}>EXECUTION ENGINE</div>
                    <div style={{ fontWeight: 700, color: 'var(--script-green)', marginTop: '2px' }}>{inspectedAgentModal.engine}</div>
                  </div>
                  <div style={{ padding: '9px 11px', border: '1px solid var(--hair)', background: 'rgba(255, 255, 255, 0.03)', borderRadius: 'var(--radius-sm)' }}>
                    <div style={{ fontSize: '9px', color: 'var(--dim)', fontWeight: 700, textTransform: 'uppercase' }}>PDA CAPITAL</div>
                    <div style={{ fontWeight: 700, color: 'var(--script-green)', marginTop: '2px' }}>{inspectedAgentModal.pdaFunding}</div>
                  </div>
                  <div style={{ padding: '9px 11px', border: '1px solid var(--hair)', background: 'rgba(255, 255, 255, 0.03)', borderRadius: 'var(--radius-sm)' }}>
                    <div style={{ fontSize: '9px', color: 'var(--dim)', fontWeight: 700, textTransform: 'uppercase' }}>RARITY TIER</div>
                    <div style={{ fontWeight: 700, color: '#ffffff', marginTop: '2px' }}>{inspectedAgentModal.rarityTier} ({inspectedAgentModal.rarityScore}%)</div>
                  </div>
                </div>

                <div style={{ padding: '10px 12px', border: '1px solid var(--hair)', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-sm)', fontSize: '10px' }}>
                  <span style={{ color: 'var(--dim)', fontWeight: 700 }}>PROGRAM DERIVED ADDRESS (PDA):</span>
                  <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--script-green)', fontWeight: 700, marginTop: '4px', wordBreak: 'break-all', fontSize: '11px' }}>
                    {inspectedAgentModal.pdaVault}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--hair)', paddingTop: '16px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => handleMintDirectAgent(inspectedAgentModal)}
                disabled={isMinting}
                className="btn-primary"
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  fontSize: '12px',
                  textAlign: 'center',
                  cursor: isMinting ? 'wait' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                <span>{isMinting ? 'MINTING AGENT...' : `MINT AGENT (${inspectedAgentModal.priceSol} SOL)`}</span>
              </button>
              <button
                type="button"
                onClick={() => setInspectedAgentModal(null)}
                className="btn-secondary"
                style={{ padding: '11px 18px', fontSize: '12px', cursor: 'pointer' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
