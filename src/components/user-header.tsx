"use client";

import Link from "next/link";
import { useAuth } from "@/src/lib/auth-context";
import { Button } from "@/components/ui/button";

export function UserHeader() {
  const { user, signOut, loading } = useAuth();

  // Pega a primeira letra do email para o "avatar"
  const userInitial = user?.email ? user.email[0].toUpperCase() : "?";

  return (
    <header className="sticky top-0 z-10 w-full border-b bg-white px-6 py-4 shadow-sm dark:bg-zinc-950">
      <div className="mx-auto flex max-w-4xl items-center justify-between">
        <h1 className="text-xl font-bold text-blue-600">Voz do Usuário</h1>

        <div>
          {loading ? (
            <span className="text-sm text-gray-400">Carregando...</span>
          ) : user ? (
            <div className="flex items-center gap-4">
              {/* O Indicativo Visual que você pediu */}
              <div className="flex items-center gap-3 bg-gray-100 rounded-full pl-1 pr-4 py-1 border border-gray-200">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                  {userInitial}
                </div>
                <span className="text-sm font-medium text-gray-700 hidden sm:block">
                  {user.email}
                </span>
              </div>

              <Button
                variant="ghost"
                className="text-red-500 hover:text-red-600 hover:bg-red-50"
                onClick={signOut}
              >
                Sair
              </Button>
            </div>
          ) : (
            <Link href="/login">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Entrar com Google
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
