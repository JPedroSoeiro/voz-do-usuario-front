"use client";

import { Button } from "@/components/ui/button";
import { signIn, useSession, SessionProvider } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  return (
    <SessionProvider>
      <HomeContent />
    </SessionProvider>
  );
}

function HomeContent() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redireciona para a "Homepage" se já estiver logado
  useEffect(() => {
    if (session) {
      router.push("/homepage");
    }
  }, [session, router]);

  if (status === "loading") return null; // Evita piscar a tela

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 dark:bg-black p-6">
      <main className="flex flex-col items-center text-center max-w-2xl gap-8">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-black dark:text-white">
          Voz do Usuário
        </h1>
        <p className="text-xl text-zinc-600 dark:text-zinc-400">
          A plataforma para centralizar feedbacks e melhorias do nosso produto.
        </p>
        <Button
          size="lg"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8"
          onClick={() => signIn("google", { callbackUrl: "/homepage" })}
        >
          Entrar com Google
        </Button>
      </main>
    </div>
  );
}
