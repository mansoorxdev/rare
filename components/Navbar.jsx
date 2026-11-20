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
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-black/75 backdrop-blur-md">
      <div className="flex h-16 items-center gap-5 px-4 md:px-6 max-w-[1280px] mx-auto w-full">
        {/* Brand Logo & Wordmark */}
        <Link aria-label="RARE Protocol home" className="flex items-center gap-2.5 text-cream group" href="/">
          <svg viewBox="-284 -138 433 277" className="h-3.5 w-auto text-cream group-hover:text-mint transition-colors" aria-hidden="true" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M-283 -10 L-110 -10 Q-42 -10 -45.1 -30.9 L-75.6 -61.4 L-61.4 -75.6 L-30.9 -45.1 Q-10 -42 -10 -110 L-10 -137 L10 -137 L10 -110 Q10 -42 30.9 -45.1 L61.4 -75.6 L75.6 -61.4 L45.1 -30.9 Q42 -10 110 -10 L148 -10 L148 10 L110 10 Q42 10 45.1 30.9 L75.6 61.4 L61.4 75.6 L30.9 45.1 Q10 42 10 110 L10 138 L-10 138 L-10 110 Q-10 42 -30.9 45.1 L-61.4 75.6 L-75.6 61.4 L-45.1 30.9 Q-42 10 -110 10 L-283 10 Z M-48 0 L0 -48 L48 0 L0 48 Z"
            />
          </svg>
          <span className="font-serif text-[18px] tracking-[0.06em] font-medium">RARE</span>
        </Link>

        {/* Navigation Links */}
        <nav aria-label="Main" className="hidden sm:flex items-center gap-5 text-[13px] text-muted">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors hover:text-cream ${
                  isActive ? 'text-cream font-medium' : 'text-muted'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="ml-auto flex items-center gap-2.5">
          {/* Twitter / X Link */}
          <a
            href="https://x.com"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex h-8 w-8 items-center justify-center rounded-md border border-line bg-surface-1 text-muted hover:border-line-strong hover:text-cream transition-colors"
            title="Follow RARE Protocol on X"
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
