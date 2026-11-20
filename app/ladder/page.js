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
    <div className="min-h-screen bg-black text-cream selection:bg-cream selection:text-black font-sans antialiased">
      <Navbar />

      <main className="mx-auto max-w-[1280px] px-5 pt-28 pb-24 md:px-6">
        {/* Page Header */}
        <div className="mx-auto max-w-[800px] text-center mb-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-line bg-surface-1 px-3 py-1 font-mono text-[11px] text-dim mb-4">
            <span className="h-1.5 w-1.5 rounded-full bg-mint animate-pulse" />
            <span>SOLANA BONDING CURVE // 10 DETERMINISTIC BANDS</span>
          </div>

          <h1 className="font-serif text-[40px] leading-[1.05] text-cream md:text-[56px] font-medium">
            Protocol Price Ladder
          </h1>
          <p className="mt-4 text-[15px] leading-relaxed text-muted">
            The RARE Protocol employs a deterministic 10-tier bonding curve. Exactly 90% of all SOL minted is locked directly into the corresponding token-bound PDA vault via Anchor Cross-Program Invocation (CPI).
          </p>
        </div>

        {/* Interactive Capital Routing Calculator */}
        <div className="rounded-xl border border-line bg-surface-1 p-6 md:p-8 mb-14 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-line pb-4 mb-6 gap-3">
            <div>
              <h2 className="font-serif text-[22px] text-cream font-medium">
                Capital Routing Calculator
              </h2>
              <p className="text-[13px] text-muted">Estimate atomic PDA allocation across mint batches.</p>
            </div>
            <span className="self-start sm:self-auto font-mono text-[11px] text-mint border border-mint/30 bg-mint/10 rounded-full px-3 py-1">
              BAND 1 RATE: 0.020 SOL / AGENT
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.3fr] gap-8 items-center">
            <div>
              <label className="font-mono text-[12px] text-dim block mb-2 uppercase">
                Select Mint Quantity: <span className="text-mint font-medium">{calcQty} AGENTS</span>
              </label>
              <input
                type="range"
                min="1"
                max="50"
                value={calcQty}
                onChange={(e) => setCalcQty(parseInt(e.target.value, 10))}
                className="w-full accent-mint cursor-pointer mb-4"
              />
              <div className="flex gap-2 flex-wrap">
                {[1, 5, 10, 20, 50].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setCalcQty(num)}
                    className={`rounded-full px-3.5 py-1 text-[12px] font-mono transition-colors cursor-pointer ${
                      calcQty === num
                        ? 'bg-cream text-black font-medium'
                        : 'border border-line bg-surface-2 text-dim hover:text-cream hover:border-line-strong'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
              <div className="rounded-lg border border-line bg-surface-2 p-4">
                <span className="text-[10px] text-dim block mb-1 uppercase tracking-wider">Total Capital</span>
                <span className="text-[20px] font-medium text-cream">{totalCost} SOL</span>
              </div>
              <div className="rounded-lg border border-mint/40 bg-mint/5 p-4">
                <span className="text-[10px] text-mint block mb-1 uppercase tracking-wider font-semibold">90% Agent PDA</span>
                <span className="text-[20px] font-medium text-mint">{pdaDeposit} SOL</span>
              </div>
              <div className="rounded-lg border border-line bg-surface-2 p-4">
                <span className="text-[10px] text-dim block mb-1 uppercase tracking-wider">10% Protocol</span>
                <span className="text-[20px] font-medium text-peach">{treasurySplit} SOL</span>
              </div>
            </div>
          </div>
        </div>

        {/* 10-Tier Ladder Table */}
        <div className="rounded-xl border border-line bg-surface-1 overflow-hidden shadow-2xl mb-14">
          <div className="border-b border-line px-6 py-4 flex items-center justify-between">
            <h2 className="font-serif text-[20px] text-cream font-medium">10 Bonding Curve Tiers (10,078 Total Agents)</h2>
            <span className="font-mono text-[11px] text-dim">ANCHOR CPI v1.2</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-[12px]">
              <thead>
                <tr className="border-b border-line bg-surface-2/60 text-dim text-[11px] uppercase tracking-wider">
                  <th className="px-6 py-3">Tier</th>
                  <th className="px-6 py-3">Agent Range</th>
                  <th className="px-6 py-3">Mint Price</th>
                  <th className="px-6 py-3">90% PDA Vault</th>
                  <th className="px-6 py-3">10% Treasury</th>
                  <th className="px-6 py-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/60">
                {LADDER_BANDS.map((item) => {
                  const isCurrent = item.band === 1;
                  return (
                    <tr
                      key={item.band}
                      className={`transition-colors ${
                        isCurrent ? 'bg-mint/5 hover:bg-mint/10' : 'hover:bg-surface-2'
                      }`}
                    >
                      <td className="px-6 py-3.5">
                        <span className={`font-medium ${isCurrent ? 'text-mint' : 'text-cream'}`}>
                          Band {item.band}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-muted">{item.range}</td>
                      <td className="px-6 py-3.5 text-cream font-medium">{item.price.toFixed(3)} SOL</td>
                      <td className="px-6 py-3.5 text-mint font-medium">{item.pdaCapital.toFixed(4)} SOL</td>
                      <td className="px-6 py-3.5 text-dim">{item.treasury.toFixed(4)} SOL</td>
                      <td className="px-6 py-3.5 text-right">
                        {isCurrent ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-mint/40 bg-mint/10 px-2.5 py-0.5 text-[11px] text-mint">
                            <span className="h-1 w-1 rounded-full bg-mint animate-pulse" />
                            Active Now
                          </span>
                        ) : (
                          <span className="text-dim text-[11px]">Upcoming</span>
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
