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

// Pedido 231, criado em 2026, vira "PED-2026-00231"
export function codigoPedido(pedido: Pedido): string {
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
