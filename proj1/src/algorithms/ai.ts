export function checkWinner(
  board: Array<string>,
  rows: number,
  columns: number,
  player: string,
): boolean {
  // check the rows
  for (let i = 0; i < rows; ++i) {
    if (board.slice(i, i + rows).every((el) => el === player)) {
      return true;
    }
  }

  // check the columns
  for (let j = 0; j < columns; ++j) {
    let allEqual = true;

    for (let i = 0; allEqual && i < rows; ++i) {
      allEqual &&= (board[i * rows + j] === player);
    }

    if (allEqual) {
      return true;
    }
  }

  return false; // the player has not won
}
