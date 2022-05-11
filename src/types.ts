export enum Direcao {
  DIREITA = 'd',
  ESQUERDA = 'e',
  CIMA = 'c',
  BAIXO = 'b'
}

export type Lixeira = {
  coluna: number;
  linha: number;
  quantidadeLixo: number;
}

export type Gari = {
  quantidadeLO: number;
  quantidadeLS: number;
  quantidadeLE: number;
  posicao: {
    linha: number;
    coluna: number;
  }
}

export enum Itens { 
  LIXEIRA_ORGANICO = 'Lo',
  LIXEIRA_ELETRONICO = 'Le',
  LIXEIRA_SECO = 'Ls',
  LIXO_ORGANICO = 'o',
  LIXO_ELETRONICO = 'e',
  LIXO_SECO = 's',
  LIVRE = ' ',
  AGENTE_LIXO_ORGANICO = 'Ao',
  AGENTE_LIXO_SECO = 'As',
  AGENTE_LIXO_ELETRONICO = 'Ae',
  GARI = 'A'
}