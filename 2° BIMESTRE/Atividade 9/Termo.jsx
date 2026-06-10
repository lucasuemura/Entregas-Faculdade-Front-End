import { useState, useEffect, useReducer } from "react";

/* =========================================================
   LISTA DE PALAVRAS
   ========================================================= */
const WORDS = [
  "PRATO","CARRO","FUNDO","BANCO","LIVRO","PASTA","VERDE","PRETO",
  "BRAVO","CAMPO","DENTE","FILHO","GENTE","JOGAR","LARGO","MAIOR",
  "NUNCA","OUTRA","PAPEL","QUEDA","REINO","TARDE","VENTO","CABRA",
  "DADOS","FALAR","GARFO","HASTE","LINDO","MUNDO","NOBRE","OLHOS",
  "PRAIA","QUASE","RISCO","SABOR","ZEBRA","ABRIR","BEBER","CORTE",
  "DEUSA","ENTRE","FORTE","GRADE","HONRA","JUROS","LASCA","MATAR",
  "NOITE","OESTE","PLANO","QUILO","RUIVO","SURDO","USUAL","VOLTA",
  "CHUVA","GRIPE","HOTEL","IDEAL","JANTA","LENTE","MACIO","NERVO",
  "OBTER","PULAR","QUERO","ROMBO","SALVO","VIDRO","XISTO","BURRO",
  "DOIDO","ETAPA","FLUIR","GUIAR","HIENA","IRADO","LUTAR","MOLHO",
  "OCASO","PEDRA","RAIVA","SOPRO","TURMA","CERTO","BARCO","FOLHA",
  "MUITO","PERTO","CARGO","NOSSA","MESMO","AINDA","CORPO","MINHA",
  "LIMPO","CALMO","FOCAR","BATER","GANHO","PERDA","TOCAR","CRIAR",
  "FILME","GRUPO","ROUPA","TEMPO","TROCO","COISA","LUGAR","FORÇA",
  "PODER","NOMAD","BOATE","PIANO","CUSTO","DIZER","LIDAR","CHEFE",
];

/* =========================================================
   TECLADO VIRTUAL
   ========================================================= */
const TECLADO = [
  ["Q","W","E","R","T","Y","U","I","O","P"],
  ["A","S","D","F","G","H","J","K","L"],
  ["ENTER","Z","X","C","V","B","N","M","⌫"],
];

/* =========================================================
   MENSAGENS DE VITÓRIA
   ========================================================= */
const MSGS_VITORIA = [
  "Gênio absoluto! 🤩",
  "Incrível! 🌟",
  "Muito bem! 💪",
  "Ótimo! 👏",
  "Bom trabalho! 😊",
  "Ufa, que sufoco! 😅",
];

/* =========================================================
   CORES
   ========================================================= */
const COR_TILE = { correct: "#4caf79", present: "#d4ac0d", absent: "#3a3a3c" };
const COR_KEY  = { correct: "#4caf79", present: "#d4ac0d", absent: "#3a3a3c", _: "#5a5a5c" };

/* =========================================================
   LÓGICA: verificar palpite
   ========================================================= */
function verificarPalpite(palpite, alvo) {
  const resultado = Array(5).fill("absent");
  const disponivel = {};

  // 1ª passagem: posições corretas
  for (let i = 0; i < 5; i++) {
    if (palpite[i] === alvo[i]) {
      resultado[i] = "correct";
    } else {
      disponivel[alvo[i]] = (disponivel[alvo[i]] || 0) + 1;
    }
  }

  // 2ª passagem: letras presentes (mas na posição errada)
  for (let i = 0; i < 5; i++) {
    if (resultado[i] !== "correct" && disponivel[palpite[i]] > 0) {
      resultado[i] = "present";
      disponivel[palpite[i]]--;
    }
  }

  return resultado;
}

/* =========================================================
   ESTADO INICIAL
   ========================================================= */
function criarEstado() {
  return {
    alvo     : WORDS[Math.floor(Math.random() * WORDS.length)],
    tabuleiro: Array(6).fill(0).map(() => Array(5).fill("")),
    cores    : Array(6).fill(0).map(() => Array(5).fill(null)),
    teclaCor : {},
    linha    : 0,
    coluna   : 0,
    fim      : false,
    ganhou   : false,
    mensagem : "",
    shakeLinha: -1,
  };
}

/* =========================================================
   REDUCER
   ========================================================= */
