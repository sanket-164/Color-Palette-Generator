"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { Toaster } from "../ui/sonner";
import CreateThemeModal from "../modals/CreateThemeModal";
import LoaderComponent from "../LoaderComponent";

type Props = {
  children: React.ReactNode;
};

export default function Providers({ children }: Props) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      {/* dialogs */}
      <CreateThemeModal />

      {/* loader */}
      <LoaderComponent />
      {children}
    </QueryClientProvider>
  );
}
