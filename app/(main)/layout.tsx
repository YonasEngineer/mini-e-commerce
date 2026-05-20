"use client";

import Header from "@/components/header";
import CartInitializer from "@/providers/CartInitializer";
import { useAuthStore } from "@/store/auth-store";
import QueryProvider from "@/providers/QueryProvider";
export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentUser = useAuthStore((state) => state.user);
  console.log("see the  currentUser", currentUser);
  return (
    <>
      <Header />
      <QueryProvider>
        <CartInitializer userId={currentUser?.id} />
      </QueryProvider>

      {children}
    </>
  );
}
