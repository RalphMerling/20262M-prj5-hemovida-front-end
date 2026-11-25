import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
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

// Detalhes de UM pedido. O [id] da pasta vira o número que vem no endereço:
// /admin/demanda/historico/231  ->  id = "231"
export default async function DetalhePedido({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // TODO: com a API: pedidosService.buscarPorId(id). Se vier 404, chame notFound() também.
  const pedido = pedidosMock.find((p) => p.id === Number(id));
  if (!pedido) notFound();

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
          <Dado rotulo="Entrega Prevista" valor={pedido.entregaPrevista ? formatarDataHora(pedido.entregaPrevista) : "—"} />
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
