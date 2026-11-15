import type { PacienteNaFila } from "@/data/mock";
import type { Doador } from "@/models/doador";

export function resumoDoPaciente(
  paciente: PacienteNaFila,
): Pick<Doador, "doador_nome" | "doador_cpf" | "doador_data_nascimento" | "doador_tipo_sanguineo" | "doador_fator_rh"> {
  return {
    doador_nome: paciente.nome,
    doador_cpf: paciente.cpf.replace(/\D/g, ""),
    doador_data_nascimento: paciente.dataNascimento,
    doador_tipo_sanguineo: paciente.tipoSanguineo.slice(0, -1) as Doador["doador_tipo_sanguineo"],
    doador_fator_rh: paciente.tipoSanguineo.slice(-1) as Doador["doador_fator_rh"],
  };
}