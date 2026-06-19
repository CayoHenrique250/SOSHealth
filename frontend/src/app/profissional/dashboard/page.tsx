"use client";

import Header from "@/src/components/Header";
import Footer from "@/src/components/Footer";
import { useQuery } from "@tanstack/react-query";
import { fetchProfessionalDashboardData } from "@/src/services/api";
import { Star } from "lucide-react";
import { toast } from "react-toastify";
import { useEffect } from "react";

export default function DashboardProfissional() {
  const { data, isError, isLoading } = useQuery({
    queryKey: ["professional-dashboard"],
    queryFn: fetchProfessionalDashboardData,
  });

  useEffect(() => {
    if (isError) {
      toast.error("Falha ao carregar dashboard profissional.");
    }
  }, [isError]);

  return (
    <main className="min-h-screen flex flex-col bg-[#f3f5f5]">
      <Header />

      <section className="flex-1 max-w-5xl mx-auto w-full px-6 py-10">
        <h1 className="mb-6 text-3xl font-bold text-[#1e3e44]">Dashboard do Profissional</h1>

        <section className="mb-8 rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-slate-800">Métricas iniciais</h2>
          {isLoading ? (
            <p className="text-sm text-slate-500">Carregando...</p>
          ) : (data?.metrics.length ?? 0) > 0 ? (
            <div className="grid gap-3 md:grid-cols-3">
              {data?.metrics.map((metric) => (
                <article key={metric.label} className="rounded-xl border border-slate-100 p-4">
                  <p className="text-xs text-slate-500">{metric.label}</p>
                  <p className="text-2xl font-bold text-slate-900">{metric.value}</p>
                </article>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">Ainda sem dados de métricas. Realize sua primeira consulta!</p>
          )}
        </section>

        <section id="tarefas-dia" className="mb-8 rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-slate-800">Tarefas do dia</h2>
          {isLoading ? (
            <p className="text-sm text-slate-500">Carregando...</p>
          ) : (data?.tasks.length ?? 0) > 0 ? (
            <div className="space-y-3">
              {data?.tasks.map((task) => (
                <article key={task.id} className="flex items-center justify-between rounded-xl border border-slate-100 p-3">
                  <p className="font-semibold text-slate-900">{task.time}</p>
                  <p className="text-sm text-slate-700">Paciente: {task.patientName}</p>
                  <p className="text-xs font-semibold text-slate-600">{task.type}</p>
                </article>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">Nenhuma consulta agendada para hoje.</p>
          )}
        </section>

        <section id="feedbacks" className="mb-8 rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-slate-800">Feedbacks recentes</h2>
          {isLoading ? (
            <p className="text-sm text-slate-500">Carregando...</p>
          ) : (data?.feedbacks.length ?? 0) > 0 ? (
            <div className="space-y-3">
              {data?.feedbacks.map((feedback) => (
                <article key={feedback.id} className="rounded-xl border border-slate-100 p-3">
                  <div className="mb-1 flex items-center justify-between">
                    <p className="font-semibold text-slate-900">{feedback.patientName}</p>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      <span className="text-sm">{feedback.rating}</span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-700">{feedback.comment}</p>
                </article>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">Ainda nenhum feedback recebido.</p>
          )}
        </section>

        <section className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-slate-800">Histórico de consultas atendidas</h2>
          {isLoading ? (
            <p className="text-sm text-slate-500">Carregando...</p>
          ) : (data?.history.length ?? 0) > 0 ? (
            <div className="space-y-3">
              {data?.history.map((history) => (
                <article key={history.id} className="rounded-xl border border-slate-100 p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-semibold text-slate-900">{history.patientName}</p>
                    <p className="text-sm text-slate-700">{history.specialty}</p>
                    <p className="text-sm text-slate-700">{history.date}</p>
                  </div>
                  <label className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700">
                    Anexar prontuário/relatório
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={() => toast.success("Relatório anexado à ficha médica do paciente.")}
                    />
                  </label>
                </article>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">Ainda nenhuma consulta realizada.</p>
          )}
        </section>
      </section>
      <Footer />
    </main>
  );
}