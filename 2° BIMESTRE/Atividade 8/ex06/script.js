document.addEventListener('DOMContentLoaded', () => {
    const btnCalcular = document.getElementById('btnCalcular');
    const divResultado = document.getElementById('resultado');

    btnCalcular.addEventListener('click', () => {
        const pacote = Number(document.getElementById('pacote').value);
        const convidados = Number(document.getElementById('convidados').value);

        if (convidados <= 0 || isNaN(convidados)) {
            alert('Por favor, insira uma quantidade válida de convidados.');
            return;
        }

        const custoBruto = pacote * convidados;
        const taxaServico = custoBruto * 0.10;
        const subTotal = custoBruto + taxaServico;
        
        let desconto = 0;
        if (convidados > 100) {
            desconto = subTotal * 0.05;
        }

        const totalFinal = subTotal - desconto;

        document.getElementById('resBruto').textContent = `R$ ${custoBruto.toFixed(2)}`;
        document.getElementById('resTaxa').textContent = `R$ ${taxaServico.toFixed(2)}`;
        document.getElementById('resDesconto').textContent = `- R$ ${desconto.toFixed(2)}`;
        document.getElementById('resTotal').textContent = `R$ ${totalFinal.toFixed(2)}`;

        divResultado.classList.remove('oculto');
    });
});