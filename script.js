'use strict';

// BANKIST APP

// Data for application:
const account1 = {
  owner: 'Sherlock Holmes',
  transactions: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Benjamin Gates',
  transactions: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Robert Langdon',
  transactions: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Harley Quinn',
  transactions: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

//Elements:

//CONTAINERS:
const containerApp = document.querySelector('.app');
const containerTransactions = document.querySelector('.transactions');

//Labels:
const labelWelcome = document.querySelector('.welcomeMessage');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.current__balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInt = document.querySelector('.summary__value--interest');

//BUTTONS:
const btnLogin = document.querySelector('.login__btn');
const btnLoan = document.querySelector('.form__btn--loan');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

//INPUTS
const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPIN = document.querySelector('.login__input--pin');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputTransferTo = document.querySelector('.form__input--transfer-to');
const inputTransferAmount = document.querySelector(
  '.form__input--transfer-amount'
);
const inputCloseUsername = document.querySelector('.form__input--close-user');
const inputClosePIN = document.querySelector('.form__input--close-pin');

//displaying account transactions:
const displayTransactions = account => {
  containerTransactions.innerHTML = '';
  //empty the <div> that contains all the transactions so we don't have to change any hard coded HTML
  account.transactions.forEach((mov, i) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `<div class="transactions__row">
        <div class="transactions__type transactions__type--${type}">
        ${i + 1} - ${type}
        </div>
        <div class="transactions__date">1 day ago</div>
        <div class="transactions__value">${mov < 0 ? '-' : ''} $${Math.abs(
      mov
    )}</div>
            </div>`;
    containerTransactions.insertAdjacentHTML('afterbegin', html);
  });
};

//Caluclate the Account Summary:
const calculateAccoutSummary = function (account) {
  //Calculate total number of deposits
  const income = account.transactions
    .filter(transaction => transaction > 0)
    .reduce((acc, transaction) => acc + transaction, 0);
  labelSumIn.textContent = `$${(Math.round(income * 100) / 100).toFixed(2)}`;
  //Calculate total number of withdrawal
  const debits = account.transactions
    .filter(transaction => transaction < 0)
    .reduce((acc, transaction) => acc + transaction, 0);
  labelSumOut.textContent = `- $${(
    Math.round(Math.abs(debits) * 100) / 100
  ).toFixed(2)}`;

  //calculate total interest accumulated
  const interest = account.transactions
    .filter(transaction => transaction > 0)
    .map(deposit => (deposit * account.interestRate) / 100)
    .filter(int => int >= 1)
    .reduce((acc, int) => acc + int, 0);
  labelSumInt.textContent = `$${(Math.round(interest * 100) / 100).toFixed(2)}`;
};

//Calculate the TOTAL BALANCE OF ACCOUNT
const calculateTotalBalance = function (account) {
  const balance = account.transactions.reduce(
    (acc, transaction) => acc + transaction,
    0
  );

  labelBalance.textContent = `$${(Math.round(balance * 100) / 100).toFixed(2)}`;
};

//Update the UI:
const updateUI = function (currentUser) {
  displayTransactions(currentUser);
  calculateAccoutSummary(currentUser);
  calculateTotalBalance(currentUser);
};

//creating usernames for each account based on the name of the owner of the account:
const createUsername = accounts => {
  accounts.forEach(
    acc =>
      (acc.username = acc.owner
        .toLowerCase()
        .split(' ')
        .map(name => name[0])
        .join(''))
  );
};
//we are not returning anything from this function - we are producing a side effect - adding a username and property to each account object
createUsername(accounts);

//IMPLEMENTING LOGIN USING FIND METHOD:
let currentAccount;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  //want to prevent the page from re-rendering

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  if (currentAccount?.pin === Number(inputLoginPIN.value)) {
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }.`;

    containerApp.style.opacity = 100;

    updateUI(currentAccount);

    inputLoginUsername.value = inputLoginPIN.value = '';
    inputLoginUsername.blur();
    inputLoginPIN.blur();
    btnLogin.blur();
  }
});
