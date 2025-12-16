import DashboardStats from "./_components/DashboardStats";
import Header from "./_components/Header"; // Usado para o topo da página

export default function DashboardPage() {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* O Sidebar seria carregado em um layout pai, mas mantemos o contêiner aqui. */}

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-6">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Dashboard</h2>

          {/* Seção de Estatísticas (DashboardStats) */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
            <DashboardStats />
          </div>

          {/* As seções de "AIRecommendations", "RecentWorkouts" e "WorkoutProgress" 
              foram removidas daqui. */}

          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Este div pode ser removido se não houver mais nada para colocar. */}
          </div>
        </main>
      </div>
    </div>
  );
}
