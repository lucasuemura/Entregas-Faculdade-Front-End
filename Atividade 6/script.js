const imagens = {
    normal: "imagens/normal.png",
    bravo: "imagens/bravo.png",
    morto: "imagens/morto.png",
    comendo: "imagens/comendo.png",
    feliz: "imagens/feliz.png"
};

const fundoDia = "imagens/background.png";
const fundoNoite = "imagens/background_noite.png";

let img, fomeBar, fomeTxt;
let contadorFome = 0;
let estaMorto = false;
let timeoutClique;

let horas = 8;
let cicloAutomatico = true;

window.onload = () => {
    img = document.getElementById("mainImage");
    fomeBar = document.getElementById("fomeBar");
    fomeTxt = document.getElementById("fomeTxt");
    const toggleBtn = document.getElementById("toggleNoite");

    renderizarFundo();
    
    setInterval(() => {
        if (estaMorto) return;

        contadorFome += 10;
        if (contadorFome > 100) contadorFome = 100;
        
        atualizarUI();

        if (contadorFome >= 60 && contadorFome < 100) {
            img.src = imagens.bravo;
        } else if (contadorFome >= 100) {
            morrer();
        }
    }, 2000);

    setInterval(() => {
        if (!cicloAutomatico) return;
        horas = (horas + 1) % 24;
        renderizarFundo();
    }, 10000);

    toggleBtn.addEventListener("change", (e) => {
        cicloAutomatico = false;
        horas = e.target.checked ? 20 : 8;
        renderizarFundo();
    });
};

function atualizarUI() {
    fomeBar.value = contadorFome;
    fomeTxt.innerText = contadorFome + "%";
    
    if (contadorFome >= 70) {
        fomeBar.classList.replace("progress-primary", "progress-error");
    } else {
        fomeBar.classList.replace("progress-error", "progress-primary");
    }
}

function alimentar() {
    if (estaMorto) {
        alert("Você deixou o seu bicho morrer, seu incompetente...");
        return; 
    }

    contadorFome = 0;
    atualizarUI();
    img.src = imagens.comendo;

    if (timeoutClique) clearTimeout(timeoutClique);

    timeoutClique = setTimeout(() => {
        img.src = imagens.feliz;
        setTimeout(() => {
            if (!estaMorto) img.src = imagens.normal;
        }, 1500);
    }, 800);
}

function morrer() {
    estaMorto = true;
    img.src = imagens.morto;
    img.classList.remove("floating");
    img.style.transform = "rotate(90deg) scale(0.8)";
    fomeTxt.innerText = "MORTO";
}

function renderizarFundo() {
    const ehNoite = horas >= 18 || horas < 6;
    const toggleBtn = document.getElementById("toggleNoite");

    document.body.style.backgroundImage = `url('${ehNoite ? fundoNoite : fundoDia}')`;
    toggleBtn.checked = ehNoite;
    
    document.documentElement.setAttribute('data-theme', ehNoite ? 'dark' : 'cupcake');
}