"use client";

import { AlertTriangle, Contrast, PhoneCall, Type, X } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import VLibras from "react-vlibras";

const EMERGENCY_CONTACTS = [
  { id: "samu", name: "SAMU", number: "192", color: "bg-red-600" },
  { id: "fire", name: "Bombeiros", number: "193", color: "bg-orange-600" },
  { id: "police", name: "Polícia", number: "190", color: "bg-blue-700" },
] as const;

export default function GlobalFloatingWidgets() {
  const [sosOpen, setSosOpen] = useState(false);
  const [accessibilityOpen, setAccessibilityOpen] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);

  useEffect(() => {
    if (highContrast) {
      document.documentElement.classList.add("high-contrast");
    } else {
      document.documentElement.classList.remove("high-contrast");
    }
  }, [highContrast]);

  useEffect(() => {
    if (largeText) {
      document.documentElement.classList.add("large-text");
    } else {
      document.documentElement.classList.remove("large-text");
    }
  }, [largeText]);

  return (
    <>
      <div
        className="fixed left-4 top-1/2 z-40 flex -translate-y-1/2 flex-col items-center md:left-6"
        aria-label="Acessibilidade"
      >
        <div className="relative shrink-0">
          {accessibilityOpen ? (
            <div
              role="dialog"
              aria-label="Opções de acessibilidade"
              className="absolute left-full top-1/2 z-50 ml-2.5 w-56 -translate-y-1/2 rounded-2xl border border-slate-200 bg-white p-4 text-slate-900 shadow-xl"
            >
              <div className="mb-2 flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-slate-900">Acessibilidade</p>
                <button
                  type="button"
                  onClick={() => setAccessibilityOpen(false)}
                  className="rounded-full p-1.5 text-slate-900 hover:bg-slate-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
                  aria-label="Fechar painel de acessibilidade"
                >
                  <X className="h-5 w-5" strokeWidth={2.5} />
                </button>
              </div>
              <div className="space-y-2 text-xs text-slate-800">
                <button
                  type="button"
                  onClick={() => setHighContrast(!highContrast)}
                  className={`flex w-full items-center gap-2 rounded-lg p-2 text-left hover:bg-slate-100 ${highContrast ? "bg-slate-200" : ""}`}
                >
                  <Contrast className="h-4 w-4 shrink-0 text-slate-900" strokeWidth={2.25} />
                  Alto contraste
                </button>
                <button
                  type="button"
                  onClick={() => setLargeText(!largeText)}
                  className={`flex w-full items-center gap-2 rounded-lg p-2 text-left hover:bg-slate-100 ${largeText ? "bg-slate-200" : ""}`}
                >
                  <Type className="h-4 w-4 shrink-0 text-slate-900" strokeWidth={2.25} />
                  Aumento de fonte
                </button>
              </div>
            </div>
          ) : null}

          <button
            type="button"
            onClick={() => setAccessibilityOpen((open) => !open)}
            aria-label="Abrir painel de acessibilidade"
            aria-expanded={accessibilityOpen}
            className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-white/90 shadow-md transition hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2 md:h-12 md:w-12"
          >
            <Image
              src="/images/acessibilidade.png"
              alt=""
              width={48}
              height={48}
              className="h-full w-full object-cover"
              priority
            />
          </button>
        </div>
      </div>

      <div className="fixed right-4 top-1/2 z-40 flex -translate-y-1/2 flex-col items-center md:right-6">
        <div className="flex w-12 shrink-0 flex-col items-center justify-start md:w-14">
          <VLibras safeInit position="right" />
        </div>
      </div>

      <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3 md:right-6">
        {sosOpen ? (
          <div
            role="dialog"
            aria-label="Serviços de emergência"
            className="relative w-72 rounded-2xl border border-red-200 bg-white p-3 pt-10 shadow-xl"
          >
            <button
              type="button"
              onClick={() => setSosOpen(false)}
              className="absolute right-2 top-2 rounded-full p-1.5 text-slate-900 hover:bg-slate-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
              aria-label="Fechar emergência"
            >
              <X className="h-5 w-5" strokeWidth={2.5} />
            </button>
            <p className="mb-2 flex items-center gap-2 text-sm font-bold text-red-700">
              <AlertTriangle className="h-4 w-4 shrink-0 text-red-700" strokeWidth={2.5} aria-hidden />
              Emergência imediata
            </p>
            <div className="space-y-2">
              {EMERGENCY_CONTACTS.map((contact) => (
                <a
                  key={contact.id}
                  href={`tel:${contact.number}`}
                  className={`flex items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-sm font-bold text-white ${contact.color}`}
                >
                  <span>{contact.name}</span>
                  <span className="font-mono text-base">{contact.number}</span>
                </a>
              ))}
            </div>
          </div>
        ) : null}

        <button
          type="button"
          onClick={() => setSosOpen((open) => !open)}
          aria-label="Abrir botão SOS de emergência"
          aria-expanded={sosOpen}
          className="sos-pulse-button flex h-16 min-w-18 flex-col items-center justify-center gap-0.5 rounded-full bg-red-700 px-3 py-2 text-white shadow-2xl ring-4 ring-red-200 transition hover:bg-red-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-800"
        >
          <PhoneCall className="h-5 w-5 shrink-0" aria-hidden />
          <span className="text-xs font-black leading-none tracking-tight">SOS</span>
        </button>
      </div>
    </>
  );
}
