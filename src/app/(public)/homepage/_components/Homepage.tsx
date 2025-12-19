"use client";

import { useState, useMemo } from "react";
import { Search, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";

const initialStats = [
  {
    id: 1,
    name: "Melhorar performance da plataforma",
    votes: 42,
    status: "em analise",
    category: "Melhoria",
    priority: "Alta",
    email: "user1@exemplo.com",
    createdAt: "2025-12-01",
  },
  {
    id: 2,
    name: "Adicionar modo escuro",
    votes: 38,
    status: "novo",
    category: "Melhoria",
    priority: "Media",
    email: "user2@exemplo.com",
    createdAt: "2025-12-15",
  },
  {
    id: 3,
    name: "Integração com Slack",
    votes: 12,
    status: "Em progresso",
    category: "Funcionalidade",
    priority: "Baixa",
    email: "user3@exemplo.com",
    createdAt: "2025-11-20",
  },
  {
    id: 4,
    name: "App para Mobile",
    votes: 85,
    status: "concluido",
    category: "Funcionalidade",
    priority: "Alta",
    email: "user4@exemplo.com",
    createdAt: "2025-12-18",
  },
  {
    id: 5,
    name: "Erro ao carregar fotos no perfil",
    votes: 27,
    status: "novo",
    category: "Bug",
    priority: "Alta",
    email: "suporte@empresa.com",
    createdAt: "2025-12-19",
  },
  {
    id: 6,
    name: "Exportação de relatórios em PDF",
    votes: 54,
    status: "Planejado",
    category: "Funcionalidade",
    priority: "Media",
    email: "admin@loja.com",
    createdAt: "2025-12-10",
  },
  {
    id: 7,
    name: "Tradução para Espanhol",
    votes: 8,
    status: "em analise",
    category: "Outro",
    priority: "Baixa",
    email: "global@test.com",
    createdAt: "2025-12-05",
  },
  {
    id: 8,
    name: "Botão de 'Sair' não funciona no Safari",
    votes: 19,
    status: "Em progresso",
    category: "Bug",
    priority: "Alta",
    email: "dev@navegador.com",
    createdAt: "2025-12-17",
  },
  {
    id: 9,
    name: "Sistema de notificações push",
    votes: 63,
    status: "Planejado",
    category: "Melhoria",
    priority: "Media",
    email: "marketing@app.com",
    createdAt: "2025-12-12",
  },
  {
    id: 10,
    name: "Permitir login com LinkedIn",
    votes: 31,
    status: "novo",
    category: "Funcionalidade",
    priority: "Baixa",
    email: "rh@corporativo.com",
    createdAt: "2025-12-19",
  },
];

export default function HomepageComponent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("recent");

  const filteredAndSortedStats = useMemo(() => {
    let result = initialStats.filter((stat) => {
      const matchesSearch = stat.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        categoryFilter === "all" ||
        (categoryFilter === "Outro"
          ? !["Funcionalidade", "Bug", "Melhoria"].includes(stat.category)
          : stat.category === categoryFilter);

      return matchesSearch && matchesCategory;
    });

    if (sortOrder === "votes") {
      result.sort((a, b) => b.votes - a.votes);
    } else {
      result.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    return result;
  }, [searchTerm, categoryFilter, sortOrder]);

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col">
      {/* Header mais fino (h-14 em vez de h-16) */}
      <header className="bg-white border-b w-full h-14 flex items-center justify-between px-6 shrink-0">
        <span className="text-lg font-extrabold text-black">
          Voz do Usuário
        </span>
        <Link href="/login">
          <Button variant="outline" size="sm" className="font-semibold">
            Login
          </Button>
        </Link>
      </header>

      {/* Reduzi o pt-20 para pt-10 para ganhar espaço no topo */}
      <main className="flex-1 flex flex-col items-center pt-10 px-4">
        <div className="w-full max-w-2xl text-center space-y-4">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">
            Compartilhe seu Feedback
          </h1>
          <p className="text-base text-gray-600 max-w-lg mx-auto leading-tight">
            Ajude-nos a melhorar compartilhando suas ideias e reportando
            problemas.
          </p>

          <Button
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 gap-2 h-10 px-6 shadow-md"
          >
            <PlusCircle className="h-4 w-4" />
            Criar Feedback
          </Button>
        </div>

        <div className="w-full max-w-3xl mt-10 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full">
            {/* Metade da esquerda: Input de Pesquisa */}
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Pesquisar feedbacks..."
                className="pl-10 h-10 bg-white text-sm w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="h-10 bg-white text-sm w-full">
                  <SelectValue placeholder="Categorias" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as categorias</SelectItem>
                  <SelectItem value="Funcionalidade">Funcionalidade</SelectItem>
                  <SelectItem value="Bug">Bug</SelectItem>
                  <SelectItem value="Melhoria">Melhoria</SelectItem>
                  <SelectItem value="Outro">Outro</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortOrder} onValueChange={setSortOrder}>
                <SelectTrigger className="h-10 bg-white text-sm w-full">
                  <SelectValue placeholder="Ordenar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Mais recentes</SelectItem>
                  <SelectItem value="votes">Mais votados</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Cards menores: gap-2 e p-3 em vez de p-5 */}
          <div className="flex flex-col gap-2 pb-10">
            {filteredAndSortedStats.map((stat) => (
              <div
                key={stat.id}
                className="bg-white shadow-sm rounded-lg border border-gray-100 w-full p-3 hover:border-blue-300 transition-all"
              >
                <div className="flex justify-between items-center">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-bold text-gray-900 leading-tight">
                      {stat.name}
                    </span>
                    <div className="flex items-center gap-2 text-[10px] text-gray-500">
                      <span className="font-semibold text-blue-600 uppercase">
                        {stat.category}
                      </span>
                      <span>•</span>
                      <span className="capitalize">{stat.status}</span>
                    </div>
                  </div>

                  {/* Box de votos reduzido */}
                  <div className="flex flex-col items-center bg-gray-50 px-3 py-1 rounded border border-gray-100 min-w-60px">
                    <span className="text-md font-bold text-blue-600 leading-none">
                      {stat.votes}
                    </span>
                    <span className="text-[9px] uppercase font-bold text-gray-400 tracking-tighter">
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
