import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import axios from "axios";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // Executa apenas no login inicial
      if (account && user && account.provider === "google") {
        // Senha secreta padrão para usuários Google
        const secretPassword = `GoogleLogin@2026#${
          user.email
        }#${process.env.NEXTAUTH_SECRET?.slice(0, 5)}`;

        try {
          // 1. Tenta Logar
          let response = await axios.post(`${BACKEND_URL}/auth/login`, {
            email: user.email,
            password: secretPassword,
          });

          // 2. Se falhar (usuário não existe), Cria e Loga
          if (!response.data.session && !response.data.token) {
            console.log("[Auth] Criando usuário no backend...");
            await axios.post(`${BACKEND_URL}/auth/register`, {
              email: user.email,
              password: secretPassword,
              full_name: user.name,
            });
            // Tenta logar de novo após criar
            response = await axios.post(`${BACKEND_URL}/auth/login`, {
              email: user.email,
              password: secretPassword,
            });
          }

          const data = response.data;

          // Pega o token REAL do backend
          const apiToken =
            data.session?.access_token || data.token || data.access_token;
          // Pega a role REAL do backend (via metadata)
          const apiRole = data.user?.user_metadata?.role || "user";

          if (apiToken) {
            token.apiToken = apiToken;
            token.role = apiRole; // "admin" ou "user" conforme o banco de dados
          }
        } catch (error: any) {
          console.error(
            "[Auth] Erro ao sincronizar login:",
            error.response?.data || error.message
          );
        }
      }
      return token;
    },

    async session({ session, token }) {
      // @ts-ignore
      session.id_token = token.apiToken;
      // @ts-ignore
      session.user.role = token.role;
      return session;
    },
  },
  pages: { signIn: "/", error: "/" },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