function reducer(estado, acao) {
  switch (acao.tipo) {

    /* ── Digitar letra ── */
    case "DIGITAR": {
      if (estado.fim || estado.coluna >= 5) return estado;
      const letra = acao.letra.toUpperCase();
      if (!/^[A-Z]$/.test(letra)) return estado;

      const tabuleiro = estado.tabuleiro.map(r => [...r]);
      tabuleiro[estado.linha][estado.coluna] = letra;
      return { ...estado, tabuleiro, coluna: estado.coluna + 1 };
    }

    /* ── Apagar letra ── */
    case "APAGAR": {
      if (estado.coluna === 0) return estado;
      const tabuleiro = estado.tabuleiro.map(r => [...r]);
      tabuleiro[estado.linha][estado.coluna - 1] = "";
      return { ...estado, tabuleiro, coluna: estado.coluna - 1 };
    }

    /* ── Enviar palpite ── */
    case "ENVIAR": {
      if (estado.fim) return estado;
      if (estado.coluna < 5) {
        return { ...estado, mensagem: "Palavra incompleta!", shakeLinha: estado.linha };
      }

      const palpite = estado.tabuleiro[estado.linha].join("");
      const resultado = verificarPalpite(palpite, estado.alvo);

      // Atualizar cores do tabuleiro
      const cores = estado.cores.map(r => [...r]);
      cores[estado.linha] = resultado;

      // Atualizar cores do teclado
      const teclaCor = { ...estado.teclaCor };
      for (let i = 0; i < 5; i++) {
        const letra = palpite[i];
        const cor   = resultado[i];
        if (teclaCor[letra] !== "correct") {
          if (cor === "correct") teclaCor[letra] = "correct";
          else if (cor === "present" && teclaCor[letra] !== "correct") teclaCor[letra] = "present";
          else if (!teclaCor[letra]) teclaCor[letra] = "absent";
        }
      }

      const ganhou = palpite === estado.alvo;
      const fim    = ganhou || estado.linha === 5;
      const mensagem = ganhou
        ? (MSGS_VITORIA[estado.linha] ?? "Parabéns! 🎉")
        : fim ? `A palavra era: ${estado.alvo}` : "";

      return {
        ...estado,
        cores, teclaCor,
        linha  : fim ? estado.linha : estado.linha + 1,
        coluna : fim ? estado.coluna : 0,
        fim, ganhou, mensagem,
        shakeLinha: -1,
      };
    }

    case "LIMPAR_SHAKE": return { ...estado, shakeLinha: -1, mensagem: "" };
    case "LIMPAR_MSG"  : return { ...estado, mensagem: "" };
    case "REINICIAR"   : return criarEstado();
    default: return estado;
  }
}

/* =========================================================
   COMPONENTE PRINCIPAL
   ========================================================= */
