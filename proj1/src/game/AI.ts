import { GameState, GameMove } from './state';
import { heuristics } from './heuristics';

class Node {
  state: GameState;
  move: GameMove;
  value: number;

  constructor(state: GameState, move?: GameMove) {
    this.state = GameState.fromState(state);
    this.move = move ?? new GameMove(-1, -1);
    this.value = 0;

    if (move) {
      this.state.makeMove(move.boardIndex, move.tileIndex);
    }
  }

  isTerminal(): boolean {
    return this.state.validMoves.length === 0;
  }
}

/**
 * The computer player.
 */
export class GameAI {
  player: string;
  opponent: string;
  chooseMove?: (state: GameState) => GameMove;

  /**
   * Initializes the computer player.
   * @param player the AI's symbol
   */
  private constructor(player: string) {
    this.player = player;
    this.opponent = player === 'X' ? 'O' : 'X';
  }

  /**
   * Creates an easy computer player.
   * @param player the AI's symbol
   * @returns an easy computer player
   */
  static easy(player: string) {
    const AI = new GameAI(player);
    AI.chooseMove = AI.randomMove;

    return AI;
  }

  /**
   * Creates a medium computer player.
   * @param player the AI's symbol
   * @returns a medium computer player
   */
  static medium(player: string) {
    const AI = new GameAI(player);
    AI.chooseMove = (state) => AI.minimax(state, 2);

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

  private evaluateMove(state: GameState, move: GameMove) {
    return Object.values(heuristics).reduce(
      (value, heuristic) =>
        value + heuristic({ state, move, player: this.player, opponent: this.opponent }),
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
      node.value = this.evaluateMove(node.state, node.move);
      console.log(node);
      return node;
    }

    console.log(`depth: ${depth}`);

    // define the algorithm variables
    let bestNode = new Node(node.state);
    let isBetterMove: (newValue: number) => boolean;
    let prune: () => boolean;

    if (maximize) {
      bestNode.value = -Infinity;
      isBetterMove = (newValue: number) => {
        return newValue > bestNode.value;
      };
      prune = () => {
        alpha = Math.max(bestNode.value, alpha);
        return bestNode.value > beta;
      };
    } else {
      bestNode.value = Infinity;
      isBetterMove = (newValue: number) => {
        return newValue < bestNode.value;
      };
      prune = () => {
        beta = Math.min(bestNode.value, beta);
        return bestNode.value < alpha;
      };
    }

    // compute the best child node
    for (const move of node.state.validMoves) {
      const { value } = this.minimaxDFS(
        new Node(node.state, move),
        depth - 1,
        alpha,
        beta,
        !maximize,
      );

      // verify if a better move has been found
      if (isBetterMove(value)) {
        bestNode.move = move;
        bestNode.value = value;
      }

      // verify if we can prune the remaining child nodes
      if (prune()) {
        break;
      }
    }

    return bestNode;
  }

  minimax(state: GameState, depth: number): GameMove {
    return this.minimaxDFS(new Node(state), depth, -Infinity, Infinity, true).move;
  }
}
