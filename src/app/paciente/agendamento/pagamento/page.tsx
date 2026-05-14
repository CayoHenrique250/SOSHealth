"use client";

import Header from "@/src/components/Header";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { CheckCircle2, QrCode } from "lucide-react";
import Footer from "@/src/components/Footer";
import { createAppointment } from "@/src/services/api";

export default function PagamentoStep() {
  const router = useRouter();

  const handleConfirm = async () => {
    try {
      await createAppointment();
      toast.success("Consulta agendada com sucesso!");
      router.push("/paciente/dashboard");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível concluir o agendamento.");
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-[#f3f5f5]">
      <Header />

      <section className="flex-1 max-w-xl mx-auto w-full px-6 py-12 flex flex-col items-center justify-center gap-8">
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-[#1e3e44] mb-2">Confirmação de Pagamento</h1>
          <p className="text-gray-500 text-sm font-medium">Conclua o pagamento para garantir o agendamento do seu horário.</p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-md border border-gray-100 flex flex-col items-center gap-6 w-full">
          <div className="flex items-center gap-2 text-[#6ba2a6] font-bold text-lg">
            <QrCode className="w-6 h-6" /> Escaneie o QR Code Pix
          </div>
          
          <div className="w-48 h-48 bg-gray-100 border-2 border-dashed border-gray-300 rounded-2xl flex items-center justify-center p-4">
        
            <div className="w-full h-full bg-[#1e3e44] flex flex-col items-center justify-center text-white text-center rounded-xl p-2 font-bold text-xs">
              QR CODE SIMULADO DE PAGAMENTO PIX
            </div>
          </div>

          <p className="text-xs text-gray-400 text-center font-medium">Ou realize o pagamento físico diretamente na clínica no dia da consulta.</p>

          <button onClick={handleConfirm} className="w-full bg-[#1a353a] hover:bg-[#112427] text-white font-bold py-3 rounded-full shadow transition flex items-center justify-center gap-2 mt-2 text-base">
            <CheckCircle2 className="w-5 h-5" /> Confirmar Agendamento
          </button>
        </div>
      </section>

      <Footer />
    </main>
  );
}