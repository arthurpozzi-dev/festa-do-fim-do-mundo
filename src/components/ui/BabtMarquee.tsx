"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const ITEMS = 6;

/** Tarja preta com o logo BABT rolando em loop infinito. */
export default function BabtMarquee({ className = "" }: { className?: string }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.to("[data-marquee-track]", {
          xPercent: -50,
          duration: 12,
          ease: "none",
          repeat: -1,
        });
      });
    },
    { scope: root },
  );

  const group = Array.from({ length: ITEMS }, (_, i) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img key={i} src="/images/babt.svg" alt="" className="h-[34px] w-auto shrink-0" />
  ));

  return (
    <div
      ref={root}
      role="img"
      aria-label="BABT Organization"
      className={`flex h-[58px] items-center overflow-hidden bg-black ${className}`}
    >
      <div data-marquee-track className="flex w-max shrink-0 items-center">
        <div className="flex shrink-0 items-center gap-[42px] pr-[42px]">{group}</div>
        <div className="flex shrink-0 items-center gap-[42px] pr-[42px]" aria-hidden>
          {group}
        </div>
      </div>
    </div>
  );
}
