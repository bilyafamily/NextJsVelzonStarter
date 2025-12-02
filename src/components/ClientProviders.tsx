"use client";

import React from "react";
import { Providers } from "@/providers";
import { Toaster } from "react-hot-toast";
import FakeBackendProvider from "./providers/FakeBackendProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ToastContainer } from "react-toastify";
// import { queryClient } from "@/lib/react-query";

const queryClient = new QueryClient();

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <FakeBackendProvider>
        <Providers>
          {children}
          <Toaster position="top-right" />
          <ToastContainer closeButton={false} limit={1} />
        </Providers>
      </FakeBackendProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
