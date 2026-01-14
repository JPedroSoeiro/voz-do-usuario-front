"use client";

import { useEffect, useState, useCallback } from "react";
import { FeedbackService } from "@/src/services/feedback";
import { Feedback } from "@/src/types/feedback";
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
  Loader2,
  Trash2,
  Search,
  X,
  User,
  Mail,
  FileText,
  Calendar,
  Hash,
} from "lucide-react";

// 👇 TRADUÇÕES PADRONIZADAS (Iguais ao formulário do usuário)
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
  in_progress: "Em Andamento", // Ajustado para português mais natural
  done: "Concluído",
};

const priorityMap: Record<string, string> = {
  low: "Baixa",
  medium: "Média",
  high: "Alta",
};

export default function FeedbackList() {
  const [items, setItems] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(false);

  // Estado para o Modal
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(
    null
  );

  // Filtros
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await FeedbackService.getAllFeedbacksAdmin({
        search,
        status: status === "all" ? undefined : status,
        limit: 10,
        offset: (page - 1) * 10,
        sort: "date",
      });
      setItems(res.items || []);
      setTotalPages(Math.ceil((res.total || 0) / 10));
    } catch (error) {
      console.error("Erro ao listar feedbacks:", error);
    } finally {
      setLoading(false);
    }
  }, [page, status, search]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Ações
  const handleStatus = async (id: string, val: string) => {
    try {
      await FeedbackService.updateStatus(id, val);
      fetchData();
    } catch (e) {
      alert("Erro ao atualizar status");
    }
  };

  const handlePriority = async (id: string, val: string) => {
    try {
      await FeedbackService.updatePriority(id, val);
      fetchData();
    } catch (e) {
      alert("Erro ao atualizar prioridade");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Excluir permanentemente?")) return;
    try {
      await FeedbackService.deleteFeedback(id);
      fetchData();
    } catch (e) {
      alert("Erro ao excluir");
    }
  };

  return (
    <div className="space-y-6">
      {/* FILTROS */}
      <div className="flex flex-col md:flex-row gap-3 bg-white p-4 rounded-lg border shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Buscar por título..."
            className="pl-9 bg-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-48 bg-white">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="pending">Pendente</SelectItem>
            <SelectItem value="accepted">Aceito</SelectItem>
            <SelectItem value="in_progress">Em Andamento</SelectItem>
            <SelectItem value="done">Concluído</SelectItem>
            <SelectItem value="rejected">Recusado</SelectItem>
          </SelectContent>
        </Select>

        <Button onClick={() => setPage(1)}>Filtrar</Button>
      </div>

      {/* TABELA */}
      <div className="bg-white border rounded-md overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-600 font-medium border-b">
            <tr>
              <th className="p-4">Feedback (Clique para ver)</th>
              <th className="p-4">Categoria</th>
              <th className="p-4">Votos</th>
              <th className="p-4">Status</th>
              <th className="p-4">Prioridade</th>
              <th className="p-4 w-10"></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="p-8 text-center">
                  <Loader2 className="animate-spin inline mr-2" />
                  Carregando...
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-12 text-center text-gray-400">
                  Nenhum feedback encontrado.
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr
                  key={item.id}
                  className="border-b last:border-0 hover:bg-gray-50 transition-colors"
                >
                  <td
                    className="p-4 max-w-xs group cursor-pointer"
                    onClick={() => setSelectedFeedback(item)}
                  >
                    <div
                      className="font-semibold text-gray-800 truncate group-hover:text-blue-600 transition-colors"
                      title="Clique para detalhes"
                    >
                      {item.title}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {new Date(item.created_at).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="p-4">
                    {/* Exibe a tradução correta */}
                    <span className="px-2 py-1 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100 whitespace-nowrap">
                      {categoryMap[item.category] || item.category}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-gray-600">
                    {item.total_votes}
                  </td>

                  {/* Select Status */}
                  <td className="p-4">
                    <select
                      className="bg-white border border-gray-300 rounded px-2 py-1 text-xs w-full cursor-pointer focus:ring-2 focus:ring-blue-500 outline-none"
                      value={item.status}
                      onChange={(e) => handleStatus(item.id, e.target.value)}
                    >
                      {Object.entries(statusMap).map(([key, label]) => (
                        <option key={key} value={key}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </td>

                  {/* Select Prioridade */}
                  <td className="p-4">
                    <select
                      className="bg-white border border-gray-300 rounded px-2 py-1 text-xs w-full cursor-pointer focus:ring-2 focus:ring-blue-500 outline-none"
                      value={item.priority || "low"}
                      onChange={(e) => handlePriority(item.id, e.target.value)}
                    >
                      {Object.entries(priorityMap).map(([key, label]) => (
                        <option key={key} value={key}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-gray-400 hover:text-red-600 p-2 rounded hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINAÇÃO */}
      <div className="flex justify-end gap-2 pt-2">
        <Button
          variant="outline"
          size="sm"
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
        >
          Anterior
        </Button>
        <div className="flex items-center text-sm text-gray-500 px-2">
          Página {page} de {totalPages || 1}
        </div>
        <Button
          variant="outline"
          size="sm"
          disabled={page >= totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Próxima
        </Button>
      </div>

      {/* MODAL DETALHADO */}
      {selectedFeedback && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            {/* Cabeçalho */}
            <div className="flex justify-between items-start p-6 border-b bg-gray-50 sticky top-0">
              <div>
                <h2 className="text-xl font-bold text-gray-800 max-w-350px">
                  {selectedFeedback.title}
                </h2>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200">
                    {categoryMap[selectedFeedback.category] ||
                      selectedFeedback.category}
                  </span>
                  <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                    {statusMap[selectedFeedback.status] ||
                      selectedFeedback.status}
                  </span>
                  {selectedFeedback.priority && (
                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-700 border border-orange-200">
                      Prioridade:{" "}
                      {priorityMap[selectedFeedback.priority] ||
                        selectedFeedback.priority}
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => setSelectedFeedback(null)}
                className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Corpo */}
            <div className="p-6 space-y-6">
              {/* Descrição Completa */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <FileText className="h-4 w-4 text-blue-500" />
                  Descrição do Problema / Ideia
                </div>
                <div className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-md border min-h-100px whitespace-pre-wrap">
                  {selectedFeedback.description}
                </div>
              </div>

              {/* Dados do Autor */}
              <div className="border-t pt-4 mt-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <User className="h-4 w-4" /> Informações do Autor
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-3 rounded-lg border border-dashed">
                  <div className="space-y-1">
                    <span className="text-xs text-gray-500 uppercase font-bold">
                      Nome
                    </span>
                    <div className="text-sm font-medium text-gray-900">
                      {selectedFeedback.profiles?.full_name ||
                        selectedFeedback.user_name ||
                        "Não informado (Backend)"}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs text-gray-500 uppercase font-bold flex items-center gap-1">
                      <Mail className="h-3 w-3" /> Email
                    </span>
                    <div className="text-sm text-gray-600">
                      {selectedFeedback.profiles?.email ||
                        selectedFeedback.user_email ||
                        "Não informado"}
                    </div>
                  </div>

                  <div className="space-y-1 col-span-2">
                    <span className="text-xs text-gray-500 uppercase font-bold flex items-center gap-1">
                      <Hash className="h-3 w-3" /> ID do Usuário (Sistema)
                    </span>
                    <div className="text-xs font-mono bg-white border p-1 rounded text-gray-500">
                      {selectedFeedback.user_id}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-400 pt-2 justify-center">
                <Calendar className="h-3 w-3" />
                Criado em:{" "}
                {new Date(selectedFeedback.created_at).toLocaleString()}
              </div>
            </div>

            {/* Rodapé */}
            <div className="p-4 border-t bg-gray-50 flex justify-end">
              <Button
                onClick={() => setSelectedFeedback(null)}
                variant="secondary"
              >
                Fechar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
