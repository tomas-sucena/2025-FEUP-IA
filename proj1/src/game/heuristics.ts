import { GameState, GameMove } from './state';

const heuristics = {
  /**
   * Determines if the player has won the game.
   * @param state the game state
   * @param move the move
   * @returns true if the player has won the game, false otherwise
   */
  win: (state: GameState, move: GameMove): boolean => {
    return state.checkWinner(state.board, move.player);
  },
  /**
   * Determines if the player has won the small board they played on.
   * @param state the game state
   * @param move the move
   * @returns true if the player has won the small board they played on, false otherwise
   */
  smallBoardWin: (state: GameState, move: GameMove): boolean => {
    return state.board[move.boardIndex] === move.player;
  },
  /**
   * Determines if the player occupied the middle of the small board they played on.
   * @param state the game state
   * @param move the move
   * @returns true if the player occupied the middle of the small board, false otherwise
   */
  middleOfSmallBoard: (state: GameState, move: GameMove): boolean => {
    const area = state.board.length;
    return area % 2 === 1 && move.tileIndex === area / 2;
  },
  /**
   * Determines if the player occupied a corner of the small board they played on.
   * @param state the game state
   * @param move the move
   * @returns true if the player occupied a corner of the small board, false otherwise
   */
  cornerOfSmallBoard: (state: GameState, move: GameMove): boolean => {
    const area = state.board.length,
      size = Math.sqrt(area);
    const corners = [0, size - 1, area - size, area - 1];

    return corners.some((index) => move.tileIndex === index);
  },
  /**
   * Determines if the player made a move in the middle small board.
   * @param state the game state
   * @param move the move
   * @returns true if the player made a move in the middle small board, false otherwise
   */
  middleOfBoard: (state: GameState, move: GameMove): boolean => {
    const area = state.board.length;
    return area % 2 === 1 && move.boardIndex === area / 2;
  },
  /**
   * Determines if the player made a move in a corner small board.
   * @param state the game state
   * @param move the move
   * @returns true if the player made a move in a corner small board, false otherwise
   */
  cornerOfBoard: (state: GameState, move: GameMove): boolean => {
    const area = state.board.length,
      size = Math.sqrt(area);
    const corners = [0, size - 1, area - size, area - 1];

    return corners.some((index) => move.boardIndex === index);
  },
  /**
   * Counts the number of non-blocked victory patterns that contain the move.
   * @param state the game state
   * @param move the move
   * @returns the number of victory patterns that contain the move
   */
  countNonBlockedPatterns: (state: GameState, move: GameMove): number => {
    const smallBoard = state.smallBoards[move.boardIndex];
    const opponent = state.nextPlayer;

    return state.victoryPatterns.reduce(
      (acc, pattern) =>
        acc +
        +(
          pattern.includes(move.tileIndex) &&
          pattern.every((index) => smallBoard[index] !== opponent)
        ),
      0,
    );
  },
};

export default heuristics;
