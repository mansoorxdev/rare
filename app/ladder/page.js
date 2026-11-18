'use client';

import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const LADDER_BANDS = [
  { band: 1, range: '#00001 - #01008', price: 0.02, pdaCapital: 0.018, treasury: 0.002, status: 'Active (Now Minting)' },
  { band: 2, range: '#01009 - #02016', price: 0.026, pdaCapital: 0.0234, treasury: 0.0026, status: 'Upcoming' },
  { band: 3, range: '#02017 - #03024', price: 0.034, pdaCapital: 0.0306, treasury: 0.0034, status: 'Upcoming' },
  { band: 4, range: '#03025 - #04032', price: 0.044, pdaCapital: 0.0396, treasury: 0.0044, status: 'Upcoming' },
  { band: 5, range: '#04033 - #05040', price: 0.057, pdaCapital: 0.0513, treasury: 0.0057, status: 'Upcoming' },
  { band: 6, range: '#05041 - #06048', price: 0.074, pdaCapital: 0.0666, treasury: 0.0074, status: 'Upcoming' },
  { band: 7, range: '#06049 - #07056', price: 0.096, pdaCapital: 0.0864, treasury: 0.0096, status: 'Upcoming' },
  { band: 8, range: '#07057 - #08064', price: 0.125, pdaCapital: 0.1125, treasury: 0.0125, status: 'Upcoming' },
  { band: 9, range: '#08065 - #09072', price: 0.163, pdaCapital: 0.1467, treasury: 0.0163, status: 'Upcoming' },
  { band: 10, range: '#09073 - #10078', price: 0.212, pdaCapital: 0.1908, treasury: 0.0212, status: 'Upcoming' },
];

