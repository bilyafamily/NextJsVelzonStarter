import ClientProviders from "@/components/ClientProviders";
import { Metadata } from "next";
import React from "react";
// import { hkGrotesk } from '@/config/fonts';
import "../assets/scss/themes.scss";
// ApexCharts default styles
import "apexcharts/dist/apexcharts.css";
// Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export const metadata: Metadata = {
  title: "NMDPRA - Dashboard",
  description: "NMDPRA - Portals",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
