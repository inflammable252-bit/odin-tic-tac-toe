# Tic-tac-toe

A classic game of Tic-tac-toe, created in vanilla JavaScript. The goal of this project was to explicitly use objects and factories, thereby minimizing global code and separating state logic from the UI.

Created as part of the JavaScript course of The Odin Project curriculum.

## Description

To meet the specifications of the project goals, the game was first created to run exclusively in the console.
![Preview of the game running via console](preview2.png)

Objects for players functions, board functions, and game functions were established. Game() captures the current Board() in a variable. A player move might look like this:

1. currentGame().next(1,1) is typed into the console.
2. The given coordinates (1,1) are translated into an index-friendly format(i.e. (board[0])[0]) and currentBoard() checks that the move is valid. If it is, the icon of currentPlayer replaces the "#" marker.
3. The updated board is displayed to the console.
4. checkWin() is used to verify if a winning or tie combination is present. If there is, a winStatus is returned and the player score is adjusted accordingly.

![Preview of page](preview.png)



As with the other similar curriculum projects done, ot:
- 

### Future considerations

There are undoubtedly many ways to simplify the objects.

The conversions between coordinates for .next() to (board[0])[0] led to complications in creating functions. Using index values in .next() would likely have been sufficient for this project, unless a user is expected to manually give coordinates.

