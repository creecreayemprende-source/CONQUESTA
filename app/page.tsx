import { Header } from "@/components/app/landing/Header";
import { Hero } from "@/components/app/landing/Hero";
import { Problema } from "@/components/app/landing/Problema";
import { Agitacion } from "@/components/app/landing/Agitacion";
import { Solucion } from "@/components/app/landing/Solucion";
import { VideoViaje } from "@/components/app/landing/VideoViaje";
import { AppPorDentro } from "@/components/app/landing/AppPorDentro";
import { Oferta } from "@/components/app/landing/Oferta";
import { Garantia } from "@/components/app/landing/Garantia";
import { Faq } from "@/components/app/landing/Faq";
import { CtaFinal } from "@/components/app/landing/CtaFinal";
import { FooterLegal } from "@/components/app/landing/FooterLegal";
import { MiniCta } from "@/components/app/landing/MiniCta";

export default function Home() {
  return (
    <main className="flex-1">
      <Header />
      <Hero />
      <Problema />
      <Agitacion />
      <Solucion />
      <VideoViaje />
      <MiniCta texto="Quiero conquistar mi primer país" />
      <AppPorDentro />
      <MiniCta texto="Ver mi mapa gratis" />
      <Oferta />
      <Garantia />
      <MiniCta texto="Empezar gratis ahora" />
      <Faq />
      <CtaFinal />
      <FooterLegal />
    </main>
  );
}
