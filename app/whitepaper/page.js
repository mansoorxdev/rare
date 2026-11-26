'use client';

import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function WhitepaperPage() {
  return (
    <div className="gamma-page-container">
      <Navbar />

      <main style={{ maxWidth: '1360px', margin: '0 auto', padding: '108px 24px 64px 24px' }}>
        {/* Page Header */}
        <div className="gamma-page-header">
          <div className="gamma-badge" style={{ marginBottom: '12px' }}>
            <span className="gamma-badge-icon">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4 4h16v16H4V4zm2 2v12h12V6H6z" />
              </svg>
            </span>
            <span>OFFICIAL PROTOCOL SPECIFICATION · WHITE PAPER v1.0</span>
          </div>

          <h1 className="gamma-hero-title" style={{ fontSize: 'clamp(32px, 4vw, 52px)', marginBottom: '12px' }}>
            RARE Protocol Whitepaper
          </h1>
          <p className="gamma-hero-subtitle" style={{ maxWidth: '680px', margin: '0 auto' }}>
            Autonomous AI Agent Architecture on Solana: Token-Bound PDA Capitalization, Deterministic Bonding Curves, and Anchor Cross-Program Invocation (CPI) Routing.
          </p>

          <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <a
              href="/RARE_Protocol_Whitepaper.pdf"
              target="_blank"
              rel="noreferrer"
              className="gamma-btn-black"
              style={{ padding: '10px 24px', fontSize: '13.5px' }}
            >
              Download PDF Version →
            </a>
          </div>
        </div>

        {/* Gamma Editorial Article */}
        <article style={{
          maxWidth: '840px',
          margin: '0 auto 40px auto',
          background: 'rgba(4, 20, 8, 0.88)',
          borderRadius: '4px',
          border: '1px solid rgba(34, 197, 94, 0.35)',
          padding: '40px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
          lineHeight: 1.7,
          color: '#cbd5e1'
        }}>
          {/* Section 1 */}
          <section style={{ marginBottom: '36px' }}>
            <span style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '11px', color: '#4ade80', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
              01 // Executive Summary
            </span>
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#ffffff', margin: '0 0 14px 0' }}>
              1. The Autonomous Agent Paradigm
            </h2>
            <p style={{ fontSize: '14.5px', marginBottom: '14px' }}>
              Contemporary AI agents operate as ephemeral software instances disconnected from real financial rails. Traditional crypto asset launches suffer from value extraction where mint capital is siphoned into team multi-sigs, leaving the collection illiquid and unbacked.
            </p>
            <p style={{ fontSize: '14.5px' }}>
              <strong style={{ color: '#ffffff', fontWeight: 700 }}>RARE Protocol</strong> solves this fundamental bottleneck on the high-throughput Solana blockchain. Every RARE agent is an on-chain non-fungible token (NFT) inextricably bound to its own Program Derived Address (PDA) vault. When an agent is minted, <strong style={{ color: '#34d399', fontWeight: 700 }}>90% of the mint capital</strong> is automatically locked into the agent's PDA vault via Solana Anchor CPI. The agent is born pre-funded, possessing its own capital to execute trades, pay compute fees, and participate in prediction markets.
            </p>
          </section>

          {/* Section 2 */}
          <section style={{ marginBottom: '36px', borderTop: '1px solid rgba(34, 197, 94, 0.35)', paddingTop: '32px' }}>
            <span style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '11px', color: '#4ade80', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
              02 // Protocol Architecture
            </span>
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#ffffff', margin: '0 0 14px 0' }}>
              2. Token-Bound Account (TBA) Mechanics
            </h2>
            <p style={{ fontSize: '14.5px', marginBottom: '14px' }}>
              Inspired by ERC-6551 but engineered natively for Solana's sub-second finality and low rent costs, RARE leverages Anchor PDAs derived from the agent's token mint address:
            </p>
            <pre style={{ overflowX: 'auto', borderRadius: '3px', border: '1px solid rgba(34, 197, 94, 0.35)', background: 'rgba(3, 16, 7, 0.95)', padding: '14px', fontFamily: 'var(--font-jetbrains), monospace', fontSize: '12px', color: '#ffffff', lineHeight: 1.6, marginBottom: '14px' }}>
              <code>PDA_Vault = Pubkey::find_program_address([b"agent_vault", mint_pubkey, agent_id], program_id)</code>
            </pre>
            <p style={{ fontSize: '14.5px' }}>
              This architectural choice ensures that the NFT mint account is the supreme signing authority over the vault. When an owner transfers or trades the NFT on secondary marketplaces (Tensor, Magic Eden), the ownership of the underlying PDA vault seamlessly shifts to the buyer without liquidating any collateral.
            </p>
          </section>

          {/* Section 3 */}
          <section style={{ marginBottom: '36px', borderTop: '1px solid rgba(34, 197, 94, 0.35)', paddingTop: '32px' }}>
            <span style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '11px', color: '#4ade80', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
              03 // Bonding Curve Economics
            </span>
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#ffffff', margin: '0 0 14px 0' }}>
              3. The 10-Tier Price Ladder
            </h2>
            <p style={{ fontSize: '14.5px', marginBottom: '14px' }}>
              The collection is strictly capped at <strong style={{ color: '#ffffff', fontWeight: 700 }}>10,078 Genesis Units</strong> distributed across 10 progressive pricing bands. The deterministic bonding curve rewards early network participants:
            </p>
            <div style={{ background: 'rgba(3, 16, 7, 0.95)', borderRadius: '14px', border: '1px solid rgba(34, 197, 94, 0.35)', padding: '16px', fontFamily: 'var(--font-jetbrains), monospace', fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Band 1 (#00001 - #01008):</span>
                <span style={{ color: '#34d399', fontWeight: 700 }}>0.020 SOL (90% PDA: 0.0180 SOL)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Band 2 (#01009 - #02016):</span>
                <span style={{ color: '#ffffff', fontWeight: 700 }}>0.026 SOL (90% PDA: 0.0234 SOL)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Band 3 (#02017 - #03024):</span>
                <span style={{ color: '#ffffff', fontWeight: 700 }}>0.034 SOL (90% PDA: 0.0306 SOL)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Band 5 (#04033 - #05040):</span>
                <span style={{ color: '#ffffff', fontWeight: 700 }}>0.057 SOL (90% PDA: 0.0513 SOL)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Band 10 (#09073 - #10078):</span>
                <span style={{ color: '#4ade80', fontWeight: 700 }}>0.212 SOL (90% PDA: 0.1908 SOL)</span>
              </div>
            </div>
            <p style={{ fontSize: '14.5px' }}>
              At collection sellout, over <strong style={{ color: '#34d399', fontWeight: 700 }}>650+ SOL</strong> will be held directly across agent PDA vaults on Solana Mainnet, establishing RARE as one of the most capitalized autonomous agent swarms in Web3.
            </p>
          </section>

          {/* Section 4 */}
          <section style={{ borderTop: '1px solid rgba(34, 197, 94, 0.35)', paddingTop: '32px' }}>
            <span style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '11px', color: '#4ade80', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
              04 // Anchor CPI Routing &amp; Safety Invariants
            </span>
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#ffffff', margin: '0 0 14px 0' }}>
              4. Cryptographic Security &amp; Safety Guards
            </h2>
            <p style={{ fontSize: '14.5px', marginBottom: '14px' }}>
              All agent orders and rebalances occur through audited Cross-Program Invocations (CPI) against decentralized liquidity venues including Jupiter V6 and Raydium CLMM.
            </p>
            <p style={{ fontSize: '14.5px', margin: 0 }}>
              Safety invariants enforced at the program level include hardcoded maximum slippage ceilings (50 BPS), automated Pyth entropy oracle validation, and emergency drawdown unwinds triggered if vault net asset value falls below programmed thresholds.
            </p>
          </section>
        </article>
      </main>

      <Footer />
    </div>
  );
}
