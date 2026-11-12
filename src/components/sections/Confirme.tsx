"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import BabtMarquee from "@/components/ui/BabtMarquee";
import { scrambleIn } from "@/lib/scramble";
import { useRsvp } from "@/components/rsvp/RsvpProvider";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/*
 * Medidas tiradas do print (386px de largura).
 * Os textos com `mix-blend-difference` são brancos: no fundo branco ficam pretos
 * e, por cima das imagens, invertem as cores delas.
 */
export default function Confirme() {
  const root = useRef<HTMLElement>(null);
  const { open: openRsvp } = useRsvp();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Parallax: a imagem anda dentro da moldura, cada uma num ritmo
        gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
          const amount = Number(el.dataset.parallax);
          gsap.fromTo(
            el,
            { yPercent: -amount },
            {
              yPercent: amount,
              ease: "none",
              scrollTrigger: {
                trigger: el.parentElement,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            },
          );
        });

        // Entrada dos textos: efeito scramble, um depois do outro
        const tl = gsap.timeline({
          scrollTrigger: { trigger: root.current, start: "top 70%" },
        });
        tl.from("[data-reveal]", { opacity: 0, scale: 0.92, duration: 0.6, ease: "power3.out" }, 0.3);
        scrambleIn(tl, gsap.utils.toArray<HTMLElement>("[data-scramble]"), "0", {
          stagger: 0.1,
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="confirme" className="relative bg-white text-black">
      <div className="relative h-[136vw] overflow-hidden md:h-[56vw]">
        {/* Imagem da máscara (direita, topo) */}
        <div className="absolute top-0 -right-[3%] h-[80vw] w-[27%] overflow-hidden md:-right-[1%] md:h-[40vw] md:w-[24%]">
          <div data-parallax="22" className="absolute inset-x-0 -top-[50%] h-[200%]">
            <Image
              src="/images/confirme-mascara.jpg"
              alt=""
              fill
              sizes="(max-width: 768px) 30vw, 25vw"
              className="object-cover object-[62%_center]"
            />
          </div>
        </div>

        {/* Imagem da coluna (esquerda, embaixo) */}
        <div className="absolute bottom-0 -left-[3%] h-[90vw] w-[31%] overflow-hidden md:-left-[1%] md:h-[38vw] md:w-[22%]">
          <div data-parallax="22" className="absolute inset-x-0 -top-[50%] h-[200%]">
            <Image
              src="/images/confirme-coluna.jpg"
              alt=""
              fill
              sizes="(max-width: 768px) 35vw, 25vw"
              className="object-cover object-[42%_center]"
            />
          </div>
        </div>

        {/* Topo */}
        <p className="absolute top-[1vw] left-[2.6%] w-[48%] text-body text-white mix-blend-difference md:top-[1.5vw] md:left-[2%] md:w-[240px]">
          <span data-scramble className="line-justify">
            Festa do fim do
          </span>
          <span data-scramble className="block">
            Mundo
          </span>
        </p>

        {/* Título */}
        <h2 className="absolute inset-0 text-white mix-blend-difference">
          <span
            data-scramble
            className="absolute top-[29vw] left-[9%] font-gothic-pixels text-[17vw] leading-none md:top-[8vw] md:left-[26%] md:text-[11vw]"
          >
            Confirme
          </span>
          <span className="absolute top-[43.5vw] left-[11%] flex items-center gap-[9vw] font-helvetica text-[16vw] leading-none font-bold md:top-[20vw] md:left-[28%] md:gap-[5vw] md:text-[10vw]"
          >
            <span data-scramble>sua</span>
            <span data-scramble="®©™" className="text-[11vw] font-normal md:text-[7vw]">
              ®
            </span>
          </span>
          <span
            data-scramble
            className="absolute top-[57.5vw] left-[35%] font-acid text-[16vw] leading-none md:top-[30vw] md:left-[40%] md:text-[10vw]"
          >
            PRESENÇA
          </span>
        </h2>

        {/* CTA -> popup de confirmação */}
        <button
          data-reveal
          type="button"
          onClick={openRsvp}
          aria-haspopup="dialog"
          className="absolute top-[83vw] left-[14%] flex h-[20vw] w-[72%] items-center justify-center border-2 border-blood font-acid text-[14vw] leading-none text-blood transition-colors hover:bg-blood hover:text-white active:bg-blood active:text-white md:top-[43vw] md:left-[35%] md:h-[6.5vw] md:w-[30%] md:border-[3px] md:text-[4.6vw]"
        >
          <span data-scramble>CLIQUE AQUI</span>
        </button>

        {/* Rodapé da sessão */}
        <p className="absolute top-[125vw] left-[53%] w-[45%] text-body text-white mix-blend-difference md:top-auto md:bottom-[1.5vw] md:left-auto md:right-[2%] md:w-[260px]">
          <span data-scramble className="line-justify">
            Mais informações
          </span>
          <span data-scramble className="line-justify">
            Abaixo — role
          </span>
        </p>
      </div>

      <BabtMarquee />
    </section>
  );
}
