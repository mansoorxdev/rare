'use client';

import React, { useState } from 'react';

export default function TrixHudFooter({ isLightMode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'RARE_AI',
      text: 'RARE Tactical Radar online. Ingesting live trade streams across 10,078 Solana autonomous agents. Ask about 90% PDA vaults, Anchor CPI execution, or Pyth benchmarks.'
    }
  ]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userText = query;
    setMessages((prev) => [...prev, { sender: 'OPERATOR', text: userText }]);
    setQuery('');

    setTimeout(() => {
      let reply = 'Trade verification confirmed: PDA capital is hard-locked at 90% in Anchor custody. No developer rug or unauthorized withdrawal is mathematically possible.';
      if (userText.toLowerCase().includes('agent') || userText.toLowerCase().includes('sol')) {
        reply = '142 / 10,078 agents currently active on Solana mainnet-beta with simulated bonding curves starting at 0.020 SOL.';
      } else if (userText.toLowerCase().includes('audit') || userText.toLowerCase().includes('cpi')) {
        reply = 'Anchor CPI verified on-chain. Program ID: 7xK9...3bF2. Cross-program invocations route through Pyth Oracle and Jupiter swaps.';
      }
      setMessages((prev) => [...prev, { sender: 'RARE_AI', text: reply }]);
    }, 600);
  };

  return (
    <>
      {/* Floating Tactical Pill */}
      <div
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 60
        }}
      >
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            background: '#041508',
            border: '1.5px solid #22c55e',
            borderRadius: '10px',
            padding: '10px 18px',
            color: '#ffffff',
            cursor: 'pointer',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6), 0 0 16px rgba(34, 197, 94, 0.35)',
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: '11.5px',
            fontWeight: 800,
            letterSpacing: '0.1em',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 12px 28px rgba(0, 0, 0, 0.7), 0 0 24px rgba(34, 197, 94, 0.6)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.6), 0 0 16px rgba(34, 197, 94, 0.35)';
          }}
        >
          <img
            src="/rare-logo-icon.png"
            alt="RARE"
            style={{ width: '16px', height: '16px', objectFit: 'contain' }}
          />
          <span>ASK RARE</span>
          <span
            style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              background: '#22c55e',
              boxShadow: '0 0 8px #22c55e'
            }}
          />
        </button>
      </div>

      {/* Slide-out Terminal Chat Drawer */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '80px',
            right: '24px',
            width: '380px',
            maxHeight: '480px',
            height: '420px',
            background: '#041308',
            border: '1px solid #22c55e',
            borderRadius: '14px',
            zIndex: 65,
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(34, 197, 94, 0.3)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            fontFamily: 'var(--font-jetbrains), monospace'
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '12px 16px',
              background: 'rgba(34, 197, 94, 0.1)',
              borderBottom: '1px solid rgba(34, 197, 94, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 6px #22c55e' }} />
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#4ade80', letterSpacing: '0.08em' }}>
                RARE INTEL TERMINAL // V1.4
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '14px' }}
            >
              ✕
            </button>
          </div>

          {/* Messages Feed */}
          <div
            style={{
              flex: 1,
              padding: '16px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              fontSize: '11.5px',
              lineHeight: 1.6
            }}
          >
            {messages.map((m, idx) => (
              <div
                key={idx}
                style={{
                  alignSelf: m.sender === 'OPERATOR' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  background: m.sender === 'OPERATOR' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                  border: m.sender === 'OPERATOR' ? '1px solid rgba(34, 197, 94, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  color: m.sender === 'OPERATOR' ? '#86efac' : '#e2e8f0'
                }}
              >
                <div style={{ fontSize: '9px', opacity: 0.6, marginBottom: '2px', color: '#4ade80' }}>
                  {m.sender}
                </div>
                <div>{m.text}</div>
              </div>
            ))}
          </div>

          {/* Input Form */}
          <form
            onSubmit={handleSend}
            style={{
              padding: '12px',
              borderTop: '1px solid rgba(34, 197, 94, 0.2)',
              display: 'flex',
              gap: '8px',
              background: '#020b04'
            }}
          >
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask RARE engine..."
              style={{
                flex: 1,
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                borderRadius: '6px',
                padding: '8px 12px',
                color: '#ffffff',
                fontSize: '11px',
                fontFamily: 'var(--font-jetbrains), monospace',
                outline: 'none'
              }}
            />
            <button
              type="submit"
              style={{
                background: '#22c55e',
                color: '#000000',
                border: 'none',
                borderRadius: '6px',
                padding: '0 12px',
                fontWeight: 800,
                fontSize: '11px',
                cursor: 'pointer'
              }}
            >
              SEND
            </button>
          </form>
        </div>
      )}
    </>
  );
}
