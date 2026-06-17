document.addEventListener('DOMContentLoaded', () => {
    const btnSimular = document.getElementById('btnSimular');
    const divResultado = document.getElementById('resultado');

    btnSimular.addEventListener('click', () => {
        const valorVenda = Number(document.getElementById('valorVenda').value);
        const parcelas = Number(document.getElementById('parcelas').value);
        const bandeira = document.getElementById('bandeira').value;

        if (valorVenda <= 0 || parcelas <= 0 || bandeira === "") {
            alert("Por favor, preencha todos os campos corretamente.");
            return;
        }

        let percentualBandeira = 0;

        switch (bandeira) {
            case 'visa':
                percentualBandeira = 0.02;
                break;
            case 'master':
                percentualBandeira = 0.0185;
                break;
            case 'elo':
                percentualBandeira = 0.03;
                break;
        }

        const valorTaxaBandeira = valorVenda * percentualBandeira;

        const jurosPercentuais = valorVenda * (0.0035 * parcelas);

        const taxaMensalFixa = 12.50 * parcelas;

        const jurosTotais = jurosPercentuais + taxaMensalFixa;

        const valorTotal = valorVenda + valorTaxaBandeira + jurosTotais;
        const valorParcela = valorTotal / parcelas;

        document.getElementById('resTaxa').textContent = `R$ ${valorTaxaBandeira.toFixed(2)}`;
        document.getElementById('resJuros').textContent = `R$ ${jurosTotais.toFixed(2)}`;
        document.getElementById('resParcela').textContent = `${parcelas}x de R$ ${valorParcela.toFixed(2)}`;
        document.getElementById('resTotal').textContent = `R$ ${valorTotal.toFixed(2)}`;

        divResultado.classList.remove('oculto');
    });
});