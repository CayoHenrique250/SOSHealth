"use client";

import Header from "@/src/components/Header";
import Footer from "@/src/components/Footer";
import { Suspense, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { Camera } from "lucide-react";
import { fetchAnamneseDefaults, updateAnamneseAndProfile } from "@/src/services/api";
import { toast } from "react-toastify";

interface AnamneseForm {
  queixaPrincipal: string;
  hda: string;
  hppHf: string;
  habitos: string;
}

function AnamneseInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const { register, handleSubmit, setValue } = useForm<AnamneseForm>();

  const day = searchParams.get("day");
  const month = searchParams.get("month");
  const year = searchParams.get("year");
  const time = searchParams.get("time");
  const mode = searchParams.get("mode");

  useEffect(() => {
    fetchAnamneseDefaults()
      .then((data) => {
        setValue("queixaPrincipal", data.queixaPrincipal);
        setValue("hda", data.hda);
        setValue("hppHf", data.hppHf);
        setValue("habitos", data.habitos);
      })
      .catch((error) => {
        toast.error(error instanceof Error ? error.message : "Falha ao carregar anamnese prévia.");
      });
  }, [setValue]);

  const onSubmit = async (data: AnamneseForm) => {
    try {
      await updateAnamneseAndProfile(data);
      toast.success("Anamnese atualizada e vinculada ao perfil.");
      
      const docId = searchParams.get("docId");
      if (docId && day && month && year && time) {
        const modeParam = mode ? `&mode=${encodeURIComponent(mode)}` : "";
        router.push(`/paciente/agendamento/pagamento?docId=${docId}&day=${day}&month=${month}&year=${year}&time=${encodeURIComponent(time)}${modeParam}`);
      } else {
        router.push("/paciente/agendamento/pagamento");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao atualizar anamnese.");
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-[#f3f5f5]">
      <Header />

      <section className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-10 flex flex-col">
        {day && month && year && time ? (
          <div className="mb-4 sm:mb-6 rounded-xl border-2 border-[#6ba2a6] bg-white p-3 sm:p-4 text-sm text-slate-800 shadow-sm">
            <p className="font-bold text-[#1e3e44]">Agendamento selecionado</p>
            <p className="mt-1 text-xs sm:text-sm wrap-break-word">
              Data: {day}/{month}/{year} — Horário: {decodeURIComponent(time)}
            </p>
          </div>
        ) : null}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 sm:gap-6 w-full flex-1">
          <div>
            <label className="block text-[#1e3e44] font-bold text-sm sm:text-base md:text-lg mb-2">Queixa principal</label>
            <textarea
              {...register("queixaPrincipal")}
              placeholder="Digite sua queixa principal"
              className="w-full p-3 sm:p-4 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-[#6ba2a6] bg-white text-gray-700 resize-none h-20 sm:h-24 text-sm sm:text-base"
            />
          </div>

          <div>
            <label className="block text-[#1e3e44] font-bold text-sm sm:text-base md:text-lg mb-2">HDA</label>
            <input
              {...register("hda")}
              placeholder="História da doença atual"
              className="w-full p-3 sm:p-4 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-[#6ba2a6] bg-white text-gray-700 text-sm sm:text-base"
            />
          </div>

          <div>
            <label className="block text-[#1e3e44] font-bold text-sm sm:text-base md:text-lg mb-2">HPP / HF</label>
            <input
              {...register("hppHf")}
              placeholder="História patológica pregressa / História familiar"
              className="w-full p-3 sm:p-4 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-[#6ba2a6] bg-white text-gray-700 text-sm sm:text-base"
            />
          </div>

          <div>
            <label className="block text-[#1e3e44] font-bold text-sm sm:text-base md:text-lg mb-2">Hábitos</label>
            <input
              {...register("habitos")}
              placeholder="Descreva seus hábitos"
              className="w-full p-3 sm:p-4 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-[#6ba2a6] bg-white text-gray-700 text-sm sm:text-base"
            />
          </div>

          <div>
            <label className="block text-[#1e3e44] font-bold text-sm sm:text-base md:text-lg mb-2">Insira os arquivos (PDF, PNG e JPG)</label>
            <label className="w-full h-28 sm:h-32 bg-white rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition">
              <Camera className="w-6 h-6 sm:w-8 sm:h-8 text-gray-300 mb-1" />
              <span className="text-xs sm:text-sm font-semibold text-gray-300 text-center px-2">Inserir arquivos</span>
              <input
                type="file"
                className="hidden"
                multiple
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={(event) => {
                  const files = Array.from(event.target.files ?? []);
                  const allowedTypes = ["application/pdf", "image/png", "image/jpeg"];
                  const invalidFile = files.find((file) => !allowedTypes.includes(file.type));
                  if (invalidFile) {
                    toast.error("Apenas arquivos PDF, JPG e PNG são permitidos.");
                    event.currentTarget.value = "";
                    return;
                  }
                  setSelectedFiles(files);
                }}
              />
            </label>
            {selectedFiles.length > 0 ? (
              <p className="mt-2 text-xs sm:text-sm text-slate-600">{selectedFiles.length} arquivo(s) selecionado(s).</p>
            ) : null}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mt-6 sm:mt-8">
            <button
              type="button"
              onClick={() => router.back()}
              className="w-full sm:w-auto bg-[#6ba2a6] text-white font-bold px-8 sm:px-10 py-3 rounded-full hover:bg-opacity-90 shadow transition text-sm sm:text-base"
            >
              Voltar
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto bg-[#6ba2a6] text-white font-bold px-8 sm:px-10 py-3 rounded-full hover:bg-opacity-90 shadow transition text-sm sm:text-base"
            >
              Próximo
            </button>
          </div>
        </form>
      </section>
      <Footer />
    </main>
  );
}

export default function AnamneseStep() {
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
      <AnamneseInner />
    </Suspense>
  );
}
