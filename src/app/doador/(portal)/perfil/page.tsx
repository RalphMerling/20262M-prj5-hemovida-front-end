import { PerfilDoador } from "@/components/doador/PerfilDoador";
import { doadorLogadoMock, historicoDoadorMock } from "@/data/mock";

export const metadata = { title: "Meu perfil" };

export default function PerfilPage() {
  return <PerfilDoador doador={doadorLogadoMock} ultimaDoacao={historicoDoadorMock[0]?.data ?? null} />;
}