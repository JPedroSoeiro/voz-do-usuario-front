export interface Feedback {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: "bug" | "feature" | "improvement" | "other";
  status:
    | "pending"
    | "in_review"
    | "accepted"
    | "rejected"
    | "in_progress"
    | "done";
  priority?: "low" | "medium" | "high";
  total_votes: number;
  created_at: string;
  updated_at: string;
  has_voted?: boolean;

  // 👇 ADICIONE ISTO PARA O MODAL
  profiles?: {
    full_name: string;
    email: string;
  };
  // Caso o backend mande plano (sem objeto profiles):
  user_email?: string;
  user_name?: string;
}

export interface PaginatedResponse<T> {
  total: number;
  items: T[];
  limit: number;
  offset: number;
}
