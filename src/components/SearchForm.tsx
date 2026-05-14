"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { fetchLocations, fetchSpecialties } from "@/src/services/api";
import { useRouter } from "next/navigation";
import Link from "next/link";

const searchSchema = z.object({
  specialty: z.string().min(1, "Selecione uma especialidade"),
  location: z.string().min(1, "Selecione um local"),
});

type SearchFormData = z.infer<typeof searchSchema>;

const selectClass =
  "w-full rounded-lg border-2 border-slate-900 bg-white p-3 text-sm font-bold text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-[#1e3e44]";

export default function SearchForm() {
  const router = useRouter();
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);

  useEffect(() => {
    fetchSpecialties().then(setSpecialties).catch(() => toast.error("Erro ao carregar especialidades."));
    fetchLocations().then(setLocations).catch(() => toast.error("Erro ao carregar localizações."));
  }, []);

  const { register, handleSubmit, formState: { errors } } = useForm<SearchFormData>({
    resolver: zodResolver(searchSchema),
  });

  const onSubmit = (data: SearchFormData) => {
    toast.success(`Buscando profissionais de ${data.specialty} em ${data.location}.`);
    const query = new URLSearchParams({
      spec: data.specialty,
      loc: data.location,
    });
    router.push(`/paciente/busca?${query.toString()}`);
  };

  return (
    <section aria-label="Busca de profissionais" className="bg-[#f3f5f5] py-16 px-6 flex flex-col items-center justify-center">
      <h2 className="mb-8 text-center text-3xl font-bold text-[#1e3e44]">
        Realize sua consulta agora!
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-[#6ba2a6] p-8 rounded-2xl w-full max-w-4xl shadow-lg flex flex-col md:flex-row gap-6 items-start md:items-end justify-between"
      >
        <div className="flex-1 w-full">
          <label htmlFor="specialty" className="block text-white font-medium mb-2 text-sm">Especialidade</label>
          <select
            id="specialty"
            {...register("specialty")}
            className={selectClass}
          >
            <option value="">Especialidade</option>
            {specialties.map((spec) => (
              <option key={spec} value={spec}>{spec}</option>
            ))}
          </select>
          {errors.specialty && <span className="text-red-200 text-xs mt-1 block">{errors.specialty.message}</span>}
        </div>

        <div className="flex-1 w-full">
          <label htmlFor="location" className="block text-white font-medium mb-2 text-sm">Local</label>
          <select
            id="location"
            {...register("location")}
            className={selectClass}
          >
            <option value="">Local</option>
            {locations.map((loc) => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
          {errors.location && <span className="text-red-200 text-xs mt-1 block">{errors.location.message}</span>}
        </div>

        <button 
          type="submit"
          className="w-full md:w-auto bg-[#1e3e44] text-white font-bold px-8 py-3 rounded-lg hover:bg-opacity-90 transition shadow"
        >
          Buscar
        </button>
      </form>

      <Link
        href="/paciente/busca"
        className="mt-6 inline-flex items-center justify-center rounded-full border-2 border-[#1e3e44] bg-white px-6 py-2.5 text-sm font-bold text-[#1e3e44] shadow-sm transition hover:bg-[#1e3e44] hover:text-white"
      >
        Ver todos os profissionais
      </Link>
    </section>
  );
}