import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import jwt from "jsonwebtoken";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session) {
        // Envia o nosso token forjado para o frontend
        // @ts-ignore
        session.accessToken = token.supabaseAccessToken;
        if (session.user && token.sub) {
          // @ts-ignore
          session.user.id = token.sub;
        }
      }
      return session;
    },
    async jwt({ token, user, account }) {
      // Executa apenas no login inicial
      if (account && user) {
        // --- A FALSIFICAÇÃO ---
        // Criamos um token manualmente, igual ao do Supabase
        const payload = {
          aud: "authenticated",
          role: "authenticated",
          sub: user.id || token.sub,
          email: user.email,
          app_metadata: { provider: "google", providers: ["google"] },
          user_metadata: { avatar_url: user.image, full_name: user.name },
          exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 24 horas
        };

        try {
          // Usamos a sua chave "sb_secret" para assinar
          const signedToken = jwt.sign(
            payload,
            process.env.SUPABASE_JWT_SECRET!
          );

          token.supabaseAccessToken = signedToken;
        } catch (error) {
          console.error("Erro ao assinar token:", error);
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
