'use client';

import React, { useState } from 'react';
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
    { label: 'OVERVIEW', href: '#overview' },
    { label: 'SWARM ROSTER', href: '#roster' },
    { label: 'BONDING LADDER', href: '#ladder' },
    { label: 'PROCESS', href: '#process' },
    { label: 'EVIDENCE', href: '#evidence' },
    { label: 'DEX // $RARE', href: '#dex' },
    { label: 'FOR BUILDERS', href: '#builders' }
  ];

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '68px',
        zIndex: 50,
        background: isLightMode ? 'rgba(245, 245, 247, 0.88)' : 'rgba(4, 18, 8, 0.82)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: isLightMode ? '1px solid rgba(0, 0, 0, 0.08)' : '1px solid rgba(34, 197, 94, 0.2)',
        display: 'flex',
        alignItems: 'center',
        transition: 'background 0.5s ease, border-color 0.5s ease'
      }}
    >
      <div
        style={{
          maxWidth: '1440px',
          width: '100%',
          margin: '0 auto',
          padding: '0 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '24px'
        }}
      >
        {/* Left: Brand Icon + Wordmark */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link
            href="/trix"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              textDecoration: 'none',
              color: isLightMode ? '#0f172a' : '#f8fafc'
            }}
          >
            <img
              src="/rare-logo-icon.png"
              alt="RARE Protocol"
              style={{
                width: '28px',
                height: '28px',
                objectFit: 'contain',
                filter: 'drop-shadow(0 0 10px rgba(34, 197, 94, 0.8))'
              }}
            />
            <span
              style={{
                fontFamily: 'var(--font-jetbrains), monospace',
                fontWeight: 900,
                fontSize: '20px',
                letterSpacing: '0.06em',
                color: isLightMode ? '#0f172a' : '#ffffff'
              }}
            >
              RARE
            </span>
          </Link>

          {/* Tactical Switch to Heurix UI */}
          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '3px 10px',
              borderRadius: '6px',
              background: isLightMode ? 'rgba(0, 0, 0, 0.05)' : 'rgba(34, 197, 94, 0.08)',
              border: isLightMode ? '1px solid rgba(0, 0, 0, 0.1)' : '1px solid rgba(34, 197, 94, 0.25)',
              fontSize: '10.5px',
              fontFamily: 'var(--font-jetbrains), monospace',
              color: isLightMode ? '#047857' : '#4ade80',
              textDecoration: 'none',
              letterSpacing: '0.06em'
            }}
            title="Switch to Heurix UI"
          >
            <span>← HEURIX UI</span>
          </Link>
        </div>

        {/* Center: Slash Navigation */}
        <nav
          className="hidden xl:flex"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: '11px',
            letterSpacing: '0.08em',
            fontWeight: 700
          }}
        >
          {navLinks.map((item, idx) => (
            <React.Fragment key={item.label}>
              <a
                href={item.href}
                style={{
                  color: isLightMode ? '#475569' : '#86efac',
                  textDecoration: 'none',
                  opacity: 0.85,
                  transition: 'opacity 0.15s ease'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.85')}
              >
                {item.label}
              </a>
              {idx < navLinks.length - 1 && (
                <span style={{ color: isLightMode ? '#cbd5e1' : 'rgba(34, 197, 94, 0.35)' }}>/</span>
              )}
            </React.Fragment>
          ))}
        </nav>

        {/* Right: Mint & Connect Wallet CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {onMintClick && (
            <button
              type="button"
              onClick={onMintClick}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(34, 197, 94, 0.15)',
                border: '1px solid rgba(34, 197, 94, 0.4)',
                borderRadius: '6px',
                color: isLightMode ? '#047857' : '#4ade80',
                padding: '8px 14px',
                fontSize: '11.5px',
                fontFamily: 'var(--font-jetbrains), monospace',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <span>MINT AGENT (0.020 SOL)</span>
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
              gap: '8px',
              background: authenticated ? '#15803d' : '#22c55e',
              color: '#000000',
              fontWeight: 800,
              fontSize: '12px',
              fontFamily: 'var(--font-jetbrains), monospace',
              letterSpacing: '0.08em',
              padding: '10px 18px',
              border: 'none',
              clipPath: 'polygon(8px 0%, 100% 0%, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0% 100%, 0% 8px)',
              cursor: 'pointer',
              boxShadow: '0 0 16px rgba(34, 197, 94, 0.45)',
              transition: 'all 0.15s ease'
            }}
          >
            {authenticated && walletAddress ? (
              <>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ffffff' }} />
                <span>{walletAddress.slice(0, 4)}...{walletAddress.slice(-4)}</span>
              </>
            ) : authenticated ? (
              <span>CONNECTED</span>
            ) : (
              <span>CONNECT WALLET</span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
