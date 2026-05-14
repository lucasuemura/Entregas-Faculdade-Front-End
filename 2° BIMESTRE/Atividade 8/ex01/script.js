document.addEventListener('DOMContentLoaded', () => {
    const btnValidar = document.getElementById('btnValidar');
    const inputCpf = document.getElementById('cpfInput');

    btnValidar.addEventListener('click', verificarCPF);

    inputCpf.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 11) value = value.slice(0, 11);

        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        
        e.target.value = value;
    });
});

function verificarCPF() {
    const input = document.getElementById('cpfInput').value;
    const resultadoEl = document.getElementById('resultado');

    const cpfLimpo = input.replace(/\D/g, '');

    if (validarLogicaCPF(cpfLimpo)) {
        resultadoEl.textContent = 'CPF Válido!';
        resultadoEl.className = 'valido';
    } else {
        resultadoEl.textContent = 'CPF Inválido!';
        resultadoEl.className = 'invalido';
    }
}

function validarLogicaCPF(cpf) {
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
        return false;
    }

    let soma1 = 0;
    for (let i = 0; i < 9; i++) {
        soma1 += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let digito1 = (soma1 * 10) % 11;
    if (digito1 === 10) digito1 = 0;

    if (digito1 !== parseInt(cpf.charAt(9))) {
        return false;
    }

    let soma2 = 0;
    for (let i = 0; i < 10; i++) {
        soma2 += parseInt(cpf.charAt(i)) * (11 - i);
    }
    let digito2 = (soma2 * 10) % 11;
    if (digito2 === 10) digito2 = 0;

    if (digito2 !== parseInt(cpf.charAt(10))) {
        return false;
    }

    return true;
}