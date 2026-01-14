"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Search,
  MoreHorizontal,
  Trash2,
  Eye,
  MessageSquare,
} from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { FeedbackService } from "@/src/services/feedback";
import { Feedback } from "@/src/types/feedback";

const categoryMap: Record<string, string> = {
  bug: "Bug",
  feature: "Funcionalidade",
  improvement: "Melhoria",
  other: "Outro",
};

const statusMap: Record<string, { label: string; color: string }> = {
  pending: {
    label: "Pendente",
    color: "bg-yellow-50 text-yellow-700 border-yellow-100",
  },
  in_review: {
    label: "Em Análise",
    color: "bg-blue-50 text-blue-700 border-blue-100",
  },
  accepted: {
    label: "Aceito",
    color: "bg-purple-50 text-purple-700 border-purple-100",
  },
  rejected: {
    label: "Recusado",
    color: "bg-red-50 text-red-700 border-red-100",
  },
  in_progress: {
    label: "Em Andamento",
    color: "bg-orange-50 text-orange-700 border-orange-100",
  },
  done: {
    label: "Concluído",
    color: "bg-green-50 text-green-700 border-green-100",
  },
};

const priorityMap: Record<string, { label: string; color: string }> = {
  low: { label: "Baixa", color: "bg-gray-100 text-gray-600" },
  medium: { label: "Média", color: "bg-blue-100 text-blue-600" },
  high: { label: "Alta", color: "bg-orange-100 text-orange-600" },
  urgent: { label: "Urgente", color: "bg-red-100 text-red-600" },
};

export default function FeedbackList() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewingFeedback, setViewingFeedback] = useState<Feedback | null>(null);
  const itemsPerPage = 6;

  const fetchAdminFeedbacks = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await FeedbackService.getAllFeedbacksAdmin({
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm,
        status: statusFilter !== "all" ? statusFilter : undefined,
      });
      setFeedbacks(data.items || []);
      setTotalItems(data.total || 0);
    } catch (error) {
      console.error("Erro ao carregar feedbacks:", error);
      setFeedbacks([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, searchTerm, statusFilter]);

  useEffect(() => {
    fetchAdminFeedbacks();
  }, [fetchAdminFeedbacks]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await FeedbackService.updateStatus(id, newStatus);
      fetchAdminFeedbacks();
    } catch (error) {
      alert("Erro ao atualizar status.");
    }
  };

  const handlePriorityChange = async (id: string, newPriority: string) => {
    try {
      await FeedbackService.updatePriority(id, newPriority);
      fetchAdminFeedbacks();
    } catch (error) {
      alert("Erro ao atualizar prioridade.");
    }
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-4">
      {/* FILTROS */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-lg border shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Pesquisar..."
            className="pl-10 h-10"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Select
            value={statusFilter}
            onValueChange={(val) => {
              setStatusFilter(val);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-full md:w-44 bg-white border-gray-200">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Status</SelectItem>
              <SelectItem value="pending">Pendentes</SelectItem>
              <SelectItem value="accepted">Aceitos</SelectItem>
              <SelectItem value="done">Concluídos</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => fetchAdminFeedbacks()}>
            Atualizar
          </Button>
        </div>
      </div>

      {/* TABELA COM FIXO DE LARGURA (table-fixed) */}
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <Table className="table-fixed w-full">
          <TableHeader>
            <TableRow className="bg-gray-50/50">
              {/* Definimos larguras fixas para controlar o espaço */}
              <TableHead className="w-[45%]">Feedback</TableHead>
              <TableHead className="w-[15%]">Categoria</TableHead>
              <TableHead className="w-[15%]">Status</TableHead>
              <TableHead className="w-[15%]">Prioridade</TableHead>
              <TableHead className="w-[10%] text-right pr-6">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10">
                  Carregando...
                </TableCell>
              </TableRow>
            ) : feedbacks.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-10 text-gray-500"
                >
                  Nenhum feedback encontrado.
                </TableCell>
              </TableRow>
            ) : (
              feedbacks.map((item) => (
                <TableRow
                  key={item.id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  {/* CÉLULA DO TÍTULO COM LIMITAÇÃO (TRUNCATE) */}
                  <TableCell
                    className="cursor-pointer group overflow-hidden"
                    onClick={() => setViewingFeedback(item)}
                  >
                    <div className="flex flex-col w-full overflow-hidden">
                      <span className="font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors block">
                        {item.title}
                      </span>
                      <span className="text-[10px] text-gray-400 truncate block">
                        {item.description}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <span className="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-md border border-blue-100 uppercase tracking-tighter whitespace-nowrap">
                      {categoryMap[item.category] || item.category}
                    </span>
                  </TableCell>

                  <TableCell>
                    <div onClick={(e) => e.stopPropagation()}>
                      <Select
                        defaultValue={item.status}
                        onValueChange={(val) =>
                          handleStatusChange(item.id, val)
                        }
                      >
                        <SelectTrigger
                          className={`h-8 text-[10px] font-bold w-full max-w-130px ${
                            statusMap[item.status]?.color
                          }`}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(statusMap).map(([key, value]) => (
                            <SelectItem
                              key={key}
                              value={key}
                              className="text-xs"
                            >
                              {value.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div onClick={(e) => e.stopPropagation()}>
                      <Select
                        defaultValue={item.priority || "low"}
                        onValueChange={(val) =>
                          handlePriorityChange(item.id, val)
                        }
                      >
                        <SelectTrigger
                          className={`h-8 text-[10px] font-bold w-full max-w-110px ${
                            priorityMap[item.priority || "low"]?.color
                          }`}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(priorityMap).map(([key, value]) => (
                            <SelectItem
                              key={key}
                              value={key}
                              className="text-xs"
                            >
                              {value.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>

                  <TableCell className="text-right px-6">
                    <div onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => setViewingFeedback(item)}
                          >
                            <Eye className="h-4 w-4 mr-2" /> Ver Detalhes
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600 cursor-pointer">
                            <Trash2 className="h-4 w-4 mr-2" /> Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* PAGINAÇÃO */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center px-4 py-4 border-t bg-white rounded-b-lg">
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
            Página {currentPage} de {totalPages}
          </span>
          <Pagination className="w-auto mx-0">
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
                      className="cursor-pointer"
                    >
                      {page}
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

      {/* MODAL DE DETALHES */}
      <Dialog
        open={!!viewingFeedback}
        onOpenChange={() => setViewingFeedback(null)}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-blue-900 flex items-center gap-2">
              <MessageSquare className="h-5 w-5" /> Detalhes do Feedback
            </DialogTitle>
          </DialogHeader>
          {viewingFeedback && (
            <div className="space-y-4 pt-4">
              <div className="space-y-1">
                <h4 className="text-[10px] font-bold text-gray-400 uppercase">
                  Título
                </h4>
                <p className="text-lg font-black text-gray-900 leading-tight">
                  {viewingFeedback.title}
                </p>
              </div>
              <div className="space-y-1">
                <h4 className="text-[10px] font-bold text-gray-400 uppercase">
                  Descrição
                </h4>
                <div className="bg-gray-50 p-4 rounded-lg border text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">
                  {viewingFeedback.description}
                </div>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-md border border-blue-100 uppercase">
                  {categoryMap[viewingFeedback.category]}
                </span>
                <p className="text-xs font-bold text-gray-400 italic">
                  Votos: {viewingFeedback.total_votes || 0}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
