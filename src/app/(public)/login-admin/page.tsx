"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginAdmin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Hooks do NextAuth e Router
  const { status } = useSession();
  const router = useRouter();

  // 🔄 EFEITO: Redireciona assim que o status virar "authenticated"
  useEffect(() => {
    if (status === "authenticated") {
      // Como a pasta (admin) é um grupo de rotas, ela não aparece na URL.
      // O caminho correto é direto /dashboard
      console.log("Admin logado! Redirecionando para Dashboard...");
      router.push("/dashboard");
    }
  }, [status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Tenta o login usando o provider "credentials" (Admin)
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false, // Importante: deixamos o useEffect fazer o redirecionamento
    });

    if (result?.error) {
      setError("Login falhou. Verifique email e senha.");
      setLoading(false);
    }
    // Se der certo, o 'status' mudará para 'authenticated' e o useEffect vai disparar.
  };

  // Exibe um "Carregando" enquanto verifica a sessão ou redireciona
  if (status === "authenticated" || status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-600">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-lg font-medium">
          {status === "authenticated"
            ? "Entrando no sistema..."
            : "Verificando sessão..."}
        </p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded shadow-md w-96">
        <h1 className="mb-6 text-2xl font-bold text-center text-gray-800">
          Admin Login
        </h1>

        {error && (
          <div className="mb-4 p-2 text-sm text-red-600 bg-red-100 rounded border border-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="admin@voz.com"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="******"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 font-bold text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? "Verificando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
