import Image from "next/image";
import Link from "next/link";
import { Check, ChevronDown, ClipboardCheck, Droplet, Stethoscope, UserPlus } from "lucide-react";
import { Logo } from "@/components/layout/Logo";

// ---------- Textos da página  ----------

const menu = [
  { rotulo: "Home", href: "/" },
  { rotulo: "Como funciona", href: "#sobre" },
  { rotulo: "Quem pode doar", href: "#doacao" },
  { rotulo: "Dúvidas", href: "#contato" },
];

const passos = [
  { icone: UserPlus, titulo: "Cadastro", texto: "Você cria sua conta e preenche seus dados uma única vez." },
  { icone: ClipboardCheck, titulo: "Recepção", texto: "No hemocentro, a equipe confirma seus dados e te coloca na fila." },
  { icone: Stethoscope, titulo: "Triagem", texto: "Um profissional de enfermagem confere sua saúde e faz algumas perguntas rápidas." },
  { icone: Droplet, titulo: "Doação", texto: "É a coleta, e depois você acompanha o laudo do exame no seu portal." },
];

const requisitos = [
  "Ter entre 18 e 69 anos",
  "Pesar mais de 50 kg",
  "Estar bem de saúde no dia da doação",
  "Ter dormido bem e estar alimentado",
  "Levar um documento oficial com foto",
  "Respeitar o intervalo: 60 dias (homens) ou 90 dias (mulheres)",
];

const perguntas = [
  {
    pergunta: "Doar sangue dói?",
    resposta: "Só a picadinha da agulha, que dura alguns segundos. Depois você fica sentado e relaxado durante a coleta.",
  },
  {
    pergunta: "Quanto tempo leva?",
    resposta: "A coleta em si leva cerca de 10 a 15 minutos. Com cadastro, triagem e descanso, conte com cerca de 1 hora.",
  },
  {
    pergunta: "Posso doar se tomei vacina ou tenho tatuagem?",
    resposta: "Depende de cada caso. A triagem avalia vacinas, tatuagens e outras situações no dia, e a equipe te orienta.",
  },
  {
    pergunta: "O que acontece depois da doação?",
    resposta: "Você descansa, faz um lanche e vai embora. Quando o exame fica pronto, o laudo aparece no seu portal.",
  },
];

// ---------- Página inicial pública do site (/) ----------

