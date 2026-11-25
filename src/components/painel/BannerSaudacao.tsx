import Image from "next/image";
import { Saudacao } from "@/components/ui/Saudacao";
import { imagem } from "@/lib/imagem";

// Bento azul escuro: saudação + resumo + ilustração.
export function BannerSaudacao({ nome }: { nome: string }) {
  return (
    <section className="relative flex min-h-44 items-center overflow-hidden rounded-xl bg-azul-1 px-8 py-6 text-branco">
      <div className="flex flex-col gap-4">
        <Saudacao nome={nome} fundo="escuro" />
        <p className="text-lg">Resumo do fluxo de doadores de hoje</p>
      </div>

      {/* Some em telas pequenas. */}
      <Image
        src={imagem("/img/enfermeiro.png")}
        alt=""
        width={180}
        height={236}
        className="absolute bottom-0 right-10 hidden h-40 w-auto md:block"
      />
    </section>
  );
}