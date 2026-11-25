'use client';

import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function SpecsPage() {
  const treasury = '3ivjUQCmaykSnGeCkuy8yViw82umrfDCmXkxtWSeqyEk';

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
            <span>SOLANA ANCHOR CPI ARCHITECTURE · SPEC v1.0.4</span>
          </div>

          <h1 className="gamma-hero-title" style={{ fontSize: 'clamp(32px, 4vw, 52px)', marginBottom: '12px' }}>
            Protocol Specifications &amp; PDA Architecture
          </h1>
          <p className="gamma-hero-subtitle" style={{ maxWidth: '680px', margin: '0 auto' }}>
            Technical specifications for the Solana Anchor program, Program Derived Address (PDA) seed derivation, 90/10 capital routing CPI, and token-bound account security invariants.
          </p>
        </div>

        {/* 4-Box Summary Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '32px' }}>
          <div style={{ background: '#ffffff', border: '1px solid rgba(15, 23, 42, 0.08)', borderRadius: '20px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
            <span style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '10.5px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block' }}>FRAMEWORK</span>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>Anchor 0.30.1</div>
            <span style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '11px', color: '#7c3aed', fontWeight: 600, marginTop: '4px', display: 'block' }}>Solana Rust Framework</span>
          </div>

          <div style={{ background: '#ffffff', border: '1px solid rgba(15, 23, 42, 0.08)', borderRadius: '20px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
            <span style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '10.5px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block' }}>ON-CHAIN SPLIT</span>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>90% PDA / 10% Protocol</div>
            <span style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '11px', color: '#10b981', fontWeight: 600, marginTop: '4px', display: 'block' }}>Hardcoded Invariant</span>
          </div>

          <div style={{ background: '#ffffff', border: '1px solid rgba(15, 23, 42, 0.08)', borderRadius: '20px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
            <span style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '10.5px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block' }}>PDA CUSTODY</span>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>Token-Bound Anchor CPI</div>
            <span style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '11px', color: '#7c3aed', fontWeight: 600, marginTop: '4px', display: 'block' }}>Transfers on Secondary</span>
          </div>

          <div style={{ background: '#ffffff', border: '1px solid rgba(15, 23, 42, 0.08)', borderRadius: '20px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
            <span style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '10.5px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block' }}>TOTAL AGENTS</span>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>10,078 Genesis Units</div>
            <span style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '11px', color: '#10b981', fontWeight: 600, marginTop: '4px', display: 'block' }}>Immutable Cap</span>
          </div>
        </div>

        {/* Detailed Spec Container */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          border: '1px solid rgba(15, 23, 42, 0.08)',
          borderRadius: '24px',
          padding: '28px',
          marginBottom: '32px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
        }}>
          <div style={{ borderBottom: '1px solid rgba(15, 23, 42, 0.08)', paddingBottom: '16px', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Anchor Instruction &amp; Seed Definitions
            </h2>
            <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0 0' }}>Cryptographic parameters governing vault creation and authority.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', fontFamily: 'var(--font-jetbrains), monospace', fontSize: '12.5px' }}>
            <div style={{ borderBottom: '1px solid rgba(15, 23, 42, 0.06)', paddingBottom: '16px' }}>
              <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>PROGRAM TREASURY PUBKEY</span>
              <code style={{ fontSize: '13px', color: '#0f172a', fontWeight: 700, userSelect: 'all' }}>{treasury}</code>
            </div>

            <div style={{ borderBottom: '1px solid rgba(15, 23, 42, 0.06)', paddingBottom: '16px' }}>
              <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>PDA VAULT SEED DERIVATION</span>
              <pre style={{ overflowX: 'auto', borderRadius: '12px', border: '1px solid rgba(15, 23, 42, 0.08)', background: '#f8fafc', padding: '14px', fontSize: '12px', color: '#0f172a', lineHeight: 1.6 }}>
                <code>Pubkey::find_program_address(&amp;[b"agent_vault", mint.key().as_ref(), &amp;agent_id.to_le_bytes()], &amp;program_id)</code>
              </pre>
            </div>

            <div style={{ borderBottom: '1px solid rgba(15, 23, 42, 0.06)', paddingBottom: '16px' }}>
              <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>CPI CAPITAL ROUTING FLOW</span>
              <p style={{ fontSize: '13px', color: '#475569', fontFamily: 'var(--font-sans)', lineHeight: 1.6, margin: 0 }}>
                Upon calling <code style={{ fontFamily: 'var(--font-jetbrains), monospace', color: '#0f172a', fontWeight: 600 }}>mint_agent(ctx, agent_id)</code>, the Anchor program executes two atomic cross-program transfers in the same block:
              </p>
              <ul style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px', paddingLeft: '20px', fontSize: '13px', color: '#475569', fontFamily: 'var(--font-sans)' }}>
                <li><strong style={{ color: '#047857', fontFamily: 'var(--font-jetbrains), monospace' }}>90% (9,000 BPS):</strong> Transferred directly to the newly derived <code style={{ color: '#0f172a', fontWeight: 600 }}>agent_vault</code> PDA.</li>
                <li><strong style={{ color: '#7c3aed', fontFamily: 'var(--font-jetbrains), monospace' }}>10% (1,000 BPS):</strong> Transferred directly to the protocol operations treasury.</li>
              </ul>
            </div>

            <div>
              <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>SECONDARY MARKET RETENTION</span>
              <p style={{ fontSize: '13px', color: '#475569', fontFamily: 'var(--font-sans)', lineHeight: 1.6, margin: 0 }}>
                The agent's PDA vault authority is permanently bound to the owner of the NFT. If the NFT is transferred or sold on secondary markets, custody of the PDA vault and its autonomous trading capital transfers seamlessly to the buyer without withdrawing any collateral.
              </p>
            </div>
          </div>
        </div>

        {/* Real Smart Contract Code Snippet */}
        <div style={{
          background: '#0c0d14',
          borderRadius: '24px',
          border: '1px solid rgba(15, 23, 42, 0.2)',
          overflow: 'hidden',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.35)',
          marginBottom: '40px'
        }}>
          <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', background: 'rgba(255, 255, 255, 0.03)', padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '12px', color: '#e2e8f0', fontWeight: 600 }}>rare_protocol / src / lib.rs</span>
            <span style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '11px', color: '#34d399', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '9999px', background: '#34d399' }} />
              SOLANA MAINNET-BETA
            </span>
          </div>

          <pre style={{ overflowX: 'auto', padding: '20px', fontFamily: 'var(--font-jetbrains), monospace', fontSize: '12.5px', lineHeight: 1.8, color: '#f1f5f9', margin: 0 }}>
            <code>
              <span style={{ display: 'block' }}><span style={{ color: '#64748b', userSelect: 'none', marginRight: '16px' }}>01</span><span style={{ color: '#c084fc' }}>pub fn</span> <span>mint_agent</span>(ctx: Context&lt;MintAgent&gt;, agent_id: u16) -&gt; Result&lt;()&gt; &#123;</span>
              <span style={{ display: 'block' }}><span style={{ color: '#64748b', userSelect: 'none', marginRight: '16px' }}>02</span>    <span style={{ color: '#c084fc' }}>let</span> mint_price = get_band_price(agent_id);</span>
              <span style={{ display: 'block' }}><span style={{ color: '#64748b', userSelect: 'none', marginRight: '16px' }}>03</span>    <span style={{ color: '#c084fc' }}>let</span> pda_deposit = mint_price * <span style={{ color: '#34d399' }}>90</span> / <span style={{ color: '#34d399' }}>100</span>;</span>
              <span style={{ display: 'block' }}><span style={{ color: '#64748b', userSelect: 'none', marginRight: '16px' }}>04</span>    <span style={{ color: '#c084fc' }}>let</span> treasury_deposit = mint_price - pda_deposit;</span>
              <span style={{ display: 'block' }}><span style={{ color: '#64748b', userSelect: 'none', marginRight: '16px' }}>05</span></span>
              <span style={{ display: 'block' }}><span style={{ color: '#64748b', userSelect: 'none', marginRight: '16px' }}>06</span>    <span style={{ color: '#64748b' }}>// 1. Atomic Anchor CPI transfer to Agent Token-Bound PDA Vault</span></span>
              <span style={{ display: 'block' }}><span style={{ color: '#64748b', userSelect: 'none', marginRight: '16px' }}>07</span>    anchor_lang::solana_program::program::invoke(</span>
              <span style={{ display: 'block' }}><span style={{ color: '#64748b', userSelect: 'none', marginRight: '16px' }}>08</span>        &amp;system_instruction::transfer(&amp;ctx.accounts.payer.key(), &amp;ctx.accounts.agent_vault.key(), pda_deposit),</span>
              <span style={{ display: 'block' }}><span style={{ color: '#64748b', userSelect: 'none', marginRight: '16px' }}>09</span>        &amp;[ctx.accounts.payer.to_account_info(), ctx.accounts.agent_vault.to_account_info()],</span>
              <span style={{ display: 'block' }}><span style={{ color: '#64748b', userSelect: 'none', marginRight: '16px' }}>10</span>    )?;</span>
              <span style={{ display: 'block' }}><span style={{ color: '#64748b', userSelect: 'none', marginRight: '16px' }}>11</span></span>
              <span style={{ display: 'block' }}><span style={{ color: '#64748b', userSelect: 'none', marginRight: '16px' }}>12</span>    <span style={{ color: '#64748b' }}>// 2. Protocol operations split (10%)</span></span>
              <span style={{ display: 'block' }}><span style={{ color: '#64748b', userSelect: 'none', marginRight: '16px' }}>13</span>    anchor_lang::solana_program::program::invoke(</span>
              <span style={{ display: 'block' }}><span style={{ color: '#64748b', userSelect: 'none', marginRight: '16px' }}>14</span>        &amp;system_instruction::transfer(&amp;ctx.accounts.payer.key(), &amp;ctx.accounts.treasury.key(), treasury_deposit),</span>
              <span style={{ display: 'block' }}><span style={{ color: '#64748b', userSelect: 'none', marginRight: '16px' }}>15</span>        &amp;[ctx.accounts.payer.to_account_info(), ctx.accounts.treasury.to_account_info()],</span>
              <span style={{ display: 'block' }}><span style={{ color: '#64748b', userSelect: 'none', marginRight: '16px' }}>16</span>    )?;</span>
              <span style={{ display: 'block' }}><span style={{ color: '#64748b', userSelect: 'none', marginRight: '16px' }}>17</span></span>
              <span style={{ display: 'block' }}><span style={{ color: '#64748b', userSelect: 'none', marginRight: '16px' }}>18</span>    msg!(<span style={{ color: '#fb7185' }}>"Agent #&#123;&#125; minted with 90% capital CPI vault initialization"</span>, agent_id);</span>
              <span style={{ display: 'block' }}><span style={{ color: '#64748b', userSelect: 'none', marginRight: '16px' }}>19</span>    Ok(())</span>
              <span style={{ display: 'block' }}><span style={{ color: '#64748b', userSelect: 'none', marginRight: '16px' }}>20</span>&#125;</span>
            </code>
          </pre>
        </div>
      </main>

      <Footer />
    </div>
  );
}
