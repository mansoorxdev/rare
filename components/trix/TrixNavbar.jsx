'use client';

import React from 'react';
import Link from 'next/link';
import { usePrivy } from '../PrivyClientProvider';
import AsciiScrambleText from './AsciiScrambleText';

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
    { num: '06', label: 'BUILDERS', href: '#builders' }
  ];

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '64px',
        zIndex: 50,
        background: isLightMode ? 'rgba(245, 245, 247, 0.94)' : 'rgba(5, 10, 7, 0.92)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: isLightMode ? '1px solid rgba(0, 0, 0, 0.12)' : '1px solid rgba(34, 197, 94, 0.28)',
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
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px'
        }}
      >
        {/* Left: Brand Icon + Wordmark */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
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
                width: '24px',
                height: '24px',
                objectFit: 'contain',
                filter: 'drop-shadow(0 0 8px rgba(34, 197, 94, 0.9))'
              }}
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span
                style={{
                  fontFamily: 'var(--font-jetbrains), monospace',
                  fontWeight: 900,
                  fontSize: '18px',
                  letterSpacing: '0.12em',
                  color: isLightMode ? '#0f172a' : '#ffffff'
                }}
              >
                RARE
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-jetbrains), monospace',
                  fontSize: '9.5px',
                  color: '#22c55e',
                  border: '1px solid rgba(34, 197, 94, 0.35)',
                  padding: '1px 5px',
                  borderRadius: '2px',
                  background: 'rgba(34, 197, 94, 0.08)'
                }}
              >
                [v2.4_ASCII]
              </span>
            </div>
          </Link>

          {/* Switch to Heurix UI */}
          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '3px 8px',
              border: isLightMode ? '1px solid rgba(0, 0, 0, 0.15)' : '1px solid rgba(34, 197, 94, 0.3)',
              borderRadius: '2px',
              background: isLightMode ? 'rgba(0, 0, 0, 0.03)' : 'rgba(34, 197, 94, 0.06)',
              fontSize: '10px',
              fontFamily: 'var(--font-jetbrains), monospace',
              color: isLightMode ? '#047857' : '#4ade80',
              textDecoration: 'none',
              letterSpacing: '0.06em'
            }}
            title="Switch to Original UI"
          >
            <span>[← HEURIX]</span>
          </Link>
        </div>

        {/* Center: Monospace Nav Links with ASCII Numbering */}
        <nav
          className="hidden xl:flex"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: '11px',
            letterSpacing: '0.06em',
            fontWeight: 700
          }}
        >
          {navLinks.map((item, idx) => (
            <React.Fragment key={item.label}>
              <a
                href={item.href}
                style={{
                  color: isLightMode ? '#475569' : '#94a3b8',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  transition: 'color 0.15s ease'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#22c55e')}
                onMouseLeave={(e) => (e.currentTarget.style.color = isLightMode ? '#475569' : '#94a3b8')}
              >
                <span style={{ color: '#22c55e', opacity: 0.7, fontSize: '9px' }}>{item.num}.</span>
                <span>{item.label}</span>
              </a>
              {idx < navLinks.length - 1 && (
                <span style={{ color: isLightMode ? '#cbd5e1' : 'rgba(34, 197, 94, 0.25)' }}>·</span>
              )}
            </React.Fragment>
          ))}
        </nav>

        {/* Right: Tactical ASCII Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {onMintClick && (
            <button
              type="button"
              onClick={onMintClick}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(34, 197, 94, 0.1)',
                border: '1px solid rgba(34, 197, 94, 0.4)',
                borderRadius: '2px',
                color: isLightMode ? '#047857' : '#4ade80',
                padding: '6px 12px',
                fontSize: '11px',
                fontFamily: 'var(--font-jetbrains), monospace',
                fontWeight: 800,
                letterSpacing: '0.04em',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(34, 197, 94, 0.2)';
                e.currentTarget.style.borderColor = '#22c55e';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(34, 197, 94, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(34, 197, 94, 0.4)';
              }}
            >
              <span>[ > MINT 0.020 SOL < ]</span>
            </button>
          )}

          {/* Minimalist Monospace Wallet Pill matching XIVO '0x424f...38D8' */}
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
              background: authenticated ? '#06200e' : '#041007',
              color: authenticated ? '#4ade80' : '#f8fafc',
              border: authenticated ? '1px solid #22c55e' : '1px solid rgba(255, 255, 255, 0.25)',
              borderRadius: '3px',
              padding: '6px 14px',
              fontSize: '11.5px',
              fontFamily: 'var(--font-jetbrains), monospace',
              fontWeight: 800,
              letterSpacing: '0.06em',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#22c55e';
              e.currentTarget.style.boxShadow = '0 0 12px rgba(34, 197, 94, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = authenticated ? '#22c55e' : 'rgba(255, 255, 255, 0.25)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {authenticated && walletAddress ? (
              <>
                <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 6px #22c55e' }} />
                <span>{walletAddress.slice(0, 4)}...{walletAddress.slice(-4)}</span>
              </>
            ) : authenticated ? (
              <span>[ 0xCONNECTED ]</span>
            ) : (
              <span>[ 0xCONNECT_WALLET ]</span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
