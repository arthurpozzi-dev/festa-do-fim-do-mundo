"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import RsvpModal from "./RsvpModal";

type RsvpContextValue = { open: () => void; close: () => void };

const RsvpContext = createContext<RsvpContextValue | null>(null);

/** Qualquer botão da página pode abrir o formulário via `useRsvp().open()`. */
export function useRsvp() {
  const ctx = useContext(RsvpContext);
  if (!ctx) throw new Error("useRsvp precisa estar dentro de <RsvpProvider>");
  return ctx;
}

export default function RsvpProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const value = useMemo(() => ({ open, close }), [open, close]);

  return (
    <RsvpContext.Provider value={value}>
      {children}
      {isOpen && <RsvpModal onClose={close} />}
    </RsvpContext.Provider>
  );
}
