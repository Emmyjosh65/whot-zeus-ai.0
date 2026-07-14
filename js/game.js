/* =====================================
   ZEUS IQ AI WHOT — GAME ENGINE
   With Gaming IQ Calculation
   ===================================== */

let playerHand = [];
let zeusHand = [];
let currentCard = null;
let playerScore = 0;
let zeusScore = 0;
let playerTurn = true;
let gameOver = false;
let roundNumber = 1;
let currentShape = null;

// IQ tracking
let iqScore = 0;
let smartPlays = 0;
let totalPlays = 0;
let gamesPlayed = 0;
let gamesWon = 0;
let fastestWin = Infinity;
let totalMovesThisGame = 0;

/* ====== GAMING IQ CALCULATOR ====== */
function calculateGamingIQ() {
    if (totalPlays === 0) return 0;

    const accuracy = (smartPlays / totalPlays) * 100;
    const winRate = gamesPlayed > 0 ? (gamesWon / gamesPlayed) * 100 : 0;
    const efficiency = gamesPlayed > 0 ? Math.max(0, 100 - (totalMovesThisGame / Math.max(1, gamesPlayed))) : 0;

    // IQ formula
    let baseIQ = Math.round(
        (accuracy * 0.4) +
        (winRate * 0.35) +
        (efficiency * 0.25)
    );

    return Math.min(200, Math.max(0, baseIQ));
}

/* ====== EVALUATE PLAY QUALITY ====== */
function evaluatePlayQuality(card, isPlayer) {
    if (!card || !currentCard) return 0;

    let quality = 0;

    // Playing WHOT is always smart
    if (isWhot(card)) quality += 30;

    // Playing special cards strategically
    if ((isPickTwo(card) || isPickThree(card))) {
        if (isPlayer && zeusHand.length > playerHand.length) quality += 20;
        else quality += 10;
    }

    // Forcing opponent with suspension when they have few cards
    if (isSuspension(card)) {
        if (isPlayer && zeusHand.length <= 3) quality += 25;
        else if (!isPlayer && playerHand.length <= 3) quality += 25;
    }

    // General market when opponent has more cards
    if (isGeneralMarket(card)) {
        if (isPlayer && zeusHand.length > playerHand.length) quality += 15;
    }

    // Matching shape is generally good
    if (currentCard && card.shape === currentCard.shape) quality += 10;

    return quality;
}

/* ====== START GAME ====== */
function startGame() {
    buildDeck();

    playerHand = dealCards(5);
    zeusHand = dealCards(5);

    currentCard = drawCard();
    currentShape = currentCard ? currentCard.shape : null;

    gameOver = false;
    playerTurn = true;
    totalMovesThisGame = 0;

    updateBoard();
    showMessage("🎮 Game Started. Your Turn.");

    // Hide loading, show game
    const loading = document.getElementById("loadingScreen");
    const game = document.getElementById("gameContainer");

    if (loading) {
        loading.style.display = "none";
    }
    if (game) {
        game.classList.remove("hidden");
    }

    document.getElementById("roundDisplay").textContent = `ROUND ${roundNumber}`;
    updateIQDisplay();
    updateScores();
}

/* ====== PLAYER PLAY ====== */
function playCard(index) {
    if (gameOver || !playerTurn) return;

    const card = playerHand[index];
    if (!isValidMove(card, currentCard)) {
        showMessage("❌ Invalid Move! Match shape or number.");
        return;
    }

    totalMovesThisGame++;
    totalPlays++;

    const quality = evaluatePlayQuality(card, true);
    if (quality >= 15) smartPlays++;

    playerHand.splice(index, 1);
    currentCard = card;
    currentShape = card.shape;

    // Handle WHOT 20 — player chooses shape
    if (isWhot(card)) {
        const chosen = prompt("Choose a shape: CIRCLE, TRIANGLE, SQUARE, CROSS, STAR", "CIRCLE");
        if (chosen && ["CIRCLE","TRIANGLE","SQUARE","CROSS","STAR"].includes(chosen.toUpperCase())) {
            currentShape = chosen.toUpperCase();
            showMessage(`⚡ You changed shape to ${currentShape}!`);
        } else {
            currentShape = "CIRCLE";
        }
    }

    applyCardEffect(card, "player");
    updateBoard();
    iqScore = calculateGamingIQ();
    updateIQDisplay();

    checkWinner();
    if (gameOver) return;

    playerTurn = false;
    setTimeout(zeusTurn, 1000);
}

