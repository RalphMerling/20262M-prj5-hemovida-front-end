
"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import Sidebar from "@/components/Sidebar";

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

// FORMATAR DATA
function formatarData(data: string): string {
  const [ano, mes, dia] = data.split("-");
  return `${dia}/${mes}/${ano}`;
}

// BUSCAR TRANSAÇÃO SIMULADA
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

// CAMPO DE CONSULTA
function Campo({
  titulo,
  valor,
}: {
  titulo: string;
  valor: string;
}) {
  return (
    <div className="min-w-0">
      <p className="mb-3 text-xl font-semibold text-black">
        {titulo}
      </p>

      <div className="flex h-9 items-center rounded-md border border-[#C5C5C5] bg-white px-4 text-sm font-semibold text-black">
        {valor}
      </div>
    </div>
  );
}

// ESTILO DE CAMPO EDITÁVEL
const classeInput =
  "h-9 w-full rounded-md border border-[#1673EB] " +
  "bg-white px-4 text-sm font-semibold text-black outline-none";

// PÁGINA DE DETALHES DA TRANSAÇÃO
export default function DetalhesTransacaoPage() {
  const params = useParams<{ id: string }>();

  const transacao = buscarTransacao(params.id);

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
      <div className="flex min-h-screen bg-[#E1E4E9]">
        <Sidebar />

        <main className="flex-1 p-12">
          <h1 className="text-2xl font-bold text-[#203A60]">
            Transação não encontrada
          </h1>

          <Link
            href="/estoque/transacoes"
            className="mt-6 inline-block text-blue-700 underline"
          >
            Voltar para Transações
          </Link>
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

  // BOTÕES SOMENTE PARA PENDENTES
  const pendente = status === "Pendente";

  const ehSaidaHospital =
    transacao.tipo === "Saída para Hospital";

  // EXIBIR TIPO SIMPLIFICADO COMO NO FIGMA
  const tipoResumido =
    transacao.tipo === "Entrada por doação"
      ? "Entrada"
      : "Saída";

  // CORES DO STATUS
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
    <div className="flex min-h-screen bg-[#E1E4E9]">

      {/* MENU COMPARTILHADO */}
      <Sidebar />

      {/* CONTEÚDO PRINCIPAL */}
      <main className="flex min-w-0 flex-1 flex-col px-12 py-12">

        {/* TÍTULO */}
        <div className="mb-24 flex items-center gap-5">
          <Link
            href="/estoque/transacoes"
            aria-label="Voltar para Transações"
            className="text-4xl text-black hover:text-gray-600"
          >
            ←
          </Link>

          <h1 className="text-2xl font-bold text-[#203A60]">
            Detalhes da transação
          </h1>
        </div>

        {/* PRIMEIRA LINHA: ID, TIPO, DATA E STATUS */}
        <section className="grid grid-cols-[1.4fr_0.85fr_0.85fr_0.65fr] items-end gap-10 px-2">

          {/* ID */}
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
            <p className="mb-3 text-xl font-semibold text-black">
              Status
            </p>

            <div className="flex h-9 items-center">
              <span
                className={`inline-flex min-w-28 items-center justify-center rounded-full px-4 py-2 text-sm font-semibold text-[#203A60] ${corStatus}`}
              >
                {status}
              </span>
            </div>
          </div>
        </section>

        {/* SEGUNDA LINHA: SOLICITANTE, HOSPITAL E AÇÕES */}
        <section className="mt-20 grid grid-cols-[1fr_1.3fr_auto] items-end gap-8 px-2">

          {/* DADOS DO SOLICITANTE */}
          <div className="min-w-0">
            {editando && ehSaidaHospital ? (
              <>
                <label
                  htmlFor="solicitante"
                  className="mb-3 block text-xl font-semibold text-black"
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
                  className="mb-3 block text-xl font-semibold text-black"
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

          {/* EDITAR E CANCELAR: SOMENTE PENDENTES */}
          <div className="flex h-9 items-center gap-3">

            {pendente && (
              <>
                {editando ? (
                  <>
                    <button
                      type="button"
                      onClick={salvarEdicao}
                      className="flex h-9 items-center justify-center rounded-md border border-blue-900 bg-[#1673EB] px-4 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                      Salvar
                    </button>

                    <button
                      type="button"
                      onClick={descartarEdicao}
                      className="flex h-9 items-center justify-center rounded-md border border-gray-600 bg-white px-4 text-sm font-semibold text-black hover:bg-gray-100"
                    >
                      Descartar
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={iniciarEdicao}
                      className="flex h-9 items-center justify-center rounded-md border border-blue-900 bg-[#1673EB] px-4 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                      Editar
                    </button>

                    <button
                      type="button"
                      onClick={cancelarTransacao}
                      className="flex h-9 items-center justify-center rounded-md border border-[#720D16] bg-[#A51D2A] px-4 text-sm font-semibold text-white hover:bg-red-800"
                    >
                      Cancelar
                    </button>
                  </>
                )}
              </>
            )}
          </div>
        </section>

        {/* BOLSAS UTILIZADAS */}
        <section className="mt-24 px-2">
          <h2 className="mb-6 text-xl font-bold text-black">
            Bolsas Utilizadas
          </h2>

          <div className="overflow-x-auto bg-white">
            <table className="w-full border-collapse text-center text-sm">

              {/* CABEÇALHO */}
              <thead className="bg-[#D1E1F1] text-[#203A60]">
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
                    className="h-[86px] border-b border-gray-100 text-black"
                  >
                    <td className="px-4 font-semibold">
                      {bolsa.id}
                    </td>

                    <td className="px-4 font-semibold">
                      {bolsa.tipoSanguineo}
                    </td>

                    <td className="px-4 font-semibold">
                      {bolsa.volume}
                    </td>

                    <td className="px-4 font-semibold">
                      {formatarData(bolsa.coleta)}
                    </td>

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
            className="mx-2 mt-6 rounded-md bg-white px-4 py-3 font-medium text-[#203A60]"
          >
            {mensagem}
          </p>
        )}

        {/* BOTÃO VOLTAR NO RODAPÉ */}
        <div className="mt-auto flex justify-end px-2 pt-24">
          <Link
            href="/estoque/transacoes"
            className="flex h-11 min-w-32 items-center justify-center rounded-lg border border-black bg-white px-8 text-sm font-semibold text-black hover:bg-gray-100"
          >
            Voltar
          </Link>
        </div>
      </main>
    </div>
  );
}
