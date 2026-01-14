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
    limit = 4
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
    // Rota para pegar os feedbacks do próprio usuário
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
    try {
      return await api.delete(`/feedback/${id}`);
    } catch (error) {
      throw error;
    }
  },

  addVote: async (id: string) => {
    return api.post(`/feedback/${id}/vote`);
  },

  removeVote: async (id: string) => {
    return api.delete(`/feedback/${id}/vote`);
  },

  // --- ADMIN (MODERAÇÃO & ESTATÍSTICAS) ---

  // 👇 NOVA FUNÇÃO: Busca o resumo para os Cards e Gráficos do Dashboard
  getDashboardSummary: async () => {
    const { data } = await api.get("/admin/dashboard/summary");
    return data;
  },

  getPending: async () => {
    const response = await api.get("/admin/feedback/pending");
    return Array.isArray(response.data)
      ? response.data
      : response.data.items || [];
  },

  getAllAdmin: async (
    page = 1,
    status = "all",
    category = "all",
    search = ""
  ) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: "10",
      orderBy: "date",
    });

    if (status !== "all") params.append("status", status);
    if (category !== "all") params.append("category", category);
    if (search) params.append("search", search);

    // Rota correta (singular)
    const response = await api.get(`/admin/feedback?${params.toString()}`);
    return response.data;
  },

  // Admin deleta qualquer um
  deleteAdmin: async (id: string) => {
    return api.delete(`/admin/feedback/${id}`);
  },

  // Admin edita qualquer um
  updateAdmin: async (id: string, data: any) => {
    return api.put(`/admin/feedback/${id}`, data);
  },

  getAllFeedbacksAdmin: async (params: any) => {
    // params = { search, status, category, priority, sort, page, limit }
    const { data } = await api.get("/admin/feedback", { params });
    return data;
  },

  // 👇 NOVAS: Ações de Moderação (Req. 7)
  updateStatus: async (id: string, status: string) => {
    const { data } = await api.put(`/admin/feedback/${id}/status`, { status });
    return data;
  },

  updatePriority: async (id: string, priority: string) => {
    const { data } = await api.put(`/admin/feedback/${id}/priority`, {
      priority,
    });
    return data;
  },

  deleteFeedback: async (id: string) => {
    await api.delete(`/admin/feedback/${id}`);
  },
};
