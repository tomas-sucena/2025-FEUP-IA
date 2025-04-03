/**
 * An array that represents a move.
 */
export class GameMove {
  boardIndex: number;
  tileIndex: number;
  player: string;

  constructor(boardIndex: number, tileIndex: number, player?: string) {
    this.boardIndex = boardIndex;
    this.tileIndex = tileIndex;
    this.player = player ?? '';
  }
}

interface IGameState {
  /** An array that represents the big board. */
  board: string[];
  /** A 2D array that represents the small boards. */
  smallBoards: string[][];
  /** The symbol of the player that will play next. */
  nextPlayer: string;
  /* The index of the small board the next player has to play in. */
  nextBoardIndex: number;
  /** An array containing all possible tile combinations that lead to victory. */
  victoryPatterns: number[][];
  /** Indicates if the object is a copy of another. */
  isCopy: boolean;
}

/**
 * The game state.
 */
export class GameState {
  /** An array that represents the big board. */
  board: string[];
  /** A 2D array that represents the small boards. */
  smallBoards: string[][];
  /** The symbol of the player that will play next. */
  nextPlayer: string;
  /** The index of the small board the next player has to play in. */
  nextBoardIndex: number;
  /** An array containing all possible tile combinations that lead to victory. */
  readonly victoryPatterns: number[][];
  /** Indicates if the object is a copy of another. */
  isCopy: boolean;

  /**
   * Initializes the game state.
   */
  private constructor({
    board,
    smallBoards,
    nextPlayer,
    nextBoardIndex,
    victoryPatterns,
    isCopy,
  }: IGameState) {
    this.board = board;
    this.smallBoards = smallBoards;
    this.nextPlayer = nextPlayer;
    this.nextBoardIndex = nextBoardIndex;
    this.victoryPatterns = victoryPatterns;
    this.isCopy = false;
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
      board: new Array(area).fill(''),
      smallBoards: Array.from({ length: area }, () => new Array(area).fill('')),
      nextPlayer: 'X',
      nextBoardIndex: -1,
      victoryPatterns: GameState.getVictoryPatterns(size),
      isCopy: false,
    });
  }

  /**
   * Creates a copy of a game state.
   * @param size the number of rows and columns of the board
   * @param move an optional move to be made
   * @returns a new game state
   */
  static fromState(state: GameState, move?: GameMove): GameState {
    const newState = new GameState({
      board: state.board,
      smallBoards: state.smallBoards.map((smallBoard) => [...smallBoard]),
      nextPlayer: state.nextPlayer,
      nextBoardIndex: state.nextBoardIndex,
      victoryPatterns: state.victoryPatterns,
      isCopy: true,
    });

    if (move) {
      newState.makeMove(move.boardIndex, move.tileIndex);
    }

    return newState;
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
  isValidMove(boardIndex: number, tileIndex: number): boolean {
    return (
      this.board[boardIndex] === '' &&
      (this.nextBoardIndex < 0 || this.nextBoardIndex === boardIndex) &&
      this.smallBoards[boardIndex][tileIndex] === ''
    );
  }

  /**
   * Computes the valid moves for the current turn.
   * @returns the valid moves for the current turn
   */
  getValidMoves(): GameMove[] {
    // a function for determining the valid moves within a small board
    const getValidTiles = (smallBoard: string[], boardIndex: number) =>
      smallBoard.reduce((validMoves: GameMove[], symbol, tileIndex) => {
        if (symbol === '') {
          validMoves.push(new GameMove(boardIndex, tileIndex, this.nextPlayer));
        }

        return validMoves;
      }, []);

    return this.nextBoardIndex < 0
      ? this.smallBoards.flatMap((smallBoard, boardIndex) =>
          getValidTiles(smallBoard, boardIndex),
        ) // all small boards are available
      : getValidTiles(
          this.smallBoards[this.nextBoardIndex],
          this.nextBoardIndex,
        ); // only a specific small board is available
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
   * @param smallBoardIndex the index of the small board
   * @param tileIndex the index of the tile
   * @returns true if the move was made, false otherwise
   */
  makeMove(smallBoardIndex: number, tileIndex: number): boolean {
    // verify if the move is valid
    if (!this.isValidMove(smallBoardIndex, tileIndex)) {
      return false;
    }

    if (this.isCopy) {
      this.board = [...this.board];
      this.smallBoards[smallBoardIndex] = [
        ...this.smallBoards[smallBoardIndex],
      ];
    }

    const smallBoard = this.smallBoards[smallBoardIndex];
    smallBoard[tileIndex] = this.nextPlayer;

    // verify if the player won the small board
    if (this.checkWinner(smallBoard, this.nextPlayer)) {
      this.board[smallBoardIndex] = this.nextPlayer;
    }

    // toggle the player
    this.nextPlayer = this.nextPlayer === 'X' ? 'O' : 'X';

    // switch the board
    this.nextBoardIndex = this.board[tileIndex] ? -1 : tileIndex;

    return true;
  }
}
