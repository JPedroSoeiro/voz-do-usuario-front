import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Voz do Usuário",
  description: "Feedback app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
