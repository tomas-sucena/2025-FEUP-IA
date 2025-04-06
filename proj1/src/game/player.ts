import { GameState, GameMove } from './state';
import { Heuristic, heuristics } from './heuristics';

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
export class GamePlayer {
  name: string;
  symbol: string;
  opponent: string;
  chooseMove?: (state: GameState) => GameMove;

  /**
   * Initializes the computer player.
   * @param name the name of the player
   * @param symbol the AI's symbol
   */
  private constructor(name: string, symbol: string) {
    this.name = name;
    this.symbol = symbol;
    this.opponent = symbol === 'X' ? 'O' : 'X';
  }

  /**
   * Creates a random computer player.
   * @param name the name of the player
   * @param symbol the player's symbol
   * @returns a random computer player
   */
  static human(name: string, symbol: string) {
    return new GamePlayer(name, symbol);
  }

  /**
   * Creates a computer player.
   * @param name the name of the computer player
   * @param symbol the computer player's symbol
   * @param depth the depth the computer player will run Minimax with
   * @returns a computer player
   */
  static AI(name: string, symbol: string, depth: number) {
    const AI = new GamePlayer(name, symbol);
    AI.chooseMove =
      depth > 0 ? (state) => AI.minimax(state, depth) : AI.randomMove;

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

  /**
   * Evaluates a terminal game state, determining if it corresponds to a win, a loss, or a tie.
   * @param state the terminal game state
   * @param move the move
   * @returns the value of the terminal game state
   */
  private evaluateState(state: GameState, move: GameMove): number {
    return Object.values(heuristics).reduce(
      (value, heuristic) =>
        value +
        heuristic({
          state,
          move,
          player: this.symbol,
          opponent: this.opponent,
        }),
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
      node.value = this.evaluateState(node.state, node.move);
      return node;
    }

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
    return this.minimaxDFS(new Node(state), depth, -Infinity, Infinity, true)
      .move;
  }
}
