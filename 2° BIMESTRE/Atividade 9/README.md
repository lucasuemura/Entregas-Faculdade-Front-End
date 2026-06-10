# Tutorial: Construindo o TERMO em React
## (Estilo Jogo da Velha — react.dev)

> **Baseado no tutorial oficial do React**: https://react.dev/learn/tutorial-tic-tac-toe  
> **O que vamos construir**: um clone do jogo Termo (similar ao Wordle) com React.

---

## O que é o TERMO?

O Termo é um jogo de palavras onde o jogador tem **6 tentativas** para adivinhar uma palavra secreta de **5 letras**.  
A cada tentativa, as letras ficam coloridas:

| Cor       | Significado                            |
|-----------|----------------------------------------|
| 🟩 Verde  | Letra certa na posição certa           |
| 🟨 Amarelo| Letra existe, mas na posição errada    |
| ⬛ Cinza  | Letra não existe na palavra            |

---

## Passo 1 — Configuração do Projeto

### Se você usar Create React App (local):

```bash
npx create-react-app meu-termo
cd meu-termo
npm start
```

Substitua o conteúdo de `src/App.js` com o código do jogo.

### Se você usar o Claude / IA (como fizemos):

Basta colar o código do componente no editor de React e ele roda direto no navegador.

---

## Passo 2 — Estrutura de Dados

Antes de programar, pensamos: **quais dados o jogo precisa guardar?**

```js
// Lista de palavras possíveis (o alvo vem daqui)
const WORDS = ["PRATO", "CARRO", "FUNDO", ...];

// Layout do teclado virtual
const TECLADO = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "⌫"],
];
```

---

## Passo 3 — Estado do Jogo com useReducer

Em vez de vários `useState` separados, usamos **`useReducer`** — padrão mais organizado para estados complexos (igual ao que o tutorial do Jogo da Velha usa).

```js
// Estado inicial — começa um novo jogo do zero
function criarEstado() {
  return {
    alvo     : WORDS[Math.floor(Math.random() * WORDS.length)], // palavra aleatória
    tabuleiro: Array(6).fill(0).map(() => Array(5).fill("")),   // 6 linhas × 5 colunas
    cores    : Array(6).fill(0).map(() => Array(5).fill(null)), // cores das células
    teclaCor : {},  // cor de cada tecla (green/yellow/gray)
    linha    : 0,   // linha atual (tentativa atual)
    coluna   : 0,   // coluna atual (próxima posição para digitar)
    fim      : false,
    ganhou   : false,
    mensagem : "",
  };
}
```

### O que é `useReducer`?

```js
const [estado, dispatch] = useReducer(reducer, null, criarEstado);
//      ^            ^
//   estado atual   função para enviar ações
```

Em vez de chamar `setAlgo(valor)` diretamente, você chama:
```js
dispatch({ tipo: "DIGITAR", letra: "A" })
dispatch({ tipo: "APAGAR" })
dispatch({ tipo: "ENVIAR" })
```

---

## Passo 4 — O Reducer (lógica de ação)

O `reducer` é uma função que recebe o estado atual + uma ação e **retorna o novo estado**:

```js
function reducer(estado, acao) {
  switch (acao.tipo) {

    case "DIGITAR": {
      // Adiciona uma letra na posição atual
      if (estado.coluna >= 5) return estado; // linha cheia
      const tabuleiro = estado.tabuleiro.map(r => [...r]); // cópia
      tabuleiro[estado.linha][estado.coluna] = acao.letra.toUpperCase();
      return { ...estado, tabuleiro, coluna: estado.coluna + 1 };
    }

    case "APAGAR": {
      // Remove a última letra digitada
      if (estado.coluna === 0) return estado;
      const tabuleiro = estado.tabuleiro.map(r => [...r]);
      tabuleiro[estado.linha][estado.coluna - 1] = "";
      return { ...estado, tabuleiro, coluna: estado.coluna - 1 };
    }

    case "ENVIAR":
      // (ver Passo 5)

    case "REINICIAR":
      return criarEstado();
  }
}
```

> 💡 **Conceito React**: sempre retorne um **novo objeto** (com `...estado`), nunca mute o estado diretamente. O React detecta a mudança e re-renderiza.

---

## Passo 5 — Lógica de Verificação do Palpite

Esta é a parte mais importante: **comparar o palpite com a palavra alvo**.

```js
function verificarPalpite(palpite, alvo) {
  const resultado = Array(5).fill("absent"); // começa tudo cinza
  const disponivel = {};

  // PASSO A: marcar posições corretas (verde)
  for (let i = 0; i < 5; i++) {
    if (palpite[i] === alvo[i]) {
      resultado[i] = "correct";
    } else {
      // conta letras restantes do alvo para o passo B
      disponivel[alvo[i]] = (disponivel[alvo[i]] || 0) + 1;
    }
  }

  // PASSO B: marcar letras presentes (amarelo)
  for (let i = 0; i < 5; i++) {
    if (resultado[i] !== "correct" && disponivel[palpite[i]] > 0) {
      resultado[i] = "present";
      disponivel[palpite[i]]--;
    }
  }

  return resultado; // ["correct", "absent", "present", ...]
}
```

### Exemplo:
- Alvo: `PRATO`  
- Palpite: `PORTA`  
- Resultado: `P`=✅ `O`=🟨 `R`=🟨 `T`=🟨 `A`=✅

---

## Passo 6 — Enviando o Palpite (ação ENVIAR)

