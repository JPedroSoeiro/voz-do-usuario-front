import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    // Adicionamos o token ao objeto de sessão para poder enviar para a API
    async session({ session, token }) {
      if (session.user) {
        // @ts-ignore
        session.accessToken = token.sub; // Usaremos o ID do usuário ou o token JWT como chave
      }
      return session;
    },
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
  },
  pages: {
    signIn: "/login", // Nossa página customizada
  },
});

export { handler as GET, handler as POST };
