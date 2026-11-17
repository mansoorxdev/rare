'use client';

import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function WhitepaperPage() {
  return (
    <>
      <Navbar />

      <main className="wrap" style={{ paddingTop: '28px', paddingBottom: '60px' }}>
        {/* Header */}
        <div style={{ marginBottom: '36px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div className="ca-pill" style={{ marginBottom: '12px' }}>
              <span className="pulse" />
              <span>OFFICIAL PROTOCOL SPECIFICATION // WHITE PAPER v1.0</span>
            </div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '-0.02em', marginBottom: '8px' }}>
              RARE Protocol Whitepaper
            </h1>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--dim)', maxWidth: '780px' }}>
              Autonomous AI Agent Architecture on Solana: Token-Bound PDA Capitalization, Deterministic Bonding Curves, and Anchor Cross-Program Invocation (CPI) Routing.
            </p>
          </div>

          <a
            href="/RARE_Protocol_Whitepaper.pdf"
            target="_blank"
            rel="noreferrer"
            className="btn-primary"
            style={{ padding: '12px 24px', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'var(--script-green)' }}
          >
            Download PDF Version ↗
          </a>
        </div>

        {/* Document Container */}
        <div style={{ background: '#ffffff', border: '2px solid var(--hair-dark)', boxShadow: '6px 6px 0px 0px var(--script-green)', padding: 'clamp(24px, 4vw, 48px)', maxWidth: '980px', margin: '0 auto', fontFamily: 'var(--font-sans)', color: 'var(--ink)', lineHeight: 1.7 }}>
          {/* Section 1 */}
          <section style={{ marginBottom: '40px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--script-green-dark)', fontWeight: 700, textTransform: 'uppercase' }}>
              01 // EXECUTIVE SUMMARY
            </span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 700, textTransform: 'uppercase', margin: '8px 0 16px' }}>
              1. The Autonomous Agent Paradigm
            </h2>
            <p style={{ marginBottom: '14px' }}>
              Contemporary AI agents operate as ephemeral software instances disconnected from real financial rails. Traditional crypto asset launches suffer from value extraction where mint capital is siphoned into team multi-sigs, leaving the collection illiquid and unbacked.
            </p>
            <p>
              <b>RARE Protocol</b> solves this fundamental bottleneck on the high-throughput Solana blockchain. Every RARE agent is an on-chain non-fungible token (NFT) inextricably bound to its own Program Derived Address (PDA) vault. When an agent is minted, <b>90% of the mint capital</b> is automatically locked into the agent&apos;s PDA vault via Solana Anchor CPI. The agent is born pre-funded, possessing its own capital to execute trades, pay compute fees, and participate in prediction markets.
            </p>
          </section>

          {/* Section 2 */}
          <section style={{ marginBottom: '40px', borderTop: '1px solid var(--hair)', paddingTop: '32px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--script-green-dark)', fontWeight: 700, textTransform: 'uppercase' }}>
              02 // PROTOCOL ARCHITECTURE
            </span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 700, textTransform: 'uppercase', margin: '8px 0 16px' }}>
              2. Token-Bound Account (TBA) Mechanics
            </h2>
            <p style={{ marginBottom: '14px' }}>
              Inspired by ERC-6551 but engineered natively for Solana&apos;s sub-second finality and low rent costs, RARE leverages Anchor PDAs derived from the agent&apos;s token mint address:
            </p>
            <div style={{ background: '#09090b', color: 'var(--script-green)', fontFamily: 'var(--font-mono)', fontSize: '12px', padding: '16px', border: '1px solid #27272a', marginBottom: '16px' }}>
              PDA_Vault = Pubkey::find_program_address([b&quot;agent_vault&quot;, mint_pubkey, agent_id], program_id)
            </div>
            <p>
              This architectural choice ensures that the NFT mint account is the supreme signing authority over the vault. When an owner transfers or trades the NFT on secondary marketplaces (Tensor, Magic Eden), the ownership of the underlying PDA vault seamlessly shifts to the buyer without liquidating any collateral.
            </p>
          </section>

          {/* Section 3 */}
          <section style={{ marginBottom: '40px', borderTop: '1px solid var(--hair)', paddingTop: '32px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--script-green-dark)', fontWeight: 700, textTransform: 'uppercase' }}>
              03 // BONDING CURVE ECONOMICS
            </span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 700, textTransform: 'uppercase', margin: '8px 0 16px' }}>
              3. The 10-Tier Price Ladder
            </h2>
            <p style={{ marginBottom: '14px' }}>
              The collection is strictly capped at <b>10,078 Genesis Units</b> distributed across 10 progressive pricing bands. The deterministic bonding curve rewards early network participants:
            </p>
            <ul style={{ paddingLeft: '24px', fontFamily: 'var(--font-mono)', fontSize: '12px', marginBottom: '16px', lineHeight: 1.9 }}>
              <li><b>Band 1 (#00001 - #01008):</b> 0.020 SOL (90% PDA: 0.0180 SOL)</li>
              <li><b>Band 2 (#01009 - #02016):</b> 0.026 SOL (90% PDA: 0.0234 SOL)</li>
              <li><b>Band 3 (#02017 - #03024):</b> 0.034 SOL (90% PDA: 0.0306 SOL)</li>
              <li><b>Band 5 (#04033 - #05040):</b> 0.057 SOL (90% PDA: 0.0513 SOL)</li>
              <li><b>Band 10 (#09073 - #10078):</b> 0.212 SOL (90% PDA: 0.1908 SOL)</li>
            </ul>
            <p>
              At collection sellout, over <b>650+ SOL</b> will be held directly across agent PDA vaults on Solana Mainnet, establishing RARE as one of the most capitalized autonomous agent swarms in Web3.
            </p>
          </section>

          {/* Section 4 */}
          <section style={{ borderTop: '1px solid var(--hair)', paddingTop: '32px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--script-green-dark)', fontWeight: 700, textTransform: 'uppercase' }}>
              04 // SECURITY &amp; VERIFICATION
            </span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 700, textTransform: 'uppercase', margin: '8px 0 16px' }}>
              4. Security Invariants &amp; Audit
            </h2>
            <p style={{ marginBottom: '14px' }}>
              The RARE Anchor program implements strict access-control checks:
            </p>
            <div style={{ background: '#fff', border: '1px solid var(--hair)', padding: '16px', fontFamily: 'var(--font-mono)', fontSize: '12px', marginBottom: '20px' }}>
              • <b>Zero Team Backdoors:</b> Mint capital is routed in the exact same CPI instruction.<br />
              • <b>Supply Ceiling:</b> Program rejects any mint request exceeding ID 10,078.<br />
              • <b>No Flash-Loan Drainage:</b> PDA funds require signed multi-oracle validation for off-chain execution calls.<br />
              • <b>Treasury Address:</b> <code>3ivjUQCmaykSnGeCkuy8yViw82umrfDCmXkxtWSeqyEk</code>
            </div>
            <div style={{ textAlign: 'center', marginTop: '32px' }}>
              <a
                href="/roster"
                className="btn-primary"
                style={{ padding: '10px 22px', fontSize: '12px', background: 'var(--script-green)', textTransform: 'uppercase' }}
              >
                Explore 10,078 Agent Roster →
              </a>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
