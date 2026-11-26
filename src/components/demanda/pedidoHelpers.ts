import { formatarDataBR } from "@/lib/formatadores";
import type { Pedido, StatusPedido, TipoPedido } from "@/models/pedido";

export type VarianteBadge = "sucesso" | "erro" | "info";

// Texto e cor da etiqueta de status. Usado na tabela e na tela de detalhes.
export const statusInfo: Record<StatusPedido, { texto: string; variante: VarianteBadge }> = {
  REALIZADO: { texto: "Realizado", variante: "info" },
  EM_SEPARACAO: { texto: "Em separação", variante: "info" },
  ENVIADO: { texto: "Enviado", variante: "info" },
  EM_TRANSITO: { texto: "Em trânsito", variante: "info" },
  ENTREGUE: { texto: "Entregue", variante: "sucesso" },
  CANCELADO: { texto: "Cancelado", variante: "erro" },
  RECUSADO: { texto: "Recusado", variante: "erro" },
  FALHA_ENVIO: { texto: "Falha no envio", variante: "erro" },
};

// Status que saem do caminho normal: a linha do tempo dá lugar a um aviso.
export const avisoDeStatus: Partial<Record<StatusPedido, string>> = {
  CANCELADO: "Este pedido foi cancelado.",
  RECUSADO: "Este pedido foi recusado: não havia estoque suficiente.",
  FALHA_ENVIO: "Houve uma falha no envio deste pedido.",
};

export const tipoInfo: Record<TipoPedido, { texto: string; variante: VarianteBadge }> = {
  EMERGENCIAL: { texto: "Emergencial", variante: "erro" },
  REGULAR: { texto: "Regular", variante: "info" },
};

// As etapas da linha do tempo, em ordem.
export const etapas: { status: StatusPedido; rotulo: string }[] = [
  { status: "REALIZADO", rotulo: "Pedido Realizado" },
  { status: "EM_SEPARACAO", rotulo: "Pedido em separação" },
  { status: "ENVIADO", rotulo: "Pedido Enviado" },
  { status: "EM_TRANSITO", rotulo: "Em Trânsito" },
  { status: "ENTREGUE", rotulo: "Entregue" },
];

// Usa o código que a API gerou. No mock não existe: pedido 231, criado em 2026, vira "PED-2026-00231"
export function codigoPedido(pedido: Pedido): string {
  if (pedido.codigo) return pedido.codigo;
  return `PED-${pedido.criadoEm.slice(0, 4)}-${String(pedido.id).padStart(5, "0")}`;
}

// "2026-10-03T22:14" vira "03/10/2026 — 22:14"
export function formatarDataHora(dataHora: string): string {
  const [data, hora] = dataHora.split("T");
  return `${formatarDataBR(data)} — ${hora.slice(0, 5)}`;
}

export function totalDeBolsas(pedido: Pedido): number {
  return pedido.itens.reduce((soma, item) => soma + item.quantidade, 0);
}

// Texto pequeno embaixo do código. A lista da API não traz as bolsas, só o número de itens.
export function resumoDoPedido(pedido: Pedido): string {
  if (pedido.itens.length > 0) return `${totalDeBolsas(pedido)} bolsas`;
  const total = pedido.totalItens ?? 0;
  return `${total} ${total === 1 ? "item" : "itens"}`;
}

const UM_DIA = 24 * 60 * 60 * 1000;

// "2026-11-26T01:47" -> milissegundos (as duas pontas usam o mesmo "relógio", então a conta fecha).
function emMilissegundos(dataHora: string): number {
  return Date.parse(`${dataHora.slice(0, 16)}:00Z`);
}

export interface IndicadoresDemanda {
  total: number; // pedidos no período
  dias: number;
  media: number; // pedidos por dia
  // % em relação ao período anterior do mesmo tamanho. null = não dá para comparar (antes era 0).
  variacaoRegulares: number | null;
  variacaoEmergenciais: number | null;
}

// Calcula os cartões da tela inicial a partir da lista de pedidos.
// agora: data e hora atuais no mesmo formato dos pedidos (AAAA-MM-DDTHH:mm).
export function calcularIndicadores(pedidos: Pedido[], agora: string, dias = 30): IndicadoresDemanda {
  const fim = emMilissegundos(agora);
  const inicio = fim - dias * UM_DIA;
  const inicioAnterior = inicio - dias * UM_DIA;

  const contar = (de: number, ate: number, tipo?: Pedido["tipo"]) =>
    pedidos.filter((p) => {
      const quando = emMilissegundos(p.criadoEm);
      return quando > de && quando <= ate && (!tipo || p.tipo === tipo);
    }).length;

  const variacao = (tipo: Pedido["tipo"]) => {
    const atual = contar(inicio, fim, tipo);
    const anterior = contar(inicioAnterior, inicio, tipo);
    return anterior === 0 ? null : ((atual - anterior) / anterior) * 100;
  };

  const total = contar(inicio, fim);
  return {
    total,
    dias,
    media: total / dias,
    variacaoRegulares: variacao("REGULAR"),
    variacaoEmergenciais: variacao("EMERGENCIAL"),
  };
}
