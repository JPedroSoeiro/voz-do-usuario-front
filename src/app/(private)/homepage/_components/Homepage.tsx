"use client";

import { useState, useMemo } from "react";
import { Search, PlusCircle, LogOut } from "lucide-react";
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
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
// Importa o modal que está na MESMA PASTA (_components)
import CreateFeedback from "./CreateFeedback";

// Dados Mock
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
];

export default function HomepageComponent() {
  const { data: session } = useSession();

  // ESTADO PARA CONTROLAR O MODAL
  const [isModalOpen, setIsModalOpen] = useState(false);

  const user = {
    name: session?.user?.name || "Usuário",
    email: session?.user?.email,
    image: session?.user?.image,
    initial: session?.user?.name?.[0]?.toUpperCase() || "U",
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("recent");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

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

  const totalPages = Math.ceil(filteredAndSortedStats.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col">
      {/* HEADER */}
      <header className="bg-white border-b w-full h-16 flex items-center justify-between px-6 sticky top-0 z-10 shadow-sm">
        <span className="text-xl font-extrabold text-blue-900">
          Voz do Usuário
        </span>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 bg-gray-50 rounded-full pl-1 pr-4 py-1.5 border border-gray-200">
            {user.image ? (
              <Image
                src={user.image}
                alt={user.name}
                width={32}
                height={32}
                className="rounded-full border border-blue-200"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white shadow-sm">
                {user.initial}
              </div>
            )}
            <div className="flex flex-col text-left">
              <span className="text-xs font-bold text-gray-700 leading-none">
                {user.name}
              </span>
              <span className="text-[10px] text-gray-500 leading-none mt-0.5 max-w-[120px] truncate hidden sm:block">
                {user.email}
              </span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => signOut({ callbackUrl: "/" })}
            className="text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
            title="Sair"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* CONTEÚDO */}
      <main className="flex-1 flex flex-col items-center pt-8 px-4 pb-20">
        <div className="w-full max-w-2xl text-center space-y-4 mb-8">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            Feedbacks da Comunidade
          </h1>
          <p className="text-base text-gray-600 max-w-lg mx-auto">
            Bem-vindo! Vote nas melhorias que você quer ver no sistema.
          </p>

          {/* BOTÃO QUE ABRE O MODAL */}
          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 h-10 px-6 shadow-md"
          >
            <PlusCircle className="h-4 w-4 mr-2" /> Criar Feedback
          </Button>

          {/* O SEU MODAL CONECTADO */}
          <CreateFeedback
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        </div>

        {/* LISTA E FILTROS */}
        <div className="w-full max-w-3xl space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Pesquisar..."
                className="pl-10 h-10 bg-white text-sm w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="h-10 bg-white text-sm">
                  <SelectValue placeholder="Categorias" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="Funcionalidade">Funcionalidade</SelectItem>
                  <SelectItem value="Bug">Bug</SelectItem>
                  <SelectItem value="Melhoria">Melhoria</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortOrder} onValueChange={setSortOrder}>
                <SelectTrigger className="h-10 bg-white text-sm">
                  <SelectValue placeholder="Ordenar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Recentes</SelectItem>
                  <SelectItem value="votes">Votos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col gap-2 min-h-[300px]">
            {filteredAndSortedStats
              .slice(startIndex, startIndex + itemsPerPage)
              .map((stat) => (
                <div
                  key={stat.id}
                  className="bg-white shadow-sm rounded-lg border border-gray-100 p-4 hover:border-blue-300 transition-all"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-bold text-gray-900">
                        {stat.name}
                      </span>
                      <div className="flex items-center gap-2 text-[10px] text-gray-500">
                        <span className="font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded uppercase">
                          {stat.category}
                        </span>
                        <span>•</span>
                        <span className="capitalize">{stat.status}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-center bg-gray-50 px-3 py-1.5 rounded border min-w-[60px]">
                      <span className="text-lg font-bold text-blue-600 leading-none">
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

          {totalPages > 1 && (
            <div className="py-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(Math.max(1, currentPage - 1));
                      }}
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#" isActive>
                      {currentPage}
                    </PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(Math.min(totalPages, currentPage + 1));
                      }}
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
      </main>
    </div>
  );
}
