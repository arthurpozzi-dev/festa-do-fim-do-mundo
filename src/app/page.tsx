import Hero from "@/components/sections/Hero";
import Confirme from "@/components/sections/Confirme";
import Informacoes from "@/components/sections/Informacoes";
import Contato from "@/components/sections/Contato";
import RsvpProvider from "@/components/rsvp/RsvpProvider";
import BabtMarquee from "@/components/ui/BabtMarquee";

export default function Home() {
  return (
    <RsvpProvider>
      <main>
        <Hero />
        <Confirme />
        <Informacoes />
        <BabtMarquee />
      </main>
      <Contato />
    </RsvpProvider>
  );
}
