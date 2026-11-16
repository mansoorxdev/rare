'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { usePrivy } from './PrivyClientProvider';

export default function Navbar() {
  const pathname = usePathname();
  const { authenticated, user, login, logout } = usePrivy();

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

        <div className="sa-right">
          <button
            type="button"
            onClick={() => (authenticated ? logout() : login())}
            className="btn-primary"
          >
            {authenticated && user?.wallet?.address
              ? `${user.wallet.address.slice(0, 4)}...${user.wallet.address.slice(-4)}`
              : 'Connect Wallet'}
          </button>
        </div>
      </div>
    </header>
  );
}
