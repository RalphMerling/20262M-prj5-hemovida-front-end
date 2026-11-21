
"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

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
type TipoTransacao =
  | "Entrada por doação"
  | "Saída para Hospital"
  | "Saída por descarte";

type StatusTransacao =
  | "Entregue"
  | "Pendente"
  | "Cancelada";

type Bolsa = {
  id: string;
  tipoSanguineo: string;
  volume: number;
  coleta: string;
  validade: string;
};

type Transacao = {
  id: string;
  tipo: TipoTransacao;
  data: string;
  status: StatusTransacao;
  solicitante: string;
  hospital: string;
  bolsas: Bolsa[];
};

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

// ======================================================
// MS2 ESTOQUE
// Usuário provisório até integração da autenticação
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

// BUSCAR TRANSAÇÃO SIMULADA
// Mantém os mesmos dados da Lista de Transações.
function buscarTransacao(id: string): Transacao | null {
  if (!/^TR-\d{3}$/.test(id)) {
    return null;
  }

  const numero = Number(id.replace("TR-", ""));

  if (numero < 1 || numero > 42) {
    return null;
  }

  const data = new Date(
    Date.UTC(2026, 9, numero)
  );

  const coleta = new Date(data);
  coleta.setUTCDate(coleta.getUTCDate() - 1);

  const validade = new Date(coleta);
  validade.setUTCDate(
    validade.getUTCDate() + 42
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
    id,
    tipo,
    data: data.toISOString().slice(0, 10),
    status,

    solicitante:
      tipo === "Saída para Hospital"
        ? "João da Silva"
        : "—",

    hospital:
      tipo === "Saída para Hospital"
        ? "Hosp Munic Pedro II"
        : "—",

    bolsas: [
      {
        id: `BOL-${String(numero).padStart(3, "0")}`,
        tipoSanguineo:
          tiposSanguineos[(numero - 1) % 8],
        volume: 450,
        coleta: coleta.toISOString().slice(0, 10),
        validade: validade.toISOString().slice(0, 10),
      },
    ],
  };
}

// CAMPO SOMENTE PARA CONSULTA
function Campo({
  titulo,
  valor,
}: {
  titulo: string;
  valor: string;
}) {
  return (
    <div className="min-w-0">
      <p className="mb-3 text-xl font-semibold text-preto">
        {titulo}
      </p>

      <div className="flex h-9 items-center rounded-md border border-gray-300 bg-card px-4 text-sm font-semibold text-preto">
        {valor}
      </div>
    </div>
  );
}

// ESTILO DOS CAMPOS EDITÁVEIS
// MS2 ESTOQUE: utilizando cores globais da Bia.
const classeInput =
  "h-9 w-full rounded-md border border-azul-2 " +
  "bg-card px-4 text-sm font-semibold text-preto " +
  "outline-none focus:ring-1 focus:ring-azul-2";

const classeLabel =
  "mb-3 block text-xl font-semibold text-preto";

// ======================================================
// MS2 ESTOQUE
// Detalhes da Transação adaptados ao Design System
// compartilhado da Bia.
//
// Mantidos:
// - Layout original do Figma
// - Dados e histórico simulado
// - Edição somente para Pendente
// - Cancelamento somente para Pendente
// - Retorno à Lista de Transações
// ======================================================

