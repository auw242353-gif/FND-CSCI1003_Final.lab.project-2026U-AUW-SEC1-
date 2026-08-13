// ==========================================
// STUDENT BUDGET TRACKER
// ==========================================

// Get saved transactions from browser
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];


// ==========================================
// TRANSACTION PAGE ELEMENTS
// ==========================================

const transactionForm = document.getElementById("transaction-form");
const incomeBtn = document.getElementById("income-btn");
const expenseBtn = document.getElementById("expense-btn");

let transactionType = "income";


// ==========================================
// SELECT INCOME
// ==========================================

if (incomeBtn) {
  incomeBtn.addEventListener("click", function () {

    transactionType = "income";

    incomeBtn.classList.add("active-type");
    expenseBtn.classList.remove("active-type");

  });
}


// ==========================================
// SELECT EXPENSE
// ==========================================

if (expenseBtn) {
  expenseBtn.addEventListener("click", function () {

    transactionType = "expense";

    expenseBtn.classList.add("active-type");
    incomeBtn.classList.remove("active-type");

  });
}


// ==========================================
// ADD TRANSACTION
// ==========================================

if (transactionForm) {

  transactionForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const amount = Number(document.getElementById("amount").value);
    const category = document.getElementById("category").value;
    const date = document.getElementById("date").value;
    const description =
      document.getElementById("description").value;

    // Check amount
    if (amount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    // Create transaction object
    const transaction = {
      id: Date.now(),
      type: transactionType,
      amount: amount,
      category: category,
      date: date,
      description: description || "No description"
    };

    // Add transaction to array
    transactions.push(transaction);

    // Save transaction
    localStorage.setItem(
      "transactions",
      JSON.stringify(transactions)
    );

    // Reset form
    transactionForm.reset();

    // Set income as default
    transactionType = "income";

    incomeBtn.classList.add("active-type");
    expenseBtn.classList.remove("active-type");

    // Update transaction list
    displayTransactions();

    // Show message
    alert("Transaction added successfully! 🎉");

  });

}


// ==========================================
// DISPLAY TRANSACTIONS
// ==========================================

function displayTransactions() {

  const transactionList =
    document.getElementById("transaction-list");

  if (!transactionList) {
    return;
  }

  transactionList.innerHTML = "";

  if (transactions.length === 0) {

    transactionList.innerHTML = `
      <tr>
        <td colspan="6" class="no-transactions">
          📝 No transactions added yet.
        </td>
      </tr>
    `;

    return;
  }


  transactions.forEach(function (transaction) {

    const row = document.createElement("tr");

    const amountColor =
      transaction.type === "income"
        ? "#21854e"
        : "#c43f3f";

    const amountSign =
      transaction.type === "income"
        ? "+"
        : "-";

    const typeText =
      transaction.type === "income"
        ? "💰 Income"
        : "💸 Expense";


    row.innerHTML = `

      <td>${typeText}</td>

      <td>${transaction.category}</td>

      <td>${transaction.description}</td>

      <td>${transaction.date}</td>

      <td style="color: ${amountColor}; font-weight: bold;">
        ${amountSign} ৳${transaction.amount}
      </td>

      <td>
        <button
          onclick="deleteTransaction(${transaction.id})"
          class="delete-btn">
          Delete
        </button>
      </td>

    `;

    transactionList.appendChild(row);

  });

}


// ==========================================
// DELETE TRANSACTION
// ==========================================

function deleteTransaction(id) {

  const confirmDelete =
    confirm("Are you sure you want to delete this transaction?");

  if (!confirmDelete) {
    return;
  }

  transactions = transactions.filter(function (transaction) {

    return transaction.id !== id;

  });

  localStorage.setItem(
    "transactions",
    JSON.stringify(transactions)
  );

  displayTransactions();

}


// ==========================================
// CALCULATE TOTALS
// ==========================================

function calculateTotals() {

  let totalIncome = 0;
  let totalExpense = 0;


  transactions.forEach(function (transaction) {

    if (transaction.type === "income") {

      totalIncome += transaction.amount;

    } else {

      totalExpense += transaction.amount;

    }

  });


  const balance =
    totalIncome - totalExpense;


  return {
    income: totalIncome,
    expense: totalExpense,
    balance: balance
  };

}


// ==========================================
// UPDATE HOME PAGE
// ==========================================

function updateHomePage() {

  const incomeElement =
    document.getElementById("total-income");

  const expenseElement =
    document.getElementById("total-expense");

  const balanceElement =
    document.getElementById("balance");


  if (!incomeElement ||
      !expenseElement ||
      !balanceElement) {

    return;
  }


  const totals = calculateTotals();


  incomeElement.textContent =
    "৳" + totals.income.toLocaleString();

  expenseElement.textContent =
    "৳" + totals.expense.toLocaleString();

  balanceElement.textContent =
    "৳" + totals.balance.toLocaleString();

}


