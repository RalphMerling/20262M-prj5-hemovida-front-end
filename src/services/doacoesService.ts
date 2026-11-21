import { doadoresMock } from "@/data/mock";
import type { ItemHistorico } from "@/data/mock";
import { USAR_MOCK, esperar } from "@/services/api";

// Histórico de doações de um doador (usado na ficha da recepção).
export async function buscarHistoricoDoDoador(doadorId: number): Promise<ItemHistorico[]> {
  if (USAR_MOCK) {
    await esperar(300);
    return doadoresMock.find((item) => item.doador.doador_id === doadorId)?.historico ?? [];
  }

  // TODO: o back ainda não tem rota para o histórico de doações. Enquanto isso, devolve vazio.
  return [];
}