"use client";

import { ArrowLeft } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { ItensDoPedido } from "@/components/demanda/ItensDoPedido";
import { LinhaDoTempoPedido } from "@/components/demanda/LinhaDoTempoPedido";
import { avisoDeStatus, codigoPedido, formatarDataHora, statusInfo, tipoInfo } from "@/components/demanda/pedidoHelpers";
import { Alert } from "@/components/ui/Alert";
import { Badge } from "@/components/ui/Badge";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import type { Pedido } from "@/models/pedido";
import { mensagemDoErro } from "@/services/api";
import { buscarPedidoPorId, cancelarPedido } from "@/services/pedidosService";

function Dado({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <div>
      <dt className="text-xs text-preto/60">{rotulo}</dt>
      <dd className="font-semibold">{valor}</dd>
    </div>
  );
}

// Detalhes de UM pedido. O número vem no endereço, depois do "?id=":
// /admin/demanda/historico/detalhe?id=231  ->  id = "231"
function DetalhesDoPedido() {
  const id = Number(useSearchParams().get("id"));

  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [confirmandoCancelar, setConfirmandoCancelar] = useState(false);
  const [cancelando, setCancelando] = useState(false);
  const [erroCancelar, setErroCancelar] = useState("");

  useEffect(() => {
    let cancelado = false; // se a tela fechar antes da resposta, ignora o resultado
    buscarPedidoPorId(id)
      .then((encontrado) => {
        if (!cancelado) setPedido(encontrado); // null = não existe (404)
      })
      .catch((e: unknown) => {
        if (!cancelado) setErro(mensagemDoErro(e));
      })
      .finally(() => {
        if (!cancelado) setCarregando(false);
      });
    return () => {
      cancelado = true;
    };
  }, [id]);

  async function cancelar() {
    setConfirmandoCancelar(false);
    setCancelando(true);
    setErroCancelar("");
    try {
      setPedido(await cancelarPedido(id));
    } catch (e) {
      setErroCancelar(mensagemDoErro(e));
    } finally {
      setCancelando(false);
    }
  }

  if (carregando) return <p className="text-sm text-preto/70">Carregando pedido...</p>;

  if (!pedido) {
    return (
      <div className="flex flex-col gap-4">
        <div>
          <ButtonLink href="/admin/demanda/historico" variante="voltar" tamanho="sm">
            <ArrowLeft size={14} className="mr-1" aria-hidden="true" />
            Voltar
          </ButtonLink>
        </div>
        <Alert tipo="erro">{erro || "Pedido não encontrado."}</Alert>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <ButtonLink href="/admin/demanda/historico" variante="voltar" tamanho="sm">
          <ArrowLeft size={14} className="mr-1" aria-hidden="true" />
          Voltar
        </ButtonLink>
      </div>

      <h1 className="text-3xl text-azul-1">Detalhes do pedido</h1>

      <Card className="flex flex-col gap-8">
        <div className="flex flex-wrap justify-end gap-2">
          <Badge variante={statusInfo[pedido.status].variante}>{statusInfo[pedido.status].texto}</Badge>
          <Badge variante={tipoInfo[pedido.tipo].variante}>{tipoInfo[pedido.tipo].texto}</Badge>
        </div>

        {avisoDeStatus[pedido.status] ? (
          <Alert tipo="erro">{avisoDeStatus[pedido.status]}</Alert>
        ) : (
          <LinhaDoTempoPedido status={pedido.status} />
        )}

        <dl className="grid grid-cols-2 gap-6 md:grid-cols-4">
          <Dado rotulo="Entrega Prevista" valor={pedido.entregaPrevista ? formatarDataHora(pedido.entregaPrevista) : "\u2014"} />
          <Dado rotulo="Código do pedido" valor={codigoPedido(pedido)} />
          <Dado rotulo="Criado em" valor={formatarDataHora(pedido.criadoEm)} />
          <Dado rotulo="Solicitado por" valor={pedido.solicitadoPor} />
        </dl>

        {pedido.justificativa && (
          <div>
            <p className="text-xs text-preto/60">Justificativa da emergência</p>
            <p className="font-semibold">{pedido.justificativa}</p>
          </div>
        )}

        <ItensDoPedido itens={pedido.itens} />

        {erroCancelar && <Alert tipo="erro">{erroCancelar}</Alert>}

        {/* A API só deixa cancelar pedido que ainda está pendente (status "Realizado" na tela). */}
        {pedido.status === "REALIZADO" && (
          <div className="flex justify-end">
            <Button variante="cancelar" tamanho="sm" disabled={cancelando} onClick={() => setConfirmandoCancelar(true)}>
              {cancelando ? "Cancelando..." : "Cancelar pedido"}
            </Button>
          </div>
        )}
      </Card>

      <ConfirmDialog
        aberto={confirmandoCancelar}
        titulo="Tem certeza que deseja cancelar este pedido?"
        descricao="Depois de cancelado, o pedido não pode ser reativado."
        textoConfirmar="Sim, cancelar"
        aoConfirmar={cancelar}
        aoCancelar={() => setConfirmandoCancelar(false)}
      />
    </div>
  );
}

// O Suspense é obrigatório quando a página lê o "?id=" (useSearchParams).
export default function DetalhePedido() {
  return (
    <Suspense fallback={null}>
      <DetalhesDoPedido />
    </Suspense>
  );
}