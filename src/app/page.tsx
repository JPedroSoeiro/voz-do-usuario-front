"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Search, PlusCircle, Lock } from "lucide-react";

// Imports do ShadCN UI (Verifique se os caminhos batem com seu projeto)
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CreateFeedback from "./(public)/homepage/_components/CreateFeedback";

// Imports do NextAuth
import { SessionProvider, useSession, signIn, signOut } from "next-auth/react";

// --- DADOS MOCKADOS (Temporário até conectar com API) ---
const initialStats = [
  {
    id: 1,
    name: "Melhorar performance da plataforma",
    votes: 42,
    status: "em analise",
    category: "Melhoria",
    priority: "Alta",
    createdAt: "2025-12-01",
  },
  {
    id: 2,
    name: "Adicionar modo escuro",
    votes: 38,
    status: "novo",
    category: "Melhoria",
    priority: "Media",
    createdAt: "2025-12-15",
  },
  {
    id: 3,
    name: "Integração com Slack",
    votes: 12,
    status: "Em progresso",
    category: "Funcionalidade",
    priority: "Baixa",
    createdAt: "2025-11-20",
  },
  {
    id: 4,
    name: "App para Mobile",
    votes: 85,
    status: "concluido",
    category: "Funcionalidade",
    priority: "Alta",
    createdAt: "2025-12-18",
  },
  {
    id: 5,
    name: "Erro ao carregar fotos no perfil",
    votes: 27,
    status: "novo",
    category: "Bug",
    priority: "Alta",
    createdAt: "2025-12-19",
  },
  {
    id: 6,
    name: "Exportação de relatórios em PDF",
    votes: 54,
    status: "Planejado",
    category: "Funcionalidade",
    priority: "Media",
    createdAt: "2025-12-10",
  },
  {
    id: 7,
    name: "Tradução para Espanhol",
    votes: 8,
    status: "em analise",
    category: "Outro",
    priority: "Baixa",
    createdAt: "2025-12-05",
  },
  {
    id: 8,
    name: "Botão de 'Sair' não funciona no Safari",
    votes: 19,
    status: "Em progresso",
    category: "Bug",
    priority: "Alta",
    createdAt: "2025-12-17",
  },
  {
    id: 9,
    name: "Sistema de notificações push",
    votes: 63,
    status: "Planejado",
    category: "Melhoria",
    priority: "Media",
    createdAt: "2025-12-12",
  },
  {
    id: 10,
    name: "Permitir login com LinkedIn",
    votes: 31,
    status: "novo",
    category: "Funcionalidade",
    priority: "Baixa",
    createdAt: "2025-12-19",
  },
];

// --- COMPONENTE PRINCIPAL (WRAPPER) ---
// Necessário para fornecer o Contexto de Sessão para a página
export default function Page() {
  return (
    <SessionProvider>
      <HomePageContent />
    </SessionProvider>
  );
}

