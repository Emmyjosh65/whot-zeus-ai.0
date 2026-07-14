/* =====================================
   ZEUS IQ AI WHOT — UI CONTROLLER
   Premium Display & Interaction
   ===================================== */

/* ====== UPDATE FULL BOARD ====== */
function updateBoard() {
    displayPlayerCards();
    displayZeusCards();
    displayCurrentCard();
    updateTurn();
    updateCardCounts();
}

/* ====== DISPLAY PLAYER CARDS ====== */
function displayPlayerCards() {
    const area = document.getElementById("playerHand");
    if (!area) return;
    area.innerHTML = "";

    playerHand.forEach((card, index) => {
        const div = document.createElement("div");
        div.className = "card player-card";
        div.innerHTML = `${card.text}<small style="font-size:8px;opacity:0.5;margin-top:2px">${getCardDescription(card)}</small>`;
        div.onclick = () => playCard(index);
        area.appendChild(div);
    });
}

/* ====== DISPLAY ZEUS CARDS ====== */
function displayZeusCards() {
    const area = document.getElementById("zeusHand");
    if (!area) return;
    area.innerHTML = "";

    zeusHand.forEach(() => {
        const div = document.createElement("div");
        div.className = "card";
        div.innerHTML = "🤖";
        area.appendChild(div);
    });
}

/* ====== DISPLAY CURRENT CARD ====== */
function displayCurrentCard() {
    const cardBox = document.getElementById("currentCard");
    if (!cardBox) return;

    if (currentCard) {
        const symbol = currentCard.shape === "WHOT" ? "⚡" : CARD_SHAPES[currentCard.shape] || currentCard.shape;
        cardBox.innerHTML = `
            <div style="font-size:28px;margin-bottom:4px">${symbol}</div>
            <div style="font-size:18px">${currentCard.number}</div>
            <small style="font-size:8px;opacity:0.5">${getCardDescription(currentCard)}</small>
        `;
    } else {
        cardBox.innerHTML = `<span class="placeholder">?</span>`;
    }
}

/* ====== UPDATE CARD COUNTS ====== */
function updateCardCounts() {
    const zeusCount = document.getElementById("zeusCardCount");
    const playerCount = document.getElementById("playerCardCount");

    if (zeusCount) zeusCount.innerHTML = `Cards: ${zeusHand.length}`;
    if (playerCount) playerCount.innerHTML = `Cards: ${playerHand.length}`;
}

/* ====== TURN INDICATOR ====== */
function updateTurn() {
    const turn = document.getElementById("turnIndicator");
    if (!turn) return;

    if (playerTurn && !gameOver) {
        turn.innerHTML = `<div class="turn-dot"></div><span>Your Turn</span>`;
        turn.style.color = "var(--neon-green)";
    } else if (!playerTurn && !gameOver) {
        turn.innerHTML = `<div class="turn-dot" style="background:var(--neon-purple)"></div><span>Zeus Thinking...</span>`;
        turn.style.color = "var(--neon-purple)";
    } else {
        turn.innerHTML = `<span>Game Over</span>`;
        turn.style.color = "var(--accent)";
    }
}

/* ====== SHOW MESSAGE ====== */
function showMessage(text) {
    const box = document.getElementById("messageBox");
    if (box) {
        // Keep emoji prefix if present
        const hasEmoji = text.match(/^[^\w\s]/);
        box.innerHTML = hasEmoji ? text : `<span class="msg-icon">💬</span> <span>${text}</span>`;
    }
}

/* ====== SHOW WINNER ====== */
function showWinner(text) {
    const modal = document.getElementById("winModal");
    const title = document.getElementById("winnerText");
    const iqValue = document.getElementById("iqScoreValue");
    const stats = document.getElementById("modalStats");

    if (title) title.innerHTML = text;
    if (iqValue) iqValue.textContent = iqScore;

    if (stats) {
        stats.innerHTML = `
            <div>🎯 Smart Plays: ${smartPlays}/${totalPlays}</div>
            <div>🏆 Win Rate: ${gamesPlayed > 0 ? Math.round((gamesWon/gamesPlayed)*100) : 0}%</div>
            <div>📊 Rounds Played: ${roundNumber}</div>
            <div>🃏 Cards Left: ${playerHand.length}</div>
            <div>🎮 Total Games: ${gamesPlayed}</div>
        `;
    }

    if (modal) modal.classList.remove("hidden");
}

