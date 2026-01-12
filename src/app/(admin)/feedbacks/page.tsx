"use client";

import FeedbackStats from "./_components/FeedbackStats";

export default function FeedbacksPage() {
  return (
    <div className="space-y-6 w-full h-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Gerenciar Feedbacks
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Modere as sugestões enviadas pelos usuários.
          </p>
        </div>
      </div>

      <FeedbackStats />
    </div>
  );
}
