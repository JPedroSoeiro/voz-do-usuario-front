import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { createClient } from "@supabase/supabase-js";

// Inicializa o Supabase com as chaves que você JÁ TEM no .env
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      // Importante: forçar o Google a mandar o id_token
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      // Passa o token do Supabase para o Frontend
      if (session) {
        // @ts-ignore
        session.accessToken = token.supabaseAccessToken;
        if (session.user && token.sub) {
          // @ts-ignore
          session.user.id = token.sub;
        }
      }
      return session;
    },
    async jwt({ token, account }) {
      // Só roda no login inicial
      if (account && account.id_token) {
        try {
          // --- A TROCA DE CRACHÁ ---
          // Pegamos o crachá do Google (id_token) e trocamos por um do Supabase
          const { data, error } = await supabase.auth.signInWithIdToken({
            provider: "google",
            token: account.id_token, // O token que veio do Google
          });

          if (error) {
            console.error("Erro na troca de token Supabase:", error);
            throw error;
          }

          if (data.session) {
            // SUCESSO! Temos um token original do Supabase
            token.supabaseAccessToken = data.session.access_token;
            // Atualizamos o ID do usuário para ser o ID do Supabase (para bater com o banco)
            token.sub = data.user.id;
          }
        } catch (err) {
          console.error("Falha ao autenticar com Supabase via NextAuth", err);
        }
      }
      return token;
    },
  },
  pages: {
    signIn: "/",
  },
});

export { handler as GET, handler as POST };
