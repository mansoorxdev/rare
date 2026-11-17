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
        <div style={{ background: '#ffffff', border: '2px solid var(--hair-dark)', boxShadow: '6px 6px 0px 0px var(--script-green)', padding: '24px', marginBottom: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid var(--hair-dark)', paddingBottom: '12px', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 700, textTransform: 'uppercase' }}>
              ⚡ Interactive Capital Routing Calculator
            </h3>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', background: 'var(--script-green)', color: '#fff', padding: '2px 8px', fontWeight: 700 }}>
              BAND 1 RATE: 0.02 SOL / AGENT
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px', alignItems: 'center' }}>
            <div>
              <label style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '8px' }}>
                SELECT MINT QUANTITY: <b style={{ color: 'var(--script-green-dark)', fontSize: '14px' }}>{calcQty} AGENTS</b>
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
                    style={{ padding: '4px 10px', fontSize: '11px', background: calcQty === num ? 'var(--hair-dark)' : 'var(--parchment-card)', color: calcQty === num ? '#fff' : 'var(--ink)' }}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
              <div style={{ background: '#fff', border: '1px solid #000', padding: '12px', boxShadow: '2px 2px 0px #000' }}>
                <span style={{ color: 'var(--dim)', display: 'block', marginBottom: '4px' }}>TOTAL MINT CAPITAL:</span>
                <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--ink)' }}>{totalCost} SOL</span>
              </div>
              <div style={{ background: 'var(--script-green-light)', border: '1px solid var(--script-green)', padding: '12px', boxShadow: '2px 2px 0px var(--script-green)' }}>
                <span style={{ color: 'var(--script-green-dark)', display: 'block', marginBottom: '4px', fontWeight: 700 }}>90% PDA VAULT DEPOSIT:</span>
                <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--script-green-dark)' }}>{pdaDeposit} SOL</span>
              </div>
              <div style={{ background: '#fff', border: '1px solid #000', padding: '12px', boxShadow: '2px 2px 0px #000' }}>
                <span style={{ color: 'var(--dim)', display: 'block', marginBottom: '4px' }}>10% PROTOCOL TREASURY:</span>
                <span style={{ fontSize: '18px', fontWeight: 700, color: '#f59e0b' }}>{treasurySplit} SOL</span>
              </div>
              <div style={{ background: '#fff', border: '1px solid #000', padding: '12px', boxShadow: '2px 2px 0px #000' }}>
                <span style={{ color: 'var(--dim)', display: 'block', marginBottom: '4px' }}>SECONDARY LIQUIDITY:</span>
                <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--script-green-dark)' }}>100% Retained</span>
              </div>
            </div>
          </div>
        </div>

        {/* 10-Tier Bonding Curve Table */}
        <div style={{ background: '#fff', border: '2px solid var(--hair-dark)', boxShadow: '4px 4px 0px #000', overflowX: 'auto', marginBottom: '40px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-mono)', fontSize: '12px', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'var(--hair-dark)', color: '#fff', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.05em' }}>
                <th style={{ padding: '12px 16px' }}>Band Tier</th>
                <th style={{ padding: '12px 16px' }}>Agent ID Range</th>
                <th style={{ padding: '12px 16px' }}>Mint Price</th>
                <th style={{ padding: '12px 16px' }}>90% PDA Capital</th>
                <th style={{ padding: '12px 16px' }}>10% Treasury</th>
                <th style={{ padding: '12px 16px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {LADDER_BANDS.map((item, idx) => (
                <tr
                  key={item.band}
                  style={{
                    borderBottom: '1px solid var(--hair)',
                    background: item.band === 1 ? 'var(--script-green-light)' : idx % 2 === 0 ? '#fff' : 'var(--parchment-accent)',
                  }}
                >
                  <td style={{ padding: '12px 16px', fontWeight: 700 }}>
                    Band #{item.band}
                  </td>
                  <td style={{ padding: '12px 16px', color: 'var(--dim)' }}>
                    {item.range}
                  </td>
                  <td style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--ink)' }}>
                    {item.price} SOL
                  </td>
                  <td style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--script-green-dark)' }}>
                    {item.pdaCapital} SOL
                  </td>
                  <td style={{ padding: '12px 16px', color: '#f59e0b', fontWeight: 700 }}>
                    {item.treasury} SOL
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span
                      style={{
                        padding: '2px 8px',
                        fontSize: '10px',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        background: item.band === 1 ? 'var(--script-green)' : '#f4f4f5',
                        color: item.band === 1 ? '#fff' : '#71717a',
                        border: '1px solid #000'
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

        {/* Architecture Specs Callout */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          <div style={{ background: '#fcfaf5', border: '2px solid var(--hair-dark)', padding: '20px', boxShadow: '4px 4px 0px #000' }}>
            <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 700, marginBottom: '8px', textTransform: 'uppercase' }}>
              🔒 Why 90% Capital Routing?
            </h4>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--ink-soft)', lineHeight: 1.6 }}>
              Unlike traditional NFT collections where mint funds leave the ecosystem into team wallets, RARE deposits 90% directly into the newly minted agent&apos;s PDA vault. The NFT itself holds the capital, serving as the agent&apos;s autonomous trading bankroll.
            </p>
          </div>

          <div style={{ background: '#fcfaf5', border: '2px solid var(--hair-dark)', padding: '20px', boxShadow: '4px 4px 0px #000' }}>
            <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 700, marginBottom: '8px', textTransform: 'uppercase' }}>
              🔄 Secondary Transfer Integrity
            </h4>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--ink-soft)', lineHeight: 1.6 }}>
              Because the PDA wallet is cryptographically bound to the NFT token account via Solana Anchor CPI, transferring the NFT on Magic Eden or Tensor automatically transfers ownership and custody of the underlying PDA capital and accrued profits.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
