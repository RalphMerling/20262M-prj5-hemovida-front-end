
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { MENU_ESTOQUE } from "@/auth/menus";
import { Sidebar } from "@/components/layout/Sidebar";
import { Button, ButtonLink } from "@/components/ui/Button";

// ======================================================
// MS2 - ESTOQUE
// Tipos de dados
// ======================================================

type StatusBolsa =
  | "Disponível"
  | "A vencer"
  | "Em uso"
  | "Vencida";

type Bolsa = {
  id: string;
  tipo: string;
  entrada: string;
  validade: string;
  status: StatusBolsa;
  volume: number;
};

// ======================================================
// MS2 - ESTOQUE
// Regras da simulação
// ======================================================

const DIAS_VALIDADE_BOLSA = 30;
const DIAS_ALERTA_VENCIMENTO = 10;
const MILISSEGUNDOS_POR_DIA = 24 * 60 * 60 * 1000;

const ITENS_POR_PAGINA = 8;
const TOTAL_BOLSAS_SIMULADAS = 46;

const tipos = [
  "O+",
  "A+",
  "B+",
  "O-",
  "AB+",
  "A-",
  "B-",
  "AB-",
];

// ======================================================
// MS2 - ESTOQUE
// Distribuição mista dos status simulados
// Os valores representam dias desde a entrada.
// ======================================================

const idadesBolsas = [
  5,
  22,
  33,
  14,
  28,
  37,
  20,
  10,
  26,
  4,
  31,
  16,
  24,
  36,
  8,
  29,
];

const usuarioEstoque = {
  nome: "Usuário de teste",
  cargo: "Estoque",
};

// ======================================================
// MS2 - ESTOQUE
// Funções auxiliares de datas
// ======================================================

function formatarData(data: string): string {
  const [ano, mes, dia] = data.split("-");
  return `${dia}/${mes}/${ano}`;
}

function converterDataParaUTC(data: string): number {
  const [ano, mes, dia] = data.split("-").map(Number);
  return Date.UTC(ano, mes - 1, dia);
}

function obterDataHoje(): string {
  const agora = new Date();

  const ano = agora.getFullYear();
  const mes = String(agora.getMonth() + 1).padStart(
    2,
    "0"
  );
  const dia = String(agora.getDate()).padStart(2, "0");

  return `${ano}-${mes}-${dia}`;
}

function adicionarDias(
  data: string,
  quantidadeDias: number
): string {
  const dataUTC = converterDataParaUTC(data);

  return new Date(
    dataUTC +
      quantidadeDias * MILISSEGUNDOS_POR_DIA
  )
    .toISOString()
    .slice(0, 10);
}

function calcularDiasParaVencer(
  validade: string,
  dataReferencia: string
): number {
  return Math.round(
    (converterDataParaUTC(validade) -
      converterDataParaUTC(dataReferencia)) /
      MILISSEGUNDOS_POR_DIA
  );
}

// ======================================================
// MS2 - ESTOQUE
// Cálculo do status
//
// Prioridade:
// 1. Vencida
// 2. Em uso
// 3. A vencer
// 4. Disponível
// ======================================================

function calcularStatusBolsa(
  validade: string,
  emUso: boolean,
  dataReferencia: string
): StatusBolsa {
  const diasRestantes = calcularDiasParaVencer(
    validade,
    dataReferencia
  );

  if (diasRestantes < 0) {
    return "Vencida";
  }

  if (emUso) {
    return "Em uso";
  }

  if (diasRestantes <= DIAS_ALERTA_VENCIMENTO) {
    return "A vencer";
  }

  return "Disponível";
}

// ======================================================
// MS2 - ESTOQUE
// Dados simulados com status misturados
// ======================================================

function criarBolsasSimuladas(
  dataReferencia: string
): Bolsa[] {
  return Array.from(
    { length: TOTAL_BOLSAS_SIMULADAS },
    (_, indice) => {
      const numero = indice + 1;

      const diasDesdeEntrada =
        idadesBolsas[indice % idadesBolsas.length];

      const entrada = adicionarDias(
        dataReferencia,
        -diasDesdeEntrada
      );

      const validade = adicionarDias(
        entrada,
        DIAS_VALIDADE_BOLSA
      );

      const posicao =
        indice % idadesBolsas.length;

      const emUso =
        posicao === 3 || posicao === 11;

      return {
        id: `BOL-${String(numero).padStart(3, "0")}`,
        tipo: tipos[indice % tipos.length],
        entrada,
        validade,
        status: calcularStatusBolsa(
          validade,
          emUso,
          dataReferencia
        ),
        volume: 450,
      };
    }
  );
}

