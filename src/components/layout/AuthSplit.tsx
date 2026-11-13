import Image from "next/image";
import type { ReactNode } from "react";
import { Logo } from "./Logo";

interface AuthSplitProps {
  titulo: string;
  texto: string;
  imagem?: string; // opcional: sem imagem, mostra o degradê azul
  children: ReactNode; // o formulário entra aqui
}

export function AuthSplit({ titulo, texto, imagem, children }: AuthSplitProps) {
  return (
    <main className="grid min-h-screen grid-cols-1 md:grid-cols-2">
      {/* Lado esquerdo: logo + formulário */}
      <div className="flex flex-col items-center justify-center gap-10 px-8 py-12">
        <Logo className="text-4xl" />
        <div className="w-full max-w-[480px]">{children}</div>
      </div>

      {/* Lado direito: imagem (doador) ou degradê azul (admin). Some no celular. */}
      <div
        className={`relative hidden md:block ${
          imagem
            ? "bg-vermelho-3"
            : "bg-[radial-gradient(ellipse_at_30%_10%,#0c4c8a_0%,#1f375d_50%,#282828_100%)]"
        }`}
      >
        {imagem && <Image src={imagem} alt="" fill priority sizes="50vw" className="object-cover" />}
        <div className="absolute inset-0 flex items-end justify-end p-12 text-right text-branco">
          <div className="max-w-md">
            <h2 className="mb-4 text-5xl">{titulo}</h2>
            <p className="text-lg leading-relaxed">{texto}</p>
          </div>
        </div>
      </div>
    </main>
  );
}