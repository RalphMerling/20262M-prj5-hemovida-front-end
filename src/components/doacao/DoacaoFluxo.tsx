"use client";

import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useId, useState, useSyncExternalStore } from "react";
import { CabecalhoPaciente } from "@/components/painel/CabecalhoPaciente";
import { Button } from "@/components/ui/Button";
import { CaixaDestaque } from "@/components/ui/CaixaDestaque";
import { Card } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import type { PacienteNaFila } from "@/data/mock";
import { resumoDoPaciente } from "@/lib/paciente";
import type { TipoDeDoacao } from "@/models/doacao";

// MOCK
const RESPONSAVEL_TECNICO = "Laura Machado Ferreira";

const opcoesDeTipo: { valor: TipoDeDoacao; titulo: string; descricao: string }[] = [
  { valor: "Sangue Total", titulo: "Sangue total", descricao: "Padrão" },
  { valor: "Aférese", titulo: "Aférese", descricao: "Plaquetas" },
  { valor: "Autóloga", titulo: "Autóloga", descricao: "Para o próprio doador" },
];

const assinar = () => () => {};
const horaAgora = () => new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

function InfoFixa({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <div>
      <p className="text-sm text-preto/60">{rotulo}</p>
      <p className="mt-1 rounded-xl bg-preto/5 px-4 py-3 font-semibold">{valor}</p>
    </div>
  );
}

export function DoacaoFluxo({ paciente }: { paciente: PacienteNaFila }) {
  const router = useRouter();
  const idVolume = useId();

  const [tipo, setTipo] = useState<TipoDeDoacao>("Sangue Total");
  const [volume, setVolume] = useState("");
  const [tentouFinalizar, setTentouFinalizar] = useState(false);
  const [concluida, setConcluida] = useState(false);

  const horario = useSyncExternalStore(assinar, horaAgora, () => "--:--");

  // MOCK
  const codigoBolsa = `BLS-2026-${String(paciente.id).padStart(4, "0")}`;

  const volumeNumero = Number(volume);
  const erroVolume = tentouFinalizar && !(volumeNumero > 0) ? "Informe o volume coletado em mL." : undefined;

  function finalizar() {
    if (!(volumeNumero > 0)) {
      setTentouFinalizar(true);
      return;
    }
    setConcluida(true);
  }

  return (
    <div className="space-y-6">
      <h1 className="text-4xl text-azul-1">Registro de Coleta</h1>

      <CabecalhoPaciente
        doador={resumoDoPaciente(paciente)}
        destaque={
          <div className="flex gap-3">
            <CaixaDestaque rotulo="Tipo sanguíneo">{paciente.tipoSanguineo}</CaixaDestaque>
            <CaixaDestaque rotulo="Estado de aptidão" tom="sucesso" tamanho="medio">
              <Check size={22} strokeWidth={3} aria-hidden />
              Apto para coleta
            </CaixaDestaque>
          </div>
        }
      />

      <Card>
        <h2 className="text-2xl text-azul-1">Registro da coleta</h2>
        <p className="mb-6 mt-1 text-preto/60">Confira a identificação da amostra e informe o volume coletado.</p>

        <div className="grid gap-10 md:grid-cols-2">
          <section className="space-y-6">
            <h3 className="text-lg text-azul-1">Identificação da amostra</h3>

            <InfoFixa rotulo="Código da bolsa (ID único)" valor={codigoBolsa} />

            <fieldset>
              <legend className="mb-2 font-bold text-azul-1">Tipo de doação</legend>
              <div className="grid gap-3">
                {opcoesDeTipo.map((opcao) => {
                  const marcada = tipo === opcao.valor;
                  return (
                    <label
                      key={opcao.valor}
                      className={`flex cursor-pointer items-center justify-between gap-4 rounded-2xl border px-4 py-3 transition focus-within:ring-2 focus-within:ring-azul-3 ${
                        marcada ? "border-azul-2 bg-azul-3/30" : "border-preto/10 hover:border-azul-2/50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="tipo-doacao"
                        value={opcao.valor}
                        checked={marcada}
                        onChange={() => setTipo(opcao.valor)}
                        className="sr-only"
                      />
                      <span>
                        <span className="block font-semibold">{opcao.titulo}</span>
                        <span className="block text-sm text-preto/60">{opcao.descricao}</span>
                      </span>
                      <span
                        aria-hidden
                        className={`flex h-6 w-6 items-center justify-center rounded-full ${
                          marcada ? "bg-azul-2 text-branco" : "border border-preto/20"
                        }`}
                      >
                        {marcada && <Check size={14} strokeWidth={3} />}
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          </section>

          <section className="space-y-6">
            <h3 className="text-lg text-azul-1">Parâmetros da coleta</h3>

            <div>
              <label htmlFor={idVolume} className="mb-2 block font-bold text-azul-1">
                Volume coletado
              </label>
              <div
                className={`flex items-baseline gap-2 border-b-2 pb-1 transition focus-within:border-azul-2 ${
                  erroVolume ? "border-vermelho-1" : "border-preto/15"
                }`}
              >
                <input
                  id={idVolume}
                  inputMode="numeric"
                  placeholder="450"
                  value={volume}
                  onChange={(e) => setVolume(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  aria-invalid={erroVolume ? true : undefined}
                  aria-describedby={erroVolume ? `${idVolume}-erro` : undefined}
                  className="w-full min-w-0 bg-transparent font-titulo text-3xl outline-none placeholder:text-preto/25"
                />
                <span className="shrink-0 text-sm text-preto/60">mL</span>
              </div>
              {erroVolume && (
                <p id={`${idVolume}-erro`} role="alert" className="mt-2 text-sm text-vermelho-1">
                  {erroVolume}
                </p>
              )}
            </div>

            <InfoFixa rotulo="Horário da coleta" valor={horario} />
            <InfoFixa rotulo="Responsável técnico" valor={RESPONSAVEL_TECNICO} />
          </section>
        </div>

        <div className="mt-8 flex items-center justify-between gap-4 border-t border-preto/10 pt-6">
          <Button variante="voltar" onClick={() => router.push("/admin")}>
            Voltar
          </Button>
          <Button onClick={finalizar}>Finalizar coleta</Button>
        </div>
      </Card>

      {/* Fechar esta janela (botão, X, Esc ou clique no fundo) leva para o Início, para não registrar duas vezes. */}
      <Modal
        aberto={concluida}
        aoFechar={() => router.push("/admin")}
        titulo="Coleta registrada"
        pequeno
        icone={
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-green-600 text-branco">
            <Check size={44} strokeWidth={3} />
          </span>
        }
      >
        <p className="mb-6 text-preto/70">
          Bolsa {codigoBolsa} registrada com {volumeNumero} mL ({tipo.toLowerCase()}).
        </p>
        <Button onClick={() => router.push("/admin")}>Voltar para o início</Button>
      </Modal>
    </div>
  );
}