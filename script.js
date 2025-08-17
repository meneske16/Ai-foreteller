let gems = 15; 
let currentPlayer = "human"; // "human" or "ai"

// DOM refs will be set after DOMContentLoaded to avoid nulls
let statusEl, remainingEl, gemsEl, branchesEl, crystalBall;

let sparkleInterval;

// (kept list)
const gemColors = [
  "linear-gradient(145deg, #ff1a4b, #a10022)",
  "linear-gradient(145deg, #00d26a, #007a3d)",
  "linear-gradient(145deg, #1a75ff, #002b80)",
  "linear-gradient(145deg, #b066ff, #4b0082)",
  "linear-gradient(145deg, #ffcc66, #cc9900)",
  "linear-gradient(145deg, #e6f7ff, #99ccff)"
];

// 🎯 Use type classes that map to CSS palettes
const gemTypes = ["ruby", "emerald", "sapphire", "amethyst", "topaz", "diamond"];

function initGame() {
  gems = Math.floor(Math.random() * 16) + 10; // random 10–25
  currentPlayer = "human";
  statusEl.textContent = "Your turn! Pick a number of gems (1–3).";
  updateDisplay();
}

function updateDisplay() {
  remainingEl.textContent = gems;
  const current = gemsEl.children.length;
  if (current > gems) {
    for (let i = gems; i < current; i++) {
      gemsEl.children[i].classList.add("remove");
      setTimeout(() => gemsEl.children[i]?.remove(), 500);
    }
  } else if (current < gems) {
    for (let i = current; i < gems; i++) {
      const gem = document.createElement("div");
      gem.classList.add("gem");

      // assign a random gem type class for color + glow
      const type = gemTypes[Math.floor(Math.random() * gemTypes.length)];
      gem.classList.add(type);

      // stagger the shine so they don't all glint together
      gem.style.setProperty("--delay", `${(Math.random() * 2).toFixed(2)}s`);

      gemsEl.appendChild(gem);
    }
  }
}

function playerMove(take) {
  if (currentPlayer !== "human" || take > gems) return;
  gems -= take;
  if (gems === 0) {
    statusEl.textContent = "🎉 You win! The future has changed!";
    triggerConfetti();
    updateDisplay();
    return;
  }
  currentPlayer = "ai";
  updateDisplay();
  statusEl.textContent = "AI is looking into the crystal ball...";
  crystalBall.classList.add("thinking"); 
  startSparkles(); 
  setTimeout(aiMove, 2000);
}

// Minimax algorithm
function minimax(remaining, maximizing) {
  if (remaining === 0) {
    return maximizing ? -1 : 1; 
  }
  if (maximizing) {
    let best = -Infinity;
    for (let i = 1; i <= 3; i++) {
      if (i <= remaining) {
        best = Math.max(best, minimax(remaining - i, false));
      }
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 1; i <= 3; i++) {
      if (i <= remaining) {
        best = Math.min(best, minimax(remaining - i, true));
      }
    }
    return best;
  }
}

function aiMove() {
  let bestScore = -Infinity;
  let move = 1;
  branchesEl.innerHTML = "";

  for (let i = 1; i <= 3; i++) {
    if (i <= gems) {
      let score = minimax(gems - i, false);
      let outcome = score > 0 ? "AI foresees a WIN ✨" : "AI foresees a LOSS ❌";
      let div = document.createElement("div");
      div.textContent = `If AI takes ${i}, ${gems - i} left → ${outcome}`;
      branchesEl.appendChild(div);

      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }

  gems -= move;
  updateDisplay();
  if (gems === 0) {
    statusEl.textContent = "⚡ AI wins! The prophecy was true!";
    stopSparkles(); 
    crystalBall.classList.remove("thinking");
    aiWinEffect();  
    return;
  }
  currentPlayer = "human";
  statusEl.textContent = `AI took ${move}. Your turn!`;
  branchesEl.innerHTML = "";
  stopSparkles(); 
  crystalBall.classList.remove("thinking");
}

/* ✨ Sparkle effect */
function startSparkles() {
  sparkleInterval = setInterval(() => {
    const sparkle = document.createElement("div");
    sparkle.classList.add("sparkle");
    sparkle.style.left = Math.random() * 280 + "px";
    sparkle.style.top = Math.random() * 280 + "px";
    crystalBall.appendChild(sparkle);

    setTimeout(() => sparkle.remove(), 2000);
  }, 300);
}

function stopSparkles() {
  clearInterval(sparkleInterval);
  const sparks = document.querySelectorAll(".sparkle");
  sparks.forEach(s => s.remove());
}

/* 🎉 Confetti burst */
function triggerConfetti() {
  for (let i = 0; i < 30; i++) {
    const conf = document.createElement("div");
    conf.classList.add("confetti");
    conf.style.left = Math.random() * window.innerWidth + "px";
    conf.style.backgroundColor = `hsl(${Math.random()*360},100%,50%)`;
    document.body.appendChild(conf);
    setTimeout(() => conf.remove(), 3000);
  }
}

// ⚡ Lightning strike effect
function aiWinEffect() {
  const bolt = document.createElement("div");
  bolt.classList.add("lightning");
  crystalBall.appendChild(bolt);
  setTimeout(() => bolt.remove(), 500);
}

/* ✅ Ensure DOM is ready even if script loads in <head> AND again at bottom */
window.addEventListener("DOMContentLoaded", () => {
  if (window.__ftInit) return; // guard against double <script> includes
  window.__ftInit = true;

  statusEl = document.getElementById("status");
  remainingEl = document.getElementById("remaining");
  gemsEl = document.getElementById("gems");
  branchesEl = document.getElementById("branches");
  crystalBall = document.getElementById("crystalBall");

  initGame();
});