export default function LadderPage() {
  const [calcQty, setCalcQty] = useState(5);
  const currentPrice = 0.02;
  const totalCost = +(calcQty * currentPrice).toFixed(3);
  const pdaDeposit = +(totalCost * 0.9).toFixed(4);
  const treasurySplit = +(totalCost * 0.1).toFixed(4);

  return (
    <>
      <Navbar />

      <main className="wrap" style={{ paddingTop: '28px', paddingBottom: '60px' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <div className="ca-pill" style={{ marginBottom: '12px' }}>
            <span className="pulse" />
            <span>SOLANA BONDING CURVE // 10 PRICE BANDS</span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '-0.02em', marginBottom: '8px' }}>
            Protocol Price Ladder
          </h1>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--dim)', maxWidth: '780px' }}>
            The RARE Protocol employs a deterministic 10-tier bonding curve. Exactly 90% of all SOL minted is locked directly into the corresponding token-bound PDA vault via Anchor Cross-Program Invocation (CPI).
          </p>
        </div>

        {/* Interactive Capital Split Calculator */}
        <div style={{ background: 'linear-gradient(180deg, rgba(16, 21, 30, 0.85) 0%, rgba(10, 13, 19, 0.95) 100%)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 'var(--radius-lg)', boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.6)', padding: '28px', marginBottom: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--hair)', paddingBottom: '14px', marginBottom: '24px', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="var(--script-green)"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '17px', fontWeight: 800, textTransform: 'uppercase', color: '#ffffff', letterSpacing: '0.02em' }}>
                Interactive Capital Routing Calculator
              </h3>
            </div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', background: 'rgba(0, 229, 153, 0.12)', color: 'var(--script-green)', border: '1px solid rgba(0, 229, 153, 0.3)', borderRadius: 'var(--radius-sm)', padding: '3px 10px', fontWeight: 800 }}>
              BAND 1 RATE: 0.02 SOL / AGENT
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px', alignItems: 'center' }}>
            <div>
              <label style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '8px' }}>
                SELECT MINT QUANTITY: <b style={{ color: 'var(--script-green)', fontSize: '14px' }}>{calcQty} AGENTS</b>
              </label>
              <input
                type="range"
                min="1"
                max="50"
                value={calcQty}
                onChange={(e) => setCalcQty(parseInt(e.target.value, 10))}
                style={{ width: '100%', accentColor: 'var(--script-green)', marginBottom: '14px' }}
              />
              <div style={{ display: 'flex', gap: '8px' }}>
                {[1, 5, 10, 20, 50].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setCalcQty(num)}
                    className="btn-secondary"
                    style={{ padding: '5px 12px', fontSize: '11px', background: calcQty === num ? 'var(--script-green)' : 'rgba(255, 255, 255, 0.04)', color: calcQty === num ? '#04140e' : 'var(--ink)', fontWeight: calcQty === num ? 800 : 600, border: calcQty === num ? '1px solid var(--script-green)' : '1px solid var(--hair)' }}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--hair)', borderRadius: 'var(--radius-sm)', padding: '14px' }}>
                <span style={{ color: 'var(--dim)', display: 'block', marginBottom: '4px' }}>TOTAL MINT CAPITAL:</span>
                <span style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff' }}>{totalCost} SOL</span>
              </div>
              <div style={{ background: 'rgba(0, 229, 153, 0.08)', border: '1px solid rgba(0, 229, 153, 0.35)', borderRadius: 'var(--radius-sm)', padding: '14px', boxShadow: '0 0 20px -5px rgba(0, 229, 153, 0.15)' }}>
                <span style={{ color: 'var(--script-green)', display: 'block', marginBottom: '4px', fontWeight: 700 }}>90% PDA VAULT DEPOSIT:</span>
                <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--script-green)' }}>{pdaDeposit} SOL</span>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--hair)', borderRadius: 'var(--radius-sm)', padding: '14px' }}>
                <span style={{ color: 'var(--dim)', display: 'block', marginBottom: '4px' }}>10% PROTOCOL TREASURY:</span>
                <span style={{ fontSize: '18px', fontWeight: 700, color: '#f59e0b' }}>{treasurySplit} SOL</span>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--hair)', borderRadius: 'var(--radius-sm)', padding: '14px' }}>
                <span style={{ color: 'var(--dim)', display: 'block', marginBottom: '4px' }}>SECONDARY LIQUIDITY:</span>
                <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--script-green)' }}>100% Retained</span>
              </div>
            </div>
          </div>
        </div>

        {/* 10-Tier Bonding Curve Table */}
        <div style={{ background: 'linear-gradient(180deg, rgba(16, 21, 30, 0.85) 0%, rgba(10, 13, 19, 0.95) 100%)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 'var(--radius-lg)', boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.6)', overflow: 'hidden', marginBottom: '40px' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-mono)', fontSize: '12px', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'rgba(255, 255, 255, 0.03)', color: '#ffffff', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.05em', borderBottom: '1px solid var(--hair)' }}>
                  <th style={{ padding: '14px 18px' }}>Band Tier</th>
                  <th style={{ padding: '14px 18px' }}>Agent ID Range</th>
                  <th style={{ padding: '14px 18px' }}>Mint Price</th>
                  <th style={{ padding: '14px 18px' }}>90% PDA Capital</th>
                  <th style={{ padding: '14px 18px' }}>10% Treasury</th>
                  <th style={{ padding: '14px 18px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {LADDER_BANDS.map((item, idx) => (
                  <tr
                    key={item.band}
                    style={{
                      borderBottom: '1px solid var(--hair)',
                      background: item.band === 1 ? 'rgba(0, 229, 153, 0.06)' : idx % 2 === 0 ? 'transparent' : 'rgba(255, 255, 255, 0.015)',
                    }}
                  >
                    <td style={{ padding: '12px 18px', fontWeight: 700, color: item.band === 1 ? 'var(--script-green)' : '#ffffff' }}>
                      Band #{item.band}
                    </td>
                    <td style={{ padding: '12px 18px', color: 'var(--dim)' }}>
                      {item.range}
                    </td>
                    <td style={{ padding: '12px 18px', fontWeight: 700, color: 'var(--ink)' }}>
                      {item.price} SOL
                    </td>
                    <td style={{ padding: '12px 18px', fontWeight: 700, color: 'var(--script-green)' }}>
                      {item.pdaCapital} SOL
                    </td>
                    <td style={{ padding: '12px 18px', color: '#f59e0b', fontWeight: 700 }}>
                      {item.treasury} SOL
                    </td>
                    <td style={{ padding: '12px 18px' }}>
                      <span
                        style={{
                          padding: '3px 8px',
                          fontSize: '10px',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          borderRadius: 'var(--radius-sm)',
                          background: item.band === 1 ? 'var(--script-green)' : 'rgba(255, 255, 255, 0.04)',
                          color: item.band === 1 ? '#04140e' : 'var(--dim)',
                          border: item.band === 1 ? '1px solid var(--script-green)' : '1px solid var(--hair)'
                        }}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Architecture Specs Callout */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          <div className="protocol-hero-pillar">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--script-green)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 700, textTransform: 'uppercase', color: '#ffffff' }}>
                Why 90% Capital Routing?
              </h4>
            </div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--dim)', lineHeight: 1.6 }}>
              Unlike traditional NFT collections where mint funds leave the ecosystem into team wallets, RARE deposits 90% directly into the newly minted agent&apos;s PDA vault. The NFT itself holds the capital, serving as the agent&apos;s autonomous trading bankroll.
            </p>
          </div>

          <div className="protocol-hero-pillar">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--script-green)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
              <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 700, textTransform: 'uppercase', color: '#ffffff' }}>
                Secondary Transfer Integrity
              </h4>
            </div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--dim)', lineHeight: 1.6 }}>
              Because the PDA wallet is cryptographically bound to the NFT token account via Solana Anchor CPI, transferring the NFT on Magic Eden or Tensor automatically transfers ownership and custody of the underlying PDA capital and accrued profits.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
