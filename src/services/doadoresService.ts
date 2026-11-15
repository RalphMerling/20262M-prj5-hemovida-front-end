import { doadorLogadoMock, doadoresMock } from "@/data/mock";
import type { Doador, FatorRh, Genero, TipoSanguineo } from "@/models/doador";
import { ErroDeApi, USAR_MOCK, esperar, requisicao } from "@/services/api";

// ---------- Tipos ----------

// Como o doador CHEGA da API: o fator RH vem como POSITIVO/NEGATIVO e a data vem completa.
interface DoadorDaApi extends Omit<Doador, "doador_fator_rh" | "doador_data_nascimento"> {
  doador_fator_rh: "POSITIVO" | "NEGATIVO";
  doador_data_nascimento: string; // 1995-03-10T00:00:00.000Z
}

// Traduz para o formato que as telas usam: fator "+" ou "-" e data AAAA-MM-DD.
// A data é cortada como texto (e não virada em Date), senão o fuso do Brasil mostraria o dia anterior.
function converter(doador: DoadorDaApi): Doador {
  return {
    ...doador,
    doador_fator_rh: doador.doador_fator_rh === "POSITIVO" ? "+" : "-",
    doador_data_nascimento: doador.doador_data_nascimento.slice(0, 10),
  };
}

// O que o POST /doadores espera. O fator RH vai como "+" ou "-" e a data como AAAA-MM-DD.
export interface NovoDoador {
  usuario_id: number;
  doador_nome: string;
  doador_cpf: string;
  doador_data_nascimento: string;
  doador_genero: Genero;
  doador_tipo_sanguineo: TipoSanguineo;
  doador_fator_rh: FatorRh;
  doador_telefone: string;
  doador_email: string;
  doador_cep: string;
  doador_endereco: string;
}

// O PUT aceita SOMENTE estes 5 campos. Qualquer outro dá erro 400.
const CAMPOS_EDITAVEIS = ["doador_genero", "doador_telefone", "doador_email", "doador_cep", "doador_endereco"] as const;
export type DadosParaAtualizar = Partial<Pick<Doador, (typeof CAMPOS_EDITAVEIS)[number]>>;

export interface PaginaDeDoadores {
  data: Doador[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

// ---------- Funções ----------

// GET /doadores?page=1&limit=10 (equipe)
export async function listarDoadores(pagina = 1, limite = 10): Promise<PaginaDeDoadores> {
  if (USAR_MOCK) {
    await esperar(300);
    const ativos = doadoresMock.map((item) => item.doador).filter((doador) => doador.doador_status === 1);
    const inicio = (pagina - 1) * limite;
    return {
      data: ativos.slice(inicio, inicio + limite),
      meta: { total: ativos.length, page: pagina, limit: limite, totalPages: Math.ceil(ativos.length / limite) },
    };
  }

  const resposta = await requisicao<{ data: DoadorDaApi[]; meta: PaginaDeDoadores["meta"] }>(
    `/doadores?page=${pagina}&limit=${limite}`,
  );
  return { data: resposta.data.map(converter), meta: resposta.meta };
}

// GET /doadores/cpf/:cpf (equipe). Se não existir, devolve null (a tela mostra "não encontrado").
export async function buscarDoadorPorCpf(cpf: string): Promise<Doador | null> {
  if (USAR_MOCK) {
    await esperar(400);
    return doadoresMock.find((item) => item.doador.doador_cpf === cpf)?.doador ?? null;
  }

  try {
    return converter(await requisicao<DoadorDaApi>(`/doadores/cpf/${cpf}`));
  } catch (erro) {
    if (erro instanceof ErroDeApi && erro.status === 404) return null;
    throw erro;
  }
}

// GET /doadores/me (só DOADOR): o próprio cadastro
export async function buscarMeuCadastro(): Promise<Doador> {
  if (USAR_MOCK) {
    await esperar(300);
    return doadorLogadoMock;
  }
  return converter(await requisicao<DoadorDaApi>("/doadores/me"));
}

// GET /doadores/:id (equipe, ou o próprio doador)
export async function buscarDoadorPorId(id: number): Promise<Doador | null> {
  if (USAR_MOCK) {
    await esperar(300);
    return doadoresMock.find((item) => item.doador.doador_id === id)?.doador ?? null;
  }

  try {
    return converter(await requisicao<DoadorDaApi>(`/doadores/${id}`));
  } catch (erro) {
    if (erro instanceof ErroDeApi && erro.status === 404) return null;
    throw erro;
  }
}

// POST /doadores (DOADOR para si mesmo, ou ADMIN/RECEPCAO)
export async function cadastrarDoador(dados: NovoDoador): Promise<Doador> {
  if (USAR_MOCK) {
    await esperar(500);
    return { ...dados, doador_id: Date.now(), doador_status: 1 };
  }
  return converter(await requisicao<DoadorDaApi>("/doadores", { metodo: "POST", corpo: dados }));
}

// PUT /doadores/:id. Mesmo que a tela mande campos a mais, só os 5 permitidos seguem para a API.
export async function atualizarDoador(id: number, dados: DadosParaAtualizar): Promise<Doador> {
  const corpo: DadosParaAtualizar = {};
  for (const campo of CAMPOS_EDITAVEIS) {
    if (dados[campo] !== undefined) corpo[campo] = dados[campo] as never;
  }

  if (USAR_MOCK) {
    await esperar(500);
    const atual = doadoresMock.find((item) => item.doador.doador_id === id)?.doador ?? doadorLogadoMock;
    return { ...atual, ...corpo };
  }
  return converter(await requisicao<DoadorDaApi>(`/doadores/${id}`, { metodo: "PUT", corpo }));
}

// DELETE /doadores/:id (ADMIN/RECEPCAO). Não apaga, só deixa o doador inativo.
export async function inativarDoador(id: number): Promise<void> {
  if (USAR_MOCK) {
    await esperar(300);
    return;
  }
  await requisicao<{ mensagem: string }>(`/doadores/${id}`, { metodo: "DELETE" });
}