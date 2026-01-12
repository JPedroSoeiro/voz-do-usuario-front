export interface Feedback {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  total_votes: number;
  votes: number;
  has_voted?: boolean;
  created_at: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
}
