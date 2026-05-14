"use client";

import { useMemo, useState } from "react";
import Header from "@/src/components/Header";
import Footer from "@/src/components/Footer";
import { toast } from "react-toastify";
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchAvailabilityByMonth, saveAvailability, type AttendanceMode } from "@/src/services/api";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function CadastroDisponibilidade() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState("08:00");
  const [price, setPrice] = useState(180);
  const [mode, setMode] = useState<AttendanceMode>("Teleatendimento");

  const monthKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}`;
  const { data: monthAvailability = [] } = useQuery({
    queryKey: ["availability-month", monthKey],
    queryFn: () => fetchAvailabilityByMonth(monthKey),
  });

  const monthDays = useMemo(() => {
    const total = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    return Array.from({ length: total }, (_, i) => i + 1);
  }, [currentDate]);

  const mutation = useMutation({
    mutationFn: saveAvailability,
    onSuccess: () => toast.success("Disponibilidade cadastrada."),
    onError: (error) => toast.error(error instanceof Error ? error.message : "Falha ao salvar agenda."),
  });

  const onSubmit = () => {
    if (!selectedDay) {
      toast.error("Selecione um dia antes de salvar.");
      return;
    }
    mutation.mutate({
      monthKey,
      day: selectedDay,
      time: selectedTime,
      price,
      mode,
    });
  };

  return (
    <main className="min-h-screen flex flex-col bg-[#f3f5f5]">
      <Header />

      <section className="flex-1 max-w-5xl mx-auto w-full px-6 py-10">
        <h1 className="mb-6 text-3xl font-bold text-[#1e3e44]">Arrumar Agenda</h1>

        <div className="mb-5 flex items-center justify-between rounded-xl bg-white p-3 shadow-sm">
          <button type="button" onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))} className="rounded-full p-2 hover:bg-slate-100">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <p className="font-semibold text-slate-800">
            {currentDate.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}
          </p>
          <button type="button" onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))} className="rounded-full p-2 hover:bg-slate-100">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <div className="rounded-3xl bg-[#6ba2a6] p-8 shadow-lg">
          <div className="grid gap-8 md:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-3">
              <div className="grid grid-cols-7 gap-1 text-[10px] font-semibold text-slate-500">
                {["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"].map((w) => (
                  <span key={w} className="py-1 text-center">
                    {w}
                  </span>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1 text-sm">
                {(() => {
                  const y = currentDate.getFullYear();
                  const m0 = currentDate.getMonth();
                  const first = new Date(y, m0, 1).getDay();
                  const monLead = (first + 6) % 7;
                  const blanks = Array.from({ length: monLead }, (_, i) => <span key={`b-${i}`} className="rounded py-2" aria-hidden />);
                  const todayStart = new Date();
                  todayStart.setHours(0, 0, 0, 0);
                  return (
                    <>
                      {blanks}
                      {monthDays.map((day) => {
                        const cell = new Date(y, m0, day);
                        cell.setHours(0, 0, 0, 0);
                        const isPast = cell < todayStart;
                        const isToday =
                          day === new Date().getDate() &&
                          currentDate.getMonth() === new Date().getMonth() &&
                          currentDate.getFullYear() === new Date().getFullYear();
                        const hasAgenda = monthAvailability.some((item) => item.day === day);
                        const selected = selectedDay === day;
                        const color = isPast
                          ? "cursor-not-allowed bg-slate-200 text-slate-400 line-through"
                          : isToday
                            ? "bg-blue-900 text-white"
                            : hasAgenda
                              ? "bg-emerald-200 text-emerald-900"
                              : "bg-slate-100 text-slate-600";
                        return (
                          <button
                            key={day}
                            type="button"
                            disabled={isPast}
                            onClick={() => {
                              if (!isPast) {
                                setSelectedDay(day);
                              }
                            }}
                            className={`rounded py-2 ${color} ${selected && !isPast ? "ring-2 ring-slate-900" : ""}`}
                          >
                            {day}
                          </button>
                        );
                      })}
                    </>
                  );
                })()}
              </div>
            </div>

            <div className="space-y-3 rounded-xl border-2 border-white/40 bg-white/10 p-4">
              <div>
                <label htmlFor="consult-price" className="block text-sm font-bold text-white">
                  Valor da consulta neste horário (R$)
                </label>
                <p className="mb-2 text-xs leading-snug text-white/90">
                  Defina o preço cobrado pelo paciente neste dia e horário. Não é um código: é o valor em reais (ex.: 200 para duzentos reais).
                </p>
                <div className="flex items-center gap-2 rounded-lg border-2 border-white/50 bg-white px-3 py-2 shadow-inner">
                  <span className="text-base font-black text-slate-900" aria-hidden>
                    R$
                  </span>
                  <input
                    id="consult-price"
                    type="number"
                    min={50}
                    step={5}
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="min-w-0 flex-1 border-0 bg-transparent text-lg font-bold text-slate-900 outline-none"
                    aria-describedby="consult-price-hint"
                  />
                </div>
                <p id="consult-price-hint" className="mt-1 text-[11px] text-white/80">
                  Mínimo simulado: R$ 50,00.
                </p>
              </div>
              <select value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)} className="w-full rounded-lg border-2 border-white/50 bg-white p-3 text-sm font-bold text-slate-900">
                {["08:00", "09:00", "10:00", "14:00", "15:00", "16:00"].map((slot) => <option key={slot} value={slot}>{slot}</option>)}
              </select>
              <select value={mode} onChange={(e) => setMode(e.target.value as AttendanceMode)} className="w-full rounded-lg border-2 border-white/50 bg-white p-3 text-sm font-bold text-slate-900">
                <option value="Teleatendimento">Teleatendimento</option>
                <option value="Presencial">Presencial</option>
              </select>
              <button type="button" onClick={onSubmit} className="w-full rounded-xl bg-[#1a353a] py-3 font-semibold text-white">
                Salvar disponibilidade
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-2xl bg-white p-4 shadow-sm">
          <h2 className="mb-3 text-lg font-semibold text-slate-800">Calendários rápidos</h2>
          <div className="grid gap-3 md:grid-cols-3">
            {["2026-05", "2026-06", "2026-07"].map((key) => (
              <article key={key} className="rounded-xl border border-slate-100 p-3">
                <p className="mb-2 text-sm font-semibold text-slate-800">{key}</p>
                <div className="grid grid-cols-7 gap-1 text-[10px]">
                  {Array.from({ length: 14 }, (_, i) => i + 1).map((day) => {
                    const isToday = day === new Date().getDate() && key === `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}`;
                    const hasAgenda = day % 4 === 0;
                    const color = isToday ? "bg-blue-900 text-white" : hasAgenda ? "bg-emerald-300 text-emerald-900" : "bg-slate-100 text-slate-500";
                    return <span key={`${key}-${day}`} className={`rounded py-1 text-center ${color}`}>{day}</span>;
                  })}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}