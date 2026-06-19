"use client";

import Header from "@/src/components/Header";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { CheckCircle2, QrCode } from "lucide-react";
import Footer from "@/src/components/Footer";
import { createAppointment } from "@/src/services/api";

function PagamentoInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleConfirm = async () => {
    try {
      const docId = searchParams.get("docId");
      const day = searchParams.get("day");
      const month = searchParams.get("month");
      const year = searchParams.get("year");
      const time = searchParams.get("time");
      const modeParam = searchParams.get("mode");

      if (docId && day && month && year && time) {
        const date = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        const mode = modeParam ? decodeURIComponent(modeParam) : "Presencial";
        await createAppointment({ professionalId: docId, date, time: decodeURIComponent(time), mode });
      } else {
        await createAppointment();
      }
      toast.success("Consulta agendada com sucesso!");
      router.push("/paciente/dashboard");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível concluir o agendamento.");
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-[#f3f5f5]">
      <Header />

      <section className="flex-1 max-w-xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12 flex flex-col items-center justify-center gap-6 sm:gap-8">
        <div className="text-center">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#1e3e44] mb-2 px-2">Confirmação de Pagamento</h1>
          <p className="text-gray-500 text-xs sm:text-sm font-medium px-2">Conclua o pagamento para garantir o agendamento do seu horário.</p>
        </div>

        <div className="bg-white p-4 sm:p-6 md:p-8 rounded-3xl shadow-md border border-gray-100 flex flex-col items-center gap-4 sm:gap-6 w-full">
          <div className="flex items-center gap-2 text-[#6ba2a6] font-bold text-sm sm:text-base md:text-lg">
            <QrCode className="w-5 h-5 sm:w-6 sm:h-6" /> Escaneie o QR Code Pix
          </div>
          
          <div className="w-36 h-36 sm:w-40 sm:h-40 md:w-48 md:h-48 bg-gray-100 border-2 border-dashed border-gray-300 rounded-2xl flex items-center justify-center p-3 sm:p-4">
            <div className="w-full h-full bg-[#1e3e44] flex flex-col items-center justify-center text-white text-center rounded-xl p-2 font-bold text-[10px] sm:text-xs">
              QR CODE SIMULADO DE PAGAMENTO PIX
            </div>
          </div>

          <p className="text-[10px] sm:text-xs text-gray-400 text-center font-medium px-2">Ou realize o pagamento físico diretamente na clínica no dia da consulta.</p>

          <button onClick={handleConfirm} className="w-full bg-[#1a353a] hover:bg-[#112427] text-white font-bold py-3 sm:py-4 rounded-full shadow transition flex items-center justify-center gap-2 mt-2 text-sm sm:text-base">
            <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" /> Confirmar Agendamento
          </button>
        </div>
      </section>

      <Footer />
    </main>
  );
}

import { Suspense } from "react";

export default function PagamentoStep() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen flex-col bg-[#f3f5f5]">
          <Header />
          <p className="flex-1 px-6 py-16 text-center text-slate-600">Carregando...</p>
          <Footer />
        </main>
      }
    >
      <PagamentoInner />
    </Suspense>
  );
}