/* =========================
   ZEUS WHOT-AI BRAIN
   Computer Player Logic
========================= */


const ZEUS_NAME = "Zeus WHOT-AI";


/* =========================
   FIND POSSIBLE MOVES
========================= */

function getZeusMoves(){

    return zeusHand.filter(card => {

        return isValidMove(
            card,
            currentCard
        );

    });

}


/* =========================
   ZEUS CARD VALUE SYSTEM
   Higher score = Better card
========================= */

function calculateCardPower(card){

    let power = 0;


    // WHOT 20 is very powerful
    if(isWhot(card)){
        power += 100;
    }


    // Special cards
    if(isPickTwo(card)){
        power += 50;
    }


    if(isPickThree(card)){
        power += 60;
    }


    if(isSuspension(card)){
        power += 40;
    }


    if(isGeneralMarket(card)){
        power += 30;
    }


    if(isHoldOn(card)){
        power += 20;
    }


    // Keep high numbers
    power += card.number;


    return power;

}



/* =========================
   CHOOSE BEST CARD
========================= */


function chooseZeusCard(){

    let possible =
    getZeusMoves();


    if(
        possible.length === 0
    ){

        return null;

    }


    let best =
    possible[0];


    possible.forEach(card => {


        if(
            calculateCardPower(card)
            >
            calculateCardPower(best)
        ){

            best = card;

        }


    });


    return best;

}




/* =========================
   ZEUS STRATEGY
========================= */


function zeusStrategy(){

    let card =
    chooseZeusCard();


    if(card){

        return {

            action:"PLAY",

            card:card

        };

    }



    return {

        action:"DRAW",

        card:null

    };

}





/* =========================
   WHOT SHAPE CHOICE
   When Zeus plays WHOT 20
========================= */


function chooseWhotShape(){


    let shapes = {};


    zeusHand.forEach(card=>{


        if(card.shape !== "WHOT"){

            if(!shapes[card.shape]){

                shapes[card.shape]=0;

            }


            shapes[card.shape]++;

        }


    });



    let bestShape = "CIRCLE";

    let highest = 0;



    for(let shape in shapes){


        if(
            shapes[shape] > highest
        ){

            highest =
            shapes[shape];

            bestShape =
            shape;

        }

    }


    return bestShape;


}





/* =========================
   ZEUS THINKING MESSAGE
========================= */


function zeusThinking(){

    const messages = [

        "Zeus is thinking...",
        "Zeus is checking cards...",
        "Zeus is planning a move...",
        "Zeus WHOT-AI calculating..."

    ];


    return messages[
        Math.floor(
            Math.random()
            *
            messages.length
        )
    ];

}



/* =========================
   AI DIFFICULTY
========================= */


let zeusLevel = "HARD";


function setZeusLevel(level){

    zeusLevel = level;

}



/* =========================
   EXPORT AI DATA
========================= */


const ZeusAI = {

    name:ZEUS_NAME,

    chooseCard:
    chooseZeusCard,

    strategy:
    zeusStrategy,

    thinking:
    zeusThinking,

    chooseShape:
    chooseWhotShape

};
