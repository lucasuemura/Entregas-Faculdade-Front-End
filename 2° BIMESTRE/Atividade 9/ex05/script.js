document.addEventListener('DOMContentLoaded', () => {
    const btnAdicionar = document.getElementById('btnAdicionar');
    const inputNome = document.getElementById('nomeConvidado');
    const lista = document.getElementById('listaConvidados');

    btnAdicionar.addEventListener('click', adicionarConvidado);

    inputNome.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') adicionarConvidado();
    });

    function adicionarConvidado() {
        const nome = inputNome.value.trim();

        if (nome === '') {
            alert('Por favor, digite o nome do convidado.');
            return;
        }

        const li = document.createElement('li');

        const spanNome = document.createElement('span');
        spanNome.textContent = nome;
        spanNome.classList.add('nome-texto');

        const divAcoes = document.createElement('div');
        divAcoes.classList.add('acoes');

        const btnConcluir = document.createElement('button');
        btnConcluir.textContent = 'Chegou';
        btnConcluir.classList.add('btn-acao', 'btn-concluir');
        
        btnConcluir.addEventListener('click', () => {
            spanNome.classList.toggle('riscado');
        });

        const btnEditar = document.createElement('button');
        btnEditar.textContent = 'Editar';
        btnEditar.classList.add('btn-acao', 'btn-editar');
        
        btnEditar.addEventListener('click', () => {
            const novoNome = prompt('Corrigir nome do convidado:', spanNome.textContent);
            
            if (novoNome !== null && novoNome.trim() !== '') {
                spanNome.textContent = novoNome.trim();
            }
        });

        const btnExcluir = document.createElement('button');
        btnExcluir.textContent = 'Excluir';
        btnExcluir.classList.add('btn-acao', 'btn-excluir');
        
        btnExcluir.addEventListener('click', () => {
            lista.removeChild(li);
        });

        divAcoes.appendChild(btnConcluir);
        divAcoes.appendChild(btnEditar);
        divAcoes.appendChild(btnExcluir);

        li.appendChild(spanNome);
        li.appendChild(divAcoes);

        lista.appendChild(li);

        inputNome.value = '';
        inputNome.focus();
    }
});