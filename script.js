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

function createPlayer(name, icon) { //factory with player functions
  let score = 0;
  const increaseScore = () => {score++;}
  const decreaseScore = () => {if (score) score--;}
  const getScore = () => score;
  return { name, icon, getScore, increaseScore, decreaseScore } 
};

function Game() { // factory with game controls, display board
  const currentBoard = Board();
  let currentPlayer = randomizeStart();
  let turn = 1;

  function randomizeStart() {
    let playerNumber = Math.floor(Math.random()*2)+1;
    return playerNumber === 1 ? player1 : player2;
  }
  function next(row, col) {
    console.log(`Turn: ${turn}`)
    console.log(`current Player: ${currentPlayer.name}`);
    if (currentBoard.checkCell(row, col)) {
        currentBoard.selectCell(row, col, currentPlayer.icon);
        currentPlayer = (currentPlayer===player1) ? player2 : player1;
        turn++
      }
      else {
        console.error(`Error: ${errorMessage}`)
        return
      }
      displayBoard()
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
    console.log(`Random item ${randomFromArr} is selected at index ${randomizer}. Row ${nextChoiceRow} and col ${nextChoiceCol} are returned for .next().`)
  }

  function autoNext() {
    getRandomChoice()
    next(nextChoiceRow,nextChoiceCol)
  }

  const displayBoard = function() {
    console.log(currentBoard.board)
  };
  const returnRemaining = function() {
    return currentBoard.getRemainingCells();
  }
  return { currentBoard, currentPlayer, displayBoard, next, returnRemaining, autoNext }
}

let player1 = createPlayer("bob", "x");
let player2 = createPlayer("rob", "o");
let currentGame = Game(); // note: initialize once (button press) for one consistent board -> iife instead of global needed?

function playRound() { //uses Game() functions to play a round
  let numberOfCells = currentGame.returnRemaining().length;
  function autoRound() {
    while (numberOfCells > 0) {
      currentGame.autoNext()
      numberOfCells = currentGame.returnRemaining().length;
      // console.log(numberOfCells)
    }
    if (numberOfCells===0) {
      console.log("Tie!")
    }
  }
  // currentGame.autoNext()
  return { autoRound }
}
playRound().autoRound()

// currentGame.next(1,1)
// currentGame.next(2,2)
// currentGame.next(3,1)
// currentGame.next(3,2)
// currentGame.next(3,3)
// console.log("Remaining:")
// console.log(currentGame.returnRemaining())
// currentGame.autoNext()
// console.log(currentGame.errorMessage)
// currentGame.currentBoard.checkCell(1,2)

const winRows = [[1,2,3],[4,5,6],[7,8,9]];
const winCol = [[1,4,7],[2,5,8],[3,6,9]];
const winCross = [[1,5,9][7,5,3]];


function boardTest() {
console.log("Test:")
const board1 = Board()
board1.selectCell(1,1,"X")
board1.displayBoard()
const board2 = Board()
board2.selectCell(3,1,"O")
board2.displayBoard()

};

function playerTest() {
  const bob = createPlayer("bob", "x");
  const rob = createPlayer("rob", "o");
  bob.increaseScore()
  console.log("Bob's score: " + bob.getScore())
  rob.decreaseScore()
  rob.increaseScore()
  console.log("Rob's score: " + rob.getScore())
}
// playerTest()


