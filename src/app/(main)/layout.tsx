export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-blue-50">
      {/* Aqui o layout é simples porque a Homepage já desenha o header dela.
         Se no futuro criarmos mais páginas de usuário (ex: Sobre, Contato),
         podemos mover o Header da Homepage para cá.
      */}
      {children}
    </div>
  );
}
