const calcLog = document.querySelector("#log");
const expression = document.querySelector("#expression");
const result = document.querySelector("#result");

const operationsDisplay = document.querySelector("#operations-display");
const operandoBtns = document.querySelectorAll(".operando-btn");
const operatorBtns = document.querySelectorAll(".operator-btn");

const resultBtn = document.querySelector("#result-btn");
const clearAllBtn = document.querySelector("#clear-all-btn");
const clearEntryBtn = document.querySelector("#clear-entry-btn");
const deleteBtn = document.querySelector("#delete-btn");
const pointBtn = document.querySelector("#point-btn");

// Events

for (const currentBtn of operandoBtns) {
    currentBtn.addEventListener("click", () => {
        handleFilledDisplay();
        expression.innerHTML += currentBtn.innerHTML;
    });
}

for (const currentBtn of operatorBtns) {
    currentBtn.addEventListener("click", () => {
        if (result.innerHTML.length !== 0) {
            expression.innerHTML = result.innerHTML;
            result.innerHTML = "";
        }

        if (expression.innerHTML.length === 0) {
            return;
        }

        if (checkIfExpressionHasOperator(expression.innerHTML)) {
            deleteLastChar();
        }

        expression.innerHTML += currentBtn.innerHTML;
    });
}

resultBtn.addEventListener("click", () => {
    let expressionContent = expression.innerHTML;

    const totalDistinctNumbers = countDistinctNumbers(expressionContent);

    if (totalDistinctNumbers < 2) {
        return;
    }

    const expressionHasDivByZero = stopDivisionByZero(expressionContent);

    if (expressionHasDivByZero) {
        return;
    }

    const majorOperatorsIndexes = getOperatorsIndexes(expressionContent, '/', '*');
    expressionContent = solveExpression(expressionContent, majorOperatorsIndexes);

    const minorOperatorsIndexes = getOperatorsIndexes(expressionContent, '-', '+');
    let total = solveExpression(expressionContent, minorOperatorsIndexes);

    if (total.length > 20) {
        total = parseFloat(total).toExponential(2);
    }
    
    calcLog.innerHTML = expression.innerHTML + " = " + total;
    expression.innerHTML = "";
    result.innerHTML = total;
});

pointBtn.addEventListener("click", () => {
    let btnContent = pointBtn.innerHTML;

    const currentNumberHasPoint = checkIfNumberHasPoint(expression.innerHTML);

    if (currentNumberHasPoint) {
        return;
    }

    if (!checkIfFloatHasInt(expression.innerHTML)) {
        btnContent = "0" + btnContent;
    }

    handleFilledDisplay();
    expression.innerHTML += btnContent;
});

clearAllBtn.addEventListener("click", () => {
    calcLog.innerHTML = "";
    expression.innerHTML = "";
    result.innerHTML = "";
});

clearEntryBtn.addEventListener("click", () => {
    expression.innerHTML = "";
    result.innerHTML = "";
});

deleteBtn.addEventListener("click", () => {
    if (result.innerHTML.length !== 0) {
        expression.innerHTML = result.innerHTML;
        result.innerHTML = "";
    }
        
    deleteLastChar();
});

// Functions

function handleFilledDisplay() {
    if (result.innerHTML.length !== 0) {
        result.innerHTML = "";
    }
}

function checkIfExpressionHasOperator(expressionContent) {
    for (const currentBtn of operatorBtns) {
        const expressionLastChar = expressionContent.charAt(expressionContent.length - 1);

        if (expressionLastChar === currentBtn.innerHTML) {
            return true;
        }
    }

    return false;
}

function deleteLastChar() {
    const oldContent = expression.innerHTML;
    let newContent = "";
    
    for (let i = 0; i < oldContent.length - 1; i++) {
        newContent += oldContent.charAt(i);
    }

    expression.innerHTML = newContent;
}

function getOperatorsIndexes(expressionContent, firstOperator, secondOperator) {
    const list = [];

    for (let i = 0; i < expressionContent.length; i++) {
        const thisChar = expressionContent[i];

        if (thisChar === firstOperator || thisChar === secondOperator) {
            list.push(i);
        }
    }

    return list;
}

