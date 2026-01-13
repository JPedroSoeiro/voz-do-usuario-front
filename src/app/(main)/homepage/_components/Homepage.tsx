"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Search,
  PlusCircle,
  LogOut,
  Lock,
  ThumbsUp,
  Edit,
  Trash2,
  LayoutDashboard,
  AlertTriangle,
} from "lucide-react";
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
import { api } from "@/src/lib/api";
import CreateFeedback from "./CreateFeedback";
import EditFeedback from "./EditFeedback";
import { FeedbackService } from "@/src/services/feedback";
import { Feedback } from "@/src/types/feedback";
import { UserProfile } from "@/src/types/auth";

// 👇 IMPORTAMOS O NOVO MODAL AQUI
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function HomepageComponent() {
  const { data: session, status } = useSession();

  // @ts-ignore
  const isPendingVerification =
    (session as any)?.error === "EMAIL_VERIFICATION_REQUIRED";

  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingFeedback, setEditingFeedback] = useState<Feedback | null>(null);

  // 👇 ESTADO PARA CONTROLAR O DELETE (Guarda o ID que será apagado)
  const [feedbackToDelete, setFeedbackToDelete] = useState<string | null>(null);

  const [showLoginAlert, setShowLoginAlert] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortFilter, setSortFilter] = useState("date");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const isAuthenticated = status === "authenticated" && !isPendingVerification;

  const userDisplay =
    isAuthenticated && session?.user
      ? {
          name: session.user.name || "Usuário",
          email: session.user.email,
          initial: session.user.name?.[0]?.toUpperCase() || "U",
        }
      : null;

  useEffect(() => {
    if (isAuthenticated) {
      api
        .get("/auth/me")
        .then((res: any) => setCurrentUser(res.data.user))
        .catch((err: any) => console.error(err));
    } else {
      setCurrentUser(null);
    }
  }, [isAuthenticated]);

  const fetchFeedbacks = useCallback(async () => {
    if (status === "loading") return;
    setIsLoading(true);
    try {
      // Tenta buscar com o status atual de autenticação
      const data = await FeedbackService.getAll(
        currentPage,
        categoryFilter,
        statusFilter,
        sortFilter,
        isAuthenticated
      );

      // CORREÇÃO: Usa "|| []" para garantir que nunca seja undefined
      setFeedbacks(data.items || []);
      setTotalItems(data.total || 0);
    } catch (error: any) {
      console.error("Erro ao buscar:", error);

      // Se der erro 401 (Não autorizado), tenta buscar como público (sem logar)
      if (error.response?.status === 401 && isAuthenticated) {
        try {
          const publicData = await FeedbackService.getAll(
            currentPage,
            categoryFilter,
            statusFilter,
            sortFilter,
            false // Força false para buscar público
          );
          setFeedbacks(publicData.items || []);
          setTotalItems(publicData.total || 0);
        } catch (e) {
          setFeedbacks([]); // Se falhar tudo, lista vazia
        }
      } else {
        // Outros erros
        setFeedbacks([]);
      }
    } finally {
      setIsLoading(false);
    }
  }, [
    currentPage,
    categoryFilter,
    statusFilter,
    sortFilter,
    isAuthenticated,
    status,
  ]);

  useEffect(() => {
    fetchFeedbacks();
  }, [fetchFeedbacks]);

  const handleVote = async (feedback: Feedback) => {
    if (!isAuthenticated) {
      if (!isPendingVerification) setShowLoginAlert(true);
      return;
    }
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

  // 👇 CLIQUE NA LIXEIRA: Só abre o modal (não deleta ainda)
  const handleDeleteClick = (id: string) => {
    setFeedbackToDelete(id);
  };

  // 👇 CONFIRMAÇÃO DO MODAL: Aqui sim deleta
  const confirmDelete = async () => {
    if (!feedbackToDelete) return;
    try {
      await FeedbackService.delete(feedbackToDelete);
      fetchFeedbacks();
    } catch (error) {
      alert("Erro ao apagar. Verifique se você ainda tem permissão.");
    } finally {
      setFeedbackToDelete(null); // Fecha o modal
    }
  };

  const handleEditClick = (feedback: Feedback) => {
    setEditingFeedback(feedback);
    setIsEditModalOpen(true);
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
  const getStatusLabel = (s: string) => {
    const map: any = {
      pending: "Pendente",
      accepted: "Aceito",
      done: "Concluído",
      rejected: "Rejeitado",
      in_progress: "Em Progresso",
    };
    return map[s] || s;
  };

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col">
      <header className="bg-white border-b w-full h-16 flex items-center justify-between px-6 sticky top-0 z-10 shadow-sm">
        <span className="text-xl font-extrabold text-blue-900">
          Voz do Usuário
        </span>
        <div className="flex items-center gap-4">
          {userDisplay ? (
            <>
              {currentUser?.role === "admin" && (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-blue-700 border-blue-200 bg-blue-50 hover:bg-blue-100 hidden sm:flex"
                  onClick={() => (window.location.href = "/dashboard")}
                >
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  Painel Admin
                </Button>
              )}

              <div className="flex items-center gap-3 bg-gray-50 rounded-full pl-1 pr-4 py-1.5 border border-gray-200">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white shadow-sm">
                  {userDisplay.initial}
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-gray-700 leading-none">
                    {userDisplay.name}
                  </span>
                  <span className="text-[10px] text-gray-500 leading-none mt-0.5 max-w-30 truncate hidden sm:block">
                    {userDisplay.email}
                  </span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </>
          ) : isPendingVerification ? (
            <Button
              size="sm"
              variant="outline"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              Sair
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={() => signIn("google", { callbackUrl: "/" })}
            >
              Login
            </Button>
          )}
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center pt-8 px-4 pb-20">
        <div className="w-full max-w-2xl text-center space-y-4 mb-8">
          {isPendingVerification && (
            <div className="w-full bg-blue-100 border-l-4 border-blue-600 text-blue-900 p-6 rounded-md shadow-md mb-6 text-left">
              Confirme seu email.
            </div>
          )}

          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            Feedbacks da Comunidade
          </h1>

          {showLoginAlert && !userDisplay && !isPendingVerification && (
            <div className="mx-auto max-w-md bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded shadow-md animate-in fade-in slide-in-from-top-4 text-left">
              <div className="flex items-start">
                <div className="shrink-0">
                  <Lock className="h-5 w-5 text-yellow-500" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-bold text-yellow-800">
                    Acesso Restrito
                  </h3>
                  <p className="text-sm text-yellow-700 mt-1">
                    Faça login para postar ou curtir.
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

          <Button
            onClick={() => {
              if (isPendingVerification) return;
              !isAuthenticated
                ? setShowLoginAlert(true)
                : setIsCreateModalOpen(true);
            }}
            disabled={isPendingVerification}
            className="bg-blue-600 hover:bg-blue-700 h-10 px-6 shadow-md"
          >
            <PlusCircle className="h-4 w-4 mr-2" /> Criar Feedback
          </Button>

          <CreateFeedback
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            onSuccess={fetchFeedbacks}
          />
          <EditFeedback
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            feedback={editingFeedback}
            onSuccess={fetchFeedbacks}
          />

          {/* 👇 AQUI ESTÁ O MODAL NOVO! */}
          <AlertDialog
            open={!!feedbackToDelete}
            onOpenChange={() => setFeedbackToDelete(null)}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <AlertDialogTitle>Tem certeza absoluta?</AlertDialogTitle>
                </div>
                <AlertDialogDescription>
                  Essa ação não pode ser desfeita. Isso excluirá permanentemente
                  seu feedback e todos os votos serão perdidos.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={confirmDelete}
                  className="bg-red-600 hover:bg-red-700 text-white focus:ring-red-600"
                >
                  Sim, excluir feedback
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
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
              />
            </div>
            <div className="grid grid-cols-3 gap-2 w-full">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full h-10 bg-white text-sm px-2">
                  <SelectValue placeholder="Categ." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="improvement">Melhoria</SelectItem>
                  <SelectItem value="feature">Func.</SelectItem>
                  <SelectItem value="bug">Bug</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full h-10 bg-white text-sm px-2">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="accepted">Aceito</SelectItem>
                  <SelectItem value="done">Concluído</SelectItem>
                  <SelectItem value="rejected">Rejeitado</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortFilter} onValueChange={setSortFilter}>
                <SelectTrigger className="w-full h-10 bg-white text-sm px-2">
                  <SelectValue placeholder="Ordem" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Recentes</SelectItem>
                  <SelectItem value="votes">Mais Votados</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col gap-2 min-h-75">
            {isLoading ? (
              <div className="text-center py-10 text-blue-500">
                Carregando...
              </div>
            ) : (feedbacks || []).length === 0 ? ( // <--- CORREÇÃO: (feedbacks || [])
              <div className="text-center py-10 text-gray-500">
                Nenhum feedback encontrado.
              </div>
            ) : (
              feedbacks.map((stat) => {
                const isOwner = currentUser?.id === stat.user_id;
                const isPending = stat.status === "pending";

                return (
                  <div
                    key={stat.id}
                    className="group bg-white shadow-sm rounded-lg border border-gray-100 p-4 hover:border-blue-300 transition-all"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex flex-col gap-1 max-w-[70%]">
                        <span
                          className="text-sm font-bold text-gray-900 truncate"
                          title={stat.title}
                        >
                          {stat.title}
                        </span>
                        <div className="flex items-center gap-2 text-[10px] text-gray-500">
                          <span className="font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded uppercase">
                            {stat.category}
                          </span>
                          <span>•</span>
                          <span className="capitalize text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded">
                            {getStatusLabel(stat.status)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {isOwner && (
                          <div className="flex items-center gap-1">
                            {isPending ? (
                              <>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-8 w-8 text-blue-600 hover:bg-blue-50"
                                  onClick={() => handleEditClick(stat)}
                                  title="Editar"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                {/* MUDANÇA: Agora chama a função que abre o modal */}
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-8 w-8 text-red-600 hover:bg-red-50"
                                  onClick={() => handleDeleteClick(stat.id)}
                                  title="Excluir"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </>
                            ) : (
                              <div
                                title="Bloqueado"
                                className="cursor-help p-1"
                              >
                                <Lock className="h-4 w-4 text-gray-300" />
                              </div>
                            )}
                          </div>
                        )}

                        <button
                          onClick={() => handleVote(stat)}
                          disabled={isPendingVerification}
                          className={`flex flex-col items-center px-3 py-1.5 rounded border min-w-15 transition-all ${
                            stat.has_voted
                              ? "bg-blue-50 border-blue-200 text-blue-600"
                              : "bg-gray-50 border-gray-200 text-gray-400 hover:bg-gray-100"
                          } ${
                            isPendingVerification
                              ? "cursor-not-allowed opacity-60"
                              : ""
                          }`}
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
                  </div>
                );
              })
            )}
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
