import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Table } from "@/components/ui/Table";
import { formatarDataBR } from "@/lib/formatadores";
import type { Pedido, StatusPedido, TipoPedido } from "@/models/pedido";

type VarianteBadge = "sucesso" | "erro" | "info";

const status: Record<StatusPedido, { texto: string; variante: VarianteBadge }> = {
  PENDENTE: { texto: "Em análise", variante: "info" },
  APROVADO: { texto: "Aprovado", variante: "info" },
  ENTREGUE: { texto: "Entregue", variante: "sucesso" },
  CANCELADO: { texto: "Cancelado", variante: "erro" },
};

const tipo: Record<TipoPedido, { texto: string; variante: VarianteBadge }> = {
  EMERGENCIAL: { texto: "Emergencial", variante: "erro" },
  REGULAR: { texto: "Regular", variante: "info" },
};

// 7 vira "PED-0007"
export function codigoPedido(id: number): string {
  return `PED-${String(id).padStart(4, "0")}`;
}

function totalDeBolsas(pedido: Pedido): number {
  return pedido.itens.reduce((soma, item) => soma + item.quantidade, 0);
}

// Tabela de pedidos. Clicar no código abre os detalhes: /admin/demanda/historico/[id].
// Serve para o resumo da tela inicial e também para a tela de histórico completa.
export function TabelaPedidos({ pedidos }: { pedidos: Pedido[] }) {
  return (
    <Table
      dados={pedidos}
      vazio="Nenhum pedido encontrado."
      larguraMinima="min-w-[480px]"
      colunas={[
        {
          titulo: "Pedido",
          largura: "34%",
          render: (p) => (
            <>
              <Link
                href={`/admin/demanda/historico/${p.id}`}
                className="font-semibold text-azul-1 hover:underline"
              >
                {codigoPedido(p.id)}
              </Link>
              <p className="text-xs text-preto/70">{totalDeBolsas(p)} bolsas</p>
            </>
          ),
        },
        { titulo: "Data", largura: "20%", render: (p) => formatarDataBR(p.dataPedido) },
        {
          titulo: "Status da solicitação",
          largura: "26%",
          render: (p) => <Badge variante={status[p.status].variante}>{status[p.status].texto}</Badge>,
        },
        {
          titulo: "Tipo",
          largura: "20%",
          render: (p) => <Badge variante={tipo[p.tipo].variante}>{tipo[p.tipo].texto}</Badge>,
        },
      ]}
    />
  );
}
