import type { PacienteNaFila } from "@/data/mock";
import type { Doador, FatorRh, TipoSanguineo } from "@/models/doador";

// Transforma um paciente da fila no formato que o CabecalhoPaciente espera.
// O tipo sanguíneo do mock vem junto (ex: "A+"), então separamos o tipo (A) do fator (+).
// Se vier vazio, fica null e a tela mostra "Não informado".
export function resumoDoPaciente(
  paciente: PacienteNaFila,
): Pick<Doador, "doador_nome" | "doador_cpf" | "doador_data_nascimento" | "doador_tipo_sanguineo" | "doador_fator_rh"> {
  const completo = paciente.tipoSanguineo.length >= 2;

  return {
    doador_nome: paciente.nome,
    doador_cpf: paciente.cpf.replace(/\D/g, ""),
    doador_data_nascimento: paciente.dataNascimento,
    doador_tipo_sanguineo: completo ? (paciente.tipoSanguineo.slice(0, -1) as TipoSanguineo) : null,
    doador_fator_rh: completo ? (paciente.tipoSanguineo.slice(-1) as FatorRh) : null,
  };
}