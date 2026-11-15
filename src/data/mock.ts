// =====================================================================
// DADOS DE MENTIRA (temporário)
// Servem só para as telas funcionarem enquanto não conectamos com as APIs
// e não temos dados reais. Quando a conexão estiver pronta, este arquivo
// será apagado.
//
// REGRA: cada pessoa escreve SOMENTE dentro da sua seção.
// =====================================================================
import type { Doador } from "@/models/doador";
import type { PerguntaTriagem } from "@/models/triagem";

// ===================== MS1 DOADORES (Bia) =====================
export interface PacienteNaFila {
  id: number;
  nome: string;
  cpf: string;
  tipoDoacao: string;
  tipoSanguineo: string;
}

export interface ColetaConcluida {
  id: number;
  nome: string;
  cpf: string;
  volumeMl: number | null; // vazio quando a coleta foi cancelada
  tipoSanguineo: string;
  tipoDoacao: string;
  dataHora: string;
  codigoBolsa: string;
  status: "Concluído" | "Cancelado";
}

export const filaTriagemMock: PacienteNaFila[] = [
  { id: 1, nome: "Maria da Silva Santos", cpf: "000.111.222-33", tipoDoacao: "Sangue total", tipoSanguineo: "A+", dataNascimento: "1998-01-01", genero: "Feminino" },
  { id: 2, nome: "Eduardo Machado", cpf: "111.222.333-44", tipoDoacao: "Sangue total", tipoSanguineo: "AB+", dataNascimento: "1990-05-10", genero: "Masculino" },
  { id: 3, nome: "Matheus Augusto", cpf: "123.456.789-01", tipoDoacao: "Aférese", tipoSanguineo: "AB+", dataNascimento: "1985-03-22", genero: "Masculino" },
  { id: 4, nome: "Rafaela Guimarães", cpf: "321.654.987-10", tipoDoacao: "Sangue total", tipoSanguineo: "O-", dataNascimento: "1995-11-30", genero: "Feminino" },
  { id: 5, nome: "Carlos Macedo", cpf: "222.333.444-55", tipoDoacao: "Aférese", tipoSanguineo: "B-", dataNascimento: "1982-07-14", genero: "Masculino" },
  { id: 6, nome: "Ana Beatriz Lima", cpf: "333.444.555-66", tipoDoacao: "Sangue total", tipoSanguineo: "O+", dataNascimento: "2000-02-19", genero: "Feminino" },
  { id: 7, nome: "João Pedro Alves", cpf: "444.555.666-77", tipoDoacao: "Sangue total", tipoSanguineo: "A-", dataNascimento: "1993-09-05", genero: "Masculino" },
  { id: 8, nome: "Fernanda Rocha", cpf: "555.666.777-88", tipoDoacao: "Aférese", tipoSanguineo: "B+", dataNascimento: "1988-12-23", genero: "Feminino" },
  { id: 9, nome: "Lucas Andrade", cpf: "666.777.888-99", tipoDoacao: "Sangue total", tipoSanguineo: "O+", dataNascimento: "1997-04-08", genero: "Masculino" },
  { id: 10, nome: "Patrícia Gomes", cpf: "777.888.999-00", tipoDoacao: "Sangue total", tipoSanguineo: "AB-", dataNascimento: "1991-06-17", genero: "Feminino" },
  { id: 11, nome: "Rodrigo Santos", cpf: "888.999.000-11", tipoDoacao: "Aférese", tipoSanguineo: "A+", dataNascimento: "1980-10-02", genero: "Masculino" },
  { id: 12, nome: "Juliana Mendes", cpf: "999.000.111-22", tipoDoacao: "Sangue total", tipoSanguineo: "O-", dataNascimento: "1999-08-26", genero: "Feminino" },
];

export const coletasConcluidasMock: ColetaConcluida[] = [
  { id: 1, nome: "Eduardo Machado", cpf: "111.222.333-44", volumeMl: 450, tipoSanguineo: "AB+", tipoDoacao: "Sangue total", dataHora: "02/09/2026 10:08", codigoBolsa: "BLS-2026-0510-019", status: "Concluído" },
  { id: 2, nome: "Matheus Augusto", cpf: "123.456.789-01", volumeMl: 430, tipoSanguineo: "AB+", tipoDoacao: "Aférese", dataHora: "03/09/2026 10:26", codigoBolsa: "BLS-2026-0112-088", status: "Concluído" },
  { id: 3, nome: "Rafaela Guimarães", cpf: "321.654.987-10", volumeMl: 450, tipoSanguineo: "O-", tipoDoacao: "Sangue total", dataHora: "04/09/2026 10:44", codigoBolsa: "BLS-2026-1234-567", status: "Concluído" },
  { id: 4, nome: "Ana Beatriz Lima", cpf: "333.444.555-66", volumeMl: 450, tipoSanguineo: "O+", tipoDoacao: "Sangue total", dataHora: "04/09/2026 11:02", codigoBolsa: "BLS-2026-0905-101", status: "Concluído" },
  { id: 5, nome: "João Pedro Alves", cpf: "444.555.666-77", volumeMl: 450, tipoSanguineo: "A-", tipoDoacao: "Sangue total", dataHora: "05/09/2026 09:15", codigoBolsa: "BLS-2026-0905-102", status: "Concluído" },
  { id: 6, nome: "Fernanda Rocha", cpf: "555.666.777-88", volumeMl: 420, tipoSanguineo: "B+", tipoDoacao: "Aférese", dataHora: "05/09/2026 09:40", codigoBolsa: "BLS-2026-0905-103", status: "Concluído" },
  { id: 7, nome: "Lucas Andrade", cpf: "666.777.888-99", volumeMl: 450, tipoSanguineo: "O+", tipoDoacao: "Sangue total", dataHora: "05/09/2026 10:05", codigoBolsa: "BLS-2026-0905-104", status: "Concluído" },
  { id: 8, nome: "Maria da Silva Santos", cpf: "000.111.222-33", volumeMl: null, tipoSanguineo: "A+", tipoDoacao: "Sangue total", dataHora: "02/09/2026 09:56", codigoBolsa: "BLS-2026-0914-042", status: "Cancelado" },
  { id: 9, nome: "Carlos Macedo", cpf: "222.333.444-55", volumeMl: null, tipoSanguineo: "B-", tipoDoacao: "Aférese", dataHora: "05/09/2026 10:58", codigoBolsa: "BLS-2026-4321-765", status: "Cancelado" },
];

