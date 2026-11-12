"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useRsvp } from "@/components/rsvp/RsvpProvider";
import GifFrame from "@/components/ui/GifFrame";
import { scrambleIn } from "@/lib/scramble";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/** Destaque em vermelho usado no texto corrido */
const Red = ({ children }: { children: React.ReactNode }) => (
  <span className="text-blood">{children}</span>
);

/** ✴ antes dos títulos (U+FE0E força a versão em texto, não emoji colorido) */
const Star = () => (
  <span aria-hidden className="mr-[2vw] align-[0.12em] text-[0.62em]">
    {"\u2734\uFE0E"}
  </span>
);

// Convite de colaborador da playlist (o parâmetro `pt` é o token do convite)
const SPOTIFY_INVITE_URL =
  "https://open.spotify.com/playlist/3LnNpqUbZhwPh2EHKAszU0?si=736a7112ad934b26&pt=22c41ff2c250076b724f94dde975ca34";

const title = "relative z-10 font-helvetica text-[13.6vw] leading-none font-bold md:text-[5.6vw]";

const paragraph = "relative z-10 text-body";

/*
 * Parte 1 (Data/Local) medida num print de 382px; parte 2 (Consumo) num de 477px.
 * Por isso cada parte usa vw na própria escala.
 */
export default function Informacoes() {
  const root = useRef<HTMLElement>(null);
  const { open: openRsvp } = useRsvp();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Isqueiro: sobe e gira de leve conforme o scroll
        gsap.fromTo(
          "[data-isqueiro]",
          { yPercent: 35, rotate: 10 },
          {
            yPercent: -35,
            rotate: -4,
            ease: "none",
            scrollTrigger: { trigger: "[data-parte='data']", start: "top bottom", end: "bottom top", scrub: true },
          },
        );

        // Vodka: parallax vertical
        gsap.fromTo(
          "[data-vodka]",
          { yPercent: 30 },
          {
            yPercent: -30,
            ease: "none",
            scrollTrigger: { trigger: "[data-parte='consumo']", start: "top bottom", end: "bottom top", scrub: true },
          },
        );

        // GIFs: a imagem anda dentro do quadro (parallax)
        gsap.utils.toArray<HTMLElement>("[data-gif]").forEach((el) => {
          gsap.fromTo(
            el,
            { yPercent: -10 },
            {
              yPercent: 10,
              ease: "none",
              scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true },
            },
          );
        });

        // LineUP: fotos de fundo com parallax
        gsap.utils.toArray<HTMLElement>("[data-lineup-bg]").forEach((el) => {
          gsap.fromTo(
            el,
            { yPercent: -14 },
            {
              yPercent: 14,
              ease: "none",
              scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true },
            },
          );
        });

        // Relógio da filmadora (GIF com VHS) entra embaralhando
        const relogio = gsap.utils.toArray<HTMLElement>("figure [data-scramble]");
        if (relogio.length) {
          const tl = gsap.timeline({ scrollTrigger: { trigger: relogio[0], start: "top 85%" } });
          scrambleIn(tl, relogio, "0", { duration: 1.6 });
        }

        // Entrada dos blocos de texto, um a um
        gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
          gsap.from(el, {
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 88%" },
          });
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="informacoes" className="overflow-hidden bg-white text-black">
      {/* Desktop: Data/Local e Consumo lado a lado */}
      <div className="md:grid md:grid-cols-2">
      {/* ── Parte 1: Data e Local ── */}
      <div data-parte="data" className="relative pt-[14vw] pr-[18vw] pb-[7vw] pl-[16.5vw] md:pt-[7vw] md:pr-[15vw] md:pb-[7vw] md:pl-[8vw]">
        <p className="absolute top-[1.3vw] left-[0.8vw] rotate-180 font-helvetica text-[10.5vw] leading-none tracking-tight [writing-mode:vertical-rl] md:top-[1.5vw] md:left-[1.5vw] md:text-[4vw]">
          ®2007
        </p>

        <Image
          data-isqueiro
          src="/images/isqueiro.png"
          alt=""
          width={265}
          height={468}
          sizes="40vw"
          className="pointer-events-none absolute top-[42vw] left-[76vw] h-[68vw] w-auto max-w-none md:top-[11vw] md:right-[-1vw] md:left-auto md:h-[26vw]"
        />

        <h2 data-reveal className={title}>
          <Star />Data
        </h2>
        <div data-reveal className="relative z-10 font-old-london text-[12.7vw] leading-none text-blood md:mt-[0.5vw] md:text-[4.6vw]">
          <p className="mt-[1vw]">04/12</p>
          <p className="mt-[1.5vw]">21h às 6h66</p>
        </div>
        <p data-reveal className={`mt-[4vw] md:mt-[1.5vw] ${paragraph}`}>
          Ou, em caso de intervenção do Corpo de Policiamento Ostensivo Tático do Estado de São
          Paulo, acaba antes.
        </p>

        <h2 data-reveal className={`mt-[9vw] md:mt-[4.5vw] ${title}`}>
          <Star />Local
        </h2>
        <p data-reveal className={`mt-[5.5vw] md:mt-[1.5vw] ${paragraph}`}>
          Será enviado no dia da festa para o e-mail informado no formulário de inscrição — caso
          não o tenha preenchido:
        </p>
        <button
          data-reveal
          type="button"
          onClick={openRsvp}
          aria-haspopup="dialog"
          className="relative z-10 mt-[5vw] font-kremlin text-[7vw] leading-none text-blood uppercase underline decoration-1 underline-offset-[0.6vw] transition-opacity hover:opacity-70 md:mt-[1.8vw] md:text-[2.4vw] md:underline-offset-[0.3vw]"
        >
          Clique aqui
        </button>

        <GifFrame
          src="/images/gifs/balada.gif"
          ratio={16 / 9}
          vhs={{ time: "23:41:07" }}
          className="mt-[12vw] mb-[4vw] -ml-[16.5vw] w-[66vw] md:mt-[5vw] md:mb-0 md:-ml-[8vw] md:w-[34vw]"
        />
      </div>

      {/* ── Parte 2: Consumo ── */}
      <div data-parte="consumo" className="relative pt-[5vw] pr-[14vw] pb-[14vw] pl-[16.5vw] md:pt-[7vw] md:pr-[12vw] md:pb-[7vw] md:pl-[6vw]">
        <Image
          data-vodka
          src="/images/vodka.png"
          alt=""
          width={272}
          height={428}
          sizes="40vw"
          className="pointer-events-none absolute top-[9.5vw] -left-[17vw] h-auto w-[38vw] max-w-none md:top-[5vw] md:-right-[2.5vw] md:left-auto md:w-[12vw]"
        />

        <h2 data-reveal className={title}>
          <Star />Consumo
        </h2>

        <div className="mt-[4vw] space-y-[5vw] md:mt-[1.5vw] md:space-y-[1.6vw]">
          <p data-reveal className={paragraph}>
            A equipe de organização{" "}
            <Red>
              B.A.B.T™ [<bdi lang="ar">منظمة</bdi>]
            </Red>{" "}
            fornecerá de 10 a 20 litros de <Red>vodka</Red> e possivelmente algum outro
            complemento — porém, é recomendado que leve <Red>algo para usufruir</Red>.
          </p>
          <GifFrame
            src="/images/gifs/pilulas.gif"
            ratio={16 / 9}
            className="my-[8vw] -mr-[14vw] ml-auto w-[66vw] md:my-[2.5vw] md:mr-0 md:ml-0 md:w-full"
          />
          <p data-reveal className={paragraph}>
            Qualquer tipo de <Red>substância de alteração da consciência</Red> está
            categoricamente{" "}
            <span className="text-blood underline decoration-1 underline-offset-2">liberado</span>.
          </p>
          <p data-reveal className={paragraph}>
            — Porém, não nos responsabilizamos pelos efeitos colaterais/secundários dessa decisão.
          </p>
        </div>
      </div>

      </div>

      {/* ── Parte 3: LineUP ── */}
      <div
        data-parte="lineup"
        className="relative overflow-hidden bg-black pt-[16vw] pr-[14vw] pb-[16vw] pl-[16.5vw] text-white md:grid md:grid-cols-2 md:content-center md:gap-x-[6vw] md:px-[8vw] md:py-[7vw]"
      >
        {/* Fundo: duas fotos de DJ empilhadas, com parallax, escurecidas para o texto ler bem */}
        <div aria-hidden className="absolute inset-0">
          <div className="absolute inset-x-0 top-0 h-[55%] overflow-hidden md:right-1/2 md:h-full">
            <div data-lineup-bg className="absolute inset-x-0 -top-[20%] h-[140%]">
              <Image src="/images/dj.jpg" alt="" fill sizes="100vw" className="object-cover object-[50%_40%]" />
            </div>
          </div>
          <div className="absolute inset-x-0 bottom-0 h-[50%] overflow-hidden md:left-1/2 md:h-full">
            <div data-lineup-bg className="absolute inset-x-0 -top-[20%] h-[140%]">
              <Image src="/images/dj2.jpg" alt="" fill sizes="100vw" className="object-cover object-center" />
            </div>
          </div>
          {/* película escura + emenda entre as duas fotos */}
          <div className="absolute inset-0 bg-black/55" />
          <div className="absolute inset-x-0 top-[40%] h-[25%] bg-[linear-gradient(to_bottom,transparent,rgba(0,0,0,0.85)_50%,transparent)] md:hidden" />
        </div>

        <h2 data-reveal className={`${title} md:col-start-1`}>
          <Star />
          LineUP
        </h2>
        <p data-reveal className={`mt-[4vw] ${paragraph} [text-shadow:0_1px_6px_rgba(0,0,0,0.8)] md:col-start-1 md:mt-[1.5vw]`}>
          Durante a festa, o DJ vai conduzir com vários estilos de música — porém, ficamos
          felizes se você <Red>agregar na playlist</Red>.
        </p>
        <iframe
          data-reveal
          data-testid="embed-iframe"
          title="Playlist da festa no Spotify"
          src="https://open.spotify.com/embed/playlist/3LnNpqUbZhwPh2EHKAszU0?utm_source=generator"
          width="100%"
          height="352"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          allowFullScreen
          loading="lazy"
          className="relative z-10 mt-[6vw] block rounded-[12px] border-0 md:col-start-2 md:row-span-3 md:row-start-1 md:mt-0 md:self-center"
        />
        <a
          data-reveal
          href={SPOTIFY_INVITE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="relative z-10 mt-[6vw] flex h-[16vw] w-full items-center justify-center border-2 border-blood font-acid text-[8vw] leading-none text-blood uppercase transition-colors hover:bg-blood hover:text-white active:bg-blood active:text-white md:col-start-1 md:mt-[2.5vw] md:h-[5vw] md:w-auto md:justify-self-start md:px-[3vw] md:text-[2.4vw]"
        >
          Agregar na playlist
        </a>
      </div>
    </section>
  );
}
