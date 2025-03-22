/**
 * An array that represents a move.
 */
type Move = [number, number];

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
  boards: string[]; // an array that represents the small boards
  tiles: string[][]; // a 2D array that represents the tiles on the board
  nextPlayer: string; // the symbol of the player that will play next
  nextBoardIndex: number; // the index of the small board the next player has to play in

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
      : getValidTiles(this.nextBoardIndex); // the player can only play on a specific small board
  }
}
