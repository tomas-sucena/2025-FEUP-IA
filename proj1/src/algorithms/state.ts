export default class GameState {
  size: number; // the number of rows and columns of the board
  board: boolean[]; // an array that represents the big board
  tiles: boolean[][]; // a 2D array that represents the tiles on the board
  player: boolean; // the next player that will play ('true' -> player 1, 'false' -> player 2)

  /**
   * Initializes the game state.
   * @param size the number of rows and columns of the board
   */
  constructor(size: number) {
    const area = size * size;

    this.size = size;
    this.board = new Array(area).fill(null);
    this.tiles = Array.from({ length: area }, () => new Array(area).fill(null));
    this.player = true;
  }

  makeMove(row: number, column: number) {
    this.tiles[row][column] = this.player;
    this.player = !this.player; // toggle the player
  }
}
