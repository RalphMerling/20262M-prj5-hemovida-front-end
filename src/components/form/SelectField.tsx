import { ChevronDown } from "lucide-react";
import { useId } from "react";
import type { SelectHTMLAttributes } from "react";

// "doador" = rótulo vinho (portal do doador). "admin" = rótulo azul (painel interno).
const corDoRotulo = { doador: "text-vermelho-2", admin: "text-azul-1" };

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  opcoes: string[];
  erro?: string;
  tema?: keyof typeof corDoRotulo;
}

export function SelectField({ label, opcoes, erro, tema = "doador", id, ...resto }: SelectFieldProps) {
  const idGerado = useId();
  const campoId = id ?? idGerado;

  return (
    <div className="flex w-full flex-col gap-1">
      <label htmlFor={campoId} className={`font-bold ${corDoRotulo[tema]}`}>
        {label}
      </label>

      {/* relative: serve de base para posicionar a setinha dentro do campo */}
      <div className="relative">
        <select
          id={campoId}
          aria-invalid={erro ? true : undefined}
          className={`w-full appearance-none rounded-lg border bg-card py-3 pl-3 pr-10 outline-none focus:ring-2 focus:ring-azul-3 ${
            erro ? "border-vermelho-1" : "border-preto"
          }`}
          {...resto}
        >
          <option value="">Selecione</option>
          {opcoes.map((opcao) => (
            <option key={opcao} value={opcao}>
              {opcao}
            </option>
          ))}
        </select>
        {/* pointer-events-none: o clique passa pela setinha e abre o select */}
        <ChevronDown size={18} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-preto" />
      </div>

      {erro && (
        <p role="alert" className="text-sm text-vermelho-1">
          {erro}
        </p>
      )}
    </div>
  );
}