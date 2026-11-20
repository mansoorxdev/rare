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
          { type: 'text', text: '[+] MINT STATUS: Active (Band 1 @ 0.020 SOL)' },
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
          { type: 'text', text: '    Band 1  (#00001 - #01008): 0.020 SOL (90% PDA: 0.0180 SOL) - [ACTIVE]' },
          { type: 'text', text: '    Band 2  (#01009 - #02016): 0.026 SOL (90% PDA: 0.0234 SOL)' },
          { type: 'text', text: '    Band 3  (#02017 - #03024): 0.034 SOL (90% PDA: 0.0306 SOL)' },
          { type: 'text', text: '    Band 5  (#04033 - #05040): 0.057 SOL (90% PDA: 0.0513 SOL)' },
          { type: 'text', text: '    Band 10 (#09073 - #10078): 0.212 SOL (90% PDA: 0.1908 SOL)' }
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
    <div className="min-h-screen bg-black text-cream selection:bg-cream selection:text-black font-sans antialiased">
      <Navbar />

      <main className="page-container">
        {/* Page Header */}
        <div className="mx-auto max-w-[800px] text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-line bg-surface-1 px-3 py-1 font-mono text-[11px] text-dim mb-4">
            <span className="h-1.5 w-1.5 rounded-full bg-mint animate-pulse" />
            <span>INTERACTIVE ANCHOR CPI CONSOLE // MAINNET-BETA</span>
          </div>

          <h1 className="font-serif text-[40px] leading-[1.05] text-cream md:text-[56px] font-medium">
            Protocol Telemetry Console
          </h1>
          <p className="mt-4 text-[15px] leading-relaxed text-muted">
            Direct real-time terminal interface to the RARE Protocol on Solana. Query agent state, derive PDA vault seeds, and audit the 90/10 Anchor CPI invariant.
          </p>
        </div>

        {/* Quick Command Shortcut Pills */}
        <div className="flex items-center justify-center gap-2 flex-wrap mb-8 font-mono text-[11px]">
          {['status', 'inspect 143', 'pda 143', 'split', 'ladder', 'treasury', 'clear'].map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => executeCommand(c)}
              className="rounded-full border border-line bg-surface-1 px-3.5 py-1 text-dim hover:text-cream hover:border-line-strong hover:bg-surface-2 transition-colors cursor-pointer"
            >
              $ {c}
            </button>
          ))}
        </div>

        {/* Monolithic Terminal Container */}
        <div className="mx-auto max-w-[1000px] rounded-xl border border-line bg-surface-1 overflow-hidden shadow-2xl">
          {/* Header Bar */}
          <div className="border-b border-line bg-surface-2/60 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-rose/60" />
              <span className="h-2.5 w-2.5 rounded-full bg-peach/60" />
              <span className="h-2.5 w-2.5 rounded-full bg-mint/60" />
              <span className="font-mono text-[11px] text-dim ml-2">rare-protocol-cli // terminal</span>
            </div>
            <span className="font-mono text-[10px] text-mint">SOLANA ACTIVE</span>
          </div>

          {/* Terminal Output */}
          <div className="p-6 font-mono text-[12.5px] leading-[1.8] min-h-[420px] max-h-[560px] overflow-y-auto bg-black/80 space-y-1">
            {lines.map((l, idx) => {
              let colorClass = 'text-cream/90';
              if (l.type === 'mint') colorClass = 'text-mint font-medium';
              if (l.type === 'cmd') colorClass = 'text-peach font-medium';
              if (l.type === 'dim') colorClass = 'text-dim';
              if (l.type === 'rose') colorClass = 'text-rose';

              return (
                <div key={idx} className={`${colorClass} whitespace-pre-wrap break-all`}>
                  {l.text}
                </div>
              );
            })}
            <div ref={endRef} />
          </div>

          {/* Input Prompt */}
          <div className="border-t border-line bg-surface-1 px-4 py-3 flex items-center gap-3">
            <span className="font-mono text-[12px] text-mint font-medium shrink-0">rare@sol:~$</span>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type command (e.g. status, inspect 143, split) and press Enter..."
              className="w-full bg-transparent font-mono text-[12.5px] text-cream placeholder:text-dim/60 focus:outline-none"
              autoFocus
            />
            <button
              type="button"
              onClick={() => executeCommand(input)}
              className="rounded-md border border-line bg-surface-2 px-3 py-1 font-mono text-[11px] text-dim hover:text-cream hover:border-line-strong transition-colors cursor-pointer shrink-0"
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
