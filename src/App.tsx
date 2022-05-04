import { useState } from "react";
import "./App.css";

function App() {
  const [linhas, setLinhas] = useState(0);
  const [colunas, setColunas] = useState(0);
  const [matriz, setMatriz] = useState<any[][]>([[]]);
  const [gerar, setGerar] = useState(false);
  const array = [
    { item: "A" },
    { item: "Lo" },
    { item: "Le" },
    { item: "Ls" },
    { item: "E" },
    { item: "O" },
    { item: "S" },
    { item: "Lo" },
    { item: "Le" },
    { item: "Ls" },
  ];

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
        return "s";
      case 6:
        return "o";
      case 6:
        return "e";
    }
  }

  function gerarMatriz() {
    let mt = Array(linhas)
      .fill("")
      .map((row) => new Array(colunas).fill(""));
    let l = 0;
    let c = 0;
    for (l = 0; l < linhas; l++) {
      for (c = 0; c < colunas; c++) {
        if (l === 0 && c === 0) {
          mt[l][c] = "A";
        } else {
          mt[l][c] = ambiente();
        }
      }
    }
    console.table(mt);
    setMatriz(mt);
    setGerar(true);
    let s: string;
    s = 2 + "2";
    console.log(s);
  }

  return (
    <div className="App">
      <header className="App-header">
        {!gerar && (
          <>
            <label>Digite a quantidade de linhas</label>
            <input
              type="number"
              defaultValue={0}
              value={linhas}
              onChange={(event) => {
                setGerar(false);
                setLinhas(parseInt(event.target.value));
              }}
              id="linhas"
            ></input>
            <label>Digite a quantidade de colunas</label>
            <input
              type="number"
              defaultValue={0}
              value={colunas}
              onChange={(event) => {
                setGerar(false);
                setColunas(parseInt(event.target.value));
              }}
              id="colunas"
            ></input>
            <button
              style={{ color: "blue", backgroundColor: "white" }}
              onClick={() => {
                gerarMatriz();
              }}
            >
              Gerar
            </button>
          </>
        )}
        {gerar &&
          matriz.map((l, index1) => {
            return (
              <div
                style={{ display: "flex", flex: colunas, maxHeight: "42px" }}
              >
                {l.map((c, index2) => {
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
                      {c}
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
