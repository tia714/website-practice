const balance = document.getElementById("balance");
const moneyplus = document.getElementById("moneyplus");
const moneymins = document.getElementById("moneymins");
const list = document.getElementById("list");
const form = document.getElementById("form");
const text = document.getElementById("text");
const amount = document.getElementById("amount");
const type = document.getElementById("type");

let transactions = [];

// Load data saat halaman dibuka
document.addEventListener("DOMContentLoaded", () => {
    const stored = JSON.parse(localStorage.getItem("transactions"));
    if (stored) {
        transactions = stored; 
        init();
    }
});

// Simpan ke localStorage
function saveall() {
    localStorage.setItem("transactions", JSON.stringify(transactions));
}

// Tambah transaksi
form.addEventListener("submit", function (e) {
    e.preventDefault();

    const transaction = {
        id: generateid(),
        text: text.value,
        amount: type.value === "expense" ? -Math.abs(Number(amount.value)) : Math.abs(Number(amount.value)),
        type: type.value
    };

    transactions.push(transaction);
    saveall();
    init();

    text.value = "";
    amount.value = "";
});

// Tambahkan ke DOM
function addtransactionDOM(transaction) {
    const item = document.createElement("li");

    item.classList.add(transaction.amount < 0 ? "minus" : "plus");

    item.innerHTML = `
        <div class="transac">
            <small class="type">${transaction.type}</small>
            <div class="oneline">
                <div class="text">${transaction.text}</div>
                <div class="amount">${formatrp(Math.abs(transaction.amount))}</div>
                <button class="delete" onclick="removetransaction(${transaction.id})">
                    <i class="fa-solid fa-x"></i>
                </button>
            </div>
        </div>
    `;

    list.appendChild(item);
}

// Generate ID
function generateid() {
    return Math.floor(Math.random() * 1000000);
}

function formatrp(number) {
    return "Rp " + new Intl.NumberFormat("id-ID").format(number);
}


// Hapus transaksi
function removetransaction(id) {
    if (confirm("Delete this transaction?")) {
        transactions = transactions.filter(t => t.id !== id);
        saveall();
        init();
    }
}

// Render ulang semua transaksi
function init() {
    list.innerHTML = "";

    if (transactions.length === 0) {
        const item = document.createElement("li");
        item.innerText = "No Transaction";
        list.appendChild(item);
    } else {
        transactions.forEach(addtransactionDOM);
    }

    updatetransaction();
}

// Update balance, income, expense
function updatetransaction() {
    const amounts = transactions.map(t => t.amount);

    const income = amounts.filter(v => v > 0).reduce((acc, v) => acc + v, 0);
    const expense = Math.abs(amounts.filter(v => v < 0).reduce((acc, v) => acc + v, 0));
    const total = income - expense;

    balance.innerText = `${formatrp(total)}`;
    moneyplus.innerText = `${formatrp(income)}`;
    moneymins.innerText = `${formatrp(expense)}`;
}



init();
