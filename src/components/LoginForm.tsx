"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import { mockLogin } from "@/src/services/api";
import { ReusableInput } from "@/src/components/ReusableInput";
import { PasswordInput } from "@/src/components/PasswordInput";
import Link from "next/link";
import { LoaderCircle } from "lucide-react";
import { useAuth } from "@/src/context/AuthContext";

const loginSchema = z.object({
  email: z.string().min(1, "E-mail é obrigatório").email("E-mail inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const { login } = useAuth();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: LoginFormData) => mockLogin(data),
    retry: false,
    onSuccess: (response) => {
      toast.success("Bem-vindo ao SOSHealth!");
      login(response.user);
    },
    onError: (error) => {
      toast.error(`Erro ao entrar: ${error instanceof Error ? error.message : "Credenciais inválidas"}`);
    },
  });

  const onSubmit = (data: LoginFormData) => {
    mutate(data);
  };

  return (
    <div className="w-full max-w-sm bg-white p-8 rounded-3xl shadow-xl border border-gray-100 flex flex-col">
      <div className="mb-6">
        <h2 className="text-[#1e3e44] font-bold text-xl">Login</h2>
        <p className="text-gray-400 text-xs">Acesse sua conta para continuar</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 gap-2">
        <ReusableInput 
          label="E-mail" 
          register={register("email")} 
          error={errors.email?.message} 
          placeholder="ex: paciente@gmail.com" 
          type="email"
          labelClassName="text-slate-500 font-semibold"
          className="border-gray-300 bg-white text-slate-900 placeholder:text-slate-400"
          autoComplete="email"
        />
        
        <PasswordInput
          label="Senha"
          register={register("password")}
          error={errors.password?.message}
          placeholder="••••••••"
          autoComplete="current-password"
          labelClassName="text-slate-500 font-semibold"
        />
        
        <Link href="#" className="text-xs text-[#1e3e44]/80 text-right -mt-1 hover:underline">
          Esqueceu sua senha?
        </Link>
        
        <button 
          type="submit" 
          disabled={isPending}
          className="w-full bg-[#1e3e44] text-white font-bold px-8 py-3 rounded-full hover:bg-opacity-90 transition shadow mt-4 flex items-center justify-center gap-2"
        >
          {isPending && <LoaderCircle className="w-5 h-5 animate-spin" />}
          Entrar
        </button>
        
        <div className="mt-6 pt-6 border-t border-gray-50">
          <Link href="/cadastro" className="text-xs text-[#1e3e44]/80 text-center block hover:underline">
            Não possui cadastro? <span className="font-semibold text-[#1e3e44]">Cadastre-se!</span>
          </Link>
        </div>
      </form>

      <div className="mt-4 p-2 bg-gray-50 rounded-lg text-[10px] text-gray-400">
        <p><strong>Dica de teste:</strong></p>
        <p>Medico: user@gmail.com | senha123</p>
        <p>Paciente: paciente@gmail.com | senha123</p>
      </div>
    </div>
  );
}