"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Loader2,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

export default function FeedbackStats() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [feedbackToDelete, setFeedbackToDelete] = useState<string | null>(null);

  const fetchFeedbacks = async () => {
    setIsLoading(true);
    try {
      const data = await FeedbackService.getAll(
        1,
        "all",
        "all",
        "date",
        false,
        50
      );
      setFeedbacks(data.items);
    } catch (error) {
      console.error("Erro ao buscar feedbacks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const handleStatusChange = async (id: string, newStatus: any) => {
    try {
      setFeedbacks((prev) =>
        prev.map((f) => (f.id === id ? { ...f, status: newStatus } : f))
      );
      await FeedbackService.updateStatus(id, newStatus);
    } catch (error) {
      alert("Erro ao atualizar status");
      fetchFeedbacks();
    }
  };

  const handleDelete = async () => {
    if (!feedbackToDelete) return;
    try {
      await FeedbackService.delete(feedbackToDelete);
      setFeedbacks((prev) => prev.filter((f) => f.id !== feedbackToDelete));
    } catch (error) {
      alert("Erro ao excluir.");
    } finally {
      setFeedbackToDelete(null);
    }
  };

  const filteredFeedbacks = (feedbacks || []).filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "done":
        return "bg-green-100 text-green-700 border-green-200";
      case "accepted":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "in_progress":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "rejected":
        return "bg-red-50 text-red-600 border-red-200";
      default:
        return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

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
    <div className="space-y-6 w-full">
      {/* Cabeçalho Interno */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="bg-white px-3 py-1 rounded-md border shadow-sm text-xs font-medium text-gray-500">
          Total visível: {filteredFeedbacks.length}
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Buscar por título ou categoria..."
            className="pl-10 bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-200px bg-white">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <SelectValue placeholder="Filtrar Status" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="pending">Pendente</SelectItem>
            <SelectItem value="accepted">Aceito</SelectItem>
            <SelectItem value="in_progress">Em Progresso</SelectItem>
            <SelectItem value="done">Concluído</SelectItem>
            <SelectItem value="rejected">Rejeitado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Lista */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : filteredFeedbacks.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
            <p className="text-gray-500">Nenhum feedback encontrado.</p>
          </div>
        ) : (
          filteredFeedbacks.map((item) => (
            <div
              key={item.id}
              className="group bg-white rounded-lg border border-gray-100 p-4 hover:border-blue-300 transition-all flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center shadow-sm"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider border ${getStatusColor(
                      item.status
                    )}`}
                  >
                    {getStatusLabel(item.status)}
                  </span>
                  <span className="text-xs text-gray-400">
                    • {new Date(item.created_at).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-gray-900 truncate pr-4">
                  {item.title}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded capitalize">
                    {item.category}
                  </span>
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    👍 {item.votes}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-50">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="ml-auto sm:ml-0 text-xs h-8"
                    >
                      Alterar Status
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Mover para:</DropdownMenuLabel>
                    <DropdownMenuItem
                      onClick={() => handleStatusChange(item.id, "accepted")}
                    >
                      <CheckCircle className="h-4 w-4 mr-2 text-blue-500" />{" "}
                      Aceito
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleStatusChange(item.id, "in_progress")}
                    >
                      <Clock className="h-4 w-4 mr-2 text-yellow-500" /> Em
                      Progresso
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleStatusChange(item.id, "done")}
                    >
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />{" "}
                      Concluído
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleStatusChange(item.id, "rejected")}
                    >
                      <XCircle className="h-4 w-4 mr-2 text-red-500" />{" "}
                      Rejeitado
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4 text-gray-500" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      className="text-red-600 focus:text-red-600 focus:bg-red-50"
                      onClick={() => setFeedbackToDelete(item.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" /> Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))
        )}
      </div>

      <AlertDialog
        open={!!feedbackToDelete}
        onOpenChange={() => setFeedbackToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-2 text-red-600 font-bold">
              <AlertCircle className="h-5 w-5" />
              <AlertDialogTitle>Excluir Feedback?</AlertDialogTitle>
            </div>
            <AlertDialogDescription>
              Essa ação é irreversível. O feedback sumirá para todos os
              usuários.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Confirmar Exclusão
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
