import type { Metadata } from "next";
import { Geist } from "next/font/google";

import "./globals.css";
import {AuthProvider} from "@/providers/auth-provider";

const geist = Geist({
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: {
    default: "СПЦ ДПО",
    template: "%s | СПЦ ДПО",
  },
  description: "Личный кабинет обучающегося",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" data-scroll-behavior="smooth">
      <body
        className={`${geist.className} bg-zinc-50 text-zinc-950 antialiased`}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
