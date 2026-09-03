const a = document.getElementById("totalIncome");
const b = document.getElementById("totalExpenses");
const c = document.getElementById("totalBalance");
const d = document.getElementById("form");
const e = document.getElementById("name");
const f = document.getElementById("amount");
const g = document.getElementById("transactionTpye");
const h = document.getElementById("transactionCategory");
const i = document.getElementById("list");
const j = document.getElementById("message");

let transactions = [];

let savedTransactions =
    localStorage.getItem("transactions");

if (savedTransactions) {
    transactions = JSON.parse(savedTransactions);
}

// FormData.addEventListener("")
d.addEventListener("submit", addTransaction);

function addTransaction(event) {

    event.preventDefault();

    const name = e.value.trim();
    const amount = Number(f.value);
    const category = h.value;
    const type = g.value;

    if (name === " " || amount <= 0) {
        // j.textContent = "Please enter valid name and amount";
        alert("Enter a valid name and amount");
        return;
    };

    const transaction = {
        id: Date.now(),
        name: name,
        amount: amount,
        category: category,
        typr: type
    };

    transactions.push(transaction);

    saveTransactions();

    renderTransactions();

    d.reset();

    j.textContent = "Transaction";

};

function renderTransactions(transactionArray = transactions) {
    i.innerHTML = "";

    transactionArray.forEach(function (transaction) {
        const sign = transaction.type === "income" ? "+" : "-";

        const amountClass = transaction.type === "income" ? "income-amount" : "expense-amount";

        i.innerHTML += `
        <div class="transaction">
            <div class="transaction-info">
            <h3>${transaction.name}</h3>
            <p>${transaction.category}</p>
            </div>
            <div class="transaction-amount">
            <span class="${amountClass}">
             ${sign} ${transaction.amount}
             </span>
             </div>
        </div>
        `;
    }
    )
    calculateTotals();
};

function calculateTotals() {
    const income = transactions.filter(function (transaction) {
        return transaction.type === "income";
    })
        .reduce(function (total, transaction) {
            return total + transaction.amount;
        }, 0);
    const expenses = transactions.filter(function (transaction) {
        return transaction.type === "expense";
    })
        .reduce(function (total, transaction) {
            return total + transaction.amount;
        }, 0);

    const currentBalance = income - expenses;

    a.textContent = income;
    b.textContent = expense;
    c.textContent = currentBalance;
}

function saveTransactions() {
    localStorage.setItem("transactions", JSON.stringify(transactions));
}

renderTransactions();