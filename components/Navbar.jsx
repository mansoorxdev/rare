'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { usePrivy } from './PrivyClientProvider';

export default function Navbar() {
  const pathname = usePathname();
  const { authenticated, user, login, logout } = usePrivy();
  const [searchVal, setSearchVal] = useState('');

  // Find active wallet address
  const solanaAccount = user?.linkedAccounts?.find(
    (acc) => acc.type === 'wallet' && (acc.chainType === 'solana' || !acc.address?.startsWith('0x'))
  );
  const activeWallet = solanaAccount || user?.wallet || user?.wallets?.[0];
  const walletAddress = activeWallet?.address;

  const navLinks = [
    { label: 'Explore', href: '/roster' },
    { label: 'Price Ladder', href: '/ladder' },
    { label: 'PDA Specs', href: '/specs' },
    { label: 'Terminal', href: '/terminal' },
    { label: 'Whitepaper', href: '/whitepaper' },
  ];

  return (
    <header className="gamma-navbar">
      <div className="gamma-navbar-inner">
        {/* Left Zone: Brand Logo, Solana Network Pill, and Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flex: 1, maxWidth: '680px' }}>
          <Link aria-label="RARE Protocol home" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: '#ffffff', flexShrink: 0 }} href="/">
            <img
              src="/rare-logo-icon.png"
              alt="RARE Protocol Logo"
              style={{ height: '26px', width: 'auto', maxHeight: '26px', objectFit: 'contain', display: 'block' }}
              width={26}
              height={26}
            />
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: '20px', fontWeight: 800, letterSpacing: '-0.03em', color: '#ffffff' }}>
              RARE
            </span>
          </Link>

          {/* Rarible Solana Network Pill */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 10px',
            borderRadius: '9999px',
            background: '#18191b',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            fontSize: '11.5px',
            fontFamily: 'var(--font-jetbrains), monospace',
            color: '#ffffff',
            fontWeight: 600,
            flexShrink: 0
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '9999px', background: '#10b981', display: 'inline-block' }} />
            <span>Solana</span>
          </div>

          {/* Rarible Global Search Pill */}
          <div className="gamma-search-pill" style={{ display: 'none' }} id="gamma-desktop-search">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#6b7280', flexShrink: 0 }}>
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              placeholder="Search agents, collections or traits..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="gamma-search-input"
            />
            <span style={{
              fontSize: '10.5px',
              fontFamily: 'var(--font-jetbrains), monospace',
              color: '#6b7280',
              background: '#222326',
              padding: '2px 6px',
              borderRadius: '4px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              flexShrink: 0
            }}>
              ⌘K
            </span>
          </div>
        </div>

        {/* Right Zone: Nav links, Twitter, Connect Wallet Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          {/* Navigation Links */}
          <nav aria-label="Main" className="hidden lg:flex" style={{ display: 'flex', alignItems: 'center', gap: '22px' }}>
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    fontSize: '13.5px',
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? '#ffffff' : '#9ca3af',
                    textDecoration: 'none',
                    transition: 'color 0.15s ease'
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Twitter / X Link */}
          <a
            href="https://x.com/rare_agent?s=11"
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'inline-flex',
              height: '36px',
              width: '36px',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '9999px',
              background: '#18191b',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              color: '#ffffff',
              textDecoration: 'none',
              transition: 'all 0.15s ease'
            }}
            title="Follow RARE Protocol on X"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>

          {/* Solid White Pill Privy Wallet Button */}
          <button
            type="button"
            onClick={() => (authenticated ? logout() : login())}
            className="gamma-btn-black"
          >
            {authenticated && walletAddress
              ? `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}`
              : 'Connect wallet'}
          </button>
        </div>
      </div>

      <style jsx>{`
        @media (min-width: 768px) {
          #gamma-desktop-search {
            display: flex !important;
          }
        }
      `}</style>
    </header>
  );
}
