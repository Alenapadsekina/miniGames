"use strict";
// buttons
let rollDiceBtn = document.querySelector("#roll-dice");
// let holdBtn = document.querySelector("#hold");
let newGameBtn = document.querySelector("#new-game");
// points
let score = document.querySelectorAll(".score");
let dices = document.querySelectorAll(".dice");
// settings
let settings = {
  count: 1,
  adjustmentValue: 2,
  goal: 100,
  selected: "rgba(255, 255, 255, 0.6)",
  unSelected: "rgba(255, 255, 255, 0.2)",
  killerCombo: [],
  winnerCombo: [],
  players: ["Alena", "Tiago"],
};

let currentPlayer = document.querySelector(".current-player");
let players = document.querySelectorAll(".player");

function diceView(diceId, numberOnDice) {
  let dots = document.querySelectorAll(".dot" + String(diceId));
  for (let i = 0; i < dots.length; i++) dots[i].style.visibility = "hidden";
  function showDots(array) {
    dices[diceId].visibility = "visible";
    for (let i = 0; i < array.length; i++)
      dots[array[i]].style.visibility = "visible";
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
  // switchBtn(holdBtn, "off");
  switchBtn(rollDiceBtn, "on");
  document.querySelector(".winner").textContent = "";
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
function defineActivePlayer() {
  let turn = currentPlayer.textContent;
  let activePlayer = players[turn];
  return activePlayer;
}
function newActivePlayer() {
  Number(currentPlayer.textContent) !== 0
    ? (currentPlayer.textContent = 0)
    : (currentPlayer.textContent = 1);
  // switchBtn(holdBtn, "off");
}

rollDiceBtn.addEventListener("click", function () {
  dices[0].style.visibility = "visible";
  dices[1].style.visibility = "visible";
  let activePlayer = defineActivePlayer();
  let number1 = Math.trunc(Math.random() * 6 + 1);
  console.log(number1);
  let number2 = Math.trunc(Math.random() * 6 + 1);
  console.log(number2);
  diceView(0, number1);
  diceView(1, number2);

  // if (number1 !== 1 && number2 !== 1) {
  //   if (number1 === number2) {
  //     activePlayer.querySelector(".current-number").textContent =
  //       Number(activePlayer.querySelector(".current-number").textContent) +
  //       number1 * 4;
  //   } else {
  //     activePlayer.querySelector(".current-number").textContent =
  //       Number(activePlayer.querySelector(".current-number").textContent) +
  //       number1 +
  //       number2;
  //   }
  //   switchBtn(holdBtn, "on");
  // } else {
  //   if (number1 == 1) {
  //     activePlayer.querySelector(".score").textContent = 0;
  //   }
  //   activePlayer.querySelector(".current-number").textContent = 0;

  newActivePlayer();
  activePlayer.style.backgroundColor = settings.unSelected;
  players[currentPlayer.textContent].style.backgroundColor = settings.selected;
  //   }
  // }
});

// hold

function displayPlayerResult(player, result) {
  if (result == "win") {
    player.style.backgroundColor = "rgba(0, 255, 250, 0.6)";
    document.querySelector(".winner").textContent = `${
      player.querySelector(".name").textContent
    } wins!`;
  } else if (result == "loose") {
    player.style.backgroundColor = "rgba(255, 0, 0, 0.6)";
    document.querySelector(".winner").textContent = `${
      player.querySelector(".name").textContent
    } lost! 🖕`;
  } else if (result == "lucky") {
    player.style.backgroundColor = "rgba(255, 200, 0, 0.7)";
    document.querySelector(".winner").textContent = `Lucky shot! ${
      player.querySelector(".name").textContent
    } wins!`;
  }
  player.style.color = "rgba(255, 255, 255)";
  // switchBtn(holdBtn, "off");
  switchBtn(rollDiceBtn, "off");
}
