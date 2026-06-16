/* =========================
   ZEUS WHOT-AI GAME ENGINE
========================= */

let playerHand = [];
let zeusHand = [];

let currentCard = null;

let playerScore = 0;
let zeusScore = 0;

let playerTurn = true;

let gameOver = false;

/* =========================
   START GAME
========================= */

function startGame() {

    buildDeck();

    playerHand = dealCards(5);
    zeusHand = dealCards(5);

    currentCard = drawCard();

    gameOver = false;
    playerTurn = true;

    updateBoard();

    showMessage(
        "Game Started. Your Turn."
    );

    const loading =
    document.getElementById(
        "loadingScreen"
    );

    const game =
    document.getElementById(
        "gameContainer"
    );

    if(loading)
        loading.style.display = "none";

    if(game)
        game.classList.remove(
            "hidden"
        );
}

/* =========================
   PLAYER PLAY
========================= */

function playCard(index) {

    if(gameOver) return;

    if(!playerTurn) return;

    const card =
    playerHand[index];

    if(
        !isValidMove(
            card,
            currentCard
        )
    ) {

        showMessage(
            "Invalid Move"
        );

        return;
    }

    playerHand.splice(
        index,
        1
    );

    currentCard = card;

    applyCardEffect(
        card,
        "player"
    );

    updateBoard();

    checkWinner();

    if(gameOver) return;

    playerTurn = false;

    setTimeout(
        zeusTurn,
        1200
    );
}

/* =========================
   DRAW FROM MARKET
========================= */

function drawFromMarket() {

    if(gameOver) return;

    if(!playerTurn) return;

    playerHand.push(
        drawCard()
    );

    updateBoard();

    showMessage(
        "You drew a card."
    );

    playerTurn = false;

    setTimeout(
        zeusTurn,
        1000
    );
}

/* =========================
   ZEUS TURN
========================= */

function zeusTurn() {

    if(gameOver) return;

    const validCards =
    zeusHand.filter(card =>
        isValidMove(
            card,
            currentCard
        )
    );

    if(
        validCards.length === 0
    ) {

        zeusHand.push(
            drawCard()
        );

        showMessage(
            "Zeus drew from market."
        );

        updateBoard();

        playerTurn = true;

        return;
    }

    const chosenCard =
    validCards[0];

    const index =
    zeusHand.indexOf(
        chosenCard
    );

    zeusHand.splice(
        index,
        1
    );

    currentCard =
    chosenCard;

    applyCardEffect(
        chosenCard,
        "zeus"
    );

    updateBoard();

    showMessage(
        "Zeus played " +
        chosenCard.text
    );

    checkWinner();

    playerTurn = true;
}

/* =========================
   SPECIAL CARDS
========================= */

function applyCardEffect(
    card,
    owner
) {

    if(isPickTwo(card)) {

        if(owner === "player") {

            zeusHand.push(
                drawCard(),
                drawCard()
            );

            showMessage(
                "Zeus picked 2."
            );

        } else {

            playerHand.push(
                drawCard(),
                drawCard()
            );

            showMessage(
                "You picked 2."
            );

        }

    }

    if(isPickThree(card)) {

        if(owner === "player") {

            zeusHand.push(
                drawCard(),
                drawCard(),
                drawCard()
            );

            showMessage(
                "Zeus picked 3."
            );

        } else {

            playerHand.push(
                drawCard(),
                drawCard(),
                drawCard()
            );

            showMessage(
                "You picked 3."
            );

        }

    }

    if(isGeneralMarket(card)) {

        playerHand.push(
            drawCard()
        );

        zeusHand.push(
            drawCard()
        );

    }

    if(isSuspension(card)) {

        if(owner === "player") {

            showMessage(
                "Zeus suspended."
            );

        } else {

            showMessage(
                "You suspended."
            );

        }

    }

}

/* =========================
   CHECK WINNER
========================= */

function checkWinner() {

    if(
        playerHand.length === 0
    ) {

        playerScore++;

        gameOver = true;

        showWinner(
            "YOU WIN"
        );

        updateScores();

        return;
    }

    if(
        zeusHand.length === 0
    ) {

        zeusScore++;

        gameOver = true;

        showWinner(
            "ZEUS WINS"
        );

        updateScores();

        return;
    }

}

/* =========================
   NEW GAME
========================= */

function resetGame() {

    startGame();

}

/* =========================
   EVENTS
========================= */

document
.getElementById(
    "drawBtn"
)
.addEventListener(
    "click",
    drawFromMarket
);

document
.getElementById(
    "newGameBtn"
)
.addEventListener(
    "click",
    resetGame
);

document
.getElementById(
    "playAgainBtn"
)
.addEventListener(
    "click",
    () => {

        document
        .getElementById(
            "winModal"
        )
        .classList.add(
            "hidden"
        );

        resetGame();

    }
);

/* =========================
   START
========================= */

window.addEventListener(
    "load",
    startGame
);
