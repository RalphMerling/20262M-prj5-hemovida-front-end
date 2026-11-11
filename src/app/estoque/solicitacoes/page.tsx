
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import Sidebar from "@/components/Sidebar";

// TIPOS DE DADOS
type StatusSolicitacao =
  | "Entregue"
  | "Pendente"
  | "Cancelada";

type Solicitacao = {
  id: string;
  data: string;
  hospital: string;
  tipoSanguineo: string;
  status: StatusSolicitacao;
};

// HOSPITAIS UTILIZADOS NA SIMULAÇÃO
const hospitais = [
  "Hosp Munic Souza Aguiar",
  "Hosp Munic Miguel Couto",
  "Hosp Munic Salgado Filho",
  "Hosp Munic Pedro II",
  "Hosp Munic Lourenço Jorge",
  "Hosp Munic Rocha Faria",
  "Hosp Est Getúlio Vargas",
];

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

// PRIMEIROS REGISTROS DO WIREFRAME
const registrosIniciais: {
  hospital: string;
  tipo: string;
  status: StatusSolicitacao;
}[] = [
  {
    hospital: hospitais[0],
    tipo: "O+",
    status: "Entregue",
  },
  {
    hospital: hospitais[1],
    tipo: "A-",
    status: "Entregue",
  },
  {
    hospital: hospitais[2],
    tipo: "O+",
    status: "Entregue",
  },
  {
    hospital: hospitais[3],
    tipo: "B+",
    status: "Pendente",
  },
  {
    hospital: hospitais[4],
    tipo: "AB+",
    status: "Entregue",
  },
  {
    hospital: hospitais[5],
    tipo: "A+",
    status: "Pendente",
  },
  {
    hospital: hospitais[6],
    tipo: "O-",
    status: "Entregue",
  },
  {
    hospital: hospitais[0],
    tipo: "B-",
    status: "Cancelada",
  },
];

// GERAR 42 SOLICITAÇÕES SIMULADAS
// IDs: TR-009 ATÉ TR-050
const solicitacoes: Solicitacao[] = Array.from(
  { length: 42 },
  (_, indice) => {
    const numero = indice + 9;

    const data = new Date(
      Date.UTC(2026, 9, numero)
    );

    if (indice < registrosIniciais.length) {
      const registro = registrosIniciais[indice];

      return {
        id: `TR-${String(numero).padStart(3, "0")}`,
        data: data.toISOString().slice(0, 10),
        hospital: registro.hospital,
        tipoSanguineo: registro.tipo,
        status: registro.status,
      };
    }

    const indiceAdicional = numero - 17;

    let status: StatusSolicitacao = "Entregue";

    if (numero % 9 === 0) {
      status = "Cancelada";
    } else if (numero % 4 === 0) {
      status = "Pendente";
    }

    return {
      id: `TR-${String(numero).padStart(3, "0")}`,
      data: data.toISOString().slice(0, 10),
      hospital:
        hospitais[indiceAdicional % hospitais.length],
      tipoSanguineo:
        tiposSanguineos[
          indiceAdicional % tiposSanguineos.length
        ],
      status,
    };
  }
);

// CONFIGURAÇÃO DA PAGINAÇÃO
const ITENS_POR_PAGINA = 8;

