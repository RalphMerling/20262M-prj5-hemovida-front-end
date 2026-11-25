"use client";

import { ArrowLeft } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { ItensDoPedido } from "@/components/demanda/ItensDoPedido";
import { LinhaDoTempoPedido } from "@/components/demanda/LinhaDoTempoPedido";
import { codigoPedido, formatarDataHora, statusInfo, tipoInfo } from "@/components/demanda/pedidoHelpers";
import { Alert } from "@/components/ui/Alert";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { pedidosMock } from "@/data/mock";

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
  const id = useSearchParams().get("id") ?? "";

  // TODO: com a API: pedidosService.buscarPorId(id). Se vier 404, mostre a mesma mensagem de "não encontrado".
  const pedido = pedidosMock.find((p) => p.id === Number(id));

  if (!pedido) {
    return (
      <div className="flex flex-col gap-4">
        <div>
          <ButtonLink href="/admin/demanda/historico" variante="voltar" tamanho="sm">
            <ArrowLeft size={14} className="mr-1" aria-hidden="true" />
            Voltar
          </ButtonLink>
        </div>
        <Alert tipo="erro">Pedido não encontrado.</Alert>
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

        {pedido.status === "CANCELADO" ? (
          <Alert tipo="erro">Este pedido foi cancelado.</Alert>
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
      </Card>
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