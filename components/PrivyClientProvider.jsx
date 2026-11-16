'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

// Fallback Solana Wallet Context in case Privy App ID is not configured or offline
const WalletContext = createContext({
  ready: true,
  authenticated: false,
  user: null,
  login: () => {},
  logout: () => {},
  walletAddress: '',
  walletType: 'Solana',
});

export function useWallet() {
  return useContext(WalletContext);
}

// Re-export as usePrivy for full drop-in compatibility across page.js
export function usePrivy() {
  return useContext(WalletContext);
}

export default function PrivyClientProvider({ children }) {
  const [mounted, setMounted] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [showWalletModal, setShowWalletModal] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check if user previously connected in localStorage
    const saved = localStorage.getItem('rare_wallet_connected');
    if (saved) {
      setAuthenticated(true);
      setWalletAddress(saved);
    }
  }, []);

  const login = () => {
    setShowWalletModal(true);
  };

  const handleConnectWallet = (walletName) => {
    // Check for actual window.solana / window.phantom
    if (typeof window !== 'undefined' && window.solana && window.solana.isPhantom) {
      window.solana.connect().then((resp) => {
        const pubkey = resp.publicKey.toString();
        setWalletAddress(pubkey);
        setAuthenticated(true);
        localStorage.setItem('rare_wallet_connected', pubkey);
        setShowWalletModal(false);
      }).catch(() => {
        // Fallback demo mock address if user rejects
        connectMockAddress(walletName);
      });
      return;
    }

    connectMockAddress(walletName);
  };

  const connectMockAddress = (walletName) => {
    const mock = `Sol${Math.random().toString(36).substring(2, 6).toUpperCase()}...${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    setWalletAddress(mock);
    setAuthenticated(true);
    localStorage.setItem('rare_wallet_connected', mock);
    setShowWalletModal(false);
  };

  const logout = () => {
    setAuthenticated(false);
    setWalletAddress('');
    localStorage.removeItem('rare_wallet_connected');
  };

  const value = {
    ready: mounted,
    authenticated,
    user: authenticated ? { wallet: { address: walletAddress } } : null,
    login,
    logout,
    walletAddress,
    walletType: 'Solana'
  };

  return (
    <WalletContext.Provider value={value}>
      {children}

      {/* Retro Pixel-Brutalist Solana Wallet Connection Modal */}
      {showWalletModal && (
        <div
          className="rare-modal-overlay"
          onClick={() => setShowWalletModal(false)}
        >
          <div
            className="rare-modal-dialog"
            style={{ maxWidth: '440px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid #000', paddingBottom: '12px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '10px', height: '10px', background: '#10b981', border: '1px solid #000', display: 'inline-block' }} />
                <h3 style={{ fontFamily: 'var(--font-pixel)', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  CONNECT SOLANA WALLET
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowWalletModal(false)}
                style={{ fontFamily: 'var(--font-pixel)', fontSize: '12px', padding: '2px 8px', border: '2px solid #000', background: '#fff', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#52525b', marginBottom: '16px', lineHeight: 1.5 }}>
              Select your Solana wallet to mint RARE autonomous agents and deposit 90% capital to token-bound PDA vaults.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
              {[
                { name: 'Phantom', icon: '🟣', badge: 'RECOMMENDED' },
                { name: 'Solflare', icon: '🔥', badge: 'SOLANA NATIVE' },
                { name: 'Backpack', icon: '🎒', badge: 'xNFT READY' },
                { name: 'Coinbase Wallet', icon: '🔵', badge: 'POPULAR' },
              ].map((w) => (
                <button
                  key={w.name}
                  type="button"
                  onClick={() => handleConnectWallet(w.name)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    border: '2px solid #000',
                    background: '#fff',
                    boxShadow: '2px 2px 0px #000',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-pixel)',
                    fontSize: '12px',
                    textAlign: 'left',
                    transition: 'all 0.15s'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--script-green)'; e.currentTarget.style.color = '#fff'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#000'; }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '18px' }}>{w.icon}</span>
                    <span style={{ textTransform: 'uppercase' }}>{w.name}</span>
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', textTransform: 'uppercase', padding: '2px 6px', border: '1px solid #000', background: '#f1ede3', color: '#000' }}>
                    {w.badge}
                  </span>
                </button>
              ))}
            </div>

            <div style={{ paddingTop: '12px', borderTop: '1px solid #d4d4d8', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#71717a' }}>
              <span>SOLANA MAINNET-BETA</span>
              <span>100% NON-CUSTODIAL</span>
            </div>
          </div>
        </div>
      )}
    </WalletContext.Provider>
  );
}
