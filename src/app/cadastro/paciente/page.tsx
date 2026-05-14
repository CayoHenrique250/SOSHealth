"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Header from "@/src/components/Header";
import { Input } from "@/src/components/Input";
import { PasswordInput } from "@/src/components/PasswordInput";
import { UserCircle } from "lucide-react";
import Footer from "@/src/components/Footer";
import { registerPatient } from "@/src/services/api";

const pacienteSchema = z.object({
  name: z.string().min(3, "Nome muito curto"),
  cpf: z.string().length(11, "CPF deve ter 11 números"),
  birthDate: z.string().min(1, "Data obrigatória"),
  email: z.string().email("E-mail inválido"),
  phone: z.string().min(10, "Telefone inválido"),
  address: z.string().min(5, "Endereço incompleto"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

type PacienteData = z.infer<typeof pacienteSchema>;

export default function CadastroPaciente() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm<PacienteData>({
    resolver: zodResolver(pacienteSchema),
  });

  const onSubmit = (data: PacienteData) => {
    registerPatient({
      name: data.name,
      cpf: data.cpf,
      birthDate: data.birthDate,
      email: data.email,
      password: data.password,
      phone: data.phone,
      address: data.address,
    })
      .then(() => {
        toast.success("Cadastro de paciente realizado com sucesso!");
        router.push("/login");
      })
      .catch((error) => {
        toast.error(error instanceof Error ? error.message : "Não foi possível concluir o cadastro.");
      });
  };

  return (
    <main className="min-h-screen flex flex-col bg-[#f3f5f5]">
      <Header />
      <section className="flex-1 flex flex-col md:flex-row items-center justify-center p-6 gap-12 max-w-6xl mx-auto w-full" aria-label="Cadastro de paciente">
        <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
          <h2 className="text-2xl font-bold text-[#1e3e44] mb-6">Preencha os campos abaixo</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Input label="Nome :" register={register("name")} error={errors.name?.message} placeholder="Nome completo" className="border-2 border-slate-800 font-semibold text-slate-900" />
            <Input label="CPF :" register={register("cpf")} error={errors.cpf?.message} placeholder="Somente números" className="border-2 border-slate-800 font-semibold text-slate-900" />
            <Input label="Data de nascimento :" type="date" register={register("birthDate")} error={errors.birthDate?.message} className="border-2 border-slate-800 font-semibold text-slate-900" />
            <Input label="E-mail :" type="email" register={register("email")} error={errors.email?.message} className="border-2 border-slate-800 font-semibold text-slate-900" />
            <Input label="Telefone :" register={register("phone")} error={errors.phone?.message} className="border-2 border-slate-800 font-semibold text-slate-900" />
            <Input label="Endereço :" register={register("address")} error={errors.address?.message} className="border-2 border-slate-800 font-semibold text-slate-900" />
            <PasswordInput label="Senha :" register={register("password")} error={errors.password?.message} autoComplete="new-password" inputClassName="border-2 border-slate-800" />
            <PasswordInput label="Confirme sua senha :" register={register("confirmPassword")} error={errors.confirmPassword?.message} autoComplete="new-password" inputClassName="border-2 border-slate-800" />
            
            <button type="submit" className="w-full bg-[#6ba2a6] text-white font-bold py-3 rounded-full mt-4 hover:bg-[#5a8d91] transition shadow-md">
              Cadastrar
            </button>
          </form>
        </div>

        <div className="hidden md:flex flex-col items-center">
          <div className="bg-[#6ba2a6] p-12 rounded-full mb-4">
            <UserCircle className="w-48 h-48 text-white" />
          </div>
          <p className="text-[#1e3e44] font-medium italic">Paciente</p>
        </div>
      </section>
      <Footer />
    </main>
  );
}