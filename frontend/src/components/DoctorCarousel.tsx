"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchDoctorCalendar, fetchDoctors, type Doctor } from "@/src/services/api";
import { ChevronLeft, ChevronRight, Star, X } from "lucide-react";
import { toast } from "react-toastify";
import { AvatarFallback } from "@/src/components/AvatarFallback";

const renderStars = (rating: number) => {
  const rounded = Math.round(rating);
  return Array.from({ length: 5 }, (_, index) => (
    <Star key={`${rating}-${index}`} className={`h-4 w-4 ${index < rounded ? "fill-amber-400 text-amber-400" : "text-slate-300"}`} />
  ));
};

function DoctorModal({ doctor, onClose }: { doctor: Doctor; onClose: () => void }) {
  const [showReviews, setShowReviews] = useState(false);
  const resumeMonthKey = useMemo(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  }, []);
  const { data: calendar = [] } = useQuery({
    queryKey: ["doctor-calendar", doctor.id, resumeMonthKey],
    queryFn: () => fetchDoctorCalendar(doctor.id, resumeMonthKey),
  });
  const rounded = Math.round(doctor.rating);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-start">
          <AvatarFallback name={doctor.name} src={doctor.image} className="mx-auto h-44 w-44 shrink-0 rounded-2xl border-2 border-slate-200 object-cover sm:mx-0 sm:h-52 sm:w-52" />
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h4 className="text-xl font-bold text-slate-900">{doctor.name}</h4>
                <p className="text-sm text-slate-600">{doctor.specialty} — {doctor.location}</p>
              </div>
              <button type="button" onClick={onClose} aria-label="Fechar modal do profissional" className="rounded-full p-2 text-slate-900 hover:bg-slate-200">
                <X className="h-5 w-5" strokeWidth={2.5} />
              </button>
            </div>
            <button
              type="button"
              onClick={() => setShowReviews((v) => !v)}
              className="mt-3 flex flex-wrap items-center gap-1 rounded-xl border-2 border-amber-400 bg-amber-50 px-3 py-2"
              aria-expanded={showReviews}
            >
              {Array.from({ length: 5 }, (_, i) => (
                <Star key={i} className={`h-5 w-5 ${i < rounded ? "fill-amber-400 text-amber-400" : "text-slate-300"}`} />
              ))}
              <span className="ml-2 text-sm font-bold text-slate-900">{doctor.rating.toFixed(1)}</span>
              <span className="text-xs font-semibold text-amber-800">({showReviews ? "ocultar" : "ver"} comentários)</span>
            </button>
          </div>
        </div>

        {showReviews ? (
          <ul className="mb-4 space-y-2 rounded-xl border border-amber-200 bg-amber-50 p-3">
            {doctor.reviews.map((r) => (
              <li key={r.id} className="text-sm text-slate-800">
                <span className="font-bold">{r.author}</span>{" "}
                <span className="text-amber-700">★{r.rating}</span> — {r.comment}
              </li>
            ))}
          </ul>
        ) : null}

        <p className="text-sm font-medium text-slate-800">{doctor.bio}</p>
        <section className="mt-3">
          <p className="text-sm font-bold text-slate-900">Currículo</p>
          <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-slate-700">{doctor.detailedCurriculum}</p>
        </section>
        <div className="mt-4">
          <p className="text-sm font-semibold text-slate-800">Escolaridade</p>
          <ul className="mt-2 space-y-1 text-sm text-slate-600">
            {doctor.education.map((item) => (
              <li key={item}>- {item}</li>
            ))}
          </ul>
        </div>

        <div className="mt-5">
          <p className="text-sm font-semibold text-slate-800">Agenda disponível</p>
          <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
            {calendar.length > 0 ? (
              calendar.map((day) => (
                <div key={`${doctor.id}-${day.day}`} className={`rounded-xl p-2 ${day.status === "available" ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-700"}`}>
                  <p className="font-bold">Dia {day.day}</p>
                  <p>{day.status === "available" ? `${day.slots.length} horário(s)` : "Sem horários livres"}</p>
                </div>
              ))
            ) : (
              <p className="col-span-2 rounded-xl bg-slate-100 p-3 text-slate-600">Sem disponibilidade cadastrada.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DoctorCarousel() {
  const [startIndex, setStartIndex] = useState(0);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const itemsToShow = 4;

  const {
    data: doctors = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["doctors"],
    queryFn: fetchDoctors,
  });

  const visibleDoctors = useMemo(() => {
    return doctors.slice(startIndex, startIndex + itemsToShow);
  }, [doctors, startIndex]);

  const nextSlide = () => {
    if (startIndex + itemsToShow < doctors.length) {
      setStartIndex((prev) => prev + 1);
    }
  };

  const prevSlide = () => {
    if (startIndex > 0) {
      setStartIndex((prev) => prev - 1);
    }
  };

  const openDoctor = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    toast.info("Resumo profissional carregado.");
  };

  return (
    <section aria-label="Carrossel de melhores profissionais" className="relative w-full bg-[#1e3e44] px-6 py-12 text-white md:px-16">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-xl md:text-2xl font-bold">
            Os melhores profissionais ao seu dispor!
          </h3>
          <span className="text-xs text-gray-300 tracking-widest">•••</span>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        ) : isError ? (
          <p className="text-red-300 text-center">
            Erro ao carregar profissionais.
          </p>
        ) : (
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={prevSlide}
              disabled={startIndex === 0}
              className="p-2 disabled:opacity-30 hover:bg-white/10 rounded-full transition"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 flex-1 overflow-hidden">
              {visibleDoctors.map((doc) => (
                <button
                  key={doc.id}
                  type="button"
                  onClick={() => openDoctor(doc)}
                  className="group bg-white text-gray-800 rounded-xl overflow-hidden shadow-lg p-3 text-center flex flex-col items-center"
                >
                  <div className="mb-4 w-full overflow-hidden rounded-lg">
                    <AvatarFallback
                      name={doc.name}
                      src={doc.image}
                      className="h-40 w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                  </div>
                  <h4 className="font-bold text-sm text-[#1e3e44]">
                    {doc.name}
                  </h4>
                  <p className="text-xs text-gray-500">{doc.specialty}</p>
                  <div className="mt-2 flex items-center gap-1">{renderStars(doc.rating)}</div>
                  <p className="mt-1 text-xs font-semibold text-slate-700">R$ {doc.price.toFixed(2)}</p>
                </button>
              ))}
            </div>

            <button
              onClick={nextSlide}
              disabled={startIndex + itemsToShow >= doctors.length}
              className="p-2 disabled:opacity-30 hover:bg-white/10 rounded-full transition"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          </div>
        )}
      </div>
      {selectedDoctor ? (
        <DoctorModal doctor={selectedDoctor} onClose={() => setSelectedDoctor(null)} />
      ) : null}
    </section>
  );
}
