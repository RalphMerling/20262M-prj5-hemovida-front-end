
import Link from "next/link";
import { notFound } from "next/navigation";
import Sidebar from "@/components/Sidebar";

// TIPOS DE DADOS
type Status = "Disponível" | "Em uso" | "Vencida";

type Movimento = {
  data: string;
  descricao: string;
  transacao: string;
  responsavel: string;
};

type Bolsa = {
  id: string;
  tipo: string;
  volume: number;
  coleta: string;
  entrada: string;
  validade: string;
  status: Status;
  historico: Movimento[];
};

// TIPOS SANGUÍNEOS
const tiposSanguineos = [
  "O+",
  "A+",
  "B+",
  "O-",
  "AB+",
  "A-",
  "B-",
  "AB-",
];

// FORMATAR DATA
function formatarData(data: string) {
  const [ano, mes, dia] = data.split("-");
  return `${dia}/${mes}/${ano}`;
}

// BUSCAR BOLSA SIMULADA
function buscarBolsa(id: string): Bolsa | null {
  const numero = Number(id.replace("BOL-", ""));

  if (
    !/^BOL-\d{3}$/.test(id) ||
    numero < 1 ||
    numero > 46
  ) {
    return null;
  }

  const entrada = new Date(
    Date.UTC(2026, 9, numero)
  );

  const coleta = new Date(entrada);
  coleta.setUTCDate(coleta.getUTCDate() - 1);

  const validade = new Date(entrada);
  validade.setUTCDate(validade.getUTCDate() + 42);

  const hoje = new Date();

  const hojeUTC = Date.UTC(
    hoje.getFullYear(),
    hoje.getMonth(),
    hoje.getDate()
  );

  let status: Status = "Disponível";

  if (validade.getTime() < hojeUTC) {
    status = "Vencida";
  } else if (numero % 6 === 0) {
    status = "Em uso";
  }

  const dataEntrada = entrada.toISOString().slice(0, 10);
  const dataColeta = coleta.toISOString().slice(0, 10);
  const dataValidade = validade.toISOString().slice(0, 10);

  // HISTÓRICO SIMULADO
  const historico: Movimento[] = [
    {
      data: dataEntrada,
      descricao: "Entrada no estoque",
      transacao: `TR-${String(numero).padStart(3, "0")}`,
      responsavel: "Maria da Silva",
    },
  ];

  if (status === "Disponível") {
    historico.push({
      data: dataEntrada,
      descricao: "Liberação para uso",
      transacao: "—",
      responsavel: "Joaquim Ramos",
    });
  }

  return {
    id,
    tipo: tiposSanguineos[(numero - 1) % 8],
    volume: 450,
    coleta: dataColeta,
    entrada: dataEntrada,
    validade: dataValidade,
    status,
    historico,
  };
}

// COMPONENTE DE CAMPO DE CONSULTA
function CampoConsulta({
  titulo,
  valor,
}: {
  titulo: string;
  valor: string;
}) {
  return (
    <div>
      <label className="mb-3 block text-xl font-semibold text-black">
        {titulo}
      </label>

      <div className="min-h-10 rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-black">
        {valor}
      </div>
    </div>
  );
}

// PROPRIEDADES DA ROTA DINÂMICA
type PageProps = {
  params: Promise<{ id: string }>;
};

// PÁGINA DE DETALHES DA BOLSA
export default async function DetalhesBolsaPage({
  params,
}: PageProps) {
  const { id } = await params;

  const bolsa = buscarBolsa(id);

  if (!bolsa) {
    notFound();
  }

  const corStatus =
    bolsa.status === "Disponível"
      ? "bg-[#C0DFDC]"
      : bolsa.status === "Em uso"
      ? "bg-[#CCDEF4]"
      : "bg-[#F9D4D8]";

  return (
    <div className="flex min-h-screen bg-[#E1E4E9]">

      {/* MENU LATERAL COMPARTILHADO */}
      <Sidebar />

      {/* CONTEÚDO PRINCIPAL */}
      <main className="flex min-w-0 flex-1 flex-col px-12 py-12">

        {/* TÍTULO E SETA VOLTAR */}
        <div className="mb-10 flex items-center gap-5">
          <Link
            href="/estoque/consulta"
            aria-label="Voltar para a lista de estoque"
            className="text-4xl text-black hover:text-gray-600"
          >
            ←
          </Link>

          <h1 className="text-2xl font-bold text-[#203A60]">
            Consulta de item de estoque
          </h1>
        </div>

        {/* STATUS DA BOLSA */}
        <div className="mb-12 flex justify-end">
          <span
            className={`rounded-full px-7 py-2 text-sm font-semibold text-[#203A60] ${corStatus}`}
          >
            {bolsa.status}
          </span>
        </div>

        {/* DADOS DA BOLSA */}
        <section className="grid grid-cols-3 gap-x-16 gap-y-16 px-2">

          <CampoConsulta
            titulo="ID da bolsa"
            valor={bolsa.id}
          />

          <CampoConsulta
            titulo="Tipo sanguíneo"
            valor={bolsa.tipo}
          />

          <CampoConsulta
            titulo="Volume (mL)"
            valor={String(bolsa.volume)}
          />

          <CampoConsulta
            titulo="Data da coleta"
            valor={formatarData(bolsa.coleta)}
          />

          <CampoConsulta
            titulo="Data de validade"
            valor={formatarData(bolsa.validade)}
          />

          <CampoConsulta
            titulo="Entrada no estoque"
            valor={formatarData(bolsa.entrada)}
          />
        </section>

        {/* HISTÓRICO DE MOVIMENTAÇÕES */}
        <section className="mt-24 px-2">

          <h2 className="mb-8 text-xl font-bold text-black">
            Histórico de movimentações
          </h2>

          <div className="overflow-x-auto bg-white">
            <table className="w-full border-collapse text-center text-sm">

              {/* CABEÇALHO */}
              <thead className="bg-[#D1E1F1] text-[#203A60]">
                <tr>
                  <th className="px-4 py-3">
                    Data
                  </th>

                  <th className="px-4 py-3">
                    Movimentação
                  </th>

                  <th className="px-4 py-3">
                    Transação
                  </th>

                  <th className="px-4 py-3">
                    Responsável
                  </th>
                </tr>
              </thead>

              {/* REGISTROS */}
              <tbody>
                {bolsa.historico.map((movimento, index) => (
                  <tr
                    key={index}
                    className="h-16 text-black"
                  >
                    <td className="px-4 font-medium">
                      {formatarData(movimento.data)}
                    </td>

                    <td className="px-4 font-medium">
                      {movimento.descricao}
                    </td>

                    <td className="px-4 font-medium">
                      {movimento.transacao}
                    </td>

                    <td className="px-4 font-medium">
                      {movimento.responsavel}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* BOTÃO VOLTAR */}
        <div className="mt-auto flex justify-end pt-20">
          <Link
            href="/estoque/consulta"
            className="rounded-lg border border-black bg-white px-10 py-3 text-sm font-semibold text-black hover:bg-gray-100"
          >
            Voltar
          </Link>
        </div>
      </main>
    </div>
  );
}
