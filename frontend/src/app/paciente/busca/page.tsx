"use client";

import Header from "@/src/components/Header";
import Footer from "@/src/components/Footer";
import { Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import {
  fetchDoctorCalendar,
  fetchPatientDashboardData,
  fetchSpecialties,
  fetchLocations,
  searchDoctors,
  type Doctor,
  type SearchFilters,
  type AuthUser,
} from "@/src/services/api";
import { useAuth } from "@/src/context/AuthContext";
import { ChevronLeft, ChevronRight, Star, X } from "lucide-react";
import { AvatarFallback } from "@/src/components/AvatarFallback";

function monthKeyFromDate(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function mondayOffsetFirstOfMonth(year: number, monthIndex: number) {
  const dow = new Date(year, monthIndex, 1).getDay();
  return (dow + 6) % 7;
}

function isDayBeforeToday(year: number, monthIndex: number, day: number) {
  const cell = new Date(year, monthIndex, day);
  cell.setHours(0, 0, 0, 0);
  const t = new Date();
  t.setHours(0, 0, 0, 0);
  return cell < t;
}

function isTodayCell(year: number, monthIndex: number, day: number) {
  const t = new Date();
  return t.getFullYear() === year && t.getMonth() === monthIndex && t.getDate() === day;
}

const selectFilterClass =
  "rounded-lg border-2 border-slate-800 bg-white py-2.5 px-3 text-sm font-semibold text-slate-900 shadow-sm focus:border-[#1e3e44] focus:outline-none focus:ring-2 focus:ring-[#1e3e44]";

function StarRatingInteractive({
  rating,
  reviewCount,
  expanded,
  onToggle,
}: {
  rating: number;
  reviewCount: number;
  expanded: boolean;
  onToggle: () => void;
}) {
  const rounded = Math.round(rating);
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      className="flex flex-wrap items-center gap-1 rounded-lg bg-white/20 px-2 py-1 text-left transition hover:bg-white/30"
      aria-expanded={expanded}
      aria-label={`Nota ${rating.toFixed(1)} de 5. ${reviewCount} avaliações. Toque para ver comentários`}
    >
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < rounded ? "fill-amber-300 text-amber-300" : "text-white/40"}`}
          aria-hidden
        />
      ))}
      <span className="ml-1 text-xs font-bold text-white">
        {rating.toFixed(1)} ({reviewCount})
      </span>
    </button>
  );
}

function DoctorResumeModal({ doctor, onClose }: { doctor: Doctor; onClose: () => void }) {
  const [showReviews, setShowReviews] = useState(false);
  const resumeMonthKey = useMemo(() => monthKeyFromDate(new Date()), []);
  const { data: calendar = [] } = useQuery({
    queryKey: ["doctor-calendar", doctor.id, resumeMonthKey],
    queryFn: () => fetchDoctorCalendar(doctor.id, resumeMonthKey),
  });
  const rounded = Math.round(doctor.rating);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
      <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-start">
          <AvatarFallback
            name={doctor.name}
            src={doctor.image}
            className="mx-auto h-48 w-48 shrink-0 rounded-2xl border-2 border-slate-200 object-cover sm:mx-0 sm:h-56 sm:w-56"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-xl font-bold text-slate-900">{doctor.name}</h3>
                <p className="text-sm font-semibold text-slate-700">{doctor.specialty}</p>
                <p className="text-sm text-slate-600">{doctor.location}</p>
              </div>
              <button type="button" onClick={onClose} aria-label="Fechar" className="rounded-full p-2 text-slate-900 hover:bg-slate-200">
                <X className="h-5 w-5" strokeWidth={2.5} />
              </button>
            </div>
            <button
              type="button"
              onClick={() => setShowReviews((v) => !v)}
              className="mt-3 flex flex-wrap items-center gap-1 rounded-xl border-2 border-amber-400 bg-amber-50 px-3 py-2"
              aria-expanded={showReviews}
              aria-label="Ver avaliações e comentários"
            >
              {Array.from({ length: 5 }, (_, i) => (
                <Star key={i} className={`h-5 w-5 ${i < rounded ? "fill-amber-400 text-amber-400" : "text-slate-300"}`} />
              ))}
              <span className="ml-2 text-sm font-bold text-slate-900">
                {doctor.rating.toFixed(1)} — {doctor.reviewCount} avaliações
              </span>
              <span className="text-xs font-semibold text-amber-800">(clique para {showReviews ? "ocultar" : "ver"} comentários)</span>
            </button>
          </div>
        </div>

        {showReviews ? (
          <ul className="mb-4 space-y-3 rounded-2xl border border-amber-200 bg-amber-50/80 p-4">
            {doctor.reviews.map((r) => (
              <li key={r.id} className="border-b border-amber-200/80 pb-3 last:border-0 last:pb-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-slate-900">{r.author}</span>
                  <span className="text-xs text-slate-600">{r.date}</span>
                </div>
                <div className="mt-1 flex items-center gap-0.5">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star key={i} className={`h-3.5 w-3.5 ${i < r.rating ? "fill-amber-400 text-amber-400" : "text-slate-300"}`} />
                  ))}
                </div>
                <p className="mt-1 text-sm text-slate-800">{r.comment}</p>
              </li>
            ))}
          </ul>
        ) : null}

        <p className="text-sm font-medium text-slate-800">{doctor.bio}</p>

        <section className="mt-4">
          <h4 className="text-sm font-bold text-slate-900">Currículo e experiência</h4>
          <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-700">{doctor.detailedCurriculum}</p>
        </section>

        <section className="mt-4">
          <h4 className="text-sm font-bold text-slate-900">Formação acadêmica</h4>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
            {doctor.education.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="mt-5">
          <h4 className="text-sm font-bold text-slate-900">Agenda disponível</h4>
          <div className="mt-2 grid grid-cols-2 gap-2 text-xs sm:grid-cols-3">
            {calendar.length > 0 ? (
              calendar.map((day) => (
                <div
                  key={`${doctor.id}-${day.day}`}
                  className={`rounded-xl p-2 ${day.status === "available" ? "bg-emerald-100 text-emerald-900" : "bg-red-100 text-red-800"}`}
                >
                  <p className="font-bold">Dia {day.day}</p>
                  <p>{day.status === "available" ? `${day.slots.length} horário(s)` : "Esgotado"}</p>
                </div>
              ))
            ) : (
              <p className="col-span-full rounded-xl bg-slate-100 p-3 text-slate-600">Sem disponibilidade cadastrada.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

const WEEK_LABELS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

function DoctorSearchCard({
  doctor,
  hasPendingReview,
  user,
  reviewsOpen,
  onToggleReviews,
  onOpenResume,
}: {
  doctor: Doctor;
  hasPendingReview: boolean;
  user: AuthUser | null;
  reviewsOpen: boolean;
  onToggleReviews: () => void;
  onOpenResume: () => void;
}) {
  const router = useRouter();
  const [viewDate, setViewDate] = useState(() => new Date());
  const y = viewDate.getFullYear();
  const m0 = viewDate.getMonth();
  const mk = monthKeyFromDate(viewDate);

  const { data: calendar = [] } = useQuery({
    queryKey: ["doctor-calendar", doctor.id, mk],
    queryFn: () => fetchDoctorCalendar(doctor.id, mk),
  });

  const [popoverDay, setPopoverDay] = useState<number | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const lastDay = new Date(y, m0 + 1, 0).getDate();
  const lead = mondayOffsetFirstOfMonth(y, m0);

  const dayMeta = (day: number) => {
    const past = isDayBeforeToday(y, m0, day);
    const today = isTodayCell(y, m0, day);
    const row = calendar.find((d) => d.day === day);
    const free = row?.status === "available" && (row.slots?.length ?? 0) > 0;
    return { past, today, row, free };
  };

  const openPopover = (day: number) => {
    if (isDayBeforeToday(y, m0, day)) {
      return;
    }
    setSelectedSlot(null);
    setPopoverDay(day);
  };

  const popoverSlots = popoverDay ? (calendar.find((d) => d.day === popoverDay)?.slots ?? []) : [];

  const goAnamnese = () => {
    if (!popoverDay || !selectedSlot) {
      toast.warning("Selecione um horário.");
      return;
    }
    if (!user) {
      toast.warning("Faça login para concluir o agendamento.");
      router.push("/login");
      return;
    }
    if (hasPendingReview) {
      toast.warning("Você precisa avaliar consulta pendente antes de agendar.");
      return;
    }
    const month = m0 + 1;
    toast.info(`Agendamento: ${popoverDay}/${month}/${y} às ${selectedSlot}.`);
    router.push(
      `/paciente/agendamento/anamnese?docId=${doctor.id}&day=${popoverDay}&month=${month}&year=${y}&time=${encodeURIComponent(selectedSlot)}&mode=${encodeURIComponent(doctor.attendanceMode)}`,
    );
  };

  return (
    <article className="relative rounded-3xl bg-[#6ba2a6] p-6 shadow-md">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start">
        <button
          type="button"
          onClick={onOpenResume}
          className="mx-auto shrink-0 sm:mx-0"
          aria-label={`Abrir currículo de ${doctor.name}`}
        >
          <AvatarFallback
            name={doctor.name}
            src={doctor.image}
            className="h-36 w-36 rounded-2xl border-4 border-white object-cover shadow-md sm:h-40 sm:w-40"
          />
        </button>
        <div className="min-w-0 flex-1 text-center sm:text-left">
          <h3 className="text-lg font-bold text-white">{doctor.name}</h3>
          <p className="text-sm text-white/95">{doctor.specialty}</p>
          <p className="mt-1 text-sm font-semibold text-white">
            R$ {doctor.price.toFixed(2)} — {doctor.attendanceMode}
          </p>
          <div className="mt-2 flex justify-center sm:justify-start">
            <StarRatingInteractive
              rating={doctor.rating}
              reviewCount={doctor.reviewCount}
              expanded={reviewsOpen}
              onToggle={onToggleReviews}
            />
          </div>
        </div>
      </div>

      {reviewsOpen ? (
        <ul className="mb-3 space-y-2 rounded-xl border border-white/40 bg-white/95 p-3 text-left">
          {doctor.reviews.map((r) => (
            <li key={r.id} className="text-xs text-slate-800">
              <span className="font-bold text-slate-900">{r.author}</span>
              <span className="mx-1 text-amber-600">★{r.rating}</span>
              <span className="text-slate-700">— {r.comment}</span>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="relative rounded-xl bg-white p-3">
        <div className="mb-2 flex items-center justify-between gap-2">
          <p className="text-xs font-bold text-slate-900">Agenda</p>
          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label="Mês anterior"
              className="rounded p-1 text-slate-800 hover:bg-slate-100"
              onClick={() => setViewDate(new Date(y, m0 - 1, 1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="min-w-[8.5rem] text-center text-[11px] font-bold capitalize text-slate-800">
              {viewDate.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}
            </span>
            <button
              type="button"
              aria-label="Próximo mês"
              className="rounded p-1 text-slate-800 hover:bg-slate-100"
              onClick={() => setViewDate(new Date(y, m0 + 1, 1))}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
        <p className="mb-1 text-[10px] font-medium text-slate-600">Toque em um dia para ver horários. Dias passados não podem ser selecionados.</p>
        <div className="grid grid-cols-7 gap-0.5 text-[10px] font-bold text-slate-600">
          {WEEK_LABELS.map((w) => (
            <span key={w} className="py-1 text-center">
              {w}
            </span>
          ))}
          {Array.from({ length: lead }, (_, i) => (
            <span key={`e-${i}`} className="rounded py-1" aria-hidden />
          ))}
          {Array.from({ length: lastDay }, (_, i) => {
            const day = i + 1;
            const { past, today, free } = dayMeta(day);
            const base = past
              ? "cursor-not-allowed bg-slate-200 text-slate-400 line-through"
              : today
                ? "bg-blue-800 text-white ring-1 ring-blue-950"
                : free
                  ? "bg-emerald-200 text-emerald-950 hover:bg-emerald-300"
                  : "bg-red-100 text-red-800 hover:bg-red-200";
            return (
              <button
                key={`${doctor.id}-${mk}-${day}`}
                type="button"
                disabled={past}
                onClick={() => openPopover(day)}
                className={`rounded py-1 text-[11px] font-semibold transition ${base} ${!past ? "cursor-pointer" : ""}`}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>

      {popoverDay !== null ? (
        <div
          className="absolute inset-0 z-20 flex items-center justify-center rounded-3xl bg-slate-950/50 p-3"
          role="presentation"
          onClick={() => setPopoverDay(null)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-white p-4 shadow-2xl"
            role="dialog"
            aria-label="Horários do dia selecionado"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-bold text-slate-900">Escolha o horário</p>
                <p className="text-xs text-slate-600">
                  {popoverDay}/{String(m0 + 1).padStart(2, "0")}/{y}
                </p>
              </div>
              <button
                type="button"
                className="rounded-full p-1.5 text-slate-900 hover:bg-slate-200"
                aria-label="Fechar"
                onClick={() => setPopoverDay(null)}
              >
                <X className="h-4 w-4" strokeWidth={2.75} />
              </button>
            </div>
            {popoverSlots.length ? (
              <div className="mb-4 flex flex-wrap gap-2">
                {popoverSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    className={`rounded-full px-3 py-1.5 text-xs font-bold shadow ${
                      selectedSlot === slot ? "bg-[#1e3e44] text-white" : "bg-slate-100 text-slate-900 hover:bg-slate-200"
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            ) : (
              <p className="mb-4 text-sm text-slate-600">Nenhum horário livre neste dia.</p>
            )}
            <button
              type="button"
              onClick={goAnamnese}
              className="w-full rounded-xl bg-[#1e3e44] py-2.5 text-sm font-bold text-white disabled:opacity-50"
              disabled={!selectedSlot || popoverSlots.length === 0}
            >
              Próximo
            </button>
          </div>
        </div>
      ) : null}
    </article>
  );
}

