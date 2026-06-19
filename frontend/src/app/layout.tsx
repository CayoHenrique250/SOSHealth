import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/src/components/Providers";
import GlobalFloatingWidgets from "@/src/components/GlobalFloatingWidgets";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SOSHealth - Sua saúde, nossa prioridade",
  description: "Conectando pacientes a profissionais de saúde.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <Providers>
          {children}
          <GlobalFloatingWidgets />
        </Providers>
      </body>
    </html>
  );
}