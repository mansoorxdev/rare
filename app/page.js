'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HeroQuantumOrb from '../components/HeroQuantumOrb';
import { usePrivy } from '../components/PrivyClientProvider';
import { getAgentMetadata } from '../lib/agentMetadata';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export default function HomePage() {
  const pageContainerRef = useRef(null);
  const { ready, authenticated, user, login, logout } = usePrivy();

  // Minting & Stats State
  const [soldCount, setSoldCount] = useState(142);
  const [isMinting, setIsMinting] = useState(false);
  const [mintStatus, setMintStatus] = useState('');
  const [inspectedAgent, setInspectedAgent] = useState(null);
  const [mintCelebration, setMintCelebration] = useState(null);

  // Active Next Agent to Mint
  const nextAgentId = soldCount + 1;
  const nextAgent = getAgentMetadata(nextAgentId);
  const activePrice = nextAgent.priceSol;

  // Hero Tabs State: Cast, Guard, Target, Ladder
  const [heroTab, setHeroTab] = useState('cast');
  const heroTabLines = {
    cast: `Mint Agent #${String(nextAgentId).padStart(5, '0')} with ${activePrice.toFixed(3)} SOL. 90% capital routed to PDA vault.`,
    guard: 'Auto stop-loss trigger at -15% drawdown via Anchor CPI route to Jupiter.',
    target: 'Auto take-profit at +35% gain; rebalance liquidity to SOL in token-bound PDA.',
    ladder: 'Genesis Tier 1 (1–1,000) at 0.02 SOL → Tier 10 (10,000–10,078) at 10.24 SOL.'
  };

  // Section 2 IDE State: Code tabs and Human/Machine toggle
  const [codeTab, setCodeTab] = useState('json');
  const [humanView, setHumanView] = useState(true);

  // Section 3 Stepper & Transcript State
  const [transcriptTab, setTranscriptTab] = useState(0);
  const [transcriptPaused, setTranscriptPaused] = useState(false);

  // Featured 4 Showcase Agents for Section 4
  const featuredAgentIds = [42, 128, 1420, 3391];
  const featuredAgents = featuredAgentIds.map((id) => getAgentMetadata(id));

  // Transcript timer cycle
  useEffect(() => {
    if (transcriptPaused) return;
    const interval = setInterval(() => {
      setTranscriptTab((prev) => (prev + 1) % 4);
    }, 4000);
    return () => clearInterval(interval);
  }, [transcriptPaused]);

  // Mint Handler
  const handleMintAction = (agentToMint = nextAgent) => {
    if (ready && !authenticated) {
      setMintStatus('Please connect your Solana wallet with Privy.');
      login();
      return;
    }

    setIsMinting(true);
    setMintStatus(`Initiating Anchor CPI 90/10 split for Agent #${agentToMint.id}...`);

    setTimeout(() => {
      setMintStatus(`Deriving Token-Bound PDA: ${agentToMint.pdaVault}...`);
    }, 800);

    setTimeout(() => {
      const mintedPrice = agentToMint.priceSol || 0.02;
      const deposited = (mintedPrice * 0.9).toFixed(4);
      setSoldCount((prev) => prev + 1);
      setIsMinting(false);
      setMintStatus(`Success! Agent #${agentToMint.id} activated.`);
      setInspectedAgent(null);
      setMintCelebration({
        ...agentToMint,
        deposited,
        txSignature: `4xL7kQ${Math.random().toString(36).substring(2, 8)}wE8${Math.random().toString(36).substring(2, 8)}Sol`
      });
    }, 2000);
  };

  // Download Agent JSON Manifest
  const handleDownloadManifest = (agent) => {
    const data = {
      protocol: 'RARE Protocol ($RARE)',
      version: '1.0.0-solana',
      agent_id: agent.id,
      name: agent.name,
      archetype: agent.archetype,
      tier: agent.band,
      mint_price: `${agent.priceSol} SOL`,
      token_bound_pda: agent.pdaVault,
      agent_wallet: agent.agentWallet,
      anchor_cpi_split: {
        agent_pda_vault: '90%',
        protocol_ops: '10%'
      },
      personality: agent.personalityPreview,
      engine: agent.engine,
      rarity: {
        score: agent.rarityScore,
        tier: agent.rarityTier
      },
      timestamp: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rare-agent-${String(agent.id).padStart(5, '0')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // GSAP & Animaxxing Animation Orchestration
  useGSAP(
    () => {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReduced) return;

      // 1. Hero Stagger Entrance Timeline
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.from('.hero-anim-title', {
        y: 40,
        opacity: 0,
        duration: 1.0,
        clearProps: 'transform,opacity'
      })
        .from(
          '.hero-anim-sub',
          {
            y: 22,
            opacity: 0,
            duration: 0.8,
            clearProps: 'transform,opacity'
          },
          '-=0.7'
        )
        .from(
          '.hero-anim-tabs',
          {
            y: 16,
            opacity: 0,
            duration: 0.7,
            clearProps: 'transform,opacity'
          },
          '-=0.6'
        )
        .from(
          '.hero-anim-line',
          {
            opacity: 0,
            duration: 0.5,
            clearProps: 'opacity'
          },
          '-=0.4'
        )
        .from(
          '.hero-anim-btn',
          {
            scale: 0.94,
            opacity: 0,
            stagger: 0.1,
            duration: 0.6,
            ease: 'back.out(1.4)',
            clearProps: 'transform,opacity'
          },
          '-=0.3'
        )
        .from(
          '.hero-anim-telemetry',
          {
            y: 10,
            opacity: 0,
            duration: 0.6,
            clearProps: 'transform,opacity'
          },
          '-=0.3'
        )
        .from(
          '.hero-anim-showcase',
          {
            x: 45,
            opacity: 0,
            duration: 1.1,
            ease: 'power3.out',
            clearProps: 'transform,opacity'
          },
          '-=0.9'
        );

      // 2. Section 1 ScrollTrigger
      gsap.from('.sec1-anim-header', {
        scrollTrigger: {
          trigger: '#one-agent',
          start: 'top 85%'
        },
        y: 35,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        clearProps: 'transform,opacity'
      });

      gsap.from('.sec1-anim-card', {
        scrollTrigger: {
          trigger: '.sec1-anim-card',
          start: 'top 85%'
        },
        y: 40,
        scale: 0.97,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        clearProps: 'transform,opacity'
      });

      gsap.from('.sec1-anim-feature', {
        scrollTrigger: {
          trigger: '.sec1-feature-grid',
          start: 'top 85%'
        },
        y: 30,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: 'power2.out',
        clearProps: 'transform,opacity'
      });

      // 3. Section 2 ScrollTrigger
      gsap.from('.sec2-anim-header', {
        scrollTrigger: {
          trigger: '#sentences',
          start: 'top 85%'
        },
        y: 35,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        clearProps: 'transform,opacity'
      });

      gsap.from('.sec2-anim-ide', {
        scrollTrigger: {
          trigger: '.sec2-anim-ide',
          start: 'top 85%'
        },
        y: 40,
        opacity: 0,
        duration: 1.0,
        ease: 'power3.out',
        clearProps: 'transform,opacity'
      });

      // 4. Section 3 ScrollTrigger
      gsap.from('.sec3-anim-header', {
        scrollTrigger: {
          trigger: '#review',
          start: 'top 85%'
        },
        y: 35,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        clearProps: 'transform,opacity'
      });

      gsap.from('.sec3-anim-transcript', {
        scrollTrigger: {
          trigger: '.sec3-anim-transcript',
          start: 'top 85%'
        },
        y: 40,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        clearProps: 'transform,opacity'
      });

      // 5. Section 4 ScrollTrigger: Agent Swarm Cards
      gsap.from('.sec4-anim-header', {
        scrollTrigger: {
          trigger: '#browse-agents',
          start: 'top 85%'
        },
        y: 35,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        clearProps: 'transform,opacity'
      });

      gsap.from('.agent-card-anim', {
        scrollTrigger: {
          trigger: '.home-swarm-grid',
          start: 'top 85%'
        },
        y: 40,
        opacity: 0,
        stagger: 0.12,
        duration: 0.8,
        ease: 'power2.out',
        clearProps: 'transform,opacity'
      });

      // 6. Section 5 ScrollTrigger: Docs
      gsap.from('.sec5-anim-card', {
        scrollTrigger: {
          trigger: '#docs-title',
          start: 'top 85%'
        },
        y: 30,
        opacity: 0,
        stagger: 0.12,
        duration: 0.8,
        ease: 'power2.out',
        clearProps: 'transform,opacity'
      });
    },
    { scope: pageContainerRef }
  );

  return (
    <div ref={pageContainerRef} className="min-h-screen bg-black text-cream selection:bg-cream selection:text-black font-sans antialiased">
      {/* Global Navbar */}
      <Navbar />

      <main>
        {/* =========================================================================
            HERO SECTION: Haute-Couture GSAP Stagger Entrance & 3D Interactive Showcase
            ========================================================================= */}
        <section className="relative isolate overflow-hidden bg-black min-h-[calc(100vh-64px)] flex flex-col justify-start">
          {/* Subtle ambient glow in background (non-blocking) */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-40 right-0 h-[600px] w-[600px] rounded-full blur-[140px] opacity-25"
            style={{
              background: 'radial-gradient(circle, #00E599 0%, #fac88f 35%, transparent 70%)'
            }}
          />

          {/* Hero Content: Clean 2-column grid inside standard max-w-[1280px] */}
          <div className="relative z-10 mx-auto w-full max-w-[1280px] px-5 md:px-6 pt-24 pb-12 md:pt-28 md:pb-16">
            <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8 md:gap-12">
              {/* Left Column: Headline, tabs, CTA */}
              <div className="max-w-[520px]">
                {/* Luxury Serif Title with Brand Logo */}
                <h1 className="hero-anim-title text-[44px] leading-none text-cream sm:text-[64px] md:text-[84px]">
                  <span className="inline-flex items-center gap-[0.35em]">
                    <img
                      src="/rare-logo-icon.png"
                      alt="RARE Protocol"
                      className="object-contain drop-shadow-[0_0_20px_rgba(0,229,153,0.35)] inline-block align-middle"
                      style={{ height: '44px', width: 'auto', maxHeight: '44px', maxWidth: '44px', objectFit: 'contain', verticalAlign: 'middle', display: 'inline-block', flexShrink: 0 }}
                      width={44}
                      height={44}
                    />
                    <span className="font-serif leading-none tracking-[0.04em] font-medium">RARE</span>
                  </span>
                </h1>

                {/* Poetic Subheading */}
                <p className="hero-anim-sub mt-3 text-[21px] leading-snug text-cream md:text-[25px]">
                  Trade with agents.<br />
                  <span className="text-muted">Token-bound PDA vaults you review, mint, and own.</span>
                </p>

                {/* Hero Tabs: Cast, Guard, Target, Ladder */}
                <div role="tablist" aria-label="Agent mechanics" className="hero-anim-tabs mt-4 flex gap-5 text-[13px]">
                  {(['cast', 'guard', 'target', 'ladder']).map((tab) => {
                    const isActive = heroTab === tab;
                    return (
                      <button
                        key={tab}
                        type="button"
                        onClick={() => setHeroTab(tab)}
                        className={`border-b pb-1 font-medium capitalize transition-colors cursor-pointer ${isActive ? 'border-cream text-cream' : 'border-transparent text-dim hover:text-muted'
                          }`}
                      >
                        {tab}
                      </button>
                    );
                  })}
                </div>

                {/* Dynamic Sentence Line */}
                <p className="hero-anim-line mt-2.5 border-t border-line pt-2.5 font-mono text-[13px] text-cream/90 leading-relaxed min-h-[44px]">
                  {heroTabLines[heroTab]}
                </p>

                {/* Primary Action Buttons */}
                <div className="mt-4.5 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleMintAction(nextAgent)}
                    disabled={isMinting}
                    className="hero-anim-btn inline-flex h-9 items-center justify-center rounded-full bg-cream px-5 text-[13px] font-medium text-black transition-all hover:bg-cream/90 hover:shadow-[0_0_20px_rgba(246,239,226,0.3)] shadow-sm cursor-pointer disabled:opacity-50"
                  >
                    {isMinting ? 'Minting via Anchor CPI...' : `Mint Agent #${String(nextAgentId).padStart(5, '0')} (${activePrice.toFixed(3)} SOL)`}
                  </button>

                  <a
                    href="#browse-agents"
                    className="hero-anim-btn inline-flex h-9 items-center justify-center rounded-full border border-line bg-surface-1 px-4 text-[13px] font-medium text-cream hover:border-line-strong hover:bg-surface-2 transition-colors"
                  >
                    Browse Swarm →
                  </a>
                </div>

                {/* Telemetry Status Bar */}
                <div className="hero-anim-telemetry mt-3.5 flex items-center gap-3 font-mono text-[11px] text-dim">
                  <span className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-mint animate-pulse" />
                    <span className="text-muted">{soldCount} / 10,078 MINTED</span>
                  </span>
                  <span>·</span>
                  <span>GENESIS TIER 1</span>
                  <span>·</span>
                  <span className="text-mint">90% PDA BONDED</span>
                </div>
              </div>

              {/* Right Column: Hero Quantum Orb & Telemetry Animation */}
              <div className="hero-anim-showcase flex justify-center items-center">
                <HeroQuantumOrb />
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 1: "One agent. Every order."
            ========================================================================= */}
        <section id="one-agent" className="mx-auto max-w-[1280px] px-5 py-24 md:px-6 md:py-32">
          <div className="sec1-anim-header mx-auto max-w-[640px] text-center">
            <h2 className="font-serif text-[40px] leading-[1.05] text-cream md:text-[56px] font-medium">
              One agent. Every order.
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-muted">
              Inscribe the strategy once to an on-chain PDA. RARE turns it into an autonomous execution agent with 90% capital bonded to token-bound vaults on Solana, showing every CPI step before you sign.
            </p>
          </div>

          <div className="mx-auto mt-14 max-w-[1056px]">
            {/* Elegant JSON Code Card */}
            <div className="sec1-anim-card mx-auto max-w-[520px] overflow-hidden rounded-lg border border-line bg-surface-1 shadow-2xl">
              <div className="flex items-center justify-between border-b border-line px-3.5 py-2 font-mono text-[11px] text-dim bg-surface-2/40">
                <span>rare-agent-pda.json</span>
                <span className="text-mint flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-mint" />
                  ANCHOR CPI v1.2
                </span>
              </div>
              <pre tabIndex={0} className="overflow-x-auto p-4 font-mono text-[12.5px] leading-[1.7] text-cream/90">
                <code>
                  <span className="block whitespace-pre"><span className="text-dim">&#123;</span></span>
                  <span className="block whitespace-pre"><span className="text-dim">  </span><span className="text-peach">"agent_id"</span><span className="text-dim">: </span><span className="text-rose">143</span><span className="text-dim">,</span></span>
                  <span className="block whitespace-pre"><span className="text-dim">  </span><span className="text-peach">"archetype"</span><span className="text-dim">: </span><span className="text-rose">"Quantum Arbitrageur"</span><span className="text-dim">,</span></span>
                  <span className="block whitespace-pre"><span className="text-dim">  </span><span className="text-peach">"tier"</span><span className="text-dim">: </span><span className="text-rose">"Genesis Tier 1"</span><span className="text-dim">,</span></span>
                  <span className="block whitespace-pre"><span className="text-dim">  </span><span className="text-peach">"mint_price"</span><span className="text-dim">: </span><span className="text-rose">"0.020 SOL"</span><span className="text-dim">,</span></span>
                  <span className="block whitespace-pre"><span className="text-dim">  </span><span className="text-peach">"token_bound_pda"</span><span className="text-dim">: </span><span className="text-mint">"PDA256v3779B100Vault"</span><span className="text-dim">,</span></span>
                  <span className="block whitespace-pre"><span className="text-dim">  </span><span className="text-peach">"anchor_cpi_split"</span><span className="text-dim">: &#123;</span></span>
                  <span className="block whitespace-pre"><span className="text-dim">    </span><span className="text-peach">"agent_vault"</span><span className="text-dim">: </span><span className="text-mint">"90%"</span><span className="text-dim">,</span></span>
                  <span className="block whitespace-pre"><span className="text-dim">    </span><span className="text-peach">"protocol_ops"</span><span className="text-dim">: </span><span className="text-rose">"10%"</span></span>
                  <span className="block whitespace-pre"><span className="text-dim">  &#125;,</span></span>
                  <span className="block whitespace-pre"><span className="text-dim">  </span><span className="text-peach">"guard_rules"</span><span className="text-dim">: [</span></span>
                  <span className="block whitespace-pre"><span className="text-dim">    &#123; </span><span className="text-peach">"type"</span><span className="text-dim">: </span><span className="text-rose">"stop_loss"</span><span className="text-dim">, </span><span className="text-peach">"threshold"</span><span className="text-dim">: </span><span className="text-rose">"-15%"</span><span className="text-dim"> &#125;,</span></span>
                  <span className="block whitespace-pre"><span className="text-dim">    &#123; </span><span className="text-peach">"type"</span><span className="text-dim">: </span><span className="text-rose">"take_profit"</span><span className="text-dim">, </span><span className="text-peach">"target"</span><span className="text-dim">: </span><span className="text-rose">"+35%"</span><span className="text-dim"> &#125;</span></span>
                  <span className="block whitespace-pre"><span className="text-dim">  ]</span></span>
                  <span className="block whitespace-pre"><span className="text-dim">&#125;</span></span>
                </code>
              </pre>
            </div>

            {/* 4 Feature Pill Cards */}
            <div className="sec1-feature-grid mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="sec1-anim-feature rounded-lg border border-line bg-surface-1 p-5 transition-colors hover:border-line-strong hover:bg-surface-2">
                <span className="font-mono text-[11px] text-peach tracking-wide uppercase">01 // Cast</span>
                <h3 className="mt-2 text-[16px] font-medium text-cream">Instant On-Chain Mint</h3>
                <p className="mt-1.5 text-[13px] text-muted leading-relaxed">
                  Single-slot Ed25519 signature mints your NFT and instantiates its token-bound account.
                </p>
              </div>

              <div className="sec1-anim-feature rounded-lg border border-line bg-surface-1 p-5 transition-colors hover:border-line-strong hover:bg-surface-2">
                <span className="font-mono text-[11px] text-mint tracking-wide uppercase">02 // Custody</span>
                <h3 className="mt-2 text-[16px] font-medium text-cream">90% PDA Vault</h3>
                <p className="mt-1.5 text-[13px] text-muted leading-relaxed">
                  90% of mint capital stays locked inside the agent’s own PDA on Solana. Never touch creator wallets.
                </p>
              </div>

              <div className="sec1-anim-feature rounded-lg border border-line bg-surface-1 p-5 transition-colors hover:border-line-strong hover:bg-surface-2">
                <span className="font-mono text-[11px] text-rose tracking-wide uppercase">03 // Guard</span>
                <h3 className="mt-2 text-[16px] font-medium text-cream">Autonomous Stop-Loss</h3>
                <p className="mt-1.5 text-[13px] text-muted leading-relaxed">
                  Pyth oracle guards trigger automated risk unwinds when market drawdowns exceed programmed bounds.
                </p>
              </div>

              <div className="sec1-anim-feature rounded-lg border border-line bg-surface-1 p-5 transition-colors hover:border-line-strong hover:bg-surface-2">
                <span className="font-mono text-[11px] text-violet tracking-wide uppercase">04 // Ladder</span>
                <h3 className="mt-2 text-[16px] font-medium text-cream">10 Bonding Tiers</h3>
                <p className="mt-1.5 text-[13px] text-muted leading-relaxed">
                  10,078 total agents across 10 deterministic bonding bands from 0.02 SOL to 10.24 SOL.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 2: "Agents that read like sentences"
            ========================================================================= */}
        <section id="sentences" className="mx-auto max-w-[1280px] px-5 py-24 md:px-6 md:py-32 border-t border-line">
          <div className="sec2-anim-header mx-auto max-w-[640px] text-center">
            <h2 className="font-serif text-[40px] leading-[1.05] text-cream md:text-[56px] font-medium">
              Agents that read like sentences
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-muted">
              An agent is a verifiable on-chain manifest. The same agent reads as plain English instructions, as Rust Anchor code, and as the exact list of CPI transactions it executes.
            </p>
          </div>

          <div className="mx-auto mt-14 max-w-[1056px]">
            <div className="sec2-anim-ide overflow-hidden rounded-lg border border-line bg-black shadow-2xl">
              <div className="grid lg:grid-cols-[1.15fr_1fr]">
                {/* Left Side: Code Viewer Tabs */}
                <div className="min-w-0 border-line lg:border-r">
                  <div role="tablist" aria-label="Code views" className="flex border-b border-line bg-surface-1/40">
                    <button
                      type="button"
                      onClick={() => setCodeTab('json')}
                      className={`px-4 py-2 font-mono text-[12px] border-r border-line transition-colors ${codeTab === 'json' ? 'bg-surface-2 text-cream font-medium' : 'text-dim hover:text-muted'
                        }`}
                    >
                      agent_143.json
                    </button>
                    <button
                      type="button"
                      onClick={() => setCodeTab('rust')}
                      className={`px-4 py-2 font-mono text-[12px] border-r border-line transition-colors ${codeTab === 'rust' ? 'bg-surface-2 text-cream font-medium' : 'text-dim hover:text-muted'
                        }`}
                    >
                      pda_vault.rs
                    </button>
                    <button
                      type="button"
                      onClick={() => setCodeTab('ts')}
                      className={`px-4 py-2 font-mono text-[12px] border-r border-line transition-colors ${codeTab === 'ts' ? 'bg-surface-2 text-cream font-medium' : 'text-dim hover:text-muted'
                        }`}
                    >
                      cpi_route.ts
                    </button>
                  </div>

                  <pre className="max-h-[440px] overflow-auto p-4 font-mono text-[12.5px] leading-[1.7] text-cream/90">
                    {codeTab === 'json' && (
                      <code>
                        <span className="block whitespace-pre"><span className="text-dim select-none mr-3">01</span><span className="text-dim">&#123;</span></span>
                        <span className="block whitespace-pre"><span className="text-dim select-none mr-3">02</span><span className="text-dim">  </span><span className="text-peach">"name"</span><span className="text-dim">: </span><span className="text-rose">"Rare #00143"</span><span className="text-dim">,</span></span>
                        <span className="block whitespace-pre"><span className="text-dim select-none mr-3">03</span><span className="text-dim">  </span><span className="text-peach">"pda_seed"</span><span className="text-dim">: </span><span className="text-rose">"b'rare_agent_143'"</span><span className="text-dim">,</span></span>
                        <span className="block whitespace-pre"><span className="text-dim select-none mr-3">04</span><span className="text-dim">  </span><span className="text-peach">"capital_split"</span><span className="text-dim">: &#123;</span></span>
                        <span className="block whitespace-pre"><span className="text-dim select-none mr-3">05</span><span className="text-dim">    </span><span className="text-peach">"agent_pda_deposit_bps"</span><span className="text-dim">: </span><span className="text-mint">9000</span><span className="text-dim">,</span></span>
                        <span className="block whitespace-pre"><span className="text-dim select-none mr-3">06</span><span className="text-dim">    </span><span className="text-peach">"treasury_bps"</span><span className="text-dim">: </span><span className="text-rose">1000</span></span>
                        <span className="block whitespace-pre"><span className="text-dim select-none mr-3">07</span><span className="text-dim">  &#125;,</span></span>
                        <span className="block whitespace-pre"><span className="text-dim select-none mr-3">08</span><span className="text-dim">  </span><span className="text-peach">"execution_policy"</span><span className="text-dim">: &#123;</span></span>
                        <span className="block whitespace-pre"><span className="text-dim select-none mr-3">09</span><span className="text-dim">    </span><span className="text-peach">"max_slippage_bps"</span><span className="text-dim">: </span><span className="text-rose">50</span><span className="text-dim">,</span></span>
                        <span className="block whitespace-pre"><span className="text-dim select-none mr-3">10</span><span className="text-dim">    </span><span className="text-peach">"rebalance_trigger"</span><span className="text-dim">: </span><span className="text-rose">"price_delta &gt; 0.005"</span><span className="text-dim">,</span></span>
                        <span className="block whitespace-pre"><span className="text-dim select-none mr-3">11</span><span className="text-dim">    </span><span className="text-peach">"settlement_asset"</span><span className="text-dim">: </span><span className="text-mint">"SOL"</span></span>
                        <span className="block whitespace-pre"><span className="text-dim select-none mr-3">12</span><span className="text-dim">  &#125;</span></span>
                        <span className="block whitespace-pre"><span className="text-dim select-none mr-3">13</span><span className="text-dim">&#125;</span></span>
                      </code>
                    )}
                    {codeTab === 'rust' && (
                      <code>
                        <span className="block whitespace-pre"><span className="text-dim select-none mr-3">01</span><span className="text-violet">pub fn</span> <span className="text-cream">deposit_to_agent_pda</span>(ctx: Context&lt;MintAgent&gt;) -&gt; Result&lt;()&gt; &#123;</span>
                        <span className="block whitespace-pre"><span className="text-dim select-none mr-3">02</span>    <span className="text-violet">let</span> mint_amount = ctx.accounts.mint.price;</span>
                        <span className="block whitespace-pre"><span className="text-dim select-none mr-3">03</span>    <span className="text-violet">let</span> pda_deposit = mint_amount * <span className="text-mint">90</span> / <span className="text-mint">100</span>;</span>
                        <span className="block whitespace-pre"><span className="text-dim select-none mr-3">04</span>    <span className="text-dim">// Cross-Program Invocation to Agent PDA Vault</span></span>
                        <span className="block whitespace-pre"><span className="text-dim select-none mr-3">05</span>    anchor_lang::solana_program::program::invoke(</span>
                        <span className="block whitespace-pre"><span className="text-dim select-none mr-3">06</span>        &amp;system_instruction::transfer(</span>
                        <span className="block whitespace-pre"><span className="text-dim select-none mr-3">07</span>            &amp;ctx.accounts.payer.key(),</span>
                        <span className="block whitespace-pre"><span className="text-dim select-none mr-3">08</span>            &amp;ctx.accounts.agent_pda_vault.key(),</span>
                        <span className="block whitespace-pre"><span className="text-dim select-none mr-3">09</span>            pda_deposit,</span>
                        <span className="block whitespace-pre"><span className="text-dim select-none mr-3">10</span>        ),</span>
                        <span className="block whitespace-pre"><span className="text-dim select-none mr-3">11</span>        &amp;[ctx.accounts.payer.to_account_info(), ctx.accounts.agent_pda_vault.to_account_info()],</span>
                        <span className="block whitespace-pre"><span className="text-dim select-none mr-3">12</span>    )?;</span>
                        <span className="block whitespace-pre"><span className="text-dim select-none mr-3">13</span>    Ok(())</span>
                        <span className="block whitespace-pre"><span className="text-dim select-none mr-3">14</span>&#125;</span>
                      </code>
                    )}
                    {codeTab === 'ts' && (
                      <code>
                        <span className="block whitespace-pre"><span className="text-dim select-none mr-3">01</span><span className="text-violet">import</span> &#123; AnchorProvider, Program &#125; <span className="text-violet">from</span> <span className="text-rose">"@coral-xyz/anchor"</span>;</span>
                        <span className="block whitespace-pre"><span className="text-dim select-none mr-3">02</span><span className="text-violet">const</span> tx = <span className="text-violet">await</span> program.methods</span>
                        <span className="block whitespace-pre"><span className="text-dim select-none mr-3">03</span>  .mintAndBindPda(agentId)</span>
                        <span className="block whitespace-pre"><span className="text-dim select-none mr-3">04</span>  .accounts(&#123;</span>
                        <span className="block whitespace-pre"><span className="text-dim select-none mr-3">05</span>    payer: wallet.publicKey,</span>
                        <span className="block whitespace-pre"><span className="text-dim select-none mr-3">06</span>    agentPdaVault: pdaPublicKey,</span>
                        <span className="block whitespace-pre"><span className="text-dim select-none mr-3">07</span>    systemProgram: SystemProgram.programId</span>
                        <span className="block whitespace-pre"><span className="text-dim select-none mr-3">08</span>  &#125;)</span>
                        <span className="block whitespace-pre"><span className="text-dim select-none mr-3">09</span>  .rpc();</span>
                        <span className="block whitespace-pre"><span className="text-dim select-none mr-3">10</span>console.log(`Agent #${nextAgentId} activated`);</span>
                      </code>
                    )}
                  </pre>
                </div>

                {/* Right Side: Human vs Machine Sentence Breakdown */}
                <div className="flex flex-col justify-between p-5 bg-surface-1/20">
                  <div>
                    {/* View Switcher Toggle */}
                    <div className="flex items-center justify-between border-b border-line pb-3">
                      <span className="font-mono text-[11px] text-dim uppercase tracking-wider">Interpreter</span>
                      <div className="flex items-center rounded-md border border-line bg-surface-2 p-0.5 text-[11px]">
                        <button
                          type="button"
                          onClick={() => setHumanView(true)}
                          className={`rounded px-2.5 py-1 font-medium transition-colors cursor-pointer ${humanView ? 'bg-cream text-black' : 'text-dim hover:text-cream'
                            }`}
                        >
                          Human
                        </button>
                        <button
                          type="button"
                          onClick={() => setHumanView(false)}
                          className={`rounded px-2.5 py-1 font-medium transition-colors cursor-pointer ${!humanView ? 'bg-cream text-black' : 'text-dim hover:text-cream'
                            }`}
                        >
                          Machine
                        </button>
                      </div>
                    </div>

                    {/* Content Display */}
                    <div className="mt-4">
                      {humanView ? (
                        <div className="space-y-3 text-[13px] leading-relaxed text-muted">
                          <p>
                            <span className="text-cream font-medium">When you mint Agent #00143</span>, 90% of your 0.020 SOL is permanently credited to its autonomous token-bound PDA vault.
                          </p>
                          <p>
                            The agent continuously evaluates Pyth price feeds and rebalances liquidity when cross-market spreads exceed 0.5%.
                          </p>
                          <p>
                            Drawdowns beyond 15% immediately trigger the protective Stop-Loss guard to preserve vault principal in SOL.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-2 font-mono text-[11px] text-dim">
                          <div className="rounded border border-line bg-surface-2 p-2">
                            <span className="text-peach">INSTRUCTION:</span> MintAndBindPda<br />
                            <span className="text-peach">PROGRAM_ID:</span> RAREv3779...Vault<br />
                            <span className="text-peach">SPLIT:</span> 90% PDA / 10% Protocol Ops
                          </div>
                          <div className="rounded border border-line bg-surface-2 p-2">
                            <span className="text-mint">GAS:</span> 0.000005 SOL (5,000 lamports)<br />
                            <span className="text-mint">PDA SEED:</span> [rare_agent, 143]
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bonding Curve Progress Curve SVG */}
                  <div className="mt-6 border-t border-line pt-4">
                    <div className="flex items-center justify-between font-mono text-[10px] text-dim mb-1">
                      <span>PRICE LADDER (TIER 1 → 10)</span>
                      <span className="text-cream">0.02 SOL → 10.24 SOL</span>
                    </div>
                    <svg viewBox="0 0 300 48" className="w-full h-12 text-mint stroke-current fill-none" preserveAspectRatio="none">
                      <path
                        d="M 0 44 Q 150 42 220 28 T 300 4"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                      <circle cx="20" cy="44" r="3.5" className="fill-mint" />
                    </svg>
                    <div className="flex items-center justify-between text-[11px] text-dim font-mono mt-1">
                      <span>Tier 1 (Current)</span>
                      <span>Tier 10 (10,078)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 3: "The review guides you"
            ========================================================================= */}
        <section id="review" className="mx-auto max-w-[1280px] px-5 py-24 md:px-6 md:py-32 border-t border-line">
          <div className="sec3-anim-header mx-auto max-w-[640px] text-center">
            <h2 className="font-serif text-[40px] leading-[1.05] text-cream md:text-[56px] font-medium">
              The review guides you
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-muted">
              Quote, review, sign, anchor. Every step shows what will happen and asks your wallet only for what it needs.
            </p>
          </div>

          <div className="mx-auto mt-14 max-w-[1056px]">
            {/* Header with transcript label and pause toggle */}
            <div className="mb-2 flex items-center justify-between font-mono text-[11px] tracking-wide text-dim uppercase">
              <span>Sample transcript · the steps the app runs for you, not a command line</span>
              <button
                type="button"
                onClick={() => setTranscriptPaused(!transcriptPaused)}
                className="rounded px-2 py-0.5 normal-case border border-line bg-surface-1 hover:text-cream transition-colors cursor-pointer"
              >
                {transcriptPaused ? 'Resume' : 'Pause'}
              </button>
            </div>

            <div className="sec3-anim-transcript overflow-hidden rounded-lg border border-line bg-black shadow-2xl">
              {/* Stepper Tabs */}
              <div role="tablist" aria-label="Execution steps" className="grid grid-cols-2 border-b border-line sm:grid-cols-4">
                {[
                  { title: '01 quote', subtitle: 'find a route' },
                  { title: '02 review', subtitle: 'verify pda' },
                  { title: '03 sign', subtitle: 'wallet authorization' },
                  { title: '04 anchor cpi', subtitle: 'execute on-chain' }
                ].map((step, idx) => {
                  const isActive = transcriptTab === idx;
                  return (
                    <button
                      key={step.title}
                      type="button"
                      onClick={() => setTranscriptTab(idx)}
                      className={`relative border-line px-4 py-3 text-left font-mono text-[12px] transition-colors border-r last:border-r-0 cursor-pointer ${isActive ? 'bg-surface-2 text-cream font-medium' : 'text-muted hover:bg-surface-1 hover:text-cream'
                        }`}
                    >
                      <span className="block">{step.title}</span>
                      <span className="block text-[11px] text-dim">{step.subtitle}</span>
                      {isActive && (
                        <span className="absolute right-0 bottom-0 left-0 h-[2px] bg-mint" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Transcript Display Window */}
              <div className="p-5 font-mono text-[12.5px] leading-[1.8] bg-surface-1/30">
                {transcriptTab === 0 && (
                  <div>
                    <div className="text-dim">&gt; Fetching route quote across Solana AMM graphs...</div>
                    <div className="text-cream/90">&gt; Best execution via Jupiter V6: 0.020 SOL mint pricing derived.</div>
                    <div className="text-dim">&gt; Route latency: 42ms · Slippage budget: 0.5% max</div>
                  </div>
                )}
                {transcriptTab === 1 && (
                  <div>
                    <div className="text-dim">&gt; Validating token-bound PDA seeds against Anchor IDL:</div>
                    <div className="text-peach">&gt; Seed: [b"rare_agent", id=143, authority=user_pubkey]</div>
                    <div className="text-mint">&gt; Target Vault: PDA256v3779B100Vault · Verified 90% deposit rule intact.</div>
                  </div>
                )}
                {transcriptTab === 2 && (
                  <div>
                    <div className="text-dim">&gt; Requesting single Ed25519 signature from active Solana wallet...</div>
                    <div className="text-cream/90">&gt; Payload: 1 instruction (Anchor MintAndBindPda) · Zero blind signing.</div>
                    <div className="text-dim">&gt; Authorization confirmed via Privy Web3 Provider.</div>
                  </div>
                )}
                {transcriptTab === 3 && (
                  <div>
                    <div className="text-dim">&gt; Broadcasting transaction to Solana Mainnet-Beta...</div>
                    <div className="text-mint">&gt; Blockhash confirmed at slot #31094892 · 5,000 lamports fee</div>
                    <div className="text-cream/90">&gt; Agent #00143 PDA Vault funded with 0.018 SOL. Autonomous execution active.</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 4: "Browse agent swarm"
            ========================================================================= */}
        <section id="browse-agents" className="mx-auto max-w-[1104px] px-5 py-24 md:px-6 md:py-32 border-t border-line">
          <div className="sec4-anim-header flex items-end justify-between">
            <div>
              <h2 className="font-serif text-[32px] text-cream md:text-[42px] font-medium">Browse agent swarm</h2>
              <p className="mt-1 text-[14px] text-muted">10,078 unique AI agents inscribed with token-bound wallets.</p>
            </div>
            <Link className="text-[13px] text-muted hover:text-cream transition-colors" href="/roster">
              View all 10,078 →
            </Link>
          </div>

          {/* 4 Compact, Elegant Agent Cards */}
          <div className="mt-8 home-swarm-grid">
            {featuredAgents.map((agent) => (
              <div
                key={agent.id}
                onClick={() => setInspectedAgent(agent)}
                className="agent-card-anim group cursor-pointer overflow-hidden rounded-lg border border-line bg-surface-1 transition-[transform,background-color,border-color] duration-150 hover:-translate-y-1 hover:border-line-strong hover:bg-surface-2"
              >
                {/* Visual Avatar Container */}
                <div className="roster-card-box">
                  {/* Subtle Gradient Halo */}
                  <div
                    className="absolute inset-0 opacity-20 group-hover:opacity-35 transition-opacity"
                    style={{
                      background: `radial-gradient(circle at 50% 50%, ${agent.color || '#00E599'} 0%, transparent 70%)`
                    }}
                  />
                  {/* Agent NFT SVG Avatar */}
                  <div className="roster-card-frame">
                    <img
                      src={`/nfts/${agent.id}.svg`}
                      alt={agent.name}
                      className="pixel-avatar"
                      loading="lazy"
                    />
                  </div>
                  <span className="absolute top-2 left-2 z-20 rounded bg-black/75 px-1.5 py-0.5 font-mono text-[9px] text-dim border border-line">
                    #{String(agent.id).padStart(5, '0')}
                  </span>
                  <span className="absolute top-2 right-2 z-20 rounded bg-black/75 px-1.5 py-0.5 font-mono text-[9px] text-mint border border-line">
                    {agent.rarityTier}
                  </span>
                </div>

                {/* Card Meta Content */}
                <div className="p-3.5">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="font-serif text-[15px] text-cream font-medium truncate group-hover:text-mint transition-colors">
                      {agent.name}
                    </span>
                    <span className="font-mono text-[11px] text-mint font-medium shrink-0">
                      {agent.priceSol} SOL
                    </span>
                  </div>

                  <p className="mt-0.5 text-[11px] text-muted truncate">
                    {agent.role} · {agent.archetype}
                  </p>

                  <div className="mt-2.5 flex items-center justify-between border-t border-line/60 pt-2 font-mono text-[10px] text-dim">
                    <span>90% PDA: {agent.pdaFunding}</span>
                    <span className="text-cream/80 group-hover:text-mint transition-colors">Inspect →</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* =========================================================================
            SECTION 5: "Explore the protocol"
            ========================================================================= */}
        <section aria-labelledby="docs-title" className="mx-auto max-w-[1104px] px-5 pt-8 pb-24 md:px-6 border-t border-line">
          <h2 id="docs-title" className="font-serif text-[32px] text-cream md:text-[42px] font-medium">
            Explore the protocol
          </h2>

          <div className="mt-6 grid gap-3 md:grid-cols-2">
            <Link
              className="sec5-anim-card group block rounded-lg border border-line bg-surface-1 p-5 transition-[background-color,border-color] duration-150 hover:border-line-strong hover:bg-surface-2"
              href="/specs"
            >
              <span className="flex items-center gap-1.5 text-[15px] text-cream font-medium">
                Token-bound PDA Vaults
                <span aria-hidden="true" className="transition-transform duration-150 group-hover:translate-x-1">→</span>
              </span>
              <span className="mt-1 block text-[13px] text-muted">
                Non-custodial account derivation and 90% mint capital deposit architecture on Solana.
              </span>
            </Link>

            <Link
              className="sec5-anim-card group block rounded-lg border border-line bg-surface-1 p-5 transition-[background-color,border-color] duration-150 hover:border-line-strong hover:bg-surface-2"
              href="/specs#cpi"
            >
              <span className="flex items-center gap-1.5 text-[15px] text-cream font-medium">
                Anchor CPI Execution
                <span aria-hidden="true" className="transition-transform duration-150 group-hover:translate-x-1">→</span>
              </span>
              <span className="mt-1 block text-[13px] text-muted">
                Cross-program invocation rules, Pyth oracle safety guards, and atomic order settlement.
              </span>
            </Link>

            <Link
              className="sec5-anim-card group block rounded-lg border border-line bg-surface-1 p-5 transition-[background-color,border-color] duration-150 hover:border-line-strong hover:bg-surface-2"
              href="/ladder"
            >
              <span className="flex items-center gap-1.5 text-[15px] text-cream font-medium">
                10-Tier Price Ladder
                <span aria-hidden="true" className="transition-transform duration-150 group-hover:translate-x-1">→</span>
              </span>
              <span className="mt-1 block text-[13px] text-muted">
                Bonding curve mathematics governing the exact supply distribution of all 10,078 agents.
              </span>
            </Link>

            <Link
              className="sec5-anim-card group block rounded-lg border border-line bg-surface-1 p-5 transition-[background-color,border-color] duration-150 hover:border-line-strong hover:bg-surface-2"
              href="/whitepaper"
            >
              <span className="flex items-center gap-1.5 text-[15px] text-cream font-medium">
                Whitepaper PDF
                <span aria-hidden="true" className="transition-transform duration-150 group-hover:translate-x-1">→</span>
              </span>
              <span className="mt-1 block text-[13px] text-muted">
                Read the formal mathematical and cryptographic specifications for RARE Protocol.
              </span>
            </Link>
          </div>
        </section>
      </main>

      {/* Global Footer */}
      <Footer />

      {/* =========================================================================
          AGENT INSPECT MODAL (ZERO EMOJIS, HAUTE COUTURE LUXURY DESIGN)
          ========================================================================= */}
      {inspectedAgent && (
        <div
          className="agent-modal-backdrop"
          onClick={() => setInspectedAgent(null)}
        >
          <div
            className="agent-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={() => setInspectedAgent(null)}
              className="absolute top-4 right-4 rounded-md border border-line bg-surface-2 p-1.5 text-dim hover:text-cream transition-colors cursor-pointer"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <div className="agent-modal-layout">
              {/* Agent Avatar */}
              <div className="agent-modal-avatar-box">
                <img
                  src={`/nfts/${inspectedAgent.id}.svg`}
                  alt={inspectedAgent.name}
                  className="pixel-avatar"
                />
              </div>

              {/* Details */}
              <div className="agent-modal-info">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] text-dim border border-line px-1.5 rounded">
                    #{String(inspectedAgent.id).padStart(5, '0')}
                  </span>
                  <span className="font-mono text-[11px] text-mint">{inspectedAgent.band}</span>
                </div>

                <h3 className="font-serif text-[24px] text-cream mt-1 font-medium">{inspectedAgent.name}</h3>
                <p className="text-[13px] text-muted">{inspectedAgent.role}</p>

                <div className="mt-4 space-y-1.5 font-mono text-[11px] border-t border-line pt-3">
                  <div className="flex justify-between">
                    <span className="text-dim">Mint Price:</span>
                    <span className="text-cream font-medium">{inspectedAgent.priceSol} SOL</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-dim">90% Vault Deposit:</span>
                    <span className="text-mint font-medium">{(inspectedAgent.priceSol * 0.9).toFixed(3)} SOL</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-dim">PDA Vault:</span>
                    <span className="text-cream truncate max-w-[180px]">{inspectedAgent.pdaVault}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-dim">Rarity Score:</span>
                    <span className="text-cream">{inspectedAgent.rarityScore} ({inspectedAgent.rarityTier})</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-6 flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => handleMintAction(inspectedAgent)}
                    disabled={isMinting}
                    className="flex-1 inline-flex h-9 items-center justify-center rounded-full bg-cream text-[13px] font-medium text-black hover:bg-cream/90 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {isMinting ? 'Minting...' : `Mint for ${inspectedAgent.priceSol} SOL`}
                  </button>
                  <button
                    type="button"
                    onClick={() => setInspectedAgent(null)}
                    className="inline-flex h-9 items-center justify-center rounded-full border border-line bg-surface-2 px-4 text-[12px] font-medium text-cream hover:bg-surface-3 transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MINT CELEBRATION MODAL (ZERO EMOJIS, SLEEK ON-CHAIN RECEIPT)
          ========================================================================= */}
      {mintCelebration && (
        <div
          className="agent-modal-backdrop"
          onClick={() => setMintCelebration(null)}
        >
          <div
            className="agent-celebration-card"
            onClick={(e) => e.stopPropagation()}
          >
            {/* RARE Protocol Logo */}
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-mint/30 bg-mint/10 p-2 text-mint">
              <img
                src="/rare-logo-icon.png"
                alt="RARE"
                className="object-contain drop-shadow-[0_0_10px_rgba(0,229,153,0.5)]"
                style={{ height: '36px', width: 'auto', maxHeight: '36px', maxWidth: '36px', objectFit: 'contain', display: 'block' }}
                width={36}
                height={36}
              />
            </div>

            <h3 className="font-serif text-[28px] text-cream mt-4 font-medium">Agent Activated</h3>
            <p className="mt-1 text-[14px] text-muted">
              {mintCelebration.name} is now autonomous on Solana Mainnet.
            </p>

            <div className="my-6 rounded-lg border border-line bg-black/60 p-4 text-left font-mono text-[12px] space-y-2">
              <div className="flex justify-between">
                <span className="text-dim">Token PDA Vault:</span>
                <span className="text-mint font-medium">{mintCelebration.pdaVault}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dim">Deposited (90%):</span>
                <span className="text-cream">{mintCelebration.deposited} SOL</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dim">Signature:</span>
                <span className="text-dim truncate max-w-[200px]">{mintCelebration.txSignature}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleDownloadManifest(mintCelebration)}
                className="flex-1 inline-flex h-9 items-center justify-center rounded-full border border-line bg-surface-2 text-[13px] font-medium text-cream hover:bg-surface-3 transition-colors cursor-pointer"
              >
                Download Manifest (.json)
              </button>
              <button
                type="button"
                onClick={() => setMintCelebration(null)}
                className="flex-1 inline-flex h-9 items-center justify-center rounded-full bg-cream text-[13px] font-medium text-black hover:bg-cream/90 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
