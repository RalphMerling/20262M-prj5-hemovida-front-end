"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";

// Aparece quando alguma coisa quebra durante o uso. O "reset" tenta carregar a página de novo.
export default function PaginaComErro({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-branco px-8 text-center">
      <div>
        <h1 className="font-titulo text-3xl text-preto">Algo deu errado</h1>
        <p className="mt-2 max-w-md text-preto/70">
          Não foi possível abrir esta página agora. Tente de novo e, se continuar, avise a equipe.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        <Button onClick={reset}>Tentar de novo</Button>
        <Link
          href="/"
          className="rounded-full border-2 border-preto px-6 py-2 text-sm font-semibold text-preto transition hover:bg-preto hover:text-branco"
        >
          Ir para o início
        </Link>
      </div>
    </main>
  );
}