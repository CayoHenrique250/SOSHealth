"use client";

import Header from "@/src/components/Header";
import Footer from "@/src/components/Footer";
import SearchForm from "@/src/components/SearchForm";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchPatientDashboardData, submitPendingReview, type PendingReview } from "@/src/services/api";
import { Suspense, useEffect, useRef, useState } from "react";
import { Star, X } from "lucide-react";
import { toast } from "react-toastify";
import { useSearchParams } from "next/navigation";

function ReviewModal({
  review,
  onClose,
}: {
  review: PendingReview;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);

  const mutation = useMutation({
    mutationFn: submitPendingReview,
    onSuccess: () => {
      toast.success("Avaliação enviada com sucesso.");
      queryClient.invalidateQueries({ queryKey: ["patient-dashboard"] });
      onClose();
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Falha ao enviar avaliação.");
    },
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">Avaliar {review.doctorName}</h3>
          <button type="button" onClick={onClose} aria-label="Fechar avaliação" className="rounded-full p-2 text-slate-900 hover:bg-slate-200">
            <X className="h-5 w-5" strokeWidth={2.5} />
          </button>
        </div>

        <div className="mb-4 flex gap-1">
          {Array.from({ length: 5 }, (_, index) => (
            <button key={index} type="button" onClick={() => setRating(index + 1)} aria-label={`Selecionar ${index + 1} estrelas`}>
              <Star className={`h-6 w-6 ${index < rating ? "fill-amber-400 text-amber-400" : "text-slate-300"}`} />
            </button>
          ))}
        </div>

        <textarea
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          className="h-24 w-full resize-none rounded-xl border border-slate-300 bg-white p-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#1e3e44] focus:ring-2 focus:ring-[#6ba2a6]"
          placeholder="Descreva sua experiência..."
        />

        <button
          type="button"
          onClick={() => mutation.mutate({ reviewId: review.id, rating, comment })}
          className="mt-4 w-full rounded-xl bg-[#1e3e44] py-3 font-semibold text-white"
        >
          Enviar avaliação
        </button>
      </div>
    </div>
  );
}

function DashboardPacienteInner() {
  const searchParams = useSearchParams();
  const [activeReview, setActiveReview] = useState<PendingReview | null>(null);
  const handledAvaliarRef = useRef(false);

  const { data, isLoading } = useQuery({
    queryKey: ["patient-dashboard"],
    queryFn: fetchPatientDashboardData,
  });

  useEffect(() => {
    if (!data || handledAvaliarRef.current) {
      return;
    }
    if (searchParams.get("acao") !== "avaliar") {
      return;
    }
    handledAvaliarRef.current = true;
    const section = document.getElementById("avaliacoes-pendentes");
    section?.scrollIntoView({ behavior: "smooth", block: "start" });
    const first = data.pendingReviews[0];
    if (first) {
      const timer = window.setTimeout(() => setActiveReview(first), 500);
      return () => window.clearTimeout(timer);
    }
  }, [data, searchParams]);

  return (
    <main className="min-h-screen flex flex-col bg-[#f3f5f5]">
      <Header />

      <section className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-6 py-10">
        <h1 className="text-3xl font-bold text-[#1e3e44]">Dashboard do Paciente</h1>

        {data?.pendingReviews.length ? (
          <div className="rounded-2xl border-l-4 border-amber-500 bg-amber-50 p-4 text-sm text-amber-800">
            Existe avaliação pendente. Novos agendamentos ficam bloqueados até a avaliação.
          </div>
        ) : null}

        <SearchForm />

        <section id="consultas-agendadas" aria-label="Consultas agendadas" className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-[#1e3e44]">Consultas agendadas</h2>
          {isLoading ? (
            <p className="text-sm text-slate-500">Carregando...</p>
          ) : data?.scheduledAppointments.length ? (
            <ul className="space-y-3">
              {data.scheduledAppointments.map((apt) => (
                <li
                  key={apt.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-100 p-4 text-sm"
                >
                  <div>
                    <p className="font-semibold text-slate-900">{apt.doctorName}</p>
                    <p className="text-slate-600">{apt.specialty}</p>
                    <p className="text-slate-600">
                      {apt.date} às {apt.time} — {apt.attendanceMode}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      apt.status === "confirmada" ? "bg-emerald-100 text-emerald-900" : "bg-amber-100 text-amber-900"
                    }`}
                  >
                    {apt.status === "confirmada" ? "Confirmada" : "Pagamento pendente"}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500">Você não possui consultas agendadas no momento.</p>
          )}
        </section>

        <section id="avaliacoes-pendentes" aria-label="Avaliações pendentes" className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-[#1e3e44]">Avaliações Pendentes</h2>
          {isLoading ? (
            <p className="text-sm text-slate-500">Carregando...</p>
          ) : data?.pendingReviews.length ? (
            <div className="grid gap-4 md:grid-cols-2">
              {data.pendingReviews.map((review) => (
                <article key={review.id} className="rounded-2xl border border-slate-100 p-4">
                  <div className="flex items-center gap-3">
                    <img src={review.doctorImage} alt={review.doctorName} className="h-12 w-12 rounded-full object-cover" />
                    <div>
                      <p className="font-semibold text-slate-900">{review.doctorName}</p>
                      <p className="text-xs text-slate-600">{review.specialty}</p>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs text-slate-600">
                    <span>
                      {review.date} - {review.time}
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveReview(review)}
                      className="rounded-full bg-[#1e3e44] px-4 py-1.5 font-semibold text-white"
                    >
                      Avaliar
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">Sem avaliações pendentes.</p>
          )}
        </section>

        <section aria-label="Histórico das últimas consultas" className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-[#1e3e44]">Histórico das Últimas Consultas</h2>
          <div className="space-y-3">
            {data?.recentHistory.map((item) => (
              <article key={item.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-100 p-3 text-sm">
                <p className="font-semibold text-slate-800">{item.doctorName}</p>
                <p className="text-slate-600">{item.specialty}</p>
                <p className="text-slate-600">{item.attendanceMode}</p>
                <p className="font-semibold text-emerald-700">{item.date}</p>
              </article>
            ))}
          </div>
        </section>
      </section>
      <Footer />
      {activeReview ? <ReviewModal review={activeReview} onClose={() => setActiveReview(null)} /> : null}
    </main>
  );
}

export default function DashboardPaciente() {
  return (
    <Suspense fallback={
      <main className="flex min-h-screen flex-col bg-[#f3f5f5]">
        <Header />
        <p className="flex-1 px-6 py-16 text-center text-slate-600">Carregando...</p>
        <Footer />
      </main>
    }>
      <DashboardPacienteInner />
    </Suspense>
  );
}
}