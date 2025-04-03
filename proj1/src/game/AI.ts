import { GameState, GameMove } from './state';
import { heuristics } from './heuristics';

class Node {
  state: GameState;
  move?: GameMove;
  value: number;

  constructor(state: GameState, move?: GameMove) {
    this.state = GameState.fromState(state);
    this.move = move;
    this.value = 0;
  }

  getChild(move: GameMove) {
    const child = new Node(this.state, move);
    child.state.makeMove(move.boardIndex, move.tileIndex);

    return child;
  }

  isTerminal(): boolean {
    return this.state.validMoves.length === 0;
  }
}

/**
 * The computer player.
 */
export class GameAI {
  chooseMove?: (state: GameState) => GameMove;

  /**
   * Initializes the computer player.
   * @param chooseMove a function for choosing the move to play
   */
  /* private constructor() {
    this.chooseMove = () => {};
  }*/

  /**
   * Creates an easy computer player.
   * @returns an easy computer player
   */
  static easy() {
    const AI = new GameAI();
    AI.chooseMove = AI.randomMove;

    return AI;
  }

  /**
   * Creates an easy computer player.
   * @returns an easy computer player
   */
  static medium() {
    const AI = new GameAI();
    AI.chooseMove = (state) => AI.minimax(state, 3);

    return AI;
  }

  /**
   * Returns a random valid move.
   * @param state the game state
   * @returns a random valid move
   */
  private randomMove(state: GameState): GameMove {
    const validMoves = state.validMoves;
    return validMoves[Math.floor(Math.random() * validMoves.length)];
  }

  private getMoveValue(state: GameState, move: GameMove) {
    // apply the move
    state.makeMove(move.boardIndex, move.tileIndex);

    return Object.values(heuristics).reduce(
      (value, heuristic) => value + heuristic(state, move),
      0,
    );
  }

  private minimaxDFS(
    node: Node,
    depth: number,
    alpha: number,
    beta: number,
    maximize: boolean,
  ): Node {
    // verify if the depth limit has been reached or the node is terminal
    if (depth === 0 || node.isTerminal()) {
      node.value = this.getMoveValue(node.state, node.move!);
      console.log(node);
      return node;
    }

    console.log(`depth: ${depth}`);

    // define the algorithm variables
    let bestNode = new Node(node.state);
    let isBetterMove: (newValue: number, bestValue: number) => boolean;
    let prune: (node: Node) => boolean;

    if (maximize) {
      bestNode.value = -Infinity;
      isBetterMove = (newValue: number, bestValue: number) => {
        return newValue > bestValue;
      };
      prune = (node: Node) => {
        alpha = Math.max(node.value, alpha);
        return node.value >= beta;
      };
    } else {
      bestNode.value = Infinity;
      isBetterMove = (newValue: number, bestValue: number) => {
        return newValue < bestValue;
      };
      prune = (node: Node) => {
        beta = Math.min(node.value, beta);
        return node.value <= alpha;
      };
    }

    // compute the best child node
    for (const move of node.state.validMoves) {
      const { value } = this.minimaxDFS(node.getChild(move), depth - 1, alpha, beta, !maximize);

      // verify if a better move has been found
      if (isBetterMove(value, bestNode.value)) {
        bestNode.move = move;
        bestNode.value = value;
      }

      // verify if we can prune the remaining child nodes
      if (prune(bestNode)) {
        break;
      }
    }

    return bestNode;
  }

  minimax(state: GameState, depth: number): GameMove {
    const move = this.minimaxDFS(new Node(state), depth, -Infinity, Infinity, true).move!;
    console.log(move);
    return move;
  }
}
