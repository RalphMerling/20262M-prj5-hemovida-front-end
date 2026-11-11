
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import Sidebar from "@/components/Sidebar";

// TIPOS DE TRANSAÇÃO DO HISTÓRICO
type TipoTransacao =
  | "Entrada por doação"
  | "Saída para Hospital"
  | "Saída por descarte";

// STATUS DA TRANSAÇÃO
type StatusTransacao =
  | "Entregue"
  | "Pendente"
  | "Cancelada";

// ESTRUTURA DE UMA TRANSAÇÃO
type Transacao = {
  id: string;
  data: string;
  tipo: TipoTransacao;
  bolsa: string;
  tipoSanguineo: string;
  status: StatusTransacao;
};

// TIPOS SANGUÍNEOS
const tiposSanguineos = [
  "O+",
  "A+",
  "B+",
  "O-",
  "AB+",
  "A-",
  "B-",
  "AB-",
];

// DADOS SIMULADOS: 42 TRANSAÇÕES
const transacoes: Transacao[] = Array.from(
  { length: 42 },
  (_, indice) => {
    const numero = indice + 1;

    const data = new Date(
      Date.UTC(2026, 9, numero)
    );

    let tipo: TipoTransacao;

    if (numero % 3 === 1) {
      tipo = "Saída para Hospital";
    } else if (numero % 3 === 2) {
      tipo = "Entrada por doação";
    } else {
      tipo = "Saída por descarte";
    }

    let status: StatusTransacao = "Entregue";

    if (numero % 9 === 0) {
      status = "Cancelada";
    } else if (numero % 4 === 0) {
      status = "Pendente";
    }

    return {
      id: `TR-${String(numero).padStart(3, "0")}`,
      data: data.toISOString().slice(0, 10),
      tipo,
      bolsa: `BOL-${String(numero).padStart(3, "0")}`,
      tipoSanguineo:
        tiposSanguineos[
          indice % tiposSanguineos.length
        ],
      status,
    };
  }
);

// CONFIGURAÇÃO DA PAGINAÇÃO
const ITENS_POR_PAGINA = 8;

// FORMATAR DATA
function formatarData(data: string): string {
  const [ano, mes, dia] = data.split("-");
  return `${dia}/${mes}/${ano}`;
}

// ÍCONE DE LUPA
function IconeLupa({
  tamanho = 22,
}: {
  tamanho?: number;
}) {
  return (
    <svg
      width={tamanho}
      height={tamanho}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m16 16 5 5" />
    </svg>
  );
}

// DEFINIR A COR DO STATUS
function corStatus(status: StatusTransacao): string {
  switch (status) {
    case "Entregue":
      return "bg-[#D0EEE8]";

    case "Pendente":
      return "bg-[#FFF0D4]";

    case "Cancelada":
      return "bg-[#F9D4D8]";
  }
}

