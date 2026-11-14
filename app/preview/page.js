'use client';

import { useState } from 'react';

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
    <div style={{ background: '#0a0e17', minHeight: '100vh', color: '#fff', fontFamily: 'monospace', padding: '24px' }}>
      <header style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h1 style={{ color: '#00f0ff', fontSize: '2rem', marginBottom: '8px', textShadow: '0 0 16px rgba(0,240,255,0.4)' }}>
          👾 10,078 RARE Pixel NFTs Explorer
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.95rem', maxWidth: '750px', margin: '0 auto' }}>
          All 10,078 Unique 24×24 Vector Pixel Art NFTs are generated & live! Native razor-sharp SVGs with Solana Token-Bound PDA Wallets.
        </p>

        {/* Search bar */}
        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
          <input
            type="number"
            min="1"
            max="10078"
            placeholder="Jump to ID (1 - 10078)..."
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            style={{
              padding: '10px 16px',
              borderRadius: '8px',
              border: '1px solid #00f0ff55',
              background: '#111827',
              color: '#fff',
              fontSize: '1rem',
              width: '240px',
              outline: 'none'
            }}
          />
          {isValidSearch && (
            <button
              onClick={() => {
                setCurrentPage(Math.ceil(searchedIdNum / pageSize));
              }}
              style={{
                padding: '10px 18px',
                borderRadius: '8px',
                border: 'none',
                background: '#00f0ff',
                color: '#000',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Go to #{String(searchedIdNum).padStart(5, '0')}
            </button>
          )}
        </div>
      </header>

      {/* Featured Search Result if active */}
      {isValidSearch && (
        <div style={{ maxWidth: '380px', margin: '0 auto 40px', background: '#111827', border: '2px solid #00f0ff', borderRadius: '16px', padding: '20px', textAlign: 'center' }}>
          <span style={{ color: '#38bdf8', fontSize: '1.1rem', fontWeight: 'bold' }}>
            Rare #{String(searchedIdNum).padStart(5, '0')}
          </span>
          <img
            src={`/nfts/${searchedIdNum}.svg`}
            alt={`NFT #${searchedIdNum}`}
            style={{ width: '100%', aspectRatio: '1', borderRadius: '12px', marginTop: '12px', imageRendering: 'pixelated' }}
          />
        </div>
      )}

      {/* Gallery Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: '16px', maxWidth: '1300px', margin: '0 auto' }}>
        {currentNFTs.map((id) => (
          <div
            key={id}
            style={{
              background: '#111827',
              border: '1px solid #1f2937',
              borderRadius: '12px',
              padding: '12px',
              textAlign: 'center',
              transition: 'transform 0.15s ease, border-color 0.15s ease'
            }}
          >
            <img
              src={`/nfts/${id}.svg`}
              alt={`Rare #${id}`}
              style={{ width: '100%', aspectRatio: '1', borderRadius: '8px', imageRendering: 'pixelated', display: 'block', marginBottom: '8px' }}
            />
            <div style={{ fontSize: '0.85rem', color: '#38bdf8', fontWeight: 'bold' }}>
              Rare #{String(id).padStart(5, '0')}
            </div>
            <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
              Solana Agent
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '14px', marginTop: '36px' }}>
        <button
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          style={{
            padding: '8px 16px',
            borderRadius: '6px',
            background: currentPage === 1 ? '#1f2937' : '#0284c7',
            color: '#fff',
            border: 'none',
            cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
          }}
        >
          ◀ Prev
        </button>

        <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
          Page <strong style={{ color: '#00f0ff' }}>{currentPage}</strong> of {totalPages}
        </span>

        <button
          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          style={{
            padding: '8px 16px',
            borderRadius: '6px',
            background: currentPage === totalPages ? '#1f2937' : '#0284c7',
            color: '#fff',
            border: 'none',
            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
          }}
        >
          Next ▶
        </button>
      </div>

      <div style={{ maxWidth: '850px', margin: '48px auto 0', background: '#111827', border: '1px solid #00f0ff33', borderRadius: '12px', padding: '20px' }}>
        <h3 style={{ color: '#00f0ff', marginBottom: '10px' }}>📦 Collection Stats</h3>
        <p style={{ color: '#cbd5e1', fontSize: '0.85rem', lineHeight: '1.6' }}>
          • Total Generated: <strong>10,078 / 10,078</strong> (100% Unique, 0 Duplicates)<br />
          • Format: Native 24×24 Vector SVG (Zero blur, infinite resolution)<br />
          • Location: <code>public/nfts/</code> (1.svg to 10078.svg)<br />
          • Metaplex Metadata: <code>data/metadata/</code> (1.json to 10078.json)<br />
          • Master Audit Manifest: <code>data/collection_manifest.json</code> &amp; <code>data/wallets_audit.csv</code>
        </p>
      </div>
    </div>
  );
}
