let display = document.getElementById('display');
let currentInput = '0';
let operator = null;
let previousInput = null;
let shouldResetDisplay = false;
let displayExpression = '0';

function updateDisplay() {
    display.value = displayExpression;
    // Scroll to the right to show the latest content
    setTimeout(() => {
        display.scrollLeft = display.scrollWidth;
    }, 0);
}

function getOperatorSymbol(op) {
    const symbols = {
        '+': '+',
        '-': '−',
        '*': '×',
        '/': '÷'
    };
    return symbols[op] || op;
}

function appendNumber(number) {
    if (shouldResetDisplay) {
        currentInput = '0';
        shouldResetDisplay = false;
    }
    
    // Prevent multiple decimal points
    if (number === '.' && currentInput.includes('.')) {
        return;
    }
    
    if (currentInput === '0' && number !== '.') {
        currentInput = number;
    } else {
        currentInput += number;
    }
    
    // Update display expression
    if (operator === null) {
        displayExpression = currentInput;
    } else {
        displayExpression = previousInput + ' ' + getOperatorSymbol(operator) + ' ' + currentInput;
    }
    
    updateDisplay();
}

function appendOperator(op) {
    if (operator !== null && !shouldResetDisplay) {
        calculate();
    }
    
    previousInput = currentInput;
    operator = op;
    shouldResetDisplay = true;
    displayExpression = currentInput + ' ' + getOperatorSymbol(op);
    updateDisplay();
}

function calculate() {
    if (operator === null || previousInput === null) {
        return;
    }
    
    let result;
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);
    
    if (isNaN(prev) || isNaN(current)) {
        return;
    }
    
    switch (operator) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '*':
            result = prev * current;
            break;
        case '/':
            if (current === 0) {
                currentInput = 'Error';
                displayExpression = 'Error';
                display.classList.add('error');
                updateDisplay();
                resetCalculator();
                return;
            }
            result = prev / current;
            break;
        default:
            return;
    }
    
    // Format result to handle decimal places
    result = Math.round(result * 100000000) / 100000000; // Round to 8 decimal places
    
    currentInput = result.toString();
    displayExpression = currentInput;
    operator = null;
    previousInput = null;
    shouldResetDisplay = true;
    updateDisplay();
}

function clearDisplay() {
    currentInput = '0';
    operator = null;
    previousInput = null;
    shouldResetDisplay = false;
    displayExpression = '0';
    display.classList.remove('error');
    updateDisplay();
}

function clearEntry() {
    currentInput = '0';
    shouldResetDisplay = false;
    if (operator === null) {
        displayExpression = '0';
    } else {
        displayExpression = previousInput + ' ' + getOperatorSymbol(operator);
    }
    updateDisplay();
}

function deleteLast() {
    if (operator === null) {
        if (currentInput.length > 1) {
            currentInput = currentInput.slice(0, -1);
            displayExpression = currentInput;
        } else {
            currentInput = '0';
            displayExpression = '0';
        }
    } else {
        if (currentInput.length > 1) {
            currentInput = currentInput.slice(0, -1);
            displayExpression = previousInput + ' ' + getOperatorSymbol(operator) + ' ' + currentInput;
        } else {
            currentInput = '0';
            displayExpression = previousInput + ' ' + getOperatorSymbol(operator);
        }
    }
    updateDisplay();
}

function resetCalculator() {
    setTimeout(() => {
        display.classList.remove('error');
        clearDisplay();
    }, 1500);
}

// Keyboard support
document.addEventListener('keydown', function(event) {
    const key = event.key;
    
    if (key >= '0' && key <= '9') {
        appendNumber(key);
    } else if (key === '.') {
        appendNumber('.');
    } else if (key === '+' || key === '-') {
        appendOperator(key);
    } else if (key === '*') {
        appendOperator('*');
    } else if (key === '/') {
        event.preventDefault();
        appendOperator('/');
    } else if (key === 'Enter' || key === '=') {
        event.preventDefault();
        calculate();
    } else if (key === 'Escape') {
        clearDisplay();
    } else if (key === 'Backspace') {
        event.preventDefault();
        deleteLast();
    }
});

// Initialize display
updateDisplay();

