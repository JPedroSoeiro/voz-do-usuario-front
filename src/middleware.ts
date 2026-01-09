export { default } from "next-auth/middleware";

// Configura em quais páginas o middleware deve rodar
export const config = {
  matcher: ["/dashboard/:path*"], // Protege o dashboard se você vier a criar um
};
