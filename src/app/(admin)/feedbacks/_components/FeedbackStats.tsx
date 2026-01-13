"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  MoreHorizontal,
  Loader2,
  Trash2,
  Edit,
  CheckCircle,
  XCircle,
  Clock,
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
// Se você tiver o modal de edição importado, use-o aqui
import EditFeedback from "@/src/app/(main)/homepage/_components/EditFeedback";

export default function FeedbackStats() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Controle de Edição/Exclusão
  const [editingFeedback, setEditingFeedback] = useState<Feedback | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const fetchAllFeedbacks = async () => {
    setIsLoading(true);
    try {
      // AQUI ESTÁ A MUDANÇA: Usamos o método de Admin
      const data = await FeedbackService.getAllAdmin(
        1, // Página
        statusFilter,
        categoryFilter,
        searchTerm // Agora a busca vai pro backend
      );
      setFeedbacks(data.items || []);
    } catch (error) {
      console.error("Erro ao buscar feedbacks de admin:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounce para busca (espera parar de digitar)
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAllFeedbacks();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, statusFilter, categoryFilter]);

  const handleDelete = async (id: string) => {
    if (
      !confirm("Tem certeza que deseja apagar este feedback permanentemente?")
    )
      return;
    try {
      await FeedbackService.deleteAdmin(id);
      fetchAllFeedbacks(); // Recarrega a lista
    } catch (error) {
      alert("Erro ao excluir.");
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await FeedbackService.updateAdmin(id, { status: newStatus });
      fetchAllFeedbacks();
    } catch (error) {
      alert("Erro ao atualizar status");
    }
  };

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-lg font-bold">Gerenciamento Geral</h2>
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
          Total: {feedbacks.length}
        </span>
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Buscar por título, descrição..."
            className="pl-10 bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="bg-white" suppressHydrationWarning>
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as Categorias</SelectItem>
            <SelectItem value="improvement">Melhoria</SelectItem>
            <SelectItem value="feature">Funcionalidade</SelectItem>
            <SelectItem value="bug">Bug</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="bg-white" suppressHydrationWarning>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Status</SelectItem>
            <SelectItem value="pending">Pendente</SelectItem>
            <SelectItem value="accepted">Aceito</SelectItem>
            <SelectItem value="in_progress">Em Progresso</SelectItem>
            <SelectItem value="done">Concluído</SelectItem>
            <SelectItem value="rejected">Rejeitado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabela / Lista */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin" />
          </div>
        ) : feedbacks.length === 0 ? (
          <div className="text-center py-10 text-gray-500 border border-dashed rounded-lg">
            Nenhum feedback encontrado com esses filtros.
          </div>
        ) : (
          feedbacks.map((item: any) => (
            <div
              key={item.id}
              className="bg-white p-4 rounded-lg border shadow-sm flex flex-col md:flex-row gap-4 justify-between items-start md:items-center"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${
                      item.status === "done"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {item.status}
                  </span>
                  <span className="text-xs text-gray-400">
                    Por: {item.author || item.profiles?.name || "Anônimo"}
                  </span>
                </div>
                <h3 className="font-bold text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-500 truncate max-w-lg">
                  {item.description}
                </p>
              </div>

              {/* Ações de Admin */}
              <div className="flex items-center gap-2">
                {/* Menu de Status Rápido */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8">
                      Status
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => handleStatusChange(item.id, "accepted")}
                    >
                      Aceitar
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleStatusChange(item.id, "in_progress")}
                    >
                      Em Progresso
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleStatusChange(item.id, "done")}
                    >
                      Concluir
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleStatusChange(item.id, "rejected")}
                      className="text-red-600"
                    >
                      Rejeitar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Botão Editar (Abre o mesmo modal da home, mas com permissão total) */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setEditingFeedback(item);
                    setIsEditModalOpen(true);
                  }}
                >
                  <Edit className="h-4 w-4 text-blue-600" />
                </Button>

                {/* Botão Excluir */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(item.id)}
                >
                  <Trash2 className="h-4 w-4 text-red-600" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      <EditFeedback
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        feedback={editingFeedback}
        onSuccess={fetchAllFeedbacks}
      />
    </div>
  );
}