function BuscaSearchGate() {
  const searchParams = useSearchParams();
  const spec = searchParams.get("spec") ?? "";
  const loc = searchParams.get("loc") ?? "";
  return <BuscaResultadosInner key={`${spec}|${loc}`} initialSpec={spec} initialLoc={loc} />;
}

function BuscaResultadosInner({ initialSpec, initialLoc }: { initialSpec: string; initialLoc: string }) {
  const { user } = useAuth();
  const [filters, setFilters] = useState<SearchFilters>({
    specialty: initialSpec,
    location: initialLoc,
    priceRange: "all",
    minRating: 0,
    proximity: "all",
  });
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [reviewsOpenFor, setReviewsOpenFor] = useState<string | null>(null);

  const { data: specialties = [] } = useQuery({ queryKey: ["specialties"], queryFn: fetchSpecialties });
  const { data: locations = [] } = useQuery({ queryKey: ["locations"], queryFn: fetchLocations });
  const { data: doctors = [] } = useQuery({
    queryKey: ["search-doctors", filters],
    queryFn: () => searchDoctors(filters),
  });
  const { data: patientData } = useQuery({
    queryKey: ["patient-dashboard"],
    queryFn: fetchPatientDashboardData,
  });

  const hasPendingReview = (patientData?.pendingReviews.length ?? 0) > 0;

  return (
    <main className="min-h-screen flex flex-col bg-[#f3f5f5]">
      <Header />

      <section className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
        <h1 className="mb-6 text-3xl font-bold text-[#1e3e44]">Profissionais disponíveis</h1>

        <div className="mb-8 grid gap-3 rounded-2xl border-2 border-slate-800 bg-slate-100 p-4 shadow-md md:grid-cols-5">
          <select
            value={filters.specialty ?? ""}
            onChange={(e) => setFilters((prev) => ({ ...prev, specialty: e.target.value }))}
            className={selectFilterClass}
          >
            <option value="">Especialidade</option>
            {specialties.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <select
            value={filters.location ?? ""}
            onChange={(e) => setFilters((prev) => ({ ...prev, location: e.target.value }))}
            className={selectFilterClass}
          >
            <option value="">Localização</option>
            {locations.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <select
            value={filters.priceRange ?? "all"}
            onChange={(e) => setFilters((prev) => ({ ...prev, priceRange: e.target.value as SearchFilters["priceRange"] }))}
            className={selectFilterClass}
          >
            <option value="all">Faixa de preço</option>
            <option value="low">Até R$ 180</option>
            <option value="mid">R$ 181 a R$ 230</option>
            <option value="high">Acima de R$ 230</option>
          </select>
          <select
            value={String(filters.minRating ?? 0)}
            onChange={(e) => setFilters((prev) => ({ ...prev, minRating: Number(e.target.value) }))}
            className={selectFilterClass}
          >
            <option value="0">Classificação</option>
            <option value="5">5 estrelas</option>
            <option value="4">4+ estrelas</option>
            <option value="3">3+ estrelas</option>
          </select>
          <select
            value={filters.proximity ?? "all"}
            onChange={(e) => setFilters((prev) => ({ ...prev, proximity: e.target.value as SearchFilters["proximity"] }))}
            className={selectFilterClass}
          >
            <option value="all">Proximidade</option>
            <option value="5">Até 5 km</option>
            <option value="10">Até 10 km</option>
            <option value="20">Até 20 km</option>
          </select>
        </div>

        {hasPendingReview ? (
          <div className="mb-6 rounded-xl border-l-4 border-amber-500 bg-amber-50 p-3 text-sm font-medium text-amber-900">
            Você tem avaliação pendente e não pode concluir novos agendamentos.
          </div>
        ) : null}

        <div className="grid gap-6 md:grid-cols-2">
          {doctors.map((doctor) => (
            <DoctorSearchCard
              key={doctor.id}
              doctor={doctor}
              hasPendingReview={hasPendingReview}
              user={user}
              reviewsOpen={reviewsOpenFor === doctor.id}
              onToggleReviews={() => setReviewsOpenFor((id) => (id === doctor.id ? null : doctor.id))}
              onOpenResume={() => setSelectedDoctor(doctor)}
            />
          ))}
        </div>
      </section>
      <Footer />
      {selectedDoctor ? <DoctorResumeModal doctor={selectedDoctor} onClose={() => setSelectedDoctor(null)} /> : null}
    </main>
  );
}

export default function PacienteBuscaPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen flex-col bg-[#f3f5f5]">
          <Header />
          <p className="flex-1 px-6 py-16 text-center text-slate-600">Carregando busca...</p>
          <Footer />
        </main>
      }
    >
      <BuscaSearchGate />
    </Suspense>
  );
}
