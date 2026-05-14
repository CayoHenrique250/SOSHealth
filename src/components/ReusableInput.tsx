import { InputHTMLAttributes } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

interface ReusableInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "name"> {
  label: string;
  error?: string;
  register: UseFormRegisterReturn;
  labelClassName?: string;
}

export function ReusableInput({ label, error, register, labelClassName, className, ...rest }: ReusableInputProps) {
  return (
    <div className="w-full mb-4">
      <label className={`block text-sm font-bold mb-1 ml-1 ${labelClassName ?? "text-[#1e3e44]"}`}>
        {label}
      </label>
      <input
        {...register}
        {...rest}
        className={`w-full p-2 rounded-lg border ${
          error ? "border-red-500" : "border-gray-300"
        } outline-none focus:ring-2 focus:ring-[#6ba2a6] transition-all ${className ?? ""}`}
      />
      {error && <span className="text-red-500 text-xs ml-1">{error}</span>}
    </div>
  );
}