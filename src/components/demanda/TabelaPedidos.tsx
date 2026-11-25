import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { Table } from "@/components/ui/Table";
import type { Coluna } from "@/components/ui/Table";
import { formatarDataBR } from "@/lib/formatadores";
import type { Pedido } from "@/models/pedido";
import { codigoPedido, statusInfo, tipoInfo, totalDeBolsas } from "./pedidoHelpers";

// Tabela de pedidos. Clicar no código abre os detalhes: /admin/demanda/historico/[id].
// Serve para o resumo da tela inicial e também para a tela de histórico completa.
// comDetalhes: acrescenta o botão "Ver detalhes" no fim de cada linha (tela de histórico).
export function TabelaPedidos({ pedidos, comDetalhes = false }: { pedidos: Pedido[]; comDetalhes?: boolean }) {
  const colunas: Coluna<Pedido>[] = [
        {
          titulo: "Pedido",
          largura: comDetalhes ? "28%" : "34%",
          render: (p) => (
            <>
              <Link
                href={`/admin/demanda/historico/detalhe?id=${p.id}`}
                className="font-semibold text-azul-1 hover:underline"
              >
                {codigoPedido(p)}
              </Link>
              <p className="text-xs text-preto/70">{totalDeBolsas(p)} bolsas</p>
            </>
          ),
        },
        { titulo: "Data", largura: comDetalhes ? "16%" : "20%", render: (p) => formatarDataBR(p.criadoEm.slice(0, 10)) },
        {
          titulo: "Status da solicitação",
          largura: comDetalhes ? "22%" : "26%",
          render: (p) => <Badge variante={statusInfo[p.status].variante}>{statusInfo[p.status].texto}</Badge>,
        },
        {
          titulo: "Tipo",
          largura: comDetalhes ? "17%" : "20%",
          render: (p) => <Badge variante={tipoInfo[p.tipo].variante}>{tipoInfo[p.tipo].texto}</Badge>,
        },
  ];

  if (comDetalhes) {
    colunas.push({
      titulo: "Ações",
      largura: "17%",
      render: (p) => (
        <ButtonLink href={`/admin/demanda/historico/detalhe?id=${p.id}`} variante="secundario" tamanho="sm">
          Ver detalhes
        </ButtonLink>
      ),
    });
  }

  return <Table dados={pedidos} vazio="Nenhum pedido encontrado." larguraMinima="min-w-[560px]" colunas={colunas} />;
}
