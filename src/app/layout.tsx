import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "../providers/auth-provider";

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
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
