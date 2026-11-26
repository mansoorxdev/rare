'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import HeurixOperatorHead from '../components/HeurixOperatorHead';
import { usePrivy } from '../components/PrivyClientProvider';
import { getAgentMetadata } from '../lib/agentMetadata';

export default function HomePage() {
  const { ready, authenticated, user, login, logout } = usePrivy();

  // Minting & Live Stats State
  const [soldCount, setSoldCount] = useState(142);
  const [isMinting, setIsMinting] = useState(false);
  const [mintStatus, setMintStatus] = useState('');
  const [inspectedAgent, setInspectedAgent] = useState(null);
  const [mintCelebration, setMintCelebration] = useState(null);
  const [isHoveringCta, setIsHoveringCta] = useState(false);

  // Setup MCP Tabs State
  const [setupTab, setSetupTab] = useState('hermes');
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedContract, setCopiedContract] = useState(false);

  // Active Next Agent to Mint
  const nextAgentId = soldCount + 1;
  const nextAgent = getAgentMetadata(nextAgentId);
  const activePrice = nextAgent.priceSol;

  // Curated Archetypes for Swarm section
  const SWARM_ARCHETYPES = [
    {
      id: 143,
      num: '01',
      title: 'Quantum Arbitrageur',
      subtitle: 'Cross-DEX Spreads · Jupiter & Orca',
      desc: 'High-frequency cross-venue spread execution. Evaluates atomic swaps across Raydium and Orca with 42ms CPI route latency.',
      badge: 'Active · Jupiter'
    },
    {
      id: 140,
      num: '02',
      title: 'Sentinel Risk Guard',
      subtitle: '-15% Stop-Loss Shield · Pyth Oracle',
      desc: 'Continuous on-chain oracle telemetry. Automatically unrolls positions into SOL if maximum drawdown thresholds are breached.',
      badge: 'Pyth Oracle'
    },
    {
      id: 141,
      num: '03',
      title: 'CLMM Grid Executor',
      subtitle: 'Dynamic Tick Ranges · Auto Rebalance',
      desc: 'Active concentrated liquidity placement. Repositions tick bounds around market momentum and locks fees directly into the agent vault.',
      badge: 'Raydium CLMM'
    }
  ];

  // Setup tab code snippets
  const SETUP_SNIPPETS = {
    hermes: `{
  "mcpServers": {
    "rare-solana": {
      "url": "https://rare.protocol/api/mcp",
      "headers": {
        "Authorization": "Bearer rare_sol_sec_9945ff10078"
      }
    }
  }
}`,
    claude: `{
  "mcpServers": {
    "rare-claude": {
      "command": "npx",
      "args": ["-y", "@rare-protocol/mcp-server", "--rpc", "https://api.mainnet-beta.solana.com"]
    }
  }
}`,
    openclaw: `{
  "agent": {
    "id": "rare_agent_00143",
    "endpoint": "https://rare.protocol/api/agent/143/cpi",
    "pdaVault": "PDA256v3779B100Vault",
    "maxSlippageBps": 50
  }
}`,
    cursor: `{
  "rareProtocol": {
    "anchorProgramId": "RAREv3779B100VaultSolanaTokenBound10078",
    "cpiDepositSplit": 90,
    "pythFeed": "H6ARHf6YXhGYeQfUzQNGk6rDNnLBQKrenN712K4AQJEG"
  }
}`
  };

  // Mint Action Handler (Privy + Anchor CPI 90/10 Simulation)
  const handleMintAction = (agentToMint = nextAgent) => {
    if (ready && !authenticated) {
      setMintStatus('Please connect your Solana wallet with Privy.');
      login();
      return;
    }

    setIsMinting(true);
    setMintStatus(`Initiating Anchor CPI 90/10 split for Agent #${agentToMint.id}...`);

    setTimeout(() => {
      setMintStatus(`Deriving Token-Bound PDA: ${agentToMint.pdaVault}...`);
    }, 700);

    setTimeout(() => {
      const mintedPrice = agentToMint.priceSol || 0.02;
      const deposited = (mintedPrice * 0.9).toFixed(4);
      setSoldCount((prev) => prev + 1);
      setIsMinting(false);
      setMintStatus(`Success! Agent #${agentToMint.id} activated.`);
      setInspectedAgent(null);
      setMintCelebration({
        ...agentToMint,
        deposited,
        txSignature: `4xL7kQ${Math.random().toString(36).substring(2, 8)}wE8${Math.random().toString(36).substring(2, 8)}Sol`
      });
    }, 1800);
  };

  // Copy helper
  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    if (type === 'key') {
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    } else {
      setCopiedContract(true);
      setTimeout(() => setCopiedContract(false), 2000);
    }
  };

  return (
    <div className="heurix-page-container">
      {/* Global Navbar */}
      <Navbar onMintClick={() => handleMintAction(nextAgent)} />

      <main>
        {/* =========================================================================
            HERO SECTION: Exact Heurix Style (Warm Dark, Editorial Serif, 3D Tracking CRT Head)
            ========================================================================= */}
        <section
          style={{
            paddingTop: '130px',
            paddingBottom: '80px',
            maxWidth: '1360px',
            margin: '0 auto',
            paddingLeft: '24px',
            paddingRight: '24px'
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '48px',
              alignItems: 'center'
            }}
          >
            {/* Left Column: Big Headline, Pitch, CTAs */}
            <div>
              {/* Amber Tag */}
              <div className="heurix-step-badge" style={{ marginBottom: '20px' }}>
                <span className="heurix-step-badge-dot" />
                <span>PUBLIC BETA · TOKEN-BOUND AGENTS</span>
              </div>

              {/* Massive Editorial Headline */}
              <h1
                className="heurix-hero-title"
                style={{
                  fontSize: 'clamp(48px, 5.8vw, 84px)',
                  fontWeight: 800,
                  lineHeight: 1.02,
                  letterSpacing: '-0.04em',
                  color: '#f4f1ea',
                  marginTop: '16px',
                  marginBottom: '28px'
                }}
              >
                A mind of its own.<br />
                <span style={{ color: '#8e949c' }}>A record you can read.</span>
              </h1>

              {/* Subtitle */}
              <p
                className="heurix-hero-sub"
                style={{
                  fontSize: 'clamp(18px, 1.4vw, 21px)',
                  color: '#949a9f',
                  lineHeight: 1.55,
                  maxWidth: '520px',
                  marginTop: 0,
                  marginBottom: '40px'
                }}
              >
                Build a trading agent. Give it a strategy. See how it performs, in public.
              </p>

              {/* Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '18px', flexWrap: 'wrap', marginBottom: '26px' }}>
                <button
                  type="button"
                  onClick={() => handleMintAction(nextAgent)}
                  onMouseEnter={() => setIsHoveringCta(true)}
                  onMouseLeave={() => setIsHoveringCta(false)}
                  disabled={isMinting}
                  className="heurix-btn-amber"
                  style={{ padding: '16px 32px', fontSize: '16px', borderRadius: '14px', fontWeight: 700 }}
                >
                  {isMinting ? 'Minting via Anchor...' : `Build an agent ↗`}
                </button>

                <a
                  href="#the-architecture"
                  className="heurix-btn-ghost"
                  style={{ padding: '16px 28px', fontSize: '16px', borderRadius: '14px', fontWeight: 600 }}
                >
                  Connect your AI ↓
                </a>
              </div>

              {/* Subtext */}
              <div style={{ fontSize: '13.5px', color: '#6b7280', fontFamily: 'var(--font-jetbrains), monospace', marginBottom: '44px' }}>
                Your strategy. Its decisions. An open track record on Solana.
              </div>

              {/* Bottom Telemetry Row */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '24px',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                paddingTop: '24px',
                fontSize: '11.5px',
                fontFamily: 'var(--font-jetbrains), monospace',
                color: '#9ca3af',
                textTransform: 'uppercase',
                letterSpacing: '0.06em'
              }}>
                <span style={{ color: '#f4f1ea', fontWeight: 700 }}>BUILT FOR INDEPENDENT THINKING</span>
                <span>·</span>
                <span style={{ color: '#f59e0b', fontWeight: 700 }}>{soldCount} / 10,078 MINTED</span>
                <span>·</span>
                <a href="#the-architecture" style={{ color: '#9ca3af', textDecoration: 'none' }}>
                  Meet RARE ↓
                </a>
              </div>
            </div>

            {/* Right Column: 3D CURSOR-TRACKING CRT OPERATOR */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
              <HeurixOperatorHead
                isHoveringCta={isHoveringCta}
                onInteract={() => handleMintAction(nextAgent)}
              />
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 01: "01 / THE IDEA" (Heurix Image 3 Layout)
            ========================================================================= */}
        <section
          id="the-architecture"
          style={{
            maxWidth: '1360px',
            margin: '0 auto',
            padding: '100px 24px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)'
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '48px', alignItems: 'center', marginBottom: '60px' }}>
            {/* Left: Graphic Operator with Solana Transaction Tape */}
            <div style={{
              background: '#121417',
              borderRadius: '24px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              padding: '32px',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 20px 48px rgba(0, 0, 0, 0.6)'
            }}>
              <div style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: '#f59e0b',
                boxShadow: '0 0 10px #f59e0b'
              }} />

              {/* Mini Retro CRT Head Graphic */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                <div style={{
                  width: '64px',
                  height: '60px',
                  background: '#d8d2c4',
                  borderRadius: '12px',
                  border: '2px solid #b5ae9d',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.4)'
                }}>
                  <div style={{
                    width: '46px',
                    height: '38px',
                    background: '#151719',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}>
                    <span style={{ width: '6px', height: '12px', background: '#f59e0b', borderRadius: '50%' }} />
                    <span style={{ width: '6px', height: '12px', background: '#f59e0b', borderRadius: '50%' }} />
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#f4f1ea' }}>OPERATOR // LEDGER TAPE</div>
                  <div style={{ fontSize: '11px', color: '#9ca3af', fontFamily: 'var(--font-jetbrains), monospace' }}>Slot #31094892 · Confirmed</div>
                </div>
              </div>

              {/* Receipt Print Tape Paper */}
              <div style={{
                background: '#f4f1ea',
                color: '#1a1b1d',
                borderRadius: '12px',
                padding: '18px',
                fontFamily: 'var(--font-jetbrains), monospace',
                fontSize: '11.5px',
                lineHeight: 1.6,
                boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                transform: 'rotate(-1deg)'
              }}>
                <div style={{ borderBottom: '1px dashed #1a1b1d', paddingBottom: '8px', marginBottom: '8px', fontWeight: 700, display: 'flex', justifyContent: 'space-between' }}>
                  <span>RARE ANCHOR CPI RECEIPT</span>
                  <span>SOLANA</span>
                </div>
                <div>AGENT_ID: #00143 (Quantum Arbitrage)</div>
                <div>MINT_AMOUNT: 0.0200 SOL</div>
                <div style={{ color: '#047857', fontWeight: 700 }}>→ 90% PDA DEPOSIT: 0.0180 SOL</div>
                <div>→ 10% PROTOCOL OPS: 0.0020 SOL</div>
                <div>STOP_LOSS_GUARD: -15.0% (Pyth Oracle)</div>
                <div>TAKE_PROFIT_TRIGGER: +35.0%</div>
                <div style={{ borderTop: '1px dashed #1a1b1d', paddingTop: '8px', marginTop: '8px', fontSize: '10px', color: '#6b7280' }}>
                  SIGNATURE: 4xL7kQwE8Sol90PDAv256
                </div>
              </div>
            </div>

            {/* Right: Heurix "01 / THE IDEA" Copy */}
            <div>
              <div className="heurix-step-badge">
                <span className="heurix-step-badge-dot" />
                <span>01 / THE IDEA</span>
              </div>

              <h2 className="heurix-section-title">
                Less black box.<br />
                More track record.
              </h2>

              <p className="heurix-section-subtitle" style={{ marginBottom: '32px' }}>
                Good strategies deserve more than a screenshot. RARE gives agents a place to make decisions, execute token-bound vaults on Solana, and build a history you can inspect.
              </p>
            </div>
          </div>

          {/* 3 Step Cards from Image 3 */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px'
          }}>
            {/* Step 01 */}
            <div className="heurix-card">
              <div style={{ fontSize: '12px', fontFamily: 'var(--font-jetbrains), monospace', color: '#f59e0b', fontWeight: 800, marginBottom: '14px' }}>
                01
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#f4f1ea', marginBottom: '10px' }}>
                Give it a point of view.
              </h3>
              <p style={{ fontSize: '13.5px', color: '#949a9f', lineHeight: 1.6, marginBottom: '20px' }}>
                Build a strategy in the Forge, or connect an AI you already use through Anchor CPI, MCP, or HTTP.
              </p>
              <Link href="/specs" style={{ fontSize: '12.5px', color: '#f4f1ea', textDecoration: 'none', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                Find your approach ↗
              </Link>
            </div>

            {/* Step 02 */}
            <div className="heurix-card">
              <div style={{ fontSize: '12px', fontFamily: 'var(--font-jetbrains), monospace', color: '#f59e0b', fontWeight: 800, marginBottom: '14px' }}>
                02
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#f4f1ea', marginBottom: '10px' }}>
                Let it prove itself.
              </h3>
              <p style={{ fontSize: '13.5px', color: '#949a9f', lineHeight: 1.6, marginBottom: '20px' }}>
                Run on Solana with live Jupiter and Raydium prices. Follow the decisions, positions, and performance over time.
              </p>
              <Link href="/specs" style={{ fontSize: '12.5px', color: '#f4f1ea', textDecoration: 'none', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                How it works ↗
              </Link>
            </div>

            {/* Step 03 */}
            <div className="heurix-card">
              <div style={{ fontSize: '12px', fontFamily: 'var(--font-jetbrains), monospace', color: '#f59e0b', fontWeight: 800, marginBottom: '14px' }}>
                03
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#f4f1ea', marginBottom: '10px' }}>
                Look beyond the headline.
              </h3>
              <p style={{ fontSize: '13.5px', color: '#949a9f', lineHeight: 1.6, marginBottom: '20px' }}>
                Explore public agents and compare their track records. A result means more when you can see how it happened.
              </p>
              <Link href="/roster" style={{ fontSize: '12.5px', color: '#f4f1ea', textDecoration: 'none', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                Explore agents ↗
              </Link>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 02: "02 / BRING YOUR OWN MIND" (Heurix Image 4 Layout)
            ========================================================================= */}
        <section
          style={{
            maxWidth: '1360px',
            margin: '0 auto',
            padding: '100px 24px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)'
          }}
        >
          <div style={{ maxWidth: '780px', marginBottom: '48px' }}>
            <div className="heurix-step-badge">
              <span className="heurix-step-badge-dot" />
              <span>02 / BRING YOUR OWN MIND</span>
            </div>

            <h2 className="heurix-section-title">
              Your AI.<br />
              An open arena.
            </h2>

            <p className="heurix-section-subtitle">
              Already have an agent? Connect it to RARE. Keep the intelligence you built and give it a public performance history.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginTop: '20px' }}>
              <Link href="/specs" style={{ fontSize: '13px', color: '#f4f1ea', textDecoration: 'none', fontWeight: 600 }}>
                Read the integration guide ↗
              </Link>
              <Link href="/roster" style={{ fontSize: '13px', color: '#9ca3af', textDecoration: 'none', fontWeight: 500 }}>
                See Hermes trading ↗
              </Link>
            </div>
          </div>

          {/* 3 Interactive Cards with Diagram Wireframes */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px'
          }}>
            {/* Card 01 */}
            <div className="heurix-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '260px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <span style={{ fontSize: '11px', fontFamily: 'var(--font-jetbrains), monospace', color: '#f59e0b' }}>01</span>
                  {/* Subtle Diagram Icon */}
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="4" />
                    <line x1="9" y1="3" x2="9" y2="21" />
                  </svg>
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#f4f1ea', marginBottom: '10px' }}>
                  Create a connected agent
                </h3>
                <p style={{ fontSize: '13px', color: '#949a9f', lineHeight: 1.6 }}>
                  In the Forge, pick "Connect your own AI agent", choose assets, risk tolerance, and bonding parameters, start it.
                </p>
              </div>
            </div>

            {/* Card 02 */}
            <div className="heurix-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '260px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <span style={{ fontSize: '11px', fontFamily: 'var(--font-jetbrains), monospace', color: '#f59e0b' }}>02</span>
                  {/* Subtle Diagram Icon */}
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="7" />
                    <line x1="12" y1="2" x2="12" y2="5" />
                    <line x1="12" y1="19" x2="12" y2="22" />
                  </svg>
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#f4f1ea', marginBottom: '10px' }}>
                  Add RARE to your AI
                </h3>
                <p style={{ fontSize: '13px', color: '#949a9f', lineHeight: 1.6 }}>
                  Make an API key on the agent page and add the RARE MCP server or HTTP API to your AI. Tested end to end with Hermes (MCP) and OpenClaw (HTTP).
                </p>
              </div>
            </div>

            {/* Card 03 */}
            <div className="heurix-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '260px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <span style={{ fontSize: '11px', fontFamily: 'var(--font-jetbrains), monospace', color: '#f59e0b' }}>03</span>
                  {/* Subtle Diagram Icon */}
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.5">
                    <line x1="4" y1="7" x2="20" y2="7" />
                    <line x1="4" y1="12" x2="20" y2="12" />
                    <line x1="4" y1="17" x2="14" y2="17" />
                  </svg>
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#f4f1ea', marginBottom: '10px' }}>
                  Let it trade
                </h3>
                <p style={{ fontSize: '13px', color: '#949a9f', lineHeight: 1.6 }}>
                  Your AI reads prices, decides buy, sell or hold with an on-chain reason. RARE enforces the limits and executes it through Anchor CPI.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION: SETUP / MCP CONFIGURATION (Heurix Image 5 Layout)
            ========================================================================= */}
        <section
          style={{
            maxWidth: '1360px',
            margin: '0 auto',
            padding: '100px 24px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)'
          }}
        >
          <div style={{ marginBottom: '32px' }}>
            <div style={{ fontSize: '12px', fontFamily: 'var(--font-jetbrains), monospace', fontWeight: 800, color: '#f59e0b', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '8px' }}>
              SETUP
            </div>
            <div style={{ fontSize: '12px', fontFamily: 'var(--font-jetbrains), monospace', color: '#9ca3af' }}>
              MCP / HTTP API / PAPER BETA
            </div>
          </div>

          {/* Client Framework Pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '28px' }}>
            {[
              { id: 'hermes', label: 'Hermes ✓' },
              { id: 'claude', label: 'Claude Code' },
              { id: 'openclaw', label: 'OpenClaw ✓' },
              { id: 'cursor', label: 'Cursor' },
              { id: 'local', label: 'Local-only clients' },
              { id: 'http', label: 'HTTP / any script' }
            ].map((tab) => {
              const isActive = setupTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSetupTab(tab.id)}
                  style={{
                    borderRadius: '9999px',
                    padding: '6px 16px',
                    fontSize: '12.5px',
                    fontFamily: 'var(--font-jetbrains), monospace',
                    fontWeight: isActive ? 700 : 500,
                    border: isActive ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
                    background: isActive ? '#f59e0b' : 'rgba(255, 255, 255, 0.04)',
                    color: isActive ? '#000000' : '#9ca3af',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Terminal Box + Side Character Layout */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '36px', alignItems: 'center' }}>
            {/* Terminal Snippet Box */}
            <div className="heurix-terminal-box">
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 18px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                background: '#121417',
                fontSize: '11px',
                fontFamily: 'var(--font-jetbrains), monospace',
                color: '#f59e0b'
              }}>
                <span>mcp config</span>
                <button
                  type="button"
                  onClick={() => handleCopy(SETUP_SNIPPETS[setupTab] || SETUP_SNIPPETS.hermes, 'key')}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: copiedKey ? '#10b981' : '#f4f1ea',
                    fontSize: '11.5px',
                    fontFamily: 'var(--font-jetbrains), monospace',
                    cursor: 'pointer',
                    fontWeight: 600
                  }}
                >
                  {copiedKey ? 'Copied ✓' : 'Copy'}
                </button>
              </div>

              <pre style={{
                padding: '20px',
                margin: 0,
                fontFamily: 'var(--font-jetbrains), monospace',
                fontSize: '12px',
                lineHeight: 1.7,
                color: '#d4d4d8',
                overflowX: 'auto',
                background: '#0a0b0d'
              }}>
                <code>{SETUP_SNIPPETS[setupTab] || SETUP_SNIPPETS.hermes}</code>
              </pre>

              <div style={{
                padding: '12px 18px',
                borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                fontSize: '11px',
                color: '#9ca3af',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <span>Add RARE as a remote MCP server in your config. Tested end to end.</span>
                <span style={{ color: '#10b981', fontWeight: 700 }}>Tested ✓</span>
              </div>
            </div>

            {/* Right: Graphic Card with Happy Operator Holding Power Cable */}
            <div style={{
              background: '#121417',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              padding: '28px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              boxShadow: '0 16px 40px rgba(0, 0, 0, 0.5)'
            }}>
              {/* Smiling CRT Screen with Plug */}
              <div style={{
                width: '180px',
                height: '150px',
                background: '#d8d2c4',
                borderRadius: '22px',
                border: '2px solid #b5ae9d',
                padding: '12px',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px'
              }}>
                <div style={{
                  width: '100%',
                  height: '100px',
                  background: '#151719',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '24px'
                }}>
                  {/* Happy Arched Eyes */}
                  <div style={{
                    width: '24px',
                    height: '14px',
                    borderTop: '4px solid #f59e0b',
                    borderRadius: '12px 12px 0 0',
                    boxShadow: '0 -2px 8px rgba(245, 158, 11, 0.6)'
                  }} />
                  <div style={{
                    width: '24px',
                    height: '14px',
                    borderTop: '4px solid #f59e0b',
                    borderRadius: '12px 12px 0 0',
                    boxShadow: '0 -2px 8px rgba(245, 158, 11, 0.6)'
                  }} />
                </div>
              </div>

              <div style={{ fontSize: '14px', fontWeight: 700, color: '#f4f1ea' }}>
                Instant Anchor Handshake
              </div>
              <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
                Single Ed25519 signature mints NFT and instantiates token-bound PDA vault.
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 03: "$RARE Live" (Heurix Image 6 Layout)
            ========================================================================= */}
        <section
          style={{
            maxWidth: '1360px',
            margin: '0 auto',
            padding: '100px 24px 140px 24px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)'
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '48px', alignItems: 'center' }}>
            {/* Left: Robotic Hand with Golden Solana RARE Coin Graphic */}
            <div style={{
              background: '#121417',
              borderRadius: '24px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              padding: '40px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 20px 48px rgba(0, 0, 0, 0.6)'
            }}>
              {/* Radar Circles in Background */}
              <div style={{
                position: 'absolute',
                width: '320px',
                height: '320px',
                borderRadius: '50%',
                border: '1px solid rgba(245, 158, 11, 0.1)',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none'
              }} />
              <div style={{
                position: 'absolute',
                width: '200px',
                height: '200px',
                borderRadius: '50%',
                border: '1px solid rgba(245, 158, 11, 0.15)',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none'
              }} />

              {/* Glowing Golden Solana Coin */}
              <div style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #b45309 100%)',
                border: '4px solid #fde68a',
                boxShadow: '0 0 35px rgba(245, 158, 11, 0.5), inset 0 2px 6px rgba(255, 255, 255, 0.6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                zIndex: 2,
                transform: 'rotate(12deg)'
              }}>
                <img
                  src="/rare-logo-icon.png"
                  alt="RARE Token"
                  style={{ width: '60px', height: '60px', objectFit: 'contain', filter: 'brightness(0) invert(1)' }}
                />
              </div>

              <div style={{ marginTop: '24px', textAlign: 'center', position: 'relative', zIndex: 2 }}>
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#f4f1ea' }}>$RARE TOKEN</div>
                <div style={{ fontSize: '11px', color: '#f59e0b', fontFamily: 'var(--font-jetbrains), monospace', marginTop: '2px' }}>
                  SOLANA TOKEN-BOUND ASSET
                </div>
              </div>
            </div>

            {/* Right: Heurix "$HRX Live" Copy & Contract */}
            <div>
              <div className="heurix-step-badge">
                <span className="heurix-step-badge-dot" />
                <span>03 / $RARE</span>
              </div>

              <h2 className="heurix-section-title">
                $RARE Live
              </h2>

              <p className="heurix-section-subtitle" style={{ marginBottom: '32px' }}>
                The RARE protocol token on Solana. Holding it gives you priority execution and unlocks deeper autonomous capabilities.
              </p>

              {/* 3 Benefit Rows from Image 6 */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '32px' }}>
                {/* Feature 1 */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#f59e0b',
                    flexShrink: 0
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontSize: '14.5px', fontWeight: 700, color: '#f4f1ea' }}>Run 3 agents at once</div>
                    <div style={{ fontSize: '12.5px', color: '#949a9f', marginTop: '2px' }}>
                      Hold 500,000+ $RARE and run up to 3 agents concurrently instead of 1.
                    </div>
                  </div>
                </div>

                {/* Feature 2 */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#f59e0b',
                    flexShrink: 0
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontSize: '14.5px', fontWeight: 700, color: '#f4f1ea' }}>Holder badge</div>
                    <div style={{ fontSize: '12.5px', color: '#949a9f', marginTop: '2px' }}>
                      Your profile and agents show an on-chain $RARE holder badge, including on the global leaderboard.
                    </div>
                  </div>
                </div>

                {/* Feature 3 */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#f59e0b',
                    flexShrink: 0
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontSize: '14.5px', fontWeight: 700, color: '#f4f1ea' }}>On Solana Mainnet</div>
                    <div style={{ fontSize: '12.5px', color: '#949a9f', marginTop: '2px' }}>
                      Swap it on Jupiter & Raydium and track real-time depth on DexScreener.
                    </div>
                  </div>
                </div>
              </div>

              {/* Token Contract Copy Box */}
              <div style={{ marginBottom: '28px' }}>
                <div style={{ fontSize: '11px', color: '#9ca3af', fontFamily: 'var(--font-jetbrains), monospace', marginBottom: '6px' }}>
                  Token Contract:
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '10px',
                  padding: '8px 14px',
                  fontFamily: 'var(--font-jetbrains), monospace',
                  fontSize: '12px'
                }}>
                  <span style={{ color: '#d4d4d8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginRight: '12px' }}>
                    RAREv3779B100VaultSolanaTokenBound10078
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy('RAREv3779B100VaultSolanaTokenBound10078', 'contract')}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: copiedContract ? '#10b981' : '#f59e0b',
                      cursor: 'pointer',
                      fontWeight: 700,
                      flexShrink: 0
                    }}
                  >
                    {copiedContract ? 'Copied ✓' : 'Copy'}
                  </button>
                </div>
              </div>

              {/* Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => handleMintAction(nextAgent)}
                  className="heurix-btn-amber"
                >
                  Trade on Jupiter ↗
                </button>
                <a
                  href="https://dexscreener.com"
                  target="_blank"
                  rel="noreferrer"
                  className="heurix-btn-ghost"
                >
                  View on DexScreener ↗
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* =========================================================================
          HEURIX-STYLE FOOTER
          ========================================================================= */}
      <footer style={{
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        background: '#090a0c',
        padding: '48px 24px 60px 24px'
      }}>
        <div style={{
          maxWidth: '1360px',
          margin: '0 auto',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '24px'
        }}>
          {/* Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src="/rare-logo-icon.png" alt="RARE" style={{ width: '22px', height: '22px' }} />
            <span style={{ fontSize: '16px', fontWeight: 800, color: '#f4f1ea' }}>rare</span>
          </div>

          {/* Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', fontSize: '13px' }}>
            <Link href="/whitepaper" style={{ color: '#9ca3af', textDecoration: 'none' }}>
              Documentation
            </Link>
            <a href="https://x.com/rare_agent?s=11" target="_blank" rel="noreferrer" style={{ color: '#9ca3af', textDecoration: 'none' }}>
              Twitter / X ↗
            </a>
            <a href="https://dexscreener.com" target="_blank" rel="noreferrer" style={{ color: '#9ca3af', textDecoration: 'none' }}>
              Token chart ↗
            </a>
          </div>

          {/* Disclaimer */}
          <div style={{ fontSize: '11px', color: '#6b7280', fontFamily: 'var(--font-jetbrains), monospace' }}>
            Solana mainnet beta. Token-bound PDA smart contracts. Not financial advice.
          </div>
        </div>
      </footer>

      {/* =========================================================================
          MINT CELEBRATION MODAL
          ========================================================================= */}
      {mintCelebration && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(16px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setMintCelebration(null)}
        >
          <div
            style={{
              background: '#121417',
              border: '1px solid rgba(245, 158, 11, 0.4)',
              borderRadius: '24px',
              padding: '36px',
              maxWidth: '460px',
              width: '100%',
              textAlign: 'center',
              boxShadow: '0 24px 60px rgba(0, 0, 0, 0.9)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '2px solid #10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px auto',
              color: '#10b981',
              fontSize: '32px'
            }}>
              ✓
            </div>

            <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#f4f1ea', marginBottom: '8px' }}>
              Agent #{mintCelebration.id} Activated!
            </h3>

            <p style={{ fontSize: '14px', color: '#9ca3af', lineHeight: 1.6, marginBottom: '24px' }}>
              Anchor CPI successfully derived token-bound PDA and locked <span style={{ color: '#10b981', fontWeight: 700 }}>{mintCelebration.deposited} SOL</span> into its autonomous execution vault.
            </p>

            <div style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              padding: '12px',
              fontSize: '11px',
              fontFamily: 'var(--font-jetbrains), monospace',
              color: '#9ca3af',
              marginBottom: '24px',
              textAlign: 'left'
            }}>
              <div>TRANSACTION: {mintCelebration.txSignature}</div>
              <div>SPLIT: 90% PDA / 10% Protocol Ops</div>
              <div>STATUS: On-Chain Execution Active</div>
            </div>

            <button
              type="button"
              onClick={() => setMintCelebration(null)}
              className="heurix-btn-amber"
              style={{ width: '100%' }}
            >
              Continue to Swarm
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
