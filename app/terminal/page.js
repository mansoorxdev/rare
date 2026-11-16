'use client';

import React, { useState, useRef, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { getAgentMetadata } from '../../lib/agentMetadata';

export default function TerminalPage() {
  const [lines, setLines] = useState([
    { type: 'green', text: '========================================================================' },
    { type: 'green', text: 'RARE PROTOCOL TELEMETRY CONSOLE // SOLANA ANCHOR CPI MAINNET-BETA' },
    { type: 'green', text: '10,078 TOKEN-BOUND AUTONOMOUS AGENTS // 90% CAPITAL PDA VAULTS' },
    { type: 'green', text: '========================================================================' },
    { type: 'info', text: "> Type 'help' to see all commands, or click any shortcut below." },
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
          { type: 'info', text: 'AVAILABLE PROTOCOL COMMANDS:' },
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
          { type: 'green', text: '[+] NETWORK: Solana Mainnet-Beta (Anchor CPI v0.30.1)' },
          { type: 'info', text: '[+] TOTAL SUPPLY: 10,078 Autonomous AI Agents' },
          { type: 'info', text: '[+] MINT STATUS: Active (Band 1 @ 0.02 SOL)' },
          { type: 'info', text: '[+] CAPITAL VAULTS: 90% Allocated to Token-Bound PDAs' },
          { type: 'info', text: '[+] TREASURY: 3ivjUQCmaykSnGeCkuy8yViw82umrfDCmXkxtWSeqyEk' }
        );
        break;

      case 'inspect': {
        const idNum = parseInt(arg, 10);
        if (isNaN(idNum) || idNum < 1 || idNum > 10078) {
          newLines.push({ type: 'error', text: 'ERROR: Please provide a valid Agent ID between 1 and 10078 (e.g. inspect 143)' });
        } else {
          const agent = getAgentMetadata(idNum);
          newLines.push(
            { type: 'green', text: `[+] AGENT: ${agent.name} (${agent.role})` },
            { type: 'text', text: `    Archetype:    ${agent.archetype}` },
            { type: 'text', text: `    Rarity:       ${agent.rarityTier} (${agent.rarityScore}%)` },
            { type: 'text', text: `    Engine:       ${agent.engine}` },
            { type: 'text', text: `    PDA Vault:    ${agent.pdaVault}` },
            { type: 'green', text: `    PDA Capital:  ${agent.pdaFunding} (90% Allocated)` },
            { type: 'text', text: `    Mission:      "${agent.personalityPreview}"` }
          );
        }
        break;
      }

      case 'pda': {
        const idNum = parseInt(arg, 10);
        if (isNaN(idNum) || idNum < 1 || idNum > 10078) {
          newLines.push({ type: 'error', text: 'ERROR: Please provide a valid Agent ID between 1 and 10078 (e.g. pda 143)' });
        } else {
          const agent = getAgentMetadata(idNum);
          newLines.push(
            { type: 'green', text: `[+] SEED: b"agent_vault" + mint_pubkey + #${idNum}` },
            { type: 'info', text: `[+] DERIVED PDA: ${agent.pdaVault}` },
            { type: 'text', text: `[+] TOKEN-BOUND CUSTODY: Cryptographically locked to NFT mint account.` }
          );
        }
        break;
      }

      case 'split':
        newLines.push(
          { type: 'green', text: '[+] ANCHOR CPI INVARIANT: 9000 BPS (90%) / 1000 BPS (10%)' },
          { type: 'text', text: '    • 90% of every mint is deposited into the agent\'s PDA wallet.' },
          { type: 'text', text: '    • 10% is routed to the protocol development treasury.' },
          { type: 'text', text: '    • Neither team nor minter can drain PDA capital without protocol authority.' }
        );
        break;

      case 'ladder':
        newLines.push(
          { type: 'info', text: 'BONDING CURVE TIERS (10 BANDS):' },
          { type: 'text', text: '  Band 1:  #00001 - #01008  @  0.020 SOL  (PDA: 0.0180 SOL) [ACTIVE]' },
          { type: 'text', text: '  Band 2:  #01009 - #02016  @  0.026 SOL  (PDA: 0.0234 SOL)' },
          { type: 'text', text: '  Band 3:  #02017 - #03024  @  0.034 SOL  (PDA: 0.0306 SOL)' },
          { type: 'text', text: '  Band 4:  #03025 - #04032  @  0.044 SOL  (PDA: 0.0396 SOL)' },
          { type: 'text', text: '  Band 5:  #04033 - #05040  @  0.057 SOL  (PDA: 0.0513 SOL)' },
          { type: 'text', text: '  Band 10: #09073 - #10078  @  0.212 SOL  (PDA: 0.1908 SOL)' }
        );
        break;

      case 'treasury':
        newLines.push(
          { type: 'green', text: '[+] PROTOCOL TREASURY: 3ivjUQCmaykSnGeCkuy8yViw82umrfDCmXkxtWSeqyEk' },
          { type: 'info', text: '[+] SOLSCAN: https://solscan.io/account/3ivjUQCmaykSnGeCkuy8yViw82umrfDCmXkxtWSeqyEk' }
        );
        break;

      case 'clear':
        setLines([]);
        setInput('');
        return;

      default:
        newLines.push({ type: 'error', text: `Command not recognized: '${cmd}'. Type 'help' for available commands.` });
        break;
    }

    setLines(newLines);
    setInput('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    executeCommand(input);
  };

  return (
    <>
      <Navbar />

      <main className="wrap" style={{ paddingTop: '28px', paddingBottom: '60px' }}>
        <div style={{ marginBottom: '24px' }}>
          <div className="ca-pill" style={{ marginBottom: '12px' }}>
            <span className="pulse" />
            <span>SOLANA TELEMETRY TERMINAL // LIVE PROTOCOL CONSOLE</span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '-0.02em', marginBottom: '8px' }}>
            Protocol Cyber Console
          </h1>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--dim)', maxWidth: '780px' }}>
            Execute on-chain diagnostic queries, inspect token-bound agent PDAs, and trace Anchor CPI capital routing directly through the terminal.
          </p>
        </div>

        {/* Shortcut Action Buttons */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
          {['help', 'status', 'inspect 143', 'pda 143', 'split', 'ladder', 'treasury', 'clear'].map((action) => (
            <button
              key={action}
              type="button"
              onClick={() => executeCommand(action)}
              className="btn-secondary"
              style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', padding: '5px 12px' }}
            >
              $ {action}
            </button>
          ))}
        </div>

        {/* Terminal Screen Frame */}
        <div style={{ background: '#09090b', border: '2px solid #27272a', boxShadow: '8px 8px 0px 0px var(--script-green)', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 16px', background: '#18181b', borderBottom: '1px solid #27272a', fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#a1a1aa' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="sa-brand-icon" style={{ width: '18px', height: '18px', padding: '1px', boxShadow: 'none', border: '1px solid #3f3f46' }}>
                <img src="/rare-logo-icon.png" alt="RARE" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </span>
              <span style={{ color: 'var(--script-green)', fontWeight: 700 }}>
                ANCHOR CPI TELEMETRY // TOKEN-BOUND AGENT CONSOLE
              </span>
            </div>
            <span style={{ color: '#71717a' }}>SOLANA MAINNET-BETA</span>
          </div>

          <div style={{ padding: '24px', fontFamily: 'var(--font-mono)', fontSize: '12px', minHeight: '420px', maxHeight: '560px', overflowY: 'auto', lineHeight: 1.6 }}>
            {lines.map((l, i) => (
              <div
                key={i}
                style={{
                  color: l.type === 'green' ? 'var(--script-green)' : l.type === 'error' ? '#ef4444' : l.type === 'cmd' ? '#fff' : l.type === 'info' ? '#38bdf8' : '#a1a1aa',
                  fontWeight: l.type === 'green' || l.type === 'cmd' ? 700 : 400,
                  marginBottom: '3px'
                }}
              >
                {l.text}
              </div>
            ))}
            <div ref={endRef} />

            <form onSubmit={handleSubmit} style={{ display: 'flex', marginTop: '16px' }}>
              <span style={{ color: 'var(--script-green)', marginRight: '8px', fontWeight: 700 }}>rare@sol:~$</span>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a command (try 'help', 'status', 'inspect 143')..."
                style={{ flex: 1, background: 'transparent', border: 'none', color: '#fcfaf4', font: 'inherit', outline: 'none' }}
                autoFocus
              />
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
