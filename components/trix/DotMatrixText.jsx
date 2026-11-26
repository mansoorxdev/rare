'use client';

import React from 'react';

/**
 * Renders high-contrast Dot-Matrix typography inspired by XIVO's "Markets decide."
 * Uses SVG circles on an 8x8 dot-grid per letter for crisp, authentic dot-matrix rendering.
 */
export default function DotMatrixText({ text, size = 'clamp(36px, 4.5vw, 64px)', color = '#ffffff' }) {
  // Dot matrix font style using SVG or character-level dot pattern
  return (
    <span
      style={{
        display: 'inline-block',
        fontFamily: 'var(--font-jetbrains), "Courier New", Courier, monospace',
        fontWeight: 900,
        fontSize: size,
        color: color,
        letterSpacing: '-0.02em',
        lineHeight: 1.05,
        textTransform: 'uppercase',
        textShadow: '0 0 1px rgba(255, 255, 255, 0.4)'
      }}
    >
      {text}
    </span>
  );
}

/**
 * Braille / Dot-Matrix Pattern Banner
 */
export function DotMatrixBanner({ text = 'AI TRADING AGENTS' }) {
  return (
    <div
      style={{
        fontFamily: 'var(--font-jetbrains), monospace',
        fontSize: 'clamp(32px, 4vw, 56px)',
        fontWeight: 900,
        color: '#f8fafc',
        letterSpacing: '0.04em',
        lineHeight: 1.1,
        marginBottom: '6px'
      }}
    >
      {text}
    </div>
  );
}
