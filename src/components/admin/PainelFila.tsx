"use client";

import { Maximize2, Search, X } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { Pagination } from "@/components/ui/Pagination";
import { Table } from "@/components/ui/Table";
import type { Coluna } from "@/components/ui/Table";
import { Tabs } from "@/components/ui/Tabs";
import type { ColetaConcluida, PacienteNaFila } from "@/data/mock";

const POR_PAGINA = 5;

type IdAba = "fila" | "concluidas";

const abas: { id: IdAba; rotulo: string }[] = [
  { id: "fila", rotulo: "Aguardando triagem" },
  { id: "concluidas", rotulo: "Coletas concluídas" },
];

const colunasFila: Coluna<PacienteNaFila>[] = [
  {
    titulo: "Nome",
    largura: "22%",
    render: (p) => (
      <span className="block truncate" title={p.nome}>
        {p.nome}
      </span>
    ),
  },
  { titulo: "CPF", largura: "20%", render: (p) => <span className="whitespace-nowrap">{p.cpf}</span> },
  { titulo: "Tipo de doação", largura: "16%", render: (p) => p.tipoDoacao },
  { titulo: "Tipo sanguíneo", largura: "14%", render: (p) => <Badge variante="sangue">{p.tipoSanguineo}</Badge> },
  {
    titulo: "Ações",
    largura: "28%",
    render: () => (
      <span className="flex items-center gap-2">
        <ButtonLink href="/admin/triagem" tamanho="sm">
          Iniciar triagem
        </ButtonLink>
        <Button variante="cancelar" tamanho="sm" aria-label="Cancelar" title="Cancelar">
          <X size={14} />
        </Button>
      </span>
    ),
  },
];

// Etiqueta verde para coleta concluída e vermelha para cancelada.
function EtiquetaStatus({ status }: { status: ColetaConcluida["status"] }) {
  return <Badge variante={status === "Concluído" ? "sucesso" : "erro"}>{status}</Badge>;
}

// Versão resumida, que cabe no card. O detalhe completo fica no modal.
const colunasResumo: Coluna<ColetaConcluida>[] = [
  {
    titulo: "Nome",
    largura: "28%",
    render: (c) => (
      <span className="block truncate" title={c.nome}>
        {c.nome}
      </span>
    ),
  },
  { titulo: "CPF", largura: "22%", render: (c) => <span className="whitespace-nowrap">{c.cpf}</span> },
  { titulo: "Tipo de doação", largura: "20%", render: (c) => c.tipoDoacao },
  { titulo: "Tipo sanguíneo", largura: "15%", render: (c) => <Badge variante="sangue">{c.tipoSanguineo}</Badge> },
  { titulo: "Status", largura: "15%", render: (c) => <EtiquetaStatus status={c.status} /> },
];

// Versão completa, usada dentro do modal.
const colunasCompletas: Coluna<ColetaConcluida>[] = [
  {
    titulo: "Nome",
    largura: "16%",
    render: (c) => (
      <span className="block truncate" title={c.nome}>
        {c.nome}
      </span>
    ),
  },
  { titulo: "CPF", largura: "13%", render: (c) => <span className="whitespace-nowrap">{c.cpf}</span> },
  { titulo: "Vol. coletado", largura: "9%", render: (c) => (c.volumeMl === null ? "---" : `${c.volumeMl} mL`) },
  { titulo: "Tipo sanguíneo", largura: "9%", render: (c) => <Badge variante="sangue">{c.tipoSanguineo}</Badge> },
  { titulo: "Tipo de doação", largura: "12%", render: (c) => c.tipoDoacao },
  { titulo: "Data e hora", largura: "14%", render: (c) => <span className="whitespace-nowrap">{c.dataHora}</span> },
  { titulo: "Código da bolsa", largura: "17%", render: (c) => <span className="whitespace-nowrap">{c.codigoBolsa}</span> },
  { titulo: "Status", largura: "10%", render: (c) => <EtiquetaStatus status={c.status} /> },
];

// "José" e "jose" ficam iguais na busca.
const normalizar = (texto: string) =>
  texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
const soDigitos = (texto: string) => texto.replace(/\D/g, "");

// A busca vale para o nome (com ou sem acento) e para o CPF (com ou sem pontos).
function combinaComBusca(nome: string, cpf: string, termo: string): boolean {
  const procurado = termo.trim();
  if (!procurado) return true;
  const digitos = soDigitos(procurado);
  return normalizar(nome).includes(normalizar(procurado)) || (digitos.length > 0 && soDigitos(cpf).includes(digitos));
}

// "02/09/2026 10:08" vira "2026-09-02", o formato que o campo de data do navegador usa.
function dataIso(dataHora: string): string {
  const [dia, mes, ano] = dataHora.slice(0, 10).split("/");
  return `${ano}-${mes}-${dia}`;
}

// Pega só os itens da página atual. Página 2 com 5 por página = itens 6 a 10.
function fatiar<T>(lista: T[], pagina: number): T[] {
  const inicio = (pagina - 1) * POR_PAGINA;
  return lista.slice(inicio, inicio + POR_PAGINA);
}

const estiloCampo =
  "rounded-lg border border-preto bg-card px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-azul-3";

