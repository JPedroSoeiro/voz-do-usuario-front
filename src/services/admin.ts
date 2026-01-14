import { api } from "@/src/lib/api";
import { Feedback } from "@/src/types/feedback";

export interface DashboardData {
  totalFeedbacks: number;
  totalVotes: number;
  byStatus: Record<string, number>;
  recent_activity: Feedback[];
}

export const AdminService = {
  // 9) Dashboard
  getDashboardSummary: async (): Promise<DashboardData> => {
    const { data } = await api.get("/admin/dashboard/summary");
    return data;
  },

  // 8) Listagem com Filtros
  getAllFeedbacks: async (params: any) => {
    // params = { search, status, category, priority, sort, page, limit }
    const { data } = await api.get("/admin/feedback", { params });
    return data;
  },

  // 7) Ações de Moderação
  updateStatus: async (id: string, status: string) => {
    await api.put(`/admin/feedback/${id}/status`, { status });
  },

  updatePriority: async (id: string, priority: string) => {
    await api.put(`/admin/feedback/${id}/priority`, { priority });
  },

  deleteFeedback: async (id: string) => {
    await api.delete(`/admin/feedback/${id}`);
  },
};
