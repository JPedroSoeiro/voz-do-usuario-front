import { api } from "@/src/lib/api";

export interface RegisterDTO {
  email: string;
  password: string;
  full_name: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  // Adicione outros campos que o backend retornar no /me
}

export const AuthService = {
  /**
   * Registra um novo usuário no Backend (Supabase)
   * - POST /auth/register
   */
  register: async (data: RegisterDTO) => {
    const response = await api.post("/auth/register", data);
    return response.data;
  },

  /**
   * Faz login com email e senha
   * - POST /auth/login
   */
  login: async (data: LoginDTO) => {
    const response = await api.post("/auth/login", data);
    return response.data;
  },

  /**
   * Verifica quem é o usuário atual (baseado no Token enviado)
   * - GET /auth/me
   */
  getMe: async () => {
    const response = await api.get<UserProfile>("/auth/me");
    return response.data;
  },
};
