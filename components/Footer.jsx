'use client';

import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{ borderTop: '2px solid var(--hair-dark)', padding: '36px 0 48px', fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--dim)', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px', maxWidth: '1200px', margin: '0 auto', paddingLeft: '20px', paddingRight: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span className="sa-brand-icon" style={{ width: '24px', height: '24px', padding: '2px', boxShadow: 'none' }}>
          <img src="/rare-logo-icon.png" alt="RARE" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </span>
        <span>
          <b style={{ color: 'var(--ink)' }}>RARE PROTOCOL</b> • 10,078 Autonomous AI Agents on Solana
        </span>
      </div>

      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'center' }}>
        <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link>
        <Link href="/roster" style={{ color: 'inherit', textDecoration: 'none' }}>Agent Roster</Link>
        <Link href="/ladder" style={{ color: 'inherit', textDecoration: 'none' }}>Price Ladder</Link>
        <Link href="/specs" style={{ color: 'inherit', textDecoration: 'none' }}>PDA Specs</Link>
        <Link href="/terminal" style={{ color: 'inherit', textDecoration: 'none' }}>Terminal</Link>
        <Link href="/whitepaper" style={{ color: 'inherit', textDecoration: 'none' }}>Whitepaper</Link>
        <a
          href="https://x.com"
          target="_blank"
          rel="noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: '#141418',
            color: '#fff',
            padding: '3px 8px',
            fontSize: '11px',
            fontWeight: 700,
            textDecoration: 'none',
            border: '1px solid var(--hair-dark)'
          }}
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          <span>Twitter</span>
        </a>
        <a href="https://solscan.io/account/3ivjUQCmaykSnGeCkuy8yViw82umrfDCmXkxtWSeqyEk" target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
          Solscan ↗
        </a>
      </div>
    </footer>
  );
}