export default function DetalhesTransacaoPage() {
  const params = useParams<{ id: string }>();

  const transacao = buscarTransacao(params.id);

  // ESTADOS DA SIMULAÇÃO
  const [statusLocal, setStatusLocal] =
    useState<StatusTransacao | null>(null);

  const [editando, setEditando] = useState(false);

  const [solicitanteEditado, setSolicitanteEditado] =
    useState<string | null>(null);

  const [hospitalEditado, setHospitalEditado] =
    useState<string | null>(null);

  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  // TRANSAÇÃO NÃO ENCONTRADA
  if (!transacao) {
    return (
      <div className="flex min-h-screen bg-cinza-azulado">

        {/* MS2 ESTOQUE: SIDEBAR DA BIA */}
        <Sidebar
          itens={MENU_ESTOQUE}
          usuario={usuarioEstoque}
        />

        <main className="flex-1 p-12">
          <h1 className="text-2xl font-bold text-azul-1">
            Transação não encontrada
          </h1>

          <div className="mt-6">
            <ButtonLink
              href="/estoque/transacoes"
              variante="voltar"
              tamanho="sm"
            >
              Voltar para Transações
            </ButtonLink>
          </div>
        </main>
      </div>
    );
  }

  // DADOS DA TRANSAÇÃO
  const idTransacao = transacao.id;

  const status =
    statusLocal ?? transacao.status;

  const solicitante =
    solicitanteEditado ?? transacao.solicitante;

  const hospital =
    hospitalEditado ?? transacao.hospital;

  // ==================================================
  // MS2 ESTOQUE
  // REGRA DE NEGÓCIO:
  // Editar e Cancelar somente para status Pendente.
  // ==================================================

  const pendente = status === "Pendente";

  const ehSaidaHospital =
    transacao.tipo === "Saída para Hospital";

  // TIPO RESUMIDO CONFORME FIGMA
  const tipoResumido =
    transacao.tipo === "Entrada por doação"
      ? "Entrada"
      : "Saída";

  // CORES DOS STATUS
  const corStatus =
    status === "Entregue"
      ? "bg-[#D0EEE8]"
      : status === "Pendente"
      ? "bg-[#EADCC5]"
      : "bg-[#F9D4D8]";

  // INICIAR EDIÇÃO
  function iniciarEdicao() {
    if (!pendente) {
      return;
    }

    setEditando(true);
    setErro("");
    setMensagem("");
  }

  // SALVAR ALTERAÇÕES SIMULADAS
  function salvarEdicao() {
    if (!pendente) {
      return;
    }

    if (
      ehSaidaHospital &&
      (!solicitante.trim() || !hospital.trim())
    ) {
      setErro("Preencha os campos obrigatórios.");
      return;
    }

    setEditando(false);
    setErro("");

    setMensagem(
      "Alterações realizadas apenas nesta demonstração. " +
      "Nenhum dado foi gravado no banco de dados."
    );
  }

  // DESCARTAR ALTERAÇÕES
  function descartarEdicao() {
    setSolicitanteEditado(null);
    setHospitalEditado(null);

    setEditando(false);
    setErro("");
    setMensagem("");
  }

  // CANCELAR TRANSAÇÃO
  function cancelarTransacao() {
    if (!pendente || editando) {
      return;
    }

    const confirmar = window.confirm(
      `Deseja cancelar a transação ${idTransacao}?`
    );

    if (!confirmar) {
      return;
    }

    setStatusLocal("Cancelada");
    setEditando(false);
    setErro("");

    setMensagem(
      "Transação cancelada apenas nesta demonstração. " +
      "Nenhuma alteração foi gravada no banco de dados."
    );
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
      <main className="flex min-w-0 flex-1 flex-col px-12 py-12">

        {/* TÍTULO E SETA DE RETORNO */}
        <div className="mb-24 flex items-center gap-5">

          <Link
            href="/estoque/transacoes"
            aria-label="Voltar para Transações"
            className="text-4xl text-preto hover:text-azul-1"
          >
            ←
          </Link>

          <h1 className="text-2xl font-bold text-azul-1">
            Detalhes da transação
          </h1>
        </div>

        {/* PRIMEIRA LINHA:
            ID, TIPO, DATA E STATUS */}
        <section className="grid grid-cols-[1.4fr_0.85fr_0.85fr_0.65fr] items-end gap-10 px-2">

          {/* ID DA TRANSAÇÃO */}
          <Campo
            titulo="ID da transação"
            valor={transacao.id}
          />

          {/* TIPO */}
          <Campo
            titulo="Tipo"
            valor={tipoResumido}
          />

          {/* DATA */}
          <Campo
            titulo="Data"
            valor={formatarData(transacao.data)}
          />

          {/* STATUS */}
          <div className="min-w-0">

            <p className="mb-3 text-xl font-semibold text-preto">
              Status
            </p>

            <div className="flex h-9 items-center">
              <span
                className={`inline-flex min-w-28 items-center justify-center rounded-full px-4 py-2 text-sm font-semibold text-azul-1 ${corStatus}`}
              >
                {status}
              </span>
            </div>
          </div>
        </section>

        {/* SEGUNDA LINHA:
            SOLICITANTE, HOSPITAL E AÇÕES */}
        <section className="mt-20 grid grid-cols-[1fr_1.3fr_auto] items-end gap-8 px-2">

          {/* DADOS DO SOLICITANTE */}
          <div className="min-w-0">

            {editando && ehSaidaHospital ? (
              <>
                <label
                  htmlFor="solicitante"
                  className={classeLabel}
                >
                  Dados do solicitante
                </label>

                <input
                  id="solicitante"
                  type="text"
                  value={solicitante}
                  onChange={(evento) =>
                    setSolicitanteEditado(
                      evento.target.value
                    )
                  }
                  className={classeInput}
                />
              </>
            ) : (
              <Campo
                titulo="Dados do solicitante"
                valor={solicitante}
              />
            )}
          </div>

          {/* HOSPITAL / UNIDADE */}
          <div className="min-w-0">

            {editando && ehSaidaHospital ? (
              <>
                <label
                  htmlFor="hospital"
                  className={classeLabel}
                >
                  Hospital / Unidade
                </label>

                <input
                  id="hospital"
                  type="text"
                  value={hospital}
                  onChange={(evento) =>
                    setHospitalEditado(evento.target.value)
                  }
                  className={classeInput}
                />
              </>
            ) : (
              <Campo
                titulo="Hospital / Unidade"
                valor={hospital}
              />
            )}
          </div>

          {/* ========================================
              MS2 ESTOQUE
              BOTÕES COMPARTILHADOS DA BIA

              Editar e Cancelar:
              somente para status Pendente.
              ======================================== */}
          <div className="flex h-9 items-center gap-3">

            {pendente && (
              <>
                {editando ? (
                  <>
                    {/* SALVAR ALTERAÇÕES */}
                    <Button
                      type="button"
                      variante="secundario"
                      tamanho="sm"
                      onClick={salvarEdicao}
                      className="h-9 px-4 text-sm"
                    >
                      Salvar
                    </Button>

                    {/* DESCARTAR ALTERAÇÕES */}
                    <Button
                      type="button"
                      variante="voltar"
                      tamanho="sm"
                      onClick={descartarEdicao}
                      className="h-9 px-4 text-sm"
                    >
                      Descartar
                    </Button>
                  </>
                ) : (
                  <>
                    {/* EDITAR TRANSAÇÃO */}
                    <Button
                      type="button"
                      variante="secundario"
                      tamanho="sm"
                      onClick={iniciarEdicao}
                      className="h-9 px-4 text-sm"
                    >
                      Editar
                    </Button>

                    {/* CANCELAR TRANSAÇÃO */}
                    <Button
                      type="button"
                      variante="cancelar"
                      tamanho="sm"
                      onClick={cancelarTransacao}
                      className="h-9 px-4 text-sm"
                    >
                      Cancelar
                    </Button>
                  </>
                )}
              </>
            )}
          </div>
        </section>

        {/* BOLSAS UTILIZADAS */}
        <section className="mt-24 px-2">

          <h2 className="mb-6 text-xl font-bold text-preto">
            Bolsas Utilizadas
          </h2>

          <div className="overflow-x-auto bg-card">
            <table className="w-full border-collapse text-center text-sm">

              {/* CABEÇALHO */}
              <thead className="bg-[#D1E1F1] text-azul-1">
                <tr>
                  <th className="px-4 py-3">
                    ID da Bolsa (s)
                  </th>

                  <th className="px-4 py-3">
                    Tipo Sanguíneo
                  </th>

                  <th className="px-4 py-3">
                    Volume (mL)
                  </th>

                  <th className="px-4 py-3">
                    Data da Coleta
                  </th>

                  <th className="px-4 py-3">
                    Validade
                  </th>
                </tr>
              </thead>

              {/* REGISTROS */}
              <tbody>
                {transacao.bolsas.map((bolsa) => (
                  <tr
                    key={bolsa.id}
                    className="h-[86px] border-b border-gray-100 text-preto"
                  >
                    {/* ID DA BOLSA */}
                    <td className="px-4 font-semibold">
                      {bolsa.id}
                    </td>

                    {/* TIPO SANGUÍNEO */}
                    <td className="px-4 font-semibold">
                      {bolsa.tipoSanguineo}
                    </td>

                    {/* VOLUME */}
                    <td className="px-4 font-semibold">
                      {bolsa.volume}
                    </td>

                    {/* DATA DA COLETA */}
                    <td className="px-4 font-semibold">
                      {formatarData(bolsa.coleta)}
                    </td>

                    {/* VALIDADE */}
                    <td className="px-4 font-semibold">
                      {formatarData(bolsa.validade)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* MENSAGEM DE ERRO */}
        {erro && (
          <p
            role="alert"
            className="mx-2 mt-6 rounded-md bg-[#F9D4D8] px-4 py-3 font-medium text-red-800"
          >
            {erro}
          </p>
        )}

        {/* MENSAGEM DE CONFIRMAÇÃO */}
        {mensagem && (
          <p
            role="status"
            className="mx-2 mt-6 rounded-md bg-card px-4 py-3 font-medium text-azul-1"
          >
            {mensagem}
          </p>
        )}

        {/* ========================================
            MS2 ESTOQUE
            Botão Voltar padronizado da Bia
            Destino: Lista de Transações
            ======================================== */}
        <div className="mt-auto flex justify-end px-2 pt-24">

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
