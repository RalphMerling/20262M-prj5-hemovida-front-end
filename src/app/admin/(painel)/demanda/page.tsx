"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { BannerGestor } from "@/components/demanda/BannerGestor";
import { CartaoIndicador } from "@/components/demanda/CartaoIndicador";
import { calcularIndicadores } from "@/components/demanda/pedidoHelpers";
import { TabelaPedidos } from "@/components/demanda/TabelaPedidos";
import { usePedidos } from "@/components/demanda/usePedidos";
import { Alert } from "@/components/ui/Alert";
import { Card } from "@/components/ui/Card";
import { Rosquinha } from "@/components/ui/Rosquinha";
import { componentesEmergenciaisMock, componentesRegularesMock } from "@/data/mock";
import { dataDaApiParaTela } from "@/services/pedidosService";

// Mesma ordem dos nomes nos dados: hemácias, plaquetas, plasma, crioprecipitado.
const coresDasFatias = [
  "var(--color-vermelho-2)",
  "var(--color-vermelho-1)",
  "color-mix(in srgb, var(--color-vermelho-1) 30%, white)",
  "var(--color-azul-3)",
];

// 3.17 vira "3,17%". O sinal fica por conta da setinha. Sem como comparar (null), mostra um traço.
function formatarPercentual(valor: number | null): string {
  return valor === null ? "\u2014" : `${Math.abs(valor).toFixed(2).replace(".", ",")}%`;
}

function tendenciaDe(valor: number | null): "alta" | "baixa" | undefined {
  if (valor === null || valor === 0) return undefined;
  return valor < 0 ? "baixa" : "alta";
}

// Tela inicial do gestor de demanda: /admin/demanda
export default function Demanda() {
  const { pedidos, carregando, erro } = usePedidos();

  // Os 4 cartões são calculados com os pedidos de verdade. As rosquinhas ainda são fixas:
  // a lista da API não traz os itens, e somar tudo exigiria uma rota nova no MS3.
  const agora = dataDaApiParaTela(new Date().toISOString());
  const { total, dias, media, variacaoRegulares, variacaoEmergenciais } = calcularIndicadores(pedidos, agora);

  const recentes = [...pedidos].sort((a, b) => b.criadoEm.localeCompare(a.criadoEm)).slice(0, 4);

  const fatiasRegulares = componentesRegularesMock.map((c, i) => ({ ...c, cor: coresDasFatias[i] }));
  const fatiasEmergenciais = componentesEmergenciaisMock.map((c, i) => ({ ...c, cor: coresDasFatias[i] }));

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      <div className="md:col-span-2 xl:col-span-4">
        <BannerGestor hospital="Hospital Central" />
      </div>

      {erro && (
        <div className="md:col-span-2 xl:col-span-4">
          <Alert tipo="erro">{erro}</Alert>
        </div>
      )}

      <CartaoIndicador rotulo={`Solicitações nos últimos ${dias} dias`} valor={String(total)} />
      <CartaoIndicador
        rotulo="Solicitações Regulares"
        valor={formatarPercentual(variacaoRegulares)}
        tendencia={tendenciaDe(variacaoRegulares)}
      />
      <CartaoIndicador
        rotulo="Solicitações Emergenciais"
        valor={formatarPercentual(variacaoEmergenciais)}
        tendencia={tendenciaDe(variacaoEmergenciais)}
      />
      <CartaoIndicador rotulo="Média de solicitações por dia" valor={media.toFixed(1).replace(".", ",")} />

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
        {carregando ? <p className="text-sm text-preto/70">Carregando pedidos...</p> : <TabelaPedidos pedidos={recentes} />}
      </Card>
    </div>
  );
}
