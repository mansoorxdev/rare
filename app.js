/**
 * DAEMON SOLANA - RETRO PIXEL RUNTIME
 * Handles Wallet connection, Mint calculation, 8-Bit Audio FX,
 * Activity feed, and Interactive Terminal Console.
 */

// Sound Synthesizer (8-bit Web Audio API)
class SoundFX {
  constructor() {
    this.enabled = true;
    this.ctx = null;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
    }
  }

  playTone(freq, type = 'square', duration = 0.08, volume = 0.05) {
    if (!this.enabled) return;
    try {
      this.init();
      if (this.ctx.state === 'suspended') this.ctx.resume();
      
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(volume, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      // Audio autoplay policy
    }
  }

  blip() { this.playTone(520, 'square', 0.04, 0.03); }
  select() { this.playTone(740, 'square', 0.06, 0.04); }
  mintSuccess() {
    this.playTone(440, 'square', 0.08, 0.05);
    setTimeout(() => this.playTone(660, 'square', 0.08, 0.05), 80);
    setTimeout(() => this.playTone(880, 'square', 0.16, 0.05), 160);
  }
}

const sfx = new SoundFX();

// App State
const state = {
  pricePerAgent: 0.25,
  quantity: 1,
  totalSold: 142,
  maxSupply: 10078,
  connectedWallet: null,
  recentAgents: [
    { id: 142, role: "DEFI ARBITRAGEUR", wallet: "7xKX...qA83", status: "ACTIVE" },
    { id: 141, role: "DATA MINER", wallet: "9mBP...rZ12", status: "STANDBY" },
    { id: 140, role: "PUMPFUN SNIPER", wallet: "4yZT...tM99", status: "ACTIVE" },
    { id: 139, role: "CROSSTALK NODE", wallet: "2dPQ...kL45", status: "SYNCED" },
    { id: 138, role: "MARKET MAKER", wallet: "8wRN...vB71", status: "ACTIVE" }
  ]
};

// DOM Elements
const qtyVal = document.getElementById("qty-val");
const btnMinus = document.getElementById("btn-minus");
const btnPlus = document.getElementById("btn-plus");
const inputDaemonId = document.getElementById("input-daemon-id");
const btnAnyUnsold = document.getElementById("btn-any-unsold");
const totalSolDisplay = document.getElementById("total-sol-display");
const btnMint = document.getElementById("btn-mint");
const mintStatusMsg = document.getElementById("mint-status-msg");
const btnConnectWallet = document.getElementById("btn-connect-wallet");
const tilesGrid = document.getElementById("tiles-grid");
const sfxToggle = document.getElementById("sfx-toggle");
const sfxIcon = document.getElementById("sfx-icon");

// Terminal DOM Elements
const terminalModal = document.getElementById("terminal-modal");
const btnOpenConsole = document.getElementById("btn-open-console");
const btnTermClose = document.getElementById("btn-term-close");
const termOutput = document.getElementById("term-output");
const termInput = document.getElementById("term-input");

// Update Mint Calculation
function updateMintTotals() {
  const total = (state.quantity * state.pricePerAgent).toFixed(3);
  const agentShare = (total * 0.90).toFixed(3);
  const treasuryShare = (total * 0.10).toFixed(3);

  totalSolDisplay.textContent = `${total} SOL`;
  const summarySplit = document.querySelector(".summary-split");
  if (summarySplit) {
    summarySplit.innerHTML = `
      <span class="split-agent">⚡ 90% (${agentShare} SOL) → AGENT'S WALLET</span>
      <span class="split-treasury">🏛 10% (${treasuryShare} SOL) → TREASURY</span>
    `;
  }
}

// Stepper Events
btnMinus.addEventListener("click", () => {
  sfx.blip();
  if (state.quantity > 1) {
    state.quantity--;
    qtyVal.textContent = state.quantity;
    updateMintTotals();
  }
});

btnPlus.addEventListener("click", () => {
  sfx.blip();
  if (state.quantity < 10) {
    state.quantity++;
    qtyVal.textContent = state.quantity;
    updateMintTotals();
  }
});

btnAnyUnsold.addEventListener("click", () => {
  sfx.select();
  const randomId = Math.floor(Math.random() * (state.maxSupply - state.totalSold)) + state.totalSold + 1;
  inputDaemonId.value = randomId;
  mintStatusMsg.textContent = `TARGETING DAEMON #${randomId}`;
  mintStatusMsg.className = "status-msg";
});

