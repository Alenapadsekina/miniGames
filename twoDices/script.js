"use strict";
// buttons
let rollDiceBtn = document.querySelector("#roll-dice");
let holdBtn = document.querySelector("#hold");
let newGameBtn = document.querySelector("#new-game");
// points
let score = document.querySelectorAll(".score");
let dices = document.querySelectorAll(".dice");
// settings
let settings = {
  count: 1,
  adjustmentValue: 2,
  goal: 100,
  backgroundColor:{
    "selected": "rgba(255, 255, 255, 0.6)",
    "unSelected": "rgba(255, 255, 255, 0.2)",
    "win": "rgba(0, 255, 250, 0.6)",
    "lose": "rgba(255, 0, 0, 0.6)",
    "lucky":"rgba(255, 200, 0, 0.7)"},
  killerCombo: [],
  winnerCombo: [],
  players: ["اليونا", "الإسكندر"],
  dotsColors: ["🟠", "🔵"],
  total: [0, 0],
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


let diceView = function(numberOnDice) {
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


let removeDots = function(diceId){
  while (dices[diceId].firstChild) {
    dices[diceId].removeChild(dices[diceId].lastChild);
  }
}

let displayDots = function(diceId, arr, symbol){
  dices[diceId].style.visibility = "visible";
  for (let [i, index] of arr.entries()){
    let cell = document.createElement("span");
    cell.textContent += symbol;
    cell.id = i;
    dices[diceId].appendChild(cell);
    cell.style.position = "absolute";
    cell.style.top = dotsOnDice.get(index).top;
    cell.style.left = dotsOnDice.get(index).left;
  }
}

let displayTotal = function(){
let totalResultPanel = document.getElementById("total");
totalResultPanel.textContent = `${settings.total[0]}   -   ${settings.total[1]}`
}
displayTotal();

let startGame = function () {
  for (let i = 0; i < 2; i++) {
    score[i].textContent = 0;
    document.querySelectorAll(".current-number")[i].textContent = 0;
    dices[i].value = 0;
    dices[i].style.visibility = "hidden";
    diceView(i, 0);
    // settings.players[i] = prompt(`Type Player ${i + 1}'s name`);
    // settings.players[i] == ""
    //   ? (players[i].querySelector(".name").textContent = "PLAYER " + (i + 1))
    //   : (players[i].querySelector(".name").textContent = settings.players[i]);
    players[i].querySelector(".name").textContent = settings.players[i];
  }
  settings.count = 1;
  switchBtn(holdBtn, "off");
  switchBtn(rollDiceBtn, "on");
  document.querySelector(".winner").textContent = "";
  settings.killerCombo = randomNumber(2);
  settings.winnerCombo = randomNumber(2);
  if (settings.killerCombo == settings.winnerCombo) {
    settings.winnerCombo = randomNumber(2);
  }
  console.log(settings.killerCombo);
  console.log(settings.winnerCombo);
};
// let displayMessage = function(name) {

// } 

function displayPlayerResult(player, result) {
  if (result == "win") {
    player.style.backgroundColor = settings.backgroundColor.win;
    document.querySelector(".winner").textContent = `${
      player.querySelector(".name").textContent
    } wins!`;
    settings.total[Number(currentPlayer.textContent)] +=1;
    displayTotal();
  } else if (result == "lose") {
    player.style.backgroundColor = settings.backgroundColor.lose;
    document.querySelector(".winner").textContent = `${
      player.querySelector(".name").textContent
    } lost! 🖕`;
    Number(currentPlayer.textContent) == 0 ? settings.total[1] +=1 : settings.total[0] +=1;
    displayTotal();
  } else if (result == "lucky") {
    player.style.backgroundColor = settings.backgroundColor.lucky;
    document.querySelector(".winner").textContent = `Lucky shot! ${
      player.querySelector(".name").textContent
    } wins!`;
    settings.total[Number(currentPlayer.textContent)] +=1;
    displayTotal();
  }
  player.style.color = "rgba(255, 255, 255)";
  switchBtn(holdBtn, "off");
  switchBtn(rollDiceBtn, "off");
}

// set killer combination
let randomNumber = function (x) {
  let randomArray = [];
  for (let i = 0; i<x; i++) randomArray.push(Math.trunc(Math.random() * 6 + 1));
  return randomArray;
};
// random number adjustment
let numberOnDice = function () {
  let initialNumber = Math.trunc(Math.random() * 6 + 1);
  let adjustedNumber = 0;
  if (initialNumber == 1) {
    settings.count % settings.adjustmentValue == 0
      ? (adjustedNumber = Math.trunc(Math.random() * 5 + 2))
      : (adjustedNumber = initialNumber);
    console.log(
      `The number has been changed from ${initialNumber} to ${adjustedNumber}`
    );
    settings.count += 1;
  } else {
    adjustedNumber = initialNumber;
  }
  return adjustedNumber;
};

let switchBtn = function (button, position) {
  if (position == "on") {
    button.disabled = false;
    button.style = settings.backgroundColor.selected;
  } else if (position == "off") {
    button.disabled = true;
    button.style = settings.backgroundColor.unSelected;
  }
};
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

// start new game
newGameBtn.addEventListener("click", function () {
  startGame();
  let activePlayer = defineActivePlayer();
  activePlayer.style.backgroundColor = settings.backgroundColor.selected;
});

// roll the dice
rollDiceBtn.addEventListener("click", function () {
  let activePlayer = defineActivePlayer();
  for ( let i = 0; i < 2; i++){
  removeDots(i);
  dices[i].style.visibility = "visible";
  let number = numberOnDice();
  console.log(number);
  let array = diceView(number);
  displayDots(i, array, settings.dotsColors[i]);
  dices[i].value = number;
}
let number1 = dices[0].value;
let number2 = dices[1].value;
  if (
    number1 == settings.killerCombo[0] &&
    number2 == settings.killerCombo[1]
  ) {
    activePlayer.querySelector(".score").textContent = 0;
    activePlayer.querySelector(".current-number").textContent = 0;
    displayPlayerResult(activePlayer, "lose");
  } else if (
    number1 == settings.winnerCombo[0] &&
    number2 == settings.winnerCombo[1]
  ) {
    displayPlayerResult(activePlayer, "lucky");
  } else {
    if (number1 !== 1 && number2 !== 1) {
      if (number1 === number2) {
        activePlayer.querySelector(".current-number").textContent =
          Number(activePlayer.querySelector(".current-number").textContent) +
          number1 * 4;
      } else {
        activePlayer.querySelector(".current-number").textContent =
          Number(activePlayer.querySelector(".current-number").textContent) +
          number1 +
          number2;
      }
      switchBtn(holdBtn, "on");
    } else {
      if (number1 == 1) {
        activePlayer.querySelector(".score").textContent = 0;
      }
      activePlayer.querySelector(".current-number").textContent = 0;

      newActivePlayer();
      activePlayer.style.backgroundColor = settings.backgroundColor.unSelected;
      players[currentPlayer.textContent].style.backgroundColor =
        settings.backgroundColor.selected;
    }
  }
});

// hold
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
    displayPlayerResult(activePlayer, "win");
  } else {
    newActivePlayer();
    activePlayer.style.backgroundColor = settings.backgroundColor.unSelected;
    players[currentPlayer.textContent].style.backgroundColor =
      settings.backgroundColor.selected;
  }
});
