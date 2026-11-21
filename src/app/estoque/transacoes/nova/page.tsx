
"use client";

import { useState } from "react";
import type { FormEvent } from "react";

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

// TIPOS PERMITIDOS NA NOVA TRANSAÇÃO
// Saídas para hospitais pertencem ao fluxo de Solicitações.
type TipoTransacao =
  | ""
  | "Entrada por doação"
  | "Saída por descarte";

type Bolsa = {
  id: string;
  tipoSanguineo: string;
  volume: number;
};

// TIPOS SANGUÍNEOS
const tiposSanguineos = [
  "O+",
  "O-",
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
];

// ESTOQUE SIMULADO
// Mantidos os 46 registros demonstrativos.
const bolsasEstoque: Bolsa[] = Array.from(
  { length: 46 },
  (_, indice) => ({
    id: `BOL-${String(indice + 1).padStart(3, "0")}`,
    tipoSanguineo:
      tiposSanguineos[indice % tiposSanguineos.length],
    volume: 450,
  })
);

// ======================================================
// MS2 ESTOQUE
// Usuário provisório até integração da autenticação
// ======================================================

const usuarioEstoque = {
  nome: "Usuário de teste",
  cargo: "Estoque",
};

// DATA LOCAL NO FORMATO AAAA-MM-DD
function dataAtualLocal(): string {
  const hoje = new Date();

  const ano = hoje.getFullYear();

  const mes = String(
    hoje.getMonth() + 1
  ).padStart(2, "0");

  const dia = String(
    hoje.getDate()
  ).padStart(2, "0");

  return `${ano}-${mes}-${dia}`;
}

// ESTILOS COMPARTILHADOS DA TELA
// MS2 ESTOQUE: aplicadas as cores globais da Bia.
const classeLabel =
  "mb-3 block text-[20px] font-semibold text-preto";

const classeCampo =
  "h-[35px] w-full rounded-md border border-gray-300 " +
  "bg-card px-3 text-sm text-preto outline-none " +
  "placeholder:text-gray-400 focus:border-azul-2";

// MS2 ESTOQUE
// Os botões utilizam os componentes compartilhados.
// Esta classe preserva a altura e os espaçamentos
// do formulário existente.
const classeBotaoAdicionar =
  "h-[38px] shrink-0 rounded-sm px-3 text-sm";

// ======================================================
// MS2 ESTOQUE
// Nova Transação adaptada ao Design System da Bia.
// Mantidas as regras, os campos e a navegação original.
// ======================================================

