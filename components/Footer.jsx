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

      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
        <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link>
        <Link href="/roster" style={{ color: 'inherit', textDecoration: 'none' }}>Agent Roster</Link>
        <Link href="/ladder" style={{ color: 'inherit', textDecoration: 'none' }}>Price Ladder</Link>
        <Link href="/specs" style={{ color: 'inherit', textDecoration: 'none' }}>PDA Specs</Link>
        <Link href="/terminal" style={{ color: 'inherit', textDecoration: 'none' }}>Terminal</Link>
        <Link href="/whitepaper" style={{ color: 'inherit', textDecoration: 'none' }}>Whitepaper</Link>
        <a href="https://solscan.io/account/3ivjUQCmaykSnGeCkuy8yViw82umrfDCmXkxtWSeqyEk" target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
          Solscan ↗
        </a>
      </div>
    </footer>
  );
}
