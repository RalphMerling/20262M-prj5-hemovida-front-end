"use client";

import { useState } from "react";
import { Droplet } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EstadoVazio } from "@/components/ui/EstadoVazio";
import { Modal } from "@/components/ui/Modal";
import { formatarDataBR } from "@/lib/formatadores";
import type { DoacaoDoHistorico, ResultadoExame } from "@/models/portal";

const colunas = "grid grid-cols-[1.3fr_1fr_6rem] items-center gap-6";
const rotuloDoTipo = (tipo: string) => (tipo === "Sangue Total" ? "Sangue total" : tipo);
const variantePorResultado: Record<ResultadoExame, "sucesso" | "erro" | "info"> = {
  Apto: "sucesso",
  Inapto: "erro",
  Pendente: "info",
};

export function HistoricoDoacoes({ doacoes }: { doacoes: DoacaoDoHistorico[] }) {
  const [laudoAberto, setLaudoAberto] = useState<DoacaoDoHistorico | null>(null);

  return (
    <Card className="flex min-h-96 flex-col">
      <h2 className="mb-4 text-2xl text-preto">Histórico de doações</h2>

      {doacoes.length === 0 ? (
        <EstadoVazio
          icone={<Droplet size={32} />}
          titulo="Sua primeira doação ainda vai chegar"
          texto="Quando você doar, a data, o status do exame e o laudo aparecem aqui."
        />
      ) : (
        <div role="region" aria-label="Lista de doações" tabIndex={0} className="max-h-80 overflow-y-auto pr-3">
          <div className={`${colunas} sticky top-0 z-10 bg-card py-2 pl-[46px] text-sm font-semibold`}>
            <span>Doação</span>
            <span>Status do exame</span>
            <span className="text-right">Resultado</span>
          </div>

          <ol className="ml-3 border-l-2 border-azul-3">
            {doacoes.map((doacao, indice) => (
              <li key={doacao.id} className="relative pl-8">
                <span
                  aria-hidden
                  className={`absolute -left-[7px] top-[26px] h-3 w-3 rounded-full ring-4 ring-card ${
                    indice === 0 ? "bg-vermelho-2" : "bg-azul-2"
                  }`}
                />
                <div className={`${colunas} py-5`}>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <time dateTime={doacao.data} className="font-semibold">
                        {formatarDataBR(doacao.data)}
                      </time>
                      {indice === 0 && (
                        <span className="rounded-full bg-vermelho-1/10 px-2 py-0.5 text-xs font-semibold text-vermelho-1">
                          Mais recente
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-preto/60">{rotuloDoTipo(doacao.tipo)}</p>
                  </div>

                  <div>
                    <Badge variante={doacao.statusExame === "Disponível" ? "sucesso" : "info"}>{doacao.statusExame}</Badge>
                  </div>

                  <div className="text-right">
                    {doacao.statusExame === "Disponível" ? (
                      <Button
                        variante="cancelar"
                        tamanho="sm"
                        aria-label={`Ver laudo da doação de ${formatarDataBR(doacao.data)}`}
                        onClick={() => setLaudoAberto(doacao)}
                      >
                        Ver laudo
                      </Button>
                    ) : (
                      <span className="inline-block rounded border border-preto/15 px-3 py-1 text-xs text-preto/40">
                        —<span className="sr-only">Laudo ainda indisponível</span>
                      </span>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}

      <Modal aberto={laudoAberto !== null} aoFechar={() => setLaudoAberto(null)} titulo="Laudo da doação" pequeno>
        {laudoAberto && (
          <div>
            <dl className="mb-6 space-y-3">
              <div className="flex items-center justify-between gap-4">
                <dt className="text-preto/60">Data</dt>
                <dd className="font-semibold">{formatarDataBR(laudoAberto.data)}</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-preto/60">Tipo de doação</dt>
                <dd className="font-semibold">{rotuloDoTipo(laudoAberto.tipo)}</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-preto/60">Resultado do exame</dt>
                <dd>
                  <Badge variante={variantePorResultado[laudoAberto.resultadoExame]}>{laudoAberto.resultadoExame}</Badge>
                </dd>
              </div>
            </dl>
            <div className="flex justify-end">
              <Button onClick={() => setLaudoAberto(null)}>Fechar</Button>
            </div>
          </div>
        )}
      </Modal>
    </Card>
  );
}