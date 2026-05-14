"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import type { UseFormRegisterReturn } from "react-hook-form";

interface PasswordInputProps {
  label: string;
  error?: string;
  register: UseFormRegisterReturn;
  placeholder?: string;
  autoComplete?: string;
  labelClassName?: string;
  inputClassName?: string;
}

export function PasswordInput({
  label,
  error,
  register,
  placeholder,
  labelClassName = "text-[#1e3e44]",
  inputClassName = "",
  autoComplete = "current-password",
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);
  const { ref, ...reg } = register;

  return (
    <div className="mb-4 w-full">
      <label className={`mb-1 ml-1 block text-sm font-bold ${labelClassName}`}>{label}</label>
      <div className="relative">
        <input
          ref={ref}
          {...reg}
          type={visible ? "text" : "password"}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={`w-full rounded-lg border-2 border-slate-800 p-2 pr-10 font-semibold text-slate-900 outline-none transition-all focus:ring-2 focus:ring-[#6ba2a6] ${inputClassName} ${
            error ? "!border-red-500" : ""
          }`}
        />
        <button
          type="button"
          tabIndex={0}
          onClick={() => setVisible((v) => !v)}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          aria-label={visible ? "Ocultar senha" : "Mostrar senha"}
        >
          {visible ? <EyeOff className="h-4 w-4" aria-hidden /> : <Eye className="h-4 w-4" aria-hidden />}
        </button>
      </div>
      {error ? <span className="ml-1 mt-1 block text-xs text-red-500">{error}</span> : null}
    </div>
  );
}
