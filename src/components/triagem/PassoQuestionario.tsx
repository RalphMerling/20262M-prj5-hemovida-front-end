"use client";

import { useState } from "react";
import { PerguntaSimNao } from "@/components/form/PerguntaSimNao";
import { Button } from "@/components/ui/Button";
import type { PerguntaTriagem, Respostas } from "@/models/triagem";

interface PassoQuestionarioProps {
  perguntas: PerguntaTriagem[];
  respostas: Respostas;
  aoResponder: (perguntaId: number, resposta: boolean) => void;
  aoVoltar: () => void;
  aoProximo: () => void;
}

// Passo 2 da triagem: o enfermeiro marca Sim ou Não para cada pergunta.
export function PassoQuestionario({ perguntas, respostas, aoResponder, aoVoltar, aoProximo }: PassoQuestionarioProps) {
  const [tentouAvancar, setTentouAvancar] = useState(false);

  const respondidas = perguntas.filter((pergunta) => respostas[pergunta.id] !== undefined).length;
  const faltando = respondidas < perguntas.length;

  function avancar() {
    if (faltando) {
      setTentouAvancar(true); // marca em vermelho as perguntas que faltam
      return;
    }
    aoProximo();
  }

  return (
    <div className="overflow-hidden rounded-xl bg-card shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4 px-8 py-6">
        <div>
          <h2 className="text-2xl text-azul-1">Questionário</h2>
          <p className="mt-1 text-preto/60">Marque Sim ou Não para cada pergunta.</p>
        </div>
        <p className="rounded-full bg-azul-3/40 px-3 py-1 text-sm font-semibold text-azul-1">
          {respondidas} de {perguntas.length} respondidas
        </p>
      </div>

      <div>
        {perguntas.map((pergunta, i) => (
          <PerguntaSimNao
            key={pergunta.id}
            numero={i + 1}
            texto={pergunta.descricao}
            valor={respostas[pergunta.id]}
            aoMudar={(resposta) => aoResponder(pergunta.id, resposta)}
            listrada={i % 2 === 0}
            semResposta={tentouAvancar && respostas[pergunta.id] === undefined}
          />
        ))}
      </div>

      <div className="px-8 py-6">
        {tentouAvancar && faltando && (
          <p role="alert" className="mb-4 text-center text-sm text-vermelho-1">
            Responda todas as perguntas para continuar.
          </p>
        )}
        <div className="flex justify-between gap-3">
          <Button variante="voltar" onClick={aoVoltar}>
            Voltar
          </Button>
          <Button onClick={avancar}>Próximo</Button>
        </div>
      </div>
    </div>
  );
}