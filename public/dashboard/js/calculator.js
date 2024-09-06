document.querySelectorAll('.calculator-buttons .btn').forEach(button => {
    button.addEventListener('click', function() {
        const display = document.getElementById('calculatorDisplay');
        if (!display) {
            console.error("Calculator display element not found.");
            return;
        }
        
        const value = this.getAttribute('data-value');
        
        if (!value) {
            console.error("Button data-value attribute is missing.");
            return;
        }

        if (value === 'C') {
            display.value = '';
        } else if (value === '=') {
            try {
                display.value = eval(display.value) || '';  // Ensure valid evaluation
            } catch (error) {
                display.value = 'Error';
            }
        } else {
            display.value += value;
        }
    });
});
