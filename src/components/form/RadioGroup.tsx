interface RadioGroupProps {
  label: string;
  name: string;
  opcoes: string[];
  valor: string;
  aoMudar: (novoValor: string) => void;
  erro?: string;
}

export function RadioGroup({ label, name, opcoes, valor, aoMudar, erro }: RadioGroupProps) {
  return (
    <fieldset className="flex flex-col gap-1">
      <legend className="font-bold text-vermelho-2">{label}</legend>
      <div className="flex flex-wrap gap-5 pt-1">
        {opcoes.map((opcao) => (
          <label key={opcao} className="flex cursor-pointer items-center gap-2">
            <input
              type="radio"
              name={name}
              value={opcao}
              checked={valor === opcao}
              onChange={() => aoMudar(opcao)}
              className="h-4 w-4 accent-vermelho-1"
            />
            {opcao}
          </label>
        ))}
      </div>
      {erro && (
        <p role="alert" className="text-sm text-vermelho-1">
          {erro}
        </p>
      )}
    </fieldset>
  );
}