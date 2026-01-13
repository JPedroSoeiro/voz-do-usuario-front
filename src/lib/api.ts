import axios from "axios";
import { getSession } from "next-auth/react";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
});

// O "Carteiro" que cola o selo (Token) antes de enviar a carta
api.interceptors.request.use(async (config) => {
  // 1. Busca a sessão atual do navegador
  const session = await getSession();

  // 2. Tenta pegar o token (baseado no route.ts que configuramos antes)
  // @ts-ignore
  const token = session?.id_token || session?.user?.token;

  // 3. Se tiver token, coloca no cabeçalho
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    // console.log("[Axios] Token injetado com sucesso!"); // Descomente para debug
  } else {
    // console.warn("[Axios] Atenção: Enviando requisição SEM token!");
  }

  return config;
});
