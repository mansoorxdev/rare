'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { usePrivy } from './PrivyClientProvider';

export default function Navbar() {
  const pathname = usePathname();
  const { authenticated, user, login, logout } = usePrivy();

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
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-black/85 backdrop-blur-md" style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, borderBottom: '1px solid rgba(246, 239, 226, 0.09)', backgroundColor: 'rgba(5, 5, 5, 0.85)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>
      <div className="flex h-16 items-center justify-between px-4 md:px-8 max-w-[1280px] mx-auto w-full" style={{ display: 'flex', height: '64px', alignItems: 'center', justifyContent: 'space-between', paddingLeft: '24px', paddingRight: '24px', maxWidth: '1280px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
        {/* Brand Logo & Wordmark */}
        <Link aria-label="RARE Protocol home" className="flex items-center gap-2.5 text-cream group shrink-0" href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', flexShrink: 0 }}>
          <img
            src="/rare-logo-icon.png"
            alt="RARE Protocol Logo"
            className="object-contain drop-shadow-[0_0_10px_rgba(0,229,153,0.35)] group-hover:scale-105 transition-transform"
            style={{ height: '26px', width: 'auto', maxHeight: '26px', maxWidth: '26px', objectFit: 'contain', display: 'block', flexShrink: 0 }}
            width={26}
            height={26}
          />
          <span className="font-serif text-[18px] tracking-[0.06em] font-medium" style={{ fontFamily: 'var(--font-cormorant), Georgia, serif', fontSize: '19px', fontWeight: 600, letterSpacing: '0.06em', color: '#f6efe2', whiteSpace: 'nowrap' }}>RARE</span>
        </Link>

        {/* Navigation Links */}
        <nav aria-label="Main" className="hidden sm:flex items-center gap-6 text-[13px] text-muted" style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'nowrap' }}>
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors hover:text-cream ${
                  isActive ? 'text-cream font-medium' : 'text-muted'
                }`}
                style={{
                  whiteSpace: 'nowrap',
                  textDecoration: 'none',
                  fontSize: '13px',
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? '#f6efe2' : '#bdaeb2',
                  transition: 'color 0.15s'
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3 shrink-0" style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
          {/* Twitter / X Link */}
          <a
            href="https://x.com/rare_agent?s=11"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex h-8 w-8 items-center justify-center rounded-md border border-line bg-surface-1 text-muted hover:border-line-strong hover:text-cream transition-colors"
            title="Follow RARE Protocol on X"
            style={{
              display: 'inline-flex',
              height: '32px',
              width: '32px',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '6px',
              border: '1px solid rgba(246, 239, 226, 0.09)',
              backgroundColor: '#0c090b',
              color: '#bdaeb2',
              textDecoration: 'none'
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>

          {/* Privy Web3 Auth Button */}
          <button
            type="button"
            onClick={() => (authenticated ? logout() : login())}
            className="inline-flex h-8 items-center justify-center rounded-full bg-cream px-4 text-[13px] font-medium text-black transition-colors hover:bg-cream/90 cursor-pointer shadow-sm"
            style={{
              display: 'inline-flex',
              height: '32px',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '9999px',
              backgroundColor: '#f6efe2',
              paddingLeft: '16px',
              paddingRight: '16px',
              fontSize: '13px',
              fontWeight: 600,
              color: '#050505',
              border: 'none',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
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
