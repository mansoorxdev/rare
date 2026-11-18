'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { usePrivy } from './PrivyClientProvider';

export default function Navbar() {
  const pathname = usePathname();
  const { authenticated, user, login, logout } = usePrivy();
  
  // Prioritize Solana chain address for multichain wallets
  const solanaAccount = user?.linkedAccounts?.find(
    (acc) => acc.type === 'wallet' && (acc.chainType === 'solana' || !acc.address?.startsWith('0x'))
  );
  const activeWallet = solanaAccount || user?.wallet || user?.wallets?.[0];
  const walletAddress = activeWallet?.address;

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Agent Roster', href: '/roster' },
    { label: 'Price Ladder', href: '/ladder' },
    { label: 'Console Terminal', href: '/terminal' },
    { label: 'PDA Specs', href: '/specs' },
    { label: 'Whitepaper', href: '/whitepaper' },
  ];

  return (
    <header className="sa-nav">
      <div className="sa-nav-in">
        <Link href="/" className="sa-brand">
          <span className="sa-brand-icon">
            <img src="/rare-logo-icon.png" alt="RARE Protocol" />
          </span>
          <span>RARE PROTOCOL</span>
        </Link>

        <nav className="sa-links">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={isActive ? 'active' : ''}
                style={{
                  color: isActive ? 'var(--ink)' : 'var(--dim)',
                  borderBottom: isActive ? '2px solid var(--script-green)' : 'none',
                  paddingBottom: '2px',
                  fontWeight: isActive ? 700 : 600,
                  transition: 'color 0.15s, border-color 0.15s',
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="sa-right" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <a
            href="https://x.com"
            target="_blank"
            rel="noreferrer"
            className="btn-twitter-black"
            title="Follow RARE Protocol on X"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            <span>Twitter</span>
          </a>

          <button
            type="button"
            onClick={() => (authenticated ? logout() : login())}
            className="btn-primary"
          >
            {authenticated && walletAddress
              ? `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}`
              : 'Connect Wallet'}
          </button>
        </div>
      </div>
    </header>
  );
}
