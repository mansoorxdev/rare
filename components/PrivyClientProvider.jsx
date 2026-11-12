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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={() => setShowWalletModal(false)}
        >
          <div
            className="w-full max-w-md bg-[#fcfaf4] border-2 border-black shadow-[6px_6px_0px_#0e2bdf] p-6 text-black"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b-2 border-black mb-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-[#10b981] border border-black inline-block shadow-[1px_1px_0px_#000]" />
                <h3 className="font-pixel text-[13px] uppercase tracking-wide">CONNECT SOLANA WALLET</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowWalletModal(false)}
                className="font-pixel text-xs px-2 py-0.5 border border-black bg-white hover:bg-black hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="font-mono text-xs text-zinc-600 mb-4">
              Select your Solana wallet to mint RARE autonomous agents and deposit 90% capital to token-bound PDA vaults.
            </p>

            <div className="space-y-2 mb-6">
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
                  className="w-full flex items-center justify-between p-3 border-2 border-black bg-white hover:bg-[#0e2bdf] hover:text-white hover:translate-x-1 transition-all text-left group shadow-[2px_2px_0px_#000]"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{w.icon}</span>
                    <span className="font-pixel text-xs uppercase">{w.name}</span>
                  </div>
                  <span className="font-mono text-[9px] uppercase px-1.5 py-0.5 border border-black bg-[#f1ede3] group-hover:bg-white group-hover:text-black">
                    {w.badge}
                  </span>
                </button>
              ))}
            </div>

            <div className="pt-3 border-t border-zinc-300 flex items-center justify-between font-mono text-[10px] text-zinc-500">
              <span>SOLANA MAINNET-BETA</span>
              <span>100% NON-CUSTODIAL</span>
            </div>
          </div>
        </div>
      )}
    </WalletContext.Provider>
  );
}
