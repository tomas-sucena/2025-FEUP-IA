import GameState, { Move } from './state';

class Node {
  state: GameState;
  move?: Move;
  value: number;
  private children?: Node[];

  constructor(state: GameState, move?: Move) {
    this.state = state;
    this.move = move;
    this.value = 0;
  }

  getChildren() {
    return (this.children ??= this.state
      .getValidMoves()
      .map((move) => new Node(GameState.fromState(this.state), move)));
  }

  isTerminal(): boolean {
    return this.getChildren().length === 0;
  }

  static max(lhs: Node, rhs: Node): Node {
    return lhs.value > rhs.value ? lhs : rhs;
  }

  static min(lhs: Node, rhs: Node): Node {
    return lhs.value < rhs.value ? lhs : rhs;
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

  minimaxDFS(
    node: Node,
    depth: number,
    maximize: boolean,
    alpha: number,
    beta: number,
  ): Node {
    // verify if the depth limit has been reached or the node is terminal
    if (depth === 0 || node.isTerminal()) {
      node.value = this.getMoveValue(node.state, node.move!);
      return node;
    }

    // define the algorithm variables
    let bestNode = new Node(node.state);

    if (maximize) {
      // maximizing player
      bestNode.value = -Infinity;

      for (let child of node.getChildren()) {
        bestNode = Node.max(
          this.minimaxDFS(child, depth - 1, false, alpha, beta),
          bestNode,
        );

        if (bestNode.value > beta) {
          break; // beta cutoff
        }

        alpha = Math.max(bestNode.value, alpha);
      }
    } else {
      // minimizing player
      bestNode.value = Infinity;

      for (let child of node.getChildren()) {
        bestNode = Node.min(
          this.minimaxDFS(child, depth - 1, true, alpha, beta),
          bestNode,
        );

        if (bestNode.value < alpha) {
          break; // alpha cutoff
        }

        beta = Math.min(bestNode.value, beta);
      }
    }

    return bestNode;
  }

  minimax(state: GameState, depth: number) {
    return this.minimaxDFS(new Node(state), depth, true, -Infinity, Infinity)
      .move;
  }
}
