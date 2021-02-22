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
let currentPlayer = document.querySelector(".current-player");
let players = document.querySelectorAll(".player");

//scores
let score = document.querySelectorAll(".score");
let currentNumber = document.querySelectorAll(".current-number");
let dice = document.getElementById("dice");

function diceView(numberOnDice) {
  dice.style.visibility = "hidden";
  let dots = document.querySelectorAll(".dot");
  for (let dot of dots) dot.style.visibility = "hidden";
  function showDots(visibleDots) {
    dice.style.visibility = "visible";
    for (let i of visibleDots) dots[i].style.visibility = "visible";
  }
  switch (numberOnDice) {
    case 1:
      showDots([6]);
      break;
    case 2:
      showDots([0, 5]);
      break;
    case 3:
      showDots([2, 3, 6]);
      break;
    case 4:
      showDots([0, 2, 3, 5]);
      break;
    case 5:
      showDots([0, 2, 3, 5, 6]);
      break;
    case 6:
      showDots([0, 1, 2, 3, 4, 5]);
      break;
  }
}

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
  dice.value = 0;
  settings.count = 1;
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

rollDiceBtn.addEventListener("click", function () {
  let activePlayer = defineActivePlayer();
  let number = Math.trunc(Math.random() * 6 + 1);
  console.log(number);
  dice.value = number;
  diceView(number);
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
