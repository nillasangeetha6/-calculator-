

"use strict";

const display = document.getElementById("display");
const buttons = document.querySelectorAll(".buttons button");

let expression = "";
let resultShown = false;

function updateDisplay() {
    display.value = expression || "0";
}

function appendValue(value) {

    if (expression === "Error") {
        expression = "";
    }

    if (resultShown) {
        if ("0123456789.".includes(value)) {
            expression = "";
        }
        resultShown = false;
    }

    if (expression.length >= 30) return;

    expression += value;
    updateDisplay();
}

function clearDisplay() {
    expression = "";
    resultShown = false;
    updateDisplay();
}

function deleteLast() {
    if (expression === "Error") {
        clearDisplay();
        return;
    }

    expression = expression.slice(0, -1);
    resultShown = false;
    updateDisplay();
}

function calculate() {
    try {
        if (!expression) return;

        if (!/^[0-9+\-*\/%.() ]+$/.test(expression)) {
            throw new Error("Invalid input");
        }

        const result = Function(
            '"use strict"; return (' + expression + ')'
        )();

        if (typeof result !== "number" || !Number.isFinite(result)) {
            throw new Error("Invalid calculation");
        }

        expression = String(Number(result.toPrecision(12)));
        resultShown = true;
        updateDisplay();

    } catch (error) {
        expression = "Error";
        resultShown = false;
        updateDisplay();
    }
}

// Mouse button functionality
buttons.forEach(button => {

    button.addEventListener("click", function () {

        const value = button.dataset.value;
        const action = button.dataset.action;

        if (action === "clear") {
            clearDisplay();
        }
        else if (action === "delete") {
            deleteLast();
        }
        else if (action === "calculate") {
            calculate();
        }
        else if (value !== undefined) {
            appendValue(value);
        }

    });

});

// Keyboard functionality
document.addEventListener("keydown", function (event) {

    if (/^[0-9+\-*\/%.()]$/.test(event.key)) {
        appendValue(event.key);
    }
    else if (event.key === "Enter") {
        event.preventDefault();
        calculate();
    }
    else if (event.key === "Backspace") {
        deleteLast();
    }
    else if (event.key === "Escape") {
        clearDisplay();
    }

});

updateDisplay();
