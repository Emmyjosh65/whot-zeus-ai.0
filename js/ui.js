/* =========================
   ZEUS WHOT-AI UI SYSTEM
   Controls Game Display
========================= */


/* =========================
   UPDATE EVERYTHING ON BOARD
========================= */

function updateBoard(){

    displayPlayerCards();

    displayZeusCards();

    displayCurrentCard();

    updateTurn();

    updateCardCounts();

}



/* =========================
   DISPLAY PLAYER CARDS
========================= */

function displayPlayerCards(){

    const area =
    document.getElementById(
        "playerHand"
    );


    if(!area) return;


    area.innerHTML = "";


    playerHand.forEach((card,index)=>{


        let div =
        document.createElement(
            "div"
        );


        div.className =
        "card";


        div.innerHTML =
        card.text;


        div.onclick = function(){

            playCard(index);

        };


        area.appendChild(div);


    });


}




/* =========================
   DISPLAY ZEUS CARDS
========================= */

function displayZeusCards(){

    const area =
    document.getElementById(
        "zeusHand"
    );


    if(!area) return;


    area.innerHTML = "";


    zeusHand.forEach(()=>{


        let div =
        document.createElement(
            "div"
        );


        div.className =
        "card";


        div.innerHTML =
        "ZEUS";


        area.appendChild(div);


    });


}




/* =========================
   DISPLAY CURRENT CARD
========================= */

function displayCurrentCard(){

    const cardBox =
    document.getElementById(
        "currentCard"
    );


    if(!cardBox) return;


    if(currentCard){

        cardBox.innerHTML =
        currentCard.text;

    }


}



/* =========================
   UPDATE CARD COUNTS
========================= */

function updateCardCounts(){

    let zeusCount =
    document.getElementById(
        "zeusCardCount"
    );


    if(zeusCount){

        zeusCount.innerHTML =
        "Cards: "
        +
        zeusHand.length;

    }


}



/* =========================
   TURN DISPLAY
========================= */

function updateTurn(){

    let turn =
    document.getElementById(
        "turnIndicator"
    );


    if(!turn) return;


    if(playerTurn){

        turn.innerHTML =
        "Your Turn";

    }
    else{

        turn.innerHTML =
        "Zeus Thinking...";

    }

}




/* =========================
   GAME MESSAGE
========================= */

function showMessage(text){

    const box =
    document.getElementById(
        "messageBox"
    );


    if(box){

        box.innerHTML =
        text;

    }

}



/* =========================
   WIN SCREEN
========================= */

function showWinner(text){


    const modal =
    document.getElementById(
        "winModal"
    );


    const title =
    document.getElementById(
        "winnerText"
    );


    if(title){

        title.innerHTML =
        text;

    }


    if(modal){

        modal.classList.remove(
            "hidden"
        );

    }


}




/* =========================
   SCORE UPDATE
========================= */

function updateScores(){

    let player =
    document.getElementById(
        "playerScore"
    );


    let zeus =
    document.getElementById(
        "zeusScore"
    );


    if(player){

        player.innerHTML =
        playerScore;

    }


    if(zeus){

        zeus.innerHTML =
        zeusScore;

    }


}




/* =========================
   CARD ANIMATION
========================= */

function animateCard(element){

    element.style.transform =
    "scale(1.1)";


    setTimeout(()=>{

        element.style.transform =
        "scale(1)";

    },200);

}



/* =========================
   ZEUS MESSAGE STYLE
========================= */

function zeusMessage(){

    let messages = [

        "Zeus WHOT-AI is thinking",
        "Zeus is calculating",
        "Zeus is choosing a card"

    ];


    return messages[
        Math.floor(
            Math.random()
            *
            messages.length
        )
    ];

}
