/**
 * DAEMON SOLANA - 10,078 AGENT WALLET & METADATA GENERATOR
 * 
 * Generates:
 * 1. 10,078 Unique Solana Keypairs (Agent Execution Wallets)
 * 2. Deterministic Token-Bound PDA (Program Derived Address) Vaults
 * 3. Metaplex-compliant JSON metadata for all agents with roles, spend limits, and traits
 * 4. Master Collection Manifest & CSV export for easy auditing
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Base58 Alphabet for Solana Addresses
const ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

function toBase58(buffer) {
  let digits = [0];
  for (let i = 0; i < buffer.length; i++) {
    for (let j = 0; j < digits.length; j++) digits[j] <<= 8;
    digits[0] += buffer[i];
    let carry = 0;
    for (let j = 0; j < digits.length; ++j) {
      digits[j] += carry;
      carry = (digits[j] / 58) | 0;
      digits[j] %= 58;
    }
    while (carry) {
      digits.push(carry % 58);
      carry = (carry / 58) | 0;
    }
  }
  for (let i = 0; buffer[i] === 0 && i < buffer.length - 1; i++) digits.push(0);
  return digits.reverse().map(d => ALPHABET[d]).join('');
}

// Generate an authentic Solana-compatible Ed25519 keypair
function generateSolanaWallet() {
  const keypair = crypto.generateKeyPairSync('ed25519', {
    publicKeyEncoding: { type: 'spki', format: 'der' },
    privateKeyEncoding: { type: 'pkcs8', format: 'der' }
  });
  
  // Extract raw 32 bytes public key from DER format
  const rawPubkey = keypair.publicKey.subarray(keypair.publicKey.length - 32);
  const base58Address = toBase58(rawPubkey);
  
  // Derive Deterministic PDA Vault Address
  const pdaSeed = Buffer.concat([Buffer.from("agent-vault"), rawPubkey]);
  const pdaHash = crypto.createHash('sha256').update(pdaSeed).digest();
  const pdaAddress = toBase58(pdaHash);

  return {
    publicKey: base58Address,
    pdaVault: pdaAddress,
    secretBytesHex: keypair.privateKey.toString('hex')
  };
}

// Trait pools for generative attributes
const ROLES = [
  "DeFi Arbitrageur",
  "PumpFun Liquidity Sniper",
  "CROSSTALK Fact Node",
  "Autonomous Market Maker",
  "MEV Sentinel",
  "Portfolio Rebalancer",
  "Prediction Market Oracle",
  "Yield Compounder"
];

const CASINGS = [
  "Matte Charcoal",
  "Industrial Parchment",
  "Cyber Neon Green",
  "Transparent Smoke",
  "Titanium Alloy",
  "Vintage Beige 1984"
];

const PHOSPHORS = [
  "Emerald Green CRT",
  "Monochrome Amber",
  "Glitch Cyan",
  "Deep Ultraviolet",
  "Ruby Crimson"
];

const EYE_EXPRESSIONS = [
  "Blinking Pixel",
  "Terminal Prompt '_'",
  "ASCII Smile ':)'",
  "Matrix Cascading Code",
  "Focused Scanline",
  "Laser Beam"
];

const SPEND_LIMITS = [
  "0.25 SOL / Day",
  "0.50 SOL / Day",
  "1.00 SOL / Day",
  "2.50 SOL / Day",
  "5.00 SOL / Day"
];

async function main() {
  const args = process.argv.slice(2);
  const countIdx = args.indexOf('--count');
  const TARGET_COUNT = countIdx !== -1 && args[countIdx + 1] ? parseInt(args[countIdx + 1], 10) : 10;

  console.log(`\n======================================================`);
  console.log(`★ SOLANA DAEMON AGENT GENERATOR`);
  console.log(`Target: Generating ${TARGET_COUNT} Agents with Token-Bound Wallets`);
  console.log(`======================================================\n`);

  const outputDir = path.join(__dirname, '..', 'data');
  const metadataDir = path.join(outputDir, 'metadata');
  
  if (!fs.existsSync(metadataDir)) {
    fs.mkdirSync(metadataDir, { recursive: true });
  }

  const manifest = [];
  const walletAuditList = [];

  const startTime = Date.now();

  for (let i = 1; i <= TARGET_COUNT; i++) {
    const formattedId = String(i).padStart(5, '0');
    const wallet = generateSolanaWallet();

    const role = ROLES[i % ROLES.length];
    const casing = CASINGS[i % CASINGS.length];
    const phosphor = PHOSPHORS[i % PHOSPHORS.length];
    const eyes = EYE_EXPRESSIONS[i % EYE_EXPRESSIONS.length];
    const spendLimit = SPEND_LIMITS[i % SPEND_LIMITS.length];

    const metadata = {
      name: `Rare #${formattedId}`,
      symbol: "RARE",
      description: `Autonomous AI Agent Rare #${formattedId} deployed on Solana. Bound to an on-chain PDA smart wallet funded with 90% of mint proceeds.`,
      image: `https://arweave.net/placeholder/${i}.png`,
      external_url: "https://obol.sh",
      attributes: [
        { trait_type: "Role", value: role },
        { trait_type: "Casing", value: casing },
        { trait_type: "Phosphor Tint", value: phosphor },
        { trait_type: "Expression", value: eyes },
        { trait_type: "Daily Spend Limit", value: spendLimit },
        { trait_type: "Agent Wallet", value: wallet.publicKey },
        { trait_type: "Token-Bound PDA", value: wallet.pdaVault },
        { trait_type: "Capital Split", value: "90% Agent / 10% Treasury" },
        { trait_type: "Firmware", value: "v2.4-Core" }
      ],
      properties: {
        category: "agent",
        agentfile: {
          version: "1.0",
          runtime: "solana-eliza",
          bound_pda: wallet.pdaVault,
          signing_key: wallet.publicKey,
          allowed_programs: [
            "Jupiter_v6",
            "Raydium_AMM",
            "Meteora_DLMM",
            "PumpFun"
          ],
          safety_rules: {
            max_single_tx: "0.25 SOL",
            payout_destination: "NFT_HOLDER_ONLY"
          }
        }
      }
    };

    // Save individual Metaplex JSON file
    fs.writeFileSync(
      path.join(metadataDir, `${i}.json`),
      JSON.stringify(metadata, null, 2),
      'utf8'
    );

    manifest.push({
      id: i,
      name: metadata.name,
      agentWallet: wallet.publicKey,
      pdaVault: wallet.pdaVault,
      role: role
    });

    walletAuditList.push({
      id: i,
      agentNumber: formattedId,
      publicKey: wallet.publicKey,
      pdaVault: wallet.pdaVault
    });

    if (i % 1000 === 0 || i === TARGET_COUNT) {
      console.log(`✔ Generated ${i}/${TARGET_COUNT} Agent Wallets & Metadata files...`);
    }
  }

  // Write Master Collection Manifest
  fs.writeFileSync(
    path.join(outputDir, 'collection_manifest.json'),
    JSON.stringify(manifest, null, 2),
    'utf8'
  );

  // Write CSV Audit Sheet
  const csvRows = ['Agent_ID,Name,Agent_Public_Key,PDA_Vault_Address,Role'];
  manifest.forEach(m => {
    csvRows.push(`${m.id},"${m.name}",${m.agentWallet},${m.pdaVault},"${m.role}"`);
  });
  fs.writeFileSync(path.join(outputDir, 'wallets_audit.csv'), csvRows.join('\n'), 'utf8');

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);

  console.log(`\n======================================================`);
  console.log(`✔ SUCCESS! ${TARGET_COUNT} AGENTS GENERATED IN ${duration}s`);
  console.log(`Metadata Files:  ${metadataDir}`);
  console.log(`Manifest File:   ${path.join(outputDir, 'collection_manifest.json')}`);
  console.log(`CSV Audit Sheet: ${path.join(outputDir, 'wallets_audit.csv')}`);
  console.log(`======================================================\n`);
}

main().catch(console.error);

