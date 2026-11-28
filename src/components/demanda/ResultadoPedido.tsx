import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { imagem } from "@/lib/imagem";

// Tela que ocupa o lugar do formulário depois de tentar enviar o pedido.
//   sucesso = o pedido foi enviado. Leva para a tela inicial ou para o histórico.
//   erro    = não foi possível enviar. Só leva para a tela inicial.
export function ResultadoPedido({ resultado }: { resultado: "sucesso" | "erro" }) {
  const sucesso = resultado === "sucesso";

  return (
    <Card>
      {/* aria-live: o leitor de tela anuncia o resultado assim que ele aparece */}
      <div role={sucesso ? "status" : "alert"} className="flex flex-col items-center gap-2 py-12 text-center">
        <Image
          src={imagem(sucesso ? "/img/icone-sucesso.png" : "/img/icone-erro.png")}
          alt=""
          width={128}
          height={128}
          className="mb-4"
        />
        <h2 className="text-2xl font-semibold text-preto">
          {sucesso ? "Solicitação Enviada Com Sucesso!" : "Parece que algo deu errado"}
        </h2>
        <p className="text-preto/70">
          {sucesso ? "Acompanhe o status do pedido na tela de histórico" : "Tente novamente mais tarde"}
        </p>

        <div className="mt-6 flex gap-3">
          <ButtonLink href="/admin/demanda" variante="voltar" tamanho="sm">
            Tela Inicial
          </ButtonLink>
          {sucesso && (
            <ButtonLink href="/admin/demanda/historico" variante="secundario" tamanho="sm">
              Ir para Histórico
            </ButtonLink>
          )}
        </div>
      </div>
    </Card>
  );
}
