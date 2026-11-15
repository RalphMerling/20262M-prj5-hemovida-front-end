import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { DIASTOLICA, PESO_MINIMO_KG, SISTOLICA, formatarDecimal, hemoglobinaMinima, lerNumero, lerPressao } from "@/lib/triagem";
import type { Genero, PerguntaTriagem, ResultadoTriagem, SinaisVitais } from "@/models/triagem";

// Concordância do texto: "A paciente ... está apta" / "O paciente ... está apto".
const concordancia: Record<Genero, { artigo: string; apto: string; inapto: string }> = {
  Feminino: { artigo: "A paciente", apto: "apta", inapto: "inapta" },
  Masculino: { artigo: "O paciente", apto: "apto", inapto: "inapto" },
  Outros: { artigo: "O(a) paciente", apto: "apto(a)", inapto: "inapto(a)" },
};

const mostrar = (numero: number | null) => (numero === null ? "-" : formatarDecimal(numero));

interface LinhaResumoProps {
  ok: boolean;
  nome: string;
  valor: string;
  referencia: string;
  detalhes?: string[]; // frases pequenas embaixo (usado nas respostas "Sim")
}

// Uma linha do resumo: ícone redondo (check ou X), o que foi medido, o valor e a referência.
function LinhaResumo({ ok, nome, valor, referencia, detalhes }: LinhaResumoProps) {
  return (
    <li className="grid grid-cols-[auto_1fr_auto] items-center gap-x-4 gap-y-1 py-4">
      <span
        aria-hidden
        className={`flex h-8 w-8 items-center justify-center rounded-full ${
          ok ? "bg-green-50 text-green-700" : "bg-vermelho-1/10 text-vermelho-2"
        }`}
      >
        {ok ? <Check size={16} strokeWidth={3} /> : <X size={16} strokeWidth={3} />}
      </span>
      <div>
        <p className="text-sm text-preto/60">{nome}</p>
        <p className={`font-semibold ${ok ? "text-preto" : "text-vermelho-2"}`}>
          {valor}
          <span className="sr-only">{ok ? " (dentro da referência)" : " (fora da referência)"}</span>
        </p>
      </div>
      <p className="text-right text-sm text-preto/50">{referencia}</p>

      {detalhes && detalhes.length > 0 && (
        <ul className="col-start-2 col-end-4 space-y-1 text-sm text-vermelho-2">
          {detalhes.map((frase) => (
            <li key={frase}>{frase}</li>
          ))}
        </ul>
      )}
    </li>
  );
}

interface PassoResultadoProps {
  nome: string;
  genero: Genero;
  sinais: SinaisVitais;
  perguntas: PerguntaTriagem[];
  resultado: ResultadoTriagem;
  aoVoltar: () => void;
  aoFinalizar: () => void;
}

// Passo 3 da triagem: o veredito (apto ou inapto) e o resumo com tudo que foi preenchido.
export function PassoResultado({ nome, genero, sinais, perguntas, resultado, aoVoltar, aoFinalizar }: PassoResultadoProps) {
  const { apto, pesoOk, sistolicaOk, diastolicaOk, hemoglobinaOk, respostasSim } = resultado;
  const palavras = concordancia[genero];

  const peso = lerNumero(sinais.peso);
  const pressao = lerPressao(sinais.pressao);
  const hemoglobina = lerNumero(sinais.hemoglobina);

  // O número da pergunta na tela (a primeira é 1), para o resumo dizer qual foi o "Sim".
  const numeroDaPergunta = (pergunta: PerguntaTriagem) => perguntas.findIndex((p) => p.id === pergunta.id) + 1;

  // Os motivos da inaptidão, em frases curtas. Só são usados quando o resultado é inapto.
  const motivos: string[] = [];
  if (!pesoOk) motivos.push("peso abaixo do mínimo");
  if (!sistolicaOk) motivos.push("pressão sistólica fora da faixa");
  if (!diastolicaOk) motivos.push("pressão diastólica fora da faixa");
  if (!hemoglobinaOk) motivos.push("hemoglobina abaixo do mínimo");
  respostasSim.forEach((pergunta) => motivos.push(`resposta "Sim" na pergunta ${numeroDaPergunta(pergunta)}`));

  const numerosDosSim = respostasSim.map(numeroDaPergunta).join(", ");
  const valorQuestionario =
    respostasSim.length === 0
      ? `${perguntas.length} respostas, nenhum fator de risco`
      : respostasSim.length === 1
        ? `"Sim" na pergunta ${numerosDosSim}`
        : `"Sim" nas perguntas ${numerosDosSim}`;

  return (
    <Card>
      {/* O veredito, em destaque, com um fundo suave da cor do resultado. */}
      <div role="status" className={`rounded-2xl px-6 py-10 text-center ${apto ? "bg-green-50" : "bg-vermelho-1/5"}`}>
        <span
          className={`mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full text-branco ring-8 ${
            apto ? "bg-green-600 ring-green-100" : "bg-vermelho-1 ring-vermelho-1/15"
          }`}
        >
          {apto ? <Check size={44} strokeWidth={3} /> : <X size={44} strokeWidth={3} />}
        </span>
        <h2 className="text-3xl text-preto">{apto ? "Apto para doação" : "Inapto para doação"}</h2>
        <p className="mx-auto mt-2 max-w-md text-preto/70">
          {apto
            ? `${palavras.artigo} ${nome} está ${palavras.apto} para doação.`
            : `${palavras.artigo} ${nome} está temporariamente ${palavras.inapto} para doação.`}
        </p>
        {!apto && <p className="mx-auto mt-2 max-w-md text-sm text-vermelho-2">Motivo: {motivos.join("; ")}.</p>}
      </div>

      {/* O relatório clínico: uma linha para cada coisa conferida. */}
      <h3 className="mb-1 mt-8 text-xl text-azul-1">Resumo da triagem</h3>
      <ul className="divide-y divide-preto/10">
        <LinhaResumo ok={pesoOk} nome="Peso" valor={`${mostrar(peso)} kg`} referencia={`Mínimo ${PESO_MINIMO_KG} kg`} />
        <LinhaResumo
          ok={sistolicaOk}
          nome="Pressão sistólica"
          valor={`${pressao?.sistolica ?? "-"} mmHg`}
          referencia={`${SISTOLICA.min} a ${SISTOLICA.max} mmHg`}
        />
        <LinhaResumo
          ok={diastolicaOk}
          nome="Pressão diastólica"
          valor={`${pressao?.diastolica ?? "-"} mmHg`}
          referencia={`${DIASTOLICA.min} a ${DIASTOLICA.max} mmHg`}
        />
        <LinhaResumo
          ok={hemoglobinaOk}
          nome="Hemoglobina"
          valor={`${mostrar(hemoglobina)} g/dL`}
          referencia={`Mínimo ${formatarDecimal(hemoglobinaMinima(genero))} g/dL`}
        />
        <LinhaResumo
          ok={respostasSim.length === 0}
          nome="Questionário"
          valor={valorQuestionario}
          referencia="Nenhum fator de risco"
          detalhes={respostasSim.map((pergunta) => `${numeroDaPergunta(pergunta)}. ${pergunta.descricao}`)}
        />
      </ul>

      <div className="mt-8 flex items-center justify-between gap-4 border-t border-preto/10 pt-6">
        <Button variante="voltar" onClick={aoVoltar}>
          Voltar
        </Button>
        <Button onClick={aoFinalizar}>Finalizar triagem</Button>
      </div>
    </Card>
  );
}