// Perfis que o MS4 coloca dentro do token JWT (campo "role").
export type Perfil =
  | "ADMIN"
  | "RECEPCAO"
  | "ENFERMAGEM"
  | "GESTOR_ESTOQUE"
  | "GESTOR_DEMANDA"
  | "DOADOR";