import { api } from "@/src/lib/api";
import { Feedback, PaginatedResponse } from "../types/feedback";

export const FeedbackService = {
  // Lista pública (para visitantes)
  getAllFeedbacks: async ({
    page = 1,
    limit = 5,
    search = "",
    category = "all",
    status = "all",
    sort = "date",
  }) => {
    const offset = (page - 1) * limit;
    const { data } = await api.get("/feedback", {
      params: {
        limit,
        offset,
        search: search || undefined,
        category: category !== "all" ? category : undefined,
        status: status !== "all" ? status : undefined,
        sort,
      },
    });
    return Array.isArray(data)
      ? { items: data, total: data.length, limit, offset }
      : data;
  },

  // Feed logado (com has_voted)
  getFeed: async ({
    page = 1,
    limit = 5,
    search = "",
    category = "all",
    status = "all",
    sort = "date",
  }) => {
    const offset = (page - 1) * limit;
    const { data } = await api.get("/feedback/feed", {
      params: {
        limit,
        offset,
        search: search || undefined,
        category: category !== "all" ? category : undefined,
        status: status !== "all" ? status : undefined,
        sort,
      },
    });
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
    const offset = (page - 1) * limit;

    const { data } = await api.get("/feedback/mine", {
      params: {
        limit,
        offset,
        search: search || undefined,
        status: status !== "all" ? status : undefined,
      },
    });

    if (Array.isArray(data)) {
      return { items: data, total: data.length, limit, offset };
    }
    return data;
  },

  // 👇 CORREÇÃO: Adicionado 'sort' à tipagem e aos parâmetros
  getAllFeedbacksAdmin: async ({
    page = 1,
    limit = 6,
    search = "",
    status = "all",
    sort = "date",
  }: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    sort?: string;
  }) => {
    const offset = (page - 1) * limit;

    const { data } = await api.get("/admin/feedback", {
      params: {
        limit,
        offset,
        search: search || undefined,
        status: status !== "all" ? status : undefined,
        sort,
      },
    });

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

  // Moderação Admin (Status e Prioridade)
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
