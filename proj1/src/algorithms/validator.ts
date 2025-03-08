export default class GameValidator {
  victoryPatterns: number[][]; // an array containing all possible tile combinations that lead to victory

  constructor(size: number) {
    const area = size * size;

    // initialize the victory patterns
    this.victoryPatterns = [];

    // rows
    for (let i = 0; i < area; i += size) {
      this.victoryPatterns.push(Array.from({ length: size }, (_, j) => i + j));
    }

    // columns
    for (let j = 0; j < area; j += size) {
      this.victoryPatterns.push(Array.from({ length: size }, (_, i) => i + j));
    }

    // diagonals
    this.victoryPatterns.push(
      Array.from({ length: size }, (_, i) => i * size + i),
    );
    this.victoryPatterns.push(
      Array.from({ length: size }, (_, i) => area - (i * size + i + 1)),
    );

    console.log(this.victoryPatterns);
  }

  checkWinner(board: Int8Array, player: number) {
    return this.victoryPatterns.some((pattern) =>
      pattern.every((i) => board[i] === player),
    );
  }
}
