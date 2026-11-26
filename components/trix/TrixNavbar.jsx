'use client';

import React from 'react';
import Link from 'next/link';
import { usePrivy } from '../PrivyClientProvider';

export default function TrixNavbar({ isLightMode, onMintClick }) {
  const { ready, authenticated, user, login, logout } = usePrivy();

  const solanaAccount = user?.linkedAccounts?.find(
    (acc) => acc.type === 'wallet' && (acc.chainType === 'solana' || !acc.address?.startsWith('0x'))
  );
  const activeWallet = solanaAccount || user?.wallet || user?.wallets?.[0];
  const walletAddress = activeWallet?.address;

  const navLinks = [
    { label: 'AGENTS', href: '#agents' },
    { label: 'PIPELINE', href: '#pipeline' },
    { label: 'PROOF', href: '#evidence' },
    { label: 'DEX', href: '#dex' },
    { label: 'MCP', href: '#builders' }
  ];

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '60px',
        zIndex: 50,
        background: 'rgba(5, 7, 6, 0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        alignItems: 'center'
      }}
    >
      <div
        style={{
          maxWidth: '1440px',
          width: '100%',
          margin: '0 auto',
          padding: '0 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '24px'
        }}
      >
        {/* Left: Minimalist Brand (XIVO style) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link
            href="/trix"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              textDecoration: 'none',
              color: '#ffffff'
            }}
          >
            <img
              src="/rare-logo-icon.png"
              alt="RARE Protocol"
              style={{
                width: '22px',
                height: '22px',
                objectFit: 'contain'
              }}
            />
            <span
              style={{
                fontFamily: 'var(--font-jetbrains), monospace',
                fontWeight: 900,
                fontSize: '17px',
                letterSpacing: '0.08em',
                color: '#ffffff'
              }}
            >
              RARE
            </span>
          </Link>

          <Link
            href="/"
            style={{
              padding: '2px 8px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '2px',
              background: 'transparent',
              fontSize: '10px',
              fontFamily: 'var(--font-jetbrains), monospace',
              color: '#71717a',
              textDecoration: 'none',
              letterSpacing: '0.04em'
            }}
            title="Switch to Heurix UI"
          >
            [← HEURIX]
          </Link>
        </div>

        {/* Center: Clean Monospace Nav */}
        <nav
          className="hidden md:flex"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: '11px',
            letterSpacing: '0.08em',
            fontWeight: 600
          }}
        >
          {navLinks.map((item) => (
            <a
              key={item.label}
              href={item.href}
              style={{
                color: '#71717a',
                textDecoration: 'none',
                transition: 'color 0.15s ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#71717a')}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Right: Minimalist XIVO Wallet Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {onMintClick && (
            <button
              type="button"
              onClick={onMintClick}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                background: 'transparent',
                border: '1px solid rgba(34, 197, 94, 0.4)',
                borderRadius: '2px',
                color: '#4ade80',
                padding: '5px 12px',
                fontSize: '11px',
                fontFamily: 'var(--font-jetbrains), monospace',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <span>{'> MINT (0.020 SOL)'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              if (authenticated) {
                logout();
              } else {
                login();
              }
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'transparent',
              color: authenticated ? '#4ade80' : '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '2px',
              padding: '5px 14px',
              fontSize: '11.5px',
              fontFamily: 'var(--font-jetbrains), monospace',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            {authenticated && walletAddress ? (
              <>
                <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#22c55e' }} />
                <span>{walletAddress.slice(0, 4)}...{walletAddress.slice(-4)}</span>
              </>
            ) : authenticated ? (
              <span>0xCONNECTED</span>
            ) : (
              <span>0xCONNECT_WALLET</span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