// Quantas doações da semana foram de cada tipo.
export const doacoesPorTipoMock = [
  { nome: "Sangue total", valor: 70 },
  { nome: "Aférese", valor: 20 },
  { nome: "Autóloga", valor: 10 },
];

// ---------- Recepção ----------

export interface ItemHistorico {
  data: string; // AAAA-MM-DD
  tipo: string;
  status: "Concluído" | "Cancelado";
}

export interface DoadorComHistorico {
  doador: Doador;
  historico: ItemHistorico[];
}

export const doadoresMock: DoadorComHistorico[] = [
  {
    doador: {
      doador_id: 1, usuario_id: 1, doador_nome: "Maria da Silva Santos", doador_cpf: "00011122233",
      doador_data_nascimento: "1998-01-01", doador_genero: "Feminino", doador_tipo_sanguineo: "A", doador_fator_rh: "+",
      doador_telefone: "21974254823", doador_email: "maria@email.com", doador_cep: "20000000",
      doador_endereco: "Av. Brasil, 100, Centro, Rio de Janeiro - RJ", doador_status: 1,
    },
    historico: [
      { data: "2026-09-02", tipo: "Sangue total", status: "Cancelado" },
      { data: "2026-02-13", tipo: "Sangue total", status: "Concluído" },
      { data: "2025-04-08", tipo: "Sangue total", status: "Concluído" },
    ],
  },
  {
    // Doou há pouco tempo: serve para testar o aviso de intervalo.
    doador: {
      doador_id: 2, usuario_id: 2, doador_nome: "Eduardo Machado", doador_cpf: "11122233344",
      doador_data_nascimento: "1990-05-10", doador_genero: "Masculino", doador_tipo_sanguineo: "AB", doador_fator_rh: "+",
      doador_telefone: "21988887777", doador_email: "eduardo.machado@email.com", doador_cep: "20010000",
      doador_endereco: "Rua da Assembleia, 50, Centro, Rio de Janeiro - RJ", doador_status: 1,
    },
    historico: [{ data: "2026-10-20", tipo: "Sangue total", status: "Concluído" }],
  },
  {
    // Nunca doou: serve para testar o histórico vazio.
    doador: {
      doador_id: 3, usuario_id: 3, doador_nome: "Matheus Augusto", doador_cpf: "12345678901",
      doador_data_nascimento: "1985-03-22", doador_genero: "Masculino", doador_tipo_sanguineo: "AB", doador_fator_rh: "+",
      doador_telefone: "21977776666", doador_email: "matheus@email.com", doador_cep: "20020000",
      doador_endereco: "Rua do Ouvidor, 12, Centro, Rio de Janeiro - RJ", doador_status: 1,
    },
    historico: [],
  },
];

// ---------- Triagem ----------
export interface PacienteNaFila {
  id: number;
  nome: string;
  cpf: string;
  tipoDoacao: string;
  tipoSanguineo: string;
  dataNascimento: string; // AAAA-MM-DD
  genero: Doador["doador_genero"];
}

// Perguntas da triagem, no mesmo formato da tabela triagem_pergunta (id + descrição).
// Quando a API ficar pronta, esta lista é trocada por uma chamada e a tela não muda.
export const perguntasTriagemMock: PerguntaTriagem[] = [
  { id: 1, descricao: "Teve febre, gripe, resfriado ou infecção nos últimos 7 dias?" },
  { id: 2, descricao: "Fez uso de antibióticos ou anti-inflamatórios nos últimos 15 dias?" },
  { id: 3, descricao: "Fez tatuagem, maquiagem definitiva, colocou piercing ou realizou endoscopia nos últimos 12 meses?" },
  { id: 4, descricao: "Passou por procedimento dentário recente ou cirurgia nos últimos 6 meses?" },
  { id: 5, descricao: "Já teve diagnóstico de hepatite (após os 11 anos), HIV, doença de Chagas, sífilis ou diabetes insulino-dependente?" },
  { id: 6, descricao: "Está grávida, em período pós-parto (menos de 3 a 6 meses) ou amamentando bebê menor de 12 meses?" },
];


// ===================== MS2 ESTOQUE (Ralph) =====================
// Escreva só aqui dentro.


// ===================== MS3 DEMANDA (Lais) =====================
// Escreva só aqui dentro.