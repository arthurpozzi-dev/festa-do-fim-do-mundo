"use client";

import { useEffect, useEffectEvent, useId, useRef } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

type Props = {
  onClose: () => void;
  /** id do título, para leitores de tela */
  labelledBy: string;
  /** campo que recebe o foco ao abrir (padrão: botão fechar) */
  initialFocus?: React.RefObject<HTMLElement | null>;
  /** recebe `close()`, que fecha com a animação de saída */
  children: (close: () => void) => React.ReactNode;
};

/**
 * Popup em tela cheia preta: abre como cortina, itens com `data-modal-item` entram
 * em sequência, trava o scroll da página, fecha no X ou no ESC.
 */
export default function Modal({ onClose, labelledBy, initialFocus, children }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const dialogId = useId();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .from(root.current, { clipPath: "inset(0 0 100% 0)", duration: 0.6, ease: "power4.inOut" })
          .from("[data-modal-item]", { y: 24, opacity: 0, duration: 0.5, stagger: 0.06 }, "-=0.15");
      });
    },
    { scope: root },
  );

  // busca o popup pelo id (e não pelo ref) porque `close` é repassado aos filhos no render
  function close() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return onClose();
    gsap.to(document.getElementById(dialogId), {
      clipPath: "inset(0 0 100% 0)",
      duration: 0.45,
      ease: "power4.inOut",
      onComplete: onClose,
    });
  }

  const onEscape = useEffectEvent((e: KeyboardEvent) => {
    if (e.key === "Escape") close();
  });

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    (initialFocus?.current ?? closeBtn.current)?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => onEscape(e);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [initialFocus]);

  // Só é montado depois de um clique (nunca no servidor): o portal leva o popup para o
  // <body>, fora de qualquer overflow/transform das sessões
  return createPortal(
    <div
      ref={root}
      id={dialogId}
      role="dialog"
      aria-modal="true"
      aria-labelledby={labelledBy}
      className="fixed inset-0 z-50 overflow-y-auto bg-black text-white"
    >
      <button
        ref={closeBtn}
        type="button"
        onClick={close}
        aria-label="Fechar"
        className="absolute top-2 right-2 z-10 grid size-10 place-items-center font-helvetica text-[18px]"
      >
        X
      </button>
      {children(close)}
    </div>,
    document.body,
  );
}
