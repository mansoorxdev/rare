'use client';

import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function WhitepaperPage() {
  return (
    <div className="min-h-screen bg-black text-cream selection:bg-cream selection:text-black font-sans antialiased">
      <Navbar />

      <main className="mx-auto max-w-[1280px] px-5 pt-28 pb-24 md:px-6">
        {/* Page Header */}
        <div className="mx-auto max-w-[840px] text-center mb-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-line bg-surface-1 px-3 py-1 font-mono text-[11px] text-dim mb-4">
            <span className="h-1.5 w-1.5 rounded-full bg-mint animate-pulse" />
            <span>OFFICIAL PROTOCOL SPECIFICATION // WHITE PAPER v1.0</span>
          </div>

          <h1 className="font-serif text-[40px] leading-[1.05] text-cream md:text-[56px] font-medium">
            RARE Protocol Whitepaper
          </h1>
          <p className="mt-4 text-[15px] leading-relaxed text-muted">
            Autonomous AI Agent Architecture on Solana: Token-Bound PDA Capitalization, Deterministic Bonding Curves, and Anchor Cross-Program Invocation (CPI) Routing.
          </p>

          <div className="mt-6 flex items-center justify-center gap-3">
            <a
              href="/RARE_Protocol_Whitepaper.pdf"
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-9 items-center justify-center rounded-full bg-cream px-5 text-[13px] font-medium text-black transition-colors hover:bg-cream/90 shadow-sm cursor-pointer"
            >
              Download PDF Version →
            </a>
          </div>
        </div>

        {/* Haute-Couture Editorial Article */}
        <article className="mx-auto max-w-[840px] rounded-xl border border-line bg-surface-1 p-8 md:p-12 shadow-2xl leading-relaxed text-muted">
          {/* Section 1 */}
          <section className="mb-12">
            <span className="font-mono text-[11px] text-mint uppercase tracking-wider block mb-2">
              01 // Executive Summary
            </span>
            <h2 className="font-serif text-[28px] text-cream font-medium mb-4">
              1. The Autonomous Agent Paradigm
            </h2>
            <p className="mb-4 text-[14.5px]">
              Contemporary AI agents operate as ephemeral software instances disconnected from real financial rails. Traditional crypto asset launches suffer from value extraction where mint capital is siphoned into team multi-sigs, leaving the collection illiquid and unbacked.
            </p>
            <p className="text-[14.5px]">
              <strong className="text-cream font-medium">RARE Protocol</strong> solves this fundamental bottleneck on the high-throughput Solana blockchain. Every RARE agent is an on-chain non-fungible token (NFT) inextricably bound to its own Program Derived Address (PDA) vault. When an agent is minted, <strong className="text-mint font-medium">90% of the mint capital</strong> is automatically locked into the agent's PDA vault via Solana Anchor CPI. The agent is born pre-funded, possessing its own capital to execute trades, pay compute fees, and participate in prediction markets.
            </p>
          </section>

          {/* Section 2 */}
          <section className="mb-12 border-t border-line pt-10">
            <span className="font-mono text-[11px] text-mint uppercase tracking-wider block mb-2">
              02 // Protocol Architecture
            </span>
            <h2 className="font-serif text-[28px] text-cream font-medium mb-4">
              2. Token-Bound Account (TBA) Mechanics
            </h2>
            <p className="mb-4 text-[14.5px]">
              Inspired by ERC-6551 but engineered natively for Solana's sub-second finality and low rent costs, RARE leverages Anchor PDAs derived from the agent's token mint address:
            </p>
            <pre className="overflow-x-auto rounded-lg border border-line bg-black/60 p-4 font-mono text-[12px] text-cream/90 leading-relaxed mb-4">
              <code>PDA_Vault = Pubkey::find_program_address([b"agent_vault", mint_pubkey, agent_id], program_id)</code>
            </pre>
            <p className="text-[14.5px]">
              This architectural choice ensures that the NFT mint account is the supreme signing authority over the vault. When an owner transfers or trades the NFT on secondary marketplaces (Tensor, Magic Eden), the ownership of the underlying PDA vault seamlessly shifts to the buyer without liquidating any collateral.
            </p>
          </section>

          {/* Section 3 */}
          <section className="mb-12 border-t border-line pt-10">
            <span className="font-mono text-[11px] text-mint uppercase tracking-wider block mb-2">
              03 // Bonding Curve Economics
            </span>
            <h2 className="font-serif text-[28px] text-cream font-medium mb-4">
              3. The 10-Tier Price Ladder
            </h2>
            <p className="mb-4 text-[14.5px]">
              The collection is strictly capped at <strong className="text-cream font-medium">10,078 Genesis Units</strong> distributed across 10 progressive pricing bands. The deterministic bonding curve rewards early network participants:
            </p>
            <div className="rounded-lg border border-line bg-surface-2 p-4 font-mono text-[12px] space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Band 1 (#00001 - #01008):</span>
                <span className="text-mint">0.020 SOL (90% PDA: 0.0180 SOL)</span>
              </div>
              <div className="flex justify-between">
                <span>Band 2 (#01009 - #02016):</span>
                <span className="text-cream">0.026 SOL (90% PDA: 0.0234 SOL)</span>
              </div>
              <div className="flex justify-between">
                <span>Band 3 (#02017 - #03024):</span>
                <span className="text-cream">0.034 SOL (90% PDA: 0.0306 SOL)</span>
              </div>
              <div className="flex justify-between">
                <span>Band 5 (#04033 - #05040):</span>
                <span className="text-cream">0.057 SOL (90% PDA: 0.0513 SOL)</span>
              </div>
              <div className="flex justify-between">
                <span>Band 10 (#09073 - #10078):</span>
                <span className="text-peach">0.212 SOL (90% PDA: 0.1908 SOL)</span>
              </div>
            </div>
            <p className="text-[14.5px]">
              At collection sellout, over <strong className="text-mint font-medium">650+ SOL</strong> will be held directly across agent PDA vaults on Solana Mainnet, establishing RARE as one of the most capitalized autonomous agent swarms in Web3.
            </p>
          </section>

          {/* Section 4 */}
          <section className="border-t border-line pt-10">
            <span className="font-mono text-[11px] text-mint uppercase tracking-wider block mb-2">
              04 // Anchor CPI Routing &amp; Safety Invariants
            </span>
            <h2 className="font-serif text-[28px] text-cream font-medium mb-4">
              4. Cryptographic Security &amp; Safety Guards
            </h2>
            <p className="mb-4 text-[14.5px]">
              All agent orders and rebalances occur through audited Cross-Program Invocations (CPI) against decentralized liquidity venues including Jupiter V6 and Raydium CLMM.
            </p>
            <p className="text-[14.5px]">
              Safety invariants enforced at the program level include hardcoded maximum slippage ceilings (50 BPS), automated Pyth entropy oracle validation, and emergency drawdown unwinds triggered if vault net asset value falls below programmed thresholds.
            </p>
          </section>
        </article>
      </main>

      <Footer />
    </div>
  );
}