export default function NovaTransacaoPage() {

  // TIPO DE TRANSAÇÃO
  const [tipoTransacao, setTipoTransacao] =
    useState<TipoTransacao>("");

  const [dataColeta, setDataColeta] =
    useState("");

  // CAMPOS PARA ENTRADA POR DOAÇÃO
  const [codigoNovaBolsa, setCodigoNovaBolsa] =
    useState("");

  const [tipoSanguineo, setTipoSanguineo] =
    useState("");

  const [volume, setVolume] =
    useState("450");

  // CAMPO PARA SAÍDA POR DESCARTE
  const [bolsaSelecionada, setBolsaSelecionada] =
    useState("");

  // BOLSAS ADICIONADAS À TRANSAÇÃO
  const [
    bolsasAdicionadas,
    setBolsasAdicionadas,
  ] = useState<Bolsa[]>([]);

  // OBSERVAÇÕES
  const [observacoes, setObservacoes] =
    useState("");

  // MENSAGENS
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");

  // IDENTIFICAR TIPO SELECIONADO
  const ehEntrada =
    tipoTransacao === "Entrada por doação";

  const ehDescarte =
    tipoTransacao === "Saída por descarte";

  // ALTERAR TIPO DE TRANSAÇÃO
  function alterarTipo(valor: TipoTransacao) {
    setTipoTransacao(valor);

    setDataColeta("");
    setCodigoNovaBolsa("");
    setTipoSanguineo("");
    setVolume("450");
    setBolsaSelecionada("");
    setBolsasAdicionadas([]);
    setObservacoes("");
    setErro("");
    setMensagem("");
  }

  // ADICIONAR BOLSA
  function adicionarBolsa() {
    setErro("");
    setMensagem("");

    if (!tipoTransacao) {
      setErro("Selecione o tipo de transação.");
      return;
    }

    let novaBolsa: Bolsa;

    // ENTRADA POR DOAÇÃO
    if (ehEntrada) {
      const codigo =
        codigoNovaBolsa.trim().toUpperCase();

      // VALIDAR ID DA BOLSA
      if (!/^BOL-\d{3,}$/.test(codigo)) {
        setErro(
          "Informe o ID da bolsa no formato BOL-047."
        );
        return;
      }

      // VALIDAR TIPO SANGUÍNEO
      if (!tipoSanguineo) {
        setErro("Selecione o tipo sanguíneo.");
        return;
      }

      // VALIDAR VOLUME
      const volumeNumerico = Number(volume);

      if (
        !Number.isFinite(volumeNumerico) ||
        volumeNumerico <= 0
      ) {
        setErro("Informe um volume válido.");
        return;
      }

      // IMPEDIR ID JÁ EXISTENTE NO ESTOQUE SIMULADO
      if (
        bolsasEstoque.some(
          (bolsa) => bolsa.id === codigo
        )
      ) {
        setErro(
          "Esse ID já existe no estoque simulado."
        );
        return;
      }

      novaBolsa = {
        id: codigo,
        tipoSanguineo,
        volume: volumeNumerico,
      };
    } else {

      // SAÍDA POR DESCARTE:
      // SELECIONAR BOLSA EXISTENTE
      const encontrada = bolsasEstoque.find(
        (bolsa) =>
          bolsa.id === bolsaSelecionada
      );

      if (!encontrada) {
        setErro(
          "Selecione uma bolsa existente para descarte."
        );
        return;
      }

      novaBolsa = encontrada;
    }

    // NÃO PERMITIR BOLSA DUPLICADA
    if (
      bolsasAdicionadas.some(
        (bolsa) => bolsa.id === novaBolsa.id
      )
    ) {
      setErro("Esta bolsa já foi adicionada.");
      return;
    }

    // ADICIONAR BOLSA À LISTA
    setBolsasAdicionadas((anteriores) => [
      ...anteriores,
      novaBolsa,
    ]);

    // LIMPAR CAMPOS
    setCodigoNovaBolsa("");
    setTipoSanguineo("");
    setVolume("450");
    setBolsaSelecionada("");
  }

  // REMOVER BOLSA
  function removerBolsa(id: string) {
    setBolsasAdicionadas((anteriores) =>
      anteriores.filter(
        (bolsa) => bolsa.id !== id
      )
    );

    setErro("");
    setMensagem("");
  }

  // REGISTRAR TRANSAÇÃO SIMULADA
  function registrarTransacao(
    evento: FormEvent<HTMLFormElement>
  ) {
    evento.preventDefault();

    setErro("");
    setMensagem("");

    // VALIDAR TIPO
    if (!tipoTransacao) {
      setErro("Selecione o tipo de transação.");
      return;
    }

    // VALIDAR DATA DE COLETA
    if (ehEntrada && !dataColeta) {
      setErro("Informe a data da coleta.");
      return;
    }

    if (
      ehEntrada &&
      dataColeta > dataAtualLocal()
    ) {
      setErro(
        "A data da coleta não pode ser futura."
      );
      return;
    }

    // VALIDAR BOLSAS
    if (bolsasAdicionadas.length === 0) {
      setErro(
        "Adicione pelo menos uma bolsa."
      );
      return;
    }

    // VALIDAR MOTIVO DO DESCARTE
    if (
      ehDescarte &&
      !observacoes.trim()
    ) {
      setErro(
        "Informe o motivo do descarte nas observações."
      );
      return;
    }

    // CONFIRMAÇÃO
    const confirmar = window.confirm(
      "Deseja simular o registro desta transação?"
    );

    if (!confirmar) {
      return;
    }

    // DADOS DA TRANSAÇÃO SIMULADA
    const dados = {
      tipoTransacao,
      dataColeta: ehEntrada
        ? dataColeta
        : null,
      bolsas: bolsasAdicionadas,
      observacoes,
    };

    console.log(
      "Transação simulada:",
      dados
    );

    setMensagem(
      "Transação validada na demonstração. " +
      "Nenhuma alteração foi gravada no banco de dados."
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

      {/* ÁREA PRINCIPAL */}
      <main className="flex min-w-0 flex-1 flex-col px-8 py-12">

        {/* CENTRALIZAÇÃO DO CONTEÚDO */}
        <div className="mx-auto flex w-full max-w-[900px] flex-1 flex-col">

          {/* TÍTULO */}
          <h1 className="mb-12 text-2xl font-bold text-azul-1">
            Nova transação
          </h1>

          {/* FORMULÁRIO */}
          <form
            onSubmit={registrarTransacao}
            className="flex flex-1 flex-col px-9"
          >

            <div className="flex-1">

              {/* PRIMEIRA LINHA */}
              <div className="grid grid-cols-2 gap-8">

                {/* TIPO DE TRANSAÇÃO */}
                <div>
                  <label
                    htmlFor="tipoTransacao"
                    className={classeLabel}
                  >
                    Tipo de transação *
                  </label>

                  <select
                    id="tipoTransacao"
                    value={tipoTransacao}
                    onChange={(evento) =>
                      alterarTipo(
                        evento.target.value as TipoTransacao
                      )
                    }
                    className={
                      classeCampo +
                      (!tipoTransacao
                        ? " text-gray-400"
                        : "")
                    }
                    required
                  >
                    <option value="" disabled>
                      Informe o tipo de transação
                    </option>

                    <option value="Entrada por doação">
                      Entrada por doação
                    </option>

                    <option value="Saída por descarte">
                      Saída por descarte
                    </option>
                  </select>
                </div>

                {/* DATA DA COLETA */}
                <div>
                  <label
                    htmlFor="dataColeta"
                    className={classeLabel}
                  >
                    Data da coleta
                  </label>

                  <input
                    id="dataColeta"
                    type="date"
                    value={dataColeta}
                    max={dataAtualLocal()}
                    onChange={(evento) =>
                      setDataColeta(evento.target.value)
                    }
                    disabled={!ehEntrada}
                    required={ehEntrada}
                    className={
                      classeCampo +
                      " disabled:cursor-not-allowed " +
                      "disabled:bg-gray-100"
                    }
                  />
                </div>
              </div>

              {/* SEGUNDA LINHA */}
              <div className="mt-14">

                <label className={classeLabel}>
                  ID da Bolsa(s) *
                </label>

                {/* SEM TIPO SELECIONADO */}
                {!tipoTransacao && (
                  <div className="flex items-center gap-2">

                    <div
                      className={
                        classeCampo +
                        " flex min-w-0 flex-1 " +
                        "items-center text-gray-400"
                      }
                    >
                      Buscar bolsa por ID ou tipo sanguíneo
                    </div>

                    {/* MS2 ESTOQUE: BUTTON DA BIA */}
                    <Button
                      type="button"
                      variante="secundario"
                      tamanho="sm"
                      disabled
                      className={classeBotaoAdicionar}
                    >
                      + Adicionar bolsa
                    </Button>
                  </div>
                )}

                {/* ENTRADA POR DOAÇÃO */}
                {ehEntrada && (
                  <div className="space-y-4">

                    {/* ID DA NOVA BOLSA E BOTÃO */}
                    <div className="flex items-center gap-2">

                      <input
                        type="text"
                        value={codigoNovaBolsa}
                        onChange={(evento) =>
                          setCodigoNovaBolsa(
                            evento.target.value.toUpperCase()
                          )
                        }
                        placeholder="Informe o ID da nova bolsa. Ex.: BOL-047"
                        aria-label="ID da nova bolsa"
                        className={
                          classeCampo +
                          " min-w-0 flex-1"
                        }
                      />

                      {/* MS2 ESTOQUE: BUTTON DA BIA */}
                      <Button
                        type="button"
                        variante="secundario"
                        tamanho="sm"
                        onClick={adicionarBolsa}
                        className={classeBotaoAdicionar}
                      >
                        + Adicionar bolsa
                      </Button>
                    </div>

                    {/* TIPO SANGUÍNEO E VOLUME */}
                    <div className="grid grid-cols-2 gap-4">

                      {/* TIPO SANGUÍNEO */}
                      <div>
                        <label
                          htmlFor="tipoSanguineo"
                          className="mb-2 block text-sm font-semibold text-azul-1"
                        >
                          Tipo sanguíneo
                        </label>

                        <select
                          id="tipoSanguineo"
                          value={tipoSanguineo}
                          onChange={(evento) =>
                            setTipoSanguineo(
                              evento.target.value
                            )
                          }
                          className={classeCampo}
                        >
                          <option value="">
                            Selecione o tipo sanguíneo
                          </option>

                          {tiposSanguineos.map(
                            (tipo) => (
                              <option
                                key={tipo}
                                value={tipo}
                              >
                                {tipo}
                              </option>
                            )
                          )}
                        </select>
                      </div>

                      {/* VOLUME */}
                      <div>
                        <label
                          htmlFor="volume"
                          className="mb-2 block text-sm font-semibold text-azul-1"
                        >
                          Volume (mL)
                        </label>

                        <input
                          id="volume"
                          type="number"
                          min="1"
                          value={volume}
                          onChange={(evento) =>
                            setVolume(
                              evento.target.value
                            )
                          }
                          className={classeCampo}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* SAÍDA POR DESCARTE */}
                {ehDescarte && (
                  <div className="flex items-center gap-2">

                    {/* SELECIONAR BOLSA EXISTENTE */}
                    <select
                      aria-label="Selecione uma bolsa para descarte"
                      value={bolsaSelecionada}
                      onChange={(evento) =>
                        setBolsaSelecionada(
                          evento.target.value
                        )
                      }
                      className={
                        classeCampo +
                        " min-w-0 flex-1"
                      }
                    >
                      <option value="">
                        Buscar bolsa por ID ou tipo sanguíneo
                      </option>

                      {bolsasEstoque
                        .filter(
                          (bolsa) =>
                            !bolsasAdicionadas.some(
                              (item) =>
                                item.id === bolsa.id
                            )
                        )
                        .map((bolsa) => (
                          <option
                            key={bolsa.id}
                            value={bolsa.id}
                          >
                            {bolsa.id} — {bolsa.tipoSanguineo}
                          </option>
                        ))}
                    </select>

                    {/* MS2 ESTOQUE: BUTTON DA BIA */}
                    <Button
                      type="button"
                      variante="secundario"
                      tamanho="sm"
                      onClick={adicionarBolsa}
                      className={classeBotaoAdicionar}
                    >
                      + Adicionar bolsa
                    </Button>
                  </div>
                )}

                {/* BOLSAS ADICIONADAS */}
                {bolsasAdicionadas.length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-3">
                    {bolsasAdicionadas.map(
                      (bolsa) => (
                        <div
                          key={bolsa.id}
                          className="flex items-center gap-3 rounded-md border border-gray-300 bg-card px-4 py-2"
                        >

                          {/* IDENTIFICAÇÃO */}
                          <span className="text-sm font-semibold text-azul-1">
                            {bolsa.id} — {bolsa.tipoSanguineo}
                          </span>

                          {/* MS2 ESTOQUE:
                              BUTTON PARA REMOVER BOLSA */}
                          <Button
                            type="button"
                            variante="cancelar"
                            tamanho="sm"
                            onClick={() =>
                              removerBolsa(bolsa.id)
                            }
                            aria-label={`Remover ${bolsa.id}`}
                            className="h-7 min-w-7 px-2 py-0 text-sm"
                          >
                            ×
                          </Button>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>

              {/* OBSERVAÇÕES */}
              <div className="mt-16">

                <label
                  htmlFor="observacoes"
                  className={classeLabel}
                >
                  Observações
                  {ehDescarte ? " *" : ""}
                </label>

                <textarea
                  id="observacoes"
                  rows={8}
                  value={observacoes}
                  onChange={(evento) =>
                    setObservacoes(
                      evento.target.value
                    )
                  }
                  required={ehDescarte}
                  placeholder={
                    ehDescarte
                      ? "Informe o motivo do descarte..."
                      : "Informações adicionais sobre a transação..."
                  }
                  className={
                    "h-[207px] w-full resize-none " +
                    "rounded-md border border-gray-300 " +
                    "bg-card px-3 py-2 text-sm " +
                    "text-preto outline-none " +
                    "placeholder:text-gray-400 " +
                    "focus:border-azul-2"
                  }
                />
              </div>

              {/* MENSAGEM DE ERRO */}
              {erro && (
                <p
                  role="alert"
                  className="mt-6 rounded-md bg-red-100 px-4 py-3 text-sm font-semibold text-red-800"
                >
                  {erro}
                </p>
              )}

              {/* MENSAGEM DE CONFIRMAÇÃO */}
              {mensagem && (
                <p
                  role="status"
                  className="mt-6 rounded-md bg-card px-4 py-3 text-sm font-semibold text-azul-1"
                >
                  {mensagem}
                </p>
              )}
            </div>

            {/* ========================================
                MS2 ESTOQUE
                Botões inferiores padronizados da Bia
                Mantida a navegação e a simulação
                ======================================== */}
            <div className="mt-auto flex justify-end gap-6 pt-12">

              {/* CANCELAR:
                  VOLTA PARA LISTA DE TRANSAÇÕES */}
              <ButtonLink
                href="/estoque/transacoes"
                variante="voltar"
                tamanho="sm"
                className="h-11 min-w-[156px] px-6 text-sm"
              >
                Cancelar
              </ButtonLink>

              {/* REGISTRAR:
                  VALIDA E SIMULA O REGISTRO */}
              <Button
                type="submit"
                variante="secundario"
                tamanho="sm"
                className="h-11 min-w-[210px] px-6 text-sm"
              >
                Registrar transação
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
