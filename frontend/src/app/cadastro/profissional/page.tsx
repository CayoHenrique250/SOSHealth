"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Header from "@/src/components/Header";
import { Input } from "@/src/components/Input";
import { PasswordInput } from "@/src/components/PasswordInput";
import Image from "next/image";
import Footer from "@/src/components/Footer";
import { registerProfessional } from "@/src/services/api";

const profissionalSchema = z.object({
  name: z.string().min(3, "Nome muito curto"),
  councilNumber: z.string().min(4, "Informe o número do conselho profissional"),
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

type ProfissionalData = z.infer<typeof profissionalSchema>;

export default function CadastroProfissional() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm<ProfissionalData>({
    resolver: zodResolver(profissionalSchema),
  });

  const onSubmit = (data: ProfissionalData) => {
    registerProfessional({
      name: data.name,
      councilNumber: data.councilNumber,
      birthDate: data.birthDate,
      email: data.email,
      password: data.password,
      phone: data.phone,
      address: data.address,
    })
      .then(() => {
        toast.success("Cadastro profissional concluído com sucesso.");
        router.push("/login");
      })
      .catch((error) => {
        toast.error(error instanceof Error ? error.message : "Não foi possível concluir o cadastro.");
      });
  };

  return (
    <main className="min-h-screen flex flex-col bg-[#f3f5f5]">
      <Header />
      <section className="flex-1 flex flex-col md:flex-row-reverse items-center justify-center p-6 gap-12 max-w-6xl mx-auto w-full" aria-label="Cadastro profissional">
        <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
          <h2 className="text-2xl font-bold text-[#1e3e44] mb-6">Preencha os campos abaixo</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Input label="Nome :" register={register("name")} error={errors.name?.message} className="border-2 border-slate-800 font-semibold text-slate-900" />
            <Input
              label="Número do conselho profissional (CRM, CRP, COREN etc.) :"
              register={register("councilNumber")}
              error={errors.councilNumber?.message}
              placeholder="Ex.: CRM 12345-SP"
              className="border-2 border-slate-800 font-semibold text-slate-900"
            />

            <Input label="Data de nascimento :" type="date" register={register("birthDate")} error={errors.birthDate?.message} className="border-2 border-slate-800 font-semibold text-slate-900" />
            <Input label="E-mail :" type="email" register={register("email")} error={errors.email?.message} className="border-2 border-slate-800 font-semibold text-slate-900" />
            <Input label="Telefone :" register={register("phone")} error={errors.phone?.message} className="border-2 border-slate-800 font-semibold text-slate-900" />
            <Input label="Endereço :" register={register("address")} error={errors.address?.message} className="border-2 border-slate-800 font-semibold text-slate-900" />
            <PasswordInput label="Senha :" register={register("password")} error={errors.password?.message} autoComplete="new-password" inputClassName="border-2 border-slate-800 font-semibold text-slate-900" />
            <PasswordInput label="Confirme sua senha :" register={register("confirmPassword")} error={errors.confirmPassword?.message} autoComplete="new-password" inputClassName="border-2 border-slate-800 font-semibold text-slate-900" />
            
            <button type="submit" className="w-full bg-[#1e3e44] text-white font-bold py-3 rounded-full mt-4 hover:bg-[#152a2e] transition shadow-md">
              Cadastrar
            </button>
          </form>
        </div>

        <div className="hidden min-w-0 md:flex flex-col items-center md:-translate-x-8 lg:-translate-x-14 xl:-translate-x-20">
          <div className="relative mb-4 h-64 w-64 shrink-0 overflow-hidden rounded-full bg-[#2D545E] p-4 shadow-lg sm:h-72 sm:w-72">
            <Image
              src="/images/profissional.png"
              alt="Ilustração de médico com jaleco segurando um raio-X"
              fill
              className="object-contain object-bottom"
              sizes="288px"
            />
          </div>
          <p className="text-[#1e3e44] font-medium italic">Profissional</p>
        </div>
      </section>
      <Footer />
    </main>
  );
}