export default function HomePage() {
  return (
    <div className="min-h-screen bg-branco">
      {/* Cabeçalho fixo no topo */}
      <header className="sticky top-0 z-40 border-b border-preto/5 bg-branco/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-8 sm:py-4">
          <Logo />

          {/* Computador: o menu fica no meio do cabeçalho */}
          <nav aria-label="Principal" className="hidden items-center gap-8 md:flex">
            {menu.map((item) => (
              <Link
                key={item.rotulo}
                href={item.href}
                className="text-sm font-semibold text-preto transition hover:text-vermelho-1"
              >
                {item.rotulo}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/doador/login"
              className="rounded-full border-2 border-preto px-4 py-1 text-xs font-semibold text-preto transition hover:bg-preto hover:text-branco sm:px-5 sm:py-1.5 sm:text-sm"
            >
              Login
            </Link>
            <Link
              href="/doador/cadastro"
              className="rounded-full bg-vermelho-1 px-4 py-1.5 text-xs font-semibold text-branco transition hover:bg-vermelho-2 sm:px-5 sm:py-2 sm:text-sm"
            >
              Cadastre-se
            </Link>
          </div>
        </div>

        {/* Celular: o menu vira uma segunda linha, que rola de lado se faltar espaço */}
        <nav aria-label="Principal" className="flex gap-6 overflow-x-auto px-4 pb-3 md:hidden">
          {menu.map((item) => (
            <Link
              key={item.rotulo}
              href={item.href}
              className="whitespace-nowrap text-sm font-semibold text-preto transition hover:text-vermelho-1"
            >
              {item.rotulo}
            </Link>
          ))}
        </nav>
      </header>

      <main>
        {/* Topo da página: título, botões e o tubo 3D flutuando */}
        <section className="mx-auto grid max-w-7xl items-center gap-12 px-8 py-16 lg:grid-cols-[1.2fr_1fr] lg:py-24">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-vermelho-1">Doação de sangue</p>
            <h1 className="font-titulo text-4xl leading-tight text-preto sm:text-5xl lg:text-6xl">
              Uma doação pode salvar até <span className="text-vermelho-1">4 vidas</span>.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-preto/70">
              Cadastre-se, acompanhe seu histórico e saiba quando pode doar de novo. Cada gota conta uma história, e a próxima
              pode ser a sua.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/doador/login"
                className="rounded-full bg-vermelho-1 px-8 py-3 font-semibold text-branco transition hover:bg-vermelho-2"
              >
                Login
              </Link>
              <Link
                href="/doador/cadastro"
                className="rounded-full border-2 border-preto px-8 py-2.5 font-semibold text-preto transition hover:bg-preto hover:text-branco"
              >
                Cadastre-se
              </Link>
            </div>
          </div>

          {/* Círculo suave atrás, tubo 3D na frente */}
          <div aria-hidden className="relative mx-auto flex h-[26rem] w-full max-w-md items-center justify-center lg:ml-auto lg:mr-0">
            <div className="absolute h-80 w-80 rounded-full bg-vermelho-1/10 sm:h-96 sm:w-96" />
            <div className="absolute hidden h-[26rem] w-[26rem] rounded-full border border-vermelho-1/15 sm:block" />

            <div className="animar-flutuar relative">
              <div className="transition-transform duration-500 hover:-rotate-3 hover:scale-105">
                <Image
                  src="/img/tubo-sangue.png"
                  alt=""
                  width={945}
                  height={1177}
                  priority
                  sizes="(min-width: 640px) 256px, 224px"
                  className="h-auto w-56 drop-shadow-2xl sm:w-64"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Como funciona */}
        <section id="sobre" className="scroll-mt-20 bg-cinza-azulado/50 py-20">
          <div className="mx-auto max-w-7xl px-8">
            <h2 className="font-titulo text-3xl text-preto sm:text-4xl">Como funciona</h2>
            <p className="mt-3 max-w-2xl text-preto/70">Do cadastro até o laudo, tudo acontece em quatro passos simples.</p>

            <ol className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {passos.map((passo, indice) => (
                <li key={passo.titulo} className="border-t-2 border-vermelho-1 pt-6">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-vermelho-1/10 text-vermelho-1">
                    <passo.icone size={22} aria-hidden />
                  </span>
                  <p className="mt-4 text-sm font-semibold text-vermelho-1">Passo {indice + 1}</p>
                  <h3 className="mt-1 font-titulo text-xl text-preto">{passo.titulo}</h3>
                  <p className="mt-2 text-preto/70">{passo.texto}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Quem pode doar */}
        <section id="doacao" className="mx-auto grid max-w-7xl scroll-mt-20 gap-12 px-8 py-20 lg:grid-cols-2">
          <div>
            <h2 className="font-titulo text-3xl text-preto sm:text-4xl">Quem pode doar?</h2>
            <p className="mt-3 max-w-md text-preto/70">
              Quase todo mundo que está bem de saúde pode ajudar. No dia, uma triagem confere cada detalhe com você, e a equipe
              tira qualquer dúvida na hora.
            </p>
          </div>

          <ul className="grid gap-4 sm:grid-cols-2">
            {requisitos.map((requisito) => (
              <li key={requisito} className="flex items-start gap-3">
                <span
                  aria-hidden
                  className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-vermelho-1 text-branco"
                >
                  <Check size={14} strokeWidth={3} />
                </span>
                <span className="text-preto">{requisito}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Dúvidas frequentes. O <details> abre e fecha sozinho, sem JavaScript. */}
        <section id="contato" className="scroll-mt-20 bg-cinza-azulado/50 py-20">
          <div className="mx-auto grid max-w-7xl gap-12 px-8 lg:grid-cols-[1fr_1.4fr]">
            <div>
              <h2 className="font-titulo text-3xl text-preto sm:text-4xl">Ainda tem dúvidas?</h2>
              <p className="mt-3 max-w-md text-preto/70">
                Separamos as perguntas mais comuns. Se ainda ficar alguma, a equipe do hemocentro responde no dia da sua doação.
              </p>
              <Link
                href="/doador/cadastro"
                className="mt-6 inline-block rounded-full bg-vermelho-1 px-8 py-3 font-semibold text-branco transition hover:bg-vermelho-2"
              >
                Quero ser doador
              </Link>
            </div>

            <div>
              {perguntas.map((item) => (
                <details key={item.pergunta} className="group border-b border-preto/15 py-5 first:pt-0">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-preto [&::-webkit-details-marker]:hidden">
                    {item.pergunta}
                    <ChevronDown size={20} aria-hidden className="shrink-0 text-vermelho-1 transition group-open:rotate-180" />
                  </summary>
                  <p className="mt-3 text-preto/70">{item.resposta}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-vermelho-2 py-6 text-center text-sm text-branco">@Copyright 2026 - ADS 2024.2M</footer>
    </div>
  );
}