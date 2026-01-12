"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, PlusCircle, LogOut, Lock, ThumbsUp, Mail } from "lucide-react"; // Importei Mail
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
import { useSession, signOut, signIn } from "next-auth/react";
import CreateFeedback from "./CreateFeedback";
import { FeedbackService, Feedback } from "@/src/services/feedbacks";

export default function HomepageComponent() {
  const { data: session, status } = useSession();

  // VERIFICA SE O USUÁRIO PRECISA CONFIRMAR EMAIL
  // @ts-ignore: O erro vem do nosso route.ts customizado
  const isPendingVerification =
    (session as any)?.error === "EMAIL_VERIFICATION_REQUIRED";

  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showLoginAlert, setShowLoginAlert] = useState(false);

  // Filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  // Só consideramos autenticado se tiver sessão E NÃO tiver erro de verificação
  const isAuthenticated = status === "authenticated" && !isPendingVerification;

  const user =
    isAuthenticated && session?.user
      ? {
          name: session.user.name || "Usuário",
          email: session.user.email,
          initial: session.user.name?.[0]?.toUpperCase() || "U",
        }
      : null;

  const fetchFeedbacks = useCallback(async () => {
    if (status === "loading") return;

    setIsLoading(true);
    try {
      const response: any = await FeedbackService.getAll(
        currentPage,
        categoryFilter,
        isAuthenticated
      );

      // LOG DE DEPURAÇÃO (Para confirmar no console do navegador)
      console.log("Dados recebidos:", response);

      // CASO 1: Formato Autenticado (Backend retorna { items, total })
      if (response.items && Array.isArray(response.items)) {
        setFeedbacks(response.items);
        setTotalItems(response.total || 0);
      }
      // CASO 2: Formato Padrão/Supabase (Backend retorna { data, count })
      else if (response.data && Array.isArray(response.data)) {
        setFeedbacks(response.data);
        setTotalItems(response.count || 0);
      }
      // CASO 3: Formato Array Puro (Visitante)
      else if (Array.isArray(response)) {
        setFeedbacks(response);
        setTotalItems(response.length);
      }
    } catch (error: any) {
      console.error("Erro ao buscar feedbacks:", error);
      // Fallback para visitante em caso de erro 401
      if (error.response?.status === 401 && isAuthenticated) {
        try {
          const publicData: any = await FeedbackService.getAll(
            currentPage,
            categoryFilter,
            false
          );
          if (publicData.items) setFeedbacks(publicData.items);
          else if (Array.isArray(publicData)) setFeedbacks(publicData);
        } catch (e) {}
      }
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, categoryFilter, isAuthenticated, status]);

  useEffect(() => {
    fetchFeedbacks();
  }, [fetchFeedbacks]);

  // LÓGICA DE LIKE
  const handleVote = async (feedback: Feedback) => {
    if (!isAuthenticated) {
      // Se estiver pendente, não mostra o alerta amarelo, pois o banner azul já estará na tela
      if (!isPendingVerification) setShowLoginAlert(true);
      return;
    }
    // ... (restante da lógica de voto igual)
    const previousFeedbacks = [...feedbacks];
    const isLiking = !feedback.has_voted;
    setFeedbacks((prev) =>
      prev.map((f) =>
        f.id === feedback.id
          ? {
              ...f,
              has_voted: isLiking,
              votes: isLiking ? f.votes + 1 : f.votes - 1,
            }
          : f
      )
    );
    try {
      if (isLiking) await FeedbackService.addVote(feedback.id);
      else await FeedbackService.removeVote(feedback.id);
    } catch (error) {
      setFeedbacks(previousFeedbacks);
    }
  };

  const handlePageChange = (page: number) => {
    if (!isAuthenticated && page > 1) {
      if (!isPendingVerification) setShowLoginAlert(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setCurrentPage(page);
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col">
      <header className="bg-white border-b w-full h-16 flex items-center justify-between px-6 sticky top-0 z-10 shadow-sm">
        <span className="text-xl font-extrabold text-blue-900">
          Voz do Usuário
        </span>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <div className="flex items-center gap-3 bg-gray-50 rounded-full pl-1 pr-4 py-1.5 border border-gray-200">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white shadow-sm">
                  {user.initial}
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-gray-700 leading-none">
                    {user.name}
                  </span>
                  <span className="text-[10px] text-gray-500 leading-none mt-0.5 max-w-30 truncate hidden sm:block">
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
            </>
          ) : // Se estiver pendente, mostra botão de sair para trocar de conta
          isPendingVerification ? (
            <Button
              size="sm"
              variant="outline"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              Sair / Trocar Conta
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={() => signIn("google", { callbackUrl: "/" })}
            >
              Fazer Login
            </Button>
          )}
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center pt-8 px-4 pb-20">
        <div className="w-full max-w-2xl text-center space-y-4 mb-8">
          {/* --- BLOCO DE VERIFICAÇÃO DE EMAIL --- */}
          {isPendingVerification && (
            <div className="w-full bg-blue-100 border-l-4 border-blue-600 text-blue-900 p-6 rounded-md shadow-md mb-6 text-left">
              <div className="flex items-start gap-4">
                <div className="bg-blue-200 p-2 rounded-full">
                  <Mail className="h-6 w-6 text-blue-700" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold">Confirme seu email</h3>
                  <p className="mt-1 text-sm text-blue-800">
                    Criamos sua conta com sucesso para{" "}
                    <strong>{session?.user?.email}</strong>.
                  </p>
                  <p className="mt-2 text-sm">
                    Enviamos um link de confirmação para sua caixa de entrada.
                    Você precisa clicar nele antes de poder votar ou criar
                    feedbacks.
                  </p>
                  <div className="mt-4 flex gap-3">
                    <Button
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={() => signIn("google", { callbackUrl: "/" })}
                    >
                      Já confirmei (Recarregar)
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="text-blue-700 hover:bg-blue-200"
                    >
                      Sair
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            Feedbacks da Comunidade
          </h1>

          {/* ALERTA DE VISITANTE (Só aparece se NÃO estiver pendente de email) */}
          {showLoginAlert && !user && !isPendingVerification && (
            <div className="mx-auto max-w-md bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded shadow-md animate-in fade-in slide-in-from-top-4 text-left">
              <div className="flex items-start">
                <div className="shrink-0">
                  <Lock className="h-5 w-5 text-yellow-500" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-bold text-yellow-800">
                    Acesso Restrito
                  </h3>
                  <p className="mt-1 text-sm text-yellow-700">
                    Faça login para interagir.
                  </p>
                  <Button
                    size="sm"
                    className="mt-3 bg-yellow-600 hover:bg-yellow-700 text-white"
                    onClick={() => signIn("google", { callbackUrl: "/" })}
                  >
                    Login com Google
                  </Button>
                  <button
                    onClick={() => setShowLoginAlert(false)}
                    className="ml-3 text-sm text-yellow-600 hover:underline"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Se estiver pendente, desabilita o botão de criar */}
          <Button
            onClick={() => {
              if (isPendingVerification) return; // Não faz nada
              !isAuthenticated ? setShowLoginAlert(true) : setIsModalOpen(true);
            }}
            disabled={isPendingVerification}
            className={`${
              isPendingVerification ? "opacity-50 cursor-not-allowed" : ""
            } bg-blue-600 hover:bg-blue-700 h-10 px-6 shadow-md`}
          >
            <PlusCircle className="h-4 w-4 mr-2" /> Criar Feedback
          </Button>

          <CreateFeedback
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSuccess={fetchFeedbacks}
          />
        </div>

        <div className="w-full max-w-3xl space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Pesquisar..."
                className="pl-10 h-10 bg-white text-sm w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                disabled
              />
            </div>
            {/* ... Restante do código (Filtros e Lista) igual ao anterior ... */}
            {/* ... Apenas lembre que o botão de Like já está protegido pelo !isAuthenticated ... */}
            <div className="grid grid-cols-2 gap-2 w-full">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full h-10 bg-white text-sm">
                  <SelectValue placeholder="Categorias" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="improvement">Melhoria</SelectItem>
                  <SelectItem value="feature">Funcionalidade</SelectItem>
                  <SelectItem value="bug">Bug</SelectItem>
                </SelectContent>
              </Select>

              <Select value="recent">
                <SelectTrigger className="w-full h-10 bg-white text-sm">
                  <SelectValue placeholder="Ordenar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Recentes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col gap-2 min-h-75">
            {isLoading ? (
              <div className="text-center py-10 text-gray-500">
                Carregando feedbacks...
              </div>
            ) : feedbacks.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                Nenhum feedback encontrado.
              </div>
            ) : (
              feedbacks.map((stat) => (
                <div
                  key={stat.id}
                  className="bg-white shadow-sm rounded-lg border border-gray-100 p-4 hover:border-blue-300 transition-all"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-bold text-gray-900">
                        {stat.title}
                      </span>
                      <div className="flex items-center gap-2 text-[10px] text-gray-500">
                        <span className="font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded uppercase">
                          {stat.category}
                        </span>
                        <span>•</span>
                        <span className="capitalize">{stat.status}</span>
                      </div>
                    </div>
                    {/* Botão de Like protegido */}
                    <button
                      onClick={() => handleVote(stat)}
                      disabled={isPendingVerification} // Bloqueia clique se pendente
                      className={`flex flex-col items-center px-3 py-1.5 rounded border min-w-15 transition-all 
                        ${
                          stat.has_voted
                            ? "bg-blue-50 border-blue-200 text-blue-600"
                            : "bg-gray-50 border-gray-200 text-gray-400 hover:bg-gray-100"
                        }
                        ${
                          isPendingVerification
                            ? "cursor-not-allowed opacity-60"
                            : ""
                        }
                        `}
                    >
                      <ThumbsUp
                        className={`h-5 w-5 mb-0.5 ${
                          stat.has_voted ? "fill-blue-600" : ""
                        }`}
                      />
                      <span className="text-[9px] uppercase font-bold tracking-tighter">
                        {stat.votes}
                      </span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* PAGINAÇÃO */}
          {totalPages > 1 && (
            <div className="py-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(Math.max(1, currentPage - 1));
                      }}
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
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(page);
                          }}
                          className={`cursor-pointer ${
                            !isAuthenticated && page > 1 ? "opacity-60" : ""
                          }`}
                        >
                          {/* Se não autenticado (inclui pendente), mostra cadeado */}
                          {!isAuthenticated && page > 1 ? (
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
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(Math.min(totalPages, currentPage + 1));
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
