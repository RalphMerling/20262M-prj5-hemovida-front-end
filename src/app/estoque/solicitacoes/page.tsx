
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";

// ======================================================
// INÍCIO - MS2 ESTOQUE
// Integração com os componentes compartilhados da Bia
// ======================================================

import { MENU_ESTOQUE } from "@/auth/menus";
import { Sidebar } from "@/components/layout/Sidebar";
import {
  Button,
  ButtonLink,
} from "@/components/ui/Button";

// FIM - MS2 ESTOQUE

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
// Mantidos conforme o arquivo original.
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
// MS2 ESTOQUE: lógica original preservada.
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
        hospitais[
          indiceAdicional % hospitais.length
        ],
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

// ======================================================
// MS2 ESTOQUE
// Usuário provisório até a integração da autenticação
// ======================================================

const usuarioEstoque = {
  nome: "Usuário de teste",
  cargo: "Estoque",
};

// FORMATAR DATA
function formatarData(data: string): string {
  const [ano, mes, dia] = data.split("-");
  return `${dia}/${mes}/${ano}`;
}

// CORES DOS STATUS
function corStatus(
  status: StatusSolicitacao
): string {
  switch (status) {
    case "Entregue":
      return "bg-[#D0EEE8]";

    case "Pendente":
      return "bg-[#FFF0D4]";

    case "Cancelada":
      return "bg-[#F9D4D8]";
  }
}

// ======================================================
// MS2 ESTOQUE
// Lista de Solicitações adaptada ao Design System da Bia.
//
// Funcionalidades preservadas:
// - Pesquisa
// - Dados simulados
// - Tabela
// - Paginação
// - Consulta de detalhes
// - Navegação para Lista de Transações
// ======================================================

export default function SolicitacoesPage() {
  // PESQUISA E PAGINAÇÃO
  const [busca, setBusca] = useState("");

  const [paginaAtual, setPaginaAtual] =
    useState(1);

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
    <div className="flex min-h-screen bg-cinza-azulado">

      {/* ========================================
          MS2 ESTOQUE
          Sidebar compartilhado criado pela Bia
          ======================================== */}
      <Sidebar
        itens={MENU_ESTOQUE}
        usuario={usuarioEstoque}
      />

      {/* CONTEÚDO PRINCIPAL */}
      <main className="min-w-0 flex-1 px-10 py-12">

        {/* BARRA DE PESQUISA */}
        <form
          role="search"
          onSubmit={(evento) =>
            evento.preventDefault()
          }
          className="mb-10 flex overflow-hidden rounded-md border border-gray-300 bg-card"
        >
          <input
            type="search"
            placeholder="Buscar solicitação"
            aria-label="Buscar solicitação"
            value={busca}
            onChange={(evento) =>
              atualizarBusca(evento.target.value)
            }
            className="w-full px-4 py-3 text-preto outline-none placeholder:text-preto/50"
          />

          {/* MS2 ESTOQUE: BUTTON DA BIA */}
          <Button
            type="submit"
            variante="suave"
            tamanho="sm"
            aria-label="Pesquisar solicitações"
            className="rounded-none border-l border-gray-300 px-5"
          >
            <Search
              size={22}
              aria-hidden="true"
            />
          </Button>
        </form>

        {/* TÍTULO */}
        <h1 className="mb-10 text-2xl font-bold text-azul-1">
          Solicitações dos Hospitais
        </h1>

        {/* TABELA DE SOLICITAÇÕES */}
        <div className="overflow-x-auto bg-card">
          <table className="w-full border-collapse text-center text-sm">

            {/* CABEÇALHO */}
            <thead className="bg-[#D1E1F1] text-azul-1">
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
              {solicitacoesPagina.map(
                (solicitacao) => (
                  <tr
                    key={solicitacao.id}
                    className="h-[66px] border-b border-gray-100 text-preto hover:bg-gray-50"
                  >

                    {/* ID DA SOLICITAÇÃO */}
                    <td className="px-4 font-semibold">
                      {solicitacao.id}
                    </td>

                    {/* DATA */}
                    <td className="px-4">
                      {formatarData(
                        solicitacao.data
                      )}
                    </td>

                    {/* HOSPITAL SOLICITANTE */}
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
                        className={`inline-block min-w-28 rounded-full px-3 py-2 font-medium text-azul-1 ${corStatus(
                          solicitacao.status
                        )}`}
                      >
                        {solicitacao.status}
                      </span>
                    </td>

                    {/* DETALHES */}
                    <td className="px-4">
                      <Link
                        href={`/estoque/solicitacoes/detalhe?id=${solicitacao.id}`}
                        aria-label={`Detalhes da solicitação ${solicitacao.id}`}
                        title={`Consultar ${solicitacao.id}`}
                        className="inline-flex rounded p-2 text-azul-1 hover:bg-azul-3/30"
                      >
                        <Search
                          size={23}
                          aria-hidden="true"
                        />
                      </Link>
                    </td>
                  </tr>
                )
              )}

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

          {/* CONTROLES DE PAGINAÇÃO */}
          <div className="flex items-center gap-3">

            {/* PÁGINA ANTERIOR */}
            <Button
              type="button"
              variante="suave"
              tamanho="sm"
              onClick={() =>
                setPaginaAtual((pagina) =>
                  Math.max(1, pagina - 1)
                )
              }
              disabled={paginaAtual === 1}
              aria-label="Página anterior"
              className="min-w-8 !px-2 !py-1 text-base"
            >
              ‹
            </Button>

            {/* NÚMEROS DAS PÁGINAS */}
            {Array.from(
              { length: totalPaginas },
              (_, indice) => indice + 1
            ).map((pagina) => (
              <Button
                key={pagina}
                type="button"
                variante={
                  paginaAtual === pagina
                    ? "secundario"
                    : "suave"
                }
                tamanho="sm"
                onClick={() =>
                  setPaginaAtual(pagina)
                }
                aria-label={`Página ${pagina}`}
                aria-current={
                  paginaAtual === pagina
                    ? "page"
                    : undefined
                }
                className="min-w-8 !px-2 !py-1"
              >
                {pagina}
              </Button>
            ))}

            {/* PRÓXIMA PÁGINA */}
            <Button
              type="button"
              variante="suave"
              tamanho="sm"
              onClick={() =>
                setPaginaAtual((pagina) =>
                  Math.min(
                    totalPaginas,
                    pagina + 1
                  )
                )
              }
              disabled={
                paginaAtual === totalPaginas
              }
              aria-label="Próxima página"
              className="min-w-8 !px-2 !py-1 text-base"
            >
              ›
            </Button>
          </div>

          {/* CONTADOR */}
          <p className="text-sm font-semibold text-preto">
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

        {/* ========================================
            MS2 ESTOQUE
            Botão Voltar padronizado da Bia
            Destino: Lista de Transações
            ======================================== */}
        <div className="mt-14 flex justify-end">
          <ButtonLink
            href="/estoque/transacoes"
            variante="voltar"
            tamanho="md"
            className="min-w-32"
          >
            Voltar
          </ButtonLink>
        </div>
      </main>
    </div>
  );
}
