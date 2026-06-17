import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GLC Tecnologia — Gateway de Pagamentos com IA",
  description: "Gateway de pagamentos multi-tenant com 4 agentes de IA para detecção de falhas, antifraude em tempo real e suporte autônomo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
