// O "molde" de um pedido de sangue feito por um hospital.
export type TipoPedido = "EMERGENCIAL" | "REGULAR";

// As 5 etapas, na ordem em que acontecem. CANCELADO pode acontecer a qualquer momento.
export type StatusPedido = "REALIZADO" | "EM_SEPARACAO" | "ENVIADO" | "EM_TRANSITO" | "ENTREGUE" | "CANCELADO";

export interface ItemPedido {
  tipoSanguineo: string; // ex.: "O-"
  hemocomponente: string; // ex.: "Plasma"
  quantidade: number; // bolsas
}

export interface Pedido {
  id: number;
  tipo: TipoPedido;
  status: StatusPedido;
  hospital: string;
  criadoEm: string; // data e hora: AAAA-MM-DDTHH:mm
  entregaPrevista?: string; // data e hora: AAAA-MM-DDTHH:mm
  solicitadoPor: string;
  justificativa?: string; // só nos pedidos emergenciais
  itens: ItemPedido[];
}
