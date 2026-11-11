
"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import Sidebar from "@/components/Sidebar";

type StatusSolicitacao =
  | "Entregue"
  | "Pendente"
  | "Aprovada"
  | "Cancelada";

type Solicitacao = {
  id: string;
  data: string;
  hospital: string;
  profissional: string;
  tipoSanguineo: string;
  status: StatusSolicitacao;
  bolsa: string | null;
  entradaEstoque: string | null;
};

const hospitais = [
  "Hosp Munic Souza Aguiar",
  "Hosp Munic Miguel Couto",
  "Hosp Munic Salgado Filho",
  "Hosp Munic Pedro II",
  "Hosp Munic Lourenço Jorge",
  "Hosp Munic Rocha Faria",
  "Hosp Est Getúlio Vargas",
];

const tiposSanguineos = [
  "O+", "A+", "B+", "O-",
  "AB+", "A-", "B-", "AB-",
];

const solicitacoesIniciais: {
  hospital: string;
  tipo: string;
  status: StatusSolicitacao;
}[] = [
  { hospital: hospitais[0], tipo: "O+", status: "Entregue" },
  { hospital: hospitais[1], tipo: "A-", status: "Entregue" },
  { hospital: hospitais[2], tipo: "O+", status: "Entregue" },
  { hospital: hospitais[3], tipo: "B+", status: "Pendente" },
  { hospital: hospitais[4], tipo: "AB+", status: "Entregue" },
  { hospital: hospitais[5], tipo: "A+", status: "Pendente" },
  { hospital: hospitais[6], tipo: "O-", status: "Entregue" },
  { hospital: hospitais[0], tipo: "B-", status: "Cancelada" },
];

function formatarData(data: string): string {
  const [ano, mes, dia] = data.split("-");
  return `${dia}/${mes}/${ano}`;
}

function buscarSolicitacao(id: string): Solicitacao | null {
  if (!/^TR-\d{3}$/.test(id)) return null;

  const numero = Number(id.replace("TR-", ""));

  if (numero < 9 || numero > 50) return null;

  const indice = numero - 9;
  const data = new Date(Date.UTC(2026, 9, numero));

  let hospital: string;
  let tipoSanguineo: string;
  let status: StatusSolicitacao;

  if (indice < solicitacoesIniciais.length) {
    const registro = solicitacoesIniciais[indice];
    hospital = registro.hospital;
    tipoSanguineo = registro.tipo;
    status = registro.status;
  } else {
    const adicional = numero - 17;

    hospital = hospitais[adicional % hospitais.length];
    tipoSanguineo =
      tiposSanguineos[adicional % tiposSanguineos.length];

    status =
      numero % 9 === 0
        ? "Cancelada"
        : numero % 4 === 0
        ? "Pendente"
        : "Entregue";
  }

  return {
    id,
    data: data.toISOString().slice(0, 10),
    hospital,
    profissional: "João da Silva",
    tipoSanguineo,
    status,
    bolsa:
      status === "Entregue"
        ? `BOL-${String(numero).padStart(3, "0")}`
        : null,
    entradaEstoque: null,
  };
}

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
      <div className="min-h-10 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-black">
        {valor}
      </div>
    </div>
  );
}

const classeLabel =
  "mb-3 block text-xl font-semibold text-black";

const classeCampoEdicao =
  "min-h-10 w-full rounded-md border border-blue-500 " +
  "bg-white px-4 py-2 text-sm text-black outline-none";

const classeBotaoAcao =
  "flex h-11 shrink-0 items-center justify-center " +
  "rounded-lg px-5 text-sm font-semibold";

// VOLTAR COM A MESMA ALTURA DOS DEMAIS BOTÕES
const classeBotaoVoltar =
  "flex h-11 min-w-[160px] shrink-0 items-center " +
  "justify-center rounded-lg border border-gray-700 " +
  "bg-white px-5 text-sm font-semibold text-black " +
  "hover:bg-gray-100";

