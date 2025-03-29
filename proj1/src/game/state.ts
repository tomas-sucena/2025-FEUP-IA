/**
 * An array that represents a move.
 */
export type Move = [number, number];

interface IGameState {
  /** the number of rows and columns of the board */
  size?: number;
  /** an array that represents the small boards */
  boards?: string[];
  /** a 2D array that represents the tiles on the board */
  tiles?: string[][];
  /** the symbol of the player that will play next */
  nextPlayer?: string;
  /* the index of the small board the next player has to play in */
  nextBoardIndex?: number;
}

export default class GameState {
  /**
   * An array that represents the small boards.
   */
  boards: string[];
  /**
   * A 2D array that represents the tiles on the board.
   */
  tiles: string[][];
  /**
   * The symbol of the player that will play next.
   */
  nextPlayer: string;
  /**
   * The index of the small board the next player has to play in.
   */
  nextBoardIndex: number;
  /** an array containing all possible tile combinations that lead to victory */
  victoryPatterns: number[][];

  /**
   * Initializes the game state.
   */
  constructor({ size, boards, tiles, nextPlayer, nextBoardIndex }: IGameState) {
    size ??= 3;
    const area = size * size;

    this.boards = boards ?? new Array(area).fill('');
    this.tiles =
      tiles ?? Array.from({ length: area }, () => new Array(area).fill(''));
    this.nextPlayer = nextPlayer ?? 'X';
    this.nextBoardIndex = nextBoardIndex ?? -1;
  }

  /**
   * Computes all possible tile combinations that lead to victory.
   * @param size the number of rows and columns of the board
   * @returns an array containing all possible tile combinations that lead to victory
   */
  private getVictoryPatterns(size: number): number[][] {
    const area = size * size;

    // initialize the victory patterns
    const victoryPatterns: number[][] = [];

    // rows
    for (let i = 0; i < area; i += size) {
      this.victoryPatterns.push(Array.from({ length: size }, (_, j) => i + j));
    }

    // columns
    for (let j = 0; j < size; ++j) {
      this.victoryPatterns.push(
        Array.from({ length: size }, (_, i) => i * size + j),
      );
    }

    // diagonals
    this.victoryPatterns.push(
      Array.from({ length: size }, (_, i) => i * size + i),
    );
    this.victoryPatterns.push(
      Array.from({ length: size }, (_, i) => area - (i * size + i + 1)),
    );

    return victoryPatterns;
  }

  /**
   * Verifies if a move is valid.
   * @param boardIndex the index of the small board
   * @param tileIndex the index of the tile
   * @returns true if the move is valid, false otherwise
   */
  isValidMove(boardIndex: number, tileIndex: number): boolean {
    return (
      this.boards[boardIndex] === '' &&
      (this.nextBoardIndex < 0 || this.nextBoardIndex === boardIndex) &&
      this.tiles[boardIndex][tileIndex] === ''
    );
  }

  /**
   * Computes the valid moves for the current turn.
   * @returns the valid moves for the current turn
   */
  getValidMoves(): Move[] {
    // a function for determining the valid moves within a small board
    const getValidTiles = (boardIndex: number) =>
      this.tiles[boardIndex].reduce((validMoves: Move[], symbol, tileIndex) => {
        if (symbol === '') {
          validMoves.push([boardIndex, tileIndex]);
        }

        return validMoves;
      }, []);

    return this.nextBoardIndex < 0
      ? this.tiles.flatMap((_, boardIndex) => getValidTiles(boardIndex)) // all small boards are available
      : getValidTiles(this.nextBoardIndex); // only a specific small board is available
  }

  /**
   * Verifies if a player has won a board.
   * @param board the board
   * @param player the symbol of the player
   * @returns true if the player won the board, false otherwise
   */
  checkWinner(board: string[], player: string) {
    return this.victoryPatterns.some((pattern) =>
      pattern.every((i) => board[i] === player),
    );
  }

  /**
   * Verifies if a move is valid and, if it its, updates the state accordingly.
   * @param boardIndex the index of the small board
   * @param tileIndex the index of the tile
   * @returns true if the move was made, false otherwise
   */
  makeMove([boardIndex, tileIndex]: Move): boolean {
    // verify if the move is valid
    if (!this.isValidMove(boardIndex, tileIndex)) {
      return false;
    }

    const smallBoard = this.tiles[boardIndex];
    smallBoard[tileIndex] = this.nextPlayer;

    // verify if the player won the small board
    if (this.checkWinner(smallBoard, this.nextPlayer)) {
      this.boards[boardIndex] = this.nextPlayer;
    }

    // toggle the player
    this.nextPlayer = this.nextPlayer === 'X' ? 'O' : 'X';

    // switch the board
    this.nextBoardIndex = this.boards[tileIndex] ? -1 : tileIndex;

    return true;
  }
}
