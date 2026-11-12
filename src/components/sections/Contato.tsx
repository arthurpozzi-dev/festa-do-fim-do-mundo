"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { scrambleIn } from "@/lib/scramble";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const WHATSAPP_URL = "https://wa.me/5516992539176";

/* Medidas tiradas do print de 461px de largura. */
export default function Contato() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          "[data-parallax]",
          { yPercent: -15 },
          {
            yPercent: 15,
            ease: "none",
            scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom bottom", scrub: true },
          },
        );

        // Entrada dos textos: efeito scramble, um depois do outro
        const tl = gsap.timeline({
          scrollTrigger: { trigger: root.current, start: "top 80%" },
        });
        scrambleIn(tl, gsap.utils.toArray<HTMLElement>("[data-scramble]"), "0", {
          stagger: 0.15,
        });
      });
    },
    { scope: root },
  );

  return (
    <footer ref={root} id="contato" className="bg-black text-white">
      <div className="relative h-[57vw] overflow-hidden">
        <div data-parallax className="absolute -top-[30%] -left-[8%] h-[160%] w-[123%]">
          <Image
            src="/images/pintura.jpg"
            alt=""
            fill
            sizes="125vw"
            className="object-cover object-[50%_42%]"
          />
        </div>
        <div aria-hidden className="absolute inset-0 bg-black/25" />

        <div className="relative px-[2.2vw] pt-[8vw]">
          {/* Texto branco com mix-blend-difference: inverte as cores da pintura */}
          <h2 className="font-acid text-[14.4vw] leading-[1.05] text-white uppercase mix-blend-difference">
            <span data-scramble className="block whitespace-nowrap">
              Para informações
            </span>
            <span className="block">
              <span data-scramble>adicionais</span>{" "}
              <span data-scramble="®©™" className="font-helvetica">
                ®
              </span>
            </span>
          </h2>

          <a
            data-scramble
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-[6vw] inline-block font-kremlin text-[7.6vw] leading-none uppercase underline decoration-1 underline-offset-[1vw]"
          >
            Contato do WhatsApp do PZ
          </a>
        </div>
      </div>

      <div className="flex h-[14vw] min-h-14 items-center px-[6vw]">
        <p data-scramble className="line-justify w-full text-body">
          Não nos responsabilizamos por recaídas
        </p>
      </div>
    </footer>
  );
}