// TELA LISTA DE TRANSAÇÕES
export default function TransacoesPage() {
  // ESTADOS DA PESQUISA E PAGINAÇÃO
  const [busca, setBusca] = useState("");
  const [paginaAtual, setPaginaAtual] = useState(1);

  // FILTRAR TRANSAÇÕES
  const transacoesFiltradas = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    if (!termo) {
      return transacoes;
    }

    return transacoes.filter((transacao) => {
      return (
        transacao.id.toLowerCase().includes(termo) ||
        transacao.tipo.toLowerCase().includes(termo) ||
        transacao.bolsa.toLowerCase().includes(termo) ||
        transacao.tipoSanguineo
          .toLowerCase()
          .includes(termo) ||
        transacao.status.toLowerCase().includes(termo) ||
        formatarData(transacao.data).includes(termo) ||
        transacao.data.includes(termo)
      );
    });
  }, [busca]);

  // TOTAL DE PÁGINAS
  const totalPaginas = Math.max(
    1,
    Math.ceil(
      transacoesFiltradas.length / ITENS_POR_PAGINA
    )
  );

  // ÍNDICE INICIAL DA PÁGINA
  const inicio =
    (paginaAtual - 1) * ITENS_POR_PAGINA;

  // TRANSAÇÕES EXIBIDAS NA PÁGINA
  const transacoesPagina = transacoesFiltradas.slice(
    inicio,
    inicio + ITENS_POR_PAGINA
  );

  // ATUALIZAR PESQUISA
  function atualizarBusca(valor: string) {
    setBusca(valor);
    setPaginaAtual(1);
  }

  return (
    <div className="flex min-h-screen bg-[#E1E4E9]">

      {/* MENU LATERAL COMPARTILHADO */}
      <Sidebar />

      {/* CONTEÚDO PRINCIPAL */}
      <main className="min-w-0 flex-1 px-10 py-12">

        {/* BARRA DE PESQUISA */}
        <div className="mb-10 flex overflow-hidden rounded-md border border-gray-300 bg-white">
          <input
            type="search"
            placeholder="Buscar transação"
            aria-label="Buscar transação"
            value={busca}
            onChange={(evento) =>
              atualizarBusca(evento.target.value)
            }
            className="w-full px-4 py-3 text-gray-700 outline-none"
          />

          <button
            type="button"
            aria-label="Pesquisar"
            className="flex items-center justify-center border-l border-gray-300 bg-gray-200 px-5 text-gray-700"
          >
            <IconeLupa />
          </button>
        </div>

        {/* TÍTULO E BOTÕES */}
        <div className="mb-10 flex items-center justify-between gap-5">

          {/* TÍTULO */}
          <h1 className="text-2xl font-bold text-[#203A60]">
            Transações
          </h1>

          {/* BOTÕES DE AÇÃO */}
          <div className="flex items-center gap-4">

            {/* PRIMEIRO: NOVA TRANSAÇÃO */}
            <Link
              href="/estoque/transacoes/nova"
              className="flex h-11 items-center justify-center whitespace-nowrap rounded border border-[#203A60] bg-[#3F75EC] px-5 text-sm font-semibold text-white hover:bg-[#285FCB]"
            >
              + Nova transação
            </Link>

            {/* SEGUNDO: SOLICITAÇÕES */}
            <Link
              href="/estoque/solicitacoes"
              className="flex h-11 items-center justify-center whitespace-nowrap rounded border border-[#203A60] bg-[#98D8E2] px-6 text-sm font-semibold text-black hover:bg-[#7AC9D6]"
            >
              Solicitações
            </Link>
          </div>
        </div>

        {/* TABELA DE TRANSAÇÕES */}
        <div className="overflow-x-auto bg-white">
          <table className="w-full border-collapse text-center text-sm">

            {/* CABEÇALHO */}
            <thead className="bg-[#D1E1F1] text-[#203A60]">
              <tr>
                <th className="px-3 py-3">
                  ID da Transação
                </th>

                <th className="px-3 py-3">
                  Data
                </th>

                <th className="px-3 py-3">
                  Tipo de Transação
                </th>

                <th className="px-3 py-3">
                  ID da Bolsa
                </th>

                <th className="px-3 py-3">
                  Tipo Sanguíneo
                </th>

                <th className="px-3 py-3">
                  Status
                </th>

                <th className="px-3 py-3">
                  Detalhes
                </th>
              </tr>
            </thead>

            {/* CORPO DA TABELA */}
            <tbody>
              {transacoesPagina.map((transacao) => (
                <tr
                  key={transacao.id}
                  className="h-[66px] border-b border-gray-100 text-black hover:bg-gray-50"
                >

                  {/* ID DA TRANSAÇÃO */}
                  <td className="px-3 font-semibold">
                    {transacao.id}
                  </td>

                  {/* DATA */}
                  <td className="px-3">
                    {formatarData(transacao.data)}
                  </td>

                  {/* TIPO */}
                  <td className="px-3 font-medium">
                    {transacao.tipo}
                  </td>

                  {/* BOLSA */}
                  <td className="px-3 font-medium">
                    {transacao.bolsa}
                  </td>

                  {/* TIPO SANGUÍNEO */}
                  <td className="px-3 font-semibold">
                    {transacao.tipoSanguineo}
                  </td>

                  {/* STATUS */}
                  <td className="px-3">
                    <span
                      className={`inline-block min-w-28 rounded-full px-3 py-2 font-medium text-[#203A60] ${corStatus(
                        transacao.status
                      )}`}
                    >
                      {transacao.status}
                    </span>
                  </td>

                  {/* CONSULTAR DETALHES */}
                  <td className="px-3">
                    <Link
                      href={`/estoque/transacoes/${transacao.id}`}
                      aria-label={`Detalhes da transação ${transacao.id}`}
                      title={`Consultar ${transacao.id}`}
                      className="inline-flex rounded p-2 text-black hover:bg-gray-200"
                    >
                      <IconeLupa tamanho={23} />
                    </Link>
                  </td>
                </tr>
              ))}

              {/* NENHUMA TRANSAÇÃO ENCONTRADA */}
              {transacoesPagina.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-12 text-gray-600"
                  >
                    Nenhuma transação encontrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINAÇÃO */}
        <div className="mt-12 flex items-center justify-between">

          {/* CONTROLES DE PAGINAÇÃO */}
          <div className="flex items-center gap-3">

            {/* PÁGINA ANTERIOR */}
            <button
              type="button"
              onClick={() =>
                setPaginaAtual((pagina) =>
                  Math.max(1, pagina - 1)
                )
              }
              disabled={paginaAtual === 1}
              aria-label="Página anterior"
              className="px-2 text-xl text-black disabled:opacity-30"
            >
              ‹
            </button>

            {/* NÚMEROS DAS PÁGINAS */}
            {Array.from(
              { length: totalPaginas },
              (_, indice) => indice + 1
            ).map((pagina) => (
              <button
                key={pagina}
                type="button"
                onClick={() =>
                  setPaginaAtual(pagina)
                }
                aria-label={`Página ${pagina}`}
                aria-current={
                  paginaAtual === pagina
                    ? "page"
                    : undefined
                }
                className={`rounded px-2 py-1 text-sm font-semibold ${
                  paginaAtual === pagina
                    ? "bg-blue-600 text-white"
                    : "text-black hover:bg-gray-300"
                }`}
              >
                {pagina}
              </button>
            ))}

            {/* PRÓXIMA PÁGINA */}
            <button
              type="button"
              onClick={() =>
                setPaginaAtual((pagina) =>
                  Math.min(totalPaginas, pagina + 1)
                )
              }
              disabled={paginaAtual === totalPaginas}
              aria-label="Próxima página"
              className="px-2 text-xl text-black disabled:opacity-30"
            >
              ›
            </button>
          </div>

          {/* CONTADOR */}
          <p className="text-sm font-semibold text-black">
            {transacoesFiltradas.length === 0
              ? 0
              : inicio + 1}
            {" - "}
            {Math.min(
              inicio + ITENS_POR_PAGINA,
              transacoesFiltradas.length
            )}
            {" de "}
            {transacoesFiltradas.length} transações
          </p>
        </div>

        {/* BOTÃO VOLTAR */}
        <div className="mt-14 flex justify-end">
          <Link
            href="/estoque/consulta"
            className="flex h-11 items-center justify-center rounded-lg border border-black bg-white px-10 text-sm font-semibold text-black hover:bg-gray-100"
          >
            Voltar
          </Link>
        </div>
      </main>
    </div>
  );
}
