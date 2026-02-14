"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { Chessboard } from "react-chessboard";
import { Square } from "chess.js";
import { Opening } from "@/lib/openings";
import {
  TrainerState,
  initTrainer,
  processPlayerMove,
  playOpponentMove,
  getHint,
  MoveResult,
} from "@/lib/trainer";

interface Props {
  opening: Opening;
  onBack: () => void;
}

export default function ChessTrainer({ opening, onBack }: Props) {
  const [trainerState, setTrainerState] = useState<TrainerState>(() =>
    initTrainer(opening)
  );
  const [feedback, setFeedback] = useState<{
    type: "correct" | "error" | "info" | "complete";
    message: string;
  } | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [hintMoves, setHintMoves] = useState<string[]>([]);
  const [moveCount, setMoveCount] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [errorCount, setErrorCount] = useState(0);
  const [lastMoveSquares, setLastMoveSquares] = useState<
    Record<string, React.CSSProperties>
  >({});

  const boardOrientation = opening.playerColor === "white" ? "white" : "black";
  const fen = trainerState.game.fen();

  const moveList = useMemo(() => {
    const history = trainerState.game.history();
    const pairs: { num: number; white: string; black?: string }[] = [];
    for (let i = 0; i < history.length; i += 2) {
      pairs.push({
        num: Math.floor(i / 2) + 1,
        white: history[i],
        black: history[i + 1],
      });
    }
    return pairs;
  }, [fen]); // eslint-disable-line react-hooks/exhaustive-deps

  const scheduleOpponentMove = useCallback(
    (state: TrainerState) => {
      if (state.status !== "playing") return;
      setTimeout(() => {
        const move = playOpponentMove(state);
        if (move) {
          setLastMoveSquares({
            [move.from]: { backgroundColor: "rgba(255, 170, 0, 0.3)" },
            [move.to]: { backgroundColor: "rgba(255, 170, 0, 0.3)" },
          });
          if (state.status === "completed") {
            setFeedback({
              type: "complete",
              message:
                "Fin de la ligne d'ouverture ! Vous avez terminé cette variante.",
            });
          }
        } else if (state.status === "completed") {
          setFeedback({
            type: "complete",
            message:
              "Fin de la ligne d'ouverture ! Vous avez terminé cette variante.",
          });
        }
        setTrainerState({ ...state });
      }, 500);
    },
    []
  );

  // For Caro-Kann (black), trigger initial opponent move display
  useEffect(() => {
    if (
      opening.playerColor === "black" &&
      trainerState.game.history().length === 1 &&
      moveCount === 0
    ) {
      const history = trainerState.game.history({ verbose: true });
      if (history.length > 0) {
        const lastMove = history[history.length - 1];
        setLastMoveSquares({
          [lastMove.from]: { backgroundColor: "rgba(255, 170, 0, 0.3)" },
          [lastMove.to]: { backgroundColor: "rgba(255, 170, 0, 0.3)" },
        });
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function onDrop(sourceSquare: Square, targetSquare: Square): boolean {
    if (!trainerState.isPlayerTurn || trainerState.status !== "playing") {
      return false;
    }

    setShowHint(false);

    // Try to determine the SAN for this move
    const possibleMoves = trainerState.game.moves({ verbose: true });
    const matchingMove = possibleMoves.find(
      (m) => m.from === sourceSquare && m.to === targetSquare
    );

    if (!matchingMove) return false;

    const { move, result } = processPlayerMove(
      trainerState,
      matchingMove.san
    );

    if (!move) {
      handleMoveResult(result);
      return false;
    }

    setMoveCount((c) => c + 1);
    setLastMoveSquares({
      [move.from]: { backgroundColor: "rgba(100, 200, 100, 0.3)" },
      [move.to]: { backgroundColor: "rgba(100, 200, 100, 0.3)" },
    });

    handleMoveResult(result);

    // Schedule opponent response
    if (trainerState.status === "playing") {
      scheduleOpponentMove(trainerState);
    }

    setTrainerState({ ...trainerState });
    return true;
  }

  function handleMoveResult(result: MoveResult) {
    switch (result.type) {
      case "correct":
        setCorrectCount((c) => c + 1);
        setFeedback({
          type: "correct",
          message: result.comment || "Bon coup !",
        });
        if (
          trainerState.status === "completed" ||
          ("node" in result && result.node.children.length === 0)
        ) {
          setTimeout(() => {
            setFeedback({
              type: "complete",
              message:
                "Bravo ! Vous avez terminé cette ligne d'ouverture !",
            });
          }, 600);
        }
        break;
      case "book_alternative":
        setCorrectCount((c) => c + 1);
        setFeedback({
          type: "info",
          message: result.comment || "Coup alternatif valide.",
        });
        break;
      case "out_of_book":
        setErrorCount((c) => c + 1);
        setFeedback({
          type: "error",
          message: `Ce n'est pas le coup théorique. Coup(s) attendu(s) : ${result.expectedMoves.join(", ")}`,
        });
        break;
      case "end_of_line":
        setFeedback({
          type: "complete",
          message: result.comment,
        });
        break;
    }
  }

  function handleHint() {
    const hints = getHint(trainerState);
    setHintMoves(hints);
    setShowHint(true);
  }

  function handleReset() {
    const newState = initTrainer(opening);
    setTrainerState(newState);
    setFeedback(null);
    setShowHint(false);
    setHintMoves([]);
    setMoveCount(0);
    setCorrectCount(0);
    setErrorCount(0);
    setLastMoveSquares({});

    if (opening.playerColor === "black") {
      const history = newState.game.history({ verbose: true });
      if (history.length > 0) {
        const lastMove = history[history.length - 1];
        setLastMoveSquares({
          [lastMove.from]: { backgroundColor: "rgba(255, 170, 0, 0.3)" },
          [lastMove.to]: { backgroundColor: "rgba(255, 170, 0, 0.3)" },
        });
      }
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Retour
          </button>
          <h1 className="text-xl font-bold">{opening.name}</h1>
          <div className="text-sm text-gray-400">
            Vous jouez les{" "}
            <span
              className={
                opening.playerColor === "white"
                  ? "text-white font-semibold"
                  : "text-gray-300 font-semibold"
              }
            >
              {opening.playerColor === "white" ? "Blancs" : "Noirs"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chessboard */}
          <div className="lg:col-span-2 flex justify-center">
            <div className="w-full max-w-[600px]">
              <Chessboard
                position={fen}
                onPieceDrop={onDrop}
                boardOrientation={boardOrientation}
                customBoardStyle={{
                  borderRadius: "8px",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
                }}
                customDarkSquareStyle={{ backgroundColor: "#779952" }}
                customLightSquareStyle={{ backgroundColor: "#edeed1" }}
                customSquareStyles={lastMoveSquares}
                animationDuration={200}
              />
            </div>
          </div>

          {/* Side Panel */}
          <div className="space-y-4">
            {/* Variation Name */}
            <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
              <h3 className="text-sm text-gray-400 mb-1">Variante</h3>
              <p className="text-lg font-semibold">
                {trainerState.currentVariation}
              </p>
            </div>

            {/* Stats */}
            <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
              <h3 className="text-sm text-gray-400 mb-3">Statistiques</h3>
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center">
                  <div className="text-2xl font-bold">{moveCount}</div>
                  <div className="text-xs text-gray-400">Coups</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">
                    {correctCount}
                  </div>
                  <div className="text-xs text-gray-400">Corrects</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-400">
                    {errorCount}
                  </div>
                  <div className="text-xs text-gray-400">Erreurs</div>
                </div>
              </div>
            </div>

            {/* Feedback */}
            {feedback && (
              <div
                className={`rounded-xl p-4 border ${
                  feedback.type === "correct"
                    ? "bg-green-900/30 border-green-800 text-green-300"
                    : feedback.type === "error"
                      ? "bg-red-900/30 border-red-800 text-red-300"
                      : feedback.type === "complete"
                        ? "bg-blue-900/30 border-blue-800 text-blue-300"
                        : "bg-yellow-900/30 border-yellow-800 text-yellow-300"
                }`}
              >
                <div className="flex items-start gap-2">
                  <span className="text-lg">
                    {feedback.type === "correct"
                      ? "✓"
                      : feedback.type === "error"
                        ? "✗"
                        : feedback.type === "complete"
                          ? "★"
                          : "i"}
                  </span>
                  <p className="text-sm">{feedback.message}</p>
                </div>
              </div>
            )}

            {/* Hint */}
            {showHint && hintMoves.length > 0 && (
              <div className="bg-purple-900/30 rounded-xl p-4 border border-purple-800">
                <h3 className="text-sm text-purple-300 mb-2">Indice</h3>
                <p className="text-sm text-purple-200">
                  Coup(s) attendu(s) :{" "}
                  <span className="font-mono font-bold">
                    {hintMoves.join(", ")}
                  </span>
                </p>
              </div>
            )}

            {/* Move List */}
            <div className="bg-gray-900 rounded-xl p-4 border border-gray-800 max-h-48 overflow-y-auto">
              <h3 className="text-sm text-gray-400 mb-2">Coups joués</h3>
              {moveList.length === 0 ? (
                <p className="text-sm text-gray-500 italic">
                  Aucun coup joué
                </p>
              ) : (
                <div className="space-y-1 font-mono text-sm">
                  {moveList.map((pair) => (
                    <div key={pair.num} className="flex gap-2">
                      <span className="text-gray-500 w-8">{pair.num}.</span>
                      <span className="text-white">{pair.white}</span>
                      {pair.black && (
                        <span className="text-gray-300">{pair.black}</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleHint}
                disabled={
                  trainerState.status !== "playing" ||
                  !trainerState.isPlayerTurn
                }
                className="flex-1 px-4 py-3 bg-purple-700 hover:bg-purple-600 disabled:bg-gray-700 disabled:text-gray-500 rounded-xl text-sm font-medium transition-colors"
              >
                Indice
              </button>
              <button
                onClick={handleReset}
                className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl text-sm font-medium transition-colors"
              >
                Recommencer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
