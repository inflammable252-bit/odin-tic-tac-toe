let player1 = createPlayer("Player 1", "X");
let player2 = createPlayer("Player 2", "O");
let currentGame = Game();

function createPlayer(name, icon) { //factory with player functions
let score = 0;
const increaseScore = () => {score++;}
const getScore = () => score;
const resetScore = () => score = 0;
return player = { name, icon, getScore, increaseScore, resetScore } 
}

function Board() { // factory with functions related to checking and modifying the board
  const board = []
  let errorMessage = "";

  for (let r=0; r<3; r++) {
    board[r] = [];
    for (let c=0; c<3; c++) {
        board[r].push("#")
      }
    }
  
  function toIndex(row, col) {
    let rowIndex = (row - 1) || 0;
    let colIndex = (col - 1) || 0;
    return [rowIndex, colIndex]
  }
 
  function checkCell(row, col) {
    if (checkInput(row, col) && checkIcon(row, col)) {
      return true
    }
    else {
      return false
    }
  }

  function checkInput(row, col) {
    if ((row>0) && (col>0) && ((row<=3) && (col<=3))) {
      [row, col] = toIndex(row, col);
      return true
    }
    else {
      this.errorMessage = "Row and column value must be between 1-3.";
      return false;
    }
  }

  function checkIcon(row, col) {
    [row, col] = toIndex(row, col)
    if ((board[row])[col] === "#") {
      return true
    }    else {
      setError(`Space occupied: Row ${row+1}, Column ${col+1}`);
      return false
    }
  }
  function selectCell(row, col, icon) {
    [row, col] = toIndex(row, col);
    // console.log(`Row Index: ${row}, Col Index: ${col}`);
    (board[row])[col] = icon;
  }

  function getRemainingCells() {
    let remainingIndices = [];
    for (row of board) {
      row.forEach((item, index) => {
        if (item==="#") {
          const rowIndex = board.indexOf(row)
          remainingIndices.push([rowIndex, index])
        }
     })
    }
    return remainingIndices
  }
  function setError(error) {
    errorMessage = error
  }
  const getError = function() {
    return errorMessage
  }
  return { board, checkCell, selectCell, setError, getError, getRemainingCells }
}

function Game() { // factory with functions to retrieve, request, and interpret interactions with board
  const currentBoard = Board();
  let currentPlayer = randomizeStart();
  let turn = 1;
  let winStatus = "";

  function randomizeStart() {
    let playerNumber = Math.floor(Math.random()*2)+1;
    return playerNumber === 1 ? player1 : player2;
  }
  function next(row, col) { // refactor or do differently next time: next() should just take an index vs converting in all other functions
    console.log(`Turn: ${turn}`)
    console.log(`current Player: ${currentPlayer.name}, ${currentPlayer.icon}`);
    if (currentBoard.checkCell(row, col)) {
        currentBoard.selectCell(row, col, currentPlayer.icon);
        displayBoard()
        winStatus = returnWin(checkWin(row, col, currentPlayer.icon))
        if (winStatus) {
          console.log(winStatus);
          currentBoard.setError("Start a new round!");
          console.log(currentBoard.getError());
          winStatus !== "Tie!" && currentPlayer.increaseScore()
        }
        turn++
        currentPlayer = (currentPlayer===player1) ? player2 : player1;
      }
      else {
        console.error(currentBoard.getError())
        displayBoard()
        return
      }
  }

  function checkWin(row,col,icon) {
  row -= 1;
  col -= 1;
  let board = currentGame.currentBoard.board;
    if ((board[row]).every((cell) => cell===icon)) {
      return "row";
    }
    if (board.every((row) => row[col] === icon)) {
      return "column"
    }
    if (([(board[0])[0], (board[1])[1], (board[2])[2]]).every((cell) => cell===icon)) {
      return "cross"
    }
    if (([(board[0])[2], (board[1])[1], (board[2])[0]]).every((cell) => cell===icon)) {
      return "cross"
    }
    if ((currentGame.returnRemaining().length===0)) {
      return "tie"
    }
  }

  function returnWin(winCondition) {
    switch (winCondition) {
      case "row":
        return `Row of ${currentPlayer.icon}. ${currentPlayer.name} wins!`
        break;
      case "column":
        return `Column of ${currentPlayer.icon}. ${currentPlayer.name} wins!`
        break;
      case "cross":
        return `Diagonal line of ${currentPlayer.icon}. ${currentPlayer.name} wins!`
        break;
      case "tie":
        return `Tie!`
    }
  }

  let nextChoiceRow;
  let nextChoiceCol;
  function getRandomChoice() {
    const remainingArr = returnRemaining();
    const randomizer = Math.floor(Math.random() * remainingArr.length);
    const randomFromArr = remainingArr[randomizer];
    let [row, col] = randomFromArr || [0,0];
    nextChoiceRow = row + 1;
    nextChoiceCol = col + 1;
    console.log(`*Random item ${randomFromArr} is selected at index ${randomizer}. Row ${nextChoiceRow} and col ${nextChoiceCol} are returned for .next().*`)
  }

  function autoNext() {
    if ((winStatus) || returnRemaining().length === 0) {
      return
    }
    getRandomChoice()
    next(nextChoiceRow,nextChoiceCol)
  }

  const displayBoard = function() {
    console.table(currentBoard.board)
  };
  const returnRemaining = function() {
    return currentBoard.getRemainingCells();
  }
  const returnWinStatus = function() {
    return winStatus
  }
  function returnCurrentPlayer() {
    return currentPlayer
  }

  return { currentBoard, displayBoard, returnCurrentPlayer, next, returnRemaining, autoNext, returnWinStatus }
}

