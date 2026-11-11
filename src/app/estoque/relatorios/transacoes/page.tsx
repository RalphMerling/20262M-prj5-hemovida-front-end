
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import Sidebar from "@/components/Sidebar";

// TIPOS DE DADOS
type TipoMovimentacao = "Entrada" | "Saída";

type StatusTransacao =
  | "Concluída"
  | "Pendente"
  | "Cancelada";

type Transacao = {
  id: string;
  data: string;
  tipoSanguineo: string;
  movimentacao: TipoMovimentacao;
  status: StatusTransacao;
};

type Filtros = {
  periodo: string;
  tipo: string;
  status: string;
};

// TIPOS SANGUÍNEOS
const tiposSanguineos = [
  "A+",
  "A-",
  "B+",
  "B-",
  "O+",
  "O-",
  "AB+",
  "AB-",
];

// DATA DE REFERÊNCIA DA DEMONSTRAÇÃO
const DATA_REFERENCIA = "2026-11-11";

// DISTRIBUIÇÃO DE 68 TRANSAÇÕES SIMULADAS
const distribuicaoDiaria = [
  { data: "2026-11-04", quantidade: 10 },
  { data: "2026-11-05", quantidade: 14 },
  { data: "2026-11-06", quantidade: 11 },
  { data: "2026-11-07", quantidade: 6 },
  { data: "2026-11-08", quantidade: 16 },
  { data: "2026-11-09", quantidade: 5 },
  { data: "2026-11-10", quantidade: 4 },
  { data: "2026-11-11", quantidade: 2 },
];

// GERAR REGISTROS SIMULADOS
const transacoes: Transacao[] = [];

let contador = 0;

distribuicaoDiaria.forEach((dia) => {
  for (let i = 0; i < dia.quantidade; i++) {
    const indice = contador;
    contador++;

    // 28 ENTRADAS E 40 SAÍDAS
    const movimentacao: TipoMovimentacao =
      indice % 17 < 7 ? "Entrada" : "Saída";

    let status: StatusTransacao = "Concluída";

    if (contador % 11 === 0) {
      status = "Cancelada";
    } else if (contador % 5 === 0) {
      status = "Pendente";
    }

    transacoes.push({
      id: `TR-${String(contador).padStart(3, "0")}`,
      data: dia.data,
      tipoSanguineo:
        tiposSanguineos[
          indice % tiposSanguineos.length
        ],
      movimentacao,
      status,
    });
  }
});

// FORMATAR DATA
function formatarData(data: string) {
  const [ano, mes, dia] = data.split("-");
  return `${dia}/${mes}`;
}

