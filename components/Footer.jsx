'use client';

import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-black/[0.06] bg-[#e6eef8]">
      <div className="max-w-[1360px] mx-auto px-5 py-16 md:px-8">
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 lg:grid-cols-6">
          {/* Col 1 */}
          <div>
            <h3 className="text-[13px] font-semibold text-neutral-900 tracking-wide">Swarm</h3>
            <ul className="mt-3.5 space-y-2 text-[13px]">
              <li><Link className="text-neutral-600 hover:text-black transition-colors" href="/roster">Agent Roster</Link></li>
              <li><Link className="text-neutral-600 hover:text-black transition-colors" href="/ladder">Price Ladder</Link></li>
              <li><Link className="text-neutral-600 hover:text-black transition-colors" href="/roster?role=Arbitrage">Quantum Agents</Link></li>
              <li><Link className="text-neutral-600 hover:text-black transition-colors" href="/roster?role=Liquidity">Sentinel Guards</Link></li>
            </ul>
          </div>

          {/* Col 2 */}
          <div>
            <h3 className="text-[13px] font-semibold text-neutral-900 tracking-wide">Protocol</h3>
            <ul className="mt-3.5 space-y-2 text-[13px]">
              <li><Link className="text-neutral-600 hover:text-black transition-colors" href="/specs">PDA Vault Architecture</Link></li>
              <li><Link className="text-neutral-600 hover:text-black transition-colors" href="/specs#cpi">Anchor CPI Routing</Link></li>
              <li><Link className="text-neutral-600 hover:text-black transition-colors" href="/specs#custody">90% Non-Custodial Rule</Link></li>
              <li><Link className="text-neutral-600 hover:text-black transition-colors" href="/whitepaper">Whitepaper PDF</Link></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h3 className="text-[13px] font-semibold text-neutral-900 tracking-wide">Execution</h3>
            <ul className="mt-3.5 space-y-2 text-[13px]">
              <li><span className="text-neutral-500">Jupiter V6 Swap</span></li>
              <li><span className="text-neutral-500">Raydium CLMM CPI</span></li>
              <li><span className="text-neutral-500">Meteora DLMM Hooks</span></li>
              <li><span className="text-neutral-500">Pyth Oracle Guards</span></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h3 className="text-[13px] font-semibold text-neutral-900 tracking-wide">Developers</h3>
            <ul className="mt-3.5 space-y-2 text-[13px]">
              <li><Link className="text-neutral-600 hover:text-black transition-colors" href="/terminal">Telemetry Terminal</Link></li>
              <li><Link className="text-neutral-600 hover:text-black transition-colors" href="/preview">Pixel NFT Explorer</Link></li>
              <li><a className="text-neutral-600 hover:text-black transition-colors" href="/api/agents" target="_blank" rel="noreferrer">Agent API JSON</a></li>
              <li><Link className="text-neutral-600 hover:text-black transition-colors" href="/specs">PDA Program IDL</Link></li>
            </ul>
          </div>

          {/* Col 5 */}
          <div>
            <h3 className="text-[13px] font-semibold text-neutral-900 tracking-wide">Community</h3>
            <ul className="mt-3.5 space-y-2 text-[13px]">
              <li><a className="text-neutral-600 hover:text-black transition-colors" href="https://x.com/rare_agent?s=11" target="_blank" rel="noreferrer">X (Twitter)</a></li>
              <li><a className="text-neutral-600 hover:text-black transition-colors" href="https://discord.com" target="_blank" rel="noreferrer">Discord Community</a></li>
              <li><a className="text-neutral-600 hover:text-black transition-colors" href="https://t.me" target="_blank" rel="noreferrer">Telegram Channel</a></li>
            </ul>
          </div>

          {/* Col 6 */}
          <div>
            <h3 className="text-[13px] font-semibold text-neutral-900 tracking-wide">Network</h3>
            <ul className="mt-3.5 space-y-2 text-[13px]">
              <li>
                <a
                  className="text-neutral-600 hover:text-black transition-colors inline-flex items-center gap-1.5"
                  href="https://solscan.io/account/3ivjUQCmaykSnGeCkuy8yViw82umrfDCmXkxtWSeqyEk"
                  target="_blank"
                  rel="noreferrer"
                >
                  <span>Solscan Explorer</span>
                  <span className="text-[10px]">↗</span>
                </a>
              </li>
              <li>
                <span className="inline-flex items-center gap-2 text-neutral-600 text-[12px] mt-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Mainnet-Beta</span>
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 pt-8 border-t border-black/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-[12.5px] text-neutral-500">
          <div className="flex items-center gap-3">
            <img
              src="/rare-logo-icon.png"
              alt="RARE Protocol Logo"
              className="object-contain drop-shadow-sm"
              style={{ height: '24px', width: 'auto', maxHeight: '24px', maxWidth: '24px', objectFit: 'contain', display: 'block', flexShrink: 0 }}
              width={24}
              height={24}
            />
            <span className="font-sans text-[14.5px] text-neutral-950 font-bold tracking-tight">RARE PROTOCOL</span>
            <span className="text-neutral-400">·</span>
            <span>10,078 Autonomous Solana Agents</span>
          </div>

          <div className="font-mono text-[11px] text-neutral-500 flex items-center gap-2">
            <span>ANCHOR CPI PDA VAULTS</span>
            <span>·</span>
            <span>© 2026 RARE</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
