const symbols = ["CIRCLE","TRIANGLE","CROSS","SQUARE","STAR"];

const specialCards = {
  1: "HOLD ON",
  2: "PICK 2",
  5: "PICK 3",
  8: "SUSPEND",
  14: "GENERAL"
};

let player = [];
let ai = [];
let pile = null;
let pickStack = 0;

// generate full WHOT-like card
function randCard() {
  const num = Math.floor(Math.random() * 14) + 1;
  const shape = symbols[Math.floor(Math.random() * symbols.length)];
  return { num, shape };
}

// init game
function init() {
  for (let i = 0; i < 5; i++) {
    player.push(randCard());
    ai.push(randCard());
  }
  pile = randCard();
  render();
}

function match(card) {
  return card.num === pile.num || card.shape === pile.shape || card.num === 20;
}

// PLAY CARD (PLAYER)
function play(i) {
  let card = player[i];

  if (!match(card)) {
    msg("Invalid move");
    return;
  }

  pile = card;
  applyEffect(card, "player");

  player.splice(i, 1);
  msg("You played " + card.num);
  render();
  checkWin();

  setTimeout(aiTurn, 700);
}

// ZEUS AI BRAIN
function aiTurn() {
  let index = ai.findIndex(match);

  if (index === -1) {
    ai.push(randCard());
    msg("ZEUS draws");
    render();
    return;
  }

  let card = ai[index];
  pile = card;
  applyEffect(card, "ai");

  ai.splice(index, 1);
  msg("ZEUS played " + card.num);

  render();
  checkWin();
}

// SPECIAL RULES (REAL WHOT LOGIC)
function applyEffect(card, who) {
  if (card.num === 2) pickStack += 2;
  if (card.num === 5) pickStack += 3;

  if (card.num === 8) {
    msg(who + " suspended next player");
  }

  if (card.num === 1) {
    msg("Hold on activated");
  }

  if (card.num === 14) {
    msg("General Market!");
    player.push(randCard());
    ai.push(randCard());
  }
}

// DRAW
document.getElementById("draw").onclick = () => {
  player.push(randCard());
  msg("You drew");
  render();
  setTimeout(aiTurn, 700);
};

// RENDER
function render() {
  document.getElementById("pile").innerText =
    pile.num + " " + pile.shape;

  let p = document.getElementById("playerCards");
  let a = document.getElementById("aiCards");

  p.innerHTML = "";
  a.innerHTML = "";

  player.forEach((c, i) => {
    let d = document.createElement("div");
    d.className = "card";
    d.innerText = c.num;
    d.onclick = () => play(i);
    p.appendChild(d);
  });

  ai.forEach(() => {
    let d = document.createElement("div");
    d.className = "card";
    d.innerText = "AI";
    a.appendChild(d);
  });
}

// WIN CHECK
function checkWin() {
  if (player.length === 0) {
    alert("YOU WIN");
    location.reload();
  }
  if (ai.length === 0) {
    alert("ZEUS WINS");
    location.reload();
  }
}

// MESSAGE
function msg(t) {
  document.getElementById("msg").innerText = t;
}

init();
