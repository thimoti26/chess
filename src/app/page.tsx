"use client";

import { useState } from "react";
import { Opening } from "@/lib/openings";
import OpeningSelector from "@/components/OpeningSelector";
import ChessTrainer from "@/components/ChessTrainer";

export default function Home() {
  const [selectedOpening, setSelectedOpening] = useState<Opening | null>(null);

  if (selectedOpening) {
    return (
      <ChessTrainer
        key={selectedOpening.id + Date.now()}
        opening={selectedOpening}
        onBack={() => setSelectedOpening(null)}
      />
    );
  }

  return <OpeningSelector onSelect={setSelectedOpening} />;
}