// FORMATAR DATA
function formatarData(data: string) {
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

// COR DO STATUS
function corStatus(status: StatusSolicitacao) {
  switch (status) {
    case "Entregue":
      return "bg-[#D0EEE8]";

    case "Pendente":
      return "bg-[#FFF0D4]";

    case "Cancelada":
      return "bg-[#F9D4D8]";
  }
}

// PÁGINA DE SOLICITAÇÕES
export default function SolicitacoesPage() {
  const [busca, setBusca] = useState("");
  const [paginaAtual, setPaginaAtual] = useState(1);

  // FILTRAR SOLICITAÇÕES
  const solicitacoesFiltradas = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    if (!termo) {
      return solicitacoes;
    }

    return solicitacoes.filter((solicitacao) => {
      return (
        solicitacao.id.toLowerCase().includes(termo) ||
        solicitacao.hospital
          .toLowerCase()
          .includes(termo) ||
        solicitacao.tipoSanguineo
          .toLowerCase()
          .includes(termo) ||
        solicitacao.status
          .toLowerCase()
          .includes(termo) ||
        formatarData(solicitacao.data).includes(termo)
      );
    });
  }, [busca]);

  // PAGINAÇÃO
  const totalPaginas = Math.max(
    1,
    Math.ceil(
      solicitacoesFiltradas.length / ITENS_POR_PAGINA
    )
  );

  const inicio =
    (paginaAtual - 1) * ITENS_POR_PAGINA;

  const solicitacoesPagina =
    solicitacoesFiltradas.slice(
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
            placeholder="Buscar solicitação"
            aria-label="Buscar solicitação"
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

        {/* TÍTULO */}
        <h1 className="mb-10 text-2xl font-bold text-[#203A60]">
          Solicitações dos Hospitais
        </h1>

        {/* TABELA DE SOLICITAÇÕES */}
        <div className="overflow-x-auto bg-white">
          <table className="w-full border-collapse text-center text-sm">

            {/* CABEÇALHO */}
            <thead className="bg-[#D1E1F1] text-[#203A60]">
              <tr>
                <th className="px-4 py-3">
                  ID da Solicitação
                </th>

                <th className="px-4 py-3">
                  Data
                </th>

                <th className="px-4 py-3">
                  Hospital Solicitante
                </th>

                <th className="px-4 py-3">
                  Tipo Sanguíneo
                </th>

                <th className="px-4 py-3">
                  Status
                </th>

                <th className="px-4 py-3">
                  Detalhes
                </th>
              </tr>
            </thead>

            {/* REGISTROS */}
            <tbody>
              {solicitacoesPagina.map((solicitacao) => (
                <tr
                  key={solicitacao.id}
                  className="h-[66px] border-b border-gray-100 text-black hover:bg-gray-50"
                >
                  {/* ID */}
                  <td className="px-4 font-semibold">
                    {solicitacao.id}
                  </td>

                  {/* DATA */}
                  <td className="px-4">
                    {formatarData(solicitacao.data)}
                  </td>

                  {/* HOSPITAL */}
                  <td className="px-4 font-medium">
                    {solicitacao.hospital}
                  </td>

                  {/* TIPO SANGUÍNEO */}
                  <td className="px-4 font-semibold">
                    {solicitacao.tipoSanguineo}
                  </td>

                  {/* STATUS */}
                  <td className="px-4">
                    <span
                      className={`inline-block min-w-28 rounded-full px-3 py-2 font-medium text-[#203A60] ${corStatus(
                        solicitacao.status
                      )}`}
                    >
                      {solicitacao.status}
                    </span>
                  </td>

                  {/* DETALHES */}
                  <td className="px-4">
                    <Link
                      href={`/estoque/solicitacoes/${solicitacao.id}`}
                      aria-label={`Detalhes da solicitação ${solicitacao.id}`}
                      title={`Consultar ${solicitacao.id}`}
                      className="inline-flex rounded p-2 text-black hover:bg-gray-200"
                    >
                      <IconeLupa tamanho={23} />
                    </Link>
                  </td>
                </tr>
              ))}

              {/* SEM RESULTADOS */}
              {solicitacoesPagina.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-12 text-gray-600"
                  >
                    Nenhuma solicitação encontrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINAÇÃO */}
        <div className="mt-12 flex items-center justify-between">

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
              disabled={
                paginaAtual === totalPaginas
              }
              aria-label="Próxima página"
              className="px-2 text-xl text-black disabled:opacity-30"
            >
              ›
            </button>
          </div>

          {/* CONTADOR DE REGISTROS */}
          <p className="text-sm font-semibold text-black">
            {solicitacoesFiltradas.length === 0
              ? 0
              : inicio + 1}
            {" - "}
            {Math.min(
              inicio + ITENS_POR_PAGINA,
              solicitacoesFiltradas.length
            )}
            {" de "}
            {solicitacoesFiltradas.length} solicitações
          </p>
        </div>

        {/* BOTÃO VOLTAR */}
        <div className="mt-14 flex justify-end">
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
