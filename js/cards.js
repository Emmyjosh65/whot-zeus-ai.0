/* =========================
   ZEUS WHOT-AI CARD SYSTEM
========================= */

const CARD_SHAPES = {
    CIRCLE: "●",
    TRIANGLE: "▲",
    SQUARE: "■",
    CROSS: "✚",
    STAR: "★",
    WHOT: "WHOT"
};

let deck = [];

/*
WHOT CARD STRUCTURE

{
   shape: "CIRCLE",
   number: 1,
   text: "● 1"
}
*/

function createCard(shape, number) {
    return {
        shape,
        number,
        text: shape === "WHOT"
            ? "WHOT 20"
            : `${CARD_SHAPES[shape]} ${number}`
    };
}

/* =========================
   CREATE FULL WHOT DECK
========================= */

function buildDeck() {

    deck = [];

    const normalNumbers = [
        1,2,3,4,5,6,7,8,9,10,
        11,12,13,14
    ];

    const shapes = [
        "CIRCLE",
        "TRIANGLE",
        "SQUARE",
        "CROSS",
        "STAR"
    ];

    shapes.forEach(shape => {

        normalNumbers.forEach(number => {

            deck.push(
                createCard(shape, number)
            );

        });

    });

    /* WHOT 20 SPECIALS */

    for(let i = 0; i < 5; i++) {

        deck.push(
            createCard("WHOT",20)
        );

    }

    shuffleDeck();

    return deck;
}

/* =========================
   SHUFFLE
========================= */

function shuffleDeck() {

    for(let i = deck.length - 1; i > 0; i--) {

        const j = Math.floor(
            Math.random() * (i + 1)
        );

        [deck[i], deck[j]] =
        [deck[j], deck[i]];
    }

}

/* =========================
   DRAW CARD
========================= */

function drawCard() {

    if(deck.length === 0) {

        buildDeck();

    }

    return deck.pop();
}

/* =========================
   DEAL HAND
========================= */

function dealCards(amount = 5) {

    const hand = [];

    for(let i = 0; i < amount; i++) {

        hand.push(
            drawCard()
        );

    }

    return hand;
}

/* =========================
   CHECK VALID MOVE
========================= */

function isValidMove(card, currentCard) {

    if(!currentCard) return true;

    if(card.shape === "WHOT")
        return true;

    if(card.number === currentCard.number)
        return true;

    if(card.shape === currentCard.shape)
        return true;

    return false;
}

/* =========================
   SPECIAL RULES
========================= */

function isPickTwo(card) {
    return card.number === 2;
}

function isPickThree(card) {
    return card.number === 5;
}

function isSuspension(card) {
    return card.number === 8;
}

function isHoldOn(card) {
    return card.number === 1;
}

function isGeneralMarket(card) {
    return card.number === 14;
}

function isWhot(card) {
    return card.shape === "WHOT";
}

/* =========================
   CARD DESCRIPTION
========================= */

function getCardDescription(card) {

    if(isPickTwo(card))
        return "Pick Two";

    if(isPickThree(card))
        return "Pick Three";

    if(isSuspension(card))
        return "Suspension";

    if(isHoldOn(card))
        return "Hold On";

    if(isGeneralMarket(card))
        return "General Market";

    if(isWhot(card))
        return "WHOT";

    return "Normal";
}

/* =========================
   STARTUP
========================= */

buildDeck();