```js
case "ENVIAR": {
  if (estado.coluna < 5) {
    return { ...estado, mensagem: "Palavra incompleta!" };
  }

  const palpite   = estado.tabuleiro[estado.linha].join(""); // junta as letras
  const resultado = verificarPalpite(palpite, estado.alvo);

  // Atualiza as cores do tabuleiro
  const cores = estado.cores.map(r => [...r]);
  cores[estado.linha] = resultado;

  // Atualiza as cores do teclado
  const teclaCor = { ...estado.teclaCor };
  for (let i = 0; i < 5; i++) {
    const letra = palpite[i];
    const cor   = resultado[i];
    // Prioridade: correct > present > absent
    if (teclaCor[letra] !== "correct") {
      if (cor === "correct") teclaCor[letra] = "correct";
      else if (cor === "present") teclaCor[letra] = "present";
      else if (!teclaCor[letra]) teclaCor[letra] = "absent";
    }
  }

  const ganhou = palpite === estado.alvo;
  const fim    = ganhou || estado.linha === 5; // ganhou ou usou todas tentativas

  return {
    ...estado,
    cores, teclaCor,
    linha  : fim ? estado.linha : estado.linha + 1, // avança linha se não acabou
    coluna : fim ? estado.coluna : 0,
    fim, ganhou,
    mensagem: ganhou ? "Parabéns! 🎉" : fim ? `A palavra era: ${estado.alvo}` : "",
  };
}
```

---

## Passo 7 — Capturando o Teclado Físico

```js
useEffect(() => {
  const onKey = (e) => {
    if (e.key === "Backspace") dispatch({ tipo: "APAGAR" });
    else if (e.key === "Enter")  dispatch({ tipo: "ENVIAR" });
    else if (/^[a-zA-Z]$/.test(e.key)) dispatch({ tipo: "DIGITAR", letra: e.key });
  };

  window.addEventListener("keydown", onKey);
  return () => window.removeEventListener("keydown", onKey); // cleanup!
}, []);
```

> 💡 O `return` no `useEffect` é a **função de limpeza** — remove o listener quando o componente desmonta. Igual ao jogo da velha quando "desmontamos" um efeito.

---

## Passo 8 — Renderizando o Tabuleiro

```jsx
<div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
  {st.tabuleiro.map((linha, li) => (
    <div key={li} style={{ display: "flex", gap: 5 }}>
      {linha.map((letra, ci) => {
        const cor  = st.cores[li][ci]; // null | "correct" | "present" | "absent"
        const bg   = cor ? COR_TILE[cor] : "transparent";

        return (
          <div
            key={ci}
            style={{
              width: 62, height: 62,
              background: bg,
              border: cor ? "none" : (letra ? "2px solid #606060" : "2px solid #2d2d2d"),
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "1.85rem", fontWeight: 700, color: "white",
            }}
          >
            {letra}
          </div>
        );
      })}
    </div>
  ))}
</div>
```

---

## Passo 9 — Renderizando o Teclado Virtual

```jsx
<div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
  {TECLADO.map((linha, li) => (
    <div key={li} style={{ display: "flex", gap: 5 }}>
      {linha.map((tecla) => {
        const cor = st.teclaCor[tecla]; // cor acumulada da tecla
        return (
          <button
            key={tecla}
            onClick={() => teclaVirtual(tecla)} // chama dispatch
            style={{
              height: 56, minWidth: tecla.length > 1 ? 64 : 42,
              background: COR_KEY[cor] || "#5a5a5c",
              color: "white", border: "none", borderRadius: 5,
              fontSize: ".85rem", fontWeight: 700, cursor: "pointer",
            }}
          >
            {tecla}
          </button>
        );
      })}
    </div>
  ))}
</div>
```

---

## Passo 10 — Animação de Erro (Shake)

```js
// No estado: shakeLinha: -1

// No reducer (ação ENVIAR, palavra incompleta):
return { ...estado, mensagem: "Palavra incompleta!", shakeLinha: estado.linha };

// No componente, useEffect para limpar após 600ms:
useEffect(() => {
  if (st.shakeLinha >= 0) {
    const t = setTimeout(() => dispatch({ tipo: "LIMPAR_SHAKE" }), 600);
    return () => clearTimeout(t);
  }
}, [st.shakeLinha]);

// No CSS:
// @keyframes shake {
//   0%,100%{ transform: translateX(0) }
//   25%,75%{ transform: translateX(-7px) }
//   50%    { transform: translateX(7px) }
// }

// Na linha do tabuleiro:
<div style={{ animation: st.shakeLinha === li ? "shake .55s" : "none" }}>
```

---

## Resumo: Fluxo Completo

```
Usuário digita tecla
       ↓
  dispatch({ tipo: "DIGITAR", letra: "A" })
       ↓
  reducer(estadoAtual, acao)
       ↓
  retorna novoEstado
       ↓
  React re-renderiza o componente
       ↓
  Tela atualiza com a nova letra
```

---

## Próximos Passos (Melhorias)

1. **Animação de flip** nas células ao revelar as cores
2. **Validação** — só aceitar palavras que existem no dicionário
3. **Estatísticas** — número de vitórias, distribuição de tentativas
4. **Modo difícil** — letras corretas devem ser usadas nos próximos palpites
5. **Tema claro/escuro**
6. **Compartilhar resultado** (os emojis de quadrado do Wordle original)

---

## Conceitos React Aprendidos

| Conceito       | Onde usamos                             |
|----------------|-----------------------------------------|
| `useReducer`   | Gerenciar todo o estado do jogo         |
| `useEffect`    | Eventos de teclado + timeouts           |
| `.map()`       | Renderizar tabuleiro e teclado          |
| Estilos inline | Colorir células dinamicamente           |
| Imutabilidade  | Sempre copiar estado (`...spread`)      |
| Cleanup        | Remover event listener no return        |

---

*Tutorial gerado com IA — Claude (Anthropic) — para o Desafio da Aula de React*
