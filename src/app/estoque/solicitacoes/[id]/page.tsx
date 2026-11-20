
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

// STATUS DA SOLICITAÇÃO
type StatusSolicitacao =
  | "Entregue"
  | "Pendente"
  | "Aprovada"
  | "Cancelada";

// DADOS DA SOLICITAÇÃO
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

// HOSPITAIS SIMULADOS
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

// PRIMEIROS REGISTROS SIMULADOS
// Mantidos conforme a Lista de Solicitações.
const solicitacoesIniciais: {
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

// ======================================================
// MS2 ESTOQUE
// Identificação provisória até integração com autenticação
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

// BUSCAR SOLICITAÇÃO SIMULADA
function buscarSolicitacao(
  id: string
): Solicitacao | null {
  if (!/^TR-\d{3}$/.test(id)) {
    return null;
  }

  const numero = Number(
    id.replace("TR-", "")
  );

  if (numero < 9 || numero > 50) {
    return null;
  }

  const indice = numero - 9;

  const data = new Date(
    Date.UTC(2026, 9, numero)
  );

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

    hospital =
      hospitais[adicional % hospitais.length];

    tipoSanguineo =
      tiposSanguineos[
        adicional % tiposSanguineos.length
      ];

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

      <div className="min-h-10 rounded-md border border-gray-300 bg-card px-4 py-2 text-sm font-semibold text-preto">
        {valor}
      </div>
    </div>
  );
}

// ESTILOS DOS CAMPOS
// MS2 ESTOQUE: aplicadas as cores globais da Bia.
const classeLabel =
  "mb-3 block text-xl font-semibold text-preto";

const classeCampoEdicao =
  "min-h-10 w-full rounded-md border border-azul-2 " +
  "bg-card px-4 py-2 text-sm text-preto outline-none " +
  "focus:ring-1 focus:ring-azul-2";

// ======================================================
// MS2 ESTOQUE
// Classes de dimensionamento dos botões.
//
// As cores e os estados de interação são definidos pelo
// componente compartilhado Button.tsx da Bia.
//
// Todos os botões do rodapé terão 44 px de altura.
// ======================================================

const classeBotaoAcao =
  "h-11 shrink-0 px-5 text-sm";

const classeBotaoVoltar =
  "h-11 min-w-[160px] shrink-0 px-5 text-sm";

// ======================================================
// MS2 ESTOQUE
// Detalhes da Solicitação adaptados ao Design System.
//
// Preservados:
// - Dados da solicitação
// - Edição de campos
// - Aprovação demonstrativa
// - Cancelamento demonstrativo
// - Tabela de bolsas vinculadas
// - Ações somente quando Pendente
// - Voltar sempre no canto inferior direito
// ======================================================

