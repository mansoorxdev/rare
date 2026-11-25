'use client';

import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function PreviewPage() {
  const [searchId, setSearchId] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 40; // 40 items per page

  const totalNFTs = 10078;
  const totalPages = Math.ceil(totalNFTs / pageSize);

  const startIdx = (currentPage - 1) * pageSize + 1;
  const currentNFTs = Array.from({ length: pageSize }, (_, i) => startIdx + i).filter(id => id <= totalNFTs);

  const searchedIdNum = parseInt(searchId, 10);
  const isValidSearch = searchedIdNum >= 1 && searchedIdNum <= totalNFTs;

  return (
    <div className="gamma-page-container">
      <Navbar />

      <main style={{ maxWidth: '1360px', margin: '0 auto', padding: '108px 24px 64px 24px' }}>
        {/* Header */}
        <div className="gamma-page-header">
          <div className="gamma-badge" style={{ marginBottom: '12px' }}>
            <span className="gamma-badge-icon">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4 4h16v16H4V4zm2 2v12h12V6H6z" />
              </svg>
            </span>
            <span>10,078 UNIQUE ON-CHAIN VECTORS · 24x24 ASSETS</span>
          </div>

          <h1 className="gamma-hero-title" style={{ fontSize: 'clamp(32px, 4vw, 52px)', marginBottom: '12px' }}>
            Pixel NFT Explorer
          </h1>
          <p className="gamma-hero-subtitle" style={{ maxWidth: '680px', margin: '0 auto' }}>
            All 10,078 unique vector pixel art NFTs inscribed on Solana. Every asset is paired with its autonomous token-bound PDA vault.
          </p>

          {/* Search bar */}
          <div style={{ marginTop: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', maxWidth: '360px', margin: '24px auto 0 auto' }}>
            <input
              type="number"
              min="1"
              max="10078"
              placeholder="Jump to ID (1 - 10078)..."
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              style={{
                width: '100%',
                borderRadius: '9999px',
                border: '1px solid rgba(15, 23, 42, 0.12)',
                background: '#ffffff',
                padding: '8px 18px',
                fontSize: '12.5px',
                fontFamily: 'var(--font-jetbrains), monospace',
                color: '#0f172a',
                outline: 'none',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)'
              }}
            />
            {isValidSearch && (
              <button
                type="button"
                onClick={() => setCurrentPage(Math.ceil(searchedIdNum / pageSize))}
                className="gamma-btn-black"
                style={{ padding: '8px 16px', fontSize: '12px', flexShrink: 0 }}
              >
                Go #{searchedIdNum}
              </button>
            )}
          </div>
        </div>

        {/* Featured Search Result if active */}
        {isValidSearch && (
          <div style={{
            maxWidth: '320px',
            margin: '0 auto 32px auto',
            borderRadius: '20px',
            border: '1px solid rgba(147, 51, 234, 0.3)',
            background: '#ffffff',
            padding: '20px',
            textAlign: 'center',
            boxShadow: '0 10px 30px -10px rgba(147, 51, 234, 0.2)'
          }}>
            <span style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '13px', fontWeight: 800, color: '#7c3aed' }}>
              Rare #{String(searchedIdNum).padStart(5, '0')}
            </span>
            <div style={{
              width: '120px',
              height: '120px',
              borderRadius: '16px',
              background: '#f8fafc',
              border: '1px solid rgba(15, 23, 42, 0.08)',
              padding: '12px',
              margin: '12px auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <img
                src={`/nfts/${searchedIdNum}.svg`}
                alt={`NFT #${searchedIdNum}`}
                style={{ width: '100%', height: '100%', objectFit: 'contain', imageRendering: 'pixelated' }}
              />
            </div>
          </div>
        )}

        {/* 40-Card Gallery Grid (Small compact cards) */}
        <div className="gamma-roster-grid" style={{ marginBottom: '40px' }}>
          {currentNFTs.map((id) => (
            <div
              key={id}
              className="gamma-small-card"
              style={{ textAlign: 'center', alignItems: 'center' }}
            >
              <div className="gamma-small-avatar-box">
                <img
                  src={`/nfts/${id}.svg`}
                  alt={`Rare #${id}`}
                  loading="lazy"
                />
              </div>
              <span style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '11px', fontWeight: 700, color: '#0f172a' }}>
                #{String(id).padStart(5, '0')}
              </span>
            </div>
          ))}
        </div>

        {/* Pagination Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', fontFamily: 'var(--font-jetbrains), monospace', fontSize: '12px' }}>
          <button
            type="button"
            onClick={() => { setCurrentPage((p) => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            disabled={currentPage === 1}
            className="gamma-btn-white"
            style={{ padding: '6px 18px', fontSize: '12.5px', opacity: currentPage === 1 ? 0.4 : 1 }}
          >
            ← Previous
          </button>

          <span style={{ color: '#64748b' }}>
            Page <strong style={{ color: '#0f172a' }}>{currentPage}</strong> of <strong style={{ color: '#0f172a' }}>{totalPages}</strong>
          </span>

          <button
            type="button"
            onClick={() => { setCurrentPage((p) => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            disabled={currentPage === totalPages}
            className="gamma-btn-white"
            style={{ padding: '6px 18px', fontSize: '12.5px', opacity: currentPage === totalPages ? 0.4 : 1 }}
          >
            Next →
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
