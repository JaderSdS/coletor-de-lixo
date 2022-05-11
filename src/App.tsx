import { useCallback, useEffect, useState } from "react";
import produce from "immer";
import "./App.css";
import { Direcao, Itens, Gari, Lixeira } from "./types";
import {
  LIXEIRAS_ELETRONICO,
  LIXEIRAS_ORGANICO,
  LIXEIRAS_SECO,
  POSICAO_INICIAL_GARI,
  QUANTIDADE_MAXIMA_LIXO,
} from "./contants";
import { timeout } from "q";

function App() {
  const [matriz, setMatriz] = useState<Itens[][]>([[]]);
  const [gerar, setGerar] = useState(false);
  const [gari, setGari] = useState<Gari>({
    quantidadeLO: 0,
    quantidadeLS: 0,
    quantidadeLE: 0,
    posicao: POSICAO_INICIAL_GARI,
  });
  const [movendoInicio, setMovendoInicio] = useState(true);
  const [movendoLixeiraOrganica, setMovendoLixeiraOrganica] = useState(false);
  const [lixeiraCimaEsquerdaO, setLixeiraCimEsquerdaO] = useState<Lixeira>({
    coluna: 1,
    linha: 2,
    quantidadeLixo: 0,
  });

  let timer:NodeJS.Timeout

  const [quantidadeO, setQuantidadeO] = useState(0);
  const [quantidadeS, setQuantidadeS] = useState(0);
  const [quantidadeE, setQuantidadeE] = useState(0);

  const ambiente = useCallback(() => {
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
          setQuantidadeS((state) => state + 1);
          return Itens.LIXO_SECO;
        }
      case 3:
        return Itens.LIVRE;
      case 4:
        if (quantidadeE === 60) {
          return Itens.LIVRE;
        } else {
          setQuantidadeE((state) => state + 1);
          return Itens.LIXO_ELETRONICO;
        }
      case 5:
        return Itens.LIVRE;
      case 6:
        if (quantidadeO === 60) {
          return Itens.LIVRE;
        } else {
          setQuantidadeO((state) => state + 1);
          return Itens.LIXO_ORGANICO;
        }
      case 7:
        return Itens.LIVRE;
    }
  }, [quantidadeE, quantidadeO, quantidadeS]);

  const geraMatriz = useCallback(() => {
    let mt = Array(20)
      .fill("")
      .map((row) => new Array(20).fill(""));
    let l = 0;
    let c = 0;
    for (l = 0; l < 20; l++) {
      for (c = 0; c < 20; c++) {
        const devePorLixeiraSeco = LIXEIRAS_SECO.find(
          (lixeira) => lixeira.coluna === c && lixeira.linha === l
        );

        if (devePorLixeiraSeco) {
          mt[l][c] = Itens.LIXEIRA_SECO;
        } else {
          const devePorLixeiraEletronico = LIXEIRAS_ELETRONICO.find(
            (lixeira) => lixeira.coluna === c && lixeira.linha === l
          );

          if (devePorLixeiraEletronico) {
            mt[l][c] = Itens.LIXEIRA_ELETRONICO;
          } else {
            const devePorLixeiraOrganico = LIXEIRAS_ORGANICO.find(
              (lixeira) => lixeira.coluna === c && lixeira.linha === l
            );

            if (devePorLixeiraOrganico) {
              mt[l][c] = Itens.LIXEIRA_ORGANICO;
            } else {
              const devePorGari =
                c === POSICAO_INICIAL_GARI.coluna &&
                l === POSICAO_INICIAL_GARI.linha;

              if (devePorGari) {
                mt[l][c] = Itens.GARI;
              } else {
                mt[l][c] = ambiente();
              }
            }
          }
        }
      }
    }
    setMatriz(mt);
    setGerar(true);
  }, [ambiente]);

  const moverDireita = useCallback(
    () => {
      return new Promise<void>((resolve, reject) => {
        const { coluna, linha } = gari.posicao;
        if (coluna === 19) {
          reject("Não é possível se mover para direita");
          return;
        }

        let proximoItem = Itens.GARI;

        switch (matriz[linha][coluna + 1]) {
          case Itens.LIXEIRA_SECO: {
            reject("Não é possível se movimentar para uma lixeira.");
            return;
          }
          case Itens.LIXEIRA_ELETRONICO: {
            reject("Não é possível se movimentar para uma lixeira.");
            return;
          }
          case Itens.LIXEIRA_ORGANICO: {
            reject("Não é possível se movimentar para uma lixeira.");
            return;
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

        timer = setTimeout(() => {
          setMatriz((state) =>
            produce(state, (draft) => {
              draft[linha][coluna + 1] = proximoItem;

              if (draft[linha][coluna] === Itens.AGENTE_LIXO_ELETRONICO) {
                draft[linha][coluna] = Itens.LIXO_ELETRONICO;
              }

              if (draft[linha][coluna] === Itens.AGENTE_LIXO_ORGANICO) {
                draft[linha][coluna] = Itens.LIXO_ORGANICO;
              }

              if (draft[linha][coluna] === Itens.AGENTE_LIXO_SECO) {
                draft[linha][coluna] = Itens.LIXO_SECO;
              }

              if (draft[linha][coluna] === Itens.GARI) {
                draft[linha][coluna] = Itens.LIVRE;
              }
            })
          );

          setGari((state) =>
            produce(state, (draft) => {
              draft.posicao.coluna += 1;
            })
          );
          resolve();
        }, 1000);
      });
    },
    [gari.posicao, matriz]
  );

  const moverEsquerda = useCallback(
    () => {
      return new Promise<void>((resolve, reject) => {
        const { coluna, linha } = gari.posicao;
        if (coluna === 0) {
          reject("Não é possível se mover para esquerda");
          return;
        }

        let proximoItem = Itens.GARI;

        switch (matriz[linha][coluna - 1]) {
          case Itens.LIXEIRA_SECO: {
            reject("Não é possível se mover para uma lixeira.");
            return;
          }
          case Itens.LIXEIRA_ELETRONICO: {
            reject("Não é possível se mover para uma lixeira.");
            return;
          }
          case Itens.LIXEIRA_ORGANICO: {
            reject("Não é possível se mover para uma lixeira.");
            return;
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

        setMatriz((state) =>
          produce(state, (draft) => {
            draft[linha][coluna - 1] = proximoItem;

            if (draft[linha][coluna] === Itens.AGENTE_LIXO_ELETRONICO) {
              draft[linha][coluna] = Itens.LIXO_ELETRONICO;
            }

            if (draft[linha][coluna] === Itens.AGENTE_LIXO_ORGANICO) {
              draft[linha][coluna] = Itens.LIXO_ORGANICO;
            }

            if (draft[linha][coluna] === Itens.AGENTE_LIXO_SECO) {
              draft[linha][coluna] = Itens.LIXO_SECO;
            }

            if (draft[linha][coluna] === Itens.GARI) {
              draft[linha][coluna] = Itens.LIVRE;
            }
          })
        );

        timer = setTimeout(() => {
          setGari((state) =>
            produce(state, (draft) => {
              draft.posicao.coluna -= 1;
            })
          );

          resolve();
        }, 1000);
      });
    },
    [gari.posicao, matriz]
  );

  const moverCima = useCallback(
    () => {
      return new Promise<void>((resolve, reject) => {
        const { coluna, linha } = gari.posicao;
        if (linha === 0) {
          reject("Não é possível se mover para cima");
          return;
        }

        let proximoItem = Itens.GARI;

        switch (matriz[linha - 1][coluna]) {
          case Itens.LIXEIRA_SECO: {
            reject("Não é possível se mover para uma lixeira.");
            return;
          }
          case Itens.LIXEIRA_ELETRONICO: {
            reject("Não é possível se mover para uma lixeira.");
            return;
          }
          case Itens.LIXEIRA_ORGANICO: {
            reject("Não é possível se mover para uma lixeira.");
            return;
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

        timer = setTimeout(() => {
          setMatriz((state) =>
            produce(state, (draft) => {
              draft[linha - 1][coluna] = proximoItem;

              if (draft[linha][coluna] === Itens.AGENTE_LIXO_ELETRONICO) {
                draft[linha][coluna] = Itens.LIXO_ELETRONICO;
              }

              if (draft[linha][coluna] === Itens.AGENTE_LIXO_ORGANICO) {
                draft[linha][coluna] = Itens.LIXO_ORGANICO;
              }

              if (draft[linha][coluna] === Itens.AGENTE_LIXO_SECO) {
                draft[linha][coluna] = Itens.LIXO_SECO;
              }

              if (draft[linha][coluna] === Itens.GARI) {
                draft[linha][coluna] = Itens.LIVRE;
              }
            })
          );

          setGari((state) =>
            produce(state, (draft) => {
              draft.posicao.linha -= 1;
            })
          );

          resolve();
        }, 1000);
      });
    },
    [gari.posicao, matriz]
  );

  function moverBaixo(linhaAtual: number, colunaAtual: number) {
    if (linhaAtual === 19) {
      return false;
    }
    if (
      matriz[linhaAtual + 1][colunaAtual] === Itens.LIXEIRA_SECO ||
      matriz[linhaAtual + 1][colunaAtual] === Itens.LIXEIRA_ELETRONICO ||
      matriz[linhaAtual + 1][colunaAtual] === Itens.LIXEIRA_ORGANICO
    ) {
      return false;
    }
    if (
      matriz[linhaAtual + 1][colunaAtual] === Itens.LIVRE ||
      matriz[linhaAtual + 1][colunaAtual] === Itens.LIXO_SECO ||
      matriz[linhaAtual + 1][colunaAtual] === Itens.LIXO_ORGANICO ||
      matriz[linhaAtual + 1][colunaAtual] === Itens.LIXO_ELETRONICO
    ) {
      return matriz[linhaAtual + 1][colunaAtual];
    }
  }

  // function moverGari(
  //   linhaAtual: number,
  //   colunaAtual: number,
  //   direcao: Direcao
  // ) {
  //   switch (direcao) {
  //     case Direcao.DIREITA:
  //       return moverDireita();
  //     case Direcao.ESQUERDA:
  //       return moverEsquerda();
  //     case Direcao.CIMA:
  //       return moverCima();
  //     case Direcao.BAIXO:
  //       return moverBaixo(linhaAtual, colunaAtual);
  //   }
  // }

  function recolherLixo(linhaAtual: number, colunaAtual: number) {
    if (matriz[linhaAtual][colunaAtual] === Itens.AGENTE_LIXO_SECO) {
      setGari({ ...gari, quantidadeLS: gari.quantidadeLS + 1 });
    }
    if (matriz[linhaAtual][colunaAtual] === Itens.AGENTE_LIXO_ORGANICO) {
      setGari({ ...gari, quantidadeLO: gari.quantidadeLO + 1 });
    }
    if (matriz[linhaAtual][colunaAtual] === Itens.AGENTE_LIXO_ELETRONICO) {
      setGari({ ...gari, quantidadeLE: gari.quantidadeLE + 1 });
    }
  }

  function lixoParaLixeira(linhaAtual: number, colunaAtual: number) {
    if (
      matriz[linhaAtual][colunaAtual + 1] === Itens.LIXEIRA_SECO ||
      matriz[linhaAtual][colunaAtual - 1] === Itens.LIXEIRA_SECO ||
      matriz[linhaAtual + 1][colunaAtual] === Itens.LIXEIRA_SECO ||
      matriz[linhaAtual - 1][colunaAtual] === Itens.LIXEIRA_SECO
    ) {
      setGari({ ...gari, quantidadeLO: 0 });
    }
    if (
      matriz[linhaAtual][colunaAtual + 1] === Itens.LIXEIRA_ELETRONICO ||
      matriz[linhaAtual][colunaAtual - 1] === Itens.LIXEIRA_ELETRONICO ||
      matriz[linhaAtual + 1][colunaAtual] === Itens.LIXEIRA_ELETRONICO ||
      matriz[linhaAtual - 1][colunaAtual] === Itens.LIXEIRA_ELETRONICO
    ) {
      setGari({ ...gari, quantidadeLE: 0 });
    }
    if (
      matriz[linhaAtual][colunaAtual + 1] === Itens.LIXEIRA_ORGANICO ||
      matriz[linhaAtual][colunaAtual - 1] === Itens.LIXEIRA_ORGANICO ||
      matriz[linhaAtual + 1][colunaAtual] === Itens.LIXEIRA_ORGANICO ||
      matriz[linhaAtual - 1][colunaAtual] === Itens.LIXEIRA_ORGANICO
    ) {
      setGari({ ...gari, quantidadeLS: 0 });
    }
  }

  useEffect(() => {
    geraMatriz();
  }, []);

  useEffect(() => {
    if (gari.quantidadeLE === QUANTIDADE_MAXIMA_LIXO) {
      console.log("Deve esvaziar lixo eletronico");
    }
  }, [gari.quantidadeLE]);

  const moveParaLixeiraOrganica = useCallback(
    async () => {
      if (lixeiraCimaEsquerdaO.quantidadeLixo < QUANTIDADE_MAXIMA_LIXO) {
        if (gari.posicao.coluna > lixeiraCimaEsquerdaO.coluna) {
          await moverEsquerda();
          return;
        }

        if (gari.posicao.coluna < lixeiraCimaEsquerdaO.coluna) {
          await moverDireita();
          return;
        }

        if (gari.posicao.linha >= lixeiraCimaEsquerdaO.linha) {
          try {
            await moverCima();
          } catch(erro) {
            console.log(erro)
          }
          return;
        } else {
          const quantidadeQueOGariPodeDepositar = QUANTIDADE_MAXIMA_LIXO - lixeiraCimaEsquerdaO.quantidadeLixo;
          setGari(state => produce(state, draft => {
            draft.quantidadeLO -= quantidadeQueOGariPodeDepositar;
          }))
          setLixeiraCimEsquerdaO(state => produce(state, draft => {
            draft.quantidadeLixo += gari.quantidadeLO;
          }))
          console.log("Limpou a carga de organico.")
          setMovendoInicio(true);
          setMovendoLixeiraOrganica(false);
        }
      }
    },
    [gari.posicao.coluna, gari.posicao.linha, gari.quantidadeLO, lixeiraCimaEsquerdaO.coluna, lixeiraCimaEsquerdaO.linha, lixeiraCimaEsquerdaO.quantidadeLixo, moverCima, moverDireita, moverEsquerda]
  );

  useEffect(() => {

    if (gari.quantidadeLO === QUANTIDADE_MAXIMA_LIXO) {
      console.log("Deve esvaziar lixo organico");
      setMovendoInicio(false);
      setMovendoLixeiraOrganica(true);
      moveParaLixeiraOrganica();
    }

    return () => {
      clearTimeout(timer);
    };
    // @ts-expect-error
  }, [gari.quantidadeLO, moveParaLixeiraOrganica, movendoInicio, timer]);

  useEffect(() => {
    if (gari.quantidadeLS === QUANTIDADE_MAXIMA_LIXO) {
      console.log("Deve esvaziar lixo seco");
    }
  }, [gari.quantidadeLS]);

  useEffect(() => {
    if (!gerar) return;

    if (
      matriz[gari.posicao.linha][gari.posicao.coluna] ===
        Itens.AGENTE_LIXO_ELETRONICO &&
      gari.quantidadeLE < QUANTIDADE_MAXIMA_LIXO
    ) {
      console.log("Recolher lixo eletronico");
      setGari((state) =>
        produce(state, (draft) => {
          draft.quantidadeLE += 1;
        })
      );
      setMatriz((state) =>
        produce(state, (draft) => {
          draft[gari.posicao.linha][gari.posicao.coluna] = Itens.GARI;
        })
      );
    }

    if (
      matriz[gari.posicao.linha][gari.posicao.coluna] ===
        Itens.AGENTE_LIXO_ORGANICO &&
      gari.quantidadeLO < QUANTIDADE_MAXIMA_LIXO
    ) {
      setGari((state) =>
        produce(state, (draft) => {
          draft.quantidadeLO += 1;
        })
      );
      setMatriz((state) =>
        produce(state, (draft) => {
          draft[gari.posicao.linha][gari.posicao.coluna] = Itens.GARI;
        })
      );
    }

    if (
      matriz[gari.posicao.linha][gari.posicao.coluna] ===
        Itens.AGENTE_LIXO_SECO &&
      gari.quantidadeLS < QUANTIDADE_MAXIMA_LIXO
    ) {
      setGari((state) =>
        produce(state, (draft) => {
          draft.quantidadeLS += 1;
        })
      );
      setMatriz((state) =>
        produce(state, (draft) => {
          draft[gari.posicao.linha][gari.posicao.coluna] = Itens.GARI;
        })
      );
    }
  }, [
    gari.posicao.coluna,
    gari.posicao.linha,
    gari.quantidadeLE,
    gari.quantidadeLO,
    gari.quantidadeLS,
    gerar,
    matriz,
  ]);

  const moverGariParaOInicio = useCallback(
    async () => {
      if (gari.posicao.coluna > 3) {
        console.log("Moveu pra esquerda");
        await moverEsquerda();
        return false;
      }

      if (gari.posicao.coluna < 3) {
        console.log("Moveu pra esquerda");
        await moverDireita();
        return false;
      }

      if (gari.posicao.linha > 0) {
        console.log("Moveu pra cima");
        await moverCima();
        return false;
      }

      return true;
    },
    [
      gari.posicao.coluna,
      gari.posicao.linha,
      moverCima,
      moverDireita,
      moverEsquerda,
    ]
  );

  useEffect(() => {
    if (!gerar) return;

    if (movendoLixeiraOrganica) {
      console.log("Parou porque esta kovendo lixeira organica")
      return () => {
        clearTimeout(timer);
      };
    };

    if (!movendoInicio) {
      console.log("Parou porque Não esta movendo inicio")

      return () => {
        clearTimeout(timer);
      };
    }

    console.log("movendo inicio")


    moverGariParaOInicio().then((retorno) => {
      if (retorno) {
        setMovendoInicio(false);
      }
    });

    return () => {
      clearTimeout(timer);
    };
    // @ts-expect-error
  }, [gerar, movendoInicio, moverGariParaOInicio, timer, movendoLixeiraOrganica]);

  return (
    <div className="App">
      <header className="App-header">
        <div style={{ position: "absolute", top: 10, right: 10 }}>
          <div>Quantidade</div>
          <div>Lixo organico {gari.quantidadeLO}</div>
          <div>Lixo seco {gari.quantidadeLS}</div>
          <div>Lixo eletronico {gari.quantidadeLE}</div>
        </div>
        {/* <button onClick={moverDireita}>Mover direita</button> */}
        {/* <button
          style={{ width: "150px", height: "50px" }}
          onClick={() => {
            geraMatriz();
          }}
        >
          Iniciar matriz
        </button> */}
        {gerar &&
          matriz.map((linha, index1) => {
            return (
              <div style={{ display: "flex", flex: 20, maxHeight: "42px" }}>
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
