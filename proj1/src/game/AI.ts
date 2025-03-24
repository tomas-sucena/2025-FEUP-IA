import GameState, { Move } from './state';

class Node {
  state: GameState;
  move: Move;
  value: number;
  children?: Node[];

  constructor(state: GameState, move: Move, value: number) {
    this.state = state;
    this.move = move;
    this.value = value;
  }

  getChildren() {
    return this.children ??=
      this.state.getValidMoves().map((move) => new Node(this.state, move, ));
  }

  isTerminal() {
    return this.getChildren().length === 0;
  }
}

export default class AI {
  chooseMove: (state: GameState) => Move;

  /**
   * Initializes the AI player.
   */
  constructor() {
    this.chooseMove = this.randomMove;
  }

  /**
   * Returns a random valid move.
   * @param state the game state
   * @returns a random valid move
   */
  randomMove(state: GameState): Move {
    const validMoves = state.getValidMoves();
    return validMoves[Math.floor(Math.random() * validMoves.length)];
  }

  getMoveValue(state: GameState, move: Move) {
    // TODO
    return 0;
  }

  minimaxDFS(node: Node, depth: number, maximize: boolean, alpha: number, beta:number) {
    // verify if the depth limit has been reached or the node is terminal
    if (depth === 0 || node.isTerminal()) {
      node.value = this.getMoveValue()
      return node;
    }

    let bestNode, value = -Infinity;

    for (const child of node.getChildren()) {
      value = Math.max(value, this.minimaxDFS(child))
    }

    return bestNode;
  }

  minimax(state: GameState, depth: number, maximize: boolean, alpha: number, beta: number) {
    return this.minimaxDFS(new Node(state, move), depth, true, -Infinity, Infinity).move;
  }
}
