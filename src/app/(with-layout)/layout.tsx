// app/(with-layout)/layout.tsx
import React from "react";
import Layout from "@/layouts/Layouts";

import { SessionProvider } from "next-auth/react";

export default async function WithLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <Layout>{children}</Layout>
    </SessionProvider>
  );
}
