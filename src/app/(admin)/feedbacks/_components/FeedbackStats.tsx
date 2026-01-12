"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AiOutlineEdit, AiOutlineClose } from "react-icons/ai";
import EditFeedback from "./EditFeedback";

const stats = [
  {
    name: "Melhorar performance da plataforma",
    votes: 42,
    email: "joao@exemplo.com",
    status: "Em análise",
  },
  {
    name: "Adicionar modo escuro",
    votes: 38,
    email: "maria@exemplo.com",
    status: "Pendente",
  },
  {
    name: "Integração com Slack",
    votes: 12,
    email: "pedro@exemplo.com",
    status: "Em progresso",
  },
  {
    name: "App para Mobile",
    votes: 85,
    email: "ana@exemplo.com",
    status: "Concluído",
  },
];

export default function FeedbackStats() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<any>(null);

  const filteredStats = stats.filter((stat) =>
    stat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditClick = (stat: any) => {
    setSelectedFeedback(stat);
    setIsEditOpen(true);
  };

  return (
    <div className="space-y-6 w-300 mx-auto">
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Pesquisar feedback..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-4 w-full">
        {filteredStats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white shadow-sm rounded-lg border border-gray-100 w-full p-4 hover:border-blue-200 transition-colors"
          >
            <div className="flex justify-between items-start">
              <div className="flex flex-col gap-1">
                <span className="text-sm font-bold text-gray-900">
                  {stat.name}
                </span>

                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>{stat.email}</span>
                  <span className="text-gray-300">•</span>
                  <span className="text-blue-600 font-medium">
                    {stat.votes} votos
                  </span>
                  <span className="text-gray-300">•</span>
                  <span className="px-2 py-0.5 bg-gray-100 rounded text-gray-700 capitalize">
                    {stat.status}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEditClick(stat)}
                  className="h-8 w-8 p-0"
                >
                  <AiOutlineEdit className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 w-8 p-0 text-red-500 hover:bg-red-50 hover:text-red-600"
                >
                  <AiOutlineClose className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}

        {filteredStats.length === 0 && (
          <p className="text-gray-500 text-sm italic p-8 text-center bg-white rounded-lg border border-dashed">
            Nenhum feedback encontrado para "{searchTerm}".
          </p>
        )}
      </div>

      <EditFeedback
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        feedback={selectedFeedback}
      />
    </div>
  );
}
