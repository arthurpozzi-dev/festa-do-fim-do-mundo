"use client";

import Image from "next/image";
import Modal from "@/components/ui/Modal";

const Red = ({ children }: { children: React.ReactNode }) => (
  <span className="text-blood">{children}</span>
);

/** Popup "[Não sei quem é PZ]": apresenta o formando. */
export default function PzModal({ onClose }: { onClose: () => void }) {
  return (
    <Modal onClose={onClose} labelledBy="pz-title">
      {() => (
        <div className="mx-auto flex min-h-full max-w-[480px] flex-col px-[8%] pt-16 pb-14">
          <h2
            id="pz-title"
            data-modal-item
            className="font-acid text-[32px] leading-[1.05] uppercase"
          >
            Não tem problema — o fim do mundo é para todos :)
          </h2>

          <p
            data-modal-item
            className="mt-6 text-justify font-helvetica text-[15px] leading-[1.15] uppercase"
          >
            Mas vamos detalhar: esse é o <Red>PZ</Red>, Poze, Loira, Hilda Furacão, CEASA, Gorila
            Albino, Thur, TUCO, entre outros nomes pelos quais ele possa ser conhecido.
          </p>

          <div data-modal-item className="mt-8">
            <Image
              src="/images/pz-cnh.png"
              alt="CNH do PZ, com os dados pessoais tarjados"
              width={1761}
              height={1273}
              sizes="(max-width: 480px) 90vw, 420px"
              className="h-auto w-full -rotate-2"
            />
          </div>

          <p
            data-modal-item
            className="mt-8 text-justify font-helvetica text-[15px] leading-[1.15] uppercase"
          >
            E, graças a Deus, ele vai se formar e passar de{" "}
            <Red>&ldquo;Ah, tá só estudando, tá de boa&rdquo;</Red> pra{" "}
            <Red>&ldquo;Puta que pariu, fudeu, virei adulto&rdquo;</Red>.
          </p>
        </div>
      )}
    </Modal>
  );
}