// GRÁFICO DE ROSCA
function GraficoRosca({
  entradas,
  saidas,
}: {
  entradas: number;
  saidas: number;
}) {
  const total = entradas + saidas;

  const raio = 75;
  const circunferencia = 2 * Math.PI * raio;

  const percentualEntradas =
    total > 0 ? entradas / total : 0;

  const percentualSaidas =
    total > 0 ? saidas / total : 0;

  const comprimentoEntradas =
    percentualEntradas * circunferencia;

  const comprimentoSaidas =
    percentualSaidas * circunferencia;

  const legenda = [
    {
      nome: "Saídas",
      valor: saidas,
      cor: "#14528F",
    },
    {
      nome: "Entradas",
      valor: entradas,
      cor: "#98D8E2",
    },
  ];

  return (
    <div className="flex flex-col items-center">
      <svg
        viewBox="0 0 220 220"
        className="h-[230px] w-[230px]"
        role="img"
        aria-label={`Entradas: ${entradas}; Saídas: ${saidas}`}
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

        {/* ENTRADAS */}
        {entradas > 0 && (
          <circle
            cx="110"
            cy="110"
            r={raio}
            fill="none"
            stroke="#98D8E2"
            strokeWidth="38"
            strokeDasharray={`${comprimentoEntradas} ${
              circunferencia - comprimentoEntradas
            }`}
            transform="rotate(-90 110 110)"
          />
        )}

        {/* SAÍDAS */}
        {saidas > 0 && (
          <circle
            cx="110"
            cy="110"
            r={raio}
            fill="none"
            stroke="#14528F"
            strokeWidth="38"
            strokeDasharray={`${comprimentoSaidas} ${
              circunferencia - comprimentoSaidas
            }`}
            strokeDashoffset={-comprimentoEntradas}
            transform="rotate(-90 110 110)"
          />
        )}

        {/* SETAS CENTRAIS */}
        <g
          fill="none"
          stroke="#14528F"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M97 105 H122 L116 99" />
          <path d="M122 105 L116 111" />
          <path d="M123 118 H98 L104 112" />
          <path d="M98 118 L104 124" />
        </g>
      </svg>

      {/* LEGENDA */}
      <div className="mt-3 w-full max-w-[240px] space-y-3">
        {legenda.map((item) => (
          <div
            key={item.nome}
            className="flex items-center gap-3 text-sm text-black"
          >
            <span
              className="h-4 w-4 rounded-full"
              style={{
                backgroundColor: item.cor,
              }}
            />

            <span className="flex-1">
              {item.nome}
            </span>

            <span className="font-medium">
              {total > 0
                ? Math.round((item.valor / total) * 100)
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
  dados: {
    data: string;
    quantidade: number;
  }[];
}) {
  const alturaMaxima = 240;

  const valorMaximo = Math.max(
    20,
    ...dados.map(
      (item) => item.quantidade
    )
  );

  const limiteEixo =
    Math.ceil(valorMaximo / 5) * 5;

  return (
    <div className="w-full">
      <div className="flex gap-3">

        {/* EIXO VERTICAL */}
        <div
          className="flex w-8 flex-col justify-between text-right text-sm text-gray-700"
          style={{
            height: alturaMaxima,
          }}
        >
          {[4, 3, 2, 1, 0].map(
            (indice) => (
              <span key={indice}>
                {(limiteEixo / 4) * indice}
              </span>
            )
          )}
        </div>

        {/* ÁREA DO GRÁFICO */}
        <div
          className="relative min-w-0 flex-1 border-b border-l border-gray-300"
          style={{
            height: alturaMaxima,
          }}
        >

          {/* LINHAS HORIZONTAIS */}
          {[0, 25, 50, 75, 100].map(
            (posicao) => (
              <div
                key={posicao}
                className="absolute left-0 right-0 border-t border-gray-300"
                style={{
                  top: `${posicao}%`,
                }}
              />
            )
          )}

          {/* BARRAS */}
          <div className="absolute inset-0 flex items-end justify-around gap-3 px-3">
            {dados.map((item) => {
              const altura =
                (item.quantidade /
                  limiteEixo) *
                100;

              return (
                <div
                  key={item.data}
                  className="flex h-full min-w-0 flex-1 items-end justify-center"
                >
                  <div
                    title={`${formatarData(
                      item.data
                    )}: ${
                      item.quantidade
                    } transações`}
                    className="w-full max-w-[46px] bg-[#14528F]"
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

      {/* DATAS */}
      <div className="ml-11 mt-3 flex justify-around gap-3 px-3">
        {dados.map((item) => (
          <div
            key={item.data}
            className="min-w-0 flex-1 text-center text-xs font-medium text-black"
          >
            {formatarData(item.data)}
          </div>
        ))}
      </div>
    </div>
  );
}

// PÁGINA RELATÓRIO DE TRANSAÇÕES
export default function RelatorioTransacoesPage() {
  const [periodo, setPeriodo] =
    useState("30");

  const [tipo, setTipo] =
    useState("Todos");

  const [status, setStatus] =
    useState("Todos");

  // FILTROS APLICADOS
  const [filtros, setFiltros] =
    useState<Filtros>({
      periodo: "30",
      tipo: "Todos",
      status: "Todos",
    });

  // FILTRAR TRANSAÇÕES
  const transacoesFiltradas = useMemo(() => {
    const referencia = new Date(
      `${DATA_REFERENCIA}T12:00:00Z`
    ).getTime();

    return transacoes.filter(
      (transacao) => {
        const dataTransacao = new Date(
          `${transacao.data}T12:00:00Z`
        ).getTime();

        const diferencaDias = Math.floor(
          (referencia -
            dataTransacao) /
            86400000
        );

        const atendePeriodo =
          filtros.periodo === "Todos" ||
          (diferencaDias >= 0 &&
            diferencaDias <
              Number(filtros.periodo));

        const atendeTipo =
          filtros.tipo === "Todos" ||
          transacao.tipoSanguineo ===
            filtros.tipo;

        const atendeStatus =
          filtros.status === "Todos" ||
          transacao.status ===
            filtros.status;

        return (
          atendePeriodo &&
          atendeTipo &&
          atendeStatus
        );
      }
    );
  }, [filtros]);

  // INDICADORES
  const total =
    transacoesFiltradas.length;

  const entradas =
    transacoesFiltradas.filter(
      (transacao) =>
        transacao.movimentacao ===
        "Entrada"
    ).length;

  const saidas =
    transacoesFiltradas.filter(
      (transacao) =>
        transacao.movimentacao ===
        "Saída"
    ).length;

  // GRÁFICO POR DATA
  const dadosGrafico =
    distribuicaoDiaria.map((dia) => ({
      data: dia.data,

      quantidade:
        transacoesFiltradas.filter(
          (transacao) =>
            transacao.data === dia.data
        ).length,
    }));

  // GERAR RELATÓRIO
  function gerarRelatorio(
    evento: FormEvent<HTMLFormElement>
  ) {
    evento.preventDefault();

    setFiltros({
      periodo,
      tipo,
      status,
    });
  }

  return (
    <div className="flex min-h-screen bg-[#E1E4E9]">

      {/* MENU COMPARTILHADO */}
      <Sidebar />

      {/* CONTEÚDO PRINCIPAL */}
      <main className="min-w-0 flex-1 px-10 py-12">

        {/* TÍTULO */}
        <h1 className="mb-7 text-2xl font-bold text-[#203A60]">
          Relatórios
        </h1>

        {/* ABAS */}
        <div className="mb-12 flex gap-6">

          <Link
            href="/estoque/relatorios"
            className="pb-2 text-lg font-semibold text-[#71819B] hover:text-[#203A60]"
          >
            Estoque
          </Link>

          <span className="border-b-[3px] border-[#203A60] pb-2 text-lg font-bold text-[#203A60]">
            Transações
          </span>
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
              onChange={(evento) =>
                setPeriodo(
                  evento.target.value
                )
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
              onChange={(evento) =>
                setTipo(
                  evento.target.value
                )
              }
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-3 text-sm text-black"
            >
              <option value="Todos">
                Todos
              </option>

              {tiposSanguineos.map(
                (item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                )
              )}
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
              onChange={(evento) =>
                setStatus(
                  evento.target.value
                )
              }
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-3 text-sm text-black"
            >
              <option value="Todos">
                Todos
              </option>

              <option value="Concluída">
                Concluída
              </option>

              <option value="Pendente">
                Pendente
              </option>

              <option value="Cancelada">
                Cancelada
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
        <section className="mb-10 grid grid-cols-3 gap-5">
          {[
            {
              titulo: "Total de transações",
              valor: total,
            },
            {
              titulo: "Entradas",
              valor: entradas,
            },
            {
              titulo: "Saídas",
              valor: saidas,
            },
          ].map((indicador) => (
            <div
              key={indicador.titulo}
              className="flex min-h-[100px] flex-col justify-between bg-white p-5"
            >
              <h2 className="text-sm font-medium text-gray-800">
                {indicador.titulo}
              </h2>

              <p className="text-4xl font-bold text-[#14528F]">
                {indicador.valor}
              </p>
            </div>
          ))}
        </section>

        {/* GRÁFICOS */}
        <section className="grid grid-cols-[1fr_2fr] gap-4">

          {/* GRÁFICO DE ROSCA */}
          <div className="rounded-lg bg-white px-5 py-7 shadow-sm">

            <h2 className="mb-6 text-center text-sm font-semibold text-black">
              Tipos de transação
            </h2>

            <GraficoRosca
              entradas={entradas}
              saidas={saidas}
            />
          </div>

          {/* GRÁFICO DE BARRAS */}
          <div className="bg-white px-7 py-7">

            <h2 className="mb-6 text-sm font-semibold text-black">
              Transações por período
            </h2>

            <div className="mt-10">
              <GraficoBarras
                dados={dadosGrafico}
              />
            </div>
          </div>
        </section>

        {/* OBSERVAÇÃO */}
       {/*  <p className="mt-5 text-xs text-gray-600">
          Dados simulados para fins acadêmicos.
          Referência: 11/11/2026.
          Os filtros são aplicados aos registros
          desta demonstração. Nenhuma informação
          foi consultada no banco de dados.
        </p> */}

        {/* VOLTAR */}
        <div className="mt-10 flex justify-end">
          <Link
            href="/estoque/transacoes"
            className="flex h-11 items-center justify-center rounded-lg border border-black bg-white px-10 text-sm font-semibold text-black hover:bg-gray-100"
          >
            Voltar
          </Link>
        </div>
      </main>
    </div>
  );
}
