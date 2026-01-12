"use client";

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "./_components/Sidebar";
import Header from "./_components/Header";
import { SessionProvider } from "next-auth/react"; // 👈 1. Importe isso

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <SidebarProvider>
        <AppSidebar />

        <SidebarInset className="bg-gray-50 flex flex-col min-h-screen transition-all duration-300 ease-in-out">
          <div className="bg-white border-b sticky top-0 z-10">
            <Header />
          </div>

          <main className="flex-1 w-full p-6 overflow-y-auto">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </SessionProvider>
  );
}
