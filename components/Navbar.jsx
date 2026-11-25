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
    <header className="fixed inset-x-0 top-0 z-50 bg-[#eef4fc]/85 backdrop-blur-md border-b border-black/[0.06] transition-colors">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8 max-w-[1360px] mx-auto w-full gap-4">
        {/* Brand Logo & Wordmark */}
        <Link aria-label="RARE Protocol home" className="flex items-center gap-2.5 text-neutral-900 group shrink-0" href="/">
          <img
            src="/rare-logo-icon.png"
            alt="RARE Protocol Logo"
            className="object-contain drop-shadow-sm group-hover:scale-105 transition-transform"
            style={{ height: '28px', width: 'auto', maxHeight: '28px', maxWidth: '28px', objectFit: 'contain', display: 'block', flexShrink: 0 }}
            width={28}
            height={28}
          />
          <span className="font-sans text-[20px] font-bold tracking-tight text-neutral-950">RARE</span>
        </Link>

        {/* Center: Gamma-style Pill Search Bar */}
        <div className="hidden md:flex items-center gap-2.5 rounded-full bg-white/70 hover:bg-white border border-black/[0.08] px-3.5 py-1.5 shadow-sm text-[13px] text-neutral-500 w-full max-w-[340px] lg:max-w-[420px] transition-all focus-within:border-black/30 focus-within:bg-white focus-within:ring-2 focus-within:ring-black/5">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-400 shrink-0">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            placeholder="Search for agents, collections or traits"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            className="bg-transparent border-none outline-none text-[13px] text-neutral-800 placeholder-neutral-400 w-full font-sans"
          />
        </div>

        {/* Navigation Links */}
        <nav aria-label="Main" className="hidden xl:flex items-center gap-6 text-[13.5px] text-neutral-600 font-medium">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors hover:text-black ${
                  isActive ? 'text-black font-semibold' : 'text-neutral-600'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Twitter / X Link */}
          <a
            href="https://x.com/rare_agent?s=11"
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/60 border border-black/[0.08] text-neutral-600 hover:text-black hover:bg-white transition-colors shadow-sm"
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
            className="inline-flex h-9 items-center justify-center rounded-full bg-[#111] hover:bg-black text-white px-5 text-[13px] font-semibold transition-all shadow-sm hover:shadow-md cursor-pointer"
          >
            {authenticated && walletAddress
              ? `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}`
              : 'Connect wallet'}
          </button>

          {/* Hamburger Menu Toggle (Mobile / Tablet) */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/70 border border-black/[0.08] text-neutral-800 hover:bg-white transition-colors cursor-pointer shadow-sm"
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
        <div className="xl:hidden border-t border-black/[0.06] bg-[#eef4fc]/95 backdrop-blur-xl px-5 py-4 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-[14px] font-medium text-neutral-800 hover:text-black py-1"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
