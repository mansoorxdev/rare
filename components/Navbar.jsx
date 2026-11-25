'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { usePrivy } from './PrivyClientProvider';

export default function Navbar() {
  const pathname = usePathname();
  const { authenticated, user, login, logout } = usePrivy();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');

  // Find active wallet address
  const solanaAccount = user?.linkedAccounts?.find(
    (acc) => acc.type === 'wallet' && (acc.chainType === 'solana' || !acc.address?.startsWith('0x'))
  );
  const activeWallet = solanaAccount || user?.wallet || user?.wallets?.[0];
  const walletAddress = activeWallet?.address;

  const navLinks = [
    { label: 'Swarm Roster', href: '/roster' },
    { label: 'Price Ladder', href: '/ladder' },
    { label: 'PDA Specs', href: '/specs' },
    { label: 'Terminal', href: '/terminal' },
    { label: 'Whitepaper', href: '/whitepaper' },
  ];

  return (
    <header className="gamma-navbar">
      <div className="gamma-navbar-inner">
        {/* Brand Logo & Wordmark (Gamma exact position) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <Link aria-label="RARE Protocol home" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: '#0f172a' }} href="/">
            <img
              src="/rare-logo-icon.png"
              alt="RARE Protocol Logo"
              style={{ height: '26px', width: 'auto', maxHeight: '26px', objectFit: 'contain', display: 'block' }}
              width={26}
              height={26}
            />
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: '20px', fontWeight: 800, letterSpacing: '-0.03em', color: '#0f172a' }}>
              RARE
            </span>
          </Link>

          {/* Gamma-style Pill Search Bar */}
          <div className="gamma-search-pill" style={{ display: 'none' }} id="gamma-desktop-search">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#94a3b8', flexShrink: 0 }}>
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              placeholder="Search for agents, collections or traits"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="gamma-search-input"
            />
          </div>
        </div>

        {/* Right Section: Nav links, Twitter, Privy Wallet Pill, Hamburger */}
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
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? '#0f172a' : '#475569',
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
              background: 'rgba(255, 255, 255, 0.75)',
              border: '1px solid rgba(15, 23, 42, 0.1)',
              color: '#0f172a',
              textDecoration: 'none'
            }}
            title="Follow RARE Protocol on X"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>

          {/* Gamma-style Solid Black Pill Privy Wallet Button */}
          <button
            type="button"
            onClick={() => (authenticated ? logout() : login())}
            className="gamma-btn-black"
          >
            {authenticated && walletAddress
              ? `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}`
              : 'Connect wallet'}
          </button>

          {/* Hamburger Menu Toggle (Mobile / Tablet) */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden"
            style={{
              display: 'inline-flex',
              height: '36px',
              width: '36px',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '9999px',
              background: 'rgba(255, 255, 255, 0.75)',
              border: '1px solid rgba(15, 23, 42, 0.1)',
              color: '#0f172a',
              cursor: 'pointer'
            }}
            aria-label="Toggle navigation menu"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div style={{
          position: 'absolute',
          top: '68px',
          left: 0,
          right: 0,
          background: 'rgba(240, 246, 254, 0.98)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(15, 23, 42, 0.08)',
          padding: '16px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                fontSize: '14.5px',
                fontWeight: 600,
                color: '#0f172a',
                textDecoration: 'none',
                padding: '4px 0'
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
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
