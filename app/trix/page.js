'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Rare3DCanvas from '../../components/trix/Rare3DCanvas';
import TrixNavbar from '../../components/trix/TrixNavbar';
import TrixHudFooter from '../../components/trix/TrixHudFooter';
import AsciiScrambleText, { AsciiDecryptionParagraph, AsciiCipherTape } from '../../components/trix/AsciiScrambleText';
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

  // Curated Swarm Archetypes (matching XIVO table)
  const SWARM_AGENTS = [
    {
      id: 143,
      name: 'Agent #00143: Quantum Arbitrageur',
      venue: 'Jupiter & Orca',
      badge: 'Active',
      pdaVault: 'PDA256v3779B100Vault',
      apy: '+42.8%',
      risk: 'Low (Hedging)',
      date: '28 Jul',
      priceSol: 0.02
    },
    {
      id: 140,
      name: 'Agent #00140: Sentinel Risk Guard',
      venue: 'Pyth Oracle Shield',
      badge: 'Active',
      pdaVault: 'PDASentinelGuardVault',
      apy: '+29.4%',
      risk: '-15% Stop Guard',
      date: '2 Aug',
      priceSol: 0.02
    },
    {
      id: 141,
      name: 'Agent #00141: CLMM Grid Executor',
      venue: 'Raydium Concentrated',
      badge: 'Active',
      pdaVault: 'PDAGridExecutorVault',
      apy: '+58.2%',
      risk: 'Medium (Tick)',
      date: '2 Aug',
      priceSol: 0.02
    },
    {
      id: 142,
      name: 'Agent #00142: Vault Rebalancer',
      venue: 'Kamino & Meteora',
      badge: 'Active',
      pdaVault: 'PDAVaultRebalancer',
      apy: '+34.1%',
      risk: 'Low (Delta 0)',
      date: '3 Aug',
      priceSol: 0.02
    },
    {
      id: 144,
      name: 'Agent #00144: Momentum Hunter',
      venue: 'Volume Breakouts',
      badge: 'Active',
      pdaVault: 'PDAMomentumVault',
      apy: '+64.5%',
      risk: 'High (Breakout)',
      date: '4 Aug',
      priceSol: 0.02
    },
    {
      id: 145,
      name: 'Agent #00145: Liquidity Provider',
      venue: 'SOL-USDC Anchor',
      badge: 'Active',
      pdaVault: 'PDALiquidityVault',
      apy: '+31.0%',
      risk: 'Neutral',
      date: '5 Aug',
      priceSol: 0.02
    }
  ];

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
      style={{
        minHeight: '100vh',
        background: '#060706',
        color: '#f8fafc',
        fontFamily: 'var(--font-jetbrains), "Courier New", Courier, monospace',
        position: 'relative',
        overflowX: 'hidden'
      }}
    >
      {/* Global Minimalist Navbar */}
      <TrixNavbar onMintClick={() => handleMintAction(nextAgent)} />

      {/* Solid 3D Gemstone Crystal Canvas (Right-Floating Hero Graphic) */}
      <Rare3DCanvas scrollProgress={scrollProgress} />

      {/* Floating Tactical ASCII Copilot Drawer */}
      <TrixHudFooter />

      {/* =========================================================================
          SECTION 01: HERO // PURE XIVO AESTHETIC (ref_frame_02.jpg / 06.jpg)
          ========================================================================= */}
      <section
        id="overview"
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '120px 48px 60px 48px',
          maxWidth: '1440px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 15
        }}
      >
        <div style={{ maxWidth: '620px' }}>
          {/* XIVO Dot-Matrix Style Headline */}
          <h1
            style={{
              fontSize: 'clamp(44px, 5.5vw, 76px)',
              fontWeight: 900,
              lineHeight: 1.04,
              letterSpacing: '-0.03em',
              margin: '0 0 24px 0',
              color: '#ffffff'
            }}
          >
            AI trading
            <br />
            agents.
          </h1>

          {/* XIVO Scramble Decrypting Paragraph (ref_frame_06.jpg) */}
          <AsciiDecryptionParagraph
            prefix="Any agent — a quantum arbitrageur, a risk sentinel, a CLMM executor — "
            suffix="becomes a verified on-chain PDA. The Anchor CPI picks the outcome."
          />

          {/* Minimalist XIVO Action Link */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginTop: '12px' }}>
            <button
              type="button"
              onClick={() => handleMintAction(nextAgent)}
              disabled={isMinting}
              style={{
                background: '#ffffff',
                color: '#000000',
                border: 'none',
                borderRadius: '2px',
                padding: '10px 22px',
                fontFamily: 'var(--font-jetbrains), monospace',
                fontSize: '13px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'opacity 0.15s ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
            >
              <span>{isMinting ? 'Minting...' : `Mint Agent #${nextAgent.id} (0.020 SOL) ↗`}</span>
            </button>

            <a
              href="#agents"
              style={{
                color: '#71717a',
                fontSize: '13px',
                fontWeight: 700,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'color 0.15s ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#71717a')}
            >
              <span>Explore swarm ↓</span>
            </a>
          </div>

          {/* Ambient Cipher Decoder Line */}
          <div style={{ marginTop: '36px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#52525b' }}>[DECODER]</span>
            <AsciiCipherTape length={38} speed={120} style={{ fontSize: '11px', color: '#71717a' }} />
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 02: LIVE MARKETS / AGENTS TABLE (ref_frame_15.jpg & ref_frame_20.jpg)
          ========================================================================= */}
      <section
        id="agents"
        style={{
          minHeight: '85vh',
          padding: '100px 48px',
          maxWidth: '1440px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 15,
          borderTop: '1px solid rgba(255, 255, 255, 0.08)'
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '64px', alignItems: 'flex-start' }}>
          {/* Left Column: Headline & Scramble Subtitle */}
          <div>
            <h2
              style={{
                fontSize: 'clamp(28px, 3.6vw, 48px)',
                fontWeight: 800,
                lineHeight: 1.15,
                letterSpacing: '-0.02em',
                margin: '0 0 18px 0',
                color: '#ffffff'
              }}
            >
              Live autonomous agents,
              <br />
              on chain right now.
            </h2>

            <p style={{ fontSize: '13.5px', lineHeight: 1.7, color: '#71717a', maxWidth: '440px', margin: '0 0 28px 0' }}>
              Every proposal opens an Anchor PDA vault. Real-time execution streams directly on Solana mainnet.
            </p>

            {/* XIVO Ambient Quote Decryption (ref_frame_20.jpg) */}
            <div style={{ padding: '16px 20px', borderLeft: '2px solid rgba(255, 255, 255, 0.15)', fontSize: '11.5px', color: '#71717a', lineHeight: 1.6 }}>
              <div>Civilization is built on correct on-chain execution.</div>
              <div style={{ marginTop: '4px' }}>
                <AsciiCipherTape length={36} speed={140} style={{ fontSize: '10px', color: '#52525b' }} />
              </div>
              <div style={{ marginTop: '6px', fontSize: '10.5px', color: '#52525b' }}>— RARE Protocol Sentinel</div>
            </div>
          </div>

          {/* Right Column: Clean Monospace XIVO Table */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid rgba(255, 255, 255, 0.12)', fontSize: '11px', fontWeight: 800, color: '#71717a', letterSpacing: '0.08em' }}>
              <span>AGENTS</span>
              <span>06</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {SWARM_AGENTS.map((agent) => (
                <div
                  key={agent.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '18px 0',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                    cursor: 'pointer',
                    transition: 'padding-left 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.paddingLeft = '8px';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.paddingLeft = '0px';
                  }}
                  onClick={() => handleMintAction(agent)}
                >
                  <div>
                    <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#ffffff', marginBottom: '3px' }}>
                      {agent.name}
                    </div>
                    <div style={{ fontSize: '11px', color: '#71717a' }}>
                      {agent.venue} · {agent.risk}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px', textAlign: 'right' }}>
                    <span style={{ fontSize: '11px', color: '#22c55e', fontWeight: 800 }}>
                      {agent.apy}
                    </span>
                    <span style={{ fontSize: '11px', color: '#52525b' }}>
                      {agent.date}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 03: HORIZONTAL PIPELINE / STEPPER (ref_frame_30.jpg)
          ========================================================================= */}
      <section
        id="pipeline"
        style={{
          minHeight: '70vh',
          padding: '100px 48px',
          maxWidth: '1440px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 15,
          borderTop: '1px solid rgba(255, 255, 255, 0.08)'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <div style={{ fontSize: '11px', color: '#71717a', fontWeight: 800, letterSpacing: '0.1em', marginBottom: '12px' }}>
            HOW RARE WORKS
          </div>
          <h2 style={{ fontSize: 'clamp(26px, 3.2vw, 42px)', fontWeight: 800, color: '#ffffff', margin: 0 }}>
            Four steps. Pure cryptographic verification.
          </h2>
        </div>

        {/* Stepper Pipeline (XIVO style) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '32px', position: 'relative' }}>
          {[
            { step: '01', title: 'Proposal', desc: 'Anyone posts an agent strategy. A decision, framed as on-chain code.' },
            { step: '02', title: 'Auction & PDA', desc: 'Minting deposits 90% capital directly into the token-bound PDA vault.' },
            { step: '03', title: 'Trading', desc: 'Pyth Oracle feeds and Jupiter routing compete for optimal execution.' },
            { step: '04', title: 'Resolution', desc: 'Anchor CPI verifies all trade telemetry. The mathematically stronger returns win.' }
          ].map((item, idx) => (
            <div
              key={item.step}
              style={{
                padding: '24px 0',
                borderTop: '2px solid rgba(255, 255, 255, 0.2)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '180px'
              }}
            >
              <div>
                <div style={{ fontSize: '11px', color: '#22c55e', fontWeight: 800, marginBottom: '8px' }}>
                  {item.step} // {item.title}
                </div>
                <div style={{ fontSize: '13px', lineHeight: 1.6, color: '#a1a1aa' }}>
                  {item.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION 04: PROTOCOL STACK / INTEGRATIONS (ref_frame_38.jpg)
          ========================================================================= */}
      <section
        id="evidence"
        style={{
          minHeight: '80vh',
          padding: '100px 48px',
          maxWidth: '1440px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 15,
          borderTop: '1px solid rgba(255, 255, 255, 0.08)'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <div style={{ fontSize: '11px', color: '#71717a', fontWeight: 800, letterSpacing: '0.1em', marginBottom: '8px' }}>
            BUILT WITH
          </div>
          <h2 style={{ fontSize: 'clamp(26px, 3.2vw, 42px)', fontWeight: 800, color: '#ffffff', margin: 0 }}>
            Production infrastructure on Solana.
          </h2>
        </div>

        {/* Integration Cards with ASCII Decoding Tapes & Indexing Bars (ref_frame_38.jpg) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          {[
            {
              name: 'Anchor Program',
              tag: 'CPI Engine',
              cipher: 'In -|*# > +/[-=-]|? \\0*<^-*"{> \\0\'7/|_!_0/= -|->* #\\> ?</*|?|0_]',
              bar: '████████████░░░░',
              status: '90% locked'
            },
            {
              name: 'Pyth Network',
              tag: 'Oracle Shield',
              cipher: 'Py <2>+~0*[<]-+>!>*- [*1**+{}{}/_{#<}*>{_<<?_?{[]o[/=>>1',
              bar: '████████████████',
              status: 'sub-second'
            },
            {
              name: 'Jupiter Aggregator',
              tag: 'DEX Routing',
              cipher: 'Ju !?_0=+[?{/ \\_!^0*...[*<]-+>!>*- [1**+{*#~}][*]',
              bar: '██████████████░░',
              status: '0.08% slip'
            },
            {
              name: 'Solana Mainnet',
              tag: 'Anchor CPI',
              cipher: 'So =-[*]{}?_<<?_?{[]o[/=>>1 \\0*<^-*"{> \\0\'7/|_!',
              bar: '████████████████',
              status: '400ms finality'
            }
          ].map((card) => (
            <div
              key={card.name}
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '2px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '190px'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '15px', fontWeight: 800, color: '#ffffff' }}>
                    {card.name}
                  </span>
                  <span style={{ fontSize: '10.5px', color: '#71717a' }}>
                    {card.tag}
                  </span>
                </div>

                {/* Cipher String */}
                <div style={{ fontSize: '10px', color: '#52525b', wordBreak: 'break-all', marginBottom: '16px', lineHeight: 1.5 }}>
                  <AsciiScrambleText text={card.cipher} speed={40} revealDelay={3} />
                </div>
              </div>

              {/* ASCII Indexing Bar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10px', color: '#71717a' }}>
                <span style={{ color: '#22c55e', letterSpacing: '0.05em' }}>{card.bar}</span>
                <span>{card.status}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION 05: DEVELOPER SETUP // MCP & TERMINAL
          ========================================================================= */}
      <section
        id="builders"
        style={{
          minHeight: '70vh',
          padding: '100px 48px',
          maxWidth: '1440px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 15,
          borderTop: '1px solid rgba(255, 255, 255, 0.08)'
        }}
      >
        <div style={{ marginBottom: '32px' }}>
          <div style={{ fontSize: '11px', color: '#71717a', fontWeight: 800, letterSpacing: '0.1em', marginBottom: '8px' }}>
            DEVELOPER ACCESS
          </div>
          <h2 style={{ fontSize: 'clamp(26px, 3.2vw, 42px)', fontWeight: 800, color: '#ffffff', margin: 0 }}>
            Connect via Model Context Protocol or REST.
          </h2>
        </div>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
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
                background: activeTab === tab.id ? '#ffffff' : 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: activeTab === tab.id ? '#000000' : '#71717a',
                fontSize: '11px',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div style={{ background: '#020302', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '2px', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 16px', background: 'rgba(255, 255, 255, 0.03)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', fontSize: '11px', color: '#a1a1aa' }}>
            <span>CONFIG // {activeTab.toUpperCase()}</span>
            <button
              type="button"
              onClick={copyConfig}
              style={{ background: 'transparent', border: 'none', color: '#ffffff', cursor: 'pointer', fontWeight: 800, fontSize: '11px' }}
            >
              {copiedKey ? 'COPIED ✓' : 'COPY'}
            </button>
          </div>

          <pre style={{ padding: '18px', margin: 0, fontSize: '12px', lineHeight: 1.6, color: '#cbd5e1', overflowX: 'auto' }}>
            <code>{terminalConfigs[activeTab]}</code>
          </pre>
        </div>
      </section>

      {/* =========================================================================
          MINIMALIST XIVO FOOTER (ref_frame_38.jpg)
          ========================================================================= */}
      <footer
        style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '40px 48px',
          maxWidth: '1440px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '24px',
          fontSize: '12px',
          color: '#71717a'
        }}
      >
        <div>
          <div style={{ fontWeight: 800, color: '#ffffff', marginBottom: '4px' }}>RARE</div>
          <div>Measured, not marketed.</div>
        </div>

        <div>
          <a
            href="https://github.com/mansoorxdev/rare"
            target="_blank"
            rel="noreferrer"
            style={{ color: '#71717a', textDecoration: 'none', marginRight: '20px' }}
          >
            Documentation
          </a>
          <Link href="/" style={{ color: '#71717a', textDecoration: 'none' }}>
            View Heurix UI ↗
          </Link>
        </div>

        <div>© 2026 RARE PROTOCOL</div>
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
            background: 'rgba(0, 0, 0, 0.9)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px'
          }}
        >
          <div
            style={{
              maxWidth: '420px',
              width: '100%',
              padding: '28px',
              background: '#0a0d0a',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '2px',
              textAlign: 'center'
            }}
          >
            <div style={{ width: '36px', height: '36px', border: '2px solid #ffffff', borderTopColor: 'transparent', borderRadius: '50%', margin: '0 auto 16px auto', animation: 'spin 0.8s linear infinite' }} />
            <div style={{ fontSize: '15px', fontWeight: 800, color: '#ffffff', marginBottom: '8px' }}>
              Anchor CPI Minting...
            </div>
            <div style={{ fontSize: '12px', color: '#a1a1aa', marginBottom: '18px' }}>
              {mintStatus}
            </div>

            <div style={{ background: '#040504', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '12px', textAlign: 'left', fontSize: '11px', color: '#71717a', lineHeight: 1.8 }}>
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
            background: 'rgba(0, 0, 0, 0.9)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px'
          }}
          onClick={() => setMintCelebration(null)}
        >
          <div
            style={{
              maxWidth: '440px',
              width: '100%',
              padding: '28px',
              background: '#0a0d0a',
              border: '1px solid #22c55e',
              borderRadius: '2px',
              textAlign: 'center'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>⚡</div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#22c55e', marginBottom: '8px' }}>
              Agent #{mintCelebration.id} Activated!
            </div>
            <p style={{ fontSize: '12.5px', color: '#cbd5e1', lineHeight: 1.6, marginBottom: '18px' }}>
              Successfully minted on Solana mainnet-beta. 0.0180 SOL deposited into token-bound PDA vault.
            </p>

            <div style={{ background: '#040504', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '10px', fontSize: '10.5px', color: '#86efac', marginBottom: '20px', wordBreak: 'break-all' }}>
              TX_SIG: {mintCelebration.txSignature}
            </div>

            <button
              type="button"
              onClick={() => setMintCelebration(null)}
              style={{
                width: '100%',
                background: '#ffffff',
                color: '#000000',
                border: 'none',
                borderRadius: '2px',
                padding: '10px',
                fontWeight: 800,
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              Close & View On-Chain →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
