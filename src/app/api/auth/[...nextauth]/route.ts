import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

// Ajuste se sua API estiver em outra porta/URL
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

const authOptions: AuthOptions = {
  providers: [
    // 1. Provider de Email/Senha (Para o ADMIN)
    CredentialsProvider({
      name: "Admin Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          // Tenta logar no backend (vai cair no Backdoor do admin ou login normal)
          const response = await axios.post(`${BACKEND_URL}/auth/login`, {
            email: credentials.email,
            password: credentials.password,
          });

          const data = response.data;

          // Verifica se veio token (suporta o formato do Backdoor e do Supabase)
          const token = data.token || data.session?.access_token;

          if (token) {
            return {
              id: data.user?.id || "admin-id",
              name: data.user?.user_metadata?.full_name || "Admin",
              email: data.user?.email,
              role: "admin", // Marca importante para o JWT saber que é admin
              token: token,
            };
          }
          return null;
        } catch (error) {
          console.error("Erro no login Credentials:", error);
          return null;
        }
      },
    }),

    // 2. Provider do Google (Para USUÁRIOS)
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async jwt({ token, user, account }) {
      // CENÁRIO 1: Login de Admin (Credentials)
      // O 'user' vem preenchido do retorno do 'authorize' acima
      if (user && (user as any).role === "admin") {
        token.apiToken = (user as any).token;
        token.role = "admin";
        return token;
      }

      // CENÁRIO 2: Login de Usuário (Google)
      // Só roda na primeira vez que o google responde (tem account)
      if (account && user && account.provider === "google") {
        // Senha secreta determinística para o usuário Google
        const secretPassword = `GoogleLogin@2026#${
          user.email
        }#${process.env.NEXTAUTH_SECRET?.slice(0, 5)}`;

        try {
          // A. Tenta LOGIN direto (caso o usuário já exista)
          const loginResponse = await axios.post(`${BACKEND_URL}/auth/login`, {
            email: user.email,
            password: secretPassword,
          });

          const dadosBackend = loginResponse.data;
          const tokenReal =
            dadosBackend.session?.access_token || dadosBackend.access_token;

          if (tokenReal) {
            token.apiToken = tokenReal;
            token.role = "user";
            token.error = null;
          }
        } catch (loginError: any) {
          // B. Se falhar (400/401), tenta REGISTRO
          try {
            await axios.post(`${BACKEND_URL}/auth/register`, {
              email: user.email,
              password: secretPassword,
              full_name: user.name || "Usuário Google",
            });

            // C. Após registro, tenta LOGIN de novo para pegar o token
            const retryLogin = await axios.post(`${BACKEND_URL}/auth/login`, {
              email: user.email,
              password: secretPassword,
            });

            const dadosRetry = retryLogin.data;
            token.apiToken = dadosRetry.session?.access_token;
            token.role = "user";
            token.error = null;
          } catch (regError: any) {
            console.error(
              "Erro fatal no fluxo Google:",
              regError.response?.data
            );
            token.error = "GoogleAuthFailed";
          }
        }
      }
      return token;
    },

    async session({ session, token }) {
      // Transfere o token e a role do JWT para a Sessão (que o Front vê)
      // @ts-ignore
      session.id_token = token.apiToken;
      // @ts-ignore
      session.user.role = token.role;
      // @ts-ignore
      session.error = token.error;

      return session;
    },
  },

  // Redirecionamentos customizados para evitar telas padrão feias
  pages: {
    signIn: "/login-admin",
    error: "/login-admin",
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
