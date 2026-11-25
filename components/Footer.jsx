'use client';

import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', background: '#07080d' }}>
      <div style={{ maxWidth: '1360px', margin: '0 auto', padding: '64px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '36px' }}>
          {/* Col 1 */}
          <div>
            <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#f8fafc', letterSpacing: '0.04em', textTransform: 'uppercase', fontFamily: 'var(--font-jetbrains), monospace' }}>Swarm</h3>
            <ul style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
              <li><Link style={{ color: '#94a3b8', textDecoration: 'none' }} href="/roster">Agent Roster</Link></li>
              <li><Link style={{ color: '#94a3b8', textDecoration: 'none' }} href="/ladder">Price Ladder</Link></li>
              <li><Link style={{ color: '#94a3b8', textDecoration: 'none' }} href="/roster">Quantum Agents</Link></li>
              <li><Link style={{ color: '#94a3b8', textDecoration: 'none' }} href="/roster">Sentinel Guards</Link></li>
            </ul>
          </div>

          {/* Col 2 */}
          <div>
            <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#f8fafc', letterSpacing: '0.04em', textTransform: 'uppercase', fontFamily: 'var(--font-jetbrains), monospace' }}>Protocol</h3>
            <ul style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
              <li><Link style={{ color: '#94a3b8', textDecoration: 'none' }} href="/specs">PDA Vault Architecture</Link></li>
              <li><Link style={{ color: '#94a3b8', textDecoration: 'none' }} href="/specs#cpi">Anchor CPI Routing</Link></li>
              <li><Link style={{ color: '#94a3b8', textDecoration: 'none' }} href="/specs#custody">90% Non-Custodial Rule</Link></li>
              <li><Link style={{ color: '#94a3b8', textDecoration: 'none' }} href="/whitepaper">Whitepaper PDF</Link></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#f8fafc', letterSpacing: '0.04em', textTransform: 'uppercase', fontFamily: 'var(--font-jetbrains), monospace' }}>Execution</h3>
            <ul style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: '#64748b' }}>
              <li>Jupiter V6 Swap</li>
              <li>Raydium CLMM CPI</li>
              <li>Meteora DLMM Hooks</li>
              <li>Pyth Oracle Guards</li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#f8fafc', letterSpacing: '0.04em', textTransform: 'uppercase', fontFamily: 'var(--font-jetbrains), monospace' }}>Developers</h3>
            <ul style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
              <li><Link style={{ color: '#94a3b8', textDecoration: 'none' }} href="/terminal">Telemetry Terminal</Link></li>
              <li><Link style={{ color: '#94a3b8', textDecoration: 'none' }} href="/preview">Pixel NFT Explorer</Link></li>
              <li><a style={{ color: '#94a3b8', textDecoration: 'none' }} href="/api/agents" target="_blank" rel="noreferrer">Agent API JSON</a></li>
              <li><Link style={{ color: '#94a3b8', textDecoration: 'none' }} href="/specs">PDA Program IDL</Link></li>
            </ul>
          </div>

          {/* Col 5 */}
          <div>
            <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#f8fafc', letterSpacing: '0.04em', textTransform: 'uppercase', fontFamily: 'var(--font-jetbrains), monospace' }}>Community</h3>
            <ul style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
              <li><a style={{ color: '#94a3b8', textDecoration: 'none' }} href="https://x.com/rare_agent?s=11" target="_blank" rel="noreferrer">X (Twitter)</a></li>
              <li><a style={{ color: '#94a3b8', textDecoration: 'none' }} href="https://discord.com" target="_blank" rel="noreferrer">Discord Community</a></li>
              <li><a style={{ color: '#94a3b8', textDecoration: 'none' }} href="https://t.me" target="_blank" rel="noreferrer">Telegram Channel</a></li>
            </ul>
          </div>

          {/* Col 6 */}
          <div>
            <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#f8fafc', letterSpacing: '0.04em', textTransform: 'uppercase', fontFamily: 'var(--font-jetbrains), monospace' }}>Network</h3>
            <ul style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
              <li>
                <a
                  style={{ color: '#94a3b8', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  href="https://solscan.io/account/3ivjUQCmaykSnGeCkuy8yViw82umrfDCmXkxtWSeqyEk"
                  target="_blank"
                  rel="noreferrer"
                >
                  <span>Solscan Explorer</span>
                  <span style={{ fontSize: '10px' }}>↗</span>
                </a>
              </li>
              <li>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#34d399', fontSize: '12px', marginTop: '4px', fontFamily: 'var(--font-jetbrains), monospace' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '9999px', background: '#34d399' }} />
                  <span>Mainnet-Beta</span>
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{ marginTop: '56px', paddingTop: '28px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', fontSize: '12.5px', color: '#64748b' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img
              src="/rare-logo-icon.png"
              alt="RARE Protocol Logo"
              style={{ height: '24px', width: 'auto', maxHeight: '24px', maxWidth: '24px', objectFit: 'contain', display: 'block' }}
              width={24}
              height={24}
            />
            <span style={{ fontWeight: 700, color: '#f8fafc', fontSize: '14px' }}>RARE PROTOCOL</span>
            <span>·</span>
            <span>10,078 Autonomous Solana Agents</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontFamily: 'var(--font-jetbrains), monospace', fontSize: '11px' }}>
            <span>Anchor CPI v0.30</span>
            <span>·</span>
            <span>90% Capital PDA</span>
            <span>·</span>
            <span>© 2026 RARE Protocol</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
