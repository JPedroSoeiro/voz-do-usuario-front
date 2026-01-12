"use client";

import { useEffect, useState } from "react";
import {
  Activity,
  Flame,
  Clock,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FeedbackService } from "@/src/services/feedback";
import { Feedback } from "@/src/types/feedback";

export default function DashboardStats() {
  const [isLoading, setIsLoading] = useState(true);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [totalCount, setTotalCount] = useState(0);

  // Carregar dados reais
  useEffect(() => {
    const loadStats = async () => {
      try {
        // Buscamos até 100 itens para ter uma estatística relevante
        // isAuthenticated = false para pegar a visão global pública
        const data = await FeedbackService.getAll(
          1,
          "all",
          "all",
          "date",
          false,
          100
        );
        setFeedbacks(data.items);
        setTotalCount(data.total); // Total real do banco
      } catch (error) {
        console.error("Erro ao carregar estatísticas", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadStats();
  }, []);

  // --- CÁLCULOS DINÂMICOS ---

  // 1. Totais
  const totalVotes = feedbacks.reduce((acc, curr) => acc + curr.votes, 0);
  const inProgressCount = feedbacks.filter(
    (f) => f.status === "in_progress"
  ).length;
  const doneCount = feedbacks.filter((f) => f.status === "done").length;

  // 2. Por Categoria (Agrupamento)
  const byCategory = feedbacks.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // 3. Por Status (Agrupamento)
  const byStatus = feedbacks.reduce((acc, curr) => {
    acc[curr.status] = (acc[curr.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // 4. Mais Votados (Top 5)
  const topVoted = [...feedbacks].sort((a, b) => b.votes - a.votes).slice(0, 5);

  // Tradução de labels para exibição
  const translateStatus = (s: string) => {
    const map: any = {
      pending: "Pendente",
      accepted: "Aceito",
      done: "Concluído",
      rejected: "Rejeitado",
      in_progress: "Em Progresso",
    };
    return map[s] || s;
  };
  const translateCategory = (c: string) => {
    const map: any = {
      improvement: "Melhoria",
      feature: "Funcionalidade",
      bug: "Bug",
    };
    return map[c] || c;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40 text-blue-600">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <>
      {/* --- PRIMEIRA FILEIRA: CARDS DE RESUMO --- */}

      {/* Total Feedbacks */}
      <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-100">
        <div className="p-5">
          <div className="flex items-center">
            <div className="shrink-0 bg-blue-100 rounded-md p-3">
              <Activity className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Total de Feedbacks
                </dt>
                <dd>
                  <div className="text-2xl font-bold text-gray-900">
                    {totalCount}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Total Votos */}
      <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-100">
        <div className="p-5">
          <div className="flex items-center">
            <div className="shrink-0 bg-red-100 rounded-md p-3">
              <Flame className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Total de Votos
                </dt>
                <dd>
                  <div className="text-2xl font-bold text-gray-900">
                    {totalVotes}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Em Progresso */}
      <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-100">
        <div className="p-5">
          <div className="flex items-center">
            <div className="shrink-0 bg-yellow-100 rounded-md p-3">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Em Progresso
                </dt>
                <dd>
                  <div className="text-2xl font-bold text-gray-900">
                    {inProgressCount}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Concluídos */}
      <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-100">
        <div className="p-5">
          <div className="flex items-center">
            <div className="shrink-0 bg-green-100 rounded-md p-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Concluídos
                </dt>
                <dd>
                  <div className="text-2xl font-bold text-gray-900">
                    {doneCount}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* --- SEGUNDA FILEIRA: LISTAS DETALHADAS --- */}

      {/* Por Categoria */}
      <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-100 lg:col-span-2">
        <div className="p-5">
          <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5" /> Por Categoria
          </h3>
          <div className="space-y-3">
            {Object.keys(byCategory).length === 0 ? (
              <span className="text-gray-400 text-sm">Sem dados.</span>
            ) : (
              Object.entries(byCategory).map(([cat, count]) => (
                <div
                  key={cat}
                  className="flex justify-between text-sm font-medium text-gray-600 border-b border-gray-50 pb-2 last:border-0"
                >
                  <span className="capitalize flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        cat === "bug"
                          ? "bg-red-400"
                          : cat === "feature"
                          ? "bg-purple-400"
                          : "bg-blue-400"
                      }`}
                    ></span>
                    {translateCategory(cat)}
                  </span>
                  <span className="bg-gray-100 px-2 py-0.5 rounded-full text-xs text-gray-800">
                    {count}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Por Status */}
      <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-100 lg:col-span-2">
        <div className="p-5">
          <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
            <Activity className="h-5 w-5" /> Por Status
          </h3>
          <div className="space-y-3">
            {Object.keys(byStatus).length === 0 ? (
              <span className="text-gray-400 text-sm">Sem dados.</span>
            ) : (
              Object.entries(byStatus).map(([st, count]) => (
                <div
                  key={st}
                  className="flex justify-between text-sm font-medium text-gray-600 border-b border-gray-50 pb-2 last:border-0"
                >
                  <span className="capitalize">{translateStatus(st)}</span>
                  <span className="bg-gray-100 px-2 py-0.5 rounded-full text-xs text-gray-800">
                    {count}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* --- TERCEIRA FILEIRA: MAIS VOTADOS --- */}

      <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-100 lg:col-span-4">
        <div className="p-5">
          <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
            <Flame className="h-5 w-5 text-red-500" /> Feedbacks Mais Votados
          </h3>

          <div className="space-y-4">
            {topVoted.length === 0 ? (
              <div className="text-center py-4 text-gray-400">
                Nenhum feedback com votos ainda.
              </div>
            ) : (
              topVoted.map((feedback) => (
                <div
                  key={feedback.id}
                  className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm font-medium text-gray-900 border-b border-gray-100 last:border-0 pb-3 last:pb-0 gap-2"
                >
                  <span className="truncate max-w-md" title={feedback.title}>
                    {feedback.title}
                  </span>
                  <div className="flex items-center gap-x-4 w-full sm:w-auto justify-between sm:justify-end">
                    <span className="text-blue-600 font-bold bg-blue-50 px-2 py-1 rounded text-xs">
                      {feedback.votes} votos
                    </span>
                    {/* Botão de Editar removido pois é apenas visualização estatística rápida, 
                                mas se quiser pode descomentar e linkar com o modal de edição */}
                    {/* <Button size="sm" variant="outline" className="h-7 text-xs">Ver</Button> */}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
