import axios from "axios";
import { getSession } from "next-auth/react";

// Configura o Axios para bater na sua API (Porta 3001)
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Middleware que roda antes de cada requisição
api.interceptors.request.use(async (config) => {
  // Pega a sessão atual do NextAuth
  const session = await getSession();

  // Se o usuário estiver logado, pegamos o token "oficial" do Supabase
  // (que foi salvo na sessão lá no arquivo route.ts)
  if (session && (session as any).accessToken) {
    config.headers.Authorization = `Bearer ${(session as any).accessToken}`;
  }

  return config;
});
