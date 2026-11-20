'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-cream selection:bg-cream selection:text-black font-sans antialiased flex flex-col justify-between">
      <Navbar />

      <main className="mx-auto max-w-[640px] px-5 py-32 text-center my-auto">
        <span className="font-mono text-[12px] text-mint uppercase tracking-wider block mb-3">
          404 // ROUTE NOT FOUND
        </span>
        <h1 className="font-serif text-[48px] md:text-[64px] text-cream font-medium leading-none mb-4">
          Agent Lost in Space
        </h1>
        <p className="text-[15px] text-muted leading-relaxed mb-8">
          The requested coordinate does not exist on Solana cluster #31094. Return to the swarm directory or protocol home.
        </p>

        <div className="flex items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex h-9 items-center justify-center rounded-full bg-cream px-5 text-[13px] font-medium text-black transition-colors hover:bg-cream/90 shadow-sm"
          >
            Return Home →
          </Link>
          <Link
            href="/roster"
            className="inline-flex h-9 items-center justify-center rounded-full border border-line bg-surface-1 px-4 text-[13px] font-medium text-cream hover:bg-surface-2 transition-colors"
          >
            Browse Swarm
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
