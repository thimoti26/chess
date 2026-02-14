"use client";

import { Opening, openings } from "@/lib/openings";

interface Props {
  onSelect: (opening: Opening) => void;
}

export default function OpeningSelector({ onSelect }: Props) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">♟</div>
          <h1 className="text-4xl font-bold mb-3">Chess Opening Trainer</h1>
          <p className="text-gray-400 text-lg">
            Entraînez-vous aux ouvertures d&apos;échecs. Choisissez une
            ouverture et testez vos connaissances contre la théorie.
          </p>
        </div>

        {/* Opening Cards */}
        <div className="grid gap-4 sm:grid-cols-2">
          {openings.map((opening) => (
            <button
              key={opening.id}
              onClick={() => onSelect(opening)}
              className="group text-left bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-gray-600 hover:bg-gray-800/50 transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-3">
                <span
                  className={`text-3xl ${
                    opening.playerColor === "white"
                      ? "drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]"
                      : ""
                  }`}
                >
                  {opening.playerColor === "white" ? "♔" : "♚"}
                </span>
                <span
                  className={`text-xs font-medium px-3 py-1 rounded-full ${
                    opening.playerColor === "white"
                      ? "bg-white/10 text-white"
                      : "bg-gray-700 text-gray-300"
                  }`}
                >
                  {opening.playerColor === "white" ? "Blancs" : "Noirs"}
                </span>
              </div>
              <h2 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors">
                {opening.name}
              </h2>
              <p className="text-sm text-gray-400 leading-relaxed">
                {opening.description}
              </p>
              <div className="mt-4 text-sm text-gray-500 group-hover:text-gray-400 transition-colors flex items-center gap-1">
                Commencer l&apos;entraînement
                <svg
                  className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-sm text-gray-600">
          <p>
            Jouez les coups théoriques de l&apos;ouverture.
            L&apos;adversaire répondra automatiquement.
          </p>
        </div>
      </div>
    </div>
  );
}
