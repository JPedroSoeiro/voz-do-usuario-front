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
  UserCircle,
  ArrowRight,
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSession, signOut, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

import CreateFeedback from "./CreateFeedback";
import EditFeedback from "./EditFeedback";
import { FeedbackService } from "@/src/services/feedback";
import { Feedback } from "@/src/types/feedback";
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

const categoryMap: Record<string, string> = {
  bug: "Bug",
  feature: "Funcionalidade",
  improvement: "Melhoria",
  other: "Outro",
};

const statusMap: Record<string, string> = {
  pending: "Pendente",
  in_review: "Em Análise",
  accepted: "Aceito",
  rejected: "Recusado",
  in_progress: "Em Andamento",
  done: "Concluído",
};

export default function HomepageComponent() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // @ts-ignore
  const isPendingVerification =
    (session as any)?.error === "EMAIL_VERIFICATION_REQUIRED";
  const isAuthenticated = status === "authenticated" && !isPendingVerification;

  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingFeedback, setEditingFeedback] = useState<Feedback | null>(null);
  const [feedbackToDelete, setFeedbackToDelete] = useState<string | null>(null);
  const [viewingDescription, setViewingDescription] = useState<Feedback | null>(
    null
  );
  const [showLoginAlert, setShowLoginAlert] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortFilter, setSortFilter] = useState("date");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    // @ts-ignore
    if (isAuthenticated && session?.user?.role === "admin") {
      router.push("/dashboard");
    }
  }, [isAuthenticated, session, router]);

  const currentUser =
    isAuthenticated && session?.user
      ? {
          name: session.user.name || "Usuário",
          email: session.user.email,
          initial: session.user.name?.[0]?.toUpperCase() || "U",
          // @ts-ignore
          id:
            (session as any).user?.id ||
            (session as any).sub ||
            session.user.email,
        }
      : null;

  const fetchFeedbacks = useCallback(async () => {
    if (status === "loading") return;
    setIsLoading(true);

    try {
      let data;
      if (isAuthenticated) {
        data = await FeedbackService.getFeed({
          page: currentPage,
          limit: itemsPerPage,
          search: searchTerm,
          category: categoryFilter !== "all" ? categoryFilter : undefined,
          status: statusFilter !== "all" ? statusFilter : undefined,
          sort: sortFilter,
        });
      } else {
        data = await FeedbackService.getAllFeedbacks({
          page: 1,
          limit: 5,
          search: searchTerm,
          category: categoryFilter !== "all" ? categoryFilter : undefined,
          status: statusFilter !== "all" ? statusFilter : undefined,
          sort: sortFilter,
        });
      }
      setFeedbacks(data.items || []);
      setTotalItems(data.total || 0);
    } catch (error) {
      setFeedbacks([]);
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
    searchTerm,
  ]);

  useEffect(() => {
    fetchFeedbacks();
  }, [fetchFeedbacks]);

  const handleVote = async (feedback: Feedback) => {
    if (!isAuthenticated) {
      setShowLoginAlert(true);
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
              total_votes: isLiking
                ? (f.total_votes || 0) + 1
                : Math.max(0, (f.total_votes || 0) - 1),
            }
          : f
      )
    );
    try {
      if (isLiking) await FeedbackService.vote(feedback.id);
      else await FeedbackService.removeVote(feedback.id);
    } catch (error) {
      setFeedbacks(previousFeedbacks);
    }
  };

  const confirmDelete = async () => {
    if (!feedbackToDelete) return;
    try {
      await FeedbackService.deleteFeedback(feedbackToDelete);
      setFeedbacks((prev) => prev.filter((f) => f.id !== feedbackToDelete));
      setFeedbackToDelete(null);
    } catch (error) {
      alert("Erro ao excluir.");
    }
  };

  const totalPages = isAuthenticated
    ? Math.ceil(totalItems / itemsPerPage) || 1
    : 1;

  // 👇 FUNÇÃO ADICIONADA (Correção do erro Cannot find name)
  const handlePageChange = (page: number) => {
    if (!isAuthenticated) return setShowLoginAlert(true);
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col">
      <header className="bg-white border-b w-full h-16 flex items-center justify-between px-6 sticky top-0 z-10 shadow-sm">
        <span className="text-xl font-extrabold text-blue-900 tracking-tight">
          Voz do Usuário
        </span>
        <div className="flex items-center gap-4">
          {currentUser ? (
            <div className="flex items-center gap-3 bg-gray-50 rounded-full pl-1 pr-4 py-1.5 border border-gray-200">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                {currentUser.initial}
              </div>
              <span className="text-xs font-bold text-gray-700">
                {currentUser.name}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-gray-400 hover:text-red-500"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          ) : (
            <Button size="sm" onClick={() => signIn("google")}>
              Login
            </Button>
          )}
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center pt-8 px-4 pb-20">
        <div className="w-full max-w-2xl text-center space-y-4 mb-8">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            Feedbacks da Comunidade
          </h1>
          <div className="flex justify-center gap-3">
            {isAuthenticated && (
              <Button
                variant="outline"
                onClick={() => router.push("/my-feedbacks")}
                className="border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                <UserCircle className="h-4 w-4 mr-2" /> Meus Feedbacks
              </Button>
            )}
            <Button
              onClick={() =>
                !isAuthenticated
                  ? setShowLoginAlert(true)
                  : setIsCreateModalOpen(true)
              }
              className="bg-blue-600 hover:bg-blue-700 shadow-md"
            >
              <PlusCircle className="h-4 w-4 mr-2" /> Criar Feedback
            </Button>
          </div>
        </div>

        <div className="w-full max-w-3xl space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Pesquisar..."
                className="pl-10 h-10 bg-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full h-10 bg-white border-gray-200">
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="improvement">Melhoria</SelectItem>
                  <SelectItem value="feature">Funcionalidade</SelectItem>
                  <SelectItem value="bug">Bug</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full h-10 bg-white border-gray-200">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="accepted">Aceito</SelectItem>
                  <SelectItem value="in_progress">Em Andamento</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortFilter} onValueChange={setSortFilter}>
                <SelectTrigger className="w-full h-10 bg-white border-gray-200">
                  <SelectValue placeholder="Recentes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Recentes</SelectItem>
                  <SelectItem value="votes">Votos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col gap-2 min-h-75">
            {isLoading ? (
              <div className="text-center py-10 text-blue-500">
                Carregando...
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
                      <div
                        className={`flex flex-col gap-1 max-w-[70%] ${
                          isAuthenticated ? "cursor-pointer" : ""
                        }`}
                        onClick={() =>
                          isAuthenticated && setViewingDescription(stat)
                        }
                      >
                        <span className="text-sm font-bold text-gray-900 truncate hover:text-blue-600 transition-colors">
                          {stat.title}
                        </span>
                        <div className="flex items-center gap-2 text-[10px]">
                          <span className="font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100 uppercase">
                            {categoryMap[stat.category] || stat.category}
                          </span>
                          <span
                            className={`px-1.5 py-0.5 rounded border uppercase ${
                              stat.status === "done"
                                ? "bg-green-50 text-green-700 border-green-100"
                                : "bg-gray-100 text-gray-600 border-gray-200"
                            }`}
                          >
                            {statusMap[stat.status] || stat.status}
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
                                  className="h-8 w-8 text-blue-600"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEditingFeedback(stat);
                                    setIsEditModalOpen(true);
                                  }}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-8 w-8 text-red-600"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setFeedbackToDelete(stat.id);
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </>
                            ) : (
                              <Lock className="h-4 w-4 text-gray-300" />
                            )}
                          </div>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleVote(stat);
                          }}
                          className={`flex flex-col items-center px-3 py-1.5 rounded border min-w-12.5 transition-all ${
                            stat.has_voted
                              ? "bg-blue-50 border-blue-200 text-blue-600"
                              : "bg-gray-50 border-gray-200 text-gray-400"
                          }`}
                        >
                          <ThumbsUp
                            className={`h-5 w-5 mb-0.5 ${
                              stat.has_voted ? "fill-blue-600" : ""
                            }`}
                          />
                          <span className="text-[10px] font-bold">
                            {stat.total_votes || 0}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            {!isAuthenticated && !isLoading && (
              <div className="mt-4 bg-linear-to-r from-blue-700 to-blue-900 rounded-lg p-5 text-white shadow-md border border-blue-400/20 flex flex-col items-center text-center">
                <div className="flex items-center gap-2 mb-2">
                  <Lock className="h-4 w-4 text-blue-200" />
                  <h3 className="text-sm font-bold uppercase tracking-wide">
                    Área Restrita
                  </h3>
                </div>
                <p className="text-blue-100 text-xs mb-4">
                  Limite de visualização atingido.{" "}
                  <span className="font-semibold text-white">
                    Faça login para ver tudo!
                  </span>
                </p>
                <Button
                  onClick={() => signIn("google")}
                  size="sm"
                  className="bg-white text-blue-800 hover:bg-blue-50 font-bold px-8"
                >
                  Entrar com Google
                </Button>
              </div>
            )}
          </div>
          {isAuthenticated && totalPages > 1 && (
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
                  <PaginationItem>
                    <PaginationLink isActive>{currentPage}</PaginationLink>
                  </PaginationItem>
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

      <Dialog
        open={!!viewingDescription}
        onOpenChange={() => setViewingDescription(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{viewingDescription?.title}</DialogTitle>
          </DialogHeader>
          <div className="mt-4 text-sm text-gray-600 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg border">
            {viewingDescription?.description}
          </div>
        </DialogContent>
      </Dialog>
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
      <AlertDialog
        open={!!feedbackToDelete}
        onOpenChange={() => setFeedbackToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação é irreversível.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