export default function DetalhesSolicitacaoPage() {
  const params = useParams<{ id: string }>();
  const solicitacao = buscarSolicitacao(params.id);

  const [statusEditado, setStatusEditado] =
    useState<StatusSolicitacao | null>(null);

  const [editando, setEditando] = useState(false);

  const [profissionalEditado, setProfissionalEditado] =
    useState<string | null>(null);

  const [hospitalEditado, setHospitalEditado] =
    useState<string | null>(null);

  const [tipoEditado, setTipoEditado] =
    useState<string | null>(null);

  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  if (!solicitacao) {
    return (
      <div className="flex min-h-screen bg-[#E1E4E9]">
        <Sidebar />
        <main className="min-w-0 flex-1 p-12">
          <h1 className="text-2xl font-bold text-[#203A60]">
            Solicitação não encontrada
          </h1>
          <Link
            href="/estoque/solicitacoes"
            className="mt-6 inline-block text-blue-700 underline"
          >
            Voltar para Solicitações
          </Link>
        </main>
      </div>
    );
  }

  const idSolicitacao = solicitacao.id;
  const status = statusEditado ?? solicitacao.status;

  const profissional =
    profissionalEditado ?? solicitacao.profissional;

  const hospital =
    hospitalEditado ?? solicitacao.hospital;

  const tipoSanguineo =
    tipoEditado ?? solicitacao.tipoSanguineo;

  const pendente = status === "Pendente";

  const corStatus =
    status === "Entregue"
      ? "bg-[#D0EEE8]"
      : status === "Aprovada"
      ? "bg-[#CDE9D5]"
      : status === "Pendente"
      ? "bg-[#FFF0D4]"
      : "bg-[#F9D4D8]";

  function iniciarEdicao() {
    if (!pendente) return;

    setEditando(true);
    setErro("");
    setMensagem("");
  }

  function salvarEdicao() {
    if (!pendente) return;

    setErro("");
    setMensagem("");

    if (
      !profissional.trim() ||
      !hospital.trim() ||
      !tipoSanguineo
    ) {
      setErro("Preencha todos os campos obrigatórios.");
      return;
    }

    setEditando(false);
    setMensagem(
      "Alterações aplicadas apenas nesta tela. " +
      "Nenhum dado foi gravado no banco de dados."
    );
  }

  function descartarEdicao() {
    setProfissionalEditado(null);
    setHospitalEditado(null);
    setTipoEditado(null);
    setEditando(false);
    setErro("");
    setMensagem("");
  }

  function cancelarSolicitacao() {
    if (!pendente || editando) return;

    const confirmar = window.confirm(
      `Deseja simular o cancelamento da solicitação ${idSolicitacao}?`
    );

    if (!confirmar) return;

    setStatusEditado("Cancelada");
    setEditando(false);
    setErro("");
    setMensagem(
      "Cancelamento simulado. " +
      "A solicitação não foi alterada no banco de dados."
    );
  }

  function aprovarSolicitacao() {
    if (!pendente || editando) return;

    const confirmar = window.confirm(
      `Deseja simular a aprovação da solicitação ${idSolicitacao}?`
    );

    if (!confirmar) return;

    setStatusEditado("Aprovada");
    setEditando(false);
    setErro("");
    setMensagem(
      "Aprovação simulada. Nenhuma bolsa foi movimentada " +
      "e nenhum registro foi gravado no banco de dados."
    );
  }

  return (
    <div className="flex min-h-screen bg-[#E1E4E9]">
      <Sidebar />

      <main className="flex min-w-0 flex-1 flex-col px-12 py-12">
        {/* TÍTULO */}
        <div className="mb-8 flex items-center gap-5">
          <Link
            href="/estoque/solicitacoes"
            aria-label="Voltar para Solicitações"
            className="text-4xl text-black hover:text-gray-600"
          >
            ←
          </Link>
          <h1 className="text-2xl font-bold text-[#203A60]">
            Detalhes da solicitação
          </h1>
        </div>

        {/* STATUS */}
        <div className="mb-12 flex justify-end">
          <span
            className={`rounded-full px-7 py-2 text-sm font-semibold text-[#203A60] ${corStatus}`}
          >
            {status}
          </span>
        </div>

        {/* DADOS */}
        <section className="grid grid-cols-3 gap-x-16 gap-y-12 px-2">
          <Campo
            titulo="ID da bolsa"
            valor={solicitacao.bolsa ?? "Não vinculada"}
          />

          <Campo
            titulo="Data da solicitação"
            valor={formatarData(solicitacao.data)}
          />

          <div>
            {editando ? (
              <>
                <label htmlFor="hospital" className={classeLabel}>
                  Hospital Solicitante
                </label>
                <select
                  id="hospital"
                  value={hospital}
                  onChange={(e) => setHospitalEditado(e.target.value)}
                  className={classeCampoEdicao}
                >
                  {hospitais.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </>
            ) : (
              <Campo titulo="Hospital Solicitante" valor={hospital} />
            )}
          </div>

          <div>
            {editando ? (
              <>
                <label htmlFor="profissional" className={classeLabel}>
                  Profissional Solicitante
                </label>
                <input
                  id="profissional"
                  type="text"
                  value={profissional}
                  onChange={(e) =>
                    setProfissionalEditado(e.target.value)
                  }
                  className={classeCampoEdicao}
                />
              </>
            ) : (
              <Campo
                titulo="Profissional Solicitante"
                valor={profissional}
              />
            )}
          </div>

          <div>
            {editando ? (
              <>
                <label htmlFor="tipoSanguineo" className={classeLabel}>
                  Tipo sanguíneo
                </label>
                <select
                  id="tipoSanguineo"
                  value={tipoSanguineo}
                  onChange={(e) => setTipoEditado(e.target.value)}
                  className={classeCampoEdicao}
                >
                  {tiposSanguineos.map((tipo) => (
                    <option key={tipo} value={tipo}>
                      {tipo}
                    </option>
                  ))}
                </select>
              </>
            ) : (
              <Campo titulo="Tipo sanguíneo" valor={tipoSanguineo} />
            )}
          </div>

          <Campo
            titulo="Entrada no estoque"
            valor={
              solicitacao.entradaEstoque
                ? formatarData(solicitacao.entradaEstoque)
                : "—"
            }
          />
        </section>

        {/* BOLSAS VINCULADAS */}
        <section className="mt-24 px-2">
          <h2 className="mb-3 text-xl font-bold text-black">
            Bolsas vinculadas
          </h2>

          <p className="mb-5 text-lg font-semibold text-gray-500">
            {solicitacao.bolsa && status === "Entregue"
              ? "Bolsa vinculada ao atendimento da solicitação."
              : "As bolsas serão vinculadas durante o atendimento da solicitação."}
          </p>

          <div className="overflow-x-auto bg-white">
            <table className="w-full border-collapse text-center text-sm">
              <thead className="bg-[#D1E1F1] text-[#203A60]">
                <tr>
                  <th className="px-4 py-3">Data</th>
                  <th className="px-4 py-3">Movimentação</th>
                  <th className="px-4 py-3">Transação</th>
                  <th className="px-4 py-3">Responsável</th>
                </tr>
              </thead>

              <tbody>
                {solicitacao.bolsa && status === "Entregue" ? (
                  <tr className="h-20 text-black">
                    <td className="px-4 font-medium">
                      {formatarData(solicitacao.data)}
                    </td>
                    <td className="px-4 font-medium">
                      Saída para Hospital
                    </td>
                    <td className="px-4 font-medium">
                      {solicitacao.id}
                    </td>
                    <td className="px-4 font-medium">
                      Equipe HemoVida
                    </td>
                  </tr>
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="h-28 px-4 text-center text-lg font-semibold text-gray-400"
                    >
                      Nenhuma bolsa vinculada
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* MENSAGENS */}
        {erro && (
          <p
            role="alert"
            className="mx-2 mt-6 rounded-md bg-red-100 px-4 py-3 font-medium text-red-800"
          >
            {erro}
          </p>
        )}

        {mensagem && (
          <p
            role="status"
            className="mx-2 mt-6 rounded-md bg-white px-4 py-3 font-medium text-[#203A60]"
          >
            {mensagem}
          </p>
        )}

        {/* BOTÕES INFERIORES */}
        <div className="mt-auto flex items-center justify-between gap-4 px-2 pt-24">
          {/* AÇÕES À ESQUERDA */}
          <div className="flex items-center gap-4">
            {pendente && (
              <>
                {!editando && (
                  <button
                    type="button"
                    onClick={cancelarSolicitacao}
                    className={`${classeBotaoAcao} border border-red-600 bg-white text-red-600 hover:bg-red-50`}
                  >
                    Cancelar Solicitação
                  </button>
                )}

                <button
                  type="button"
                  onClick={
                    editando ? salvarEdicao : iniciarEdicao
                  }
                  className={`${classeBotaoAcao} border border-blue-900 bg-[#1673EB] text-white hover:bg-blue-700`}
                >
                  {editando
                    ? "Salvar alterações"
                    : "Editar Solicitação"}
                </button>

                {editando ? (
                  <button
                    type="button"
                    onClick={descartarEdicao}
                    className={`${classeBotaoAcao} border border-gray-600 bg-white text-black hover:bg-gray-100`}
                  >
                    Descartar alterações
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={aprovarSolicitacao}
                    className={`${classeBotaoAcao} border border-green-800 bg-[#16803D] text-white hover:bg-green-800`}
                  >
                    Aprovar Solicitação
                  </button>
                )}
              </>
            )}
          </div>

          {/* VOLTAR À DIREITA */}
          <Link
            href="/estoque/solicitacoes"
            className={classeBotaoVoltar}
          >
            Voltar
          </Link>
        </div>
      </main>
    </div>
  );
}
