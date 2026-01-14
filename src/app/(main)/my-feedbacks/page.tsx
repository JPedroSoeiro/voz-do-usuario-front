"use client";

import { SessionProvider } from "next-auth/react";
import MyFeedbacksList from "./_components/MyFeedbacksList";

export default function MyFeedbacksPage() {
  return (
    <SessionProvider>
      <MyFeedbacksList />
    </SessionProvider>
  );
}
