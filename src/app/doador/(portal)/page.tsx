import { CalendarDays, Droplet, Heart } from "lucide-react";
import { AvisosRecentes } from "@/components/doador/AvisosRecentes";
import { BannerObrigado } from "@/components/doador/BannerObrigado";
import { CardImpacto } from "@/components/doador/CardImpacto";
import { CartaoEstatistica } from "@/components/doador/CartaoEstatistica";
import { ContagemRegressiva } from "@/components/doador/ContagemRegressiva";
import { HistoricoDoacoes } from "@/components/doador/HistoricoDoacoes";
import { avisosMock, doadorLogadoMock, historicoDoadorMock } from "@/data/mock";
import { formatarDataBR } from "@/lib/formatadores";

// Página inicial do portal do doador (/doador).
// A grade tem 3 colunas: uma larga e duas estreitas. Em tela pequena vira uma coluna só.
export default function PortalDoadorPage() {
  const doador = doadorLogadoMock;
  const ultimaDoacao = historicoDoadorMock[0].data; // a lista já vem da mais nova para a mais antiga
  const totalDoacoes = historicoDoadorMock.length;

  return (
    <div className="grid gap-6 lg:grid-cols-[3fr_1.25fr_1fr]">
      {/* Linha de cima */}
      <BannerObrigado nome={doador.doador_nome} genero={doador.doador_genero} />
      <AvisosRecentes avisos={avisosMock} />
      <ContagemRegressiva genero={doador.doador_genero} ultimaDoacao={ultimaDoacao} />

      {/* Linha de baixo */}
      <HistoricoDoacoes doacoes={historicoDoadorMock} />
      <CardImpacto genero={doador.doador_genero} ultimaDoacao={ultimaDoacao} />
      <div className="flex flex-col gap-6">
        <CartaoEstatistica icone={Droplet} rotulo="Total de doações" valor={totalDoacoes} />
        {/* Cada doação pode ajudar até 4 pessoas */}
        <CartaoEstatistica icone={Heart} rotulo="Vidas impactadas" valor={`Até ${totalDoacoes * 4}`} />
        <CartaoEstatistica icone={CalendarDays} rotulo="Última doação" valor={formatarDataBR(ultimaDoacao)} />
      </div>
    </div>
  );
}