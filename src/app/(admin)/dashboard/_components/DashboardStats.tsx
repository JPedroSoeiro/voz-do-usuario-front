"use client";

import { useEffect, useState } from "react";
import { FeedbackService } from "@/src/services/feedback";
import { Feedback } from "@/src/types/feedback";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Loader2,
  FileText,
  ThumbsUp,
  Activity,
  BarChart,
  PieChart,
  TrendingUp,
} from "lucide-react";

// 👇 DICIONÁRIOS DE TRADUÇÃO (Mesmos da Lista)
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

export default function DashboardStats() {
  const [stats, setStats] = useState({
    total: 0,
    votes: 0,
    pending: 0,
    concluded: 0,
    growth: 0,
    byStatus: {} as Record<string, number>,
    byCategory: {} as Record<string, number>,
    recents: [] as Feedback[],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function calculateStats() {
      try {
        const response = await FeedbackService.getAllFeedbacksAdmin({
          limit: 100,
          sort: "date",
        });
        const items: Feedback[] = response.items || [];

        // 2. CÁLCULOS MATEMÁTICOS

        // A. Total de Votos
        const totalVotes = items.reduce(
          (acc: number, item: Feedback) => acc + (item.total_votes || 0),
          0
        );

        // B. Contagem por Status
        const statusCount: Record<string, number> = {};
        items.forEach((item: Feedback) => {
          statusCount[item.status] = (statusCount[item.status] || 0) + 1;
        });

        // C. Contagem por Categoria
        const categoryCount: Record<string, number> = {};
        items.forEach((item: Feedback) => {
          categoryCount[item.category] =
            (categoryCount[item.category] || 0) + 1;
        });

        // D. Crescimento Semanal
        const now = new Date();
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const thisWeekCount = items.filter(
          (i: Feedback) => new Date(i.created_at) >= oneWeekAgo
        ).length;

        setStats({
          total: response.total || items.length,
          votes: totalVotes,
          pending: statusCount["pending"] || 0,
          concluded:
            (statusCount["done"] || 0) + (statusCount["accepted"] || 0),
          growth: thisWeekCount,
          byStatus: statusCount,
          byCategory: categoryCount,
          recents: items.slice(0, 5),
        });
      } catch (err) {
        console.error("Erro ao calcular stats:", err);
      } finally {
        setLoading(false);
      }
    }

    calculateStats();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
      </div>
    );

  return (
    <div className="space-y-6">
      {/* --- CARDS DE TOTAIS --- */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Feedbacks
            </CardTitle>
            <FileText className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Votos Totais
            </CardTitle>
            <ThumbsUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.votes}</div>
            <p className="text-xs text-gray-400 mt-1">Soma calculada</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Esta Semana
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{stats.growth}</div>
            <p className="text-xs text-gray-400">Novos itens (7 dias)</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Pendentes
            </CardTitle>
            <Activity className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
          </CardContent>
        </Card>
      </div>

      {/* --- GRÁFICOS --- */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* GRÁFICO 1: DISTRIBUIÇÃO POR STATUS */}
        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Por Status</CardTitle>
            <BarChart className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.keys(stats.byStatus).length === 0 && (
              <p className="text-sm text-gray-400">Sem dados.</p>
            )}
            {Object.entries(stats.byStatus).map(([status, count]) => (
              <div key={status} className="space-y-1">
                <div className="flex justify-between text-xs uppercase font-semibold text-gray-500">
                  {/* 👇 AQUI ESTÁ A TRADUÇÃO DO STATUS */}
                  <span>{statusMap[status] || status}</span>
                  <span>{count}</span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600"
                    style={{ width: `${(count / (stats.total || 1)) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* GRÁFICO 2: DISTRIBUIÇÃO POR CATEGORIA */}
        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Por Categoria</CardTitle>
            <PieChart className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.keys(stats.byCategory).length === 0 && (
              <p className="text-sm text-gray-400">Sem dados.</p>
            )}
            {Object.entries(stats.byCategory).map(([category, count]) => {
              const colorClass =
                category === "bug"
                  ? "bg-red-500"
                  : category === "feature"
                  ? "bg-purple-500"
                  : category === "improvement"
                  ? "bg-blue-500"
                  : "bg-gray-500";

              return (
                <div key={category} className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${colorClass}`} />
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between text-sm">
                      {/* 👇 AQUI ESTÁ A TRADUÇÃO DA CATEGORIA */}
                      <span className="capitalize text-gray-700">
                        {categoryMap[category] || category}
                      </span>
                      <span className="font-bold">{count}</span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-100 rounded-full">
                      <div
                        className={`h-full rounded-full ${colorClass}`}
                        style={{
                          width: `${(count / (stats.total || 1)) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* LISTA: ATIVIDADE RECENTE */}
        <Card className="col-span-1 md:col-span-2 lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {stats.recents.map((item) => (
                <li
                  key={item.id}
                  className="flex flex-col border-b pb-2 last:border-0"
                >
                  <span
                    className="font-medium text-sm truncate"
                    title={item.title}
                  >
                    {item.title}
                  </span>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-[10px] text-gray-400">
                      {new Date(item.created_at).toLocaleDateString()}
                    </span>
                    {/* 👇 AQUI ESTÁ A TRADUÇÃO DO STATUS (RECENTES) */}
                    <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded capitalize">
                      {statusMap[item.status] || item.status}
                    </span>
                  </div>
                </li>
              ))}
              {stats.recents.length === 0 && (
                <p className="text-gray-400 text-sm">
                  Nenhum feedback recente.
                </p>
              )}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