// ==========================================
// RUN FUNCTIONS WHEN PAGE LOADS
// ==========================================

displayTransactions();

updateHomePage();
// ==========================================
// BUDGET & SAVINGS
// ==========================================

let monthlyBudget =
  Number(localStorage.getItem("monthlyBudget")) || 0;

let savingsGoal =
  JSON.parse(localStorage.getItem("savingsGoal")) || null;


// ------------------------------------------
// UPDATE BUDGET PAGE
// ------------------------------------------

function updateBudgetPage() {

  const budgetElement =
    document.getElementById("monthly-budget");

  const spentElement =
    document.getElementById("total-spent");

  const remainingElement =
    document.getElementById("budget-remaining");

  const percentageElement =
    document.getElementById("budget-percentage");

  const progressFill =
    document.getElementById("progress-fill");

  const progressSpent =
    document.getElementById("progress-spent");

  const progressBudget =
    document.getElementById("progress-budget");


  if (!budgetElement) {
    return;
  }


  const totals = calculateTotals();

  const spent = totals.expense;

  const remaining =
    monthlyBudget - spent;


  budgetElement.textContent =
    "৳" + monthlyBudget.toLocaleString();

  spentElement.textContent =
    "৳" + spent.toLocaleString();

  remainingElement.textContent =
    "৳" + remaining.toLocaleString();

  progressSpent.textContent =
    "৳" + spent.toLocaleString();

  progressBudget.textContent =
    "৳" + monthlyBudget.toLocaleString();


  let percentage = 0;

  if (monthlyBudget > 0) {

    percentage =
      Math.round((spent / monthlyBudget) * 100);

  }


  percentageElement.textContent =
    percentage + "%";


  progressFill.style.width =
    Math.min(percentage, 100) + "%";


  // Change color if budget is exceeded
  if (percentage > 100) {

    progressFill.style.background =
      "#e15b5b";

  } else if (percentage >= 80) {

    progressFill.style.background =
      "#f0a23b";

  } else {

    progressFill.style.background =
      "linear-gradient(90deg, #1769aa, #7654d6)";

  }

}


// ------------------------------------------
// SAVE MONTHLY BUDGET
// ------------------------------------------

const budgetForm =
  document.getElementById("budget-form");


if (budgetForm) {

  budgetForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const amount =
      Number(document.getElementById("budget-amount").value);


    if (amount <= 0) {

      alert("Please enter a valid budget amount.");

      return;

    }


    monthlyBudget = amount;

    localStorage.setItem(
      "monthlyBudget",
      monthlyBudget
    );


    budgetForm.reset();

    updateBudgetPage();

    alert("Monthly budget saved successfully! 🎉");

  });

}


// ------------------------------------------
// SAVINGS GOAL
// ------------------------------------------

const savingsForm =
  document.getElementById("savings-form");


if (savingsForm) {

  savingsForm.addEventListener("submit", function(event) {

    event.preventDefault();


    const goalName =
      document.getElementById("goal-name").value;

    const goalAmount =
      Number(document.getElementById("goal-amount").value);

    const savedAmount =
      Number(document.getElementById("saved-amount").value);


    if (goalAmount <= 0 || savedAmount < 0) {

      alert("Please enter valid amounts.");

      return;

    }


    if (savedAmount > goalAmount) {

      alert("Saved amount cannot be greater than the goal.");

      return;

    }


    savingsGoal = {

      name: goalName,
      target: goalAmount,
      saved: savedAmount

    };


    localStorage.setItem(
      "savingsGoal",
      JSON.stringify(savingsGoal)
    );


    displaySavingsGoal();

    savingsForm.reset();

    alert("Savings goal saved! 🎯");

  });

}


// ------------------------------------------
// DISPLAY SAVINGS GOAL
// ------------------------------------------

function displaySavingsGoal() {

  const result =
    document.getElementById("goal-result");


  if (!result || !savingsGoal) {
    return;
  }


  const percentage =
    Math.round(
      (savingsGoal.saved / savingsGoal.target) * 100
    );


  result.innerHTML = `

    <h3>
      ${savingsGoal.name}
    </h3>

    <p>
      Saved ৳${savingsGoal.saved.toLocaleString()}
      of
      ৳${savingsGoal.target.toLocaleString()}
    </p>

    <div class="progress-bar">

      <div
        class="progress-fill"
        style="width: ${percentage}%">
      </div>

    </div>

    <p>
      ${percentage}% completed 🎉
    </p>

  `;

}


// ------------------------------------------
// RUN BUDGET FUNCTIONS
// ------------------------------------------

updateBudgetPage();

displaySavingsGoal();