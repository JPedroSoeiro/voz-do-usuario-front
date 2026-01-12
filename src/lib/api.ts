import axios from "axios";
import { getSession } from "next-auth/react";

export const api = axios.create({
  // Garanta que esta porta é a mesma onde seu Backend (NestJS) está rodando
  baseURL: "http://localhost:3001",
});

// Interceptador: Roda antes de cada requisição sair do front
api.interceptors.request.use(async (config) => {
  // Busca a sessão atual do usuário
  const session: any = await getSession();

  // Se o usuário estiver logado e tiver o token, injeta no cabeçalho
  if (session?.id_token) {
    config.headers.Authorization = `Bearer ${session.id_token}`;
  }

  return config;
});
