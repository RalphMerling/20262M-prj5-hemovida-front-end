import { DoacaoFluxo } from "@/components/doacao/DoacaoFluxo";
import { ButtonLink } from "@/components/ui/Button";
import { filaTriagemMock } from "@/data/mock";

// O endereço chega assim: /admin/doacao?id=1  (o id é de quem acabou de passar na triagem).
export default async function DoacaoPage({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const { id } = await searchParams;
  const paciente = filaTriagemMock.find((p) => String(p.id) === id);

  // Sem id (ou id que não existe), por exemplo ao clicar em "Doação" no menu.
  if (!paciente) {
    return (
      <div className="space-y-6">
        <h1 className="text-4xl text-azul-1">Registro de Coleta</h1>
        <p className="text-preto/70">
          A coleta começa depois da triagem. Escolha alguém da fila e clique em &quot;Iniciar triagem&quot;.
        </p>
        <ButtonLink href="/admin">Ir para a fila</ButtonLink>
      </div>
    );
  }

  // O key faz o formulário recomeçar do zero quando muda o paciente.
  return <DoacaoFluxo key={paciente.id} paciente={paciente} />;
}