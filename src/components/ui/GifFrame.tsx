/* eslint-disable @next/next/no-img-element -- GIF animado: <img> puro para não perder a animação */

type Props = {
  src: string;
  /** largura / altura do quadro */
  ratio: number;
  /** liga a interface de filmadora VHS (REC, PLAY, data/hora, scanlines) */
  vhs?: { time: string };
  className?: string;
};

/** GIF num quadro; a imagem é mais alta que o quadro para o parallax (`data-gif`). */
export default function GifFrame({ src, ratio, vhs, className = "" }: Props) {
  return (
    <figure
      aria-hidden
      className={`relative overflow-hidden bg-black ${className}`}
      style={{ aspectRatio: `${ratio}` }}
    >
      <img
        data-gif
        src={src}
        alt=""
        loading="lazy"
        decoding="async"
        className="absolute -top-[15%] left-0 h-[130%] w-full object-cover"
      />

      {vhs && (
        <>
          {/* scanlines + vinheta */}
          <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(0,0,0,0.28)_0px,rgba(0,0,0,0.28)_1px,transparent_1px,transparent_3px)]" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.55)_100%)]" />

          {/* interface da filmadora */}
          <div className="pointer-events-none absolute inset-0 font-helvetica text-[2.8vw] leading-none text-white uppercase [text-shadow:0_0_4px_rgba(0,0,0,0.9)]">
            <span className="absolute top-[2.5vw] left-[2.5vw] flex items-center gap-[1vw]">
              <span className="size-[2vw] animate-pulse rounded-full bg-blood" />
              Rec
            </span>
            <span className="absolute top-[2.5vw] right-[2.5vw]">Play ▶</span>
            <span className="absolute bottom-[2.5vw] left-[2.5vw]">
              04 dez 2007 <span data-scramble="0123456789">{vhs.time}</span>
            </span>
            <span className="absolute right-[2.5vw] bottom-[2.5vw]">SP</span>
          </div>
        </>
      )}
    </figure>
  );
}
