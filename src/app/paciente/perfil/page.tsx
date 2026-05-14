"use client";

import Header from "@/src/components/Header";
import Footer from "@/src/components/Footer";
import { useEffect, useRef, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import { Camera } from "lucide-react";
import { ReusableInput } from "@/src/components/ReusableInput";
import { PasswordInput } from "@/src/components/PasswordInput";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchPatientProfile, updatePatientProfile, type PatientMedicalProfile } from "@/src/services/api";
import { useAuth } from "@/src/context/AuthContext";

type PersonalFormValues = {
  nome: string;
  cpf: string;
  nascimento: string;
  email: string;
  telefone: string;
  endereco: string;
  senha: string;
};

export default function PerfilPaciente() {
  const { updateSessionUser } = useAuth();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<"pessoais" | "medicas">("pessoais");
  const [editingMedical, setEditingMedical] = useState(false);

  const { data } = useQuery({
    queryKey: ["patient-profile"],
    queryFn: fetchPatientProfile,
  });

  const { register, handleSubmit, reset } = useForm<PersonalFormValues>({
    defaultValues: {
      nome: "",
      cpf: "",
      nascimento: "",
      email: "",
      telefone: "",
      endereco: "",
      senha: "••••••••",
    },
  });

  const medicalForm = useForm<PatientMedicalProfile>();

  useEffect(() => {
    if (!data) {
      return;
    }
    reset({
      nome: data.personal.name,
      cpf: data.personal.cpf,
      nascimento: data.personal.birthDate,
      email: data.personal.email,
      telefone: data.personal.phone,
      endereco: data.personal.address,
      senha: "••••••••",
    });
    medicalForm.reset(data.medical);
  }, [data, reset, medicalForm]);

  const personalMutation = useMutation({
    mutationFn: updatePatientProfile,
    onSuccess: () => {
      toast.success("Dados pessoais atualizados.");
      queryClient.invalidateQueries({ queryKey: ["patient-profile"] });
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Erro ao atualizar perfil."),
  });

  const avatarMutation = useMutation({
    mutationFn: (avatar: string) => updatePatientProfile({ personal: { avatar } }),
    onSuccess: (profile) => {
      toast.success("Foto de perfil atualizada.");
      queryClient.invalidateQueries({ queryKey: ["patient-profile"] });
      updateSessionUser({ avatar: profile.personal.avatar });
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Erro ao enviar imagem."),
  });

  const medicalMutation = useMutation({
    mutationFn: updatePatientProfile,
    onSuccess: () => {
      toast.success("Informações médicas salvas com sucesso.");
      setEditingMedical(false);
      queryClient.invalidateQueries({ queryKey: ["patient-profile"] });
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Erro ao salvar informações médicas."),
  });

  const onSubmitPersonal: SubmitHandler<PersonalFormValues> = (formData) => {
    personalMutation.mutate({
      personal: {
        name: formData.nome,
        cpf: formData.cpf,
        birthDate: formData.nascimento,
        email: formData.email,
        phone: formData.telefone,
        address: formData.endereco,
      },
    });
  };

  const onSubmitMedical = medicalForm.handleSubmit((medical) => {
    medicalMutation.mutate({ medical });
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

  const bmi = data ? data.medical.weightKg / (data.medical.heightM * data.medical.heightM) : 0;

  const fieldClass =
    "mt-1 w-full rounded-lg border-2 border-slate-800 bg-white px-3 py-2 text-sm font-medium text-slate-900 placeholder:text-slate-500 focus:border-[#1e3e44] focus:outline-none focus:ring-2 focus:ring-[#6ba2a6]";

  const readBlock = (label: string, value: string) => (
    <div className="mb-5 border-b border-slate-100 pb-4 last:border-0">
      <h4 className="text-sm font-bold text-slate-900">{label}</h4>
      <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-800">{value || "—"}</p>
    </div>
  );

  return (
    <main className="flex min-h-screen flex-col bg-[#f3f5f5]">
      <Header />

      <section className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-start px-6 py-10">
        <h1 className="mb-4 text-3xl font-bold text-[#1e3e44]">Perfil</h1>

        <div className="mb-8 flex w-full gap-4 border-b border-gray-200 pb-2">
          <button
            type="button"
            onClick={() => setActiveTab("pessoais")}
            className={`pb-1 text-lg font-bold transition border-b-2 -mb-[9px] ${
              activeTab === "pessoais" ? "border-[#1e3e44] text-[#1e3e44]" : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            Informações Pessoais
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("medicas")}
            className={`pb-1 text-lg font-bold transition border-b-2 -mb-[9px] ${
              activeTab === "medicas" ? "border-[#1e3e44] text-[#1e3e44]" : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            Informações médicas
          </button>
        </div>

        {activeTab === "pessoais" ? (
          <div className="grid w-full animate-[fadeIn_0.3s_ease] grid-cols-1 items-start gap-12 md:grid-cols-2">
            <form onSubmit={handleSubmit(onSubmitPersonal)} className="flex w-full max-w-md flex-col gap-1 rounded-3xl bg-[#6ba2a6] p-6 shadow-md">
              <ReusableInput label="Nome :" register={register("nome")} labelClassName="text-white" className="border-2 border-white/40 bg-white text-slate-900" />
              <ReusableInput label="CPF :" register={register("cpf")} labelClassName="text-white" className="border-2 border-white/40 bg-white text-slate-900" />
              <ReusableInput label="Data de nascimento :" register={register("nascimento")} labelClassName="text-white" className="border-2 border-white/40 bg-white text-slate-900" />
              <ReusableInput label="E-mail :" register={register("email")} labelClassName="text-white" className="border-2 border-white/40 bg-white text-slate-900" />
              <ReusableInput label="Telefone :" register={register("telefone")} labelClassName="text-white" className="border-2 border-white/40 bg-white text-slate-900" />
              <ReusableInput label="Endereço :" register={register("endereco")} labelClassName="text-white" className="border-2 border-white/40 bg-white text-slate-900" />
              <PasswordInput label="Senha :" register={register("senha")} autoComplete="new-password" labelClassName="text-white" inputClassName="border-2 border-white/40 bg-white text-slate-900" />

              <div className="mt-3 flex justify-center">
                <button
                  type="submit"
                  className="rounded-full bg-[#1a353a] px-10 py-2.5 text-sm font-bold text-white shadow transition hover:bg-[#112427]"
                >
                  Salvar
                </button>
              </div>
            </form>

            <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={onAvatarFile} />
              <img src={data?.personal.avatar} alt="Foto do paciente" className="h-72 w-full rounded-2xl object-cover" />
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
        ) : (
          <div className="w-full max-w-3xl animate-[fadeIn_0.3s_ease] rounded-3xl border-2 border-slate-200 bg-white p-8 shadow-sm">
            <div className="mb-6 flex flex-col gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="text-lg font-bold text-[#1e3e44]">Anamnese e histórico de saúde</h3>
              {!editingMedical ? (
                <button
                  type="button"
                  onClick={() => setEditingMedical(true)}
                  className="rounded-full bg-[#1e3e44] px-5 py-2 text-sm font-bold text-white shadow hover:bg-[#152a2e]"
                >
                  Alterar informações
                </button>
              ) : (
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingMedical(false);
                      if (data) {
                        medicalForm.reset(data.medical);
                      }
                    }}
                    className="rounded-full border-2 border-slate-700 px-4 py-2 text-sm font-bold text-slate-800"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    form="medical-form"
                    disabled={medicalMutation.isPending}
                    className="rounded-full bg-[#6ba2a6] px-5 py-2 text-sm font-bold text-white shadow hover:bg-[#5a8d91]"
                  >
                    Salvar
                  </button>
                </div>
              )}
            </div>

            {!editingMedical && data ? (
              <div>
                {readBlock("Queixa principal", data.medical.queixaPrincipal)}
                {readBlock("HDA — história da doença atual", data.medical.hda)}
                {readBlock("HPP / HF — antecedentes pessoais e familiares", data.medical.hppHf)}
                {readBlock("Hábitos de vida", data.medical.habitos)}
                {readBlock("Medicamentos em uso", data.medical.medicamentos)}
                {readBlock("Alergias", data.medical.alergias)}
                {readBlock("Cirurgias e internações prévias", data.medical.cirurgiasPrevias)}
                {readBlock("Vacinação", data.medical.vacinacao)}
                {readBlock("Observações gerais", data.medical.observacoes)}
                <div className="mb-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Peso</h4>
                    <p className="mt-1 text-lg font-semibold text-slate-800">{data.medical.weightKg} kg</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Altura</h4>
                    <p className="mt-1 text-lg font-semibold text-slate-800">{data.medical.heightM} m</p>
                  </div>
                </div>
                <div className="rounded-xl border-2 border-slate-800 bg-slate-50 p-4">
                  <p className="text-sm font-bold text-slate-900">IMC</p>
                  <p className="mt-1 text-2xl font-black text-[#1e3e44]">{bmi.toFixed(2)}</p>
                </div>
              </div>
            ) : (
              <form id="medical-form" onSubmit={onSubmitMedical} className="flex flex-col gap-1">
                <div className="mb-4">
                  <label className="text-sm font-bold text-slate-900" htmlFor="queixaPrincipal">
                    Queixa principal
                  </label>
                  <textarea {...medicalForm.register("queixaPrincipal")} id="queixaPrincipal" rows={4} className={`${fieldClass} resize-y`} />
                </div>
                <div className="mb-4">
                  <label className="text-sm font-bold text-slate-900" htmlFor="hda">
                    HDA — história da doença atual
                  </label>
                  <textarea {...medicalForm.register("hda")} id="hda" rows={4} className={`${fieldClass} resize-y`} />
                </div>
                <div className="mb-4">
                  <label className="text-sm font-bold text-slate-900" htmlFor="hppHf">
                    HPP / HF
                  </label>
                  <textarea {...medicalForm.register("hppHf")} id="hppHf" rows={3} className={`${fieldClass} resize-y`} />
                </div>
                <div className="mb-4">
                  <label className="text-sm font-bold text-slate-900" htmlFor="habitos">
                    Hábitos de vida
                  </label>
                  <textarea {...medicalForm.register("habitos")} id="habitos" rows={3} className={`${fieldClass} resize-y`} />
                </div>
                <div className="mb-4">
                  <label className="text-sm font-bold text-slate-900" htmlFor="medicamentos">
                    Medicamentos em uso
                  </label>
                  <textarea {...medicalForm.register("medicamentos")} id="medicamentos" rows={3} className={`${fieldClass} resize-y`} />
                </div>
                <div className="mb-4">
                  <label className="text-sm font-bold text-slate-900" htmlFor="alergias">
                    Alergias
                  </label>
                  <textarea {...medicalForm.register("alergias")} id="alergias" rows={2} className={`${fieldClass} resize-y`} />
                </div>
                <div className="mb-4">
                  <label className="text-sm font-bold text-slate-900" htmlFor="cirurgiasPrevias">
                    Cirurgias e internações prévias
                  </label>
                  <textarea {...medicalForm.register("cirurgiasPrevias")} id="cirurgiasPrevias" rows={2} className={`${fieldClass} resize-y`} />
                </div>
                <div className="mb-4">
                  <label className="text-sm font-bold text-slate-900" htmlFor="vacinacao">
                    Vacinação
                  </label>
                  <textarea {...medicalForm.register("vacinacao")} id="vacinacao" rows={2} className={`${fieldClass} resize-y`} />
                </div>
                <div className="mb-4">
                  <label className="text-sm font-bold text-slate-900" htmlFor="observacoes">
                    Observações gerais
                  </label>
                  <textarea {...medicalForm.register("observacoes")} id="observacoes" rows={3} className={`${fieldClass} resize-y`} />
                </div>

                <div className="mt-2 grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="weightKg" className="text-sm font-bold text-slate-900">
                      Peso (kg)
                    </label>
                    <input
                      {...medicalForm.register("weightKg", { valueAsNumber: true })}
                      id="weightKg"
                      type="number"
                      step="0.1"
                      className={`${fieldClass} mt-1`}
                    />
                  </div>
                  <div>
                    <label htmlFor="heightM" className="text-sm font-bold text-slate-900">
                      Altura (m)
                    </label>
                    <input
                      {...medicalForm.register("heightM", { valueAsNumber: true })}
                      id="heightM"
                      type="number"
                      step="0.01"
                      className={`${fieldClass} mt-1`}
                    />
                  </div>
                </div>

                <div className="mt-6 rounded-xl border-2 border-slate-800 bg-slate-50 p-4">
                  <p className="text-sm font-bold text-slate-900">Pré-visualização do IMC</p>
                  <p className="mt-1 text-2xl font-black text-[#1e3e44]">
                    {(() => {
                      const w = medicalForm.watch("weightKg");
                      const h = medicalForm.watch("heightM");
                      if (typeof w === "number" && typeof h === "number" && h > 0) {
                        return (w / (h * h)).toFixed(2);
                      }
                      return "—";
                    })()}
                  </p>
                </div>
              </form>
            )}
          </div>
        )}
      </section>
      <Footer />
    </main>
  );
}
