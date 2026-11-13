export default function PreviewPage() {
  return (
    <div style={{ background: '#030f07', minHeight: '100vh', color: '#00ff55', fontFamily: 'monospace' }}>
      <h1 style={{ textAlign: 'center', padding: '20px', textShadow: '0 0 20px #00ff55', fontSize: '1.4rem' }}>
        🤖 RARE CRT Vault Robot — SVG vs Reference
      </h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', padding: '20px', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', border: '1px solid #00ff5533', padding: '15px', borderRadius: '8px' }}>
          <h2 style={{ marginBottom: '10px', fontSize: '0.9rem', color: '#00cc44' }}>📸 REFERENCE (Video Screenshot)</h2>
          <img src="/rare-exact-ref.jpg" alt="Reference Robot" style={{ maxWidth: '100%', borderRadius: '4px' }} />
        </div>
        <div style={{ textAlign: 'center', border: '1px solid #00ff5533', padding: '15px', borderRadius: '8px' }}>
          <h2 style={{ marginBottom: '10px', fontSize: '0.9rem', color: '#00cc44' }}>✏️ OUR SVG</h2>
          <img src="/rare-crt-robot-exact.svg" alt="SVG Robot" style={{ maxWidth: '100%' }} />
        </div>
      </div>
    </div>
  );
}
