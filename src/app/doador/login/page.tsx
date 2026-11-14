"use client";

import Link from "next/link";
import { useState } from "react";
import type { FormEvent } from "react";
import { InputField } from "@/components/form/InputField";
import { AuthSplit } from "@/components/layout/AuthSplit";
import { Button } from "@/components/ui/Button";

export default function LoginDoador() {
  const [cpf, setCpf] = useState("");
  const [nascimento, setNascimento] = useState("");
  const [erros, setErros] = useState<{ cpf?: string; nascimento?: string }>({});

  function entrar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault(); // impede a página de recarregar

    const novosErros: { cpf?: string; nascimento?: string } = {};
    if (cpf.length !== 11) novosErros.cpf = "O CPF precisa ter 11 números.";
    if (!nascimento) novosErros.nascimento = "Informe a data de nascimento.";
    setErros(novosErros);

    if (Object.keys(novosErros).length === 0) {
      // aqui vai entrar a chamada de login (Server Action + cookie).
      console.log("Dados válidos:", { cpf, nascimento });
    }
  }

  return (
    <AuthSplit
        titulo="Bem-vindo!"
        texto="Acompanhe seu histórico, veja quando pode doar de novo e confira o impacto de cada doação."
        imagem="/img/login-doador.jpg"
    >
      <form onSubmit={entrar} className="flex flex-col gap-5" noValidate>
        <InputField
          label="CPF"
          inputMode="numeric"
          maxLength={11}
          value={cpf}
          onChange={(e) => setCpf(e.target.value.replace(/\D/g, ""))}
          erro={erros.cpf}
        />
        <InputField
          label="Data de nascimento"
          type="date"
          value={nascimento}
          onChange={(e) => setNascimento(e.target.value)}
          erro={erros.nascimento}
        />

        <div className="flex flex-col items-center gap-4 pt-4">
          <Button variante="primario" type="submit" className="w-64">
            Entrar
          </Button>
          <p>
            Ainda não tem cadastro?{" "}
            <Link href="/doador/cadastro" className="font-bold underline">
              Clique aqui
            </Link>
          </p>
        </div>
      </form>
    </AuthSplit>
  );
}