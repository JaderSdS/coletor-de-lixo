import { Lixeira } from "./types";

export const TIMEOUT = 100;

export const LIXEIRAS_SECO = [
  { coluna: 0, linha: 0 },
  { coluna: 17, linha: 0 },
  { coluna: 4, linha: 4 },
  { coluna: 13, linha: 4 },
  { coluna: 4, linha: 14 },
  { coluna: 13, linha: 14 },
];
export const LIXEIRAS_ORGANICO = [
  { coluna: 1, linha: 0 },
  { coluna: 18, linha: 0 },
  { coluna: 5, linha: 4 },
  { coluna: 14, linha: 4 },
  { coluna: 5, linha: 14 },
  { coluna: 14, linha: 14 },
];
export const LIXEIRAS_ELETRONICO = [
  { coluna: 2, linha: 0 },
  { coluna: 19, linha: 0 },
  { coluna: 6, linha: 4 },
  { coluna: 15, linha: 4 },
  { coluna: 6, linha: 14 },
  { coluna: 15, linha: 14 },
];

export const QUANTIDADE_MAXIMA_LIXEIRA = 8;

export const QUANTIDADE_MAXIMA_LIXO = 4;

export const POSICAO_INICIAL_GARI = {
  coluna: 1,
  linha: 9,
};