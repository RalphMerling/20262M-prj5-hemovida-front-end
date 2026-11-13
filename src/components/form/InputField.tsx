import { useId } from "react";
import type { InputHTMLAttributes } from "react";

// "doador" = rótulo vinho (portal do doador). "admin" = rótulo azul (painel interno).
const corDoRotulo = {
  doador: "text-vermelho-2",
  admin: "text-azul-1",
};

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  erro?: string;
  tema?: keyof typeof corDoRotulo;
}

export function InputField({ label, erro, tema = "doador", id, className = "", ...resto }: InputFieldProps) {
  // useId cria um id único. Ele liga o <label> ao <input>: clicar no texto foca o campo.
  const idGerado = useId();
  const campoId = id ?? idGerado;

  return (
    <div className="flex w-full flex-col gap-1">
      <label htmlFor={campoId} className={`font-bold ${corDoRotulo[tema]}`}>
        {label}
      </label>
      <input
        id={campoId}
        aria-invalid={erro ? true : undefined}
        className={`w-full rounded-lg border bg-card px-3 py-3 outline-none placeholder:text-preto/40 focus:ring-2 focus:ring-azul-3 disabled:opacity-50 ${
          erro ? "border-vermelho-1" : "border-preto"
        } ${className}`}
        {...resto}
      />
      {erro && (
        <p role="alert" className="text-sm text-vermelho-1">
          {erro}
        </p>
      )}
    </div>
  );
}