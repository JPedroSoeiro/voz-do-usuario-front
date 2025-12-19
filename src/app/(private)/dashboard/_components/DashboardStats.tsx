import { Activity, Flame, Clock, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const stats = [
  {
    name: "Total de Feedbacks",
    value: 5,
    icon: Activity,
    color: "bg-blue-500",
  },
  { name: "Total de Votos", value: "125", icon: Flame, color: "bg-red-500" },
  { name: "Em Progresso", value: "1", icon: Clock, color: "bg-green-500" },
  {
    name: "Concluidos",
    value: "1",
    icon: TrendingUp,
    color: "bg-purple-500",
  },
];

export default function DashboardStats() {
  return (
    <>
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Total de Feedbacks
                </dt>
                <dd>
                  <div className="text-lg font-medium text-gray-900">5</div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Total de Votos
                </dt>
                <dd>
                  <div className="text-lg font-medium text-gray-900">125</div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Em Progresso
                </dt>
                <dd>
                  <div className="text-lg font-medium text-gray-900">1</div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Concluidos
                </dt>
                <dd>
                  <div className="text-lg font-medium text-gray-900">1</div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Segunda Fileira: 2 cards ocupando 2 colunas cada */}
      <div className="bg-white overflow-hidden shadow rounded-lg lg:col-span-2">
        <div className="p-5">
          <div className="flex items-center">
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-lg font-medium text-gray-900 mb-4">
                  Por Categoria
                </dt>
                <dd className="space-y-2">
                  <div className="flex justify-between text-sm font-medium text-gray-500">
                    <span>Melhorias</span>
                    <span>2</span>
                  </div>
                  <div className="flex justify-between text-sm font-medium text-gray-500">
                    <span>Funcionalidades</span>
                    <span>2</span>
                  </div>
                  <div className="flex justify-between text-sm font-medium text-gray-500">
                    <span>Bug</span>
                    <span>1</span>
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white overflow-hidden shadow rounded-lg lg:col-span-2">
        <div className="p-5">
          <div className="flex items-center">
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-lg font-medium text-gray-900 mb-4">
                  Por Status
                </dt>
                <dd className="space-y-2">
                  <div className="flex justify-between text-sm font-medium text-gray-500">
                    <span>Em Progresso</span>
                    <span>1</span>
                  </div>
                  <div className="flex justify-between text-sm font-medium text-gray-500">
                    <span>Planejado</span>
                    <span>1</span>
                  </div>
                  <div className="flex justify-between text-sm font-medium text-gray-500">
                    <span>Em Analise</span>
                    <span>1</span>
                  </div>
                  <div className="flex justify-between text-sm font-medium text-gray-500">
                    <span>Concluido</span>
                    <span>1</span>
                  </div>
                  <div className="flex justify-between text-sm font-medium text-gray-500">
                    <span>Novo</span>
                    <span>1</span>
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white overflow-hidden shadow rounded-lg lg:col-span-4">
        <div className="p-5">
          <div className="flex items-center">
            <div className="ml-5 w-0 flex-1">
              <div>
                <dt className="text-lg font-medium text-gray-900 mb-4">
                  Feedbacks Mais Votados
                </dt>

                <dd className="space-y-4">
                  <div className="flex justify-between items-center text-sm font-medium text-gray-900">
                    <span>Melhorar performance da plataforma</span>
                    <div className="flex items-center gap-x-4">
                      <span className="text-blue-500 text-sm">42 votos</span>
                      <Button size="sm" variant="outline">
                        Editar
                      </Button>
                    </div>
                  </div>
                  <hr />

                  <div className="flex justify-between items-center text-sm font-medium text-gray-900">
                    <span>Adicionar modo escuro</span>

                    <div className="flex items-center gap-x-4">
                      <span className="text-blue-500 text-sm">38 votos</span>
                      <Button size="sm" variant="outline">
                        Editar
                      </Button>
                    </div>
                  </div>
                </dd>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
