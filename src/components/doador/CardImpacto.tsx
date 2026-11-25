import Image from "next/image";
import Link from "next/link";
import { intervaloEmDias } from "@/lib/regras";
import type { Doador } from "@/models/doador";
import { imagem } from "@/lib/imagem";

interface CardImpactoProps {
  genero: Doador["doador_genero"];
  ultimaDoacao?: string;
}

// Descobre o mês da próxima doação: última doação + intervalo (60 dias homens, 90 mulheres).
function mesDaProximaDoacao(genero: Doador["doador_genero"], ultimaDoacao: string) {
  const data = new Date(ultimaDoacao); // "AAAA-MM-DD" é lido como UTC
  data.setUTCDate(data.getUTCDate() + intervaloEmDias(genero));
  const mes = data.toLocaleDateString("pt-BR", { month: "long", timeZone: "UTC" });
  return mes.charAt(0).toUpperCase() + mes.slice(1);
}

// Card vermelho que convida o doador a chamar amigos.
export function CardImpacto({ genero, ultimaDoacao }: CardImpactoProps) {
  return (
    <section className="flex min-h-96 flex-col items-center gap-3 rounded-2xl bg-vermelho-1 p-5 text-center text-branco">
      <h2 className="text-lg">Multiplique seu impacto</h2>

      <div className="relative w-full flex-1">
        <Image
          src={imagem("/img/enfermeira-doadora.png")}
          alt=""
          fill
          sizes="(min-width: 1024px) 240px, 100vw"
          className="object-contain"
        />
      </div>

      <p className="text-sm">
        {ultimaDoacao
          ? `Sua próxima doação é em ${mesDaProximaDoacao(genero, ultimaDoacao)}, mas você pode salvar vidas hoje. Convide um amigo para doar!`
          : "Você ainda não doou, mas pode começar hoje. Convide um amigo para doar junto!"}
      </p>

      <Link
        href="/"
        className="rounded-md bg-branco px-4 py-1.5 text-xs font-semibold text-vermelho-1 transition hover:bg-branco/90"
      >
        Saiba mais
      </Link>
    </section>
  );
}