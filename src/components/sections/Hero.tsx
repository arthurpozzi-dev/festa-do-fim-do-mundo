"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { scrambleIn } from "@/lib/scramble";

gsap.registerPlugin(useGSAP);

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        tl.from("[data-hero-bg]", { scale: 1.15, opacity: 0, duration: 1.4 })
          .from(
            "[data-hero-logo]",
            { scale: 0.85, opacity: 0, filter: "blur(12px)", duration: 1.1 },
            "-=0.9",
          )
          .from("[data-hero-bar]", { yPercent: 100, duration: 0.6 }, "-=0.6")
          .addLabel("scramble", "-=0.5");

        // Textos em volta: os caracteres ficam trocando até virar o texto final
        scrambleIn(tl, gsap.utils.toArray<HTMLElement>("[data-scramble]"), "scramble");
        tl.from("[data-hero-arrow]", { autoAlpha: 0, y: -10, duration: 0.4 }, "-=0.3");

        gsap.to("[data-hero-arrow]", {
          y: 5,
          duration: 0.7,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="inicio"
      className="relative flex h-svh min-h-[560px] flex-col overflow-hidden bg-black"
    >
      {/* Área da imagem */}
      <div className="relative flex-1 overflow-hidden">
        {/* GIF de fundo (webp animado, loop infinito). <img> puro para não perder a animação. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          data-hero-bg
          src="/images/hero.webp"
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(160deg,rgba(0,0,0,0.55)_0%,rgba(0,0,0,0.1)_45%,rgba(0,0,0,0.35)_100%)]"
        />

        {/* ®2007 vertical */}
        <p
          data-hero-year
          className="absolute top-3 right-2 rotate-180 font-helvetica text-[34px] leading-none tracking-tight [writing-mode:vertical-rl] md:top-8 md:right-6 md:text-[64px]"
        >
          <span data-scramble="0123456789®">®2007</span>
        </p>

        {/* Logo da festa */}
        <h1 className="absolute top-1/2 left-1/2 w-[88%] max-w-[480px] -translate-x-1/2 -translate-y-1/2 md:w-[58vw] md:max-w-[960px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            data-hero-logo
            src="/images/logo-festa.svg"
            alt="Festa do Fim do Mundo"
            className="h-auto w-full"
          />
        </h1>

        {/* Clique aqui */}
        <a
          data-hero-cta
          href="#confirme"
          className="absolute top-[73%] right-10 text-right font-kremlin text-[22px] leading-[1.15] uppercase transition-opacity hover:opacity-70 md:top-auto md:right-[6vw] md:bottom-14 md:text-[36px]"
        >
          <span data-scramble>Clique</span>
          <br />
          <span data-scramble>Aqui</span>{" "}
          <span data-hero-arrow className="inline-block font-helvetica">
            ↓
          </span>
        </a>

        {/* Descrição */}
        <p className="absolute bottom-7 left-4 w-[52vw] text-body md:bottom-14 md:left-[4vw] md:w-[300px]">
          <span className="line-justify">
            <span data-scramble>Festa dedicada</span>
          </span>
          <span className="line-justify">
            <span data-scramble>À formatura da</span>
          </span>
          <span className="line-justify">
            <span data-scramble>Faculdade do</span>{" "}
            <span data-scramble className="underline underline-offset-2">
              PZ
            </span>
          </span>
        </p>
      </div>

      {/* Tarja BABT */}
      <div
        data-hero-bar
        className="relative z-10 flex h-[72px] shrink-0 items-center justify-center bg-black md:h-24"
      >
        <div className="flex items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/babt.svg" alt="BABT" className="h-[32px] w-auto md:h-[44px]" />
          <span className="-ml-1 font-sloop text-[30px] leading-none md:text-[42px]">Organization</span>
        </div>
      </div>
    </section>
  );
}
