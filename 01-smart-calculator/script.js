console.log("Smart Calculator started!");

const display = document.getElementById("display");
const buttons = document.querySelectorAll("button");

let expression = "";
let justCalculated = false;


// ================================
// BUTTON CLICK
// ================================

buttons.forEach(function (button) {

    button.addEventListener("click", function () {

        const value = button.textContent;

        // Clear
        if (value === "C") {
            clearCalculator();
        }

        // Delete
        else if (value === "DEL") {
            deleteLastCharacter();
        }

        // Equals
        else if (value === "=") {
            calculateResult();
        }

        // Percentage
        else if (value === "%") {
            calculatePercentage();
        }

        // Decimal
        else if (value === ".") {
            addDecimal();
        }

        // Operators
        else if (
            value === "+" ||
            value === "-" ||
            value === "*" ||
            value === "/"
        ) {
            addOperator(value);
        }

        // Numbers
        else {
            addNumber(value);
        }
    });

});


// ================================
// ADD NUMBER
// ================================

function addNumber(number) {

    // After result, typing a number starts a new calculation
    if (justCalculated) {
        expression = "";
        justCalculated = false;
    }

    expression += number;

    display.value = expression;
}


// ================================
// ADD OPERATOR
// ================================

function addOperator(operator) {

    // Don't allow operator as first character
    if (expression === "") {
        return;
    }

    // Don't allow two operators together
    const lastCharacter = expression[expression.length - 1];

    if (
        lastCharacter === "+" ||
        lastCharacter === "-" ||
        lastCharacter === "*" ||
        lastCharacter === "/"
    ) {
        return;
    }

    expression += operator;

    justCalculated = false;

    display.value = expression;
}


// ================================
// DECIMAL
// ================================

function addDecimal() {

    if (justCalculated) {
        expression = "";
        justCalculated = false;
    }

    // Get current number after the last operator
    const parts = expression.split(/[+\-*/]/);
    const currentNumber = parts[parts.length - 1];

    // Don't allow two decimals in one number
    if (currentNumber.includes(".")) {
        return;
    }

    // If decimal is first thing, add 0.
    if (expression === "" || /[+\-*/]$/.test(expression)) {
        expression += "0.";
    }

    else {
        expression += ".";
    }

    display.value = expression;
}


// ================================
// CALCULATE RESULT
// ================================

function calculateResult() {

    if (expression === "") {
        return;
    }

    // Don't calculate if expression ends with operator
    if (/[+\-*/]$/.test(expression)) {
        return;
    }

    try {

        const result = evaluateExpression(expression);

        if (!Number.isFinite(result)) {
            display.value = "Error";
            expression = "";
            justCalculated = true;
            return;
        }

        // Remove unnecessary decimal zeros
        expression = String(result);

        display.value = expression;

        justCalculated = true;

    }

    catch (error) {

        display.value = "Error";

        expression = "";

        justCalculated = true;
    }
}


// ================================
// EVALUATE EXPRESSION
// ================================

function evaluateExpression(input) {

    /*
        Example:

        10+5*2

        JavaScript calculates:
        10 + (5 * 2)

        Result = 20
    */

    return Function(
        '"use strict"; return (' + input + ')'
    )();
}


// ================================
// PERCENTAGE
// ================================

function calculatePercentage() {

    if (expression === "") {
        return;
    }

    /*
        Example:

        50%

        becomes

        0.5
    */

    const match = expression.match(/(\d+\.?\d*)$/);

    if (!match) {
        return;
    }

    const number = Number(match[1]);

    const percentage = number / 100;

    expression =
        expression.slice(0, -match[1].length) +
        percentage;

    display.value = expression;
}


// ================================
// DELETE
// ================================

function deleteLastCharacter() {

    if (justCalculated) {
        clearCalculator();
        return;
    }

    expression = expression.slice(0, -1);

    display.value = expression;
}


// ================================
// CLEAR
// ================================

function clearCalculator() {

    expression = "";

    justCalculated = false;

    display.value = "";
}