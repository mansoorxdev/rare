const fs = require('fs');

console.log('--- AUDITING 10,078 AGENTS UNIQUENESS ---');

const pdaSet = new Set();
const visualSet = new Set();
const nameSet = new Set();

let duplicatePDAs = 0;
let duplicateNames = 0;
let duplicateVisualSignatures = 0;

for (let id = 1; id <= 10078; id++) {
  const name = `Rare #${String(id).padStart(5, '0')}`;
  const hue = Math.round((id * 137.508) % 360);
  const archetype = id % 10;
  const mk = ((id * 7) % 9) + 1;
  const sat = 110 + (id % 5) * 12;
  const con = 102 + (id % 4) * 5;
  const bright = 96 + (id % 3) * 6;
  const pdaHash = ((id * 2654435761) >>> 0).toString(16).toUpperCase();
  const pdaVault = `PDA${id}v${pdaHash}Vault`;

  const visualSignature = `${archetype}_hue${hue}_sat${sat}_con${con}_br${bright}_mk${mk}`;

  if (pdaSet.has(pdaVault)) duplicatePDAs++;
  pdaSet.add(pdaVault);

  if (nameSet.has(name)) duplicateNames++;
  nameSet.add(name);

  if (visualSet.has(visualSignature)) duplicateVisualSignatures++;
  visualSet.add(visualSignature);
}

console.log('Total Count Checked:', 10078);
console.log('Unique Names / Token IDs:', nameSet.size, '(Duplicates:', duplicateNames, ')');
console.log('Unique PDA Vault Addresses:', pdaSet.size, '(Duplicates:', duplicatePDAs, ')');
console.log('Unique Generative Visual Signatures:', visualSet.size, '(Duplicates:', duplicateVisualSignatures, ')');