function Play() { //uses Game() functions to play a round and display to the DOM
  let numberOfCells = currentGame.returnRemaining().length;
  function autoRound() {
    if (currentGame.returnWinStatus()) {
      currentGame.currentBoard.setError("Start a new round!");
      console.log(currentGame.currentBoard.getError());
    }
    while (numberOfCells > 0) {
      currentGame.autoNext()
      if (currentGame.returnWinStatus()) numberOfCells = 0;
      else numberOfCells = currentGame.returnRemaining().length;
      }
      // console.log(numberOfCells)
    updateBoard()
  }

  function displayTotal() {
   return `${player1.name}, ${player1.icon}: ${player1.getScore()}, ${player2.name}, ${player2.icon}: ${player2.getScore()}`
  }
  function checkGameOver() {
    return currentGame.returnWinStatus();
  }
  function newRound() {
    currentGame = Game();
    updateBoard()
    currentGame.displayBoard()
  }
function restartGame() {
    player1.resetScore();
    player2.resetScore();
    currentGame.currentBoard = Board();
    newRound();
  }
  const message = document.querySelector("p.system-msg")
  function updateMsg() {
    message.textContent = currentGame.returnWinStatus() || currentGame.currentBoard.getError()
  }
  function clearMsg() {
    message.textContent = "";
  }

  let board = document.querySelector("article.board")
  let boardNodes = document.querySelectorAll(".cell");
  board.addEventListener("click", (e) => {
    if (checkGameOver()) {
      return;
    }
    let nodeIndex = Array.from(boardNodes).indexOf(e.target);
    markCell(nodeIndex);
    updateBoard();
  })

  const gameButtons = document.querySelector("div.button-wrapper")

  gameButtons.addEventListener("click", (e) => {
    if (e.target.id==="round") {
      (e.target.classList.contains("off")) && (currentGame.currentBoard.setError("Complete the current round first!"));
      (checkGameOver()) && newRound();
      updateMsg()
    }
    if (e.target.id==="restart") {
      confirmRestart()
    }
    else toggleRestartOff();
    if (e.target.id==="auto-move") {
      if (checkGameOver()) {
        message.textContent = "Start a new round!"; // updateMsg() not used because it prioritizes win status
      }
      else {
        currentGame.autoNext();
        if (!checkGameOver() && currentGame.currentBoard.getError()) {
        currentGame.currentBoard.setError("");
        }
        updateBoard()
      }
    }
  })
  function markCell(node) {
    let nodeRow = 0;
    let nodeCol = node;
    (node <= 2) && (nodeRow = 0);
    (node >= 3 && node <= 5) && ((nodeRow = 1) && (nodeCol -= 3));
    (node >= 6) && ((nodeRow = 2) && (nodeCol -= 6));
    // console.log("node: " + node + ", row: " + nodeRow + ", col: " + nodeCol)
    let row = nodeRow + 1;
    let col = nodeCol + 1;
    currentGame.next(row, col);
    // console.log("*after* node: " + node + ", row: " + row + ", col: " + col)
    if (!checkGameOver() && currentGame.currentBoard.getError()) {
      currentGame.currentBoard.setError("");
      updateMsg()
    }
  }
  
  function updateBoard() {
    let board = currentGame.currentBoard.board;
    let nodeCount = 0;
    for (let row=0; row<3; row++) {
      for (let cell=0; cell<3; cell++) {
        let boardCoord = (board[row])[cell]
        boardNodes[nodeCount].textContent = "";
        (boardCoord === "X") && boardNodes[nodeCount].classList.add("selected1");
        (boardCoord === "O") && boardNodes[nodeCount].classList.add("selected2");
        (boardCoord === "#") && (boardNodes[nodeCount].classList.remove("selected1", "selected2"))
        nodeCount++
      }
    }
    if (checkGameOver()) {
      updateRoundButton("on");
      updateAutoButton("off")
      }
    if (!checkGameOver()) {
      updateRoundButton("off");
      updateAutoButton("on")
      }
    updateMsg()
    updateScore()
    selectNextPlayer()
  }
  function updateRoundButton(set) {
    const roundButton = document.getElementById("round");
    switch (set) {
      case "off":
        roundButton.classList.add("off");
        roundButton.textContent = "Round in progress..."
        break;
      case "on":
        roundButton.classList.remove("off");
        roundButton.textContent = "New Round"
        break;
    }
  }
  function updateAutoButton(set) {
    const autoButton = document.getElementById("auto-move");
    switch (set) {
      case "off":
        autoButton.classList.add("off");
        break;
      case "on":
        autoButton.classList.remove("off");
        break;
    }
  }
  const restartButton = document.getElementById("restart");
  function confirmRestart() {
    if (restartButton.classList.contains("confirm")) {
      toggleRestartOff();
      restartGame()
    }
    else {
      message.textContent = "Click again to confirm."
      restartButton.classList.add("confirm");
      restartButton.textContent = "Confirm Restart"
    }
  }
  function toggleRestartOff() {
    restartButton.textContent = "Restart"
    restartButton.classList.remove("confirm");
  }
  function updateScore() {
    const p1 = document.querySelector("p#p1 > span");
    const p2 = document.querySelector("p#p2 > span");
    const p1Score = document.getElementById("p1-score");
    const p2Score = document.getElementById("p2-score");
    p1.textContent = player1.name;
    p2.textContent = player2.name;
    p1Score.textContent = player1.getScore();
    p2Score.textContent = player2.getScore();
  }
  
  const editButton=document.getElementById("edit");
  editButton.addEventListener("click", () => {
    const names = document.querySelectorAll("nav .p-wrapper span#name")
    const nameInputs = document.querySelectorAll("nav .p-wrapper input");
    if (editButton.classList.contains("edit-mode")) {
      names.forEach((span) => {
        span.style.display="inline-block";
        })
      nameInputs.forEach((input) => {
        input.style.display="none";
        if (input.value.length > 1) {
          (input.parentNode).id === "p1" ? player1.name = input.value : player2.name = input.value;
          message.textContent = "Names must be one or more characters."
          }
        })
      editButton.classList.remove("edit-mode");
      editButton.textContent = "Edit players"
      updateScore()
    }
    else {
      names.forEach((span) => {
        span.style.display="none";
        })
      nameInputs.forEach((input) => {
        input.style.display="inline-block";
        (input.parentNode).id === "p1" ? input.value = player1.name : input.value = player2.name;
        })
      editButton.classList.add("edit-mode");
      editButton.textContent = "Submit"
    }
  })

  function selectNextPlayer() {
    const iconP1 = document.getElementById("p1-icon");
    const iconP2 = document.getElementById("p2-icon");
    let next = currentGame.currentPlayer;
    console.log(next)
    if (currentGame.returnCurrentPlayer() === player1) {
      iconP1.classList.add("next");
      iconP2.classList.remove("next")
    }
    if (currentGame.returnCurrentPlayer() === player2) {
      iconP2.classList.add("next");
      iconP1.classList.remove("next")
    }
  }

  return { autoRound, displayTotal, markCell, updateBoard }
};



Play().autoRound()




