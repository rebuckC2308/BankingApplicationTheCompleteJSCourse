'use strict';

// BANKIST APP

// Data for application:
const account1 = {
  owner: 'Sherlock Holmes',
  transactions: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2021-11-18T21:31:17.178Z',
    '2021-12-23T07:42:02.383Z',
    '2021-01-28T09:15:04.904Z',
    '2021-04-01T10:17:24.185Z',
    '2021-05-08T14:11:59.604Z',
    '2021-05-27T17:01:17.194Z',
    '2021-07-11T23:36:17.929Z',
    '2021-07-12T10:51:36.790Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account2 = {
  owner: 'Benjamin Gates',
  transactions: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2021-11-01T13:15:33.035Z',
    '2021-12-25T06:04:23.907Z',
    '2021-11-30T09:48:16.867Z',
    '2021-01-25T14:18:46.235Z',
    '2021-02-05T16:33:06.386Z',
    '2021-04-10T14:43:26.374Z',
    '2021-06-25T18:49:59.371Z',
    '2021-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Robert Langdon',
  transactions: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,

  movementsDates: [
    '2021-11-01T13:15:33.035Z',
    '2021-11-30T09:48:16.867Z',
    '2021-12-25T06:04:23.907Z',
    '2021-01-25T14:18:46.235Z',
    '2021-02-05T16:33:06.386Z',
    '2021-04-10T14:43:26.374Z',
    '2021-06-25T18:49:59.371Z',
    '2021-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account4 = {
  owner: 'Harley Quinn',
  transactions: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,

  movementsDates: [
    '2021-11-18T21:31:17.178Z',
    '2021-12-23T07:42:02.383Z',
    '2021-01-28T09:15:04.904Z',
    '2021-04-01T10:17:24.185Z',
    '2021-05-08T14:11:59.604Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const accounts = [account1, account2, account3, account4];

//Elements:

//CONTAINERS:
const containerApp = document.querySelector('.app');
const containerTransactions = document.querySelector('.transactions');

//Labels:
const labelWelcome = document.querySelector('.welcomeMessage');
const labelDate = document.querySelector('.current__date');
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

//sorting transactions:
//add a sort parameter inside our displayTransactions function w/ default value = false
//displaying account transactions:
const displayTransactions = (acc, sort = false) => {
  containerTransactions.innerHTML = '';

  const sortTransactions = sort
    ? acc.transactions.slice().sort((a, b) => a - b)
    : acc.transactions;
  //empty the <div> that contains all the transactions so we don't have to change any hard coded HTML
  sortTransactions.forEach((mov, i) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[i]);
    const year = `${date.getFullYear()}`.padStart(2, '0');
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`;

    const displayDate = `${month}/${day}/${year}`;

    const html = `<div class="transactions__row">
        <div class="transactions__type transactions__type--${type}">
        ${i + 1} - ${type}
        </div>
        <div class="transactions__date">${displayDate}</div>
        <div class="transactions__value">${mov < 0 ? '-' : ''} $${Math.abs(
      mov
    ).toFixed(2)}</div>
            </div>`;
    containerTransactions.insertAdjacentHTML('afterbegin', html);
  });
};

//DRY CODE For finding deposits using filter function:
const deposits = transaction => transaction > 0;

//Caluclate the Account Summary:
const calculateAccoutSummary = function (account) {
  //Calculate total number of deposits
  const income = account.transactions
    .filter(deposits)
    .reduce((acc, transaction) => acc + transaction, 0);
  labelSumIn.textContent = `$${income.toFixed(2)}`;
  //Calculate total number of withdrawal
  const debits = account.transactions
    .filter(transaction => transaction < 0)
    .reduce((acc, transaction) => acc + transaction, 0);
  labelSumOut.textContent = `- $${Math.abs(debits).toFixed(2)}`;

  //calculate total interest accumulated
  const interest = account.transactions
    .filter(deposits)
    .map(deposit => (deposit * account.interestRate) / 100)
    .filter(int => int >= 1)
    .reduce((acc, int) => acc + int, 0);
  labelSumInt.textContent = `$${interest.toFixed(2)}`;
};

//Calculate the TOTAL BALANCE OF ACCOUNT
const calculateAndDisplayBalance = function (account) {
  account.balance = account.transactions.reduce(
    (acc, transaction) => acc + transaction,
    0
  );

  labelBalance.textContent = `$${account.balance.toFixed(2)}`;
};

//Update the UI:
const updateUI = function (account) {
  displayTransactions(account);
  calculateAccoutSummary(account);
  calculateAndDisplayBalance(account);
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

  const date = new Date();
  const year = `${date.getFullYear()}`.padStart(2, '0');
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`;
  const hour = `${date.getHours()}`;
  const min = `${date.getMinutes()}`;

  const displayDate = `${month}/${day}/${year} -- ${hour}:${min}`;

  labelDate.textContent = `${displayDate}`;

  if (currentAccount?.pin === +inputLoginPIN.value) {
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

//LOAN REQUEST:
//Loan Feature RULE: the bank only grants loans if there is at least 1 deposit with at least 10% of the requested loan amount:

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const loanAmount = Math.floor(inputLoanAmount.value);

  if (
    currentAccount.transactions.some(
      transaction => transaction >= loanAmount * 0.1
    ) &&
    loanAmount > 0
  ) {
    currentAccount.transactions.push(loanAmount);
    currentAccount.movementsDates.push(new Date().toISOString());
    updateUI(currentAccount);
  }

  inputLoanAmount.value = '';
  inputLoanAmount.blur();
});

//IMPLEMENTING TRANSFERS BETWEEN ACCOUNTS:
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = +inputTransferAmount.value;
  const accountRec = accounts.find(
    account => account.username === inputTransferTo.value
  );

  inputTransferAmount.value = inputTransferTo.value = '';
  inputTransferAmount.blur();
  inputTransferTo.blur();

  //must validate the amount and receiving account: 4 conditions
  if (
    amount > 0 &&
    currentAccount.balance >= amount &&
    accountRec?.username != currentAccount.username &&
    accountRec
  ) {
    //transfer funds
    currentAccount.transactions.push(-amount);
    currentAccount.movementsDates.push(new Date().toISOString());
    accountRec.transactions.push(amount);
    accountRec.movementsDates.push(new Date().toISOString());
    //update the UI
    updateUI(currentAccount);
  }
});

//CLOSE THE ACCOUNT:
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePIN.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );

    accounts.splice(index, 1);

    containerApp.style.opacity = 0;
  }

  inputClosePIN.value = inputCloseUsername.value = '';
  inputClosePIN.blur();
  inputCloseUsername.blur();
});

//CLICKING THE SORT BUTTON:

let sortedState = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayTransactions(currentAccount, !sortedState);
  sortedState = !sortedState;

  btnSort.blur();
});
