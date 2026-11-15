export const TIPOS_DE_DOACAO = ["Sangue Total", "Aférese", "Autóloga"] as const;

export type TipoDeDoacao = (typeof TIPOS_DE_DOACAO)[number];