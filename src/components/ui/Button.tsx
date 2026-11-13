import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

// Os nomes dizem o que o botão FAZ, não a cor.
//   primario   = ação principal do portal do doador (vermelho)
//   secundario = ação principal do painel (azul escuro)
//   cancelar   = contorno vermelho (Cancelar, Cancelar triagem)
//   voltar     = contorno azul (Voltar)
//   suave      = azul clarinho (Cadastrar novo doador)
export type VarianteBotao = "primario" | "secundario" | "cancelar" | "voltar" | "suave";

const estiloBase =
  "inline-flex items-center justify-center whitespace-nowrap rounded-md font-semibold transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

const estiloPorVariante: Record<VarianteBotao, string> = {
  primario: "bg-vermelho-1 text-branco hover:bg-vermelho-2",
  secundario: "bg-azul-1 text-branco hover:bg-azul-2",
  cancelar: "border border-vermelho-1 bg-card text-vermelho-1 hover:bg-vermelho-1 hover:text-branco",
  voltar: "border border-azul-1 bg-card text-azul-1 hover:bg-azul-1 hover:text-branco",
  suave: "bg-azul-3 text-azul-1 hover:brightness-95",
};

const estiloPorTamanho = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-6 py-3 text-base",
  lg: "px-10 py-5 text-xl",
};

type Tamanho = keyof typeof estiloPorTamanho;

function montarClasses(variante: VarianteBotao, tamanho: Tamanho, larguraTotal: boolean, extra: string) {
  return `${estiloBase} ${estiloPorVariante[variante]} ${estiloPorTamanho[tamanho]} ${
    larguraTotal ? "w-full" : ""
  } ${extra}`;
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: VarianteBotao;
  tamanho?: Tamanho;
  larguraTotal?: boolean;
}

export function Button({
  variante = "secundario",
  tamanho = "md",
  larguraTotal = false,
  className = "",
  ...resto
}: ButtonProps) {
  return <button className={montarClasses(variante, tamanho, larguraTotal, className)} {...resto} />;
}

interface ButtonLinkProps {
  href: string;
  children: ReactNode;
  variante?: VarianteBotao;
  tamanho?: Tamanho;
  larguraTotal?: boolean;
  className?: string;
}

// Tem a mesma aparência do Button, mas leva para outra página (em vez de executar uma ação).
export function ButtonLink({
  href,
  children,
  variante = "secundario",
  tamanho = "md",
  larguraTotal = false,
  className = "",
}: ButtonLinkProps) {
  return (
    <Link href={href} className={montarClasses(variante, tamanho, larguraTotal, className)}>
      {children}
    </Link>
  );
}