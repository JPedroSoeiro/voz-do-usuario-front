import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Acessa o token decodificado
    const token = req.nextauth.token;
    const isAuth = !!token;
    const isPageAdmin =
      req.nextUrl.pathname.startsWith("/dashboard") ||
      req.nextUrl.pathname.startsWith("/admin");

    // 1. Se tentar acessar área de Admin e não for o Chefe
    if (isPageAdmin && token?.role !== "admin") {
      // Chuta de volta para a Home
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // O middleware só deixa passar se retornar 'true'
      authorized: ({ token }) => !!token,
    },
  }
);

// Aqui definimos QUAIS rotas o porteiro vigia
export const config = {
  matcher: [
    "/dashboard/:path*", // Protege o Dashboard e tudo dentro dele
    "/admin/:path*", // Protege outras rotas admin se houver
    // "/feedbacks/:path*" // Descomente se a lista geral for só para admin
  ],
};
