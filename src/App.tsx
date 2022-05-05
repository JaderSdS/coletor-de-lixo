import { useEffect, useState } from "react";
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
        return "Lo";
      case 2:
        return "Ls";
      case 3:
        return "Le";
      case 4:
        return " ";
      case 5:
        quantidadeS++;
        return "s";
      case 6:
        quantidadeO++
        return "o";
      case 6:
        quantidadeE++;
        return "e";
    }
  }

  useEffect(() => {
    let mt = Array(20)
      .fill("")
      .map((row) => new Array(20).fill(""));
    let l = 0;
    let c = 0;
    for (l = 0; l < 20; l++) {
      for (c = 0; c < 20; c++) {
        if (l === 0 && c === 0 || l === 0 && c === 19 || l === 4 && c === 4 || l === 4 && c === 13 || l === 14 && c === 4 || l === 14 && c === 13 || l === 19 && c === 0 || l === 19 && c === 19) {
          mt[l][c] = 'LS';
        }

        if (l === 0 && c === 1 || l === 0 && c === 18 || l === 4 && c === 5 || l === 4 && c === 14 || l === 14 && c === 5 || l === 14 && c === 14 || l === 19 && c === 1 || l === 19 && c === 18) {
          mt[l][c] = 'LO';
        }

        if (l === 0 && c === 2 || l === 0 && c === 17 || l === 4 && c === 6 || l === 4 && c === 15 || l === 14 && c === 6 || l === 14 && c === 15 || l === 19 && c === 2 || l === 19 && c === 17) {
          mt[l][c] = 'LE';
        }

        if (l === 9 && c === 9) {
          mt[l][c] = gari.nome;
        }
      }
    }
    setMatriz(mt);
    setGerar(true);
  });


  function moverDireita(linhaAtual: number, colunaAtual: number) {
    if (colunaAtual === 19) {
      return false;
    }
    if (matriz[linhaAtual][colunaAtual + 1] === 'LS' || matriz[linhaAtual][colunaAtual + 1] === 'LE' || matriz[linhaAtual][colunaAtual + 1] === 'LO') {
      return false;
    }
    if (matriz[linhaAtual][colunaAtual + 1] === ' ' || matriz[linhaAtual][colunaAtual + 1] === 's' || matriz[linhaAtual][colunaAtual + 1] === 'o' || matriz[linhaAtual][colunaAtual + 1] === 'e') {
      return matriz[linhaAtual][colunaAtual + 1];
    }
  };

  function moverEsquerda(linhaAtual: number, colunaAtual: number) {
    if (colunaAtual === 0) {
      return false;
    }
    if (matriz[linhaAtual][colunaAtual - 1] === 'LS' || matriz[linhaAtual][colunaAtual - 1] === 'LE' || matriz[linhaAtual][colunaAtual - 1] === 'LO') {
      return false;
    }
    if (matriz[linhaAtual][colunaAtual - 1] === ' ' || matriz[linhaAtual][colunaAtual - 1] === 's' || matriz[linhaAtual][colunaAtual - 1] === 'o' || matriz[linhaAtual][colunaAtual - 1] === 'e') {
      return matriz[linhaAtual][colunaAtual - 1];
    }
  };

  function moverCima(linhaAtual: number, colunaAtual: number) {
    if (linhaAtual === 0) {
      return false;
    }
    if (matriz[linhaAtual - 1][colunaAtual] === 'LS' || matriz[linhaAtual - 1][colunaAtual] === 'LE' || matriz[linhaAtual - 1][colunaAtual] === 'LO') {
      return false;
    }
    if (matriz[linhaAtual - 1][colunaAtual] === ' ' || matriz[linhaAtual - 1][colunaAtual] === 's' || matriz[linhaAtual - 1][colunaAtual] === 'o' || matriz[linhaAtual - 1][colunaAtual] === 'e') {
      return matriz[linhaAtual - 1][colunaAtual];
    }
  };

  function moverBaixo(linhaAtual: number, colunaAtual: number) {
    if (linhaAtual === 19) {
      return false;
    }
    if (matriz[linhaAtual + 1][colunaAtual] === 'LS' || matriz[linhaAtual + 1][colunaAtual] === 'LE' || matriz[linhaAtual + 1][colunaAtual] === 'LO') {
      return false;
    }
    if (matriz[linhaAtual + 1][colunaAtual] === ' ' || matriz[linhaAtual + 1][colunaAtual] === 's' || matriz[linhaAtual + 1][colunaAtual] === 'o' || matriz[linhaAtual + 1][colunaAtual] === 'e') {
      return matriz[linhaAtual + 1][colunaAtual];
    }
  };

  return (
    <div className="App">
      <header className="App-header">
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
