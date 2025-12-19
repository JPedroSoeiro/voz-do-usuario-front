"use client";

import { useState } from "react";
import { Search, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

const stats = [
  {
    name: "Melhorar performance da plataforma",
    votes: 42,
    email: "joao@exemplo.com",
    status: "Em análise",
    category: "Melhoria",
  },
  {
    name: "Adicionar modo escuro",
    votes: 38,
    email: "maria@exemplo.com",
    status: "Pendente",
    category: "Melhoria",
  },
  {
    name: "Integração com Slack",
    votes: 12,
    email: "pedro@exemplo.com",
    status: "Em progresso",
    category: "Funcionalidade",
  },
  {
    name: "App para Mobile",
    votes: 85,
    email: "ana@exemplo.com",
    status: "Concluído",
    category: "Funcionalidade",
  },
];

export default function HomepageComponent() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredStats = stats.filter((stat) =>
    stat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col">
      {/* Header com botão de Login */}
      <header className="bg-white border-b w-full h-16 flex items-center justify-between px-8 shrink-0">
        <span className="text-xl font-extrabold text-black">
          Voz do Usuário
        </span>
        <Link href="/login">
          <Button variant="outline" className="font-semibold">
            Login
          </Button>
        </Link>
      </header>

      {/* Conteúdo Centralizado */}
      <main className="flex-1 flex flex-col items-center pt-20 px-4">
        <div className="w-full max-w-3xl text-center space-y-6">
          <h1 className="text-5xl font-black text-gray-900 tracking-tight">
            Compartilhe seu Feedback
          </h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            Ajude-nos a melhorar compartilhando suas ideias e reportando
            problemas.
          </p>

          <Button
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 gap-2 h-12 px-8 text-md shadow-lg transition-transform active:scale-95"
          >
            <PlusCircle className="h-5 w-5" />
            Criar Feedback
          </Button>
        </div>

        {/* Input de Pesquisa centralizado */}
        <div className="w-full max-w-2xl mt-16 space-y-6">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Pesquisar feedbacks existentes..."
              className="pl-12 h-12 bg-white shadow-sm text-md border-gray-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Cards apenas com votos (sem edição) */}
          <div className="flex flex-col gap-3 pb-20">
            {filteredStats.map((stat) => (
              <div
                key={stat.name}
                className="bg-white shadow-sm rounded-xl border border-gray-100 w-full p-5 hover:border-blue-300 transition-all cursor-default"
              >
                <div className="flex justify-between items-center">
                  <div className="flex flex-col gap-1">
                    <span className="text-md font-bold text-gray-900">
                      {stat.name}
                    </span>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md font-semibold uppercase tracking-wider text-[10px]">
                        {stat.category}
                      </span>
                      <span className="text-gray-300">•</span>
                      <span>{stat.status}</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-center bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
                    <span className="text-lg font-bold text-blue-600 leading-none">
                      {stat.votes}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-gray-400">
                      Votos
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
