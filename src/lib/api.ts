import axios from "axios";
import { getSession } from "next-auth/react";

// Cria a instância do Axios apontando para o seu Backend (Porta 3001)
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // Certifique-se que no .env está http://localhost:3001
});

// Interceptor: Antes de cada pedido, injeta o Token do NextAuth
api.interceptors.request.use(async (config) => {
  // 1. Pega a sessão atual do NextAuth
  const session = await getSession();

  // 2. Se houver sessão e token, adiciona ao cabeçalho
  // Nota: Estamos usando (session as any) porque o Typescript padrão não sabe que adicionamos accessToken
  if (session && (session as any).accessToken) {
    config.headers.Authorization = `Bearer ${(session as any).accessToken}`;
  }

  return config;
});
