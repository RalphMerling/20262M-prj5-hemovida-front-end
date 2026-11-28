import { pedidosMock } from "@/data/mock";
import type { ItemPedido, Pedido, StatusPedido, TipoPedido } from "@/models/pedido";
import { ErroDeApi, USAR_MOCK, esperar, requisicao } from "@/services/api";
import { buscarNomes } from "@/services/usuariosService";

// ---------- Como a API do MS3 (demanda) fala ----------
// Os nomes abaixo foram conferidos no código do MS3 (prisma/schema.prisma e src/requests).
// Todos os campos "id" chegam como TEXTO ("10"), porque o banco usa BigInt.

type TipoDaApi = "REPOSICAO" | "EMERGENCIAL";

type StatusDaApi =
  | "PENDENTE"
  | "APROVADO_RESERVADO"
  | "EM_TRANSITO"
  | "ENTREGUE"
  | "RECUSADO_ESTOQUE_INSUFICIENTE"
  | "FALHA_ENVIO"
  | "CANCELADO";

type HemocomponenteDaApi = "CONCENTRADO_HEMACIAS" | "PLAQUETAS" | "PLASMA" | "CRIOPRECIPITADO";

// Cada linha de GET /requests (resumo: sem itens e sem justificativa).
interface PedidoResumoDaApi {
  solicitacao_id: string;
  solicitacao_codigo_pedido: string;
  solicitacao_tipo_solicitacao: TipoDaApi;
  solicitacao_status_atual: StatusDaApi;
  solicitacao_data_hora_criacao: string; // ISO em UTC: "2026-11-26T04:47:45.000Z"
  solicitacao_data_hora_prevista_entrega: string | null;
  gestor_hospital_id: string;
  _count: { itens: number };
}

interface RespostaDaLista {
  dados: PedidoResumoDaApi[];
  paginacao: { page: number; limit: number; total: number; totalPaginas: number };
}

interface ItemDaApi {
  item_solicitacao_tipo_sanguineo: string; // o Prisma devolve "O_NEG"; aceitamos "O-" também
  item_solicitacao_hemocomponente: HemocomponenteDaApi;
  item_solicitacao_quantidade_bolsas: number;
}

// GET /requests/:id, POST /requests e PATCH /requests/:id/cancel devolvem o pedido completo.
// (O POST não traz o _count; o número de itens sai do tamanho de "itens".)
interface PedidoCompletoDaApi extends Omit<PedidoResumoDaApi, "_count"> {
  hospital_id: string;
  solicitacao_justificativa_emergencia: string | null;
  solicitacao_data_hora_recebimento: string | null;
  itens: ItemDaApi[];
  historicos?: {
    historico_status_status_novo: StatusDaApi;
    historico_status_data_hora_mudanca: string;
  }[];
  _count?: { itens: number };
}

// ---------- Tabelas de tradução ----------

const tipoDaApiParaTela: Record<TipoDaApi, TipoPedido> = {
  REPOSICAO: "REGULAR",
  EMERGENCIAL: "EMERGENCIAL",
};

// A tela tem 5 etapas. Os dois status que a API tem a mais viram avisos (ver pedidoHelpers).
const statusDaApiParaTela: Record<StatusDaApi, StatusPedido> = {
  PENDENTE: "REALIZADO",
  APROVADO_RESERVADO: "EM_SEPARACAO",
  EM_TRANSITO: "EM_TRANSITO",
  ENTREGUE: "ENTREGUE",
  CANCELADO: "CANCELADO",
  RECUSADO_ESTOQUE_INSUFICIENTE: "RECUSADO",
  FALHA_ENVIO: "FALHA_ENVIO",
};

const hemocomponenteDaApiParaTela: Record<HemocomponenteDaApi, string> = {
  CONCENTRADO_HEMACIAS: "Concentrado de Hemácias",
  PLAQUETAS: "Plaquetas",
  PLASMA: "Plasma",
  CRIOPRECIPITADO: "Crioprecipitado",
};

const hemocomponenteDaTelaParaApi: Record<string, HemocomponenteDaApi> = Object.fromEntries(
  Object.entries(hemocomponenteDaApiParaTela).map(([api, tela]) => [tela, api as HemocomponenteDaApi]),
);

const tipoSanguineoDaApiParaTela: Record<string, string> = {
  A_POS: "A+", A_NEG: "A-", B_POS: "B+", B_NEG: "B-",
  AB_POS: "AB+", AB_NEG: "AB-", O_POS: "O+", O_NEG: "O-",
};

