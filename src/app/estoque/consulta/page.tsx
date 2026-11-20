
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

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
type Bolsa = {
  id: string;
  tipo: string;
  entrada: string;
  validade: string;
  status: "Disponível" | "Em uso" | "Vencida";
  volume: number;
};

// TIPOS SANGUÍNEOS
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

// DADOS SIMULADOS DAS BOLSAS
// Mantidos conforme a tela original do MS2
const bolsas: Bolsa[] = Array.from(
  { length: 46 },
  (_, i) => {
    const numero = i + 1;

    const entrada = new Date(
      Date.UTC(2026, 9, numero)
    );

    const validade = new Date(entrada);

    validade.setUTCDate(
      validade.getUTCDate() + 42
    );

    const hoje = new Date();

    const dataAtual = Date.UTC(
      hoje.getFullYear(),
      hoje.getMonth(),
      hoje.getDate()
    );

    let status: Bolsa["status"] = "Disponível";

    if (validade.getTime() < dataAtual) {
      status = "Vencida";
    } else if (numero % 6 === 0) {
      status = "Em uso";
    }

    return {
      id: `BOL-${String(numero).padStart(3, "0")}`,
      tipo: tipos[i % tipos.length],
      entrada: entrada.toISOString().slice(0, 10),
      validade: validade.toISOString().slice(0, 10),
      status,
      volume: 450,
    };
  }
);

// CONFIGURAÇÃO DA PAGINAÇÃO
const ITENS_POR_PAGINA = 8;

// ======================================================
// MS2 ESTOQUE
// Usuário provisório enquanto não integramos autenticação
// ======================================================

const usuarioEstoque = {
  nome: "Usuário de teste",
  cargo: "Estoque",
};

// FORMATAR DATA
function formatarData(data: string) {
  const [ano, mes, dia] = data.split("-");
  return `${dia}/${mes}/${ano}`;
}

// ÍCONE DE PESQUISA
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
// MS2 ESTOQUE
// Tela de consulta adaptada ao Design System da Bia
// Mantidas pesquisa, tabela, paginação e navegação
// ======================================================

export default function ConsultaEstoquePage() {
  const [busca, setBusca] = useState("");
  const [paginaAtual, setPaginaAtual] = useState(1);

  // FILTRAR BOLSAS
  const bolsasFiltradas = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    return bolsas.filter((bolsa) => {
      return (
        bolsa.id.toLowerCase().includes(termo) ||
        bolsa.tipo.toLowerCase().includes(termo) ||
        formatarData(bolsa.validade).includes(termo) ||
        bolsa.validade.includes(termo)
      );
    });
  }, [busca]);

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

  // ATUALIZAR BUSCA
  function atualizarBusca(valor: string) {
    setBusca(valor);
    setPaginaAtual(1);
  }

  return (
    <div className="flex min-h-screen bg-cinza-azulado">

      {/* ========================================
          MS2 ESTOQUE
          Novo Sidebar compartilhado da Bia
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
          onSubmit={(evento) => evento.preventDefault()}
          className="mb-10 flex overflow-hidden rounded-md border border-gray-300 bg-card"
        >
          <input
            type="search"
            placeholder="Buscar por tipo sanguíneo, código da bolsa ou data de validade"
            aria-label="Buscar bolsas de sangue"
            value={busca}
            onChange={(evento) =>
              atualizarBusca(evento.target.value)
            }
            className="w-full px-4 py-3 text-preto outline-none placeholder:text-preto/50"
          />

          {/* MS2 ESTOQUE: botão compartilhado da Bia */}
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

        {/* TABELA DE ESTOQUE */}
        <div className="overflow-x-auto bg-card">
          <table className="w-full border-collapse text-center text-sm">

            {/* CABEÇALHO */}
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

            {/* REGISTROS */}
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
                      className={`inline-block min-w-28 rounded-full px-3 py-2 font-medium text-azul-1 ${
                        bolsa.status === "Disponível"
                          ? "bg-[#D0EEE8]"
                          : bolsa.status === "Em uso"
                          ? "bg-[#CCDEF4]"
                          : "bg-[#F9D4D8]"
                      }`}
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

              {/* SEM RESULTADOS */}
              {bolsasPagina.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-12 text-gray-600"
                  >
                    Nenhuma bolsa encontrada.
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

        {/* ========================================
            MS2 ESTOQUE
            Botão Voltar padronizado da Bia
            Destino mantido: Dashboard do Estoque
            ======================================== */}
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
