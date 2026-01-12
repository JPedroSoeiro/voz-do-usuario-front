"use client";

import { Bell } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="bg-white border-b w-full h-16 flex items-center justify-between px-4 shrink-0">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="-ml-1" />

        <div className="h-6 w-px bg-gray-200 hidden md:block" />

        <h1 className="text-xl font-semibold text-gray-800 hidden sm:block">
          Painel de Controle
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative rounded-full">
          <Bell className="h-5 w-5 text-gray-600" />
          <span className="absolute top-2 right-2 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
        </Button>

        <div className="flex items-center gap-3 border-l pl-4">
          <div className="hidden md:flex flex-col items-end">
            <span className="text- font-medium text-gray-900 leading-none">
              John Doe
            </span>
          </div>
          <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs border border-indigo-200">
            JD
          </div>
        </div>
      </div>
    </header>
  );
}
