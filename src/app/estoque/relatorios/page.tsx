
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import Sidebar from "@/components/Sidebar";

// TIPOS DE DADOS
type StatusBolsa = "Disponível" | "Em uso" | "Vencida";

type BolsaRelatorio = {
  id: string;
  tipo: string;
  status: StatusBolsa;
  entrada: string;
};

type Filtros = {
  periodo: string;
  tipo: string;
  status: string;
};

// DISTRIBUIÇÃO DO DASHBOARD: 248 BOLSAS
const estoquePorTipo = [
  { tipo: "A+", quantidade: 50 },
  { tipo: "A-", quantidade: 21 },
  { tipo: "B+", quantidade: 41 },
  { tipo: "B-", quantidade: 16 },
  { tipo: "O+", quantidade: 68 },
  { tipo: "O-", quantidade: 25 },
  { tipo: "AB+", quantidade: 17 },
  { tipo: "AB-", quantidade: 10 },
];

const TOTAL_ESTOQUE = estoquePorTipo.reduce(
  (total, item) => total + item.quantidade,
  0
);

// DATA DE REFERÊNCIA DA DEMONSTRAÇÃO
const DATA_REFERENCIA = "2026-11-11";

// GERAR 248 REGISTROS SIMULADOS
const bolsasSimuladas: BolsaRelatorio[] = [];

let contador = 0;

estoquePorTipo.forEach((item) => {
  for (let i = 0; i < item.quantidade; i++) {
    contador++;

    let status: StatusBolsa = "Disponível";

    if (contador > 236) {
      status = "Vencida";
    } else if (contador > 219) {
      status = "Em uso";
    }

    const data = new Date(
      "2026-11-11T12:00:00Z"
    );

    data.setUTCDate(
      data.getUTCDate() - ((contador - 1) % 28)
    );

    bolsasSimuladas.push({
      id: `BOL-${String(contador).padStart(3, "0")}`,
      tipo: item.tipo,
      status,
      entrada: data.toISOString().slice(0, 10),
    });
  }
});

// CORES DOS STATUS
const coresStatus = [
  { nome: "Disponíveis", cor: "#870D16" },
  { nome: "Em uso", cor: "#E52A37" },
  { nome: "Vencidas", cor: "#FFC7CC" },
];

