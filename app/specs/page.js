'use client';

import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function SpecsPage() {
  const treasury = '3ivjUQCmaykSnGeCkuy8yViw82umrfDCmXkxtWSeqyEk';

  return (
    <>
      <Navbar />

      <main className="wrap" style={{ paddingTop: '28px', paddingBottom: '60px' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <div className="ca-pill" style={{ marginBottom: '12px' }}>
            <span className="pulse" />
            <span>SOLANA ANCHOR CPI ARCHITECTURE // SPEC v1.0.4</span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '-0.02em', marginBottom: '8px' }}>
            Protocol Specifications &amp; PDA Architecture
          </h1>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--dim)', maxWidth: '780px' }}>
            Technical deep-dive into the Solana Anchor program, Program Derived Address (PDA) seed derivation, 90/10 capital routing CPI, and token-bound account security invariants.
          </p>
        </div>

        {/* 4-Box Quick Verification Summary */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '36px' }}>
          <div style={{ background: '#121215', border: '2px solid var(--hair)', padding: '16px', boxShadow: '3px 3px 0px #000' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--dim)', fontWeight: 700, textTransform: 'uppercase' }}>FRAMEWORK</span>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700, marginTop: '4px', color: '#ffffff' }}>Anchor 0.30.1</div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--script-green)' }}>Solana Rust Framework</span>
          </div>

          <div style={{ background: '#121215', border: '2px solid var(--hair)', padding: '16px', boxShadow: '3px 3px 0px #000' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--dim)', fontWeight: 700, textTransform: 'uppercase' }}>ON-CHAIN SPLIT</span>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700, marginTop: '4px', color: '#ffffff' }}>90% PDA / 10% Protocol</div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--script-green)' }}>Hardcoded Invariant</span>
          </div>

          <div style={{ background: '#121215', border: '2px solid var(--hair)', padding: '16px', boxShadow: '3px 3px 0px #000' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--dim)', fontWeight: 700, textTransform: 'uppercase' }}>PDA CUSTODY</span>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700, marginTop: '4px', color: '#ffffff' }}>Token-Bound Anchor CPI</div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--script-green)' }}>Transfers on Secondary</span>
          </div>

          <div style={{ background: '#121215', border: '2px solid var(--hair)', padding: '16px', boxShadow: '3px 3px 0px #000' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--dim)', fontWeight: 700, textTransform: 'uppercase' }}>TOTAL AGENTS</span>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700, marginTop: '4px', color: '#ffffff' }}>10,078 Genesis Units</div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--script-green)' }}>Immutable Cap</span>
          </div>
        </div>

        {/* Detailed Spec Rows */}
        <div className="spec-box" style={{ background: '#121215', border: '2px solid var(--hair)', boxShadow: '6px 6px 0px 0px var(--script-green)', padding: '24px', marginBottom: '40px' }}>
          <div style={{ borderBottom: '1px solid var(--hair)', paddingBottom: '12px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--script-green)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 700, textTransform: 'uppercase', color: '#ffffff' }}>
              Anchor Instruction &amp; Seed Definitions
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
            <div style={{ borderBottom: '1px solid var(--hair)', paddingBottom: '12px' }}>
              <div style={{ color: 'var(--dim)', fontSize: '10px', fontWeight: 700 }}>PROGRAM TREASURY PUBKEY</div>
              <code style={{ fontSize: '13px', fontWeight: 700, color: 'var(--script-green)' }}>{treasury}</code>
            </div>

            <div style={{ borderBottom: '1px solid var(--hair)', paddingBottom: '12px' }}>
              <div style={{ color: 'var(--dim)', fontSize: '10px', fontWeight: 700 }}>PDA VAULT SEED DERIVATION</div>
              <code style={{ fontSize: '12px', background: '#09090b', padding: '8px 12px', border: '1px solid var(--hair)', display: 'block', marginTop: '6px', color: 'var(--script-green)' }}>
                Pubkey::find_program_address(&amp;[b&quot;agent_vault&quot;, mint.key().as_ref(), &amp;agent_id.to_le_bytes()], &amp;program_id)
              </code>
            </div>

            <div style={{ borderBottom: '1px solid var(--hair)', paddingBottom: '12px' }}>
              <div style={{ color: 'var(--dim)', fontSize: '10px', fontWeight: 700 }}>CPI CAPITAL ROUTING FLOW</div>
              <p style={{ marginTop: '4px', lineHeight: 1.6, color: 'var(--ink-soft)' }}>
                Upon calling <code>mint_agent(ctx, agent_id)</code>, the Anchor program executes two atomic <code>system_program::transfer</code> Cross-Program Invocations in the same transaction block:
                <br />
                1. <b>90% (9,000 BPS)</b>: Transferred from minter wallet directly to the newly derived <code>agent_vault</code> PDA.
                <br />
                2. <b>10% (1,000 BPS)</b>: Transferred from minter wallet directly to the protocol treasury address.
              </p>
            </div>

            <div>
              <div style={{ color: 'var(--dim)', fontSize: '10px', fontWeight: 700 }}>SECONDARY MARKET RETENTION</div>
              <p style={{ marginTop: '4px', lineHeight: 1.6, color: 'var(--ink-soft)' }}>
                The agent&apos;s PDA vault authority is bound to the owner of the NFT. If the NFT is listed or sold on Magic Eden or Tensor, custody of the PDA vault and its autonomous trading capital transfers to the buyer without withdrawing any collateral.
              </p>
            </div>
          </div>
        </div>

        {/* Real Smart Contract Code Snippet */}
        <div style={{ background: '#09090b', border: '2px solid #27272a', boxShadow: '6px 6px 0px 0px var(--script-green)', overflow: 'hidden' }}>
          <div style={{ padding: '10px 16px', background: '#18181b', borderBottom: '1px solid #27272a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--script-green)', fontWeight: 700 }}>
              anchor/programs/rare_protocol/src/lib.rs (RUST)
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#71717a' }}>
              SOLANA ANCHOR CPI
            </span>
          </div>

          <pre style={{ padding: '20px', fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#e4e4e7', overflowX: 'auto', lineHeight: 1.6 }}>
{`// Mint an Autonomous Agent NFT with 90/10 On-Chain Capital Split
pub fn mint_agent(ctx: Context<MintAgent>, agent_id: u32) -> Result<()> {
    let config = &mut ctx.accounts.config;
    require!(!config.is_paused, RareError::MintingPaused);
    require!(config.total_minted < config.total_supply, RareError::MaxSupplyReached);
    require!(agent_id >= 1 && agent_id <= config.total_supply, RareError::InvalidRareId);

    let price = config.base_price_lamports;

    // Calculate 90/10 Split
    let agent_share = (price as u128 * config.agent_split_bps as u128 / 10000) as u64;
    let treasury_share = price.checked_sub(agent_share).unwrap();

    // 1. CPI Transfer 90% into Agent Token-Bound PDA Vault
    transfer(
        CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            Transfer {
                from: ctx.accounts.minter.to_account_info(),
                to: ctx.accounts.agent_vault.to_account_info(),
            },
        ),
        agent_share,
    )?;

    // 2. CPI Transfer 10% into Protocol Treasury
    transfer(
        CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            Transfer {
                from: ctx.accounts.minter.to_account_info(),
                to: ctx.accounts.treasury.to_account_info(),
            },
        ),
        treasury_share,
    )?;

    Ok(())
}`}
          </pre>
        </div>
      </main>

      <Footer />
    </>
  );
}
