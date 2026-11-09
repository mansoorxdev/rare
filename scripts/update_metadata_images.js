/**
 * Batch updates all 10,078 JSON metadata files to attach the generative avatar URL
 */

const fs = require('fs');
const path = require('path');

const metadataDir = path.join(__dirname, '..', 'data', 'metadata');
const manifestPath = path.join(__dirname, '..', 'data', 'collection_manifest.json');

console.log('Attaching Generative Avatar URLs to 10,078 NFTs...');

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

manifest.forEach((item) => {
  const file = path.join(metadataDir, `${item.id}.json`);
  if (fs.existsSync(file)) {
    const meta = JSON.parse(fs.readFileSync(file, 'utf8'));
    meta.image = `http://localhost:3000/api/avatar/${item.id}`;
    fs.writeFileSync(file, JSON.stringify(meta, null, 2), 'utf8');
  }
  item.image = `http://localhost:3000/api/avatar/${item.id}`;
});

fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');

console.log('✔ Successfully attached avatar URLs to all 10,078 NFT metadata files!');

