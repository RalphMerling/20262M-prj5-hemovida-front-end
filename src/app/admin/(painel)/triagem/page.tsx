"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { TriagemFluxo } from "@/components/triagem/TriagemFluxo";
import { ButtonLink } from "@/components/ui/Button";
import { filaTriagemMock } from "@/data/mock";

// O endereço chega assim: /admin/triagem?id=1  (o id é de quem está na fila).
function Triagem() {
  const id = useSearchParams().get("id");
  const paciente = filaTriagemMock.find((p) => String(p.id) === id);

  // Sem id (ou id que não existe), por exemplo ao clicar em "Triagem" no menu.
  if (!paciente) {
    return (
      <div className="space-y-6">
        <h1 className="text-4xl text-azul-1">Triagem Clínica</h1>
        <p className="text-preto/70">Nenhum paciente selecionado. Escolha alguém da fila e clique em &quot;Iniciar triagem&quot;.</p>
        <ButtonLink href="/admin">Ir para a fila</ButtonLink>
      </div>
    );
  }

  // O key faz o formulário recomeçar do zero quando muda o paciente.
  return <TriagemFluxo key={paciente.id} paciente={paciente} />;
}

// O Suspense é obrigatório quando a página lê o "?id=" (useSearchParams).
export default function TriagemPage() {
  return (
    <Suspense fallback={null}>
      <Triagem />
    </Suspense>
  );
}