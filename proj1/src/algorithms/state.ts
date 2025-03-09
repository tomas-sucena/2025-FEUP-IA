interface IGameState {
  /** the number of rows and columns of the board */
  size?: number;
  /** an array that represents the small boards */
  boards?: string[];
  /** a 2D array that represents the tiles on the board */
  tiles?: string[][];
  /** the symbol of the player that will play next */
  nextPlayer?: string;
}

export default class GameState {
  boards: string[]; // an array that represents the small boards
  tiles: string[][]; // a 2D array that represents the tiles on the board
  nextPlayer: string; // the symbol of the player that will play next
  victoryPatterns: number[][]; // an array containing all possible tile combinations that lead to victory

  constructor({ size, boards, tiles, nextPlayer }: IGameState) {
    size ??= 3;
    const area = size * size;

    this.boards = boards ?? new Array(area).fill('');
    this.tiles =
      tiles ?? Array.from({ length: area }, () => new Array(area).fill(''));
    this.nextPlayer = nextPlayer ?? 'X';

    // initialize the victory patterns
    this.victoryPatterns = [];

    // rows
    for (let i = 0; i < area; i += size) {
      this.victoryPatterns.push(Array.from({ length: size }, (_, j) => i + j));
    }

    // columns
    for (let j = 0; j < size; ++j) {
      const pattern = [];

      for (let i = 0; i < area; i += size) {
        pattern.push(i + j);
      }

      this.victoryPatterns.push(pattern);
    }

    // diagonals
    /*this.victoryPatterns.push(
      Array.from({ length: size }, (_, i) => i * size + i),
    );
    this.victoryPatterns.push(
      Array.from({ length: size }, (_, i) => area - (i * size + i + 1)),
    );*/
  }

  checkWinner(board: string[], player: string) {
    return this.victoryPatterns.some((pattern) =>
      pattern.every((i) => board[i] === player),
    );
  }

  makeMove(row: number, column: number) {
    const smallBoard = this.tiles[row];
    smallBoard[column] = this.nextPlayer;

    // verify if the player won the small board
    if (this.checkWinner(smallBoard, this.nextPlayer)) {
      this.boards[row] = this.nextPlayer;
    }

    // toggle the player
    this.nextPlayer = this.nextPlayer === 'X' ? 'O' : 'X';
  }
}
