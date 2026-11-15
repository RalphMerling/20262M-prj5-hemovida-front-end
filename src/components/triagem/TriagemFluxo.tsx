"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CabecalhoPaciente } from "@/components/painel/CabecalhoPaciente";
import { PassoQuestionario } from "@/components/triagem/PassoQuestionario";
import { PassoResultado } from "@/components/triagem/PassoResultado";
import { PassoSinaisVitais } from "@/components/triagem/PassoSinaisVitais";
import { Button } from "@/components/ui/Button";
import { CaixaDestaque } from "@/components/ui/CaixaDestaque";
import { Card } from "@/components/ui/Card";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Stepper } from "@/components/ui/Stepper";
import { perguntasTriagemMock } from "@/data/mock";
import type { PacienteNaFila } from "@/data/mock";
import { avaliarTriagem } from "@/lib/triagem";
import type { Doador } from "@/models/doador";
import type { Respostas, SinaisVitais } from "@/models/triagem";

const NOMES_DOS_PASSOS = ["Sinais Vitais", "Questionário", "Resultado"];

// Controla a triagem inteira: em qual passo está e o que já foi preenchido.
// Os 3 passos só mostram e devolvem os dados. Quem guarda tudo é este componente,
// por isso dá para voltar de um passo para o outro sem perder nada.
export function TriagemFluxo({ paciente }: { paciente: PacienteNaFila }) {
  const router = useRouter();

  const [passo, setPasso] = useState(1);
  const [sinais, setSinais] = useState<SinaisVitais>({ peso: "", pressao: "", hemoglobina: "" });
  const [respostas, setRespostas] = useState<Respostas>({});
  const [cancelando, setCancelando] = useState(false);
  const doador = {
    doador_nome: paciente.nome,
    doador_cpf: paciente.cpf.replace(/\D/g, ""),
    doador_data_nascimento: paciente.dataNascimento,
    doador_tipo_sanguineo: paciente.tipoSanguineo.slice(0, -1) as Doador["doador_tipo_sanguineo"],
    doador_fator_rh: paciente.tipoSanguineo.slice(-1) as Doador["doador_fator_rh"],
  };

  const resultado = avaliarTriagem(sinais, paciente.genero, perguntasTriagemMock, respostas);

  function responder(perguntaId: number, resposta: boolean) {
    setRespostas((atuais) => ({ ...atuais, [perguntaId]: resposta }));
  }

  function finalizar() {
    // Apto segue para a Doação (próxima tela). Inapto volta para o Início.
    router.push(resultado.apto ? `/admin/doacao?id=${paciente.id}` : "/admin");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-4xl text-azul-1">Triagem Clínica</h1>
        <Button variante="cancelar" onClick={() => setCancelando(true)}>
          Cancelar triagem
        </Button>
      </div>

      <CabecalhoPaciente
        doador={doador}
        mostrarTipoSanguineo={false}
        destaque={<CaixaDestaque rotulo="Tipo sanguíneo">{paciente.tipoSanguineo}</CaixaDestaque>}
      />

      <Card>
        <Stepper passos={NOMES_DOS_PASSOS} atual={passo} />
      </Card>

      {passo === 1 && (
        <PassoSinaisVitais
          sinais={sinais}
          genero={paciente.genero}
          aoMudar={setSinais}
          aoProximo={() => setPasso(2)}
        />
      )}

      {passo === 2 && (
        <PassoQuestionario
          perguntas={perguntasTriagemMock}
          respostas={respostas}
          aoResponder={responder}
          aoVoltar={() => setPasso(1)}
          aoProximo={() => setPasso(3)}
        />
      )}

      {passo === 3 && (
        <PassoResultado
          nome={paciente.nome}
          genero={paciente.genero}
          sinais={sinais}
          perguntas={perguntasTriagemMock}
          resultado={resultado}
          aoVoltar={() => setPasso(2)}
          aoFinalizar={finalizar}
        />
      )}

      <ConfirmDialog
        aberto={cancelando}
        titulo="Atenção! Tem certeza que deseja cancelar a triagem?"
        textoCancelar="Cancelar"
        textoConfirmar="Sim"
        aoConfirmar={() => router.push("/admin")}
        aoCancelar={() => setCancelando(false)}
      />
    </div>
  );
}