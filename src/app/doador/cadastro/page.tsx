"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { InputField } from "@/components/form/InputField";
import { RadioGroup } from "@/components/form/RadioGroup";
import { SelectField } from "@/components/form/SelectField";
import { Logo } from "@/components/layout/Logo";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { IDADE_MAXIMA, IDADE_MINIMA, idadePermitida } from "@/lib/regras";
import { buscarEnderecoPorCep } from "@/services/viacepService";

const formularioInicial = {
  nome: "",
  cpf: "",
  nascimento: "",
  genero: "",
  telefone: "",
  cep: "",
  endereco: "",
  email: "",
  tipoSanguineo: "",
  fatorRh: "",
};

type Formulario = typeof formularioInicial;
type Erros = Partial<Record<keyof Formulario, string>>;

const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const somenteNumeros = (texto: string) => texto.replace(/\D/g, "");

export default function CadastroDoador() {
  const [form, setForm] = useState<Formulario>(formularioInicial);
  const [erros, setErros] = useState<Erros>({});
  const [mensagem, setMensagem] = useState<{ tipo: "erro" | "sucesso"; texto: string } | null>(null);

  // Atualiza UM campo sem apagar os outros. Uso: atualizar("nome", "Maria")
  function atualizar(campo: keyof Formulario, valor: string) {
    setForm((atual) => ({ ...atual, [campo]: valor }));
    setErros((atuais) => ({ ...atuais, [campo]: undefined })); // some o erro ao digitar
  }

  // Quando o CEP chega a 8 números, busca o endereço.
  useEffect(() => {
    if (form.cep.length !== 8) return;

    let cancelado = false; // evita atualizar a tela com uma resposta antiga

    buscarEnderecoPorCep(form.cep)
      .then((endereco) => {
        if (cancelado) return;
        setForm((atual) => ({ ...atual, endereco }));
      })
      .catch((erro: Error) => {
        if (cancelado) return;
        setErros((atuais) => ({ ...atuais, cep: erro.message }));
      });

    return () => {
      cancelado = true;
    };
  }, [form.cep]);

  function validar(): Erros {
    const novos: Erros = {};

    if (!form.nome.trim()) novos.nome = "Informe o nome completo.";
    if (form.cpf.length !== 11) novos.cpf = "O CPF precisa ter 11 números.";

    if (!form.nascimento) {
      novos.nascimento = "Informe a data de nascimento.";
    } else if (!idadePermitida(form.nascimento)) {
      novos.nascimento = `Só é possível doar entre ${IDADE_MINIMA} e ${IDADE_MAXIMA} anos.`;
    }

    if (!form.genero) novos.genero = "Escolha uma opção.";
    if (form.telefone.length < 10) novos.telefone = "Informe o telefone com DDD.";
    if (form.cep.length !== 8) novos.cep = "O CEP precisa ter 8 números.";
    if (!form.endereco.trim()) novos.endereco = "Informe o endereço.";

    if (!form.email.trim()) novos.email = "Informe o e-mail.";
    else if (!emailValido.test(form.email)) novos.email = "Informe um e-mail válido.";

    if (!form.tipoSanguineo) novos.tipoSanguineo = "Selecione o tipo.";
    if (!form.fatorRh) novos.fatorRh = "Selecione o fator RH.";

    return novos;
  }

  function cadastrar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setMensagem(null);

    const novosErros = validar();
    setErros(novosErros);

    if (Object.keys(novosErros).length > 0) {
      setMensagem({ tipo: "erro", texto: "Corrija os campos destacados para continuar." });
      return;
    }

    // TODO: aqui entra a chamada para a API (criar o usuário no MS4 e depois o doador no MS1).
    console.log("Dados válidos:", form);
    setMensagem({ tipo: "sucesso", texto: "Dados válidos! A integração com a API vem no próximo passo." });
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col items-center gap-10 px-6 py-10">
      <Logo className="text-4xl" />

      <form onSubmit={cadastrar} noValidate className="grid w-full gap-x-16 gap-y-5 md:grid-cols-2">
        {/* Coluna da esquerda: dados pessoais */}
        <div className="flex flex-col gap-5 md:border-r md:border-vermelho-1 md:pr-16">
          <InputField
            label="Nome completo"
            value={form.nome}
            onChange={(e) => atualizar("nome", e.target.value)}
            erro={erros.nome}
          />
          <InputField
            label="CPF"
            inputMode="numeric"
            maxLength={11}
            value={form.cpf}
            onChange={(e) => atualizar("cpf", somenteNumeros(e.target.value))}
            erro={erros.cpf}
          />
          <InputField
            label="Data de nascimento"
            type="date"
            value={form.nascimento}
            onChange={(e) => atualizar("nascimento", e.target.value)}
            erro={erros.nascimento}
          />
          <RadioGroup
            label="Gênero"
            name="genero"
            opcoes={["Feminino", "Masculino", "Outros"]}
            valor={form.genero}
            aoMudar={(valor) => atualizar("genero", valor)}
            erro={erros.genero}
          />
          <InputField
            label="Telefone"
            inputMode="numeric"
            maxLength={11}
            placeholder="DDD + número"
            value={form.telefone}
            onChange={(e) => atualizar("telefone", somenteNumeros(e.target.value))}
            erro={erros.telefone}
          />
        </div>

        {/* Coluna da direita: endereço, contato e sangue */}
        <div className="flex flex-col gap-5">
          <InputField
            label="CEP"
            inputMode="numeric"
            maxLength={8}
            placeholder="Somente números"
            value={form.cep}
            onChange={(e) => atualizar("cep", somenteNumeros(e.target.value))}
            erro={erros.cep}
          />
          <InputField
            label="Endereço"
            value={form.endereco}
            onChange={(e) => atualizar("endereco", e.target.value)}
            erro={erros.endereco}
          />
          <InputField
            label="E-mail"
            type="email"
            value={form.email}
            onChange={(e) => atualizar("email", e.target.value)}
            erro={erros.email}
          />
          <div className="grid grid-cols-2 gap-4">
            <SelectField
              label="Tipo sanguíneo"
              opcoes={["A", "B", "AB", "O"]}
              value={form.tipoSanguineo}
              onChange={(e) => atualizar("tipoSanguineo", e.target.value)}
              erro={erros.tipoSanguineo}
            />
            <SelectField
              label="Fator RH"
              opcoes={["+", "-"]}
              value={form.fatorRh}
              onChange={(e) => atualizar("fatorRh", e.target.value)}
              erro={erros.fatorRh}
            />
          </div>

          {mensagem && <Alert tipo={mensagem.tipo}>{mensagem.texto}</Alert>}

          <div className="flex flex-col items-center gap-3 pt-2">
            <Button variante="primario" type="submit" className="w-64">
              Cadastrar
            </Button>
            <p>
              Já tem cadastro?{" "}
              <Link href="/doador/login" className="font-bold underline">
                Clique aqui
              </Link>
            </p>
          </div>
        </div>
      </form>
    </main>
  );
}