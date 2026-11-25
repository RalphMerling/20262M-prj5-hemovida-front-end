import { useId } from "react";
import type { TextareaHTMLAttributes } from "react";

interface CampoJustificativaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "value" | "maxLength"> {
  label: string;
  value: string;
  maxLength: number;
  erro?: string;
}

// Campo de texto grande com contador de caracteres. Visual igual ao InputField (tema admin).
export function CampoJustificativa({ label, value, maxLength, erro, id, ...resto }: CampoJustificativaProps) {
  const idGerado = useId();
  const campoId = id ?? idGerado;

  return (
    <div className="flex w-full flex-col gap-1">
      <label htmlFor={campoId} className="text-sm font-bold text-azul-1">
        {label}
      </label>
      <textarea
        id={campoId}
        value={value}
        maxLength={maxLength}
        rows={4}
        aria-invalid={erro ? true : undefined}
        className={`w-full resize-none rounded-lg border bg-card px-3 py-2 text-sm outline-none placeholder:text-preto/40 focus:ring-2 focus:ring-azul-3 ${
          erro ? "border-vermelho-1" : "border-preto"
        }`}
        {...resto}
      />
      <div className="flex justify-between gap-2">
        {erro ? (
          <p role="alert" className="text-sm text-vermelho-1">
            {erro}
          </p>
        ) : (
          <span />
        )}
        <span className="text-xs text-preto/60">
          {value.length}/{maxLength} caracteres
        </span>
      </div>
    </div>
  );
}
