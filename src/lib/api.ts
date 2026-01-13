import axios from "axios";
import { getSession } from "next-auth/react";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
});

// Interceptor: Antes de cada requisição, coloca o token
api.interceptors.request.use(async (config) => {
  const session = await getSession();

  // @ts-ignore
  const token = session?.id_token; // O token que salvamos no [...nextauth]/route.ts

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
