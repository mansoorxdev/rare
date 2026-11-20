'use client';

import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function SpecsPage() {
  const treasury = '3ivjUQCmaykSnGeCkuy8yViw82umrfDCmXkxtWSeqyEk';

  return (
    <div className="min-h-screen bg-black text-cream selection:bg-cream selection:text-black font-sans antialiased">
      <Navbar />

      <main className="mx-auto max-w-[1280px] px-5 pt-28 pb-24 md:px-6">
        {/* Page Header */}
        <div className="mx-auto max-w-[800px] text-center mb-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-line bg-surface-1 px-3 py-1 font-mono text-[11px] text-dim mb-4">
            <span className="h-1.5 w-1.5 rounded-full bg-mint animate-pulse" />
            <span>SOLANA ANCHOR CPI ARCHITECTURE // SPEC v1.0.4</span>
          </div>

          <h1 className="font-serif text-[40px] leading-[1.05] text-cream md:text-[56px] font-medium">
            Protocol Specifications &amp; PDA Architecture
          </h1>
          <p className="mt-4 text-[15px] leading-relaxed text-muted">
            Technical specifications for the Solana Anchor program, Program Derived Address (PDA) seed derivation, 90/10 capital routing CPI, and token-bound account security invariants.
          </p>
        </div>

        {/* 4-Box Summary Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <div className="rounded-lg border border-line bg-surface-1 p-5 transition-colors hover:border-line-strong hover:bg-surface-2">
            <span className="font-mono text-[10px] text-dim uppercase tracking-wider block">FRAMEWORK</span>
            <div className="font-serif text-[22px] text-cream font-medium mt-1">Anchor 0.30.1</div>
            <span className="font-mono text-[11px] text-mint mt-1 block">Solana Rust Framework</span>
          </div>

          <div className="rounded-lg border border-line bg-surface-1 p-5 transition-colors hover:border-line-strong hover:bg-surface-2">
            <span className="font-mono text-[10px] text-dim uppercase tracking-wider block">ON-CHAIN SPLIT</span>
            <div className="font-serif text-[22px] text-cream font-medium mt-1">90% PDA / 10% Protocol</div>
            <span className="font-mono text-[11px] text-mint mt-1 block">Hardcoded Invariant</span>
          </div>

          <div className="rounded-lg border border-line bg-surface-1 p-5 transition-colors hover:border-line-strong hover:bg-surface-2">
            <span className="font-mono text-[10px] text-dim uppercase tracking-wider block">PDA CUSTODY</span>
            <div className="font-serif text-[22px] text-cream font-medium mt-1">Token-Bound Anchor CPI</div>
            <span className="font-mono text-[11px] text-mint mt-1 block">Transfers on Secondary</span>
          </div>

          <div className="rounded-lg border border-line bg-surface-1 p-5 transition-colors hover:border-line-strong hover:bg-surface-2">
            <span className="font-mono text-[10px] text-dim uppercase tracking-wider block">TOTAL AGENTS</span>
            <div className="font-serif text-[22px] text-cream font-medium mt-1">10,078 Genesis Units</div>
            <span className="font-mono text-[11px] text-mint mt-1 block">Immutable Cap</span>
          </div>
        </div>

        {/* Detailed Spec Container */}
        <div className="rounded-xl border border-line bg-surface-1 p-6 md:p-8 mb-12 shadow-2xl">
          <div className="border-b border-line pb-4 mb-6">
            <h2 className="font-serif text-[22px] text-cream font-medium">
              Anchor Instruction &amp; Seed Definitions
            </h2>
            <p className="text-[13px] text-muted">Cryptographic parameters governing vault creation and authority.</p>
          </div>

          <div className="space-y-6 font-mono text-[12.5px]">
            <div className="border-b border-line pb-5">
              <span className="text-[11px] text-dim uppercase block mb-1">PROGRAM TREASURY PUBKEY</span>
              <code className="text-[13px] text-mint select-all">{treasury}</code>
            </div>

            <div className="border-b border-line pb-5">
              <span className="text-[11px] text-dim uppercase block mb-2">PDA VAULT SEED DERIVATION</span>
              <pre className="overflow-x-auto rounded-lg border border-line bg-black/60 p-4 text-[12px] text-cream/90 leading-relaxed">
                <code>Pubkey::find_program_address(&amp;[b"agent_vault", mint.key().as_ref(), &amp;agent_id.to_le_bytes()], &amp;program_id)</code>
              </pre>
            </div>

            <div className="border-b border-line pb-5">
              <span className="text-[11px] text-dim uppercase block mb-2">CPI CAPITAL ROUTING FLOW</span>
              <p className="text-[13px] text-muted font-sans leading-relaxed">
                Upon calling <code className="font-mono text-cream">mint_agent(ctx, agent_id)</code>, the Anchor program executes two atomic <code className="font-mono text-cream">system_program::transfer</code> Cross-Program Invocations in the same transaction block:
              </p>
              <ul className="mt-3 space-y-1.5 list-disc list-inside text-[13px] text-muted font-sans">
                <li><strong className="text-mint font-medium font-mono">90% (9,000 BPS):</strong> Transferred from minter wallet directly to the newly derived <code className="font-mono text-cream">agent_vault</code> PDA.</li>
                <li><strong className="text-peach font-medium font-mono">10% (1,000 BPS):</strong> Transferred from minter wallet directly to the protocol treasury address.</li>
              </ul>
            </div>

            <div>
              <span className="text-[11px] text-dim uppercase block mb-2">SECONDARY MARKET RETENTION</span>
              <p className="text-[13px] text-muted font-sans leading-relaxed">
                The agent's PDA vault authority is bound to the owner of the NFT. If the NFT is listed or sold on Magic Eden or Tensor, custody of the PDA vault and its autonomous trading capital transfers to the buyer without withdrawing any collateral.
              </p>
            </div>
          </div>
        </div>

        {/* Real Smart Contract Code Snippet */}
        <div className="rounded-xl border border-line bg-black overflow-hidden shadow-2xl">
          <div className="border-b border-line bg-surface-1/60 px-5 py-3 flex items-center justify-between">
            <span className="font-mono text-[12px] text-cream font-medium">rare_protocol / src / lib.rs</span>
            <span className="font-mono text-[11px] text-mint flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-mint" />
              SOLANA MAINNET-BETA
            </span>
          </div>

          <pre className="overflow-x-auto p-5 font-mono text-[12.5px] leading-[1.8] text-cream/90">
            <code>
              <span className="block whitespace-pre"><span className="text-dim select-none mr-4">01</span><span className="text-violet">pub fn</span> <span className="text-cream">mint_agent</span>(ctx: Context&lt;MintAgent&gt;, agent_id: u16) -&gt; Result&lt;()&gt; &#123;</span>
              <span className="block whitespace-pre"><span className="text-dim select-none mr-4">02</span>    <span className="text-violet">let</span> mint_price = get_band_price(agent_id);</span>
              <span className="block whitespace-pre"><span className="text-dim select-none mr-4">03</span>    <span className="text-violet">let</span> pda_deposit = mint_price * <span className="text-mint">90</span> / <span className="text-mint">100</span>;</span>
              <span className="block whitespace-pre"><span className="text-dim select-none mr-4">04</span>    <span className="text-violet">let</span> treasury_deposit = mint_price - pda_deposit;</span>
              <span className="block whitespace-pre"><span className="text-dim select-none mr-4">05</span></span>
              <span className="block whitespace-pre"><span className="text-dim select-none mr-4">06</span>    <span className="text-dim">// 1. Atomic Anchor CPI transfer to Agent Token-Bound PDA Vault</span></span>
              <span className="block whitespace-pre"><span className="text-dim select-none mr-4">07</span>    anchor_lang::solana_program::program::invoke(</span>
              <span className="block whitespace-pre"><span className="text-dim select-none mr-4">08</span>        &amp;system_instruction::transfer(&amp;ctx.accounts.payer.key(), &amp;ctx.accounts.agent_vault.key(), pda_deposit),</span>
              <span className="block whitespace-pre"><span className="text-dim select-none mr-4">09</span>        &amp;[ctx.accounts.payer.to_account_info(), ctx.accounts.agent_vault.to_account_info()],</span>
              <span className="block whitespace-pre"><span className="text-dim select-none mr-4">10</span>    )?;</span>
              <span className="block whitespace-pre"><span className="text-dim select-none mr-4">11</span></span>
              <span className="block whitespace-pre"><span className="text-dim select-none mr-4">12</span>    <span className="text-dim">// 2. Protocol operations split (10%)</span></span>
              <span className="block whitespace-pre"><span className="text-dim select-none mr-4">13</span>    anchor_lang::solana_program::program::invoke(</span>
              <span className="block whitespace-pre"><span className="text-dim select-none mr-4">14</span>        &amp;system_instruction::transfer(&amp;ctx.accounts.payer.key(), &amp;ctx.accounts.treasury.key(), treasury_deposit),</span>
              <span className="block whitespace-pre"><span className="text-dim select-none mr-4">15</span>        &amp;[ctx.accounts.payer.to_account_info(), ctx.accounts.treasury.to_account_info()],</span>
              <span className="block whitespace-pre"><span className="text-dim select-none mr-4">16</span>    )?;</span>
              <span className="block whitespace-pre"><span className="text-dim select-none mr-4">17</span></span>
              <span className="block whitespace-pre"><span className="text-dim select-none mr-4">18</span>    msg!(<span className="text-rose">"Agent #&#123;&#125; minted with 90% capital CPI vault initialization"</span>, agent_id);</span>
              <span className="block whitespace-pre"><span className="text-dim select-none mr-4">19</span>    Ok(())</span>
              <span className="block whitespace-pre"><span className="text-dim select-none mr-4">20</span>&#125;</span>
            </code>
          </pre>
        </div>
      </main>

      <Footer />
    </div>
  );
}
