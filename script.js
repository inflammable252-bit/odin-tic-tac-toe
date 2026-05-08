let player1 = createPlayer("Bob", "X");
let player2 = createPlayer("Rob", "O");
let currentGame = Game();

function createPlayer(name, icon) { //factory with player functions
let score = 0;
const increaseScore = () => {score++;}
const getScore = () => score;
return player = { name, icon, getScore, increaseScore } 
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
          currentPlayer.increaseScore()
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

  return { currentBoard, displayBoard, currentPlayer, next, returnRemaining, autoNext, returnWinStatus }
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
    currentGame.returnWinStatus;
  }
  function newRound() {
    currentGame = Game();
    updateBoard()
    currentGame.displayBoard()
  }

  let board = document.querySelector("article.board")
  let boardNodes = document.querySelectorAll(".cell");
  board.addEventListener("click", (e) => {
    if (currentGame.returnWinStatus()) {
      return;
    }
    let nodeIndex = Array.from(boardNodes).indexOf(e.target);
    markCell(nodeIndex);
    updateBoard();
  })

  const gameButtons = document.querySelector("div.button-wrapper")

  gameButtons.addEventListener("click", (e) => {
    (e.target.id==="round") && newRound()

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
    currentGame.next(row, col)
    // console.log("*after* node: " + node + ", row: " + row + ", col: " + col)
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
    updateMsg()
    updateScore()
  }

  function updateMsg() {
    const message = document.querySelector("p.system-msg")
    message.textContent = currentGame.returnWinStatus() || currentGame.currentBoard.error;
  }
  function updateScore() {
    const p1Score = document.getElementById("p1-score");
    const p2Score = document.getElementById("p2-score");
    p1Score.textContent = player1.getScore();
    p2Score.textContent = player2.getScore();
  }

  return { autoRound, displayTotal, markCell, updateBoard }
};

// console.log(currentGame.currentPlayer.icon)
Play().autoRound()
// currentGame.next(1,1)

// Play().updateBoard()
// Play().markCell(0,0);
// Play().markCell(0)
// Play().markCell(1)
// Play().markCell(2)
// Play().markCell(3)
// Play().markCell(4)
// Play().markCell(1)