/* ====== DRAW FROM MARKET ====== */
function drawFromMarket() {
    if (gameOver || !playerTurn) return;

    totalMovesThisGame++;
    const drawn = drawCard();
    playerHand.push(drawn);

    updateBoard();
    showMessage(`📥 You drew a card.`);
    iqScore = calculateGamingIQ();
    updateIQDisplay();

    playerTurn = false;
    setTimeout(zeusTurn, 800);
}

/* ====== ZEUS TURN ====== */
function zeusTurn() {
    if (gameOver) return;

    showMessage(zeusThinking());

    setTimeout(() => {
        if (gameOver) return;

        const validCards = zeusHand.filter(card => isValidMove(card, currentCard));

        if (validCards.length === 0) {
            zeusHand.push(drawCard());
            showMessage("🤖 Zeus drew from market.");
            updateBoard();
            playerTurn = true;
            return;
        }

        const chosenCard = chooseZeusCard() || validCards[0];
        const index = zeusHand.indexOf(chosenCard);
        zeusHand.splice(index, 1);
        currentCard = chosenCard;
        currentShape = chosenCard.shape;

        // Zeus chooses WHOT shape
        if (isWhot(chosenCard)) {
            currentShape = chooseWhotShape();
            showMessage(`⚡ Zeus played WHOT and chose ${currentShape}!`);
        } else {
            showMessage(`🤖 Zeus played ${chosenCard.text}`);
        }

        applyCardEffect(chosenCard, "zeus");
        updateBoard();

        checkWinner();
        playerTurn = true;
    }, 800);
}

/* ====== APPLY CARD EFFECTS ====== */
function applyCardEffect(card, owner) {
    const opponent = owner === "player" ? "zeus" : "player";
    const opponentHand = opponent === "player" ? playerHand : zeusHand;
    const ownerName = owner === "player" ? "Zeus" : "You";

    if (isPickTwo(card)) {
        opponentHand.push(drawCard(), drawCard());
        showMessage(`📥 ${ownerName} picks 2 cards!`);
    }

    if (isPickThree(card)) {
        opponentHand.push(drawCard(), drawCard(), drawCard());
        showMessage(`📥 ${ownerName} picks 3 cards!`);
    }

    if (isGeneralMarket(card)) {
        playerHand.push(drawCard());
        zeusHand.push(drawCard());
        showMessage("🌐 General Market! Both draw 1.");
    }

    if (isSuspension(card)) {
        showMessage(`⏸ ${ownerName} is suspended!`);
        // In Whot, suspension means opponent loses a turn
        // Already handled by turn logic
    }

    if (isHoldOn(card)) {
        showMessage(`🛑 ${ownerName} plays Hold On!`);
    }
}

/* ====== CHECK WINNER ====== */
function checkWinner() {
    if (playerHand.length === 0) {
        playerScore++;
        gamesPlayed++;
        gamesWon++;
        gameOver = true;

        iqScore = calculateGamingIQ();
        const moves = totalMovesThisGame;
        if (moves < fastestWin) fastestWin = moves;

        updateScores();
        showWinner("🏆 YOU WIN!");
        return;
    }

    if (zeusHand.length === 0) {
        zeusScore++;
        gamesPlayed++;
        gameOver = true;

        iqScore = calculateGamingIQ();

        updateScores();
        showWinner("🤖 ZEUS WINS!");
        return;
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
            <div>🃏 Cards in Hand: ${playerHand.length}</div>
            <div>🎮 Total Games: ${gamesPlayed}</div>
        `;
    }

    if (modal) modal.classList.remove("hidden");
}

/* ====== RESET GAME ====== */
function resetGame() {
    roundNumber++;
    startGame();
}

/* ====== UPDATE IQ DISPLAY ====== */
function updateIQDisplay() {
    const el = document.getElementById("iqDisplay");
    if (el) el.textContent = `IQ: ${iqScore}`;
}

/* ====== EVENT BINDINGS ====== */
document.addEventListener("DOMContentLoaded", () => {
    const drawBtn = document.getElementById("drawBtn");
    const newGameBtn = document.getElementById("newGameBtn");
    const playAgainBtn = document.getElementById("playAgainBtn");

    if (drawBtn) drawBtn.addEventListener("click", drawFromMarket);
    if (newGameBtn) newGameBtn.addEventListener("click", resetGame);
    if (playAgainBtn) {
        playAgainBtn.addEventListener("click", () => {
            closeModal("winModal");
            resetGame();
        });
    }
});

window.addEventListener("load", startGame);
