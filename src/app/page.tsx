"use client";

import { SessionProvider } from "next-auth/react";
// Importamos o componente principal que tem toda a lógica (Lista + Login + Cadeados)
import HomepageComponent from "@/src/app/(main)/homepage/_components/Homepage";

export default function Home() {
  return (
    <SessionProvider>
      <HomepageComponent />
    </SessionProvider>
  );
}
