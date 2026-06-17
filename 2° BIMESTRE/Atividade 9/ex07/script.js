document.addEventListener('DOMContentLoaded', () => {
    const btnAnalisar = document.getElementById('btnAnalisar');
    const inputCartao = document.getElementById('numeroCartao');
    const painelInfo = document.getElementById('painelInfo');

    inputCartao.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
        e.target.value = value;
    });

    btnAnalisar.addEventListener('click', () => {
        const numLimpo = inputCartao.value.replace(/\D/g, '');

        if (numLimpo.length < 13 || numLimpo.length > 16) {
            alert('Número inválido. O cartão deve conter entre 13 e 16 dígitos numéricos.');
            return;
        }

        const isValid = validarLuhn(numLimpo);
        
        const statusEl = document.getElementById('statusCartao');
        statusEl.textContent = isValid ? 'Válido' : 'Inválido';
        statusEl.className = isValid ? 'valido' : 'invalido';

        document.getElementById('bandeiraCartao').textContent = obterBandeira(numLimpo);
        document.getElementById('setorCartao').textContent = obterSetor(numLimpo.charAt(0));
        document.getElementById('emissorCartao').textContent = `Lote ID: ${numLimpo.substring(1, 6)}`;

        painelInfo.classList.remove('oculto');
    });

    function validarLuhn(numero) {
        let soma = 0;
        let alternar = false;

        for (let i = numero.length - 1; i >= 0; i--) {
            let digito = parseInt(numero.charAt(i), 10);

            if (alternar) {
                digito *= 2;
                if (digito > 9) {
                    digito -= 9;
                }
            }

            soma += digito;
            alternar = !alternar;
        }

        return (soma % 10) === 0;
    }

    function obterBandeira(numero) {
        if (numero.startsWith('4')) return 'Visa';
        if (/^5[1-5]/.test(numero)) return 'Mastercard';
        if (/^3[47]/.test(numero)) return 'American Express';
        if (numero.startsWith('6')) return 'Discover';
        return 'Bandeira Desconhecida';
    }

    function obterSetor(digito) {
        switch (digito) {
            case '1':
            case '2': return 'Companhias Aéreas';
            case '3': return 'Viagens e Entretenimento';
            case '4':
            case '5': return 'Bancário e Financeiro';
            case '6': return 'Comércio e Finanças';
            case '7': return 'Petróleo e Energia';
            case '8': return 'Saúde e Telecomunicações';
            case '9': return 'Nacional / Governamental';
            default: return 'Setor Indefinido';
        }
    }
});