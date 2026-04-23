function boardFactory() {
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
   if ((row>0) && (col>0) && ((row<=3) && (col<=3))) {
      [row, col] = toIndex(row, col);
      return true
    }
    else {
      this.errorMessage = "Error: Row and column value must be between 1-3.";
      return false;
    }
  }
  function selectCell(row, col, icon) {
      [row, col] = toIndex(row, col);
      // console.log(`Row Index: ${row}, Col Index: ${col}`);
      (board[row])[col] = icon;
  }

  return { board, checkCell, selectCell, errorMessage }
}

function createPlayer(name, icon) {
  let score = 0;
  const increaseScore = () => {score++;}
  const decreaseScore = () => {if (score) score--;}
  const getScore = () => score;
  return { name, icon, getScore, increaseScore, decreaseScore } 
};

function Game() {
  const currentBoard = boardFactory();
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
        console.log(currentBoard.errorMessage)
        return
      }
      displayBoard()
  }
  const displayBoard = function() {
    console.log(currentBoard.board)
  };

  return { currentBoard, currentPlayer, displayBoard, next }
}

let player1 = createPlayer("bob", "x");
let player2 = createPlayer("rob", "o");
let currentGame = Game();
currentGame.next(1,1)
currentGame.next(1,2)
currentGame.next(1,3)
// currentGame.currentBoard.checkCell(1,2)

const winRows = [[1,2,3],[4,5,6],[7,8,9]];
const winCol = [[1,4,7],[2,5,8],[3,6,9]];
const winCross = [[1,5,9][7,5,3]];


function boardTest() {
console.log("Test:")
const board1 = boardFactory()
board1.selectCell(1,1,"X")
board1.displayBoard()
const board2 = boardFactory()
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


