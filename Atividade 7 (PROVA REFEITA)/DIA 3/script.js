function revelar() {
    const img = document.querySelector('.card-img-top');
    img.src = 'img/_vinicius_junior.png';
    img.alt = 'Vinícius José Paixão de Oliveira Júnior';

    const titulo = document.getElementById('Nome');

    titulo.classList.remove('placeholder-glow');
    titulo.innerHTML = 'Vinícius José Paixão de Oliveira Júnior <span id="Rank" class="badge text-bg-secondary">9,5</span>';

    const dataNas = document.getElementById('Data_Nas');
    dataNas.classList.remove('placeholder', 'col-4');
    dataNas.innerHTML = '📅 12/07/2000 (25 anos)';

    const altura = document.getElementById('Alutra'); 
    altura.classList.remove('placeholder', 'col-4');
    altura.innerHTML = '📏 1,76 m';

    const posicao = document.getElementById('Posição '); 
    posicao.classList.remove('placeholder', 'col-6');
    posicao.innerHTML = '🏃 Ponta-esquerda / Atacante';

    const texto = document.querySelector('.card-text');
    texto.classList.remove('placeholder-glow');

    const botao = document.querySelector('.btn-primary');
    if(botao) botao.style.display = 'none';
}