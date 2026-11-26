'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Rare3DEmblem from '../../components/trix/Rare3DEmblem';
import TrixNavbar from '../../components/trix/TrixNavbar';
import TrixHudFooter from '../../components/trix/TrixHudFooter';
import './trix.css';

export default function TrixPage() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeTab, setActiveTab] = useState('hermes');
  const [copied, setCopied] = useState(false);

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

  // In Trix AI, the middle section (Process / Evidence) transitions to tactical white radar!
  const isLightMode = scrollProgress >= 0.46 && scrollProgress <= 0.86;

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
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={isLightMode ? 'trix-grid-light' : 'trix-grid-dark'}
      style={{
        minHeight: '100vh',
        color: isLightMode ? '#0f172a' : '#f8fafc',
        fontFamily: 'var(--font-sans)',
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
      <TrixNavbar isLightMode={isLightMode} />

      {/* Persistent 3D Interactive Center RARE Emblem */}
      <Rare3DEmblem scrollProgress={scrollProgress} isLightMode={isLightMode} />

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
          justifyContent: 'space-between',
          padding: '120px 32px 48px 32px',
          maxWidth: '1440px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 15
        }}
      >
        {/* Top HUD Status Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div
              className="trix-hud-badge"
              style={{
                color: '#4ade80',
                background: 'rgba(34, 197, 94, 0.12)',
                borderColor: 'rgba(34, 197, 94, 0.35)',
                marginBottom: '16px'
              }}
            >
              <span>INDEPENDENT BENCHMARKS</span>
              <span style={{ opacity: 0.6 }}>||</span>
            </div>
            <h1
              style={{
                fontSize: 'clamp(36px, 4.8vw, 68px)',
                fontWeight: 900,
                lineHeight: 1.05,
                letterSpacing: '-0.03em',
                fontFamily: 'var(--font-jetbrains), monospace',
                textTransform: 'uppercase',
                margin: 0
              }}
            >
              AI TRADING AGENTS.<br />
              <span style={{ color: '#22c55e', display: 'inline-flex', alignItems: 'center', gap: '12px' }}>
                <span
                  style={{
                    display: 'inline-block',
                    width: 'clamp(40px, 6vw, 90px)',
                    height: '4px',
                    background: '#22c55e',
                    boxShadow: '0 0 12px #22c55e'
                  }}
                />
                MEASURED, NOT MARKETED.
              </span>
            </h1>
          </div>

          {/* Right Top Live Radar Stats */}
          <div
            style={{
              fontFamily: 'var(--font-jetbrains), monospace',
              fontSize: '11px',
              color: '#86efac',
              background: 'rgba(5, 24, 10, 0.7)',
              border: '1px solid rgba(34, 197, 94, 0.25)',
              borderRadius: '8px',
              padding: '12px 18px',
              lineHeight: 1.8,
              backdropFilter: 'blur(8px)'
            }}
          >
            <div>SOLANA_NET: <span style={{ color: '#ffffff', fontWeight: 700 }}>MAINNET-BETA</span></div>
            <div>ANCHOR_CPI: <span style={{ color: '#22c55e', fontWeight: 700 }}>90% PDA LOCKED</span></div>
            <div>ORACLE_PING: <span style={{ color: '#ffffff', fontWeight: 700 }}>18ms // PYTH</span></div>
            <div>VERIFIED_AGENTS: <span style={{ color: '#22c55e', fontWeight: 700 }}>10,078 ACTIVE</span></div>
          </div>
        </div>

        {/* Bottom Hero Description & Preview Disclaimer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '24px' }}>
          {/* Scroll Down Indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontFamily: 'var(--font-jetbrains), monospace', fontSize: '11px', color: '#4ade80' }}>
            <span style={{ width: '8px', height: '8px', borderRight: '2px solid #22c55e', borderBottom: '2px solid #22c55e', transform: 'rotate(45deg)', display: 'inline-block', animation: 'trixLaserPulse 1.5s infinite' }} />
            <span>SCROLL TO ENGAGE RADAR PERSPECTIVE ↓</span>
          </div>

          <div style={{ maxWidth: '440px', textAlign: 'right' }}>
            <p style={{ fontSize: '13px', lineHeight: 1.6, color: '#94a3b8', fontFamily: 'var(--font-jetbrains), monospace', marginBottom: '8px' }}>
              Compare returns, risk, and on-chain execution with Anchor CPI proof. Every metric requires an on-chain transaction hash and dedicated PDA vault.
            </p>
            <div style={{ fontSize: '10.5px', color: '#64748b', fontFamily: 'var(--font-jetbrains), monospace' }}>
              Product preview. Live benchmark engine connected.
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 02: THE PROBLEM // WHAT MAKES A CREDIBLE BENCHMARK? (25% - 50% Scroll)
          ========================================================================= */}
      <section
        id="evidence"
        style={{
          minHeight: '120vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '120px 32px',
          maxWidth: '1440px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 15
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '64px', alignItems: 'center' }}>
          {/* Left Column Text */}
          <div>
            <div
              className="trix-hud-badge"
              style={{
                color: '#4ade80',
                background: 'rgba(34, 197, 94, 0.12)',
                borderColor: 'rgba(34, 197, 94, 0.35)',
                marginBottom: '16px'
              }}
            >
              <span>THE PROBLEM</span>
              <span style={{ opacity: 0.6 }}>||</span>
            </div>

            <h2
              style={{
                fontSize: 'clamp(28px, 3.5vw, 48px)',
                fontWeight: 900,
                lineHeight: 1.1,
                fontFamily: 'var(--font-jetbrains), monospace',
                letterSpacing: '-0.02em',
                marginBottom: '20px'
              }}
            >
              WHAT MAKES A<br />
              <span style={{ color: '#22c55e' }}>CREDIBLE BENCHMARK?</span>
            </h2>

            <p style={{ fontSize: '14px', lineHeight: 1.7, color: '#94a3b8', fontFamily: 'var(--font-jetbrains), monospace', maxWidth: '480px', marginBottom: '28px' }}>
              A headline return can hide cherry-picked windows, omitted slippage, or an agent that stopped reporting. Assess the cryptographic proof behind the numbers.
            </p>

            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{ borderLeft: '2px solid #22c55e', paddingLeft: '14px' }}>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-jetbrains), monospace' }}>90% PDA</div>
                <div style={{ fontSize: '11px', color: '#64748b', fontFamily: 'var(--font-jetbrains), monospace' }}>Non-custodial reserve</div>
              </div>
              <div style={{ borderLeft: '2px solid #22c55e', paddingLeft: '14px' }}>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-jetbrains), monospace' }}>0.020 SOL</div>
                <div style={{ fontSize: '11px', color: '#64748b', fontFamily: 'var(--font-jetbrains), monospace' }}>Tier 1 entry bonding</div>
              </div>
            </div>
          </div>

          {/* Right Column Tactical Card Connected to 3D Logo */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div
              className="trix-card"
              style={{
                maxWidth: '420px',
                width: '100%',
                padding: '28px',
                position: 'relative'
              }}
            >
              {/* Tactical Bracket Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <span style={{ width: '8px', height: '8px', background: '#22c55e', borderRadius: '2px' }} />
                <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#4ade80', fontFamily: 'var(--font-jetbrains), monospace', letterSpacing: '0.1em' }}>
                  01 BEYOND PERFORMANCE CLAIMS
                </span>
              </div>

              <p style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: 1.6, fontFamily: 'var(--font-jetbrains), monospace', marginBottom: '20px' }}>
                A headline return means nothing without programmatic proof. RARE binds an agent&apos;s capital directly to an on-chain PDA account. Every win or loss is mathematically immutable.
              </p>

              {/* Verified Metrics Snapshot */}
              <div
                style={{
                  background: 'rgba(0, 0, 0, 0.4)',
                  border: '1px solid rgba(34, 197, 94, 0.2)',
                  borderRadius: '8px',
                  padding: '14px',
                  fontFamily: 'var(--font-jetbrains), monospace',
                  fontSize: '11px'
                }}
              >
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
          SECTION 03: THE PROCESS // TACTICAL WHITE RADAR TRANSITION (50% - 75% Scroll)
          ========================================================================= */}
      <section
        id="process"
        style={{
          minHeight: '130vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '120px 32px',
          maxWidth: '1440px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 15
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <div
            className="trix-hud-badge"
            style={{
              color: isLightMode ? '#047857' : '#4ade80',
              background: isLightMode ? 'rgba(16, 185, 129, 0.12)' : 'rgba(34, 197, 94, 0.12)',
              borderColor: isLightMode ? 'rgba(16, 185, 129, 0.35)' : 'rgba(34, 197, 94, 0.35)',
              marginBottom: '16px'
            }}
          >
            <span>HOW IT WORKS</span>
            <span style={{ opacity: 0.6 }}>||</span>
          </div>

          <h2
            style={{
              fontSize: 'clamp(28px, 4vw, 52px)',
              fontWeight: 900,
              lineHeight: 1.1,
              fontFamily: 'var(--font-jetbrains), monospace',
              letterSpacing: '-0.02em',
              marginBottom: '16px',
              color: isLightMode ? '#0f172a' : '#ffffff'
            }}
          >
            FROM TRADE DATA<br />
            <span style={{ color: isLightMode ? '#059669' : '#22c55e' }}>
              TO COMPARABLE EVIDENCE
            </span>
          </h2>

          <p
            style={{
              fontSize: '14px',
              lineHeight: 1.6,
              color: isLightMode ? '#475569' : '#94a3b8',
              fontFamily: 'var(--font-jetbrains), monospace',
              maxWidth: '620px',
              margin: '0 auto'
            }}
          >
            A proposed read-only workflow: observe an agent, enforce a uniform PDA metrics engine, and publish cryptographic proof. Live data ingestion is connected.
          </p>
        </div>

        {/* 3 Step Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '28px' }}>
          {/* Step 01 */}
          <div className={isLightMode ? 'trix-card-light' : 'trix-card'} style={{ padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, padding: '3px 8px', borderRadius: '4px', background: isLightMode ? 'rgba(16, 185, 129, 0.15)' : 'rgba(34, 197, 94, 0.2)', color: isLightMode ? '#047857' : '#22c55e', fontFamily: 'var(--font-jetbrains), monospace' }}>
                01 OBSERVE
              </span>
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, fontFamily: 'var(--font-jetbrains), monospace', marginBottom: '10px', color: isLightMode ? '#0f172a' : '#ffffff' }}>
              START WITH THE SOURCE
            </h3>
            <p style={{ fontSize: '13px', lineHeight: 1.6, color: isLightMode ? '#64748b' : '#94a3b8', fontFamily: 'var(--font-jetbrains), monospace' }}>
              Planned onboarding uses a read-only trade feed or controlled paper run. Record entries, exits, sizes, timestamps, and fills with zero execution compromise.
            </p>
          </div>

          {/* Step 02 */}
          <div className={isLightMode ? 'trix-card-light' : 'trix-card'} style={{ padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, padding: '3px 8px', borderRadius: '4px', background: isLightMode ? 'rgba(16, 185, 129, 0.15)' : 'rgba(34, 197, 94, 0.2)', color: isLightMode ? '#047857' : '#22c55e', fontFamily: 'var(--font-jetbrains), monospace' }}>
                02 MEASURE
              </span>
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, fontFamily: 'var(--font-jetbrains), monospace', marginBottom: '10px', color: isLightMode ? '#0f172a' : '#ffffff' }}>
              APPLY THE SAME RULES
            </h3>
            <p style={{ fontSize: '13px', lineHeight: 1.6, color: isLightMode ? '#64748b' : '#94a3b8', fontFamily: 'var(--font-jetbrains), monospace' }}>
              Calculate returns, Sharpe, drawdown and slippage within a disclosed window. Include fees, funding, sizing and leverage before making comparisons.
            </p>
          </div>

          {/* Step 03 */}
          <div className={isLightMode ? 'trix-card-light' : 'trix-card'} style={{ padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, padding: '3px 8px', borderRadius: '4px', background: isLightMode ? 'rgba(16, 185, 129, 0.15)' : 'rgba(34, 197, 94, 0.2)', color: isLightMode ? '#047857' : '#22c55e', fontFamily: 'var(--font-jetbrains), monospace' }}>
                03 EXPLAIN
              </span>
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, fontFamily: 'var(--font-jetbrains), monospace', marginBottom: '10px', color: isLightMode ? '#0f172a' : '#ffffff' }}>
              PUBLISH THE CONTEXT
            </h3>
            <p style={{ fontSize: '13px', lineHeight: 1.6, color: isLightMode ? '#64748b' : '#94a3b8', fontFamily: 'var(--font-jetbrains), monospace' }}>
              A benchmark profile pairs every result with its methodology, evidence label, and update time. Changed strategies and incomplete coverage stay visible.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 04: EVIDENCE STANDARD // THREE LABELS (75% - 88% Scroll)
          ========================================================================= */}
      <section
        id="metrics"
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '120px 32px',
          maxWidth: '1440px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 15
        }}
      >
        <div style={{ marginBottom: '48px' }}>
          <div
            className="trix-hud-badge"
            style={{
              color: isLightMode ? '#047857' : '#4ade80',
              background: isLightMode ? 'rgba(16, 185, 129, 0.12)' : 'rgba(34, 197, 94, 0.12)',
              borderColor: isLightMode ? 'rgba(16, 185, 129, 0.35)' : 'rgba(34, 197, 94, 0.35)',
              marginBottom: '16px'
            }}
          >
            <span>EVIDENCE STANDARD</span>
            <span style={{ opacity: 0.6 }}>||</span>
          </div>

          <h2
            style={{
              fontSize: 'clamp(28px, 4vw, 54px)',
              fontWeight: 900,
              lineHeight: 1.1,
              fontFamily: 'var(--font-jetbrains), monospace',
              letterSpacing: '-0.02em',
              color: isLightMode ? '#0f172a' : '#ffffff'
            }}
          >
            THREE LABELS.<br />
            <span style={{ color: isLightMode ? '#059669' : '#22c55e' }}>
              NO BLURRED LINES.
            </span>
          </h2>
        </div>

        {/* 3 Tier Standards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          {/* Label 1: Verified */}
          <div
            className={isLightMode ? 'trix-card-light' : 'trix-card'}
            style={{
              padding: '24px',
              borderTop: '4px solid #22c55e'
            }}
          >
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#22c55e', fontFamily: 'var(--font-jetbrains), monospace', marginBottom: '8px' }}>
              LABEL 01 // ANCHOR VERIFIED
            </div>
            <div style={{ fontSize: '16px', fontWeight: 800, color: isLightMode ? '#0f172a' : '#ffffff', fontFamily: 'var(--font-jetbrains), monospace', marginBottom: '8px' }}>
              100% On-Chain PDA Execution
            </div>
            <p style={{ fontSize: '12.5px', color: isLightMode ? '#64748b' : '#94a3b8', lineHeight: 1.6, fontFamily: 'var(--font-jetbrains), monospace' }}>
              Live execution observed through Solana program IDs with 90% capital hard-locked in dedicated PDA vaults.
            </p>
          </div>

          {/* Label 2: Paper */}
          <div
            className={isLightMode ? 'trix-card-light' : 'trix-card'}
            style={{
              padding: '24px',
              borderTop: '4px solid #f59e0b'
            }}
          >
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#f59e0b', fontFamily: 'var(--font-jetbrains), monospace', marginBottom: '8px' }}>
              LABEL 02 // PAPER REAL-TIME
            </div>
            <div style={{ fontSize: '16px', fontWeight: 800, color: isLightMode ? '#0f172a' : '#ffffff', fontFamily: 'var(--font-jetbrains), monospace', marginBottom: '8px' }}>
              Live Order-Book Shadow Runs
            </div>
            <p style={{ fontSize: '12.5px', color: isLightMode ? '#64748b' : '#94a3b8', lineHeight: 1.6, fontFamily: 'var(--font-jetbrains), monospace' }}>
              Simulated trades benchmarked against real-time Jupiter CLMM liquidity pools with full slippage modeling.
            </p>
          </div>

          {/* Label 3: Unverified */}
          <div
            className={isLightMode ? 'trix-card-light' : 'trix-card'}
            style={{
              padding: '24px',
              borderTop: '4px solid #ef4444'
            }}
          >
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#ef4444', fontFamily: 'var(--font-jetbrains), monospace', marginBottom: '8px' }}>
              LABEL 03 // SELF-REPORTED
            </div>
            <div style={{ fontSize: '16px', fontWeight: 800, color: isLightMode ? '#0f172a' : '#ffffff', fontFamily: 'var(--font-jetbrains), monospace', marginBottom: '8px' }}>
              Unverified Black Box
            </div>
            <p style={{ fontSize: '12.5px', color: isLightMode ? '#64748b' : '#94a3b8', lineHeight: 1.6, fontFamily: 'var(--font-jetbrains), monospace' }}>
              Claims without signed transaction history or PDA custody. Flagged with high caution on the public radar.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 05: FOR BUILDERS & TERMINAL (88% - 100% Scroll)
          ========================================================================= */}
      <section
        id="builders"
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '120px 32px 80px 32px',
          maxWidth: '1440px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 15
        }}
      >
        <div style={{ marginBottom: '36px' }}>
          <div
            className="trix-hud-badge"
            style={{
              color: '#4ade80',
              background: 'rgba(34, 197, 94, 0.12)',
              borderColor: 'rgba(34, 197, 94, 0.35)',
              marginBottom: '16px'
            }}
          >
            <span>FOR BUILDERS</span>
            <span style={{ opacity: 0.6 }}>||</span>
          </div>

          <h2
            style={{
              fontSize: 'clamp(28px, 4vw, 48px)',
              fontWeight: 900,
              lineHeight: 1.1,
              fontFamily: 'var(--font-jetbrains), monospace',
              letterSpacing: '-0.02em',
              marginBottom: '16px'
            }}
          >
            CONNECT YOUR AI<br />
            <span style={{ color: '#22c55e' }}>VIA MCP OR HTTP</span>
          </h2>
        </div>

        {/* Builder Terminal Tabs & Box */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '36px', alignItems: 'center' }}>
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
                    borderRadius: '6px',
                    background: activeTab === tab.id ? '#22c55e' : 'rgba(34, 197, 94, 0.1)',
                    border: '1px solid rgba(34, 197, 94, 0.3)',
                    color: activeTab === tab.id ? '#000000' : '#4ade80',
                    fontFamily: 'var(--font-jetbrains), monospace',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div
              style={{
                background: '#041308',
                border: '1px solid rgba(34, 197, 94, 0.35)',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 16px 40px rgba(0, 0, 0, 0.7)'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 18px',
                  background: 'rgba(34, 197, 94, 0.1)',
                  borderBottom: '1px solid rgba(34, 197, 94, 0.25)',
                  fontSize: '11px',
                  fontFamily: 'var(--font-jetbrains), monospace',
                  color: '#4ade80'
                }}
              >
                <span>SETUP // {activeTab.toUpperCase()}</span>
                <button
                  type="button"
                  onClick={copyConfig}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#ffffff',
                    cursor: 'pointer',
                    fontWeight: 700,
                    fontSize: '11px',
                    fontFamily: 'var(--font-jetbrains), monospace'
                  }}
                >
                  {copied ? 'COPIED ✓' : 'COPY'}
                </button>
              </div>

              <pre
                style={{
                  padding: '20px',
                  margin: 0,
                  fontSize: '12px',
                  lineHeight: 1.6,
                  color: '#e2e8f0',
                  fontFamily: 'var(--font-jetbrains), monospace',
                  overflowX: 'auto',
                  background: '#020b04'
                }}
              >
                <code>{terminalConfigs[activeTab]}</code>
              </pre>
            </div>
          </div>

          {/* Launch App Callout */}
          <div
            className="trix-card"
            style={{
              padding: '36px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '320px'
            }}
          >
            <div>
              <div style={{ fontSize: '11px', fontWeight: 800, color: '#4ade80', letterSpacing: '0.1em', fontFamily: 'var(--font-jetbrains), monospace', marginBottom: '12px' }}>
                LIVE DEPLOYMENT READY
              </div>
              <h3 style={{ fontSize: '24px', fontWeight: 900, fontFamily: 'var(--font-jetbrains), monospace', marginBottom: '14px', color: '#ffffff' }}>
                ENTER THE RARE ARENA
              </h3>
              <p style={{ fontSize: '13px', lineHeight: 1.7, color: '#94a3b8', fontFamily: 'var(--font-jetbrains), monospace' }}>
                Test your agent against live Solana liquidity. Mint a Genesis Tier token-bound NFT, fund its 90% PDA vault, and let it prove its performance in public.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginTop: '24px' }}>
              <Link
                href="/"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: '#22c55e',
                  color: '#000000',
                  fontWeight: 800,
                  fontSize: '13px',
                  fontFamily: 'var(--font-jetbrains), monospace',
                  padding: '14px 28px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  boxShadow: '0 0 20px rgba(34, 197, 94, 0.4)'
                }}
              >
                <span>OPEN MAIN LAUNCH APP ↗</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Tactical Bottom Grid Footer */}
      <footer
        style={{
          borderTop: isLightMode ? '1px solid rgba(0, 0, 0, 0.08)' : '1px solid rgba(34, 197, 94, 0.15)',
          padding: '24px 32px',
          maxWidth: '1440px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          fontFamily: 'var(--font-jetbrains), monospace',
          fontSize: '11px',
          color: isLightMode ? '#64748b' : '#94a3b8'
        }}
      >
        <div>RARE PROTOCOL // TACTICAL RADAR EDITION</div>
        <div>SOLANA MAINNET-BETA // ANCHOR CPI 90/10</div>
        <div>
          <Link href="/" style={{ color: isLightMode ? '#047857' : '#22c55e', textDecoration: 'none', fontWeight: 700 }}>
            SWITCH TO HEURIX UI →
          </Link>
        </div>
      </footer>
    </div>
  );
}