inputDaemonId.addEventListener("input", (e) => {
  const val = parseInt(e.target.value, 10);
  if (!isNaN(val)) {
    if (val <= state.totalSold) {
      mintStatusMsg.textContent = `DAEMON #${val} IS ALREADY SOLD!`;
      mintStatusMsg.className = "status-msg";
    } else if (val > state.maxSupply) {
      mintStatusMsg.textContent = `MAX SUPPLY IS #${state.maxSupply}`;
      mintStatusMsg.className = "status-msg";
    } else {
      mintStatusMsg.textContent = `DAEMON #${val} IS AVAILABLE`;
      mintStatusMsg.className = "status-msg success";
    }
  } else {
    mintStatusMsg.textContent = "READY TO MINT";
    mintStatusMsg.className = "status-msg";
  }
});

// Mint Action Simulation
btnMint.addEventListener("click", async () => {
  sfx.select();
  
  if (!document.getElementById("check-terms").checked) {
    alert("Please accept the terms before proceeding.");
    return;
  }

  btnMint.disabled = true;
  btnMint.textContent = "ROUTING CAPITAL...";
  mintStatusMsg.textContent = "INITIALIZING SOLANA CPI SPLIT TRANSACTION...";

  setTimeout(() => {
    mintStatusMsg.textContent = "DERIVING AGENT PDA VAULT...";
  }, 900);

  setTimeout(() => {
    sfx.mintSuccess();
    const mintedId = inputDaemonId.value ? parseInt(inputDaemonId.value, 10) : state.totalSold + 1;
    state.totalSold++;
    document.getElementById("sold-count").textContent = state.totalSold;

    // Create simulated new agent
    const dummyWallets = ["8zKP...uL71", "3xMN...pB19", "5vQW...rC44", "9kRT...mN88"];
    const randomWallet = dummyWallets[Math.floor(Math.random() * dummyWallets.length)];
    const roles = ["DEFI SENTINEL", "ARBITRAGEUR", "INFERENCE BOT", "LIQUIDITY RUNNER"];
    const randomRole = roles[Math.floor(Math.random() * roles.length)];

    state.recentAgents.unshift({
      id: mintedId,
      role: randomRole,
      wallet: randomWallet,
      status: "ONLINE"
    });

    renderActivityTiles();

    btnMint.disabled = false;
    btnMint.textContent = "MINT AGENT NOW";
    mintStatusMsg.textContent = `SUCCESS! DAEMON #${mintedId} ACTIVATED. 90% DEPOSITED TO PDA.`;
    mintStatusMsg.className = "status-msg success";
  }, 2200);
});

// Render Recent Tiles
function renderActivityTiles() {
  tilesGrid.innerHTML = "";
  state.recentAgents.slice(0, 5).forEach((agent) => {
    const tile = document.createElement("div");
    tile.className = "agent-tile";
    tile.innerHTML = `
      <div class="tile-top">
        <span class="tile-id">#${String(agent.id).padStart(4, '0')}</span>
        <span class="tile-badge">${agent.status}</span>
      </div>
      <div class="tile-avatar">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="4" width="18" height="14" rx="2" fill="#1e2922" stroke="#00e65b" stroke-width="1.5"/>
          <circle cx="8" cy="11" r="1.5" fill="#00e65b"/>
          <circle cx="16" cy="11" r="1.5" fill="#00e65b"/>
          <rect x="10" y="14" width="4" height="1" fill="#00e65b"/>
          <path d="M10 2L14 4" stroke="#00e65b" stroke-width="1.5"/>
        </svg>
      </div>
      <div class="tile-details">
        <span>ROLE: ${agent.role}</span>
        <span class="tile-wallet">WALLET: ${agent.wallet}</span>
      </div>
    `;
    tilesGrid.appendChild(tile);
  });
}

