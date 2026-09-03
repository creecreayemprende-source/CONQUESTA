import type { Metadata } from "next";
import { Baloo_2, Nunito_Sans } from "next/font/google";
import "./globals.css";

const baloo = Baloo_2({
  variable: "--font-baloo",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const nunito = Nunito_Sans({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Conquesta — Viaja, aprende y conquista el mundo",
  description:
    "Recorre el mapa mundial, conquista países respondiendo retos de geografía, historia, cultura, gastronomía y naturaleza — sin anuncios.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${baloo.variable} ${nunito.variable} h-full antialiased`}>
      <body className="min-h-dvh flex flex-col bg-surface-base text-txt-primary">{children}</body>
    </html>
  );
}
