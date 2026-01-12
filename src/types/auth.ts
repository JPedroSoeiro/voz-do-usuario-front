export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: "user" | "admin";
  created_at: string;
}
