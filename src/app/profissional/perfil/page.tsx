"use client";

import Header from "@/src/components/Header";
import Footer from "@/src/components/Footer";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Camera } from "lucide-react";
import { ReusableInput } from "@/src/components/ReusableInput";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchProfessionalProfile, updateProfessionalProfile } from "@/src/services/api";
import { useAuth } from "@/src/context/AuthContext";

type PerfilFormData = {
  nome: string;
  councilNumber: string;
  nascimento: string;
  email: string;
  telefone: string;
  endereco: string;
  resumo: string;
  escolaridade: string;
  experiencia: string;
  formacoes: string;
};

const labelDark = "!text-white";
const textareaClass =
  "w-full min-h-[120px] rounded-lg border-2 border-white/30 bg-white/10 px-3 py-2 text-sm font-medium text-white placeholder:text-white/50 focus:border-white focus:outline-none focus:ring-2 focus:ring-[#6ba2a6]";

export default function PerfilProfissional() {
  const { updateSessionUser } = useAuth();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<"pessoais" | "curriculo">("pessoais");
  const { data } = useQuery({
    queryKey: ["professional-profile"],
    queryFn: fetchProfessionalProfile,
  });
  const { register, handleSubmit, reset } = useForm<PerfilFormData>({
    defaultValues: {
      nome: "",
      councilNumber: "",
      nascimento: "",
      email: "",
      telefone: "",
      endereco: "",
      resumo: "",
      escolaridade: "",
      experiencia: "",
      formacoes: "",
    },
  });

  useEffect(() => {
    if (!data) {
      return;
    }
    reset({
      nome: data.personal.name,
      councilNumber: data.personal.councilNumber,
      nascimento: data.personal.birthDate,
      email: data.personal.email,
      telefone: data.personal.phone,
      endereco: data.personal.address,
      resumo: data.curriculum.summary,
      escolaridade: data.curriculum.education,
      experiencia: data.curriculum.experience,
      formacoes: data.curriculum.certifications,
    });
  }, [data, reset]);

  const mutation = useMutation({
    mutationFn: updateProfessionalProfile,
    onSuccess: () => {
      toast.success("Perfil profissional atualizado.");
      queryClient.invalidateQueries({ queryKey: ["professional-profile"] });
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Falha ao atualizar perfil."),
  });

  const avatarMutation = useMutation({
    mutationFn: (avatar: string) => updateProfessionalProfile({ personal: { avatar } }),
    onSuccess: (profile) => {
      toast.success("Foto de perfil atualizada.");
      queryClient.invalidateQueries({ queryKey: ["professional-profile"] });
      updateSessionUser({ avatar: profile.personal.avatar });
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Erro ao enviar imagem."),
  });

  const onAvatarFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file?.type.startsWith("image/")) {
      toast.error("Selecione um arquivo de imagem.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") {
        avatarMutation.mutate(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = (formData: PerfilFormData) => {
    mutation.mutate({
      personal: {
        name: formData.nome,
        councilNumber: formData.councilNumber,
        birthDate: formData.nascimento,
        email: formData.email,
        phone: formData.telefone,
        address: formData.endereco,
      },
      curriculum: {
        summary: formData.resumo,
        education: formData.escolaridade,
        experience: formData.experiencia,
        certifications: formData.formacoes,
      },
    });
  };

  return (
    <main className="flex min-h-screen flex-col bg-[#f3f5f5]">
      <Header />

      <section className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-start px-6 py-10">
        <h1 className="mb-8 text-3xl font-bold text-[#1e3e44]">Perfil Profissional</h1>

        <div className="mb-6 flex gap-4 border-b border-slate-200 pb-2">
          <button
            type="button"
            onClick={() => setActiveTab("pessoais")}
            className={`pb-1 text-lg font-bold ${activeTab === "pessoais" ? "border-b-2 border-[#1e3e44] text-[#1e3e44]" : "text-slate-400"}`}
          >
            Informações Pessoais
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("curriculo")}
            className={`pb-1 text-lg font-bold ${activeTab === "curriculo" ? "border-b-2 border-[#1e3e44] text-[#1e3e44]" : "text-slate-400"}`}
          >
            Currículo
          </button>
        </div>

        <div className="grid w-full items-start gap-10 lg:grid-cols-[1fr_minmax(280px,360px)]">
          <form onSubmit={handleSubmit(onSubmit)} className="rounded-3xl bg-[#1e3e44] p-6 shadow-md">
            {activeTab === "pessoais" ? (
              <div className="space-y-1">
                <ReusableInput label="Nome completo :" register={register("nome")} className="border-white/30 bg-white/10 text-white placeholder:text-white/50" labelClassName={labelDark} />
                <ReusableInput
                  label="Número do conselho profissional (CRM, CRP, COREN etc.) :"
                  register={register("councilNumber")}
                  className="border-white/30 bg-white/10 text-white placeholder:text-white/50"
                  labelClassName={labelDark}
                  placeholder="Ex.: CRM 12345-SP, CRP 06/98765"
                />
                <ReusableInput label="Data de nascimento :" register={register("nascimento")} type="date" className="border-white/30 bg-white/10 text-white" labelClassName={labelDark} />
                <ReusableInput label="E-mail :" register={register("email")} type="email" className="border-white/30 bg-white/10 text-white placeholder:text-white/50" labelClassName={labelDark} />
                <ReusableInput label="Telefone :" register={register("telefone")} className="border-white/30 bg-white/10 text-white placeholder:text-white/50" labelClassName={labelDark} />
                <ReusableInput label="Endereço :" register={register("endereco")} className="border-white/30 bg-white/10 text-white placeholder:text-white/50" labelClassName={labelDark} />
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className={`mb-1 ml-1 block text-sm font-bold ${labelDark}`}>Resumo profissional</label>
                  <p className="mb-2 ml-1 text-xs text-white/70">Apresentação geral: linha de atuação, público e diferenciais.</p>
                  <textarea {...register("resumo")} className={textareaClass} rows={5} />
                </div>
                <div>
                  <label className={`mb-1 ml-1 block text-sm font-bold ${labelDark}`}>Escolaridade e formação acadêmica</label>
                  <p className="mb-2 ml-1 text-xs text-white/70">Graduação, residência, mestrado/doutorado (instituição e ano).</p>
                  <textarea {...register("escolaridade")} className={textareaClass} rows={6} />
                </div>
                <div>
                  <label className={`mb-1 ml-1 block text-sm font-bold ${labelDark}`}>Experiência profissional</label>
                  <p className="mb-2 ml-1 text-xs text-white/70">Locais de trabalho, cargos, períodos e principais atividades.</p>
                  <textarea {...register("experiencia")} className={textareaClass} rows={6} />
                </div>
                <div>
                  <label className={`mb-1 ml-1 block text-sm font-bold ${labelDark}`}>Certificações, cursos e publicações</label>
                  <p className="mb-2 ml-1 text-xs text-white/70">Títulos de especialista, cursos livres, idiomas, artigos.</p>
                  <textarea {...register("formacoes")} className={textareaClass} rows={5} />
                </div>
              </div>
            )}

            <div className="mt-6 flex justify-center">
              <button type="submit" className="rounded-full bg-[#6ba2a6] px-10 py-2.5 text-sm font-bold text-white shadow transition hover:bg-[#5a8d91]">
                Salvar alterações
              </button>
            </div>
          </form>

          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={onAvatarFile} />
            <img src={data?.personal.avatar} alt="Foto do profissional" className="h-80 w-full rounded-2xl object-cover lg:h-96" />
            <button
              type="button"
              disabled={avatarMutation.isPending}
              onClick={() => fileInputRef.current?.click()}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-100 py-3 text-sm font-semibold text-slate-800 disabled:opacity-60"
            >
              <Camera className="h-4 w-4" /> Alterar imagem
            </button>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
