"use client";

// Removi o useSession pois não vamos mais exibir nome pessoal aqui
import DashboardStats from "./_components/DashboardStats";

export default function Dashboard() {
  const today = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="space-y-6 w-full h-full">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Visão Geral
        </h1>
        <span className="text-sm text-gray-500 capitalize">{today}</span>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 w-full">
        <DashboardStats />
      </div>
    </div>
  );
}
