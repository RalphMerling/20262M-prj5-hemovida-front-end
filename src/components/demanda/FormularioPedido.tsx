"use client";

import { Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import type { FormEvent } from "react";
import { SelectField } from "@/components/form/SelectField";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import type { TipoPedido } from "@/models/pedido";

const tiposSanguineos = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const hemocomponentes = ["Concentrado de Hemácias", "Plaquetas", "Plasma", "Outros"];
const quantidades = Array.from({ length: 20 }, (_, i) => String(i + 1));

type Campo = "tipoSanguineo" | "hemocomponente" | "quantidade";

// Uma linha do formulário. "chave" só serve para o React saber qual linha é qual.
interface ItemFormulario {
  chave: number;
  tipoSanguineo: string;
  hemocomponente: string;
  quantidade: string;
}

// Erros por linha: { 1: { tipoSanguineo: "Selecione o tipo sanguíneo." } }
type Erros = Record<number, Partial<Record<Campo, string>>>;

const textos: Record<TipoPedido, string> = {
  REGULAR: "Pedido regular enviado com sucesso.",
  EMERGENCIAL: "Pedido emergencial enviado com sucesso.",
};

// Formulário de pedido de sangue. Serve para o regular e, depois, para o emergencial.
export function FormularioPedido({ tipo }: { tipo: TipoPedido }) {
  const router = useRouter();
  const proximaChave = useRef(2);

  const [itens, setItens] = useState<ItemFormulario[]>([
    { chave: 1, tipoSanguineo: "", hemocomponente: "", quantidade: "1" },
  ]);
  const [erros, setErros] = useState<Erros>({});
  const [sucesso, setSucesso] = useState(false);
  const [confirmandoCancelar, setConfirmandoCancelar] = useState(false);

  const preenchido = itens.length > 1 || itens.some((i) => i.tipoSanguineo || i.hemocomponente || i.quantidade !== "1");

  function atualizar(chave: number, campo: Campo, valor: string) {
    setSucesso(false);
    setItens((atuais) => atuais.map((i) => (i.chave === chave ? { ...i, [campo]: valor } : i)));
    setErros((atuais) => ({ ...atuais, [chave]: { ...atuais[chave], [campo]: undefined } }));
  }

  function adicionar() {
    setSucesso(false);
    setItens((atuais) => [
      ...atuais,
      { chave: proximaChave.current++, tipoSanguineo: "", hemocomponente: "", quantidade: "1" },
    ]);
  }

  function remover(chave: number) {
    setItens((atuais) => atuais.filter((i) => i.chave !== chave));
  }

  function cancelar() {
    // Só pergunta "tem certeza?" se já tiver algo preenchido.
    if (preenchido) setConfirmandoCancelar(true);
    else router.push("/admin/demanda");
  }

  function confirmar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();

    const novosErros: Erros = {};
    for (const item of itens) {
      if (!item.tipoSanguineo) novosErros[item.chave] = { tipoSanguineo: "Selecione o tipo sanguíneo." };
      if (!item.hemocomponente) {
        novosErros[item.chave] = { ...novosErros[item.chave], hemocomponente: "Selecione o hemocomponente." };
      }
    }
    setErros(novosErros);
    if (Object.keys(novosErros).length > 0) {
      setSucesso(false);
      return;
    }

    // TODO: com a API: pedidosService.criar({ tipo, itens }). Erros possíveis: 400 validação, 403 perfil.
    setSucesso(true);
    setItens([{ chave: proximaChave.current++, tipoSanguineo: "", hemocomponente: "", quantidade: "1" }]);
  }

  return (
    <Card>
      <form onSubmit={confirmar} noValidate // Os [&_...] deixam os campos do SelectField (compartilhado) menores só aqui, sem mexer nele.
      className="mx-auto flex max-w-2xl flex-col gap-4 py-2 [&_label]:text-sm [&_select]:py-2 [&_select]:text-sm">
        <div>
          <h2 className="text-xl text-azul-1">Itens do Pedido</h2>
          <p className="mt-1 text-xs text-preto/70">
            Adicione um ou mais itens informando tipo sanguíneo, hemocomponente e quantidade de bolsas.
          </p>
        </div>

        {sucesso && <Alert tipo="sucesso">{textos[tipo]}</Alert>}

        <div className="divide-y divide-preto/15">
          {itens.map((item, indice) => (
            <div
              key={item.chave}
              className="grid grid-cols-1 items-start gap-3 py-4 first:pt-0 md:grid-cols-[1fr_1.5fr_1fr_auto]"
            >
              <SelectField
                tema="admin"
                label="Tipo Sanguíneo"
                opcoes={tiposSanguineos}
                value={item.tipoSanguineo}
                erro={erros[item.chave]?.tipoSanguineo}
                onChange={(e) => atualizar(item.chave, "tipoSanguineo", e.target.value)}
              />
              <SelectField
                tema="admin"
                label="Hemocomponente"
                opcoes={hemocomponentes}
                value={item.hemocomponente}
                erro={erros[item.chave]?.hemocomponente}
                onChange={(e) => atualizar(item.chave, "hemocomponente", e.target.value)}
              />
              <SelectField
                tema="admin"
                label="Qtd. de bolsas"
                opcoes={quantidades}
                value={item.quantidade}
                onChange={(e) => atualizar(item.chave, "quantidade", e.target.value)}
              />
              {/* Com um item só, não dá para remover: o pedido precisa de pelo menos um. */}
              <button
                type="button"
                aria-label={`Remover item ${indice + 1}`}
                disabled={itens.length === 1}
                onClick={() => remover(item.chave)}
                className="mt-6 flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-vermelho-1 text-vermelho-1 transition hover:bg-vermelho-1 hover:text-branco disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-vermelho-1"
              >
                <Trash2 size={16} aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={adicionar}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-preto/30 py-2 text-sm font-semibold text-azul-1 transition hover:bg-azul-3/20"
        >
          <Plus size={16} aria-hidden="true" />
          Adicionar item
        </button>

        <div className="flex justify-end gap-3">
          <Button type="button" variante="cancelar" tamanho="sm" onClick={cancelar}>
            Cancelar
          </Button>
          <Button type="submit" variante="secundario" tamanho="sm">
            Confirmar Pedido
          </Button>
        </div>
      </form>

      <ConfirmDialog
        aberto={confirmandoCancelar}
        titulo="Tem certeza que deseja cancelar o pedido?"
        descricao="Os itens preenchidos serão perdidos."
        textoConfirmar="Sim, cancelar"
        aoConfirmar={() => router.push("/admin/demanda")}
        aoCancelar={() => setConfirmandoCancelar(false)}
      />
    </Card>
  );
}
