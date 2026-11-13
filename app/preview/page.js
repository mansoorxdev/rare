'use client';

import { useState } from 'react';

const colors = {
  matrix: {
    primary: '#00ff66',
    glow: '#22ff88',
    bodyDark: '#06160e',
    bodyMid: '#0c2619',
    bodyLight: '#143825',
    casing: '#2d3b32',
    casingDark: '#1a241e',
    screenBg: '#020c06',
    eye: '#00ff66',
    name: 'Matrix Green (Official Army Spec)'
  },
  solana: {
    primary: '#14f195',
    glow: '#9945ff',
    bodyDark: '#110620',
    bodyMid: '#200c3b',
    bodyLight: '#351461',
    casing: '#3a2d4f',
    casingDark: '#231933',
    screenBg: '#0a0314',
    eye: '#14f195',
    name: 'Solana Hyperdrive'
  },
  amber: {
    primary: '#ffaa00',
    glow: '#ffbb22',
    bodyDark: '#221202',
    bodyMid: '#381f05',
    bodyLight: '#54300a',
    casing: '#473a2c',
    casingDark: '#2b2218',
    screenBg: '#120901',
    eye: '#ffbb00',
    name: 'Cyber Amber'
  },
  cyan: {
    primary: '#00e5ff',
    glow: '#33eeff',
    bodyDark: '#03141f',
    bodyMid: '#082538',
    bodyLight: '#0f3c59',
    casing: '#2d3e47',
    casingDark: '#1b262c',
    screenBg: '#010c14',
    eye: '#00f2ff',
    name: 'Quantum Cyan'
  },
  crimson: {
    primary: '#ff2a4b',
    glow: '#ff4d6a',
    bodyDark: '#220509',
    bodyMid: '#380a11',
    bodyLight: '#57111c',
    casing: '#472c30',
    casingDark: '#2b191c',
    screenBg: '#120204',
    eye: '#ff3355',
    name: 'Crimson SpecOps'
  },
  white: {
    primary: '#ffffff',
    glow: '#cce4ff',
    bodyDark: '#14171a',
    bodyMid: '#22272e',
    bodyLight: '#353c47',
    casing: '#3c414a',
    casingDark: '#252930',
    screenBg: '#090a0c',
    eye: '#ffffff',
    name: 'Ghost White'
  }
};

