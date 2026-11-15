import Image from "next/image";
import { Card } from "@/components/ui/Card";

// Banner do doador novo, que ainda não fez nenhuma doação.
export function BannerBoasVindas({ nome }: { nome: string }) {
  const primeiroNome = nome.split(" ")[0];

  return (
    <Card className="relative overflow-hidden">
      <div className="sm:max-w-[65%]">
        <h1 className="text-2xl text-preto xl:text-3xl">Boas-vindas, {primeiroNome}!</h1>
        <p className="mt-3 text-preto/70">
          Sua primeira doação pode ajudar até 4 pessoas. Quando quiser, vá a um hemocentro com um documento com foto, e a equipe
          cuida do resto.
        </p>
      </div>

      <div aria-hidden className="absolute bottom-0 right-6 hidden h-[78%] w-44 sm:block">
        <Image src="/img/mao-bolsa-sangue.png" alt="" fill sizes="176px" className="object-contain object-bottom" />
      </div>
    </Card>
  );
}