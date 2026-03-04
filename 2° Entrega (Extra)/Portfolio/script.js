const botaoTema = document.getElementById('botao-tema');
const body = document.body;

botaoTema.addEventListener('click', () => {
    body.classList.toggle('tema-claro');
});