function solveExpression(expressionContent, operatorsIndexes) {
    let total = 0;

    for (let i = 0; i < operatorsIndexes.length; i++) {
        const currentIndex = operatorsIndexes[i];

        const operator = expressionContent[currentIndex];

        const firstOperandoEnd = currentIndex;
        const firstOperandoStart = getFirstOperandoStart(expressionContent, firstOperandoEnd);
        const firstOperando = parseFloat(expressionContent.substring(firstOperandoStart, firstOperandoEnd));

        const secondOperandoStart = currentIndex + 1;
        const secondOperandoEnd = getSecondOperandoEnd(expressionContent, secondOperandoStart);
        const secondOperando = parseFloat(expressionContent.substring(secondOperandoStart, secondOperandoEnd));

        total = calculate(operator, firstOperando, secondOperando);

        const calculation = expressionContent.substring(firstOperandoStart, secondOperandoEnd);
        const calcResult = total.toString();

        expressionContent = expressionContent.replace(calculation, calcResult);

        if (i !== operatorsIndexes.length - 1) {
            for (let j = 0; j < operatorsIndexes.length; j++) {
                operatorsIndexes[j] -= calculation.length - calcResult.length;
            }
        }
    }

    return expressionContent;
}

function getFirstOperandoStart(expressionContent, firstOperandoEnd) {
    let position = 0;

    for (let i = firstOperandoEnd - 1; i >= 0; i--) {
        const currentChar = expressionContent[i];

        if (['/', '*', '-', '+'].includes(currentChar)) {
            position = i + 1;
            break;
        }
    }

    return position;
}

function getSecondOperandoEnd(expressionContent, secondOperandoStart) {
    let position = expressionContent.length;

    for (let i = secondOperandoStart; i < expressionContent.length; i++) {
        const currentChar = expressionContent[i];

        if (['/', '*', '-', '+'].includes(currentChar)) {
            position = i;
            break;
        }
    }

    return position;
}

function calculate(operator, firstOperando, secondOperando) {
    if (operator === "/") {
        return firstOperando / secondOperando;
    }

    if (operator === "*") {
        return firstOperando * secondOperando;
    }

    if (operator === "-") {
        return firstOperando - secondOperando;
    }

    return firstOperando + secondOperando;
}

function checkIfFloatHasInt(expressionContent) {
    for (const currentBtn of operandoBtns) {
        const expressionLastChar = expressionContent.charAt(expressionContent.length - 1);

        if (expressionLastChar === currentBtn.innerHTML) {
            return true;
        }
    }

    return false;
}

function countPoints(expressionContent) {
    let totalPoints = 0;

    for (const currentChar of expressionContent) {
        if (currentChar === '.') {
            totalPoints++;
        }
    }

    return totalPoints;
}

function countOperators(expressionContent) {
    let totalOperators = 0;

    for (const currentChar of expressionContent) {
        if (['/', '*', '-', '+'].includes(currentChar)) {
            totalOperators++;
        }
    }

    return totalOperators;
}

function countDistinctNumbers(expressionContent) {
    let numberIdentified = false;
    let totalNumbers = 0;

    for (let i = 0; i < expressionContent.length ; i++) {
        const currentChar = expressionContent[i];

        if (!isNaN(currentChar) && i === expressionContent.length - 1) {
            totalNumbers++;
        } else if (!isNaN(currentChar)) {
            numberIdentified = true;
        } else if (numberIdentified && currentChar !== '.') {
            numberIdentified = false;
            totalNumbers++;
        }
    }

    return totalNumbers;
}

function stopDivisionByZero(expressionContent) {
    for (let i = 2; i <= expressionContent.length; i++) {
        const expressionPart = expressionContent.substring(i - 2, i);
        const posPart = expressionContent.charAt(i);

        if (expressionPart === "/0" && posPart !== '.') {
            return true;
        }
    }

    return false;
}

function checkIfNumberHasPoint(expressionContent) {
    for (let i = expressionContent.length - 1; i >= 0; i--) {
        const currentChar = expressionContent[i];

        if (['/', '*', '-', '+'].includes(currentChar)) {
            break;
        }

        if (currentChar === '.') {
            return true;
        }
    }

    return false;
}
