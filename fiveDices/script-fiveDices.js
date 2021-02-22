"use strict";
// buttons
let rollDiceBtn = document.querySelector("#roll-dice");
let nextBtn = document.querySelector("#next");
let newGameBtn = document.querySelector("#new-game");
// points
let score = document.querySelectorAll(".score");
let dices = document.querySelectorAll(".dice");
// settings
let settings = {
  count: 0,
  goal: 10,
  selected: "rgba(255, 255, 255, 0.6)",
  unSelected: "rgba(255, 255, 255, 0.2)",
  killerCombo: [],
  winnerCombo: [],
  players: ["Player 1", "Player 2"],
};

let currentPlayer = document.querySelector(".current-player");
let players = document.querySelectorAll(".player");

function diceView(diceId, numberOnDice) {
  let dots = document.querySelectorAll(".dot" + String(diceId));
  for (let dot of dots) dot.style.visibility = "hidden";
  function showDots(visibleDots) {
    dices[diceId].visibility = "visible";
    for (let dot of visibleDots) dots[dot].style.visibility = "visible";
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

let startGame = function () {
  for (let i = 0; i < 2; i++) {
    players[i].style.color = "rgba(0, 0, 0)";
    score[i].textContent = 0;
    document.querySelectorAll(".current-number")[i].textContent = 0;
    //    settings.players[i] = prompt(`Type Player ${i+1}'s name`);
    settings.players[i] == ""
      ? (players[i].querySelector(".name").textContent = "PLAYER " + (i + 1))
      : (players[i].querySelector(".name").textContent = settings.players[i]);
  }
  for (let [i, dice] of dices.entries()) {
    dice.style.visibility = "hidden";
    dice.value = 0;
    diceView(i, 0);
  }
  settings.count = 0;
  switchBtn(nextBtn, "off");
  switchBtn(rollDiceBtn, "on");
  document.querySelector(".winner").textContent = "";
  settings.killerCombo = randomArray(5);
  settings.winnerCombo = randomArray(5);
  if (settings.killerCombo == settings.winnerCombo) {
    settings.winnerCombo = randomArray(5);
  }
  console.log(settings.killerCombo);
  console.log(settings.winnerCombo);
};

// set killer combination
let randomArray = function (num) {
  let randomArray = [];
  for (let i = 0; i < num; i++) {
    randomArray.push(Math.trunc(Math.random() * 6 + 1));
  }
  return randomArray;
};

let switchBtn = function (button, position) {
  if (position == "on") {
    button.disabled = false;
    button.style = settings.selected;
  } else if (position == "off") {
    button.disabled = true;
    button.style = settings.unSelected;
  }
};
// start new game
newGameBtn.addEventListener("click", function () {
  startGame();
  let activePlayer = defineActivePlayer();
  activePlayer.style.backgroundColor = settings.selected;
});
// roll the dice

function newActivePlayer() {
  Number(currentPlayer.textContent) !== 0
    ? (currentPlayer.textContent = 0)
    : (currentPlayer.textContent = 1);
  switchBtn(nextBtn, "off");
}

function findDuplicates(arr) {
  arr.sort();
  let duplicates = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
  };
  for (let i of arr) duplicates[i] = duplicates[i] + 1;
  return Object.values(duplicates).sort();
}
// -------- TEST
document.querySelector(".test").addEventListener("click", function () {
  let colors = {
    1: "rgba(255, 255, 255)",
    2: "rgba(255, 0, 0)",
    // 3: "rgba(0, 0, 0)",
    // 4: "rgba(0, 255, 0)",
    0: "rgba(0, 0, 255)",
  };
  let colorId = Math.trunc(Math.random() * 3);
  //  console.log(colorId);
  for (let i of dices) {
    i.style.visibility = "visible";
    i.style.backgroundColor = colors[colorId];
  }
  let numbersArr = randomArray(5);
  let activePlayer = players[0];
  for (let [i, dice] of dices.entries()) {
    diceView(i, numbersArr[i]);
  }
  defineCombination(activePlayer, numbersArr, colorId);
});

function displayCombination(activePlayer, points) {
  activePlayer.querySelector(".current-number").textContent = Number(points);
  switch (points) {
    case 1:
      console.log("Nothing");
      break;
    case 2:
      console.log("Double");
      break;
    case 3:
      console.log("2 Doubles");
      break;
    case 4:
      console.log("Triple");
      break;
    case 5:
      console.log("Square");
      break;
    case 6:
      console.log("Full house");
      break;
    case 7:
      console.log("Straight (lower)");
      break;
    case 8:
      console.log("Straight (higher)");
      break;
    case 20:
      console.log("5 of a kind");
      break;
  }
}

// VERSION 2
let defineCombination = function (activePlayer, numbersArr) {
  let currentNumber = activePlayer.querySelector(".current-number");
  if (numbersArr.toString() == settings.killerCombo.toString()) {
    displayPlayerResult(activePlayer, "loose");
  } else if (numbersArr.toString() == settings.winnerCombo.toString()) {
    displayPlayerResult(activePlayer, "lucky");
  } else {
    if (numbersArr.sort().toString() == "1,2,3,4,5") {
      displayCombination(activePlayer, 7);
    } else if (numbersArr.sort().toString() == "2,3,4,5,6") {
      displayCombination(activePlayer, 8);
    } else {
      let dupl = findDuplicates(numbersArr);
      let maxDupl = dupl[dupl.length - 1];
      switch (maxDupl) {
        case 5:
          displayCombination(activePlayer, 20);
          break;
        case 4:
          displayCombination(activePlayer, 5);
          break;
        case 3:
          dupl[dupl.length - 2] == 2
            ? displayCombination(activePlayer, 6)
            : displayCombination(activePlayer, 4);
          break;
        case 2:
          dupl[dupl.length - 2] == 2
            ? displayCombination(activePlayer, 3)
            : displayCombination(activePlayer, 2);
          break;
        case 1:
          displayCombination(activePlayer, 1);
          break;
      }
    }
  }
};

function defineActivePlayer() {
  let turn = currentPlayer.textContent;
  let activePlayer = players[turn];
  return activePlayer;
}

rollDiceBtn.addEventListener("click", function () {
  let numbersArr = randomArray(5);
  let activePlayer = defineActivePlayer();
  for (let [i, dice] of dices.entries()) {
    dice.style.visibility = "visible";
    diceView(i, numbersArr[i]);
  }
  defineCombination(activePlayer, numbersArr);
  newActivePlayer();
  activePlayer.style.backgroundColor = settings.unSelected;
  players[currentPlayer.textContent].style.backgroundColor = settings.selected;
  settings.count += 1;
  if (settings.count % 2 == 0) {
    switchBtn(nextBtn, "on");
    switchBtn(rollDiceBtn, "off");
  }
});

// next

function displayPlayerResult(player, result) {
  player.style.color = "rgba(255, 255, 255)";
  switchBtn(nextBtn, "off");
  switchBtn(rollDiceBtn, "off");
  switch (result) {
    case "win":
      player.style.backgroundColor = "rgba(0, 255, 250, 0.6)";
      document.querySelector(".winner").textContent = `${
        player.querySelector(".name").textContent
      } wins!`;
      break;
    case "loose":
      player.querySelector(".score").textContent = 0;
      player.querySelector(".current-number").textContent = 0;
      player.style.backgroundColor = "rgba(255, 0, 0, 0.6)";
      document.querySelector(".winner").textContent = `${
        player.querySelector(".name").textContent
      } lost! 🖕`;
      break;
    case "lucky":
      player.style.backgroundColor = "rgba(255, 200, 0, 0.7)";
      document.querySelector(".winner").textContent = `Lucky shot! ${
        player.querySelector(".name").textContent
      } wins!`;
      break;
    case "draw":
      players[0].style.backgroundColor = "rgba(255, 200, 0, 0.7)";
      players[1].style.backgroundColor = "rgba(255, 200, 0, 0.7)";
      document.querySelector(".winner").textContent = `It's a draw!`;
      break;
  }
}

nextBtn.addEventListener("click", function () {
  let player1Score = Number(players[0].querySelector(".score").textContent);
  let player2Score = Number(players[1].querySelector(".score").textContent);
  for (let player of players) {
    let currentScore = Number(
      player.querySelector(".current-number").textContent
    );
    let totalScore = Number(player.querySelector(".score").textContent);
    player.querySelector(".score").textContent = totalScore + currentScore;
    player.querySelector(".current-number").textContent = 0;
  }
  for (let i = 0; i < players.length; i++) {
    let activePlayer = defineActivePlayer();
    if (player1Score >= settings.goal || player2Score >= settings.goal) {
      if (player1Score > player2Score) {
        displayPlayerResult(players[0], "win");
      } else if (player1Score > player2Score) {
        displayPlayerResult("draw");
      } else {
        displayPlayerResult(players[1], "win");
      }
    } else {
      newActivePlayer();
      activePlayer.style.backgroundColor = settings.unSelected;
      players[currentPlayer.textContent].style.backgroundColor =
        settings.selected;
      switchBtn(rollDiceBtn, "on");
    }
  }
});
