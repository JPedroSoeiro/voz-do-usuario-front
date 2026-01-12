import { api } from "@/src/lib/api";

// Tipagem
export interface Feedback {
  id: number;
  title: string;
  description: string;
  category: "Melhoria" | "Funcionalidade" | "Bug" | "Outro";
  status: "novo" | "em analise" | "concluido" | "recusado";
  votes: number;
  has_voted: boolean;
  created_at: string;
  user?: {
    name: string;
    email: string;
  };
}

export interface CreateFeedbackDTO {
  title: string;
  description: string;
  category: string;
}

// Service
export const FeedbackService = {
  getAll: async (page = 1, category = "all", isAuth = false) => {
    const endpoint = isAuth ? "/feedback/feed" : "/feedback";
    const params = {
      page,
      limit: 4,
      ...(category !== "all" && { category }),
    };
    const { data } = await api.get(endpoint, { params });
    return data;
  },

  create: async (feedback: CreateFeedbackDTO) => {
    const { data } = await api.post("/feedback", feedback);
    return data;
  },

  addVote: async (id: number) => {
    const { data } = await api.post(`/feedback/${id}/vote`);
    return data;
  },

  removeVote: async (id: number) => {
    const { data } = await api.delete(`/feedback/${id}/vote`);
    return data;
  },

  getMyFeedbacks: async () => {
    const { data } = await api.get("/feedback/mine");
    return data;
  },
};
