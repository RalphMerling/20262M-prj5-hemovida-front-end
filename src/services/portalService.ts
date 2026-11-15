import { avisosMock, historicoDoadorMock } from "@/data/mock";
import type { Aviso, DoacaoDoHistorico } from "@/models/portal";
import { USAR_MOCK } from "@/services/api";
import { buscarMeuCadastro } from "@/services/doadoresService";

export type DadosDoPortal = {
  doador: Awaited<ReturnType<typeof buscarMeuCadastro>>;
  historico: DoacaoDoHistorico[];
  avisos: Aviso[];
};

// Carrega tudo que o portal do doador precisa de uma vez só.
export async function carregarPortal(): Promise<DadosDoPortal> {
  const doador = await buscarMeuCadastro();

  if (USAR_MOCK) {
    // Para ver a tela do doador novo (sem doações), troque por: historico: []
    return { doador, historico: historicoDoadorMock, avisos: avisosMock };
  }

  // TODO: quando o back tiver as rotas de histórico e avisos, buscar aqui.
  // Por enquanto, em modo real, as duas listas vêm vazias.
  return { doador, historico: [], avisos: [] };
}