// Connect Wallet (Phantom or Simulated)
btnConnectWallet.addEventListener("click", async () => {
  sfx.blip();
  if (window.solana && window.solana.isPhantom) {
    try {
      const resp = await window.solana.connect();
      state.connectedWallet = resp.publicKey.toString();
      btnConnectWallet.textContent = `${state.connectedWallet.slice(0, 4)}...${state.connectedWallet.slice(-4)}`;
      btnConnectWallet.style.borderColor = "var(--accent-green-bright)";
    } catch (err) {
      console.error(err);
    }
  } else {
    // Simulated demo wallet
    state.connectedWallet = "7xKX...qA83";
    btnConnectWallet.textContent = "7xKX...qA83";
    btnConnectWallet.style.borderColor = "var(--accent-green-bright)";
    alert("Phantom Wallet not detected in browser. Connected in Simulated Testnet Mode!");
  }
});

// Copy Buttons
document.querySelectorAll(".btn-copy").forEach((btn) => {
  btn.addEventListener("click", () => {
    sfx.blip();
    const text = btn.getAttribute("data-copy");
    navigator.clipboard.writeText(text);
    const oldText = btn.textContent;
    btn.textContent = "COPIED!";
    btn.style.background = "var(--accent-green)";
    setTimeout(() => {
      btn.textContent = oldText;
      btn.style.background = "";
    }, 1200);
  });
});

// Sound Toggle
sfxToggle.addEventListener("click", () => {
  sfx.enabled = !sfx.enabled;
  sfxIcon.textContent = sfx.enabled ? "🔊" : "🔇";
  if (sfx.enabled) sfx.blip();
});

// Terminal Console Logic
btnOpenConsole.addEventListener("click", (e) => {
  e.preventDefault();
  sfx.select();
  terminalModal.removeAttribute("hidden");
  termInput.focus();
});

btnTermClose.addEventListener("click", () => {
  terminalModal.setAttribute("hidden", "true");
});

terminalModal.addEventListener("click", (e) => {
  if (e.target === terminalModal) terminalModal.setAttribute("hidden", "true");
});

termInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const cmd = termInput.value.trim().toLowerCase();
    termInput.value = "";
    sfx.blip();

    const line = document.createElement("p");
    line.className = "term-line";
    line.textContent = `daemon@sol:~$ ${cmd}`;
    termOutput.appendChild(line);

    const res = document.createElement("p");
    res.className = "term-line green";

    if (cmd === "help") {
      res.innerHTML = `
        AVAILABLE COMMANDS:<br>
        - 'status': Display cluster health and total agents<br>
        - 'inspect [id]': View metadata and PDA address for specific agent<br>
        - 'supply': Total circulating vs remaining supply<br>
        - 'split': Capital routing distribution metrics<br>
        - 'clear': Clear screen
      `;
    } else if (cmd === "status") {
      res.textContent = `CLUSTER: SOLANA MAINNET-BETA | AGENTS: 10,078 | ACTIVE RUNTIMES: ${state.totalSold} | AVG GAS: 0.000005 SOL`;
    } else if (cmd.startsWith("inspect")) {
      const parts = cmd.split(" ");
      const id = parts[1] || "1";
      res.innerHTML = `
        INSPECTING AGENT #${id}:<br>
        - ROLE: Autonomous Arbitrageur<br>
        - TOKEN-BOUND PDA: 9mBP7xKX...4yZT<br>
        - SPLIT RATIO: 90% Self-Funded<br>
        - STATUS: READY FOR INSTRUCTIONS
      `;
    } else if (cmd === "supply") {
      res.textContent = `MINTED: ${state.totalSold} / 10,078 | REMAINING: ${state.maxSupply - state.totalSold}`;
    } else if (cmd === "split") {
      res.textContent = `SPLIT ATOMIC RULE: 90% -> AGENT PDA VAULT | 10% -> PROTOCOL TREASURY`;
    } else if (cmd === "clear") {
      termOutput.innerHTML = "";
      return;
    } else {
      res.className = "term-line amber";
      res.textContent = `Command '${cmd}' not recognized. Type 'help' for available commands.`;
    }

    termOutput.appendChild(res);
    termOutput.scrollTop = termOutput.scrollHeight;
  }
});

// Floating News Pill
document.getElementById("btn-news-pill").addEventListener("click", () => {
  sfx.select();
  alert("What's New:\n- Season 1 Preseason Live on Solana\n- Token-Bound PDA Router Deployed\n- Metaplex Core Compression Enabled");
});

// Initial Setup
renderActivityTiles();
updateMintTotals();

