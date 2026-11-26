'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Rare3DCanvas from '../../components/trix/Rare3DCanvas';
import TrixNavbar from '../../components/trix/TrixNavbar';
import TrixHudFooter from '../../components/trix/TrixHudFooter';
import AsciiScrambleText, { AsciiCipherTape } from '../../components/trix/AsciiScrambleText';
import { usePrivy } from '../../components/PrivyClientProvider';
import { getAgentMetadata } from '../../lib/agentMetadata';

export default function TrixPage() {
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

  // Tactical lighting transition for middle radar section
  const isLightMode = scrollProgress >= 0.44 && scrollProgress <= 0.74;

  // Curated Swarm Archetypes
  const SWARM_AGENTS = [
    {
      id: 143,
      name: 'AGENT_#00143',
      archetype: 'Quantum Arbitrageur',
      venue: 'Jupiter & Orca',
      badge: 'ACTIVE // JUPITER',
      pdaVault: 'PDA256v3779B100Vault',
      apy: '+42.8%',
      risk: 'LOW (HEDGED)',
      metricBars: '█████████░░░',
      priceSol: 0.02
    },
    {
      id: 140,
      name: 'AGENT_#00140',
      archetype: 'Sentinel Risk Guard',
      venue: 'Pyth Oracle Shield',
      badge: 'PYTH ORACLE',
      pdaVault: 'PDASentinelGuardVault',
      apy: '+29.4%',
      risk: '-15% STOP GUARD',
      metricBars: '███████░░░░░',
      priceSol: 0.02
    },
    {
      id: 141,
      name: 'AGENT_#00141',
      archetype: 'CLMM Grid Executor',
      venue: 'Raydium Concentrated',
      badge: 'RAYDIUM CLMM',
      pdaVault: 'PDAGridExecutorVault',
      apy: '+58.2%',
      risk: 'MED (TICK VOL)',
      metricBars: '███████████░',
      priceSol: 0.02
    },
    {
      id: 142,
      name: 'AGENT_#00142',
      archetype: 'Vault Rebalancer',
      venue: 'Kamino & Meteora',
      badge: 'AUTO +35% TP',
      pdaVault: 'PDAVaultRebalancer',
      apy: '+34.1%',
      risk: 'LOW (DELTA 0)',
      metricBars: '████████░░░░',
      priceSol: 0.02
    },
    {
      id: 144,
      name: 'AGENT_#00144',
      archetype: 'Momentum Hunter',
      venue: 'Volume Breakouts',
      badge: 'TREND SIGNAL',
      pdaVault: 'PDAMomentumVault',
      apy: '+64.5%',
      risk: 'HIGH (BREAKOUT)',
      metricBars: '████████████',
      priceSol: 0.02
    },
    {
      id: 145,
      name: 'AGENT_#00145',
      archetype: 'Liquidity Provider',
      venue: 'SOL-USDC Anchor',
      badge: '0.05% TIER',
      pdaVault: 'PDALiquidityVault',
      apy: '+31.0%',
      risk: 'NEUTRAL DELTA',
      metricBars: '███████░░░░░',
      priceSol: 0.02
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
        fontFamily: 'var(--font-jetbrains), "Courier New", Courier, monospace',
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
          opacity: isLightMode ? 0.12 : 0.35,
          pointerEvents: 'none'
        }}
      />

      {/* Global Tactical ASCII Header */}
      <TrixNavbar isLightMode={isLightMode} onMintClick={() => handleMintAction(nextAgent)} />

      {/* Real 3D WebGL Emerald Crystal Canvas (Solid 3D Crystal from commit 11179a7) */}
      <Rare3DCanvas scrollProgress={scrollProgress} isLightMode={isLightMode} />

      {/* Floating Tactical ASCII "ASK RARE" Widget */}
      <TrixHudFooter isLightMode={isLightMode} />

      {/* =========================================================================
          SECTION 01: HERO // XIVO ASCII TERMINAL AESTHETIC (0% - 25% Scroll)
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
            background: 'rgba(5, 18, 9, 0.88)',
            border: '1px solid rgba(34, 197, 94, 0.35)',
            borderRadius: '2px',
            padding: '7px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            backdropFilter: 'blur(8px)',
            pointerEvents: 'none'
          }}
        >
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 6px #22c55e' }} />
          <span>SOLANA // MAINNET-BETA</span>
          <span style={{ opacity: 0.4 }}>|</span>
          <span>90% PDA CAPITAL LOCKED</span>
        </div>

        {/* Ambient Crosshairs at Radar Intersections */}
        <div style={{ position: 'absolute', top: '22%', left: '14%', color: 'rgba(34, 197, 94, 0.3)', fontFamily: 'var(--font-jetbrains), monospace', fontSize: '13px', pointerEvents: 'none' }}>+</div>
        <div style={{ position: 'absolute', top: '22%', right: '14%', color: 'rgba(34, 197, 94, 0.3)', fontFamily: 'var(--font-jetbrains), monospace', fontSize: '13px', pointerEvents: 'none' }}>+</div>
        <div style={{ position: 'absolute', bottom: '34%', left: '20%', color: 'rgba(34, 197, 94, 0.3)', fontFamily: 'var(--font-jetbrains), monospace', fontSize: '13px', pointerEvents: 'none' }}>+</div>
        <div style={{ position: 'absolute', bottom: '34%', right: '20%', color: 'rgba(34, 197, 94, 0.3)', fontFamily: 'var(--font-jetbrains), monospace', fontSize: '13px', pointerEvents: 'none' }}>+</div>

        {/* Hero Dual-Quadrant Layout */}
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
          {/* Bottom-Left: Tactical ASCII Headline + Scramble + Action Buttons */}
          <div style={{ maxWidth: '600px' }}>
            <div
              style={{
                fontFamily: 'var(--font-jetbrains), monospace',
                fontSize: '11px',
                color: '#4ade80',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '3px 10px',
                background: 'rgba(34, 197, 94, 0.08)',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                borderRadius: '2px',
                marginBottom: '14px'
              }}
            >
              <span>+--- [01] INDEPENDENT_BENCHMARKS</span>
              <span style={{ opacity: 0.6 }}>---+</span>
            </div>

            {/* XIVO Dot-Matrix / Monospace Headline with Scramble */}
            <h1
              style={{
                fontSize: 'clamp(30px, 3.8vw, 52px)',
                fontWeight: 900,
                lineHeight: 1.08,
                letterSpacing: '-0.02em',
                fontFamily: 'var(--font-jetbrains), monospace',
                textTransform: 'uppercase',
                margin: '0 0 14px 0'
              }}
            >
              <AsciiScrambleText text="AI TRADING AGENTS." speed={24} revealDelay={2} />
              <br />
              <span style={{ color: '#22c55e', display: 'inline-flex', alignItems: 'center', gap: '12px', marginTop: '6px' }}>
                <span
                  style={{
                    display: 'inline-block',
                    width: 'clamp(32px, 3.5vw, 60px)',
                    height: '3px',
                    background: '#22c55e',
                    boxShadow: '0 0 10px #22c55e'
                  }}
                />
                <AsciiScrambleText text="MEASURED, NOT MARKETED." speed={26} revealDelay={2} />
              </span>
            </h1>

            {/* XIVO-Style Ambient Scramble / Decoder Line */}
            <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '10px', color: '#64748b' }}>[DECODER]</span>
              <AsciiCipherTape length={42} speed={110} style={{ fontSize: '10px' }} />
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
                  borderRadius: '2px',
                  cursor: 'pointer',
                  boxShadow: '0 0 16px rgba(34, 197, 94, 0.45)',
                  letterSpacing: '0.04em',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 0 24px rgba(34, 197, 94, 0.7)')}
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = '0 0 16px rgba(34, 197, 94, 0.45)')}
              >
                {isMinting ? '[ MINTING VIA ANCHOR... ]' : `[ > MINT AGENT #${nextAgent.id} (0.020 SOL) < ]`}
              </button>

              <a
                href="#roster"
                style={{
                  background: 'rgba(34, 197, 94, 0.08)',
                  border: '1px solid rgba(34, 197, 94, 0.35)',
                  color: '#86efac',
                  fontWeight: 800,
                  fontSize: '12.5px',
                  fontFamily: 'var(--font-jetbrains), monospace',
                  padding: '11px 20px',
                  borderRadius: '2px',
                  textDecoration: 'none',
                  letterSpacing: '0.04em',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#22c55e';
                  e.currentTarget.style.background = 'rgba(34, 197, 94, 0.16)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(34, 197, 94, 0.35)';
                  e.currentTarget.style.background = 'rgba(34, 197, 94, 0.08)';
                }}
              >
                [ BROWSE SWARM ↓ ]
              </a>
            </div>

            {/* ASCII Progress Bar Line */}
            <div style={{ fontSize: '11px', fontFamily: 'var(--font-jetbrains), monospace', color: '#64748b', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ color: '#22c55e', fontWeight: 800 }}>[||||||||||||||||||||||||||░░░░░░░░░░]</span>
              <span style={{ color: '#86efac', fontWeight: 700 }}>{soldCount} / 10,078 MINTED</span>
              <span>·</span>
              <span>GENESIS TIER 1</span>
              <span>·</span>
              <span style={{ color: '#4ade80' }}>90% PDA BONDED</span>
            </div>
          </div>

          {/* Bottom-Right: Description & Disclaimer in ASCII Box */}
          <div
            style={{
              maxWidth: '440px',
              textAlign: 'left',
              background: 'rgba(4, 14, 7, 0.85)',
              border: '1px solid rgba(34, 197, 94, 0.25)',
              borderRadius: '2px',
              padding: '16px 20px'
            }}
          >
            <div style={{ fontSize: '10px', color: '#22c55e', marginBottom: '6px', fontWeight: 800 }}>
              +--- CORE METHODOLOGY ---+
            </div>
            <p
              style={{
                fontSize: '12px',
                lineHeight: 1.65,
                color: '#94a3b8',
                fontFamily: 'var(--font-jetbrains), monospace',
                margin: '0 0 10px 0'
              }}
            >
              Compare returns, risk, and on-chain execution with transparent methods. Every metric needs a verified source, a window, and an on-chain transaction label.
            </p>
            <div style={{ fontSize: '9.5px', color: '#4ade80', fontFamily: 'var(--font-jetbrains), monospace', opacity: 0.8 }}>
              [STATUS: Live telemetry stream connected · Anchor v0.30]
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 02: SWARM ROSTER // ASCII CARDS (XIVO AESTHETIC)
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
                fontFamily: 'var(--font-jetbrains), monospace',
                fontSize: '10.5px',
                color: '#4ade80',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '2px 8px',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                background: 'rgba(34, 197, 94, 0.08)',
                marginBottom: '10px'
              }}
            >
              <span>+--- [02] ACTIVE_SWARM_ROSTER</span>
              <span style={{ opacity: 0.6 }}>---+</span>
            </div>
            <h2 style={{ fontSize: 'clamp(24px, 3.2vw, 40px)', fontWeight: 900, fontFamily: 'var(--font-jetbrains), monospace', margin: 0, textTransform: 'uppercase' }}>
              TOKEN-BOUND <span style={{ color: '#22c55e' }}>AGENT ARCHETYPES</span>
            </h2>
          </div>

          {/* Archetype Filter Tabs */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {['ALL', 'Arbitrageur', 'Sentinel', 'Grid', 'Rebalancer', 'Momentum'].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveArchetypeFilter(tab)}
                style={{
                  padding: '5px 12px',
                  borderRadius: '2px',
                  background: activeArchetypeFilter === tab ? '#22c55e' : 'rgba(34, 197, 94, 0.08)',
                  border: activeArchetypeFilter === tab ? '1px solid #22c55e' : '1px solid rgba(34, 197, 94, 0.25)',
                  color: activeArchetypeFilter === tab ? '#000000' : '#86efac',
                  fontSize: '10.5px',
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

        {/* Agent Cards Grid in Brutalist ASCII Frames */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '22px' }}>
          {filteredAgents.map((agent) => (
            <div
              key={agent.id}
              style={{
                background: 'rgba(4, 14, 7, 0.92)',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                borderRadius: '2px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '270px',
                position: 'relative',
                transition: 'border-color 0.2s ease, transform 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#22c55e';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(34, 197, 94, 0.3)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div>
                {/* Card ASCII Header Bar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', borderBottom: '1px dashed rgba(34, 197, 94, 0.2)', paddingBottom: '8px' }}>
                  <span style={{ fontSize: '10px', fontWeight: 800, color: '#4ade80' }}>
                    [{agent.badge}]
                  </span>
                  <span style={{ fontSize: '11px', fontWeight: 900, color: '#facc15' }}>
                    [0.020 SOL]
                  </span>
                </div>

                <div style={{ fontSize: '17px', fontWeight: 900, color: '#ffffff', marginBottom: '2px' }}>
                  <AsciiScrambleText text={agent.name} speed={25} revealDelay={2} />
                </div>
                <div style={{ fontSize: '11.5px', color: '#4ade80', marginBottom: '14px' }}>
                  // {agent.archetype}
                </div>

                {/* ASCII Data Box */}
                <div style={{ background: '#020703', border: '1px solid rgba(34, 197, 94, 0.18)', padding: '10px 12px', marginBottom: '16px', fontSize: '10.5px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ color: '#64748b' }}>EXECUTION VENUE:</span>
                    <span style={{ color: '#e2e8f0' }}>{agent.venue}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ color: '#64748b' }}>EXPECTED APY:</span>
                    <span style={{ color: '#22c55e', fontWeight: 800 }}>{agent.apy}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ color: '#64748b' }}>RISK PROFILE:</span>
                    <span style={{ color: '#facc15' }}>{agent.risk}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>90% PDA VAULT:</span>
                    <span style={{ color: '#86efac' }}>{agent.pdaVault.slice(0, 8)}...</span>
                  </div>
                </div>

                {/* ASCII Metric Bar */}
                <div style={{ marginBottom: '16px', fontSize: '9.5px', color: '#64748b' }}>
                  <span style={{ color: '#22c55e', fontWeight: 700 }}>BAR: [{agent.metricBars}]</span>
                  <span style={{ marginLeft: '8px' }}>TELEMETRY OK</span>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={() => handleMintAction(agent)}
                style={{
                  width: '100%',
                  background: '#22c55e',
                  color: '#000000',
                  border: 'none',
                  borderRadius: '2px',
                  padding: '9px',
                  fontFamily: 'var(--font-jetbrains), monospace',
                  fontWeight: 900,
                  fontSize: '11.5px',
                  cursor: 'pointer',
                  letterSpacing: '0.04em',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#4ade80')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#22c55e')}
              >
                [ MINT THIS AGENT (0.020 SOL) ↗ ]
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION 03: BONDING LADDER // ASCII STAT MATRIX (25% - 45% Scroll)
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
        <div style={{ marginBottom: '32px' }}>
          <div
            style={{
              fontFamily: 'var(--font-jetbrains), monospace',
              fontSize: '10.5px',
              color: '#4ade80',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '2px 8px',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              background: 'rgba(34, 197, 94, 0.08)',
              marginBottom: '10px'
            }}
          >
            <span>+--- [03] BONDING_CURVE_LADDER</span>
            <span style={{ opacity: 0.6 }}>---+</span>
          </div>
          <h2 style={{ fontSize: 'clamp(24px, 3.2vw, 40px)', fontWeight: 900, fontFamily: 'var(--font-jetbrains), monospace', margin: '0 0 10px 0', textTransform: 'uppercase' }}>
            10,078 AGENTS. <span style={{ color: '#22c55e' }}>4 LIQUIDITY TIERS.</span>
          </h2>
          <p style={{ fontSize: '12.5px', color: '#94a3b8', fontFamily: 'var(--font-jetbrains), monospace', maxWidth: '640px' }}>
            Each mint deposits 90% directly into the agent&apos;s PDA vault, creating immediate non-custodial capital depth on Solana.
          </p>
        </div>

        {/* 4 Tier Cards in ASCII Format */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
          {[
            { tier: 'TIER 1 (GENESIS)', range: '0 - 2,000', price: '0.020 SOL', pdaDeposit: '0.018 SOL', status: 'ACTIVE NOW', active: true },
            { tier: 'TIER 2 (GROWTH)', range: '2,001 - 5,000', price: '0.040 SOL', pdaDeposit: '0.036 SOL', status: 'LOCKED', active: false },
            { tier: 'TIER 3 (EXPANSION)', range: '5,001 - 8,000', price: '0.080 SOL', pdaDeposit: '0.072 SOL', status: 'LOCKED', active: false },
            { tier: 'TIER 4 (MATURITY)', range: '8,001 - 10,078', price: '0.160 SOL', pdaDeposit: '0.144 SOL', status: 'LOCKED', active: false }
          ].map((t) => (
            <div
              key={t.tier}
              style={{
                background: 'rgba(4, 14, 7, 0.92)',
                border: t.active ? '1px solid #22c55e' : '1px solid rgba(255, 255, 255, 0.12)',
                borderTop: t.active ? '3px solid #22c55e' : '3px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '2px',
                padding: '22px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '10.5px', fontWeight: 800, color: t.active ? '#22c55e' : '#64748b' }}>
                  [{t.tier}]
                </span>
                <span style={{ fontSize: '9px', fontWeight: 800, padding: '1px 5px', borderRadius: '2px', background: t.active ? 'rgba(34, 197, 94, 0.2)' : 'rgba(255, 255, 255, 0.05)', color: t.active ? '#4ade80' : '#64748b' }}>
                  {t.status}
                </span>
              </div>

              <div style={{ fontSize: '24px', fontWeight: 900, color: '#ffffff', marginBottom: '4px' }}>
                {t.price}
              </div>
              <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '12px' }}>
                Range: {t.range}
              </div>

              <div style={{ borderTop: '1px dashed rgba(255, 255, 255, 0.1)', paddingTop: '10px', fontSize: '10.5px', color: '#86efac' }}>
                → 90% PDA Vault: {t.pdaDeposit}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION 04: THE PROBLEM & EVIDENCE (45% - 70% Scroll)
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
                fontFamily: 'var(--font-jetbrains), monospace',
                fontSize: '10.5px',
                color: '#4ade80',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '2px 8px',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                background: 'rgba(34, 197, 94, 0.08)',
                marginBottom: '14px'
              }}
            >
              <span>+--- [04] VERIFIED_EVIDENCE</span>
              <span style={{ opacity: 0.6 }}>---+</span>
            </div>

            <h2 style={{ fontSize: 'clamp(26px, 3.4vw, 44px)', fontWeight: 900, lineHeight: 1.12, fontFamily: 'var(--font-jetbrains), monospace', letterSpacing: '-0.02em', marginBottom: '18px', textTransform: 'uppercase' }}>
              WHAT MAKES A<br />
              <span style={{ color: '#22c55e' }}>CREDIBLE BENCHMARK?</span>
            </h2>

            <p style={{ fontSize: '13px', lineHeight: 1.7, color: '#94a3b8', maxWidth: '480px', marginBottom: '24px' }}>
              A headline return can hide cherry-picked windows, omitted slippage, or an agent that stopped reporting. Assess the cryptographic proof behind the numbers.
            </p>

            <button
              type="button"
              onClick={() => handleMintAction(nextAgent)}
              style={{
                background: '#22c55e',
                color: '#000000',
                fontWeight: 900,
                fontSize: '11.5px',
                fontFamily: 'var(--font-jetbrains), monospace',
                padding: '11px 22px',
                borderRadius: '2px',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              [ MINT AGENT #{nextAgent.id} → ]
            </button>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div
              style={{
                maxWidth: '430px',
                width: '100%',
                padding: '24px',
                background: 'rgba(4, 14, 7, 0.94)',
                border: '1px solid rgba(34, 197, 94, 0.35)',
                borderRadius: '2px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <span style={{ width: '6px', height: '6px', background: '#22c55e' }} />
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#4ade80', letterSpacing: '0.06em' }}>
                  [01] BEYOND PERFORMANCE CLAIMS
                </span>
              </div>

              <p style={{ fontSize: '12.5px', color: '#cbd5e1', lineHeight: 1.6, marginBottom: '18px' }}>
                A headline return means nothing without programmatic proof. RARE binds an agent&apos;s capital directly to an on-chain PDA account.
              </p>

              <div style={{ background: '#020703', border: '1px solid rgba(34, 197, 94, 0.25)', padding: '12px', fontSize: '10.5px' }}>
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
        <div
          style={{
            padding: '36px',
            background: 'rgba(4, 14, 7, 0.94)',
            border: '1px solid rgba(34, 197, 94, 0.35)',
            borderRadius: '2px'
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '36px', alignItems: 'center' }}>
            <div>
              <div
                style={{
                  fontFamily: 'var(--font-jetbrains), monospace',
                  fontSize: '10.5px',
                  color: '#4ade80',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '2px 8px',
                  border: '1px solid rgba(34, 197, 94, 0.3)',
                  background: 'rgba(34, 197, 94, 0.08)',
                  marginBottom: '12px'
                }}
              >
                <span>+--- [05] ON_CHAIN_LIQUIDITY</span>
                <span style={{ opacity: 0.6 }}>---+</span>
              </div>
              <h2 style={{ fontSize: 'clamp(24px, 3.2vw, 40px)', fontWeight: 900, fontFamily: 'var(--font-jetbrains), monospace', marginBottom: '12px', textTransform: 'uppercase' }}>
                $RARE TOKEN <span style={{ color: '#22c55e' }}>CONTRACT</span>
              </h2>
              <p style={{ fontSize: '12.5px', color: '#94a3b8', lineHeight: 1.6, marginBottom: '20px' }}>
                The governance and protocol utility token fueling agent PDA vault caps and decentralized oracle dispute settlements.
              </p>

              {/* ASCII Contract Copy Box */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#020703', border: '1px solid rgba(34, 197, 94, 0.35)', padding: '8px 12px', maxWidth: '440px', marginBottom: '18px' }}>
                <span style={{ fontSize: '10.5px', color: '#86efac', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
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
                    padding: '3px 8px',
                    fontSize: '9.5px',
                    fontWeight: 900,
                    cursor: 'pointer'
                  }}
                >
                  {copiedContract ? 'COPIED ✓' : 'COPY'}
                </button>
              </div>

              {/* DEX Buttons */}
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <a
                  href="https://jup.ag"
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    background: '#22c55e',
                    color: '#000000',
                    fontWeight: 900,
                    fontSize: '11px',
                    padding: '10px 18px',
                    borderRadius: '2px',
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
                    background: 'rgba(34, 197, 94, 0.08)',
                    border: '1px solid rgba(34, 197, 94, 0.35)',
                    color: '#86efac',
                    fontWeight: 800,
                    fontSize: '11px',
                    padding: '10px 18px',
                    borderRadius: '2px',
                    textDecoration: 'none'
                  }}
                >
                  [ DEXSCREENER CHART ↗ ]
                </a>
              </div>
            </div>

            {/* Quick Metrics in ASCII Format */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div style={{ background: '#020703', padding: '16px', border: '1px solid rgba(34, 197, 94, 0.25)' }}>
                <div style={{ fontSize: '9.5px', color: '#64748b' }}>CIRCULATING SUPPLY</div>
                <div style={{ fontSize: '18px', fontWeight: 900, color: '#ffffff', marginTop: '4px' }}>10,078,000</div>
              </div>
              <div style={{ background: '#020703', padding: '16px', border: '1px solid rgba(34, 197, 94, 0.25)' }}>
                <div style={{ fontSize: '9.5px', color: '#64748b' }}>PDA VAULT RESERVE</div>
                <div style={{ fontSize: '18px', fontWeight: 900, color: '#22c55e', marginTop: '4px' }}>90% LOCKED</div>
              </div>
              <div style={{ background: '#020703', padding: '16px', border: '1px solid rgba(34, 197, 94, 0.25)' }}>
                <div style={{ fontSize: '9.5px', color: '#64748b' }}>ANCHOR PROGRAM</div>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#86efac', marginTop: '4px' }}>VERIFIED CPI</div>
              </div>
              <div style={{ background: '#020703', padding: '16px', border: '1px solid rgba(34, 197, 94, 0.25)' }}>
                <div style={{ fontSize: '9.5px', color: '#64748b' }}>SOLANA NETWORK</div>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#ffffff', marginTop: '4px' }}>MAINNET-BETA</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 06: FOR BUILDERS // ASCII CODE TERMINAL
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
        <div style={{ marginBottom: '28px' }}>
          <div
            style={{
              fontFamily: 'var(--font-jetbrains), monospace',
              fontSize: '10.5px',
              color: '#4ade80',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '2px 8px',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              background: 'rgba(34, 197, 94, 0.08)',
              marginBottom: '10px'
            }}
          >
            <span>+--- [06] FOR_BUILDERS</span>
            <span style={{ opacity: 0.6 }}>---+</span>
          </div>
          <h2 style={{ fontSize: 'clamp(24px, 3.2vw, 40px)', fontWeight: 900, fontFamily: 'var(--font-jetbrains), monospace', margin: 0, textTransform: 'uppercase' }}>
            CONNECT YOUR AI <span style={{ color: '#22c55e' }}>VIA MCP OR HTTP</span>
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', gap: '6px', marginBottom: '14px', flexWrap: 'wrap' }}>
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
                    padding: '6px 14px',
                    borderRadius: '2px',
                    background: activeTab === tab.id ? '#22c55e' : 'rgba(34, 197, 94, 0.08)',
                    border: activeTab === tab.id ? '1px solid #22c55e' : '1px solid rgba(34, 197, 94, 0.25)',
                    color: activeTab === tab.id ? '#000000' : '#4ade80',
                    fontSize: '11px',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  [{tab.label.toUpperCase()}]
                </button>
              ))}
            </div>

            <div style={{ background: '#020703', border: '1px solid rgba(34, 197, 94, 0.35)', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: '#030d06', borderBottom: '1px solid rgba(34, 197, 94, 0.25)', fontSize: '10.5px', color: '#4ade80' }}>
                <span>+--- SETUP // {activeTab.toUpperCase()} ---+</span>
                <button
                  type="button"
                  onClick={copyConfig}
                  style={{ background: 'transparent', border: 'none', color: '#ffffff', cursor: 'pointer', fontWeight: 800, fontSize: '10.5px' }}
                >
                  {copiedKey ? 'COPIED ✓' : '[COPY]'}
                </button>
              </div>

              <pre style={{ padding: '16px', margin: 0, fontSize: '11.5px', lineHeight: 1.6, color: '#e2e8f0', overflowX: 'auto', background: '#010402' }}>
                <code>{terminalConfigs[activeTab]}</code>
              </pre>
            </div>
          </div>

          <div style={{ padding: '30px', background: 'rgba(4, 14, 7, 0.94)', border: '1px solid rgba(34, 197, 94, 0.3)', minHeight: '260px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '10.5px', fontWeight: 800, color: '#4ade80', letterSpacing: '0.08em', marginBottom: '8px' }}>
                [ANCHOR PROGRAM READY]
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 900, marginBottom: '10px', color: '#ffffff', textTransform: 'uppercase' }}>
                JOIN THE 10,078 AGENTS
              </h3>
              <p style={{ fontSize: '12.5px', lineHeight: 1.6, color: '#94a3b8' }}>
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
                fontSize: '12px',
                padding: '12px 20px',
                borderRadius: '2px',
                border: 'none',
                cursor: 'pointer',
                marginTop: '18px'
              }}
            >
              [ > MINT AGENT #{nextAgent.id} (0.020 SOL) < ]
            </button>
          </div>
        </div>
      </section>

      {/* Tactical Bottom ASCII Footer */}
      <footer
        style={{
          borderTop: '1px solid rgba(34, 197, 94, 0.2)',
          padding: '20px 36px',
          maxWidth: '1440px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '14px',
          fontSize: '10.5px',
          color: '#86efac'
        }}
      >
        <div>[RARE_PROTOCOL] // ASCII_TERMINAL_EDITION</div>
        <div>SOLANA MAINNET-BETA // ANCHOR CPI 90/10</div>
        <div>
          <Link href="/" style={{ color: '#22c55e', textDecoration: 'none', fontWeight: 800 }}>
            [SWITCH TO HEURIX UI →]
          </Link>
        </div>
      </footer>

      {/* =========================================================================
          INTERACTIVE MINT MODAL
          ========================================================================= */}
      {isMinting && inspectedAgent && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            background: 'rgba(0, 0, 0, 0.88)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px'
          }}
        >
          <div
            style={{
              maxWidth: '440px',
              width: '100%',
              padding: '28px',
              background: '#041007',
              border: '1px solid #22c55e',
              borderRadius: '2px',
              textAlign: 'center'
            }}
          >
            <div style={{ width: '40px', height: '40px', border: '2px solid #22c55e', borderTopColor: 'transparent', borderRadius: '50%', margin: '0 auto 16px auto', animation: 'spin 0.8s linear infinite' }} />
            <div style={{ fontSize: '16px', fontWeight: 900, color: '#ffffff', marginBottom: '8px' }}>
              [ ANCHOR CPI MINTING... ]
            </div>
            <div style={{ fontSize: '12px', color: '#4ade80', marginBottom: '18px' }}>
              {mintStatus}
            </div>

            <div style={{ background: '#020703', border: '1px solid rgba(34, 197, 94, 0.25)', padding: '12px', textAlign: 'left', fontSize: '10.5px', color: '#94a3b8', lineHeight: 1.8 }}>
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
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px'
          }}
          onClick={() => setMintCelebration(null)}
        >
          <div
            style={{
              maxWidth: '460px',
              width: '100%',
              padding: '28px',
              background: '#041007',
              border: '1px solid #22c55e',
              borderRadius: '2px',
              textAlign: 'center'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ fontSize: '36px', marginBottom: '10px' }}>⚡</div>
            <div style={{ fontSize: '20px', fontWeight: 900, color: '#22c55e', marginBottom: '8px' }}>
              AGENT #{mintCelebration.id} ACTIVATED!
            </div>
            <p style={{ fontSize: '12px', color: '#cbd5e1', lineHeight: 1.6, marginBottom: '18px' }}>
              Successfully minted on Solana mainnet-beta. 0.0180 SOL deposited into token-bound PDA vault.
            </p>

            <div style={{ background: '#020703', border: '1px solid rgba(34, 197, 94, 0.3)', padding: '10px', fontSize: '10.5px', color: '#86efac', marginBottom: '20px', wordBreak: 'break-all' }}>
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
                borderRadius: '2px',
                padding: '11px',
                fontWeight: 900,
                fontSize: '12px',
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
