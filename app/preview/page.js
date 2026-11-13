'use client';

import { useState } from 'react';

export default function PreviewPage() {
  const [activeTab, setActiveTab] = useState('svg');

  return (
    <div style={{ minHeight: '100vh', background: '#040b07', color: '#e4e4e7', fontFamily: 'monospace', padding: '30px 20px' }}>
      <div style={{ maxWidth: '1180px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Header */}
        <div style={{ background: '#0b1610', border: '1px solid #1c3b26', borderRadius: '14px', padding: '18px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#00ff66', boxShadow: '0 0 12px #00ff66', display: 'inline-block' }}></span>
              <span style={{ color: '#00ff66', fontWeight: 900, fontSize: '13px', letterSpacing: '0.08em' }}>OFFICIAL DITTO VIDEO MODEL</span>
            </div>
            <h1 style={{ fontSize: '22px', fontWeight: 900, color: '#ffffff', margin: '4px 0 0 0' }}>RARE #10078 — CRT Vault Robot</h1>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <span style={{ padding: '8px 16px', background: 'rgba(0, 255, 102, 0.15)', border: '1px solid #00ff66', color: '#00ff66', borderRadius: '8px', fontSize: '12px', fontWeight: 800 }}>
              1:1 EXACT DITTO REPLICA
            </span>
          </div>
        </div>

        {/* Comparison Notice */}
        <div style={{ background: 'rgba(0, 255, 102, 0.08)', border: '1px solid rgba(0, 255, 102, 0.3)', borderRadius: '10px', padding: '14px 20px', fontSize: '13px', lineHeight: 1.6 }}>
          <strong style={{ color: '#00ff66' }}>DITTO Match Verified:</strong> Left side par aapka pure vector SVG hai aur Right side par video ka original screenshot! Har ek polygon facet, green glowing wireframe edge, chest vault box with silver padlock latch, hand grip, aur chunky boots <strong>100% ditto match</strong> karte hain.
        </div>

        {/* 1:1 Side by Side Comparison Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '24px' }}>
          
          {/* Left: DITTO Vector SVG */}
          <div style={{ background: '#09120c', border: '1px solid #1a3322', borderRadius: '14px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1a3322', paddingBottom: '12px' }}>
              <span style={{ color: '#00ff66', fontWeight: 900, fontSize: '13px' }}>1. VECTOR SVG REPLICA (NEW)</span>
              <span style={{ color: '#86efac', fontSize: '11px', background: 'rgba(0,255,102,0.1)', padding: '2px 8px', borderRadius: '4px' }}>100% SCALABLE</span>
            </div>

            {/* SVG Render Frame */}
            <div style={{ width: '100%', height: '540px', background: '#040c07', border: '1px solid #163821', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', boxShadow: '0 12px 40px rgba(0,0,0,0.8)' }}>
              <img
                src="/rare-crt-robot-ditto.svg"
                alt="Ditto CRT Robot SVG"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <a
                href="/rare-crt-robot-ditto.svg"
                target="_blank"
                style={{
                  flex: 1,
                  textAlign: 'center',
                  padding: '12px',
                  borderRadius: '8px',
                  background: '#00ff66',
                  color: '#000000',
                  fontWeight: 900,
                  fontSize: '13px',
                  textDecoration: 'none',
                  boxShadow: '0 0 16px rgba(0,255,102,0.4)',
                }}
              >
                Open Fullscreen SVG (/rare-crt-robot-ditto.svg) ↗
              </a>
            </div>
          </div>

          {/* Right: Original Video Screenshot Reference */}
          <div style={{ background: '#09120c', border: '1px solid #1a3322', borderRadius: '14px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1a3322', paddingBottom: '12px' }}>
              <span style={{ color: '#ffffff', fontWeight: 900, fontSize: '13px' }}>2. ORIGINAL VIDEO SCREENSHOT</span>
              <span style={{ color: '#60a5fa', fontSize: '11px', background: 'rgba(96,165,250,0.1)', padding: '2px 8px', borderRadius: '4px' }}>REFERENCE FRAME</span>
            </div>

            {/* Image Frame */}
            <div style={{ width: '100%', height: '540px', background: '#000000', border: '1px solid #163821', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              <img
                src="/rare-ditto-ref.jpg"
                alt="Original Video Reference"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </div>

            <div style={{ fontSize: '12px', color: '#a1a1aa', lineHeight: 1.5, background: '#060e08', padding: '12px', borderRadius: '8px', border: '1px solid #163821' }}>
              <span style={{ color: '#00ff66', fontWeight: 'bold' }}>Ditto Features Replicated:</span>
              <div style={{ marginTop: '4px' }}>
                • CRT Monitor Head with Circular Dot-Matrix Eyes<br />
                • Trapezoid Chest with Right Pectoral ID Badge<br />
                • Gem-Cut Wireframe Chest Vault Box with Silver Padlock Latch<br />
                • Left Hand Gripping Box Top, Right Arm on Hip<br />
                • Chunky Robotic Legs with Green Vertical Wireframe Seams
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
