import { CalendarDays, Droplet, Heart } from "lucide-react";
import { AvisosRecentes } from "@/components/doador/AvisosRecentes";
import { BannerBoasVindas } from "@/components/doador/BannerBoasVindas";
import { BannerObrigado } from "@/components/doador/BannerObrigado";
import { CardImpacto } from "@/components/doador/CardImpacto";
import { CartaoEstatistica } from "@/components/doador/CartaoEstatistica";
import { CartaoPrimeiraDoacao } from "@/components/doador/CartaoPrimeiraDoacao";
import { ContagemRegressiva } from "@/components/doador/ContagemRegressiva";
import { HistoricoDoacoes } from "@/components/doador/HistoricoDoacoes";
import { avisosMock, doadorLogadoMock, historicoDoadorMock } from "@/data/mock";
import { formatarDataBR } from "@/lib/formatadores";
import type { DoacaoDoHistorico } from "@/models/portal";

export const metadata = { title: "Portal do doador" };

// Página inicial do portal do doador (/doador).
export default function PortalDoadorPage() {
  const doador = doadorLogadoMock;

  // Para ver a tela do doador novo, troque a linha abaixo por: const historico: DoacaoDoHistorico[] = [];
  const historico: DoacaoDoHistorico[] = historicoDoadorMock;

  const ultimaDoacao = historico[0]?.data; // a lista vem da mais nova para a mais antiga. Vazia = nunca doou.
  const totalDoacoes = historico.length;

  return (
    <div className="grid gap-6 lg:grid-cols-[3fr_1.25fr_1fr]">
      {ultimaDoacao ? (
        <BannerObrigado nome={doador.doador_nome} genero={doador.doador_genero} />
      ) : (
        <BannerBoasVindas nome={doador.doador_nome} />
      )}
      <AvisosRecentes avisos={avisosMock} />
      {ultimaDoacao ? (
        <ContagemRegressiva genero={doador.doador_genero} ultimaDoacao={ultimaDoacao} />
      ) : (
        <CartaoPrimeiraDoacao />
      )}

      <HistoricoDoacoes doacoes={historico} />
      <CardImpacto genero={doador.doador_genero} ultimaDoacao={ultimaDoacao} />
      <div className="flex flex-col gap-6">
        <CartaoEstatistica icone={Droplet} rotulo="Total de doações" valor={totalDoacoes} />
        {/* Cada doação pode ajudar até 4 pessoas */}
        <CartaoEstatistica icone={Heart} rotulo="Vidas impactadas" valor={totalDoacoes > 0 ? `Até ${totalDoacoes * 4}` : 0} />
        <CartaoEstatistica icone={CalendarDays} rotulo="Última doação" valor={ultimaDoacao ? formatarDataBR(ultimaDoacao) : "—"} />
      </div>
    </div>
  );
}