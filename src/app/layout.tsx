import type { Metadata } from "next";
import { Fraunces, Geist } from "next/font/google";
import ToggleTema from "@/components/ToggleTema";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vitrine | Portfólio de imóveis para corretores",
  description:
    "Cadastre seus imóveis com fotos e descrição completa e envie um portfólio profissional para seus clientes.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${fraunces.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Aplica o tema salvo antes da primeira pintura, para não piscar. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem("tema")||(matchMedia("(prefers-color-scheme: dark)").matches?"escuro":"claro");document.documentElement.dataset.tema=t}catch(e){}`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        {children}
        <ToggleTema />
      </body>
    </html>
  );
}
