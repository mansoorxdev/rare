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
    <header className="fixed inset-x-0 top-0 z-50 border-b border-zinc-800/80 bg-[#090a0f]/85 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-4 md:px-8 max-w-[1280px] mx-auto w-full">
        {/* Brand Logo & Wordmark */}
        <Link aria-label="RARE Protocol home" className="flex items-center gap-2.5 text-white group shrink-0" href="/">
          <img
            src="/rare-logo-icon.png"
            alt="RARE Protocol Logo"
            className="object-contain drop-shadow-[0_0_12px_rgba(16,185,129,0.4)] group-hover:scale-105 transition-transform"
            style={{ height: '26px', width: 'auto', maxHeight: '26px', maxWidth: '26px', objectFit: 'contain', display: 'block', flexShrink: 0 }}
            width={26}
            height={26}
          />
          <div className="flex items-center gap-2">
            <span className="font-sans text-[17px] tracking-tight font-bold text-white">RARE</span>
            <span className="hidden sm:inline-flex px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              v2.4
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav aria-label="Main" className="hidden sm:flex items-center gap-6 text-[13px] text-zinc-400">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors font-medium ${
                  isActive ? 'text-white font-semibold' : 'text-zinc-400 hover:text-zinc-100'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Twitter / X Link */}
          <a
            href="https://x.com/rare_agent?s=11"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700 hover:text-white transition-colors"
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
            className="inline-flex h-8.5 items-center justify-center rounded-lg bg-zinc-100 px-4 text-[12.5px] font-semibold text-zinc-950 transition-all hover:bg-white hover:shadow-[0_0_15px_rgba(255,255,255,0.15)] cursor-pointer"
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
