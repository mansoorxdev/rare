'use client';

import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function PreviewPage() {
  const [searchId, setSearchId] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 24;

  const totalNFTs = 10078;
  const totalPages = Math.ceil(totalNFTs / pageSize);

  const startIdx = (currentPage - 1) * pageSize + 1;
  const currentNFTs = Array.from({ length: pageSize }, (_, i) => startIdx + i).filter(id => id <= totalNFTs);

  const searchedIdNum = parseInt(searchId, 10);
  const isValidSearch = searchedIdNum >= 1 && searchedIdNum <= totalNFTs;

  return (
    <div className="min-h-screen bg-black text-cream selection:bg-cream selection:text-black font-sans antialiased">
      <Navbar />

      <main className="page-container">
        {/* Header */}
        <div className="mx-auto max-w-[800px] text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-line bg-surface-1 px-3 py-1 font-mono text-[11px] text-dim mb-4">
            <span className="h-1.5 w-1.5 rounded-full bg-mint animate-pulse" />
            <span>10,078 UNIQUE ON-CHAIN VECTORS // 24x24 ASSETS</span>
          </div>

          <h1 className="font-serif text-[40px] leading-[1.05] text-cream md:text-[56px] font-medium">
            Pixel NFT Explorer
          </h1>
          <p className="mt-4 text-[15px] leading-relaxed text-muted">
            All 10,078 unique vector pixel art NFTs inscribed on Solana. Every asset is paired with its autonomous token-bound PDA vault.
          </p>

          {/* Search bar */}
          <div className="mt-8 flex items-center justify-center gap-2 max-w-[360px] mx-auto">
            <input
              type="number"
              min="1"
              max="10078"
              placeholder="Jump to ID (1 - 10078)..."
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="w-full rounded-lg border border-line bg-surface-1 px-3.5 py-2 font-mono text-[12px] text-cream placeholder:text-dim focus:border-cream focus:outline-none transition-colors"
            />
            {isValidSearch && (
              <button
                type="button"
                onClick={() => setCurrentPage(Math.ceil(searchedIdNum / pageSize))}
                className="rounded-lg bg-cream px-4 py-2 font-mono text-[12px] font-medium text-black hover:bg-cream/90 transition-colors shrink-0 cursor-pointer"
              >
                Go #{searchedIdNum}
              </button>
            )}
          </div>
        </div>

        {/* Featured Search Result if active */}
        {isValidSearch && (
          <div className="max-w-[320px] mx-auto mb-12 rounded-xl border border-mint/40 bg-surface-1 p-5 text-center shadow-2xl">
            <span className="font-mono text-[12px] text-mint font-medium">
              Rare #{String(searchedIdNum).padStart(5, '0')}
            </span>
            <div className="aspect-square w-full rounded-lg bg-black border border-line p-4 my-3 flex items-center justify-center">
              <img
                src={`/nfts/${searchedIdNum}.svg`}
                alt={`NFT #${searchedIdNum}`}
                className="w-full h-full object-contain filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]"
              />
            </div>
          </div>
        )}

        {/* 24-Card Gallery Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-14">
          {currentNFTs.map((id) => (
            <div
              key={id}
              className="group overflow-hidden rounded-lg border border-line bg-surface-1 p-3 transition-[transform,background-color,border-color] duration-150 hover:-translate-y-1 hover:border-line-strong hover:bg-surface-2 text-center"
            >
              <div className="aspect-square w-full rounded-md bg-black/60 border border-line/40 p-2 flex items-center justify-center mb-2">
                <img
                  src={`/nfts/${id}.svg`}
                  alt={`Rare #${id}`}
                  className="w-full h-full object-contain pixel-avatar filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)] group-hover:scale-105 transition-transform"
                  loading="lazy"
                />
              </div>
              <span className="font-mono text-[11px] text-dim group-hover:text-cream transition-colors">
                #{String(id).padStart(5, '0')}
              </span>
            </div>
          ))}
        </div>

        {/* Pagination Bar */}
        <div className="flex items-center justify-center gap-4 font-mono text-[12px]">
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="rounded-full border border-line bg-surface-1 px-4 py-1.5 text-muted hover:text-cream hover:border-line-strong transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          >
            ← Previous
          </button>

          <span className="text-dim">
            Page <span className="text-cream font-medium">{currentPage}</span> of <span className="text-cream">{totalPages}</span>
          </span>

          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="rounded-full border border-line bg-surface-1 px-4 py-1.5 text-muted hover:text-cream hover:border-line-strong transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          >
            Next →
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
