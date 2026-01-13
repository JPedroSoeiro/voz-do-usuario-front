import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { api } from "@/src/lib/api";

const authOptions: NextAuthOptions = {
  providers: [
    // 1. Google: Para a Homepage (Usuários comuns)
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),

    // 2. Credenciais: EXCLUSIVO para o Admin (via login-admin)
    CredentialsProvider({
      name: "Admin Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          // Chama seu backend para validar admin
          const response = await api.post("/auth/login", {
            email: credentials.email,
            password: credentials.password,
          });

          const user = response.data;

          // Só permite login se tiver token e for admin (opcional validar role aqui)
          if (user && user.token) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role, // O backend deve retornar "admin"
              token: user.token,
            };
          }
          return null;
        } catch (error) {
          console.error("Falha no login admin:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.role = user.role;
        token.id_token = user.token;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        session.user.role = token.role;
        session.user.id = token.id;
        // @ts-ignore
        session.id_token = token.id_token;
      }
      return session;
    },
  },
  // 👇 A MÁGICA ESTÁ AQUI:
  // Dizemos ao NextAuth: "Se precisar logar, mande para ESTA tela, não a padrão"
  pages: {
    signIn: "/login-admin",
    error: "/login-admin", // Se errar a senha, volta para lá
  },
  session: {
    strategy: "jwt",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