export default function DetalhesSolicitacaoPage() {
  const params = useParams<{ id: string }>();

  const solicitacao = buscarSolicitacao(params.id);

  // ESTADOS DA SIMULAÇÃO
  const [statusEditado, setStatusEditado] =
    useState<StatusSolicitacao | null>(null);

  const [editando, setEditando] =
    useState(false);

  const [
    profissionalEditado,
    setProfissionalEditado,
  ] = useState<string | null>(null);

  const [hospitalEditado, setHospitalEditado] =
    useState<string | null>(null);

  const [tipoEditado, setTipoEditado] =
    useState<string | null>(null);

  const [mensagem, setMensagem] =
    useState("");

  const [erro, setErro] =
    useState("");

  // SOLICITAÇÃO NÃO ENCONTRADA
  if (!solicitacao) {
    return (
      <div className="flex min-h-screen bg-cinza-azulado">

        {/* MS2 ESTOQUE: SIDEBAR COMPARTILHADO DA BIA */}
        <Sidebar
          itens={MENU_ESTOQUE}
          usuario={usuarioEstoque}
        />

        <main className="min-w-0 flex-1 p-12">
          <h1 className="text-2xl font-bold text-azul-1">
            Solicitação não encontrada
          </h1>

          <div className="mt-6">
            <ButtonLink
              href="/estoque/solicitacoes"
              variante="voltar"
              tamanho="sm"
            >
              Voltar para Solicitações
            </ButtonLink>
          </div>
        </main>
      </div>
    );
  }

  // DADOS ATUAIS
  const idSolicitacao = solicitacao.id;

  const status =
    statusEditado ?? solicitacao.status;

  const profissional =
    profissionalEditado ?? solicitacao.profissional;

  const hospital =
    hospitalEditado ?? solicitacao.hospital;

  const tipoSanguineo =
    tipoEditado ?? solicitacao.tipoSanguineo;

  // ==================================================
  // MS2 ESTOQUE
  // REGRA DE NEGÓCIO
  //
  // Cancelar, Editar e Aprovar:
  // somente quando a solicitação estiver Pendente.
  //
  // Voltar:
  // sempre disponível e alinhado à direita.
  // ==================================================

  const pendente = status === "Pendente";

  // CORES DOS STATUS
  const corStatus =
    status === "Entregue"
      ? "bg-[#D0EEE8]"
      : status === "Aprovada"
        ? "bg-[#CDE9D5]"
        : status === "Pendente"
          ? "bg-[#FFF0D4]"
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

  // SALVAR ALTERAÇÕES DEMONSTRATIVAS
  function salvarEdicao() {
    if (!pendente) {
      return;
    }

    setErro("");
    setMensagem("");

    if (
      !profissional.trim() ||
      !hospital.trim() ||
      !tipoSanguineo
    ) {
      setErro(
        "Preencha todos os campos obrigatórios."
      );
      return;
    }

    setEditando(false);

    setMensagem(
      "Alterações aplicadas apenas nesta tela. " +
      "Nenhum dado foi gravado no banco de dados."
    );
  }

  // DESCARTAR ALTERAÇÕES
  function descartarEdicao() {
    setProfissionalEditado(null);
    setHospitalEditado(null);
    setTipoEditado(null);

    setEditando(false);
    setErro("");
    setMensagem("");
  }

  // CANCELAR SOLICITAÇÃO
  function cancelarSolicitacao() {
    if (!pendente || editando) {
      return;
    }

    const confirmar = window.confirm(
      `Deseja simular o cancelamento da solicitação ${idSolicitacao}?`
    );

    if (!confirmar) {
      return;
    }

    setStatusEditado("Cancelada");
    setEditando(false);
    setErro("");

    setMensagem(
      "Cancelamento simulado. " +
      "A solicitação não foi alterada no banco de dados."
    );
  }

  // APROVAR SOLICITAÇÃO
  function aprovarSolicitacao() {
    if (!pendente || editando) {
      return;
    }

    const confirmar = window.confirm(
      `Deseja simular a aprovação da solicitação ${idSolicitacao}?`
    );

    if (!confirmar) {
      return;
    }

    setStatusEditado("Aprovada");
    setEditando(false);
    setErro("");

    setMensagem(
      "Aprovação simulada. Nenhuma bolsa foi movimentada " +
      "e nenhum registro foi gravado no banco de dados."
    );
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
      <main className="flex min-w-0 flex-1 flex-col px-12 py-12">

        {/* TÍTULO E SETA DE RETORNO */}
        <div className="mb-8 flex items-center gap-5">

          <Link
            href="/estoque/solicitacoes"
            aria-label="Voltar para Solicitações"
            className="text-4xl text-preto hover:text-azul-1"
          >
            ←
          </Link>

          <h1 className="text-2xl font-bold text-azul-1">
            Detalhes da solicitação
          </h1>
        </div>

        {/* STATUS */}
        <div className="mb-12 flex justify-end">

          <span
            className={`rounded-full px-7 py-2 text-sm font-semibold text-azul-1 ${corStatus}`}
          >
            {status}
          </span>
        </div>

        {/* DADOS DA SOLICITAÇÃO */}
        <section className="grid grid-cols-3 gap-x-16 gap-y-12 px-2">

          {/* ID DA BOLSA */}
          <Campo
            titulo="ID da bolsa"
            valor={
              solicitacao.bolsa ?? "Não vinculada"
            }
          />

          {/* DATA DA SOLICITAÇÃO */}
          <Campo
            titulo="Data da solicitação"
            valor={formatarData(solicitacao.data)}
          />

          {/* HOSPITAL SOLICITANTE */}
          <div className="min-w-0">

            {editando ? (
              <>
                <label
                  htmlFor="hospital"
                  className={classeLabel}
                >
                  Hospital Solicitante
                </label>

                <select
                  id="hospital"
                  value={hospital}
                  onChange={(evento) =>
                    setHospitalEditado(
                      evento.target.value
                    )
                  }
                  className={classeCampoEdicao}
                >
                  {hospitais.map((item) => (
                    <option
                      key={item}
                      value={item}
                    >
                      {item}
                    </option>
                  ))}
                </select>
              </>
            ) : (
              <Campo
                titulo="Hospital Solicitante"
                valor={hospital}
              />
            )}
          </div>

          {/* PROFISSIONAL SOLICITANTE */}
          <div className="min-w-0">

            {editando ? (
              <>
                <label
                  htmlFor="profissional"
                  className={classeLabel}
                >
                  Profissional Solicitante
                </label>

                <input
                  id="profissional"
                  type="text"
                  value={profissional}
                  onChange={(evento) =>
                    setProfissionalEditado(
                      evento.target.value
                    )
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

          {/* TIPO SANGUÍNEO */}
          <div className="min-w-0">

            {editando ? (
              <>
                <label
                  htmlFor="tipoSanguineo"
                  className={classeLabel}
                >
                  Tipo sanguíneo
                </label>

                <select
                  id="tipoSanguineo"
                  value={tipoSanguineo}
                  onChange={(evento) =>
                    setTipoEditado(
                      evento.target.value
                    )
                  }
                  className={classeCampoEdicao}
                >
                  {tiposSanguineos.map((tipo) => (
                    <option
                      key={tipo}
                      value={tipo}
                    >
                      {tipo}
                    </option>
                  ))}
                </select>
              </>
            ) : (
              <Campo
                titulo="Tipo sanguíneo"
                valor={tipoSanguineo}
              />
            )}
          </div>

          {/* ENTRADA NO ESTOQUE */}
          <Campo
            titulo="Entrada no estoque"
            valor={
              solicitacao.entradaEstoque
                ? formatarData(
                    solicitacao.entradaEstoque
                  )
                : "—"
            }
          />
        </section>

        {/* BOLSAS VINCULADAS */}
        <section className="mt-24 px-2">

          <h2 className="mb-3 text-xl font-bold text-preto">
            Bolsas vinculadas
          </h2>

          <p className="mb-5 text-lg font-semibold text-gray-500">
            {solicitacao.bolsa && status === "Entregue"
              ? "Bolsa vinculada ao atendimento da solicitação."
              : "As bolsas serão vinculadas durante o atendimento da solicitação."}
          </p>

          <div className="overflow-x-auto bg-card">
            <table className="w-full border-collapse text-center text-sm">

              {/* CABEÇALHO */}
              <thead className="bg-[#D1E1F1] text-azul-1">
                <tr>
                  <th className="px-4 py-3">
                    Data
                  </th>

                  <th className="px-4 py-3">
                    Movimentação
                  </th>

                  <th className="px-4 py-3">
                    Transação
                  </th>

                  <th className="px-4 py-3">
                    Responsável
                  </th>
                </tr>
              </thead>

              {/* HISTÓRICO */}
              <tbody>
                {solicitacao.bolsa &&
                status === "Entregue" ? (
                  <tr className="h-20 text-preto">

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

        {/* MENSAGEM DE ERRO */}
        {erro && (
          <p
            role="alert"
            className="mx-2 mt-6 rounded-md bg-red-100 px-4 py-3 font-medium text-red-800"
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
            BOTÕES COMPARTILHADOS DA BIA

            Pendente:
            Cancelar, Editar e Aprovar à esquerda.

            Demais status:
            somente Voltar, à direita.

            Todos com 44 px de altura.
            ======================================== */}
        <div className="mt-auto flex items-center justify-between gap-4 px-2 pt-24">

          {/* AÇÕES À ESQUERDA */}
          <div className="flex items-center gap-4">

            {pendente && (
              <>
                {/* CANCELAR SOMENTE FORA DA EDIÇÃO */}
                {!editando && (
                  <Button
                    type="button"
                    variante="cancelar"
                    tamanho="sm"
                    onClick={cancelarSolicitacao}
                    className={classeBotaoAcao}
                  >
                    Cancelar Solicitação
                  </Button>
                )}

                {/* EDITAR OU SALVAR */}
                <Button
                  type="button"
                  variante="secundario"
                  tamanho="sm"
                  onClick={
                    editando
                      ? salvarEdicao
                      : iniciarEdicao
                  }
                  className={classeBotaoAcao}
                >
                  {editando
                    ? "Salvar alterações"
                    : "Editar Solicitação"}
                </Button>

                {/* APROVAR OU DESCARTAR EDIÇÃO */}
                {editando ? (
                  <Button
                    type="button"
                    variante="voltar"
                    tamanho="sm"
                    onClick={descartarEdicao}
                    className={classeBotaoAcao}
                  >
                    Descartar alterações
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variante="secundario"
                    tamanho="sm"
                    onClick={aprovarSolicitacao}
                    className={classeBotaoAcao}
                  >
                    Aprovar Solicitação
                  </Button>
                )}
              </>
            )}
          </div>

          {/* VOLTAR SEMPRE À DIREITA */}
          <ButtonLink
            href="/estoque/solicitacoes"
            variante="voltar"
            tamanho="sm"
            className={classeBotaoVoltar}
          >
            Voltar
          </ButtonLink>
        </div>
      </main>
    </div>
  );
}
