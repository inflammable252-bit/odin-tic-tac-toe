let player1 = createPlayer("bob", "x");
let player2 = createPlayer("rob", "o");
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
    }
    else {
      this.errorMessage = "Space occupied."
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

  return { board, checkCell, selectCell, errorMessage, getRemainingCells }
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
          console.log(winStatus)
          currentPlayer.increaseScore()
        }
        turn++
        currentPlayer = (currentPlayer===player1) ? player2 : player1;
      }
      else {
        console.error(`Error: ${errorMessage}`)
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
  return { currentBoard, displayBoard, next, returnRemaining, autoNext, returnWinStatus }
}

function Play() { //uses Game() functions to play a round and display to the DOM
  let numberOfCells = currentGame.returnRemaining().length;

  function autoRound() {
    while (numberOfCells > 0) {
      currentGame.autoNext()
      if (currentGame.returnWinStatus()) numberOfCells = 0;
      else numberOfCells = currentGame.returnRemaining().length;
      }
      // console.log(numberOfCells)
    if (numberOfCells===0 && !currentGame.returnWinStatus()) {
      console.log("Tie!")
    }
  }

  function displayTotal() {
   return `${player1.name}, ${player1.icon}: ${player1.getScore()}, ${player2.name}, ${player2.icon}: ${player2.getScore()}`
  }

  function resetGame() {
    currentGame = Game();
  }
  return { autoRound, resetGame, displayTotal }
}

Play().autoRound()
Play().resetGame()
Play().autoRound()
console.log(Play().displayTotal())


// currentGame.next(1,1)
// currentGame.next(2,2)
// currentGame.next(2,1)
// Play().resetGame()
// currentGame.next(1,3)
// currentGame.next(3,1)

// currentGame.next(2,2)
// currentGame.next(3,1)
// currentGame.next(3,2)
// currentGame.next(3,3)
// console.log("Remaining:")
// console.log(currentGame.returnRemaining())
// currentGame.autoNext()
// console.log(currentGame.errorMessage)
// currentGame.currentBoard.checkCell(1,2)




