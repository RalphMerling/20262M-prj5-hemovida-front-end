
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* CABEÇALHO */}
      <header className="w-full bg-gray-100 shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
          <Link
            href="/"
            className="flex items-center text-2xl font-bold text-red-800"
          >
            HemoVida
            <span className="ml-1 text-red-600">♡</span>
          </Link>

          <nav className="flex items-center gap-6 text-sm text-slate-800">
            <Link href="/">Home</Link>
            <Link href="/sobre">Sobre</Link>
            <Link href="/doacao">Doação</Link>
            <Link href="/contato">Contato</Link>
            <Link href="/perfil">Perfil</Link>
          </nav>
        </div>
      </header>

      {/* BANNER PRINCIPAL */}
      <section className="relative h-[350px] w-full overflow-hidden">
        <Image
          src="/doacao-sangue.png"
          alt="Profissional de saúde realizando doação de sangue"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </section>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="bg-gray-100">
        {/* SEÇÃO DOAÇÃO DE SANGUE */}
        <section className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-6 py-16 md:grid-cols-2">
          {/* TEXTO */}
          <div>
            <h1 className="text-4xl font-extrabold leading-tight text-red-800 md:text-5xl">
              Doação
              <br />
              de sangue
            </h1>

            <h2 className="mt-2 text-2xl font-bold text-red-800">
              Salva vidas
            </h2>

            <p className="mt-6 max-w-md text-base leading-relaxed text-gray-700">
              A doação de sangue é um gesto de solidariedade que
              pode salvar vidas. O HemoVida contribui para o
              gerenciamento e controle do estoque de bolsas de
              sangue, proporcionando maior organização e
              rastreabilidade das movimentações.
            </p>

            {/* BOTÕES */}
            <div className="mt-8 flex gap-4">
              <Link
                href="/login"
                className="rounded-full bg-red-800 px-6 py-3 font-semibold text-white transition hover:bg-red-900"
              >
                Login
              </Link>

              <Link
                href="/cadastro"
                className="rounded-full bg-blue-900 px-6 py-3 font-semibold text-white transition hover:bg-blue-950"
              >
                Cadastre-se
              </Link>
            </div>
          </div>

          {/* ILUSTRAÇÃO DA GOTA */}
          <div className="flex justify-center">
            <Image
              src="/gota-sangue.png"
              alt="Ilustração de uma gota de sangue apoiada nas mãos"
              width={350}
              height={350}
              className="h-auto max-w-full object-contain"
            />
          </div>
        </section>

        {/* SEÇÃO AINDA TEM DÚVIDAS */}
        <section className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-6 py-16 md:grid-cols-2">
          {/* ILUSTRAÇÃO */}
          <div className="flex justify-center">
            <Image
              src="/duvidas.png"
              alt="Profissional de saúde orientando uma paciente"
              width={400}
              height={350}
              className="h-auto max-w-full object-contain"
            />
          </div>

          {/* TEXTO */}
          <div className="flex flex-col items-center text-center md:items-end md:text-right">
            <h2 className="text-4xl font-extrabold leading-tight text-blue-900 md:text-5xl">
              Ainda tem
              <br />
              dúvidas?
            </h2>

            <p className="mt-6 max-w-md text-base leading-relaxed text-gray-700">
              Quer saber mais sobre a doação de sangue?
              Conheça a importância desse gesto solidário,
              esclareça suas dúvidas e descubra como você
              pode contribuir para salvar vidas.
            </p>

            <Link
              href="/duvidas"
              className="mt-6 rounded-full bg-red-800 px-6 py-3 font-semibold text-white transition hover:bg-red-900"
            >
              Saiba mais
            </Link>
          </div>
        </section>
      </main>

      {/* RODAPÉ */}
      <footer className="bg-[#68171D] px-6 py-5 text-center text-sm text-white">
        <p>© Copyright 2026 — HemoVida</p>
      </footer>
    </div>
  );
}
