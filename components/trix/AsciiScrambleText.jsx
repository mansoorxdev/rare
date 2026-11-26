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
        color: 'rgba(34, 197, 94, 0.65)',
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
