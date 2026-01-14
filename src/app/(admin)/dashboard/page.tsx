"use client";

import DashboardStats from "./_components/DashboardStats";

export default function DashboardPage() {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-black text-gray-800 mb-8 tracking-tight">
        Dashboard Admin
      </h1>

      <DashboardStats />
    </div>
  );
}
