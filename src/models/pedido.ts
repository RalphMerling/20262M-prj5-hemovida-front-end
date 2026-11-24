// O "molde" de um pedido de sangue feito por um hospital.
export type TipoPedido = "EMERGENCIAL" | "REGULAR";
export type StatusPedido = "PENDENTE" | "APROVADO" | "ENTREGUE" | "CANCELADO";

export interface ItemPedido {
  tipoSanguineo: string; // ex.: "O-"
  quantidade: number; // bolsas
}

export interface Pedido {
  id: number;
  tipo: TipoPedido;
  status: StatusPedido;
  hospital: string;
  dataPedido: string; // AAAA-MM-DD
  itens: ItemPedido[];
  observacao?: string;
}
