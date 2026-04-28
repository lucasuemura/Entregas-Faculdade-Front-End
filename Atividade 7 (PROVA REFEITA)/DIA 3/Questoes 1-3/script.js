function mostrarTabela() {
    const container = document.getElementById('container-imagem');

    if (container.innerHTML === "") {
        const imagemTabela = document.createElement('img');

    imagemTabela.src = "../img/Tabela_Jogos.png";
        
        imagemTabela.alt = "Tabela de Jogos da Copa do Mundo 2026";

        container.appendChild(imagemTabela);
        
        document.getElementById('btn-tabela').innerText = "Tabela Exibida Abaixo";
        document.getElementById('btn-tabela').disabled = true;
    }
}