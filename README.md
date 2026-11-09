# ⚡ RARE // SOLANA (10,078 Autonomous AI Agents)

An ultra-clean, retro-pixel terminal platform for launching **10,078 Autonomous AI Agents as NFTs on Solana**, inspired by the mechanics of `obol.sh`.

---

## 🌟 Key Features

1. **Pixel Font & Retro Arcade Aesthetic:**
   - Powered by Google Fonts: `Silkscreen`, `Press Start 2P`, and `VT323`.
   - Crisp 1px/2px hairline pixel borders, CRT scanline preview screen, and custom pixel-art CSS avatar.
   - Built-in 8-bit Web Audio synthesizer (retro sound FX for button clicks and minting).

2. **Token-Bound Accounts (PDA Wallets) on Solana:**
   - Every single one of the **10,078 NFTs** has its own dedicated on-chain wallet address (`PDA Vault`).
   - Dynamic ownership: When the NFT moves or is sold on secondary markets (Tensor, Magic Eden), the wallet and its contents automatically transfer to the new owner.

3. **Self-Funded Capital Routing (90/10 Split):**
   - **90%** of mint proceeds are routed straight into the newly minted Agent's own PDA wallet to pay for gas, DEX trading fees, and API calls.
   - **10%** is routed to the team/protocol treasury vault.

4. **Bonding Curve Price Ladder:**
   - 10 pricing bands (1,007.8 agents per band).
   - Starts at `0.02 SOL` with a `1.3×` multiplier per band up to `0.212 SOL`.

5. **Interactive Live Console (`/console`):**
   - Click **CONSOLE** in the navigation to open an interactive terminal to test commands:
     - `status`: Check network and agent health
     - `inspect <id>`: View bound PDA and roles for any agent
     - `supply`: Circulating supply metrics
     - `split`: Capital routing metrics

---

## 🚀 Quick Start (Local Preview)

To launch the web interface in your browser:

```bash
# Option 1: Using Python
python -m http.server 3000

# Option 2: Using Node (npx)
npx serve -l 3000
```
Then open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛠️ Generating 10,078 Agent Wallets & Metadata

To generate real Solana keypairs, deterministic PDA vaults, and Metaplex-standard JSON metadata:

```bash
# Generate a test batch of 10 agents
node scripts/generate_agents.js --count 10

# Generate the full 10,078 collection
node scripts/generate_agents.js --count 10078
```

### Outputs Generated in `/data`:
- `data/metadata/*.json`: 10,078 Metaplex-compliant JSON files with traits, role, and bound wallet.
- `data/collection_manifest.json`: Master JSON list linking all 10,078 tokens to their wallets.
- `data/wallets_audit.csv`: Spreadsheets-ready CSV file of all 10,078 Agent IDs, public keys, and PDA vaults.

