import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { BannerGestor } from "@/components/demanda/BannerGestor";
import { CartaoIndicador } from "@/components/demanda/CartaoIndicador";
import { TabelaPedidos } from "@/components/demanda/TabelaPedidos";
import { Card } from "@/components/ui/Card";
import { Rosquinha } from "@/components/ui/Rosquinha";
import {
  componentesEmergenciaisMock,
  componentesRegularesMock,
  indicadoresDemandaMock,
  pedidosMock,
} from "@/data/mock";

// Mesma ordem dos nomes nos dados: hemácias, plaquetas, plasma, outros.
const coresDasFatias = [
  "var(--color-vermelho-2)",
  "var(--color-vermelho-1)",
  "color-mix(in srgb, var(--color-vermelho-1) 30%, white)",
  "var(--color-azul-3)",
];

// 3.17 vira "3,17%". O sinal fica por conta da setinha.
function formatarPercentual(valor: number): string {
  return `${Math.abs(valor).toFixed(2).replace(".", ",")}%`;
}

// Tela inicial do gestor de demanda: /admin/demanda
export default function Demanda() {
  // TODO: trocar os mocks pelas chamadas à API.
  const { totalPeriodo, diasPeriodo, variacaoRegulares, variacaoEmergenciais } = indicadoresDemandaMock;
  const media = (totalPeriodo / diasPeriodo).toFixed(1).replace(".", ",");

  const recentes = [...pedidosMock].sort((a, b) => b.criadoEm.localeCompare(a.criadoEm)).slice(0, 4);

  const fatiasRegulares = componentesRegularesMock.map((c, i) => ({ ...c, cor: coresDasFatias[i] }));
  const fatiasEmergenciais = componentesEmergenciaisMock.map((c, i) => ({ ...c, cor: coresDasFatias[i] }));

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      <div className="md:col-span-2 xl:col-span-4">
        <BannerGestor hospital="Hospital Central" />
      </div>

      <CartaoIndicador rotulo={`Solicitações nos últimos ${diasPeriodo} dias`} valor={String(totalPeriodo)} />
      <CartaoIndicador
        rotulo="Solicitações Regulares"
        valor={formatarPercentual(variacaoRegulares)}
        tendencia={variacaoRegulares < 0 ? "baixa" : "alta"}
      />
      <CartaoIndicador
        rotulo="Solicitações Emergenciais"
        valor={formatarPercentual(variacaoEmergenciais)}
        tendencia={variacaoEmergenciais < 0 ? "baixa" : "alta"}
      />
      <CartaoIndicador rotulo="Média de solicitações por dia" valor={media} />

      <Card titulo="Tendência de Solicitações Regulares dos últimos 90 dias" className="xl:col-span-2">
        <Rosquinha fatias={fatiasRegulares} />
      </Card>
      <Card titulo="Tendência de Solicitações Emergenciais dos últimos 90 dias" className="xl:col-span-2">
        <Rosquinha fatias={fatiasEmergenciais} />
      </Card>

      <Card className="md:col-span-2 xl:col-span-4">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-xl text-azul-1">Histórico de solicitações</h2>
          <Link
            href="/admin/demanda/historico"
            className="flex items-center gap-1 text-sm font-semibold text-azul-2 hover:underline"
          >
            Ver tabela completa
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
        <TabelaPedidos pedidos={recentes} />
      </Card>
    </div>
  );
}
