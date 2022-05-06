import { useState } from "react";
import produce from 'immer';
import "./App.css";
import { Direcao, Itens, Gari } from "./types";

function App() {
  const [matriz, setMatriz] = useState<Itens[][]>([[]]);
  const [gerar, setGerar] = useState(false);
  const [gari, setGari] = useState<Gari>({
    quantidadeLO: 0,
    quantidadeLS: 0,
    quantidadeLE: 0,
    posicao: {
      coluna: 9,
      linha: 9,
    }
  });

  //variaveis contadoras
  //quantidade de lixo Orgânico
  var quantidadeO = 0;
  //quantidade de lixo Seco
  var quantidadeS = 0;
  //quantidade de lixo Eletrônico
  var quantidadeE = 0;

  function ambiente() {
    let min = Math.ceil(1);
    let max = Math.floor(7);
    let num = Math.floor(Math.random() * (max - min)) + min;
    switch (num) {
      case 1:
        return Itens.LIVRE;
      case 2:
        if (quantidadeS === 60) {
          return Itens.LIVRE;
        } else {
          quantidadeS++;
          return Itens.LIXO_SECO;
        }
      case 3:
        return Itens.LIVRE;
      case 4:
        if (quantidadeE === 60) {
          return Itens.LIVRE;
        } else {
          quantidadeE++;
          return Itens.LIXO_ELETRONICO;
        }
      case 5:
        return Itens.LIVRE;
      case 6:
        if (quantidadeO === 60) {
          return Itens.LIVRE;
        } else {
          quantidadeO++;
          return Itens.LIXO_ORGANICO;
        };
      case 7:
        return Itens.LIVRE;

    }
  }

  function geraMatriz() {
    let mt = Array(20)
      .fill("")
      .map((row) => new Array(20).fill(""));
    let l = 0;
    let c = 0;
    for (l = 0; l < 20; l++) {
      for (c = 0; c < 20; c++) {
        if (l === 0 && c === 0
          || l === 0 && c === 19
          || l === 4 && c === 4
          || l === 4 && c === 13
          || l === 14 && c === 4
          || l === 14 && c === 13
          || l === 19 && c === 0
          || l === 19 && c === 19) {
          mt[l][c] = Itens.LIXEIRA_SECO;
        } else

          if (l === 0 && c === 1
            || l === 0 && c === 18
            || l === 4 && c === 5
            || l === 4 && c === 14
            || l === 14 && c === 5
            || l === 14 && c === 14
            || l === 19 && c === 1
            || l === 19 && c === 18) {
            mt[l][c] = Itens.LIXEIRA_ORGANICO;
          } else

            if (l === 0 && c === 2
              || l === 0 && c === 17
              || l === 4 && c === 6
              || l === 4 && c === 15
              || l === 14 && c === 6
              || l === 14 && c === 15
              || l === 19 && c === 2
              || l === 19 && c === 17) {
              mt[l][c] = Itens.LIXEIRA_ELETRONICO;
            } else

              if (l === 9 && c === 9) {
                mt[l][c] = Itens.GARI
              } else {
                mt[l][c] = ambiente();
              }
      }
    }
    setMatriz(mt);
    setGerar(true);
  };


  function moverDireita() {
    const { coluna, linha } = gari.posicao;
    if (coluna === 19) {
      throw new Error('Não há espaço suficiente à direita.')
    }

    let proximoItem = Itens.GARI;

    switch (matriz[linha][coluna + 1]) {
      case Itens.LIXEIRA_SECO: {
        throw new Error('Não é possível se movimentar para uma lixeira.')
      }
      case Itens.LIXEIRA_ELETRONICO: {
        throw new Error('Não é possível se movimentar para uma lixeira.')
      }
      case Itens.LIXEIRA_ORGANICO: {
        throw new Error('Não é possível se movimentar para uma lixeira.')
      }
      case Itens.LIXO_ELETRONICO: {
        proximoItem = Itens.AGENTE_LIXO_ELETRONICO;
        break;
      }
      case Itens.LIXO_ORGANICO: {
        proximoItem = Itens.AGENTE_LIXO_ORGANICO;
        break;
      }
      case Itens.LIXO_SECO: {
        proximoItem = Itens.AGENTE_LIXO_SECO;
        break;
      }

    }
    // if (matriz[linha][coluna + 1] === Itens.)

    setMatriz((state) => produce(state, draft => {
      draft[linha][coluna + 1] = proximoItem;
      draft[linha][coluna] = Itens.LIVRE;
    }))

    setGari(state => produce(state, draft => {
      draft.posicao.coluna+= 1;
    }));
  };

  function moverEsquerda(linhaAtual: number, colunaAtual: number) {
    if (colunaAtual === 0) {
      return false;
    }
    if (matriz[linhaAtual][colunaAtual - 1] === Itens.LIXEIRA_SECO
      || matriz[linhaAtual][colunaAtual - 1] === Itens.LIXEIRA_ELETRONICO
      || matriz[linhaAtual][colunaAtual - 1] === Itens.LIXEIRA_ORGANICO) {
      return false;
    }
    if (matriz[linhaAtual][colunaAtual - 1] === Itens.LIVRE
      || matriz[linhaAtual][colunaAtual - 1] === Itens.LIXO_SECO
      || matriz[linhaAtual][colunaAtual - 1] === Itens.LIXO_ORGANICO
      || matriz[linhaAtual][colunaAtual - 1] === Itens.LIXO_ELETRONICO) {
      return matriz[linhaAtual][colunaAtual - 1];
    }
  };

  function moverCima(linhaAtual: number, colunaAtual: number) {
    if (linhaAtual === 0) {
      return false;
    }
    if (matriz[linhaAtual - 1][colunaAtual] === Itens.LIXEIRA_SECO
      || matriz[linhaAtual - 1][colunaAtual] === Itens.LIXEIRA_ELETRONICO
      || matriz[linhaAtual - 1][colunaAtual] === Itens.LIXEIRA_ORGANICO) {
      return false;
    }
    if (matriz[linhaAtual - 1][colunaAtual] === Itens.LIVRE
      || matriz[linhaAtual - 1][colunaAtual] === Itens.LIXO_SECO
      || matriz[linhaAtual - 1][colunaAtual] === Itens.LIXO_ORGANICO
      || matriz[linhaAtual - 1][colunaAtual] === Itens.LIXO_ELETRONICO) {
      return matriz[linhaAtual - 1][colunaAtual];
    }
  };

  function moverBaixo(linhaAtual: number, colunaAtual: number) {
    if (linhaAtual === 19) {
      return false;
    }
    if (matriz[linhaAtual + 1][colunaAtual] === Itens.LIXEIRA_SECO
      || matriz[linhaAtual + 1][colunaAtual] === Itens.LIXEIRA_ELETRONICO
      || matriz[linhaAtual + 1][colunaAtual] === Itens.LIXEIRA_ORGANICO) {
      return false;
    }
    if (matriz[linhaAtual + 1][colunaAtual] === Itens.LIVRE
      || matriz[linhaAtual + 1][colunaAtual] === Itens.LIXO_SECO
      || matriz[linhaAtual + 1][colunaAtual] === Itens.LIXO_ORGANICO
      || matriz[linhaAtual + 1][colunaAtual] === Itens.LIXO_ELETRONICO) {
      return matriz[linhaAtual + 1][colunaAtual];
    }
  };

  function moverGari(linhaAtual: number, colunaAtual: number, direcao: Direcao) {
    switch (direcao) {
      case Direcao.DIREITA:
        return moverDireita();
      case Direcao.ESQUERDA:
        return moverEsquerda(linhaAtual, colunaAtual);
      case Direcao.CIMA:
        return moverCima(linhaAtual, colunaAtual);
      case Direcao.BAIXO:
        return moverBaixo(linhaAtual, colunaAtual);
    }
  };

  function recolherLixo(linhaAtual: number, colunaAtual: number) {
    if (matriz[linhaAtual][colunaAtual] === Itens.AGENTE_LIXO_SECO) {
      setGari({ ...gari, quantidadeLS: gari.quantidadeLS + 1 })
    }
    if (matriz[linhaAtual][colunaAtual] === Itens.AGENTE_LIXO_ORGANICO) {
      setGari({ ...gari, quantidadeLO: gari.quantidadeLO + 1 })
    }
    if (matriz[linhaAtual][colunaAtual] === Itens.AGENTE_LIXO_ELETRONICO) {
      setGari({ ...gari, quantidadeLE: gari.quantidadeLE + 1 })
    }
  }

  function lixoParaLixeira(linhaAtual: number, colunaAtual: number) {
    if (matriz[linhaAtual][colunaAtual + 1] === Itens.LIXEIRA_SECO
      || matriz[linhaAtual][colunaAtual - 1] === Itens.LIXEIRA_SECO
      || matriz[linhaAtual + 1][colunaAtual] === Itens.LIXEIRA_SECO
      || matriz[linhaAtual - 1][colunaAtual] === Itens.LIXEIRA_SECO
    ) {
      setGari({ ...gari, quantidadeLO: 0 })
    }
    if (matriz[linhaAtual][colunaAtual + 1] === Itens.LIXEIRA_ELETRONICO
      || matriz[linhaAtual][colunaAtual - 1] === Itens.LIXEIRA_ELETRONICO
      || matriz[linhaAtual + 1][colunaAtual] === Itens.LIXEIRA_ELETRONICO
      || matriz[linhaAtual - 1][colunaAtual] === Itens.LIXEIRA_ELETRONICO
    ) {
      setGari({ ...gari, quantidadeLE: 0 })
    }
    if (matriz[linhaAtual][colunaAtual + 1] === Itens.LIXEIRA_ORGANICO
      || matriz[linhaAtual][colunaAtual - 1] === Itens.LIXEIRA_ORGANICO
      || matriz[linhaAtual + 1][colunaAtual] === Itens.LIXEIRA_ORGANICO
      || matriz[linhaAtual - 1][colunaAtual] === Itens.LIXEIRA_ORGANICO
    ) {
      setGari({ ...gari, quantidadeLS: 0 })
    }
  }

  console.log(gari)


  return (
    <div className="App">
      <header className="App-header">
        <button onClick={moverDireita}>Mover direita</button>
        <button style={{ width: '150px', height: '50px' }} onClick={() => { geraMatriz() }} >Iniciar matriz</button>
        {gerar &&
          matriz.map((linha, index1) => {
            return (
              <div
                style={{ display: "flex", flex: 20, maxHeight: "42px" }}
              >
                {linha.map((coluna, index2) => {
                  return (
                    <div
                      id={"div_" + index1 + "_" + index2}
                      style={{
                        color: "blue",
                        fontSize: "20px",
                        backgroundColor: "white",
                        border: "1px solid black",
                        width: "38px",
                        height: "40px",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {coluna}
                    </div>
                  );
                })}
              </div>
            );
          })}
      </header>
    </div>
  );
}

export default App;
