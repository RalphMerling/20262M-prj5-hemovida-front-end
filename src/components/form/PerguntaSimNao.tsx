import { useId } from "react";

interface PerguntaSimNaoProps {
  numero: number;
  texto: string;
  valor: boolean | undefined; // true = Sim, false = Não, undefined = ainda não respondeu
  aoMudar: (resposta: boolean) => void;
  listrada?: boolean; // faixa azul clara (a tela alterna: sim, não, sim, não...)
  semResposta?: boolean; // marca a pergunta com uma borda vermelha (usado ao tentar avançar sem responder)
}

export function PerguntaSimNao({ numero, texto, valor, aoMudar, listrada = false, semResposta = false }: PerguntaSimNaoProps) {
  const id = useId();

  return (
    <div
      className={`flex items-center justify-between gap-6 border-l-4 px-6 py-4 ${
        semResposta ? "border-vermelho-1" : "border-transparent"
      } ${listrada ? "bg-azul-3/20" : "bg-card"}`}
    >
      <p id={id} className="text-sm font-medium">
        {numero}. {texto}
      </p>

      <div role="radiogroup" aria-labelledby={id} aria-invalid={semResposta || undefined} className="flex shrink-0 gap-5 text-sm">
        <label className="flex cursor-pointer items-center gap-2">
          <input type="radio" name={id} checked={valor === true} onChange={() => aoMudar(true)} className="h-4 w-4 accent-azul-2" />
          Sim
        </label>
        <label className="flex cursor-pointer items-center gap-2">
          <input type="radio" name={id} checked={valor === false} onChange={() => aoMudar(false)} className="h-4 w-4 accent-azul-2" />
          Não
        </label>
      </div>
    </div>
  );
}