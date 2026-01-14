"use client";

import FeedbackList from "@/src/app/(admin)/feedbacks/_components/FeedbackList";

export default function ManageFeedbacksPage() {
  return (
    <div className="p-8 space-y-6 bg-gray-50/50 min-h-screen">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-3xl font-black text-gray-800 tracking-tight">
          Gerenciar Feedbacks
        </h1>
      </div>

      {/* Renderiza o componente de Lista/Gerenciamento */}
      <FeedbackList />
    </div>
  );
}
