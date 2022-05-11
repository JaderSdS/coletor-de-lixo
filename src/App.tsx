import { useCallback, useEffect, useState } from "react";
import produce from "immer";
import "./App.css";
import { Itens, Gari, Lixeira } from "./types";
import {
  LIXEIRAS_ELETRONICO,
  LIXEIRAS_ORGANICO,
  LIXEIRAS_SECO,
  POSICAO_INICIAL_GARI,
  QUANTIDADE_MAXIMA_LIXEIRA,
  QUANTIDADE_MAXIMA_LIXO,
  TIMEOUT,
} from "./contants";

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
  const [movendoLixeiraEletronico, setMovendoLixeiraEletronico] =
    useState(false);
  const [movendoLixeiraSeco, setMovendoLixeiraSeco] = useState(false);
  const [movendoPorTodaMatriz, setMovendoPorTodaMatriz] = useState(false);
  const [movendo, setMovendo] = useState(false);
  const [recolhendoLixo, setRecolhendoLixo] = useState(false);

  const [lixeiraCimaEsquerdaS, setLixeiraCimaEsquerdaS] = useState<Lixeira>({
    coluna: LIXEIRAS_SECO[0].coluna,
    linha: LIXEIRAS_SECO[0].linha,
    quantidadeLixo: 0,
  });
  const [lixeiraCimaDireitaS, setLixeiraCimaDireitaS] = useState<Lixeira>({
    coluna: LIXEIRAS_SECO[1].coluna,
    linha: LIXEIRAS_SECO[1].linha,
    quantidadeLixo: 0,
  });
  const [lixeiraCentroEsquerdaS, setLixeiraCentroEsquerdaS] = useState<Lixeira>(
    {
      coluna: LIXEIRAS_SECO[2].coluna,
      linha: LIXEIRAS_SECO[2].linha,
      quantidadeLixo: 0,
    }
  );
  const [lixeiraCentroDireitaS, setLixeiraCentroDireitaS] = useState<Lixeira>({
    coluna: LIXEIRAS_SECO[3].coluna,
    linha: LIXEIRAS_SECO[3].linha,
    quantidadeLixo: 0,
  });

  const [lixeiraCimaEsquerdaO, setLixeiraCimaEsquerdaO] = useState<Lixeira>({
    coluna: LIXEIRAS_ORGANICO[0].coluna,
    linha: LIXEIRAS_ORGANICO[0].linha,
    quantidadeLixo: 0,
  });
  const [lixeiraCimaDireitaO, setLixeiraCimaDireitaO] = useState<Lixeira>({
    coluna: LIXEIRAS_ORGANICO[1].coluna,
    linha: LIXEIRAS_ORGANICO[1].linha,
    quantidadeLixo: 0,
  });
  const [lixeiraCentroEsquerdaO, setLixeiraCentroEsquerdaO] = useState<Lixeira>(
    {
      coluna: LIXEIRAS_SECO[2].coluna,
      linha: LIXEIRAS_SECO[2].linha,
      quantidadeLixo: 0,
    }
  );
  const [lixeiraCentroDireitaO, setLixeiraCentroDireitaO] = useState<Lixeira>({
    coluna: LIXEIRAS_SECO[3].coluna,
    linha: LIXEIRAS_SECO[3].linha,
    quantidadeLixo: 0,
  });

  const [lixeiraCimaEsquerdaE, setLixeiraCimaEsquerdaE] = useState<Lixeira>({
    coluna: LIXEIRAS_ELETRONICO[0].coluna,
    linha: LIXEIRAS_ELETRONICO[0].linha,
    quantidadeLixo: 0,
  });
  const [lixeiraCimaDireitaE, setLixeiraCimaDireitaE] = useState<Lixeira>({
    coluna: LIXEIRAS_ELETRONICO[1].coluna,
    linha: LIXEIRAS_ELETRONICO[1].linha,
    quantidadeLixo: 0,
  });
  const [lixeiraCentroEsquerdaE, setLixeiraCentroEsquerdaE] = useState<Lixeira>(
    {
      coluna: LIXEIRAS_ELETRONICO[2].coluna,
      linha: LIXEIRAS_ELETRONICO[2].linha,
      quantidadeLixo: 0,
    }
  );
  const [lixeiraCentroDireitaE, setLixeiraCentroDireitaE] = useState<Lixeira>({
    coluna: LIXEIRAS_ELETRONICO[3].coluna,
    linha: LIXEIRAS_ELETRONICO[3].linha,
    quantidadeLixo: 0,
  });

  const [proximaDirecao, setProximaDirecao] = useState<
    "direita" | "esquerda" | null
  >(null);

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

  const moverDireita = useCallback(() => {
    return new Promise<void>((resolve, reject) => {
      const { coluna, linha } = gari.posicao;
      if (coluna === 19) {
        reject("Não é possível se mover para direita");
        return;
      }

      let proximoItem = Itens.GARI;

      switch (matriz[linha][coluna + 1]) {
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
      setTimeout(resolve, TIMEOUT);
    });
  }, [gari.posicao, matriz]);

  const moverEsquerda = useCallback(() => {
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

      setGari((state) =>
        produce(state, (draft) => {
          draft.posicao.coluna -= 1;
        })
      );

      setTimeout(resolve, TIMEOUT);
    });
  }, [gari.posicao, matriz]);

  const moverCima = useCallback(() => {
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
      setTimeout(resolve, TIMEOUT);
    });
  }, [gari.posicao, matriz]);

  const moverBaixo = useCallback(() => {
    return new Promise<void>((resolve, reject) => {
      const { coluna, linha } = gari.posicao;
      if (linha === 19) {
        reject("Não é possível se mover para baixo");
        return;
      }

      let proximoItem = Itens.GARI;

      switch (matriz[linha + 1][coluna]) {
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
          draft[linha + 1][coluna] = proximoItem;

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
          draft.posicao.linha += 1;
        })
      );

      setTimeout(resolve, TIMEOUT);
    });
  }, [gari.posicao, matriz]);

  useEffect(() => {
    geraMatriz();
  }, []);

  const moveParaLixeiraSeco = useCallback(async () => {
    if (movendo) return;

    if (lixeiraCimaEsquerdaS.quantidadeLixo < QUANTIDADE_MAXIMA_LIXEIRA) {
      if (gari.posicao.coluna > lixeiraCimaEsquerdaS.coluna) {
        try {
          setMovendo(true);
          await moverEsquerda();
          setMovendo(false);
        } catch (error) {
          if (error === "Não é possível se mover para uma lixeira.") {
            setMovendo(true);

            await moverBaixo();
            setMovendo(false);
          }
        }
        return;
      }

      if (gari.posicao.coluna < lixeiraCimaEsquerdaS.coluna) {
        setMovendo(true);

        await moverDireita();
        setMovendo(false);

        return;
      }

      if (gari.posicao.linha - lixeiraCimaEsquerdaS.linha > 1) {
        try {
          setMovendo(true);
          await moverCima();
          setMovendo(false);
        } catch (erro) {}
        return;
      } else {
        if (
          gari.quantidadeLS <= QUANTIDADE_MAXIMA_LIXEIRA &&
          gari.quantidadeLS <=
            QUANTIDADE_MAXIMA_LIXEIRA - lixeiraCimaEsquerdaS.quantidadeLixo
        ) {
          setGari((state) =>
            produce(state, (draft) => {
              draft.quantidadeLS = 0;
            })
          );
          setLixeiraCimaEsquerdaS((state) =>
            produce(state, (draft) => {
              draft.quantidadeLixo += gari.quantidadeLS;
            })
          );
        }

        if (
          gari.quantidadeLS >
          QUANTIDADE_MAXIMA_LIXEIRA - lixeiraCimaEsquerdaS.quantidadeLixo
        ) {
          setGari((state) =>
            produce(state, (draft) => {
              draft.quantidadeLS =
                gari.quantidadeLS -
                (QUANTIDADE_MAXIMA_LIXEIRA -
                  lixeiraCimaEsquerdaS.quantidadeLixo);
            })
          );
          setLixeiraCimaEsquerdaS((state) =>
            produce(state, (draft) => {
              draft.quantidadeLixo = QUANTIDADE_MAXIMA_LIXEIRA;
            })
          );
        }
        setMovendoInicio(true);
        setMovendoLixeiraSeco(false);
      }
    } else if (lixeiraCimaDireitaS.quantidadeLixo < QUANTIDADE_MAXIMA_LIXEIRA) {
      if (gari.posicao.coluna > lixeiraCimaDireitaS.coluna) {
        try {
          setMovendo(true);

          await moverEsquerda();
          setMovendo(false);
        } catch (error) {
          if (error === "Não é possível se mover para uma lixeira.") {
            setMovendo(true);

            await moverBaixo();
            setMovendo(false);
          }
        }
        return;
      }

      if (gari.posicao.coluna < lixeiraCimaDireitaS.coluna) {
        try {
          setMovendo(true);

          await moverDireita();
          setMovendo(false);
        } catch (error) {
          if (error === "Não é possível se mover para uma lixeira.") {
            setMovendo(true);
            await moverBaixo();
            setMovendo(false);
          }
        }
        return;
      }

      if (gari.posicao.linha - lixeiraCimaDireitaS.linha > 1) {
        try {
          setMovendo(true);
          await moverCima();
          setMovendo(false);
        } catch (erro) {}
        return;
      } else {
        if (
          gari.quantidadeLS <= QUANTIDADE_MAXIMA_LIXEIRA &&
          gari.quantidadeLS <=
            QUANTIDADE_MAXIMA_LIXEIRA - lixeiraCimaDireitaS.quantidadeLixo
        ) {
          setGari((state) =>
            produce(state, (draft) => {
              draft.quantidadeLS = 0;
            })
          );
          setLixeiraCimaDireitaS((state) =>
            produce(state, (draft) => {
              draft.quantidadeLixo += gari.quantidadeLS;
            })
          );
        }

        if (
          gari.quantidadeLS >
          QUANTIDADE_MAXIMA_LIXEIRA - lixeiraCimaDireitaS.quantidadeLixo
        ) {
          setGari((state) =>
            produce(state, (draft) => {
              draft.quantidadeLS =
                gari.quantidadeLS -
                (QUANTIDADE_MAXIMA_LIXEIRA -
                  lixeiraCimaDireitaS.quantidadeLixo);
            })
          );
          setLixeiraCimaDireitaS((state) =>
            produce(state, (draft) => {
              draft.quantidadeLixo = QUANTIDADE_MAXIMA_LIXEIRA;
            })
          );
        }
        setMovendoInicio(true);
        setMovendoLixeiraSeco(false);
      }
    } else if (
      lixeiraCentroEsquerdaS.quantidadeLixo < QUANTIDADE_MAXIMA_LIXEIRA
    ) {
      if (gari.posicao.coluna > lixeiraCentroEsquerdaS.coluna) {
        try {
          setMovendo(true);

          await moverEsquerda();
          setMovendo(false);
        } catch (error) {
          if (error === "Não é possível se mover para uma lixeira.") {
            setMovendo(true);

            await moverBaixo();
            setMovendo(false);
          }
        }
        return;
      }

      if (gari.posicao.coluna < lixeiraCentroEsquerdaS.coluna) {
        try {
          setMovendo(true);

          await moverDireita();
          setMovendo(false);
        } catch (error) {
          if (error === "Não é possível se mover para uma lixeira.") {
            setMovendo(true);
            await moverBaixo();
            setMovendo(false);
          }
        }
        return;
      }

      if (gari.posicao.linha - lixeiraCentroEsquerdaS.linha > 1) {
        try {
          setMovendo(true);
          await moverCima();
          setMovendo(false);
        } catch (erro) {}
        return;
      } else {
        if (
          gari.quantidadeLS <= QUANTIDADE_MAXIMA_LIXEIRA &&
          gari.quantidadeLS <=
            QUANTIDADE_MAXIMA_LIXEIRA - lixeiraCentroEsquerdaS.quantidadeLixo
        ) {
          setGari((state) =>
            produce(state, (draft) => {
              draft.quantidadeLS = 0;
            })
          );
          setLixeiraCentroEsquerdaS((state) =>
            produce(state, (draft) => {
              draft.quantidadeLixo += gari.quantidadeLS;
            })
          );
        }

        if (
          gari.quantidadeLS >
          QUANTIDADE_MAXIMA_LIXEIRA - lixeiraCentroEsquerdaS.quantidadeLixo
        ) {
          setGari((state) =>
            produce(state, (draft) => {
              draft.quantidadeLS =
                gari.quantidadeLS -
                (QUANTIDADE_MAXIMA_LIXEIRA -
                  lixeiraCentroEsquerdaS.quantidadeLixo);
            })
          );
          setLixeiraCentroEsquerdaS((state) =>
            produce(state, (draft) => {
              draft.quantidadeLixo = QUANTIDADE_MAXIMA_LIXEIRA;
            })
          );
        }
        setMovendoInicio(true);
        setMovendoLixeiraSeco(false);
      }
    } else if (
      lixeiraCentroDireitaS.quantidadeLixo < QUANTIDADE_MAXIMA_LIXEIRA
    ) {
      if (gari.posicao.coluna > lixeiraCentroDireitaS.coluna) {
        try {
          setMovendo(true);

          await moverEsquerda();
          setMovendo(false);
        } catch (error) {
          if (error === "Não é possível se mover para uma lixeira.") {
            setMovendo(true);

            await moverBaixo();
            setMovendo(false);
          }
        }
        return;
      }

      if (gari.posicao.coluna < lixeiraCentroDireitaS.coluna) {
        try {
          setMovendo(true);

          await moverDireita();
          setMovendo(false);
        } catch (error) {
          if (error === "Não é possível se mover para uma lixeira.") {
            setMovendo(true);
            await moverBaixo();
            setMovendo(false);
          }
        }
        return;
      }

      if (gari.posicao.linha - lixeiraCentroDireitaS.linha > 1) {
        try {
          setMovendo(true);
          await moverCima();
          setMovendo(false);
        } catch (erro) {}
        return;
      } else {
        if (
          gari.quantidadeLS <= QUANTIDADE_MAXIMA_LIXEIRA &&
          gari.quantidadeLS <=
            QUANTIDADE_MAXIMA_LIXEIRA - lixeiraCentroDireitaS.quantidadeLixo
        ) {
          setGari((state) =>
            produce(state, (draft) => {
              draft.quantidadeLS = 0;
            })
          );
          setLixeiraCentroDireitaS((state) =>
            produce(state, (draft) => {
              draft.quantidadeLixo += gari.quantidadeLS;
            })
          );
        }

        if (
          gari.quantidadeLS >
          QUANTIDADE_MAXIMA_LIXEIRA - lixeiraCentroDireitaS.quantidadeLixo
        ) {
          setGari((state) =>
            produce(state, (draft) => {
              draft.quantidadeLS =
                gari.quantidadeLS -
                (QUANTIDADE_MAXIMA_LIXEIRA -
                  lixeiraCimaDireitaS.quantidadeLixo);
            })
          );
          setLixeiraCentroDireitaS((state) =>
            produce(state, (draft) => {
              draft.quantidadeLixo = QUANTIDADE_MAXIMA_LIXEIRA;
            })
          );
        }
        setMovendoInicio(true);
        setMovendoLixeiraSeco(false);
      }
    } else {
      setMovendoLixeiraSeco(false);
      setMovendoPorTodaMatriz(true);
    }
  }, [
    gari.posicao.coluna,
    gari.posicao.linha,
    gari.quantidadeLS,
    lixeiraCimaDireitaS,
    lixeiraCentroEsquerdaS.quantidadeLixo,
    lixeiraCentroEsquerdaS.coluna,
    lixeiraCentroEsquerdaS.linha,
    lixeiraCimaEsquerdaS,
    movendo,
    moverBaixo,
    moverCima,
    moverDireita,
    moverEsquerda,
    lixeiraCentroDireitaS,
  ]);

  const moveParaLixeiraEletronico = useCallback(async () => {
    if (movendo) return;

    if (lixeiraCimaEsquerdaE.quantidadeLixo < QUANTIDADE_MAXIMA_LIXEIRA) {
      if (gari.posicao.coluna > lixeiraCimaEsquerdaE.coluna) {
        try {
          setMovendo(true);
          await moverEsquerda();
          setMovendo(false);
        } catch (error) {
          if (error === "Não é possível se mover para uma lixeira.") {
            setMovendo(true);

            await moverBaixo();
            setMovendo(false);
          }
        }
        return;
      }

      if (gari.posicao.coluna < lixeiraCimaEsquerdaE.coluna) {
        setMovendo(true);

        await moverDireita();
        setMovendo(false);

        return;
      }

      if (gari.posicao.linha - lixeiraCimaEsquerdaE.linha > 1) {
        try {
          setMovendo(true);
          await moverCima();
          setMovendo(false);
        } catch (erro) {
          console.log(erro);
        }
        return;
      } else {
        if (
          gari.quantidadeLE <= QUANTIDADE_MAXIMA_LIXEIRA &&
          gari.quantidadeLE <=
            QUANTIDADE_MAXIMA_LIXEIRA - lixeiraCimaEsquerdaE.quantidadeLixo
        ) {
          setGari((state) =>
            produce(state, (draft) => {
              draft.quantidadeLE = 0;
            })
          );
          setLixeiraCimaEsquerdaE((state) =>
            produce(state, (draft) => {
              draft.quantidadeLixo += gari.quantidadeLE;
            })
          );
        }

        if (
          gari.quantidadeLE >
          QUANTIDADE_MAXIMA_LIXEIRA - lixeiraCimaEsquerdaE.quantidadeLixo
        ) {
          setGari((state) =>
            produce(state, (draft) => {
              draft.quantidadeLE =
                gari.quantidadeLE -
                (QUANTIDADE_MAXIMA_LIXEIRA -
                  lixeiraCimaEsquerdaE.quantidadeLixo);
            })
          );
          setLixeiraCimaEsquerdaE((state) =>
            produce(state, (draft) => {
              draft.quantidadeLixo = QUANTIDADE_MAXIMA_LIXEIRA;
            })
          );
        }
        setMovendoInicio(true);
        setMovendoLixeiraEletronico(false);
      }
    } else if (lixeiraCimaDireitaE.quantidadeLixo < QUANTIDADE_MAXIMA_LIXEIRA) {
      if (gari.posicao.coluna > lixeiraCimaDireitaE.coluna) {
        try {
          setMovendo(true);

          await moverEsquerda();
          setMovendo(false);
        } catch (error) {
          if (error === "Não é possível se mover para uma lixeira.") {
            setMovendo(true);

            await moverBaixo();
            setMovendo(false);
          }
        }
        return;
      }

      if (gari.posicao.coluna < lixeiraCimaDireitaE.coluna) {
        try {
          setMovendo(true);

          await moverDireita();
          setMovendo(false);
        } catch (error) {
          if (error === "Não é possível se mover para uma lixeira.") {
            setMovendo(true);
            await moverBaixo();
            setMovendo(false);
          }
        }
        return;
      }

      if (gari.posicao.linha - lixeiraCimaDireitaE.linha > 1) {
        try {
          setMovendo(true);
          await moverCima();
          setMovendo(false);
        } catch (erro) {
          console.log(erro);
        }
        return;
      } else {
        if (
          gari.quantidadeLE <= QUANTIDADE_MAXIMA_LIXEIRA &&
          gari.quantidadeLE <=
            QUANTIDADE_MAXIMA_LIXEIRA - lixeiraCimaDireitaE.quantidadeLixo
        ) {
          setGari((state) =>
            produce(state, (draft) => {
              draft.quantidadeLE = 0;
            })
          );
          setLixeiraCimaDireitaE((state) =>
            produce(state, (draft) => {
              draft.quantidadeLixo += gari.quantidadeLE;
            })
          );
        }

        if (
          gari.quantidadeLE >
          QUANTIDADE_MAXIMA_LIXEIRA - lixeiraCimaDireitaE.quantidadeLixo
        ) {
          setGari((state) =>
            produce(state, (draft) => {
              draft.quantidadeLE =
                gari.quantidadeLE -
                (QUANTIDADE_MAXIMA_LIXEIRA -
                  lixeiraCimaDireitaE.quantidadeLixo);
            })
          );
          setLixeiraCimaDireitaE((state) =>
            produce(state, (draft) => {
              draft.quantidadeLixo = QUANTIDADE_MAXIMA_LIXEIRA;
            })
          );
        }
        setMovendoInicio(true);
        setMovendoLixeiraEletronico(false);
      }
    } else if (
      lixeiraCentroEsquerdaE.quantidadeLixo < QUANTIDADE_MAXIMA_LIXEIRA
    ) {
      if (gari.posicao.coluna > lixeiraCentroEsquerdaE.coluna) {
        try {
          setMovendo(true);

          await moverEsquerda();
          setMovendo(false);
        } catch (error) {
          if (error === "Não é possível se mover para uma lixeira.") {
            setMovendo(true);

            await moverBaixo();
            setMovendo(false);
          }
        }
        return;
      }

      if (gari.posicao.coluna < lixeiraCentroEsquerdaE.coluna) {
        try {
          setMovendo(true);

          await moverDireita();
          setMovendo(false);
        } catch (error) {
          if (error === "Não é possível se mover para uma lixeira.") {
            setMovendo(true);
            await moverBaixo();
            setMovendo(false);
          }
        }
        return;
      }

      if (gari.posicao.linha - lixeiraCentroEsquerdaE.linha > 1) {
        try {
          setMovendo(true);
          await moverCima();
          setMovendo(false);
        } catch (erro) {
          console.log(erro);
        }
        return;
      } else {
        if (
          gari.quantidadeLE <= QUANTIDADE_MAXIMA_LIXEIRA &&
          gari.quantidadeLE <=
            QUANTIDADE_MAXIMA_LIXEIRA - lixeiraCentroEsquerdaE.quantidadeLixo
        ) {
          setGari((state) =>
            produce(state, (draft) => {
              draft.quantidadeLE = 0;
            })
          );
          setLixeiraCentroEsquerdaE((state) =>
            produce(state, (draft) => {
              draft.quantidadeLixo += gari.quantidadeLE;
            })
          );
        }

        if (
          gari.quantidadeLE >
          QUANTIDADE_MAXIMA_LIXEIRA - lixeiraCentroEsquerdaE.quantidadeLixo
        ) {
          setGari((state) =>
            produce(state, (draft) => {
              draft.quantidadeLE =
                gari.quantidadeLE -
                (QUANTIDADE_MAXIMA_LIXEIRA -
                  lixeiraCentroEsquerdaE.quantidadeLixo);
            })
          );
          setLixeiraCentroEsquerdaE((state) =>
            produce(state, (draft) => {
              draft.quantidadeLixo = QUANTIDADE_MAXIMA_LIXEIRA;
            })
          );
        }
        setMovendoInicio(true);
        setMovendoLixeiraEletronico(false);
      }
    } else if (
      lixeiraCentroDireitaE.quantidadeLixo < QUANTIDADE_MAXIMA_LIXEIRA
    ) {
      if (gari.posicao.coluna > lixeiraCentroDireitaE.coluna) {
        try {
          setMovendo(true);

          await moverEsquerda();
          setMovendo(false);
        } catch (error) {
          if (error === "Não é possível se mover para uma lixeira.") {
            setMovendo(true);

            await moverBaixo();
            setMovendo(false);
          }
        }
        return;
      }

      if (gari.posicao.coluna < lixeiraCentroDireitaE.coluna) {
        try {
          setMovendo(true);

          await moverDireita();
          setMovendo(false);
        } catch (error) {
          if (error === "Não é possível se mover para uma lixeira.") {
            setMovendo(true);
            await moverBaixo();
            setMovendo(false);
          }
        }
        return;
      }

      if (gari.posicao.linha - lixeiraCentroDireitaE.linha > 1) {
        try {
          setMovendo(true);
          await moverCima();
          setMovendo(false);
        } catch (erro) {
          console.log(erro);
        }
        return;
      } else {
        if (
          gari.quantidadeLE <= QUANTIDADE_MAXIMA_LIXEIRA &&
          gari.quantidadeLE <=
            QUANTIDADE_MAXIMA_LIXEIRA - lixeiraCentroDireitaE.quantidadeLixo
        ) {
          setGari((state) =>
            produce(state, (draft) => {
              draft.quantidadeLE = 0;
            })
          );
          setLixeiraCentroDireitaE((state) =>
            produce(state, (draft) => {
              draft.quantidadeLixo += gari.quantidadeLE;
            })
          );
        }

        if (
          gari.quantidadeLE >
          QUANTIDADE_MAXIMA_LIXEIRA - lixeiraCentroDireitaE.quantidadeLixo
        ) {
          setGari((state) =>
            produce(state, (draft) => {
              draft.quantidadeLE =
                gari.quantidadeLE -
                (QUANTIDADE_MAXIMA_LIXEIRA -
                  lixeiraCimaDireitaE.quantidadeLixo);
            })
          );
          setLixeiraCentroDireitaE((state) =>
            produce(state, (draft) => {
              draft.quantidadeLixo = QUANTIDADE_MAXIMA_LIXEIRA;
            })
          );
        }
        setMovendoInicio(true);
        setMovendoLixeiraEletronico(false);
      }
    } else {
      setMovendoPorTodaMatriz(true);
      setMovendoLixeiraEletronico(false);
    }
  }, [
    gari.posicao,
    gari.quantidadeLE,
    lixeiraCimaDireitaE,
    lixeiraCimaEsquerdaE,
    movendo,
    moverBaixo,
    moverCima,
    moverDireita,
    moverEsquerda,
    lixeiraCentroEsquerdaE.quantidadeLixo,
    lixeiraCentroEsquerdaE.coluna,
    lixeiraCentroEsquerdaE.linha,
    lixeiraCentroDireitaE,
  ]);

  useEffect(() => {
    if (movendoLixeiraOrganica) return;
    if (movendoLixeiraSeco) return;
    if (movendoLixeiraEletronico) return;

    if (gari.quantidadeLE === QUANTIDADE_MAXIMA_LIXO) {
      setMovendoInicio(false);
      setMovendoPorTodaMatriz(false);
      setMovendoLixeiraEletronico(true);
      setMovendoLixeiraOrganica(false);
      setMovendoLixeiraSeco(false);
    }
  }, [
    gari.quantidadeLE,
    movendoLixeiraOrganica,
    movendoLixeiraSeco,
    movendoLixeiraEletronico,
  ]);

  useEffect(() => {
    if (!movendoLixeiraEletronico) return;
    if (movendoLixeiraOrganica) return;
    if (movendoLixeiraSeco) return;

    moveParaLixeiraEletronico();
  }, [
    moveParaLixeiraEletronico,
    movendoLixeiraEletronico,
    movendoLixeiraOrganica,
    movendoLixeiraSeco,
  ]);

  useEffect(() => {
    if (!movendoLixeiraSeco) return;
    if (movendoLixeiraOrganica) return;
    if (movendoLixeiraEletronico) return;

    moveParaLixeiraSeco();
  }, [
    moveParaLixeiraSeco,
    movendoLixeiraEletronico,
    movendoLixeiraOrganica,
    movendoLixeiraSeco,
  ]);

  const moveParaLixeiraOrganica = useCallback(async () => {
    if (movendo) return;

    if (lixeiraCimaEsquerdaO.quantidadeLixo < QUANTIDADE_MAXIMA_LIXEIRA) {
      if (gari.posicao.coluna > lixeiraCimaEsquerdaO.coluna) {
        try {
          setMovendo(true);
          await moverEsquerda();
          setMovendo(false);
        } catch (error) {
          if (error === "Não é possível se mover para uma lixeira.") {
            setMovendo(true);

            await moverBaixo();
            setMovendo(false);
          }
        }
        return;
      }

      if (gari.posicao.coluna < lixeiraCimaEsquerdaO.coluna) {
        setMovendo(true);

        await moverDireita();
        setMovendo(false);

        return;
      }

      if (gari.posicao.linha - lixeiraCimaEsquerdaO.linha > 1) {
        try {
          setMovendo(true);
          await moverCima();
          setMovendo(false);
        } catch (erro) {
          console.log(erro);
        }
        return;
      } else {
        if (
          gari.quantidadeLO <= QUANTIDADE_MAXIMA_LIXEIRA &&
          gari.quantidadeLO <=
            QUANTIDADE_MAXIMA_LIXEIRA - lixeiraCimaEsquerdaO.quantidadeLixo
        ) {
          setGari((state) =>
            produce(state, (draft) => {
              draft.quantidadeLO = 0;
            })
          );
          setLixeiraCimaEsquerdaO((state) =>
            produce(state, (draft) => {
              draft.quantidadeLixo += gari.quantidadeLO;
            })
          );
        }

        if (
          gari.quantidadeLO >
          QUANTIDADE_MAXIMA_LIXEIRA - lixeiraCimaEsquerdaO.quantidadeLixo
        ) {
          setGari((state) =>
            produce(state, (draft) => {
              draft.quantidadeLO =
                gari.quantidadeLO -
                (QUANTIDADE_MAXIMA_LIXEIRA -
                  lixeiraCimaEsquerdaO.quantidadeLixo);
            })
          );
          setLixeiraCimaEsquerdaO((state) =>
            produce(state, (draft) => {
              draft.quantidadeLixo = QUANTIDADE_MAXIMA_LIXEIRA;
            })
          );
        }
        setMovendoInicio(true);
        setMovendoLixeiraOrganica(false);
      }
    } else if (lixeiraCimaDireitaO.quantidadeLixo < QUANTIDADE_MAXIMA_LIXEIRA) {
      if (gari.posicao.coluna > lixeiraCimaDireitaO.coluna) {
        try {
          setMovendo(true);

          await moverEsquerda();
          setMovendo(false);
        } catch (error) {
          if (error === "Não é possível se mover para uma lixeira.") {
            setMovendo(true);

            await moverBaixo();
            setMovendo(false);
          }
        }
        return;
      }

      if (gari.posicao.coluna < lixeiraCimaDireitaO.coluna) {
        try {
          setMovendo(true);

          await moverDireita();
          setMovendo(false);
        } catch (error) {
          if (error === "Não é possível se mover para uma lixeira.") {
            setMovendo(true);
            await moverBaixo();
            setMovendo(false);
          }
        }
        return;
      }

      if (gari.posicao.linha - lixeiraCimaDireitaO.linha > 1) {
        try {
          setMovendo(true);
          await moverCima();
          setMovendo(false);
        } catch (erro) {
          console.log(erro);
        }
        return;
      } else {
        if (
          gari.quantidadeLO <= QUANTIDADE_MAXIMA_LIXEIRA &&
          gari.quantidadeLO <=
            QUANTIDADE_MAXIMA_LIXEIRA - lixeiraCimaDireitaO.quantidadeLixo
        ) {
          setGari((state) =>
            produce(state, (draft) => {
              draft.quantidadeLO = 0;
            })
          );
          setLixeiraCimaDireitaO((state) =>
            produce(state, (draft) => {
              draft.quantidadeLixo += gari.quantidadeLO;
            })
          );
        }

        if (
          gari.quantidadeLO >
          QUANTIDADE_MAXIMA_LIXEIRA - lixeiraCimaDireitaO.quantidadeLixo
        ) {
          setGari((state) =>
            produce(state, (draft) => {
              draft.quantidadeLO =
                gari.quantidadeLO -
                (QUANTIDADE_MAXIMA_LIXEIRA -
                  lixeiraCimaDireitaO.quantidadeLixo);
            })
          );
          setLixeiraCimaDireitaO((state) =>
            produce(state, (draft) => {
              draft.quantidadeLixo = QUANTIDADE_MAXIMA_LIXEIRA;
            })
          );
        }
        setMovendoInicio(true);
        setMovendoLixeiraOrganica(false);
      }
    } else if (
      lixeiraCentroEsquerdaO.quantidadeLixo < QUANTIDADE_MAXIMA_LIXEIRA
    ) {
      if (gari.posicao.coluna > lixeiraCentroEsquerdaO.coluna) {
        try {
          setMovendo(true);

          await moverEsquerda();
          setMovendo(false);
        } catch (error) {
          if (error === "Não é possível se mover para uma lixeira.") {
            setMovendo(true);

            await moverBaixo();
            setMovendo(false);
          }
        }
        return;
      }

      if (gari.posicao.coluna < lixeiraCentroEsquerdaO.coluna) {
        try {
          setMovendo(true);

          await moverDireita();
          setMovendo(false);
        } catch (error) {
          if (error === "Não é possível se mover para uma lixeira.") {
            setMovendo(true);
            await moverBaixo();
            setMovendo(false);
          }
        }
        return;
      }

      if (gari.posicao.linha - lixeiraCentroEsquerdaO.linha > 1) {
        try {
          setMovendo(true);
          await moverCima();
          setMovendo(false);
        } catch (erro) {
          console.log("QUE");
        }
        return;
      } else {
        if (
          gari.quantidadeLO <= QUANTIDADE_MAXIMA_LIXEIRA &&
          gari.quantidadeLO <=
            QUANTIDADE_MAXIMA_LIXEIRA - lixeiraCentroEsquerdaO.quantidadeLixo
        ) {
          setGari((state) =>
            produce(state, (draft) => {
              draft.quantidadeLO = 0;
            })
          );
          setLixeiraCentroEsquerdaO((state) =>
            produce(state, (draft) => {
              draft.quantidadeLixo += gari.quantidadeLO;
            })
          );
        }

        if (
          gari.quantidadeLO >
          QUANTIDADE_MAXIMA_LIXEIRA - lixeiraCentroEsquerdaO.quantidadeLixo
        ) {
          setGari((state) =>
            produce(state, (draft) => {
              draft.quantidadeLO =
                gari.quantidadeLO -
                (QUANTIDADE_MAXIMA_LIXEIRA -
                  lixeiraCentroEsquerdaO.quantidadeLixo);
            })
          );
          setLixeiraCentroEsquerdaO((state) =>
            produce(state, (draft) => {
              draft.quantidadeLixo = QUANTIDADE_MAXIMA_LIXEIRA;
            })
          );
        }
        setMovendoInicio(true);
        setMovendoLixeiraOrganica(false);
      }
    } else if (
      lixeiraCentroDireitaO.quantidadeLixo < QUANTIDADE_MAXIMA_LIXEIRA
    ) {
      if (gari.posicao.coluna > lixeiraCentroDireitaO.coluna) {
        try {
          setMovendo(true);

          await moverEsquerda();
          setMovendo(false);
        } catch (error) {
          if (error === "Não é possível se mover para uma lixeira.") {
            setMovendo(true);

            await moverBaixo();
            setMovendo(false);
          }
        }
        return;
      }

      if (gari.posicao.coluna < lixeiraCentroDireitaO.coluna) {
        try {
          setMovendo(true);

          await moverDireita();
          setMovendo(false);
        } catch (error) {
          if (error === "Não é possível se mover para uma lixeira.") {
            setMovendo(true);
            await moverBaixo();
            setMovendo(false);
          }
        }
        return;
      }

      if (gari.posicao.linha - lixeiraCentroDireitaO.linha > 1) {
        try {
          setMovendo(true);
          await moverCima();
          setMovendo(false);
        } catch (erro) {
          console.log(erro);
        }
        return;
      } else {
        if (
          gari.quantidadeLO <= QUANTIDADE_MAXIMA_LIXEIRA &&
          gari.quantidadeLO <=
            QUANTIDADE_MAXIMA_LIXEIRA - lixeiraCentroDireitaO.quantidadeLixo
        ) {
          setGari((state) =>
            produce(state, (draft) => {
              draft.quantidadeLO = 0;
            })
          );
          setLixeiraCentroDireitaO((state) =>
            produce(state, (draft) => {
              draft.quantidadeLixo += gari.quantidadeLO;
            })
          );
        }

        if (
          gari.quantidadeLO >
          QUANTIDADE_MAXIMA_LIXEIRA - lixeiraCentroDireitaO.quantidadeLixo
        ) {
          setGari((state) =>
            produce(state, (draft) => {
              draft.quantidadeLO =
                gari.quantidadeLO -
                (QUANTIDADE_MAXIMA_LIXEIRA -
                  lixeiraCentroDireitaO.quantidadeLixo);
            })
          );
          setLixeiraCentroDireitaO((state) =>
            produce(state, (draft) => {
              draft.quantidadeLixo = QUANTIDADE_MAXIMA_LIXEIRA;
            })
          );
        }
        setMovendoInicio(true);
        setMovendoLixeiraOrganica(false);
      }
    } else {
      setMovendoPorTodaMatriz(true);
      setMovendoLixeiraOrganica(false);
    }
  }, [
    gari.posicao,
    gari.quantidadeLO,
    lixeiraCimaDireitaO,
    lixeiraCimaEsquerdaO,
    movendo,
    moverBaixo,
    moverCima,
    moverDireita,
    moverEsquerda,
    lixeiraCentroEsquerdaO,
    lixeiraCentroDireitaO,
  ]);

  useEffect(() => {
    if (movendoLixeiraEletronico) return;
    if (movendoLixeiraOrganica) return;
    if (movendoLixeiraSeco) return;

    if (gari.quantidadeLO === QUANTIDADE_MAXIMA_LIXO) {
      setMovendoInicio(false);
      setMovendoPorTodaMatriz(false);
      setMovendoLixeiraOrganica(true);
      setMovendoLixeiraEletronico(false);
      setMovendoLixeiraSeco(false);
    }
  }, [
    gari.quantidadeLO,
    movendoLixeiraEletronico,
    movendoLixeiraOrganica,
    movendoLixeiraSeco,
  ]);

  useEffect(() => {
    if (!movendoLixeiraOrganica) return;
    if (movendoLixeiraEletronico) return;
    if (movendoLixeiraSeco) return;

    moveParaLixeiraOrganica();
  }, [
    moveParaLixeiraOrganica,
    movendoLixeiraEletronico,
    movendoLixeiraOrganica,
    movendoLixeiraSeco,
  ]);

  useEffect(() => {
    if (movendoLixeiraEletronico) return;
    if (movendoLixeiraOrganica) return;
    if (movendoLixeiraSeco) return;

    if (gari.quantidadeLS === QUANTIDADE_MAXIMA_LIXO) {
      setMovendoInicio(false);
      setMovendoPorTodaMatriz(false);
      setMovendoLixeiraSeco(true);
      setMovendoLixeiraEletronico(false);
      setMovendoLixeiraOrganica(false);
    }
  }, [
    gari.quantidadeLS,
    movendoLixeiraEletronico,
    movendoLixeiraOrganica,
    movendoLixeiraSeco,
  ]);

  const verificarEColetarLixo = useCallback(() => {
    if (
      matriz[gari.posicao.linha][gari.posicao.coluna] ===
        Itens.AGENTE_LIXO_ELETRONICO &&
      gari.quantidadeLE < QUANTIDADE_MAXIMA_LIXO
    ) {
      setRecolhendoLixo(true);

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
      setRecolhendoLixo(false);
    }

    if (
      matriz[gari.posicao.linha][gari.posicao.coluna] ===
        Itens.AGENTE_LIXO_ORGANICO &&
      gari.quantidadeLO < QUANTIDADE_MAXIMA_LIXO
    ) {
      setRecolhendoLixo(true);
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
      setRecolhendoLixo(false);
    }

    if (
      matriz[gari.posicao.linha][gari.posicao.coluna] ===
        Itens.AGENTE_LIXO_SECO &&
      gari.quantidadeLS < QUANTIDADE_MAXIMA_LIXO
    ) {
      setRecolhendoLixo(true);
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
      setRecolhendoLixo(false);
    }
  }, [
    gari.posicao.coluna,
    gari.posicao.linha,
    gari.quantidadeLE,
    gari.quantidadeLO,
    gari.quantidadeLS,
    matriz,
  ]);

  useEffect(() => {
    if (!gerar) return;

    verificarEColetarLixo();
  }, [gerar, verificarEColetarLixo]);

  const moverGariParaOInicio = useCallback(async () => {
    if (movendo) return false;

    if (gari.posicao.coluna > 3) {
      setMovendo(true);
      await moverEsquerda();
      setMovendo(false);
      return false;
    }

    if (gari.posicao.coluna < 3) {
      setMovendo(true);
      await moverDireita();
      setMovendo(false);
      return false;
    }

    if (gari.posicao.linha > 0) {
      setMovendo(true);
      await moverCima();
      setMovendo(false);
      return false;
    }

    return true;
    // if (gari.posicao.coluna === 3 && gari.posicao.linha === 1) {
    //   return true;
    // }

    // return true;
  }, [
    gari.posicao.coluna,
    gari.posicao.linha,
    moverCima,
    moverDireita,
    moverEsquerda,
    movendo,
  ]);

  useEffect(() => {
    if (!gerar) return;

    if (movendoLixeiraOrganica) return;
    if (movendoLixeiraSeco) return;
    if (movendoLixeiraEletronico) return;

    if (movendoPorTodaMatriz) return;

    moverGariParaOInicio().then((retorno) => {
      if (retorno) {
        setMovendoInicio(false);
        setMovendoPorTodaMatriz(true);
      }
    });
  }, [
    gerar,
    movendoLixeiraEletronico,
    movendoLixeiraOrganica,
    movendoLixeiraSeco,
    movendoPorTodaMatriz,
    moverGariParaOInicio,
  ]);

  const moverPorTodaAMatriz = useCallback(async () => {
    if (movendo) return;

    if (gari.posicao.coluna === 0 && gari.posicao.linha === 19) {
      setMovendoPorTodaMatriz(false);
      setMovendoInicio(false);
      setMovendoLixeiraEletronico(false);
      setMovendoLixeiraOrganica(false);
      setMovendoLixeiraSeco(false);
      return true;
    }

    if (proximaDirecao === "direita") {
      setMovendo(true);
      await moverDireita();
      setMovendo(false);
      setProximaDirecao(null);
      return;
    }

    if (proximaDirecao === "esquerda") {
      setMovendo(true);
      try {
        await moverEsquerda();
      } catch (error) {
        console.log("FOI AQUI", error);
      }
      setMovendo(false);
      setProximaDirecao(null);
      return;
    }

    if (gari.posicao.coluna === 0) {
      setMovendo(true);
      await moverBaixo();
      setProximaDirecao("direita");
      setMovendo(false);
      return;
    }

    if (gari.posicao.coluna === 19) {
      setMovendo(true);
      await moverBaixo();
      setProximaDirecao("esquerda");
      setMovendo(false);
      return;
    }

    if (gari.posicao.linha % 2 === 2) {
      setMovendo(true);
      try {
        await moverEsquerda();
      } catch (error) {
        if (error === "Não é possível se mover para uma lixeira.") {
          await moverBaixo();
        }
      }
      setMovendo(false);
      return;
    }

    if (gari.posicao.linha % 2 === 0) {
      setMovendo(true);
      try {
        await moverDireita();
      } catch (error) {
        if (error === "Não é possível se mover para uma lixeira.") {
          await moverBaixo();
        }
      }
      setMovendo(false);
      return;
    }

    if (gari.posicao.linha < 19) {
      setMovendo(true);
      try {
        await moverEsquerda();
      } catch {
        await moverDireita();
      }
      setMovendo(false);
      return;
    }
  }, [
    gari.posicao.coluna,
    gari.posicao.linha,
    movendo,
    moverBaixo,
    moverDireita,
    moverEsquerda,
    proximaDirecao,
  ]);

  useEffect(() => {
    if (!gerar) return;

    if (movendoLixeiraOrganica) return;
    if (movendoLixeiraSeco) return;
    if (movendoLixeiraEletronico) return;

    if (recolhendoLixo) return;

    if (movendoInicio) return;

    moverPorTodaAMatriz().then((retorno) => {
      if (retorno) {
        setMovendoPorTodaMatriz(false);
      }
    });
  }, [
    gerar,
    movendoInicio,
    movendoLixeiraEletronico,
    movendoLixeiraOrganica,
    moverPorTodaAMatriz,
    recolhendoLixo,
    movendoLixeiraSeco,
  ]);

  return (
    <div className="App">
      <header className="App-header">
        <div>
          {movendoInicio && "Movendo para o inicio"}

          {movendoPorTodaMatriz && "Movendo por toda a matriz"}

          {movendoLixeiraEletronico && "Movendo para lixeira eletronica"}

          {movendoLixeiraOrganica && "Movendo para lixeira orgânica"}

          {movendoLixeiraSeco && "Movendo lixeira seca"}

          {recolhendoLixo && "Recolhendo lixo"}
        </div>

        <div style={{ position: "absolute", top: 10, right: 10 }}>
          <div>Quantidade</div>
          <div
            style={{
              color:
                gari.quantidadeLO === QUANTIDADE_MAXIMA_LIXO ? "red" : "green",
            }}
          >
            Lixo organico {gari.quantidadeLO}
          </div>
          <div
            style={{
              color:
                gari.quantidadeLS === QUANTIDADE_MAXIMA_LIXO ? "red" : "green",
            }}
          >
            Lixo seco {gari.quantidadeLS}
          </div>
          <div
            style={{
              color:
                gari.quantidadeLE === QUANTIDADE_MAXIMA_LIXO ? "red" : "green",
            }}
          >
            Lixo eletronico {gari.quantidadeLE}
          </div>
        </div>

        <div style={{ position: "absolute", top: 10, left: 10 }}>
          <div>Lixeiras 1</div>
          <div
            style={{
              color:
                lixeiraCimaEsquerdaO.quantidadeLixo ===
                QUANTIDADE_MAXIMA_LIXEIRA
                  ? "red"
                  : "green",
            }}
          >
            Orgânica {lixeiraCimaEsquerdaO.quantidadeLixo}
          </div>
          <div
            style={{
              color:
                lixeiraCimaEsquerdaS.quantidadeLixo ===
                QUANTIDADE_MAXIMA_LIXEIRA
                  ? "red"
                  : "green",
            }}
          >
            Seca {lixeiraCimaEsquerdaS.quantidadeLixo}
          </div>
          <div
            style={{
              color:
                lixeiraCimaEsquerdaE.quantidadeLixo ===
                QUANTIDADE_MAXIMA_LIXEIRA
                  ? "red"
                  : "green",
            }}
          >
            Eletrônico {lixeiraCimaEsquerdaE.quantidadeLixo}
          </div>

          <br />

          <div>Lixeiras 2</div>
          <div
            style={{
              color:
                lixeiraCimaDireitaO.quantidadeLixo === QUANTIDADE_MAXIMA_LIXEIRA
                  ? "red"
                  : "green",
            }}
          >
            Orgânica {lixeiraCimaDireitaO.quantidadeLixo}
          </div>
          <div
            style={{
              color:
                lixeiraCimaDireitaS.quantidadeLixo === QUANTIDADE_MAXIMA_LIXEIRA
                  ? "red"
                  : "green",
            }}
          >
            Seca {lixeiraCimaDireitaS.quantidadeLixo}
          </div>
          <div
            style={{
              color:
                lixeiraCimaDireitaE.quantidadeLixo === QUANTIDADE_MAXIMA_LIXEIRA
                  ? "red"
                  : "green",
            }}
          >
            Eletrônico {lixeiraCimaDireitaE.quantidadeLixo}
          </div>

          <br />

          <div>Lixeiras 3</div>
          <div
            style={{
              color:
                lixeiraCentroEsquerdaO.quantidadeLixo ===
                QUANTIDADE_MAXIMA_LIXEIRA
                  ? "red"
                  : "green",
            }}
          >
            Orgânica {lixeiraCentroEsquerdaO.quantidadeLixo}
          </div>
          <div
            style={{
              color:
                lixeiraCentroEsquerdaS.quantidadeLixo ===
                QUANTIDADE_MAXIMA_LIXEIRA
                  ? "red"
                  : "green",
            }}
          >
            Seca {lixeiraCentroEsquerdaS.quantidadeLixo}
          </div>
          <div
            style={{
              color:
                lixeiraCentroEsquerdaE.quantidadeLixo ===
                QUANTIDADE_MAXIMA_LIXEIRA
                  ? "red"
                  : "green",
            }}
          >
            Eletrônico {lixeiraCentroEsquerdaE.quantidadeLixo}
          </div>

          <br />

          <div>Lixeiras 4</div>
          <div
            style={{
              color:
                lixeiraCentroDireitaO.quantidadeLixo ===
                QUANTIDADE_MAXIMA_LIXEIRA
                  ? "red"
                  : "green",
            }}
          >
            Orgânica {lixeiraCentroDireitaO.quantidadeLixo}
          </div>
          <div
            style={{
              color:
                lixeiraCentroDireitaS.quantidadeLixo ===
                QUANTIDADE_MAXIMA_LIXEIRA
                  ? "red"
                  : "green",
            }}
          >
            Seca {lixeiraCentroDireitaS.quantidadeLixo}
          </div>
          <div
            style={{
              color:
                lixeiraCentroDireitaE.quantidadeLixo ===
                QUANTIDADE_MAXIMA_LIXEIRA
                  ? "red"
                  : "green",
            }}
          >
            Eletrônico {lixeiraCentroDireitaE.quantidadeLixo}
          </div>
        </div>
        {gerar &&
          matriz.map((linha, index1) => {
            return (
              <div
                key={index1}
                style={{ display: "flex", flex: 20, maxHeight: "42px" }}
              >
                {linha.map((coluna, index2) => {
                  return (
                    <div
                      key={index2}
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
