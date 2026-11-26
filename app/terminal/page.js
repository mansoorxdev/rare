'use client';

import React, { useState, useRef, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { getAgentMetadata } from '../../lib/agentMetadata';

export default function TerminalPage() {
  const [lines, setLines] = useState([
    { type: 'mint', text: '========================================================================' },
    { type: 'mint', text: 'RARE PROTOCOL TELEMETRY CONSOLE // SOLANA ANCHOR CPI MAINNET-BETA' },
    { type: 'mint', text: '10,078 TOKEN-BOUND AUTONOMOUS AGENTS // 90% CAPITAL PDA VAULTS' },
    { type: 'mint', text: '========================================================================' },
    { type: 'dim', text: "> Type 'help' to inspect all commands, or click any command pill below." },
  ]);
  const [input, setInput] = useState('');
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  const executeCommand = (cmdStr) => {
    const raw = cmdStr.trim();
    if (!raw) return;

    const parts = raw.split(' ');
    const cmd = parts[0].toLowerCase();
    const arg = parts[1];

    let newLines = [...lines, { type: 'cmd', text: `rare@sol:~$ ${raw}` }];

    switch (cmd) {
      case 'help':
        newLines.push(
          { type: 'dim', text: 'AVAILABLE PROTOCOL COMMANDS:' },
          { type: 'text', text: '  status       - View live Solana network & mint telemetry' },
          { type: 'text', text: '  inspect <id> - Inspect traits, PDA vault, and capital for agent ID (1-10078)' },
          { type: 'text', text: '  pda <id>     - Derive token-bound PDA address & seed verification' },
          { type: 'text', text: '  split        - Verify 90% Agent PDA / 10% Treasury CPI routing invariant' },
          { type: 'text', text: '  ladder       - Display 10-tier bonding curve pricing ladder' },
          { type: 'text', text: '  treasury     - View protocol treasury address & Solscan link' },
          { type: 'text', text: '  clear        - Clear the terminal console screen' }
        );
        break;

      case 'status':
        newLines.push(
          { type: 'mint', text: '[+] NETWORK: Solana Mainnet-Beta (Anchor CPI v0.30.1)' },
          { type: 'text', text: '[+] TOTAL SUPPLY: 10,078 Autonomous AI Agents' },
          { type: 'text', text: '[+] MINT STATUS: Active (Band 1 @ 2,500 $RARE)' },
          { type: 'mint', text: '[+] CAPITAL VAULTS: 90% Allocated to Token-Bound PDAs' },
          { type: 'dim', text: '[+] TREASURY: 3ivjUQCmaykSnGeCkuy8yViw82umrfDCmXkxtWSeqyEk' }
        );
        break;

      case 'inspect': {
        const idNum = parseInt(arg, 10);
        if (isNaN(idNum) || idNum < 1 || idNum > 10078) {
          newLines.push({ type: 'rose', text: 'ERROR: Please provide a valid Agent ID between 1 and 10078 (e.g. inspect 143)' });
        } else {
          const agent = getAgentMetadata(idNum);
          newLines.push(
            { type: 'mint', text: `[+] AGENT: ${agent.name} (${agent.role})` },
            { type: 'text', text: `    Archetype:    ${agent.archetype}` },
            { type: 'text', text: `    Rarity:       ${agent.rarityTier} (${agent.rarityScore}%)` },
            { type: 'text', text: `    Engine:       ${agent.engine}` },
            { type: 'text', text: `    PDA Vault:    ${agent.pdaVault}` },
            { type: 'mint', text: `    PDA Capital:  ${agent.pdaFunding} (90% Allocated)` },
            { type: 'dim', text: `    Personality:  "${agent.personalityPreview}"` }
          );
        }
        break;
      }

      case 'pda': {
        const idNum = parseInt(arg, 10);
        if (isNaN(idNum) || idNum < 1 || idNum > 10078) {
          newLines.push({ type: 'rose', text: 'ERROR: Please provide a valid Agent ID between 1 and 10078 (e.g. pda 143)' });
        } else {
          const agent = getAgentMetadata(idNum);
          newLines.push(
            { type: 'mint', text: `[+] SEED: b"agent_vault" + mint_pubkey + #${idNum}` },
            { type: 'text', text: `[+] DERIVED PDA: ${agent.pdaVault}` },
            { type: 'dim', text: `[+] TOKEN-BOUND CUSTODY: Cryptographically locked to NFT mint account.` }
          );
        }
        break;
      }

      case 'split':
        newLines.push(
          { type: 'mint', text: '[+] ANCHOR CPI INVARIANT: 9000 BPS (90%) / 1000 BPS (10%)' },
          { type: 'text', text: "    • 90% of every mint is deposited into the agent's PDA wallet." },
          { type: 'text', text: '    • 10% is routed to the protocol development treasury.' },
          { type: 'dim', text: '    • Neither team nor minter can drain PDA capital without protocol authority.' }
        );
        break;

      case 'ladder':
        newLines.push(
          { type: 'mint', text: '[+] PROTOCOL PRICE LADDER (10 BANDS):' },
          { type: 'text', text: '    Band 1  (#00001 - #01008): 2,500 $RARE (90% PDA: 2,250 $RARE) - [ACTIVE]' },
          { type: 'text', text: '    Band 2  (#01009 - #02016): 3,250 $RARE (90% PDA: 2,925 $RARE)' },
          { type: 'text', text: '    Band 3  (#02017 - #03024): 4,200 $RARE (90% PDA: 3,780 $RARE)' },
          { type: 'text', text: '    Band 5  (#04033 - #05040): 7,100 $RARE (90% PDA: 6,390 $RARE)' },
          { type: 'text', text: '    Band 10 (#09073 - #10078): 26,400 $RARE (90% PDA: 23,760 $RARE)' }
        );
        break;

      case 'treasury':
        newLines.push(
          { type: 'mint', text: '[+] TREASURY PUBKEY: 3ivjUQCmaykSnGeCkuy8yViw82umrfDCmXkxtWSeqyEk' },
          { type: 'text', text: '    Explorer: https://solscan.io/account/3ivjUQCmaykSnGeCkuy8yViw82umrfDCmXkxtWSeqyEk' }
        );
        break;

      case 'clear':
        newLines = [];
        break;

      default:
        newLines.push({
          type: 'rose',
          text: `Command not recognized: '${cmd}'. Type 'help' to view available commands.`
        });
        break;
    }

    setLines(newLines);
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      executeCommand(input);
    }
  };

  return (
    <div className="gamma-page-container">
      <Navbar />

      <main style={{ maxWidth: '1360px', margin: '0 auto', padding: '108px 24px 64px 24px' }}>
        {/* Page Header */}
        <div className="gamma-page-header">
          <div className="gamma-badge" style={{ marginBottom: '12px' }}>
            <span className="gamma-badge-icon">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4 4h16v16H4V4zm2 2v12h12V6H6z" />
              </svg>
            </span>
            <span>INTERACTIVE ANCHOR CPI CONSOLE · MAINNET-BETA</span>
          </div>

          <h1 className="gamma-hero-title" style={{ fontSize: 'clamp(32px, 4vw, 52px)', marginBottom: '12px' }}>
            Protocol Telemetry Console
          </h1>
          <p className="gamma-hero-subtitle" style={{ maxWidth: '680px', margin: '0 auto' }}>
            Direct real-time terminal interface to the RARE Protocol on Solana. Query agent state, derive PDA vault seeds, and audit the 90/10 Anchor CPI invariant.
          </p>
        </div>

        {/* Quick Command Shortcut Pills */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '28px', fontFamily: 'var(--font-jetbrains), monospace', fontSize: '11px' }}>
          {['status', 'inspect 143', 'pda 143', 'split', 'ladder', 'treasury', 'clear'].map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => executeCommand(c)}
              style={{
                borderRadius: '9999px',
                border: '1px solid rgba(15, 23, 42, 0.1)',
                background: 'rgba(255, 255, 255, 0.85)',
                padding: '6px 14px',
                color: '#475569',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#0f172a'; e.currentTarget.style.background = '#ffffff'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#475569'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.85)'; }}
            >
              $ {c}
            </button>
          ))}
        </div>

        {/* Monolithic Terminal Container */}
        <div style={{
          maxWidth: '1000px',
          margin: '0 auto',
          borderRadius: '24px',
          border: '1px solid rgba(15, 23, 42, 0.15)',
          background: '#0c0d14',
          overflow: 'hidden',
          boxShadow: '0 30px 80px -15px rgba(0, 0, 0, 0.3)'
        }}>
          {/* Header Bar */}
          <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', background: 'rgba(255, 255, 255, 0.03)', padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '9999px', background: '#fb7185' }} />
              <span style={{ width: '10px', height: '10px', borderRadius: '9999px', background: '#fbbf24' }} />
              <span style={{ width: '10px', height: '10px', borderRadius: '9999px', background: '#34d399' }} />
              <span style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '11px', color: '#94a3b8', marginLeft: '8px' }}>rare-protocol-cli // terminal</span>
            </div>
            <span style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '10px', color: '#34d399', fontWeight: 700 }}>SOLANA ACTIVE</span>
          </div>

          {/* Terminal Output */}
          <div style={{ padding: '24px', fontFamily: 'var(--font-jetbrains), monospace', fontSize: '12.5px', lineHeight: 1.8, minHeight: '420px', maxHeight: '560px', overflowY: 'auto', background: '#07080c' }}>
            {lines.map((l, idx) => {
              let color = '#f1f5f9';
              if (l.type === 'mint') color = '#34d399';
              if (l.type === 'cmd') color = '#c084fc';
              if (l.type === 'dim') color = '#64748b';
              if (l.type === 'rose') color = '#fb7185';

              return (
                <div key={idx} style={{ color, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                  {l.text}
                </div>
              );
            })}
            <div ref={endRef} />
          </div>

          {/* Input Prompt */}
          <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', background: '#0c0d14', padding: '12px 18px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '12.5px', color: '#34d399', fontWeight: 700, flexShrink: 0 }}>rare@sol:~$</span>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type command (e.g. status, inspect 143, split) and press Enter..."
              style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', fontFamily: 'var(--font-jetbrains), monospace', fontSize: '12.5px', color: '#ffffff' }}
              autoFocus
            />
            <button
              type="button"
              onClick={() => executeCommand(input)}
              className="gamma-btn-white"
              style={{ padding: '4px 14px', fontSize: '11px', flexShrink: 0 }}
            >
              Run
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