export default function PreviewPage() {
  const [face, setFace] = useState('flat');
  const [colorKey, setColorKey] = useState('matrix');

  const cw = colors[colorKey];

  return (
    <div style={{ minHeight: '100vh', background: '#070b09', color: '#e4e4e7', fontFamily: 'monospace', padding: '30px 20px' }}>
      <div style={{ maxWidth: '1080px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Header */}
        <div style={{ background: '#101712', border: '1px solid #1c3323', borderRadius: '12px', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#00ff66', boxShadow: '0 0 10px #00ff66', display: 'inline-block' }}></span>
              <span style={{ color: '#00ff66', fontWeight: 800, fontSize: '12px', letterSpacing: '0.08em' }}>OFFICIAL INTRO VIDEO ARMY MODEL</span>
            </div>
            <h1 style={{ fontSize: '20px', fontWeight: 900, color: '#ffffff', margin: '4px 0 0 0' }}>RARE PROTOCOL — Sleek CRT Robot SVG</h1>
          </div>
          <span style={{ padding: '6px 14px', background: 'rgba(0, 255, 102, 0.15)', border: '1px solid #00ff66', color: '#00ff66', borderRadius: '6px', fontSize: '12px', fontWeight: 700 }}>
            10,078 Autonomous AI Agents
          </span>
        </div>

        {/* Notice */}
        <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '10px', padding: '12px 18px', fontSize: '13px', lineHeight: 1.6 }}>
          <strong style={{ color: '#00ff66' }}>Client Feedback Addressed:</strong> Client ne hunched/chest-holding posture par bola tha <em style={{ color: '#fef08a' }}>"The body is bad"</em>. Yeh naya model official video ke <strong style={{ color: '#ffffff' }}>"Each one is an AI agent"</strong> army scene par based hai — <strong>Sleek upright stance, arms relaxed at sides, athletic V-taper chest, and glowing grid floor!</strong>
        </div>

        {/* Main Content Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
          
          {/* Left: Vector SVG Display */}
          <div style={{ background: '#101512', border: '1px solid #1c2b21', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1c2b21', paddingBottom: '10px', fontSize: '12px' }}>
              <span style={{ color: cw.primary, fontWeight: 800 }}>MODEL: {cw.name.toUpperCase()}</span>
              <span style={{ color: '#71717a' }}>100% VECTOR SVG</span>
            </div>

            {/* SVG Viewport */}
            <div style={{ width: '100%', height: '460px', background: 'radial-gradient(circle at 50% 35%, #0a2114 0%, #030805 100%)', border: '1px solid #1c3323', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" width="100%" height="100%" style={{ background: 'transparent' }}>
                <defs>
                  <filter id="next-neon" x="-40%" y="-40%" width="180%" height="180%">
                    <feGaussianBlur stdDeviation="2.5" result="b1" />
                    <feGaussianBlur stdDeviation="6" result="b2" />
                    <feGaussianBlur stdDeviation="12" result="b3" />
                    <feMerge>
                      <feMergeNode in="b3" />
                      <feMergeNode in="b2" />
                      <feMergeNode in="b1" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  <filter id="next-screen-glow" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="3" result="g1" />
                    <feGaussianBlur stdDeviation="8" result="g2" />
                    <feMerge>
                      <feMergeNode in="g2" />
                      <feMergeNode in="g1" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  <pattern id="next-scanlines" width="100" height="3" patternUnits="userSpaceOnUse">
                    <line x1="0" y1="0" x2="100" y2="0" stroke="rgba(0,0,0,0.45)" strokeWidth="1.2" />
                  </pattern>
                  <radialGradient id="next-screen-grad" cx="50%" cy="50%" r="55%">
                    <stop offset="0%" stopColor={cw.bodyLight} />
                    <stop offset="60%" stopColor={cw.screenBg} />
                    <stop offset="100%" stopColor="#010603" />
                  </radialGradient>
                  <linearGradient id="next-casing-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={cw.casing} />
                    <stop offset="100%" stopColor={cw.casingDark} />
                  </linearGradient>
                  <radialGradient id="next-shadow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="rgba(0,0,0,0.7)" />
                    <stop offset="60%" stopColor="rgba(0,0,0,0.2)" />
                    <stop offset="100%" stopColor="rgba(0,0,0,0)" />
                  </radialGradient>
                </defs>

                {/* Grid Floor */}
                <g id="next-grid" opacity="0.75">
                  <line x1="50" y1="745" x2="550" y2="745" stroke={cw.primary} strokeWidth="2.5" filter="url(#next-neon)" />
                  <line x1="90" y1="710" x2="510" y2="710" stroke={cw.primary} strokeWidth="1.8" filter="url(#next-neon)" opacity="0.6" />
                  <line x1="130" y1="680" x2="470" y2="680" stroke={cw.primary} strokeWidth="1.2" filter="url(#next-neon)" opacity="0.35" />
                  <line x1="70" y1="770" x2="250" y2="640" stroke={cw.primary} strokeWidth="1.5" filter="url(#next-neon)" opacity="0.4" />
                  <line x1="170" y1="770" x2="280" y2="640" stroke={cw.primary} strokeWidth="1.8" filter="url(#next-neon)" opacity="0.5" />
                  <line x1="300" y1="770" x2="300" y2="640" stroke={cw.primary} strokeWidth="2.2" filter="url(#next-neon)" opacity="0.7" />
                  <line x1="430" y1="770" x2="320" y2="640" stroke={cw.primary} strokeWidth="1.8" filter="url(#next-neon)" opacity="0.5" />
                  <line x1="530" y1="770" x2="350" y2="640" stroke={cw.primary} strokeWidth="1.5" filter="url(#next-neon)" opacity="0.4" />
                </g>

                <ellipse cx="255" cy="745" rx="35" ry="8" fill="url(#next-shadow)" />
                <ellipse cx="345" cy="745" rx="35" ry="8" fill="url(#next-shadow)" />
                <ellipse cx="300" cy="745" rx="110" ry="14" fill="url(#next-shadow)" opacity="0.6" />

                {/* LEGS */}
                <g id="legs">
                  <polygon points="245,475 228,540 252,580 268,540" fill={cw.bodyDark} stroke={cw.primary} strokeWidth="2.2" filter="url(#next-neon)" />
                  <polygon points="268,475 268,540 252,580 278,575" fill={cw.bodyMid} stroke={cw.primary} strokeWidth="2.2" filter="url(#next-neon)" />
                  <line x1="258" y1="475" x2="252" y2="580" stroke={cw.primary} strokeWidth="1.5" filter="url(#next-neon)" opacity="0.7" />
                  <polygon points="242,580 262,572 278,580 272,605 252,612 238,600" fill={cw.bodyLight} stroke={cw.primary} strokeWidth="2.4" filter="url(#next-neon)" />
                  <circle cx="257" cy="593" r="3" fill={cw.primary} filter="url(#next-neon)" />
                  <polygon points="244,610 238,680 248,715 258,685" fill={cw.bodyDark} stroke={cw.primary} strokeWidth="2.2" filter="url(#next-neon)" />
                  <polygon points="255,610 258,685 248,715 268,715 272,680" fill={cw.bodyMid} stroke={cw.primary} strokeWidth="2.2" filter="url(#next-neon)" />
                  <line x1="255" y1="610" x2="258" y2="715" stroke={cw.primary} strokeWidth="1.8" filter="url(#next-neon)" />
                  <polygon points="234,715 274,715 278,742 230,742" fill={cw.bodyLight} stroke={cw.primary} strokeWidth="2.4" filter="url(#next-neon)" />
                  <line x1="230" y1="742" x2="278" y2="742" stroke={cw.primary} strokeWidth="3.5" filter="url(#next-neon)" />
                  <rect x="242" y="723" width="20" height="9" fill="#091f13" stroke={cw.primary} strokeWidth="1.4" filter="url(#next-neon)" />

                  <polygon points="355,475 372,540 348,580 332,540" fill={cw.bodyDark} stroke={cw.primary} strokeWidth="2.2" filter="url(#next-neon)" />
                  <polygon points="332,475 332,540 348,580 322,575" fill={cw.bodyMid} stroke={cw.primary} strokeWidth="2.2" filter="url(#next-neon)" />
                  <line x1="342" y1="475" x2="348" y2="580" stroke={cw.primary} strokeWidth="1.5" filter="url(#next-neon)" opacity="0.7" />
                  <polygon points="358,580 338,572 322,580 328,605 348,612 362,600" fill={cw.bodyLight} stroke={cw.primary} strokeWidth="2.4" filter="url(#next-neon)" />
                  <circle cx="343" cy="593" r="3" fill={cw.primary} filter="url(#next-neon)" />
                  <polygon points="356,610 362,680 352,715 342,685" fill={cw.bodyDark} stroke={cw.primary} strokeWidth="2.2" filter="url(#next-neon)" />
                  <polygon points="345,610 342,685 352,715 332,715 328,680" fill={cw.bodyMid} stroke={cw.primary} strokeWidth="2.2" filter="url(#next-neon)" />
                  <line x1="345" y1="610" x2="342" y2="715" stroke={cw.primary} strokeWidth="1.8" filter="url(#next-neon)" />
                  <polygon points="326,715 366,715 370,742 322,742" fill={cw.bodyLight} stroke={cw.primary} strokeWidth="2.4" filter="url(#next-neon)" />
                  <line x1="322" y1="742" x2="370" y2="742" stroke={cw.primary} strokeWidth="3.5" filter="url(#next-neon)" />
                  <rect x="338" y="723" width="20" height="9" fill="#091f13" stroke={cw.primary} strokeWidth="1.4" filter="url(#next-neon)" />
                </g>

                {/* PELVIS */}
                <g id="pelvis">
                  <polygon points="275,445 325,445 315,485 300,498 285,485" fill={cw.bodyLight} stroke={cw.primary} strokeWidth="2.4" filter="url(#next-neon)" />
                  <polygon points="250,445 275,445 285,485 245,475" fill={cw.bodyDark} stroke={cw.primary} strokeWidth="2.2" filter="url(#next-neon)" />
                  <polygon points="350,445 325,445 315,485 355,475" fill={cw.bodyDark} stroke={cw.primary} strokeWidth="2.2" filter="url(#next-neon)" />
                </g>

                {/* SLEEK ARMS (DOWN AT SIDES) */}
                <g id="arms">
                  <polygon points="168,300 205,295 212,335 175,342" fill={cw.bodyMid} stroke={cw.primary} strokeWidth="2.4" filter="url(#next-neon)" />
                  <polygon points="168,300 152,328 175,342" fill={cw.bodyDark} stroke={cw.primary} strokeWidth="2" filter="url(#next-neon)" />
                  <polygon points="172,342 198,338 192,410 166,408" fill={cw.bodyDark} stroke={cw.primary} strokeWidth="2.2" filter="url(#next-neon)" />
                  <line x1="184" y1="340" x2="180" y2="408" stroke={cw.primary} strokeWidth="1.5" filter="url(#next-neon)" opacity="0.6" />
                  <polygon points="166,408 192,410 190,430 164,428" fill={cw.bodyLight} stroke={cw.primary} strokeWidth="2.2" filter="url(#next-neon)" />
                  <circle cx="178" cy="419" r="3" fill={cw.primary} filter="url(#next-neon)" />
                  <polygon points="164,428 190,430 184,510 160,505" fill={cw.bodyMid} stroke={cw.primary} strokeWidth="2.2" filter="url(#next-neon)" />
                  <line x1="176" y1="429" x2="172" y2="508" stroke={cw.primary} strokeWidth="1.6" filter="url(#next-neon)" />
                  <polygon points="160,505 184,510 180,535 158,530" fill={cw.bodyLight} stroke={cw.primary} strokeWidth="2" filter="url(#next-neon)" />
                  <line x1="162" y1="530" x2="160" y2="558" stroke={cw.primary} strokeWidth="2.2" filter="url(#next-neon)" />
                  <line x1="168" y1="532" x2="167" y2="562" stroke={cw.primary} strokeWidth="2.2" filter="url(#next-neon)" />
                  <line x1="174" y1="533" x2="174" y2="560" stroke={cw.primary} strokeWidth="2.2" filter="url(#next-neon)" />
                  <line x1="180" y1="534" x2="181" y2="554" stroke={cw.primary} strokeWidth="2" filter="url(#next-neon)" />

                  <polygon points="432,300 395,295 388,335 425,342" fill={cw.bodyMid} stroke={cw.primary} strokeWidth="2.4" filter="url(#next-neon)" />
                  <polygon points="432,300 448,328 425,342" fill={cw.bodyDark} stroke={cw.primary} strokeWidth="2" filter="url(#next-neon)" />
                  <polygon points="428,342 402,338 408,410 434,408" fill={cw.bodyDark} stroke={cw.primary} strokeWidth="2.2" filter="url(#next-neon)" />
                  <line x1="416" y1="340" x2="420" y2="408" stroke={cw.primary} strokeWidth="1.5" filter="url(#next-neon)" opacity="0.6" />
                  <polygon points="434,408 408,410 410,430 436,428" fill={cw.bodyLight} stroke={cw.primary} strokeWidth="2.2" filter="url(#next-neon)" />
                  <circle cx="422" cy="419" r="3" fill={cw.primary} filter="url(#next-neon)" />
                  <polygon points="436,428 410,430 416,510 440,505" fill={cw.bodyMid} stroke={cw.primary} strokeWidth="2.2" filter="url(#next-neon)" />
                  <line x1="424" y1="429" x2="428" y2="508" stroke={cw.primary} strokeWidth="1.6" filter="url(#next-neon)" />
                  <polygon points="440,505 416,510 420,535 442,530" fill={cw.bodyLight} stroke={cw.primary} strokeWidth="2" filter="url(#next-neon)" />
                  <line x1="438" y1="530" x2="440" y2="558" stroke={cw.primary} strokeWidth="2.2" filter="url(#next-neon)" />
                  <line x1="432" y1="532" x2="433" y2="562" stroke={cw.primary} strokeWidth="2.2" filter="url(#next-neon)" />
                  <line x1="426" y1="533" x2="426" y2="560" stroke={cw.primary} strokeWidth="2.2" filter="url(#next-neon)" />
                  <line x1="420" y1="534" x2="419" y2="554" stroke={cw.primary} strokeWidth="2" filter="url(#next-neon)" />
                </g>

                {/* V-TAPER TORSO */}
                <g id="torso">
                  <polygon points="205,295 300,310 295,365 220,360" fill={cw.bodyLight} stroke={cw.primary} strokeWidth="2.4" filter="url(#next-neon)" />
                  <polygon points="395,295 300,310 305,365 380,360" fill={cw.bodyMid} stroke={cw.primary} strokeWidth="2.4" filter="url(#next-neon)" />
                  <line x1="300" y1="310" x2="300" y2="445" stroke={cw.primary} strokeWidth="2.4" filter="url(#next-neon)" />
                  <rect x="325" y="325" width="30" height="9" rx="1.5" fill="#0c2617" stroke={cw.primary} strokeWidth="1.4" filter="url(#next-neon)" />
                  <line x1="329" y1="329" x2="351" y2="329" stroke={cw.primary} strokeWidth="1" opacity="0.8" />
                  <polygon points="220,360 295,365 298,405 240,400" fill={cw.bodyDark} stroke={cw.primary} strokeWidth="2.2" filter="url(#next-neon)" />
                  <polygon points="380,360 305,365 302,405 360,400" fill={cw.bodyMid} stroke={cw.primary} strokeWidth="2.2" filter="url(#next-neon)" />
                  <polygon points="240,400 298,405 300,445 255,445" fill={cw.bodyMid} stroke={cw.primary} strokeWidth="2.2" filter="url(#next-neon)" />
                  <polygon points="360,400 302,405 300,445 345,445" fill={cw.bodyDark} stroke={cw.primary} strokeWidth="2.2" filter="url(#next-neon)" />
                  <line x1="220" y1="360" x2="298" y2="405" stroke={cw.primary} strokeWidth="1.4" filter="url(#next-neon)" opacity="0.8" />
                  <line x1="380" y1="360" x2="302" y2="405" stroke={cw.primary} strokeWidth="1.4" filter="url(#next-neon)" opacity="0.8" />
                  <line x1="240" y1="400" x2="300" y2="445" stroke={cw.primary} strokeWidth="1.4" filter="url(#next-neon)" opacity="0.8" />
                  <line x1="360" y1="400" x2="300" y2="445" stroke={cw.primary} strokeWidth="1.4" filter="url(#next-neon)" opacity="0.8" />
                </g>

                {/* NECK */}
                <g id="neck">
                  <rect x="282" y="272" width="36" height="24" rx="2" fill="#13261b" stroke={cw.primary} strokeWidth="2" filter="url(#next-neon)" />
                  <line x1="282" y1="280" x2="318" y2="280" stroke={cw.primary} strokeWidth="1.6" filter="url(#next-neon)" />
                  <line x1="282" y1="288" x2="318" y2="288" stroke={cw.primary} strokeWidth="1.6" filter="url(#next-neon)" />
                </g>

                {/* CRT HEAD */}
                <g id="crt">
                  <polygon points="230,118 370,118 392,142 208,142" fill={cw.casing} stroke={cw.casingDark} strokeWidth="1.6" />
                  <polygon points="230,118 208,142 208,262 222,275" fill="#243027" stroke={cw.casingDark} strokeWidth="1.6" />
                  <polygon points="370,118 392,142 392,262 378,275" fill="#18211b" stroke={cw.casingDark} strokeWidth="1.6" />
                  <polygon points="208,262 222,275 378,275 392,262" fill="#121a15" stroke={cw.casingDark} strokeWidth="1.6" />

                  <rect x="214" y="136" width="172" height="136" rx="12" fill="url(#next-casing-grad)" stroke="#111a14" strokeWidth="2.5" />
                  <rect x="216" y="138" width="168" height="132" rx="10" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
                  <rect x="226" y="146" width="148" height="106" rx="6" fill="#040e07" stroke="#0e2013" strokeWidth="2.5" />
                  <rect x="230" y="150" width="140" height="98" rx="5" fill="url(#next-screen-grad)" />
                  <path d="M 232 152 L 368 152 C 350 185, 250 185, 232 152 Z" fill="rgba(255, 255, 255, 0.08)" />
                  <rect x="230" y="150" width="140" height="98" rx="5" fill="url(#next-scanlines)" opacity="0.6" pointerEvents="none" />

                  {/* Face */}
                  <g id="screen-face" filter="url(#next-screen-glow)">
                    {face === 'flat' && (
                      <>
                        <rect x="250" y="180" width="32" height="10" rx="2" fill={cw.eye} />
                        <rect x="318" y="180" width="32" height="10" rx="2" fill={cw.eye} />
                        <rect x="286" y="210" width="28" height="6" rx="1.5" fill={cw.eye} opacity="0.9" />
                      </>
                    )}
                    {face === 'cross' && (
                      <>
                        <rect x="261" y="174" width="10" height="26" rx="2" fill={cw.eye} />
                        <rect x="253" y="182" width="26" height="10" rx="2" fill={cw.eye} />
                        <rect x="329" y="174" width="10" height="26" rx="2" fill={cw.eye} />
                        <rect x="321" y="182" width="26" height="10" rx="2" fill={cw.eye} />
                        <rect x="286" y="214" width="28" height="6" rx="1.5" fill={cw.eye} opacity="0.9" />
                      </>
                    )}
                    {face === 'dots' && (
                      <>
                        <circle cx="266" cy="186" r="14" fill={cw.eye} />
                        <circle cx="266" cy="186" r="8" fill="#020c06" />
                        <circle cx="266" cy="186" r="4" fill={cw.eye} />
                        <circle cx="334" cy="186" r="14" fill={cw.eye} />
                        <circle cx="334" cy="186" r="8" fill="#020c06" />
                        <circle cx="334" cy="186" r="4" fill={cw.eye} />
                        <rect x="286" y="214" width="28" height="6" rx="1.5" fill={cw.eye} opacity="0.9" />
                      </>
                    )}
                    {face === 'wink' && (
                      <>
                        <path d="M 252 192 Q 266 172 280 192" fill="none" stroke={cw.eye} strokeWidth="7" strokeLinecap="round" />
                        <circle cx="334" cy="186" r="12" fill={cw.eye} />
                        <path d="M 288 214 Q 300 226 312 214" fill="none" stroke={cw.eye} strokeWidth="5" strokeLinecap="round" />
                      </>
                    )}
                    {face === 'alert' && (
                      <>
                        <rect x="252" y="176" width="26" height="22" rx="3" fill={cw.eye} />
                        <rect x="322" y="176" width="26" height="22" rx="3" fill={cw.eye} />
                        <rect x="288" y="214" width="24" height="6" rx="1.5" fill={cw.eye} opacity="0.9" />
                      </>
                    )}
                    {face === 'ascii' && (
                      <>
                        <text x="245" y="196" fontFamily="monospace" fontSize="28" fontWeight="900" fill={cw.eye}>&gt;</text>
                        <rect x="272" y="178" width="14" height="22" fill={cw.eye} />
                        <text x="245" y="226" fontFamily="monospace" fontSize="12" fontWeight="bold" fill={cw.eye} opacity="0.8">ONLINE</text>
                      </>
                    )}
                  </g>

                  <rect x="234" y="258" width="24" height="4" rx="2" fill="#182b1f" />
                  <circle cx="355" cy="260" r="4" fill="#1c2921" stroke="#0e1711" strokeWidth="1.2" />
                  <circle cx="355" cy="260" r="1.5" fill={cw.primary} opacity="0.8" />
                  <circle cx="368" cy="260" r="3" fill="#1c2921" stroke="#0e1711" strokeWidth="1.2" />
                </g>
              </svg>
            </div>

            {/* Face Switcher Buttons */}
            <div>
              <div style={{ fontSize: '11px', color: '#a1a1aa', marginBottom: '8px' }}>CRT SCREEN FACES (FROM VIDEO):</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {[
                  { id: 'flat', label: '- - (Center)' },
                  { id: 'cross', label: '+ + (Cross)' },
                  { id: 'dots', label: '● ● (Round)' },
                  { id: 'wink', label: '^ - (Wink)' },
                  { id: 'alert', label: '■ ■ (Alert)' },
                  { id: 'ascii', label: '> _ (Prompt)' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setFace(item.id)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      border: face === item.id ? `1px solid ${cw.primary}` : '1px solid #27382d',
                      background: face === item.id ? 'rgba(0, 255, 102, 0.2)' : '#1a241e',
                      color: face === item.id ? cw.primary : '#a1a1aa',
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Colorway Switcher Buttons */}
            <div>
              <div style={{ fontSize: '11px', color: '#a1a1aa', marginBottom: '8px' }}>PROCEDURAL COLORWAYS:</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {Object.keys(colors).map((k) => (
                  <button
                    key={k}
                    onClick={() => setColorKey(k)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      border: colorKey === k ? `1px solid ${colors[k].primary}` : '1px solid #27382d',
                      background: colorKey === k ? `rgba(0, 255, 102, 0.15)` : '#1a241e',
                      color: colorKey === k ? colors[k].primary : '#a1a1aa',
                    }}
                  >
                    {colors[k].name.split(' ')[0]} {colors[k].name.split(' ')[1]}
                  </button>
                ))}
              </div>
            </div>

            <a
              href="/rare-crt-robot-sleek.svg"
              target="_blank"
              style={{
                display: 'block',
                textAlign: 'center',
                padding: '10px',
                borderRadius: '8px',
                background: '#00ff66',
                color: '#000000',
                fontWeight: 900,
                fontSize: '12px',
                textDecoration: 'none',
              }}
            >
              Open Direct Vector SVG File (/rare-crt-robot-sleek.svg) ↗
            </a>
          </div>

          {/* Right: Video Scene Reference */}
          <div style={{ background: '#101512', border: '1px solid #1c2b21', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1c2b21', paddingBottom: '10px', fontSize: '12px' }}>
                <span style={{ color: '#00ff66', fontWeight: 800 }}>CLIENT VIDEO SCENE</span>
                <span style={{ color: '#60a5fa' }}>"Each one is an AI agent"</span>
              </div>

              <img
                src="/rare-army-ref.jpg"
                alt="Army of AI Agents from Video"
                style={{ width: '100%', borderRadius: '8px', border: '1px solid #1c3323', display: 'block' }}
              />

              <div style={{ fontSize: '12px', color: '#a1a1aa', lineHeight: 1.6 }}>
                <p style={{ marginBottom: '8px' }}>
                  <strong style={{ color: '#ffffff' }}>Why this solves the client's complaint:</strong>
                </p>
                <ul style={{ paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <li>Pehle wale robot mein box pakda hua tha jisse posture clumsy lag raha tha aur client ne bola <strong style={{ color: '#fef08a' }}>"The body is bad"</strong>.</li>
                  <li>Is official army scene mein sabhi robots <strong style={{ color: '#00ff66' }}>upright, tall aur athletic stance</strong> mein hain, haath sides par hain aur V-taper chest hai.</li>
                  <li>Video ke har robot ka CRT face alag expression display kar raha hai (<code>- -</code>, <code>+ +</code>, <code>● ●</code>, <code>^ -</code>).</li>
                </ul>
              </div>
            </div>

            <div style={{ padding: '12px', background: '#0a100c', borderRadius: '8px', border: '1px solid #1c2b21', fontSize: '11px', color: '#71717a' }}>
              Asset Path: <code style={{ color: '#00ff66' }}>public/rare-crt-robot-sleek.svg</code>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
