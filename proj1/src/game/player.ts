import { GameState, GameMove } from './state';
import { heuristics } from './heuristics';

class Node {
  state: GameState;
  move: GameMove;
  value: number;

  constructor(state: GameState, move?: GameMove) {
    this.state = GameState.clone(state);
    this.move = move ?? [-1, -1];
    this.value = 0;

    if (move) {
      this.state.makeMove(...move);
    }
  }

  isTerminal(): boolean {
    return this.state.validMoves.length === 0;
  }
}

enum PlayerType {
  Human,
  RandomAI,
  EasyAI,
  MediumAI,
  HardAI,
}

interface IGamePlayer {
  /** the player's name */
  name: string;
  /** the player's type */
  type: PlayerType;
  /** the player's symbol (X or O) */
  symbol: string;
  /** the opponent's symbol (X or O) */
  opponent: string;
}

/**
 * The computer player.
 */
export class GamePlayer {
  /** the player's name */
  name: string;
  /** the player's type */
  type: PlayerType;
  /** the player's symbol (X or O) */
  symbol: string;
  /** the opponent's symbol (X or O) */
  opponent: string;
  chooseMove?: (state: GameState) => GameMove;

  /**
   * Initializes the computer player.
   * @param name the name of the player
   * @param symbol the AI's symbol
   * @param difficulty
   */
  constructor({ name, type, symbol, opponent }: IGamePlayer) {
    this.name = name;
    this.type = type;
    this.symbol = symbol;
    this.opponent = opponent;

    // assign the function for choosing the move
    this.chooseMove =
      type === PlayerType.RandomAI
        ? this.randomMove
        : (state) => this.minimax(state, 1 + 2 * type);
  }

  /**
   * Creates a human player.
   * @param name the name of the player
   * @param symbol the player's symbol
   * @returns a human player
   */
  static human(name: string, symbol: string) {
    return new GamePlayer({
      name,
      type: PlayerType.Human,
      symbol,
      opponent: symbol === 'X' ? 'O' : 'X',
    });
  }

  /**
   * Creates a computer player.
   * @param name the name of the computer player
   * @param symbol the computer player's symbol
   * @param difficulty the difficulty of the computer player (from 0 to 3)
   * @returns a computer player
   */
  static AI(name: string, symbol: string, difficulty: number) {
    return new GamePlayer({
      name,
      type: PlayerType.RandomAI + difficulty,
      symbol,
      opponent: symbol === 'X' ? 'O' : 'X',
    });
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

  /**
   * An implementation of the Minimax depth-first search.
   * @param node the current node
   * @param depth the current depth
   * @param alpha the minimum score that the maximizing player is assured
   * @param beta the maximum score that the minimizing player is assured of
   * @param maximize indicates whether it is the maximizing player's turn
   * @returns the node corresponding to the best move the player can make
   */
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

  /**
   * Indicates whether the player is a computer player.
   * @returns a boolean indicating if the player is a computer player
   */
  isAI(): boolean {
    return this.type > PlayerType.Human;
  }

  /**
   * An implementation of the Minimax algorithm.
   * @param state the game state
   * @param depth the depth with which the algorithm will be called
   * @returns the best move the player can make
   */
  minimax(state: GameState, depth: number): GameMove {
    return this.minimaxDFS(new Node(state), depth, -Infinity, Infinity, true)
      .move;
  }
}
