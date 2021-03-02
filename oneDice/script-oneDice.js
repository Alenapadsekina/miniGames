"use strict";

//buttons
let rollDiceBtn = document.querySelector("#roll-dice");
let holdBtn = document.querySelector("#hold");
let newGameBtn = document.querySelector("#new-game");

// settings
let settings = {
  count: 1,
  adjustmentValue: 2,
  goal: 100,
  selected: "rgba(255, 255, 255, 0.6)",
  unSelected: "rgba(255, 255, 255, 0.2)",
  players: ["Player 1", "Player 2"],
};

// dots
let dotsOnDice = new Map([
  [1, {"top": "10%", "left": "10%"}],
  [2, {"top": "10%", "left": "40%"}],
  [3, {"top": "10%", "left": "70%"}],
  [4, {"top": "40%", "left": "40%"}],
  [5, {"top": "70%", "left": "10%"}],
  [6, {"top": "70%", "left": "40%"}],
  [7, {"top": "70%", "left": "70%"}],
]);

let currentPlayer = document.querySelector(".current-player");
let players = document.querySelectorAll(".player");

//scores
let score = document.querySelectorAll(".score");
let currentNumber = document.querySelectorAll(".current-number");
let dice = document.getElementById("dice");

let diceView = function(numberOnDice) {
  dice.style.visibility = "visible";
  let visibleDots = [];
  switch (numberOnDice) {
    case 0:
      return visibleDots = [];
    case 1:
      return visibleDots = [4];
    case 2:
      return visibleDots = [3, 5];
    case 3:
      return visibleDots = [1, 4, 7];
    case 4:
      return visibleDots = [1, 3, 5, 7];
    case 5:
      return visibleDots = [1, 3, 4, 5, 7];
    case 6:
      return visibleDots = [1, 2, 3, 5, 6, 7];
  }
}

let removeDots = function(){
  while (dice.firstChild) {
    dice.removeChild(dice.lastChild);
  }
}

let displayDots = function(arr, symbol){
  for (let [i, index] of arr.entries()){
    let cell = document.createElement("span");
    cell.textContent += symbol;
    cell.id = i;
    dice.appendChild(cell);
    cell.style.position = "absolute";
    cell.style.top = dotsOnDice.get(index).top;
    cell.style.left = dotsOnDice.get(index).left;
  }
}


rollDiceBtn.addEventListener("click", function () {
  removeDots();
  let activePlayer = defineActivePlayer();
  let number = Math.trunc(Math.random() * 6 + 1);
  console.log(number);
  let array = diceView(number);
  displayDots(array,"⚫");
  if (number != 1) {
    activePlayer.querySelector(".current-number").textContent =
      Number(activePlayer.querySelector(".current-number").textContent) +
      number;
    switchBtn(holdBtn, "on");
  } else {
    activePlayer.querySelector(".current-number").textContent = 0;
    newActivePlayer();
    activePlayer.style.backgroundColor = settings.unSelected;
    players[currentPlayer.textContent].style.backgroundColor =
      settings.selected;
  }
});

let switchBtn = function (button, position) {
  if (position == "on") {
    button.disabled = false;
    button.style = settings.selected;
  } else if (position == "off") {
    button.disabled = true;
    button.style = settings.unSelected;
  }
};

let startGame = function () {
  for (let i = 0; i < 2; i++) {
    score[i].textContent = 0;
    document.querySelectorAll(".current-number")[i].textContent = 0;
    // settings.players[i] = prompt(`Type Player ${i + 1}'s name`);
    settings.players[i] == ""
      ? (players[i].querySelector(".name").textContent = "PLAYER " + (i + 1))
      : (players[i].querySelector(".name").textContent = settings.players[i]);
  }
  diceView(0);
  settings.count = 1;
  dice.style.visibility = "hidden";
  switchBtn(holdBtn, "off");
  switchBtn(rollDiceBtn, "on");
  document.querySelector(".winner").textContent = "";
};

// start new game
newGameBtn.addEventListener("click", function () {
  startGame();
  let activePlayer = defineActivePlayer();
  activePlayer.style.backgroundColor = settings.selected;
});
// roll the dice
function defineActivePlayer() {
  let turn = currentPlayer.textContent;
  let activePlayer = players[turn];
  return activePlayer;
}
function newActivePlayer() {
  Number(currentPlayer.textContent) !== 0
    ? (currentPlayer.textContent = 0)
    : (currentPlayer.textContent = 1);
  switchBtn(holdBtn, "off");
}



// hold
function youWin(winner) {
  winner.style.backgroundColor = "rgba(0, 255, 250, 0.6)";
  winner.style.color = "rgba(255, 255, 255)";
  switchBtn(holdBtn, "off");
  switchBtn(rollDiceBtn, "off");
  document.querySelector(".winner").textContent = `${
    winner.querySelector(".name").textContent
  } wins!`;
}

holdBtn.addEventListener("click", function () {
  let activePlayer = defineActivePlayer();
  let currentScore = Number(
    activePlayer.querySelector(".current-number").textContent
  );
  let totalScore = Number(activePlayer.querySelector(".score").textContent);
  activePlayer.querySelector(".score").textContent = totalScore + currentScore;
  activePlayer.querySelector(".current-number").textContent = 0;
  if (
    Number(activePlayer.querySelector(".score").textContent) >= settings.goal
  ) {
    youWin(activePlayer);
  } else {
    newActivePlayer();
    activePlayer.style.backgroundColor = settings.unSelected;
    players[currentPlayer.textContent].style.backgroundColor =
      settings.selected;
  }
});
