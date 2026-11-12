import gsap from "gsap";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";

gsap.registerPlugin(ScrambleTextPlugin);

export const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#%&@$*";

// No React, `data-scramble` sem valor vira "true" no HTML: nesse caso usa o padrão
function charsFor(el: HTMLElement) {
  const custom = el.dataset.scramble;
  return custom && custom !== "true" ? custom : SCRAMBLE_CHARS;
}

/**
 * Entrada "scramble": cada elemento começa invisível e, na sua vez, os caracteres
 * ficam trocando até formar o texto original. `data-scramble="..."` no elemento
 * define os caracteres sorteados (vazio = SCRAMBLE_CHARS).
 */
export function scrambleIn(
  tl: gsap.core.Timeline,
  targets: HTMLElement[],
  position: string,
  { stagger = 0.12, duration = 1.4 } = {},
) {
  gsap.set(targets, { autoAlpha: 0 });
  targets.forEach((el, i) => {
    const at = `${position}+=${i * stagger}`;
    tl.set(el, { autoAlpha: 1 }, at).to(
      el,
      {
        duration,
        ease: "none",
        scrambleText: {
          text: el.textContent ?? "",
          chars: charsFor(el),
          revealDelay: duration * 0.35,
          speed: 1.2,
        },
      },
      at,
    );
  });
  return tl;
}
