import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chess Opening Trainer",
  description: "Entraînez-vous aux ouvertures d'échecs : Système de Londres, Caro-Kann et plus",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="antialiased">{children}</body>
    </html>
  );
}
