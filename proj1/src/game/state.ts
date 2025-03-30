/**
 * An array that represents a move.
 */
export type GameMove = [number, number];

interface IGameState {
  /** An array that represents the small boards. */
  boards: string[];
  /** A 2D array that represents the tiles on the board. */
  tiles: string[][];
  /** The symbol of the player that will play next. */
  nextPlayer: string;
  /* The index of the small board the next player has to play in. */
  nextBoardIndex: number;
  /** An array containing all possible tile combinations that lead to victory. */
  victoryPatterns: number[][];
}

/**
 * The game state.
 */
export class GameState {
  /** An array that represents the small boards. */
  boards: string[];
  /** A 2D array that represents the tiles on the board. */
  tiles: string[][];
  /** The symbol of the player that will play next. */
  nextPlayer: string;
  /** The index of the small board the next player has to play in. */
  nextBoardIndex: number;
  /** An array containing all possible tile combinations that lead to victory. */
  readonly victoryPatterns: number[][];

  /**
   * Initializes the game state.
   */
  private constructor({
    boards,
    tiles,
    nextPlayer,
    nextBoardIndex,
    victoryPatterns,
  }: IGameState) {
    this.boards = boards;
    this.tiles = tiles;
    this.nextPlayer = nextPlayer;
    this.nextBoardIndex = nextBoardIndex;
    this.victoryPatterns = victoryPatterns;
  }

  /**
   * Initializes a new game state according to the dimensions of the board.
   * @param size the number of rows and columns of the board
   * @returns a new game state
   */
  static fromSize(size: number): GameState {
    const area = size * size;

    // initialize the game state
    return new GameState({
      boards: new Array(area).fill(''),
      tiles: Array.from({ length: area }, () => new Array(area).fill('')),
      nextPlayer: 'X',
      nextBoardIndex: -1,
      victoryPatterns: GameState.getVictoryPatterns(size),
    });
  }

  /**
   * Creates a copy of a game state.
   * @param size the number of rows and columns of the board
   * @returns a new game state
   */
  static fromState(state: GameState): GameState {
    return new GameState({
      boards: [...state.boards],
      tiles: state.tiles.map((smallBoard) => [...smallBoard]),
      nextPlayer: state.nextPlayer,
      nextBoardIndex: state.nextBoardIndex,
      victoryPatterns: state.victoryPatterns,
    });
  }

  /**
   * Computes all possible tile combinations that lead to victory.
   * @param size the number of rows and columns of the board
   * @returns an array containing all possible tile combinations that lead to victory
   */
  private static getVictoryPatterns(size: number): number[][] {
    const area = size * size;

    // initialize the victory patterns
    const victoryPatterns: number[][] = [];

    // rows
    for (let i = 0; i < area; i += size) {
      victoryPatterns.push(Array.from({ length: size }, (_, j) => i + j));
    }

    // columns
    for (let j = 0; j < size; ++j) {
      victoryPatterns.push(
        Array.from({ length: size }, (_, i) => i * size + j),
      );
    }

    // diagonals
    victoryPatterns.push(Array.from({ length: size }, (_, i) => i * size + i));
    victoryPatterns.push(
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
  getValidMoves(): GameMove[] {
    // a function for determining the valid moves within a small board
    const getValidTiles = (boardIndex: number) =>
      this.tiles[boardIndex].reduce(
        (validMoves: GameMove[], symbol, tileIndex) => {
          if (symbol === '') {
            validMoves.push([boardIndex, tileIndex]);
          }

          return validMoves;
        },
        [],
      );

    return this.nextBoardIndex < 0
      ? this.tiles.flatMap((_, boardIndex) => getValidTiles(boardIndex)) // all small boards are available
      : getValidTiles(this.nextBoardIndex); // only a specific small board is available
  }

  /**
   * Verifies if a player has won a board.
   * @param board the board
   * @param player the symbol of the player
   * @returns true if the player has won the board, false otherwise
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
  makeMove([boardIndex, tileIndex]: GameMove): boolean {
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
