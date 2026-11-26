'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { usePrivy } from './PrivyClientProvider';

export default function Navbar({ onMintClick }) {
  const pathname = usePathname();
  const { authenticated, user, login, logout } = usePrivy();

  // Find active wallet address
  const solanaAccount = user?.linkedAccounts?.find(
    (acc) => acc.type === 'wallet' && (acc.chainType === 'solana' || !acc.address?.startsWith('0x'))
  );
  const activeWallet = solanaAccount || user?.wallet || user?.wallets?.[0];
  const walletAddress = activeWallet?.address;

  const navLinks = [
    { label: 'Explore agents', href: '/roster' },
    { label: 'Bonding ladder', href: '/ladder' },
    { label: 'Anchor specs', href: '/specs' },
    { label: 'Docs', href: '/whitepaper' },
  ];

  return (
    <header className="heurix-navbar">
      <div className="heurix-navbar-inner">
        {/* Left: Brand Icon & Wordmark */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Link
            aria-label="RARE Protocol home"
            style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: '#f4f1ea' }}
            href="/"
          >
            <img
              src="/rare-logo-icon.png"
              alt="RARE Protocol Logo"
              style={{ height: '26px', width: 'auto', maxHeight: '26px', objectFit: 'contain', display: 'block' }}
              width={26}
              height={26}
            />
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: '20px', fontWeight: 800, letterSpacing: '-0.03em', color: '#f4f1ea' }}>
              rare
            </span>
          </Link>

          {/* Solana Pill */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '3px 10px',
            borderRadius: '9999px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            fontSize: '11px',
            fontFamily: 'var(--font-jetbrains), monospace',
            color: '#949a9f',
            fontWeight: 600
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '9999px', background: '#10b981', display: 'inline-block' }} />
            <span>Solana</span>
          </div>
        </div>

        {/* Center: Nav links */}
        <nav aria-label="Main" className="hidden md:flex" style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  fontSize: '13.5px',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? '#f4f1ea' : '#949a9f',
                  textDecoration: 'none',
                  transition: 'color 0.15s ease'
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right: Twitter & Amber Launch / Mint Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {/* Twitter / X */}
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
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              color: '#f4f1ea',
              textDecoration: 'none',
              transition: 'all 0.15s ease'
            }}
            title="Follow RARE Protocol on X"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>

          {/* Golden Amber Connect Wallet CTA */}
          <button
            type="button"
            onClick={() => {
              if (!authenticated) {
                login();
              } else {
                logout();
              }
            }}
            className="heurix-btn-amber"
            style={{ padding: '8px 18px', fontSize: '13px' }}
          >
            {authenticated && walletAddress ? (
              <span>{walletAddress.slice(0, 4)}...{walletAddress.slice(-4)}</span>
            ) : authenticated ? (
              <span>Connected</span>
            ) : (
              <span>Connect wallet</span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
