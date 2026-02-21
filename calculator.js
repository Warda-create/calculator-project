let input = document.getElementById('display');
let clear = document.getElementById('clear');
let equal = document.getElementById('equals');
let backspace = document.getElementById('delete');

const numberButtons = document.querySelectorAll("[data-number]");
const operatorButtons = document.querySelectorAll("[data-operator]");

let currentInput = '';
let previousInput = '';
let operator = '';

function updateDisplay() {
    input.value = previousInput + (operator ? ' ' + operator + ' ' : '') + currentInput;
}

// ✅ Calculation function with explicit operator
function calculation(prev, current, op) {
    let result;
    switch(op){
        case '+': result = prev + current; break;
        case '-': result = prev - current; break;
        case '*': result = prev * current; break;
        case '/':
            if(current === 0){
                input.value = "Error";
                currentInput = '';
                previousInput = '';
                operator = '';
                return null;
            }
            result = prev / current;
            break;
        default: return null;
    }
    return result;
}

// ✅ Operator handling function
function handleOperator(newOperator){
    if(currentInput === '' && previousInput === ''){
        input.value = "Enter a number first";
        input.classList.add('text-danger');
        setTimeout(()=>{
            input.classList.remove('text-danger');
            updateDisplay();
        }, 1500);
        return;
    }

    // Chaining
    if(previousInput !== '' && currentInput !== ''){
        const prev = parseFloat(previousInput);
        const current = parseFloat(currentInput);
        const result = calculation(prev, current, operator); // pass old operator
        if(result === null) return;

        previousInput = parseFloat(result.toFixed(10)).toString();
        currentInput = '';
        operator = newOperator;
        updateDisplay();
    }
    // Replace operator
    else if(currentInput === '' && previousInput !== ''){
        operator = newOperator;
        updateDisplay();
    }
    // First operator
    else {
        previousInput = currentInput;
        currentInput = '';
        operator = newOperator;
        updateDisplay();
    }
}

// ✅ Number buttons
numberButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        const value = e.target.dataset.number;
        if(value === "."){
            if(currentInput.includes(".")) return;
            if(currentInput === "") currentInput = "0.";
            else currentInput += ".";
        } else {
            currentInput += value;
        }
        updateDisplay();
    });
});

// ✅ Operator buttons
operatorButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        const newOperator = e.target.dataset.operator;
        handleOperator(newOperator);
    });
});

// ✅ Equals button
equal.addEventListener('click', () => {
    if(previousInput === '' || currentInput === '' || operator === '') return;
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);
    const result = calculation(prev, current, operator);
    if(result === null) return;

    currentInput = parseFloat(result.toFixed(10)).toString();
    previousInput = '';
    operator = '';
    updateDisplay();
});

// ✅ Clear button
clear.addEventListener('click', () => {
    currentInput = '';
    previousInput = '';
    operator = '';
    updateDisplay();
});

// ✅ Backspace button
backspace.addEventListener('click', () => {
    currentInput = currentInput.slice(0, -1);
    updateDisplay();
});

// ✅ Keyboard support
document.addEventListener('keydown', (e)=>{
    const key = e.key;

    if(/[0-9]/.test(key)){
        currentInput += key;
        updateDisplay();
    }
    else if(key === "."){
        if(!currentInput.includes(".")){
            currentInput = currentInput === "" ? "0." : currentInput + ".";
            updateDisplay();
        }
    }
    else if(['+', '-', '*', '/'].includes(key)){
        handleOperator(key);
    }
    else if(key === 'Enter'){
        e.preventDefault();
        if(previousInput && currentInput && operator){
            const prev = parseFloat(previousInput);
            const current = parseFloat(currentInput);
            const result = calculation(prev, current, operator);
            if(result === null) return;

            currentInput = parseFloat(result.toFixed(10)).toString();
            previousInput = '';
            operator = '';
            updateDisplay();
        }
    }
    else if(key === 'Backspace'){
        currentInput = currentInput.slice(0, -1);
        updateDisplay();
    }
    else if(key === 'Escape'){
        currentInput = '';
        previousInput = '';
        operator = '';
        updateDisplay();
    }
});