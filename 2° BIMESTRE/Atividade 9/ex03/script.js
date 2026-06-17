document.addEventListener('DOMContentLoaded', () => {
    const btnCalcular = document.getElementById('btnCalcular');
    const resultadoEl = document.getElementById('resultado');

    btnCalcular.addEventListener('click', () => {
        
        const nome = document.getElementById('nome').value;

        const nota1 = Number(document.getElementById('nota1').value);
        const nota2 = Number(document.getElementById('nota2').value);
        const nota3 = Number(document.getElementById('nota3').value);

        if (nome === '' || isNaN(nota1) || isNaN(nota2) || isNaN(nota3)) {
            resultadoEl.textContent = 'Por favor, preencha todos os campos.';
            resultadoEl.className = '';
            resultadoEl.style.color = '#333';
            return;
        }

        const media = (nota1 + nota2 + nota3) / 3;

        resultadoEl.className = ''; 

        if (media >= 7.0) {
            resultadoEl.textContent = `${nome}, você está Aprovado! Média: ${media.toFixed(2)}`;
            resultadoEl.classList.add('aprovado');
            
        } else if (media >= 4.0) {
            const pontosFaltantes = 10 - media;
            resultadoEl.textContent = `${nome}, você está de Exame. Faltam ${pontosFaltantes.toFixed(2)} pontos. Média: ${media.toFixed(2)}`;
            resultadoEl.classList.add('exame');
            
        } else {
            resultadoEl.textContent = `${nome}, você está Reprovado. Média: ${media.toFixed(2)}`;
            resultadoEl.classList.add('reprovado');
            
        }
    });
});