"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";
import { AuthProvider } from "@/contexts/auth-context";
import { AccessibilityProvider } from "@/contexts/accessibility-context";

export default function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AccessibilityProvider>
          {children}
        </AccessibilityProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}