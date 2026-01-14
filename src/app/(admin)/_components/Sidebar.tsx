"use client";

import { Home, MessageSquare } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarFooter,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { IoMdExit } from "react-icons/io";
import { Button } from "@/components/ui/button";

const menuItems = [
  { title: "Painel", url: "/dashboard", icon: Home },
  { title: "Feedbacks", url: "/feedbacks", icon: MessageSquare },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent className="bg-white flex justify-between">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xl font-extrabold text-black h-12">
            Voz do Usuário
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <Link
                      href={item.url}
                      className="flex items-center gap-3 py-2"
                    >
                      <item.icon className="h-5 w-5" />

                      <span className="text-base font-medium">
                        {item.title}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
