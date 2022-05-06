import { useState } from "react";
import "./App.css";

interface Gari {
  nome: 'A';
  quantidadeLO: number;
  quantidadeLS: number;
  quantidadeLE: number;
}

function App() {
  const [matriz, setMatriz] = useState<any[][]>([[]]);
  const [gerar, setGerar] = useState(false);
  const [gari, setGari] = useState<Gari>({
    nome: 'A',
    quantidadeLO: 0,
    quantidadeLS: 0,
    quantidadeLE: 0,
  })
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
        return " ";
      case 2:
        if (quantidadeS === 60) {
          return " ";
        } else {
          quantidadeS++;
          return "s";
        }
      case 3:
        return " ";
      case 4:
        if (quantidadeE === 60) {
          return " ";
        } else {
          quantidadeE++;
          return "e";
        }
      case 5:
        return " ";
      case 6:
        if (quantidadeO === 60) {
          return " ";
        } else {
          quantidadeO++;
          return "o";
        };
      case 7:
        return " ";

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
          mt[l][c] = 'LS';
        } else

          if (l === 0 && c === 1
            || l === 0 && c === 18
            || l === 4 && c === 5
            || l === 4 && c === 14
            || l === 14 && c === 5
            || l === 14 && c === 14
            || l === 19 && c === 1
            || l === 19 && c === 18) {
            mt[l][c] = 'LO';
          } else

            if (l === 0 && c === 2
              || l === 0 && c === 17
              || l === 4 && c === 6
              || l === 4 && c === 15
              || l === 14 && c === 6
              || l === 14 && c === 15
              || l === 19 && c === 2
              || l === 19 && c === 17) {
              mt[l][c] = 'LE';
            } else

              if (l === 9 && c === 9) {
                mt[l][c] = gari.nome;
              } else {
                mt[l][c] = ambiente();
              }
      }
    }
    setMatriz(mt);
    setGerar(true);
  };


  function moverDireita(linhaAtual: number, colunaAtual: number) {
    if (colunaAtual === 19) {
      return false;
    }
    if (matriz[linhaAtual][colunaAtual + 1] === 'LS'
      || matriz[linhaAtual][colunaAtual + 1] === 'LE'
      || matriz[linhaAtual][colunaAtual + 1] === 'LO') {
      return false;
    }
    if (matriz[linhaAtual][colunaAtual + 1] === ' '
      || matriz[linhaAtual][colunaAtual + 1] === 's'
      || matriz[linhaAtual][colunaAtual + 1] === 'o'
      || matriz[linhaAtual][colunaAtual + 1] === 'e') {
      return matriz[linhaAtual][colunaAtual + 1];
    }
  };

  function moverEsquerda(linhaAtual: number, colunaAtual: number) {
    if (colunaAtual === 0) {
      return false;
    }
    if (matriz[linhaAtual][colunaAtual - 1] === 'LS'
      || matriz[linhaAtual][colunaAtual - 1] === 'LE'
      || matriz[linhaAtual][colunaAtual - 1] === 'LO') {
      return false;
    }
    if (matriz[linhaAtual][colunaAtual - 1] === ' '
      || matriz[linhaAtual][colunaAtual - 1] === 's'
      || matriz[linhaAtual][colunaAtual - 1] === 'o'
      || matriz[linhaAtual][colunaAtual - 1] === 'e') {
      return matriz[linhaAtual][colunaAtual - 1];
    }
  };

  function moverCima(linhaAtual: number, colunaAtual: number) {
    if (linhaAtual === 0) {
      return false;
    }
    if (matriz[linhaAtual - 1][colunaAtual] === 'LS'
      || matriz[linhaAtual - 1][colunaAtual] === 'LE'
      || matriz[linhaAtual - 1][colunaAtual] === 'LO') {
      return false;
    }
    if (matriz[linhaAtual - 1][colunaAtual] === ' '
      || matriz[linhaAtual - 1][colunaAtual] === 's'
      || matriz[linhaAtual - 1][colunaAtual] === 'o'
      || matriz[linhaAtual - 1][colunaAtual] === 'e') {
      return matriz[linhaAtual - 1][colunaAtual];
    }
  };

  function moverBaixo(linhaAtual: number, colunaAtual: number) {
    if (linhaAtual === 19) {
      return false;
    }
    if (matriz[linhaAtual + 1][colunaAtual] === 'LS'
      || matriz[linhaAtual + 1][colunaAtual] === 'LE'
      || matriz[linhaAtual + 1][colunaAtual] === 'LO') {
      return false;
    }
    if (matriz[linhaAtual + 1][colunaAtual] === ' '
      || matriz[linhaAtual + 1][colunaAtual] === 's'
      || matriz[linhaAtual + 1][colunaAtual] === 'o'
      || matriz[linhaAtual + 1][colunaAtual] === 'e') {
      return matriz[linhaAtual + 1][colunaAtual];
    }
  };

  function moverGari(linhaAtual: number, colunaAtual: number, direcao: string) {
    switch (direcao) {
      case 'd':
        return moverDireita(linhaAtual, colunaAtual);
      case 'e':
        return moverEsquerda(linhaAtual, colunaAtual);
      case 'c':
        return moverCima(linhaAtual, colunaAtual);
      case 'b':
        return moverBaixo(linhaAtual, colunaAtual);
    }
  };

  function recolherLixo(linhaAtual: number, colunaAtual: number) {
    if (matriz[linhaAtual][colunaAtual] === 'As') {
      setGari({ ...gari, quantidadeLS: gari.quantidadeLS + 1 })
    }
    if (matriz[linhaAtual][colunaAtual] === 'Ao') {
      setGari({ ...gari, quantidadeLO: gari.quantidadeLO + 1 })
    }
    if (matriz[linhaAtual][colunaAtual] === 'Ae') {
      setGari({ ...gari, quantidadeLE: gari.quantidadeLE + 1 })
    }
  }

  function lixoParaLixeira(linhaAtual: number, colunaAtual: number) {
    if (matriz[linhaAtual][colunaAtual + 1] === 'LS'
      || matriz[linhaAtual][colunaAtual - 1] === 'LS'
      || matriz[linhaAtual + 1][colunaAtual] === 'LS'
      || matriz[linhaAtual - 1][colunaAtual] === 'LS'
    ) {
      setGari({ ...gari, quantidadeLO: 0 })
    }
    if (matriz[linhaAtual][colunaAtual + 1] === 'LE'
      || matriz[linhaAtual][colunaAtual - 1] === 'LE'
      || matriz[linhaAtual + 1][colunaAtual] === 'LE'
      || matriz[linhaAtual - 1][colunaAtual] === 'LE'
    ) {
      setGari({ ...gari, quantidadeLE: 0 })
    }
    if (matriz[linhaAtual][colunaAtual + 1] === 'LO'
      || matriz[linhaAtual][colunaAtual - 1] === 'LO'
      || matriz[linhaAtual + 1][colunaAtual] === 'LO'
      || matriz[linhaAtual - 1][colunaAtual] === 'LO'
    ) {
      setGari({ ...gari, quantidadeLS: 0 })
    }
  }


  return (
    <div className="App">
      <header className="App-header">
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
