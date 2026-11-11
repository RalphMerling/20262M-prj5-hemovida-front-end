
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { FormEvent } from "react";
import Sidebar from "@/components/Sidebar";

type TipoTransacao =
  | ""
  | "Entrada por doação"
  | "Saída por descarte";

type Bolsa = {
  id: string;
  tipoSanguineo: string;
  volume: number;
};

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
const bolsasEstoque: Bolsa[] = Array.from(
  { length: 46 },
  (_, indice) => ({
    id: `BOL-${String(indice + 1).padStart(3, "0")}`,
    tipoSanguineo:
      tiposSanguineos[indice % tiposSanguineos.length],
    volume: 450,
  })
);

// DATA LOCAL NO FORMATO AAAA-MM-DD
function dataAtualLocal(): string {
  const hoje = new Date();

  const ano = hoje.getFullYear();
  const mes = String(hoje.getMonth() + 1).padStart(2, "0");
  const dia = String(hoje.getDate()).padStart(2, "0");

  return `${ano}-${mes}-${dia}`;
}

// ESTILOS
const classeLabel =
  "mb-3 block text-[20px] font-semibold text-black";

const classeCampo =
  "h-[35px] w-full rounded-md border border-[#C5C5C5] " +
  "bg-white px-3 text-sm text-black outline-none " +
  "placeholder:text-[#B5B5B5] focus:border-[#1673EB]";

const classeBotaoAdicionar =
  "flex h-[38px] shrink-0 items-center justify-center " +
  "rounded-sm border border-[#203A60] bg-[#1673EB] " +
  "px-3 text-sm font-semibold text-white hover:bg-[#285FCB]";