/* ====== UPDATE SCORES ====== */
function updateScores() {
    const player = document.getElementById("playerScore");
    const zeus = document.getElementById("zeusScore");
    if (player) player.innerHTML = playerScore;
    if (zeus) zeus.innerHTML = zeusScore;
}

/* ====== CARD ANIMATION ====== */
function animateCard(element) {
    if (!element) return;
    element.style.transform = "scale(1.1)";
    setTimeout(() => { element.style.transform = "scale(1)"; }, 200);
}

/* ====== TOGGLE MENU ====== */
function toggleMenu() {
    const menu = document.getElementById("sideMenu");
    if (menu) menu.classList.toggle("hidden");
}

/* ====== MODAL CONTROLS ====== */
function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.add("hidden");
}

/* ====== NOTES SYSTEM ====== */
function toggleNotes() {
    const modal = document.getElementById("notesModal");
    const textarea = document.getElementById("notesTextArea");
    if (!modal) return;

    modal.classList.toggle("hidden");

    if (!modal.classList.contains("hidden") && textarea) {
        const saved = localStorage.getItem("zeus_whot_notes") || "";
        textarea.value = saved;
    }
}

function saveNotes() {
    const textarea = document.getElementById("notesTextArea");
    if (textarea) {
        localStorage.setItem("zeus_whot_notes", textarea.value);
        showMessage("✅ Notes saved successfully!");
        closeModal("notesModal");
    }
}

/* ====== STATS ====== */
function showStats() {
    const modal = document.getElementById("statsModal");
    const content = document.getElementById("statsContent");
    if (!modal || !content) return;

    const winRate = gamesPlayed > 0 ? Math.round((gamesWon / gamesPlayed) * 100) : 0;
    const avgMoves = gamesPlayed > 0 ? Math.round(totalMovesThisGame / Math.max(1, gamesPlayed)) : 0;

    content.innerHTML = `
        <div class="stat-line"><span>🧠 Gaming IQ</span><span class="stat-value">${iqScore}</span></div>
        <div class="stat-line"><span>🎮 Games Played</span><span class="stat-value">${gamesPlayed}</span></div>
        <div class="stat-line"><span>🏆 Games Won</span><span class="stat-value">${gamesWon}</span></div>
        <div class="stat-line"><span>📈 Win Rate</span><span class="stat-value">${winRate}%</span></div>
        <div class="stat-line"><span>🎯 Smart Plays</span><span class="stat-value">${smartPlays}/${totalPlays}</span></div>
        <div class="stat-line"><span>⚡ Fastest Win</span><span class="stat-value">${fastestWin === Infinity ? '—' : fastestWin + ' moves'}</span></div>
        <div class="stat-line"><span>📊 Average Moves</span><span class="stat-value">${avgMoves}</span></div>
        <div class="stat-line"><span>🔄 Round</span><span class="stat-value">${roundNumber}</span></div>
    `;

    modal.classList.remove("hidden");
}

/* ====== ABOUT ====== */
function showAbout() {
    const modal = document.getElementById("aboutModal");
    if (modal) modal.classList.remove("hidden");
}

/* ====== CONTACT OWNER ====== */
function contactOwner() {
    showMessage("📞 Contact Zeus: +234 906 760 078");
}

/* ====== KEYBOARD SHORTCUTS ====== */
document.addEventListener("keydown", (e) => {
    if (e.key === "n" || e.key === "N") toggleNotes();
    if (e.key === "r" || e.key === "R") resetGame();
    if (e.key === "d" || e.key === "D") drawFromMarket();
    if (e.key === "m" || e.key === "M") toggleMenu();
    if (e.key === "Escape") {
        closeModal("winModal");
        closeModal("notesModal");
        closeModal("statsModal");
        closeModal("aboutModal");
        const menu = document.getElementById("sideMenu");
        if (menu && !menu.classList.contains("hidden")) menu.classList.add("hidden");
    }
});