// ======================================================
// MS2 - ESTOQUE
// Pesquisa sem diferenciar acentos e maiúsculas
// ======================================================

function normalizarTexto(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

// ======================================================
// MS2 - ESTOQUE
// Ícone de pesquisa
// ======================================================

function Lupa({
  tamanho = 21,
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

// ======================================================
// MS2 - ESTOQUE
// Cores dos status
// ======================================================

function corStatus(status: StatusBolsa): string {
  switch (status) {
    case "Disponível":
      return "bg-[#D0EEE8]";

    case "A vencer":
      return "bg-[#FFF0D4]";

    case "Em uso":
      return "bg-[#CCDEF4]";

    case "Vencida":
      return "bg-[#F9D4D8]";
  }
}

// ======================================================
// MS2 - ESTOQUE
// Tela Consulta de Estoque
// ======================================================

export default function ConsultaEstoquePage() {
  const [busca, setBusca] = useState("");
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [dataReferencia] = useState(obterDataHoje);

  // ====================================================
  // MS2 - ESTOQUE
  // NOVO: filtro de alerta recebido pelo Dashboard
  // ====================================================

  const [somenteAVencer, setSomenteAVencer] =
    useState(false);

  useEffect(() => {
    const parametros = new URLSearchParams(
      window.location.search
    );

    const statusURL = parametros.get("status");

    setSomenteAVencer(statusURL === "a-vencer");
    setPaginaAtual(1);
  }, []);

  // Dados simulados
  const bolsas = useMemo(
    () => criarBolsasSimuladas(dataReferencia),
    [dataReferencia]
  );

  // ====================================================
  // MS2 - ESTOQUE
  // Pesquisa combinada com o filtro de vencimento
  // ====================================================

  const bolsasFiltradas = useMemo(() => {
    const termo = normalizarTexto(busca);

    return bolsas.filter((bolsa) => {
      // NOVO: quando o filtro estiver ativo,
      // exibir apenas bolsas com status "A vencer".
      if (somenteAVencer && bolsa.status !== "A vencer") {
        return false;
      }

      if (!termo) {
        return true;
      }

      return (
        normalizarTexto(bolsa.id).includes(termo) ||
        normalizarTexto(bolsa.tipo).includes(termo) ||
        formatarData(bolsa.validade).includes(termo) ||
        bolsa.validade.includes(termo) ||
        normalizarTexto(bolsa.status).includes(termo)
      );
    });
  }, [bolsas, busca, somenteAVencer]);

  // PAGINAÇÃO
  const totalPaginas = Math.max(
    1,
    Math.ceil(
      bolsasFiltradas.length / ITENS_POR_PAGINA
    )
  );

  const inicio =
    (paginaAtual - 1) * ITENS_POR_PAGINA;

  const bolsasPagina = bolsasFiltradas.slice(
    inicio,
    inicio + ITENS_POR_PAGINA
  );

  function atualizarBusca(valor: string) {
    setBusca(valor);
    setPaginaAtual(1);
  }

  // ====================================================
  // MS2 - ESTOQUE
  // NOVO: limpar filtro de bolsas A vencer
  // ====================================================

  function limparFiltroVencimento() {
    setSomenteAVencer(false);
    setPaginaAtual(1);

    const url = new URL(window.location.href);

    url.searchParams.delete("status");

    window.history.replaceState(
      null,
      "",
      url.pathname + url.search + url.hash
    );
  }

  return (
    <div className="flex min-h-screen bg-cinza-azulado">
      {/* Sidebar compartilhado da Bia */}
      <Sidebar
        itens={MENU_ESTOQUE}
        usuario={usuarioEstoque}
      />

      <main className="min-w-0 flex-1 px-10 py-12">
        {/* BARRA DE PESQUISA */}
        <form
          role="search"
          onSubmit={(evento) => evento.preventDefault()}
          className="mb-10 flex overflow-hidden rounded-md border border-gray-300 bg-card"
        >
          <input
            type="search"
            placeholder="Buscar por tipo sanguíneo, código da bolsa, validade ou status"
            aria-label="Buscar bolsas por tipo, código, validade ou status"
            value={busca}
            onChange={(evento) =>
              atualizarBusca(evento.target.value)
            }
            className="w-full px-4 py-3 text-preto outline-none placeholder:text-preto/50"
          />

          <Button
            type="submit"
            variante="suave"
            tamanho="sm"
            aria-label="Pesquisar bolsas"
            className="rounded-none border-l border-gray-300 px-5"
          >
            <Lupa />
          </Button>
        </form>

        {/* TÍTULO */}
        <h1 className="mb-10 text-2xl font-bold text-azul-1">
          Estoque de bolsas de Sangue
        </h1>

        {/* ==========================================
            MS2 - ESTOQUE
            NOVO: indicador do filtro ativo
            ========================================== */}
        {somenteAVencer && (
          <div className="mb-6 flex items-center justify-between gap-4 rounded-md border border-[#E8D09E] bg-[#FFF0D4] px-5 py-3">
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-[#F4D18B] px-3 py-1 text-sm font-semibold text-azul-1">
                A vencer
              </span>

              <p
                className="text-sm font-medium text-azul-1"
                role="status"
              >
                Exibindo {bolsasFiltradas.length} bolsa(s)
                com vencimento em até 10 dias.
              </p>
            </div>

            <Button
              type="button"
              variante="voltar"
              tamanho="sm"
              onClick={limparFiltroVencimento}
            >
              Limpar filtro
            </Button>
          </div>
        )}

        {/* TABELA DE ESTOQUE */}
        <div className="overflow-x-auto bg-card">
          <table className="w-full border-collapse text-center text-sm">
            <thead className="bg-[#D1E1F1] text-azul-1">
              <tr>
                <th className="px-3 py-3">
                  ID da Bolsa
                </th>
                <th className="px-3 py-3">
                  Tipo Sanguíneo
                </th>
                <th className="px-3 py-3">
                  Data da Entrada
                </th>
                <th className="px-3 py-3">
                  Data de Validade
                </th>
                <th className="px-3 py-3">
                  Status
                </th>
                <th className="px-3 py-3">
                  Volume (mL)
                </th>
                <th className="px-3 py-3">
                  Detalhes do item
                </th>
              </tr>
            </thead>

            <tbody>
              {bolsasPagina.map((bolsa) => (
                <tr
                  key={bolsa.id}
                  className="h-[66px] border-b border-gray-100 text-preto hover:bg-gray-50"
                >
                  {/* ID DA BOLSA */}
                  <td className="px-3 font-semibold">
                    {bolsa.id}
                  </td>

                  {/* TIPO SANGUÍNEO */}
                  <td className="px-3 font-semibold">
                    {bolsa.tipo}
                  </td>

                  {/* DATA DE ENTRADA */}
                  <td className="px-3">
                    {formatarData(bolsa.entrada)}
                  </td>

                  {/* DATA DE VALIDADE */}
                  <td className="px-3">
                    {formatarData(bolsa.validade)}
                  </td>

                  {/* STATUS */}
                  <td className="px-3">
                    <span
                      className={`inline-block min-w-28 rounded-full px-3 py-2 font-medium text-azul-1 ${corStatus(
                        bolsa.status
                      )}`}
                    >
                      {bolsa.status}
                    </span>
                  </td>

                  {/* VOLUME */}
                  <td className="px-3">
                    {bolsa.volume}
                  </td>

                  {/* DETALHES */}
                  <td className="px-3">
                    <Link
                      href={`/estoque/consulta/${bolsa.id}`}
                      aria-label={`Detalhes da bolsa ${bolsa.id}`}
                      title={`Consultar ${bolsa.id}`}
                      className="inline-flex rounded p-2 text-azul-1 hover:bg-azul-3/30"
                    >
                      <Lupa tamanho={23} />
                    </Link>
                  </td>
                </tr>
              ))}

              {/* NENHUM RESULTADO */}
              {bolsasPagina.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-12 text-gray-600"
                  >
                    Nenhuma bolsa encontrada para os
                    filtros selecionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINAÇÃO */}
        <div className="mt-12 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* ANTERIOR */}
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

            {/* PRÓXIMA */}
            <Button
              type="button"
              variante="suave"
              tamanho="sm"
              onClick={() =>
                setPaginaAtual((pagina) =>
                  Math.min(totalPaginas, pagina + 1)
                )
              }
              disabled={paginaAtual === totalPaginas}
              aria-label="Próxima página"
              className="min-w-8 !px-2 !py-1 text-base"
            >
              ›
            </Button>
          </div>

          {/* CONTADOR */}
          <p className="text-sm font-semibold text-preto">
            {bolsasFiltradas.length === 0
              ? 0
              : inicio + 1}
            {" - "}
            {Math.min(
              inicio + ITENS_POR_PAGINA,
              bolsasFiltradas.length
            )}
            {" de "}
            {bolsasFiltradas.length} itens
          </p>
        </div>

        {/* VOLTAR AO DASHBOARD */}
        <div className="mt-14 flex justify-end">
          <ButtonLink
            href="/estoque"
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
