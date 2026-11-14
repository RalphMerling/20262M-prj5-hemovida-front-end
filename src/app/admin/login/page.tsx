"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { InputField } from "@/components/form/InputField";
import { AuthSplit } from "@/components/layout/AuthSplit";
import { Button } from "@/components/ui/Button";

const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginAdmin() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erros, setErros] = useState<{ email?: string; senha?: string }>({});

  function entrar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault(); // impede a página de recarregar

    const novosErros: { email?: string; senha?: string } = {};
    if (!email.trim()) novosErros.email = "Informe o e-mail.";
    else if (!emailValido.test(email)) novosErros.email = "Informe um e-mail válido.";
    if (!senha) novosErros.senha = "Informe a senha.";
    setErros(novosErros);

    if (Object.keys(novosErros).length === 0) {
      // TODO: aqui vai a chamada de login (Server Action + cookie).
      console.log("Dados válidos:", { email });
    }
  }

  return (
    <AuthSplit
      titulo="Bem-vindo admin"
      texto="Painel interno do hemocentro. Recepção, triagem e coleta em um só lugar."
    >
      <form onSubmit={entrar} className="flex flex-col gap-5" noValidate>
        <InputField
          label="E-mail"
          tema="admin"
          type="email"
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          erro={erros.email}
        />
        <InputField
          label="Senha"
          tema="admin"
          type="password"
          autoComplete="current-password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          erro={erros.senha}
        />

        <div className="flex justify-center pt-4">
          <Button variante="secundario" type="submit" className="w-64">
            Entrar
          </Button>
        </div>
      </form>
    </AuthSplit>
  );
}