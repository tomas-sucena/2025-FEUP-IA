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

  constructor({ size, boards, tiles, nextPlayer, nextBoardIndex }: IGameState) {
    size ??= 3;
    const area = size * size;

    this.boards = boards ?? new Array(area).fill('');
    this.tiles =
      tiles ?? Array.from({ length: area }, () => new Array(area).fill(''));
    this.nextPlayer = nextPlayer ?? 'X';
    this.nextBoardIndex = nextBoardIndex ?? -1;
  }
}
