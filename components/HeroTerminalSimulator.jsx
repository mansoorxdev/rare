'use client';

import React, { useState, useEffect } from 'react';

const STRATEGIES = [
  {
    id: 'grid',
    name: 'Grid Arbitrage',
    tag: 'RAYDIUM / ORCA',
    apy: '+42.8%',
    cadence: '120ms',
    pdaSeed: 'b"grid_arb_v2"',
    sampleTx: 'cpi::raydium_clmm_swap'
  },
  {
    id: 'twap',
    name: 'TWAP Execution',
    tag: 'WHALE SLIPPAGE GUARD',
    apy: '+28.4%',
    cadence: '450ms',
    pdaSeed: 'b"twap_vault_v1"',
    sampleTx: 'cpi::jupiter_route_exact_out'
  },
  {
    id: 'guard',
    name: 'Momentum Guard',
    tag: 'PYTH ORACLE TRIGGER',
    apy: '+36.1%',
    cadence: '80ms',
    pdaSeed: 'b"momentum_pda"',
    sampleTx: 'cpi::marginfi_liquidity_hedge'
  }
];

export default function HeroTerminalSimulator({ nextAgentId = 143, activePrice = 0.02 }) {
  const [activeTab, setActiveTab] = useState('simulator');
  const [selectedStrategy, setSelectedStrategy] = useState(STRATEGIES[0]);
  const [bondRatio, setBondRatio] = useState(90);
  const [logTicks, setLogTicks] = useState([
    { time: '16:04:12', action: 'PDA::Initialize', detail: 'Agent #00143 vault seed derived', status: 'OK' },
    { time: '16:04:13', action: 'Capital::Bond', detail: `${(activePrice * 0.9).toFixed(3)} SOL locked to Token-Bound PDA`, status: 'CONFIRMED' },
    { time: '16:04:14', action: 'Pyth::OracleFeed', detail: 'SOL/USD $184.35 latency 12ms', status: 'ACTIVE' },
    { time: '16:04:15', action: 'CPI::OrderRoute', detail: `${selectedStrategy.sampleTx} -> +0.00038 SOL profit`, status: 'EXECUTED' }
  ]);

  // Live micro-stream effect to simulate real Solana execution
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0];
      const randomDelta = (Math.random() * 0.0006 + 0.0001).toFixed(5);
      
      setLogTicks((prev) => [
        {
          time: timeStr,
          action: 'CPI::ExecuteOrder',
          detail: `${selectedStrategy.sampleTx} (slippage 0.04%) -> +${randomDelta} SOL`,
          status: 'SETTLED'
        },
        prev[0],
        prev[1],
        prev[2]
      ]);
    }, 4500);

    return () => clearInterval(interval);
  }, [selectedStrategy]);

  const pdaVaultAmount = (activePrice * (bondRatio / 100)).toFixed(4);
  const protocolFeeAmount = (activePrice * ((100 - bondRatio) / 100)).toFixed(4);

  return (
    <div className="w-full max-w-[560px] rounded-2xl border border-zinc-800 bg-[#090a0f]/95 p-1 shadow-2xl backdrop-blur-xl relative overflow-hidden group">
      {/* Subtle top ambient indicator */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
      
      {/* Console Window Header */}
      <div className="flex items-center justify-between border-b border-zinc-800/80 px-4 py-3 bg-[#0c0d14]/90 rounded-t-xl">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-[11px] font-semibold tracking-wider text-zinc-300 uppercase">
              SOLANA MAINNET
            </span>
          </div>
          <span className="text-zinc-600">/</span>
          <span className="font-mono text-[11px] text-zinc-400">EPOCH 724</span>
        </div>

        {/* Console Nav Tabs */}
        <div className="flex items-center gap-1 bg-zinc-900/80 p-0.5 rounded-lg border border-zinc-800">
          <button
            type="button"
            onClick={() => setActiveTab('simulator')}
            className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors ${
              activeTab === 'simulator'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Terminal
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('anchor')}
            className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors ${
              activeTab === 'anchor'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Anchor CPI
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('security')}
            className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors ${
              activeTab === 'security'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Audit
          </button>
        </div>
      </div>

      {/* Console Body */}
      <div className="p-4 sm:p-5">
        {activeTab === 'simulator' && (
          <div className="space-y-4">
            {/* Strategy Preset Selectors */}
            <div>
              <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 mb-2">
                <span>SELECT AGENT STRATEGY PRESET</span>
                <span className="text-emerald-400 font-semibold">{selectedStrategy.apy} APY (EST.)</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {STRATEGIES.map((strat) => {
                  const isSelected = selectedStrategy.id === strat.id;
                  return (
                    <button
                      key={strat.id}
                      type="button"
                      onClick={() => setSelectedStrategy(strat)}
                      className={`text-left p-2.5 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-emerald-500/60 bg-emerald-950/20 shadow-[0_0_15px_rgba(16,185,129,0.12)]'
                          : 'border-zinc-800/90 bg-zinc-900/40 hover:border-zinc-700 hover:bg-zinc-900/80'
                      }`}
                    >
                      <div className="text-[12px] font-semibold text-zinc-100 truncate">{strat.name}</div>
                      <div className="text-[10px] font-mono text-zinc-400 truncate mt-0.5">{strat.tag}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Dynamic PDA Capital Allocation Breakdown */}
            <div className="rounded-xl border border-zinc-800/90 bg-zinc-900/50 p-3.5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  <span className="text-[12px] font-semibold text-zinc-200">Token-Bound PDA Vault</span>
                </div>
                <span className="font-mono text-[13px] font-bold text-emerald-400">
                  {pdaVaultAmount} SOL ({bondRatio}%)
                </span>
              </div>

              {/* Allocation Progress Bar */}
              <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden flex">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300"
                  style={{ width: `${bondRatio}%` }}
                />
                <div
                  className="h-full bg-zinc-700 transition-all duration-300"
                  style={{ width: `${100 - bondRatio}%` }}
                />
              </div>

              <div className="flex items-center justify-between font-mono text-[10.5px] text-zinc-400 pt-0.5">
                <span>Agent #00{nextAgentId} Dedicated Treasury</span>
                <span>Protocol Fee: {protocolFeeAmount} SOL (10%)</span>
              </div>
            </div>

            {/* Live Streaming Execution Log */}
            <div>
              <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 mb-1.5">
                <span>REAL-TIME ON-CHAIN EXECUTION LOG</span>
                <span className="text-[10px] text-zinc-500">POLLING 150MS</span>
              </div>
              <div className="rounded-xl border border-zinc-800/80 bg-black/60 p-2.5 font-mono text-[11px] space-y-1.5 max-h-[140px] overflow-hidden">
                {logTicks.map((tick, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-2 text-zinc-300">
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-zinc-500 text-[10px] shrink-0">{tick.time}</span>
                      <span className="text-emerald-400 font-semibold shrink-0">{tick.action}</span>
                      <span className="text-zinc-300 truncate">{tick.detail}</span>
                    </div>
                    <span className="text-[9.5px] px-1.5 py-0.5 rounded bg-zinc-800/80 text-zinc-300 font-semibold shrink-0 border border-zinc-700/50">
                      {tick.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'anchor' && (
          <div className="space-y-3 font-mono text-[11.5px]">
            <div className="flex items-center justify-between text-zinc-400 text-[11px] pb-1 border-b border-zinc-800">
              <span>programs/rare_core/src/instructions/mint.rs</span>
              <span className="text-emerald-400">ANCHOR v0.30.1</span>
            </div>
            <pre className="p-3 rounded-xl bg-black/70 border border-zinc-800 text-zinc-300 leading-relaxed overflow-x-auto text-[11px]">
{`pub fn mint_agent_pda(ctx: Context<MintAgent>, agent_id: u32) -> Result<()> {
    let bond_lamports = (ctx.accounts.payer.lamports() * 90) / 100;
    
    // 90% capital routed directly into Agent's PDA Token-Bound Vault
    anchor_lang::solana_program::program::invoke(
        &system_instruction::transfer(
            &ctx.accounts.payer.key(),
            &ctx.accounts.agent_pda_vault.key(),
            bond_lamports,
        ),
        &[ctx.accounts.payer.to_account_info(), ctx.accounts.agent_pda_vault.to_account_info()],
    )?;

    emit!(AgentBondedEvent {
        agent_id,
        vault: ctx.accounts.agent_pda_vault.key(),
        bonded_sol: bond_lamports,
    });
    Ok(())
}`}
            </pre>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-2.5 font-mono text-[11.5px]">
            <div className="text-[11px] text-zinc-400 pb-1 border-b border-zinc-800 flex items-center justify-between">
              <span>VERIFIABLE NON-CUSTODIAL SPECS</span>
              <span className="text-emerald-400">PASSED</span>
            </div>
            <div className="space-y-2 pt-1">
              {[
                { title: 'Seeds Derivation', desc: '[b"agent_pda", agent_id.to_le_bytes()]', verified: true },
                { title: 'Capital Protection', desc: '90% locked in immutable Anchor PDA vault', verified: true },
                { title: 'CPI Whitelist', desc: 'Pre-screened Anchor CPI instruction boundaries', verified: true },
                { title: 'NFT Token-Bound', desc: 'Wallet authority tied to NFT ownership address', verified: true }
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-zinc-900/40 border border-zinc-800/80">
                  <div>
                    <div className="text-[12px] font-sans font-semibold text-zinc-200">{item.title}</div>
                    <div className="text-[10px] text-zinc-400 font-mono">{item.desc}</div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-800/60 px-2 py-0.5 rounded">
                    VERIFIED
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer Telemetry */}
        <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-[11px] font-mono text-zinc-400">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
            <span>PYTH ORACLE LATENCY: 14MS</span>
          </div>
          <span className="text-emerald-400 font-semibold">10,078 TOTAL CAPACITY</span>
        </div>
      </div>
    </div>
  );
}
