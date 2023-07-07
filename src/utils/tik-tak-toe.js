const tikTakToeCells = document.querySelectorAll("#js-tik-tak-toe-cell");
const tikTakToeResult = document.querySelector("#tik-tak-toe-result");
const isChoosingDisplay = document.querySelector("#tik-tak-toe-choosing");

const player1Display = {
  name: document.querySelector("#js-player1-name"),
  score: document.querySelector("#js-player1-score"),
  history: document.querySelector("#js-player1-history"),
};

const player2Display = {
  name: document.querySelector("#js-player2-name"),
  score: document.querySelector("#js-player2-score"),
  history: document.querySelector("#js-player2-history"),
};

const players = {
  player1: JSON.parse(localStorage.getItem("player1")) || {
    name: "Player1",
    score: 0,
    history: [],
  },
  player2: JSON.parse(localStorage.getItem("player2")) || {
    name: "Player2",
    score: 0,
    history: [],
  },
};

const winCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8], // Rows
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8], // Columns
  [0, 4, 8],
  [2, 4, 6], // Diagonals
];

let gameIsActive = true;

let xIsChoosing = true;
let oIsChoosing = false;

let xArea = [];
let oArea = [];
let pickCount = 0;
let winner;

renderPlayers();

tikTakToeCells.forEach((val, i) =>
  val.addEventListener("click", () => {
    handleClickOnCells(val, i);
  })
);

function handleClickOnCells(cell, i) {
  if (cell.innerHTML !== "") {
    return; // Cell already filled, return without making any changes
  }

  if (!gameIsActive) {
    return;
  }
  if (xIsChoosing) {
    cell.innerHTML = `<i class="fa-solid fa-xmark"></i>`;
    pickCount++;
    console.log(pickCount);
    xArea.push(i);
    if (checkWin(xArea)) {
      winner = players.player1;
      checkResult(winner);
      xIsChoosing = true;
      oIsChoosing = false;
    }
    xIsChoosing = false;
    oIsChoosing = true;
  } else if (oIsChoosing) {
    cell.innerHTML = `<i class="fa-solid fa-o"></i>`;
    pickCount++;
    console.log(pickCount);

    oArea.push(i);
    if (checkWin(oArea)) {
      winner = players.player2;
      checkResult(winner);
      xIsChoosing = false;
      oIsChoosing = true;
    }
    xIsChoosing = true;
    oIsChoosing = false;
  }
  if (pickCount === 9) {
    checkResult("tie");
  }
  renderPlayers();
}

function checkWin(playerArea) {
  return winCombinations.some((combination) => {
    return combination.every((cell) => playerArea.includes(cell));
  });
}

function renderPlayers() {
  if (oIsChoosing) {
    isChoosingDisplay.innerHTML = `<i class="fa-solid fa-o"></i>`;
  } else if (xIsChoosing) {
    isChoosingDisplay.innerHTML = `<i class="fa-solid fa-xmark"></i>`;
  }

  player1Display.history.innerHTML = "";
  player2Display.history.innerHTML = "";

  player1Display.name.innerHTML = `${players.player1.name}<i class="fa-solid fa-xmark"></i>`;
  player1Display.score.innerHTML = `Score: ${players.player1.score}`;
  players.player1.history.forEach((history) => {
    let historyElement = document.createElement("p");
    historyElement.innerText = history;
    player1Display.history.appendChild(historyElement);
  });

  player2Display.name.innerHTML = `${players.player2.name}<i class="fa-solid fa-o"></i>`;
  player2Display.score.innerHTML = `Score: ${players.player2.score}`;
  players.player2.history.forEach((history) => {
    let historyElement = document.createElement("p");
    historyElement.innerText = history;
    player2Display.history.appendChild(historyElement);
  });
}

function checkResult(winner) {
  if (winner === "tie") {
    winner = null;
    tikTakToeResult.innerText = `DRAW`;
    gameIsActive = false;
    setTimeout(() => {
      endOfRound(winner);
      renderPlayers();
    }, 2000);
  }
  tikTakToeResult.innerText = `${winner.name} Won`;

  gameIsActive = false;
  setTimeout(() => {
    endOfRound(winner);
    renderPlayers();
  }, 2000);
}

function endOfRound(winner) {
  pickCount = 0;
  xArea = [];
  oArea = [];
  tikTakToeCells.forEach((cell) => {
    cell.innerHTML = "";
  });
  gameIsActive = true;
  winner.score++;
  winner.history.push("win");
  localStorage.setItem("player1", JSON.stringify(players.player1));
  localStorage.setItem("player2", JSON.stringify(players.player2));
}
