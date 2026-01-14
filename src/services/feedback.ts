// src/services/feedback.ts
import { api } from "@/src/lib/api";
import { Feedback, PaginatedResponse } from "../types/feedback";

export const FeedbackService = {
  // Lista pública (para visitantes)
  getAllFeedbacks: async (
    params: any
  ): Promise<PaginatedResponse<Feedback>> => {
    const { data } = await api.get("/feedback", { params });
    // Se o backend retornar array direto, transformamos em objeto
    return Array.isArray(data)
      ? { items: data, total: data.length, limit: 10, offset: 0 }
      : data;
  },

  // Feed logado (com has_voted)
  getFeed: async (params: any): Promise<PaginatedResponse<Feedback>> => {
    const { data } = await api.get("/feedback/feed", { params });
    return data;
  },

  // Meus Feedbacks (Ponto 6)
  getMyFeedbacks: async ({
    page = 1,
    limit = 3,
    search = "",
    status = "all",
  }: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }) => {
    // Cálculo do offset para a paginação
    const offset = (page - 1) * limit;

    const { data } = await api.get("/feedback/mine", {
      params: {
        limit,
        offset,
        // Só envia o parâmetro de busca se houver algo digitado
        search: search || undefined,
        // Se o status for "all", enviamos undefined para o backend ignorar o filtro
        status: status !== "all" ? status : undefined,
      },
    });

    // Tratamento de resposta (Array vs Objeto Paginado)
    if (Array.isArray(data)) {
      return {
        items: data,
        total: data.length,
        limit,
        offset,
      };
    }

    return data;
  },

  // Criar e Editar
  create: async (payload: {
    title: string;
    description: string;
    category: string;
  }) => {
    return api.post("/feedback", payload);
  },

  // 👇 CORREÇÃO: category agora é opcional (?) para não dar erro no MyFeedbacks
  update: async (
    id: string,
    payload: { title?: string; description?: string; category?: string }
  ) => {
    return api.put(`/feedback/${id}`, payload);
  },

  // Votos
  vote: async (id: string) => {
    return api.post(`/feedback/${id}/vote`);
  },

  removeVote: async (id: string) => {
    return api.delete(`/feedback/${id}/vote`);
  },

  // Moderação Admin
  getAllFeedbacksAdmin: async (
    params: any
  ): Promise<PaginatedResponse<Feedback>> => {
    const { data } = await api.get("/admin/feedback", { params });
    return data;
  },

  updateStatus: async (id: string, status: string) => {
    return api.put(`/admin/feedback/${id}/status`, { status });
  },

  updatePriority: async (id: string, priority: string) => {
    return api.put(`/admin/feedback/${id}/priority`, { priority });
  },

  deleteFeedback: async (id: string) => {
    return api.delete(`/feedback/${id}`);
  },
};