export default function Termo() {
  const [st, dispatch] = useReducer(reducer, null, criarEstado);

  /* ── Teclado físico ── */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Backspace") dispatch({ tipo: "APAGAR" });
      else if (e.key === "Enter") dispatch({ tipo: "ENVIAR" });
      else if (/^[a-zA-ZÀ-ÿ]$/.test(e.key)) dispatch({ tipo: "DIGITAR", letra: e.key });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* ── Limpar shake após 600ms ── */
  useEffect(() => {
    if (st.shakeLinha >= 0) {
      const t = setTimeout(() => dispatch({ tipo: "LIMPAR_SHAKE" }), 600);
      return () => clearTimeout(t);
    }
  }, [st.shakeLinha]);

  /* ── Limpar mensagem temporária ── */
  useEffect(() => {
    if (st.mensagem && !st.fim) {
      const t = setTimeout(() => dispatch({ tipo: "LIMPAR_MSG" }), 1800);
      return () => clearTimeout(t);
    }
  }, [st.mensagem, st.fim]);

  /* ── Teclado virtual ── */
  const teclaVirtual = (tecla) => {
    if (tecla === "⌫") dispatch({ tipo: "APAGAR" });
    else if (tecla === "ENTER") dispatch({ tipo: "ENVIAR" });
    else dispatch({ tipo: "DIGITAR", letra: tecla });
  };

  /* ── Render ── */
  return (
    <div style={{
      minHeight: "100vh",
      background: "#0f0f0f",
      color: "#f5f5f0",
      fontFamily: "'Barlow Condensed', 'Impact', sans-serif",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      paddingBottom: 24,
    }}>

      {/* ── CSS Global ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;900&family=Space+Mono:wght@700&display=swap');

        @keyframes shake {
          0%,100%{ transform: translateX(0) }
          15%,45%,75%{ transform: translateX(-7px) }
          30%,60%,90%{ transform: translateX(7px) }
        }
        @keyframes pop {
          0%{ transform: scale(1) }
          50%{ transform: scale(1.14) }
          100%{ transform: scale(1) }
        }
        @keyframes fadeSlide {
          from{ opacity:0; transform:translateX(-50%) translateY(-8px) }
          to  { opacity:1; transform:translateX(-50%) translateY(0) }
        }
        @keyframes flip {
          0%  { transform: rotateX(0deg) }
          49% { transform: rotateX(-90deg) }
          50% { transform: rotateX(-90deg) }
          100%{ transform: rotateX(0deg) }
        }
        .btn-tecla { transition: filter .15s, transform .1s; }
        .btn-tecla:hover{ filter: brightness(1.3); }
        .btn-tecla:active{ transform: scale(.93); }
        .btn-reiniciar:hover{ filter: brightness(1.2); transform: scale(1.04); }
        .btn-reiniciar{ transition: filter .2s, transform .2s; }
      `}</style>

      {/* ── Header ── */}
      <header style={{
        width: "100%",
        maxWidth: 520,
        textAlign: "center",
        padding: "18px 0 14px",
        borderBottom: "1px solid #2a2a2a",
        marginBottom: 10,
      }}>
        <div style={{ fontSize: "2.4rem", fontWeight: 900, letterSpacing: ".25em", color: "#f5f5f0" }}>
          TERMO
        </div>
        <div style={{ fontSize: ".75rem", letterSpacing: ".15em", color: "#666", marginTop: 2, fontFamily: "sans-serif" }}>
          ADIVINHE A PALAVRA EM 6 TENTATIVAS
        </div>
      </header>

      {/* ── Toast de mensagem ── */}
      {st.mensagem && (
        <div style={{
          position: "fixed",
          top: 80,
          left: "50%",
          transform: "translateX(-50%)",
          background: "#f5f5f0",
          color: "#0f0f0f",
          padding: "10px 22px",
          borderRadius: 6,
          fontWeight: 700,
          fontSize: ".9rem",
          fontFamily: "sans-serif",
          zIndex: 999,
          whiteSpace: "nowrap",
          boxShadow: "0 6px 20px rgba(0,0,0,.6)",
          animation: "fadeSlide .2s ease forwards",
        }}>
          {st.mensagem}
        </div>
      )}

      {/* ── Tabuleiro ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 5, margin: "14px 0 18px" }}>
        {st.tabuleiro.map((linha, li) => (
          <div
            key={li}
            style={{
              display: "flex",
              gap: 5,
              animation: st.shakeLinha === li ? "shake .55s" : "none",
            }}
          >
            {linha.map((letra, ci) => {
              const cor  = st.cores[li][ci];
              const bg   = cor ? COR_TILE[cor] : "transparent";
              const bord = cor ? "2px solid transparent"
                               : letra ? "2px solid #606060"
                               : "2px solid #2d2d2d";

              return (
                <div
                  key={ci}
                  style={{
                    width: 62, height: 62,
                    background: bg,
                    border: bord,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.85rem",
                    fontWeight: 700,
                    fontFamily: "'Space Mono', monospace",
                    color: "#f5f5f0",
                    boxSizing: "border-box",
                    animation: letra && li === st.linha && !cor ? "pop .12s ease" : "none",
                    transition: "background .05s",
                  }}
                >
                  {letra}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* ── Legenda de cores ── */}
      <div style={{
        display: "flex",
        gap: 14,
        marginBottom: 14,
        fontFamily: "sans-serif",
        fontSize: ".7rem",
        color: "#888",
      }}>
        {[
          { cor: "#4caf79", label: "Certa" },
          { cor: "#d4ac0d", label: "Presente" },
          { cor: "#3a3a3c", label: "Ausente" },
        ].map(({ cor, label }) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 14, height: 14, background: cor, borderRadius: 3 }} />
            {label}
          </div>
        ))}
      </div>

      {/* ── Teclado virtual ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 7, alignItems: "center" }}>
        {TECLADO.map((linha, li) => (
          <div key={li} style={{ display: "flex", gap: 5 }}>
            {linha.map((tecla) => {
              const largo = tecla.length > 1;
              const cor   = st.teclaCor[tecla];
              return (
                <button
                  key={tecla}
                  className="btn-tecla"
                  onClick={() => teclaVirtual(tecla)}
                  style={{
                    height: 56,
                    minWidth: largo ? 64 : 42,
                    padding: "0 5px",
                    background: COR_KEY[cor] || COR_KEY._,
                    color: "#f5f5f0",
                    border: "none",
                    borderRadius: 5,
                    fontSize: largo ? ".68rem" : ".85rem",
                    fontWeight: 700,
                    fontFamily: "'Barlow Condensed', sans-serif",
                    letterSpacing: ".05em",
                    cursor: "pointer",
                    boxSizing: "border-box",
                    transition: "background .3s",
                  }}
                >
                  {tecla}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* ── Botão reiniciar ── */}
      {st.fim && (
        <button
          className="btn-reiniciar"
          onClick={() => dispatch({ tipo: "REINICIAR" })}
          style={{
            marginTop: 22,
            padding: "13px 32px",
            background: "#4caf79",
            color: "#0f0f0f",
            border: "none",
            borderRadius: 8,
            fontSize: "1rem",
            fontWeight: 900,
            letterSpacing: ".1em",
            fontFamily: "'Barlow Condensed', sans-serif",
            cursor: "pointer",
          }}
        >
          🔄  JOGAR NOVAMENTE
        </button>
      )}
    </div>
  );
}
