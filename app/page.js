'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import GammaHeroShowcase from '../components/GammaHeroShowcase';
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

  // Rarible Swarm Category Filter State
  const [swarmFilter, setSwarmFilter] = useState('all');
  const SWARM_FILTERS = [
    { id: 'all', label: 'All Agents' },
    { id: 'trending', label: 'Trending' },
    { id: 'top-tier', label: 'Top Tier' },
    { id: 'arbitrage', label: 'Quantum Arbitrage' },
    { id: 'sentinel', label: 'Sentinel Guards' },
    { id: 'grid', label: 'Grid Execution' },
    { id: 'momentum', label: 'Momentum Hunters' },
    { id: 'rebalance', label: 'Vault Rebalancers' }
  ];

  const displayedSwarmAgents = React.useMemo(() => {
    if (swarmFilter === 'all') return featuredAgents;
    if (swarmFilter === 'trending') return [getAgentMetadata(143), getAgentMetadata(42), getAgentMetadata(100), getAgentMetadata(777)];
    if (swarmFilter === 'top-tier') return [getAgentMetadata(1), getAgentMetadata(10), getAgentMetadata(100), getAgentMetadata(500)];
    if (swarmFilter === 'arbitrage') return [getAgentMetadata(143), getAgentMetadata(243), getAgentMetadata(343), getAgentMetadata(443)];
    if (swarmFilter === 'sentinel') return [getAgentMetadata(140), getAgentMetadata(240), getAgentMetadata(340), getAgentMetadata(440)];
    if (swarmFilter === 'grid') return [getAgentMetadata(141), getAgentMetadata(241), getAgentMetadata(341), getAgentMetadata(441)];
    if (swarmFilter === 'momentum') return [getAgentMetadata(144), getAgentMetadata(244), getAgentMetadata(344), getAgentMetadata(444)];
    if (swarmFilter === 'rebalance') return [getAgentMetadata(142), getAgentMetadata(242), getAgentMetadata(342), getAgentMetadata(442)];
    return featuredAgents;
  }, [swarmFilter]);

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
    <div ref={pageContainerRef} className="gamma-page-container">
      {/* Global Navbar */}
      <Navbar />

      <main>
        {/* =========================================================================
            HERO SECTION: Exact Gamma.io (Mobbin Reference) Aesthetic
            ========================================================================= */}
        <section className="gamma-hero-section">
          <div className="gamma-hero-grid">
            {/* Left Column: Category, Big Display Headline, Subtitle, Pill Buttons */}
            <div>
              {/* Category Header with Icon: Autonomous Agents */}
              <div className="gamma-badge">
                <span className="gamma-badge-icon">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M4 4h16v16H4V4zm2 2v12h12V6H6z" />
                  </svg>
                </span>
                <span>Autonomous Agents</span>
              </div>

              {/* Display Title: RARE Protocol */}
              <h1 className="hero-anim-title gamma-hero-title">
                RARE Protocol
              </h1>

              {/* Subtitle */}
              <p className="hero-anim-sub gamma-hero-subtitle">
                RARE is Solana's first token-bound agent protocol. Review, mint, and own autonomous AI agents with 90% capital bonded to dedicated on-chain PDA vaults.
              </p>

              {/* Primary Action Buttons (Exact Gamma Pill CTAs) */}
              <div className="gamma-hero-actions">
                <button
                  type="button"
                  onClick={() => handleMintAction(nextAgent)}
                  disabled={isMinting}
                  className="gamma-btn-black"
                  style={{ padding: '12px 28px', fontSize: '14.5px' }}
                >
                  {isMinting ? 'Minting via Anchor...' : `Mint Agent #${String(nextAgentId).padStart(5, '0')} (${activePrice.toFixed(3)} SOL)`}
                </button>

                <a
                  href="#browse-agents"
                  className="gamma-btn-white"
                  style={{ padding: '12px 26px', fontSize: '14.5px' }}
                >
                  Browse Swarm
                </a>
              </div>

              {/* Telemetry Status Bar */}
              <div className="gamma-telemetry">
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 700, color: '#ffffff' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '9999px', background: '#10b981', display: 'inline-block' }} />
                  <span>{soldCount} / 10,078 MINTED</span>
                </span>
                <span>·</span>
                <span>GENESIS TIER 1</span>
                <span>·</span>
                <span style={{ color: '#a855f7', fontWeight: 700 }}>90% PDA BONDED</span>
              </div>
            </div>

            {/* Right Column: Gamma Elevated Showcase Card with Stacked Agent NFTs */}
            <div className="hero-anim-showcase" style={{ display: 'flex', justifyContent: 'center' }}>
              <GammaHeroShowcase onSelectAgent={(agent) => setInspectedAgent(agent)} />
            </div>
          </div>

          {/* Bottom Featured Dock / 5 Core Autonomous Agent Archetypes */}
          <div className="gamma-dock">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '9999px', background: '#a855f7' }} />
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.04em', fontFamily: 'var(--font-jetbrains), monospace' }}>
                  Core Agent Archetypes
                </span>
              </div>
              <Link href="/roster" style={{ fontSize: '12px', fontWeight: 600, color: '#a855f7', textDecoration: 'none' }}>
                Explore Swarm Roster →
              </Link>
            </div>

            <div className="gamma-dock-grid">
              {/* Archetype 1: Quantum Arbitrage */}
              <Link
                href="/roster"
                className="gamma-dock-item"
                style={{
                  background: '#18191b',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  color: '#ffffff',
                  textDecoration: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '14px',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.5)'
                }}
              >
                <div style={{
                  width: '100%',
                  aspectRatio: '1/1',
                  borderRadius: '14px',
                  background: '#111214',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                  padding: '12px',
                  marginBottom: '12px'
                }}>
                  <img
                    src="/nfts/143.svg"
                    alt="Quantum Arbitrage"
                    style={{ width: '90%', height: '90%', maxHeight: '135px', objectFit: 'contain', imageRendering: 'pixelated' }}
                  />
                  <span style={{
                    position: 'absolute',
                    top: '8px',
                    left: '8px',
                    fontSize: '9.5px',
                    fontWeight: 700,
                    background: '#9333ea',
                    color: '#ffffff',
                    padding: '3px 8px',
                    borderRadius: '9999px',
                    fontFamily: 'var(--font-jetbrains), monospace',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
                  }}>
                    Active · Jupiter
                  </span>
                </div>
                <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span>Quantum Arbitrage</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="#facc15" style={{ flexShrink: 0 }}>
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                </div>
                <div style={{ fontSize: '11px', color: '#c084fc', marginTop: '2px', fontFamily: 'var(--font-jetbrains), monospace', fontWeight: 600 }}>
                  Cross-DEX Spreads
                </div>
              </Link>

              {/* Archetype 2: Sentinel Guards */}
              <Link
                href="/roster"
                className="gamma-dock-item"
                style={{
                  background: '#18191b',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  color: '#ffffff',
                  textDecoration: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '14px',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.5)'
                }}
              >
                <div style={{
                  width: '100%',
                  aspectRatio: '1/1',
                  borderRadius: '14px',
                  background: '#111214',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                  padding: '12px',
                  marginBottom: '12px'
                }}>
                  <img
                    src="/nfts/140.svg"
                    alt="Sentinel Guards"
                    style={{ width: '90%', height: '90%', maxHeight: '135px', objectFit: 'contain', imageRendering: 'pixelated' }}
                  />
                  <span style={{
                    position: 'absolute',
                    top: '8px',
                    left: '8px',
                    fontSize: '9.5px',
                    fontWeight: 700,
                    background: '#059669',
                    color: '#ffffff',
                    padding: '3px 8px',
                    borderRadius: '9999px',
                    fontFamily: 'var(--font-jetbrains), monospace',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
                  }}>
                    Pyth Oracle
                  </span>
                </div>
                <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span>Sentinel Guards</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="#facc15" style={{ flexShrink: 0 }}>
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                </div>
                <div style={{ fontSize: '11px', color: '#34d399', marginTop: '2px', fontFamily: 'var(--font-jetbrains), monospace', fontWeight: 600 }}>
                  -15% Stop-Loss Shield
                </div>
              </Link>

              {/* Archetype 3: Grid Execution */}
              <Link
                href="/roster"
                className="gamma-dock-item"
                style={{
                  background: '#18191b',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  color: '#ffffff',
                  textDecoration: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '14px',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.5)'
                }}
              >
                <div style={{
                  width: '100%',
                  aspectRatio: '1/1',
                  borderRadius: '14px',
                  background: '#111214',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                  padding: '12px',
                  marginBottom: '12px'
                }}>
                  <img
                    src="/nfts/141.svg"
                    alt="Grid Execution"
                    style={{ width: '90%', height: '90%', maxHeight: '135px', objectFit: 'contain', imageRendering: 'pixelated' }}
                  />
                  <span style={{
                    position: 'absolute',
                    top: '8px',
                    left: '8px',
                    fontSize: '9.5px',
                    fontWeight: 700,
                    background: '#1e293b',
                    color: '#ffffff',
                    padding: '3px 8px',
                    borderRadius: '9999px',
                    fontFamily: 'var(--font-jetbrains), monospace',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
                  }}>
                    Raydium CLMM
                  </span>
                </div>
                <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span>Grid Execution</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="#facc15" style={{ flexShrink: 0 }}>
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                </div>
                <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px', fontFamily: 'var(--font-jetbrains), monospace', fontWeight: 600 }}>
                  High-Frequency Ranges
                </div>
              </Link>

              {/* Archetype 4: Momentum Hunters */}
              <Link
                href="/roster"
                className="gamma-dock-item"
                style={{
                  background: '#18191b',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  color: '#ffffff',
                  textDecoration: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '14px',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.5)'
                }}
              >
                <div style={{
                  width: '100%',
                  aspectRatio: '1/1',
                  borderRadius: '14px',
                  background: '#111214',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                  padding: '12px',
                  marginBottom: '12px'
                }}>
                  <img
                    src="/nfts/144.svg"
                    alt="Momentum Hunters"
                    style={{ width: '90%', height: '90%', maxHeight: '135px', objectFit: 'contain', imageRendering: 'pixelated' }}
                  />
                  <span style={{
                    position: 'absolute',
                    top: '8px',
                    left: '8px',
                    fontSize: '9.5px',
                    fontWeight: 700,
                    background: '#db2777',
                    color: '#ffffff',
                    padding: '3px 8px',
                    borderRadius: '9999px',
                    fontFamily: 'var(--font-jetbrains), monospace',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
                  }}>
                    Trend Signal
                  </span>
                </div>
                <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span>Momentum Hunters</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="#facc15" style={{ flexShrink: 0 }}>
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                </div>
                <div style={{ fontSize: '11px', color: '#f472b6', marginTop: '2px', fontFamily: 'var(--font-jetbrains), monospace', fontWeight: 600 }}>
                  Volume Breakouts
                </div>
              </Link>

              {/* Archetype 5: Vault Rebalancers */}
              <Link
                href="/roster"
                className="gamma-dock-item"
                style={{
                  background: '#18191b',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  color: '#ffffff',
                  textDecoration: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '14px',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.5)'
                }}
              >
                <div style={{
                  width: '100%',
                  aspectRatio: '1/1',
                  borderRadius: '14px',
                  background: '#111214',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                  padding: '12px',
                  marginBottom: '12px'
                }}>
                  <img
                    src="/nfts/142.svg"
                    alt="Vault Rebalancers"
                    style={{ width: '90%', height: '90%', maxHeight: '135px', objectFit: 'contain', imageRendering: 'pixelated' }}
                  />
                  <span style={{
                    position: 'absolute',
                    top: '8px',
                    left: '8px',
                    fontSize: '9.5px',
                    fontWeight: 700,
                    background: '#d97706',
                    color: '#ffffff',
                    padding: '3px 8px',
                    borderRadius: '9999px',
                    fontFamily: 'var(--font-jetbrains), monospace',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
                  }}>
                    90% PDA Vault
                  </span>
                </div>
                <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span>Vault Rebalancers</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="#facc15" style={{ flexShrink: 0 }}>
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                </div>
                <div style={{ fontSize: '11px', color: '#fbbf24', marginTop: '2px', fontFamily: 'var(--font-jetbrains), monospace', fontWeight: 600 }}>
                  Auto +35% Take Profit
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 1: "One agent. Every order."
            ========================================================================= */}
        <section id="one-agent" className="mx-auto max-w-[1360px] px-5 py-20 md:px-8 md:py-28 border-t border-white/[0.08]">
          <div className="sec1-anim-header mx-auto max-w-[640px] text-center">
            <h2 className="font-sans text-[32px] sm:text-[44px] text-white font-bold tracking-tight leading-tight">
              One agent. Every order.
            </h2>
            <p className="mt-3.5 text-[15px] sm:text-[16px] leading-relaxed text-slate-400">
              Inscribe the strategy once to an on-chain PDA. RARE turns it into an autonomous execution agent with 90% capital bonded to token-bound vaults on Solana, showing every CPI step before you sign.
            </p>
          </div>

          <div className="mx-auto mt-12 max-w-[1056px]">
            {/* Elegant JSON Code Card */}
            <div className="sec1-anim-card mx-auto max-w-[540px] overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0c0d14] shadow-2xl">
              <div className="flex items-center justify-between border-b border-zinc-800/90 px-4 py-3 font-mono text-[11px] text-zinc-400 bg-zinc-900/60">
                <span>rare-agent-pda.json</span>
                <span className="text-emerald-400 flex items-center gap-1.5 font-semibold">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  ANCHOR CPI v0.30
                </span>
              </div>
              <pre tabIndex={0} className="overflow-x-auto p-4 font-mono text-[12px] leading-[1.7] text-zinc-300">
                <code>
                  <span className="block whitespace-pre"><span className="text-zinc-600">&#123;</span></span>
                  <span className="block whitespace-pre"><span className="text-zinc-600">  </span><span className="text-zinc-400">"agent_id"</span><span className="text-zinc-600">: </span><span className="text-emerald-400 font-semibold">143</span><span className="text-zinc-600">,</span></span>
                  <span className="block whitespace-pre"><span className="text-zinc-600">  </span><span className="text-zinc-400">"archetype"</span><span className="text-zinc-600">: </span><span className="text-white">"Quantum Arbitrageur"</span><span className="text-zinc-600">,</span></span>
                  <span className="block whitespace-pre"><span className="text-zinc-600">  </span><span className="text-zinc-400">"tier"</span><span className="text-zinc-600">: </span><span className="text-zinc-300">"Genesis Tier 1"</span><span className="text-zinc-600">,</span></span>
                  <span className="block whitespace-pre"><span className="text-zinc-600">  </span><span className="text-zinc-400">"mint_price"</span><span className="text-zinc-600">: </span><span className="text-emerald-400 font-semibold">"0.020 SOL"</span><span className="text-zinc-600">,</span></span>
                  <span className="block whitespace-pre"><span className="text-zinc-600">  </span><span className="text-zinc-400">"token_bound_pda"</span><span className="text-zinc-600">: </span><span className="text-cyan-400">"PDA256v3779B100Vault"</span><span className="text-zinc-600">,</span></span>
                  <span className="block whitespace-pre"><span className="text-zinc-600">  </span><span className="text-zinc-400">"anchor_cpi_split"</span><span className="text-zinc-600">: &#123;</span></span>
                  <span className="block whitespace-pre"><span className="text-zinc-600">    </span><span className="text-zinc-400">"agent_vault"</span><span className="text-zinc-600">: </span><span className="text-emerald-400 font-semibold">"90%"</span><span className="text-zinc-600">,</span></span>
                  <span className="block whitespace-pre"><span className="text-zinc-600">    </span><span className="text-zinc-400">"protocol_ops"</span><span className="text-zinc-600">: </span><span className="text-zinc-400">"10%"</span></span>
                  <span className="block whitespace-pre"><span className="text-zinc-600">  &#125;,</span></span>
                  <span className="block whitespace-pre"><span className="text-zinc-600">  </span><span className="text-zinc-400">"guard_rules"</span><span className="text-zinc-600">: [</span></span>
                  <span className="block whitespace-pre"><span className="text-zinc-600">    &#123; </span><span className="text-zinc-400">"type"</span><span className="text-zinc-600">: </span><span className="text-cyan-400">"stop_loss"</span><span className="text-zinc-600">, </span><span className="text-zinc-400">"threshold"</span><span className="text-zinc-600">: </span><span className="text-rose-400">"-15%"</span><span className="text-zinc-600"> &#125;,</span></span>
                  <span className="block whitespace-pre"><span className="text-zinc-600">    &#123; </span><span className="text-zinc-400">"type"</span><span className="text-zinc-600">: </span><span className="text-cyan-400">"take_profit"</span><span className="text-zinc-600">, </span><span className="text-zinc-400">"target"</span><span className="text-zinc-600">: </span><span className="text-emerald-400 font-semibold">"+35%"</span><span className="text-zinc-600"> &#125;</span></span>
                  <span className="block whitespace-pre"><span className="text-zinc-600">  ]</span></span>
                  <span className="block whitespace-pre"><span className="text-zinc-600">&#125;</span></span>
                </code>
              </pre>
            </div>

            {/* 4 Feature Cards */}
            <div className="sec1-feature-grid mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="sec1-anim-feature rounded-2xl border border-white/[0.08] bg-[#18191b] p-6 shadow-lg hover:border-white/20 transition-all">
                <span className="font-mono text-[11px] text-purple-400 font-semibold tracking-wide uppercase">01 // Cast</span>
                <h3 className="mt-2 text-[16px] font-bold text-white">Instant On-Chain Mint</h3>
                <p className="mt-1.5 text-[13px] text-slate-400 leading-relaxed">
                  Single-slot Ed25519 signature mints your NFT and instantiates its token-bound account.
                </p>
              </div>

              <div className="sec1-anim-feature rounded-2xl border border-white/[0.08] bg-[#18191b] p-6 shadow-lg hover:border-white/20 transition-all">
                <span className="font-mono text-[11px] text-emerald-400 font-semibold tracking-wide uppercase">02 // Custody</span>
                <h3 className="mt-2 text-[16px] font-bold text-white">90% PDA Vault</h3>
                <p className="mt-1.5 text-[13px] text-slate-400 leading-relaxed">
                  90% of mint capital stays locked inside the agent’s own PDA on Solana. Never touch creator wallets.
                </p>
              </div>

              <div className="sec1-anim-feature rounded-2xl border border-white/[0.08] bg-[#18191b] p-6 shadow-lg hover:border-white/20 transition-all">
                <span className="font-mono text-[11px] text-purple-400 font-semibold tracking-wide uppercase">03 // Guard</span>
                <h3 className="mt-2 text-[16px] font-bold text-white">Autonomous Stop-Loss</h3>
                <p className="mt-1.5 text-[13px] text-slate-400 leading-relaxed">
                  Pyth oracle guards trigger automated risk unwinds when market drawdowns exceed programmed bounds.
                </p>
              </div>

              <div className="sec1-anim-feature rounded-2xl border border-white/[0.08] bg-[#18191b] p-6 shadow-lg hover:border-white/20 transition-all">
                <span className="font-mono text-[11px] text-emerald-400 font-semibold tracking-wide uppercase">04 // Ladder</span>
                <h3 className="mt-2 text-[16px] font-bold text-white">10 Bonding Tiers</h3>
                <p className="mt-1.5 text-[13px] text-slate-400 leading-relaxed">
                  10,078 total agents across 10 deterministic bonding bands from 0.02 SOL to 10.24 SOL.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 2: "Agents that read like sentences"
            ========================================================================= */}
        <section id="sentences" className="mx-auto max-w-[1360px] px-5 py-20 md:px-8 md:py-28 border-t border-white/[0.08]">
          <div className="sec2-anim-header mx-auto max-w-[640px] text-center">
            <h2 className="font-sans text-[32px] sm:text-[44px] text-white font-bold tracking-tight leading-tight">
              Agents that read like sentences
            </h2>
            <p className="mt-3.5 text-[15px] sm:text-[16px] leading-relaxed text-slate-400">
              An agent is a verifiable on-chain manifest. The same agent reads as plain English instructions, as Rust Anchor code, and as the exact list of CPI transactions it executes.
            </p>
          </div>

          <div className="mx-auto mt-12 max-w-[1056px]">
            <div className="sec2-anim-ide overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0c0d14] shadow-2xl">
              <div className="grid lg:grid-cols-[1.15fr_1fr]">
                {/* Left Side: Code Viewer Tabs */}
                <div className="min-w-0 border-zinc-800 lg:border-r">
                  <div role="tablist" aria-label="Code views" className="flex border-b border-zinc-800 bg-zinc-900/60">
                    <button
                      type="button"
                      onClick={() => setCodeTab('json')}
                      className={`px-4 py-2.5 font-mono text-[12px] border-r border-zinc-800 transition-colors cursor-pointer ${codeTab === 'json' ? 'bg-zinc-800 text-white font-semibold' : 'text-zinc-400 hover:text-zinc-200'
                        }`}
                    >
                      agent_143.json
                    </button>
                    <button
                      type="button"
                      onClick={() => setCodeTab('rust')}
                      className={`px-4 py-2.5 font-mono text-[12px] border-r border-zinc-800 transition-colors cursor-pointer ${codeTab === 'rust' ? 'bg-zinc-800 text-white font-semibold' : 'text-zinc-400 hover:text-zinc-200'
                        }`}
                    >
                      pda_vault.rs
                    </button>
                    <button
                      type="button"
                      onClick={() => setCodeTab('ts')}
                      className={`px-4 py-2.5 font-mono text-[12px] border-r border-zinc-800 transition-colors cursor-pointer ${codeTab === 'ts' ? 'bg-zinc-800 text-white font-semibold' : 'text-zinc-400 hover:text-zinc-200'
                        }`}
                    >
                      cpi_route.ts
                    </button>
                  </div>

                  <pre className="max-h-[440px] overflow-auto p-4 font-mono text-[12px] leading-[1.7] text-zinc-300 bg-black/60">
                    {codeTab === 'json' && (
                      <code>
                        <span className="block whitespace-pre"><span className="text-zinc-600 select-none mr-3">01</span><span className="text-zinc-600">&#123;</span></span>
                        <span className="block whitespace-pre"><span className="text-zinc-600 select-none mr-3">02</span><span className="text-zinc-600">  </span><span className="text-zinc-400">"name"</span><span className="text-zinc-600">: </span><span className="text-white">"Rare #00143"</span><span className="text-zinc-600">,</span></span>
                        <span className="block whitespace-pre"><span className="text-zinc-600 select-none mr-3">03</span><span className="text-zinc-600">  </span><span className="text-zinc-400">"pda_seed"</span><span className="text-zinc-600">: </span><span className="text-cyan-400">"b'rare_agent_143'"</span><span className="text-zinc-600">,</span></span>
                        <span className="block whitespace-pre"><span className="text-zinc-600 select-none mr-3">04</span><span className="text-zinc-600">  </span><span className="text-zinc-400">"capital_split"</span><span className="text-zinc-600">: &#123;</span></span>
                        <span className="block whitespace-pre"><span className="text-zinc-600 select-none mr-3">05</span><span className="text-zinc-600">    </span><span className="text-zinc-400">"agent_pda_deposit_bps"</span><span className="text-zinc-600">: </span><span className="text-emerald-400 font-semibold">9000</span><span className="text-zinc-600">,</span></span>
                        <span className="block whitespace-pre"><span className="text-zinc-600 select-none mr-3">06</span><span className="text-zinc-600">    </span><span className="text-zinc-400">"treasury_bps"</span><span className="text-zinc-600">: </span><span className="text-zinc-400">1000</span></span>
                        <span className="block whitespace-pre"><span className="text-zinc-600 select-none mr-3">07</span><span className="text-zinc-600">  &#125;,</span></span>
                        <span className="block whitespace-pre"><span className="text-zinc-600 select-none mr-3">08</span><span className="text-zinc-600">  </span><span className="text-zinc-400">"execution_policy"</span><span className="text-zinc-600">: &#123;</span></span>
                        <span className="block whitespace-pre"><span className="text-zinc-600 select-none mr-3">09</span><span className="text-zinc-600">    </span><span className="text-zinc-400">"max_slippage_bps"</span><span className="text-zinc-600">: </span><span className="text-white">50</span><span className="text-zinc-600">,</span></span>
                        <span className="block whitespace-pre"><span className="text-zinc-600 select-none mr-3">10</span><span className="text-zinc-600">    </span><span className="text-zinc-400">"rebalance_trigger"</span><span className="text-zinc-600">: </span><span className="text-emerald-400">"price_delta &gt; 0.005"</span><span className="text-zinc-600">,</span></span>
                        <span className="block whitespace-pre"><span className="text-zinc-600 select-none mr-3">11</span><span className="text-zinc-600">    </span><span className="text-zinc-400">"settlement_asset"</span><span className="text-zinc-600">: </span><span className="text-cyan-400 font-semibold">"SOL"</span></span>
                        <span className="block whitespace-pre"><span className="text-zinc-600 select-none mr-3">12</span><span className="text-zinc-600">  &#125;</span></span>
                        <span className="block whitespace-pre"><span className="text-zinc-600 select-none mr-3">13</span><span className="text-zinc-600">&#125;</span></span>
                      </code>
                    )}
                    {codeTab === 'rust' && (
                      <code>
                        <span className="block whitespace-pre"><span className="text-zinc-600 select-none mr-3">01</span><span className="text-cyan-400">pub fn</span> <span className="text-white">deposit_to_agent_pda</span>(ctx: Context&lt;MintAgent&gt;) -&gt; Result&lt;()&gt; &#123;</span>
                        <span className="block whitespace-pre"><span className="text-zinc-600 select-none mr-3">02</span>    <span className="text-cyan-400">let</span> mint_amount = ctx.accounts.mint.price;</span>
                        <span className="block whitespace-pre"><span className="text-zinc-600 select-none mr-3">03</span>    <span className="text-cyan-400">let</span> pda_deposit = mint_amount * <span className="text-emerald-400">90</span> / <span className="text-emerald-400">100</span>;</span>
                        <span className="block whitespace-pre"><span className="text-zinc-600 select-none mr-3">04</span>    <span className="text-zinc-500">// Cross-Program Invocation to Agent PDA Vault</span></span>
                        <span className="block whitespace-pre"><span className="text-zinc-600 select-none mr-3">05</span>    anchor_lang::solana_program::program::invoke(</span>
                        <span className="block whitespace-pre"><span className="text-zinc-600 select-none mr-3">06</span>        &amp;system_instruction::transfer(</span>
                        <span className="block whitespace-pre"><span className="text-zinc-600 select-none mr-3">07</span>            &amp;ctx.accounts.payer.key(),</span>
                        <span className="block whitespace-pre"><span className="text-zinc-600 select-none mr-3">08</span>            &amp;ctx.accounts.agent_pda_vault.key(),</span>
                        <span className="block whitespace-pre"><span className="text-zinc-600 select-none mr-3">09</span>            pda_deposit,</span>
                        <span className="block whitespace-pre"><span className="text-zinc-600 select-none mr-3">10</span>        ),</span>
                        <span className="block whitespace-pre"><span className="text-zinc-600 select-none mr-3">11</span>        &amp;[ctx.accounts.payer.to_account_info(), ctx.accounts.agent_pda_vault.to_account_info()],</span>
                        <span className="block whitespace-pre"><span className="text-zinc-600 select-none mr-3">12</span>    )?;</span>
                        <span className="block whitespace-pre"><span className="text-zinc-600 select-none mr-3">13</span>    Ok(())</span>
                        <span className="block whitespace-pre"><span className="text-zinc-600 select-none mr-3">14</span>&#125;</span>
                      </code>
                    )}
                    {codeTab === 'ts' && (
                      <code>
                        <span className="block whitespace-pre"><span className="text-zinc-600 select-none mr-3">01</span><span className="text-cyan-400">import</span> &#123; AnchorProvider, Program &#125; <span className="text-cyan-400">from</span> <span className="text-emerald-400">"@coral-xyz/anchor"</span>;</span>
                        <span className="block whitespace-pre"><span className="text-zinc-600 select-none mr-3">02</span><span className="text-cyan-400">const</span> tx = <span className="text-cyan-400">await</span> program.methods</span>
                        <span className="block whitespace-pre"><span className="text-zinc-600 select-none mr-3">03</span>  .mintAndBindPda(agentId)</span>
                        <span className="block whitespace-pre"><span className="text-zinc-600 select-none mr-3">04</span>  .accounts(&#123;</span>
                        <span className="block whitespace-pre"><span className="text-zinc-600 select-none mr-3">05</span>    payer: wallet.publicKey,</span>
                        <span className="block whitespace-pre"><span className="text-zinc-600 select-none mr-3">06</span>    agentPdaVault: pdaPublicKey,</span>
                        <span className="block whitespace-pre"><span className="text-zinc-600 select-none mr-3">07</span>    systemProgram: SystemProgram.programId</span>
                        <span className="block whitespace-pre"><span className="text-zinc-600 select-none mr-3">08</span>  &#125;)</span>
                        <span className="block whitespace-pre"><span className="text-zinc-600 select-none mr-3">09</span>  .rpc();</span>
                        <span className="block whitespace-pre"><span className="text-zinc-600 select-none mr-3">10</span>console.log(`Agent #${nextAgentId} activated`);</span>
                      </code>
                    )}
                  </pre>
                </div>

                {/* Right Side: Human vs Machine Sentence Breakdown */}
                <div className="flex flex-col justify-between p-6 bg-zinc-900/40">
                  <div>
                    {/* View Switcher Toggle */}
                    <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                      <span className="font-mono text-[11px] text-zinc-400 uppercase tracking-wider">Interpreter</span>
                      <div className="flex items-center rounded-lg border border-zinc-800 bg-zinc-900/80 p-0.5 text-[11px]">
                        <button
                          type="button"
                          onClick={() => setHumanView(true)}
                          className={`rounded-md px-2.5 py-1 font-medium transition-colors cursor-pointer ${humanView ? 'bg-zinc-800 text-white font-semibold' : 'text-zinc-400 hover:text-white'
                            }`}
                        >
                          Human
                        </button>
                        <button
                          type="button"
                          onClick={() => setHumanView(false)}
                          className={`rounded-md px-2.5 py-1 font-medium transition-colors cursor-pointer ${!humanView ? 'bg-zinc-800 text-white font-semibold' : 'text-zinc-400 hover:text-white'
                            }`}
                        >
                          Machine
                        </button>
                      </div>
                    </div>

                    {/* Content Display */}
                    <div className="mt-4">
                      {humanView ? (
                        <div className="space-y-3 text-[13px] leading-relaxed text-zinc-400">
                          <p>
                            <span className="text-white font-medium">When you mint Agent #00143</span>, 90% of your 0.020 SOL is permanently credited to its autonomous token-bound PDA vault.
                          </p>
                          <p>
                            The agent continuously evaluates Pyth price feeds and rebalances liquidity when cross-market spreads exceed 0.5%.
                          </p>
                          <p>
                            Drawdowns beyond 15% immediately trigger the protective Stop-Loss guard to preserve vault principal in SOL.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-2 font-mono text-[11px] text-zinc-400">
                          <div className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-2.5">
                            <span className="text-zinc-300 font-semibold">INSTRUCTION:</span> MintAndBindPda<br />
                            <span className="text-zinc-300 font-semibold">PROGRAM_ID:</span> RAREv3779...Vault<br />
                            <span className="text-emerald-400 font-semibold">SPLIT:</span> 90% PDA / 10% Protocol Ops
                          </div>
                          <div className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-2.5">
                            <span className="text-cyan-400">GAS:</span> 0.000005 SOL (5,000 lamports)<br />
                            <span className="text-cyan-400">PDA SEED:</span> [rare_agent, 143]
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bonding Curve Progress Curve SVG */}
                  <div className="mt-6 border-t border-zinc-800 pt-4">
                    <div className="flex items-center justify-between font-mono text-[10.5px] text-zinc-400 mb-1">
                      <span>PRICE LADDER (TIER 1 → 10)</span>
                      <span className="text-emerald-400 font-semibold">0.02 SOL → 10.24 SOL</span>
                    </div>
                    <svg viewBox="0 0 300 48" className="w-full h-12 text-emerald-400 stroke-current fill-none" preserveAspectRatio="none">
                      <path
                        d="M 0 44 Q 150 42 220 28 T 300 4"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                      <circle cx="20" cy="44" r="3.5" className="fill-emerald-400" />
                    </svg>
                    <div className="flex items-center justify-between text-[11px] text-zinc-500 font-mono mt-1">
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
        <section id="review" className="mx-auto max-w-[1360px] px-5 py-20 md:px-8 md:py-28 border-t border-white/[0.08]">
          <div className="sec3-anim-header mx-auto max-w-[640px] text-center">
            <h2 className="font-sans text-[32px] sm:text-[44px] text-white font-bold tracking-tight leading-tight">
              The review guides you
            </h2>
            <p className="mt-3.5 text-[15px] sm:text-[16px] leading-relaxed text-slate-400">
              Quote, review, sign, anchor. Every step shows what will happen and asks your wallet only for what it needs.
            </p>
          </div>

          <div className="mx-auto mt-12 max-w-[1056px]">
            {/* Header with transcript label and pause toggle */}
            <div className="mb-3 flex items-center justify-between font-mono text-[11px] tracking-wide text-slate-400 uppercase">
              <span>On-Chain Instruction Pipeline · Solana Anchor Execution</span>
              <button
                type="button"
                onClick={() => setTranscriptPaused(!transcriptPaused)}
                className="rounded-full px-3 py-1 normal-case border border-white/[0.12] bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer text-[11px] shadow-sm"
              >
                {transcriptPaused ? 'Resume' : 'Pause'}
              </button>
            </div>

            <div className="sec3-anim-transcript overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0c0d14] shadow-2xl">
              {/* Stepper Tabs */}
              <div role="tablist" aria-label="Execution steps" className="grid grid-cols-2 border-b border-zinc-800 sm:grid-cols-4">
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
                      className={`relative border-zinc-800 px-4 py-3 text-left font-mono text-[12px] transition-colors border-r last:border-r-0 cursor-pointer ${isActive ? 'bg-zinc-800 text-white font-semibold' : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
                        }`}
                    >
                      <span className="block">{step.title}</span>
                      <span className="block text-[11px] text-zinc-500">{step.subtitle}</span>
                      {isActive && (
                        <span className="absolute right-0 bottom-0 left-0 h-[2px] bg-emerald-400" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Transcript Display Window */}
              <div className="p-5 font-mono text-[12px] leading-[1.8] bg-black/60">
                {transcriptTab === 0 && (
                  <div>
                    <div className="text-zinc-500">&gt; Fetching route quote across Solana AMM graphs...</div>
                    <div className="text-zinc-200">&gt; Best execution via Jupiter V6: 0.020 SOL mint pricing derived.</div>
                    <div className="text-zinc-500">&gt; Route latency: 42ms · Slippage budget: 0.5% max</div>
                  </div>
                )}
                {transcriptTab === 1 && (
                  <div>
                    <div className="text-zinc-500">&gt; Validating token-bound PDA seeds against Anchor IDL:</div>
                    <div className="text-cyan-400">&gt; Seed: [b"rare_agent", id=143, authority=user_pubkey]</div>
                    <div className="text-emerald-400 font-semibold">&gt; Target Vault: PDA256v3779B100Vault · Verified 90% deposit rule intact.</div>
                  </div>
                )}
                {transcriptTab === 2 && (
                  <div>
                    <div className="text-zinc-500">&gt; Requesting single Ed25519 signature from active Solana wallet...</div>
                    <div className="text-zinc-200">&gt; Payload: 1 instruction (Anchor MintAndBindPda) · Zero blind signing.</div>
                    <div className="text-zinc-500">&gt; Authorization confirmed via Privy Web3 Provider.</div>
                  </div>
                )}
                {transcriptTab === 3 && (
                  <div>
                    <div className="text-zinc-500">&gt; Broadcasting transaction to Solana Mainnet-Beta...</div>
                    <div className="text-cyan-400">&gt; Blockhash confirmed at slot #31094892 · 5,000 lamports fee</div>
                    <div className="text-emerald-400 font-semibold">&gt; Agent #00143 PDA Vault funded with 0.018 SOL. Autonomous execution active.</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 4: "Browse agent swarm"
            ========================================================================= */}
        <section id="browse-agents" className="mx-auto max-w-[1360px] px-5 py-20 md:px-8 md:py-28 border-t border-white/[0.08]">
          <div className="sec4-anim-header flex items-end justify-between">
            <div>
              <h2 className="font-sans text-[30px] sm:text-[38px] text-white font-bold tracking-tight">
                Browse agent swarm
              </h2>
              <p className="mt-1.5 text-[14px] text-slate-400">
                10,078 unique AI agents inscribed with token-bound wallets.
              </p>
            </div>
            <Link className="text-[13px] font-semibold text-slate-300 hover:text-white transition-colors" href="/roster">
              View all 10,078 →
            </Link>
          </div>

          {/* Rarible Category Filter Pills */}
          <div className="rarible-filter-bar mt-6">
            {SWARM_FILTERS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setSwarmFilter(item.id)}
                className={`rarible-filter-pill ${swarmFilter === item.id ? 'active' : ''}`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Rarible Web Agent Cards */}
          <div className="mt-6 home-swarm-grid">
            {displayedSwarmAgents.map((agent) => (
              <div
                key={agent.id}
                onClick={() => setInspectedAgent(agent)}
                className="agent-card-anim group cursor-pointer overflow-hidden rounded-2xl border border-white/[0.08] bg-[#18191b] shadow-lg hover:border-white/20 transition-all duration-200 hover:-translate-y-1.5"
              >
                {/* Visual Avatar Container */}
                <div className="relative w-full aspect-square bg-[#111214] flex items-center justify-center p-3 overflow-hidden">
                  <img
                    src={`/nfts/${agent.id}.svg`}
                    alt={agent.name}
                    className="w-[88%] h-[88%] object-contain transition-transform duration-300 group-hover:scale-105"
                    style={{ imageRendering: 'pixelated' }}
                    loading="lazy"
                  />
                  <span className="absolute top-3 left-3 z-20 rounded-full bg-black/80 px-2.5 py-0.5 font-mono text-[9.5px] text-white border border-white/10 shadow-sm">
                    #{String(agent.id).padStart(5, '0')}
                  </span>
                  <span className="absolute top-3 right-3 z-20 rounded-full bg-purple-950/60 px-2.5 py-0.5 font-mono text-[9.5px] text-purple-300 font-semibold border border-purple-500/30">
                    {agent.rarityTier}
                  </span>
                </div>

                {/* Card Meta Content */}
                <div className="p-4">
                  <div className="flex items-center gap-1.5">
                    <span className="font-sans text-[15px] text-white font-bold truncate group-hover:text-purple-300 transition-colors">
                      {agent.name}
                    </span>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="#facc15" className="shrink-0">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                  </div>

                  <p className="mt-1 text-[12px] text-slate-400 truncate">
                    {agent.role} · {agent.archetype}
                  </p>

                  <div className="mt-3 flex items-center justify-between border-t border-white/[0.08] pt-2.5">
                    <div>
                      <div className="text-[10px] text-slate-500 font-mono uppercase">Floor</div>
                      <div className="font-mono text-[13px] text-white font-bold">{agent.priceSol} SOL</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-emerald-400 font-mono font-semibold">90% PDA</div>
                      <div className="text-[11px] text-slate-300 font-medium group-hover:text-white transition-colors">Inspect →</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* =========================================================================
            SECTION 5: "Explore the protocol"
            ========================================================================= */}
        <section aria-labelledby="docs-title" className="mx-auto max-w-[1360px] px-5 py-20 md:px-8 md:py-24 border-t border-white/[0.08]">
          <h2 id="docs-title" className="font-sans text-[30px] sm:text-[38px] text-white font-bold tracking-tight">
            Explore the protocol
          </h2>

          <div className="mt-6 grid gap-3.5 md:grid-cols-2">
            <Link
              className="sec5-anim-card group block rounded-2xl border border-white/[0.08] bg-[#18191b] p-6 shadow-lg hover:border-white/20 transition-all duration-150"
              href="/specs"
            >
              <span className="flex items-center gap-1.5 text-[15.5px] text-white font-semibold">
                Token-bound PDA Vaults
                <span aria-hidden="true" className="transition-transform duration-150 group-hover:translate-x-1">→</span>
              </span>
              <span className="mt-1.5 block text-[13px] text-slate-400 leading-relaxed">
                Non-custodial account derivation and 90% mint capital deposit architecture on Solana.
              </span>
            </Link>

            <Link
              className="sec5-anim-card group block rounded-2xl border border-white/[0.08] bg-[#18191b] p-6 shadow-lg hover:border-white/20 transition-all duration-150"
              href="/specs#cpi"
            >
              <span className="flex items-center gap-1.5 text-[15.5px] text-white font-semibold">
                Anchor CPI Execution
                <span aria-hidden="true" className="transition-transform duration-150 group-hover:translate-x-1">→</span>
              </span>
              <span className="mt-1.5 block text-[13px] text-slate-400 leading-relaxed">
                Cross-program invocation rules, Pyth oracle safety guards, and atomic order settlement.
              </span>
            </Link>

            <Link
              className="sec5-anim-card group block rounded-2xl border border-white/[0.08] bg-[#18191b] p-6 shadow-lg hover:border-white/20 transition-all duration-150"
              href="/ladder"
            >
              <span className="flex items-center gap-1.5 text-[15.5px] text-white font-semibold">
                10-Tier Price Ladder
                <span aria-hidden="true" className="transition-transform duration-150 group-hover:translate-x-1">→</span>
              </span>
              <span className="mt-1.5 block text-[13px] text-slate-400 leading-relaxed">
                Bonding curve mathematics governing the exact supply distribution of all 10,078 agents.
              </span>
            </Link>

            <Link
              className="sec5-anim-card group block rounded-2xl border border-white/[0.08] bg-[#18191b] p-6 shadow-lg hover:border-white/20 transition-all duration-150"
              href="/whitepaper"
            >
              <span className="flex items-center gap-1.5 text-[15.5px] text-white font-semibold">
                Whitepaper PDF
                <span aria-hidden="true" className="transition-transform duration-150 group-hover:translate-x-1">→</span>
              </span>
              <span className="mt-1.5 block text-[13px] text-slate-400 leading-relaxed">
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