// ---------- Conversões (API -> tela) ----------

// "2026-11-26T04:47:45.000Z" (UTC) vira "2026-11-26T01:47" (horário de Brasília).
// O fuso é fixo de propósito: o hospital vê o mesmo horário em qualquer computador.
export function dataDaApiParaTela(iso: string): string {
  const partes = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hourCycle: "h23",
  }).formatToParts(new Date(iso));
  const p = (tipo: string) => partes.find((parte) => parte.type === tipo)?.value ?? "00";
  return `${p("year")}-${p("month")}-${p("day")}T${p("hour")}:${p("minute")}`;
}

function converterItem(item: ItemDaApi): ItemPedido {
  const tipo = item.item_solicitacao_tipo_sanguineo;
  return {
    tipoSanguineo: tipoSanguineoDaApiParaTela[tipo] ?? tipo,
    hemocomponente: hemocomponenteDaApiParaTela[item.item_solicitacao_hemocomponente] ?? item.item_solicitacao_hemocomponente,
    quantidade: item.item_solicitacao_quantidade_bolsas,
  };
}

// Vale para o resumo (lista) e para o pedido completo (detalhe, criar, cancelar).
export function converterPedido(api: PedidoResumoDaApi | PedidoCompletoDaApi): Pedido {
  const completo = "itens" in api ? api : null;
  const itens = completo ? completo.itens.map(converterItem) : [];

  return {
    id: Number(api.solicitacao_id),
    codigo: api.solicitacao_codigo_pedido,
    tipo: tipoDaApiParaTela[api.solicitacao_tipo_solicitacao],
    status: statusDaApiParaTela[api.solicitacao_status_atual],
    // A API do MS3 só manda o id do gestor (é o id dele no MS4). O nome vem de comNomeDoGestor().
    solicitadoPor: `Gestor #${api.gestor_hospital_id}`,
    solicitadoPorId: Number(api.gestor_hospital_id),
    criadoEm: dataDaApiParaTela(api.solicitacao_data_hora_criacao),
    entregaPrevista: api.solicitacao_data_hora_prevista_entrega
      ? dataDaApiParaTela(api.solicitacao_data_hora_prevista_entrega)
      : undefined,
    justificativa: completo?.solicitacao_justificativa_emergencia ?? undefined,
    itens,
    totalItens: completo ? completo.itens.length : (api as PedidoResumoDaApi)._count.itens,
  };
}

// ---------- O que o POST /requests recebe ----------

// A tela trabalha com os textos bonitos ("Plasma", "O-"); a API quer os códigos.
export interface NovoPedido {
  tipo: TipoPedido;
  itens: ItemPedido[];
  justificativa?: string; // obrigatória (e só enviada) no pedido emergencial
}

interface CorpoDoPedido {
  tipo: TipoDaApi;
  justificativa?: string;
  itens: { tipoSanguineo: string; hemocomponente: HemocomponenteDaApi; quantidadeBolsas: number }[];
}

export function montarCorpo(dados: NovoPedido): CorpoDoPedido {
  const emergencial = dados.tipo === "EMERGENCIAL";
  return {
    tipo: emergencial ? "EMERGENCIAL" : "REPOSICAO",
    ...(emergencial ? { justificativa: dados.justificativa?.trim() } : {}),
    itens: dados.itens.map((item) => ({
      tipoSanguineo: item.tipoSanguineo, // a API aceita "O-", "A+"...
      hemocomponente: hemocomponenteDaTelaParaApi[item.hemocomponente],
      quantidadeBolsas: item.quantidade,
    })),
  };
}

// Troca "Gestor #13" pelo nome de verdade (rota GET /usuarios/nomes do MS4).
// Se a busca falhar, fica o "Gestor #13": o nome é um enfeite e não pode derrubar a tela.
async function comNomeDoGestor(pedido: Pedido): Promise<Pedido> {
  if (!pedido.solicitadoPorId) return pedido;
  try {
    const nomes = await buscarNomes([pedido.solicitadoPorId]);
    const nome = nomes[pedido.solicitadoPorId];
    return nome ? { ...pedido, solicitadoPor: nome } : pedido;
  } catch {
    return pedido;
  }
}

