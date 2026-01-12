import { api } from "@/src/lib/api";
import { Feedback, PaginatedResponse } from "@/src/types/feedback";

export const FeedbackService = {
  // --- PÚBLICO / USUÁRIO ---

  getAll: async (
    page = 1,
    category = "all",
    status = "all",
    sort = "date",
    isAuthenticated = false,
    limit = 4 // Agora suporta limite dinâmico
  ): Promise<PaginatedResponse<Feedback>> => {
    const offset = (page - 1) * limit;
    const endpoint = isAuthenticated ? "/feedback/feed" : "/feedback";

    const params: any = { limit, offset };

    if (category !== "all") params.category = category;
    if (status !== "all") params.status = status;
    if (sort === "votes") params.orderBy = "votes";

    const response = await api.get(endpoint, { params });
    return response.data;
  },

  getMine: async (page = 1): Promise<PaginatedResponse<Feedback>> => {
    const limit = 4;
    const offset = (page - 1) * limit;
    const response = await api.get("/feedback/my-feedbacks", {
      params: { limit, offset },
    });
    return response.data;
  },

  create: async (data: {
    title: string;
    description: string;
    category: string;
  }) => {
    return api.post("/feedback", data);
  },

  update: async (
    id: string,
    data: { title: string; description: string; category: string }
  ) => {
    return api.put(`/feedback/${id}`, data);
  },

  delete: async (id: string) => {
    // Tenta primeiro a rota de admin, se falhar (403), tenta a de usuário comum
    // Na prática, o backend deveria ter uma rota unificada ou tratarmos isso melhor,
    // mas para simplificar:
    try {
      // Tenta deletar como dono
      return await api.delete(`/feedback/${id}`);
    } catch (error) {
      // Se der erro, tenta deletar como admin (se a rota for diferente no seu backend)
      // Se a rota for a mesma, o erro acima já é o definitivo.
      throw error;
    }
  },

  addVote: async (id: string) => {
    return api.post(`/feedback/${id}/vote`);
  },

  removeVote: async (id: string) => {
    return api.delete(`/feedback/${id}/vote`);
  },

  // --- ADMIN (MODERAÇÃO) ---

  getPending: async () => {
    const response = await api.get("/admin/feedback/pending");
    return Array.isArray(response.data)
      ? response.data
      : response.data.items || [];
  },

  updateStatus: async (
    id: string,
    status: "accepted" | "rejected" | "in_progress" | "done"
  ) => {
    // Nota: Verifique se sua rota de admin no backend é exatamente essa
    return api.put(`/admin/feedback/${id}/status`, { status });
  },

  updatePriority: async (id: string, priority: "low" | "medium" | "high") => {
    return api.put(`/admin/feedback/${id}/priority`, { priority });
  },
};