// --- CONTEÚDO DA PÁGINA ---
function HomePageContent() {
  // 1. Hook do NextAuth para pegar usuário
  const { data: session } = useSession();

  // Simplifica o objeto user para usar no layout
  const user = session?.user
    ? {
        email: session.user.email,
        initial: session.user.email?.[0]?.toUpperCase() || "U",
      }
    : null;

  // Estados da Página
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("recent");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Estado para controlar o Alerta de Bloqueio
  const [showLoginAlert, setShowLoginAlert] = useState(false);

  // Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  // Fecha o alerta se o usuário fizer login
  useEffect(() => {
    if (user) setShowLoginAlert(false);
  }, [user]);

  // Lógica de Filtros e Ordenação
  const filteredAndSortedStats = useMemo(() => {
    let result = initialStats.filter((stat) => {
      const matchesSearch = stat.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        categoryFilter === "all" || stat.category === categoryFilter;
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

  // Cálculos de Paginação
  const totalPages = Math.ceil(filteredAndSortedStats.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredAndSortedStats.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Lógica de "Soft Gating" (Bloqueio suave)
  const handlePageChange = (e: React.MouseEvent, newPage: number) => {
    e.preventDefault();

    // Se não estiver logado e tentar ir para página > 1
    if (!user && newPage > 1) {
      setShowLoginAlert(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setCurrentPage(newPage);
  };

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col">
      {/* --- HEADER --- */}
      <header className="bg-white border-b w-full h-14 flex items-center justify-between px-6 shrink-0 sticky top-0 z-10">
        <span className="text-lg font-extrabold text-black">
          Voz do Usuário
        </span>

        {user ? (
          // Header Logado
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-gray-100 rounded-full pl-1 pr-4 py-1 border border-gray-200">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white shadow-sm">
                {user.initial}
              </div>
              <span className="text-sm font-medium text-gray-700 hidden sm:block">
                {user.email}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => signOut()}
              className="text-red-500 hover:text-red-600 hover:bg-red-50"
            >
              Sair
            </Button>
          </div>
        ) : (
          // Header Visitante
          <Button
            variant="outline"
            size="sm"
            className="font-semibold"
            onClick={() => signIn("google")}
          >
            Login
          </Button>
        )}
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 flex flex-col items-center pt-10 px-4 pb-20">
        <div className="w-full max-w-2xl text-center space-y-4">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">
            Compartilhe seu Feedback
          </h1>
          <p className="text-base text-gray-600 max-w-lg mx-auto">
            Ajude-nos a melhorar compartilhando suas ideias.
          </p>

          {/* ALERTA AMARELO DE BLOQUEIO */}
          {showLoginAlert && !user && (
            <div className="mx-auto max-w-md bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded shadow-md animate-in fade-in slide-in-from-top-4 text-left">
              <div className="flex items-start">
                <div className="shrink-0">
                  <Lock className="h-5 w-5 text-yellow-500" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-bold text-yellow-800">
                    Acesso Restrito
                  </h3>
                  <div className="mt-1 text-sm text-yellow-700">
                    <p>
                      Para ver mais páginas e participar, você precisa estar
                      logado.
                    </p>
                  </div>
                  <div className="mt-3">
                    <Button
                      size="sm"
                      className="bg-yellow-600 hover:bg-yellow-700 text-white"
                      onClick={() => signIn("google")}
                    >
                      Fazer Login Agora
                    </Button>
                    <button
                      onClick={() => setShowLoginAlert(false)}
                      className="ml-3 text-sm font-medium text-yellow-600 hover:text-yellow-500 underline"
                    >
                      Dispensar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Botão de Criar (Condicional) */}
          {user ? (
            <Button
              size="sm"
              onClick={() => setIsCreateOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 h-10 px-6 shadow-md"
            >
              <PlusCircle className="h-4 w-4 mr-2" /> Criar Feedback
            </Button>
          ) : (
            !showLoginAlert && (
              <div className="text-xs text-gray-400 mt-2">
                Faça login para criar feedbacks e ver tudo
              </div>
            )
          )}
        </div>

        {/* --- ÁREA DE FILTROS --- */}
        <div className="w-full max-w-3xl mt-10 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full">
            {/* Input Pesquisa */}
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Pesquisar feedbacks..."
                className="pl-10 h-10 bg-white text-sm w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Selects */}
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

          {/* --- LISTA DE CARDS --- */}
          <div className="flex flex-col gap-2 min-h-400px">
            {currentItems.map((stat) => (
              <div
                key={stat.id}
                className="bg-white shadow-sm rounded-lg border border-gray-100 p-3 hover:border-blue-300 transition-all"
              >
                <div className="flex justify-between items-center">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-bold text-gray-900">
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
                  <div className="flex flex-col items-center bg-gray-50 px-3 py-1 rounded border min-w-60px">
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

            {currentItems.length === 0 && (
              <div className="text-center py-10 text-gray-500">
                Nenhum feedback encontrado com estes filtros.
              </div>
            )}
          </div>

          {/* --- PAGINAÇÃO (COM BLOQUEIO) --- */}
          {totalPages > 1 && (
            <div className="py-6">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) =>
                        handlePageChange(e, Math.max(1, currentPage - 1))
                      }
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          href="#"
                          isActive={currentPage === page}
                          onClick={(e) => handlePageChange(e, page)}
                          className={`cursor-pointer ${
                            !user && page > 1 ? "opacity-60" : ""
                          }`}
                        >
                          {/* Se não logado e página > 1, mostra Cadeado. Senão mostra número */}
                          {!user && page > 1 ? (
                            <Lock className="h-3 w-3" />
                          ) : (
                            page
                          )}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  )}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) =>
                        handlePageChange(
                          e,
                          Math.min(totalPages, currentPage + 1)
                        )
                      }
                      className={
                        currentPage === totalPages
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>

        {/* Componente de Criação (Descomente quando tiver o arquivo) */}
        <CreateFeedback
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
        />
      </main>
    </div>
  );
}
