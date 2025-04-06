/**
 * An array that represents a move.
 */
export type GameMove = [number, number];

interface IGameState {
  /** the number of rows and columns of the board */
  size: number;
  /** An array that represents the big board. */
  board: string[];
  /** A 2D array that represents the small boards. */
  smallBoards: string[][];
  /** The symbol of the player that has won the game. */
  winner: string;
  /** The symbol of the player that will play next. */
  nextPlayer: string;
  /* The index of the small board the next player has to play in. */
  nextSmallBoardIndex: number;
  /** An array containing all the valid moves. */
  validMoves: GameMove[];
  /** An array containing all possible tile combinations that lead to victory. */
  victoryPatterns: number[][];
}

/**
 * The game state.
 */
export class GameState {
  /** the number of rows and columns of the board */
  size: number;
  /** An array that represents the big board. */
  board: string[];
  /** A 2D array that represents the small boards. */
  smallBoards: string[][];
  /** The symbol of the player that has won the game. */
  winner: string;
  /** The symbol of the player that will play next. */
  nextPlayer: string;
  /** The index of the small board the next player has to play in. */
  nextSmallBoardIndex: number;
  /** An array containing all the valid moves. */
  validMoves: GameMove[];
  /** An array containing all possible tile combinations that lead to victory. */
  readonly victoryPatterns: number[][];

  /**
   * Initializes the game state.
   */
  constructor({
    size,
    board,
    smallBoards,
    winner,
    nextPlayer,
    nextSmallBoardIndex,
    validMoves,
    victoryPatterns,
  }: IGameState) {
    this.size = size;
    this.board = board;
    this.smallBoards = smallBoards;
    this.winner = winner;
    this.nextPlayer = nextPlayer;
    this.nextSmallBoardIndex = nextSmallBoardIndex;
    this.validMoves = validMoves;
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
      size: size,
      board: new Array(area).fill(''),
      smallBoards: Array.from({ length: area }, () => new Array(area).fill('')),
      winner: '',
      nextPlayer: 'X',
      nextSmallBoardIndex: -1,
      validMoves: Array.from({ length: area }).flatMap((_, boardIndex) =>
        Array.from(
          { length: area },
          (_, tileIndex) => [boardIndex, tileIndex] as GameMove,
        ),
      ),
      victoryPatterns: GameState.getVictoryPatterns(size),
    });
  }

  /**
   * Creates a copy of a game state.
   * @param size the number of rows and columns of the board
   * @returns a new game state
   */
  static clone(state: GameState): GameState {
    return new GameState({
      size: state.size,
      board: [...state.board],
      smallBoards: state.smallBoards.map((smallBoard) => [...smallBoard]),
      winner: state.winner,
      nextPlayer: state.nextPlayer,
      nextSmallBoardIndex: state.nextSmallBoardIndex,
      validMoves: [...state.validMoves],
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
      Array.from({ length: size }, (_, i) => size * ++i - i),
    );

    return victoryPatterns;
  }

  /**
   * Verifies if a move is valid.
   * @param boardIndex the index of the small board
   * @param tileIndex the index of the tile
   * @returns true if the move is valid, false otherwise
   */
  private isValidMove(boardIndex: number, tileIndex: number): boolean {
    return (
      this.board[boardIndex] === '' &&
      (this.nextSmallBoardIndex < 0 ||
        this.nextSmallBoardIndex === boardIndex) &&
      this.smallBoards[boardIndex][tileIndex] === ''
    );
  }

  /**
   * Computes the valid moves for the current turn.
   * @returns the valid moves for the current turn
   */
  private getValidMoves(): GameMove[] {
    // a function for determining the valid moves within a small board
    const getValidTiles = (smallBoardIndex: number) =>
      this.smallBoards[smallBoardIndex].reduce(
        (validMoves: GameMove[], symbol, tileIndex) => {
          if (symbol === '') {
            validMoves.push([smallBoardIndex, tileIndex]);
          }

          return validMoves;
        },
        [],
      );

    return this.nextSmallBoardIndex < 0
      ? // all small boards without a winner are available
        this.smallBoards.flatMap((_, smallBoardIndex) =>
          this.board[smallBoardIndex] === ''
            ? getValidTiles(smallBoardIndex)
            : [],
        )
      : // only a specific small board is available
        getValidTiles(this.nextSmallBoardIndex);
  }

  /**
   * Verifies if a player has won a board.
   * @param board the board
   * @param player the symbol of the player
   * @returns true if the player has won the board, false otherwise
   */
  private checkWinner(board: string[], player: string) {
    return this.victoryPatterns.some((pattern) =>
      pattern.every((i) => board[i] === player),
    );
  }

  /**
   * Verifies if a move is valid and, if it its, updates the state accordingly.
   * @param smallBoardIndex the index of the small board
   * @param tileIndex the index of the tile
   * @returns true if the move was made, false otherwise
   */
  makeMove(smallBoardIndex: number, tileIndex: number): boolean {
    // verify if the move is valid
    if (!this.isValidMove(smallBoardIndex, tileIndex)) {
      return false;
    }

    const smallBoard = this.smallBoards[smallBoardIndex];
    smallBoard[tileIndex] = this.nextPlayer;

    // verify if the player won the small board
    if (this.checkWinner(smallBoard, this.nextPlayer)) {
      this.board[smallBoardIndex] = this.nextPlayer;
    }

    // verify if the player has won the game
    if (this.checkWinner(this.board, this.nextPlayer)) {
      this.winner = this.nextPlayer;
      this.validMoves = [];
    } else {
      // toggle the player
      this.nextPlayer = this.nextPlayer === 'X' ? 'O' : 'X';

      // switch the board
      this.nextSmallBoardIndex = this.board[tileIndex] ? -1 : tileIndex;

      // compute the next valid moves
      this.validMoves = this.getValidMoves();
    }

    return true;
  }
}
