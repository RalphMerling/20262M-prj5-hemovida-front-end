"use client";

import Image from "next/image";
import { useSyncExternalStore } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { imagem } from "@/lib/imagem";

// Não tem nada para "assinar": a data não muda sozinha na tela.
const assinar = () => () => {};

function dataDeHoje(): string {
  return new Date().toLocaleDateString("pt-BR", { day: "numeric", month: "long" });
}

// Bento azul escuro do gestor: saudação + atalhos para os dois tipos de pedido.
export function BannerGestor({ hospital }: { hospital: string }) {
  // Lê a data no navegador. No servidor devolve "" para não dar diferença entre os dois.
  const data = useSyncExternalStore(assinar, dataDeHoje, () => "");

  return (
    <section className="relative flex min-h-56 items-center overflow-hidden rounded-xl bg-azul-1 px-8 py-6 text-branco">
      {/* A imagem tem o mesmo azul do fundo, então se mistura com ele. Só aparece em telas grandes, para não ficar por cima do texto. */}
      <Image
        src={imagem("/img/banner-gestor.png")}
        alt=""
        fill
        sizes="(min-width: 1280px) 70vw, 0px"
        priority
        className="hidden object-contain object-right xl:block"
      />

      <div className="relative z-10 flex max-w-xl flex-col gap-4">
        <h1 className="text-3xl">Olá, gestor!</h1>
        <p className="text-lg">
          Aqui está o panorama do estoque de sangue do {hospital}.{data && ` Hoje, ${data}.`}
        </p>
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/admin/demanda/regular" variante="suave">
            Solicitação Regular
          </ButtonLink>
          <ButtonLink href="/admin/demanda/emergencial" variante="primario">
            Pedido Emergencial
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