// Conteúdo do modal: busca por nome/CPF, filtro por dia, tabela completa e paginação.
// Fica separado para ter o próprio estado, que recomeça do zero toda vez que o modal abre.
function HistoricoColetas({ concluidas, aoFechar }: { concluidas: ColetaConcluida[]; aoFechar: () => void }) {
  const [pagina, setPagina] = useState(1);
  const [termo, setTermo] = useState("");
  const [dia, setDia] = useState("");

  function digitarBusca(valor: string) {
    setTermo(valor);
    setPagina(1);
  }
  function escolherDia(valor: string) {
    setDia(valor);
    setPagina(1);
  }

  const filtradas = concluidas.filter(
    (c) => combinaComBusca(c.nome, c.cpf, termo) && (!dia || dataIso(c.dataHora) === dia),
  );
  const totalPaginas = Math.max(1, Math.ceil(filtradas.length / POR_PAGINA));

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <input
          aria-label="Pesquisar por nome ou CPF"
          placeholder="Pesquisar por nome ou CPF"
          value={termo}
          onChange={(e) => digitarBusca(e.target.value)}
          className={`w-72 ${estiloCampo}`}
        />
        <input
          type="date"
          aria-label="Filtrar por dia da coleta"
          value={dia}
          onChange={(e) => escolherDia(e.target.value)}
          className={estiloCampo}
        />
      </div>

      {/* Altura mínima fixa: a janela não muda de tamanho entre as páginas. */}
      <div className="min-h-[22rem]">
        <Table
          colunas={colunasCompletas}
          dados={fatiar(filtradas, pagina)}
          vazio="Nenhuma coleta encontrada."
        />
      </div>

      {/* Espaço reservado: a paginação some quando só há uma página, mas o espaço continua. */}
      <div className="min-h-[3.5rem]">
        <Pagination paginaAtual={pagina} totalPaginas={totalPaginas} aoMudar={setPagina} />
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <Button variante="cancelar" onClick={aoFechar}>
          Cancelar
        </Button>
        <Button onClick={aoFechar}>OK</Button>
      </div>
    </div>
  );
}

interface PainelFilaProps {
  fila: PacienteNaFila[];
  concluidas: ColetaConcluida[];
  className?: string;
}

export function PainelFila({ fila, concluidas, className = "" }: PainelFilaProps) {
  const [aba, setAba] = useState<IdAba>("fila");
  const [pagina, setPagina] = useState(1);
  const [buscando, setBuscando] = useState(false);
  const [termo, setTermo] = useState("");
  const [modalAberto, setModalAberto] = useState(false);

  // Sempre que muda a aba ou a busca, volta para a página 1.
  function trocarAba(nova: IdAba) {
    setAba(nova);
    setPagina(1);
  }
  function digitarBusca(valor: string) {
    setTermo(valor);
    setPagina(1);
  }
  function alternarBusca() {
    if (buscando) digitarBusca(""); // ao fechar, limpa a busca
    setBuscando(!buscando);
  }

  const filaFiltrada = fila.filter((p) => combinaComBusca(p.nome, p.cpf, termo));
  const concluidasFiltradas = concluidas.filter((c) => combinaComBusca(c.nome, c.cpf, termo));

  const total = aba === "fila" ? filaFiltrada.length : concluidasFiltradas.length;
  const totalPaginas = Math.max(1, Math.ceil(total / POR_PAGINA));
  const textoVazio = termo.trim()
    ? "Nenhum resultado para a busca."
    : aba === "fila"
      ? "Ninguém aguardando triagem agora."
      : "Nenhuma coleta concluída ainda.";

  return (
    <Card className={`min-w-0 ${className}`}>
      {/* Linha do topo com altura fixa. A pesquisa abre POR CIMA das abas (que ficam
          escondidas, mas ocupando o mesmo espaço), então nada muda de tamanho. */}
      <div className="relative mb-4 flex h-10 items-center justify-between gap-4">
        <div className={buscando ? "invisible" : ""}>
          <Tabs abas={abas} ativa={aba} aoMudar={trocarAba} />
        </div>

        {buscando && (
          <input
            autoFocus
            aria-label="Pesquisar por nome ou CPF"
            placeholder="Pesquisar por nome ou CPF"
            value={termo}
            onChange={(e) => digitarBusca(e.target.value)}
            className={`absolute inset-y-0 left-0 right-20 my-auto h-9 ${estiloCampo}`}
          />
        )}

        <div className="ml-auto flex items-center gap-2">
          <button
            aria-label={buscando ? "Fechar pesquisa" : "Pesquisar"}
            onClick={alternarBusca}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-azul-3 text-azul-1 transition hover:brightness-95"
          >
            {buscando ? <X size={16} /> : <Search size={16} />}
          </button>
          {aba === "concluidas" && (
            <button
              aria-label="Expandir histórico de coletas"
              title="Expandir"
              onClick={() => setModalAberto(true)}
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-azul-3 text-azul-1 transition hover:brightness-95"
            >
              <Maximize2 size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Altura mínima fixa: o card não encolhe quando a página tem poucos itens. */}
      <div className="min-h-[26rem]">
        {aba === "fila" ? (
          <Table colunas={colunasFila} dados={fatiar(filaFiltrada, pagina)} vazio={textoVazio} />
        ) : (
          <Table colunas={colunasResumo} dados={fatiar(concluidasFiltradas, pagina)} vazio={textoVazio} />
        )}
      </div>

      {/* Espaço reservado: a paginação some quando só há uma página, mas o espaço continua. */}
      <div className="min-h-[3.5rem]">
        <Pagination paginaAtual={pagina} totalPaginas={totalPaginas} aoMudar={setPagina} />
      </div>

      <Modal aberto={modalAberto} aoFechar={() => setModalAberto(false)} titulo="Histórico de coletas" grande>
        {modalAberto && <HistoricoColetas concluidas={concluidas} aoFechar={() => setModalAberto(false)} />}
      </Modal>
    </Card>
  );
}