// "2026-11-25T01:30": data e hora de agora, no fuso do navegador (usado só no mock).
function agoraSemFuso(): string {
  const d = new Date();
  const dois = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${dois(d.getMonth() + 1)}-${dois(d.getDate())}T${dois(d.getHours())}:${dois(d.getMinutes())}`;
}

// ---------- Funções ----------
// Todas as rotas são do perfil GESTOR_DEMANDA. A tela mostra mensagemDoErro(erro) quando algo falha.

const LIMITE_POR_PAGINA = 50; // o máximo que a API aceita
const MAXIMO_DE_PAGINAS = 10; // trava de segurança (500 pedidos)

// GET /requests?page=&limit=. A API só devolve os pedidos do hospital do token, do mais novo ao mais antigo.
// Filtrar (regulares, emergenciais...) a API não faz: a tela filtra a lista que recebe daqui.
export async function listarPedidos(): Promise<Pedido[]> {
  if (USAR_MOCK) {
    await esperar(300);
    return [...pedidosMock];
  }

  const pedidos: Pedido[] = [];
  let pagina = 1;
  let totalPaginas = 1;
  do {
    const resposta = await requisicao<RespostaDaLista>(`/requests?page=${pagina}&limit=${LIMITE_POR_PAGINA}`);
    pedidos.push(...resposta.dados.map(converterPedido));
    totalPaginas = resposta.paginacao.totalPaginas;
    pagina += 1;
  } while (pagina <= totalPaginas && pagina <= MAXIMO_DE_PAGINAS);
  return pedidos;
}

// GET /requests/:id. Se não existir (ou for de outro hospital), devolve null: a tela mostra "não encontrado".
export async function buscarPedidoPorId(id: number): Promise<Pedido | null> {
  if (USAR_MOCK) {
    await esperar(300);
    return pedidosMock.find((pedido) => pedido.id === id) ?? null;
  }

  try {
    return await comNomeDoGestor(converterPedido(await requisicao<PedidoCompletoDaApi>(`/requests/${id}`)));
  } catch (erro) {
    if (erro instanceof ErroDeApi && erro.status === 404) return null;
    throw erro;
  }
}

// POST /requests. Erros esperados: 400 dado inválido, 403 sem permissão ou hospital inativo.
export async function criarPedido(dados: NovoPedido): Promise<Pedido> {
  if (USAR_MOCK) {
    await esperar(500);

    // Regras de mentira, parecidas com as da API, só para a tela mostrar os erros.
    if (dados.itens.length === 0) {
      throw new ErroDeApi(400, "Inclua pelo menos um item no pedido.");
    }
    if (dados.tipo === "EMERGENCIAL" && !dados.justificativa?.trim()) {
      throw new ErroDeApi(400, "Descreva o motivo da urgência clínica.");
    }

    // Guarda na lista de mentira: assim o pedido novo aparece no histórico.
    const criado: Pedido = {
      id: Math.max(0, ...pedidosMock.map((pedido) => pedido.id)) + 1,
      tipo: dados.tipo,
      status: "REALIZADO",
      hospital: "Hospital Central",
      solicitadoPor: "Usuário de teste",
      criadoEm: agoraSemFuso(),
      justificativa: dados.tipo === "EMERGENCIAL" ? dados.justificativa?.trim() : undefined,
      itens: dados.itens,
    };
    pedidosMock.push(criado);
    return criado;
  }

  return converterPedido(
    await requisicao<PedidoCompletoDaApi>("/requests", { metodo: "POST", corpo: montarCorpo(dados) }),
  );
}

// PATCH /requests/:id/cancel. Só pedidos PENDENTES (status "Realizado" na tela) podem ser cancelados.
// Erros esperados: 404 não existe, 409 já saiu de PENDENTE (ou mudou no meio do caminho).
export async function cancelarPedido(id: number): Promise<Pedido> {
  if (USAR_MOCK) {
    await esperar(400);

    const pedido = pedidosMock.find((item) => item.id === id);
    if (!pedido) throw new ErroDeApi(404, "Pedido não encontrado.");
    if (pedido.status !== "REALIZADO") {
      throw new ErroDeApi(409, "Só é possível cancelar pedidos que ainda não foram aprovados.");
    }

    pedido.status = "CANCELADO";
    return { ...pedido };
  }

  try {
    return await comNomeDoGestor(
      converterPedido(await requisicao<PedidoCompletoDaApi>(`/requests/${id}/cancel`, { metodo: "PATCH" })),
    );
  } catch (erro) {
    // O texto padrão de 409 do api.ts é o do cadastro de CPF; aqui o significado é outro.
    if (erro instanceof ErroDeApi && erro.status === 409) {
      throw new ErroDeApi(409, "Só é possível cancelar pedidos que ainda não foram aprovados.");
    }
    throw erro;
  }
}
