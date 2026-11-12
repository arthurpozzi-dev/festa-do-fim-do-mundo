"use client";

import { useRef, useState } from "react";
import Modal from "@/components/ui/Modal";
import { formatPhone } from "@/lib/phone";
import {
  fieldErrors,
  rsvpSchema,
  type RsvpFieldErrors,
} from "@/lib/rsvp-schema";

type Status = "idle" | "sending" | "success" | "error";

const inputClass =
  "h-11 w-full border border-white bg-transparent px-3 font-helvetica text-[15px] text-white uppercase outline-none placeholder:text-[13px] placeholder:text-[#5a5a5a] focus:border-mint aria-invalid:border-red-500";

export default function RsvpModal({ onClose }: { onClose: () => void }) {
  const firstInput = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<RsvpFieldErrors>({});
  const [serverError, setServerError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const data = {
      name: String(form.get("name") ?? ""),
      email: String(form.get("email") ?? ""),
      whatsapp: String(form.get("whatsapp") ?? ""),
      acceptedTerms: form.get("acceptedTerms") === "on",
      governmentLink: form.get("governmentLink") === "on",
      website: String(form.get("website") ?? ""),
    };

    const parsed = rsvpSchema.safeParse(data);
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error));
      return;
    }

    setErrors({});
    setServerError("");
    setStatus("sending");
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErrors(json.fields ?? {});
        setServerError(json.error ?? "Algo deu errado. Tente de novo.");
        setStatus("error");
        return;
      }
      setStatus("success");
    } catch {
      setServerError("Sem conexão. Tente de novo.");
      setStatus("error");
    }
  }

  return (
    <Modal onClose={onClose} labelledBy="rsvp-title" initialFocus={firstInput}>
      {(close) => (
        <div className="mx-auto flex min-h-full max-w-[480px] flex-col px-[min(13vw,62px)] pt-[52px] pb-14 md:justify-center">
          <h2 id="rsvp-title" data-modal-item className="mx-auto mb-11 w-[95%]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/titulo-formulario.svg"
              alt="Formulário"
              className="h-auto w-full"
            />
          </h2>

          {status === "success" ? (
            <div data-modal-item className="text-center font-acid uppercase">
              <p className="text-[34px] leading-none">Presença confirmada</p>
              <p className="mt-4 text-[13px]">
                O endereço chega no seu e-mail no dia da festa.
              </p>
              <button
                type="button"
                onClick={close}
                className="mt-10 h-14 w-full border-2 border-white text-[24px] uppercase"
              >
                Fechar
              </button>
            </div>
          ) : (
            <form
              noValidate
              onSubmit={handleSubmit}
              className="font-acid uppercase"
            >
              <div data-modal-item>
                <label
                  htmlFor="rsvp-name"
                  className="mb-2 block text-[20px] leading-none"
                >
                  Nome/Vulgo
                </label>
                <input
                  ref={firstInput}
                  id="rsvp-name"
                  name="name"
                  autoComplete="name"
                  placeholder="Escreva seu nome"
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "rsvp-name-err" : undefined}
                  className={inputClass}
                />
                {errors.name && (
                  <FieldError id="rsvp-name-err">{errors.name}</FieldError>
                )}
              </div>

              <div data-modal-item className="mt-7">
                <label
                  htmlFor="rsvp-email"
                  className="mb-2 block text-[20px] leading-none"
                >
                  E-mail para receber o endereço
                </label>
                <input
                  id="rsvp-email"
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="Escreva seu e-mail"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "rsvp-email-err" : undefined}
                  className={inputClass}
                />
                {errors.email && (
                  <FieldError id="rsvp-email-err">{errors.email}</FieldError>
                )}
              </div>

              <div data-modal-item className="mt-7">
                <label
                  htmlFor="rsvp-whatsapp"
                  className="mb-2 block text-[20px] leading-none"
                >
                  WhatsApp
                </label>
                <input
                  id="rsvp-whatsapp"
                  name="whatsapp"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel-national"
                  placeholder="(DDD) 99999-9999"
                  maxLength={20}
                  onChange={(e) => {
                    e.currentTarget.value = formatPhone(e.currentTarget.value);
                  }}
                  aria-invalid={!!errors.whatsapp}
                  aria-describedby={errors.whatsapp ? "rsvp-whatsapp-err" : undefined}
                  className={inputClass}
                />
                {errors.whatsapp && (
                  <FieldError id="rsvp-whatsapp-err">{errors.whatsapp}</FieldError>
                )}
              </div>

              <div data-modal-item className="mt-7">
                <label className="flex cursor-pointer items-center gap-5 pl-1 text-[16px] leading-[1.3]">
                  <input
                    type="checkbox"
                    name="acceptedTerms"
                    aria-invalid={!!errors.acceptedTerms}
                    className="size-[13px] shrink-0 cursor-pointer appearance-none border border-white checked:bg-white aria-invalid:border-red-500"
                  />
                  <span className="w-[230px] text-justify">
                    Você aceita os{" "}
                    <a href="#termos" className="underline underline-offset-2">
                      termos e condições
                    </a>{" "}
                    da festa?
                  </span>
                </label>
                {errors.acceptedTerms && (
                  <FieldError>{errors.acceptedTerms}</FieldError>
                )}
              </div>

              <div data-modal-item className="mt-6">
                <label className="flex cursor-pointer items-center gap-5 pl-1 text-[16px] leading-[1.3]">
                  <input
                    type="checkbox"
                    name="governmentLink"
                    className="size-[13px] shrink-0 cursor-pointer appearance-none border border-white checked:bg-white"
                  />
                  <span className="text-justify">
                    Você possui ou já possuiu algum tipo de ligação com algum
                    órgão governamental? (Assinale caso &ldquo;sim&rdquo; — e
                    não minta, pois saberemos)
                  </span>
                </label>
              </div>

              {/* honeypot: invisível para pessoas */}
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden
                className="absolute -left-[9999px] h-0 w-0 opacity-0"
              />

              {serverError && (
                <p
                  role="alert"
                  className="mt-6 text-center text-[12px] text-red-500"
                >
                  {serverError}
                </p>
              )}

              <div data-modal-item className="mt-12 px-[6%]">
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="h-[74px] w-full border-2 border-white text-[44px] leading-none uppercase transition-colors hover:bg-white hover:text-black disabled:opacity-50"
                >
                  {status === "sending" ? "..." : "Enviar"}
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </Modal>
  );
}

function FieldError({
  id,
  children,
}: {
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <p
      id={id}
      role="alert"
      className="mt-1 font-helvetica text-[11px] text-red-500 normal-case"
    >
      {children}
    </p>
  );
}
