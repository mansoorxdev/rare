'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Rare3DCanvas from '../components/trix/Rare3DCanvas';
import TrixNavbar from '../components/trix/TrixNavbar';
import TrixHudFooter from '../components/trix/TrixHudFooter';
import AsciiScrambleText, { AsciiCipherTape } from '../components/trix/AsciiScrambleText';
import { usePrivy } from '../components/PrivyClientProvider';
import { getAgentMetadata } from '../lib/agentMetadata';

export default function HomePage() {
  const { ready, authenticated, user, login, logout } = usePrivy();

  // Scroll Tracking for 3D Camera / Perspective Animation
  const [scrollProgress, setScrollProgress] = useState(0);

  // Minting State & Telemetry
  const [soldCount, setSoldCount] = useState(142);
  const [isMinting, setIsMinting] = useState(false);
  const [mintStatus, setMintStatus] = useState('');
  const [inspectedAgent, setInspectedAgent] = useState(null);
  const [mintCelebration, setMintCelebration] = useState(null);

  // Filter tabs for Swarm
  const [activeArchetypeFilter, setActiveArchetypeFilter] = useState('ALL');

  // Developer Setup tab
  const [activeTab, setActiveTab] = useState('hermes');
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedContract, setCopiedContract] = useState(false);

  // Next Agent to Mint
  const nextAgentId = soldCount + 1;
  const nextAgent = getAgentMetadata(nextAgentId);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll <= 0) return;
      const current = window.scrollY / totalScroll;
      setScrollProgress(Math.min(1, Math.max(0, current)));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Middle section (Process / Evidence) transitions to tactical white radar
  const isLightMode = scrollProgress >= 0.44 && scrollProgress <= 0.74;

  // Curated Swarm Archetypes
  const SWARM_AGENTS = [
    {
      id: 143,
      name: 'Agent #00143',
      archetype: 'Quantum Arbitrageur',
      venue: 'Jupiter & Orca',
      badge: 'ACTIVE // JUPITER',
      pdaVault: 'PDA256v3779B100Vault',
      apy: '+42.8%',
      risk: 'Low (Hedging)',
      metricBars: '█████████░░░',
      priceSol: 0.02,
      image: '/assets/agent/rare_amber.jpg'
    },
    {
      id: 140,
      name: 'Agent #00140',
      archetype: 'Sentinel Risk Guard',
      venue: 'Pyth Oracle Shield',
      badge: 'PYTH ORACLE',
      pdaVault: 'PDASentinelGuardVault',
      apy: '+29.4%',
      risk: '-15% Stop Guard',
      metricBars: '███████░░░░░',
      priceSol: 0.02,
      image: '/assets/agent/rare_void.jpg'
    },
    {
      id: 141,
      name: 'Agent #00141',
      archetype: 'CLMM Grid Executor',
      venue: 'Raydium Concentrated',
      badge: 'RAYDIUM CLMM',
      pdaVault: 'PDAGridExecutorVault',
      apy: '+58.2%',
      risk: 'Medium (Tick)',
      metricBars: '███████████░',
      priceSol: 0.02,
      image: '/assets/agent/rare_crimson.jpg'
    },
    {
      id: 142,
      name: 'Agent #00142',
      archetype: 'Vault Rebalancer',
      venue: 'Kamino & Meteora',
      badge: 'AUTO +35% TP',
      pdaVault: 'PDAVaultRebalancer',
      apy: '+34.1%',
      risk: 'Low (Delta 0)',
      metricBars: '████████░░░░',
      priceSol: 0.02,
      image: '/assets/agent/rare_arctic.jpg'
    },
    {
      id: 144,
      name: 'Agent #00144',
      archetype: 'Momentum Hunter',
      venue: 'Volume Breakouts',
      badge: 'TREND SIGNAL',
      pdaVault: 'PDAMomentumVault',
      apy: '+64.5%',
      risk: 'High (Breakout)',
      metricBars: '████████████',
      priceSol: 0.02,
      image: '/assets/agent/rare_arch_emerald.jpg'
    },
    {
      id: 145,
      name: 'Agent #00145',
      archetype: 'Liquidity Provider',
      venue: 'SOL-USDC Anchor',
      badge: '0.05% TIER',
      pdaVault: 'PDALiquidityVault',
      apy: '+31.0%',
      risk: 'Neutral',
      metricBars: '███████░░░░░',
      priceSol: 0.02,
      image: '/assets/agent/rare_front.jpg'
    }
  ];

  const filteredAgents = activeArchetypeFilter === 'ALL'
    ? SWARM_AGENTS
    : SWARM_AGENTS.filter((a) => a.archetype.toLowerCase().includes(activeArchetypeFilter.toLowerCase()));

  // Mint Action Handler (Privy + Anchor CPI 90/10 Simulation)
  const handleMintAction = (agentToMint = nextAgent) => {
    if (ready && !authenticated) {
      setMintStatus('Please connect your Solana wallet.');
      login();
      return;
    }

    setInspectedAgent(agentToMint);
    setIsMinting(true);
    setMintStatus(`Initiating Anchor CPI 90/10 split for Agent #${agentToMint.id}...`);

    setTimeout(() => {
      setMintStatus(`Deriving Token-Bound PDA: ${agentToMint.pdaVault || 'PDARareVault'}...`);
    }, 700);

    setTimeout(() => {
      const mintedPrice = agentToMint.priceSol || 0.02;
      const deposited = (mintedPrice * 0.9).toFixed(4);
      setSoldCount((prev) => prev + 1);
      setIsMinting(false);
      setMintStatus(`Success! Agent #${agentToMint.id} activated on-chain.`);
      setInspectedAgent(null);
      setMintCelebration({
        ...agentToMint,
        deposited,
        txSignature: `4xL7kQ${Math.random().toString(36).substring(2, 8)}wE8${Math.random().toString(36).substring(2, 8)}Sol`
      });
    }, 1800);
  };

  const terminalConfigs = {
    hermes: `{
  "mcpServers": {
    "rare-protocol": {
      "command": "npx",
      "args": ["-y", "@rare-protocol/mcp-agent"],
      "env": {
        "SOLANA_NETWORK": "mainnet-beta",
        "ANCHOR_PDA_VAULT": "90_PERCENT_LOCKED"
      }
    }
  }
}`,
    openclaw: `// OpenClaw Autonomous Trade Feed
curl -X POST https://api.rare.xyz/v1/agent/observe \\
  -H "Authorization: Bearer RARE_API_KEY" \\
  -d '{
    "agent_id": "#00143",
    "strategy": "quantum_arbitrage",
    "enforce_pda_vault": true
  }'`,
    claude: `{
  "claudeCode": {
    "tools": ["rare_ingest_pda", "rare_verify_cpi"],
    "oracle": "pyth.solana.mainnet"
  }
}`
  };

  const copyConfig = () => {
    navigator.clipboard.writeText(terminalConfigs[activeTab] || '');
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const copyContract = () => {
    navigator.clipboard.writeText('7xK9pLm48N2qR5vT8bF2wA6yU3dE1sZ0xO9vQ4mP');
    setCopiedContract(true);
    setTimeout(() => setCopiedContract(false), 2000);
  };

  return (
    <div
      className={isLightMode ? 'trix-grid-light' : 'trix-grid-dark'}
      style={{
        minHeight: '100vh',
        color: isLightMode ? '#0f172a' : '#f8fafc',
        fontFamily: 'var(--font-jetbrains), monospace',
        position: 'relative',
        transition: 'background-color 0.6s ease, color 0.6s ease',
        overflowX: 'hidden'
      }}
    >
      {/* Tactical CRT Scanlines */}
      <div
        className="trix-scanlines"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 5,
          opacity: isLightMode ? 0.15 : 0.4,
          pointerEvents: 'none'
        }}
      />

      {/* Global Tactical Header */}
      <TrixNavbar isLightMode={isLightMode} onMintClick={() => handleMintAction(nextAgent)} />

      {/* Real 3D WebGL Emerald Crystal Canvas (Three.js) */}
      <Rare3DCanvas scrollProgress={scrollProgress} isLightMode={isLightMode} />

      {/* Floating Tactical "ASK RARE" Widget */}
      <TrixHudFooter isLightMode={isLightMode} />

      {/* =========================================================================
          SECTION 01: HERO // INDEPENDENT BENCHMARKS (0% - 25% Scroll)
          ========================================================================= */}
      <section
        id="overview"
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '100px 36px 44px 36px',
          maxWidth: '1440px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 15
        }}
      >
        {/* Top-Right Telemetry Pill in ASCII Box */}
        <div
          style={{
            position: 'absolute',
            top: '84px',
            right: '36px',
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: '10.5px',
            color: '#86efac',
            background: 'rgba(5, 24, 10, 0.82)',
            border: '1px solid rgba(34, 197, 94, 0.4)',
            borderRadius: '2px',
            padding: '8px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            backdropFilter: 'blur(8px)',
            pointerEvents: 'none'
          }}
        >
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 8px #22c55e' }} />
          <span>SOLANA // MAINNET-BETA</span>
          <span style={{ opacity: 0.4 }}>|</span>
          <span>90% PDA CAPITAL LOCKED</span>
        </div>

        {/* Ambient Crosshairs at Radar Intersections */}
        <div style={{ position: 'absolute', top: '25%', left: '16%', color: 'rgba(34, 197, 94, 0.25)', fontFamily: 'var(--font-jetbrains), monospace', fontSize: '14px', pointerEvents: 'none' }}>+</div>
        <div style={{ position: 'absolute', top: '25%', right: '16%', color: 'rgba(34, 197, 94, 0.25)', fontFamily: 'var(--font-jetbrains), monospace', fontSize: '14px', pointerEvents: 'none' }}>+</div>
        <div style={{ position: 'absolute', bottom: '34%', left: '22%', color: 'rgba(34, 197, 94, 0.25)', fontFamily: 'var(--font-jetbrains), monospace', fontSize: '14px', pointerEvents: 'none' }}>+</div>
        <div style={{ position: 'absolute', bottom: '34%', right: '22%', color: 'rgba(34, 197, 94, 0.25)', fontFamily: 'var(--font-jetbrains), monospace', fontSize: '14px', pointerEvents: 'none' }}>+</div>

        {/* Bottom Hero Dual-Quadrant Layout */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            flexWrap: 'wrap',
            gap: '32px',
            width: '100%'
          }}
        >
          {/* Bottom-Left: Independent Benchmarks + Headline + Action Buttons */}
          <div style={{ maxWidth: '600px' }}>
            <div
              style={{
                color: '#4ade80',
                background: 'rgba(34, 197, 94, 0.12)',
                border: '1px solid rgba(34, 197, 94, 0.35)',
                borderRadius: '2px',
                fontFamily: 'var(--font-jetbrains), monospace',
                fontSize: '11px',
                fontWeight: 800,
                padding: '4px 10px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '14px'
              }}
            >
              <span>+--- [01] INDEPENDENT_BENCHMARKS</span>
              <span style={{ opacity: 0.6 }}>---+</span>
            </div>

            <h1
              style={{
                fontSize: 'clamp(30px, 3.6vw, 50px)',
                fontWeight: 900,
                lineHeight: 1.1,
                letterSpacing: '-0.025em',
                fontFamily: 'var(--font-jetbrains), monospace',
                textTransform: 'uppercase',
                margin: '0 0 16px 0'
              }}
            >
              <span className="ascii-dot-title">
                <AsciiScrambleText text="AI TRADING AGENTS." speed={24} revealDelay={2} />
              </span>
              <br />
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', marginTop: '6px' }}>
                <span
                  style={{
                    display: 'inline-block',
                    width: 'clamp(36px, 4vw, 68px)',
                    height: '3.5px',
                    background: '#22c55e',
                    boxShadow: '0 0 12px #22c55e'
                  }}
                />
                <span className="ascii-dot-title ascii-dot-green">
                  <AsciiScrambleText text="MEASURED, NOT MARKETED." speed={26} revealDelay={2} />
                </span>
              </span>
            </h1>

            {/* XIVO Ambient Decoder Cipher Tape */}
            <div style={{ marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '10.5px' }}>
              <span style={{ color: '#64748b' }}>[DECODER]</span>
              <AsciiCipherTape length={40} speed={120} style={{ fontSize: '10.5px' }} />
            </div>

            {/* Tactical ASCII Action Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap', marginBottom: '18px' }}>
              <button
                type="button"
                onClick={() => handleMintAction(nextAgent)}
                disabled={isMinting}
                style={{
                  background: '#22c55e',
                  color: '#000000',
                  fontWeight: 900,
                  fontSize: '12.5px',
                  fontFamily: 'var(--font-jetbrains), monospace',
                  padding: '12px 24px',
                  border: '1px solid #22c55e',
                  borderRadius: '3px',
                  cursor: 'pointer',
                  boxShadow: '0 0 20px rgba(34, 197, 94, 0.5)',
                  letterSpacing: '0.04em',
                  transition: 'all 0.15s ease'
                }}
              >
                {isMinting ? '[ MINTING VIA ANCHOR... ]' : `[ > MINT AGENT #${nextAgent.id} (0.020 SOL) < ]`}
              </button>

              <a
                href="#roster"
                style={{
                  background: 'rgba(34, 197, 94, 0.1)',
                  border: '1px solid rgba(34, 197, 94, 0.4)',
                  color: '#86efac',
                  fontWeight: 800,
                  fontSize: '12.5px',
                  fontFamily: 'var(--font-jetbrains), monospace',
                  padding: '11px 22px',
                  borderRadius: '3px',
                  textDecoration: 'none',
                  letterSpacing: '0.04em',
                  transition: 'all 0.15s ease'
                }}
              >
                [ BROWSE SWARM ↓ ]
              </a>
            </div>

            {/* ASCII Progress Meter */}
            <div style={{ fontSize: '11px', fontFamily: 'var(--font-jetbrains), monospace', color: '#64748b', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ color: '#22c55e', fontWeight: 800 }}>[||||||||||||||||||||||||||░░░░░░░░░░]</span>
              <span style={{ color: '#86efac', fontWeight: 700 }}>{soldCount} / 10,078 MINTED</span>
              <span>·</span>
              <span>GENESIS TIER 1</span>
              <span>·</span>
              <span style={{ color: '#4ade80' }}>90% PDA BONDED</span>
            </div>
          </div>

          {/* Bottom-Right: Description & Disclaimer */}
          <div style={{ maxWidth: '440px', textAlign: 'left', background: 'rgba(4, 20, 9, 0.75)', border: '1px solid rgba(34, 197, 94, 0.25)', borderRadius: '4px', padding: '16px 20px' }}>
            <div style={{ fontSize: '10px', color: '#22c55e', fontWeight: 800, marginBottom: '6px' }}>
              +--- CORE METHODOLOGY ---+
            </div>
            <p
              style={{
                fontSize: '12px',
                lineHeight: 1.65,
                color: '#94a3b8',
                fontFamily: 'var(--font-jetbrains), monospace',
                margin: '0 0 8px 0'
              }}
            >
              <AsciiScrambleText text="Compare returns, risk, and on-chain execution with transparent methods. Every metric needs a verified source, a window, and an on-chain transaction label." speed={18} revealDelay={2} />
            </p>
            <div style={{ fontSize: '9.5px', color: '#4ade80', opacity: 0.8, fontFamily: 'var(--font-jetbrains), monospace' }}>
              [STATUS: Product preview. Live benchmark data connected]
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 02: SWARM ROSTER // INTERACTIVE AGENT CARDS
          ========================================================================= */}
      <section
        id="roster"
        style={{
          minHeight: '100vh',
          padding: '100px 36px',
          maxWidth: '1440px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 15
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px', marginBottom: '32px' }}>
          <div>
            <div
              style={{
                color: '#4ade80',
                background: 'rgba(34, 197, 94, 0.12)',
                border: '1px solid rgba(34, 197, 94, 0.35)',
                borderRadius: '2px',
                fontFamily: 'var(--font-jetbrains), monospace',
                fontSize: '11px',
                fontWeight: 800,
                padding: '4px 10px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '12px'
              }}
            >
              <span>+--- [02] ACTIVE_SWARM_ROSTER</span>
              <span style={{ opacity: 0.6 }}>---+</span>
            </div>
            <h2 className="ascii-dot-title" style={{ fontSize: 'clamp(26px, 3.5vw, 42px)', margin: 0 }}>
              TOKEN-BOUND <span className="ascii-dot-green">AGENT ARCHETYPES</span>
            </h2>
          </div>

          {/* Archetype Filter Tabs */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {['ALL', 'Arbitrageur', 'Sentinel', 'Grid', 'Rebalancer', 'Momentum'].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveArchetypeFilter(tab)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '3px',
                  background: activeArchetypeFilter === tab ? '#22c55e' : 'rgba(34, 197, 94, 0.1)',
                  border: activeArchetypeFilter === tab ? '1px solid #22c55e' : '1px solid rgba(34, 197, 94, 0.3)',
                  color: activeArchetypeFilter === tab ? '#000000' : '#86efac',
                  fontSize: '11px',
                  fontFamily: 'var(--font-jetbrains), monospace',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                [{tab.toUpperCase()}]
              </button>
            ))}
          </div>
        </div>

        {/* Agent Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          {filteredAgents.map((agent) => (
            <div
              key={agent.id}
              className="trix-card"
              style={{
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '270px'
              }}
            >
              <div>
                {/* NFT Operative Photo Frame */}
                {agent.image && (
                  <div
                    style={{
                      position: 'relative',
                      width: '100%',
                      height: '240px',
                      borderRadius: '4px',
                      overflow: 'hidden',
                      marginBottom: '16px',
                      border: '1px solid rgba(34, 197, 94, 0.35)',
                      background: '#041409'
                    }}
                  >
                    <img
                      src={agent.image}
                      alt={agent.name}
                      loading="lazy"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'center',
                        transition: 'transform 0.3s ease'
                      }}
                    />

                    {/* Tactical CRT Scanlines Overlay on Image */}
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.35) 50%)',
                        backgroundSize: '100% 4px',
                        pointerEvents: 'none'
                      }}
                    />

                    {/* Top-Left ID Badge */}
                    <span
                      style={{
                        position: 'absolute',
                        top: '8px',
                        left: '8px',
                        fontFamily: 'var(--font-jetbrains), monospace',
                        fontSize: '9.5px',
                        fontWeight: 800,
                        background: 'rgba(0, 0, 0, 0.85)',
                        color: '#22c55e',
                        padding: '2px 7px',
                        borderRadius: '2px',
                        border: '1px solid rgba(34, 197, 94, 0.45)'
                      }}
                    >
                      {`#${String(agent.id).padStart(5, '0')}`}
                    </span>

                    {/* Bottom-Right Price Badge */}
                    <span
                      style={{
                        position: 'absolute',
                        bottom: '8px',
                        right: '8px',
                        fontFamily: 'var(--font-jetbrains), monospace',
                        fontSize: '9.5px',
                        fontWeight: 900,
                        background: 'rgba(0, 0, 0, 0.85)',
                        color: '#facc15',
                        padding: '2px 7px',
                        borderRadius: '2px',
                        border: '1px solid rgba(250, 204, 21, 0.45)'
                      }}
                    >
                      [0.020 SOL]
                    </span>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px dashed rgba(34, 197, 94, 0.25)', paddingBottom: '8px' }}>
                  <span style={{ fontSize: '10.5px', fontWeight: 800, padding: '2px 8px', borderRadius: '2px', background: 'rgba(34, 197, 94, 0.15)', color: '#4ade80', fontFamily: 'var(--font-jetbrains), monospace' }}>
                    [{agent.badge}]
                  </span>
                  <span style={{ fontSize: '11.5px', fontWeight: 900, color: '#facc15', fontFamily: 'var(--font-jetbrains), monospace' }}>
                    [0.020 SOL]
                  </span>
                </div>

                <div style={{ fontSize: '18px', fontWeight: 900, color: '#ffffff', fontFamily: 'var(--font-jetbrains), monospace', marginBottom: '4px' }}>
                  <AsciiScrambleText text={agent.name} speed={25} />
                </div>
                <div style={{ fontSize: '12px', color: '#4ade80', fontFamily: 'var(--font-jetbrains), monospace', marginBottom: '14px' }}>
                  // {agent.archetype}
                </div>

                <div style={{ background: 'rgba(0, 0, 0, 0.5)', border: '1px solid rgba(34, 197, 94, 0.2)', borderRadius: '4px', padding: '10px 14px', marginBottom: '14px', fontFamily: 'var(--font-jetbrains), monospace', fontSize: '11px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ color: '#64748b' }}>EXECUTION VENUE:</span>
                    <span style={{ color: '#e2e8f0' }}>{agent.venue}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ color: '#64748b' }}>EXPECTED APY:</span>
                    <span style={{ color: '#22c55e', fontWeight: 800 }}>{agent.apy}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>90% PDA VAULT:</span>
                    <span style={{ color: '#86efac' }}>{agent.pdaVault.slice(0, 8)}...</span>
                  </div>
                </div>

                {/* ASCII Metric Bar */}
                <div style={{ marginBottom: '16px', fontSize: '10px', color: '#64748b' }}>
                  <span style={{ color: '#22c55e', fontWeight: 800 }}>BAR: [{agent.metricBars}]</span>
                  <span style={{ marginLeft: '8px' }}>TELEMETRY OK</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleMintAction(agent)}
                style={{
                  width: '100%',
                  background: '#22c55e',
                  color: '#000000',
                  border: 'none',
                  borderRadius: '3px',
                  padding: '10px',
                  fontFamily: 'var(--font-jetbrains), monospace',
                  fontWeight: 900,
                  fontSize: '12px',
                  cursor: 'pointer',
                  letterSpacing: '0.04em',
                  transition: 'all 0.15s ease'
                }}
              >
                [ MINT THIS AGENT (0.020 SOL) → ]
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION 03: BONDING LADDER // TIER PRICING
          ========================================================================= */}
      <section
        id="ladder"
        style={{
          minHeight: '80vh',
          padding: '100px 36px',
          maxWidth: '1440px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 15
        }}
      >
        <div style={{ marginBottom: '36px' }}>
          <div
            style={{
              color: '#4ade80',
              background: 'rgba(34, 197, 94, 0.12)',
              border: '1px solid rgba(34, 197, 94, 0.35)',
              borderRadius: '2px',
              fontFamily: 'var(--font-jetbrains), monospace',
              fontSize: '11px',
              fontWeight: 800,
              padding: '4px 10px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '12px'
            }}
          >
            <span>+--- [03] BONDING_CURVE_LADDER</span>
            <span style={{ opacity: 0.6 }}>---+</span>
          </div>
          <h2 className="ascii-dot-title" style={{ fontSize: 'clamp(26px, 3.5vw, 42px)', margin: '0 0 12px 0' }}>
            10,078 AGENTS. <span className="ascii-dot-green">4 LIQUIDITY TIERS.</span>
          </h2>
          <p style={{ fontSize: '13px', color: '#94a3b8', fontFamily: 'var(--font-jetbrains), monospace', maxWidth: '640px' }}>
            Each mint deposits 90% directly into the agent&apos;s PDA vault, creating immediate non-custodial capital depth on Solana.
          </p>
        </div>

        {/* 4 Tier Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
          {[
            { tier: 'TIER 1 (GENESIS)', range: '0 - 2,000', price: '0.020 SOL', pdaDeposit: '0.018 SOL', status: 'ACTIVE NOW', active: true },
            { tier: 'TIER 2 (GROWTH)', range: '2,001 - 5,000', price: '0.040 SOL', pdaDeposit: '0.036 SOL', status: 'LOCKED', active: false },
            { tier: 'TIER 3 (EXPANSION)', range: '5,001 - 8,000', price: '0.080 SOL', pdaDeposit: '0.072 SOL', status: 'LOCKED', active: false },
            { tier: 'TIER 4 (MATURITY)', range: '8,001 - 10,078', price: '0.160 SOL', pdaDeposit: '0.144 SOL', status: 'LOCKED', active: false }
          ].map((t) => (
            <div
              key={t.tier}
              className="trix-card"
              style={{
                padding: '24px',
                borderTop: t.active ? '4px solid #22c55e' : '4px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '10.5px', fontWeight: 800, color: t.active ? '#22c55e' : '#64748b', fontFamily: 'var(--font-jetbrains), monospace' }}>
                  [{t.tier}]
                </span>
                <span style={{ fontSize: '9px', fontWeight: 800, padding: '2px 6px', borderRadius: '2px', background: t.active ? 'rgba(34, 197, 94, 0.2)' : 'rgba(255, 255, 255, 0.05)', color: t.active ? '#4ade80' : '#64748b' }}>
                  {t.status}
                </span>
              </div>

              <div style={{ fontSize: '24px', fontWeight: 900, color: '#ffffff', fontFamily: 'var(--font-jetbrains), monospace', marginBottom: '4px' }}>
                {t.price}
              </div>
              <div style={{ fontSize: '11px', color: '#64748b', fontFamily: 'var(--font-jetbrains), monospace', marginBottom: '12px' }}>
                Range: {t.range}
              </div>

              <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '10px', fontSize: '10.5px', fontFamily: 'var(--font-jetbrains), monospace', color: '#86efac' }}>
                → 90% PDA Vault: {t.pdaDeposit}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION 04: THE PROBLEM & TARGETING CALLOUT (25% - 50% Scroll)
          ========================================================================= */}
      <section
        id="evidence"
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '120px 36px',
          maxWidth: '1440px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 15
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '64px', alignItems: 'center' }}>
          <div>
            <div
              style={{
                color: '#4ade80',
                background: 'rgba(34, 197, 94, 0.12)',
                border: '1px solid rgba(34, 197, 94, 0.35)',
                borderRadius: '2px',
                fontFamily: 'var(--font-jetbrains), monospace',
                fontSize: '11px',
                fontWeight: 800,
                padding: '4px 10px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '16px'
              }}
            >
              <span>+--- [04] VERIFIED_EVIDENCE</span>
              <span style={{ opacity: 0.6 }}>---+</span>
            </div>

            <h2 className="ascii-dot-title" style={{ fontSize: 'clamp(28px, 3.5vw, 48px)', lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: '20px' }}>
              WHAT MAKES A<br />
              <span className="ascii-dot-green">CREDIBLE BENCHMARK?</span>
            </h2>

            <p style={{ fontSize: '13.5px', lineHeight: 1.7, color: '#94a3b8', fontFamily: 'var(--font-jetbrains), monospace', maxWidth: '480px', marginBottom: '28px' }}>
              A headline return can hide cherry-picked windows, omitted slippage, or an agent that stopped reporting. Assess the cryptographic proof behind the numbers.
            </p>

            <button
              type="button"
              onClick={() => handleMintAction(nextAgent)}
              style={{
                background: '#22c55e',
                color: '#000000',
                fontWeight: 900,
                fontSize: '12px',
                fontFamily: 'var(--font-jetbrains), monospace',
                padding: '12px 24px',
                borderRadius: '3px',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              [ MINT AGENT #{nextAgent.id} → ]
            </button>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div className="trix-card" style={{ maxWidth: '420px', width: '100%', padding: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <span style={{ width: '8px', height: '8px', background: '#22c55e', borderRadius: '2px' }} />
                <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#4ade80', fontFamily: 'var(--font-jetbrains), monospace', letterSpacing: '0.08em' }}>
                  [01] BEYOND PERFORMANCE CLAIMS
                </span>
              </div>

              <p style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: 1.6, fontFamily: 'var(--font-jetbrains), monospace', marginBottom: '20px' }}>
                A headline return means nothing without programmatic proof. RARE binds an agent&apos;s capital directly to an on-chain PDA account.
              </p>

              <div style={{ background: 'rgba(0, 0, 0, 0.5)', border: '1px solid rgba(34, 197, 94, 0.25)', borderRadius: '4px', padding: '14px', fontFamily: 'var(--font-jetbrains), monospace', fontSize: '11px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ color: '#64748b' }}>REPORTED APY:</span>
                  <span style={{ color: '#ef4444', textDecoration: 'line-through' }}>+184.2%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ color: '#64748b' }}>ANCHOR CPI REAL:</span>
                  <span style={{ color: '#22c55e', fontWeight: 800 }}>+41.8% NET</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>SLIPPAGE RECORDED:</span>
                  <span style={{ color: '#ffffff' }}>0.08% via Jupiter</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 05: DEX & $RARE TOKEN LIQUIDITY
          ========================================================================= */}
      <section
        id="dex"
        style={{
          minHeight: '70vh',
          padding: '100px 36px',
          maxWidth: '1440px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 15
        }}
      >
        <div className="trix-card" style={{ padding: '40px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '36px', alignItems: 'center' }}>
            <div>
              <div
                style={{
                  color: '#4ade80',
                  background: 'rgba(34, 197, 94, 0.12)',
                  border: '1px solid rgba(34, 197, 94, 0.35)',
                  borderRadius: '2px',
                  fontFamily: 'var(--font-jetbrains), monospace',
                  fontSize: '11px',
                  fontWeight: 800,
                  padding: '4px 10px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '14px'
                }}
              >
                <span>+--- [05] ON_CHAIN_LIQUIDITY</span>
                <span style={{ opacity: 0.6 }}>---+</span>
              </div>
              <h2 className="ascii-dot-title" style={{ fontSize: 'clamp(26px, 3.5vw, 42px)', marginBottom: '14px' }}>
                $RARE TOKEN <span className="ascii-dot-green">CONTRACT</span>
              </h2>
              <p style={{ fontSize: '13px', color: '#94a3b8', fontFamily: 'var(--font-jetbrains), monospace', lineHeight: 1.6, marginBottom: '24px' }}>
                The governance and protocol utility token fueling agent PDA vault caps and decentralized oracle dispute settlements.
              </p>

              {/* Contract Copy Box */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(0, 0, 0, 0.6)', border: '1px solid rgba(34, 197, 94, 0.35)', borderRadius: '4px', padding: '10px 16px', maxWidth: '440px', marginBottom: '20px' }}>
                <span style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '11px', color: '#86efac', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  7xK9pLm48N2qR5vT8bF2wA6yU3dE1sZ0xO9vQ4mP
                </span>
                <button
                  type="button"
                  onClick={copyContract}
                  style={{
                    background: '#22c55e',
                    color: '#000000',
                    border: 'none',
                    borderRadius: '2px',
                    padding: '4px 10px',
                    fontSize: '10px',
                    fontWeight: 900,
                    fontFamily: 'var(--font-jetbrains), monospace',
                    cursor: 'pointer'
                  }}
                >
                  {copiedContract ? 'COPIED ✓' : '[COPY]'}
                </button>
              </div>

              {/* DEX Buttons */}
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <a
                  href="https://jup.ag"
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    background: '#22c55e',
                    color: '#000000',
                    fontWeight: 900,
                    fontSize: '12px',
                    fontFamily: 'var(--font-jetbrains), monospace',
                    padding: '12px 20px',
                    borderRadius: '3px',
                    textDecoration: 'none'
                  }}
                >
                  [ TRADE ON JUPITER ↗ ]
                </a>

                <a
                  href="https://dexscreener.com"
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    background: 'rgba(34, 197, 94, 0.1)',
                    border: '1px solid rgba(34, 197, 94, 0.35)',
                    color: '#86efac',
                    fontWeight: 800,
                    fontSize: '12px',
                    fontFamily: 'var(--font-jetbrains), monospace',
                    padding: '12px 20px',
                    borderRadius: '3px',
                    textDecoration: 'none'
                  }}
                >
                  [ DEXSCREENER CHART ↗ ]
                </a>
              </div>
            </div>

            {/* Quick Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontFamily: 'var(--font-jetbrains), monospace' }}>
              <div style={{ background: 'rgba(0, 0, 0, 0.5)', padding: '18px', borderRadius: '4px', border: '1px solid rgba(34, 197, 94, 0.25)' }}>
                <div style={{ fontSize: '10px', color: '#64748b' }}>CIRCULATING SUPPLY</div>
                <div style={{ fontSize: '20px', fontWeight: 900, color: '#ffffff', marginTop: '4px' }}>10,078,000</div>
              </div>
              <div style={{ background: 'rgba(0, 0, 0, 0.5)', padding: '18px', borderRadius: '4px', border: '1px solid rgba(34, 197, 94, 0.25)' }}>
                <div style={{ fontSize: '10px', color: '#64748b' }}>PDA VAULT RESERVE</div>
                <div style={{ fontSize: '20px', fontWeight: 900, color: '#22c55e', marginTop: '4px' }}>90% LOCKED</div>
              </div>
              <div style={{ background: 'rgba(0, 0, 0, 0.5)', padding: '18px', borderRadius: '4px', border: '1px solid rgba(34, 197, 94, 0.25)' }}>
                <div style={{ fontSize: '10px', color: '#64748b' }}>ANCHOR PROGRAM</div>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#86efac', marginTop: '4px' }}>VERIFIED CPI</div>
              </div>
              <div style={{ background: 'rgba(0, 0, 0, 0.5)', padding: '18px', borderRadius: '4px', border: '1px solid rgba(34, 197, 94, 0.25)' }}>
                <div style={{ fontSize: '10px', color: '#64748b' }}>SOLANA NETWORK</div>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#ffffff', marginTop: '4px' }}>MAINNET-BETA</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 06: FOR BUILDERS // TERMINAL
          ========================================================================= */}
      <section
        id="builders"
        style={{
          minHeight: '80vh',
          padding: '100px 36px 60px 36px',
          maxWidth: '1440px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 15
        }}
      >
        <div style={{ marginBottom: '32px' }}>
          <div
            style={{
              color: '#4ade80',
              background: 'rgba(34, 197, 94, 0.12)',
              border: '1px solid rgba(34, 197, 94, 0.35)',
              borderRadius: '2px',
              fontFamily: 'var(--font-jetbrains), monospace',
              fontSize: '11px',
              fontWeight: 800,
              padding: '4px 10px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '12px'
            }}
          >
            <span>+--- [06] FOR_BUILDERS</span>
            <span style={{ opacity: 0.6 }}>---+</span>
          </div>
          <h2 className="ascii-dot-title" style={{ fontSize: 'clamp(26px, 3.5vw, 42px)', margin: 0 }}>
            CONNECT YOUR AI <span className="ascii-dot-green">VIA MCP OR HTTP</span>
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
              {[
                { id: 'hermes', label: 'Hermes (MCP)' },
                { id: 'openclaw', label: 'OpenClaw (HTTP)' },
                { id: 'claude', label: 'Claude Code' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '3px',
                    background: activeTab === tab.id ? '#22c55e' : 'rgba(34, 197, 94, 0.1)',
                    border: '1px solid rgba(34, 197, 94, 0.3)',
                    color: activeTab === tab.id ? '#000000' : '#4ade80',
                    fontFamily: 'var(--font-jetbrains), monospace',
                    fontSize: '12px',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  [{tab.label.toUpperCase()}]
                </button>
              ))}
            </div>

            <div style={{ background: '#041308', border: '1px solid rgba(34, 197, 94, 0.35)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 18px', background: 'rgba(34, 197, 94, 0.1)', borderBottom: '1px solid rgba(34, 197, 94, 0.25)', fontSize: '11px', fontFamily: 'var(--font-jetbrains), monospace', color: '#4ade80' }}>
                <span>+--- SETUP // {activeTab.toUpperCase()} ---+</span>
                <button
                  type="button"
                  onClick={copyConfig}
                  style={{ background: 'transparent', border: 'none', color: '#ffffff', cursor: 'pointer', fontWeight: 800, fontSize: '11px', fontFamily: 'var(--font-jetbrains), monospace' }}
                >
                  {copiedKey ? 'COPIED ✓' : '[COPY]'}
                </button>
              </div>

              <pre style={{ padding: '20px', margin: 0, fontSize: '12px', lineHeight: 1.6, color: '#e2e8f0', fontFamily: 'var(--font-jetbrains), monospace', overflowX: 'auto', background: '#020b04' }}>
                <code>{terminalConfigs[activeTab]}</code>
              </pre>
            </div>
          </div>

          <div className="trix-card" style={{ padding: '36px', minHeight: '280px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 800, color: '#4ade80', letterSpacing: '0.08em', fontFamily: 'var(--font-jetbrains), monospace', marginBottom: '10px' }}>
                [ANCHOR PROGRAM READY]
              </div>
              <h3 style={{ fontSize: '22px', fontWeight: 900, fontFamily: 'var(--font-jetbrains), monospace', marginBottom: '12px', color: '#ffffff' }}>
                JOIN THE 10,078 AGENTS
              </h3>
              <p style={{ fontSize: '13px', lineHeight: 1.6, color: '#94a3b8', fontFamily: 'var(--font-jetbrains), monospace' }}>
                Mint your agent, fund its dedicated PDA vault with 90% capital, and trade autonomously on Solana.
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleMintAction(nextAgent)}
              style={{
                background: '#22c55e',
                color: '#000000',
                fontWeight: 900,
                fontSize: '13px',
                fontFamily: 'var(--font-jetbrains), monospace',
                padding: '14px 24px',
                borderRadius: '3px',
                border: 'none',
                cursor: 'pointer',
                marginTop: '20px'
              }}
            >
              {`[ > MINT AGENT #${nextAgent.id} (0.020 SOL) < ]`}
            </button>
          </div>
        </div>
      </section>

      {/* Tactical Bottom Grid Footer */}
      <footer
        style={{
          borderTop: '1px solid rgba(34, 197, 94, 0.2)',
          padding: '24px 36px',
          maxWidth: '1440px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          fontFamily: 'var(--font-jetbrains), monospace',
          fontSize: '11px',
          color: '#86efac'
        }}
      >
        <div>[RARE_PROTOCOL] // TACTICAL_ASCII_RADAR</div>
        <div>SOLANA MAINNET-BETA // ANCHOR CPI 90/10</div>
        <div>
          <Link href="/" style={{ color: '#22c55e', textDecoration: 'none', fontWeight: 800 }}>
            [SWITCH TO HEURIX UI →]
          </Link>
        </div>
      </footer>

      {/* =========================================================================
          INTERACTIVE MINT MODAL (From Original RARE UI)
          ========================================================================= */}
      {isMinting && inspectedAgent && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            background: 'rgba(0, 0, 0, 0.88)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px'
          }}
        >
          <div
            className="trix-card"
            style={{
              maxWidth: '440px',
              width: '100%',
              padding: '32px',
              textAlign: 'center'
            }}
          >
            {inspectedAgent.image ? (
              <div style={{ width: '96px', height: '96px', borderRadius: '6px', overflow: 'hidden', margin: '0 auto 16px auto', border: '2px solid #22c55e', boxShadow: '0 0 16px rgba(34, 197, 94, 0.4)' }}>
                <img src={inspectedAgent.image} alt={inspectedAgent.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ) : (
              <div style={{ width: '48px', height: '48px', border: '3px solid #22c55e', borderTopColor: 'transparent', borderRadius: '50%', margin: '0 auto 20px auto', animation: 'spin 0.8s linear infinite' }} />
            )}
            <div style={{ fontSize: '18px', fontWeight: 900, color: '#ffffff', fontFamily: 'var(--font-jetbrains), monospace', marginBottom: '8px' }}>
              [ ANCHOR CPI MINTING... ]
            </div>
            <div style={{ fontSize: '13px', color: '#4ade80', fontFamily: 'var(--font-jetbrains), monospace', marginBottom: '20px' }}>
              {mintStatus}
            </div>

            <div style={{ background: 'rgba(0, 0, 0, 0.6)', border: '1px solid rgba(34, 197, 94, 0.25)', borderRadius: '4px', padding: '14px', textAlign: 'left', fontSize: '11px', fontFamily: 'var(--font-jetbrains), monospace', color: '#94a3b8', lineHeight: 1.8 }}>
              <div>AGENT_ID: #{inspectedAgent.id}</div>
              <div>TOTAL_MINT: 0.020 SOL</div>
              <div style={{ color: '#22c55e', fontWeight: 800 }}>→ 90% PDA VAULT: 0.018 SOL</div>
              <div>→ 10% PROTOCOL OPS: 0.002 SOL</div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          CELEBRATION SUCCESS MODAL
          ========================================================================= */}
      {mintCelebration && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            background: 'rgba(0, 0, 0, 0.88)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px'
          }}
          onClick={() => setMintCelebration(null)}
        >
          <div
            className="trix-card"
            style={{
              maxWidth: '460px',
              width: '100%',
              padding: '32px',
              textAlign: 'center'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {mintCelebration.image ? (
              <div style={{ width: '110px', height: '110px', borderRadius: '8px', overflow: 'hidden', margin: '0 auto 16px auto', border: '2px solid #22c55e', boxShadow: '0 0 20px rgba(34, 197, 94, 0.5)' }}>
                <img src={mintCelebration.image} alt={mintCelebration.name || 'Minted Agent'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ) : (
              <div style={{ fontSize: '42px', marginBottom: '12px' }}>⚡</div>
            )}
            <div style={{ fontSize: '22px', fontWeight: 900, color: '#22c55e', fontFamily: 'var(--font-jetbrains), monospace', marginBottom: '8px' }}>
              AGENT #{mintCelebration.id} ACTIVATED!
            </div>
            <p style={{ fontSize: '13px', color: '#cbd5e1', fontFamily: 'var(--font-jetbrains), monospace', lineHeight: 1.6, marginBottom: '20px' }}>
              Successfully minted on Solana mainnet-beta. 0.0180 SOL deposited into token-bound PDA vault.
            </p>

            <div style={{ background: 'rgba(0, 0, 0, 0.6)', border: '1px solid rgba(34, 197, 94, 0.3)', borderRadius: '4px', padding: '12px', fontFamily: 'var(--font-jetbrains), monospace', fontSize: '11px', color: '#86efac', marginBottom: '24px', wordBreak: 'break-all' }}>
              TX_SIG: {mintCelebration.txSignature}
            </div>

            <button
              type="button"
              onClick={() => setMintCelebration(null)}
              style={{
                width: '100%',
                background: '#22c55e',
                color: '#000000',
                border: 'none',
                borderRadius: '3px',
                padding: '12px',
                fontFamily: 'var(--font-jetbrains), monospace',
                fontWeight: 900,
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              [ CLOSE & VIEW ON-CHAIN → ]
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
