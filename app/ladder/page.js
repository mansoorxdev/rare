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
            <span>SOLANA BONDING CURVE · 10 DETERMINISTIC BANDS</span>
          </div>

          <h1 className="gamma-hero-title" style={{ fontSize: 'clamp(32px, 4vw, 52px)', marginBottom: '12px' }}>
            Protocol Price Ladder
          </h1>
          <p className="gamma-hero-subtitle" style={{ maxWidth: '680px', margin: '0 auto' }}>
            The RARE Protocol employs a deterministic 10-tier bonding curve. Exactly 90% of all SOL minted is locked directly into the corresponding token-bound PDA vault via Anchor Cross-Program Invocation (CPI).
          </p>
        </div>

        {/* Interactive Capital Routing Calculator */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(15, 23, 42, 0.08)',
          borderRadius: '24px',
          padding: '28px',
          marginBottom: '36px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
        }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(15, 23, 42, 0.08)', paddingBottom: '16px', marginBottom: '24px', gap: '12px' }}>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Capital Routing Calculator
              </h2>
              <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0 0' }}>Estimate atomic PDA allocation across mint batches.</p>
            </div>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              fontFamily: 'var(--font-jetbrains), monospace',
              fontSize: '11px',
              color: '#047857',
              border: '1px solid #a7f3d0',
              background: '#ecfdf5',
              borderRadius: '9999px',
              padding: '6px 14px',
              fontWeight: 700
            }}>
              BAND 1 RATE: 0.020 SOL / AGENT
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px', alignItems: 'center' }}>
            <div>
              <label style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '12px', color: '#64748b', display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>
                Select Mint Quantity: <strong style={{ color: '#0f172a' }}>{calcQty} AGENTS</strong>
              </label>
              <input
                type="range"
                min="1"
                max="50"
                value={calcQty}
                onChange={(e) => setCalcQty(parseInt(e.target.value, 10))}
                style={{ width: '100%', accentColor: '#7c3aed', cursor: 'pointer', marginBottom: '16px' }}
              />
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {[1, 5, 10, 20, 50].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setCalcQty(num)}
                    style={{
                      borderRadius: '9999px',
                      padding: '5px 14px',
                      fontSize: '12px',
                      fontFamily: 'var(--font-jetbrains), monospace',
                      border: calcQty === num ? 'none' : '1px solid rgba(15, 23, 42, 0.1)',
                      background: calcQty === num ? '#111827' : '#ffffff',
                      color: calcQty === num ? '#ffffff' : '#475569',
                      fontWeight: calcQty === num ? 600 : 500,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px', fontFamily: 'var(--font-jetbrains), monospace' }}>
              <div style={{ background: '#f8fafc', border: '1px solid rgba(15, 23, 42, 0.06)', borderRadius: '16px', padding: '16px' }}>
                <span style={{ fontSize: '10px', color: '#64748b', display: 'block', marginBottom: '4px', textTransform: 'uppercase' }}>Total Capital</span>
                <span style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>{totalCost} SOL</span>
              </div>
              <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '16px', padding: '16px' }}>
                <span style={{ fontSize: '10px', color: '#047857', display: 'block', marginBottom: '4px', textTransform: 'uppercase', fontWeight: 700 }}>90% Agent PDA</span>
                <span style={{ fontSize: '20px', fontWeight: 800, color: '#047857' }}>{pdaDeposit} SOL</span>
              </div>
              <div style={{ background: '#f8fafc', border: '1px solid rgba(15, 23, 42, 0.06)', borderRadius: '16px', padding: '16px' }}>
                <span style={{ fontSize: '10px', color: '#64748b', display: 'block', marginBottom: '4px', textTransform: 'uppercase' }}>10% Protocol</span>
                <span style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>{treasurySplit} SOL</span>
              </div>
            </div>
          </div>
        </div>

        {/* 10-Tier Ladder Table */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '24px',
          border: '1px solid rgba(15, 23, 42, 0.08)',
          overflow: 'hidden',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
          marginBottom: '40px'
        }}>
          <div style={{ borderBottom: '1px solid rgba(15, 23, 42, 0.08)', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              10 Bonding Curve Tiers (10,078 Total Agents)
            </h2>
            <span style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '11px', color: '#64748b' }}>
              ANCHOR CPI v1.2
            </span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', fontFamily: 'var(--font-jetbrains), monospace', fontSize: '12px' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid rgba(15, 23, 42, 0.06)', color: '#64748b', fontSize: '11px', textTransform: 'uppercase' }}>
                  <th style={{ padding: '12px 24px' }}>Tier</th>
                  <th style={{ padding: '12px 24px' }}>Agent Range</th>
                  <th style={{ padding: '12px 24px' }}>Mint Price</th>
                  <th style={{ padding: '12px 24px' }}>90% PDA Vault</th>
                  <th style={{ padding: '12px 24px' }}>10% Treasury</th>
                  <th style={{ padding: '12px 24px', textAlign: 'right' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {LADDER_BANDS.map((item) => {
                  const isCurrent = item.band === 1;
                  return (
                    <tr
                      key={item.band}
                      style={{
                        borderBottom: '1px solid rgba(15, 23, 42, 0.04)',
                        background: isCurrent ? 'rgba(16, 185, 129, 0.04)' : 'transparent'
                      }}
                    >
                      <td style={{ padding: '14px 24px', fontWeight: 700, color: isCurrent ? '#047857' : '#0f172a' }}>
                        Band {item.band}
                      </td>
                      <td style={{ padding: '14px 24px', color: '#64748b' }}>{item.range}</td>
                      <td style={{ padding: '14px 24px', fontWeight: 700, color: '#0f172a' }}>{item.price.toFixed(3)} SOL</td>
                      <td style={{ padding: '14px 24px', fontWeight: 700, color: '#047857' }}>{item.pdaCapital.toFixed(4)} SOL</td>
                      <td style={{ padding: '14px 24px', color: '#64748b' }}>{item.treasury.toFixed(4)} SOL</td>
                      <td style={{ padding: '14px 24px', textAlign: 'right' }}>
                        {isCurrent ? (
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            background: '#dcfce7',
                            color: '#15803d',
                            padding: '3px 10px',
                            borderRadius: '9999px',
                            fontSize: '11px',
                            fontWeight: 700
                          }}>
                            <span style={{ width: '6px', height: '6px', borderRadius: '9999px', background: '#16a34a', display: 'inline-block' }} />
                            Active Now
                          </span>
                        ) : (
                          <span style={{ color: '#94a3b8', fontSize: '11px' }}>Upcoming</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