export default function NovaTransacaoPage() {
  const router = useRouter();

  const [tipoTransacao, setTipoTransacao] =
    useState<TipoTransacao>("");

  const [dataColeta, setDataColeta] = useState("");

  // CAMPOS PARA ENTRADA
  const [codigoNovaBolsa, setCodigoNovaBolsa] =
    useState("");

  const [tipoSanguineo, setTipoSanguineo] =
    useState("");

  const [volume, setVolume] = useState("450");

  // CAMPO PARA DESCARTE
  const [bolsaSelecionada, setBolsaSelecionada] =
    useState("");

  // BOLSAS ADICIONADAS
  const [bolsasAdicionadas, setBolsasAdicionadas] =
    useState<Bolsa[]>([]);

  const [observacoes, setObservacoes] = useState("");

  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");

  const ehEntrada =
    tipoTransacao === "Entrada por doação";

  const ehDescarte =
    tipoTransacao === "Saída por descarte";

  // ALTERAR TIPO
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

    if (ehEntrada) {
      const codigo =
        codigoNovaBolsa.trim().toUpperCase();

      if (!/^BOL-\d{3,}$/.test(codigo)) {
        setErro(
          "Informe o ID da bolsa no formato BOL-047."
        );
        return;
      }

      if (!tipoSanguineo) {
        setErro("Selecione o tipo sanguíneo.");
        return;
      }

      const volumeNumerico = Number(volume);

      if (
        !Number.isFinite(volumeNumerico) ||
        volumeNumerico <= 0
      ) {
        setErro("Informe um volume válido.");
        return;
      }

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
      const encontrada = bolsasEstoque.find(
        (bolsa) => bolsa.id === bolsaSelecionada
      );

      if (!encontrada) {
        setErro(
          "Selecione uma bolsa existente para descarte."
        );
        return;
      }

      novaBolsa = encontrada;
    }

    if (
      bolsasAdicionadas.some(
        (bolsa) => bolsa.id === novaBolsa.id
      )
    ) {
      setErro("Esta bolsa já foi adicionada.");
      return;
    }

    setBolsasAdicionadas((anteriores) => [
      ...anteriores,
      novaBolsa,
    ]);

    setCodigoNovaBolsa("");
    setTipoSanguineo("");
    setVolume("450");
    setBolsaSelecionada("");
  }

  // REMOVER BOLSA
  function removerBolsa(id: string) {
    setBolsasAdicionadas((anteriores) =>
      anteriores.filter((bolsa) => bolsa.id !== id)
    );

    setErro("");
    setMensagem("");
  }

  // REGISTRAR TRANSAÇÃO
  function registrarTransacao(
    evento: FormEvent<HTMLFormElement>
  ) {
    evento.preventDefault();

    setErro("");
    setMensagem("");

    if (!tipoTransacao) {
      setErro("Selecione o tipo de transação.");
      return;
    }

    if (ehEntrada && !dataColeta) {
      setErro("Informe a data da coleta.");
      return;
    }

    if (ehEntrada && dataColeta > dataAtualLocal()) {
      setErro(
        "A data da coleta não pode ser futura."
      );
      return;
    }

    if (bolsasAdicionadas.length === 0) {
      setErro(
        "Adicione pelo menos uma bolsa."
      );
      return;
    }

    if (ehDescarte && !observacoes.trim()) {
      setErro(
        "Informe o motivo do descarte nas observações."
      );
      return;
    }

    const confirmar = window.confirm(
      "Deseja simular o registro desta transação?"
    );

    if (!confirmar) return;

    const dados = {
      tipoTransacao,
      dataColeta: ehEntrada ? dataColeta : null,
      bolsas: bolsasAdicionadas,
      observacoes,
    };

    console.log("Transação simulada:", dados);

    setMensagem(
      "Transação validada na demonstração. " +
      "Nenhuma alteração foi gravada no banco de dados."
    );
  }

  // CANCELAR
  function cancelar() {
    router.push("/estoque/transacoes");
  }

  return (
    <div className="flex min-h-screen bg-[#E1E4E9]">

      {/* MENU LATERAL */}
      <Sidebar />

      {/* ÁREA PRINCIPAL */}
      <main className="flex min-w-0 flex-1 flex-col px-8 py-12">

        {/* CENTRALIZAÇÃO DO CONTEÚDO */}
        <div className="mx-auto flex w-full max-w-[900px] flex-1 flex-col">

          {/* TÍTULO */}
          <h1 className="mb-12 text-2xl font-bold text-[#203A60]">
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
                        ? " text-[#B5B5B5]"
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
                      "disabled:bg-[#F5F5F5]"
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
                        " flex flex-1 items-center text-[#B5B5B5]"
                      }
                    >
                      Buscar bolsa por ID ou tipo sanguíneo
                    </div>

                    <button
                      type="button"
                      disabled
                      className={
                        classeBotaoAdicionar +
                        " cursor-not-allowed opacity-60"
                      }
                    >
                      + Adicionar bolsa
                    </button>
                  </div>
                )}

                {/* ENTRADA POR DOAÇÃO */}
                {ehEntrada && (
                  <div className="space-y-4">

                    {/* ID E BOTÃO */}
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
                        className={classeCampo + " flex-1"}
                      />

                      <button
                        type="button"
                        onClick={adicionarBolsa}
                        className={classeBotaoAdicionar}
                      >
                        + Adicionar bolsa
                      </button>
                    </div>

                    {/* DADOS DA NOVA BOLSA */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="tipoSanguineo"
                          className="mb-2 block text-sm font-semibold text-[#203A60]"
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

                          {tiposSanguineos.map((tipo) => (
                            <option
                              key={tipo}
                              value={tipo}
                            >
                              {tipo}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label
                          htmlFor="volume"
                          className="mb-2 block text-sm font-semibold text-[#203A60]"
                        >
                          Volume (mL)
                        </label>

                        <input
                          id="volume"
                          type="number"
                          min="1"
                          value={volume}
                          onChange={(evento) =>
                            setVolume(evento.target.value)
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

                    <button
                      type="button"
                      onClick={adicionarBolsa}
                      className={classeBotaoAdicionar}
                    >
                      + Adicionar bolsa
                    </button>
                  </div>
                )}

                {/* BOLSAS ADICIONADAS */}
                {bolsasAdicionadas.length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-3">
                    {bolsasAdicionadas.map((bolsa) => (
                      <div
                        key={bolsa.id}
                        className="flex items-center gap-3 rounded-md border border-[#B5CAD8] bg-white px-4 py-2"
                      >
                        <span className="text-sm font-semibold text-[#203A60]">
                          {bolsa.id} — {bolsa.tipoSanguineo}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            removerBolsa(bolsa.id)
                          }
                          aria-label={`Remover ${bolsa.id}`}
                          className="text-lg font-bold text-red-700"
                        >
                          ×
                        </button>
                      </div>
                    ))}
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
                    setObservacoes(evento.target.value)
                  }
                  required={ehDescarte}
                  placeholder={
                    ehDescarte
                      ? "Informe o motivo do descarte..."
                      : "Informações adicionais sobre a transação..."
                  }
                  className="h-[207px] w-full resize-none rounded-md border border-[#C5C5C5] bg-white px-3 py-2 text-sm text-black outline-none placeholder:text-[#B5B5B5] focus:border-[#1673EB]"
                />
              </div>

              {/* ERRO */}
              {erro && (
                <p
                  role="alert"
                  className="mt-6 rounded-md bg-red-100 px-4 py-3 text-sm font-semibold text-red-800"
                >
                  {erro}
                </p>
              )}

              {/* MENSAGEM */}
              {mensagem && (
                <p
                  role="status"
                  className="mt-6 rounded-md bg-white px-4 py-3 text-sm font-semibold text-[#203A60]"
                >
                  {mensagem}
                </p>
              )}
            </div>

            {/* BOTÕES INFERIORES */}
            <div className="mt-auto flex justify-end gap-6 pt-12">

              <button
                type="button"
                onClick={cancelar}
                className="flex h-11 min-w-[156px] items-center justify-center rounded-lg border border-black bg-white px-6 text-sm font-semibold text-black hover:bg-gray-100"
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="flex h-11 min-w-[210px] items-center justify-center rounded-lg border border-[#203A60] bg-[#1673EB] px-6 text-sm font-semibold text-white hover:bg-[#285FCB]"
              >
                Registrar transação
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
