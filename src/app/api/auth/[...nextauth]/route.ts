import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import axios from "axios";

const BACKEND_URL = "http://localhost:3001";

const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // Só roda no login inicial (quando tem account)
      if (account && user) {
        // Senha secreta "determinística" (sempre a mesma para o mesmo email)
        const secretPassword = `GoogleLogin@2026#${
          user.email
        }#${process.env.NEXTAUTH_SECRET?.slice(0, 5)}`;

        try {
          // 1. Tenta LOGIN direto
          console.log(`Tentando login para: ${user.email}`);
          const loginResponse = await axios.post(`${BACKEND_URL}/auth/login`, {
            email: user.email,
            password: secretPassword,
          });

          // CORREÇÃO AQUI: O token do Supabase fica dentro de 'session'
          const dadosBackend = loginResponse.data;
          const tokenReal =
            dadosBackend.session?.access_token || dadosBackend.access_token;

          if (tokenReal) {
            token.apiToken = tokenReal;
            token.error = null;
          } else {
            console.error(
              "PERIGO: Backend respondeu 200 mas sem token na sessão!",
              dadosBackend
            );
          }
        } catch (loginError: any) {
          console.log(
            `Login falhou (${loginError.response?.status}). Tentando criar usuário...`
          );

          try {
            // 2. Se falhar, tenta REGISTRO
            await axios.post(`${BACKEND_URL}/auth/register`, {
              email: user.email,
              password: secretPassword,
              full_name: user.name || "Usuário Google",
            });

            // 3. Após registro, tenta LOGIN de novo para pegar o token
            const retryLogin = await axios.post(`${BACKEND_URL}/auth/login`, {
              email: user.email,
              password: secretPassword,
            });

            // Pega o token da sessão novamente
            const dadosRetry = retryLogin.data;
            token.apiToken = dadosRetry.session?.access_token;
            token.error = null;
          } catch (regError: any) {
            const status = regError.response?.status;

            // Se o erro for 401/403 no registro, é porque precisa confirmar email
            if (status === 401 || status === 403) {
              token.apiToken = null;
              token.error = "EMAIL_VERIFICATION_REQUIRED";
            } else {
              console.error("Erro fatal no registro:", regError.response?.data);
            }
          }
        }
      }
      return token;
    },

    async session({ session, token }) {
      // Passa o token para a sessão do React
      // @ts-ignore
      session.id_token = token.apiToken;
      // @ts-ignore
      session.error = token.error;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
