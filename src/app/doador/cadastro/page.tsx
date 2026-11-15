import { FormularioCadastro } from "@/components/doador/FormularioCadastro";
import { Logo } from "@/components/layout/Logo";

export const metadata = { title: "Cadastro do doador" };

export default function CadastroDoadorPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col items-center gap-10 px-6 py-10">
      <Logo className="text-4xl" />
      <FormularioCadastro modo="publico" />
    </main>
  );
}