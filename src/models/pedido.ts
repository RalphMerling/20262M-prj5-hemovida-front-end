// O "molde" de um pedido de sangue feito por um hospital.
export type TipoPedido = "EMERGENCIAL" | "REGULAR";

// As etapas, na ordem em que acontecem. As três últimas saem do caminho normal:
// CANCELADO (o gestor cancelou), RECUSADO (a hemorrede não tinha estoque) e FALHA_ENVIO.
// O serviço (pedidosService) traduz os status da API do MS3 para estes.
export type StatusPedido =
  | "REALIZADO"
  | "EM_SEPARACAO"
  | "ENVIADO"
  | "EM_TRANSITO"
  | "ENTREGUE"
  | "CANCELADO"
  | "RECUSADO"
  | "FALHA_ENVIO";

export interface ItemPedido {
  tipoSanguineo: string; // ex.: "O-"
  hemocomponente: string; // ex.: "Plasma"
  quantidade: number; // bolsas
}

export interface Pedido {
  id: number;
  codigo?: string; // ex.: "PED-20261126-07B1FF" (gerado pela API; no mock não existe)
  tipo: TipoPedido;
  status: StatusPedido;
  hospital?: string; // a API só manda o id do hospital, não o nome
  criadoEm: string; // data e hora: AAAA-MM-DDTHH:mm
  entregaPrevista?: string; // data e hora: AAAA-MM-DDTHH:mm
  solicitadoPor: string;
  solicitadoPorId?: number; // id do gestor no MS4; serve para buscar o nome dele
  justificativa?: string; // só nos pedidos emergenciais
  itens: ItemPedido[]; // na lista da API vem vazio: só o detalhe traz os itens
  totalItens?: number; // quantos itens o pedido tem (a lista da API só manda isso)
}
