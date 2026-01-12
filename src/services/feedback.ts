import { api } from "@/src/lib/api";
import { Feedback, PaginatedResponse } from "@/src/types/feedback";

export const FeedbackService = {
  getAll: async (
    page = 1,
    category = "all",
    status = "all",
    sort = "date",
    isAuthenticated = false
  ): Promise<PaginatedResponse<Feedback>> => {
    const limit = 4;
    const offset = (page - 1) * limit;
    const endpoint = isAuthenticated ? "/feedback/feed" : "/feedback";

    const params: any = { limit, offset };
    if (category && category !== "all") params.category = category;
    if (status && status !== "all") params.status = status;
    if (sort && sort !== "recent") params.sort = sort;

    const response = await api.get(endpoint, { params });
    const rawData = response.data;

    let items: Feedback[] = [];
    let total = 0;

    if (Array.isArray(rawData)) {
      items = rawData;
      total = rawData.length;
    } else if (rawData.items) {
      items = rawData.items;
      total = rawData.total;
    } else if (rawData.data) {
      items = rawData.data;
      total = rawData.count || rawData.data.length;
    }

    items = items.map((item) => ({
      ...item,
      votes: item.total_votes ?? item.votes ?? 0,
    }));

    return { items, total };
  },

  getMine: async (page = 1): Promise<PaginatedResponse<Feedback>> => {
    const limit = 20;
    const offset = (page - 1) * limit;

    const response = await api.get("/feedback/mine", {
      params: { limit, offset, sort: "date" },
    });

    return {
      items: response.data.items || [],
      total: response.data.total || 0,
    };
  },

  // --- ESCRITA (Estas eram as funções que faltavam!) ---

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
    return api.delete(`/feedback/${id}`);
  },

  // --- VOTOS ---

  addVote: async (id: string) => {
    return api.post(`/feedback/${id}/vote`);
  },

  removeVote: async (id: string) => {
    return api.delete(`/feedback/${id}/vote`);
  },
};
