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
    { num: '01', label: 'OVERVIEW', href: '#overview' },
    { num: '02', label: 'SWARM_ROSTER', href: '#roster' },
    { num: '03', label: 'BONDING_LADDER', href: '#ladder' },
    { num: '04', label: 'EVIDENCE', href: '#evidence' },
    { num: '05', label: 'DEX_$RARE', href: '#dex' },
    { num: '06', label: 'FOR_BUILDERS', href: '#builders' }
  ];

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '66px',
        zIndex: 50,
        background: isLightMode ? 'rgba(245, 245, 247, 0.92)' : 'rgba(4, 18, 8, 0.88)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: isLightMode ? '1px solid rgba(0, 0, 0, 0.1)' : '1px solid rgba(34, 197, 94, 0.3)',
        display: 'flex',
        alignItems: 'center',
        transition: 'background 0.4s ease, border-color 0.4s ease'
      }}
    >
      <div
        style={{
          maxWidth: '1440px',
          width: '100%',
          margin: '0 auto',
          padding: '0 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px'
        }}
      >
        {/* Left: Brand Icon + Wordmark + Tactical ASCII Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0, whiteSpace: 'nowrap' }}>
          <Link
            href="/trix"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              textDecoration: 'none',
              color: isLightMode ? '#0f172a' : '#f8fafc',
              whiteSpace: 'nowrap',
              flexShrink: 0
            }}
          >
            <img
              src="/rare-logo-icon.png"
              alt="RARE Protocol"
              style={{
                width: '24px',
                height: '24px',
                objectFit: 'contain',
                filter: 'drop-shadow(0 0 10px rgba(34, 197, 94, 0.85))'
              }}
            />
            <span
              style={{
                fontFamily: 'var(--font-jetbrains), monospace',
                fontWeight: 900,
                fontSize: '18px',
                letterSpacing: '0.08em',
                color: isLightMode ? '#0f172a' : '#ffffff'
              }}
            >
              RARE
            </span>
            <span
              style={{
                fontFamily: 'var(--font-jetbrains), monospace',
                fontSize: '9px',
                color: '#22c55e',
                border: '1px solid rgba(34, 197, 94, 0.35)',
                padding: '1px 5px',
                borderRadius: '2px',
                background: 'rgba(34, 197, 94, 0.1)',
                whiteSpace: 'nowrap'
              }}
            >
              [v2.4_ASCII]
            </span>
          </Link>

          {/* Tactical Switch to Heurix UI */}
          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '3px 8px',
              borderRadius: '2px',
              background: isLightMode ? 'rgba(0, 0, 0, 0.05)' : 'rgba(34, 197, 94, 0.08)',
              border: isLightMode ? '1px solid rgba(0, 0, 0, 0.1)' : '1px solid rgba(34, 197, 94, 0.3)',
              fontSize: '10px',
              fontFamily: 'var(--font-jetbrains), monospace',
              color: isLightMode ? '#047857' : '#4ade80',
              textDecoration: 'none',
              letterSpacing: '0.04em',
              whiteSpace: 'nowrap',
              flexShrink: 0
            }}
            title="Switch to Heurix UI"
          >
            <span>[← HEURIX UI]</span>
          </Link>
        </div>

        {/* Center: ASCII Delimited Navigation */}
        <nav
          className="hidden xl:flex items-center"
          style={{
            gap: '10px',
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: '10.5px',
            letterSpacing: '0.05em',
            fontWeight: 700,
            whiteSpace: 'nowrap',
            flexShrink: 1
          }}
        >
          {navLinks.map((item, idx) => (
            <React.Fragment key={item.label}>
              <a
                href={item.href}
                style={{
                  color: isLightMode ? '#475569' : '#86efac',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '3px',
                  opacity: 0.88,
                  whiteSpace: 'nowrap',
                  transition: 'opacity 0.15s ease'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.88')}
              >
                <span style={{ color: '#22c55e', opacity: 0.7, fontSize: '9px' }}>{item.num}.</span>
                <span>{item.label}</span>
              </a>
              {idx < navLinks.length - 1 && (
                <span style={{ color: isLightMode ? '#cbd5e1' : 'rgba(34, 197, 94, 0.35)' }}>·</span>
              )}
            </React.Fragment>
          ))}
        </nav>

        {/* Right: ASCII Mint & Wallet CTAs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0, whiteSpace: 'nowrap' }}>
          {onMintClick && (
            <button
              type="button"
              onClick={onMintClick}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                background: 'rgba(34, 197, 94, 0.12)',
                border: '1px solid rgba(34, 197, 94, 0.45)',
                borderRadius: '3px',
                color: isLightMode ? '#047857' : '#4ade80',
                padding: '6px 11px',
                fontSize: '11px',
                fontFamily: 'var(--font-jetbrains), monospace',
                fontWeight: 800,
                letterSpacing: '0.03em',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(34, 197, 94, 0.22)';
                e.currentTarget.style.borderColor = '#22c55e';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(34, 197, 94, 0.12)';
                e.currentTarget.style.borderColor = 'rgba(34, 197, 94, 0.45)';
              }}
            >
              <span>{"[ > MINT 0.020 SOL < ]"}</span>
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
              justifyContent: 'center',
              gap: '6px',
              background: authenticated ? '#06200e' : '#22c55e',
              color: authenticated ? '#4ade80' : '#000000',
              fontWeight: 900,
              fontSize: '11px',
              fontFamily: 'var(--font-jetbrains), monospace',
              letterSpacing: '0.04em',
              padding: '6px 13px',
              border: '1px solid #22c55e',
              borderRadius: '3px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              boxShadow: '0 0 14px rgba(34, 197, 94, 0.35)',
              transition: 'all 0.15s ease'
            }}
          >
            {authenticated && walletAddress ? (
              <>
                <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 6px #22c55e' }} />
                <span>{`[ 0x${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)} ]`}</span>
              </>
            ) : authenticated ? (
              <span>{"[ 0xCONNECTED ]"}</span>
            ) : (
              <span>{"[ 0xCONNECT_WALLET ]"}</span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
