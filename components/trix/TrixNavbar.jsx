'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function TrixNavbar({ isLightMode }) {
  const [walletConnected, setWalletConnected] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const navLinks = [
    { label: 'OVERVIEW', href: '#overview' },
    { label: 'PROCESS', href: '#process' },
    { label: 'EVIDENCE', href: '#evidence' },
    { label: 'FOR BUILDERS', href: '#builders' },
    { label: 'METRICS', href: '#metrics' },
    { label: 'COMPARE', href: '#compare' },
    { label: 'LAUNCH APP', href: '/' }
  ];

  return (
    <>
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '68px',
          zIndex: 50,
          background: isLightMode ? 'rgba(245, 245, 247, 0.85)' : 'rgba(5, 24, 10, 0.75)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: isLightMode ? '1px solid rgba(0, 0, 0, 0.08)' : '1px solid rgba(34, 197, 94, 0.15)',
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
            className="hidden lg:flex"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              fontFamily: 'var(--font-jetbrains), monospace',
              fontSize: '11.5px',
              letterSpacing: '0.08em',
              fontWeight: 600
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

          {/* Right: Tactical Connect Wallet Button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              type="button"
              onClick={() => {
                if (walletConnected) {
                  setWalletConnected(false);
                } else {
                  setShowModal(true);
                }
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: walletConnected ? '#15803d' : '#22c55e',
                color: '#000000',
                fontWeight: 800,
                fontSize: '12px',
                fontFamily: 'var(--font-jetbrains), monospace',
                letterSpacing: '0.08em',
                padding: '10px 20px',
                border: 'none',
                clipPath: 'polygon(8px 0%, 100% 0%, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0% 100%, 0% 8px)',
                cursor: 'pointer',
                boxShadow: '0 0 16px rgba(34, 197, 94, 0.45)',
                transition: 'all 0.15s ease'
              }}
            >
              {walletConnected ? (
                <>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ffffff' }} />
                  <span>7xK9...3bF2</span>
                </>
              ) : (
                <span>CONNECT WALLET</span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Simulated Tactical Wallet Modal */}
      {showModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            style={{
              background: '#07180c',
              border: '1px solid #22c55e',
              borderRadius: '14px',
              padding: '28px',
              maxWidth: '400px',
              width: '100%',
              boxShadow: '0 0 32px rgba(34, 197, 94, 0.3)',
              fontFamily: 'var(--font-jetbrains), monospace'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#4ade80', letterSpacing: '0.1em' }}>
                SELECT SOLANA WALLET
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '16px', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {['Phantom', 'Solflare', 'Backpack', 'Coinbase Wallet'].map((w) => (
                <button
                  key={w}
                  type="button"
                  onClick={() => {
                    setWalletConnected(true);
                    setShowModal(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    background: 'rgba(34, 197, 94, 0.08)',
                    border: '1px solid rgba(34, 197, 94, 0.25)',
                    borderRadius: '8px',
                    color: '#f8fafc',
                    fontSize: '12.5px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(34, 197, 94, 0.2)';
                    e.currentTarget.style.borderColor = '#22c55e';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(34, 197, 94, 0.08)';
                    e.currentTarget.style.borderColor = 'rgba(34, 197, 94, 0.25)';
                  }}
                >
                  <span style={{ fontWeight: 600 }}>{w}</span>
                  <span style={{ color: '#4ade80', fontSize: '11px' }}>CONNECT →</span>
                </button>
              ))}
            </div>

            <div style={{ marginTop: '20px', fontSize: '10.5px', color: '#64748b', textAlign: 'center' }}>
              TACTICAL RADAR PREVIEW // NO REAL FUNDS SIGNED
            </div>
          </div>
        </div>
      )}
    </>
  );
}