// GRÁFICO DE ROSCA
function GraficoRosca({
  disponiveis,
  emUso,
  vencidas,
}: {
  disponiveis: number;
  emUso: number;
  vencidas: number;
}) {
  const valores = [disponiveis, emUso, vencidas];

  const total = valores.reduce(
    (soma, valor) => soma + valor,
    0
  );

  const raio = 78;
  const circunferencia = 2 * Math.PI * raio;

  let acumulado = 0;

  const segmentos = valores.map((valor, index) => {
    const comprimento =
      total > 0
        ? (valor / total) * circunferencia
        : 0;

    const segmento = {
      cor: coresStatus[index].cor,
      comprimento,
      deslocamento: -acumulado,
    };

    acumulado += comprimento;
    return segmento;
  });

  return (
    <div className="flex flex-col items-center">
      <svg
        viewBox="0 0 220 220"
        className="h-[230px] w-[230px]"
        role="img"
        aria-label="Distribuição das bolsas por status"
      >
        {/* CÍRCULO DE FUNDO */}
        <circle
          cx="110"
          cy="110"
          r={raio}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth="38"
        />

        {/* SEGMENTOS */}
        {segmentos.map((segmento, index) => (
          <circle
            key={index}
            cx="110"
            cy="110"
            r={raio}
            fill="none"
            stroke={segmento.cor}
            strokeWidth="38"
            strokeDasharray={
              `${segmento.comprimento} ` +
              `${circunferencia - segmento.comprimento}`
            }
            strokeDashoffset={segmento.deslocamento}
            transform="rotate(-90 110 110)"
          />
        ))}

        {/* GOTA CENTRAL */}
        <path
          d="M110 91 C104 102 97 109 97 117
             A13 13 0 0 0 123 117
             C123 109 116 102 110 91Z"
          fill="none"
          stroke="#870D16"
          strokeWidth="2"
        />
      </svg>

      {/* LEGENDA */}
      <div className="mt-2 w-full max-w-[240px] space-y-3">
        {valores.map((valor, index) => (
          <div
            key={coresStatus[index].nome}
            className="flex items-center gap-3 text-sm text-black"
          >
            <span
              className="h-4 w-4 rounded-full"
              style={{
                backgroundColor: coresStatus[index].cor,
              }}
            />

            <span className="flex-1">
              {coresStatus[index].nome}
            </span>

            <span className="font-medium">
              {total > 0
                ? Math.round((valor / total) * 100)
                : 0}
              %
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// GRÁFICO DE BARRAS
function GraficoBarras({
  dados,
}: {
  dados: { tipo: string; quantidade: number }[];
}) {
  const alturaMaxima = 240;
  const valorMaximo = 80;

  return (
    <div className="w-full">
      <div className="flex gap-3">
        {/* EIXO VERTICAL */}
        <div
          className="flex w-7 flex-col justify-between text-right text-sm text-gray-700"
          style={{ height: alturaMaxima }}
        >
          <span>80</span>
          <span>60</span>
          <span>40</span>
          <span>20</span>
          <span>0</span>
        </div>

        {/* ÁREA DO GRÁFICO */}
        <div
          className="relative min-w-0 flex-1 border-b border-l border-gray-300"
          style={{ height: alturaMaxima }}
        >
          {/* LINHAS HORIZONTAIS */}
          {[0, 25, 50, 75, 100].map((posicao) => (
            <div
              key={posicao}
              className="absolute left-0 right-0 border-t border-gray-300"
              style={{ top: `${posicao}%` }}
            />
          ))}

          {/* BARRAS */}
          <div className="absolute inset-0 flex items-end justify-around gap-3 px-3">
            {dados.map((item) => {
              const altura =
                (item.quantidade / valorMaximo) * 100;

              return (
                <div
                  key={item.tipo}
                  className="flex h-full min-w-0 flex-1 items-end justify-center"
                >
                  <div
                    title={`${item.tipo}: ${item.quantidade} bolsas`}
                    className="w-full max-w-[46px] bg-[#B32630]"
                    style={{
                      height: `${altura}%`,
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* RÓTULOS DOS TIPOS SANGUÍNEOS */}
      <div className="ml-10 mt-3 flex justify-around gap-3 px-3">
        {dados.map((item) => (
          <div
            key={item.tipo}
            className="min-w-0 flex-1 text-center text-xs font-medium text-black"
          >
            {item.tipo}
          </div>
        ))}
      </div>
    </div>
  );
}

// PÁGINA DE RELATÓRIO DE ESTOQUE
export default function RelatoriosEstoquePage() {
  const [periodo, setPeriodo] = useState("30");
  const [tipo, setTipo] = useState("Todos");
  const [status, setStatus] = useState("Todos");

  // FILTROS APLICADOS
  const [filtros, setFiltros] = useState<Filtros>({
    periodo: "30",
    tipo: "Todos",
    status: "Todos",
  });

  // FILTRAR BOLSAS
  const bolsasFiltradas = useMemo(() => {
    const referencia = new Date(
      `${DATA_REFERENCIA}T12:00:00Z`
    ).getTime();

    return bolsasSimuladas.filter((bolsa) => {
      const entrada = new Date(
        `${bolsa.entrada}T12:00:00Z`
      ).getTime();

      const diferencaDias = Math.floor(
        (referencia - entrada) / 86400000
      );

      const atendePeriodo =
        filtros.periodo === "Todos" ||
        diferencaDias < Number(filtros.periodo);

      const atendeTipo =
        filtros.tipo === "Todos" ||
        bolsa.tipo === filtros.tipo;

      const atendeStatus =
        filtros.status === "Todos" ||
        bolsa.status === filtros.status;

      return (
        atendePeriodo &&
        atendeTipo &&
        atendeStatus
      );
    });
  }, [filtros]);

  // INDICADORES
  const total = bolsasFiltradas.length;

  const disponiveis = bolsasFiltradas.filter(
    (bolsa) => bolsa.status === "Disponível"
  ).length;

  const emUso = bolsasFiltradas.filter(
    (bolsa) => bolsa.status === "Em uso"
  ).length;

  const vencidas = bolsasFiltradas.filter(
    (bolsa) => bolsa.status === "Vencida"
  ).length;

  // DADOS DO GRÁFICO POR TIPO SANGUÍNEO
  const dadosGrafico = estoquePorTipo.map((item) => ({
    tipo: item.tipo,
    quantidade: bolsasFiltradas.filter(
      (bolsa) => bolsa.tipo === item.tipo
    ).length,
  }));

  // GERAR RELATÓRIO
  function gerarRelatorio(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setFiltros({
      periodo,
      tipo,
      status,
    });
  }

  return (
    <div className="flex min-h-screen bg-[#E1E4E9]">

      {/* MENU LATERAL COMPARTILHADO */}
      <Sidebar />

      {/* CONTEÚDO PRINCIPAL */}
      <main className="min-w-0 flex-1 px-10 py-12">

        {/* TÍTULO */}
        <h1 className="mb-7 text-2xl font-bold text-[#203A60]">
          Relatórios
        </h1>

        {/* ABAS */}
        <div className="mb-12 flex gap-6">
          <span className="border-b-[3px] border-[#203A60] pb-2 text-lg font-bold text-[#203A60]">
            Estoque
          </span>

          <Link
            href="/estoque/relatorios/transacoes"
            className="pb-2 text-lg font-semibold text-[#71819B] hover:text-[#203A60]"
          >
            Transações
          </Link>
        </div>

        {/* FILTROS */}
        <form
          onSubmit={gerarRelatorio}
          className="mb-16 grid grid-cols-[1fr_1fr_1fr_auto] items-end gap-6"
        >
          {/* PERÍODO */}
          <div>
            <label
              htmlFor="periodo"
              className="mb-3 block text-lg font-semibold text-[#203A60]"
            >
              Período
            </label>

            <select
              id="periodo"
              value={periodo}
              onChange={(e) =>
                setPeriodo(e.target.value)
              }
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-3 text-sm text-black"
            >
              <option value="7">
                Últimos 7 dias
              </option>
              <option value="30">
                Últimos 30 dias
              </option>
              <option value="90">
                Últimos 90 dias
              </option>
              <option value="Todos">
                Todo o período
              </option>
            </select>
          </div>

          {/* TIPO SANGUÍNEO */}
          <div>
            <label
              htmlFor="tipoSanguineo"
              className="mb-3 block text-lg font-semibold text-[#203A60]"
            >
              Tipo sanguíneo
            </label>

            <select
              id="tipoSanguineo"
              value={tipo}
              onChange={(e) =>
                setTipo(e.target.value)
              }
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-3 text-sm text-black"
            >
              <option value="Todos">
                Todos
              </option>

              {estoquePorTipo.map((item) => (
                <option
                  key={item.tipo}
                  value={item.tipo}
                >
                  {item.tipo}
                </option>
              ))}
            </select>
          </div>

          {/* STATUS */}
          <div>
            <label
              htmlFor="status"
              className="mb-3 block text-lg font-semibold text-[#203A60]"
            >
              Status
            </label>

            <select
              id="status"
              value={status}
              onChange={(e) =>
                setStatus(e.target.value)
              }
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-3 text-sm text-black"
            >
              <option value="Todos">
                Todos
              </option>
              <option value="Disponível">
                Disponível
              </option>
              <option value="Em uso">
                Em uso
              </option>
              <option value="Vencida">
                Vencida
              </option>
            </select>
          </div>

          {/* GERAR RELATÓRIO */}
          <button
            type="submit"
            className="h-[46px] whitespace-nowrap rounded border border-blue-900 bg-[#1673EB] px-5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Gerar relatório
          </button>
        </form>

        {/* INDICADORES */}
        <section className="mb-10 grid grid-cols-4 gap-3">
          {[
            {
              titulo: "Total de bolsas no estoque",
              valor: total,
            },
            {
              titulo: "Disponíveis",
              valor: disponiveis,
            },
            {
              titulo: "Em uso",
              valor: emUso,
            },
            {
              titulo: "Vencidas",
              valor: vencidas,
            },
          ].map((indicador) => (
            <div
              key={indicador.titulo}
              className="flex min-h-[100px] flex-col justify-between bg-white p-5"
            >
              <h2 className="text-sm font-medium text-gray-800">
                {indicador.titulo}
              </h2>

              <p className="text-4xl font-bold text-[#B32630]">
                {indicador.valor}
              </p>
            </div>
          ))}
        </section>

        {/* GRÁFICOS */}
        <section className="grid grid-cols-[1fr_2fr] gap-4">

          {/* ROSCA */}
          <div className="rounded-lg bg-white px-5 py-7 shadow-sm">
            <h2 className="mb-6 text-center text-sm font-semibold text-black">
              Status das bolsas
            </h2>

            <GraficoRosca
              disponiveis={disponiveis}
              emUso={emUso}
              vencidas={vencidas}
            />
          </div>

          {/* BARRAS */}
          <div className="bg-white px-7 py-7">
            <h2 className="mb-6 text-sm font-semibold text-black">
              Estoque por tipo sanguíneo
            </h2>

            <div className="mt-10">
              <GraficoBarras dados={dadosGrafico} />
            </div>
          </div>
        </section>

        {/* OBSERVAÇÃO SOBRE OS DADOS */}
       {/*  <p className="mt-5 text-xs text-gray-600">
          Dados simulados para fins acadêmicos.
          Referência: 11/11/2026.
          O filtro de período considera a data de
          entrada das bolsas na simulação.
          Nenhuma informação foi consultada na API.
        </p> */}

        {/* VOLTAR */}
        <div className="mt-10 flex justify-end">
          <Link
            href="/estoque/transacoes"
            className="rounded-lg border border-black bg-white px-10 py-3 text-sm font-semibold text-black hover:bg-gray-100"
          >
            Voltar
          </Link>
        </div>

        {/* VERIFICAÇÃO DO TOTAL */}
        {TOTAL_ESTOQUE !== 248 && (
          <p className="mt-4 text-red-700">
            Atenção: o total simulado está inconsistente.
          </p>
        )}
      </main>
    </div>
  );
}
