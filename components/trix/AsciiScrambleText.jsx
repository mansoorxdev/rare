'use client';

import React, { useState, useEffect, useRef } from 'react';

const CHARS = '!@#$%^&*()_+-=[]{}|;:,.<>?/~0123456789#_~^}[/*/+~|0*[<]-+>!>*- [*1**+{';

export default function AsciiScrambleText({
  text,
  scrambleOnMount = true,
  scrambleOnHover = true,
  speed = 28,
  revealDelay = 2,
  className = '',
  style = {}
}) {
  const [displayText, setDisplayText] = useState(text);
  const intervalRef = useRef(null);

  const startScramble = () => {
    if (!text) return;
    let iteration = 0;
    clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setDisplayText(() =>
        text
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';
            if (index < iteration) {
              return text[index];
            }
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join('')
      );

      if (iteration >= text.length) {
        clearInterval(intervalRef.current);
      }

      iteration += 1 / revealDelay;
    }, speed);
  };

  useEffect(() => {
    if (scrambleOnMount) {
      startScramble();
    } else {
      setDisplayText(text);
    }
    return () => clearInterval(intervalRef.current);
  }, [text, scrambleOnMount]);

  return (
    <span
      className={className}
      style={{
        fontFamily: 'var(--font-jetbrains), "Courier New", Courier, monospace',
        display: 'inline-block',
        ...style
      }}
      onMouseEnter={() => {
        if (scrambleOnHover) {
          startScramble();
        }
      }}
    >
      {displayText}
    </span>
  );
}

/**
 * Decrypting Paragraph matching XIVO's exact subtitle animation (ref_frame_06.jpg)
 */
export function AsciiDecryptionParagraph({
  prefix = 'Any agent — a quantum arbitrageur, a risk sentinel, a CLMM executor — ',
  suffix = 'verified on-chain. Anchor CPI proves the outcome.',
  style = {}
}) {
  const [cipherSuffix, setCipherSuffix] = useState('');
  const [revealedChars, setRevealedChars] = useState(0);

  useEffect(() => {
    let count = 0;
    const interval = setInterval(() => {
      count++;
      setRevealedChars(count);

      let scrambled = '';
      for (let i = 0; i < suffix.length; i++) {
        if (i < count) {
          scrambled += suffix[i];
        } else {
          scrambled += CHARS[Math.floor(Math.random() * CHARS.length)];
        }
      }
      setCipherSuffix(scrambled);

      if (count >= suffix.length) {
        clearInterval(interval);
      }
    }, 45);

    return () => clearInterval(interval);
  }, [suffix]);

  return (
    <p
      style={{
        fontSize: '13.5px',
        lineHeight: 1.7,
        color: '#94a3b8',
        fontFamily: 'var(--font-jetbrains), "Courier New", monospace',
        maxWidth: '520px',
        margin: '0 0 20px 0',
        ...style
      }}
    >
      <span style={{ color: '#cbd5e1' }}>{prefix}</span>
      <span style={{ color: revealedChars >= suffix.length ? '#cbd5e1' : '#4ade80' }}>
        {cipherSuffix || suffix}
      </span>
    </p>
  );
}

/**
 * Ambient ASCII Stream / Decoder Line (matching XIVO's raw cipher tape)
 */
export function AsciiCipherTape({ length = 32, speed = 120, style = {} }) {
  const [cipher, setCipher] = useState('');

  useEffect(() => {
    const chars = '#_~^}[/*/+~|0*[<]-+>!>*- [*1**+{}{}/_{#<}*>{_<<?_?{[]o[/=>>1';
    const gen = () => {
      let res = '';
      for (let i = 0; i < length; i++) {
        res += chars[Math.floor(Math.random() * chars.length)];
      }
      return res;
    };

    setCipher(gen());
    const id = setInterval(() => {
      setCipher(gen());
    }, speed);

    return () => clearInterval(id);
  }, [length, speed]);

  return (
    <span
      style={{
        fontFamily: 'var(--font-jetbrains), monospace',
        color: 'rgba(34, 197, 94, 0.55)',
        letterSpacing: '0.08em',
        userSelect: 'none',
        display: 'inline-block',
        ...style
      }}
    >
      {cipher}
    </span>
  );
}
