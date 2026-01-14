"use client";

import { useSession, signOut } from "next-auth/react";
import { Bell, LogOut, User } from "lucide-react"; // Removido 'Search'
import { Button } from "@/components/ui/button";
// Removido import do Input que não é mais usado
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const { data: session } = useSession();

  // Pega o nome do admin ou usa um fallback
  const adminName = session?.user?.name || "Administrador";
  const adminEmail = session?.user?.email || "admin@voz.com";
  const adminInitial = adminName[0]?.toUpperCase() || "A";

  return (
    // Mudei 'justify-between' para 'justify-end' para colar tudo na direita
    <header className="h-16 border-b bg-white px-6 flex items-center justify-end sticky top-0 z-10">
      {/* Lado Direito - Notificações e Perfil */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="text-gray-500 relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-9 w-9 rounded-full bg-blue-100 border border-blue-200 p-0 overflow-hidden"
            >
              <span className="text-blue-700 font-bold text-sm">
                {adminInitial}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{adminName}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {adminEmail}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <User className="mr-2 h-4 w-4" /> Meu Perfil
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600 cursor-pointer focus:text-red-600"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              <LogOut className="mr-2 h-4 w-4" /> Sair do Sistema
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
