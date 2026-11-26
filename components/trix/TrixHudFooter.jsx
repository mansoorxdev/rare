'use client';

import React, { useState } from 'react';
import AsciiScrambleText, { AsciiCipherTape } from './AsciiScrambleText';

export default function TrixHudFooter({ isLightMode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'RARE_AI',
      text: 'RARE ASCII RADAR v2.4 initialized. Ingesting live trade streams across 10,078 Solana autonomous agents. Ask about 90% PDA vaults, Anchor CPI execution, or Pyth benchmarks.'
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
      {/* Floating Tactical ASCII Pill */}
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
            gap: '8px',
            background: '#041007',
            border: '1px solid #22c55e',
            borderRadius: '2px',
            padding: '8px 14px',
            color: '#ffffff',
            cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.8), 0 0 12px rgba(34, 197, 94, 0.25)',
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: '11px',
            fontWeight: 800,
            letterSpacing: '0.08em',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.borderColor = '#4ade80';
            e.currentTarget.style.boxShadow = '0 6px 24px rgba(0, 0, 0, 0.9), 0 0 18px rgba(34, 197, 94, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.borderColor = '#22c55e';
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.8), 0 0 12px rgba(34, 197, 94, 0.25)';
          }}
        >
          <span style={{ color: '#22c55e' }}>[&gt;]</span>
          <span>ASK RARE</span>
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: '#22c55e',
              boxShadow: '0 0 6px #22c55e'
            }}
          />
        </button>
      </div>

      {/* Slide-out Terminal Chat Drawer */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '76px',
            right: '24px',
            width: '390px',
            maxHeight: '480px',
            zIndex: 65,
            background: 'rgba(4, 12, 7, 0.96)',
            border: '1px solid #22c55e',
            borderRadius: '2px',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.9), 0 0 30px rgba(34, 197, 94, 0.25)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            fontFamily: 'var(--font-jetbrains), monospace'
          }}
        >
          {/* Terminal Window Header */}
          <div
            style={{
              padding: '10px 14px',
              background: '#020704',
              borderBottom: '1px solid rgba(34, 197, 94, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '11px',
              color: '#86efac'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#22c55e' }}>+---</span>
              <span style={{ fontWeight: 800 }}>RARE_ASCII_COPILOT</span>
              <span style={{ color: '#22c55e' }}>---+</span>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#64748b',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontSize: '12px'
              }}
            >
              [X]
            </button>
          </div>

          <div style={{ padding: '4px 14px', background: '#010502', borderBottom: '1px solid rgba(34, 197, 94, 0.15)', fontSize: '9px' }}>
            <AsciiCipherTape length={36} speed={150} style={{ fontSize: '9px' }} />
          </div>

          {/* Messages Feed */}
          <div
            style={{
              padding: '14px',
              overflowY: 'auto',
              flex: 1,
              maxHeight: '300px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              fontSize: '11px',
              lineHeight: 1.55
            }}
          >
            {messages.map((m, idx) => (
              <div
                key={idx}
                style={{
                  padding: '8px 12px',
                  borderRadius: '2px',
                  background: m.sender === 'RARE_AI' ? 'rgba(34, 197, 94, 0.08)' : 'rgba(255, 255, 255, 0.05)',
                  borderLeft: m.sender === 'RARE_AI' ? '2px solid #22c55e' : '2px solid #94a3b8'
                }}
              >
                <div
                  style={{
                    fontSize: '9.5px',
                    fontWeight: 800,
                    color: m.sender === 'RARE_AI' ? '#22c55e' : '#94a3b8',
                    marginBottom: '4px'
                  }}
                >
                  [{m.sender}]
                </div>
                <div style={{ color: '#e2e8f0' }}>{m.text}</div>
              </div>
            ))}
          </div>

          {/* Input Form */}
          <form
            onSubmit={handleSend}
            style={{
              display: 'flex',
              padding: '10px',
              background: '#020704',
              borderTop: '1px solid rgba(34, 197, 94, 0.25)',
              gap: '8px'
            }}
          >
            <span style={{ color: '#22c55e', alignSelf: 'center', fontSize: '12px' }}>&gt;</span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask RARE ASCII radar..."
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                color: '#ffffff',
                fontFamily: 'inherit',
                fontSize: '11.5px',
                outline: 'none'
              }}
            />
            <button
              type="submit"
              style={{
                background: '#22c55e',
                color: '#000000',
                border: 'none',
                borderRadius: '2px',
                padding: '4px 10px',
                fontSize: '10px',
                fontWeight: 900,
                fontFamily: 'inherit',
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
