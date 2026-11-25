"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { InputField } from "@/components/form/InputField";
import { SelectField } from "@/components/form/SelectField";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import type { Doador, FatorRh, Genero, TipoSanguineo } from "@/models/doador";

export type DadosEditaveis = Pick<Doador, "doador_email" | "doador_endereco" | "doador_telefone" | "doador_genero"> & {
  doador_tipo_sanguineo?: TipoSanguineo;
  doador_fator_rh?: FatorRh;
};

interface EditarDoadorModalProps {
  doador: Doador;
  // true só na recepção: a API só deixa ADMIN e RECEPCAO editar o tipo sanguíneo e o fator RH.
  podeEditarSangue?: boolean;
  aoSalvar: (dados: DadosEditaveis) => void;
  aoFechar: () => void;
}

const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function EditarDoadorModal({ doador, podeEditarSangue = false, aoSalvar, aoFechar }: EditarDoadorModalProps) {
  const [email, setEmail] = useState(doador.doador_email);
  const [endereco, setEndereco] = useState(doador.doador_endereco);
  const [telefone, setTelefone] = useState(doador.doador_telefone);
  const [genero, setGenero] = useState<string>(doador.doador_genero);
  const [tipoSanguineo, setTipoSanguineo] = useState<string>(doador.doador_tipo_sanguineo ?? "");
  const [fatorRh, setFatorRh] = useState<string>(doador.doador_fator_rh ?? "");
  const [erros, setErros] = useState<Record<string, string>>({});

  function salvar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();

    const novos: Record<string, string> = {};
    if (!emailValido.test(email)) novos.email = "Informe um e-mail válido.";
    if (!endereco.trim()) novos.endereco = "Informe o endereço.";
    if (telefone.length < 10) novos.telefone = "Informe o telefone com DDD.";
    if (!genero) novos.genero = "Selecione o gênero.";
    // O tipo sanguíneo é opcional, mas se preencher um, precisa preencher o outro.
    if (podeEditarSangue && tipoSanguineo && !fatorRh) novos.fatorRh = "Selecione o fator RH.";
    if (podeEditarSangue && fatorRh && !tipoSanguineo) novos.tipoSanguineo = "Selecione o tipo.";
    setErros(novos);
    if (Object.keys(novos).length > 0) return;

    const dados: DadosEditaveis = {
      doador_email: email,
      doador_endereco: endereco,
      doador_telefone: telefone,
      doador_genero: genero as Genero,
    };
    if (podeEditarSangue && tipoSanguineo && fatorRh) {
      dados.doador_tipo_sanguineo = tipoSanguineo as TipoSanguineo;
      dados.doador_fator_rh = fatorRh as FatorRh;
    }

    aoSalvar(dados);
  }

  return (
    <Modal aberto aoFechar={aoFechar} titulo="Edição de cadastro do doador">
      <form onSubmit={salvar} noValidate className="flex flex-col gap-4">
        <InputField tema="admin" label="E-mail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} erro={erros.email} />
        <InputField tema="admin" label="Endereço" value={endereco} onChange={(e) => setEndereco(e.target.value)} erro={erros.endereco} />
        <InputField
          tema="admin"
          label="Telefone"
          inputMode="numeric"
          maxLength={11}
          value={telefone}
          onChange={(e) => setTelefone(e.target.value.replace(/\D/g, ""))}
          erro={erros.telefone}
        />
        <SelectField
          tema="admin"
          label="Gênero"
          opcoes={["Feminino", "Masculino", "Outros"]}
          value={genero}
          onChange={(e) => setGenero(e.target.value)}
          erro={erros.genero}
        />
        {podeEditarSangue && (
          <div className="grid grid-cols-2 gap-4">
            <SelectField
              tema="admin"
              label="Tipo sanguíneo"
              opcoes={["A", "B", "AB", "O"]}
              value={tipoSanguineo}
              onChange={(e) => setTipoSanguineo(e.target.value)}
              erro={erros.tipoSanguineo}
            />
            <SelectField
              tema="admin"
              label="Fator RH"
              opcoes={["+", "-"]}
              value={fatorRh}
              onChange={(e) => setFatorRh(e.target.value)}
              erro={erros.fatorRh}
            />
          </div>
        )}
        <div className="mt-2 flex justify-end gap-3">
          <Button type="button" variante="cancelar" onClick={aoFechar}>
            Cancelar
          </Button>
          <Button type="submit">OK</Button>
        </div>
      </form>
    </Modal>
  );
}