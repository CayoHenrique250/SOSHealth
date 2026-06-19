"use client";

import { useMemo, useState } from "react";
import Header from "@/src/components/Header";
import Footer from "@/src/components/Footer";
import { toast } from "react-toastify";
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchAvailabilityByMonth, saveAvailability, fetchProfessionalDashboardData, type AttendanceMode } from "@/src/services/api";
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

  const { data: dashboardData } = useQuery({
    queryKey: ["professional-dashboard"],
    queryFn: fetchProfessionalDashboardData,
  });
  const upcomingAppointments = dashboardData?.upcomingAppointments || [];

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

      <section className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-10">
        <h1 className="mb-4 sm:mb-6 text-2xl sm:text-3xl font-bold text-[#1e3e44]">Arrumar Agenda</h1>

        <div className="mb-4 sm:mb-5 flex items-center justify-between rounded-xl bg-white p-3 shadow-sm">
          <button
            type="button"
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}
            className="rounded-full p-2 text-[#1e3e44] transition hover:bg-slate-200 active:bg-slate-300"
            aria-label="Mês anterior"
          >
            <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2.25} />
          </button>
          <p className="text-center text-sm font-semibold capitalize text-slate-800 sm:text-base">
            {currentDate.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}
          </p>
          <button
            type="button"
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}
            className="rounded-full p-2 text-[#1e3e44] transition hover:bg-slate-200 active:bg-slate-300"
            aria-label="Próximo mês"
          >
            <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2.25} />
          </button>
        </div>

        <div className="rounded-3xl bg-[#6ba2a6] p-4 sm:p-6 lg:p-8 shadow-lg">
          <div className="grid gap-4 sm:gap-6 lg:gap-8 lg:grid-cols-2">
            <div className="rounded-xl border border-gray-200 bg-white p-3 sm:p-4">
              <div className="grid grid-cols-7 gap-1 text-[9px] sm:text-[10px] font-semibold text-slate-500">
                {["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"].map((w) => (
                  <span key={w} className="py-1 text-center">
                    {w}
                  </span>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1 text-xs sm:text-sm">
                {(() => {
                  const y = currentDate.getFullYear();
                  const m0 = currentDate.getMonth();
                  const first = new Date(y, m0, 1).getDay();
                  const monLead = (first + 6) % 7;
                  const blanks = Array.from({ length: monLead }, (_, i) => <span key={`b-${i}`} className="rounded py-1.5 sm:py-2" aria-hidden />);
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
                            className={`rounded py-1.5 sm:py-2 min-h-[28px] sm:min-h-[32px] ${color} ${selected && !isPast ? "ring-2 ring-slate-900" : ""} transition-all`}
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

            <div className="space-y-3 rounded-xl border-2 border-white/40 bg-white/10 p-3 sm:p-4">
              <div>
                <label htmlFor="consult-price" className="block text-xs sm:text-sm font-bold text-white">
                  Valor da consulta neste horário (R$)
                </label>
                <p className="mb-2 text-[10px] sm:text-xs leading-snug text-white/90">
                  Defina o preço cobrado pelo paciente neste dia e horário. Não é um código: é o valor em reais (ex.: 200 para duzentos reais).
                </p>
                <div className="flex items-center gap-2 rounded-lg border-2 border-white/50 bg-white px-2 sm:px-3 py-2 shadow-inner">
                  <span className="text-sm sm:text-base font-black text-slate-900" aria-hidden>
                    R$
                  </span>
                  <input
                    id="consult-price"
                    type="number"
                    min={50}
                    step={5}
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="min-w-0 flex-1 border-0 bg-transparent text-sm sm:text-lg font-bold text-slate-900 outline-none"
                    aria-describedby="consult-price-hint"
                  />
                </div>
                <p id="consult-price-hint" className="mt-1 text-[10px] sm:text-[11px] text-white/80">
                  Mínimo simulado: R$ 50,00.
                </p>
              </div>
              <select value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)} className="w-full rounded-lg border-2 border-white/50 bg-white p-2.5 sm:p-3 text-xs sm:text-sm font-bold text-slate-900">
                {["08:00", "09:00", "10:00", "14:00", "15:00", "16:00"].map((slot) => <option key={slot} value={slot}>{slot}</option>)}
              </select>
              <select value={mode} onChange={(e) => setMode(e.target.value as AttendanceMode)} className="w-full rounded-lg border-2 border-white/50 bg-white p-2.5 sm:p-3 text-xs sm:text-sm font-bold text-slate-900">
                <option value="Teleatendimento">Teleatendimento</option>
                <option value="Presencial">Presencial</option>
              </select>
              <button type="button" onClick={onSubmit} className="w-full rounded-xl bg-[#1a353a] py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-white transition-colors hover:bg-[#112427]">
                Salvar disponibilidade
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 sm:mt-8 rounded-2xl bg-white p-3 sm:p-4 shadow-sm">
          <h2 className="mb-3 text-base sm:text-lg font-semibold text-slate-800">Consultas Agendadas</h2>
          {upcomingAppointments.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {upcomingAppointments.map((apt) => (
                <article key={apt.id} className="rounded-xl border border-slate-100 bg-slate-50 p-3 shadow-sm">
                  <p className="mb-1 text-xs sm:text-sm font-semibold text-slate-800">{apt.date} às {apt.time}</p>
                  <p className="text-[11px] sm:text-xs text-slate-600">Paciente: <span className="font-medium text-slate-900">{apt.patientName}</span></p>
                  <p className="text-[11px] sm:text-xs text-slate-600">Modo: <span className="font-medium text-slate-900">{apt.type}</span></p>
                </article>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">Nenhum paciente agendou consulta ainda para as datas disponibilizadas.</p>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}