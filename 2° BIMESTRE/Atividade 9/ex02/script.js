document.addEventListener('DOMContentLoaded', () => {
    const inputCelsius = document.getElementById('celsius');
    const inputFahrenheit = document.getElementById('fahrenheit');

    inputCelsius.addEventListener('input', () => {
        const tempC = parseFloat(inputCelsius.value);

        if (isNaN(tempC)) {
            inputFahrenheit.value = '';
            return;
        }

        const tempF = (tempC * 9 / 5) + 32;

        inputFahrenheit.value = tempF.toFixed(2);
    });

    inputFahrenheit.addEventListener('input', () => {
        const tempF = parseFloat(inputFahrenheit.value);
        
        if (isNaN(tempF)) {
            inputCelsius.value = '';
            return;
        }

        const tempC = (tempF - 32) * 5 / 9;

        inputCelsius.value = tempC.toFixed(2);
    });
});