"use client";

import { useSyncExternalStore } from "react";

// Não tem nada para "assinar": a hora não muda sozinha na tela.
const assinar = () => () => {};

function dataPorExtenso(): string {
  const texto = new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" });
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

interface SaudacaoProps {
  nome: string;
  // "escuro" = texto claro, para usar sobre fundo azul escuro (o banner).
  fundo?: "claro" | "escuro";
}

// "Bom dia, Laura" + data de hoje.
export function Saudacao({ nome, fundo = "claro" }: SaudacaoProps) {
  // useSyncExternalStore lê um valor que vem de FORA do React (aqui, o relógio).
  // O 1º argumento "assina" mudanças, o 2º lê o valor no navegador e o 3º é o valor
  // usado no servidor, onde a hora ainda não existe.
  const hora = useSyncExternalStore(assinar, () => new Date().getHours(), () => -1);
  const data = useSyncExternalStore(assinar, dataPorExtenso, () => "");

  if (hora === -1) return <div className="h-16" />; // espaço reservado enquanto carrega

  const cumprimento = hora < 12 ? "Bom dia" : hora < 18 ? "Boa tarde" : "Boa noite";
  const escuro = fundo === "escuro";

  return (
    <div>
      <h1 className={`text-3xl ${escuro ? "text-branco" : "text-azul-1"}`}>
        {cumprimento}, {nome}
      </h1>
      <p className={escuro ? "text-branco/80" : "text-preto/70"}>{data}</p>
    </div>
  );
}