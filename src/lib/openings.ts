export interface OpeningNode {
  move: string; // SAN notation (e.g., "d4", "Bf4")
  name?: string; // Name of this variation
  comment?: string; // Explanation for the player
  children: OpeningNode[];
}

export interface Opening {
  id: string;
  name: string;
  description: string;
  playerColor: "white" | "black";
  tree: OpeningNode;
}

// ============================================================
// LONDON SYSTEM (White)
// ============================================================
// The player plays White and must find the correct London moves.
// The tree encodes: player moves at even depth, opponent at odd.
// Root = White's first move.
// ============================================================

const londonSystem: Opening = {
  id: "london",
  name: "Système de Londres",
  description:
    "Ouverture solide pour les Blancs basée sur d4, Bf4 et e3. Structure pyramidale robuste avec un développement harmonieux.",
  playerColor: "white",
  tree: {
    move: "d4",
    name: "Système de Londres",
    comment: "Le coup de base du Système de Londres. Contrôle du centre.",
    children: [
      {
        // Black plays d5 (most common)
        move: "d5",
        comment: "",
        children: [
          {
            move: "Bf4",
            name: "Londres — Classique",
            comment:
              "Le coup signature du Londres ! Développer le fou AVANT de jouer e3 pour ne pas l'enfermer.",
            children: [
              {
                // Black plays Nf6
                move: "Nf6",
                comment: "",
                children: [
                  {
                    move: "e3",
                    comment:
                      "Consolide le centre et ouvre la diagonale du fou de cases blanches.",
                    children: [
                      {
                        move: "c5",
                        comment: "",
                        children: [
                          {
                            move: "c3",
                            comment:
                              "Soutient d4. Si les noirs échangent en d4, on reprend avec le pion c.",
                            children: [
                              {
                                move: "Nc6",
                                comment: "",
                                children: [
                                  {
                                    move: "Nd2",
                                    comment:
                                      "Développement flexible. Le cavalier ira en f3 ou soutiendra e4.",
                                    children: [
                                      {
                                        move: "e6",
                                        comment: "",
                                        children: [
                                          {
                                            move: "Ngf3",
                                            name: "Londres — Ligne principale",
                                            comment:
                                              "Développement naturel. Contrôle e5 et prépare le roque.",
                                            children: [
                                              {
                                                move: "Bd6",
                                                comment: "",
                                                children: [
                                                  {
                                                    move: "Bg3",
                                                    comment:
                                                      "Échange le fou de cases noires adverse. Typique du Londres.",
                                                    children: [],
                                                  },
                                                ],
                                              },
                                              {
                                                move: "Be7",
                                                comment: "",
                                                children: [
                                                  {
                                                    move: "Bd3",
                                                    comment:
                                                      "Développe le fou sur sa meilleure diagonale et prépare le roque.",
                                                    children: [],
                                                  },
                                                ],
                                              },
                                            ],
                                          },
                                        ],
                                      },
                                    ],
                                  },
                                ],
                              },
                              {
                                move: "Qb6",
                                comment: "",
                                children: [
                                  {
                                    move: "Qb3",
                                    comment:
                                      "Contre-attaque sur b7. Neutralise la pression sur b2.",
                                    children: [
                                      {
                                        move: "c4",
                                        comment: "",
                                        children: [
                                          {
                                            move: "Qc2",
                                            comment:
                                              "La dame se retire mais garde le contrôle. Le pion c4 est faible.",
                                            children: [],
                                          },
                                        ],
                                      },
                                    ],
                                  },
                                ],
                              },
                            ],
                          },
                        ],
                      },
                      {
                        move: "e6",
                        comment: "",
                        children: [
                          {
                            move: "Bd3",
                            comment:
                              "Développe le fou sur sa diagonale naturelle. Vise h7.",
                            children: [
                              {
                                move: "Bd6",
                                comment: "",
                                children: [
                                  {
                                    move: "Bg3",
                                    comment:
                                      "Propose l'échange des fous de cases noires.",
                                    children: [],
                                  },
                                ],
                              },
                              {
                                move: "c5",
                                comment: "",
                                children: [
                                  {
                                    move: "c3",
                                    comment: "Renforce le centre avant tout.",
                                    children: [],
                                  },
                                ],
                              },
                            ],
                          },
                        ],
                      },
                      {
                        move: "Bf5",
                        comment: "",
                        children: [
                          {
                            move: "Bd3",
                            comment:
                              "Propose l'échange des fous. Si ...Bxd3, cxd3 donne la colonne c ouverte.",
                            children: [
                              {
                                move: "Bxd3",
                                comment: "",
                                children: [
                                  {
                                    move: "cxd3",
                                    comment: "Colonne c semi-ouverte pour la tour.",
                                    children: [],
                                  },
                                ],
                              },
                              {
                                move: "e6",
                                comment: "",
                                children: [
                                  {
                                    move: "Nf3",
                                    comment: "Développement standard.",
                                    children: [],
                                  },
                                ],
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
              {
                // Black plays c5
                move: "c5",
                comment: "",
                children: [
                  {
                    move: "e3",
                    comment: "Même plan : consolider puis développer.",
                    children: [
                      {
                        move: "Nc6",
                        comment: "",
                        children: [
                          {
                            move: "c3",
                            comment: "Soutient d4.",
                            children: [],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
              {
                // Black plays e6
                move: "e6",
                comment: "",
                children: [
                  {
                    move: "e3",
                    comment: "Plan standard.",
                    children: [
                      {
                        move: "Bd6",
                        comment: "",
                        children: [
                          {
                            move: "Bg3",
                            comment: "Échange le fou actif des noirs.",
                            children: [],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        // Black plays Nf6
        move: "Nf6",
        comment: "",
        children: [
          {
            move: "Bf4",
            name: "Londres vs Indienne",
            comment:
              "Toujours Bf4 avant e3 ! Même contre les défenses indiennes.",
            children: [
              {
                move: "g6",
                comment: "",
                children: [
                  {
                    move: "e3",
                    comment: "Structure solide.",
                    children: [
                      {
                        move: "Bg7",
                        comment: "",
                        children: [
                          {
                            move: "Nf3",
                            comment: "Développement naturel.",
                            children: [
                              {
                                move: "O-O",
                                comment: "",
                                children: [
                                  {
                                    move: "Be2",
                                    name: "Londres vs Fianchetto",
                                    comment:
                                      "Développement modeste mais solide. Prépare le roque.",
                                    children: [
                                      {
                                        move: "d6",
                                        comment: "",
                                        children: [
                                          {
                                            move: "O-O",
                                            comment: "Roque et position solide.",
                                            children: [],
                                          },
                                        ],
                                      },
                                    ],
                                  },
                                ],
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
              {
                move: "d5",
                comment: "",
                children: [
                  {
                    move: "e3",
                    comment: "Transpose dans la ligne classique.",
                    children: [],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        // Black plays e6 (could transpose)
        move: "e6",
        comment: "",
        children: [
          {
            move: "Bf4",
            comment: "Toujours le même plan.",
            children: [
              {
                move: "d5",
                comment: "",
                children: [
                  {
                    move: "e3",
                    comment: "Transpose dans la ligne classique après ...Nf6.",
                    children: [],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
};

// ============================================================
// CARO-KANN (Black)
// ============================================================
// The player plays Black and must find the Caro-Kann moves.
// Root = White's first move (opponent).
// ============================================================

const caroKann: Opening = {
  id: "caro-kann",
  name: "Défense Caro-Kann",
  description:
    "Défense solide pour les Noirs contre 1.e4. Structure robuste avec c6 et d5 pour contester le centre.",
  playerColor: "black",
  tree: {
    move: "e4",
    name: "Défense Caro-Kann",
    comment: "",
    children: [
      {
        move: "c6",
        comment:
          "Le coup caractéristique de la Caro-Kann ! Prépare d5 pour contester le centre.",
        children: [
          {
            // White plays d4 (main line)
            move: "d4",
            comment: "",
            children: [
              {
                move: "d5",
                comment: "Attaque le centre blanc. Le pion c6 soutient d5.",
                children: [
                  {
                    // Advance variation: e5
                    move: "e5",
                    name: "Caro-Kann — Variante d'avance",
                    comment: "",
                    children: [
                      {
                        move: "Bf5",
                        comment:
                          "Développe le fou AVANT de jouer e6. C'est l'avantage principal de la Caro-Kann !",
                        children: [
                          {
                            move: "Bd3",
                            comment: "",
                            children: [
                              {
                                move: "Bxd3",
                                comment: "Échange favorable. Élimine le bon fou blanc.",
                                children: [
                                  {
                                    move: "Qxd3",
                                    comment: "",
                                    children: [
                                      {
                                        move: "e6",
                                        comment:
                                          "Solidifie la structure. Le fou de cases claires a déjà été développé.",
                                        children: [
                                          {
                                            move: "Nc3",
                                            comment: "",
                                            children: [
                                              {
                                                move: "Nd7",
                                                comment:
                                                  "Développement flexible. Le cavalier ira en e7 ou f8 selon les besoins.",
                                                children: [
                                                  {
                                                    move: "Nge2",
                                                    comment: "",
                                                    children: [
                                                      {
                                                        move: "Ne7",
                                                        name: "Caro-Kann Avance — Ligne classique",
                                                        comment:
                                                          "Le cavalier vise f5, un poste idéal.",
                                                        children: [
                                                          {
                                                            move: "O-O",
                                                            comment: "",
                                                            children: [
                                                              {
                                                                move: "Nf5",
                                                                comment: "Poste dominant pour le cavalier.",
                                                                children: [],
                                                              },
                                                            ],
                                                          },
                                                        ],
                                                      },
                                                    ],
                                                  },
                                                  {
                                                    move: "Nf3",
                                                    comment: "",
                                                    children: [
                                                      {
                                                        move: "Ne7",
                                                        comment: "Même plan : viser f5.",
                                                        children: [],
                                                      },
                                                    ],
                                                  },
                                                ],
                                              },
                                            ],
                                          },
                                          {
                                            move: "Nf3",
                                            comment: "",
                                            children: [
                                              {
                                                move: "Nd7",
                                                comment: "Même plan flexible.",
                                                children: [],
                                              },
                                            ],
                                          },
                                        ],
                                      },
                                    ],
                                  },
                                ],
                              },
                            ],
                          },
                          {
                            move: "Nf3",
                            comment: "",
                            children: [
                              {
                                move: "e6",
                                comment: "Solidifie. Le fou est déjà sorti.",
                                children: [
                                  {
                                    move: "Be2",
                                    comment: "",
                                    children: [
                                      {
                                        move: "Nd7",
                                        comment: "Développement flexible.",
                                        children: [],
                                      },
                                    ],
                                  },
                                ],
                              },
                            ],
                          },
                          {
                            move: "Nc3",
                            comment: "",
                            children: [
                              {
                                move: "e6",
                                comment: "Structure solide.",
                                children: [
                                  {
                                    move: "g4",
                                    name: "Caro-Kann — Attaque Bayonet",
                                    comment: "",
                                    children: [
                                      {
                                        move: "Bg6",
                                        comment:
                                          "Le fou recule sur la diagonale. Reste actif.",
                                        children: [],
                                      },
                                    ],
                                  },
                                ],
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                  {
                    // Exchange variation: exd5
                    move: "exd5",
                    name: "Caro-Kann — Variante d'échange",
                    comment: "",
                    children: [
                      {
                        move: "cxd5",
                        comment:
                          "Reprend avec le pion c. Structure symétrique mais le fou de cases claires est libre.",
                        children: [
                          {
                            move: "Bd3",
                            comment: "",
                            children: [
                              {
                                move: "Nc6",
                                comment: "Développement naturel. Pression sur d4.",
                                children: [
                                  {
                                    move: "c3",
                                    comment: "",
                                    children: [
                                      {
                                        move: "Nf6",
                                        comment: "Développement standard.",
                                        children: [
                                          {
                                            move: "Bf4",
                                            comment: "",
                                            children: [
                                              {
                                                move: "Bg4",
                                                comment:
                                                  "Épingle ou gêne le développement blanc.",
                                                children: [],
                                              },
                                            ],
                                          },
                                        ],
                                      },
                                    ],
                                  },
                                ],
                              },
                            ],
                          },
                          {
                            move: "Nf3",
                            comment: "",
                            children: [
                              {
                                move: "Bf5",
                                comment:
                                  "Sort le fou avant e6. Avantage clé de la Caro-Kann.",
                                children: [
                                  {
                                    move: "Nc3",
                                    comment: "",
                                    children: [
                                      {
                                        move: "e6",
                                        comment: "Maintenant on ferme la diagonale, le fou est déjà actif.",
                                        children: [],
                                      },
                                    ],
                                  },
                                ],
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                  {
                    // Nc3 main line (Classical/Modern)
                    move: "Nc3",
                    comment: "",
                    children: [
                      {
                        move: "dxe4",
                        comment: "Prend le pion. Ligne principale de la classique.",
                        children: [
                          {
                            move: "Nxe4",
                            name: "Caro-Kann — Variante classique",
                            comment: "",
                            children: [
                              {
                                move: "Bf5",
                                comment:
                                  "Développe le fou. La raison d'être de la Caro-Kann !",
                                children: [
                                  {
                                    move: "Ng3",
                                    comment: "",
                                    children: [
                                      {
                                        move: "Bg6",
                                        comment: "Le fou reste sur la diagonale.",
                                        children: [
                                          {
                                            move: "h4",
                                            comment: "",
                                            children: [
                                              {
                                                move: "h6",
                                                comment:
                                                  "Empêche h5 qui gagnerait la paire de fous.",
                                                children: [
                                                  {
                                                    move: "Nf3",
                                                    comment: "",
                                                    children: [
                                                      {
                                                        move: "Nd7",
                                                        name: "Caro-Kann Classique — Ligne principale",
                                                        comment:
                                                          "Le cavalier se développe. Ira en gf6 ou e7.",
                                                        children: [
                                                          {
                                                            move: "h5",
                                                            comment: "",
                                                            children: [
                                                              {
                                                                move: "Bh7",
                                                                comment: "Le fou se met à l'abri.",
                                                                children: [
                                                                  {
                                                                    move: "Bd3",
                                                                    comment: "",
                                                                    children: [
                                                                      {
                                                                        move: "Bxd3",
                                                                        comment: "Échange favorable.",
                                                                        children: [
                                                                          {
                                                                            move: "Qxd3",
                                                                            comment: "",
                                                                            children: [
                                                                              {
                                                                                move: "e6",
                                                                                comment: "Structure solide.",
                                                                                children: [],
                                                                              },
                                                                            ],
                                                                          },
                                                                        ],
                                                                      },
                                                                    ],
                                                                  },
                                                                ],
                                                              },
                                                            ],
                                                          },
                                                        ],
                                                      },
                                                    ],
                                                  },
                                                ],
                                              },
                                            ],
                                          },
                                          {
                                            move: "Nf3",
                                            comment: "",
                                            children: [
                                              {
                                                move: "Nd7",
                                                comment: "Développement flexible.",
                                                children: [
                                                  {
                                                    move: "Bd3",
                                                    comment: "",
                                                    children: [
                                                      {
                                                        move: "Bxd3",
                                                        comment: "Échange.",
                                                        children: [],
                                                      },
                                                    ],
                                                  },
                                                ],
                                              },
                                            ],
                                          },
                                        ],
                                      },
                                    ],
                                  },
                                  {
                                    move: "Nxf6+",
                                    comment: "",
                                    children: [
                                      {
                                        move: "exf6",
                                        comment: "Reprend vers le centre. Ouvre la colonne e pour la tour.",
                                        name: "Caro-Kann — Variante Bronstein-Larsen",
                                        children: [],
                                      },
                                      {
                                        move: "gxf6",
                                        name: "Caro-Kann — Variante Korchnoi",
                                        comment:
                                          "Prise agressive. Structure abîmée mais activité des pièces.",
                                        children: [],
                                      },
                                    ],
                                  },
                                ],
                              },
                              {
                                move: "Nd7",
                                name: "Caro-Kann — Variante moderne",
                                comment:
                                  "Alternative à Bf5. Plus flexible mais retarde le développement du fou.",
                                children: [
                                  {
                                    move: "Nf3",
                                    comment: "",
                                    children: [
                                      {
                                        move: "Ngf6",
                                        comment: "Attaque le cavalier centralisé.",
                                        children: [
                                          {
                                            move: "Nxf6+",
                                            comment: "",
                                            children: [
                                              {
                                                move: "Nxf6",
                                                comment: "Reprend et développe.",
                                                children: [],
                                              },
                                            ],
                                          },
                                        ],
                                      },
                                    ],
                                  },
                                ],
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                  {
                    // f3 Fantasy variation
                    move: "f3",
                    name: "Caro-Kann — Variante Fantaisie",
                    comment: "",
                    children: [
                      {
                        move: "dxe4",
                        comment: "Accepte le gambit. Bon pour les noirs.",
                        children: [
                          {
                            move: "fxe4",
                            comment: "",
                            children: [
                              {
                                move: "e5",
                                comment:
                                  "Contre-attaque au centre ! Profite de la faiblesse e4.",
                                children: [],
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                  {
                    // Nd2 (Tartakower)
                    move: "Nd2",
                    comment: "",
                    children: [
                      {
                        move: "dxe4",
                        comment: "Prend le pion.",
                        children: [
                          {
                            move: "Nxe4",
                            comment: "",
                            children: [
                              {
                                move: "Bf5",
                                name: "Caro-Kann vs Nd2",
                                comment: "Même plan : sortir le fou.",
                                children: [],
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            // White plays Nc3
            move: "Nc3",
            comment: "",
            children: [
              {
                move: "d5",
                comment: "Même plan : contester le centre.",
                children: [],
              },
            ],
          },
          {
            // White plays d3 (King's Indian Attack setup)
            move: "d3",
            comment: "",
            children: [
              {
                move: "d5",
                comment: "Prend l'espace au centre.",
                children: [
                  {
                    move: "Nd2",
                    comment: "",
                    children: [
                      {
                        move: "e5",
                        comment: "Domine le centre !",
                        children: [],
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            // White plays Nf3
            move: "Nf3",
            comment: "",
            children: [
              {
                move: "d5",
                comment: "Conteste le centre.",
                children: [],
              },
            ],
          },
        ],
      },
    ],
  },
};

export const openings: Opening[] = [londonSystem, caroKann];

export function getOpeningById(id: string): Opening | undefined {
  return openings.find((o) => o.id === id);
}
