import GameState, { Move } from './state';

class Node {
  state: GameState;
  move: Move;
  value: number;
  private children?: Node[];

  constructor(state: GameState, move?: Move) {
    this.state = state;
    this.move = move ?? [-1, -1];
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
    alpha: number,
    beta: number,
    maximize: boolean,
  ): Node {
    // verify if the depth limit has been reached or the node is terminal
    if (depth === 0 || node.isTerminal()) {
      node.value = this.getMoveValue(node.state, node.move);
      return node;
    }

    // define the algorithm variables
    let bestNode = new Node(node.state);
    let evaluator: (lhs: Node, rhs: Node) => Node;
    let pruner: (node: Node) => boolean;

    if (maximize) {
      bestNode.value = -Infinity;
      evaluator = Node.max;
      pruner = (node: Node) => {
        alpha = Math.max(node.value, alpha);
        return node.value > beta;
      };
    } else {
      bestNode.value = Infinity;
      evaluator = Node.min;
      pruner = (node: Node) => {
        beta = Math.min(node.value, beta);
        return node.value < alpha;
      };
    }

    // compute the best node
    for (const child of node.getChildren()) {
      bestNode = evaluator(
        this.minimaxDFS(child, depth - 1, alpha, beta, !maximize),
        bestNode,
      );

      if (pruner(bestNode)) {
        break;
      }
    }

    return bestNode;
  }

  minimax(state: GameState, depth: number): Move {
    return this.minimaxDFS(new Node(state), depth, -Infinity, Infinity, true)
      .move;
  }
}
