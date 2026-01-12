const display = document.getElementById("display");
const numbers = document.querySelectorAll(".number");
const operators = document.querySelectorAll(".operator");

numbers.forEach(btn => {
    btn.addEventListener("click", () => {
        if (display.value === "0" || display.value === "NaN") {
            display.value = "";
        }
        display.value += btn.innerText;
    });
});

operators.forEach(btn => {
    btn.addEventListener("click", () => {
        let value = btn.innerText;
        let current = display.value;
        let lastChar = current.slice(-1);

        if (value === "AC") {
            display.value = "0";
            return;
        }

        if (value === "DEL") {
            display.value = current.slice(0, -1) || "0";
            return;
        }

        if (value === "=") {
            if (!isNaN(lastChar)) {
                try {
                    display.value = eval(current);
                } catch {
                    display.value = "NaN";
                }
            }
            return;
        }

        if (value === "x") {
            value = "*";
        }

        if (isNaN(lastChar) && value !== ".") return;

        display.value += value;
    });
});