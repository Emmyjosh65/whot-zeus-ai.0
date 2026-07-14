/* =====================================
   ZEUS IQ AI WHOT — NEURAL ENGINE
   Advanced AI with multiple strategies
   ===================================== */

const ZEUS_NAME = "Zeus Neural AI";

/* ====== AI DIFFICULTY LEVELS ====== */
const AI_DIFFICULTY = {
    EASY: "EASY",
    MEDIUM: "MEDIUM",
    HARD: "HARD",
    GENIUS: "GENIUS"
};

let zeusLevel = AI_DIFFICULTY.GENIUS;

function setZeusLevel(level) {
    zeusLevel = level;
}

/* ====== FIND VALID MOVES ====== */
function getZeusMoves() {
    return zeusHand.filter(card => isValidMove(card, currentCard));
}

/* ====== CARD POWER CALCULATOR ====== */
function calculateCardPower(card, considerOpponent = true) {
    let power = 0;

    // WHOT 20 — most powerful
    if (isWhot(card)) power += 200;

    // Special cards
    if (isPickTwo(card))     power += 80;
    if (isPickThree(card))   power += 100;
    if (isSuspension(card))  power += 70;
    if (isGeneralMarket(card)) power += 50;
    if (isHoldOn(card))      power += 30;

    // Higher numbers are better to dump
    power += card.number * 1.5;

    // Penalty: keep low cards that match opponent's likely shapes
    if (considerOpponent && card.number <= 3) {
        power -= 10;
    }

    // Bonus: play cards that match the current shape (forces opponent)
    if (currentCard && card.shape === currentCard.shape) {
        power += 15;
    }

    // Bonus: if opponent has many cards, play specials aggressively
    if (considerOpponent && zeusHand && playerHand) {
        if (playerHand.length >= 8 && (isPickTwo(card) || isPickThree(card))) {
            power += 40;
        }
        if (playerHand.length <= 2 && isSuspension(card)) {
            power += 60;
        }
    }

    return Math.round(power);
}

/* ====== CHOOSE BEST CARD (Smart Strategy) ====== */
function chooseZeusCard() {
    const possible = getZeusMoves();
    if (possible.length === 0) return null;

    // Sort by power descending
    possible.sort((a, b) => calculateCardPower(b, true) - calculateCardPower(a, true));

    // Genius: add slight randomness for unpredictability
    if (zeusLevel === AI_DIFFICULTY.GENIUS && possible.length > 1) {
        const topCards = possible.slice(0, Math.min(3, possible.length));
        return topCards[Math.floor(Math.random() * topCards.length)];
    }

    return possible[0];
}

/* ====== ZEUS STRATEGY EXECUTOR ====== */
function zeusStrategy() {
    const card = chooseZeusCard();
    if (card) {
        return { action: "PLAY", card };
    }
    return { action: "DRAW", card: null };
}

/* ====== WHOT SHAPE CHOOSER ====== */
function chooseWhotShape() {
    const shapes = {};
    zeusHand.forEach(card => {
        if (card.shape !== "WHOT") {
            shapes[card.shape] = (shapes[card.shape] || 0) + 1;
        }
    });

    let bestShape = "CIRCLE";
    let highest = 0;

    for (let shape in shapes) {
        if (shapes[shape] > highest) {
            highest = shapes[shape];
            bestShape = shape;
        }
    }

    // Also consider what player might NOT have
    if (zeusLevel === AI_DIFFICULTY.GENIUS || zeusLevel === AI_DIFFICULTY.HARD) {
        const allShapes = ["CIRCLE","TRIANGLE","SQUARE","CROSS","STAR"];
        let leastPlayerShape = "CIRCLE";
        let minCount = Infinity;

        allShapes.forEach(s => {
            const count = shapes[s] || 0;
            if (count < minCount && zeusHand.some(c => c.shape === s)) {
                minCount = count;
                leastPlayerShape = s;
            }
        });

        if (minCount < Infinity) bestShape = leastPlayerShape;
    }

    return bestShape;
}

/* ====== ZEUS THINKING MESSAGES ====== */
function zeusThinking() {
    const messages = [
        "🤖 Zeus is analyzing your strategy...",
        "🧠 Neural engine processing...",
        "⚡ Zeus calculating optimal move...",
        "♟️ Zeus is planning a counter...",
        "🎯 Targeting your weakness...",
        "📊 Computing probability matrix...",
        "🔮 Predicting your next move..."
    ];
    return messages[Math.floor(Math.random() * messages.length)];
}

/* ====== EXPORT ====== */
const ZeusAI = {
    name: ZEUS_NAME,
    chooseCard: chooseZeusCard,
    strategy: zeusStrategy,
    thinking: zeusThinking,
    chooseShape: chooseWhotShape,
    setLevel: setZeusLevel
};
