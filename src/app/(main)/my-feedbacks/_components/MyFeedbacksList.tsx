"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FeedbackService } from "@/src/services/feedback";
import { Feedback } from "@/src/types/feedback";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Loader2,
  Trash2,
  Pencil,
  X,
  Save,
  ArrowLeft,
  AlertCircle,
  Search,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
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

export default function MyFeedbacksList() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [items, setItems] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);

  // Filtros e Paginação
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const [editingItem, setEditingItem] = useState<Feedback | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/");
  }, [status, router]);

  const fetchMyFeedbacks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await FeedbackService.getMyFeedbacks({
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm,
        status: statusFilter === "all" ? undefined : statusFilter,
      });
      setItems(res.items || []);
      setTotalItems(res.total || 0);
    } catch (error) {
      console.error("Erro ao buscar meus feedbacks", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, statusFilter, searchTerm]);

  useEffect(() => {
    if (status === "authenticated") fetchMyFeedbacks();
  }, [status, fetchMyFeedbacks]);

  const handleEditClick = (item: Feedback) => {
    if (item.status !== "pending")
      return alert("Apenas itens pendentes podem ser editados.");
    setEditingItem(item);
    setEditTitle(item.title);
    setEditDesc(item.description);
  };

  const handleSaveEdit = async () => {
    if (!editingItem) return;
    try {
      await FeedbackService.update(editingItem.id, {
        title: editTitle,
        description: editDesc,
      });
      setEditingItem(null);
      fetchMyFeedbacks();
    } catch (error) {
      alert("Erro ao salvar.");
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await FeedbackService.deleteFeedback(deleteId);
      fetchMyFeedbacks();
      setDeleteId(null);
    } catch (error) {
      alert("Erro ao excluir.");
    }
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  if (loading && items.length === 0)
    return (
      <div className="flex justify-center p-20">
        <Loader2 className="animate-spin text-blue-600 h-8 w-8" />
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push("/")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Meus Feedbacks</h1>
            <p className="text-sm text-gray-500">Acompanhe suas sugestões.</p>
          </div>
        </div>

        {/* FILTROS PADRONIZADOS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full bg-white p-3 rounded-lg border shadow-sm">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Pesquisar..."
              className="pl-10 h-10 bg-white"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Select
              value={categoryFilter}
              onValueChange={(val) => {
                setCategoryFilter(val);
                setCurrentPage(1);
              }}
            >
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

            <Select
              value={statusFilter}
              onValueChange={(val) => {
                setStatusFilter(val);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-full h-10 bg-white border-gray-200">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="in_progress">Em Andamento</SelectItem>
                <SelectItem value="done">Concluído</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-4 min-h-350px">
          {items.length === 0 && !loading ? (
            <div className="text-center py-16 bg-white rounded-lg border border-dashed text-gray-500">
              Nenhum feedback encontrado.
            </div>
          ) : (
            items.map((item) => (
              <Card
                key={item.id}
                className={`${
                  item.status !== "pending" ? "bg-gray-50/50" : "bg-white"
                }`}
              >
                <CardHeader className="flex flex-row items-start justify-between pb-2">
                  <div className="space-y-1">
                    <h3 className="font-bold text-gray-800">{item.title}</h3>
                    <div className="flex gap-2">
                      <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100 uppercase">
                        {categoryMap[item.category] || item.category}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded border uppercase ${
                          item.status === "pending"
                            ? "bg-yellow-50 text-yellow-700 border-yellow-100"
                            : "bg-gray-100 text-gray-600 border-gray-200"
                        }`}
                      >
                        {statusMap[item.status] || item.status}
                      </span>
                    </div>
                  </div>
                  {item.status === "pending" ? (
                    <div className="flex gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-blue-600"
                        onClick={() => handleEditClick(item)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-red-600"
                        onClick={() => setDeleteId(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="text-[10px] text-gray-400 bg-gray-100 px-2 py-1 rounded flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> Bloqueado
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </CardContent>
                <CardFooter className="pt-0 text-[10px] text-gray-400 flex justify-between uppercase font-semibold">
                  <span>Votos: {item.total_votes}</span>
                  <span>{new Date(item.created_at).toLocaleDateString()}</span>
                </CardFooter>
              </Card>
            ))
          )}
        </div>

        {totalPages > 1 && (
          <div className="py-4 border-t">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage((p) => Math.max(1, p - 1));
                    }}
                    className={
                      currentPage === 1 ? "pointer-events-none opacity-50" : ""
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
                      setCurrentPage((p) => Math.min(totalPages, p + 1));
                    }}
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>

      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-2xl">
            <h2 className="font-bold text-lg mb-4">Editar Feedback</h2>
            <div className="space-y-4">
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
              />
              <Textarea
                value={editDesc}
                onChange={(e) => setEditDesc(e.target.value)}
                rows={5}
              />
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="ghost" onClick={() => setEditingItem(null)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveEdit}>
                <Save className="mr-2 h-4 w-4" /> Salvar
              </Button>
            </div>
          </div>
        </div>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir permanentemente?</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Não</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600">
              Sim, excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
