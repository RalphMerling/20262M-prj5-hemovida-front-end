export type Genero = "Feminino" | "Masculino" | "Outros";
export type TipoSanguineo = "A" | "B" | "AB" | "O";
export type FatorRh = "+" | "-";

// Espelha a tabela `doador` do MS1.
export interface Doador {
  doador_id: number;
  usuario_id: number;
  doador_nome: string;
  doador_cpf: string; // 11 números, sem pontuação
  doador_data_nascimento: string; // AAAA-MM-DD
  doador_genero: Genero;
  doador_tipo_sanguineo: TipoSanguineo;
  doador_fator_rh: FatorRh;
  doador_telefone: string;
  doador_email: string;
  doador_cep: string;
  doador_endereco: string;
  doador_status: number; // 1 = ativo, 0 = inativo
}