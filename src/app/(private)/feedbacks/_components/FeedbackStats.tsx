"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AiOutlineEdit } from "react-icons/ai";
import { AiOutlineClose } from "react-icons/ai";

const stats = [
  { name: "Melhorar performance da plataforma", votes: 42 },
  { name: "Adicionar modo escuro", votes: 38 },
  { name: "Integração com Slack", votes: 12 },
  { name: "App para Mobile", votes: 85 },
];

export default function FeedbackStats() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredStats = stats.filter((stat) =>
    stat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 w-full h-screen">
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Pesquisar feedback..."
          className="pl-10 w-300"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-4 w-screen">
        {filteredStats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white shadow rounded-lg border border-gray-100 w-300 p-4"
          >
            <div className="flex justify-between items-start text-sm font-medium text-gray-900">
              <div className="flex flex-col gap-1">
                <span className="font-bold">{stat.name}</span>
                <div className="flex justify-between w-50 items-start text-xs font-xs text-gray-900">
                  <span className="text-xs text-gray-500">seu@email.com</span>
                  <span className="text-xs text-black-500">•</span>
                  <span className="text-xs text-blue-500">votos</span>
                  <span className="text-xs text-black-500">•</span>
                  <span className="text-xs text-black-500">Status</span>
                </div>
              </div>

              <div className="flex items-center gap-x-2">
                <Button size="sm" variant="outline">
                  <AiOutlineEdit />
                </Button>
                <Button size="sm" variant="outline">
                  <AiOutlineClose />
                </Button>
              </div>
            </div>
          </div>
        ))}

        {filteredStats.length === 0 && (
          <p className="text-gray-500 text-sm italic p-4 text-center">
            Nenhum feedback encontrado.
          </p>
        )}
      </div>
    </div>
  );
}
