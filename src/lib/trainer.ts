import { Chess, Move } from "chess.js";
import { Opening, OpeningNode } from "./openings";

export type MoveResult =
  | { type: "correct"; node: OpeningNode; comment: string }
  | { type: "book_alternative"; node: OpeningNode; comment: string }
  | { type: "out_of_book"; expectedMoves: string[] }
  | { type: "end_of_line"; comment: string };

export interface TrainerState {
  game: Chess;
  opening: Opening;
  currentNodes: OpeningNode[]; // current position in the tree (multiple possible lines)
  moveHistory: { move: string; result: MoveResult | null }[];
  isPlayerTurn: boolean;
  status: "playing" | "out_of_book" | "completed";
  currentVariation: string;
}

/**
 * Initialize a training session for a given opening.
 */
export function initTrainer(opening: Opening): TrainerState {
  const game = new Chess();
  const isPlayerWhite = opening.playerColor === "white";

  // Wrap the tree in a virtual root so that the first move (e.g. d4 for London,
  // e4 for Caro-Kann) is a child to be found, not the starting position.
  const virtualRoot: OpeningNode = {
    move: "",
    children: [opening.tree],
  };

  const state: TrainerState = {
    game,
    opening,
    currentNodes: [virtualRoot],
    moveHistory: [],
    isPlayerTurn: isPlayerWhite, // White moves first
    status: "playing",
    currentVariation: opening.name,
  };

  // If player is black, play the first opponent move automatically
  if (!isPlayerWhite) {
    playOpponentMove(state);
  }

  return state;
}

/**
 * Play the opponent's move from the opening tree.
 * Picks a random child from available continuations (opponent's moves).
 */
export function playOpponentMove(state: TrainerState): Move | null {
  if (state.status !== "playing") return null;

  // Current nodes represent where we are. The next moves in children are the opponent's options.
  // But we need to figure out whose move is next based on tree depth.
  // The tree alternates: root is first move, children are responses, etc.
  // For London (white): even depth = player (white), odd depth = opponent (black)
  // For Caro-Kann (black): even depth = opponent (white), odd depth = player (black)

  // We collect all opponent moves from current nodes' children
  const opponentMoves: OpeningNode[] = [];
  for (const node of state.currentNodes) {
    opponentMoves.push(...node.children);
  }

  if (opponentMoves.length === 0) {
    state.status = "completed";
    return null;
  }

  // Pick a random opponent move
  const chosen = opponentMoves[Math.floor(Math.random() * opponentMoves.length)];

  try {
    const move = state.game.move(chosen.move);
    if (!move) {
      // Move not legal in current position, try others
      for (const alt of opponentMoves) {
        const altMove = state.game.move(alt.move);
        if (altMove) {
          updateStateAfterOpponentMove(state, alt, opponentMoves);
          state.isPlayerTurn = true;
          return altMove;
        }
      }
      state.status = "completed";
      return null;
    }
    updateStateAfterOpponentMove(state, chosen, opponentMoves);
    state.isPlayerTurn = true;
    return move;
  } catch {
    state.status = "completed";
    return null;
  }
}

function updateStateAfterOpponentMove(
  state: TrainerState,
  chosen: OpeningNode,
  _allMoves: OpeningNode[]
) {
  state.moveHistory.push({ move: chosen.move, result: null });
  if (chosen.name) {
    state.currentVariation = chosen.name;
  }
  // After opponent moves, current nodes become the children of the chosen node
  // (these are the player's possible responses)
  state.currentNodes = [chosen];
}

/**
 * Process the player's move attempt.
 */
export function processPlayerMove(
  state: TrainerState,
  san: string
): { move: Move | null; result: MoveResult } {
  if (state.status !== "playing" || !state.isPlayerTurn) {
    return {
      move: null,
      result: { type: "out_of_book", expectedMoves: [] },
    };
  }

  // Collect all valid player responses from current nodes
  const playerMoves: OpeningNode[] = [];
  for (const node of state.currentNodes) {
    playerMoves.push(...node.children);
  }

  if (playerMoves.length === 0) {
    state.status = "completed";
    return {
      move: null,
      result: { type: "end_of_line", comment: "Fin de la ligne d'ouverture ! Bien joué !" },
    };
  }

  // Try to make the move on the board
  let move: Move;
  try {
    move = state.game.move(san);
    if (!move) {
      return {
        move: null,
        result: {
          type: "out_of_book",
          expectedMoves: playerMoves.map((n) => n.move),
        },
      };
    }
  } catch {
    return {
      move: null,
      result: {
        type: "out_of_book",
        expectedMoves: playerMoves.map((n) => n.move),
      },
    };
  }

  // Check if this move matches any book move
  const exactMatch = playerMoves.find((n) => n.move === move.san);

  if (exactMatch) {
    const result: MoveResult = {
      type: "correct",
      node: exactMatch,
      comment: exactMatch.comment || "Bon coup !",
    };

    if (exactMatch.name) {
      state.currentVariation = exactMatch.name;
    }

    state.moveHistory.push({ move: move.san, result });
    state.currentNodes = [exactMatch];
    state.isPlayerTurn = false;

    // Check if this is the end of the line
    if (exactMatch.children.length === 0) {
      state.status = "completed";
      result.type = "correct";
    }

    return { move, result };
  }

  // Check if it's an alternative book move
  const altMatch = playerMoves.find((n) => {
    // Normalize: sometimes the tree has slightly different notation
    return n.move === move.san;
  });

  if (altMatch) {
    const result: MoveResult = {
      type: "book_alternative",
      node: altMatch,
      comment: altMatch.comment || "Coup alternatif dans le livre.",
    };
    state.moveHistory.push({ move: move.san, result });
    state.currentNodes = [altMatch];
    state.isPlayerTurn = false;
    return { move, result };
  }

  // Out of book — undo the move
  state.game.undo();
  const result: MoveResult = {
    type: "out_of_book",
    expectedMoves: playerMoves.map((n) => n.move),
  };
  return { move: null, result };
}

/**
 * Get a hint: returns the expected moves from the book.
 */
export function getHint(state: TrainerState): string[] {
  const playerMoves: OpeningNode[] = [];
  for (const node of state.currentNodes) {
    playerMoves.push(...node.children);
  }
  return playerMoves.map((n) => n.move);
}
