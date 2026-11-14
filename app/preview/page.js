export default function PreviewPage() {
  const pairs = [
    {
      title: '1. Cyan Robot (Yellow Striped Shirt)',
      ref: '/ref-cyan-robot.jpg',
      svg: '/pixel-samples/sample-1-cyan-robot.svg',
    },
    {
      title: '2. Purple Warrior (Laser Katana)',
      ref: '/ref-purple-warrior.jpg',
      svg: '/pixel-samples/sample-2-purple-warrior.svg',
    },
    {
      title: '3. Cute Antenna Girl (Split Dress)',
      ref: '/ref-antenna-girl.jpg',
      svg: '/pixel-samples/sample-3-antenna-girl.svg',
    },
  ];

  return (
    <div style={{ background: '#0a0e17', minHeight: '100vh', color: '#fff', fontFamily: 'monospace', padding: '24px' }}>
      <header style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h1 style={{ color: '#00f0ff', fontSize: '1.8rem', marginBottom: '8px', textShadow: '0 0 16px rgba(0,240,255,0.4)' }}>
          👾 10,078 Pixel Art NFT Generator — Live Test
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.95rem', maxWidth: '750px', margin: '0 auto' }}>
          Exact 24×24 crisp pixel art engine! Har NFT 100% vector SVG format mein generate hoti hai with zero blur, scalable to any resolution (4K / 8K).
        </p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px', maxWidth: '1200px', margin: '0 auto' }}>
        {pairs.map((p, i) => (
          <div key={i} style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: '12px', padding: '16px' }}>
            <h3 style={{ color: '#38bdf8', fontSize: '1rem', marginBottom: '14px', borderBottom: '1px solid #1f2937', paddingBottom: '8px' }}>
              {p.title}
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: '#9ca3af', display: 'block', marginBottom: '6px' }}>📸 ORIGINAL</span>
                <img src={p.ref} alt="Reference" style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', borderRadius: '8px', border: '1px solid #374151' }} />
              </div>
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: '#34d399', display: 'block', marginBottom: '6px' }}>⚡ GENERATED SVG</span>
                <img src={p.svg} alt="Generated SVG" style={{ width: '100%', aspectRatio: '1', borderRadius: '8px', border: '1px solid #059669', background: '#000' }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ maxWidth: '900px', margin: '40px auto 0', background: '#111827', border: '1px solid #0284c7', borderRadius: '12px', padding: '24px' }}>
        <h2 style={{ color: '#38bdf8', fontSize: '1.2rem', marginBottom: '12px' }}>
          🚀 10,078 Unique NFTs Kaise Banenge? (100% Possible & Fast!)
        </h2>
        <ul style={{ color: '#cbd5e1', lineHeight: '1.8', fontSize: '0.9rem', paddingLeft: '20px' }}>
          <li><strong>Grid-Based Modular Layers:</strong> Background, Body/Skin, Eyes, Mouth, Headwear/Hair, Clothes, aur Held Accessories.</li>
          <li><strong>Zero Blur Crisp SVGs:</strong> Native 24×24 pixel coordinates jo mobile, web, aur print par 100% sharp render hote hain.</li>
          <li><strong>Guaranteed Uniqueness:</strong> Cryptographic hash check taaki koi bhi 2 NFTs exact same na hon.</li>
          <li><strong>Instant Generation:</strong> Ek node script 10,078 SVGs aur unke matching Solana Metaplex JSON metadata ko under 30 seconds mein generate kar sakti hai!</li>
        </ul>
      </div>
    </div>
  );
}
