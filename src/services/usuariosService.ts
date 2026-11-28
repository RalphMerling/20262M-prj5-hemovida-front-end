import { USAR_MOCK, requisicao } from "@/services/api";

// Resposta de GET /usuarios/nomes?ids=1,13 (MS4). O gestor de demanda só enxerga gestores do próprio hospital:
// ids de fora simplesmente não vêm na lista.
interface NomeDaApi {
  id: number;
  nomeCompleto: string | null;
}

// Devolve { 13: "Lais Lopes" }. No mock devolve vazio: os pedidos de mentira já trazem o nome.
export async function buscarNomes(ids: number[]): Promise<Record<number, string>> {
  const unicos = [...new Set(ids)].filter((id) => Number.isInteger(id) && id > 0);
  if (USAR_MOCK || unicos.length === 0) return {};

  const lista = await requisicao<NomeDaApi[]>(`/usuarios/nomes?ids=${unicos.join(",")}`);
  const nomes: Record<number, string> = {};
  for (const usuario of lista) {
    if (usuario.nomeCompleto) nomes[usuario.id] = usuario.nomeCompleto;
  }
  return nomes;
}
