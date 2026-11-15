"use client";

import { CheckCircle2, Clock, Search, UserSearch } from "lucide-react";
import { useState } from "react";
import type { FormEvent } from "react";
import { EditarDoadorModal } from "@/components/doador/EditarDoadorModal";
import type { DadosEditaveis } from "@/components/doador/EditarDoadorModal";
import { FichaDoador } from "@/components/doador/FichaDoador";
import { Alert } from "@/components/ui/Alert";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EstadoVazio } from "@/components/ui/EstadoVazio";
import { doadoresMock } from "@/data/mock";
import type { DoadorComHistorico, ItemHistorico } from "@/data/mock";
import { formatarDataBR } from "@/lib/formatadores";
import { diasParaProximaDoacao, intervaloEmDias } from "@/lib/regras";

// A data da última doação CONCLUÍDA (doações canceladas não contam para o intervalo).
function ultimaConcluida(historico: ItemHistorico[]): string | null {
  const datas = historico.filter((item) => item.status === "Concluído").map((item) => item.data);
  return datas.length > 0 ? datas.sort().at(-1) ?? null : null;
}

type Mensagem = { tipo: "erro" | "sucesso"; texto: string };

export default function Recepcao() {
  const [cpf, setCpf] = useState("");
  const [erroBusca, setErroBusca] = useState("");
  const [encontrado, setEncontrado] = useState<DoadorComHistorico | null>(null);
  const [diasDeEspera, setDiasDeEspera] = useState(0);
  const [doacaoAberta, setDoacaoAberta] = useState(false);
  const [editando, setEditando] = useState(false);
  const [mensagem, setMensagem] = useState<Mensagem | null>(null);

  function buscar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setMensagem(null);
    setDoacaoAberta(false);

    if (cpf.length !== 11) {
      setErroBusca("O CPF precisa ter 11 números.");
      setEncontrado(null);
      return;
    }

    // TODO: trocar pela API: doadoresService.buscarPorCpf(cpf). O 404 vira "não encontrado".
    const achado = doadoresMock.find((item) => item.doador.doador_cpf === cpf);
    if (!achado) {
      setErroBusca("Nenhum doador encontrado com esse CPF.");
      setEncontrado(null);
      return;
    }

    setErroBusca("");
    setEncontrado(achado);

    // O cálculo usa a data de hoje
    const ultima = ultimaConcluida(achado.historico);
    setDiasDeEspera(ultima ? diasParaProximaDoacao(achado.doador.doador_genero, ultima) : 0);
  }

  function abrirDoacao() {
    if (!encontrado) return;
    // TODO: POST de nova doação. O doador passa a aparecer na fila de triagem.
    setDoacaoAberta(true);
    setMensagem({ tipo: "sucesso", texto: `Doação aberta para ${encontrado.doador.doador_nome}. Ela já aparece na fila de triagem.` });
  }

  function salvarEdicao(dados: DadosEditaveis) {
    // TODO: doadoresService.atualizar(id, dados). Erros possíveis: 400 validação, 403 perfil.
    setEncontrado((atual) => (atual ? { ...atual, doador: { ...atual.doador, ...dados } } : atual));
    setEditando(false);
    setMensagem({ tipo: "sucesso", texto: "Dados do doador atualizados." });
  }

  const podeDoar = encontrado !== null && encontrado.doador.doador_status === 1 && diasDeEspera === 0;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <h1 className="text-3xl text-azul-1 md:col-span-3">Identificação de doador</h1>

      <Card titulo="Digite o CPF do doador" className="md:col-span-3">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="w-full max-w-xl">
            <form onSubmit={buscar} className="flex" noValidate>
              <input
                aria-label="CPF do doador"
                inputMode="numeric"
                maxLength={11}
                placeholder="Somente números"
                value={cpf}
                onChange={(e) => setCpf(e.target.value.replace(/\D/g, ""))}
                className="min-w-0 flex-1 rounded-l-lg border border-preto bg-card px-4 py-3.5 text-lg outline-none focus:ring-2 focus:ring-azul-3"
              />
              <button
                type="submit"
                aria-label="Buscar doador"
                className="cursor-pointer rounded-r-lg border border-l-0 border-preto bg-azul-3 px-5 text-azul-1 transition hover:brightness-95"
              >
                <Search size={22} />
              </button>
            </form>
            <p className="mt-2 text-sm text-preto/70">O CPF tem 11 números, sem pontos ou traço.</p>

            {erroBusca && (
              <div className="mt-3">
                <Alert tipo="erro">{erroBusca}</Alert>
              </div>
            )}
          </div>

          {/* TODO: abrir o cadastro feito pela recepção (mesmo formulário do portal, perfil RECEPCAO). */}
          <Button variante="suave">Cadastrar novo doador</Button>
        </div>
      </Card>

      {mensagem && (
        <div className="md:col-span-3">
          <Alert tipo={mensagem.tipo}>{mensagem.texto}</Alert>
        </div>
      )}

    {!encontrado && (
        <EstadoVazio
          className="md:col-span-3"
          icone={<UserSearch size={32} />}
          titulo="Nenhum doador selecionado"
          texto="Digite o CPF acima para ver a ficha, o histórico de doações e se o doador já pode doar de novo."
        />
      )}

      {encontrado && (
        <>
          <FichaDoador
            className="md:col-span-3"
            doador={encontrado.doador}
            ultimaDoacao={ultimaConcluida(encontrado.historico)}
            acoes={
              <>
                <Button tamanho="sm" onClick={abrirDoacao} disabled={!podeDoar || doacaoAberta}>
                  Abrir nova doação
                </Button>
                <Button variante="voltar" tamanho="sm" onClick={() => setEditando(true)}>
                  Editar dados
                </Button>
              </>
            }
          />

          <Card titulo="Histórico do doador" className="md:col-span-2">
            {encontrado.historico.length === 0 ? (
              <p className="text-preto/70">Este doador ainda não tem nenhuma doação.</p>
            ) : (
              // o card não cresce se o histórico for grande.
              <ul className="max-h-60 space-y-4 overflow-y-auto pr-2">
                {[...encontrado.historico]
                  .sort((a, b) => b.data.localeCompare(a.data))
                  .map((item) => (
                    <li key={`${item.data}-${item.tipo}`} className="flex items-center justify-between border-l-2 border-azul-2 pl-4">
                      <div>
                        <p className="font-semibold">{formatarDataBR(item.data)}</p>
                        <p className="text-sm text-preto/70">{item.tipo}</p>
                      </div>
                      <Badge variante={item.status === "Concluído" ? "sucesso" : "erro"}>{item.status}</Badge>
                    </li>
                  ))}
              </ul>
            )}
          </Card>

          <Card titulo="Intervalo entre doações" className="flex flex-col md:col-span-1">
            <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
              {diasDeEspera === 0 ? (
                <>
                  <CheckCircle2 size={64} className="text-green-600" />
                  <p>Apto para nova doação</p>
                </>
              ) : (
                <>
                  <Clock size={64} className="text-amber-600" />
                  <p>
                    Aguarde mais <strong>{diasDeEspera} dias</strong> para uma nova doação
                  </p>
                  <p className="text-sm text-preto/70">
                    Intervalo mínimo: {intervaloEmDias(encontrado.doador.doador_genero)} dias
                  </p>
                </>
              )}
            </div>
          </Card>
        </>
      )}

      {encontrado && editando && (
        <EditarDoadorModal doador={encontrado.doador} aoSalvar={salvarEdicao} aoFechar={() => setEditando(false)} />
      )}
    </div>
  );
}